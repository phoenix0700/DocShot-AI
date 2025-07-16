'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { formatDistanceToNow } from 'date-fns';

interface ApprovalEvent {
  id: string;
  action: 'approved' | 'rejected' | 'pending';
  user_id: string;
  reason: string | null;
  created_at: string;
  metadata: any;
}

interface ApprovalHistoryProps {
  screenshotId: string;
  className?: string;
}

export function ApprovalHistory({ screenshotId, className = '' }: ApprovalHistoryProps) {
  const [history, setHistory] = useState<ApprovalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, [screenshotId]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('approval_history')
        .select('*')
        .eq('screenshot_id', screenshotId)
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }

      setHistory(data || []);
    } catch (err) {
      console.error('Error loading approval history:', err);
      setError('Failed to load approval history.');
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'approved':
        return (
          <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case 'pending':
      default:
        return (
          <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case 'approved':
        return 'Approved screenshot';
      case 'rejected':
        return 'Rejected screenshot';
      case 'pending':
        return 'Reset to pending';
      default:
        return `${action} screenshot`;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'approved':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      case 'pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-4 ${className}`}>
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-4 ${className}`}>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-sm text-gray-500">No approval history yet</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <h4 className="text-sm font-medium text-gray-900 mb-4">Approval History</h4>

      <div className="flow-root">
        <ul className="-mb-8">
          {history.map((event, eventIdx) => (
            <li key={event.id}>
              <div className="relative pb-8">
                {eventIdx !== history.length - 1 ? (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}

                <div className="relative flex space-x-3">
                  {getActionIcon(event.action)}

                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        <span className={`font-medium ${getActionColor(event.action)}`}>
                          {getActionText(event.action)}
                        </span>
                      </p>

                      {event.reason && (
                        <p className="text-sm text-gray-600 mt-1 italic">
                          &ldquo;{event.reason}&rdquo;
                        </p>
                      )}
                    </div>

                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                      <time dateTime={event.created_at}>
                        {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
