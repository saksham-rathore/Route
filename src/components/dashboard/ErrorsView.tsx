"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DashboardRangePills } from "./DashboardPanels";
import { EmptyState, SectionCard, buildQuery, useAnalytics, type RangeKey } from "./shared";

interface Props { projectId?: string | null; range: RangeKey; onRangeChange: (r: RangeKey) => void }
interface ErrorsResp { success: boolean; errors: { id: string; eventType: string; pagePath: string | null; eventTime: string; browser: string | null; errorMessage: string | null; errorFilename: string | null; errorLine: number | null }[]; pagination: { page: number; total: number; totalPages: number } }

export default function ErrorsView({ projectId, range, onRangeChange }: Props) {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const url = projectId ? `/api/errors${buildQuery(projectId, range, { page: String(page), limit: "15", ...(query ? { q: query } : {}) })}` : null;
  const { data, loading } = useAnalytics<ErrorsResp>(url, { live: true });
  const errors = data?.errors ?? [];

  const byPage = Object.entries(errors.reduce<Record<string, number>>((acc, e) => {
    const k = e.pagePath || "/";
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {})).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 10);

  const byType = Object.entries(errors.reduce<Record<string, number>>((acc, e) => {
    acc[e.eventType] = (acc[e.eventType] || 0) + 1;
    return acc;
  }, {})).map(([name, value]) => ({ name, value }));

  return (
    <div className="flex flex-col gap-3.5 pb-4">
      <div className="flex items-center justify-between pt-0.5">
        <h1 className="flex items-center gap-2 text-[15px] font-semibold text-slate-900 dark:text-white"><span className="h-2 w-2 rounded-full bg-[#e11d48]" />Errors</h1>
        <DashboardRangePills value={range} onChange={(r) => { onRangeChange(r); setPage(1); }} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 inside-shadow dark:border-[#1e2738] dark:bg-[#121927]">
          <p className="text-[10px] font-semibold tracking-[0.08em] text-slate-400">TOTAL ERRORS</p>
          <p className="mt-1 text-[26px] font-bold tabular-nums text-[#e11d48]">{loading ? "—" : (data?.pagination.total ?? 0).toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 inside-shadow dark:border-[#1e2738] dark:bg-[#121927]">
          <p className="text-[10px] font-semibold tracking-[0.08em] text-slate-400">AFFECTED PAGES</p>
          <p className="mt-1 text-[26px] font-bold tabular-nums text-slate-900 dark:text-white">{loading ? "—" : byPage.length}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { setQuery(q); setPage(1); } }} placeholder="Search error messages..." className="h-[36px] w-full max-w-[320px] rounded-lg border border-slate-200/80 bg-white px-3 text-[12.5px] outline-none focus:border-sky-500 dark:border-[#1e2738] dark:bg-[#121927] dark:text-white" />
        <button onClick={() => { setQuery(q); setPage(1); }} className="h-[36px] rounded-lg bg-[#0284c7] px-4 text-[12.5px] font-semibold text-white">Search</button>
      </div>

      {!loading && errors.length === 0 ? (
        <EmptyState title="No errors — all clear" hint="JS + promise rejections captured by the beacon will show here." />
      ) : (
        <>
          {byPage.length > 0 && (
            <SectionCard title="Errors by page" subtitle="Top pages by error count">
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={byPage} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                    <CartesianGrid stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} tickLine={false} axisLine={false} interval={0} angle={-12} height={44} />
                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: 8, fontSize: 11, color: "#fff", border: "1px solid #1e293b" }} />
                    <Bar dataKey="count" name="Errors" radius={[6, 6, 0, 0]} barSize={28}>
                      {byPage.map((_, i) => (<Cell key={i} fill={i === 0 ? "#e11d48" : "#f43f5e"} fillOpacity={1 - i * 0.08} />))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {byType.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                  {byType.map((t) => (<span key={t.name} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-slate-600">{t.name}: {t.value}</span>))}
                </div>
              )}
            </SectionCard>
          )}

          <SectionCard title="Error feed" subtitle={data ? `${data.pagination.total} total` : undefined}>
            <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800">
              {errors.map((e) => (
                <div key={e.id} className="py-3">
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className={`rounded px-1.5 py-0.5 font-mono font-semibold ${e.eventType === "JAVASCRIPT_ERROR" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"}`}>{e.eventType}</span>
                    <span className="font-mono text-slate-400">{e.pagePath || "/"}</span>
                    <span className="ml-auto text-slate-400">{new Date(e.eventTime).toLocaleString()}</span>
                  </div>
                  <p className="mt-1.5 font-mono text-[12px] leading-relaxed text-slate-800 dark:text-slate-200">{e.errorMessage || "(no message)"}</p>
                  {(e.errorFilename || e.errorLine) && (<p className="mt-0.5 font-mono text-[11px] text-slate-400">{e.errorFilename}{e.errorLine ? `:${e.errorLine}` : ""}{e.browser ? ` · ${e.browser}` : ""}</p>)}
                </div>
              ))}
            </div>
            {data && data.pagination.totalPages > 1 && (
              <div className="mt-3 flex items-center justify-between text-[12px]">
                <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium disabled:opacity-40">Prev</button>
                <span className="text-slate-400">{page} / {data.pagination.totalPages}</span>
                <button disabled={page >= data.pagination.totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium disabled:opacity-40">Next</button>
              </div>
            )}
          </SectionCard>
        </>
      )}
    </div>
  );
}
