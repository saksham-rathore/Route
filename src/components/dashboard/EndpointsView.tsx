"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DashboardRangePills } from "./DashboardPanels";
import { EmptyState, SectionCard, buildQuery, useAnalytics, type RangeKey } from "./shared";

interface Props { projectId?: string | null; range: RangeKey; onRangeChange: (r: RangeKey) => void }
interface EndpointsResp { success: boolean; summary: { totalEndpoints: number; totalRequests: number; avgLatency: number; errorEndpoints: number }; endpoints: { endpoint: string; url: string; method: string; requests: number; p50: number; p95: number; p99: number; avg: number; errors: number; errorRate: number }[] }

const METHOD_COLORS: Record<string, string> = { GET: "#0284c7", POST: "#16a34a", PUT: "#ea580c", DELETE: "#e11d48", PATCH: "#7c3aed" };

export default function EndpointsView({ projectId, range, onRangeChange }: Props) {
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const url = projectId ? `/api/analytics/endpoints${buildQuery(projectId, range, { ...(q ? { search: q } : {}) })}` : null;
  const { data, loading } = useAnalytics<EndpointsResp>(url);
  const endpoints = data?.endpoints ?? [];
  const chartData = endpoints.slice(0, 10).map((e) => ({ name: e.url.length > 28 ? e.url.slice(0, 28) + "…" : e.url, p95: e.p95, requests: e.requests }));

  return (
    <div className="flex flex-col gap-3.5 pb-4">
      <div className="flex items-center justify-between pt-0.5">
        <h1 className="flex items-center gap-2 text-[15px] font-semibold text-slate-900 dark:text-white"><span className="h-2 w-2 rounded-full bg-[#0284c7]" />Endpoints</h1>
        <DashboardRangePills value={range} onChange={onRangeChange} />
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[["ENDPOINTS", data?.summary.totalEndpoints ?? 0], ["REQUESTS", data?.summary.totalRequests ?? 0], ["AVG LATENCY", `${data?.summary.avgLatency ?? 0}ms`], ["WITH ERRORS", data?.summary.errorEndpoints ?? 0]].map(([label, value]) => (
          <div key={label as string} className="rounded-xl border border-slate-200/80 bg-white p-4 inside-shadow dark:border-[#1e2738] dark:bg-[#121927]">
            <p className="text-[10px] font-semibold tracking-[0.08em] text-slate-400">{label}</p>
            <p className="mt-1 text-[26px] font-bold tabular-nums text-slate-900 dark:text-white">{loading ? "—" : Number(value).toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") setQ(search); }} placeholder="Filter by URL..." className="h-[36px] w-full max-w-[320px] rounded-lg border border-slate-200/80 bg-white px-3 text-[12.5px] outline-none focus:border-sky-500 dark:border-[#1e2738] dark:bg-[#121927] dark:text-white" />
        <button onClick={() => setQ(search)} className="h-[36px] rounded-lg bg-[#0284c7] px-4 text-[12.5px] font-semibold text-white">Filter</button>
      </div>

      {!loading && endpoints.length === 0 ? (
        <EmptyState title="No API requests yet" hint="fetch/XHR calls on your site are auto-captured by the beacon." />
      ) : (
        <>
          {chartData.length > 0 && (
            <SectionCard title="p95 latency by endpoint" subtitle="Top 10 by volume">
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
                    <CartesianGrid stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#64748b" }} tickLine={false} axisLine={false} interval={0} angle={-14} height={52} />
                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: 8, fontSize: 11, color: "#fff", border: "1px solid #1e293b" }} />
                    <Bar dataKey="p95" name="p95 ms" fill="#0284c7" radius={[6, 6, 0, 0]} barSize={26} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          )}
          <SectionCard title="All endpoints" subtitle={`${endpoints.length} routes`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12px]">
                <thead><tr className="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400 dark:border-slate-800"><th className="pb-2.5">Endpoint</th><th className="pb-2.5">Reqs</th><th className="pb-2.5">p50</th><th className="pb-2.5">p95</th><th className="pb-2.5">Error %</th></tr></thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {endpoints.map((e) => (
                    <tr key={e.endpoint} className="hover:bg-slate-50/60">
                      <td className="py-2.5"><span className="mr-2 rounded px-1.5 py-0.5 font-mono text-[10px] font-bold text-white" style={{ background: METHOD_COLORS[e.method] || "#64748b" }}>{e.method}</span><span className="font-mono text-slate-800">{e.url}</span></td>
                      <td className="py-2.5 tabular-nums font-medium">{e.requests}</td>
                      <td className="py-2.5 tabular-nums font-mono">{e.p50}ms</td>
                      <td className="py-2.5 tabular-nums font-mono font-semibold text-[#0284c7]">{e.p95}ms</td>
                      <td className={`py-2.5 tabular-nums font-medium ${e.errorRate > 0 ? "text-red-600" : "text-slate-400"}`}>{e.errorRate.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </>
      )}
    </div>
  );
}
