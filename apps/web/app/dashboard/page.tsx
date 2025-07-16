import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { ProjectDashboard } from '../../components/dashboard/ProjectDashboard';

export default async function DashboardPage() {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProjectDashboard userId={userId} />
    </div>
  );
}
