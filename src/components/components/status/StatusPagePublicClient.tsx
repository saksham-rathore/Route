'use client';

import { type CSSProperties, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  Clock3,
  Eye,
  Globe,
  Loader2,
  MousePointerClick,
  RadioTower,
  ShieldCheck,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  STATUS_PAGE_PUBLIC_POLL_INTERVAL_MS,
  STATUS_PAGE_STATUS_META,
  type StatusPageMetricSnapshot,
  type StatusPagePublicData,
  type StatusPageStatus,
  type StatusPageUptimeCheckStatus,
  type StatusPageUserAnalyticsSnapshot,
} from '@/lib/status-pages';
import { ROUTE_STATUS_PAGE_LOGO_URL } from '@/components/brand/RouteIcon';
import { UptimeBarStrip } from '@/components/status/UptimeBarStrip';
import { siteConfig } from '@/lib/seo/config';

interface StatusPagePublicClientProps {
  slug: string;
  initialData: StatusPagePublicData;
  refreshUrl: string;
}

// Get user's timezone once
function getUserTimeZone(): string {
  if (typeof window === 'undefined') return 'UTC';
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function formatDateTime(value: string | null | undefined): string {
  if (!value) return 'No recent data';
  return new Date(value).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}

// Format time for chart labels (e.g., "8:00 PM")
function formatTimeLabel(value: string): string {
  return new Date(value).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function formatMs(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'No data';
  if (value < 1_000) return `${Math.round(value)}ms`;
  if (value < 60_000) return `${(value / 1_000).toFixed(value >= 10_000 ? 0 : 1)}s`;

  const minutes = Math.floor(value / 60_000);
  const seconds = Math.round((value % 60_000) / 1_000);
  return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
}

function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'No data';
  return `${value.toFixed(2)}%`;
}

function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'No data';
  return value.toLocaleString();
}

function statusPillStyle(status: StatusPageStatus) {
  const meta = STATUS_PAGE_STATUS_META[status];
  return {
    color: meta.color,
    backgroundColor: meta.glow,
    borderColor: `${meta.color}33`,
  };
}

function uptimeStatusTone(status: StatusPageUptimeCheckStatus | null | undefined): StatusPageStatus {
  if (status === 'up') return 'operational';
  if (status === 'down' || status === 'timeout') return 'major_outage';
  if (status === 'error') return 'degraded_performance';
  return 'unknown';
}

function uptimeStatusLabel(status: StatusPageUptimeCheckStatus | null | undefined): string {
  if (status === 'up') return 'Up';
  if (status === 'down') return 'Down';
  if (status === 'timeout') return 'Timeout';
  if (status === 'error') return 'Error';
  return 'Awaiting check';
}

function accentPanelStyle(accentColor: string) {
  return {
    borderColor: '#222',
    backgroundColor: '#0f0f0f',
    backgroundImage: `linear-gradient(180deg, ${accentColor}12 0%, rgba(15, 15, 15, 0) 34%)`,
  };
}

function accentSurfaceStyle(accentColor: string) {
  return {
    borderColor: '#222',
    backgroundColor: '#0d0d0d',
    backgroundImage: `radial-gradient(circle at top left, ${accentColor}22 0%, transparent 55%)`,
  };
}

function accentDotStyle(accentColor: string) {
  return {
    backgroundColor: accentColor,
    boxShadow: `0 0 0 3px ${accentColor}16`,
  };
}

function heroBadgeStyle(isLive: boolean, accentColor: string) {
  return {
    color: isLive ? '#f5f5f5' : '#b7b7b7',
    borderColor: isLive ? '#2a2a2a' : '#313131',
    backgroundColor: isLive ? '#151515' : '#171717',
    boxShadow: isLive ? `inset 0 1px 0 ${accentColor}22` : undefined,
  };
}

/**
 * Calculate relative luminance of a color
 * Based on WCAG 2.0 formula: https://www.w3.org/TR/WCAG20/#relativeluminancedef
 */
