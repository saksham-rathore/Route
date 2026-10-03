'use client';

import {
  DashboardAnalyticsPageSkeleton,
  DashboardBillingSkeleton,
  DashboardChartSkeleton,
  DashboardMapViewSkeleton,
  DashboardPageSkeleton,
  DashboardEmbedBadgeSkeleton,
  DashboardRankedPanelSkeleton,
  DashboardSettingsSkeleton,
  DashboardTableSkeleton,
} from './DashboardSkeleton';

export type DashboardQueryLoadingVariant =
  | 'page'
  | 'table'
  | 'chart'
  | 'panel'
  | 'badge'
  | 'analytics'
  | 'settings'
  | 'billing'
  | 'map';

export function DashboardQueryLoading({
  variant = 'page',
  rows = 6,
  metrics = 4,
  fiveMetrics = false,
  charts = 0,
  className = '',
}: {
  variant?: DashboardQueryLoadingVariant;
  rows?: number;
  metrics?: number;
  fiveMetrics?: boolean;
  charts?: number;
  className?: string;
}) {
  const content = (() => {
    switch (variant) {
      case 'table':
        return <DashboardTableSkeleton rows={rows} />;
      case 'chart':
        return <DashboardChartSkeleton />;
      case 'panel':
        return <DashboardRankedPanelSkeleton />;
      case 'badge':
        return <DashboardEmbedBadgeSkeleton />;
      case 'analytics':
        return <DashboardAnalyticsPageSkeleton />;
      case 'settings':
        return <DashboardSettingsSkeleton />;
      case 'billing':
        return <DashboardBillingSkeleton />;
      case 'map':
        return <DashboardMapViewSkeleton />;
      case 'page':
      default:
        return (
          <DashboardPageSkeleton
            metrics={metrics}
            fiveMetrics={fiveMetrics}
            rows={rows}
            charts={charts}
          />
        );
    }
  })();

  if (!className) return content;

  return <div className={className}>{content}</div>;
}

export function DashboardQueryError({
  message = 'Unable to load data right now.',
  onRetry,
  className = 'py-16',
}: {
  message?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${className}`}
    >
      <p className="text-sm text-[color:var(--dash-text-soft)]">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 text-sm text-[color:var(--dash-blue)] transition hover:underline"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}
