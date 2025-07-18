'use client';

import { User } from '@docshot/database';

interface DashboardStatsProps {
  stats: {
    totalScreenshots: number;
    activeProjects: number;
    screenshotsThisWeek: number;
    lastActivityDate: string | null;
    successRate: number;
    totalChangesDetected: number;
  };
  user: User;
  permissions: {
    usage: {
      screenshots: number;
      limit: number;
      projects: number;
    };
  };
}

export function DashboardStats({ stats, user, permissions }: DashboardStatsProps) {
  const usagePercentage =
    permissions.usage.limit > 0
      ? (permissions.usage.screenshots / permissions.usage.limit) * 100
      : 0;

  const statCards = [
    {
      title: 'Total Screenshots',
      value: stats.totalScreenshots.toLocaleString(),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      subtitle: 'All time captures',
    },
    {
      title: 'Active Projects',
      value: stats.activeProjects.toString(),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      subtitle: 'Currently monitored',
    },
    {
      title: 'This Week',
      value: stats.screenshotsThisWeek.toString(),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      subtitle: 'Screenshots captured',
    },
    {
      title: 'Success Rate',
      value: `${stats.successRate}%`,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      subtitle: 'Capture success rate',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Usage Summary Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {user.subscription_tier === 'free'
                ? 'Free Plan'
                : `${user.subscription_tier.charAt(0).toUpperCase() + user.subscription_tier.slice(1)} Plan`}
            </h3>
            <p className="text-sm text-gray-600">
              {user.subscription_tier === 'free'
                ? `${permissions.usage.limit - permissions.usage.screenshots} screenshots remaining this month`
                : 'Unlimited screenshots and advanced features'}
            </p>
          </div>

          {user.subscription_tier === 'free' && (
            <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors text-sm font-medium">
              Upgrade Plan
            </button>
          )}
        </div>

        {/* Usage Progress Bar for Free Users */}
        {user.subscription_tier === 'free' && permissions.usage.limit > 0 && (
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Monthly Usage</span>
              <span>
                {permissions.usage.screenshots} / {permissions.usage.limit}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  usagePercentage > 80
                    ? 'bg-red-500'
                    : usagePercentage > 60
                      ? 'bg-yellow-500'
                      : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>{Math.round(usagePercentage)}% used</span>
              <span>{permissions.usage.limit}</span>
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
              </div>
              <div className={`${stat.bgColor} ${stat.textColor} p-3 rounded-lg`}>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Insights */}
      {stats.totalChangesDetected > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-orange-500 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-orange-800">
                {stats.totalChangesDetected} visual changes detected this week
              </p>
              <p className="text-xs text-orange-600">
                Review and approve changes in your project dashboards
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
