import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { userService } from '../../lib/user-service';
import { EnhancedDashboard } from '../../components/dashboard/EnhancedDashboard';
import { Database } from '@docshot/database';

export default async function DashboardPage() {
  // When Clerk is configured use normal auth flow; otherwise return stub user
  if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    const { userId } = auth();
    if (!userId) redirect('/sign-in');

    const user = await userService.getCurrentUser();
    if (!user) redirect('/sign-in');
    return <EnhancedDashboard user={user} />;
  }

  // dev stub
  const stub: Database['public']['Tables']['users']['Row'] = {
    id: 'dev',
    clerk_user_id: 'dev',
    email: 'dev@example.com',
    first_name: 'Dev',
    last_name: 'User',
    avatar_url: undefined,
    subscription_tier: 'free',
    subscription_status: 'active',
    stripe_customer_id: undefined,
    monthly_screenshot_count: 0,
    monthly_screenshot_limit: 10,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_login_at: new Date().toISOString(),
  };

  return <EnhancedDashboard user={stub as any} />;
}
