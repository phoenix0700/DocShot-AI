'use client';

import type { Project as BaseProject } from '@docshot/database';
import { ProjectCard } from './ProjectCard';
import { EmptyState } from '../ui/EmptyState';
import { Button } from '../ui/Button';

interface Project extends BaseProject {
  screenshots?: { length: number }[];
}

interface ProjectsOverviewProps {
  projects: Project[];
  permissions: {
    canCreateProject: boolean;
  };
  onCreateProject: () => void;
  onProjectDeleted: (projectId: string) => void;
}

export function ProjectsOverview({
  projects,
  permissions,
  onCreateProject,
  onProjectDeleted,
}: ProjectsOverviewProps) {
  const activeProjects = projects.filter((p) => p.is_active);
  const inactiveProjects = projects.filter((p) => !p.is_active);

  if (projects.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <EmptyState
          title="No projects yet"
          description="Create your first project to start automating screenshot captures. Configure URLs, selectors, and schedules to keep your documentation always up-to-date."
          actionLabel="Create Your First Project"
          onAction={onCreateProject}
        />
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Free to start
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              No credit card required
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Setup in minutes
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Your Projects</h2>
          <p className="text-sm text-gray-600">
            {activeProjects.length} active, {inactiveProjects.length} inactive
          </p>
        </div>
        <Button
          onClick={onCreateProject}
          disabled={!permissions.canCreateProject}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {permissions.canCreateProject ? 'New Project' : 'Project Limit Reached'}
        </Button>
      </div>

      {/* Active Projects */}
      {activeProjects.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Active Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDeleted={() => onProjectDeleted(project.id)}
                enhanced={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Inactive Projects */}
      {inactiveProjects.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Inactive Projects ({inactiveProjects.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inactiveProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDeleted={() => onProjectDeleted(project.id)}
                enhanced={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Project Stats Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Project Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{projects.length}</div>
            <div className="text-gray-600">Total Projects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{activeProjects.length}</div>
            <div className="text-gray-600">Active</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {projects.reduce((sum, p) => sum + (p.screenshots?.length || 0), 0)}
            </div>
            <div className="text-gray-600">Screenshots Configured</div>
          </div>
        </div>
      </div>
    </div>
  );
}
