'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useUser } from '@clerk/nextjs';
import { Project } from '@docshot/database';
import { getSupabaseClient } from '@docshot/database';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface ProjectSettingsProps {
  project: Project;
  onProjectUpdated: (project: Project) => void;
}

export function ProjectSettings({ project, onProjectUpdated }: ProjectSettingsProps) {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    name: project.name,
    description: project.description || '',
    url: project.url,
    schedule: project.schedule || '',
    is_active: project.is_active,
    github_repo_owner: project.github_repo_owner || '',
    github_repo_name: project.github_repo_name || '',
    github_branch: project.github_branch,
    github_path: project.github_path,
    github_auto_commit: project.github_auto_commit,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      setError('User not authenticated');
      return;
    }

    if (!formData.name.trim()) {
      setError('Project name is required');
      return;
    }

    if (!formData.url.trim()) {
      setError('Project URL is required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(false);

      const supabase = getSupabaseClient();
      
      const { data, error: supabaseError } = await supabase.withUserContext(user.id, async (client) => {
        return client
          .from('projects')
          .update({
            name: formData.name.trim(),
            description: formData.description.trim() || null,
            url: formData.url.trim(),
            schedule: formData.schedule.trim() || null,
            is_active: formData.is_active,
            github_repo_owner: formData.github_repo_owner.trim() || null,
            github_repo_name: formData.github_repo_name.trim() || null,
            github_branch: formData.github_branch,
            github_path: formData.github_path,
            github_auto_commit: formData.github_auto_commit,
          })
          .eq('id', project.id)
          .select()
          .single();
      });

      if (supabaseError) {
        throw supabaseError;
      }

      onProjectUpdated(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error updating project:', err);
      setError(err.message || 'Failed to update project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!user?.id) return;

    try {
      setIsSubmitting(true);
      const supabase = getSupabaseClient();
      
      const { error: supabaseError } = await supabase.withUserContext(user.id, async (client) => {
        return client
          .from('projects')
          .delete()
          .eq('id', project.id);
      });

      if (supabaseError) {
        throw supabaseError;
      }

      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (err: any) {
      console.error('Error deleting project:', err);
      setError(err.message || 'Failed to delete project. Please try again.');
    } finally {
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">Project settings updated successfully!</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Settings */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Project Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                Base URL *
              </label>
              <input
                type="url"
                id="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="schedule" className="block text-sm font-medium text-gray-700 mb-1">
                Schedule (Cron Expression)
              </label>
              <input
                type="text"
                id="schedule"
                name="schedule"
                value={formData.schedule}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0 9 * * * (Daily at 9 AM)"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty to run manually only. Examples: "0 9 * * *" (daily at 9 AM), "0 */6 * * *" (every 6 hours)
              </p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={isSubmitting}
              />
              <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                Project is active
              </label>
            </div>
          </div>
        </div>

        {/* GitHub Integration */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">GitHub Integration</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="github_repo_owner" className="block text-sm font-medium text-gray-700 mb-1">
                  Repository Owner
                </label>
                <input
                  type="text"
                  id="github_repo_owner"
                  name="github_repo_owner"
                  value={formData.github_repo_owner}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="myorg"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="github_repo_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Repository Name
                </label>
                <input
                  type="text"
                  id="github_repo_name"
                  name="github_repo_name"
                  value={formData.github_repo_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="docs"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="github_branch" className="block text-sm font-medium text-gray-700 mb-1">
                  Branch
                </label>
                <input
                  type="text"
                  id="github_branch"
                  name="github_branch"
                  value={formData.github_branch}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="github_path" className="block text-sm font-medium text-gray-700 mb-1">
                  Path
                </label>
                <input
                  type="text"
                  id="github_path"
                  name="github_path"
                  value={formData.github_path}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="github_auto_commit"
                name="github_auto_commit"
                checked={formData.github_auto_commit}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={isSubmitting}
              />
              <label htmlFor="github_auto_commit" className="ml-2 text-sm text-gray-700">
                Automatically commit screenshot updates
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowDeleteConfirm(true)}
            className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
            disabled={isSubmitting}
          >
            Delete Project
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting || !formData.name.trim() || !formData.url.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Project</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete "{project.name}"? This action cannot be undone and will remove all screenshots and configuration.
              </p>
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Deleting...
                    </>
                  ) : (
                    'Delete Project'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}