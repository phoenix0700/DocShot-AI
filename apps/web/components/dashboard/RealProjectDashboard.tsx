'use client';

import { useState, useEffect } from 'react';
import { useUser, SignOutButton } from '@clerk/nextjs';
import { User, Project } from '@docshot/database';
import { userService } from '../../lib/user-service';
import { CreateProjectModal } from './CreateProjectModal';
import { ProjectCard } from './ProjectCard';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { EmptyState } from '../ui/EmptyState';

interface RealProjectDashboardProps {
  user: User;
}

export function RealProjectDashboard({ user: initialUser }: RealProjectDashboardProps) {
  const { user: clerkUser } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissions, setPermissions] = useState({
    canCreateProject: false,
    canTakeScreenshot: false,
    usage: {
      screenshots: 0,
      limit: 0,
      projects: 0,
    },
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    if (!clerkUser?.id) return;

    try {
      setLoading(true);
      setError(null);

      // Load projects and permissions in parallel
      const [userProjects, userPermissions] = await Promise.all([
        userService.getUserProjects(clerkUser.id),
        userService.checkUserPermissions(clerkUser.id),
      ]);

      setProjects(userProjects || []);
      setPermissions(userPermissions);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectCreated = () => {
    loadDashboardData(); // Reload projects after creation
    setShowCreateModal(false);
  };

  const handleProjectDeleted = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {initialUser.first_name || clerkUser?.firstName || 'there'}!
          </h1>
          <p className="text-gray-600 mt-1">Manage your screenshot automation projects</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            <span className="font-medium">{permissions.usage.screenshots}</span>
            {permissions.usage.limit > 0 ? (
              <span> / {permissions.usage.limit} screenshots this month</span>
            ) : (
              <span> screenshots (unlimited)</span>
            )}
          </div>
          <SignOutButton>
            <button className="text-gray-500 hover:text-gray-700 px-3 py-2">Sign Out</button>
          </SignOutButton>
        </div>
      </div>

      {/* Subscription Status */}
      <div className="mb-6 bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              Current Plan: {initialUser.subscription_tier.toUpperCase()}
            </h3>
            <p className="text-sm text-gray-500">
              {initialUser.subscription_tier === 'free' ? (
                <>
                  {permissions.usage.limit - permissions.usage.screenshots} screenshots remaining
                  this month
                </>
              ) : (
                'Unlimited screenshots and projects'
              )}
            </p>
          </div>
          {initialUser.subscription_tier === 'free' && (
            <Button className="bg-blue-600 hover:bg-blue-700">Upgrade to Pro</Button>
          )}
        </div>

        {/* Usage Progress Bar */}
        {initialUser.subscription_tier === 'free' && permissions.usage.limit > 0 && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Usage</span>
              <span>
                {Math.round((permissions.usage.screenshots / permissions.usage.limit) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{
                  width: `${Math.min((permissions.usage.screenshots / permissions.usage.limit) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Project Button */}
      <div className="mb-6">
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700"
          disabled={!permissions.canCreateProject}
        >
          {permissions.canCreateProject ? 'Create Project' : 'Project Limit Reached'}
        </Button>
        {!permissions.canCreateProject && initialUser.subscription_tier === 'free' && (
          <p className="text-sm text-gray-500 mt-2">Upgrade to Pro to create unlimited projects</p>
        )}
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Create your first project to start automating screenshot captures"
          actionLabel="Create Project"
          onAction={() => setShowCreateModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDeleted={() => handleProjectDeleted(project.id)}
            />
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onProjectCreated={handleProjectCreated}
        />
      )}
    </div>
  );
}
