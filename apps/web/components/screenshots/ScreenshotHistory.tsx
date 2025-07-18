'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Project } from '@docshot/database';
import { HistoryFilters } from './HistoryFilters';
import { HistoryTimeline } from './HistoryTimeline';
import { ScreenshotViewer } from './ScreenshotViewer';
import { DiffViewer } from './DiffViewer';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { EmptyState } from '../ui/EmptyState';

interface ScreenshotHistoryEntry {
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

interface ScreenshotHistoryProps {
  projectId?: string;
  screenshotId?: string;
}

export function ScreenshotHistory({ projectId, screenshotId }: ScreenshotHistoryProps) {
  const { user } = useUser();
  const [history, setHistory] = useState<ScreenshotHistoryEntry[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<ScreenshotHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<ScreenshotHistoryEntry | null>(null);
  const [viewMode, setViewMode] = useState<'timeline' | 'grid' | 'list'>('timeline');
  const [showDiffViewer, setShowDiffViewer] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadScreenshotHistory();
  }, [projectId, screenshotId, user?.id]);

  const loadScreenshotHistory = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      // Generate mock data for demonstration
      const mockHistory: ScreenshotHistoryEntry[] = [
        {
          id: '1',
          screenshotId: 'screenshot_1',
          screenshotName: 'Homepage Screenshot',
          projectId: 'project_1',
          projectName: 'DocShot Documentation',
          capturedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'success',
          imageUrl: '/api/screenshots/1/latest.png',
          diffUrl: '/api/screenshots/1/diff.png',
          changeDetected: true,
          changeScore: 12.5,
          previousImageUrl: '/api/screenshots/1/previous.png',
          metadata: {
            viewport: { width: 1920, height: 1080 },
            fullPage: true,
            url: 'https://docshot.ai',
            fileSize: 245760,
            duration: 3500,
          },
          approvalStatus: 'pending',
        },
        {
          id: '2',
          screenshotId: 'screenshot_1',
          screenshotName: 'Homepage Screenshot',
          projectId: 'project_1',
          projectName: 'DocShot Documentation',
          capturedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'success',
          imageUrl: '/api/screenshots/2/latest.png',
          changeDetected: false,
          metadata: {
            viewport: { width: 1920, height: 1080 },
            fullPage: true,
            url: 'https://docshot.ai',
            fileSize: 238920,
            duration: 2800,
          },
          approvalStatus: 'approved',
          approvedBy: 'John Doe',
          approvedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          screenshotId: 'screenshot_2',
          screenshotName: 'API Documentation',
          projectId: 'project_1',
          projectName: 'DocShot Documentation',
          capturedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'success',
          imageUrl: '/api/screenshots/3/latest.png',
          diffUrl: '/api/screenshots/3/diff.png',
          changeDetected: true,
          changeScore: 8.3,
          previousImageUrl: '/api/screenshots/3/previous.png',
          metadata: {
            viewport: { width: 1920, height: 1080 },
            fullPage: false,
            selector: '.api-content',
            url: 'https://docs.docshot.ai/api',
            fileSize: 180450,
            duration: 4200,
          },
          approvalStatus: 'approved',
          approvedBy: 'Jane Smith',
          approvedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '4',
          screenshotId: 'screenshot_1',
          screenshotName: 'Homepage Screenshot',
          projectId: 'project_1',
          projectName: 'DocShot Documentation',
          capturedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'failed',
          changeDetected: false,
          metadata: {
            viewport: { width: 1920, height: 1080 },
            fullPage: true,
            url: 'https://docshot.ai',
            fileSize: 0,
            duration: 0,
          },
        },
        {
          id: '5',
          screenshotId: 'screenshot_3',
          screenshotName: 'Dashboard View',
          projectId: 'project_2',
          projectName: 'Product Website',
          capturedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'success',
          imageUrl: '/api/screenshots/5/latest.png',
          changeDetected: false,
          metadata: {
            viewport: { width: 1440, height: 900 },
            fullPage: true,
            url: 'https://app.example.com/dashboard',
            fileSize: 312890,
            duration: 5100,
          },
          approvalStatus: 'approved',
          approvedBy: 'Mike Johnson',
          approvedAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
        },
      ];

