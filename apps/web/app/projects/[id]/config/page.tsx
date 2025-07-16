import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { ProjectConfig } from '../../../../components/projects/ProjectConfig';

interface ProjectConfigPageProps {
  params: {
    id: string;
  };
}

export default async function ProjectConfigPage({ params }: ProjectConfigPageProps) {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProjectConfig projectId={params.id} userId={userId} />
    </div>
  );
}
