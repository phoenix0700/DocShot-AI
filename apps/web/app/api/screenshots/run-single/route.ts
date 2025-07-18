import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createSupabaseClient } from '@docshot/database';
import { createQueueManager } from '@docshot/shared';
import { z } from 'zod';

const RunSingleScreenshotSchema = z.object({
  screenshotId: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { screenshotId } = RunSingleScreenshotSchema.parse(body);

    // Create Supabase client and set user context
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );

    // First, get the database user ID from the Clerk user ID
    const { data: dbUser, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_user_id', userId)
      .single();

    if (userError || !dbUser) {
      console.error('Database user not found:', { userId, error: userError });
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const dbUserId = dbUser.id;
    await supabase.setUserContext(dbUserId);

    // Get the screenshot and verify ownership
    const { data: screenshot, error: screenshotError } = await supabase
      .from('screenshots')
      .select(`
        *,
        project:projects (
          id,
          name,
          user_id,
          config
        )
      `)
      .eq('id', screenshotId)
      .single();

    if (screenshotError || !screenshot) {
      console.error('Screenshot not found:', { screenshotId, error: screenshotError });
      return NextResponse.json({ error: 'Screenshot not found' }, { status: 404 });
    }

    // Debug user ownership
    console.log('User ownership check:', {
      clerkUserId: userId,
      dbUserId,
      projectUserId: screenshot.project.user_id,
      match: screenshot.project.user_id === dbUserId
    });

    // Verify user owns the project
    if (screenshot.project.user_id !== dbUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update screenshot status to pending
    const { error: updateError } = await supabase
      .from('screenshots')
      .update({ 
        status: 'pending',
        updated_at: new Date().toISOString()
      })
      .eq('id', screenshotId);

    if (updateError) {
      console.error('Error updating screenshot status:', updateError);
      return NextResponse.json({ error: 'Failed to update screenshot status' }, { status: 500 });
    }

    // Queue the screenshot job
    const queueManager = createQueueManager();
    
    const jobData = {
      screenshotId: screenshot.id,
      projectId: screenshot.project_id,
      url: screenshot.url,
      selector: screenshot.selector || undefined,
      viewport: screenshot.viewport || { width: 1920, height: 1080 },
      timestamp: Date.now(),
    };

    console.log('About to queue job with data:', jobData);
    
    try {
      const result = await queueManager.addScreenshotJob(jobData);
      console.log('Job queued successfully:', result);
    } catch (error) {
      console.error('Error queuing job:', error);
      throw error;
    }

    console.log(`Queued individual screenshot job for: ${screenshot.url}`);

    return NextResponse.json({ 
      success: true, 
      message: 'Screenshot job queued successfully',
      screenshotId: screenshot.id
    });

  } catch (error) {
    console.error('Error running single screenshot:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Invalid request data', 
        details: error.errors 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}