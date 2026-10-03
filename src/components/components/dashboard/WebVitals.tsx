'use client';

/**
 * Web Vitals Dashboard Component
 *
 * Displays Core Web Vitals (LCP, FCP, CLS, INP, TTFB) with:
 * - Summary cards showing p75 + rating distribution gauge
 * - Timeseries chart showing p75 trends over time
 * - Country breakdown table
 * - Connection type breakdown table
 * - Time range selector
 */

import { Fragment, useCallback } from 'react';
import { Loader2, Globe, Wifi } from '@/components/dashboard/icons';
import { dashboardChartHeight } from '@/components/dashboard/chart-layout';
import { ExportDropdown } from './ExportDropdown';
import { exportCSV, exportJSON, exportFilename, type ExportColumn } from '@/lib/core/export';
import { getCountryFlagSrc, normalizeCountryDisplayName, getCountryName } from './country-flags';
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  useGetVitalsQuery,
  useAppSelector,
  useAppDispatch,
  selectFilters,
  setFilter,
  useAllowedTimeRanges,
  VitalSummary,
  VitalsTimeSeriesPoint,
  VitalsCountryBreakdown,
  VitalsConnectionBreakdown,
  isQueryPending,
  shouldShowQueryError,
} from '@/lib/redux';
import type { TimeRange } from '@/lib/redux/hooks/useAllowedTimeRanges';
import { getObservabilityChartAxisProps } from '@/lib/core/chart-time-axis';
import { DashboardSection } from './DashboardSection';
import { DashboardQueryError, DashboardQueryLoading } from './DashboardQueryStatus';

interface WebVitalsProps {
  projectId: string;
}

// Vital metric metadata
const VITAL_META: Record<string, {
  label: string;
  fullName: string;
  unit: string;
  thresholds: [number, number]; // [good, poor]
  isCls?: boolean;
}> = {
  LCP: { label: 'LCP', fullName: 'Largest Contentful Paint', unit: 'ms', thresholds: [2500, 4000] },
  FCP: { label: 'FCP', fullName: 'First Contentful Paint', unit: 'ms', thresholds: [1800, 3000] },
  CLS: { label: 'CLS', fullName: 'Cumulative Layout Shift', unit: '', thresholds: [100, 250], isCls: true },
  INP: { label: 'INP', fullName: 'Interaction to Next Paint', unit: 'ms', thresholds: [200, 500] },
  TTFB: { label: 'TTFB', fullName: 'Time to First Byte', unit: 'ms', thresholds: [800, 1800] },
};

const VITAL_COLORS: Record<string, string> = {
  LCP: '#8b5cf6',
  FCP: '#3b82f6',
  CLS: '#f59e0b',
  INP: '#ef4444',
  TTFB: 'var(--dash-success)',
};

function vitalShadowId(name: string): string {
  return `vitals-shadow-${name.toLowerCase()}`;
}

function vitalFillId(name: string): string {
  return `vitals-fill-${name.toLowerCase()}`;
}

// Format a vital value for display
function formatVitalValue(name: string, value: number | null): string {
  if (value === null || value === undefined) return '-';
  const meta = VITAL_META[name];
  if (!meta) return String(value);
  if (meta.isCls) return (value / 1000).toFixed(3);
  return `${Math.round(value)}`;
}

// Get rating chip color
function getRatingColor(rating: 'good' | 'needs-improvement' | 'poor' | string): string {
  switch (rating) {
    case 'good': return 'text-[color:var(--dash-success)]';
    case 'needs-improvement': return 'text-[color:var(--dash-warning)]';
    case 'poor': return 'text-[color:var(--dash-danger)]';
    default: return 'text-[color:var(--dash-text-muted)]';
  }
}

function getMetricValueColor(rating: 'good' | 'needs-improvement' | 'poor' | string): string {
  switch (rating) {
    case 'poor':
      return 'text-[color:var(--dash-text)]';
    case 'needs-improvement':
      return 'text-[color:var(--dash-text)]';
    case 'good':
      return 'text-[color:var(--dash-text)]';
    default:
      return 'text-[color:var(--dash-text-muted)]';
  }
}

function getRatingBg(rating: 'good' | 'needs-improvement' | 'poor' | string): string {
  switch (rating) {
    case 'good': return 'bg-[color:var(--dash-success)]';
    case 'needs-improvement': return 'bg-[color:var(--dash-warning)]';
    case 'poor': return 'bg-[color:var(--dash-danger)]';
    default: return 'bg-[color:var(--dash-text-muted)]';
  }
}