      // Filter by project and screenshot if specified
      let filtered = mockHistory;
      if (projectId) {
        filtered = filtered.filter((entry) => entry.projectId === projectId);
      }
      if (screenshotId) {
        filtered = filtered.filter((entry) => entry.screenshotId === screenshotId);
      }

      setHistory(filtered);
      setFilteredHistory(filtered);
    } catch (err) {
      console.error('Error loading screenshot history:', err);
      setError('Failed to load screenshot history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters: any) => {
    let filtered = [...history];

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter((entry) => entry.status === filters.status);
    }

    // Apply change detection filter
    if (filters.changesOnly) {
      filtered = filtered.filter((entry) => entry.changeDetected);
    }

    // Apply date range filter
    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      let cutoffDate: Date;

      switch (filters.dateRange) {
        case '24h':
          cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          cutoffDate = new Date(0);
      }

      filtered = filtered.filter((entry) => new Date(entry.capturedAt) >= cutoffDate);
    }

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (entry) =>
          entry.screenshotName.toLowerCase().includes(searchTerm) ||
          entry.projectName.toLowerCase().includes(searchTerm) ||
          entry.metadata.url.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredHistory(filtered);
  };

  const handleEntrySelect = (entry: ScreenshotHistoryEntry) => {
    setSelectedEntry(entry);
  };

  const handleDiffView = (entry: ScreenshotHistoryEntry) => {
    setSelectedEntry(entry);
    setShowDiffViewer(true);
  };

  const handleApproval = async (entryId: string, action: 'approve' | 'reject') => {
    try {
      // In production, this would call the API
      setHistory((prev) =>
        prev.map((entry) =>
          entry.id === entryId
            ? {
                ...entry,
                approvalStatus: action === 'approve' ? 'approved' : 'rejected',
                approvedBy: user?.fullName || 'Current User',
                approvedAt: new Date().toISOString(),
              }
            : entry
        )
      );
      setFilteredHistory((prev) =>
        prev.map((entry) =>
          entry.id === entryId
            ? {
                ...entry,
                approvalStatus: action === 'approve' ? 'approved' : 'rejected',
                approvedBy: user?.fullName || 'Current User',
                approvedAt: new Date().toISOString(),
              }
            : entry
        )
      );
    } catch (err) {
      console.error('Error updating approval status:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={loadScreenshotHistory}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (filteredHistory.length === 0) {
    return (
      <EmptyState
        title="No screenshot history"
        description="Screenshot history will appear here as you capture screenshots. Start by creating a project and adding screenshot configurations."
        actionLabel="View Documentation"
        onAction={() => window.open('/docs/getting-started', '_blank')}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Screenshot History</h1>
          <p className="text-gray-600">
            {filteredHistory.length} of {history.length} entries
            {projectId && ' for this project'}
            {screenshotId && ' for this screenshot'}
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'timeline'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'grid'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            List
          </button>
        </div>
      </div>

      {/* Filters */}
      <HistoryFilters onFilterChange={handleFilterChange} />

      {/* History Display */}
      <HistoryTimeline
        entries={filteredHistory}
        viewMode={viewMode}
        onEntrySelect={handleEntrySelect}
        onDiffView={handleDiffView}
        onApproval={handleApproval}
      />

      {/* Screenshot Viewer Modal */}
      {selectedEntry && !showDiffViewer && (
        <ScreenshotViewer
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
          onDiffView={() => setShowDiffViewer(true)}
        />
      )}

      {/* Diff Viewer Modal */}
      {selectedEntry && showDiffViewer && (
        <DiffViewer
          entry={selectedEntry}
          onClose={() => {
            setShowDiffViewer(false);
            setSelectedEntry(null);
          }}
          onApproval={handleApproval}
        />
      )}
    </div>
  );
}
