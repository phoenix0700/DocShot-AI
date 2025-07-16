import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { userService } from '../../../lib/user-service';
import { getSupabaseClient } from '@docshot/database';
import { EnhancedProjectDetail } from '../../../components/projects/EnhancedProjectDetail';

interface ProjectPageProps {
  params: {
    id: string;
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const supabase = getSupabaseClient();

  // Get project with screenshots
  const { data: project, error } = await supabase.withUserContext(userId, async (client) => {
    return client
      .from('projects')
      .select(`
        *,
        screenshots:screenshots(
          *,
          history:screenshot_history(
            *
          )
        )
      `)
      .eq('id', params.id)
      .single();
  });

  if (error || !project) {
    redirect('/dashboard');
  }

  // Get user permissions
  const permissions = await userService.checkUserPermissions(userId);

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedProjectDetail 
        project={project} 
        permissions={permissions}
      />
    </div>
  );
}
