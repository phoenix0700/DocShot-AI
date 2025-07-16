'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useUser } from '@clerk/nextjs';
import { getSupabaseClient } from '@docshot/database';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface CreateScreenshotModalProps {
  projectId: string;
  onClose: () => void;
  onScreenshotCreated: () => void;
}

export function CreateScreenshotModal({ projectId, onClose, onScreenshotCreated }: CreateScreenshotModalProps) {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    selector: '',
    viewport_width: 1920,
    viewport_height: 1080,
    full_page: true,
    wait_for_selector: '',
    wait_for_timeout: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      setError('User not authenticated');
      return;
    }

    if (!formData.name.trim()) {
      setError('Screenshot name is required');
      return;
    }

    if (!formData.url.trim()) {
      setError('URL is required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const supabase = getSupabaseClient();
      
      const { error: supabaseError } = await supabase.withUserContext(user.id, async (client) => {
        return client
          .from('screenshots')
          .insert({
            project_id: projectId,
            name: formData.name.trim(),
            url: formData.url.trim(),
            selector: formData.selector.trim() || null,
            viewport_width: formData.viewport_width,
            viewport_height: formData.viewport_height,
            full_page: formData.full_page,
            wait_for_selector: formData.wait_for_selector.trim() || null,
            wait_for_timeout: formData.wait_for_timeout ? parseInt(formData.wait_for_timeout) : null,
            status: 'pending',
            retry_count: 0,
          });
      });

      if (supabaseError) {
        throw supabaseError;
      }

      onScreenshotCreated();
    } catch (err: any) {
      console.error('Error creating screenshot:', err);
      setError(err.message || 'Failed to create screenshot. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
                     type === 'number' ? parseInt(value) || 0 : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    if (error) setError(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Add Screenshot</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              disabled={isSubmitting}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Basic Configuration */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900">Basic Configuration</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Screenshot Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Homepage, Login Page, etc."
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                    URL *
                  </label>
                  <input
                    type="url"
                    id="url"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/page"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="selector" className="block text-sm font-medium text-gray-700 mb-1">
                  CSS Selector (Optional)
                </label>
                <input
                  type="text"
                  id="selector"
                  name="selector"
                  value={formData.selector}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder=".header, #main-content, [data-testid='component']"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to capture the full page, or specify a CSS selector to capture a specific element
                </p>
              </div>
            </div>

            {/* Viewport Configuration */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900">Viewport Configuration</h4>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="viewport_width" className="block text-sm font-medium text-gray-700 mb-1">
                    Width (px)
                  </label>
                  <input
                    type="number"
                    id="viewport_width"
                    name="viewport_width"
                    value={formData.viewport_width}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="320"
                    max="3840"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label htmlFor="viewport_height" className="block text-sm font-medium text-gray-700 mb-1">
                    Height (px)
                  </label>
                  <input
                    type="number"
                    id="viewport_height"
                    name="viewport_height"
                    value={formData.viewport_height}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="240"
                    max="2160"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex items-center pt-6">
                  <input
                    type="checkbox"
                    id="full_page"
                    name="full_page"
                    checked={formData.full_page}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={isSubmitting}
                  />
                  <label htmlFor="full_page" className="ml-2 text-sm text-gray-700">
                    Full page screenshot
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-3 rounded-md">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Common Resolutions
                  </label>
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, viewport_width: 1920, viewport_height: 1080 }))}
                      className="text-xs text-blue-600 hover:text-blue-800 block"
                    >
                      1920×1080 (Desktop)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, viewport_width: 1366, viewport_height: 768 }))}
                      className="text-xs text-blue-600 hover:text-blue-800 block"
                    >
                      1366×768 (Laptop)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, viewport_width: 768, viewport_height: 1024 }))}
                      className="text-xs text-blue-600 hover:text-blue-800 block"
                    >
                      768×1024 (Tablet)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, viewport_width: 375, viewport_height: 667 }))}
                      className="text-xs text-blue-600 hover:text-blue-800 block"
                    >
                      375×667 (Mobile)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Options */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900">Advanced Options</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="wait_for_selector" className="block text-sm font-medium text-gray-700 mb-1">
                    Wait for Selector
                  </label>
                  <input
                    type="text"
                    id="wait_for_selector"
                    name="wait_for_selector"
                    value={formData.wait_for_selector}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder=".loading-complete, [data-loaded='true']"
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Wait for this element to appear before taking screenshot
                  </p>
                </div>

                <div>
                  <label htmlFor="wait_for_timeout" className="block text-sm font-medium text-gray-700 mb-1">
                    Wait Timeout (ms)
                  </label>
                  <input
                    type="number"
                    id="wait_for_timeout"
                    name="wait_for_timeout"
                    value={formData.wait_for_timeout}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1000"
                    min="0"
                    max="30000"
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Additional wait time before screenshot
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.name.trim() || !formData.url.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Creating...
                </>
              ) : (
                'Create Screenshot'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}