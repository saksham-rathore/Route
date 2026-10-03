'use client';

/**
 * ISP Breakdown Component with Redux
 *
 * Features:
 * - Stale-while-revalidate: Shows cached data immediately while fetching
 * - Global state management via Redux
 * - Automatic refetching on window focus/reconnect
 * - Optimistic UI updates
 */

import { useCallback, useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Loader2, Globe, Wifi, ArrowDownRight, ArrowUpRight } from '@/components/dashboard/icons';
import { FilterDropdown } from './FilterDropdown';
import { ExportDropdown } from './ExportDropdown';
import { DashboardTooltip, TruncateWithTooltip } from './DashboardTooltip';
import { exportCSV, exportJSON, exportFilename, type ExportColumn } from '@/lib/core/export';
import { getCountryFlagSrc, normalizeCountryDisplayName } from './country-flags';
import {
  useGetTopISPsQuery,
  useAppSelector,
  useAppDispatch,
  selectSearchQuery,
  selectFilters,
  setSearchQuery,
  setFilter,
  setPage,
  setSort,
  selectSort,
  useFilteredISPs,
  useAllowedTimeRanges,
  ISPData,
  TopISPData,
  isQueryPending,
  shouldShowQueryError,
} from '@/lib/redux';
import type { TimeRange } from '@/lib/redux/hooks/useAllowedTimeRanges';
import { DashboardSection } from './DashboardSection';
import { DashboardQueryError, DashboardQueryLoading } from './DashboardQueryStatus';

interface ISPBreakdownProps {
  projectId: string;
}

// Format large numbers
const formatNumber = (num: number | null | undefined) => {
  const val = num ?? 0;
  if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
  return val.toString();
};

// Format latency
const formatLatency = (ms: number | null | undefined) => {
  const val = ms ?? 0;
  return `${val}ms`;
};

