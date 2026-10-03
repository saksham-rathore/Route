'use client';

import {
  dashboardLoadingPanelHeight,
  dashboardMetricGridFourClass,
  dashboardMetricGridFiveClass,
  dashboardRankedPanelMinHeight,
} from '@/components/dashboard/chart-layout';

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`animate-pulse rounded-md bg-[color:var(--dash-bg-subtle)] ${className}`}
    />
  );
}

export function DashboardMetricCardsSkeleton({
  count = 4,
  five = false,
}: {
  count?: number;
  five?: boolean;
}) {
  const gridClass = five ? dashboardMetricGridFiveClass : dashboardMetricGridFourClass;

  return (
    <div className={gridClass}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="dashboard-panel dashboard-metric-card px-4 py-3">
          <Skeleton className="h-2.5 w-16" />
          <Skeleton className="mt-1.5 h-7 w-20" />
        </div>
      ))}
    </div>
  );
}

export function DashboardTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="dashboard-panel overflow-hidden px-4 py-4 sm:px-5">
      <Skeleton className="mb-4 h-9 w-full max-w-sm" />
      <div className="space-y-2.5">
        {Array.from({ length: rows }).map((_, index) => (
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
    </div>
  );
}

export function DashboardChartSkeleton({
  className = 'h-[250px] sm:h-[300px] lg:h-[360px]',
}: {
  className?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-lg border border-[color:var(--dash-divider)] bg-[color:var(--dash-surface)] ${className}`}>
      <div className="border-b border-[color:var(--dash-divider)] px-4 py-3 sm:px-5">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-2 h-3 w-56" />
      </div>
      <div className="p-4 sm:p-5">
        <Skeleton className="h-[calc(100%-0.5rem)] min-h-[160px] w-full rounded-lg" />
      </div>
    </div>
  );
}

export function DashboardEmbedBadgeSkeleton() {
  return (
    <div className="space-y-5">
      <div className="dashboard-panel space-y-5 p-5 sm:p-6">
        <div>
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-2 h-6 w-36" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
        <Skeleton className="h-[72px] w-[220px] rounded-lg" />
      </div>
      <div className="dashboard-panel space-y-4 p-5 sm:p-6">
        <div>
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-2 h-6 w-28" />
        </div>
        <Skeleton className="h-24 w-full rounded-md" />
      </div>
    </div>
  );
}

export function DashboardRankedPanelSkeleton() {
  return (
    <div
      className={`dashboard-panel flex ${dashboardRankedPanelMinHeight} flex-col overflow-hidden`}
    >
      <div className="border-b border-[color:var(--dash-divider)] px-5 py-3.5">
        <Skeleton className="h-5 w-28" />
      </div>
      <div className="border-b border-[color:var(--dash-divider)] px-5 py-2">
        <Skeleton className="h-8 w-52" />
      </div>
      <div className="flex-1 space-y-2 px-4 py-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="grid min-h-[54px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-md px-3 py-2"
          >
            <div className="min-w-0 space-y-2">
              <Skeleton className="h-4 w-[min(100%,12rem)]" />
              <Skeleton className="h-3 w-[min(100%,8rem)]" />
            </div>
            <Skeleton className="h-4 w-10" />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center px-4 pb-4">
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  );
}

export function DashboardPageSkeleton({
  metrics = 4,
  fiveMetrics = false,
  rows = 6,
  charts = 0,
}: {
  metrics?: number;
  fiveMetrics?: boolean;
  rows?: number;
  charts?: number;
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <Skeleton className="h-7 w-40 sm:w-52" />
          <Skeleton className="mt-2 h-4 w-full max-w-md" />
        </div>
        <Skeleton className="h-9 w-44 shrink-0" />
      </div>

      {metrics > 0 ? (
        <DashboardMetricCardsSkeleton count={metrics} five={fiveMetrics} />
      ) : null}

      {charts > 0 ? (
        <div className={`grid gap-5 ${charts > 1 ? 'lg:grid-cols-2' : ''}`}>
          {Array.from({ length: charts }).map((_, index) => (
            <DashboardChartSkeleton key={index} />
          ))}
        </div>
      ) : null}

      <DashboardTableSkeleton rows={rows} />
    </div>
  );
}

export function DashboardAnalyticsPageSkeleton() {
  return (
    <div className="space-y-5">
      <DashboardMetricCardsSkeleton count={5} five />
      <div className={`dashboard-panel ${dashboardLoadingPanelHeight} overflow-hidden p-4 sm:p-5`}>
        <Skeleton className="h-5 w-36" />
        <Skeleton className="mt-4 h-[calc(100%-2rem)] min-h-[220px] w-full rounded-lg" />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <DashboardRankedPanelSkeleton />
        <DashboardRankedPanelSkeleton />
      </div>
    </div>
  );
}

export function DashboardMapViewSkeleton() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <DashboardMetricCardsSkeleton count={4} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-9 w-56" />
      </div>
      <div className={`dashboard-panel relative flex-1 overflow-hidden p-0 ${dashboardLoadingPanelHeight}`}>
        <Skeleton className="absolute inset-3 rounded-lg" />
      </div>
    </div>
  );
}

export function DashboardSettingsSkeleton() {
  return (
    <div className="mx-auto max-w-350 space-y-8 px-4 py-6 sm:px-6 sm:py-8">
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-28" />
      </div>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="dashboard-panel space-y-4 p-5 sm:p-6">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ))}
    </div>
  );
}

export function DashboardBillingSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <Skeleton className="h-8 w-40" />
      <div className="dashboard-panel space-y-4 p-6">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-full max-w-xl" />
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="dashboard-panel space-y-3 p-5">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
