import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { ScreenshotHistory } from '../../components/screenshots/ScreenshotHistory';

export const metadata = {
  title: 'Screenshot History - DocShot AI',
  description: 'View and manage your screenshot capture history, visual diffs, and approvals.',
};

interface PageProps {
  searchParams: {
    project?: string;
    screenshot?: string;
  };
}

export default function HistoryPage({ searchParams }: PageProps) {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ScreenshotHistory
          projectId={searchParams.project}
          screenshotId={searchParams.screenshot}
        />
      </div>
    </div>
  );
}
