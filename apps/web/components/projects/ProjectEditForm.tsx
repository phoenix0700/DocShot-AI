'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Project } from '@docshot/database';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface ProjectEditFormProps {
  project: Project;
}

export function ProjectEditForm({ project }: ProjectEditFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: project.name,
    description: project.description || '',
    url: project.url || '',
    github_repo_owner: project.github_repo_owner || '',
    github_repo_name: project.github_repo_name || '',
    github_auto_commit: project.github_auto_commit || false,
    schedule: project.schedule || '',
    is_active: project.is_active !== false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Project name is required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          url: formData.url.trim() || undefined,
          github_repo_owner: formData.github_repo_owner.trim() || undefined,
          github_repo_name: formData.github_repo_name.trim() || undefined,
          github_auto_commit: formData.github_auto_commit,
          schedule: formData.schedule.trim() || undefined,
          is_active: formData.is_active,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update project');
      }

      router.push(`/projects/${project.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to update project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Project Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700">
              Base URL
            </label>
            <input
              type="url"
              id="url"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="https://example.com"
            />
          </div>
        </div>

        {/* GitHub Integration */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">GitHub Integration</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="github_repo_owner" className="block text-sm font-medium text-gray-700">
                Repository Owner
              </label>
              <input
                type="text"
                id="github_repo_owner"
                value={formData.github_repo_owner}
                onChange={(e) => setFormData(prev => ({ ...prev, github_repo_owner: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="username"
              />
            </div>

            <div>
              <label htmlFor="github_repo_name" className="block text-sm font-medium text-gray-700">
                Repository Name
              </label>
              <input
                type="text"
                id="github_repo_name"
                value={formData.github_repo_name}
                onChange={(e) => setFormData(prev => ({ ...prev, github_repo_name: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="repo-name"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="github_auto_commit"
              checked={formData.github_auto_commit}
              onChange={(e) => setFormData(prev => ({ ...prev, github_auto_commit: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="github_auto_commit" className="ml-2 block text-sm text-gray-900">
              Auto-commit screenshots to GitHub
            </label>
          </div>
        </div>

        {/* Schedule */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Schedule</h3>
          
          <div>
            <label htmlFor="schedule" className="block text-sm font-medium text-gray-700">
              Cron Schedule
            </label>
            <input
              type="text"
              id="schedule"
              value={formData.schedule}
              onChange={(e) => setFormData(prev => ({ ...prev, schedule: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="0 */6 * * * (every 6 hours)"
            />
            <p className="mt-1 text-sm text-gray-500">
              Leave empty to disable automatic screenshots
            </p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
              Project is active
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/projects/${project.id}`)}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <LoadingSpinner size="sm" /> : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}