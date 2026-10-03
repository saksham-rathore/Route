'use client';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { Loader2, Bell, ChevronLeft, ChevronRight, Filter } from '@/components/dashboard/icons';
import { FilterDropdown } from './FilterDropdown';
import { ExportDropdown } from './ExportDropdown';
import { TruncateWithTooltip } from './DashboardTooltip';
import { exportCSV, exportJSON, exportFilename, type ExportColumn } from '@/lib/core/export';
import {
  useGetAlertHistoryQuery,
  useAppSelector,
  useAppDispatch,
  selectFilters,
  setFilter,
  useAllowedTimeRanges,
} from '@/lib/redux';
import type { TimeRange } from '@/lib/redux/hooks/useAllowedTimeRanges';
import type { AlertHistoryEntry } from '@/lib/redux/services/dashboardApi';
import { DashboardSection } from './DashboardSection';
import { DashboardMetricCard } from './DashboardMetricCard';
import { Skeleton } from './DashboardSkeleton';
import { dashboardMetricGridFourClass } from './chart-layout';
import { getCountryName } from './country-flags';

interface AlertHistoryViewProps {
  projectId: string;
}

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  fired: { label: 'Fired', className: 'bg-[color:var(--dash-blue-soft)] text-[color:var(--dash-blue)]' },
  suppressed: { label: 'Suppressed', className: 'bg-[color:var(--dash-blue-soft)] text-[color:var(--dash-blue)]' },
  not_met: { label: 'Not Met', className: 'bg-[color:var(--dash-blue-soft)] text-[color:var(--dash-blue)]' },
  no_data: { label: 'No Data', className: 'bg-[color:var(--dash-blue-soft)] text-[color:var(--dash-blue)]' },
};

const METRIC_LABELS: Record<string, string> = {
  p50: 'p50',
  p95: 'p95',
  p99: 'p99',
  error_rate: 'error_rate',
  requests: 'requests',
  active_users: 'active_users',
  pageviews: 'pageviews',
  country_visitors: 'country_visitors',
};

function formatMetricValue(key: string, value: number): string {
  const metric = key.split(':')[0] ?? key;
  if (metric === 'error_rate') return `${value.toFixed(1)}%`;
  if (metric === 'requests') return `${value.toFixed(1)}rpm`;
  if (metric === 'active_users' || metric === 'country_visitors') return `${Math.round(value)} users`;
  if (metric === 'pageviews') return `${Math.round(value)} views`;
  return `${Math.round(value)}ms`;
}

function formatMetricLabel(key: string): string {
  const [metric, target] = key.split(':');
  const label = METRIC_LABELS[metric ?? key] ?? metric ?? key;
  if (!target) return label;
  const formattedTarget = metric === 'country_visitors' ? getCountryName(target) : target;
  return `${label} (${formattedTarget})`;
}

function formatMetricValues(values: Record<string, number>): string {
  if (!values || typeof values !== 'object') return '-';
  const entries = Object.entries(values);
  if (entries.length === 0) return '-';
  return entries
    .map(([k, v]) => `${formatMetricLabel(k)}: ${formatMetricValue(k, v)}`)
    .join(', ');
}

