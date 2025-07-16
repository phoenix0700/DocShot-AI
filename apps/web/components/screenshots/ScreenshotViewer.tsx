'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '../ui/Button';

interface ScreenshotViewerProps {
  entry: {
    id: string;
    screenshotName: string;
    projectName: string;
    capturedAt: string;
    status: 'success' | 'failed' | 'processing';
    imageUrl?: string;
    changeDetected: boolean;
    changeScore?: number;
    metadata: {
      viewport: { width: number; height: number };
      fullPage: boolean;
      selector?: string;
      url: string;
      fileSize: number;
      duration: number;
    };
    approvalStatus?: 'pending' | 'approved' | 'rejected';
    approvedBy?: string;
    approvedAt?: string;
  };
  onClose: () => void;
  onDiffView?: () => void;
}

export function ScreenshotViewer({ entry, onClose, onDiffView }: ScreenshotViewerProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleDownload = () => {
    if (entry.imageUrl) {
      const link = document.createElement('a');
      link.href = entry.imageUrl;
      link.download = `${entry.screenshotName}-${new Date(entry.capturedAt).toISOString().split('T')[0]}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 25));
  };

  const resetZoom = () => {
    setZoomLevel(100);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{entry.screenshotName}</h2>
            <p className="text-sm text-gray-600">{entry.projectName}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Zoom Controls */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={zoomOut}
                disabled={zoomLevel <= 25}
                className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="text-sm font-medium text-gray-700 min-w-[3rem] text-center">
                {zoomLevel}%
              </span>
              <button
                onClick={zoomIn}
                disabled={zoomLevel >= 200}
                className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <button
                onClick={resetZoom}
                className="px-2 py-1 text-xs text-gray-600 hover:text-gray-900"
              >
                Reset
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              {entry.changeDetected && onDiffView && (
                <Button onClick={onDiffView} className="bg-orange-500 hover:bg-orange-600">
                  View Diff
                </Button>
              )}
              
              <Button onClick={handleDownload} variant="outline">
                Download
              </Button>
              
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
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Image Area */}
          <div className="flex-1 overflow-auto bg-gray-50 p-4">
            <div className="flex items-center justify-center min-h-full">
              {entry.status === 'failed' ? (
                <div className="text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Screenshot Failed</h3>
                  <p className="text-gray-500">This screenshot capture failed to complete.</p>
                </div>
              ) : entry.status === 'processing' ? (
                <div className="text-center">
                  <svg className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Processing</h3>
                  <p className="text-gray-500">Screenshot is being captured...</p>
                </div>
              ) : entry.imageUrl ? (
                <div 
                  className="relative inline-block border border-gray-200 rounded-lg overflow-hidden bg-white shadow-lg"
                  style={{ transform: `scale(${zoomLevel / 100})` }}
                >
                  {!imageLoaded && !imageError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <svg className="w-8 h-8 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  )}
                  
                  {imageError ? (
                    <div className="w-96 h-64 flex items-center justify-center bg-gray-100 text-gray-500">
                      <div className="text-center">
                        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p>Failed to load image</p>
                      </div>
                    </div>
                  ) : (
                    // Placeholder for actual image
                    <div 
                      className="bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center"
                      style={{ 
                        width: `${Math.max(entry.metadata.viewport.width * 0.5, 400)}px`,
                        height: `${Math.max(entry.metadata.viewport.height * 0.5, 300)}px`
                      }}
                      onLoad={() => setImageLoaded(true)}
                      onError={() => setImageError(true)}
                    >
                      <div className="text-center text-gray-600">
                        <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-lg font-medium">Screenshot Preview</p>
                        <p className="text-sm">{entry.metadata.viewport.width} × {entry.metadata.viewport.height}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Image Available</h3>
                  <p className="text-gray-500">Screenshot image is not available.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 bg-gray-50 border-l border-gray-200 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Status */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Status</h3>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    entry.status === 'success' ? 'bg-green-500' :
                    entry.status === 'failed' ? 'bg-red-500' :
                    'bg-blue-500'
                  }`}></div>
                  <span className="text-sm text-gray-700 capitalize">{entry.status}</span>
                </div>
                
                {entry.changeDetected && (
                  <div className="mt-2 flex items-center space-x-2">
                    <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-orange-700">
                      {entry.changeScore?.toFixed(1)}% change detected
                    </span>
                  </div>
                )}
              </div>

              {/* Details */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Details</h3>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="text-gray-500">Captured</dt>
                    <dd className="text-gray-900">{formatDistanceToNow(new Date(entry.capturedAt), { addSuffix: true })}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">URL</dt>
                    <dd className="text-gray-900 break-all">{entry.metadata.url}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Viewport</dt>
                    <dd className="text-gray-900">{entry.metadata.viewport.width} × {entry.metadata.viewport.height}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Type</dt>
                    <dd className="text-gray-900">{entry.metadata.fullPage ? 'Full page' : 'Element'}</dd>
                  </div>
                  {entry.metadata.selector && (
                    <div>
                      <dt className="text-gray-500">Selector</dt>
                      <dd className="text-gray-900 font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {entry.metadata.selector}
                      </dd>
                    </div>
                  )}
                  {entry.metadata.fileSize > 0 && (
                    <div>
                      <dt className="text-gray-500">File size</dt>
                      <dd className="text-gray-900">{formatFileSize(entry.metadata.fileSize)}</dd>
                    </div>
                  )}
                  {entry.metadata.duration > 0 && (
                    <div>
                      <dt className="text-gray-500">Capture time</dt>
                      <dd className="text-gray-900">{(entry.metadata.duration / 1000).toFixed(1)} seconds</dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Approval Status */}
              {entry.approvalStatus && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Approval</h3>
                  <div className={`p-3 rounded-lg ${
                    entry.approvalStatus === 'approved' ? 'bg-green-50 border border-green-200' :
                    entry.approvalStatus === 'rejected' ? 'bg-red-50 border border-red-200' :
                    'bg-yellow-50 border border-yellow-200'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        entry.approvalStatus === 'approved' ? 'bg-green-500' :
                        entry.approvalStatus === 'rejected' ? 'bg-red-500' :
                        'bg-yellow-500'
                      }`}></div>
                      <span className={`text-sm font-medium ${
                        entry.approvalStatus === 'approved' ? 'text-green-800' :
                        entry.approvalStatus === 'rejected' ? 'text-red-800' :
                        'text-yellow-800'
                      }`}>
                        {entry.approvalStatus === 'approved' ? 'Approved' :
                         entry.approvalStatus === 'rejected' ? 'Rejected' :
                         'Pending Review'}
                      </span>
                    </div>
                    
                    {entry.approvedBy && (
                      <p className={`text-xs mt-1 ${
                        entry.approvalStatus === 'approved' ? 'text-green-600' :
                        entry.approvalStatus === 'rejected' ? 'text-red-600' :
                        'text-yellow-600'
                      }`}>
                        By {entry.approvedBy} {formatDistanceToNow(new Date(entry.approvedAt!), { addSuffix: true })}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}