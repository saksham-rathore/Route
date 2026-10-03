'use client';

/**
 * Endpoints Analysis Component with Redux
 * 
 * Features:
 * - Stale-while-revalidate: Shows cached data immediately while fetching
 * - Global state management via Redux
 * - Automatic refetching on window focus/reconnect
 * - Optimistic UI updates
 */

import { useCallback, useState } from 'react';
import { useHorizontalWheelScroll } from '@/hooks/useHorizontalWheelScroll';
import { Search, ChevronLeft, ChevronRight, Loader2, Filter, Hash, ArrowRight, ArrowDownRight, ArrowUpRight } from '@/components/dashboard/icons';
import { Sparkline } from './Sparkline';
import { ExportDropdown } from './ExportDropdown';
import { FilterDropdown } from './FilterDropdown';
import { exportCSV, exportJSON, exportFilename, type ExportColumn } from '@/lib/core/export';
import {
  useAppSelector,
  useAppDispatch,
  selectSearchQuery,
  selectFilters,
  setSearchQuery,
  setFilter,
  setPage,
  setSort,
  selectSort,
  useFilteredEndpoints,
  useAllowedTimeRanges,
  useGetAllEndpointsQuery,
  useGetProjectSettingsQuery,
  Endpoint,
  isQueryPending,
  shouldShowQueryError,
} from '@/lib/redux';
import type { TimeRange } from '@/lib/redux/hooks/useAllowedTimeRanges';
import { DashboardSection } from './DashboardSection';
import { DashboardQueryError, DashboardQueryLoading } from './DashboardQueryStatus';

interface EndpointsAnalysisProps {
  projectId: string;
}

const METHODS = ['All', 'GET', 'POST', 'PUT', 'DELETE'];

