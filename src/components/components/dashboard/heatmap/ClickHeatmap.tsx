'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { isDemoProjectId } from '@/lib/demo/config';
import {
  useGetUserAnalyticsHeatmapQuery,
  useGetProjectSettingsQuery,
  isQueryPending,
  shouldShowQueryError,
  type HeatmapClick,
  type UserAnalyticsHeatmapClickResponse,
  type UserAnalyticsHeatmapScrollResponse,
} from '@/lib/redux';
import type { TimeRange } from '@/lib/redux/hooks/useAllowedTimeRanges';
import { exportCSV, exportJSON, exportFilename, type ExportColumn } from '@/lib/core/export';
import { DashboardSection } from '@/components/dashboard/DashboardSection';
import { DashboardQueryError } from '@/components/dashboard/DashboardQueryStatus';
import { Skeleton } from '@/components/dashboard/DashboardSkeleton';
import { HeatmapViewer } from '@/components/dashboard/heatmap/HeatmapViewer';
import { ScrollDepthBar } from '@/components/dashboard/heatmap/ScrollDepthBar';
import { ScrollDepthOverlay } from '@/components/dashboard/heatmap/ScrollDepthOverlay';
import { scrollReachLegendGradient } from '@/components/dashboard/heatmap/scrollBucketsToGradient';
import { computeMaxIntensity, normalizePoints } from '@/components/dashboard/heatmap/normalizePoints';
import { HEATMAP_VIEWER_HEIGHT } from '@/components/dashboard/heatmap/heatmapEmbedConfig';

export interface HeatmapExportHandlers {
  exportCSV: () => void;
  exportJSON: () => void;
  hasData: boolean;
}

interface ClickHeatmapProps {
  projectId: string;
  /** Time range from UserAnalyticsDashboard shell */
  range: TimeRange;
  onRegisterExport?: (handlers: HeatmapExportHandlers | null) => void;
}

type HeatmapType = 'click' | 'scroll';

const HEATMAP_PATH = '/';

function buildHeatmapPageUrl(domain: string | null | undefined, path: string): string | undefined {
  if (!domain) return undefined;
  const normalized = domain.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
  if (!normalized) return undefined;
  return `https://${normalized}${path}`;
}

const TYPE_OPTIONS: { value: HeatmapType; label: string }[] = [
  { value: 'click', label: 'Clicks' },
  { value: 'scroll', label: 'Scroll' },
];

function isClickHeatmapData(
  data: UserAnalyticsHeatmapClickResponse | UserAnalyticsHeatmapScrollResponse,
): data is UserAnalyticsHeatmapClickResponse {
  return 'clicks' in data;
}

function HeatmapViewerContentSkeleton({ height = HEATMAP_VIEWER_HEIGHT }: { height?: number }) {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <Skeleton className="h-4 w-48" />
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-6 flex-1" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>
      <div style={{ height }}>
        <Skeleton className="h-full w-full rounded-md" />
      </div>
    </div>
  );
}

function HeatmapSectionSkeleton() {
  return (
    <div className="space-y-5">
      <DashboardSection
        id="heatmap-viewer"
        as="div"
        className="overflow-hidden rounded-lg border border-[color:var(--dash-divider)] bg-[color:var(--dash-surface)]"
        aria-busy="true"
        aria-label="Loading heatmap"
      >
        <div className="flex items-center justify-between gap-3 border-b border-[color:var(--dash-divider)] px-4 py-3">
          <div className="min-w-0 space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-8 w-36" />
        </div>
        <div className="p-4">
          <HeatmapViewerContentSkeleton height={HEATMAP_VIEWER_HEIGHT} />
        </div>
        <div className="flex items-center gap-3 border-t border-[color:var(--dash-divider)] px-4 py-3">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-2 max-w-48 flex-1 rounded-full" />
          <Skeleton className="h-3 w-28" />
        </div>
      </DashboardSection>

      <div className="flex flex-wrap gap-4">
        <Skeleton className="h-[60px] w-[132px]" />
        <Skeleton className="h-[60px] w-[132px]" />
      </div>
    </div>
  );
}