// Determine rating from value using thresholds
function getRatingFromValue(name: string, value: number | null): string {
  if (value === null || value === undefined) return 'unknown';
  const meta = VITAL_META[name];
  if (!meta) return 'unknown';
  if (value <= meta.thresholds[0]) return 'good';
  if (value <= meta.thresholds[1]) return 'needs-improvement';
  return 'poor';
}

// Rating distribution bar component
function RatingBar({ good, needsImprovement, poor }: { good: number; needsImprovement: number; poor: number }) {
  const total = good + needsImprovement + poor;
  if (total === 0) return <div className="h-2 rounded-full bg-[#222] w-full" />;
  
  const goodPct = (good / total) * 100;
  const niPct = (needsImprovement / total) * 100;
  const poorPct = (poor / total) * 100;

  return (
    <div className="flex h-2 rounded-full overflow-hidden w-full gap-px">
      {goodPct > 0 && <div className="rounded-l-full bg-[color:var(--dash-success)]" style={{ width: `${goodPct}%` }} />}
      {niPct > 0 && <div className="bg-[color:var(--dash-warning)]" style={{ width: `${niPct}%` }} />}
      {poorPct > 0 && <div className="bg-[color:var(--dash-danger)] rounded-r-full" style={{ width: `${poorPct}%` }} />}
    </div>
  );
}

