'use client';

import { useCallback, useMemo } from 'react';
import { DashboardMetricCard } from '@/components/dashboard/DashboardMetricCard';
import { DashboardMetricDelta } from '@/components/dashboard/DashboardMetricDelta';
import { dashboardChartHeight, dashboardMetricGridFourClass } from '@/components/dashboard/chart-layout';
import { Loader2 } from '@/components/dashboard/icons';
import { Skeleton } from '@/components/dashboard/DashboardSkeleton';
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ProjectStats,
  TimeSeriesPoint,
  selectFilters,
  setFilter,
  useAllowedTimeRanges,
  useAppDispatch,
  useAppSelector,
  useGetStatsQuery,
  useGetTimeSeriesQuery,
} from '@/lib/redux';
import type { TimeRange } from '@/lib/redux/hooks/useAllowedTimeRanges';
import { trackEvent, RouteEvents } from '@/lib/analytics/route-analytics';
import { getObservabilityChartAxisProps } from '@/lib/core/chart-time-axis';
import { normalizeTimeRange } from '@/lib/core/time-range';
import { DashboardSection } from './DashboardSection';

export interface ProjectOverviewProps {
  projectId: string;
}

const formatLatency = (ms: number | null | undefined): string => {
  if (ms === null || ms === undefined) return '-';
  return `${Math.round(ms)}ms`;
};

const formatErrorRate = (rate: number | null | undefined): string => {
  if (rate === null || rate === undefined) return '-';
  return `${rate.toFixed(2)}%`;
};

const formatNumber = (num: number | null | undefined): string => {
  if (num === null || num === undefined) return '-';
  return num.toLocaleString();
};

const tooltipStyle = {
  backgroundColor: 'var(--dash-surface)',
  border: '1px solid var(--dash-border)',
  borderRadius: 8,
  color: 'var(--dash-text)',
  boxShadow: 'var(--dash-menu-shadow)',
};

const tooltipLabelStyle = {
  color: 'var(--dash-text-soft)',
  fontSize: 11,
};

const tooltipItemStyle = {
  color: 'var(--dash-text)',
};

const deltaUpColor = 'color-mix(in srgb, var(--dash-success) 78%, var(--dash-blue) 22%)';
const deltaDownColor = 'color-mix(in srgb, var(--dash-danger) 82%, var(--dash-text-soft) 18%)';

interface DeltaCursorProps {
  height?: number;
  points?: Array<{
    x: number;
    width: number;
  }>;
}

function DeltaCursor(props: DeltaCursorProps) {
  const point = props?.points?.[0];
  if (!point) return null;

  const x = Math.max(0, point.x - 6);
  const width = Math.max(18, point.width + 12);

  return (
    <rect
      x={x}
      y={0}
      width={width}
      height={props.height}
      rx={8}
      fill="var(--dash-bg-elevated)"
      opacity={0.7}
    />
  );
}

const formatDeltaTooltipValue = (value: unknown) => [
  <span key="delta-value" style={{ color: 'var(--dash-text)' }}>
    {typeof value === 'number' || typeof value === 'string' ? formatNumber(Number(value)) : '-'}
  </span>,
  'delta',
];

