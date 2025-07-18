import { auth } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@docshot/database';

export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    // Check authentication
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId } = params;
    const body = await request.json();

    // Validate required fields
    if (!body.name?.trim()) {
      return NextResponse.json({ error: 'Screenshot name is required' }, { status: 400 });
    }
    if (!body.url?.trim()) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Use server-side Supabase client with service key
    const supabase = getSupabaseClient();

    // First verify the user owns this project
    const { data: project, error: projectError } = await supabase.withUserContext(
      userId,
      async (client) => {
        return client
          .from('projects')
          .select('id')
          .eq('id', projectId)
          .single();
      }
    );

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Create the screenshot
    const { data: screenshot, error: screenshotError } = await supabase.withUserContext(
      userId,
      async (client) => {
        return client
          .from('screenshots')
          .insert({
            project_id: projectId,
            name: body.name.trim(),
            url: body.url.trim(),
            selector: body.selector?.trim() || null,
            viewport_width: body.viewport_width || 1920,
            viewport_height: body.viewport_height || 1080,
            full_page: body.full_page !== false,
            wait_for_selector: body.wait_for_selector?.trim() || null,
            wait_for_timeout: body.wait_for_timeout ? parseInt(body.wait_for_timeout) : null,
            status: 'pending',
            retry_count: 0,
          })
          .select()
          .single();
      }
    );

    if (screenshotError) {
      console.error('Failed to create screenshot:', screenshotError);
      return NextResponse.json(
        { error: screenshotError.message || 'Failed to create screenshot' },
        { status: 500 }
      );
    }

    return NextResponse.json({ screenshot });
  } catch (error: any) {
    console.error('API: Failed to create screenshot:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create screenshot' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    // Check authentication
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId } = params;
    const supabase = getSupabaseClient();

    // Get screenshots for this project
    const { data: screenshots, error } = await supabase.withUserContext(
      userId,
      async (client) => {
        return client
          .from('screenshots')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false });
      }
    );

    if (error) {
      console.error('Failed to get screenshots:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to get screenshots' },
        { status: 500 }
      );
    }

    return NextResponse.json({ screenshots });
  } catch (error: any) {
    console.error('API: Failed to get screenshots:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get screenshots' },
      { status: 500 }
    );
  }
}