// Get ISP display name (clean up common ISP names)
const getISPName = (isp: string) => {
  return isp
    .replace(/\s+(Pty\s+Ltd|Ltd|Limited|Inc|LLC|Corp|Corporation)\.?$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
};

// Get bar color based on status
const getBarColor = (status: string) => {
  switch (status) {
    case 'critical':
      return '#ef4444'; // Red
    case 'slow':
      return '#f59e0b'; // Amber
    default:
      return '#3b82f6'; // Blue
  }
};

// Get latency color
const getLatencyColor = (p95: number | null | undefined) => {
  const val = p95 ?? 0;
  if (val > 500) return 'text-[#ef4444]';
  if (val > 250) return 'text-[#f59e0b]';
  return 'text-[color:var(--dash-success)]';
};

// Get error rate color
const getErrorColor = (rate: number | null | undefined) => {
  const val = rate ?? 0;
  if (val > 2) return 'text-[#ef4444]';
  if (val > 0.5) return 'text-[#f59e0b]';
  return 'text-[color:var(--dash-text-soft)]';
};

// Get row background based on error rate
const getRowBg = (errorRate: number | null | undefined, p95: number | null | undefined) => {
  const errVal = errorRate ?? 0;
  const p95Val = p95 ?? 0;
  if (errVal > 4) return 'bg-[#ef4444]/5';
  if (errVal > 1 || p95Val > 400) return 'bg-[#f59e0b]/5';
  return '';
};



// Main component
export function ISPBreakdown({ projectId }: ISPBreakdownProps) {
  const dispatch = useAppDispatch();
  
  // Get UI state from Redux
  const searchQuery = useAppSelector(selectSearchQuery('isps'));
  const filters = useAppSelector(selectFilters('isps')) as { country: string | null; range: string };
  const sort = useAppSelector(selectSort('isps'));
  const timeRange = filters.range as TimeRange;
  const timeRanges = useAllowedTimeRanges(['1h', '24h', '7d', '30d', '90d', '1y']);

  const handleTimeRangeChange = (range: TimeRange) => {
    dispatch(setFilter({ page: 'isps', key: 'range', value: range }));
  };
  
  // RTK Query for top ISPs (bar chart)
  const {
    data: topIspsData,
    isLoading: isLoadingTop,
    isFetching: isFetchingTop,
  } = useGetTopISPsQuery({
    projectId,
    limit: 10,
    range: timeRange,
  });

  // Client-side filtered + sorted + paginated ISPs
  const {
    data: isps,
    filtered: allFilteredISPs,
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
  } = useFilteredISPs(projectId);

  const queryState = {
    data: sourceData,
    error,
    isLoading,
    isFetching,
    isUninitialized,
  };

  const [filterCountry, setFilterCountry] = useState<string | null>(null);

  const hasActiveFilters = searchQuery || filterCountry;

  const countryOptions = useMemo(() => {
    if (!allFilteredISPs) return [];
    const counts = new Map<string, number>();
    allFilteredISPs.forEach(isp => {
      const c = isp.country || 'unknown';
      counts.set(c, (counts.get(c) || 0) + 1);
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([code, count]) => ({
        value: code,
        label:
          code === 'unknown'
            ? 'Unknown'
            : normalizeCountryDisplayName(code),
        renderLabel:
          code === 'unknown' ? (
            <span>Unknown</span>
          ) : (
            <>
              {getCountryFlagSrc(code) ? (
                <img
                  src={getCountryFlagSrc(code)!}
                  alt=""
                  aria-hidden="true"
                  className="h-3.5 w-5 shrink-0 rounded-[2px] object-cover"
                  loading="lazy"
                />
              ) : null}
              <span className="truncate">
                {normalizeCountryDisplayName(code)}
              </span>
            </>
          ),
        count,
      }));
  }, [allFilteredISPs]);

  const displayISPs = useMemo(() => {
    if (!filterCountry) return isps;
    return isps.filter(isp => (isp.country || 'unknown') === filterCountry);
  }, [isps, filterCountry]);

  const topIsps = topIspsData?.isps || [];

  const handleSearchChange = (value: string) => {
    dispatch(setSearchQuery({ page: 'isps', query: value }));
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setPage({ page: 'isps', pageNumber: newPage }));
  };

  const handleSort = (field: string) => {
    const newDir = sort.field === field && sort.direction === 'desc' ? 'asc' : 'desc';
    dispatch(setSort({ page: 'isps', field, direction: newDir }));
  };

  const renderSortArrow = (field: string) => {
    if (sort.field !== field) return null;

    const Icon = sort.direction === 'desc' ? ArrowDownRight : ArrowUpRight;
    return <Icon className="h-3 w-3 shrink-0 text-[color:var(--dash-text-muted)]" aria-hidden />;
  };

  const handleExportCSV = useCallback(() => {
    if (!allFilteredISPs?.length) return;
    const columns: ExportColumn<ISPData>[] = [
      { key: 'isp', header: 'ISP' },
      { key: 'asn', header: 'ASN' },
      { key: 'country', header: 'Country' },
      { key: 'requests', header: 'Requests' },
      { key: 'p50', header: 'p50 (ms)' },
      { key: 'p95', header: 'p95 (ms)' },
      { key: 'p99', header: 'p99 (ms)' },
      { key: 'errorRate', header: 'Error Rate (%)' },
    ];
    exportCSV(allFilteredISPs, columns, exportFilename('isps', projectId, timeRange, 'csv'));
  }, [allFilteredISPs, projectId, timeRange]);

  const handleExportJSON = useCallback(() => {
    if (!allFilteredISPs?.length) return;
    exportJSON(allFilteredISPs, exportFilename('isps', projectId, timeRange, 'json'));
  }, [allFilteredISPs, projectId, timeRange]);

  return (
    <div className="max-w-350 mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[color:var(--dash-text)]">ISP Breakdown</h1>
          <p className="mt-1 text-sm text-[color:var(--dash-text-soft)]">Network performance across global carriers</p>
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
            placeholder="Search ISP..."
            className="bg-[#111] border border-[#222] rounded-md pl-7 pr-3 py-1.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#3b82f6] transition-colors w-40"
          />
        </div>

        {/* Country Filter */}
        <FilterDropdown
          label="Country"
          icon={<Globe className="w-3 h-3" />}
          value={filterCountry}
          options={countryOptions}
          onChange={setFilterCountry}
        />

        {/* Clear all */}
        {hasActiveFilters && (
          <button
            onClick={() => {
              handleSearchChange('');
              setFilterCountry(null);
            }}
            className="text-[11px] text-[#666] hover:text-white transition-colors ml-1"
          >
            Clear all
          </button>
        )}

      </div>

      <div className="space-y-6">
          {/* Top 10 ISPs Bar Chart */}
          <DashboardSection id="isps-top-carriers" as="div" className="dashboard-panel p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-base font-semibold mb-1">Top 10 ISPs by Volume</h2>
                <p className="text-xs text-[#888]">Comparing p95 latency across the most active carriers</p>
              </div>
              <div className="flex items-center gap-2">
                {/* Show loading indicator when fetching in background */}
                {isFetchingTop && !isLoadingTop && (
                  <Loader2 className="w-4 h-4 text-[#3b82f6] animate-spin" />
                )}
              </div>
            </div>

            {isLoadingTop ? (
              <div className="py-8 text-center">
                <div className="animate-spin w-5 h-5 border-2 border-[#3b82f6] border-t-transparent rounded-full mx-auto" />
              </div>
            ) : topIsps.length === 0 ? (
              <div className="py-8 text-center text-[#666] text-sm">
                No ISP data available yet
              </div>
            ) : (
              <div className="space-y-3">
                {topIsps.map((isp: TopISPData) => (
                  <div key={isp.isp} className="grid grid-cols-[140px_1fr_60px] items-center gap-4">
                    <TruncateWithTooltip text={isp.isp} className="text-xs text-[#888]">
                      {getISPName(isp.isp)}
                      {isp.asn && <span className="text-[#666]"> (AS{isp.asn})</span>}
                    </TruncateWithTooltip>
                    <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${isp.barWidth}%`,
                          backgroundColor: getBarColor(isp.status)
                        }}
                      />
                    </div>
                    <div className={`text-xs font-mono text-right ${getLatencyColor(isp.p95)}`}>
                      {formatLatency(isp.p95)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DashboardSection>

          {/* ISP Table */}
          <DashboardSection id="isps-table" as="div" className="dashboard-panel overflow-hidden">

            {/* Table */}
            {isQueryPending(queryState) ? (
              <DashboardQueryLoading variant="table" rows={8} />
            ) : shouldShowQueryError(queryState) ? (
              <DashboardQueryError
                message="Error loading data."
                onRetry={() => void refetch()}
              />
            ) : displayISPs.length === 0 ? (
              <div className="py-16 text-center text-[#666]">
                <div className="w-12 h-12 rounded-full bg-[#1a1a1a] border border-[#222] flex items-center justify-center mb-3 mx-auto">
                  <svg className="w-6 h-6 text-[#444]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-white font-medium mb-1">No ISP data yet</p>
                <p className="text-sm">No ISPs found for the selected filters.</p>
                {searchQuery && (
                  <button
                    onClick={() => handleSearchChange('')}
                    className="mt-3 text-sm text-[#3b82f6] hover:underline"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[color:var(--dash-border)] text-[color:var(--dash-text-muted)] text-xs">
                        <th
                          className="cursor-pointer px-4 py-3 text-left font-medium transition-colors hover:text-[color:var(--dash-text)] sm:px-5"
                          onClick={() => handleSort('isp')}
                        >
                          <span className="inline-flex items-center gap-1 whitespace-nowrap">
                            Carrier / ISP{renderSortArrow('isp')}
                          </span>
                        </th>
                        <th className="w-[100px] px-4 py-3 text-left font-medium sm:px-5">ASN</th>
                        <th
                          className="w-[108px] cursor-pointer px-3 py-3 text-center font-medium transition-colors hover:text-[color:var(--dash-text)] sm:px-4"
                          onClick={() => handleSort('requests')}
                        >
                          <span className="inline-flex items-center justify-center gap-1 whitespace-nowrap">
                            Requests{renderSortArrow('requests')}
                          </span>
                        </th>
                        <th
                          className="cursor-pointer px-4 py-3 text-right font-medium transition-colors hover:text-[color:var(--dash-text)] sm:px-5"
                          onClick={() => handleSort('errorRate')}
                        >
                          <span className="inline-flex items-center justify-end gap-1 whitespace-nowrap">
                            Err%{renderSortArrow('errorRate')}
                          </span>
                        </th>
                        <th
                          className="cursor-pointer px-4 py-3 text-right font-medium transition-colors hover:text-[color:var(--dash-text)] sm:px-5"
                          onClick={() => handleSort('p50')}
                        >
                          <span className="inline-flex items-center justify-end gap-1 whitespace-nowrap">
                            p50{renderSortArrow('p50')}
                          </span>
                        </th>
                        <th
                          className="cursor-pointer px-4 py-3 text-right font-medium transition-colors hover:text-[color:var(--dash-text)] sm:px-5"
                          onClick={() => handleSort('p95')}
                        >
                          <span className="inline-flex items-center justify-end gap-1 whitespace-nowrap">
                            p95{renderSortArrow('p95')}
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      key={`${sort.field}-${sort.direction}`}
                      className="animate-[fade-in_160ms_ease-out]"
                    >
                      {displayISPs.map((isp: ISPData) => (
                        <tr
                          key={isp.isp}
                          className={`border-b border-[color:var(--dash-border)] transition-colors last:border-b-0 hover:bg-[color:var(--dash-surface-hover)] ${getRowBg(isp.errorRate, isp.p95)}`}
                        >
                          <td className="px-4 py-3 align-middle sm:px-5">
                            <div className="flex items-center gap-2">
                              <span className="inline-flex h-5 w-6 shrink-0 items-center justify-center">
                                {getCountryFlagSrc(isp.country) ? (
                                  <DashboardTooltip content={normalizeCountryDisplayName(isp.country)}>
                                    <img
                                      src={getCountryFlagSrc(isp.country)!}
                                      alt=""
                                      aria-label={normalizeCountryDisplayName(isp.country)}
                                      className="h-4 w-5 rounded-[2px] object-cover"
                                      loading="lazy"
                                    />
                                  </DashboardTooltip>
                                ) : (
                                  <span className="font-mono text-[10px] text-[color:var(--dash-text-muted)]">-</span>
                                )}
                              </span>
                              <span className="text-[color:var(--dash-text)]">{getISPName(isp.isp)}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 sm:px-5">
                            <code className="font-mono text-xs text-[color:var(--dash-text-soft)]">
                              {isp.asn ? `AS${isp.asn}` : '-'}
                            </code>
                          </td>
                          <td className="w-[108px] px-3 py-3 text-center font-mono tabular-nums text-[color:var(--dash-text-soft)] sm:px-4">
                            {formatNumber(isp.requests)}
                          </td>
                          <td className={`px-4 py-3 text-right font-mono tabular-nums sm:px-5 ${getErrorColor(isp.errorRate)}`}>
                            {(isp.errorRate ?? 0).toFixed(2)}%
                          </td>
                          <td className="px-4 py-3 text-right font-mono tabular-nums text-[color:var(--dash-text-soft)] sm:px-5">
                            {formatLatency(isp.p50)}
                          </td>
                          <td className={`px-4 py-3 text-right font-mono tabular-nums sm:px-5 ${getLatencyColor(isp.p95)}`}>
                            {formatLatency(isp.p95)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-[color:var(--dash-border)] px-4 py-3 sm:px-5">
                    <div className="flex items-center gap-2 text-xs text-[color:var(--dash-text-soft)]">
                      <span>
                        Showing {((page - 1) * limit) + 1} - {Math.min(page * limit, total)} of {total} ISPs{filterCountry ? ` (${displayISPs.length} in ${filterCountry.toUpperCase()})` : ''}
                      </span>
                      {isFetching && !isLoading && (
                        <Loader2 className="h-3 w-3 animate-spin text-[color:var(--dash-blue)]" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="dashboard-button-secondary p-1.5 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <span className="text-sm text-[color:var(--dash-text-soft)]">
                        Page {page} of {totalPages}
                      </span>
                      <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page >= totalPages}
                        className="dashboard-button-secondary p-1.5 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </DashboardSection>
      </div>

      {/* AI Pill */}
</div>
  );
}
