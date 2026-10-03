'use client';

/**
 * Network Breakdown Dashboard Component
 *
 * Displays network-layer timing and connection-type data captured by the beacon:
 *  - Connection type distribution (4G / 3G / 2G / slow-2G / unknown)
 *    sourced from navigator.connection.effectiveType (Chromium only)
 *  - DNS / TCP / TLS / TTFB timing percentiles (only non-null rows are counted,
 *    meaning reused-connection placeholders are excluded)
 *  - Per-connection-type table with RTT, downlink, and TTFB medians
 *  - RTT trend over time per connection type
 *
 * Accuracy caveats displayed in-UI:
 *  - DNS / TCP are null for reused connections (H2 / keep-alive). The counts
 *    shown indicate how many "new connection" samples were captured.
 *  - Network type is unavailable in Firefox & Safari (they show as "unknown").
 */

import { Fragment, useMemo, useCallback } from 'react';
import { Loader2, Wifi, Clock, Info } from '@/components/dashboard/icons';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ComposedChart,
  Area,
  Line,
  Legend,
  Cell,
} from 'recharts';
import {
  useGetNetworkDataQuery,
  useAppSelector,
  useAppDispatch,
  selectFilters,
  setFilter,
  useAllowedTimeRanges,
  NetworkConnTypeData,
  NetworkTimingMetric,
  isQueryPending,
  shouldShowQueryError,
} from '@/lib/redux';
import type { TimeRange } from '@/lib/redux/hooks/useAllowedTimeRanges';
import { getObservabilityChartAxisProps } from '@/lib/core/chart-time-axis';
import { ExportDropdown } from './ExportDropdown';
import { exportCSV, exportJSON, exportFilename, type ExportColumn } from '@/lib/core/export';
import { DashboardSection } from './DashboardSection';
import { DashboardQueryError, DashboardQueryLoading } from './DashboardQueryStatus';
import { dashboardMetricGridFourClass } from './chart-layout';

interface NetworkBreakdownProps {
  projectId: string;
}

// Connection type display config
const CONN_META: Record<string, { label: string; color: string; desc: string }> = {
  '4g':       { label: '4G / LTE', color: 'var(--dash-success)', desc: 'Fast mobile broadband' },
  '3g':       { label: '3G',       color: 'var(--dash-network-3g)', desc: 'Moderate mobile network' },
  '2g':       { label: '2G',       color: 'var(--dash-network-2g)', desc: 'Slow mobile network' },
  'slow-2g':  { label: 'Slow 2G',  color: 'var(--dash-network-slow-2g)', desc: 'Very slow connection' },
  'unknown':  { label: 'Unknown',  color: 'var(--dash-network-unknown)', desc: 'Firefox / Safari (API unsupported)' },
};

function connColor(ct: string): string {
  return CONN_META[ct]?.color ?? 'var(--dash-chart-secondary)';
}

function connShadowId(ct: string): string {
  return `network-shadow-${ct.replace(/[^a-z0-9_-]/gi, '-')}`;
}

function connFillId(ct: string): string {
  return `network-fill-${ct.replace(/[^a-z0-9_-]/gi, '-')}`;
}

function connLabel(ct: string): string {
  return CONN_META[ct]?.label ?? ct;
}

// Format ms value; 0 means a rounding artifact — show < 1ms instead of 0ms
function ms(v: number | null): string {
  if (v === null || v === undefined) return '-';
  if (v === 0) return '< 1ms';
  return `${Math.round(v)}ms`;
}

// Gauge bar that fills to a max width
function GaugeBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-[color:var(--dash-network-rail)]">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }}
        />
      </div>
      <span className="w-7 shrink-0 text-right text-[10px] text-[color:var(--dash-text-soft)]">{pct}%</span>
    </div>
  );
}

