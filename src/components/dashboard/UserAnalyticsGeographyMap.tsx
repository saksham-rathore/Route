'use client';

/**
 * Time Series Component with Redux - Mobile Optimized
 * 
 * Features:
 * - Latency quantiles (p50, p95, p99) over time
 * - Error rate overlay toggle
 * - Time range selection (1h, 6h, 24h, 7d, 30d)
 * - CSV export functionality
 * - Stale-while-revalidate data fetching
 * - Fully responsive design
 */

import { useMemo, useCallback } from 'react';
import {
  ComposedChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Sparkles } from '@/components/dashboard/icons';
import { ExportDropdown } from './ExportDropdown';
import {
  useGetTimeSeriesQuery,
  useAppSelector,
  useAppDispatch,
  useAllowedTimeRanges,
  selectFilters,
  selectTimeseriesState,
  setFilter,
  toggleErrorOverlay,
  TimeSeriesPoint,
} from '@/lib/redux';
import type { TimeRange } from '@/lib/redux';
import { getObservabilityChartAxisProps } from '@/lib/core/chart-time-axis';
import { DashboardSection } from './DashboardSection';
import { DashboardMetricCard } from './DashboardMetricCard';
import { Skeleton } from './DashboardSkeleton';
import { dashboardMetricGridFourClass } from './chart-layout';

interface TimeSeriesProps {
  projectId: string;
}

const TS_SURFACE = 'var(--dash-surface)';
const TS_SURFACE_SUBTLE = 'var(--dash-input-bg)';
const TS_SURFACE_HOVER = 'var(--dash-surface-hover)';
const TS_BORDER = 'var(--dash-divider)';
const TS_TEXT = 'var(--dash-text)';
const TS_TEXT_SOFT = 'var(--dash-text-soft)';
const TS_TEXT_MUTED = 'var(--dash-text-muted)';
const TS_BLUE = 'var(--dash-chart-secondary)';
const TS_TEAL = 'var(--dash-chart-primary)';
const TS_AMBER = 'var(--dash-chart-warning)';
const TS_RED = 'var(--dash-chart-danger)';
const TS_GRID = 'var(--dash-grid)';

// Supported time ranges — disabled flags set dynamically by plan via useAllowedTimeRanges

// Format timestamp based on range
const formatTimestamp = (timestamp: string, range: TimeRange): string => {
  const date = new Date(timestamp);
  switch (range) {
    case '1h':
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    case '6h':
    case '24h':
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    case '7d':
    case '30d':
    case '90d':
    case '1y':
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit' });
    default:
      return date.toLocaleString();
  }
};

// Format latency value
const formatLatency = (ms: number | null | undefined): string => 
  ms != null ? `${ms.toFixed(0)}ms` : '-';

// Format error rate
const formatErrorRate = (rate: number | null | undefined): string => 
  rate != null ? `${rate.toFixed(1)}%` : '-';

// Custom tooltip component
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    color: string;
    name: string;
    value: number;
    dataKey: string;
    payload: {
      timestamp: string;
    };
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload || !payload.length) return null;

  // Get raw timestamp from first payload for proper formatting
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
    <div
      className="rounded-lg border p-3 shadow-lg max-w-[200px]"
      style={{ backgroundColor: TS_SURFACE, borderColor: TS_BORDER }}
    >
      <p className="mb-2 text-xs font-mono" style={{ color: TS_TEXT_MUTED }}>{displayLabel}</p>
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="min-w-[70px]" style={{ color: TS_TEXT_MUTED }}>{entry.name}:</span>
            <span className="font-mono" style={{ color: TS_TEXT }}>
              {entry.dataKey === 'errorRate' ? formatErrorRate(entry.value) : formatLatency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Generate CSV content
const generateCSV = (data: TimeSeriesPoint[], range: string): string => {
  const headers = ['Timestamp', 'p50 Latency (ms)', 'p95 Latency (ms)', 'p99 Latency (ms)', 'Error Rate (%)', 'Request Count'];
  const rows = data.map(point => [
    point.timestamp,
    point.p50,
    point.p95,
    point.p99,
    point.errorRate.toFixed(2),
    point.requestCount,
  ]);
  
  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
};

// Download CSV file
const downloadCSV = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
};

