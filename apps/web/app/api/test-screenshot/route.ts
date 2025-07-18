import { NextRequest, NextResponse } from 'next/server';
import { createQueueManager } from '@docshot/shared';

export async function POST(request: NextRequest) {
  try {
    const { url, selector, viewport } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Generate test UUIDs
    const generateUUID = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    };

    // Create queue manager and add job
    const queueManager = createQueueManager();

    const jobData = {
      projectId: generateUUID(),
      screenshotId: generateUUID(),
      url,
      selector,
      viewport: viewport || { width: 1280, height: 720 },
    };

    console.log('Adding test screenshot job:', jobData);

    const job = await queueManager.addScreenshotJob(jobData);

    return NextResponse.json({
      success: true,
      message: 'Screenshot job queued successfully',
      jobId: job.id,
      jobData,
    });
  } catch (error) {
    console.error('Test screenshot API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to queue screenshot job',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
