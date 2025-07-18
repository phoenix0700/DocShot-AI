import { auth } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';
import { userService } from '../../../lib/user-service';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { name, description, url, github_repo_owner, github_repo_name, github_auto_commit } = body;

    // Validate required fields
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }
    if (!url?.trim()) {
      return NextResponse.json({ error: 'Project URL is required' }, { status: 400 });
    }

    // Create project using server-side service (has access to SUPABASE_SERVICE_KEY)
    const project = await userService.createProject(userId, {
      name: name.trim(),
      description: description?.trim() || undefined,
      url: url.trim(),
      github_repo_owner: github_repo_owner?.trim() || undefined,
      github_repo_name: github_repo_name?.trim() || undefined,
      github_auto_commit: github_auto_commit || false,
    });

    return NextResponse.json({ project });
  } catch (error: any) {
    console.error('API: Failed to create project:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create project' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's projects
    const projects = await userService.getUserProjects(userId);
    return NextResponse.json({ projects });
  } catch (error: any) {
    console.error('API: Failed to get projects:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get projects' },
      { status: 500 }
    );
  }
}