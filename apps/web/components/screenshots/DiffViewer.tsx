'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '../ui/Button';

interface DiffViewerProps {
  entry: {
    id: string;
    screenshotName: string;
    projectName: string;
    capturedAt: string;
    imageUrl?: string;
    diffUrl?: string;
    previousImageUrl?: string;
    changeDetected: boolean;
    changeScore?: number;
    metadata: {
      viewport: { width: number; height: number };
      url: string;
    };
    approvalStatus?: 'pending' | 'approved' | 'rejected';
  };
  onClose: () => void;
  onApproval: (entryId: string, action: 'approve' | 'reject') => void;
}

export function DiffViewer({ entry, onClose, onApproval }: DiffViewerProps) {
  const [viewMode, setViewMode] = useState<'side-by-side' | 'overlay' | 'diff-only'>('side-by-side');
  const [overlayOpacity, setOverlayOpacity] = useState(50);

  const handleApproval = (action: 'approve' | 'reject') => {
    onApproval(entry.id, action);
    onClose();
  };

  const renderSideBySide = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Previous Version */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-900">Previous Version</h3>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">Previous Screenshot</p>
            </div>
          </div>
        </div>
      </div>

      {/* Current Version */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-900">Current Version</h3>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <div className="text-center text-blue-600">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">Current Screenshot</p>
            </div>
          </div>
        </div>
      </div>

      {/* Diff Visualization */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-900">
          Changes Detected ({entry.changeScore?.toFixed(1)}%)
        </h3>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="aspect-video bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
            <div className="text-center text-red-600">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-sm">Visual Diff</p>
              <p className="text-xs">Red areas show changes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOverlay = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Overlay Comparison</h3>
        <div className="flex items-center space-x-3">
          <label className="text-sm text-gray-600">Opacity:</label>
          <input
            type="range"
            min="0"
            max="100"
            value={overlayOpacity}
            onChange={(e) => setOverlayOpacity(Number(e.target.value))}
            className="w-24"
          />
          <span className="text-sm text-gray-600 w-8">{overlayOpacity}%</span>
        </div>
      </div>

      <div className="relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-lg font-medium">Overlay View</p>
            <p className="text-sm">Previous version overlaid with current</p>
          </div>
        </div>

        {/* Overlay Image */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center"
          style={{ opacity: overlayOpacity / 100 }}
        >
          <div className="text-center text-blue-600">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-lg font-medium">Current Version</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDiffOnly = () => (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-900">
        Difference Visualization ({entry.changeScore?.toFixed(1)}% changed)
      </h3>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="aspect-video bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
          <div className="text-center text-red-600">
            <svg className="w-20 h-20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-xl font-medium">Visual Differences</p>
            <p className="text-sm">Highlighted areas show detected changes</p>
            <div className="mt-4 flex items-center justify-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>Removed</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Added</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span>Modified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Change Summary</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-red-600">15</div>
            <div className="text-xs text-gray-600">Pixels Removed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">23</div>
            <div className="text-xs text-gray-600">Pixels Added</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">142</div>
            <div className="text-xs text-gray-600">Pixels Modified</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Visual Diff Comparison</h2>
            <p className="text-sm text-gray-600">{entry.screenshotName} - {entry.projectName}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('side-by-side')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'side-by-side'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Side by Side
              </button>
              <button
                onClick={() => setViewMode('overlay')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'overlay'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Overlay
              </button>
              <button
                onClick={() => setViewMode('diff-only')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'diff-only'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Diff Only
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {viewMode === 'side-by-side' && renderSideBySide()}
          {viewMode === 'overlay' && renderOverlay()}
          {viewMode === 'diff-only' && renderDiffOnly()}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <p>Captured {formatDistanceToNow(new Date(entry.capturedAt), { addSuffix: true })}</p>
              <p>{entry.metadata.viewport.width} × {entry.metadata.viewport.height} • {entry.metadata.url}</p>
            </div>

            {/* Approval Actions */}
            {entry.approvalStatus === 'pending' && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">Approve these changes?</span>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleApproval('reject')}
                    variant="outline"
                    className="text-red-600 hover:text-red-700 border-red-200"
                  >
                    Reject Changes
                  </Button>
                  <Button
                    onClick={() => handleApproval('approve')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Approve Changes
                  </Button>
                </div>
              </div>
            )}
            
            {entry.approvalStatus === 'approved' && (
              <div className="flex items-center space-x-2 text-green-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Changes Approved</span>
              </div>
            )}
            
            {entry.approvalStatus === 'rejected' && (
              <div className="flex items-center space-x-2 text-red-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Changes Rejected</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}