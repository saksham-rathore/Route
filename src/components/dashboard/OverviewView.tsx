"use client";

import { DashboardRangePills, DashboardStatCards, type StatItem } from "./DashboardPanels";
import { CumulativeRequestsChart, LatencyDistributionChart, RequestDeltaChart, RequestsOverTimeChart } from "./DashboardCharts";
import { EmptyState, SectionCard, buildQuery, useAnalytics, type RangeKey } from "./shared";

interface Props {
  projectId?: string | null;
  projectName?: string;
  range: RangeKey;
  onRangeChange: (r: RangeKey) => void;
}

interface TimeseriesResp { success: boolean; series: { time: string; requests: number; cumulative: number; p50: number; p95: number; p99: number; errors: number }[]; deltas: { time: string; delta: number; up: number; down: number }[]; totals: number; prevCount: number; deltaPct: number }
interface OverviewResp { success: boolean; stats: { pageviews: number; sessions: number; uniqueVisitors: number; customEvents: number; apiRequests: number; errorCount: number; avgApiDurationMs: number | null; p95ApiDurationMs: number | null }; topPages: { page: string; views: number }[] }

export default function OverviewView({ projectId, projectName, range, onRangeChange }: Props) {
  const tsUrl = projectId ? `/api/analytics/timeseries${buildQuery(projectId, range)}` : null;
  const ovUrl = projectId ? `/api/analytics/overview${buildQuery(projectId, range)}` : null;
  const ts = useAnalytics<TimeseriesResp>(tsUrl);
  const ov = useAnalytics<OverviewResp>(ovUrl);

  const loading = ts.loading || ov.loading;
  const s = ov.data?.stats;
  const p95 = s?.p95ApiDurationMs ?? 0;
  const errRate = (s?.apiRequests || 0) > 0 ? (((s?.errorCount || 0) / (s!.apiRequests + s!.pageviews + 1)) * 100).toFixed(2) + "%" : "0.00%";

  const stats: StatItem[] = [
    { label: "TOTAL REQUESTS", value: (ts.data?.totals ?? s?.pageviews ?? 0).toLocaleString(), delta: `${ts.data?.deltaPct && ts.data.deltaPct >= 0 ? "↑" : "↓"} ${Math.abs(ts.data?.deltaPct ?? 0)}% vs prev period`, deltaTone: "text-[#059669]", valueTone: "text-slate-900" },
    { label: "AVG LATENCY", value: `${Math.round(s?.avgApiDurationMs ?? 0)}ms`, delta: `${s?.apiRequests ?? 0} api requests`, deltaTone: "text-slate-400", valueTone: "text-slate-900" },
    { label: "P95 LATENCY", value: `${Math.round(p95)}ms`, delta: "p95 over selected range", deltaTone: "text-slate-400", valueTone: "text-[#0284c7]" },
    { label: "ERROR RATE", value: errRate, delta: `${s?.errorCount ?? 0} errors`, deltaTone: "text-slate-400", valueTone: "text-slate-900" },
  ];

  const hasData = (ts.data?.totals ?? 0) > 0 || (s?.pageviews ?? 0) > 0;

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-center justify-between pt-0.5">
        <h1 className="flex items-center gap-2 text-[15px] font-semibold text-slate-900 dark:text-white">
          <span className="h-2 w-2 rounded-full bg-[#0284c7]" />
          {projectName ? `${projectName} Overview` : "Overview"}
        </h1>
        <DashboardRangePills value={range} onChange={onRangeChange} />
      </div>

      <DashboardStatCards stats={stats} loading={loading} />

      {!loading && !hasData ? (
        <EmptyState title="No traffic yet" hint="Install the beacon script (Installation tab) and data will appear here within minutes." />
      ) : (
        <>
          <SectionCard
            title="Latency Distribution"
            subtitle="p50 / p95 / p99 over selected range"
            right={<div className="flex items-center gap-3.5 text-[11px] text-slate-500"><span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#0f172a]" /> p50</span><span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#0284c7]" /> p95</span><span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#e11d48]" /> p99</span></div>}
          >
            <p className="flex items-baseline gap-2"><span className="font-sans text-[25px] font-semibold text-[#0284c7] tabular-nums">{Math.round(p95)}ms</span><span className="text-[11px] text-slate-400">p95 over selected range</span></p>
            <LatencyDistributionChart data={ts.data?.series ?? []} />
          </SectionCard>

          <SectionCard title="Traffic Over Time" subtitle="Requests vs errors per bucket">
            <RequestsOverTimeChart data={ts.data?.series ?? []} />
          </SectionCard>

          <div className="grid gap-3 md:grid-cols-2 pb-4">
            <SectionCard title="Cumulative Requests" subtitle={`${(ts.data?.totals ?? 0).toLocaleString()} total`}>
              <p className="font-sans text-[22px] font-semibold text-[#0284c7] tabular-nums">{(ts.data?.series?.[ts.data.series.length - 1]?.cumulative ?? 0).toLocaleString()}</p>
              <CumulativeRequestsChart data={ts.data?.series ?? []} />
            </SectionCard>
            <SectionCard title="Request Delta" subtitle="Bucket-over-bucket change" right={<div className="flex items-center gap-3.5 text-[11px] text-slate-500"><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-xs bg-[#0d9488]" /> up</span><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-xs bg-[#e11d48]" /> down</span></div>}>
              <p className="font-sans text-[22px] font-semibold text-slate-900 dark:text-white tabular-nums">{ts.data?.deltaPct != null ? `${ts.data.deltaPct >= 0 ? "+" : ""}${ts.data.deltaPct}%` : "—"}</p>
              <RequestDeltaChart data={(ts.data?.deltas ?? []).map((d) => ({ time: d.time, delta: d.delta, up: d.up, down: d.down }))} />
            </SectionCard>
          </div>
        </>
      )}
    </div>
  );
}
