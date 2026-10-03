'use client';

import {
  Search,
  ChevronLeft,
  ChevronRight,
  Clock,
  Globe,
  ArrowDownRight,
  ArrowUpRight,
} from '@/components/dashboard/icons';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { FilterDropdown } from './FilterDropdown';
import { ExportDropdown } from './ExportDropdown';
import { exportCSV, exportJSON, exportFilename, type ExportColumn } from '@/lib/core/export';
import { DomainFavicon } from './DomainFavicon';
import { TruncateWithTooltip } from './DashboardTooltip';
import {
  selectFilters,
  setFilter,
  useGetThirdPartiesQuery,
  useAllowedTimeRanges,
  useAppDispatch,
  useAppSelector,
} from '@/lib/redux';
import type { TimeRange } from '@/lib/redux/hooks/useAllowedTimeRanges';
import type { ThirdPartyDomain } from '@/lib/redux/services/dashboardApi';
import { DashboardSection } from './DashboardSection';
import { DashboardMetricCard } from './DashboardMetricCard';
import { DashboardQueryLoading } from './DashboardQueryStatus';
import { dashboardMetricGridFourClass } from './chart-layout';

interface ThirdPartyAnalysisProps {
  projectId: string;
}

const formatNumber = (num: number) => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}k`;
  return num.toString();
};

const formatBytes = (bytes: number) => {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(1)} KB`;
  return `${bytes} B`;
};

const formatLatency = (ms: number) => `${ms}ms`;

const getLatencyColor = (p95: number) => {
  if (p95 > 500) return 'text-[#ef4444]';
  if (p95 > 250) return 'text-[color:var(--dash-warning)]';
  return 'text-[color:var(--dash-text-soft)]';
};

const getErrorColor = (rate: number) => {
  if (rate > 2) return 'text-[#ef4444]';
  if (rate > 0.5) return 'text-[color:var(--dash-warning)]';
  return 'text-[color:var(--dash-text-soft)]';
};

const getBarColor = (p95: number) => {
  return 'var(--dash-blue)';
};

