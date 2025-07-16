import { Job, Queue } from 'bullmq';
import { DiffJobDataSchema, createStorageService } from '@docshot/shared';
import { compareImageUrls } from '../lib/pixelmatch';
import { createSupabaseClient } from '@docshot/database';
import Redis from 'ioredis';

// Retry utility with exponential backoff
const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number,
  baseDelay: number
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');

      if (attempt === maxRetries) {
        throw lastError;
      }

      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(`Diff attempt ${attempt} failed, retrying in ${delay}ms:`, lastError.message);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
};

// Create Supabase client lazily to ensure environment variables are loaded
const getSupabaseClient = () => {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_KEY || ''
  );
};

// Create storage service lazily to ensure environment variables are loaded
const getStorageService = () => {
  return createStorageService();
};
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const notificationQueue = new Queue('notification', { connection: redis });

export const diffProcessor = async (job: Job) => {
  const data = DiffJobDataSchema.parse(job.data);

  try {
    job.updateProgress(10);
    console.log(`Processing diff job for screenshot ${data.screenshotId}`);

    // Compare images with retry logic
    job.updateProgress(30);
    const diffResult = await retryWithBackoff(
      () =>
        compareImageUrls(
          data.currentImageUrl,
          data.previousImageUrl,
          { threshold: 0.1 }, // Default threshold
          1.0 // Significance threshold (1% change)
        ),
      3,
      1000
    );

    job.updateProgress(60);
    console.log(
      `Diff completed: ${diffResult.percentageDiff.toFixed(2)}% changed (${diffResult.pixelDiff} pixels)`
    );

    let diffImageUrl: string | null = null;

    // Upload diff image if changes detected
    if (diffResult.significant && diffResult.diffImageBuffer) {
      const supabase = getSupabaseClient();
      const { data: screenshot } = await supabase
        .from('screenshots')
        .select('project_id')
        .eq('id', data.screenshotId)
        .single();

      if (screenshot) {
        const storage = getStorageService();
        const uploadResult = await storage.uploadDiffImage(
          screenshot.project_id,
          data.screenshotId,
          diffResult.diffImageBuffer,
          {
            pixelDiff: diffResult.pixelDiff.toString(),
            percentageDiff: diffResult.percentageDiff.toString(),
            totalPixels: diffResult.totalPixels.toString(),
            significant: diffResult.significant.toString(),
          }
        );

        diffImageUrl = uploadResult.publicUrl;
        console.log(`Diff image uploaded to ${uploadResult.key}`);
      }
    }

    job.updateProgress(80);

    // Create notification if significant change detected
    if (diffResult.significant) {
      const supabase = getSupabaseClient();
      const screenshotData = await supabase
        .from('screenshots')
        .select('project_id')
        .eq('id', data.screenshotId)
        .single();

      await notificationQueue.add('diff_detected', {
        type: 'diff_detected',
        screenshotId: data.screenshotId,
        projectId: screenshotData.data?.project_id || '',
        message: `Visual difference detected: ${diffResult.percentageDiff.toFixed(2)}% of pixels changed`,
      });

      console.log(
        `Notification queued for significant difference: ${diffResult.percentageDiff.toFixed(2)}%`
      );
    }

    job.updateProgress(100);

    return {
      ...diffResult,
      diffImageUrl,
      notificationCreated: diffResult.significant,
    };
  } catch (error) {
    console.error(`Diff failed for screenshot ${data.screenshotId}:`, error);

    // Create failure notification
    try {
      const supabase = getSupabaseClient();
      const screenshotData = await supabase
        .from('screenshots')
        .select('project_id')
        .eq('id', data.screenshotId)
        .single();

      await notificationQueue.add('diff_failed', {
        type: 'screenshot_failed',
        screenshotId: data.screenshotId,
        projectId: screenshotData.data?.project_id || '',
        message: `Failed to process visual diff: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } catch (notificationError) {
      console.error('Failed to create error notification:', notificationError);
    }

    throw error;
  }
};
