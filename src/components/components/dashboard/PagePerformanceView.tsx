'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Loader2, Hash } from '@/components/dashboard/icons';
import { ExportDropdown } from './ExportDropdown';
import { TruncateWithTooltip } from './DashboardTooltip';
import { exportCSV, exportJSON, exportFilename, type ExportColumn } from '@/lib/core/export';
import {
  useGetPagesQuery,
  useAppSelector,
  useAppDispatch,
  selectFilters,
  setFilter,
  useAllowedTimeRanges,
  isQueryPending,
  shouldShowQueryError,
} from '@/lib/redux';
import type { TimeRange } from '@/lib/redux/hooks/useAllowedTimeRanges';
import type { PagePerformance } from '@/lib/redux/services/dashboardApi';
import { DashboardSection } from './DashboardSection';
import { DashboardMetricCard } from './DashboardMetricCard';
import { dashboardMetricGridFourClass } from './chart-layout';
import { DashboardQueryError, DashboardQueryLoading } from './DashboardQueryStatus';

interface PagePerformanceViewProps {
  projectId: string;
}

// ── CWV thresholds ──
const CWV_THRESHOLDS = {
  LCP:  { good: 2500, poor: 4000 },
  FCP:  { good: 1800, poor: 3000 },
  CLS:  { good: 100,  poor: 250 },   // stored as milliunits
  INP:  { good: 200,  poor: 500 },
  TTFB: { good: 800,  poor: 1800 },
} as const;

type VitalName = keyof typeof CWV_THRESHOLDS;

function vitalColor(name: VitalName, value: number | null): string {
  if (value == null) return 'text-[#666]';
  const t = CWV_THRESHOLDS[name];
  if (value <= t.good) return 'text-[color:var(--dash-success)]';
  if (value <= t.poor) return 'text-amber-400';
  return 'text-red-400';
}

function formatVital(name: VitalName, value: number | null): string {
  if (value == null) return '-';
  if (name === 'CLS') return (value / 1000).toFixed(3);
  return Math.round(value).toLocaleString();
}

// ── Sort helpers ──
type SortKey =
  | 'page' | 'requests' | 'p50' | 'p95' | 'p99'
  | 'errorRate' | 'LCP' | 'FCP' | 'CLS' | 'INP' | 'TTFB';

type SortDir = 'asc' | 'desc';

function getSortValue(row: PagePerformance, key: SortKey): number | string {
  switch (key) {
    case 'page':      return row.page;
    case 'requests':  return row.requests;
    case 'p50':       return row.p50;
    case 'p95':       return row.p95;
    case 'p99':       return row.p99;
    case 'errorRate': return row.errorRate;
    case 'LCP':       return row.vitals.LCP ?? -1;
    case 'FCP':       return row.vitals.FCP ?? -1;
    case 'CLS':       return row.vitals.CLS ?? -1;
    case 'INP':       return row.vitals.INP ?? -1;
    case 'TTFB':      return row.vitals.TTFB ?? -1;
  }
}

