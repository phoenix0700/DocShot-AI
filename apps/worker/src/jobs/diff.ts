import { Job, Queue } from 'bullmq';
import { DiffJobDataSchema, createStorageService } from '@docshot/shared';
import { compareImageUrls } from '../lib/pixelmatch';
import { createSupabaseClient } from '@docshot/database';
import Redis from 'ioredis';

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
    
    // Compare images
    job.updateProgress(30);
    const diffResult = await compareImageUrls(
      data.currentImageUrl,
      data.previousImageUrl,
      { threshold: 0.1 }, // Default threshold
      1.0 // Significance threshold (1% change)
    );
    
    job.updateProgress(60);
    console.log(`Diff completed: ${diffResult.percentageDiff.toFixed(2)}% changed (${diffResult.pixelDiff} pixels)`);
    
    let diffImageUrl: string | null = null;
    
    // Upload diff image if changes detected
    if (diffResult.significant && diffResult.diffImageBuffer) {
      const { data: screenshot } = await supabase
        .from('screenshots')
        .select('project_id')
        .eq('id', data.screenshotId)
        .single();
      
      if (screenshot) {
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
      await notificationQueue.add('diff_detected', {
        type: 'diff_detected',
        screenshotId: data.screenshotId,
        projectId: (await supabase
          .from('screenshots')
          .select('project_id')
          .eq('id', data.screenshotId)
          .single()).data?.project_id,
        message: `Visual difference detected: ${diffResult.percentageDiff.toFixed(2)}% of pixels changed`,
        diffImageUrl,
        diffData: {
          pixelDiff: diffResult.pixelDiff,
          percentageDiff: diffResult.percentageDiff,
          totalPixels: diffResult.totalPixels,
        },
      });
      
      console.log(`Notification queued for significant difference: ${diffResult.percentageDiff.toFixed(2)}%`);
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
      await notificationQueue.add('diff_failed', {
        type: 'screenshot_failed',
        screenshotId: data.screenshotId,
        projectId: (await supabase
          .from('screenshots')
          .select('project_id')
          .eq('id', data.screenshotId)
          .single()).data?.project_id,
        message: `Failed to process visual diff: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } catch (notificationError) {
      console.error('Failed to create error notification:', notificationError);
    }
    
    throw error;
  }
};