function formatConditions(conditions: unknown): string {
  if (!Array.isArray(conditions)) return '-';
  return conditions
    .map((c: { metric?: string; operator?: string; threshold?: number; target?: string }) => {
      if (!c.metric || !c.operator || c.threshold === undefined) return '';
      const target = c.metric === 'country_visitors' && c.target?.trim() ? ` (${c.target.trim()})` : '';
      return `${formatMetricLabel(c.metric)}${target} ${c.operator} ${c.threshold}`;
    })
    .filter(Boolean)
    .join(', ');
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

const VISIBLE_RANGES: TimeRange[] = ['1h', '6h', '24h', '7d', '30d', '90d', '1y'];
const STATUS_OPTIONS = ['all', 'fired', 'suppressed', 'not_met', 'no_data'] as const;
const PAGE_SIZE = 20;

export function AlertHistoryView({ projectId }: AlertHistoryViewProps) {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters('alertHistory'));
  const range = (filters.range as TimeRange) || '7d';
  const timeRanges = useAllowedTimeRanges(VISIBLE_RANGES);

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isFetching } = useGetAlertHistoryQuery({
    projectId,
    range,
  });

  const filteredHistory = useMemo(() => {
    if (!data?.history) return [];
    if (statusFilter === 'all') return data.history;
    return data.history.filter(h => h.status === statusFilter);
  }, [data?.history, statusFilter]);

  useEffect(() => { setCurrentPage(1); }, [statusFilter]);

  const totalPages = Math.ceil(filteredHistory.length / PAGE_SIZE);
  const paginatedHistory = filteredHistory.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleRangeChange = useCallback(
    (newRange: string) => {
      dispatch(setFilter({ page: 'alertHistory', key: 'range', value: newRange }));
    },
    [dispatch],
  );

  const csvColumns: ExportColumn<AlertHistoryEntry>[] = [
    { header: 'Time', key: 'createdAt' },
    { header: 'Rule', key: 'ruleName' },
    { header: 'Status', key: 'status' },
    { header: 'Conditions', key: (r) => formatConditions(r.conditions) },
    { header: 'Metric Values', key: (r) => formatMetricValues(r.metricValues) },
    { header: 'Channels', key: (r) => r.notificationChannels.join(', ') },
    { header: 'Error', key: (r) => r.notificationError ?? '' },
  ];

  const handleExportCSV = useCallback(() => {
    if (!filteredHistory.length) return;
    exportCSV(filteredHistory, csvColumns, exportFilename('alert-history', projectId, range, 'csv'));
  }, [filteredHistory, csvColumns, projectId, range]);

  const handleExportJSON = useCallback(() => {
    if (!data) return;
    exportJSON(data, exportFilename('alert-history', projectId, range, 'json'));
  }, [data, projectId, range]);

  const summary = data?.summary;

  return (
    <div className="max-w-350 mx-auto px-4 sm:px-6 py-8">
      {/* Page Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[color:var(--dash-text)]">Alert History</h1>
          <p className="mt-1 text-sm text-[color:var(--dash-text-soft)]">
            Audit log of all alert evaluations, triggers, and notifications
          </p>
        </div>

        {/* Time Range + Export */}
        <div className="flex self-start items-center gap-2">
          {isFetching && !isLoading && (
            <Loader2 className="w-4 h-4 text-[#3b82f6] animate-spin" />
          )}
          <div className="dashboard-control flex flex-wrap p-0.5">
            {timeRanges.map((tr) => (
              <button
                key={tr.value}
                disabled={tr.disabled}
                onClick={() => handleRangeChange(tr.value)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  tr.disabled
                    ? 'text-[color:var(--dash-text-muted)] cursor-not-allowed opacity-45'
                    : range === tr.value
                      ? 'bg-[color:var(--dash-blue)] text-[color:var(--dash-text-on-accent)] shadow-[var(--dash-button-shadow)]'
                      : 'text-[color:var(--dash-text-soft)] hover:text-[color:var(--dash-text)]'
                }`}
              >
                {tr.label}
              </button>
            ))}
          </div>
          <ExportDropdown
            onExportCSV={handleExportCSV}
            onExportJSON={handleExportJSON}
            disabled={!filteredHistory.length}
          />
        </div>
      </div>

      <div className="space-y-6">
        {/* Summary Cards */}
        <DashboardSection id="alert-history-summary" as="div" className={dashboardMetricGridFourClass}>
          <DashboardMetricCard
            label="Total Evaluations"
            value={isLoading ? '-' : String(summary?.total ?? 0)}
            tone="font-mono text-[color:var(--dash-text)]"
          />
          <DashboardMetricCard
            label="Fired"
            value={isLoading ? '-' : String(summary?.fired ?? 0)}
            tone="font-mono text-red-400"
          />
          <DashboardMetricCard
            label="Suppressed"
            value={isLoading ? '-' : String(summary?.suppressed ?? 0)}
            tone="font-mono text-amber-400"
          />
          <DashboardMetricCard
            label="Not Met"
            value={isLoading ? '-' : String(summary?.notMet ?? 0)}
            tone="font-mono text-[color:var(--dash-success)]"
          />
        </DashboardSection>

        {/* Status Filter */}
        <DashboardSection id="alert-history-table" as="div" className="rounded-lg border border-[color:var(--dash-border)] bg-[color:var(--dash-bg-elevated)] overflow-hidden">
            <div className="p-4 border-b border-[color:var(--dash-divider)] flex items-center gap-3 bg-[color:var(--dash-surface)]">
              <FilterDropdown
                label="Status"
                icon={<Filter className="w-3 h-3" />}
                value={statusFilter === 'all' ? null : statusFilter}
                options={[
                  { value: 'fired', label: 'Fired', count: data?.summary.fired ?? 0 },
                  { value: 'suppressed', label: 'Suppressed', count: data?.summary.suppressed ?? 0 },
                  { value: 'not_met', label: 'Not Met', count: data?.summary.notMet ?? 0 },
                  { value: 'no_data', label: 'No Data', count: data?.summary.noData ?? 0 },
                ]}
                onChange={(v) => setStatusFilter(v || 'all')}
              />
              {isFetching && !isLoading && (
                <Loader2 className="w-4 h-4 text-[#3b82f6] animate-spin" />
              )}
            </div>

            {/* Table */}
            {isLoading ? (
              <div className="space-y-2.5 px-4 py-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="grid min-h-[54px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-md px-3 py-2"
                  >
                    <div className="min-w-0 space-y-2">
                      <Skeleton className="h-4 w-[min(100%,16rem)]" />
                      <Skeleton className="h-3 w-[min(100%,10rem)]" />
                    </div>
                    <Skeleton className="h-4 w-12" />
                  </div>
                ))}
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="py-16 text-center text-[color:var(--dash-text-muted)]">
                <div className="w-12 h-12 rounded-full bg-[color:var(--dash-bg-subtle)] border border-[color:var(--dash-border)] flex items-center justify-center mb-3 mx-auto">
                  <Bell className="w-6 h-6 text-[color:var(--dash-text-muted)]" />
                </div>
                <p className="text-[color:var(--dash-text)] font-medium mb-1">No alert history yet</p>
                <p className="text-sm max-w-md mx-auto">
                  Alert evaluations will appear here as your configured alert rules are checked.
                  History is recorded going forward from when the feature was enabled.
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[color:var(--dash-divider)] bg-[color:var(--dash-bg-subtle)]">
                        <th className="text-left px-4 py-3 text-[color:var(--dash-text-soft)] font-medium text-xs uppercase tracking-wider">Time</th>
                        <th className="text-left px-4 py-3 text-[color:var(--dash-text-soft)] font-medium text-xs uppercase tracking-wider">Rule</th>
                        <th className="text-left px-4 py-3 text-[color:var(--dash-text-soft)] font-medium text-xs uppercase tracking-wider">Status</th>
                        <th className="text-left px-4 py-3 text-[color:var(--dash-text-soft)] font-medium text-xs uppercase tracking-wider">Conditions</th>
                        <th className="text-left px-4 py-3 text-[color:var(--dash-text-soft)] font-medium text-xs uppercase tracking-wider">Metric Values</th>
                        <th className="text-left px-4 py-3 text-[color:var(--dash-text-soft)] font-medium text-xs uppercase tracking-wider">Channels</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedHistory.map((entry) => {
                        const badge = STATUS_BADGES[entry.status] ?? { label: entry.status, className: 'bg-[color:var(--dash-blue-soft)] text-[color:var(--dash-blue)]' };
                        return (
                          <tr key={entry.id} className="border-b border-[color:var(--dash-divider)] last:border-b-0 hover:bg-[color:var(--dash-surface-hover)] transition-colors">
                            <td className="px-4 py-3 font-mono text-[color:var(--dash-text-soft)] text-xs whitespace-nowrap">
                              {formatTime(entry.createdAt)}
                            </td>
                            <td className="px-4 py-3 text-[color:var(--dash-text)] text-xs">
                              {entry.ruleName}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${badge.className}`}>
                                {badge.label}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-[color:var(--dash-text-soft)] text-xs font-mono max-w-[200px]">
                              <TruncateWithTooltip
                                text={formatConditions(entry.conditions)}
                                className="font-mono"
                              />
                            </td>
                            <td className="px-4 py-3 text-[color:var(--dash-text-soft)] text-xs font-mono max-w-[250px]">
                              <TruncateWithTooltip
                                text={formatMetricValues(entry.metricValues)}
                                className="font-mono"
                              />
                            </td>
                            <td className="px-4 py-3 text-[color:var(--dash-text-soft)] text-xs">
                              {entry.notificationChannels.length > 0
                                ? entry.notificationChannels.map(ch => (
                                    <span key={ch} className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-[color:var(--dash-blue-soft)] text-[color:var(--dash-blue)] mr-1">
                                      {ch}
                                    </span>
                                  ))
                                : <span className="text-[color:var(--dash-text-muted)]">-</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between px-4 py-3 border-t border-[color:var(--dash-divider)] bg-[color:var(--dash-surface)]">
                  <div className="text-xs text-[color:var(--dash-text-muted)]">
                    Showing {filteredHistory.length > 0 ? ((currentPage - 1) * PAGE_SIZE) + 1 : 0} - {Math.min(currentPage * PAGE_SIZE, filteredHistory.length)} of {filteredHistory.length} evaluations
                  </div>
                  {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-1.5 rounded border border-[#222] text-[#888] hover:text-white hover:border-[#444] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-sm text-[#888]">Page {currentPage} of {totalPages}</span>
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage >= totalPages}
                        className="p-1.5 rounded border border-[#222] text-[#888] hover:text-white hover:border-[#444] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
        </DashboardSection>
      </div>
    </div>
  );
}