// ── Connection type distribution ──────────────────────────────────────────────
function ConnTypeDistribution({
  data,
  isLoading,
}: {
  data: NetworkConnTypeData[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="h-48 flex items-center justify-center">
        <div className="animate-spin w-5 h-5 border-2 border-[#3b82f6] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-sm text-[color:var(--dash-text-muted)]">
        No connection data available
      </div>
    );
  }

  // Sort by stable order: 4g first, then 3g, 2g, slow-2g, unknown, rest
  const order = ['4g', '3g', '2g', 'slow-2g', 'unknown'];
  const sorted = [...data].sort((a, b) => {
    const ai = order.indexOf(a.connType);
    const bi = order.indexOf(b.connType);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return b.requests - a.requests;
  });

  return (
    <div className="space-y-3">
      {sorted.map(row => (
        <div key={row.connType} className="flex items-center gap-3">
          <div className="w-20 shrink-0">
            <span
              className="text-xs font-mono font-medium"
              style={{ color: connColor(row.connType) }}
            >
              {connLabel(row.connType)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <GaugeBar pct={row.pct} color={connColor(row.connType)} />
          </div>
          <span className="w-20 shrink-0 text-right font-mono text-xs text-[color:var(--dash-text-soft)]">
            {row.requests.toLocaleString()} reqs
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Timing waterfall cards ────────────────────────────────────────────────────
function TimingMetricCard({
  label,
  fullName,
  metric,
  colorClass,
}: {
  label: string;
  fullName: string;
  metric: NetworkTimingMetric | undefined;
  colorClass: string;
}) {
  const hasData = metric && metric.count > 0 && metric.p50 !== null && metric.p50 > 0;

  return (
    <div className="dashboard-metric-card rounded-lg border border-[color:var(--dash-divider)] bg-[color:var(--dash-network-card)] p-3.5 min-w-0">
      <div className="flex items-start justify-between gap-3 mb-1">
        <div>
          <span className={`text-xs font-mono font-semibold ${colorClass}`}>{label}</span>
          <p className="mt-0.5 text-[10px] text-[color:var(--dash-text-muted)]">{fullName}</p>
        </div>
        {metric && metric.count > 0 && (
          <span className="text-[10px] text-[color:var(--dash-text-muted)]">{metric.count.toLocaleString()} samples</span>
        )}
      </div>

      {!hasData ? (
        <div className="mt-3 text-xs italic text-[color:var(--dash-text-muted)]">No data</div>
      ) : (
        <>
          <div className="mt-3 flex items-baseline gap-1">
            <span className={`text-2xl font-mono font-semibold ${colorClass}`}>
              {ms(metric.p50)}
            </span>
            <span className="text-[10px] text-[color:var(--dash-text-muted)]">p50</span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-x-4 text-[10px] text-[color:var(--dash-text-muted)]">
            <span>p75 <span className="font-mono text-[color:var(--dash-text-soft)]">{ms(metric.p75)}</span></span>
            <span>p95 <span className="font-mono text-[color:var(--dash-text-soft)]">{ms(metric.p95)}</span></span>
          </div>

          {/* Mini waterfall bar: proportional to p95 */}
          {metric.p95 && metric.p95 > 0 && (
            <div className="mt-3 space-y-1">
              <PercentileBar label="p50" value={metric.p50} max={metric.p95} colorClass={colorClass} />
              <PercentileBar label="p75" value={metric.p75} max={metric.p95} colorClass={colorClass} />
              <PercentileBar label="p95" value={metric.p95} max={metric.p95} colorClass={colorClass} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function PercentileBar({
  label,
  value,
  max,
  colorClass,
}: {
  label: string;
  value: number | null;
  max: number;
  colorClass: string;
}) {
  if (value === null || max === 0) return null;
  const pct = Math.round((value / max) * 100);
  // Map colorClass text-[hex] → a fill color via inline style
  const colorMap: Record<string, string> = {
    'text-[#60a5fa]': 'var(--dash-chart-secondary)',
    'text-[color:var(--dash-success)]': 'var(--dash-success)',
    'text-[#a78bfa]': '#9b7bff',
    'text-[#f59e0b]': 'var(--dash-network-3g)',
  };
  const fill = colorMap[colorClass] ?? 'var(--dash-chart-secondary)';

  return (
    <div className="flex items-center gap-2">
      <span className="w-5 text-[9px] text-[color:var(--dash-text-muted)]">{label}</span>
      <div className="flex-1 h-1 rounded-full overflow-hidden bg-[color:var(--dash-network-rail)]">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, backgroundColor: fill }}
        />
      </div>
    </div>
  );
}

// ── Per-connection-type table ─────────────────────────────────────────────────
function ConnTypeTable({
  data,
  isLoading,
}: {
  data: NetworkConnTypeData[];
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
      <div className="py-12 text-center text-sm text-[color:var(--dash-text-muted)]">No data available</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[color:var(--dash-divider)] bg-[color:var(--dash-network-card-subtle)]">
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[color:var(--dash-text-soft)]">Connection</th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-[color:var(--dash-text-soft)]">Requests</th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-[color:var(--dash-text-soft)]">RTT</th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-[color:var(--dash-text-soft)]">Downlink</th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-[color:var(--dash-text-soft)]">DNS p50</th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-[color:var(--dash-text-soft)]">TCP p50</th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-[color:var(--dash-text-soft)]">TLS p50</th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-[color:var(--dash-text-soft)]">TTFB p50</th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-[color:var(--dash-text-soft)]">TTFB p95</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.connType} className="border-b border-[color:var(--dash-divider)] transition-colors last:border-b-0 hover:bg-[color:var(--dash-network-row-hover)]">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: connColor(row.connType) }}
                  />
                  <div>
                    <span className="text-xs font-mono text-[color:var(--dash-text)]">{connLabel(row.connType)}</span>
                    {CONN_META[row.connType]?.desc && (
                      <p className="text-[9px] text-[color:var(--dash-text-muted)]">{CONN_META[row.connType].desc}</p>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-right font-mono text-xs text-[color:var(--dash-text-soft)]">
                <div>{row.requests.toLocaleString()}</div>
                <div className="text-[9px] text-[color:var(--dash-text-muted)]">{row.pct}%</div>
              </td>
              <td className="px-4 py-3 text-right font-mono text-xs text-[color:var(--dash-text-soft)]">
                {row.avgRtt !== null ? `${row.avgRtt}ms` : '-'}
              </td>
              <td className="px-4 py-3 text-right font-mono text-xs text-[color:var(--dash-text-soft)]">
                {row.avgDownlink !== null ? `${row.avgDownlink} Mbps` : '-'}
              </td>
              <td className="px-4 py-3 text-right font-mono text-xs text-[color:var(--dash-text-soft)]">{ms(row.p50Dns)}</td>
              <td className="px-4 py-3 text-right font-mono text-xs text-[color:var(--dash-text-soft)]">{ms(row.p50Tcp)}</td>
              <td className="px-4 py-3 text-right font-mono text-xs text-[color:var(--dash-text-soft)]">{ms(row.p50Tls)}</td>
              <TtfbCell value={row.p50Ttfb} />
              <TtfbCell value={row.p95Ttfb} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TtfbCell({ value }: { value: number | null }) {
  const color =
    value === null ? 'text-[color:var(--dash-text-muted)]'
    : value < 200  ? 'text-[color:var(--dash-success)]'
    : value < 800  ? 'text-[color:var(--dash-network-3g)]'
    : 'text-[color:var(--dash-danger)]';
  return <td className={`px-4 py-3 text-right font-mono text-xs ${color}`}>{ms(value)}</td>;
}

// ── RTT timeseries chart ──────────────────────────────────────────────────────
function RttChart({
  data,
  connTypes,
  isLoading,
  timeRange,
}: {
  data: Array<{ bucket: string; connType: string; avgRtt: number | null; requests: number }>;
  connTypes: NetworkConnTypeData[];
  isLoading: boolean;
  timeRange: TimeRange;
}) {
  if (isLoading) {
    return (
      <div className="h-55 flex items-center justify-center">
        <div className="animate-spin w-5 h-5 border-2 border-[#3b82f6] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-55 flex items-center justify-center text-sm text-[color:var(--dash-text-muted)]">
        No RTT timeseries data
      </div>
    );
  }

  // Pivot data: { bucket → { connType → avgRtt } }
  const bucketMap = new Map<string, Record<string, number | null>>();
  for (const row of data) {
    if (!bucketMap.has(row.bucket)) bucketMap.set(row.bucket, {});
    const entry = bucketMap.get(row.bucket)!;
    entry[row.connType] = row.avgRtt;
  }

  const chartData = Array.from(bucketMap.entries()).map(([bucket, vals]) => ({
    bucket,
    ...vals,
  }));

  const presentConnTypes = connTypes.filter(ct => ct.avgRtt !== null).map(ct => ct.connType);
  const chartAxis = getObservabilityChartAxisProps(
    timeRange,
    chartData.map((row) => ({ bucket: row.bucket })),
  );

  return (
    <div className="h-55">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
        <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <defs>
            {presentConnTypes.map((ct) => (
              <Fragment key={`defs-${ct}`}>
                <filter id={connShadowId(ct)} x="-18%" y="-30%" width="136%" height="190%">
                  <feDropShadow
                    dx="0"
                    dy="8"
                    stdDeviation="7"
                    floodColor={connColor(ct)}
                    floodOpacity="0.18"
                  />
                </filter>
                <linearGradient id={connFillId(ct)} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={connColor(ct)} stopOpacity={0.14} />
                  <stop offset="100%" stopColor={connColor(ct)} stopOpacity={0} />
                </linearGradient>
              </Fragment>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--dash-chart-grid)" vertical={false} />
          <XAxis
            dataKey="bucket"
            interval={chartAxis.interval}
            minTickGap={chartAxis.minTickGap}
            tickFormatter={chartAxis.tickFormatter}
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'var(--dash-chart-axis)', fontSize: 10 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'var(--dash-chart-axis)', fontSize: 10 }}
            unit="ms"
          />
          <Tooltip
            contentStyle={{ backgroundColor: 'var(--dash-chart-tooltip-bg)', border: '1px solid var(--dash-chart-tooltip-border)', borderRadius: 6 }}
            labelStyle={{ color: 'var(--dash-chart-tooltip-label)', fontSize: 11 }}
            itemStyle={{ fontSize: 11, color: 'var(--dash-chart-tooltip-text)' }}
            cursor={{ stroke: 'var(--dash-chart-grid)', strokeWidth: 1 }}
            formatter={(value, name) => {
              const numericValue = typeof value === 'number' ? value : Number(value);
              const val = Number.isFinite(numericValue) ? `${Math.round(numericValue)}ms RTT` : '-';
              return [val, connLabel(String(name ?? ''))];
            }}
            labelFormatter={(label) => {
              const date = new Date(String(label));
              return date.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '11px', color: 'var(--dash-text-soft)', paddingTop: '8px' }}
            formatter={(value: string) => connLabel(value)}
          />
          {presentConnTypes.map(ct => (
            <Fragment key={ct}>
              <Area
                type="monotone"
                dataKey={ct}
                stroke="none"
                fill={`url(#${connFillId(ct)})`}
                fillOpacity={1}
                connectNulls
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey={ct}
                stroke={connColor(ct)}
                strokeWidth={1.5}
                dot={false}
                connectNulls
                name={ct}
                isAnimationActive={false}
                filter={`url(#${connShadowId(ct)})`}
              />
            </Fragment>
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── TTFB by connection type bar chart ────────────────────────────────────────
function TtfbBar({ data, isLoading }: { data: NetworkConnTypeData[]; isLoading: boolean }) {
  if (isLoading || !data || data.length === 0) return null;

  const filtered = data.filter(d => d.p50Ttfb !== null || d.p95Ttfb !== null);
  if (filtered.length === 0) return null;

  const chartData = filtered.map(d => ({
    name: connLabel(d.connType),
    connType: d.connType,
    p50: d.p50Ttfb ?? 0,
    p95: d.p95Ttfb ?? 0,
  }));

  return (
    <div className="h-50">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
        <BarChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--dash-chart-grid)" vertical={false} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--dash-chart-axis)', fontSize: 10 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--dash-chart-axis)', fontSize: 10 }} unit="ms" />
          <Tooltip
            contentStyle={{ backgroundColor: 'var(--dash-chart-tooltip-bg)', border: '1px solid var(--dash-chart-tooltip-border)', borderRadius: 6 }}
            labelStyle={{ color: 'var(--dash-chart-tooltip-label)', fontSize: 11 }}
            itemStyle={{ fontSize: 11, color: 'var(--dash-chart-tooltip-text)' }}
            cursor={{ fill: 'color-mix(in srgb, var(--dash-chart-grid) 34%, transparent)' }}
            formatter={(value, name) => {
              const numericValue = typeof value === 'number' ? value : Number(value);
              const label = name === 'p50' ? 'TTFB p50' : 'TTFB p95';
              return [Number.isFinite(numericValue) ? `${Math.round(numericValue)}ms` : '-', label];
            }}
          />
          <Bar
            dataKey="p50"
            name="p50"
            radius={[3, 3, 0, 0]}
            fill="var(--dash-series-strong)"
          >
            {chartData.map((entry) => (
              <Cell key={entry.connType} fill={connColor(entry.connType)} fillOpacity={0.85} />
            ))}
          </Bar>
          <Bar
            dataKey="p95"
            name="p95"
            radius={[3, 3, 0, 0]}
            fill="var(--dash-series-soft)"
          >
            {chartData.map((entry) => (
              <Cell key={entry.connType} fill={connColor(entry.connType)} fillOpacity={0.4} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function NetworkBreakdown({ projectId }: NetworkBreakdownProps) {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters('network')) as { range: string };
  const timeRange = filters.range as TimeRange;
  const timeRanges = useAllowedTimeRanges(['1h', '24h', '7d', '30d', '90d', '1y']);

  const handleTimeRangeChange = (range: TimeRange) => {
    dispatch(setFilter({ page: 'network', key: 'range', value: range }));
  };

  const hasActiveFilters = false; // Network tab doesn't have additional filters yet

  const { data, isLoading, isFetching, isUninitialized, error, refetch } = useGetNetworkDataQuery({
    projectId,
    range: timeRange,
  });

  const queryState = { data, error, isLoading, isFetching, isUninitialized };

  const connTypes    = data?.connTypes    ?? [];
  const timings      = data?.timings;
  const rttTs        = data?.rttTimeseries ?? [];
  const totalRequests = data?.totalRequests ?? 0;

  // Check if we have any RTT data (Chromium only)
  const hasRttData = useMemo(() => connTypes.some(c => c.avgRtt !== null), [connTypes]);

  const handleExportCSV = useCallback(() => {
    if (!connTypes.length) return;
    const columns: ExportColumn<NetworkConnTypeData>[] = [
      { key: 'connType', header: 'Connection Type' },
      { key: 'requests', header: 'Requests' },
      { key: 'pct', header: '% of Total' },
      { key: 'avgRtt', header: 'Avg RTT (ms)' },
      { key: 'avgDownlink', header: 'Avg Downlink (Mbps)' },
      { key: 'p50Ttfb', header: 'p50 TTFB (ms)' },
      { key: 'p95Ttfb', header: 'p95 TTFB (ms)' },
    ];
    exportCSV(connTypes, columns, exportFilename('network', projectId, timeRange, 'csv'));
  }, [connTypes, projectId, timeRange]);

  const handleExportJSON = useCallback(() => {
    if (!data) return;
    exportJSON(data, exportFilename('network', projectId, timeRange, 'json'));
  }, [data, projectId, timeRange]);

  if (isQueryPending(queryState)) {
    return (
      <div className="max-w-350 mx-auto px-4 sm:px-6 py-8">
        <DashboardQueryLoading variant="page" charts={2} />
      </div>
    );
  }

  if (shouldShowQueryError(queryState)) {
    return (
      <div className="max-w-350 mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight text-[color:var(--dash-text)]">Network</h1>
        </div>
        <div className="rounded-lg border border-[color:var(--dash-divider)] bg-[color:var(--dash-network-card)]">
          <DashboardQueryError
            message="Failed to load network data."
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
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[color:var(--dash-text)]">Network</h1>
          <p className="mt-1 text-sm text-[color:var(--dash-text-soft)]">Connection type distribution, DNS, TCP, TLS, and TTFB timing</p>
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
          <ExportDropdown onExportCSV={handleExportCSV} onExportJSON={handleExportJSON} />
        </div>
      </div>

      <div
        className="mb-6 flex items-start gap-2 rounded-lg border border-[color:color-mix(in_srgb,var(--dash-blue)_28%,transparent)] bg-[color:var(--dash-blue-soft)] px-3.5 py-2.5 shadow-[inset_0_1px_0_color-mix(in_srgb,white_6%,transparent)]"
        role="note"
      >
        <Info className="mt-px h-3.5 w-3.5 shrink-0 text-[color:var(--dash-blue)]" aria-hidden />
        <p className="text-xs leading-snug text-[color:var(--dash-text-soft)]">
          <span className="font-semibold text-[color:var(--dash-blue)]">Measurement accuracy notes:</span>{' '}
          DNS and TCP are only recorded for new connections; reused connections (HTTP keep-alive / HTTP/2)
          correctly report null and are excluded from percentiles. Connection type (effectiveType) and RTT come
          from the Network Information API, which is only available in Chromium-based browsers. Firefox and
          Safari users appear as &quot;Unknown&quot;.
        </p>
      </div>

       <div className="space-y-5">
       

        {/* Connection type distribution + TTFB bar chart side-by-side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Connection distribution */}
          <DashboardSection id="network-connection-distribution" as="div" className="overflow-hidden rounded-lg border border-[color:var(--dash-divider)] bg-[color:var(--dash-network-card)]">
            <div className="flex items-center gap-2 border-b border-[color:var(--dash-divider)] p-4">
              <Wifi className="w-4 h-4 text-[color:var(--dash-text-soft)]" />
              <h2 className="text-sm font-semibold">Connection Type Distribution</h2>
              {totalRequests > 0 && (
                <span className="ml-auto text-[10px] text-[color:var(--dash-text-muted)]">{totalRequests.toLocaleString()} total requests</span>
              )}
            </div>
            <div className="p-5">
              <ConnTypeDistribution data={connTypes} isLoading={isLoading} />
            </div>
          </DashboardSection>

          {/* TTFB by connection type */}
          <DashboardSection id="network-ttfb-by-connection" as="div" className="overflow-hidden rounded-lg border border-[color:var(--dash-divider)] bg-[color:var(--dash-network-card)]">
            <div className="flex items-center gap-2 border-b border-[color:var(--dash-divider)] p-4">
              <Clock className="w-4 h-4 text-[color:var(--dash-text-soft)]" />
              <h2 className="text-sm font-semibold">TTFB by Connection Type</h2>
              <span className="ml-auto text-[10px] text-[color:var(--dash-text-muted)]">p50 &amp; p95</span>
            </div>
            <div className="p-5">
              <TtfbBar data={connTypes} isLoading={isLoading} />
            </div>
          </DashboardSection>
        </div>

        {/* DNS / TCP / TLS / TTFB overall timing cards */}
        <DashboardSection id="network-timing-percentiles" as="div">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[color:var(--dash-text-soft)]">
            Connection Timing Percentiles
          </h2>
          <div className={dashboardMetricGridFourClass}>
            <TimingMetricCard
              label="DNS"
              fullName="Domain lookup time"
              metric={timings?.dns}
              colorClass="text-[#60a5fa]"
            />
            <TimingMetricCard
              label="TCP"
              fullName="TCP handshake"
              metric={timings?.tcp}
              colorClass="text-[color:var(--dash-success)]"
            />
            <TimingMetricCard
              label="TLS"
              fullName="TLS/SSL negotiation"
              metric={timings?.tls}
              colorClass="text-[#a78bfa]"
            />
            <TimingMetricCard
              label="TTFB"
              fullName="Time to First Byte"
              metric={timings?.ttfb}
              colorClass="text-[#f59e0b]"
            />
          </div>
        </DashboardSection>

        {/* RTT timeseries chart (Chromium only) */}
        {hasRttData && (
          <DashboardSection id="network-rtt-timeseries" as="div" className="overflow-hidden rounded-lg border border-[color:var(--dash-divider)] bg-[color:var(--dash-network-card)]">
            <div className="flex items-center gap-2 border-b border-[color:var(--dash-divider)] p-4">
              <Wifi className="w-4 h-4 text-[color:var(--dash-text-soft)]" />
              <h2 className="text-sm font-semibold">RTT Over Time by Connection Type</h2>
              <span className="ml-auto text-[10px] text-[color:var(--dash-text-muted)]">avg RTT per bucket (Chromium only)</span>
            </div>
            <div className="p-5">
              <RttChart data={rttTs} connTypes={connTypes} isLoading={isLoading} timeRange={timeRange} />
            </div>
          </DashboardSection>
        )}

        {/* Per-connection-type detail table */}
        <DashboardSection id="network-connection-table" as="div" className="overflow-hidden rounded-lg border border-[color:var(--dash-divider)] bg-[color:var(--dash-network-card)]">
          <div className="flex items-center gap-2 border-b border-[color:var(--dash-divider)] p-4">
            <h2 className="text-sm font-semibold">Network Timing by Connection Type</h2>
            <span className="ml-auto text-[10px] text-[color:var(--dash-text-muted)]">DNS/TCP/TLS = new connections only · TTFB = all requests</span>
          </div>
          <ConnTypeTable data={connTypes} isLoading={isLoading} />
        </DashboardSection>

        {/* Legend / notes */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] text-[color:var(--dash-text-muted)]">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[color:var(--dash-success)]" />
            <span>Good (TTFB &lt; 200ms)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[color:var(--dash-network-3g)]" />
            <span>Needs improvement (200–800ms)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[color:var(--dash-danger)]" />
            <span>Poor (&gt; 800ms)</span>
          </div>
        </div>
      </div>

      {/* AI Pill */}
</div>
  );
}