export function ClickHeatmap({ projectId, range, onRegisterExport }: ClickHeatmapProps) {
  const [heatmapType, setHeatmapType] = useState<HeatmapType>('click');

  const { data: settings } = useGetProjectSettingsQuery({ projectId });

  const { data, isLoading, isFetching, isUninitialized, error, refetch } =
    useGetUserAnalyticsHeatmapQuery({
      projectId,
      range,
      path: HEATMAP_PATH,
      device: null,
      type: heatmapType,
    });

  const queryState = { data, error, isLoading, isFetching, isUninitialized };

  const embedUrl = `/api/projects/${projectId}/user/heatmap/embed?path=${encodeURIComponent(HEATMAP_PATH)}`;
  const screenshotUrl = `/api/projects/${projectId}/user/heatmap/screenshot?path=${encodeURIComponent(HEATMAP_PATH)}`;
  const pageUrl =
    buildHeatmapPageUrl(settings?.domain, HEATMAP_PATH) ??
    (isDemoProjectId(projectId) ? 'https://route.dev/' : undefined);

  const clickData = data && isClickHeatmapData(data) ? data : null;
  const scrollData = data && !isClickHeatmapData(data) ? data : null;

  const peakIntensity = useMemo(() => {
    if (!clickData?.clicks.length) return 0;
    const points = normalizePoints(clickData.clicks, 1000, 800);
    return computeMaxIntensity(points);
  }, [clickData?.clicks]);

  const handleExportCSV = useCallback(() => {
    if (!data) return;
    if (isClickHeatmapData(data) && data.clicks.length) {
      const columns: ExportColumn<HeatmapClick>[] = [
        { key: 'x', header: 'X (0-10000 grid)' },
        { key: 'y', header: 'Y (0-10000 grid)' },
        { key: 'vw', header: 'Viewport width' },
        { key: 'vh', header: 'Viewport height' },
        { key: 'path', header: 'Path' },
        { key: 'ts', header: 'Timestamp' },
      ];
      exportCSV(data.clicks, columns, exportFilename('heatmap', projectId, range, 'csv'));
      return;
    }
    if (!isClickHeatmapData(data) && data.scrollBuckets.length) {
      const columns: ExportColumn<{ label: string; value: number; pct: number }>[] = [
        { key: 'label', header: 'Scroll depth' },
        { key: 'value', header: 'Pageviews' },
        { key: 'pct', header: 'Share %' },
      ];
      exportCSV(data.scrollBuckets, columns, exportFilename('scroll-heatmap', projectId, range, 'csv'));
    }
  }, [data, projectId, range]);

  const handleExportJSON = useCallback(() => {
    if (!data) return;
    const prefix = isClickHeatmapData(data) ? 'heatmap' : 'scroll-heatmap';
    exportJSON(data, exportFilename(prefix, projectId, range, 'json'));
  }, [data, projectId, range]);

  const hasExportData = useMemo(() => {
    if (!data) return false;
    if (isClickHeatmapData(data)) return data.clicks.length > 0;
    return data.totalPageviews > 0;
  }, [data]);

  useEffect(() => {
    if (!onRegisterExport) return;
    onRegisterExport({
      exportCSV: handleExportCSV,
      exportJSON: handleExportJSON,
      hasData: hasExportData,
    });
    return () => onRegisterExport(null);
  }, [handleExportCSV, handleExportJSON, hasExportData, onRegisterExport]);

  if (isQueryPending(queryState)) {
    return <HeatmapSectionSkeleton />;
  }

  if (shouldShowQueryError(queryState)) {
    return (
      <div className="rounded-lg border border-[color:var(--dash-divider)] bg-[color:var(--dash-surface)]">
        <DashboardQueryError
          message="Failed to load heatmap data."
          onRetry={() => void refetch()}
        />
      </div>
    );
  }

  const showPageEmbed = settings?.domain || isDemoProjectId(projectId);

  return (
    <div className="space-y-5">
      <DashboardSection
        id="heatmap-viewer"
        as="div"
        className="overflow-hidden rounded-lg border border-[color:var(--dash-divider)] bg-[color:var(--dash-surface)]"
      >
        <div className="flex items-center justify-between gap-3 border-b border-[color:var(--dash-divider)] px-4 py-3">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-[color:var(--dash-text)]">
              {HEATMAP_PATH}
            </h2>
            {clickData ? (
              <p className="text-[10px] text-[color:var(--dash-text-muted)]">
                {clickData.totalClicks.toLocaleString()} click{clickData.totalClicks !== 1 ? 's' : ''}
              </p>
            ) : scrollData ? (
              <p className="text-[10px] text-[color:var(--dash-text-muted)]">
                {scrollData.totalPageviews.toLocaleString()} pageview
                {scrollData.totalPageviews !== 1 ? 's' : ''}
              </p>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {isFetching ? (
              <span className="text-[10px] text-[color:var(--dash-text-muted)]">Updating…</span>
            ) : null}
            <div className="dashboard-control inline-flex p-0.5">
              {TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setHeatmapType(opt.value)}
                  className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                    heatmapType === opt.value
                      ? 'bg-[color:var(--dash-blue)] text-[color:var(--dash-text-on-accent)] shadow-[var(--dash-button-shadow)]'
                      : 'text-[color:var(--dash-text-soft)] hover:text-[color:var(--dash-text)]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4">
          {heatmapType === 'click' && !showPageEmbed ? (
            <div className="flex h-[200px] items-center justify-center rounded-md border border-[color:var(--dash-divider)] bg-[color:var(--dash-bg-subtle)]">
              <p className="text-sm text-[color:var(--dash-text-muted)]">
                Set a project domain in Settings to load the live page.
              </p>
            </div>
          ) : heatmapType === 'click' ? (
            <HeatmapViewer
              clicks={clickData?.clicks ?? []}
              embedUrl={embedUrl}
              screenshotUrl={screenshotUrl}
              pageUrl={pageUrl}
              height={HEATMAP_VIEWER_HEIGHT}
            />
          ) : scrollData && !showPageEmbed ? (
            <div className="space-y-4">
              <ScrollDepthBar
                scrollBuckets={scrollData.scrollBuckets}
                avgScrollPercentage={scrollData.avgScrollPercentage}
              />
              <div className="flex h-[200px] items-center justify-center rounded-md border border-[color:var(--dash-divider)] bg-[color:var(--dash-bg-subtle)]">
                <p className="text-sm text-[color:var(--dash-text-muted)]">
                  Set a project domain in Settings to load the live page.
                </p>
              </div>
            </div>
          ) : scrollData ? (
            <div className="space-y-4">
              <ScrollDepthBar
                scrollBuckets={scrollData.scrollBuckets}
                avgScrollPercentage={scrollData.avgScrollPercentage}
              />
              <ScrollDepthOverlay
                scrollBuckets={scrollData.scrollBuckets}
                embedUrl={embedUrl}
                screenshotUrl={screenshotUrl}
                pageUrl={pageUrl}
                height={HEATMAP_VIEWER_HEIGHT}
              />
            </div>
          ) : null}
        </div>

        {heatmapType === 'click' && clickData && clickData.clicks.length > 0 && (
          <div className="flex items-center gap-3 border-t border-[color:var(--dash-divider)] px-4 py-3">
            <span className="text-[10px] text-[color:var(--dash-text-muted)]">Intensity</span>
            <div
              className="h-2 max-w-48 flex-1 rounded-full"
              style={{
                background:
                  'linear-gradient(to right, #0000ff, #00ffff, #00ff00, #ffff00, #ff0000)',
              }}
            />
            <div className="flex items-center gap-4 text-[10px] text-[color:var(--dash-text-muted)]">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
        )}

        {heatmapType === 'scroll' && scrollData && scrollData.totalPageviews > 0 && (
          <div className="flex items-center gap-3 border-t border-[color:var(--dash-divider)] px-4 py-3">
            <span className="text-[10px] text-[color:var(--dash-text-muted)]">Reach</span>
            <div
              className="h-2 max-w-48 flex-1 rounded-full"
              style={{ background: scrollReachLegendGradient() }}
            />
            <div className="flex items-center gap-4 text-[10px] text-[color:var(--dash-text-muted)]">
              <span>More scrolled here</span>
              <span>Less scrolled here</span>
            </div>
          </div>
        )}
      </DashboardSection>

      {clickData && clickData.clicks.length > 0 && heatmapType === 'click' && (
        <div className="flex flex-wrap gap-4 text-sm text-[color:var(--dash-text-soft)]">
          <div className="rounded-md border border-[color:var(--dash-divider)] bg-[color:var(--dash-surface)] px-3 py-2 text-center">
            <div className="text-lg font-semibold tabular-nums text-[color:var(--dash-text)]">
              {clickData.totalClicks.toLocaleString()}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-[color:var(--dash-text-muted)]">
              Total clicks
            </div>
          </div>
          <div className="rounded-md border border-[color:var(--dash-divider)] bg-[color:var(--dash-surface)] px-3 py-2 text-center">
            <div className="text-lg font-semibold tabular-nums text-[color:var(--dash-text)]">
              {peakIntensity.toLocaleString()}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-[color:var(--dash-text-muted)]">
              Peak density
            </div>
          </div>
        </div>
      )}

      {scrollData && scrollData.totalPageviews > 0 && heatmapType === 'scroll' && (
        <div className="flex flex-wrap gap-4 text-sm text-[color:var(--dash-text-soft)]">
          <div className="rounded-md border border-[color:var(--dash-divider)] bg-[color:var(--dash-surface)] px-3 py-2 text-center">
            <div className="text-lg font-semibold tabular-nums text-[color:var(--dash-text)]">
              {scrollData.totalPageviews.toLocaleString()}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-[color:var(--dash-text-muted)]">
              Total pageviews
            </div>
          </div>
          <div className="rounded-md border border-[color:var(--dash-divider)] bg-[color:var(--dash-surface)] px-3 py-2 text-center">
            <div className="text-lg font-semibold tabular-nums text-[color:var(--dash-text)]">
              {scrollData.avgScrollPercentage}%
            </div>
            <div className="text-[10px] uppercase tracking-wider text-[color:var(--dash-text-muted)]">
              Avg scroll depth
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
