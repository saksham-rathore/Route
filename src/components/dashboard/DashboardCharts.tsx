"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface SeriesPoint {
  time: string;
  requests?: number;
  cumulative?: number;
  p50?: number;
  p95?: number;
  p99?: number;
  errors?: number;
  delta?: number;
  up?: number;
  down?: number;
}

const tooltipStyle = {
  backgroundColor: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: 8,
  fontSize: 11,
  color: "#fff",
} as const;

export function LatencyDistributionChart({ data }: { data: SeriesPoint[] }) {
  const rows = data?.length ? data : [{ time: "—", p50: 0, p95: 0, p99: 0 }];
  return (
    <div className="mt-2 h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
          <CartesianGrid stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} tickFormatter={(v: number) => `${v}ms`} />
          <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#cbd5e1" }} />
          <Area type="monotone" dataKey="p99" stroke="#e11d48" fill="#e11d48" fillOpacity={0.06} strokeWidth={1.6} dot={false} />
          <Area type="monotone" dataKey="p95" stroke="#0284c7" fill="#0284c7" fillOpacity={0.09} strokeWidth={1.6} dot={false} />
          <Area type="monotone" dataKey="p50" stroke="#0f172a" fill="#0f172a" fillOpacity={0.04} strokeWidth={1.6} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CumulativeRequestsChart({ data }: { data: SeriesPoint[] }) {
  const rows = data?.length ? data : [{ time: "—", cumulative: 0 }];
  return (
    <div className="mt-2 h-[190px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
          <CartesianGrid stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#cbd5e1" }} />
          <Area type="monotone" dataKey="cumulative" name="Cumulative" stroke="#0284c7" fill="#0284c7" fillOpacity={0.12} strokeWidth={1.8} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RequestDeltaChart({ data }: { data: SeriesPoint[] }) {
  const rows: SeriesPoint[] = data?.length
    ? data.map((d) => ({ time: d.time, delta: d.delta ?? (d.requests ?? 0), up: d.up ?? 0, down: d.down ?? 0 }))
    : [{ time: "—", delta: 0, up: 0, down: 0 }];
  return (
    <div className="mt-2 h-[190px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#cbd5e1" }} cursor={{ fill: "#f8fafc" }} />
          <ReferenceLine y={0} stroke="#e2e8f0" />
          <Bar dataKey="delta" radius={[2, 2, 2, 2]} barSize={10}>
            {rows.map((r, i) => (
              <Cell key={i} fill={(r.delta ?? 0) >= 0 ? "#0d9488" : "#e11d48"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RequestsOverTimeChart({ data }: { data: SeriesPoint[] }) {
  const rows = data?.length ? data : [{ time: "—", requests: 0, errors: 0 }];
  return (
    <div className="mt-2 h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
          <CartesianGrid stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#cbd5e1" }} />
          <Area type="monotone" dataKey="requests" name="Requests" stroke="#0284c7" fill="#0284c7" fillOpacity={0.12} strokeWidth={1.8} dot={false} />
          <Area type="monotone" dataKey="errors" name="Errors" stroke="#e11d48" fill="#e11d48" fillOpacity={0.08} strokeWidth={1.4} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
