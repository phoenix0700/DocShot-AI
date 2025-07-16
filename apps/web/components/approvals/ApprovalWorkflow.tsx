'use client';

import { useState } from 'react';
// import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface ApprovalWorkflowProps {
  screenshotId: string;
  currentStatus: 'pending' | 'approved' | 'rejected';
  // eslint-disable-next-line no-unused-vars
  onStatusChange: (status: 'pending' | 'approved' | 'rejected') => void;
  userId: string;
  diffData?: {
    pixelDiff: number;
    percentageDiff: number;
    totalPixels: number;
  };
  className?: string;
}

export function ApprovalWorkflow({
  screenshotId,
  currentStatus,
  onStatusChange,
  diffData,
  className = '',
}: ApprovalWorkflowProps) {
  // TODO: Implement approval workflow logic
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = async () => {
    try {
      setIsProcessing(true);

      const response = await fetch('/api/screenshots/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          screenshotId,
          action: 'approved',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to approve screenshot');
      }

      onStatusChange('approved');
    } catch (error) {
      console.error('Error approving screenshot:', error);
      alert('Failed to approve screenshot. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }

    try {
      setIsProcessing(true);

      const response = await fetch('/api/screenshots/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          screenshotId,
          action: 'rejected',
          reason: rejectionReason.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reject screenshot');
      }

      onStatusChange('rejected');
      setShowRejectModal(false);
      setRejectionReason('');
    } catch (error) {
      console.error('Error rejecting screenshot:', error);
      alert('Failed to reject screenshot. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = async () => {
    try {
      setIsProcessing(true);

      const response = await fetch('/api/screenshots/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          screenshotId,
          action: 'pending',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset screenshot status');
      }

      onStatusChange('pending');
    } catch (error) {
      console.error('Error resetting screenshot status:', error);
      alert('Failed to reset screenshot status. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = () => {
    switch (currentStatus) {
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            Rejected
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            Pending
          </span>
        );
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getStatusBadge()}

          {diffData && (
            <span className="text-xs text-gray-500">
              {diffData.percentageDiff.toFixed(2)}% changed
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {currentStatus === 'pending' && (
            <>
              <Button
                onClick={handleApprove}
                disabled={isProcessing}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isProcessing ? <LoadingSpinner size="sm" /> : 'Approve'}
              </Button>
              <Button
                onClick={() => setShowRejectModal(true)}
                disabled={isProcessing}
                size="sm"
                variant="outline"
                className="text-red-600 hover:text-red-700 border-red-200"
              >
                Reject
              </Button>
            </>
          )}

          {(currentStatus === 'approved' || currentStatus === 'rejected') && (
            <Button
              onClick={handleReset}
              disabled={isProcessing}
              size="sm"
              variant="outline"
              className="text-gray-600 hover:text-gray-700"
            >
              {isProcessing ? <LoadingSpinner size="sm" /> : 'Reset'}
            </Button>
          )}
        </div>
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Reject Screenshot</h3>
            </div>

            <div className="px-6 py-4">
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                Reason for rejection *
              </label>
              <textarea
                id="reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Explain why this screenshot is being rejected..."
                required
              />
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <Button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                variant="outline"
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                onClick={handleReject}
                disabled={isProcessing || !rejectionReason.trim()}
                className="bg-red-600 hover:bg-red-700"
              >
                {isProcessing ? <LoadingSpinner size="sm" /> : 'Reject'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
