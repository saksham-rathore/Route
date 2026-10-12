"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DashboardRangePills } from "./DashboardPanels";
import { EmptyState, SectionCard, buildQuery, useAnalytics, type RangeKey } from "./shared";

interface Props { projectId?: string | null; range: RangeKey; onRangeChange: (r: RangeKey) => void }
interface SessionsResp { success: boolean; sessions: { id: string; beaconSessionId: string; startedAt: string; lastActivityAt: string; host: string | null; landingPage: string | null; device: string | null; browser: string | null; country: string | null; city: string | null; _count: { events: number } }[]; pagination: { page: number; limit: number; total: number; totalPages: number } }

export default function SessionsView({ projectId, range, onRangeChange }: Props) {
  const [page, setPage] = useState(1);
  const url = projectId ? `/api/analytics/sessions${buildQuery(projectId, range, { page: String(page), limit: "15" })}` : null;
  const { data, loading } = useAnalytics<SessionsResp>(url, { live: true });

  const sessions = data?.sessions ?? [];
  const byDevice = sessions.reduce<Record<string, number>>((acc, s) => {
    const k = s.device || "unknown";
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
  const deviceRows = Object.entries(byDevice).map(([name, value]) => ({ name, value }));

  return (
    <div className="flex flex-col gap-3.5 pb-4">
      <div className="flex items-center justify-between pt-0.5">
        <h1 className="flex items-center gap-2 text-[15px] font-semibold text-slate-900 dark:text-white"><span className="h-2 w-2 rounded-full bg-[#0284c7]" />Sessions</h1>
        <DashboardRangePills value={range} onChange={(r) => { onRangeChange(r); setPage(1); }} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 inside-shadow dark:border-[#1e2738] dark:bg-[#121927]">
          <p className="text-[10px] font-semibold tracking-[0.08em] text-slate-400">TOTAL SESSIONS</p>
          <p className="mt-1 text-[26px] font-bold tabular-nums text-slate-900 dark:text-white">{loading ? "—" : (data?.pagination.total ?? 0).toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 inside-shadow dark:border-[#1e2738] dark:bg-[#121927]">
          <p className="text-[10px] font-semibold tracking-[0.08em] text-slate-400">AVG EVENTS / SESSION</p>
          <p className="mt-1 text-[26px] font-bold tabular-nums text-slate-900 dark:text-white">{loading || !sessions.length ? "—" : (sessions.reduce((a, s) => a + s._count.events, 0) / sessions.length).toFixed(1)}</p>
        </div>
      </div>

      {deviceRows.length > 0 && (
        <SectionCard title="Sessions by device" subtitle="Current page sample">
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deviceRows} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: 8, fontSize: 11, color: "#fff", border: "1px solid #1e293b" }} />
                <Bar dataKey="value" name="Sessions" fill="#0284c7" radius={[6, 6, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      )}

      <SectionCard title="Recent sessions" subtitle={data ? `Page ${data.pagination.page} of ${data.pagination.totalPages}` : undefined}>
        {!loading && sessions.length === 0 ? (
          <EmptyState title="No sessions yet" hint="Sessions appear after the beacon script sends its first ping." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12px]">
                <thead><tr className="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400 dark:border-slate-800"><th className="pb-2.5">Session</th><th className="pb-2.5">Landing page</th><th className="pb-2.5">Device</th><th className="pb-2.5">Location</th><th className="pb-2.5">Events</th><th className="pb-2.5">Last active</th></tr></thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {sessions.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/60">
                      <td className="py-2.5 font-mono text-[11px] text-slate-700">{s.beaconSessionId.slice(0, 14)}…</td>
                      <td className="py-2.5 font-mono text-slate-900">{s.landingPage || "/"}</td>
                      <td className="py-2.5 text-slate-500">{s.device || "—"} · {s.browser || "—"}</td>
                      <td className="py-2.5 text-slate-500">{[s.city, s.country].filter(Boolean).join(", ") || "—"}</td>
                      <td className="py-2.5 tabular-nums font-medium">{s._count.events}</td>
                      <td className="py-2.5 text-slate-400">{new Date(s.lastActivityAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {data && data.pagination.totalPages > 1 && (
              <div className="mt-3 flex items-center justify-between text-[12px]">
                <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium disabled:opacity-40">Prev</button>
                <span className="text-slate-400">{page} / {data.pagination.totalPages}</span>
                <button disabled={page >= data.pagination.totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium disabled:opacity-40">Next</button>
              </div>
            )}
          </>
        )}
      </SectionCard>
    </div>
  );
}
