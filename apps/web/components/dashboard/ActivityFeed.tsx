'use client';

interface ActivityFeedProps {
  activities: Array<{
    id: string;
    type: 'screenshot_captured' | 'project_created' | 'visual_change_detected' | 'notification_sent';
    message: string;
    timestamp: string;
    projectName?: string;
    status?: 'success' | 'error' | 'warning';
  }>;
  stats: {
    totalScreenshots: number;
    successRate: number;
    totalChangesDetected: number;
  };
}

export function ActivityFeed({ activities, stats }: ActivityFeedProps) {
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return time.toLocaleDateString();
  };

  const getActivityIcon = (type: string, status?: string) => {
    const baseClasses = "w-8 h-8 rounded-full flex items-center justify-center";
    
    switch (type) {
      case 'screenshot_captured':
        return (
          <div className={`${baseClasses} ${status === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        );
      case 'project_created':
        return (
          <div className={`${baseClasses} bg-blue-100 text-blue-600`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        );
      case 'visual_change_detected':
        return (
          <div className={`${baseClasses} bg-orange-100 text-orange-600`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        );
      case 'notification_sent':
        return (
          <div className={`${baseClasses} bg-purple-100 text-purple-600`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        );
      default:
        return (
          <div className={`${baseClasses} bg-gray-100 text-gray-600`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">At a Glance</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">System Status</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm font-medium text-green-600">All Systems Operational</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Success Rate</span>
            <span className="text-sm font-medium text-gray-900">{stats.successRate}%</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Changes Detected</span>
            <span className="text-sm font-medium text-gray-900">{stats.totalChangesDetected} this week</span>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
        </div>
        
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-gray-500 text-sm">No recent activity</p>
              <p className="text-gray-400 text-xs">Activity will appear here as you use DocShot AI</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                {getActivityIcon(activity.type, activity.status)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  {activity.projectName && (
                    <p className="text-xs text-gray-500">in {activity.projectName}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(activity.timestamp)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Helpful Resources */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 Helpful Resources</h3>
        <div className="space-y-3">
          <a 
            href="/docs/getting-started" 
            className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            → Getting Started Guide
          </a>
          <a 
            href="/docs/yaml-reference" 
            className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            → YAML Configuration Reference
          </a>
          <a 
            href="/docs/integrations" 
            className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            → GitHub Integration Setup
          </a>
          <a 
            href="/docs/troubleshooting" 
            className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            → Troubleshooting Guide
          </a>
        </div>
        
        <div className="mt-4 pt-4 border-t border-blue-200">
          <p className="text-xs text-gray-600">
            Need help? <a href="/contact" className="text-blue-600 hover:underline">Contact our support team</a>
          </p>
        </div>
      </div>
    </div>
  );
}