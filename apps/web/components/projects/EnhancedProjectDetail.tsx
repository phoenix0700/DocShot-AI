/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Project, Screenshot } from '@docshot/database';
import { userService } from '../../lib/user-service';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { CreateScreenshotModal } from './CreateScreenshotModal';
import { ScreenshotGrid } from './ScreenshotGrid';
import { ProjectSettings } from './ProjectSettings';
import { YamlConfigViewer } from './YamlConfigViewer';
import Link from 'next/link';

interface EnhancedProjectDetailProps {
  project: Project & {
    screenshots: Screenshot[];
  };
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

export function EnhancedProjectDetail({
  project: initialProject,
  permissions,
}: EnhancedProjectDetailProps) {
  const { user } = useUser();
  const [project, setProject] = useState(initialProject);
  const [activeTab, setActiveTab] = useState<'overview' | 'screenshots' | 'settings' | 'yaml'>(
    'overview'
  );
  const [showCreateScreenshot, setShowCreateScreenshot] = useState(false);
  const [loading, setLoading] = useState(false);

  const runScreenshots = async () => {
    if (!user?.id || !permissions.canTakeScreenshot) return;

    try {
      setLoading(true);

      const response = await fetch('/api/screenshots/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: project.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to run screenshots');
      }

      // Show success message or redirect to results
      alert(`Successfully queued ${result.count} screenshot jobs!`);

      // Refresh project data
      window.location.reload();
    } catch (error) {
      console.error('Error running screenshots:', error);
      alert(error instanceof Error ? error.message : 'Failed to run screenshots');
    } finally {
      setLoading(false);
    }
  };

  const handleScreenshotCreated = () => {
    setShowCreateScreenshot(false);
    // Refresh project data
    window.location.reload();
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'screenshots', label: 'Screenshots', icon: '📸' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'yaml', label: 'YAML Config', icon: '📄' },
  ] as const;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 mr-4">
            ← Back to Dashboard
          </Link>
        </div>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            {project.description && <p className="text-gray-600 mt-1">{project.description}</p>}
            <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
              <span>🌐 {project.url}</span>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  project.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}
              >
                {project.is_active ? 'Active' : 'Inactive'}
              </span>
              <span>{project.total_screenshots} screenshots</span>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={() => setShowCreateScreenshot(true)}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!permissions.canTakeScreenshot}
            >
              Add Screenshot
            </Button>
            <Button
              onClick={runScreenshots}
              disabled={
                loading || !permissions.canTakeScreenshot || project.screenshots.length === 0
              }
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Running...
                </>
              ) : (
                'Run Screenshots'
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Usage Warning */}
      {!permissions.canTakeScreenshot && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Screenshot Limit Reached</h3>
              <p className="text-sm text-yellow-700 mt-1">
                You've used {permissions.usage.screenshots} of {permissions.usage.limit} screenshots
                this month. Upgrade to Pro for unlimited screenshots.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && <ProjectOverview project={project} />}

        {activeTab === 'screenshots' && (
          <ScreenshotGrid screenshots={project.screenshots} projectId={project.id} />
        )}

        {activeTab === 'settings' && (
          <ProjectSettings project={project} onProjectUpdated={setProject as any} />
        )}

        {activeTab === 'yaml' && <YamlConfigViewer project={project} />}
      </div>

      {/* Create Screenshot Modal */}
      {showCreateScreenshot && (
        <CreateScreenshotModal
          projectId={project.id}
          onClose={() => setShowCreateScreenshot(false)}
          onScreenshotCreated={handleScreenshotCreated}
        />
      )}
    </div>
  );
}

// Overview component
function ProjectOverview({ project }: { project: Project }) {
  const stats = [
    {
      label: 'Total Screenshots',
      value: project.total_screenshots,
      icon: '📸',
      color: 'blue',
    },
    {
      label: 'Last Run',
      value: project.last_run_at ? new Date(project.last_run_at).toLocaleDateString('en-US') : 'Never',
      icon: '⏰',
      color: 'green',
    },
    {
      label: 'Status',
      value: project.last_run_status || 'Not run',
      icon:
        project.last_run_status === 'success'
          ? '✅'
          : project.last_run_status === 'failed'
            ? '❌'
            : '⏸️',
      color:
        project.last_run_status === 'success'
          ? 'green'
          : project.last_run_status === 'failed'
            ? 'red'
            : 'gray',
    },
    {
      label: 'GitHub Integration',
      value: project.github_repo_name ? 'Connected' : 'Not connected',
      icon: '🔗',
      color: project.github_repo_name ? 'green' : 'gray',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Details */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Project Details</h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Website URL</dt>
            <dd className="text-sm text-gray-900 mt-1">
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                {project.url}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Created</dt>
            <dd className="text-sm text-gray-900 mt-1">
              {new Date(project.created_at).toLocaleDateString('en-US')}
            </dd>
          </div>
          {project.schedule && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Schedule</dt>
              <dd className="text-sm text-gray-900 mt-1">
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">{project.schedule}</code>
              </dd>
            </div>
          )}
          {project.github_repo_name && (
            <div>
              <dt className="text-sm font-medium text-gray-500">GitHub Repository</dt>
              <dd className="text-sm text-gray-900 mt-1">
                <a
                  href={`https://github.com/${project.github_repo_owner}/${project.github_repo_name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  {project.github_repo_owner}/{project.github_repo_name}
                </a>
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Add Screenshot</h4>
              <p className="text-sm text-gray-500">Configure a new screenshot to capture</p>
            </div>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              Add Screenshot
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Run Screenshots</h4>
              <p className="text-sm text-gray-500">Capture all pending screenshots now</p>
            </div>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              Run Now
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">View YAML Config</h4>
              <p className="text-sm text-gray-500">Export project configuration as YAML</p>
            </div>
            <Button size="sm" variant="outline">
              View Config
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
