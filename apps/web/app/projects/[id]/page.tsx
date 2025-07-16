import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { ProjectDetail } from '../../../components/projects/ProjectDetail';

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

  return (
    <div className="min-h-screen bg-gray-50">
      <ProjectDetail projectId={params.id} userId={userId} />
    </div>
  );
}