// Format requests number
const formatRequests = (count: number | null | undefined) => {
  const num = count ?? 0;
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}k`;
  return num.toString();
};

// Format latency
const formatLatency = (ms: number | null | undefined) => {
  const val = ms ?? 0;
  if (val >= 1000) return `${(val / 1000).toFixed(1)}s`;
  return `${val}ms`;
};

// Get method badge styling
const getMethodClass = (method: string) => {
  switch (method.toUpperCase()) {
    case 'GET':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'POST':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'PUT':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'DELETE':
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    default:
      return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  }
};

// Get error rate color
const getErrorColor = (rate: number | null | undefined) => {
  const val = rate ?? 0;
  if (val < 0.1) return 'text-[color:var(--dash-success)]';
  if (val < 1) return 'text-amber-400';
  return 'text-red-400';
};

// Get P95 latency color (thresholds injected from settings)
const getP95Color = (p95: number | null | undefined, warning?: number | null, critical?: number | null) => {
  const val = p95 ?? 0;
  const w = warning ?? 200;
  const c = critical ?? 500;
  if (val < w) return 'text-white';
  if (val < c) return 'text-amber-400';
  return 'text-red-400';
};

function EndpointPathLabel({ endpoint, showHost }: { endpoint: Endpoint; showHost: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="inline-flex min-w-0 items-center truncate">
        <span
          aria-hidden={!showHost}
          className={`inline-block overflow-hidden whitespace-nowrap text-[#cfcfcf] transition-all duration-200 ease-out ${
            showHost ? 'mr-0.5 max-w-[240px] opacity-100' : 'mr-0 max-w-0 opacity-0'
          }`}
        >
          {endpoint.host}
        </span>
        <span className="truncate text-white transition-colors duration-200 ease-out">{endpoint.path}</span>
      </span>
    </span>
  );
}

// Main component
export function EndpointsAnalysis({ projectId }: EndpointsAnalysisProps) {
  const dispatch = useAppDispatch();
  const { data: settings } = useGetProjectSettingsQuery({ projectId });
  const [showDomains, setShowDomains] = useState(false);
  const tableScrollRef = useHorizontalWheelScroll<HTMLDivElement>();

  // Get UI state from Redux
  const searchQuery = useAppSelector(selectSearchQuery('endpoints'));
  const filters = useAppSelector(selectFilters('endpoints')) as { method: string; range: string };
  const sort = useAppSelector(selectSort('endpoints'));
  const timeRange = filters.range as TimeRange;
  const timeRanges = useAllowedTimeRanges(['1h', '24h', '7d', '30d', '90d', '1y']);

  const handleTimeRangeChange = (range: TimeRange) => {
    dispatch(setFilter({ page: 'endpoints', key: 'range', value: range }));
  };

  const handleMethodChange = (method: string | null) => {
    dispatch(setFilter({ page: 'endpoints', key: 'method', value: method || 'all' }));
  };

  const hasActiveFilters = searchQuery || filters.method !== 'all';

  const clearFilters = useCallback(() => {
    dispatch(setSearchQuery({ page: 'endpoints', query: '' }));
    dispatch(setFilter({ page: 'endpoints', key: 'method', value: 'all' }));
  }, [dispatch]);
  
  // Client-side filtered + sorted + paginated endpoints
  const {
    data: endpoints,
    total,
    totalPages,
    page,
    limit,
    isLoading,
    isFetching,
    isUninitialized,
    error,
    refetch,
    sourceData,
  } = useFilteredEndpoints(projectId);

  const queryState = {
    data: sourceData,
    error,
    isLoading,
    isFetching,
    isUninitialized,
  };

  // Full (unpaginated) data for export
  const { data: allEndpoints } = useGetAllEndpointsQuery({ projectId, range: timeRange });

  const handleExportCSV = useCallback(() => {
    if (!allEndpoints?.length) return;
    const columns: ExportColumn<Endpoint>[] = [
      { key: 'host', header: 'Host' },
      { key: 'path', header: 'Path' },
      { key: 'method', header: 'Method' },
      { key: 'requests', header: 'Requests' },
      { key: 'p50', header: 'p50 (ms)' },
      { key: 'p95', header: 'p95 (ms)' },
      { key: 'p99', header: 'p99 (ms)' },
      { key: 'error_rate', header: 'Error Rate (%)' },
    ];
    exportCSV(allEndpoints, columns, exportFilename('endpoints', projectId, timeRange, 'csv'));
  }, [allEndpoints, projectId, timeRange]);

  const handleExportJSON = useCallback(() => {
    if (!allEndpoints?.length) return;
    exportJSON(allEndpoints, exportFilename('endpoints', projectId, timeRange, 'json'));
  }, [allEndpoints, projectId, timeRange]);

  const handleSearchChange = (value: string) => {
    dispatch(setSearchQuery({ page: 'endpoints', query: value }));
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setPage({ page: 'endpoints', pageNumber: newPage }));
  };

  const handleSort = (field: string) => {
    const newDir = sort.field === field && sort.direction === 'desc' ? 'asc' : 'desc';
    dispatch(setSort({ page: 'endpoints', field, direction: newDir }));
  };

  const renderSortArrow = (field: string) => {
    if (sort.field !== field) return null;

    const Icon = sort.direction === 'desc' ? ArrowDownRight : ArrowUpRight;
    return <Icon className="ml-1 inline-block h-3 w-3 align-[-1px]" />;
  };

  const sortArrow = (field: string) =>
    sort.field === field ? (sort.direction === 'desc' ? ' ↓' : ' ↑') : '';

  return (
    <div className="mx-auto min-w-0 max-w-350 px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[color:var(--dash-text)]">Endpoints Analysis</h1>
          <p className="mt-1 text-sm text-[color:var(--dash-text-soft)]">Performance metrics for your application&apos;s API routes</p>
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
          <ExportDropdown onExportCSV={handleExportCSV} onExportJSON={handleExportJSON} disabled={isLoading} />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#555]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search path..."
            className="bg-[#111] border border-[#222] rounded-md pl-7 pr-3 py-1.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#3b82f6] transition-colors w-44"
          />
        </div>

        {/* Method Filter */}
        <FilterDropdown
          label="Method"
          icon={<Filter className="w-3 h-3" />}
          value={filters.method === 'all' ? null : filters.method}
          options={METHODS.filter(m => m !== 'All').map(m => ({ value: m.toLowerCase(), label: m }))}
          onChange={handleMethodChange}
        />

        <div className="inline-flex items-center rounded-md border border-[#222] bg-[#111] p-0.5">
          <button
            type="button"
            aria-pressed={!showDomains}
            onClick={() => setShowDomains(false)}
            className={`rounded px-2.5 py-1.5 text-xs font-medium transition-colors ${
              !showDomains
                ? 'bg-[color:var(--dash-blue)] text-[color:var(--dash-text-on-accent)] shadow-[var(--dash-button-shadow)]'
                : 'text-[color:var(--dash-text-soft)] hover:text-[color:var(--dash-text)]'
            }`}
          >
            Routes
          </button>
          <button
            type="button"
            aria-pressed={showDomains}
            onClick={() => setShowDomains(true)}
            className={`rounded px-2.5 py-1.5 text-xs font-medium transition-colors ${
              showDomains
                ? 'bg-[color:var(--dash-blue)] text-[color:var(--dash-text-on-accent)] shadow-[var(--dash-button-shadow)]'
                : 'text-[color:var(--dash-text-soft)] hover:text-[color:var(--dash-text)]'
            }`}
          >
            Full URL
          </button>
        </div>

        {/* Clear all */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-[11px] text-[#666] hover:text-white transition-colors ml-1"
          >
            Clear all
          </button>
        )}

      </div>

      {/* Table */}
      <DashboardSection
        id="endpoints-table"
        as="div"
        className="min-w-0 w-full overflow-hidden rounded-lg border border-[#222] bg-[#111]"
      >
                {isQueryPending(queryState) ? (
                  <DashboardQueryLoading variant="table" rows={8} />
                ) : shouldShowQueryError(queryState) ? (
                  <DashboardQueryError
                    message="Error loading data."
                    onRetry={() => void refetch()}
                  />
                ) : endpoints.length === 0 ? (
                  <div className="py-16 text-center text-[#666]">
                    <div className="w-12 h-12 rounded-full bg-[#1a1a1a] border border-[#222] flex items-center justify-center mb-3 mx-auto">
                      <svg className="w-6 h-6 text-[#444]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <p className="text-white font-medium mb-1">No data yet</p>
                    <p className="text-sm">No endpoints found for the selected filters.</p>
                    {(searchQuery || filters.method !== 'all') && (
                      <button
                        onClick={() => {
                          handleSearchChange('');
                          dispatch(setFilter({ page: 'endpoints', key: 'method', value: 'all' }));
                        }}
                        className="mt-3 text-sm text-[#3b82f6] hover:underline"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <div
                      ref={tableScrollRef}
                      className="w-full min-w-0 overflow-x-auto overscroll-x-contain"
                    >
                      <table className="min-w-[920px] w-full text-sm">
                        <thead>
                          <tr className="border-b border-[#222] bg-[#0a0a0a]">
                            <th className="text-left px-4 py-3 text-[#888] font-medium text-xs uppercase tracking-wider w-[320px] cursor-pointer hover:text-white" onClick={() => handleSort('path')}>
                              <span className="inline-flex items-center whitespace-nowrap">
                                Path{renderSortArrow('path')}
                              </span>
                            </th>
                            <th className="text-left px-4 py-3 text-[#888] font-medium text-xs uppercase tracking-wider w-[100px]">
                              Method
                            </th>
                            <th className="w-[92px] text-center px-3 py-3 text-[#888] font-medium text-xs uppercase tracking-wider cursor-pointer hover:text-white" onClick={() => handleSort('requests')}>
                              <span className="inline-flex items-center whitespace-nowrap">
                                Requests{renderSortArrow('requests')}
                              </span>
                            </th>
                            <th className="text-right px-4 py-3 text-[#888] font-medium text-xs uppercase tracking-wider cursor-pointer hover:text-white" onClick={() => handleSort('p50')}>
                              <span className="inline-flex items-center whitespace-nowrap">
                                p50{renderSortArrow('p50')}
                              </span>
                            </th>
                            <th className="text-right px-4 py-3 text-[#888] font-medium text-xs uppercase tracking-wider cursor-pointer hover:text-white" onClick={() => handleSort('p95')}>
                              <span className="inline-flex items-center whitespace-nowrap">
                                p95{renderSortArrow('p95')}
                              </span>
                            </th>
                            <th className="text-right px-4 py-3 text-[#888] font-medium text-xs uppercase tracking-wider cursor-pointer hover:text-white" onClick={() => handleSort('p99')}>
                              <span className="inline-flex items-center whitespace-nowrap">
                                p99{renderSortArrow('p99')}
                              </span>
                            </th>
                            <th className="text-right px-4 py-3 text-[#888] font-medium text-xs uppercase tracking-wider cursor-pointer hover:text-white" onClick={() => handleSort('error_rate')}>
                              <span className="inline-flex items-center whitespace-nowrap">
                                Error%{renderSortArrow('error_rate')}
                              </span>
                            </th>
                            <th className="text-center px-4 py-3 text-[#888] font-medium text-xs uppercase tracking-wider w-[120px]">
                              Last 24h
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {endpoints.map((endpoint: Endpoint, index: number) => (
                            <tr
                              key={`${endpoint.host}-${endpoint.path}-${endpoint.method}-${index}`}
                              className="border-b border-[#222] last:border-b-0 hover:bg-[#161616] transition-colors"
                            >
                              <td className="px-4 py-3">
                                <code className="block text-xs font-mono text-white">
                                  <EndpointPathLabel endpoint={endpoint} showHost={showDomains} />
                                </code>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`
                                  inline-block px-2 py-0.5 rounded text-[10px] font-semibold border
                                  ${getMethodClass(endpoint.method)}
                                `}>
                                  {endpoint.method.toUpperCase()}
                                </span>
                              </td>
                              <td className="px-3 py-3 text-center font-mono text-white">
                                {formatRequests(endpoint.requests)}
                              </td>
                              <td className="px-4 py-3 text-right font-mono text-white">
                                {formatLatency(endpoint.p50)}
                              </td>
                              <td className={`px-4 py-3 text-right font-mono ${getP95Color(endpoint.p95, settings?.p95Warning, settings?.p95Critical)}`}>
                                {formatLatency(endpoint.p95)}
                              </td>
                              <td className={`px-4 py-3 text-right font-mono ${getP95Color(endpoint.p99, settings?.p99Warning, settings?.p99Critical)}`}>
                                {formatLatency(endpoint.p99)}
                              </td>
                              <td className={`px-4 py-3 text-right font-mono ${getErrorColor(endpoint.error_rate)}`}>
                                {(endpoint.error_rate ?? 0).toFixed(2)}%
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex justify-center">
                                  <Sparkline data={endpoint.sparkline} />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between px-4 py-3 border-t border-[#222]">
                        <div className="flex items-center gap-2 text-xs text-[#666]">
                          <span>
                            Showing {((page - 1) * limit) + 1} - {Math.min(page * limit, total)} of {total} endpoints
                          </span>
                          {/* Show background refresh indicator */}
                          {isFetching && !isLoading && (
                            <Loader2 className="w-3 h-3 text-[#3b82f6] animate-spin" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className="p-1.5 rounded border border-[#222] text-[#888] hover:text-white hover:border-[#444] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <span className="text-sm text-[#888]">
                            Page {page} of {totalPages}
                            {isFetching && <span className="ml-2 text-[#3b82f6]">⟳</span>}
                          </span>
                          <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page >= totalPages}
                            className="p-1.5 rounded border border-[#222] text-[#888] hover:text-white hover:border-[#444] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
      </DashboardSection>

      {/* AI Pill */}
</div>
  );
}
