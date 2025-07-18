import { auth } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@docshot/database';

export async function PUT(
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
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }

    // Use server-side Supabase client with service key
    const supabase = getSupabaseClient();

    // Update the project
    const { data: project, error } = await supabase.withUserContext(
      userId,
      async (client) => {
        return client
          .from('projects')
          .update({
            name: body.name.trim(),
            description: body.description?.trim() || null,
            url: body.url?.trim() || null,
            github_repo_owner: body.github_repo_owner?.trim() || null,
            github_repo_name: body.github_repo_name?.trim() || null,
            github_auto_commit: body.github_auto_commit || false,
            schedule: body.schedule?.trim() || null,
            is_active: body.is_active !== false,
            updated_at: new Date().toISOString(),
          })
          .eq('id', projectId)
          .select()
          .single();
      }
    );

    if (error) {
      console.error('Failed to update project:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to update project' },
        { status: 500 }
      );
    }

    return NextResponse.json({ project });
  } catch (error: any) {
    console.error('API: Failed to update project:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Delete the project (cascade will handle screenshots)
    const { error } = await supabase.withUserContext(
      userId,
      async (client) => {
        return client
          .from('projects')
          .delete()
          .eq('id', projectId);
      }
    );

    if (error) {
      console.error('Failed to delete project:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to delete project' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API: Failed to delete project:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete project' },
      { status: 500 }
    );
  }
}