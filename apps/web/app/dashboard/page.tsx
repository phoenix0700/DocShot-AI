import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { userService } from '../../lib/user-service';
import { EnhancedDashboard } from '../../components/dashboard/EnhancedDashboard';

export default async function DashboardPage() {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Sync user with database and get their data
  const user = await userService.getCurrentUser();
  
  if (!user) {
    redirect('/sign-in');
  }

  return <EnhancedDashboard user={user} />;
}
