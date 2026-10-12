"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DashboardRangePills } from "./DashboardPanels";
import { EmptyState, SectionCard, buildQuery, useAnalytics, type RangeKey } from "./shared";

interface Props { projectId?: string | null; range: RangeKey; onRangeChange: (r: RangeKey) => void }
interface MapResp { success: boolean; totals: { visitors: number; sessions: number }; countries: { country: string; visitors: number; sessions: number; pageviews: number; errors: number }[]; cities: { city: string; country: string; visitors: number; sessions: number }[] }

const COLORS = ["#0284c7", "#0d9488", "#7c3aed", "#e11d48", "#ea580c", "#16a34a", "#0891b2", "#4f46e5"];

export default function GlobalMapView({ projectId, range, onRangeChange }: Props) {
  const url = projectId ? `/api/analytics/map${buildQuery(projectId, range)}` : null;
  const { data, loading } = useAnalytics<MapResp>(url, { live: true });
  const [tab, setTab] = useState<"countries" | "cities">("countries");

  const rows = tab === "countries" ? (data?.countries ?? []) : (data?.cities ?? []).map((c) => ({ ...c, country: `${c.city} (${c.country})` }));
  const max = Math.max(1, ...rows.map((r) => r.visitors));

  return (
    <div className="flex flex-col gap-3.5 pb-4">
      <div className="flex items-center justify-between pt-0.5">
        <h1 className="flex items-center gap-2 text-[15px] font-semibold text-slate-900 dark:text-white"><span className="h-2 w-2 rounded-full bg-[#0284c7]" />Global Map</h1>
        <DashboardRangePills value={range} onChange={onRangeChange} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 inside-shadow dark:border-[#1e2738] dark:bg-[#121927]">
          <p className="text-[10px] font-semibold tracking-[0.08em] text-slate-400">VISITORS</p>
          <p className="mt-1 text-[26px] font-bold tabular-nums text-slate-900 dark:text-white">{loading ? "—" : (data?.totals.visitors ?? 0).toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 inside-shadow dark:border-[#1e2738] dark:bg-[#121927]">
          <p className="text-[10px] font-semibold tracking-[0.08em] text-slate-400">SESSIONS</p>
          <p className="mt-1 text-[26px] font-bold tabular-nums text-slate-900 dark:text-white">{loading ? "—" : (data?.totals.sessions ?? 0).toLocaleString()}</p>
        </div>
      </div>

      {!loading && rows.length === 0 ? (
        <EmptyState title="No geographic data yet" hint="Country/city is captured from every beacon ping once traffic flows." />
      ) : (
        <>
          <SectionCard
            title={tab === "countries" ? "Visitors by Country" : "Visitors by City"}
            subtitle="Ranked distribution for the selected range"
            right={<div className="flex gap-1 rounded-lg bg-slate-100 p-1 text-[11px] font-medium">{(["countries", "cities"] as const).map((t) => (<button key={t} onClick={() => setTab(t)} className={`rounded-md px-2.5 py-1 capitalize ${tab === t ? "bg-white shadow font-semibold text-slate-900" : "text-slate-500"}`}>{t}</button>))}</div>}
          >
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rows.slice(0, 12)} layout="vertical" margin={{ top: 4, right: 12, bottom: 4, left: 8 }}>
                  <CartesianGrid stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="country" width={130} tick={{ fontSize: 11, fill: "#334155" }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: 8, fontSize: 11, color: "#fff", border: "1px solid #1e293b" }} />
                  <Bar dataKey="visitors" radius={[0, 6, 6, 0]} barSize={14}>
                    {rows.slice(0, 12).map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          <SectionCard title="Breakdown table" subtitle={`${rows.length} locations`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12px]">
                <thead><tr className="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400 dark:border-slate-800"><th className="pb-2.5">Location</th><th className="pb-2.5">Visitors</th><th className="pb-2.5">Sessions</th><th className="pb-2.5">Share</th></tr></thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {rows.map((r) => (
                    <tr key={r.country}>
                      <td className="py-2.5 font-medium text-slate-900 dark:text-white">{r.country}</td>
                      <td className="py-2.5 tabular-nums">{r.visitors.toLocaleString()}</td>
                      <td className="py-2.5 tabular-nums text-slate-500">{r.sessions.toLocaleString()}</td>
                      <td className="py-2.5 w-[180px]"><div className="flex items-center gap-2"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#0284c7]" style={{ width: `${Math.round((r.visitors / max) * 100)}%` }} /></div><span className="text-[11px] tabular-nums text-slate-500">{Math.round((r.visitors / max) * 100)}%</span></div></td>
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
