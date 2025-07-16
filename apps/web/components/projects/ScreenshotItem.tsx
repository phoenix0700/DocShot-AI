'use client';

import { useState } from 'react';
import Image from 'next/image';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { DiffViewer } from '../diff/DiffViewer';
import { ApprovalWorkflow } from '../approvals/ApprovalWorkflow';
import { ApprovalHistory } from '../approvals/ApprovalHistory';
import { formatDistanceToNow } from 'date-fns';

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
  previous_image_url?: string | null;
  diff_image_url?: string | null;
  diff_data?: {
    pixelDiff: number;
    percentageDiff: number;
    totalPixels: number;
    significant: boolean;
    dimensions: {
      width: number;
      height: number;
    };
  };
  viewport?: string | null;
}

interface ScreenshotItemProps {
  screenshot: Screenshot;
  onDeleted: () => void;
  // eslint-disable-next-line no-unused-vars
  onUpdated: (updatedScreenshot: Screenshot) => void;
  userId: string;
}

export function ScreenshotItem({ screenshot, onDeleted, onUpdated, userId }: ScreenshotItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDiffViewer, setShowDiffViewer] = useState(false);
  const [showApprovalHistory, setShowApprovalHistory] = useState(false);

  const handleDelete = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    try {
      setIsDeleting(true);

      const { error } = await supabase.from('screenshots').delete().eq('id', screenshot.id);

      if (error) {
        throw error;
      }

      onDeleted();
    } catch (error) {
      console.error('Error deleting screenshot:', error);
      alert('Failed to delete screenshot. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleApprovalStatusChange = (newStatus: 'pending' | 'approved' | 'rejected') => {
    const updatedScreenshot = {
      ...screenshot,
      approval_status: newStatus,
      approved_by: newStatus === 'approved' ? userId : null,
      approved_at: newStatus === 'approved' ? new Date().toISOString() : null,
      rejection_reason: newStatus === 'rejected' ? 'User rejected' : null,
    };
    onUpdated(updatedScreenshot);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'captured':
        return (
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'failed':
        return (
          <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'pending':
      default:
        return (
          <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'captured':
        return 'text-green-600 bg-green-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      case 'pending':
      default:
        return 'text-yellow-600 bg-yellow-50';
    }
  };

  return (
    <div className="px-6 py-4 hover:bg-gray-50">
      <div className="flex items-start space-x-4">
        {/* Screenshot Thumbnail */}
        <div className="flex-shrink-0 w-24 h-16 bg-gray-200 rounded-lg overflow-hidden">
          {screenshot.image_url ? (
            <Image
              src={screenshot.image_url}
              alt={screenshot.name}
              width={96}
              height={64}
              className="w-full h-full object-cover cursor-pointer hover:opacity-80"
              onClick={() => setShowDiffViewer(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Screenshot Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 truncate">{screenshot.name}</h3>
              <p className="text-sm text-gray-500 truncate mt-1">{screenshot.url}</p>
              {screenshot.selector && (
                <p className="text-xs text-gray-400 mt-1">Selector: {screenshot.selector}</p>
              )}
            </div>

            <div className="flex items-center space-x-2 ml-4">
              {/* Diff Status Badge */}
              {screenshot.diff_data && screenshot.diff_data.significant && (
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {screenshot.diff_data.percentageDiff.toFixed(1)}% changed
                </div>
              )}

              <div
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(screenshot.status)}`}
              >
                {getStatusIcon(screenshot.status)}
                <span className="ml-1.5 capitalize">{screenshot.status}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-6 text-xs text-gray-500">
              <span>
                Created {formatDistanceToNow(new Date(screenshot.created_at), { addSuffix: true })}
              </span>
              <span>
                Updated {formatDistanceToNow(new Date(screenshot.updated_at), { addSuffix: true })}
              </span>
              {screenshot.github_url && (
                <a
                  href={screenshot.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-gray-600 hover:text-gray-900"
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  GitHub
                </a>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {screenshot.status === 'captured' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDiffViewer(true)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  View
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowApprovalHistory(!showApprovalHistory)}
                className="text-gray-600 hover:text-gray-700"
              >
                History
              </Button>

              <Button variant="outline" size="sm" className="text-gray-600 hover:text-gray-700">
                Retry
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className={`${
                  showDeleteConfirm
                    ? 'text-red-600 hover:text-red-700 border-red-200'
                    : 'text-gray-600 hover:text-gray-700'
                }`}
              >
                {isDeleting ? '...' : showDeleteConfirm ? 'Confirm' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Approval Workflow */}
      {screenshot.status === 'captured' && (
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
          <ApprovalWorkflow
            screenshotId={screenshot.id}
            currentStatus={screenshot.approval_status}
            onStatusChange={handleApprovalStatusChange}
            userId={userId}
          />
        </div>
      )}

      {/* Approval History */}
      {showApprovalHistory && (
        <div className="px-6 py-4 border-t border-gray-100">
          <ApprovalHistory screenshotId={screenshot.id} />
        </div>
      )}

      {/* Diff Viewer Modal */}
      {showDiffViewer && screenshot.image_url && (
        <DiffViewer
          currentImageUrl={screenshot.image_url}
          previousImageUrl={screenshot.previous_image_url || undefined}
          diffImageUrl={screenshot.diff_image_url || undefined}
          diffData={screenshot.diff_data}
          title={screenshot.name}
          screenshotMetadata={{
            url: screenshot.url,
            selector: screenshot.selector || undefined,
            timestamp: screenshot.updated_at,
            viewport: screenshot.viewport || undefined,
          }}
          onClose={() => setShowDiffViewer(false)}
          onApprove={() => handleApprovalStatusChange('approved')}
          onReject={() => handleApprovalStatusChange('rejected')}
        />
      )}
    </div>
  );
}
