'use client';

import { useState } from 'react';
import { Screenshot } from '@docshot/database';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';

interface ScreenshotGridProps {
  screenshots: Screenshot[];
  projectId: string;
}

export function ScreenshotGrid({ screenshots, projectId }: ScreenshotGridProps) {
  const [selectedScreenshot, setSelectedScreenshot] = useState<Screenshot | null>(null);

  if (screenshots.length === 0) {
    return (
      <EmptyState
        title="No screenshots configured"
        description="Add your first screenshot to start monitoring visual changes"
        actionLabel="Add Screenshot"
        onAction={() => {
          // This will be handled by the parent component
          const event = new CustomEvent('addScreenshot');
          window.dispatchEvent(event);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Screenshots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {screenshots.map((screenshot) => (
          <ScreenshotCard
            key={screenshot.id}
            screenshot={screenshot}
            onSelect={() => setSelectedScreenshot(screenshot)}
          />
        ))}
      </div>

      {/* Screenshot Detail Modal */}
      {selectedScreenshot && (
        <ScreenshotDetailModal
          screenshot={selectedScreenshot}
          onClose={() => setSelectedScreenshot(null)}
        />
      )}
    </div>
  );
}

interface ScreenshotCardProps {
  screenshot: Screenshot;
  onSelect: () => void;
}

function ScreenshotCard({ screenshot, onSelect }: ScreenshotCardProps) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
  };

  const statusIcons = {
    pending: '⏳',
    processing: '🔄',
    completed: '✅',
    failed: '❌',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={onSelect}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900 truncate">{screenshot.name}</h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[screenshot.status]}`}>
            {statusIcons[screenshot.status]} {screenshot.status}
          </span>
        </div>

        {/* Screenshot Preview */}
        <div className="mb-3">
          {screenshot.last_image_url ? (
            <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
              <img
                src={screenshot.last_image_url}
                alt={screenshot.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center">
              <div className="text-center">
                <span className="text-2xl">📸</span>
                <p className="text-xs text-gray-500 mt-1">No screenshot yet</p>
              </div>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-2 text-xs text-gray-500">
          <div className="flex justify-between">
            <span>URL:</span>
            <span className="truncate ml-2 max-w-32">{screenshot.url}</span>
          </div>
          <div className="flex justify-between">
            <span>Viewport:</span>
            <span>{screenshot.viewport_width}×{screenshot.viewport_height}</span>
          </div>
          {screenshot.selector && (
            <div className="flex justify-between">
              <span>Selector:</span>
              <code className="bg-gray-100 px-1 rounded text-xs truncate max-w-24">
                {screenshot.selector}
              </code>
            </div>
          )}
          {screenshot.last_captured_at && (
            <div className="flex justify-between">
              <span>Last captured:</span>
              <span>{new Date(screenshot.last_captured_at).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              // Handle edit
            }}
          >
            Edit
          </Button>
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={(e) => {
              e.stopPropagation();
              // Handle run screenshot
            }}
          >
            Run Now
          </Button>
        </div>
      </div>
    </div>
  );
}

interface ScreenshotDetailModalProps {
  screenshot: Screenshot;
  onClose: () => void;
}

function ScreenshotDetailModal({ screenshot, onClose }: ScreenshotDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{screenshot.name}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Screenshot Preview */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Preview</h4>
              {screenshot.last_image_url ? (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={screenshot.last_image_url}
                    alt={screenshot.name}
                    className="w-full h-auto"
                  />
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg h-64 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <span className="text-4xl">📸</span>
                    <p className="text-gray-500 mt-2">No screenshot available</p>
                    <p className="text-sm text-gray-400">Run this screenshot to generate an image</p>
                  </div>
                </div>
              )}
            </div>

            {/* Configuration Details */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Configuration</h4>
              <dl className="space-y-3">
                <div>
                  <dt className="text-xs font-medium text-gray-500">URL</dt>
                  <dd className="text-sm text-gray-900 mt-1">
                    <a href={screenshot.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      {screenshot.url}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-500">Viewport Size</dt>
                  <dd className="text-sm text-gray-900 mt-1">
                    {screenshot.viewport_width} × {screenshot.viewport_height} px
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-500">Full Page</dt>
                  <dd className="text-sm text-gray-900 mt-1">
                    {screenshot.full_page ? 'Yes' : 'No'}
                  </dd>
                </div>
                {screenshot.selector && (
                  <div>
                    <dt className="text-xs font-medium text-gray-500">CSS Selector</dt>
                    <dd className="text-sm text-gray-900 mt-1">
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {screenshot.selector}
                      </code>
                    </dd>
                  </div>
                )}
                {screenshot.wait_for_selector && (
                  <div>
                    <dt className="text-xs font-medium text-gray-500">Wait for Selector</dt>
                    <dd className="text-sm text-gray-900 mt-1">
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {screenshot.wait_for_selector}
                      </code>
                    </dd>
                  </div>
                )}
                {screenshot.wait_for_timeout && (
                  <div>
                    <dt className="text-xs font-medium text-gray-500">Wait Timeout</dt>
                    <dd className="text-sm text-gray-900 mt-1">
                      {screenshot.wait_for_timeout}ms
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs font-medium text-gray-500">Status</dt>
                  <dd className="text-sm text-gray-900 mt-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      screenshot.status === 'completed' ? 'bg-green-100 text-green-800' :
                      screenshot.status === 'failed' ? 'bg-red-100 text-red-800' :
                      screenshot.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {screenshot.status}
                    </span>
                  </dd>
                </div>
                {screenshot.last_captured_at && (
                  <div>
                    <dt className="text-xs font-medium text-gray-500">Last Captured</dt>
                    <dd className="text-sm text-gray-900 mt-1">
                      {new Date(screenshot.last_captured_at).toLocaleString()}
                    </dd>
                  </div>
                )}
                {screenshot.last_error && (
                  <div>
                    <dt className="text-xs font-medium text-gray-500">Last Error</dt>
                    <dd className="text-sm text-red-600 mt-1">
                      {screenshot.last_error}
                    </dd>
                  </div>
                )}
              </dl>

              {/* Actions */}
              <div className="mt-6 space-y-3">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Run Screenshot Now
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="w-full">
                    Edit Configuration
                  </Button>
                  <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}