// Summary card for a single vital
function VitalCard({ vital }: { vital: VitalSummary }) {
  const meta = VITAL_META[vital.name];
  if (!meta) return null;

  const rating = getRatingFromValue(vital.name, vital.p75);
  const displayValue = formatVitalValue(vital.name, vital.p75);
  const unit = meta.isCls ? '' : meta.unit;

  return (
    <div className="bg-[#111] border border-[#222] rounded-lg p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-xs text-[#888] uppercase tracking-wider">{meta.label}</span>
          <p className="text-[10px] text-[#666] mt-0.5">{meta.fullName}</p>
        </div>
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${getRatingBg(rating)}/15 ${getRatingColor(rating)} uppercase tracking-tight`}>
          {rating === 'needs-improvement' ? 'Needs Work' : rating === 'unknown' ? '-' : rating}
        </span>
      </div>

      <div className="flex items-baseline gap-1 mb-4">
        <span className={`text-3xl font-mono font-semibold ${getMetricValueColor(rating)}`}>
          {displayValue}
        </span>
        {unit && <span className="text-sm text-[#666]">{unit}</span>}
      </div>

      <div className="space-y-2">
        <RatingBar
          good={vital.good}
          needsImprovement={vital.needsImprovement}
          poor={vital.poor}
        />
        <div className="flex justify-between text-[10px] text-[#666]">
          <span>{vital.total} samples</span>
          <div className="flex gap-3">
            <span className="text-[color:var(--dash-success)]">{vital.total ? Math.round((vital.good / vital.total) * 100) : 0}% good</span>
            <span className="text-[#ff7b72]">{vital.total ? Math.round((vital.poor / vital.total) * 100) : 0}% poor</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Custom tooltip for timeseries chart
function VitalsTooltip({ 
  active, 
  payload, 
  label 
}: { 
  active?: boolean; 
  payload?: Array<{ dataKey: string; value: number | null; color: string; payload: { timestamp: string } }>;
  label?: string;
}) {
  if (!active || !payload || !payload.length) return null;

  // Get raw timestamp from payload for better formatting
  const rawTimestamp = payload[0]?.payload?.timestamp;
  const displayLabel = rawTimestamp 
    ? new Date(rawTimestamp).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : label;

  return (
    <div className="bg-[#1a1a1a] border border-[#333] rounded px-3 py-2 shadow-lg">
      <p className="text-xs text-[#888] mb-1.5">{displayLabel}</p>
      {payload.map((entry) => {
        if (entry.value === null || entry.value === undefined) return null;
        const meta = VITAL_META[entry.dataKey];
        return (
          <p key={entry.dataKey} className="text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: entry.color }} />
            <span className="text-[#888]">{meta?.label || entry.dataKey}:</span>
            <span className="text-white font-mono">
              {formatVitalValue(entry.dataKey, entry.value)}
              {meta && !meta.isCls ? 'ms' : ''}
            </span>
          </p>
        );
      })}
    </div>
  );
}

// Timeseries chart for vitals trends
function VitalsChart({ 
  data, 
  isLoading,
  timeRange
}: { 
  data: VitalsTimeSeriesPoint[];
  isLoading: boolean;
  timeRange: TimeRange;
}) {
  if (isLoading) {
    return (
      <div className={`${dashboardChartHeight.standard} flex items-center justify-center`}>
        <div className="animate-spin w-6 h-6 border-2 border-[#3b82f6] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={`${dashboardChartHeight.standard} flex items-center justify-center text-[#666] text-sm`}>
        No timeseries data available
      </div>
    );
  }

  // Keep original timestamp for proper axis formatting and tooltips
  const chartData = data.map(point => ({
    ...point,
    timestamp: point.timestamp,
  }));
  const chartAxis = getObservabilityChartAxisProps(timeRange, chartData);

  return (
    <div className={dashboardChartHeight.standard}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
        <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            {Object.entries(VITAL_COLORS).map(([key, color]) => (
              <Fragment key={`defs-${key}`}>
                <filter id={vitalShadowId(key)} x="-18%" y="-30%" width="136%" height="190%">
                  <feDropShadow
                    dx="0"
                    dy="8"
                    stdDeviation="7"
                    floodColor={color}
                    floodOpacity="0.18"
                  />
                </filter>
                <linearGradient id={vitalFillId(key)} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.14} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </Fragment>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
          <XAxis
            dataKey="timestamp"
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
          <Tooltip content={<VitalsTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '11px', color: '#888', paddingTop: '8px' }}
          />
          {Object.entries(VITAL_COLORS).map(([key, color]) => (
            <Fragment key={key}>
              <Area
                type="monotone"
                dataKey={key}
                stroke="none"
                fill={`url(#${vitalFillId(key)})`}
                fillOpacity={1}
                connectNulls
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey={key}
                stroke={color}
                strokeWidth={1.5}
                dot={false}
                connectNulls
                name={VITAL_META[key]?.label || key}
                isAnimationActive={false}
                filter={`url(#${vitalShadowId(key)})`}
              />
            </Fragment>
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

// Country breakdown table
function CountryTable({ 
  data, 
  isLoading 
}: { 
  data: VitalsCountryBreakdown[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <div className="animate-spin w-5 h-5 border-2 border-[#3b82f6] border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="py-12 text-center text-[#666] text-sm">No country data available</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#222] bg-[#0a0a0a]">
            <th className="text-left px-4 py-3 text-[#888] font-medium text-xs uppercase tracking-wider">Country</th>
            <th className="text-right px-4 py-3 text-[#888] font-medium text-xs uppercase tracking-wider">Samples</th>
            <th className="text-right px-4 py-3 text-[#888] font-medium text-xs uppercase tracking-wider">LCP</th>
            <th className="text-right px-4 py-3 text-[#888] font-medium text-xs uppercase tracking-wider">FCP</th>
            <th className="text-right px-4 py-3 text-[#888] font-medium text-xs uppercase tracking-wider">CLS</th>
            <th className="text-right px-4 py-3 text-[#888] font-medium text-xs uppercase tracking-wider">INP</th>
            <th className="text-right px-4 py-3 text-[#888] font-medium text-xs uppercase tracking-wider">TTFB</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.country} className="border-b border-[#222] last:border-b-0 hover:bg-[#161616] transition-colors">
              <td className="px-4 py-3 align-middle">
                <div className="flex items-center gap-3">
                  <div className="inline-flex min-h-5 min-w-6 items-center justify-center">
                    {getCountryFlagSrc(row.country) ? (
                      <img
                        src={getCountryFlagSrc(row.country)!}
                        alt=""
                        className="h-4 w-5 rounded-[2px] object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-[10px] font-mono text-[#666]">-</span>
                    )}
                  </div>
                  <span className="text-[color:var(--dash-text)] font-medium text-xs">
                    {getCountryName(row.country)}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-right text-[#888] font-mono text-xs">
                {row.samples?.toLocaleString() || '0'}
              </td>
              <VitalCell name="LCP" value={row.LCP} />
              <VitalCell name="FCP" value={row.FCP} />
              <VitalCell name="CLS" value={row.CLS} />
              <VitalCell name="INP" value={row.INP} />
              <VitalCell name="TTFB" value={row.TTFB} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Connection type breakdown table
function ConnectionTable({ 
  data, 
  isLoading 
}: { 
  data: VitalsConnectionBreakdown[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <div className="animate-spin w-5 h-5 border-2 border-[#3b82f6] border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="py-12 text-center text-[#666] text-sm">No connection data available</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#222] bg-[#0a0a0a]">
            <th className="text-left px-4 py-3 text-[#888] font-medium text-xs uppercase tracking-wider">Connection</th>
            <th className="text-right px-4 py-3 text-[#888] font-medium text-xs uppercase tracking-wider">Samples</th>
            <th className="text-right px-4 py-3 text-[#888] font-medium text-xs uppercase tracking-wider">LCP</th>
            <th className="text-right px-4 py-3 text-[#888] font-medium text-xs uppercase tracking-wider">FCP</th>
            <th className="text-right px-4 py-3 text-[#888] font-medium text-xs uppercase tracking-wider">CLS</th>
            <th className="text-right px-4 py-3 text-[#888] font-medium text-xs uppercase tracking-wider">INP</th>
            <th className="text-right px-4 py-3 text-[#888] font-medium text-xs uppercase tracking-wider">TTFB</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.connType} className="border-b border-[#222] last:border-b-0 hover:bg-[#161616] transition-colors">
              <td className="px-4 py-3">
                <span className="text-[color:var(--dash-text)] font-mono text-xs">{row.connType || 'Unknown'}</span>
              </td>
              <td className="px-4 py-3 text-right text-[#888] font-mono text-xs">
                {row.samples?.toLocaleString() || '0'}
              </td>
              <VitalCell name="LCP" value={row.LCP} />
              <VitalCell name="FCP" value={row.FCP} />
              <VitalCell name="CLS" value={row.CLS} />
              <VitalCell name="INP" value={row.INP} />
              <VitalCell name="TTFB" value={row.TTFB} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Table cell for a vital value (colored by rating)
function VitalCell({ name, value }: { name: string; value: number | null }) {
  const rating = getRatingFromValue(name, value);
  const display = formatVitalValue(name, value);
  const meta = VITAL_META[name];
  const unit = meta?.isCls ? '' : 'ms';

  return (
    <td className={`px-4 py-3 text-right font-mono text-xs ${getMetricValueColor(rating)}`}>
      {value !== null && value !== undefined ? `${display}${unit}` : '-'}
    </td>
  );
}

// Main Web Vitals component
export function WebVitals({ projectId }: WebVitalsProps) {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters('vitals')) as { range: string };
  const timeRange = filters.range as TimeRange;
  const timeRanges = useAllowedTimeRanges(['1h', '24h', '7d', '30d', '90d', '1y']);

  const handleTimeRangeChange = (range: TimeRange) => {
    dispatch(setFilter({ page: 'vitals', key: 'range', value: range }));
  };

  const {
    data,
    isLoading,
    isFetching,
    isUninitialized,
    error,
    refetch,
  } = useGetVitalsQuery({
    projectId,
    range: timeRange,
  });

  const queryState = { data, error, isLoading, isFetching, isUninitialized };

  const summary = data?.summary || [];
  const timeseries = data?.timeseries || [];
  const countries = data?.countries || [];
  const connections = data?.connections || [];

  const timeseriesColumns: ExportColumn<VitalsTimeSeriesPoint>[] = [
    { key: 'timestamp', header: 'Timestamp' },
    { key: 'LCP', header: 'LCP (ms)' },
    { key: 'FCP', header: 'FCP (ms)' },
    { key: 'CLS', header: 'CLS' },
    { key: 'INP', header: 'INP (ms)' },
    { key: 'TTFB', header: 'TTFB (ms)' },
  ];

  const handleExportCSV = useCallback(() => {
    if (!timeseries.length) return;
    exportCSV(timeseries, timeseriesColumns, exportFilename('vitals', projectId, timeRange, 'csv'));
  }, [timeseries, projectId, timeRange]);

  const handleExportJSON = useCallback(() => {
    if (!data) return;
    exportJSON(data, exportFilename('vitals', projectId, timeRange, 'json'));
  }, [data, projectId, timeRange]);

  // Order summary in the standard CWV order
  const orderedVitals = ['LCP', 'FCP', 'CLS', 'INP', 'TTFB'];
  const orderedSummary = orderedVitals
    .map(name => summary.find((v: VitalSummary) => v.name === name))
    .filter(Boolean) as VitalSummary[];

  if (isQueryPending(queryState)) {
    return (
      <div className="max-w-350 mx-auto px-4 sm:px-6 py-8">
        <DashboardQueryLoading variant="page" metrics={5} rows={4} />
      </div>
    );
  }

  if (shouldShowQueryError(queryState)) {
    return (
      <div className="max-w-350 mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight text-[color:var(--dash-text)]">Web Vitals</h1>
          <p className="mt-1 text-sm text-[color:var(--dash-text-soft)]">Core Web Vitals performance metrics</p>
        </div>
        <div className="bg-[#0a0a0a] border border-[#222] rounded-lg">
          <DashboardQueryError
            message="Failed to load Web Vitals data."
            onRetry={() => void refetch()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-350 mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight text-[color:var(--dash-text)]">Web Vitals</h1>
          <p className="mt-1 text-sm text-[color:var(--dash-text-soft)]">Google Core Web Vitals — LCP, INP, and CLS</p>
        </div>
        <div className="flex shrink-0 self-start items-center gap-2">
          <div className="dashboard-control flex w-max max-w-full shrink-0 flex-nowrap p-0.5">
            {timeRanges.map((r) => (
              <button
                key={r.value}
                onClick={() => !r.disabled && handleTimeRangeChange(r.value)}
                disabled={r.disabled}
                className={`shrink-0 whitespace-nowrap px-3 py-1.5 text-xs font-medium rounded transition-colors ${
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
            disabled={isLoading || timeseries.length === 0}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="space-y-6">

          {/* Summary cards */}
          <DashboardSection id="web-vitals-summary" as="div">
            {isLoading ? (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
              {orderedVitals.map(name => (
                <div key={name} className="bg-[#111] border border-[#222] rounded-lg p-5 h-[140px] flex items-center justify-center">
                  <div className="animate-spin w-5 h-5 border-2 border-[#3b82f6] border-t-transparent rounded-full" />
                </div>
              ))}
            </div>
            ) : orderedSummary.length === 0 ? (
            <div className="bg-[#111] border border-[#222] rounded-lg p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-[#111] border border-[#222] flex items-center justify-center mb-3 mx-auto">
                <svg className="w-6 h-6 text-[#666]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-white font-medium mb-1">No Web Vitals data yet</p>
              <p className="text-sm text-[#666]">Vitals will appear here once your tracker starts capturing CWV metrics from real users.</p>
            </div>
            ) : (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
              {orderedSummary.map(vital => (
                <VitalCard key={vital.name} vital={vital} />
              ))}
            </div>
            )}
          </DashboardSection>

          {/* Timeseries chart */}
          <DashboardSection id="web-vitals-timeseries" as="div" className="bg-[#111] border border-[#222] rounded-lg p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-base font-semibold mb-1">Vitals Over Time</h2>
                <p className="text-xs text-[#888]">p75 values per metric over the selected time range</p>
              </div>
            </div>
            <VitalsChart data={timeseries} isLoading={isLoading} timeRange={timeRange} />
          </DashboardSection>

          {/* Country breakdown */}
          <DashboardSection id="web-vitals-country-table" as="div" className="bg-[#111] border border-[#222] rounded-lg overflow-hidden">
            <div className="p-4 border-b border-[#222] flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#888]" />
              <h2 className="text-sm font-semibold">Performance by Country</h2>
              <span className="text-[10px] text-[#666] ml-auto">p75 values</span>
            </div>
            <CountryTable data={countries} isLoading={isLoading} />
          </DashboardSection>

          {/* Connection type breakdown */}
          <DashboardSection id="web-vitals-connection-table" as="div" className="bg-[#111] border border-[#222] rounded-lg overflow-hidden">
            <div className="p-4 border-b border-[#222] flex items-center gap-2">
              <Wifi className="w-4 h-4 text-[#888]" />
              <h2 className="text-sm font-semibold">Performance by Connection Type</h2>
              <span className="text-[10px] text-[#666] ml-auto">p75 values</span>
            </div>
            <ConnectionTable data={connections} isLoading={isLoading} />
          </DashboardSection>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-xs text-[color:var(--dash-text-muted)]">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-[color:var(--dash-success)]" />
              <span>Good</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[color:var(--dash-warning)]" />
              <span>Needs Improvement</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[color:var(--dash-danger)]" />
              <span>Poor</span>
            </div>
            <span className="ml-2">|</span>
            <span>Thresholds follow <a href="https://web.dev/articles/vitals" target="_blank" rel="noopener noreferrer" className="text-[#3b82f6] hover:underline">web.dev</a> definitions at p75</span>
          </div>
      </div>
    </div>
  );
}
