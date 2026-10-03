'use client';

import dynamic from 'next/dynamic';
import { DashboardQueryLoading } from './DashboardQueryStatus';
import {
  DashboardChartSkeleton,
  DashboardMetricCardsSkeleton,
  DashboardPageSkeleton,
  Skeleton,
} from './DashboardSkeleton';
import type { ProjectOverviewProps } from './ProjectOverview';

/** Standard analysis-page container used by most dashboard views. */
const pageContainerClass = 'max-w-350 mx-auto px-4 sm:px-6 py-8';

/** Chunk-load fallbacks mirror each view's own data-loading skeleton so the
 * transition from "downloading JS" to "fetching data" is seamless. */
const WebVitalsFallback = () => (
  <DashboardQueryLoading variant="page" metrics={5} rows={4} className={pageContainerClass} />
);

// Timeseries renders header + 4 metric cards + a chart, and no table.
const TimeSeriesFallback = () => (
  <div className={pageContainerClass}>
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <Skeleton className="h-7 w-40 sm:w-52" />
          <Skeleton className="mt-2 h-4 w-full max-w-md" />
        </div>
        <Skeleton className="h-9 w-44 shrink-0" />
      </div>
      <DashboardMetricCardsSkeleton count={4} />
      <DashboardChartSkeleton />
    </div>
  </div>
);

const NetworkBreakdownFallback = () => (
  <DashboardQueryLoading variant="page" charts={2} className={pageContainerClass} />
);

const MapFallback = () => (
  <DashboardQueryLoading
    variant="map"
    className="flex min-h-0 flex-1 flex-col px-4 py-4 sm:px-5 lg:px-6"
  />
);

// Errors page renders header + error volume chart + tables, and no metric cards.
const ErrorAnalyticsFallback = () => (
  <DashboardQueryLoading variant="page" metrics={0} charts={1} rows={6} className={pageContainerClass} />
);

const ThirdPartyFallback = () => (
  <DashboardQueryLoading variant="page" metrics={4} rows={8} className={pageContainerClass} />
);

const TableViewFallback = () => (
  <DashboardQueryLoading variant="page" metrics={0} rows={8} className={pageContainerClass} />
);

const UserAnalyticsFallback = () => (
  <DashboardQueryLoading variant="analytics" className={pageContainerClass} />
);

const AlertHistoryFallback = () => (
  <DashboardQueryLoading variant="page" metrics={4} rows={6} className={pageContainerClass} />
);

const SearchConsoleFallback = () => (
  <DashboardQueryLoading variant="page" metrics={4} charts={1} className="flex-1" />
);

const ProjectOverviewFallback = () => (
  <div className="min-h-[calc(100vh-56px)] px-4 py-4 sm:px-5 lg:px-6">
    <div className="mx-auto max-w-[1360px]">
      <DashboardPageSkeleton />
    </div>
  </div>
);

export const WebVitals = dynamic(
  () => import('./WebVitals').then(m => m.WebVitals),
  { ssr: false, loading: WebVitalsFallback }
);

export const TimeSeries = dynamic(
  () => import('./TimeSeries').then(m => m.TimeSeries),
  { ssr: false, loading: TimeSeriesFallback }
);

export const NetworkBreakdown = dynamic(
  () => import('./NetworkBreakdown').then(m => m.NetworkBreakdown),
  { ssr: false, loading: NetworkBreakdownFallback }
);

export const GlobalMap = dynamic(
  () => import('./GlobalMap').then(m => m.GlobalMap),
  { ssr: false, loading: MapFallback }
);

export const ErrorAnalytics = dynamic(
  () => import('./ErrorAnalytics').then(m => m.ErrorAnalytics),
  { ssr: false, loading: ErrorAnalyticsFallback }
);

export const ThirdPartyAnalysis = dynamic(
  () => import('./ThirdPartyAnalysis').then(m => m.ThirdPartyAnalysis),
  { ssr: false, loading: ThirdPartyFallback }
);

export const PagePerformanceView = dynamic(
  () => import('./PagePerformanceView').then(m => m.PagePerformanceView),
  { ssr: false, loading: TableViewFallback }
);

export const UserAnalyticsDashboard = dynamic(
  () => import('./UserAnalyticsView').then(m => m.UserAnalyticsDashboard),
  { ssr: false, loading: UserAnalyticsFallback }
);

// ProjectOverview has typed props so we wrap it to preserve types
const _ProjectOverview = dynamic(
  () => import('./ProjectOverview').then(m => m.ProjectOverview),
  { ssr: false, loading: ProjectOverviewFallback }
);

export function ProjectOverview(props: ProjectOverviewProps) {
  return <_ProjectOverview {...props} />;
}

export const SessionWaterfall = dynamic(
  () => import('./SessionWaterfall').then(m => m.SessionWaterfall),
  { ssr: false, loading: TableViewFallback }
);

export const AlertHistoryView = dynamic(
  () => import('./AlertHistoryView').then(m => m.AlertHistoryView),
  { ssr: false, loading: AlertHistoryFallback }
);

export const StatusPageView = dynamic(
  () => import('./StatusPageView').then(m => m.StatusPageView),
  { ssr: false, loading: TableViewFallback }
);

export const ISPBreakdown = dynamic(
  () => import('./ISPBreakdown').then(m => m.ISPBreakdown),
  { ssr: false, loading: TableViewFallback }
);

export const SearchConsoleView = dynamic(
  () => import('./SearchConsoleView').then(m => m.SearchConsoleView),
  { ssr: false, loading: SearchConsoleFallback }
);