function getLuminance(hexColor: string): number {
  // Remove # if present
  const hex = hexColor.replace('#', '');
  
  // Parse RGB values
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  // Apply gamma correction
  const gammaCorrect = (c: number) => {
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  
  return 0.2126 * gammaCorrect(r) + 0.7152 * gammaCorrect(g) + 0.0722 * gammaCorrect(b);
}

/**
 * Returns a text color that contrasts with the accent color.
 * If accent is dark, returns white. If accent is light, returns the accent color.
 * Threshold is based on WCAG recommendations (0.5 is a good middle ground).
 */
function getAccentTextColor(accentColor: string): string {
  // Normalize to full hex if needed (assume short hex like #fff)
  let fullHex = accentColor;
  if (accentColor.startsWith('#') && accentColor.length === 4) {
    const r = accentColor[1];
    const g = accentColor[2];
    const b = accentColor[3];
    fullHex = `#${r}${r}${g}${g}${b}${b}`;
  }
  
  const luminance = getLuminance(fullHex);
  
  // If luminance is below 0.4, the color is dark - use white text
  // Otherwise use the accent color
  return luminance < 0.4 ? '#ffffff' : accentColor;
}

function SectionHeading({
  eyebrow,
  title,
  description,
  accentColor,
}: {
  eyebrow: string;
  title: string;
  description: string;
  accentColor: string;
}) {
  return (
    <div className="border-b border-[#181818] pb-3">
      <div className="text-[11px] font-medium uppercase tracking-[0.18em]" style={{ color: getAccentTextColor(accentColor) }}>{eyebrow}</div>
      <h2 className="mt-2 text-lg font-semibold tracking-tight text-white">{title}</h2>
      <p className="mt-1 max-w-2xl text-sm text-[#727272]">{description}</p>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  hint,
  accentColor,
}: {
  label: string;
  value: string;
  hint: string;
  accentColor: string;
}) {
  return (
    <div className="flex min-h-[164px] flex-col rounded-lg border border-[#222] bg-[#0f0f0f] p-4" style={accentPanelStyle(accentColor)}>
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#5f5f5f]">
        <span className="h-2 w-2 rounded-full" style={accentDotStyle(accentColor)} />
        <span>{label}</span>
      </div>
      <div className="mt-5 flex flex-1 flex-col">
        <div className="break-words text-[clamp(2rem,3vw,2.5rem)] font-semibold leading-none tracking-tight text-white">{value}</div>
        <div className="mt-4 max-w-[28ch] text-sm leading-6 text-[#6d6d6d]">{hint}</div>
      </div>
    </div>
  );
}

function MetricBars({
  title,
  subtitle,
  series,
  accentColor,
  valueFormatter,
  getValue,
}: {
  title: string;
  subtitle: string;
  series: StatusPageMetricSnapshot['series'];
  accentColor: string;
  valueFormatter: (value: number | null) => string;
  getValue: (point: StatusPageMetricSnapshot['series'][number]) => number | null;
}) {
  const values = series.map((point) => getValue(point) ?? 0);
  const peak = Math.max(...values, 1);
  const latestPoint = [...series].reverse().find((point) => getValue(point) !== null) ?? series.at(-1);
  const latestValue = latestPoint ? getValue(latestPoint) : null;

  // Convert series timestamps to local time labels
  const localLabels = useMemo(() => {
    return series.map(point => formatTimeLabel(point.bucketStart));
  }, [series]);

  return (
    <div className="rounded-lg border border-[#222] bg-[#0f0f0f] p-4" style={accentPanelStyle(accentColor)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            <span className="h-2 w-2 rounded-full" style={accentDotStyle(accentColor)} />
            <span>{title}</span>
          </div>
          <div className="mt-1 text-sm text-[#6f6f6f]">{subtitle}</div>
        </div>
        <div className="text-left sm:text-right">
          <div className="text-lg font-semibold tracking-tight text-white">{valueFormatter(latestValue)}</div>
          <div className="mt-1 text-xs text-[#616161]">Latest bucket</div>
        </div>
      </div>

      <div className="mt-5 grid h-28 grid-cols-24 items-end gap-1">
        {series.map((point, index) => {
          const value = getValue(point) ?? 0;
          const height = Math.max(10, Math.round((value / peak) * 100));

          return (
            <div key={point.bucketStart} className="flex h-full flex-col justify-end">
              <div
                className="rounded-sm bg-[#1a1a1a] transition-all"
                style={{
                  height: `${height}%`,
                  backgroundColor: value > 0 ? accentColor : '#1a1a1a',
                  opacity: value > 0 ? 0.92 : 1,
                }}
                title={`${localLabels[index]}: ${valueFormatter(getValue(point))}`}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] uppercase tracking-[0.14em] text-[#555]">
        <span>{localLabels[0]}</span>
        <span>{localLabels[Math.floor(localLabels.length / 2)]}</span>
        <span>{localLabels.at(-1)}</span>
      </div>
    </div>
  );
}

function UserAnalyticsBars({
  title,
  subtitle,
  series,
  accentColor,
  valueFormatter,
  getValue,
}: {
  title: string;
  subtitle: string;
  series: StatusPageUserAnalyticsSnapshot['series'];
  accentColor: string;
  valueFormatter: (value: number | null) => string;
  getValue: (point: StatusPageUserAnalyticsSnapshot['series'][number]) => number | null;
}) {
  const values = series.map((point) => getValue(point) ?? 0);
  const peak = Math.max(...values, 1);
  const latestPoint = [...series].reverse().find((point) => getValue(point) !== null) ?? series.at(-1);
  const latestValue = latestPoint ? getValue(latestPoint) : null;
  const localLabels = useMemo(() => series.map((point) => formatTimeLabel(point.bucketStart)), [series]);

  return (
    <div className="rounded-lg border border-[#222] bg-[#0f0f0f] p-4" style={accentPanelStyle(accentColor)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            <span className="h-2 w-2 rounded-full" style={accentDotStyle(accentColor)} />
            <span>{title}</span>
          </div>
          <div className="mt-1 text-sm text-[#6f6f6f]">{subtitle}</div>
        </div>
        <div className="text-left sm:text-right">
          <div className="text-lg font-semibold tracking-tight text-white">{valueFormatter(latestValue)}</div>
          <div className="mt-1 text-xs text-[#616161]">Latest bucket</div>
        </div>
      </div>

      <div className="mt-5 grid h-28 grid-cols-24 items-end gap-1">
        {series.map((point, index) => {
          const value = getValue(point) ?? 0;
          const height = Math.max(10, Math.round((value / peak) * 100));

          return (
            <div key={point.bucketStart} className="flex h-full flex-col justify-end">
              <div
                className="rounded-sm bg-[#1a1a1a] transition-all"
                style={{
                  height: `${height}%`,
                  backgroundColor: value > 0 ? accentColor : '#1a1a1a',
                  opacity: value > 0 ? 0.92 : 1,
                }}
                title={`${localLabels[index]}: ${valueFormatter(getValue(point))}`}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] uppercase tracking-[0.14em] text-[#555]">
        <span>{localLabels[0]}</span>
        <span>{localLabels[Math.floor(localLabels.length / 2)]}</span>
        <span>{localLabels.at(-1)}</span>
      </div>
    </div>
  );
}

function IncidentTone(status: 'minor' | 'major' | 'critical'): StatusPageStatus {
  if (status === 'critical') return 'major_outage';
  if (status === 'major') return 'partial_outage';
  return 'degraded_performance';
}

function resolvedIncidentPillStyle() {
  return {
    color: '#8fd9b0',
    backgroundColor: 'rgba(143, 217, 176, 0.12)',
    borderColor: 'rgba(143, 217, 176, 0.32)',
  };
}

const historyIncidentCardClassName =
  'rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]';

function RouteFooterWordmark() {
  return (
    <img
      src={ROUTE_STATUS_PAGE_LOGO_URL}
      alt=""
      aria-hidden
      draggable={false}
      decoding="async"
      className="mx-auto h-full w-full max-w-[min(100%,420px)] object-contain object-bottom opacity-[0.94] transition-transform duration-300 group-hover:scale-[1.01]"
    />
  );
}

export function StatusPagePublicClient({
  slug,
  initialData,
  refreshUrl,
}: StatusPagePublicClientProps) {
  const [data, setData] = useState(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [browserTimeZone, setBrowserTimeZone] = useState<string | null>(null);
  const [lastCheckedAt, setLastCheckedAt] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch(refreshUrl, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('Failed to refresh status page');
      }

      const nextData = (await response.json()) as StatusPagePublicData;
      setData(nextData);
      setLastCheckedAt(new Date().toISOString());
      setRefreshError(null);
    } catch (error) {
      setRefreshError(error instanceof Error ? error.message : 'Refresh failed');
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshUrl]);

  useEffect(() => {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const zoneName = new Intl.DateTimeFormat(undefined, { timeZoneName: 'short' })
      .formatToParts(new Date())
      .find((part) => part.type === 'timeZoneName')?.value;
    setBrowserTimeZone(
      [zone, zoneName].filter(Boolean).join(' · ') || 'Local time',
    );
    setLastCheckedAt(new Date().toISOString());
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        void refresh();
      }
    }, STATUS_PAGE_PUBLIC_POLL_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [refresh]);

  const accentStyle = useMemo(
    () =>
      ({
        '--status-accent': data.page.accentColor,
      }) as CSSProperties,
    [data.page.accentColor],
  );

  const displayOptions = data.page.displayOptions;
  const showObservability = displayOptions.showObservability;
  const showNetwork = displayOptions.showNetwork;
  const showUserAnalytics = displayOptions.showUserAnalytics;
  const showComponents = displayOptions.showComponents;
  const showIncidents = displayOptions.showIncidents;
  const showIncidentHistory = displayOptions.showIncidentHistory;
  const latestDataAt = data.summary.lastUpdatedAt || data.metrics.latestDataAt || data.analytics.latestDataAt;
  const projectDisplayHost = data.project.domain?.trim() || new URL(data.page.publicUrl).host;
  const goodVitalsLabel = data.metrics.goodVitalsRatio24h === null
    ? 'No samples yet'
    : `${data.metrics.goodVitalsRatio24h.toFixed(2)}% good`;
  const hasResolvedSummaryState = data.summary.status !== 'unknown';
  const linkedAlertRuleCount = data.components.reduce(
    (total, component) => total + component.linkedAlertRules.length,
    0,
  );
  const liveSignalComponentCount = data.components.filter((component) => component.hasLiveSignal).length;
  const attentionComponentCount = data.components.filter((component) =>
    ['degraded_performance', 'partial_outage', 'major_outage', 'maintenance'].includes(component.derivedStatus),
  ).length;
  const twoColumnLayout = showComponents && showNetwork;
  const fullWidthSectionClass = twoColumnLayout ? 'lg:col-span-2' : '';
  const busiestIsp = data.metrics.topIsps[0] ?? null;
  const slowestVisibleIsp = data.metrics.topIsps.reduce<(typeof data.metrics.topIsps)[number] | null>(
    (slowest, isp) => {
      if (isp.p95TtfbMs === null) return slowest;
      if (!slowest || slowest.p95TtfbMs === null || isp.p95TtfbMs > slowest.p95TtfbMs) {
        return isp;
      }
      return slowest;
    },
    null,
  );
  const latestComponentUpdateAt = data.components.reduce<string | null>((latest, component) => {
    if (!latest) return component.updatedAt;
    return new Date(component.updatedAt).getTime() > new Date(latest).getTime()
      ? component.updatedAt
      : latest;
  }, null);
  const heroBadgeLabel = data.summary.label;
  const heroMessage = data.summary.message;
  const latencyHint = slowestVisibleIsp
    ? '24h first-party p95 TTFB. Slowest ISP is listed below.'
    : '24h first-party p95 TTFB.';
  const hasHeaderStats = showObservability || showComponents || showUserAnalytics;
  const topPageMaxViews = Math.max(...data.analytics.topPages.map((page) => page.views), 0);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050505] text-white" style={accentStyle} data-status-slug={slug}>
      <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <header className="rounded-lg border border-[#1b1b1b] bg-[#080808]" style={accentPanelStyle(data.page.accentColor)}>
          <div className="px-5 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            {/* Top row: Logo + Status */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                {data.page.logoUrl ? (
                  <img
                    src={data.page.logoUrl}
                    alt={data.page.name}
                    className="h-10 w-10 rounded-lg border border-[#232323] object-cover"
                  />
                ) : (
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#232323] bg-[#111]"
                    style={accentSurfaceStyle(data.page.accentColor)}
                  >
                    <Globe className="h-4 w-4 text-white" />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-[11px] font-medium uppercase tracking-[0.18em]" style={{ color: getAccentTextColor(data.page.accentColor) }}>
                    Public Status
                  </div>
                  <div className="mt-0.5 text-sm text-[#6a6a6a]">{projectDisplayHost}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium"
                  style={heroBadgeStyle(hasResolvedSummaryState, data.page.accentColor)}
                >
                  <span className="mr-2 h-2 w-2 rounded-full" style={accentDotStyle(data.page.accentColor)} />
                  {heroBadgeLabel}
                </span>
                {isRefreshing ? (
                  <Loader2 className="h-4 w-4 animate-spin text-[#8a8a8a]" />
                ) : null}
              </div>
            </div>

            {/* Title + Description */}
            <div className="mt-6">
              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
                {data.page.name}
              </h1>
              {data.page.description ? (
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#808080]">{data.page.description}</p>
              ) : null}
            </div>

            {/* Metadata row */}
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#6f6f6f]">
              <span>Latest data at {formatDateTime(latestDataAt)}</span>
              {lastCheckedAt ? (
                <>
                  <span className="hidden sm:inline">·</span>
                  <span>Last checked {formatDateTime(lastCheckedAt)}</span>
                </>
              ) : null}
              <span className="hidden sm:inline">·</span>
              <span>Checks for updates every {Math.floor(STATUS_PAGE_PUBLIC_POLL_INTERVAL_MS / 1000)}s</span>
            </div>

            {/* Summary box */}
            <div className="mt-6 rounded-lg border border-[#1d1d1d] bg-[#0d0d0d] px-4 py-4 sm:px-5 sm:py-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-white">{heroMessage}</div>
                  {showComponents ? (
                    <div className="mt-1 text-sm text-[#6a6a6a]">
                      {data.summary.visibleComponentCount} public component{data.summary.visibleComponentCount === 1 ? '' : 's'}
                      {data.summary.pendingComponentCount > 0 && (
                        <span> · {data.summary.pendingComponentCount} awaiting data</span>
                      )}
                    </div>
                  ) : null}
                </div>
                {showIncidents && data.summary.activeIncidentCount > 0 && (
                  <span className="inline-flex items-center rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400">
                    {data.summary.activeIncidentCount} active incident{data.summary.activeIncidentCount === 1 ? '' : 's'}
                  </span>
                )}
              </div>
            </div>

            {hasHeaderStats ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {showObservability ? (
                  <div className="flex items-center justify-between rounded-lg border border-[#1d1d1d] bg-[#0d0d0d] px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-[#6a6a6a]">
                      <Activity className="h-4 w-4" style={{ color: getAccentTextColor(data.page.accentColor) }} />
                      Requests
                    </div>
                    <div className="text-sm font-medium text-white">{formatNumber(data.metrics.requests24h)}</div>
                  </div>
                ) : null}
                {showUserAnalytics ? (
                  <div className="flex items-center justify-between rounded-lg border border-[#1d1d1d] bg-[#0d0d0d] px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-[#6a6a6a]">
                      <Users className="h-4 w-4" style={{ color: getAccentTextColor(data.page.accentColor) }} />
                      Visitors
                    </div>
                    <div className="text-sm font-medium text-white">{formatNumber(data.analytics.uniqueVisitors)}</div>
                  </div>
                ) : null}
                {showComponents ? (
                  <div className="flex items-center justify-between rounded-lg border border-[#1d1d1d] bg-[#0d0d0d] px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-[#6a6a6a]">
                      <ShieldCheck className="h-4 w-4" style={{ color: getAccentTextColor(data.page.accentColor) }} />
                      Linked Alerts
                    </div>
                    <div className="text-sm font-medium text-white">{formatNumber(linkedAlertRuleCount)}</div>
                  </div>
                ) : null}
                {showComponents ? (
                  <div className="flex items-center justify-between rounded-lg border border-[#1d1d1d] bg-[#0d0d0d] px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-[#6a6a6a]">
                      <RadioTower className="h-4 w-4" style={{ color: getAccentTextColor(data.page.accentColor) }} />
                      Services
                    </div>
                    <div className="text-sm font-medium text-white">{formatNumber(data.summary.visibleComponentCount)}</div>
                  </div>
                ) : null}
                {showObservability ? (
                  <div className="flex items-center justify-between rounded-lg border border-[#1d1d1d] bg-[#0d0d0d] px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-[#6a6a6a]">
                      <TrendingUp className="h-4 w-4" style={{ color: getAccentTextColor(data.page.accentColor) }} />
                      P95 TTFB
                    </div>
                    <div className="text-sm font-medium text-white">{formatMs(data.metrics.p95TtfbMs)}</div>
                  </div>
                ) : null}
              </div>
            ) : null}

            {refreshError ? (
              <div className="mt-4 rounded-lg border border-[#412727] bg-[#160f0f] px-4 py-3 text-sm text-[#d8aaaa]">
                {refreshError}
              </div>
            ) : null}
          </div>
        </header>

        {showObservability ? (
          <>
            <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <SummaryCard
                label="Requests"
                value={formatNumber(data.metrics.requests24h)}
                hint={data.metrics.windowLabel}
                accentColor={data.page.accentColor}
              />
              <SummaryCard
                label="P95 TTFB"
                value={formatMs(data.metrics.p95TtfbMs)}
                hint={latencyHint}
                accentColor={data.page.accentColor}
              />
              <SummaryCard
                label="Error Rate"
                value={formatPercent(data.metrics.errorRate24h)}
                hint="HTTP errors in the same window"
                accentColor={data.page.accentColor}
              />
              <SummaryCard
                label="JS Errors"
                value={formatNumber(data.metrics.jsErrors24h)}
                hint="Frontend exceptions"
                accentColor={data.page.accentColor}
              />
              <SummaryCard
                label="Good Vitals"
                value={goodVitalsLabel}
                hint={`${formatNumber(data.metrics.goodVitalsSamples24h)} good samples · ${formatNumber(data.metrics.vitalsSamples24h)} total`}
                accentColor={data.page.accentColor}
              />
              <SummaryCard
                label="Success Rate"
                value={data.metrics.errorRate24h === null ? 'No data' : `${(100 - data.metrics.errorRate24h).toFixed(2)}%`}
                hint="Successful requests in the last 24h"
                accentColor={data.page.accentColor}
              />
            </section>

            <section className="mt-10 grid gap-6 xl:grid-cols-2">
              <MetricBars
                title="Request volume"
                subtitle="Hourly request counts from real user traffic."
                series={data.metrics.series}
                accentColor={data.page.accentColor}
                valueFormatter={(value) => formatNumber(value)}
                getValue={(point) => point.requests}
              />
              <MetricBars
                title="TTFB trend"
                subtitle="First-party p95 TTFB in each hourly telemetry bucket."
                series={data.metrics.series}
                accentColor={data.page.accentColor}
                valueFormatter={(value) => formatMs(value)}
                getValue={(point) => point.p95TtfbMs}
              />
            </section>
          </>
        ) : null}

        {showUserAnalytics ? (
          <section className="mt-10 space-y-6">
            <SectionHeading
              eyebrow="Audience"
              title="User analytics"
              description="Public-safe audience and page engagement data from the same real user stream."
              accentColor={data.page.accentColor}
            />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <SummaryCard
                label="Pageviews"
                value={formatNumber(data.analytics.pageviews)}
                hint={data.analytics.windowLabel}
                accentColor={data.page.accentColor}
              />
              <SummaryCard
                label="Visitors"
                value={formatNumber(data.analytics.uniqueVisitors)}
                hint="Unique visitors in the same window"
                accentColor={data.page.accentColor}
              />
              <SummaryCard
                label="Visits"
                value={formatNumber(data.analytics.visits)}
                hint="Tracked browsing sessions"
                accentColor={data.page.accentColor}
              />
              <SummaryCard
                label="Avg Visit"
                value={formatMs(data.analytics.avgVisitDurationMs)}
                hint="Average session duration"
                accentColor={data.page.accentColor}
              />
              <SummaryCard
                label="Bounce Rate"
                value={formatPercent(data.analytics.bounceRate)}
                hint="Visits with a single pageview"
                accentColor={data.page.accentColor}
              />
            </div>
            <div className="grid gap-6 xl:grid-cols-2">
              <UserAnalyticsBars
                title="Pageviews"
                subtitle="Hourly pageview volume from user analytics."
                series={data.analytics.series}
                accentColor={data.page.accentColor}
                valueFormatter={(value) => formatNumber(value)}
                getValue={(point) => point.pageviews}
              />
              <UserAnalyticsBars
                title="Visitors"
                subtitle="Unique visitors observed in each hourly bucket."
                series={data.analytics.series}
                accentColor={data.page.accentColor}
                valueFormatter={(value) => formatNumber(value)}
                getValue={(point) => point.uniqueVisitors}
              />
            </div>
            <div className="grid items-start gap-6 xl:grid-cols-2">
              <div className="rounded-lg border border-[#1d1d1d] bg-[#0d0d0d] p-4 sm:p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium text-white">
                    <Eye className="h-4 w-4" />
                    Top pages
                  </div>
                  <span className="w-fit rounded-full border border-[#242424] bg-[#111] px-2.5 py-1 text-[11px] text-[#8a8a8a]">
                    By pageviews
                  </span>
                </div>
                <div className="mt-4 space-y-2">
                  {data.analytics.topPages.length === 0 ? (
                    <div className="text-sm text-[#727272]">No page analytics yet.</div>
                  ) : (
                    data.analytics.topPages.map((page, index) => {
                      const width = topPageMaxViews > 0 ? Math.max(8, (page.views / topPageMaxViews) * 100) : 0;

                      return (
                      <div key={page.path} className="rounded-lg border border-[#181818] bg-[#0a0a0a] px-3 py-3">
                        <div className="grid gap-3 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center">
                          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-[#222] bg-[#101010] text-xs font-medium text-[#8a8a8a]">
                            {index + 1}
                          </div>
                          <div className="min-w-0">
                            <div className="truncate text-sm font-medium leading-5 text-white">{page.title || page.path}</div>
                            {page.title ? <div className="mt-0.5 truncate text-xs text-[#6d6d6d]">{page.path}</div> : null}
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-left text-xs md:min-w-[150px] md:text-right">
                            <div>
                              <div className="uppercase tracking-[0.14em] text-[#5e5e5e]">Views</div>
                              <div className="mt-1 text-sm font-medium text-white">{formatNumber(page.views)}</div>
                            </div>
                            <div>
                              <div className="uppercase tracking-[0.14em] text-[#5e5e5e]">Avg</div>
                              <div className="mt-1 text-sm font-medium text-white">{formatMs(page.avgDurationMs)}</div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#151515]">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${width}%`,
                              backgroundColor: getAccentTextColor(data.page.accentColor),
                            }}
                          />
                        </div>
                      </div>
                    )})
                  )}
                </div>
              </div>
              <div className="rounded-lg border border-[#1d1d1d] bg-[#0d0d0d] p-4 sm:p-5">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <MousePointerClick className="h-4 w-4" />
                  Audience context
                </div>
                <div className="mt-4 grid gap-4">
                  <div className="rounded-lg border border-[#181818] bg-[#0a0a0a] p-4">
                    <div className="text-[11px] uppercase tracking-[0.16em] text-[#5f5f5f]">Channels</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {data.analytics.topChannels.length === 0 ? (
                        <span className="text-sm text-[#727272]">No channel data yet.</span>
                      ) : (
                        data.analytics.topChannels.map((channel) => (
                          <span key={channel.channel} className="rounded-full border border-[#1f1f1f] px-3 py-1 text-sm text-white">
                            {channel.channel} · {formatNumber(channel.visits)}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                  <div className="rounded-lg border border-[#181818] bg-[#0a0a0a] p-4">
                    <div className="text-[11px] uppercase tracking-[0.16em] text-[#5f5f5f]">Devices</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {data.analytics.topDevices.length === 0 ? (
                        <span className="text-sm text-[#727272]">No device data yet.</span>
                      ) : (
                        data.analytics.topDevices.map((device) => (
                          <span key={device.device} className="rounded-full border border-[#1f1f1f] px-3 py-1 text-sm text-white">
                            {device.device} · {formatNumber(device.visits)}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                  <div className="rounded-lg border border-[#181818] bg-[#0a0a0a] p-4">
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-[#5f5f5f]">
                      <Clock3 className="h-3.5 w-3.5" />
                      Latest analytics
                    </div>
                    <div className="mt-3 text-sm text-white">{formatDateTime(data.analytics.latestDataAt)}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {showComponents || data.uptimeMonitors.length > 0 || showIncidents || showIncidentHistory || showNetwork ? (
        <section className={`mt-10 grid w-full items-start gap-6 ${twoColumnLayout ? 'lg:grid-cols-2' : ''}`}>
          {showComponents ? (
            <div className="order-1 min-w-0 space-y-5">
              <SectionHeading
                eyebrow="Components"
                title="Customer-facing services"
                description="Current health for each public component configured on this page."
                accentColor={data.page.accentColor}
              />

              <div className="overflow-hidden rounded-lg border border-[#1d1d1d] bg-[#0d0d0d]">
                {data.components.length === 0 ? (
                  <div className="px-5 py-6 text-sm text-[#727272]">No components have been published yet.</div>
                ) : (
                  data.components.map((component, index) => (
                    <div
                      key={component.id}
                      className={`px-4 py-4 sm:px-5 ${index !== data.components.length - 1 ? 'border-b border-[#181818]' : ''}`}
                    >
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="break-words text-sm font-medium text-white">{component.name}</div>
                            <span
                              className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium"
                              style={statusPillStyle(component.derivedStatus)}
                            >
                              {STATUS_PAGE_STATUS_META[component.derivedStatus].shortLabel}
                            </span>
                            <span className="text-[11px] uppercase tracking-[0.16em] text-[#5f5f5f]">
                              {component.sourceType === 'manual' ? 'Manual' : 'Alert driven'}
                            </span>
                          </div>
                          {component.description ? (
                            <div className="mt-2 break-words text-sm leading-6 text-[#7d7d7d]">{component.description}</div>
                          ) : null}
                          <div className="mt-2 break-words text-sm text-[#666]">{component.statusReason}</div>
                        </div>
                        <div className="break-words text-xs text-[#5f5f5f] lg:max-w-[180px] lg:text-right">
                          Updated {formatDateTime(component.updatedAt)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="min-h-[260px] rounded-lg border border-[#1d1d1d] bg-[#0d0d0d] p-5" style={accentPanelStyle(data.page.accentColor)}>
                <div className="text-sm font-medium text-white">Status coverage</div>
                <div className="mt-1 text-sm text-[#6f6f6f]">
                  Live alert signal coverage for published components.
                </div>

                <div className="mt-6 divide-y divide-[#181818] rounded-lg border border-[#181818] bg-[#0a0a0a]">
                  <div className="flex items-center justify-between gap-4 px-4 py-4">
                    <span className="text-sm text-[#777]">Public components</span>
                    <span className="text-sm font-medium text-white">{formatNumber(data.summary.visibleComponentCount)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 px-4 py-4">
                    <span className="text-sm text-[#777]">Live signals</span>
                    <span className="text-sm font-medium text-white">
                      {liveSignalComponentCount} component{liveSignalComponentCount === 1 ? '' : 's'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4 px-4 py-4">
                    <span className="text-sm text-[#777]">Needs attention</span>
                    <span className="text-sm font-medium text-white">{formatNumber(attentionComponentCount)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {showNetwork ? (
            <div className="order-2 min-w-0 space-y-5">
              <SectionHeading
                eyebrow="Network"
                title="Audience footprint"
                description="Useful context when incidents are isolated to a provider or geography."
                accentColor={data.page.accentColor}
              />

              <div className="rounded-lg border border-[#1d1d1d] bg-[#0d0d0d] p-4 sm:p-5">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <RadioTower className="h-4 w-4" />
                  Top ISPs
                </div>
                <div className="mt-4 space-y-3">
                  {data.metrics.topIsps.length === 0 ? (
                    <div className="text-sm text-[#727272]">No recent network data yet.</div>
                  ) : (
                    data.metrics.topIsps.map((isp) => (
                      <div key={isp.isp} className="grid gap-3 rounded-lg border border-[#181818] bg-[#0a0a0a] px-4 py-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-4">
                        <div className="min-w-0">
                          <div className="break-words text-sm font-medium leading-6 text-white">{isp.isp}</div>
                          <div className="mt-1 text-xs text-[#6d6d6d]">{isp.requests.toLocaleString()} requests</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-left text-sm md:min-w-[140px] md:text-right">
                          <div>
                            <div className="text-[#5e5e5e]">P95 TTFB</div>
                            <div className="text-white">{formatMs(isp.p95TtfbMs)}</div>
                          </div>
                          <div>
                            <div className="text-[#5e5e5e]">Errors</div>
                            <div className="text-white">{formatPercent(isp.errorRate)}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-[#1d1d1d] bg-[#0d0d0d] p-4 sm:p-5">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <TrendingUp className="h-4 w-4" />
                  Traffic context
                </div>
                <div className="mt-4 grid gap-4">
                  <div className="rounded-lg border border-[#181818] bg-[#0a0a0a] p-4">
                    <div className="text-[11px] uppercase tracking-[0.16em] text-[#5f5f5f]">Top countries</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {data.metrics.topCountries.length === 0 ? (
                        <span className="text-sm text-[#727272]">No geography data yet.</span>
                      ) : (
                        data.metrics.topCountries.map((country) => (
                          <span key={country.country} className="rounded-full border border-[#1f1f1f] px-3 py-1 text-sm text-white">
                            {country.country} · {country.requests.toLocaleString()}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="rounded-lg border border-[#181818] bg-[#0a0a0a] p-4">
                    <div className="text-[11px] uppercase tracking-[0.16em] text-[#5f5f5f]">Freshness</div>
                    <div className="mt-3 text-sm text-white">{formatDateTime(data.metrics.latestDataAt)}</div>
                    <div className="mt-1 text-sm text-[#6f6f6f]">
                      Latest telemetry observed across requests, errors, or vitals.
                    </div>
                  </div>

                  <div className="rounded-lg border border-[#181818] bg-[#0a0a0a] p-4">
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-[#5f5f5f]">
                      <Activity className="h-3.5 w-3.5" />
                      Web Vitals
                    </div>
                    <div className="mt-3 text-sm text-white">{formatNumber(data.metrics.vitalsSamples24h)} samples</div>
                    <div className="mt-1 text-sm text-[#6f6f6f]">
                      {formatNumber(data.metrics.goodVitalsSamples24h)} good samples in the same 24-hour window.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {data.uptimeMonitors.length > 0 ? (
            <div className={`order-3 min-w-0 space-y-5 ${fullWidthSectionClass}`}>
              <SectionHeading
                eyebrow="Uptime"
                title="Endpoint uptime"
                description="Synthetic checks for public URLs configured by the team."
                accentColor={data.page.accentColor}
              />

              <div className="grid gap-4 md:grid-cols-2">
                {data.uptimeMonitors.map((monitor) => (
                  <div key={monitor.id} className="min-w-0 rounded-lg border border-[#1d1d1d] bg-[#0d0d0d] p-5">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="break-words text-sm font-medium text-white">{monitor.name}</div>
                        <span
                          className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium"
                          style={statusPillStyle(uptimeStatusTone(monitor.latestCheck?.status))}
                        >
                          {uptimeStatusLabel(monitor.latestCheck?.status)}
                        </span>
                      </div>
                      <div className="mt-2 truncate font-mono text-xs text-[#777]">
                        {monitor.method} {monitor.url}
                      </div>
                    </div>

                    <div className="mt-4 flex items-baseline justify-between gap-3">
                      <div className="text-[11px] uppercase tracking-[0.14em] text-[#626262]">24h uptime</div>
                      <div className="text-base font-semibold tracking-tight text-white sm:text-lg">
                        {formatPercent(monitor.stats24h.uptimePercent)}
                      </div>
                    </div>

                    <UptimeBarStrip history30d={monitor.history30d} />

                    <div className="mt-3 text-xs leading-5 text-[#666]">
                      Last checked {formatDateTime(monitor.latestCheck?.checkedAt)}
                      {monitor.latestCheck?.statusCode ? ` · HTTP ${monitor.latestCheck.statusCode}` : ''}
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-lg border border-[#181818] bg-[#0a0a0a] px-3 py-2.5">
                        <div className="text-[11px] uppercase tracking-[0.14em] text-[#5f5f5f]">Avg latency</div>
                        <div className="mt-1 text-sm font-medium text-white">
                          {formatMs(monitor.stats24h.avgResponseTimeMs)}
                        </div>
                      </div>
                      <div className="rounded-lg border border-[#181818] bg-[#0a0a0a] px-3 py-2.5">
                        <div className="text-[11px] uppercase tracking-[0.14em] text-[#5f5f5f]">Checks</div>
                        <div className="mt-1 text-sm font-medium text-white">
                          {formatNumber(monitor.stats24h.checkCount)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {showIncidents ? (
            <div className={`order-4 space-y-5 ${fullWidthSectionClass}`}>
          <SectionHeading
            eyebrow="Incidents"
            title="Current incidents"
            description="Manual incident communication, backed by the telemetry shown on this page."
            accentColor={data.page.accentColor}
          />

          {data.activeIncidents.length === 0 ? (
            <div className="rounded-lg border border-[#1d1d1d] bg-[#0d0d0d] px-5 py-6 text-sm text-[#717171]">
              No active incidents right now.
            </div>
          ) : (
            <div className="space-y-4">
              {data.activeIncidents.map((incident) => (
                <article key={incident.id} className="rounded-lg border border-[#1d1d1d] bg-[#0d0d0d] p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 max-w-3xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium"
                          style={statusPillStyle(IncidentTone(incident.impact))}
                        >
                          {incident.status.replace(/^\w/, (value) => value.toUpperCase())}
                        </span>
                        <span className="rounded-full border border-[#242424] px-3 py-1 text-xs text-[#8f8f8f]">
                          {incident.impact.charAt(0).toUpperCase() + incident.impact.slice(1)} impact
                        </span>
                      </div>

                      <h3 className="mt-4 text-xl font-semibold tracking-tight text-white">{incident.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-[#818181]">{incident.summary}</p>

                      <div className="mt-4 flex flex-wrap gap-3 text-xs text-[#6d6d6d]">
                        <span>Started {formatDateTime(incident.startedAt)}</span>
                        {incident.affectedComponents.length > 0 ? (
                          <span>Components: {incident.affectedComponents.map((component) => component.name).join(', ')}</span>
                        ) : null}
                        {incident.affectedRegions.length > 0 ? (
                          <span>Regions: {incident.affectedRegions.join(', ')}</span>
                        ) : null}
                        {incident.affectedIsps.length > 0 ? (
                          <span>ISPs: {incident.affectedIsps.join(', ')}</span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3 border-t border-[#181818] pt-5">
                    {incident.updates.map((update) => (
                      <div key={update.id} className="rounded-lg border border-[#191919] bg-[#0a0a0a] p-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="text-sm font-medium text-white">
                              {update.status.replace(/^\w/, (value) => value.toUpperCase())}
                            </div>
                            <div className="mt-2 text-sm leading-6 text-[#787878]">{update.message}</div>
                          </div>
                          <div className="text-xs text-[#666]">{formatDateTime(update.createdAt)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
            </div>
            ) : null}

            {showIncidentHistory ? (
            <div className={`order-5 space-y-5 ${fullWidthSectionClass}`}>
              <SectionHeading
                eyebrow="History"
                title="Resolved incidents"
                description="Past issues that were communicated publicly on this page."
                accentColor={data.page.accentColor}
              />
              {data.incidentHistory.length === 0 ? (
                <div className={`${historyIncidentCardClassName} px-5 py-6 text-sm text-[#727272]`}>
                  No resolved incidents to show yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {data.incidentHistory.map((incident) => (
                    <article key={incident.id} className={historyIncidentCardClassName}>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium"
                              style={resolvedIncidentPillStyle()}
                            >
                              Resolved
                            </span>
                            <span className="rounded-full border border-[#242424] px-3 py-1 text-xs text-[#8f8f8f]">
                              {incident.impact.charAt(0).toUpperCase() + incident.impact.slice(1)} impact
                            </span>
                          </div>
                          <h3 className="mt-3 text-sm font-semibold text-white">{incident.title}</h3>
                          <p className="mt-2 text-sm leading-6 text-[#8a8a8a]">{incident.summary}</p>
                        </div>
                        <div className="shrink-0 text-xs leading-5 text-[#6d6d6d] sm:max-w-[220px] sm:text-right">
                          {formatDateTime(incident.resolvedAt || incident.updatedAt)}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </section>
        ) : null}

        <footer
          className="relative z-10 mt-10 rounded-lg border border-[rgba(255,255,255,0.07)] bg-[rgba(13,13,13,0.74)] px-4 py-4 backdrop-blur-[3px] sm:px-5"
          style={{
            backgroundImage: `
              linear-gradient(180deg, rgba(13,13,13,0.94) 0%, rgba(13,13,13,0.84) 54%, rgba(13,13,13,0.58) 100%),
              radial-gradient(120% 180% at 50% 138%, ${data.page.accentColor}1f 0%, rgba(13,13,13,0) 58%)
            `,
          }}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 flex flex-col gap-2 text-sm text-[#7a7a7a] sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              <span>
                Latest public data {formatDateTime(latestDataAt)}
                {browserTimeZone ? ` · ${browserTimeZone}` : ''}
              </span>
              {lastCheckedAt ? (
                <span>Last checked {formatDateTime(lastCheckedAt)}</span>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#8a8a8a] lg:justify-end">
              {data.page.supportUrl ? (
                <Link href={data.page.supportUrl} target="_blank" className="transition-colors hover:text-white" style={{ color: getAccentTextColor(data.page.accentColor) }}>
                  Support
                </Link>
              ) : null}
              {data.page.docsUrl ? (
                <Link href={data.page.docsUrl} target="_blank" className="transition-colors hover:text-white" style={{ color: getAccentTextColor(data.page.accentColor) }}>
                  Docs
                </Link>
              ) : null}
              {data.page.homepageUrl ? (
                <Link href={data.page.homepageUrl} target="_blank" className="transition-colors hover:text-white" style={{ color: getAccentTextColor(data.page.accentColor) }}>
                  Homepage
                </Link>
              ) : null}
            </div>
          </div>
        </footer>

        {data.page.showRouteBranding ? (
          <div className="relative mt-8 overflow-hidden border-t border-[#181818] pt-8 pb-6 sm:pb-8">
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-32 opacity-80"
              style={{
                backgroundImage: `radial-gradient(70% 100% at 50% 100%, ${data.page.accentColor}24 0%, rgba(5,5,5,0) 72%)`,
              }}
            />
            <Link
              href={siteConfig.url}
              target="_blank"
              rel="noreferrer"
              aria-label="Visit Route"
              className="group relative mx-auto block max-w-[480px] px-4"
            >
              <div className="relative h-[88px] sm:h-[104px] lg:h-[116px]">
                <RouteFooterWordmark />
              </div>
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
