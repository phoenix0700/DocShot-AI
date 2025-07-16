'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ScreenshotItem } from './ScreenshotItem';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { EmptyState } from '../ui/EmptyState';
import { Button } from '../ui/Button';

interface Screenshot {
  id: string;
  project_id: string;
  name: string;
  url: string;
  selector: string | null;
  image_url: string | null;
  status: 'pending' | 'captured' | 'failed';
  approval_status: 'pending' | 'approved' | 'rejected';
  approved_by: string | null;
  approved_at: string | null;
  rejection_reason: string | null;
  github_url: string | null;
  created_at: string;
  updated_at: string;
}

interface ScreenshotListProps {
  projectId: string;
  userId: string;
}

export function ScreenshotList({ projectId, userId }: ScreenshotListProps) {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'captured' | 'pending' | 'failed'>('all');

  useEffect(() => {
    loadScreenshots();
  }, [projectId]);

  const loadScreenshots = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('screenshots')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }

      setScreenshots(data || []);
    } catch (err) {
      console.error('Error loading screenshots:', err);
      setError('Failed to load screenshots. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleScreenshotDeleted = (screenshotId: string) => {
    setScreenshots((prev) => prev.filter((s) => s.id !== screenshotId));
  };

  const handleScreenshotUpdated = (updatedScreenshot: Screenshot) => {
    setScreenshots((prev) =>
      prev.map((s) => (s.id === updatedScreenshot.id ? updatedScreenshot : s))
    );
  };

  const filteredScreenshots = screenshots.filter((screenshot) => {
    if (filter === 'all') return true;
    return screenshot.status === filter;
  });

  const getStatusCount = (status: 'captured' | 'pending' | 'failed') => {
    return screenshots.filter((s) => s.status === status).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 py-12">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700">{error}</p>
          <Button onClick={loadScreenshots} variant="outline" size="sm" className="mt-2">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {[
            { key: 'all', label: 'All', count: screenshots.length },
            { key: 'captured', label: 'Captured', count: getStatusCount('captured') },
            { key: 'pending', label: 'Pending', count: getStatusCount('pending') },
            { key: 'failed', label: 'Failed', count: getStatusCount('failed') },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                filter === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    filter === tab.key ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Screenshots */}
      {filteredScreenshots.length === 0 ? (
        <div className="px-6">
          <EmptyState
            title={filter === 'all' ? 'No screenshots yet' : `No ${filter} screenshots`}
            description={
              filter === 'all'
                ? 'Upload a YAML configuration or create screenshots manually to get started.'
                : `No screenshots with status "${filter}" found.`
            }
            actionLabel={filter === 'all' ? 'Add Screenshot' : undefined}
            onAction={
              filter === 'all'
                ? () => {
                    /* TODO: Open add screenshot modal */
                  }
                : undefined
            }
            icon={
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            }
          />
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {filteredScreenshots.map((screenshot) => (
            <ScreenshotItem
              key={screenshot.id}
              screenshot={screenshot}
              onDeleted={() => handleScreenshotDeleted(screenshot.id)}
              onUpdated={handleScreenshotUpdated}
              userId={userId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