export function ThirdPartyAnalysis({ projectId }: ThirdPartyAnalysisProps) {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters('thirdParties')) as { range: string };
  const timeRange = filters.range as TimeRange;
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<keyof ThirdPartyDomain>('requests');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterLatency, setFilterLatency] = useState<string | null>(null);
  const PAGE_SIZE = 20;

  const timeRanges = useAllowedTimeRanges(['1h', '24h', '7d', '30d', '90d', '1y']);

  const {
    data,
    isLoading,
    isFetching,
  } = useGetThirdPartiesQuery({ projectId, range: timeRange });

  const filteredDomains = useMemo(() => {
    if (!data?.domains) return [];
    let result = data.domains;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(d => d.host.toLowerCase().includes(q));
    }
    return [...result].sort((a, b) => {
      const av = a[sortField] as number;
      const bv = b[sortField] as number;
      return sortDir === 'desc' ? bv - av : av - bv;
    });
  }, [data?.domains, search, sortField, sortDir]);

  const displayDomains = useMemo(() => {
    let result = filteredDomains;
    if (filterLatency === 'fast') result = result.filter(d => d.p95 <= 250);
    else if (filterLatency === 'medium') result = result.filter(d => d.p95 > 250 && d.p95 <= 500);
    else if (filterLatency === 'slow') result = result.filter(d => d.p95 > 500);
    return result;
  }, [filteredDomains, filterLatency]);

  const totalPages = Math.ceil(displayDomains.length / PAGE_SIZE);
  const paginatedDomains = displayDomains.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => { setCurrentPage(1); }, [search, sortField, sortDir, filterLatency]);

  const latencyOptions = [
    { value: 'fast', label: '< 250ms (Fast)', count: filteredDomains.filter(d => d.p95 <= 250).length },
    { value: 'medium', label: '250-500ms', count: filteredDomains.filter(d => d.p95 > 250 && d.p95 <= 500).length },
    { value: 'slow', label: '> 500ms (Slow)', count: filteredDomains.filter(d => d.p95 > 500).length },
  ];

  const hasActiveFilters = search || filterLatency;

  const handleExportCSV = useCallback(() => {
    if (!data?.domains?.length) return;
    const columns: ExportColumn<ThirdPartyDomain>[] = [
      { key: 'host', header: 'Domain' },
      { key: 'requests', header: 'Requests' },
      { key: 'p50', header: 'p50 (ms)' },
      { key: 'p95', header: 'p95 (ms)' },
      { key: 'p99', header: 'p99 (ms)' },
      { key: 'errorRate', header: 'Error Rate (%)' },
      { key: 'avgTransfer', header: 'Avg Transfer (bytes)' },
      { key: 'totalTransfer', header: 'Total Transfer (bytes)' },
    ];
    exportCSV(data.domains, columns, exportFilename('third-parties', projectId, timeRange, 'csv'));
  }, [data, projectId, timeRange]);

  const handleExportJSON = useCallback(() => {
    if (!data) return;
    exportJSON(data, exportFilename('third-parties', projectId, timeRange, 'json'));
  }, [data, projectId, timeRange]);

  const handleSort = (field: keyof ThirdPartyDomain) => {
    if (sortField === field) {
      setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const renderSortArrow = (field: keyof ThirdPartyDomain) => {
    if (sortField !== field) return null;

    const Icon = sortDir === 'desc' ? ArrowDownRight : ArrowUpRight;
    return <Icon className="h-3 w-3 shrink-0 text-[color:var(--dash-text-muted)]" aria-hidden />;
  };

  const summary = data?.summary;
  const maxRequests = filteredDomains.length > 0
    ? Math.max(...filteredDomains.map(d => d.requests))
    : 1;

  if (isLoading) {
    return (
      <div className="max-w-350 mx-auto px-4 sm:px-6 py-8">
        <DashboardQueryLoading variant="page" metrics={4} rows={8} />
      </div>
    );
  }

  return (
    <div className="max-w-350 mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[color:var(--dash-text)]">Third Parties</h1>
          <p className="mt-1 text-sm text-[color:var(--dash-text-soft)]">
            Network impact of external scripts, APIs, widgets, and CDNs
          </p>
        </div>
        <div className="flex self-start items-center gap-2">
          <div className="dashboard-control flex flex-wrap p-0.5">
            {timeRanges.map((r) => (
              <button
                key={r.value}
                onClick={() => !r.disabled && dispatch(setFilter({ page: 'thirdParties', key: 'range', value: r.value }))}
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

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-[#555]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search domains..."
            className="w-48 rounded-md border border-[#222] bg-[#111] py-1.5 pl-7 pr-3 text-xs text-white placeholder-[#555] transition-colors focus:border-[#3b82f6] focus:outline-none sm:w-56"
          />
        </div>

        <FilterDropdown
          label="Latency"
          icon={<Clock className="h-3 w-3" />}
          value={filterLatency}
          options={latencyOptions}
          onChange={setFilterLatency}
        />

        {hasActiveFilters && (
          <button
            onClick={() => {
              setSearch('');
              setFilterLatency(null);
            }}
            className="ml-1 text-[11px] text-[color:var(--dash-text-muted)] transition-colors hover:text-[color:var(--dash-text)]"
          >
            Clear all
          </button>
        )}

      </div>

      {summary && (
        <DashboardSection id="third-party-summary" as="div" className={`mb-8 ${dashboardMetricGridFourClass}`}>
          <DashboardMetricCard
            label="Third-Party Share"
            value={`${summary.thirdPartyPercent}%`}
            hint={`${formatNumber(summary.thirdParty.requests)} of ${formatNumber(summary.totalRequests)} requests`}
          />
          <DashboardMetricCard
            label="3P p95 Latency"
            value={formatLatency(summary.thirdParty.p95)}
            tone={`font-semibold ${getLatencyColor(summary.thirdParty.p95)}`}
            hint={`vs ${formatLatency(summary.firstParty.p95)} first-party`}
          />
          <DashboardMetricCard
            label="3P Error Rate"
            value={`${summary.thirdParty.errorRate}%`}
            tone={`font-semibold ${getErrorColor(summary.thirdParty.errorRate)}`}
            hint={`vs ${summary.firstParty.errorRate}% first-party`}
          />
          <DashboardMetricCard
            label="3P Avg Transfer"
            value={formatBytes(summary.thirdParty.avgTransfer)}
            hint={`vs ${formatBytes(summary.firstParty.avgTransfer)} first-party`}
          />
        </DashboardSection>
      )}

      {filteredDomains.length > 0 && (
        <DashboardSection id="third-party-top-domains" as="div" className="dashboard-panel mb-8 overflow-hidden p-0">
          <div className="border-b border-[color:var(--dash-border)] px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-[color:var(--dash-text)]">Top Third-Party Domains</h2>
              <p className="mt-1 text-xs text-[color:var(--dash-text-soft)]">The heaviest vendors in the selected window.</p>
            </div>
          </div>

          <div className="space-y-0">
            {filteredDomains.slice(0, 10).map((domain) => {
              const barWidth = Math.max((domain.requests / maxRequests) * 100, 2);
              return (
                <div
                  key={domain.host}
                  className="border-b border-[color:var(--dash-border)] px-5 py-4 last:border-b-0"
                >
                  <div className="mb-2 flex items-start gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 font-mono text-sm text-[color:var(--dash-text)]">
                        <DomainFavicon domain={domain.host} className="h-3.5 w-3.5 shrink-0 rounded-[4px]" />
                        <TruncateWithTooltip text={domain.host} />
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-[11px] text-[color:var(--dash-text-soft)]">
                        <span>{formatNumber(domain.requests)} requests</span>
                        <span className="text-[color:var(--dash-text-soft)]">{formatLatency(domain.p95)} p95</span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="font-mono text-sm text-[color:var(--dash-text)]">{formatNumber(domain.requests)}</div>
                      <div className="mt-1 text-[11px] text-[color:var(--dash-text-soft)]">{formatLatency(domain.p95)}</div>
                    </div>
                  </div>

                  <div className="relative h-2 overflow-hidden rounded-full bg-[color:var(--dash-bg-subtle)]">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${barWidth}%`,
                        backgroundColor: getBarColor(domain.p95),
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </DashboardSection>
      )}

      {displayDomains.length === 0 ? (
        <div className="dashboard-panel p-12 text-center">
          <p className="text-sm text-[color:var(--dash-text-soft)]">
            {search ? 'No third-party domains match your search.' : 'No third-party requests detected in this time range.'}
          </p>
        </div>
      ) : (
        <DashboardSection id="third-party-domain-breakdown" as="div" className="dashboard-panel overflow-hidden">
          <div className="border-b border-[color:var(--dash-border)] px-4 py-3 sm:px-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-[color:var(--dash-text)]">Domain Breakdown</h2>
                <p className="mt-1 text-xs text-[color:var(--dash-text-soft)]">Sort by request volume, latency, error rate, or payload size.</p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[color:var(--dash-border)] text-[color:var(--dash-text-muted)] text-xs">
                  <th className="px-4 py-3 text-left font-medium sm:px-5">Domain</th>
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
                  <th
                    className="cursor-pointer px-4 py-3 text-right font-medium transition-colors hover:text-[color:var(--dash-text)] sm:px-5"
                    onClick={() => handleSort('p99')}
                  >
                    <span className="inline-flex items-center justify-end gap-1 whitespace-nowrap">
                      p99{renderSortArrow('p99')}
                    </span>
                  </th>
                  <th
                    className="cursor-pointer px-4 py-3 text-right font-medium transition-colors hover:text-[color:var(--dash-text)] sm:px-5"
                    onClick={() => handleSort('errorRate')}
                  >
                    <span className="inline-flex items-center justify-end gap-1 whitespace-nowrap">
                      Error %{renderSortArrow('errorRate')}
                    </span>
                  </th>
                  <th
                    className="cursor-pointer px-4 py-3 text-right font-medium transition-colors hover:text-[color:var(--dash-text)] sm:px-5"
                    onClick={() => handleSort('avgTransfer')}
                  >
                    <span className="inline-flex items-center justify-end gap-1 whitespace-nowrap">
                      Avg Size{renderSortArrow('avgTransfer')}
                    </span>
                  </th>
                  <th
                    className="cursor-pointer px-4 py-3 text-right font-medium transition-colors hover:text-[color:var(--dash-text)] sm:px-5"
                    onClick={() => handleSort('totalTransfer')}
                  >
                    <span className="inline-flex items-center justify-end gap-1 whitespace-nowrap">
                      Total Transfer{renderSortArrow('totalTransfer')}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedDomains.map((domain) => (
                  <tr
                    key={domain.host}
                    className="border-b border-[color:var(--dash-border)] transition-colors last:border-b-0 hover:bg-[color:var(--dash-surface-hover)]"
                  >
                    <td className="px-4 py-3 sm:px-5">
                      <div className="flex items-center gap-2">
                        <DomainFavicon domain={domain.host} className="h-4 w-4 shrink-0 rounded-[4px]" />
                        <TruncateWithTooltip text={domain.host} className="max-w-[300px] font-mono text-[color:var(--dash-text)]" />
                      </div>
                    </td>
                    <td className="w-[108px] px-3 py-3 text-center tabular-nums text-[color:var(--dash-text-soft)] sm:px-4">
                      {formatNumber(domain.requests)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-[color:var(--dash-text-soft)] sm:px-5">
                      {formatLatency(domain.p50)}
                    </td>
                    <td className={`px-4 py-3 text-right tabular-nums sm:px-5 ${getLatencyColor(domain.p95)}`}>
                      {formatLatency(domain.p95)}
                    </td>
                    <td className={`px-4 py-3 text-right tabular-nums sm:px-5 ${getLatencyColor(domain.p99)}`}>
                      {formatLatency(domain.p99)}
                    </td>
                    <td className={`px-4 py-3 text-right tabular-nums sm:px-5 ${getErrorColor(domain.errorRate)}`}>
                      {domain.errorRate}%
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-[color:var(--dash-text-soft)] sm:px-5">
                      {formatBytes(domain.avgTransfer)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-[color:var(--dash-text-soft)] sm:px-5">
                      {formatBytes(domain.totalTransfer)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-[color:var(--dash-border)] px-4 py-3 sm:px-5">
              <div className="text-xs text-[color:var(--dash-text-soft)]">
                Showing {((currentPage - 1) * PAGE_SIZE) + 1} - {Math.min(currentPage * PAGE_SIZE, displayDomains.length)} of {displayDomains.length} domains
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="dashboard-button-secondary p-1.5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm text-[color:var(--dash-text-soft)]">Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="dashboard-button-secondary p-1.5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </DashboardSection>
      )}
</div>
  );
}
