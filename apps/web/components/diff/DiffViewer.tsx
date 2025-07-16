'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface DiffViewerProps {
  currentImageUrl: string;
  previousImageUrl?: string;
  diffImageUrl?: string;
  diffData?: {
    pixelDiff: number;
    percentageDiff: number;
    totalPixels: number;
    significant?: boolean;
    dimensions?: {
      width: number;
      height: number;
    };
  };
  onClose: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  title?: string;
  screenshotMetadata?: {
    url?: string;
    selector?: string;
    timestamp?: string;
    viewport?: string;
  };
}

type ViewMode = 'side-by-side' | 'overlay' | 'diff-only';

export function DiffViewer({
  currentImageUrl,
  previousImageUrl,
  diffImageUrl,
  diffData,
  onClose,
  onApprove,
  onReject,
  title = 'Screenshot Comparison',
  screenshotMetadata
}: DiffViewerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('side-by-side');
  const [overlayOpacity, setOverlayOpacity] = useState(50);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [imageErrors, setImageErrors] = useState({
    current: false,
    previous: false,
    diff: false,
  });

  const hasComparison = previousImageUrl && diffData;
  const hasDiff = diffImageUrl && diffData;

  const handleImageLoad = () => {
    setLoading(false);
  };

  const handleImageError = (imageType: 'current' | 'previous' | 'diff') => {
    setImageErrors(prev => ({ ...prev, [imageType]: true }));
    setLoading(false);
  };

  const renderImageWithFallback = (
    src: string,
    alt: string,
    onError: () => void,
    className?: string
  ) => (
    <div className={`relative bg-gray-100 rounded-lg overflow-hidden ${className}`}>
      <div 
        className="overflow-auto"
        style={{ 
          transform: `scale(${zoom})`,
          transformOrigin: 'top left',
          transition: 'transform 0.2s ease'
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={800}
          height={600}
          className="w-full h-auto object-contain"
          onLoad={handleImageLoad}
          onError={onError}
        />
      </div>
    </div>
  );

  const renderErrorState = (message: string) => (
    <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
      <div className="text-center">
        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.863-.833-2.633 0L4.18 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <p className="text-gray-500">{message}</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-7xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <div className="mt-1 space-y-1">
              {hasComparison && diffData && (
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    diffData.significant !== false && diffData.percentageDiff > 1 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {diffData.percentageDiff.toFixed(2)}% changed
                  </span>
                  <span className="text-sm text-gray-500">
                    {diffData.pixelDiff.toLocaleString()} pixels
                  </span>
                  {diffData.dimensions && (
                    <span className="text-sm text-gray-500">
                      {diffData.dimensions.width}×{diffData.dimensions.height}
                    </span>
                  )}
                </div>
              )}
              {screenshotMetadata && (
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  {screenshotMetadata.url && (
                    <span className="truncate max-w-xs">
                      📍 {screenshotMetadata.url}
                    </span>
                  )}
                  {screenshotMetadata.selector && (
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      {screenshotMetadata.selector}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Controls */}
        <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* View Mode Tabs */}
              <div className="flex bg-white rounded-lg p-1 shadow-sm">
                <button
                  onClick={() => setViewMode('side-by-side')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    viewMode === 'side-by-side'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Side by Side
                </button>
                {hasComparison && (
                  <button
                    onClick={() => setViewMode('overlay')}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                      viewMode === 'overlay'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    Overlay
                  </button>
                )}
                {hasDiff && (
                  <button
                    onClick={() => setViewMode('diff-only')}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                      viewMode === 'diff-only'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    Diff Only
                  </button>
                )}
              </div>

              {/* Overlay Opacity Control */}
              {viewMode === 'overlay' && hasComparison && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Opacity:</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={overlayOpacity}
                    onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                    className="w-20"
                  />
                  <span className="text-sm text-gray-600 w-8">{overlayOpacity}%</span>
                </div>
              )}

              {/* Zoom Controls */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Zoom:</span>
                <button
                  onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
                  className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
                  disabled={zoom <= 0.5}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="text-sm text-gray-600 w-12 text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => setZoom(Math.min(3, zoom + 0.25))}
                  className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
                  disabled={zoom >= 3}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
                <button
                  onClick={() => setZoom(1)}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            {(onApprove || onReject) && hasComparison && diffData && diffData.percentageDiff > 0 && (
              <div className="flex items-center space-x-3">
                {onReject && (
                  <Button
                    onClick={onReject}
                    variant="outline"
                    className="text-red-600 hover:text-red-700 border-red-200"
                  >
                    Reject Changes
                  </Button>
                )}
                {onApprove && (
                  <Button
                    onClick={onApprove}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Approve Changes
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {loading && (
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner size="large" />
            </div>
          )}

          {/* Side by Side View */}
          {viewMode === 'side-by-side' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Current Screenshot</h4>
                {imageErrors.current ? (
                  renderErrorState('Failed to load current image')
                ) : (
                  renderImageWithFallback(
                    currentImageUrl,
                    'Current screenshot',
                    () => handleImageError('current')
                  )
                )}
              </div>
              
              {hasComparison && previousImageUrl && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Previous Screenshot</h4>
                  {imageErrors.previous ? (
                    renderErrorState('Failed to load previous image')
                  ) : (
                    renderImageWithFallback(
                      previousImageUrl,
                      'Previous screenshot',
                      () => handleImageError('previous')
                    )
                  )}
                </div>
              )}
            </div>
          )}

          {/* Overlay View */}
          {viewMode === 'overlay' && hasComparison && previousImageUrl && (
            <div className="relative max-w-4xl mx-auto">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Overlay Comparison</h4>
              <div className="relative">
                {/* Base Image (Previous) */}
                {!imageErrors.previous && (
                  <div className="relative">
                    {renderImageWithFallback(
                      previousImageUrl,
                      'Previous screenshot',
                      () => handleImageError('previous')
                    )}
                  </div>
                )}
                
                {/* Overlay Image (Current) */}
                {!imageErrors.current && (
                  <div 
                    className="absolute inset-0"
                    style={{ opacity: overlayOpacity / 100 }}
                  >
                    {renderImageWithFallback(
                      currentImageUrl,
                      'Current screenshot',
                      () => handleImageError('current')
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Diff Only View */}
          {viewMode === 'diff-only' && hasDiff && diffImageUrl && (
            <div className="max-w-4xl mx-auto">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Visual Differences</h4>
              {imageErrors.diff ? (
                renderErrorState('Failed to load diff image')
              ) : (
                renderImageWithFallback(
                  diffImageUrl,
                  'Visual differences',
                  () => handleImageError('diff')
                )
              )}
            </div>
          )}

          {/* No Comparison Available */}
          {!hasComparison && viewMode !== 'side-by-side' && (
            <div className="text-center py-12">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500">No comparison data available</p>
              <p className="text-sm text-gray-400 mt-1">
                This is the first screenshot or no previous version exists
              </p>
            </div>
          )}
        </div>

        {/* Footer with Statistics */}
        {hasComparison && diffData && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Pixels</p>
                <p className="text-lg font-bold text-gray-900">
                  {diffData.totalPixels.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Changed Pixels</p>
                <p className="text-lg font-bold text-gray-900">
                  {diffData.pixelDiff.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Difference</p>
                <p className={`text-lg font-bold ${
                  diffData.percentageDiff > 1 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {diffData.percentageDiff.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}