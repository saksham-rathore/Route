'use client';

/**
 * Error Analytics Component with Redux
 * 
 * Features:
 * - Stacked bar chart showing 4xx and 5xx errors over time
 * - Error table with details
 * - Stale-while-revalidate: Shows cached data immediately while fetching
 * - Global state management via Redux
 * - Automatic refetching on window focus/reconnect
 */

import { useState, useCallback, useMemo, Fragment } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronDown, Loader2, AlertTriangle, CheckCircle2 } from '@/components/dashboard/icons';
import { dashboardChartHeight } from '@/components/dashboard/chart-layout';
import { FilterDropdown } from './FilterDropdown';
import { ExportDropdown } from './ExportDropdown';
import { exportCSV, exportJSON, exportFilename, type ExportColumn } from '@/lib/core/export';
import { getCountryFlagSrc, normalizeCountryDisplayName } from './country-flags';
import { DashboardTooltip, TruncateWithTooltip } from './DashboardTooltip';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  useGetErrorsQuery,
  useGetErrorAggregatesQuery,
  useGetErrorGroupsQuery,
  useAppSelector,
  useAppDispatch,
  selectPagination,
  selectFilters,
  setFilter,
  setPage,
  useAllowedTimeRanges,
  ErrorData,
  ErrorAggregateData,
  ErrorGroup,
  isQueryPending,
  shouldShowQueryError,
} from '@/lib/redux';
import type { TimeRange } from '@/lib/redux/hooks/useAllowedTimeRanges';
import { getObservabilityChartAxisProps } from '@/lib/core/chart-time-axis';
import { dashboardPanelHeaderClass } from '@/components/dashboard/chart-layout';
import { DashboardQueryError, DashboardQueryLoading } from './DashboardQueryStatus';
import { Skeleton } from './DashboardSkeleton';
import { cn } from '@/lib/core/utils';

interface ErrorAnalyticsProps {
  projectId: string;
}

const ERROR_TABLE_WRAP = 'overflow-x-auto';
const ERROR_CELL_X = 'px-4 sm:px-5';
const ERROR_TH =
  `${ERROR_CELL_X} py-2.5 text-left text-xs font-medium text-[color:var(--dash-text-muted)]`;
const ERROR_TD = `${ERROR_CELL_X} py-2.5 align-top`;
const ERROR_TR = 'border-b border-[color:var(--dash-divider)] last:border-b-0';
const ERROR_THEAD = 'border-b border-[color:var(--dash-divider)]';
const ERROR_STACK_COL = 'pl-6 sm:pl-7';

// Format timestamp to HH:MM:SS.ms
const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 2,
  });
};

// Get status text color (no pill boxes)
const getStatusTextClass = (status: number | undefined) => {
  if (!status) return 'text-[color:var(--dash-text-muted)]';
  if (status >= 500) return 'text-red-400';
  if (status >= 400) return 'text-amber-400';
  return 'text-[color:var(--dash-text-muted)]';
};

// Truncate message
const truncateMessage = (message: string, maxLength: number = 60) => {
  if (message.length <= maxLength) return message;
  return message.substring(0, maxLength) + '...';
};

const formatSourceLocation = (error: ErrorData) => {
  if (error.type !== 'js') return null;
  if (error.filename && error.line) {
    const shortFile = error.filename.split('/').pop() || error.filename;
    return `${shortFile}:${error.line}`;
  }
  return error.endpoint || null;
};

function parseJsErrorMessage(message: string) {
  const trimmed = message.trim();
  const match = trimmed.match(/^([A-Za-z]+Error):\s*(.+)$/);
  if (!match) {
    return { errorType: null, headline: trimmed, subline: null };
  }

  const detail = match[2];
  const parenMatch = detail.match(/^(.+?)\s*(\([^)]+\))\s*$/);
  if (parenMatch) {
    return {
      errorType: match[1],
      headline: parenMatch[1].trim(),
      subline: parenMatch[2],
    };
  }

  return { errorType: match[1], headline: detail, subline: null };
}