// ── Component ──
export function PagePerformanceView({ projectId }: PagePerformanceViewProps) {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters('pages')) as { range: string };
  const timeRange = filters.range as TimeRange;
  const timeRanges = useAllowedTimeRanges(['1h', '24h', '7d', '30d', '90d', '1y']);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('requests');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 20;

  const handleTimeRangeChange = (range: TimeRange) => {
    dispatch(setFilter({ page: 'pages', key: 'range', value: range }));
  };

  const {
    data,
    isLoading,
    isFetching,
    isUninitialized,
    error,
    refetch,
  } = useGetPagesQuery({ projectId, range: timeRange });

  const queryState = { data, error, isLoading, isFetching, isUninitialized };

  const pages = data?.pages ?? [];

  // Filter + sort
  const filteredSorted = useMemo(() => {
    let result = pages;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.page.toLowerCase().includes(q));
    }
    return [...result].sort((a, b) => {
      const aVal = getSortValue(a, sortKey);
      const bVal = getSortValue(b, sortKey);
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      const aNum = aVal as number;
      const bNum = bVal as number;
      return sortDir === 'asc' ? aNum - bNum : bNum - aNum;
    });
  }, [pages, searchQuery, sortKey, sortDir]);

  const totalFilteredPages = Math.ceil(filteredSorted.length / PAGE_SIZE);
  const paginatedRows = filteredSorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  // Summary cards
  const totalPages = data?.totalPages ?? 0;
  const totalRequests = data?.totalRequests ?? 0;
  const avgP95 = pages.length > 0
    ? Math.round(pages.reduce((s, p) => s + p.p95, 0) / pages.length)
    : 0;
  const pagesWithErrors = pages.filter(p => p.errorCount > 0).length;

  // ── Export ──
  const exportColumns: ExportColumn<PagePerformance>[] = [
    { key: 'page', header: 'Page' },
    { key: 'requests', header: 'Requests' },
    { key: 'p50', header: 'p50 (ms)' },
    { key: 'p95', header: 'p95 (ms)' },
    { key: 'p99', header: 'p99 (ms)' },
    { key: 'errorCount', header: 'Errors' },
    { key: 'errorRate', header: 'Error Rate (%)' },
    { key: 'avgTransfer', header: 'Avg Transfer (B)' },
    { key: (r) => r.vitals.LCP ?? '', header: 'LCP' },
    { key: (r) => r.vitals.FCP ?? '', header: 'FCP' },
    { key: (r) => r.vitals.CLS != null ? (r.vitals.CLS / 1000).toFixed(3) : '', header: 'CLS' },
    { key: (r) => r.vitals.INP ?? '', header: 'INP' },
    { key: (r) => r.vitals.TTFB ?? '', header: 'TTFB' },
  ];

  const handleExportCSV = useCallback(() => {
    if (!pages.length) return;
    exportCSV(pages, exportColumns, exportFilename('pages', projectId, timeRange, 'csv'));
  }, [pages, projectId, timeRange]);

  const handleExportJSON = useCallback(() => {
    if (!pages.length) return;
    exportJSON(pages, exportFilename('pages', projectId, timeRange, 'json'));
  }, [pages, projectId, timeRange]);

  // ── Render helpers ──
  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return null;
    return sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3 inline ml-0.5" />
      : <ChevronDown className="w-3 h-3 inline ml-0.5" />;
  };

  const thClass =
    'text-left px-4 py-3 text-[#888] font-medium text-xs uppercase tracking-wider cursor-pointer select-none hover:text-white transition-colors whitespace-nowrap';

  const hasActiveFilters = searchQuery;

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setCurrentPage(1);
  }, []);

  return (
    <div className="max-w-350 mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[color:var(--dash-text)]">Page Performance</h1>
          <p className="mt-1 text-sm text-[color:var(--dash-text-soft)]">Aggregated vitals, latency, and errors per URL path</p>
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
            disabled={!pages.length}
          />
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
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pages..."
            className="bg-[#111] border border-[#222] rounded-md pl-7 pr-3 py-1.5 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#3b82f6] transition-colors w-48"
          />
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

      {/* Summary Cards */}
      <DashboardSection id="pages-summary" as="div" className={`mb-6 ${dashboardMetricGridFourClass}`}>
        <DashboardMetricCard label="Total Pages" value={totalPages.toLocaleString()} />
        <DashboardMetricCard label="Total Requests" value={totalRequests.toLocaleString()} />
        <DashboardMetricCard label="Avg p95" value={`${avgP95.toLocaleString()} ms`} tone="font-mono" />
        <DashboardMetricCard label="Pages with Errors" value={pagesWithErrors.toLocaleString()} />
      </DashboardSection>

      <DashboardSection id="pages-table" as="div" className="dashboard-panel overflow-hidden">
            {/* Table */}
            {isQueryPending(queryState) ? (
              <DashboardQueryLoading variant="table" rows={8} />
            ) : shouldShowQueryError(queryState) ? (
              <DashboardQueryError
                message="Error loading data."
                onRetry={() => void refetch()}
              />
            ) : filteredSorted.length === 0 ? (
              <div className="py-16 text-center text-[#666]">
                <p className="text-white font-medium mb-1">No pages found</p>
                <p className="text-sm">
                  {searchQuery ? 'Try a different search term.' : 'No page data in this time range.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#222] bg-[#0a0a0a]">
                      <th className={thClass} onClick={() => handleSort('page')}>
                        Page Path <SortIcon col="page" />
                      </th>
                      <th className={thClass} onClick={() => handleSort('requests')}>
                        Requests <SortIcon col="requests" />
                      </th>
                      <th className={thClass} onClick={() => handleSort('p50')}>
                        p50 <SortIcon col="p50" />
                      </th>
                      <th className={thClass} onClick={() => handleSort('p95')}>
                        p95 <SortIcon col="p95" />
                      </th>
                      <th className={thClass} onClick={() => handleSort('p99')}>
                        p99 <SortIcon col="p99" />
                      </th>
                      <th className={thClass} onClick={() => handleSort('errorRate')}>
                        Error Rate <SortIcon col="errorRate" />
                      </th>
                      <th className={thClass} onClick={() => handleSort('LCP')}>
                        LCP <SortIcon col="LCP" />
                      </th>
                      <th className={thClass} onClick={() => handleSort('FCP')}>
                        FCP <SortIcon col="FCP" />
                      </th>
                      <th className={thClass} onClick={() => handleSort('CLS')}>
                        CLS <SortIcon col="CLS" />
                      </th>
                      <th className={thClass} onClick={() => handleSort('INP')}>
                        INP <SortIcon col="INP" />
                      </th>
                      <th className={thClass} onClick={() => handleSort('TTFB')}>
                        TTFB <SortIcon col="TTFB" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRows.map((row) => (
                      <tr
                        key={row.page}
                        className="border-b border-[#222] last:border-b-0 hover:bg-[#161616] transition-colors"
                      >
                        <td className="px-4 py-3 text-white font-mono text-xs max-w-[280px]">
                          <TruncateWithTooltip text={row.page} />
                        </td>
                        <td className="px-4 py-3 text-[#ccc] tabular-nums">
                          {row.requests.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-[#ccc] tabular-nums">
                          {row.p50.toLocaleString()} <span className="text-[#666]">ms</span>
                        </td>
                        <td className="px-4 py-3 text-[#ccc] tabular-nums">
                          {row.p95.toLocaleString()} <span className="text-[#666]">ms</span>
                        </td>
                        <td className="px-4 py-3 text-[#ccc] tabular-nums">
                          {row.p99.toLocaleString()} <span className="text-[#666]">ms</span>
                        </td>
                        <td className="px-4 py-3 tabular-nums">
                          <span className={row.errorRate > 5 ? 'text-red-400' : row.errorRate > 1 ? 'text-amber-400' : 'text-[#ccc]'}>
                            {row.errorRate.toFixed(2)}%
                          </span>
                        </td>
                        <td className={`px-4 py-3 tabular-nums ${vitalColor('LCP', row.vitals.LCP)}`}>
                          {formatVital('LCP', row.vitals.LCP)}
                        </td>
                        <td className={`px-4 py-3 tabular-nums ${vitalColor('FCP', row.vitals.FCP)}`}>
                          {formatVital('FCP', row.vitals.FCP)}
                        </td>
                        <td className={`px-4 py-3 tabular-nums ${vitalColor('CLS', row.vitals.CLS)}`}>
                          {formatVital('CLS', row.vitals.CLS)}
                        </td>
                        <td className={`px-4 py-3 tabular-nums ${vitalColor('INP', row.vitals.INP)}`}>
                          {formatVital('INP', row.vitals.INP)}
                        </td>
                        <td className={`px-4 py-3 tabular-nums ${vitalColor('TTFB', row.vitals.TTFB)}`}>
                          {formatVital('TTFB', row.vitals.TTFB)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {totalFilteredPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-[#222]">
                <div className="text-xs text-[#666]">
                  Showing {((currentPage - 1) * PAGE_SIZE) + 1} - {Math.min(currentPage * PAGE_SIZE, filteredSorted.length)} of {filteredSorted.length} pages
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded border border-[#222] text-[#888] hover:text-white hover:border-[#444] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-[#888]">
                    Page {currentPage} of {totalFilteredPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalFilteredPages, p + 1))}
                    disabled={currentPage >= totalFilteredPages}
                    className="p-1.5 rounded border border-[#222] text-[#888] hover:text-white hover:border-[#444] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
      </DashboardSection>

      {/* AI Pill */}
</div>
  );
}
