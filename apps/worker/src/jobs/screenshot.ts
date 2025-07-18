import { Job, Queue } from 'bullmq';
import { ScreenshotJobDataSchema, createStorageService } from '@docshot/shared';
import { captureScreenshot } from '../lib/puppeteer';
import { createSupabaseClient } from '@docshot/database';
import Redis from 'ioredis';
// import { GitHubIntegrationService } from '../services/github-integration';

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
      console.log(`Attempt ${attempt} failed, retrying in ${delay}ms:`, lastError.message);
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

export const screenshotProcessor = async (job: Job) => {
  const data = ScreenshotJobDataSchema.parse(job.data);
  const maxRetries = 3;
  const attempt = job.attemptsMade + 1;

  try {
    job.updateProgress(10);
    console.log(`Processing screenshot job for ${data.url} (attempt ${attempt}/${maxRetries})`);

    // Capture screenshot with retry logic
    job.updateProgress(30);
    const result = await retryWithBackoff(
      () =>
        captureScreenshot({
          url: data.url,
          selector: data.selector,
          viewport: data.viewport,
          waitForTimeout: data.selector ? 2000 : 1000, // Extra wait for element screenshots
        }),
      3,
      1000
    );

    job.updateProgress(60);
    console.log(`Screenshot captured for ${data.url}, size: ${result.buffer.length} bytes`);

    // Upload to storage
    const storage = getStorageService();
    const uploadResult = await storage.uploadScreenshot(
      data.projectId,
      data.screenshotId,
      result.buffer,
      {
        url: data.url,
        selector: data.selector || '',
        viewport: JSON.stringify(result.metadata.viewport),
        timestamp: result.metadata.timestamp.toString(),
      }
    );

    job.updateProgress(80);
    console.log(`Screenshot uploaded to ${uploadResult.key}`);

    // Update database
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('screenshots')
      .update({
        image_url: uploadResult.publicUrl,
        last_image_url: uploadResult.publicUrl,
        status: 'completed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', data.screenshotId);

    if (error) {
      throw new Error(`Database update failed: ${error.message}`);
    }

    // Upload to GitHub if configured
    job.updateProgress(90);
    try {
      // const githubService = await GitHubIntegrationService.fromProjectConfig(data.projectId);
      // if (githubService) {
      //   const filename = `${data.screenshotId}-${Date.now()}.png`;
      //   await githubService.uploadScreenshot(
      //     data.projectId,
      //     data.screenshotId,
      //     result.buffer,
      //     filename
      //   );
      //   console.log(`Screenshot uploaded to GitHub: ${filename}`);
      // }
      console.log('GitHub integration temporarily disabled');
    } catch (githubError) {
      console.error('GitHub upload failed (non-fatal):', githubError);
      // Don't fail the job if GitHub upload fails
    }

    job.updateProgress(100);
    console.log(`Screenshot job completed for ${data.url}`);

    // Queue notification for successful capture
    try {
      await notificationQueue.add('screenshot_captured', {
        type: 'screenshot_captured',
        projectId: data.projectId,
        screenshotId: data.screenshotId,
        message: `Screenshot captured successfully: ${data.url}`,
      });
    } catch (notifError) {
      console.error('Failed to queue notification:', notifError);
    }

    return {
      success: true,
      imageSize: result.buffer.length,
      imageUrl: uploadResult.publicUrl,
      key: uploadResult.key,
      metadata: result.metadata,
    };
  } catch (error) {
    console.error(`Screenshot failed for ${data.url}:`, error);

    // Update database with failure status
    try {
      const supabase = getSupabaseClient();
      await supabase
        .from('screenshots')
        .update({
          status: 'failed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', data.screenshotId);
    } catch (dbError) {
      console.error('Failed to update database with error status:', dbError);
    }

    // Queue notification for failure
    try {
      await notificationQueue.add('screenshot_failed', {
        type: 'screenshot_failed',
        projectId: data.projectId,
        screenshotId: data.screenshotId,
        message: error instanceof Error ? error.message : 'Screenshot capture failed',
      });
    } catch (notifError) {
      console.error('Failed to queue failure notification:', notifError);
    }

    throw error;
  }
};