function JsErrorIssueCell({ message }: { message: string }) {
  const { errorType, headline, subline } = parseJsErrorMessage(message);
  const detail = subline ? `${headline} ${subline}` : headline;

  return (
    <div className="flex min-w-0 max-w-[14rem] items-center gap-1.5">
      {errorType ? (
        <span className="shrink-0 rounded bg-purple-500/10 px-1.5 py-0.5 text-[10px] font-medium text-purple-400">
          {errorType.replace(/Error$/, '')}
        </span>
      ) : null}
      <DashboardTooltip content={message} side="top">
        <span className="min-w-0 truncate text-xs text-[color:var(--dash-text)]">{detail}</span>
      </DashboardTooltip>
    </div>
  );
}

function StackTraceToggle({
  isExpanded,
  onToggle,
  frameCount,
}: {
  isExpanded: boolean;
  onToggle: () => void;
  frameCount?: number;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isExpanded}
      className="inline-flex items-center gap-0.5 rounded bg-[color:var(--dash-bg-subtle)] px-1.5 py-0.5 text-[10px] font-medium text-[color:var(--dash-text-soft)] hover:bg-[color:var(--dash-surface-hover)] hover:text-[color:var(--dash-text)]"
    >
      Stack{frameCount ? ` · ${frameCount}` : ''}
      <ChevronDown className={cn('h-3 w-3 transition-transform', isExpanded && 'rotate-180')} />
    </button>
  );
}

