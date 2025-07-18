'use client';

import { SignOutButton, useUser } from '@clerk/nextjs';
import { User } from '@docshot/database';
import { Button } from '../ui/Button';

interface DashboardHeaderProps {
  user: User;
  permissions: {
    canCreateProject: boolean;
    canTakeScreenshot: boolean;
    usage: {
      screenshots: number;
      limit: number;
      projects: number;
    };
  };
}

export function DashboardHeader({ user, permissions }: DashboardHeaderProps) {
  const { user: clerkUser } = useUser();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const userName = user.first_name || clerkUser?.firstName || 'there';

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
      <div className="mb-4 sm:mb-0">
        <h1 className="text-3xl font-bold text-gray-900">
          {getGreeting()}, {userName}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your screenshot automation
        </p>
      </div>

      <div className="flex items-center space-x-4">
        {/* Usage Indicator */}
        <div className="hidden sm:flex items-center space-x-4 text-sm">
          <div className="text-gray-500">
            <span className="font-medium">{permissions.usage.screenshots}</span>
            {permissions.usage.limit > 0 ? (
              <span> / {permissions.usage.limit} screenshots</span>
            ) : (
              <span> screenshots</span>
            )}
          </div>

          {/* Plan Badge */}
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              user.subscription_tier === 'free'
                ? 'bg-gray-100 text-gray-700'
                : user.subscription_tier === 'pro'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-purple-100 text-purple-700'
            }`}
          >
            {user.subscription_tier.toUpperCase()}
          </div>
        </div>

        {/* Upgrade Button for Free Users */}
        {user.subscription_tier === 'free' && (
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
            Upgrade
          </Button>
        )}

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-4">
          <a
            href="/history"
            className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
          >
            History
          </a>
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>

        {/* User Menu */}
        <div className="relative">
          <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {userName.charAt(0).toUpperCase()}
            </div>
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown menu would go here */}
        </div>

        {/* Sign Out */}
        <SignOutButton>
          <button className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm transition-colors">
            Sign Out
          </button>
        </SignOutButton>
      </div>
    </div>
  );
}