export function ProjectOverview({ projectId }: ProjectOverviewProps) {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters('overview')) as { range: string };
  const timeRanges = useAllowedTimeRanges(['1h', '24h', '7d', '30d', '90d', '1y']);
  const rawTimeRange = filters.range || '24h';
  const normalizedTimeRange = normalizeTimeRange(rawTimeRange) as TimeRange;
  const fallbackRange = timeRanges.find((r) => !r.disabled)?.value ?? '90d';
  const timeRange =
    timeRanges.some((r) => !r.disabled && r.value === normalizedTimeRange) ? normalizedTimeRange : fallbackRange;

  const {
    data: stats,
    isLoading: isLoadingStats,
    isFetching: isFetchingStats,
  } = useGetStatsQuery({ projectId, range: timeRange });

  const {
    data: timeSeriesData,
    isLoading: isLoadingTimeSeries,
    isFetching: isFetchingTimeSeries,
  } = useGetTimeSeriesQuery({ projectId, range: timeRange });

  const statsData: ProjectStats = stats || {
    requests: 0,
    avgLatency: 0,
    errorRate: 0,
    p50: 0,
    p95: 0,
    p99: 0,
  };

  const chartData = useMemo(() => {
    let cumulativeRequests = 0;
    return (timeSeriesData?.data || []).map((point: TimeSeriesPoint, index, rows) => {
      cumulativeRequests += point.requestCount;
      const previous = rows[index - 1]?.requestCount ?? point.requestCount;
      return {
        ...point,
        cumulativeRequests,
        requestDelta: point.requestCount - previous,
      };
    });
  }, [timeSeriesData?.data]);

  const chartAxis = useMemo(
    () => getObservabilityChartAxisProps(timeRange, chartData),
    [timeRange, chartData],
  );

  const handleTimeRangeChange = useCallback((range: TimeRange) => {
    dispatch(setFilter({ page: 'overview', key: 'range', value: range }));
    trackEvent(RouteEvents.DASHBOARD_TIME_RANGE_CHANGE, {
      project_id: projectId,
      range,
      previous_range: timeRange,
    });
  }, [dispatch, projectId, timeRange]);

  const isLoading = isLoadingStats || isLoadingTimeSeries;
  const isFetching = isFetchingStats || isFetchingTimeSeries;
  const isHealthy = statsData.errorRate <= 1;

  const previousStats = isLoadingStats ? null : stats?.previous ?? null;

  const statCards = [
    {
      label: 'Total Requests',
      value: isLoadingStats ? '-' : formatNumber(statsData.requests),
      tone: 'text-[color:var(--dash-text)]',
      hint: previousStats && (
        <DashboardMetricDelta
          current={statsData.requests}
          previous={previousStats.requests}
          rangeLabel={timeRange}
        />
      ),
    },
    {
      label: 'p50 Latency',
      value: isLoadingStats ? '-' : formatLatency(statsData.p50),
      tone: 'text-[color:var(--dash-success)]',
      hint: previousStats && (
        <DashboardMetricDelta
          current={statsData.p50}
          previous={previousStats.p50}
          rangeLabel={timeRange}
          goodWhenDown
        />
      ),
    },
    {
      label: 'p95 Latency',
      value: isLoadingStats ? '-' : formatLatency(statsData.p95),
      tone: statsData.p95 > 500 ? 'text-[color:var(--dash-danger)]' : 'text-[color:var(--dash-success)]',
      hint: previousStats && (
        <DashboardMetricDelta
          current={statsData.p95}
          previous={previousStats.p95}
          rangeLabel={timeRange}
          goodWhenDown
        />
      ),
    },
    {
      label: 'Error Rate',
      value: isLoadingStats ? '-' : formatErrorRate(statsData.errorRate),
      tone: isHealthy ? 'text-[color:var(--dash-success)]' : 'text-[color:var(--dash-danger)]',
      hint: previousStats && (
        <DashboardMetricDelta
          current={statsData.errorRate}
          previous={previousStats.errorRate}
          rangeLabel={timeRange}
          goodWhenDown
          mode="pp"
        />
      ),
    },
  ];

  return (
    <div className="min-h-[calc(100vh-56px)] px-4 py-4 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-[1360px] animate-[fade-in_180ms_ease-out]">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-[color:var(--dash-blue)]" />
            <h1 className="text-sm font-medium text-[color:var(--dash-text)]">
              Overview
            </h1>
            {isFetching && !isLoading && (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-[color:var(--dash-blue)]" />
            )}
          </div>

          <div className="dashboard-control flex flex-wrap self-start p-0.5">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => !range.disabled && handleTimeRangeChange(range.value)}
                disabled={range.disabled}
                className={`min-h-[26px] rounded px-3 text-[11px] font-medium transition ${
                  range.disabled
                    ? 'cursor-not-allowed text-[color:var(--dash-text-muted)]'
                    : timeRange === range.value
                      ? 'bg-[color:var(--dash-blue)] text-[color:var(--dash-text-on-accent)] shadow-[var(--dash-button-shadow)]'
                      : 'text-[color:var(--dash-text-soft)] hover:text-[color:var(--dash-text)]'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        <DashboardSection id="overview-metrics" className="mb-4">
          <div className={dashboardMetricGridFourClass}>
            {statCards.map((card) => (
              <DashboardMetricCard
                key={card.label}
                label={card.label}
                value={card.value}
                tone={card.tone}
                hint={card.hint}
              />
            ))}
          </div>
        </DashboardSection>

        <DashboardSection id="overview-latency-distribution" className="dashboard-panel mb-4 p-4 sm:p-5">
          <div className="mb-3 flex flex-col gap-3 sm:mb-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="text-[11px] text-[color:var(--dash-text-soft)]">Latency Distribution</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-mono text-2xl font-semibold text-[color:var(--dash-success)]">
                  {isLoadingStats ? '-' : formatLatency(statsData.p95)}
                </span>
                <span className="text-[11px] text-[color:var(--dash-text-muted)]">p95 over selected range</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-[color:var(--dash-text-soft)]">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--dash-chart-line)]" />
                p50
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--dash-success)]" />
                p95
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--dash-danger)]" />
                p99
              </span>
            </div>
          </div>

          <div className={dashboardChartHeight.wide}>
            {isLoading ? (
              <Skeleton className="h-full w-full rounded-lg" />
            ) : chartData.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-sm text-[color:var(--dash-text-soft)]">
                No data yet
                <span className="mt-1 text-xs text-[color:var(--dash-text-muted)]">Install the snippet to start collecting.</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <ComposedChart data={chartData} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="overviewP50Fill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="var(--dash-chart-line)" stopOpacity="0.12" />
                      <stop offset="70%" stopColor="var(--dash-chart-line)" stopOpacity="0.03" />
                      <stop offset="100%" stopColor="var(--dash-chart-line)" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="overviewP95Fill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="var(--dash-success)" stopOpacity="0.18" />
                      <stop offset="70%" stopColor="var(--dash-success)" stopOpacity="0.05" />
                      <stop offset="100%" stopColor="var(--dash-success)" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="overviewP99Fill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="var(--dash-danger)" stopOpacity="0.14" />
                      <stop offset="70%" stopColor="var(--dash-danger)" stopOpacity="0.04" />
                      <stop offset="100%" stopColor="var(--dash-danger)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--dash-grid)" strokeOpacity={0.6} vertical={false} />
                  <XAxis
                    dataKey="timestamp"
                    interval={chartAxis.interval}
                    minTickGap={chartAxis.minTickGap}
                    tickFormatter={chartAxis.tickFormatter}
                    axisLine={{ stroke: 'var(--dash-border)' }}
                    tickLine={false}
                    tick={{ fill: 'var(--dash-text-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'var(--dash-text-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
                    tickFormatter={(value) => `${value}ms`}
                  />
                  <Area type="monotone" dataKey="p50" fill="url(#overviewP50Fill)" stroke="none" isAnimationActive={false} />
                  <Area type="monotone" dataKey="p95" fill="url(#overviewP95Fill)" stroke="none" isAnimationActive={false} />
                  <Area type="monotone" dataKey="p99" fill="url(#overviewP99Fill)" stroke="none" isAnimationActive={false} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    labelStyle={tooltipLabelStyle}
                    formatter={(value, name) => [`${Math.round(Number(value))}ms`, String(name)]}
                    labelFormatter={(value) => new Date(String(value)).toLocaleString()}
                  />
                  <Line type="monotone" dataKey="p50" name="p50" stroke="var(--dash-chart-line)" strokeWidth={1.65} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="p95" name="p95" stroke="var(--dash-success)" strokeWidth={1.8} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="p99" name="p99" stroke="var(--dash-danger)" strokeWidth={1.65} dot={false} isAnimationActive={false} />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>
        </DashboardSection>

        <DashboardSection id="overview-request-trends" className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="dashboard-panel p-5">
            <div className="mb-4">
              <div className="text-[11px] text-[color:var(--dash-text-soft)]">Cumulative Requests</div>
              <div className="mt-1 font-mono text-xl font-semibold text-[color:var(--dash-success)]">
                {isLoadingStats ? '-' : formatNumber(statsData.requests)}
              </div>
            </div>
            <div className={dashboardChartHeight.compact}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <ComposedChart data={chartData} margin={{ top: 4, right: 10, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="overviewCumulativeFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="var(--dash-blue)" stopOpacity="0.16" />
                      <stop offset="72%" stopColor="var(--dash-blue)" stopOpacity="0.05" />
                      <stop offset="100%" stopColor="var(--dash-blue)" stopOpacity="0" />
                    </linearGradient>
                    <filter id="overviewCumulativeShadow" x="-20%" y="-25%" width="140%" height="170%">
                      <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="var(--dash-blue)" floodOpacity="0.2" />
                    </filter>
                  </defs>
                  <CartesianGrid stroke="var(--dash-grid)" strokeOpacity={0.6} vertical={false} />
                  <XAxis dataKey="timestamp" interval={chartAxis.interval} minTickGap={chartAxis.minTickGap} tickFormatter={chartAxis.tickFormatter} axisLine={{ stroke: 'var(--dash-border)' }} tickLine={false} tick={{ fill: 'var(--dash-text-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--dash-text-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }} />
                  <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} formatter={(value) => [formatNumber(Number(value)), 'requests']} labelFormatter={(value) => new Date(String(value)).toLocaleString()} />
                  <Area type="monotone" dataKey="cumulativeRequests" fill="url(#overviewCumulativeFill)" stroke="none" isAnimationActive={false} />
                  <Line type="monotone" dataKey="cumulativeRequests" stroke="var(--dash-blue)" strokeWidth={1.8} dot={false} isAnimationActive={false} filter="url(#overviewCumulativeShadow)" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="dashboard-panel p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <div className="text-[11px] text-[color:var(--dash-text-soft)]">Request Delta</div>
                <div className="mt-1 font-mono text-xl font-semibold text-[color:var(--dash-text)]">
                  {chartData.length ? formatNumber(chartData[chartData.length - 1].requestCount) : '-'}
                </div>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-[color:var(--dash-text-soft)]">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2" style={{ backgroundColor: deltaUpColor }} />up</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2" style={{ backgroundColor: deltaDownColor }} />down</span>
              </div>
            </div>
            <div className={dashboardChartHeight.compact}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={chartData} margin={{ top: 4, right: 10, left: -18, bottom: 0 }}>
                  <CartesianGrid stroke="var(--dash-grid)" vertical={false} />
                  <XAxis dataKey="timestamp" interval={chartAxis.interval} minTickGap={chartAxis.minTickGap} tickFormatter={chartAxis.tickFormatter} axisLine={{ stroke: 'var(--dash-border)' }} tickLine={false} tick={{ fill: 'var(--dash-text-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--dash-text-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }} />
                  <Tooltip cursor={<DeltaCursor />} contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} formatter={(value) => formatDeltaTooltipValue(value)} labelFormatter={(value) => new Date(String(value)).toLocaleString()} />
                  <Bar
                    dataKey="requestDelta"
                    radius={0}
                    isAnimationActive={false}
                    activeBar={{ stroke: 'rgba(255,255,255,0.16)', strokeWidth: 1, fillOpacity: 0.96 }}
                  >
                    {chartData.map((point) => (
                      <Cell key={point.timestamp} fill={point.requestDelta >= 0 ? deltaUpColor : deltaDownColor} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </DashboardSection>
      </div>
    </div>
  );
}
