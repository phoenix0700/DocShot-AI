'use client';

import { Project } from '@docshot/database';
import { Button } from '../ui/Button';

interface QuickActionsProps {
  permissions: {
    canCreateProject: boolean;
    canTakeScreenshot: boolean;
  };
  onCreateProject: () => void;
  projects: Project[];
}

export function QuickActions({ permissions, onCreateProject, projects }: QuickActionsProps) {
  const quickActions = [
    {
      title: 'Create New Project',
      description: 'Set up a new screenshot automation project',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      action: onCreateProject,
      disabled: !permissions.canCreateProject,
      color: 'bg-blue-500 hover:bg-blue-600',
      available: true,
    },
    {
      title: 'Run All Screenshots',
      description: 'Capture screenshots for all active projects',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      action: () => console.log('Run all screenshots'),
      disabled: projects.length === 0 || !permissions.canTakeScreenshot,
      color: 'bg-green-500 hover:bg-green-600',
      available: true,
    },
    {
      title: 'View Documentation',
      description: 'Learn how to configure and use DocShot AI',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      action: () => window.open('/docs', '_blank'),
      disabled: false,
      color: 'bg-purple-500 hover:bg-purple-600',
      available: true,
    },
    {
      title: 'Import Configuration',
      description: 'Import existing YAML configuration files',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
        </svg>
      ),
      action: () => console.log('Import configuration'),
      disabled: false,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      available: true,
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quickActions.filter(action => action.available).map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            disabled={action.disabled}
            className={`p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-gray-300 transition-all duration-200 text-left group ${
              action.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`${action.color} text-white p-2 rounded-lg group-hover:scale-110 transition-transform duration-200 ${
                action.disabled ? 'bg-gray-400' : ''
              }`}>
                {action.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
                {action.disabled && (
                  <p className="text-xs text-gray-500 mt-1">
                    {action.title.includes('Create') ? 'Project limit reached' : 'No active projects'}
                  </p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Tips Section */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <h3 className="text-sm font-medium text-gray-900 mb-3">💡 Quick Tips</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-start space-x-2">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
            <span>Use YAML configuration files to define complex screenshot requirements</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
            <span>Set up scheduled captures to keep your documentation always up-to-date</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
            <span>Connect GitHub integration for automatic screenshot commits</span>
          </div>
        </div>
      </div>
    </div>
  );
}