export function TimeSeries({ projectId }: TimeSeriesProps) {
  const dispatch = useAppDispatch();
  
  // Get UI state from Redux
  const filters = useAppSelector(selectFilters('timeseries'));
  const timeseriesState = useAppSelector(selectTimeseriesState);
  
  const range = (filters.range as TimeRange) || '7d';
  const showErrorOverlay = timeseriesState.showErrorOverlay;

  // Plan-aware time ranges
  const timeRanges = useAllowedTimeRanges(['1h', '6h', '24h', '7d', '30d', '90d', '1y']);
  
  // RTK Query for timeseries data
  const {
    data: timeSeriesData,
    isLoading,
    isFetching,
    error,
  } = useGetTimeSeriesQuery({
    projectId,
    range,
  });
  
  const data = timeSeriesData?.data || [];
  const summary = timeSeriesData?.summary;
  
  // Handle range change
  const handleRangeChange = useCallback((newRange: TimeRange) => {
    dispatch(setFilter({ page: 'timeseries', key: 'range', value: newRange }));
  }, [dispatch]);
  
  // Handle CSV export
  const handleExportCSV = useCallback(() => {
    if (data.length > 0) {
      const csv = generateCSV(data, range);
      const filename = `timeseries-${projectId}-${range}-${new Date().toISOString().split('T')[0]}.csv`;
      downloadCSV(csv, filename);
    }
  }, [data, range, projectId]);

  // Handle JSON export
  const handleExportJSON = useCallback(() => {
    if (timeSeriesData) {
      const jsonStr = JSON.stringify(timeSeriesData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `timeseries-${projectId}-${range}-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(link.href);
    }
  }, [timeSeriesData, projectId, range]);
  
  // Calculate Y-axis domains
  const latencyDomain = useMemo(() => {
    if (!data.length) return [0, 500];
    const maxP99 = Math.max(...data.map((d: TimeSeriesPoint) => d.p99));
    return [0, Math.ceil(maxP99 / 100) * 100];
  }, [data]);
  
  const errorDomain = useMemo(() => {
    if (!data.length) return [0, 10];
    const maxError = Math.max(...data.map((d: TimeSeriesPoint) => d.errorRate));
    return [0, Math.max(10, Math.ceil(maxError))];
  }, [data]);
  
  // Chart data - keep original timestamp for proper tooltip and axis formatting
  const chartData = useMemo(() => {
    return data.map((point: TimeSeriesPoint) => ({
      ...point,
      // Keep original timestamp - formatting is done in tickFormatter and tooltip
      timestamp: point.timestamp,
    }));
  }, [data]);

  const chartAxis = useMemo(
    () => getObservabilityChartAxisProps(range, chartData),
    [range, chartData],
  );
  
  // Check if there's data
  const hasData = data.length > 0;
  
  return (
    <div className="max-w-350 mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8 pb-24 sm:pb-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight text-[color:var(--dash-text)]">Global Performance History</h1>
          <p className="mt-1 text-sm text-[color:var(--dash-text-soft)]">Latency trends and error correlation</p>
        </div>
        <div className="flex shrink-0 self-start items-center gap-2">
          <div className="dashboard-control flex w-max max-w-full shrink-0 flex-nowrap overflow-x-auto p-0.5">
            {timeRanges.map((timeRange) => (
              <button
                key={timeRange.value}
                onClick={() => !timeRange.disabled && handleRangeChange(timeRange.value)}
                disabled={timeRange.disabled}
                className={`shrink-0 whitespace-nowrap px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  timeRange.disabled
                    ? 'cursor-not-allowed text-[color:var(--dash-text-muted)] opacity-45'
                    : range === timeRange.value
                      ? 'bg-[color:var(--dash-blue)] text-[color:var(--dash-text-on-accent)] shadow-[var(--dash-button-shadow)]'
                      : 'text-[color:var(--dash-text-soft)] hover:text-[color:var(--dash-text)]'
                }`}
              >
                {timeRange.label}
              </button>
            ))}
          </div>
          <ExportDropdown onExportCSV={handleExportCSV} onExportJSON={handleExportJSON} disabled={!hasData || isLoading} />
        </div>
      </div>

      {/* Summary Stats */}
      <DashboardSection id="timeseries-summary" as="div" className={`mb-4 sm:mb-6 ${dashboardMetricGridFourClass}`}>
        <DashboardMetricCard
          label="Avg p50"
          value={summary ? formatLatency(summary.avgP50) : isLoading ? '-' : '0ms'}
          tone="font-mono text-[color:var(--dash-text)]"
        />
        <DashboardMetricCard
          label="Avg p95"
          value={summary ? formatLatency(summary.avgP95) : isLoading ? '-' : '0ms'}
          tone="font-mono text-[color:var(--dash-text)]"
        />
        <DashboardMetricCard
          label="Avg p99"
          value={summary ? formatLatency(summary.avgP99) : isLoading ? '-' : '0ms'}
          tone="font-mono text-[color:var(--dash-text)]"
        />
        <DashboardMetricCard
          label="Error Rate"
          value={summary ? formatErrorRate(summary.avgErrorRate) : isLoading ? '-' : '0%'}
          tone={`font-mono ${summary && summary.avgErrorRate > 1 ? 'text-[color:var(--dash-danger)]' : 'text-[color:var(--dash-text)]'}`}
        />
      </DashboardSection>

      {/* Main Dashboard Card */}
      <DashboardSection
        id="timeseries-latency-chart"
        as="div"
        className="rounded-lg overflow-hidden border"
        style={{ backgroundColor: TS_SURFACE, borderColor: TS_BORDER }}
      >
        {/* Header */}
        <div className="border-b px-3 py-3 sm:px-4 sm:py-4 lg:px-6" style={{ borderColor: TS_BORDER, backgroundColor: TS_SURFACE }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold sm:text-base" style={{ color: TS_TEXT }}>Latency Quantiles over Time</h2>
              <p className="truncate text-[10px] sm:text-xs" style={{ color: TS_TEXT_MUTED }}>Aggregated across all endpoints and carriers</p>
            </div>
          </div>
        </div>
        
        {/* Chart Container */}
        <div className="p-3 sm:p-4 lg:p-6">
          {isLoading ? (
            <Skeleton className="h-[250px] w-full rounded-lg sm:h-[300px] lg:h-[360px]" />
          ) : error ? (
            <div className="h-[250px] sm:h-[300px] lg:h-[360px] flex flex-col items-center justify-center text-red-400">
              <p className="text-sm">Error loading data</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 text-xs sm:text-sm text-[#3b82f6] hover:underline"
              >
                Retry
              </button>
            </div>
          ) : !hasData ? (
            <div className="h-[250px] sm:h-[300px] lg:h-[360px] flex flex-col items-center justify-center text-[#666]">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#1a1a1a] border border-[#222] flex items-center justify-center mb-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#444]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <p className="text-white font-medium mb-1 text-sm">No data available</p>
              <p className="text-xs sm:text-sm">No measurements found for the selected time range.</p>
            </div>
          ) : (
            <>
              {/* Main Chart */}
              <div className="h-[250px] sm:h-[300px] lg:h-[360px] mb-3 sm:mb-4">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <ComposedChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
                  >
                    <defs>
                      <filter id="tsShadowBlue" x="-18%" y="-30%" width="136%" height="190%">
                        <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor={TS_BLUE} floodOpacity="0.2" />
                      </filter>
                      <filter id="tsShadowTeal" x="-18%" y="-30%" width="136%" height="190%">
                        <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor={TS_TEAL} floodOpacity="0.18" />
                      </filter>
                      <filter id="tsShadowAmber" x="-18%" y="-30%" width="136%" height="190%">
                        <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor={TS_AMBER} floodOpacity="0.18" />
                      </filter>
                      <filter id="tsShadowRed" x="-18%" y="-30%" width="136%" height="190%">
                        <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor={TS_RED} floodOpacity="0.16" />
                      </filter>
                      <linearGradient id="tsFillBlue" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={TS_BLUE} stopOpacity={0.12} />
                        <stop offset="100%" stopColor={TS_BLUE} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="tsFillTeal" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={TS_TEAL} stopOpacity={0.1} />
                        <stop offset="100%" stopColor={TS_TEAL} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="tsFillAmber" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={TS_AMBER} stopOpacity={0.1} />
                        <stop offset="100%" stopColor={TS_AMBER} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="0"
                      stroke={TS_GRID}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="timestamp"
                      interval={chartAxis.interval}
                      minTickGap={chartAxis.minTickGap}
                      tickFormatter={chartAxis.tickFormatter}
                      stroke={TS_TEXT_MUTED}
                      tick={{ fill: TS_TEXT_MUTED, fontSize: 9, fontFamily: 'JetBrains Mono, monospace' }}
                      tickLine={false}
                      axisLine={{ stroke: TS_BORDER }}
                    />
                    <YAxis
                      yAxisId="latency"
                      domain={latencyDomain}
                      tickFormatter={(value) => `${value}ms`}
                      stroke={TS_TEXT_MUTED}
                      tick={{ fill: TS_TEXT_MUTED, fontSize: 9, fontFamily: 'JetBrains Mono, monospace' }}
                      tickLine={false}
                      axisLine={false}
                      width={45}
                    />
                    {showErrorOverlay && (
                      <YAxis
                        yAxisId="error"
                        orientation="right"
                        domain={errorDomain}
                        tickFormatter={(value) => `${value}%`}
                        stroke={TS_RED}
                        tick={{ fill: TS_RED, fontSize: 9, fontFamily: 'JetBrains Mono, monospace', opacity: 0.7 }}
                        tickLine={false}
                        axisLine={false}
                        width={35}
                      />
                    )}
                    <Area
                      yAxisId="latency"
                      type="monotone"
                      dataKey="p99"
                      fill="url(#tsFillAmber)"
                      fillOpacity={1}
                      stroke="none"
                      connectNulls
                      isAnimationActive={false}
                    />
                    <Area
                      yAxisId="latency"
                      type="monotone"
                      dataKey="p95"
                      fill="url(#tsFillTeal)"
                      fillOpacity={1}
                      stroke="none"
                      connectNulls
                      isAnimationActive={false}
                    />
                    <Area
                      yAxisId="latency"
                      type="monotone"
                      dataKey="p50"
                      fill="url(#tsFillBlue)"
                      fillOpacity={1}
                      stroke="none"
                      connectNulls
                      isAnimationActive={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    
                    {/* p50 Latency Line */}
                    <Line
                      yAxisId="latency"
                      type="monotone"
                      dataKey="p50"
                      name="p50"
                      stroke={TS_BLUE}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, strokeWidth: 0 }}
                      isAnimationActive={false}
                      filter="url(#tsShadowBlue)"
                    />
                    
                    {/* p95 Latency Line */}
                    <Line
                      yAxisId="latency"
                      type="monotone"
                      dataKey="p95"
                      name="p95"
                      stroke={TS_TEAL}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, strokeWidth: 0 }}
                      isAnimationActive={false}
                      strokeOpacity={1}
                      filter="url(#tsShadowTeal)"
                    />
                    
                    {/* p99 Latency Line */}
                    <Line
                      yAxisId="latency"
                      type="monotone"
                      dataKey="p99"
                      name="p99"
                      stroke={TS_AMBER}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, strokeWidth: 0 }}
                      isAnimationActive={false}
                      strokeOpacity={0.95}
                      filter="url(#tsShadowAmber)"
                    />
                    
                    {/* Error Rate Line */}
                    {showErrorOverlay && (
                      <Line
                        yAxisId="error"
                        type="monotone"
                        dataKey="errorRate"
                        name="Errors"
                        stroke={TS_RED}
                        strokeWidth={1.5}
                        strokeDasharray="4 4"
                        dot={false}
                        activeDot={{ r: 3, strokeWidth: 0 }}
                        isAnimationActive={false}
                        strokeOpacity={0.6}
                        filter="url(#tsShadowRed)"
                      />
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              

              {/* Legend and Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 sm:gap-6">
                  {/* p50 Legend */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="h-1.5 w-1.5 rounded-full sm:h-2 sm:w-2" style={{ backgroundColor: TS_BLUE }} />
                    <span className="text-[10px] sm:text-xs" style={{ color: TS_TEXT_MUTED }}>p50</span>
                  </div>
                  {/* p95 Legend */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-1.5 h-1.5 rounded-full sm:h-2 sm:w-2" style={{ backgroundColor: TS_TEAL }} />
                    <span className="text-[10px] sm:text-xs" style={{ color: TS_TEXT_MUTED }}>p95</span>
                  </div>
                  {/* p99 Legend */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-1.5 h-1.5 rounded-full sm:h-2 sm:w-2" style={{ backgroundColor: TS_AMBER }} />
                    <span className="text-[10px] sm:text-xs" style={{ color: TS_TEXT_MUTED }}>p99</span>
                  </div>
                </div>
                
                {/* Error Rate Toggle */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div 
                      className="h-0.5 w-2.5 sm:w-3"
                      style={{ backgroundColor: TS_RED, height: '2px' }}
                    />
                    <span className="text-[10px] sm:text-xs" style={{ color: TS_TEXT_MUTED }}>Error Rate</span>
                  </div>
                  <button
                    onClick={() => dispatch(toggleErrorOverlay())}
                    className={`
                      relative w-7 sm:w-8 h-3.5 sm:h-4 rounded-full transition-colors
                    `}
                    style={{ backgroundColor: showErrorOverlay ? TS_RED : TS_TEXT_MUTED }}
                  >
                    <div
                      className={`
                        absolute top-0.5 w-2.5 sm:w-3 h-2.5 sm:h-3 bg-white rounded-full transition-all
                        ${showErrorOverlay ? 'translate-x-3.5 sm:translate-x-4' : 'translate-x-0.5'}
                      `}
                      style={{ left: '2px' }}
                    />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

      </DashboardSection>
      
      {/* AI Pill */}
</div>
  );
}
