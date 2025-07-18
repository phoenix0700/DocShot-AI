/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState } from 'react';
import { Button } from '../ui/Button';

interface HistoryFiltersProps {
  onFilterChange: (filters: {
    status: string;
    changesOnly: boolean;
    dateRange: string;
    search: string;
  }) => void;
}

export function HistoryFilters({ onFilterChange }: HistoryFiltersProps) {
  const [filters, setFilters] = useState({
    status: 'all',
    changesOnly: false,
    dateRange: 'all',
    search: '',
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterUpdate = (newFilters: Partial<typeof filters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      status: 'all',
      changesOnly: false,
      dateRange: 'all',
      search: '',
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters =
    filters.status !== 'all' ||
    filters.changesOnly ||
    filters.dateRange !== 'all' ||
    filters.search.length > 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex flex-col space-y-4">
        {/* Basic Filters Row */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                id="search"
                type="text"
                placeholder="Search screenshots, projects, or URLs..."
                value={filters.search}
                onChange={(e) => handleFilterUpdate({ search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="sm:w-40">
            <select
              value={filters.status}
              onChange={(e) => handleFilterUpdate({ status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="processing">Processing</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="sm:w-36">
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterUpdate({ dateRange: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="24h">Last 24h</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select>
          </div>

          {/* Advanced Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            {showAdvanced ? 'Less' : 'More'} Filters
          </button>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="pt-4 border-t border-gray-100">
            <div className="flex flex-wrap gap-4">
              {/* Changes Only Filter */}
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.changesOnly}
                  onChange={(e) => handleFilterUpdate({ changesOnly: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Show only changed screenshots</span>
              </label>

              {/* Quick Date Filters */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Quick select:</span>
                <button
                  onClick={() => handleFilterUpdate({ dateRange: '24h' })}
                  className={`px-2 py-1 text-xs rounded ${
                    filters.dateRange === '24h'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => handleFilterUpdate({ dateRange: '7d' })}
                  className={`px-2 py-1 text-xs rounded ${
                    filters.dateRange === '7d'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  This Week
                </button>
                <button
                  onClick={() => handleFilterUpdate({ dateRange: '30d' })}
                  className={`px-2 py-1 text-xs rounded ${
                    filters.dateRange === '30d'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  This Month
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters & Clear */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              {filters.status !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Status: {filters.status}
                  <button
                    onClick={() => handleFilterUpdate({ status: 'all' })}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}

              {filters.changesOnly && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Changes only
                  <button
                    onClick={() => handleFilterUpdate({ changesOnly: false })}
                    className="ml-1 text-orange-600 hover:text-orange-800"
                  >
                    ×
                  </button>
                </span>
              )}

              {filters.dateRange !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {filters.dateRange === '24h'
                    ? 'Last 24h'
                    : filters.dateRange === '7d'
                      ? 'Last 7 days'
                      : filters.dateRange === '30d'
                        ? 'Last 30 days'
                        : filters.dateRange}
                  <button
                    onClick={() => handleFilterUpdate({ dateRange: 'all' })}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              )}

              {filters.search && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Search: "{filters.search}"
                  <button
                    onClick={() => handleFilterUpdate({ search: '' })}
                    className="ml-1 text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>

            <Button
              onClick={clearFilters}
              variant="ghost"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