function JavaScriptErrorMonitoringSection({
  errors,
  isLoading,
  hasError,
  onRetry,
}: {
  errors: ErrorData[];
  isLoading: boolean;
  hasError: boolean;
  onRetry: () => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const jsErrors = useMemo(
    () => errors.filter((error) => error.type === 'js'),
    [errors],
  );

  return (
    <div className="dashboard-panel min-w-0 overflow-hidden">
      <div className={dashboardPanelHeaderClass}>
        <h2 className="text-sm font-semibold text-[color:var(--dash-text)]">JavaScript Error Monitoring</h2>
        <p className="mt-1 text-xs text-[color:var(--dash-text-soft)]">
          Stack, release, and fingerprint from the beacon tracker.
        </p>
      </div>

      {isLoading ? (
        <DashboardQueryLoading variant="table" rows={4} />
      ) : hasError ? (
        <DashboardQueryError message="Error loading monitoring data." onRetry={onRetry} />
      ) : jsErrors.length === 0 ? (
        <ErrorAnalyticsEmptyState
          title="No JavaScript errors with monitoring data"
          description="JS errors with stack, release, or fingerprint will appear here once the beacon worker is collecting them."
        />
      ) : (
        <div className={ERROR_TABLE_WRAP}>
            <table className="w-full text-sm">
            <thead>
              <tr className={ERROR_THEAD}>
                <th className={ERROR_TH}>Issue</th>
                <th className={ERROR_TH}>Fingerprint</th>
                <th className={ERROR_TH}>Release</th>
                <th className={ERROR_TH}>Page</th>
                <th className={ERROR_TH}>Source</th>
                <th className={cn(ERROR_TH, ERROR_STACK_COL)}>Stack</th>
              </tr>
            </thead>
            <tbody>
              {jsErrors.map((error) => {
                const isExpanded = expandedId === error.id;
                const sourceLocation = formatSourceLocation(error);
                const frameCount = error.stack
                  ? error.stack.split('\n').filter(Boolean).length
                  : 0;

                return (
                  <Fragment key={error.id}>
                    <tr className={cn(ERROR_TR, 'hover:bg-[color:var(--dash-surface-hover)]')}>
                      <td className={ERROR_TD}>
                        <JsErrorIssueCell message={error.message} />
                      </td>
                      <td className={cn(ERROR_TD, 'font-mono text-xs text-[color:var(--dash-text-soft)]')}>
                        {error.fingerprint || '-'}
                      </td>
                      <td className={cn(ERROR_TD, 'font-mono text-xs text-[color:var(--dash-text-soft)]')}>
                        {error.release || '-'}
                      </td>
                      <td className={cn(ERROR_TD, 'text-sm text-[color:var(--dash-text)]')}>
                        {error.endpoint || '-'}
                      </td>
                      <td className={cn(ERROR_TD, 'font-mono text-xs text-[color:var(--dash-text-soft)]')}>
                        {sourceLocation || '-'}
                      </td>
                      <td className={cn(ERROR_TD, ERROR_STACK_COL)}>
                        {error.stack ? (
                          <StackTraceToggle
                            isExpanded={isExpanded}
                            frameCount={frameCount}
                            onToggle={() => setExpandedId(isExpanded ? null : error.id)}
                          />
                        ) : (
                          <span className="text-xs text-[color:var(--dash-text-muted)]">-</span>
                        )}
                      </td>
                    </tr>
                    {isExpanded && error.stack ? (
                      <tr className={ERROR_TR}>
                        <td colSpan={6} className={cn(ERROR_CELL_X, 'py-2')}>
                          <pre className="overflow-x-auto pl-3 font-mono text-[11px] leading-relaxed text-[color:var(--dash-text-soft)] whitespace-pre-wrap border-l border-[color:var(--dash-divider)]">
                            {error.stack}
                          </pre>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ErrorAnalyticsEmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <CheckCircle2 className="mb-3 h-8 w-8 text-[color:var(--dash-text-muted)]" />
      <p className="mb-1 text-sm font-medium text-[color:var(--dash-text)]">{title}</p>
      <p className="text-sm text-[color:var(--dash-text-soft)]">{description}</p>
    </div>
  );
}

// Custom tooltip for error chart
const ErrorTooltip = ({ 
  active, 
  payload, 
  label 
}: { 
  active?: boolean; 
  payload?: Array<{ dataKey: string; value: number; color: string; payload: { hour: string } }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    const count4xx = payload.find(p => p.dataKey === 'count4xx')?.value || 0;
    const count5xx = payload.find(p => p.dataKey === 'count5xx')?.value || 0;
    const hour = payload[0]?.payload?.hour;
    // Format full date+time from the hour
    const displayLabel = hour 
      ? new Date(hour).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : label;
    return (
      <div className="bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 shadow-lg">
        <p className="text-xs text-[#888] mb-1">{displayLabel}</p>
        {count4xx > 0 && (
          <p className="text-xs text-[#f59e0b]">4xx: {count4xx}</p>
        )}
        {count5xx > 0 && (
          <p className="text-xs text-[#ef4444]">5xx: {count5xx}</p>
        )}
      </div>
    );
  }
  return null;
};

// Error Bar Chart Component
function ErrorBarChart({ 
  data, 
  isLoading,
  isFetching,
  timeRange
}: { 
  data?: ErrorAggregateData; 
  isLoading: boolean;
  isFetching: boolean;
  timeRange: TimeRange;
}) {
  if (isLoading) {
    return (
      <div className={dashboardChartHeight.small}>
        <Skeleton className="h-full w-full rounded-lg" />
      </div>
    );
  }

  const buckets = data?.buckets || [];
  const hasChartData = buckets.some(
    (bucket) => (bucket.count4xx ?? 0) > 0 || (bucket.count5xx ?? 0) > 0,
  );

  if (!hasChartData) {
    return (
      <ErrorAnalyticsEmptyState
        title="No errors recorded"
        description="No failures were captured in the selected time range."
      />
    );
  }

  // Keep original timestamp for proper axis formatting and tooltips
  const chartData = buckets.map(bucket => ({
    ...bucket,
    hour: bucket.hour,
  }));
  const chartAxis = getObservabilityChartAxisProps(timeRange, chartData);

  return (
    <div className="relative">
      <div className={dashboardChartHeight.small}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#222" 
              vertical={false}
            />
            <XAxis 
              dataKey="hour" 
              interval={chartAxis.interval}
              minTickGap={chartAxis.minTickGap}
              tickFormatter={chartAxis.tickFormatter}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#666', fontSize: 10 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#666', fontSize: 10 }}
            />
            <Tooltip 
              content={<ErrorTooltip />}
              cursor={{ fill: 'color-mix(in srgb, var(--dash-text) 12%, transparent)' }}
            />
            <Bar 
              dataKey="count4xx" 
              stackId="a" 
              fill="#f59e0b"
              radius={[0, 0, 2, 2]}
            />
            <Bar 
              dataKey="count5xx" 
              stackId="a" 
              fill="#ef4444"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-4 text-xs text-[#888]">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-[#f59e0b]" />
          <span>Client Errors (4xx)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-sm bg-[#ef4444]" />
          <span>Server Errors (5xx)</span>
        </div>
      </div>
      
      {/* Background refresh indicator */}
      {isFetching && !isLoading && (
        <div className="absolute top-0 right-0">
          <Loader2 className="w-4 h-4 text-[#3b82f6] animate-spin" />
        </div>
      )}
    </div>
  );
}

// Main component
export function ErrorAnalytics({ projectId }: ErrorAnalyticsProps) {
  const dispatch = useAppDispatch();
  
  // Get UI state from Redux
  const pagination = useAppSelector(selectPagination('errors'));
  const filters = useAppSelector(selectFilters('errors')) as { range: string };
  const timeRange = filters.range as TimeRange;
  const timeRanges = useAllowedTimeRanges(['1h', '24h', '7d', '30d', '90d', '1y']);
  
  // Local state for search
  const [searchQuery, setSearchQuery] = useState('');
  const [errorType, setErrorType] = useState<'all' | '4xx' | '5xx'>('all');
  const [viewMode, setViewMode] = useState<'timeline' | 'groups'>('groups');
  const [groupSearch, setGroupSearch] = useState('');

  const handleTimeRangeChange = (range: TimeRange) => {
    dispatch(setFilter({ page: 'errors', key: 'range', value: range }));
  };

  const hasActiveFilters = searchQuery || errorType !== 'all' || groupSearch;

  // RTK Query for error aggregates (chart data)
  const {
    data: aggregateData,
    isLoading: isLoadingAggregate,
    isFetching: isFetchingAggregate,
  } = useGetErrorAggregatesQuery({
    projectId,
    range: timeRange,
  });

  // RTK Query for error list
  const {
    data: errorsData,
    isLoading: isLoadingErrors,
    isFetching: isFetchingErrors,
    isUninitialized: isErrorsUninitialized,
    error,
    refetch: refetchErrors,
  } = useGetErrorsQuery({
    projectId,
    page: pagination.page,
    limit: 25,
    type: errorType === 'all' ? undefined : 'http',
    status: errorType === 'all' ? undefined : errorType,
    range: timeRange,
  });

  const errorsQueryState = {
    data: errorsData,
    error,
    isLoading: isLoadingErrors,
    isFetching: isFetchingErrors,
    isUninitialized: isErrorsUninitialized,
  };

  // RTK Query for error groups
  const {
    data: groupsData,
    isLoading: isLoadingGroups,
    isFetching: isFetchingGroups,
  } = useGetErrorGroupsQuery({
    projectId,
    range: timeRange,
  });

  // Relative time formatter
  const formatRelativeTime = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const filteredGroups = useMemo(() => {
    const groups = groupsData?.groups ?? [];
    if (!groupSearch) return groups;
    const q = groupSearch.toLowerCase();
    return groups.filter(g =>
      g.displayName.toLowerCase().includes(q) ||
      g.fingerprint.toLowerCase().includes(q) ||
      g.releases.some((release) => release.toLowerCase().includes(q))
    );
  }, [groupsData, groupSearch]);

  const errors = errorsData?.data || [];
  const paginationInfo = errorsData?.pagination || {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasMore: false,
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setPage({ page: 'errors', pageNumber: newPage }));
  };

  // Filter errors locally based on search
  const filteredErrors = searchQuery
    ? errors.filter((e: ErrorData) =>
        e.endpoint?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.isp?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.release?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.fingerprint?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.stack?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : errors;

  const errorExportColumns: ExportColumn<ErrorData>[] = [
    { key: 'timestamp', header: 'Timestamp' },
    { key: 'type', header: 'Type' },
    { key: 'status', header: 'Status' },
    { key: 'message', header: 'Message' },
    { key: 'endpoint', header: 'Page' },
    { key: 'filename', header: 'Filename' },
    { key: 'line', header: 'Line' },
    { key: 'release', header: 'Release' },
    { key: 'fingerprint', header: 'Fingerprint' },
    { key: 'stack', header: 'Stack' },
    { key: 'country', header: 'Country' },
    { key: 'isp', header: 'ISP' },
  ];

  const handleExportCSV = useCallback(() => {
    if (!errors.length) return;
    exportCSV(errors, errorExportColumns, exportFilename('errors', projectId, timeRange, 'csv'));
  }, [errors, projectId, timeRange]);

  const handleExportJSON = useCallback(() => {
    if (!errors.length) return;
    exportJSON(errors, exportFilename('errors', projectId, timeRange, 'json'));
  }, [errors, projectId, timeRange]);

  return (
    <div className="mx-auto min-w-0 max-w-350 px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[color:var(--dash-text)]">Error Analytics</h1>
          <p className="mt-1 text-sm text-[color:var(--dash-text-soft)]">Monitor and debug request failures across your infrastructure</p>
        </div>
        <div className="flex self-start items-center gap-2">
          <div className="dashboard-control flex flex-wrap p-0.5">
            {timeRanges.map((r) => (
              <button
                key={r.value}
                onClick={() => !r.disabled && handleTimeRangeChange(r.value)}
                disabled={r.disabled}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  r.disabled
                    ? 'cursor-not-allowed text-[color:var(--dash-text-muted)] opacity-45'
                    : timeRange === r.value
                      ? 'bg-[color:var(--dash-blue)] text-[color:var(--dash-text-on-accent)] shadow-[var(--dash-button-shadow)]'
                      : 'text-[color:var(--dash-text-soft)] hover:text-[color:var(--dash-text)]'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <ExportDropdown
            onExportCSV={handleExportCSV}
            onExportJSON={handleExportJSON}
            disabled={!errors.length}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {/* View Mode Toggle */}
        <div className="dashboard-control flex p-0.5">
          {(['groups', 'timeline'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                viewMode === mode
                  ? 'bg-[color:var(--dash-blue)] text-[color:var(--dash-text-on-accent)] shadow-[var(--dash-button-shadow)]'
                  : 'text-[color:var(--dash-text-soft)] hover:text-[color:var(--dash-text)]'
              }`}
            >
              {mode === 'groups' ? 'Grouped' : 'Timeline'}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[color:var(--dash-text-muted)]" />
          <input
            type="text"
            value={viewMode === 'groups' ? groupSearch : searchQuery}
            onChange={(e) => viewMode === 'groups' ? setGroupSearch(e.target.value) : setSearchQuery(e.target.value)}
            placeholder={viewMode === 'groups' ? 'Search groups...' : 'Search errors...'}
            className="dashboard-control w-44 pl-7 pr-3 py-1.5 text-xs placeholder:text-[color:var(--dash-text-muted)]"
          />
        </div>

        {/* Error Type Filter (Timeline view only) */}
        {viewMode === 'timeline' && (
          <FilterDropdown
            label="Error Type"
            icon={<AlertTriangle className="w-3 h-3" />}
            value={errorType === 'all' ? null : errorType}
            options={[
              { value: '4xx', label: 'Client Errors (4xx)' },
              { value: '5xx', label: 'Server Errors (5xx)' },
            ]}
            onChange={(v) => setErrorType((v as '4xx' | '5xx') || 'all')}
          />
        )}

        {/* Clear all */}
        {hasActiveFilters && (
          <button
            onClick={() => {
              setSearchQuery('');
              setGroupSearch('');
              setErrorType('all');
            }}
            className="text-[11px] text-[#666] hover:text-white transition-colors ml-1"
          >
            Clear all
          </button>
        )}

      </div>

      <div className="min-w-0 space-y-6">
          {/* Error Volume Chart */}
          <div className="dashboard-panel relative min-w-0 p-4 sm:p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-base font-semibold mb-1">Error Volume by Status Code</h2>
                <p className="text-xs text-[#888]">Aggregated failure distribution</p>
              </div>
              <div className="flex items-center gap-2">
                {isFetchingAggregate && !isLoadingAggregate && (
                  <Loader2 className="w-4 h-4 text-[#3b82f6] animate-spin" />
                )}
              </div>
            </div>
            
            <ErrorBarChart 
              data={aggregateData} 
              isLoading={isLoadingAggregate}
              isFetching={isFetchingAggregate}
              timeRange={timeRange}
            />
          </div>

          <JavaScriptErrorMonitoringSection
            errors={errors}
            isLoading={isQueryPending(errorsQueryState)}
            hasError={shouldShowQueryError(errorsQueryState)}
            onRetry={() => void refetchErrors()}
          />

          {viewMode === 'groups' ? (
            <div className="dashboard-panel min-w-0 overflow-hidden">
              <div className={dashboardPanelHeaderClass}>
                <h2 className="text-sm font-semibold text-[color:var(--dash-text)]">All Error Groups</h2>
                <p className="mt-1 text-xs text-[color:var(--dash-text-soft)]">HTTP and JS failures grouped together.</p>
              </div>

              {isLoadingGroups ? (
                <DashboardQueryLoading variant="table" rows={6} />
              ) : !filteredGroups.length ? (
                <ErrorAnalyticsEmptyState
                  title={
                    groupSearch
                      ? 'No matching error groups'
                      : 'No error groups found'
                  }
                  description={
                    groupSearch
                      ? 'Try a different search term.'
                      : 'No errors in the selected time range.'
                  }
                />
              ) : (
                <div className={ERROR_TABLE_WRAP}>
                    <table className="w-full text-sm">
                    <thead>
                      <tr className={ERROR_THEAD}>
                        <th className={ERROR_TH}>Error</th>
                        <th className={ERROR_TH}>Count</th>
                        <th className={ERROR_TH}>Type</th>
                        <th className={ERROR_TH}>Status</th>
                        <th className={ERROR_TH}>First Seen</th>
                        <th className={ERROR_TH}>Last Seen</th>
                        <th className={ERROR_TH}>Regions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredGroups.map((group) => {
                        return (
                          <tr key={group.fingerprint} className={cn(ERROR_TR, 'hover:bg-[color:var(--dash-surface-hover)]')}>
                            <td className={cn(ERROR_TD, 'max-w-[300px]')}>
                              <TruncateWithTooltip
                                text={group.displayName}
                                className="text-xs text-[color:var(--dash-text)]"
                              />
                            </td>
                            <td className={ERROR_TD}>
                              <span className="font-mono text-xs font-medium text-[color:var(--dash-text)]">
                                {group.count.toLocaleString()}
                              </span>
                            </td>
                            <td className={cn(ERROR_TD, 'text-xs', group.type === 'http' ? 'text-blue-400' : 'text-purple-400')}>
                              {group.type.toUpperCase()}
                            </td>
                            <td className={ERROR_TD}>
                              {group.status ? (
                                <span className={cn('font-mono text-xs font-medium', getStatusTextClass(group.status))}>
                                  {group.status}
                                </span>
                              ) : (
                                <span className="text-[color:var(--dash-text-muted)]">-</span>
                              )}
                            </td>
                            <td className={cn(ERROR_TD, 'font-mono text-xs text-[color:var(--dash-text-soft)]')}>{formatRelativeTime(group.firstSeen)}</td>
                            <td className={cn(ERROR_TD, 'font-mono text-xs text-[color:var(--dash-text-soft)]')}>{formatRelativeTime(group.lastSeen)}</td>
                            <td className={ERROR_TD}>
                              <span className="text-xs text-[color:var(--dash-text-soft)]">{group.countries.length} {group.countries.length === 1 ? 'country' : 'countries'}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          ) : (
            <div className="dashboard-panel min-w-0 overflow-hidden">
              <div className={dashboardPanelHeaderClass}>
                <h2 className="text-sm font-semibold text-[color:var(--dash-text)]">Error Timeline</h2>
                <p className="mt-1 text-xs text-[color:var(--dash-text-soft)]">Individual errors in time order.</p>
              </div>

              {isQueryPending(errorsQueryState) ? (
                <DashboardQueryLoading variant="table" rows={8} />
              ) : shouldShowQueryError(errorsQueryState) ? (
                <DashboardQueryError
                  message="Error loading data."
                  onRetry={() => void refetchErrors()}
                />
              ) : filteredErrors.length === 0 ? (
                <ErrorAnalyticsEmptyState
                  title={
                    searchQuery ? 'No matching errors' : 'No errors found'
                  }
                  description={
                    searchQuery
                      ? 'Try a different search term.'
                      : 'No errors in the selected time range.'
                  }
                />
              ) : (
                <>
                  <div className={ERROR_TABLE_WRAP}>
                      <table className="w-full text-sm">
                      <thead>
                        <tr className={ERROR_THEAD}>
                          <th className={ERROR_TH}>Timestamp</th>
                          <th className={ERROR_TH}>Endpoint</th>
                          <th className={ERROR_TH}>Status</th>
                          <th className={ERROR_TH}>ISP</th>
                          <th className={ERROR_TH}>Country</th>
                          <th className={ERROR_TH}>Error Message</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredErrors.map((error: ErrorData) => (
                          <tr
                            key={error.id}
                            className={cn(ERROR_TR, 'hover:bg-[color:var(--dash-surface-hover)]')}
                          >
                            <td className={cn(ERROR_TD, 'font-mono text-xs text-[color:var(--dash-text-soft)]')}>
                              {formatTimestamp(error.timestamp)}
                            </td>
                            <td className={cn(ERROR_TD, 'text-[color:var(--dash-text)]')}>
                              {error.endpoint || '-'}
                            </td>
                            <td className={ERROR_TD}>
                              {error.status ? (
                                <span className={cn('font-mono text-xs font-medium', getStatusTextClass(error.status))}>
                                  {error.status}
                                </span>
                              ) : (
                                <span className="text-[color:var(--dash-text-muted)]">-</span>
                              )}
                            </td>
                            <td className={cn(ERROR_TD, 'text-[color:var(--dash-text-soft)]')}>
                              {error.isp || '-'}
                            </td>
                            <td className={ERROR_TD}>
                              <div className="flex items-center">
                                {getCountryFlagSrc(error.country) ? (
                                  <DashboardTooltip content={normalizeCountryDisplayName(error.country)}>
                                    <img
                                      src={getCountryFlagSrc(error.country)!}
                                      alt=""
                                      aria-label={normalizeCountryDisplayName(error.country)}
                                      className="h-4 w-5 rounded-[2px] object-cover"
                                      loading="lazy"
                                    />
                                  </DashboardTooltip>
                                ) : (
                                  <span className="text-[10px] font-mono text-[color:var(--dash-text-muted)]">-</span>
                                )}
                              </div>
                            </td>
                            <td className={ERROR_TD}>
                              <TruncateWithTooltip
                                text={error.message}
                                className="text-[color:var(--dash-text-soft)] text-xs max-w-[300px]"
                              >
                                {truncateMessage(error.message)}
                              </TruncateWithTooltip>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {paginationInfo.totalPages > 1 && (
                    <div className={cn('flex items-center justify-between border-t border-[color:var(--dash-divider)] py-3', ERROR_CELL_X)}>
                      <div className="flex items-center gap-2 text-xs text-[color:var(--dash-text-muted)]">
                        <span>
                          Showing {((paginationInfo.page - 1) * paginationInfo.limit) + 1} - {Math.min(paginationInfo.page * paginationInfo.limit, paginationInfo.total)} of {paginationInfo.total} errors
                        </span>
                        {isFetchingErrors && !isLoadingErrors && (
                          <Loader2 className="w-3 h-3 text-[color:var(--dash-blue)] animate-spin" />
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handlePageChange(paginationInfo.page - 1)}
                          disabled={paginationInfo.page === 1}
                          className="text-xs text-[color:var(--dash-text-soft)] hover:text-[color:var(--dash-text)] disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-xs text-[color:var(--dash-text-soft)]">
                          {paginationInfo.page} / {paginationInfo.totalPages}
                        </span>
                        <button
                          onClick={() => handlePageChange(paginationInfo.page + 1)}
                          disabled={!paginationInfo.hasMore}
                          className="text-xs text-[color:var(--dash-text-soft)] hover:text-[color:var(--dash-text)] disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
      </div>

      {/* AI Pill */}
</div>
  );
}
