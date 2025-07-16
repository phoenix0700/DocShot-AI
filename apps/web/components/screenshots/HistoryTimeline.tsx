'use client';

import { formatDistanceToNow } from 'date-fns';
import { Button } from '../ui/Button';

interface HistoryEntry {
  id: string;
  screenshotId: string;
  screenshotName: string;
  projectId: string;
  projectName: string;
  capturedAt: string;
  status: 'success' | 'failed' | 'processing';
  imageUrl?: string;
  diffUrl?: string;
  changeDetected: boolean;
  changeScore?: number;
  previousImageUrl?: string;
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
}

interface HistoryTimelineProps {
  entries: HistoryEntry[];
  viewMode: 'timeline' | 'grid' | 'list';
  onEntrySelect: (entry: HistoryEntry) => void;
  onDiffView: (entry: HistoryEntry) => void;
  onApproval: (entryId: string, action: 'approve' | 'reject') => void;
}

export function HistoryTimeline({ 
  entries, 
  viewMode, 
  onEntrySelect, 
  onDiffView, 
  onApproval 
}: HistoryTimelineProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return (
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'failed':
        return (
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'processing':
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const renderTimelineView = () => (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
      
      <div className="space-y-8">
        {entries.map((entry, index) => (
          <div key={entry.id} className="relative flex items-start space-x-4">
            {/* Timeline dot */}
            <div className="relative z-10 flex-shrink-0">
              {getStatusIcon(entry.status)}
            </div>
            
            {/* Content */}
            <div className="flex-1 bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{entry.screenshotName}</h3>
                    {entry.changeDetected && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {entry.changeScore?.toFixed(1)}% changed
                      </span>
                    )}
                    
                    {entry.approvalStatus && (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        entry.approvalStatus === 'approved' ? 'bg-green-100 text-green-800' :
                        entry.approvalStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {entry.approvalStatus === 'approved' ? '✓ Approved' :
                         entry.approvalStatus === 'rejected' ? '✗ Rejected' :
                         '⏳ Pending Review'}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{entry.projectName}</p>
                  <p className="text-sm text-gray-500 mb-4">{entry.metadata.url}</p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{formatDistanceToNow(new Date(entry.capturedAt), { addSuffix: true })}</span>
                    <span>{entry.metadata.viewport.width}×{entry.metadata.viewport.height}</span>
                    {entry.metadata.fileSize > 0 && <span>{formatFileSize(entry.metadata.fileSize)}</span>}
                    {entry.metadata.duration > 0 && <span>{(entry.metadata.duration / 1000).toFixed(1)}s</span>}
                  </div>
                  
                  {entry.approvedBy && (
                    <p className="text-xs text-gray-500 mt-2">
                      {entry.approvalStatus === 'approved' ? 'Approved' : 'Rejected'} by {entry.approvedBy} {formatDistanceToNow(new Date(entry.approvedAt!), { addSuffix: true })}
                    </p>
                  )}
                </div>
                
                {/* Thumbnail */}
                {entry.imageUrl && (
                  <div className="ml-4 flex-shrink-0">
                    <button
                      onClick={() => onEntrySelect(entry)}
                      className="block w-24 h-16 bg-gray-100 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all"
                    >
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </button>
                  </div>
                )}
              </div>
              
              {/* Actions */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => onEntrySelect(entry)}
                    variant="outline"
                    className="text-sm"
                  >
                    View Screenshot
                  </Button>
                  
                  {entry.changeDetected && entry.diffUrl && (
                    <Button
                      onClick={() => onDiffView(entry)}
                      variant="outline"
                      className="text-sm"
                    >
                      View Diff
                    </Button>
                  )}
                </div>
                
                {/* Approval Actions */}
                {entry.changeDetected && entry.approvalStatus === 'pending' && (
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => onApproval(entry.id, 'reject')}
                      variant="outline"
                      className="text-sm text-red-600 hover:text-red-700 border-red-200"
                    >
                      Reject
                    </Button>
                    <Button
                      onClick={() => onApproval(entry.id, 'approve')}
                      className="text-sm bg-green-600 hover:bg-green-700"
                    >
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {entries.map((entry) => (
        <div key={entry.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              {getStatusIcon(entry.status)}
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">{entry.screenshotName}</h3>
                <p className="text-xs text-gray-500">{entry.projectName}</p>
              </div>
            </div>
            
            {entry.changeDetected && (
              <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                {entry.changeScore?.toFixed(1)}%
              </span>
            )}
          </div>
          
          {/* Thumbnail */}
          <button
            onClick={() => onEntrySelect(entry)}
            className="w-full h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-3 flex items-center justify-center hover:ring-2 hover:ring-blue-500 transition-all"
          >
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
          
          {/* Details */}
          <div className="space-y-2 text-xs text-gray-500">
            <p>{formatDistanceToNow(new Date(entry.capturedAt), { addSuffix: true })}</p>
            <p>{entry.metadata.viewport.width}×{entry.metadata.viewport.height}</p>
            {entry.metadata.fileSize > 0 && <p>{formatFileSize(entry.metadata.fileSize)}</p>}
          </div>
          
          {/* Actions */}
          <div className="flex space-x-2 mt-3">
            <Button
              onClick={() => onEntrySelect(entry)}
              variant="outline"
              className="flex-1 text-xs"
            >
              View
            </Button>
            {entry.changeDetected && (
              <Button
                onClick={() => onDiffView(entry)}
                variant="outline"
                className="flex-1 text-xs"
              >
                Diff
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="divide-y divide-gray-200">
        {entries.map((entry) => (
          <div key={entry.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {getStatusIcon(entry.status)}
                <div>
                  <h3 className="font-semibold text-gray-900">{entry.screenshotName}</h3>
                  <p className="text-sm text-gray-600">{entry.projectName}</p>
                  <p className="text-xs text-gray-500">{entry.metadata.url}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {entry.changeDetected && (
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                    {entry.changeScore?.toFixed(1)}% changed
                  </span>
                )}
                
                <div className="text-right text-xs text-gray-500">
                  <p>{formatDistanceToNow(new Date(entry.capturedAt), { addSuffix: true })}</p>
                  <p>{entry.metadata.viewport.width}×{entry.metadata.viewport.height}</p>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={() => onEntrySelect(entry)}
                    variant="outline"
                    className="text-xs"
                  >
                    View
                  </Button>
                  {entry.changeDetected && (
                    <Button
                      onClick={() => onDiffView(entry)}
                      variant="outline"
                      className="text-xs"
                    >
                      Diff
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  switch (viewMode) {
    case 'grid':
      return renderGridView();
    case 'list':
      return renderListView();
    default:
      return renderTimelineView();
  }
}