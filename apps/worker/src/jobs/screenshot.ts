import { Job } from 'bullmq';
import { ScreenshotJobDataSchema, createStorageService } from '@docshot/shared';
import { captureScreenshot } from '../lib/puppeteer';
import { supabase } from '@docshot/database';
import { GitHubIntegrationService } from '../services/github-integration';

const storage = createStorageService();

export const screenshotProcessor = async (job: Job) => {
  const data = ScreenshotJobDataSchema.parse(job.data);
  
  try {
    job.updateProgress(10);
    console.log(`Processing screenshot job for ${data.url}`);
    
    // Capture screenshot
    job.updateProgress(30);
    const result = await captureScreenshot({
      url: data.url,
      selector: data.selector,
      viewport: data.viewport,
    });
    
    job.updateProgress(60);
    console.log(`Screenshot captured for ${data.url}, size: ${result.buffer.length} bytes`);
    
    // Upload to storage
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
    const { error } = await supabase
      .from('screenshots')
      .update({
        image_url: uploadResult.publicUrl,
        status: 'captured',
        updated_at: new Date().toISOString(),
      })
      .eq('id', data.screenshotId);
    
    if (error) {
      throw new Error(`Database update failed: ${error.message}`);
    }
    
    // Upload to GitHub if configured
    job.updateProgress(90);
    try {
      const githubService = await GitHubIntegrationService.fromProjectConfig(data.projectId);
      if (githubService) {
        const filename = `${data.screenshotId}-${Date.now()}.png`;
        await githubService.uploadScreenshot(
          data.projectId,
          data.screenshotId,
          result.buffer,
          filename
        );
        console.log(`Screenshot uploaded to GitHub: ${filename}`);
      }
    } catch (githubError) {
      console.error('GitHub upload failed (non-fatal):', githubError);
      // Don't fail the job if GitHub upload fails
    }
    
    job.updateProgress(100);
    console.log(`Screenshot job completed for ${data.url}`);
    
    // Queue notification for successful capture
    try {
      const queue = job.queue;
      await queue.add('notification', {
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
      const queue = job.queue;
      await queue.add('notification', {
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