import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { getSupabaseClient } from '@docshot/database';
import { createQueueManager } from '@docshot/shared';
import { userService } from '../../../lib/user-service';

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check user permissions
    const permissions = await userService.checkUserPermissions(userId);
    if (!permissions.canTakeScreenshot) {
      return NextResponse.json(
        { error: 'Screenshot limit reached for your subscription tier' },
        { status: 403 }
      );
    }

    const supabase = getSupabaseClient();

    const { projectId } = await request.json();

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    // Get project screenshots with user context
    const { data: screenshots, error } = await supabase
      .withUserContext(userId, async (client) => {
        return client
          .from('screenshots')
          .select('*')
          .eq('project_id', projectId)
          .eq('status', 'pending');
      });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!screenshots || screenshots.length === 0) {
      return NextResponse.json({ message: 'No pending screenshots found' }, { status: 200 });
    }

    // Queue actual screenshot jobs
    const queueManager = createQueueManager();
    console.log('Queuing screenshot jobs for:', screenshots.length, 'screenshots');

    try {
      // Create jobs for each screenshot
      const jobPromises = screenshots.map(async (screenshot) => {
        return queueManager.addScreenshotJob({
          projectId,
          screenshotId: screenshot.id,
          url: screenshot.url,
          selector: screenshot.selector || undefined,
          viewport: screenshot.viewport || undefined,
        });
      });

      // Wait for all jobs to be queued
      await Promise.all(jobPromises);

      // Track usage for each screenshot
      for (let i = 0; i < screenshots.length; i++) {
        await userService.trackScreenshotUsage(userId);
      }

      console.log('Successfully queued', screenshots.length, 'screenshot jobs');
    } catch (queueError) {
      console.error('Queue error:', queueError);
      return NextResponse.json(
        {
          error: 'Failed to queue screenshot jobs',
          details: queueError instanceof Error ? queueError.message : 'Unknown error',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Screenshot jobs queued successfully',
      count: screenshots.length,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
