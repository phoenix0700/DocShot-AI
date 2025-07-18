import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { getSupabaseClient } from '@docshot/database';
import { ProjectEditForm } from '../../../../components/projects/ProjectEditForm';

interface ProjectEditPageProps {
  params: {
    id: string;
  };
}

export default async function ProjectEditPage({ params }: ProjectEditPageProps) {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const supabase = getSupabaseClient();

  // Get project data
  const { data: project, error } = await supabase.withUserContext(userId, async (client) => {
    return client
      .from('projects')
      .select('*')
      .eq('id', params.id)
      .single();
  });

  if (error || !project) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Edit Project</h1>
            <p className="text-gray-600 mt-1">Update project settings and configuration</p>
          </div>
          
          <ProjectEditForm project={project} />
        </div>
      </div>
    </div>
  );
}