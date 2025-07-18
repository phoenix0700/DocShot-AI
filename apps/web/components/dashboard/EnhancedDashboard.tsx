'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { User, Project } from '@docshot/database';
// Removed direct userService import - using API routes instead
import { DashboardHeader } from './DashboardHeader';
import { DashboardStats } from './DashboardStats';
import { QuickActions } from './QuickActions';
import { ProjectsOverview } from './ProjectsOverview';
import { ActivityFeed } from './ActivityFeed';
import { OnboardingGuide } from './OnboardingGuide';
import { CreateProjectModal } from './CreateProjectModal';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface EnhancedDashboardProps {
  user: User;
}

interface DashboardData {
  projects: Project[];
  permissions: {
    canCreateProject: boolean;
    canTakeScreenshot: boolean;
    usage: {
      screenshots: number;
      limit: number;
      projects: number;
    };
  };
  stats: {
    totalScreenshots: number;
    activeProjects: number;
    screenshotsThisWeek: number;
    lastActivityDate: string | null;
    successRate: number;
    totalChangesDetected: number;
  };
  recentActivity: Array<{
    id: string;
    type:
      | 'screenshot_captured'
      | 'project_created'
      | 'visual_change_detected'
      | 'notification_sent';
    message: string;
    timestamp: string;
    projectName?: string;
    status?: 'success' | 'error' | 'warning';
  }>;
}

export function EnhancedDashboard({ user: initialUser }: EnhancedDashboardProps) {
  const { user: clerkUser } = useUser();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const userId = clerkUser?.id || initialUser.clerk_user_id;

    try {
      setLoading(true);
      setError(null);

      // Load all dashboard data using API routes
      const [projectsRes, permissionsRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/user/permissions'),
      ]);

      if (!projectsRes.ok || !permissionsRes.ok) {
        throw new Error('Failed to load dashboard data');
      }

      const { projects: userProjects } = await projectsRes.json();
      const userPermissions = await permissionsRes.json();

      // Derive basic stats from the user's projects so the dashboard shows live data.
      const totalScreenshots = (userProjects || []).reduce(
        (sum: number, p: any) => sum + (p.total_screenshots ?? 0),
        0
      );

      const activeProjects = (userProjects || []).filter((p: any) => p.is_active).length;

      // Count screenshots captured in the last 7 days using last_run_at per project.
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      const screenshotsThisWeek = (userProjects || []).reduce((sum: number, p: any) => {
        if (p.last_run_at && new Date(p.last_run_at).getTime() > weekAgo) {
          return sum + (p.total_screenshots ?? 0);
        }
        return sum;
      }, 0);

      const lastActivityDate = (userProjects || [])
        .map((p: any) => p.last_run_at)
        .filter(Boolean)
        .sort()
        .pop() || null;

      // Simple success rate: ratio of projects with last_run_status 'success'.
      const successRuns = (userProjects || []).filter((p: any) => p.last_run_status === 'success').length;
      const totalRuns = (userProjects || []).filter((p: any) => p.last_run_status).length;
      const successRate = totalRuns ? Number(((successRuns / totalRuns) * 100).toFixed(1)) : 100;

      const stats = {
        totalScreenshots,
        activeProjects,
        screenshotsThisWeek,
        lastActivityDate,
        successRate,
        totalChangesDetected: 0,
      };

      const recentActivity: DashboardData['recentActivity'] = [];

      setDashboardData({
        projects: userProjects || [],
        permissions: userPermissions,
        stats,
        recentActivity,
      });
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectCreated = () => {
    loadDashboardData();
    setShowCreateModal(false);
  };

  const handleProjectDeleted = (projectId: string) => {
    if (!dashboardData) return;
    setDashboardData({
      ...dashboardData,
      projects: dashboardData.projects.filter((p) => p.id !== projectId),
    });
  };

  const isNewUser =
    dashboardData?.projects.length === 0 && dashboardData?.stats.totalScreenshots === 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load dashboard data.</p>
        <button
          onClick={loadDashboardData}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <DashboardHeader user={initialUser} permissions={dashboardData.permissions} />

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

        {/* Onboarding Guide for New Users */}
        {isNewUser && <OnboardingGuide onCreateProject={() => setShowCreateModal(true)} />}

        {/* Dashboard Stats */}
        <DashboardStats
          stats={dashboardData.stats}
          user={initialUser}
          permissions={dashboardData.permissions}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left Column - Projects and Quick Actions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <QuickActions
              permissions={dashboardData.permissions}
              onCreateProject={() => setShowCreateModal(true)}
              projects={dashboardData.projects}
            />

            {/* Projects Overview */}
            <ProjectsOverview
              projects={dashboardData.projects}
              permissions={dashboardData.permissions}
              onCreateProject={() => setShowCreateModal(true)}
              onProjectDeleted={handleProjectDeleted}
            />
          </div>

          {/* Right Column - Activity Feed */}
          <div className="lg:col-span-1">
            <ActivityFeed activities={dashboardData.recentActivity} stats={dashboardData.stats} />
          </div>
        </div>

        {/* Create Project Modal */}
        {showCreateModal && (
          <CreateProjectModal
            onClose={() => setShowCreateModal(false)}
            onProjectCreated={handleProjectCreated}
          />
        )}
      </div>
    </div>
  );
}
