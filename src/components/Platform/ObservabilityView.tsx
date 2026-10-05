"use client";

import React, { useState } from "react";
import {
  Activity,
  Layers,
  AlertTriangle,
  Cpu,
  Clock,
  CheckCircle2,
  Filter,
  RefreshCw,
  Server,
  Zap,
  ChevronRight,
  Database,
  Shield,
  Radio,
  FileCode,
} from "lucide-react";

interface SpanItem {
  id: string;
  name: string;
  service: string;
  durationMs: number;
  offsetPct: number;
  widthPct: number;
  color: string;
  status: "200" | "304" | "success";
  details: {
    region: string;
    runtime: string;
    memory: string;
    tags: string;
  };
}

const traceSpans: SpanItem[] = [
  {
    id: "span-1",
    name: "Edge Anycast Gateway & TLS Handshake",
    service: "edge-gateway",
    durationMs: 6.2,
    offsetPct: 0,
    widthPct: 15,
    color: "#059669",
    status: "200",
    details: {
      region: "iad1 (Ashburn, US)",
      runtime: "Cloudflare Workers / Anycast",
      memory: "12 MB",
      tags: "tls_resumption: true, cipher: TLS_AES_128_GCM_SHA256",
    },
  },
  {
    id: "span-2",
    name: "Route Edge Middleware & Bot Telemetry",
    service: "edge-middleware",
    durationMs: 2.1,
    offsetPct: 15,
    widthPct: 7,
    color: "#0284c7",
    status: "200",
    details: {
      region: "iad1 (Edge PoP)",
      runtime: "V8 Edge Isolate",
      memory: "16 MB",
      tags: "bot_score: 99 (human), ip_reputation: clean",
    },
  },
  {
    id: "span-3",
    name: "Next.js SSR Hydration & Route Ingestion",
    service: "web-runtime",
    durationMs: 14.8,
    offsetPct: 22,
    widthPct: 35,
    color: "#2563eb",
    status: "200",
    details: {
      region: "iad1-compute",
      runtime: "Node.js 20 Serverless",
      memory: "48 MB",
      tags: "rsc_payload: 1.8kb, stream_chunks: 3",
    },
  },
  {
    id: "span-4",
    name: "Database Query: prisma.event.createMany()",
    service: "prisma-postgres",
    durationMs: 11.4,
    offsetPct: 57,
    widthPct: 26,
    color: "#7c3aed",
    status: "200",
    details: {
      region: "us-east-1 (RDS Aurora)",
      runtime: "Prisma v7 pg-driver adapter",
      memory: "Connection pool active (4/20)",
      tags: "query_cost: 0.12, rows_affected: 4",
    },
  },
  {
    id: "span-5",
    name: "Edge Cache Invalidation: redis.publish()",
    service: "edge-cache",
    durationMs: 1.8,
    offsetPct: 83,
    widthPct: 6,
    color: "#d97706",
    status: "200",
    details: {
      region: "global-redis",
      runtime: "Upstash Redis Edge",
      memory: "0.2 MB",
      tags: "channel: telemetry_updates, latency: 1.8ms",
    },
  },
  {
    id: "span-6",
    name: "Brotli Compression & Client Pipe Delivery",
    service: "edge-transport",
    durationMs: 5.9,
    offsetPct: 89,
    widthPct: 11,
    color: "#059669",
    status: "200",
    details: {
      region: "iad1 (Egress)",
      runtime: "Edge Stream Buffer",
      memory: "8 MB",
      tags: "content-encoding: br, bytes: 482",
    },
  },
];

export const ObservabilityView = () => {
  const [selectedSpan, setSelectedSpan] = useState<SpanItem>(traceSpans[2]);
  const [logFilter, setLogFilter] = useState<"all" | "errors" | "slow">("all");
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);

  return (
    <div className="w-full font-instrument-sans text-[#0f172a]">
      {/* Outer Mock Frame */}
      <div className="overflow-hidden rounded-[16px] border border-[#d8e0ea] bg-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),inset_0_2px_6px_0_rgba(15,23,42,0.04),0_12px_40px_-10px_rgba(15,23,42,0.06)]">
        {/* Top Browser Bar */}
        <div className="flex h-10 items-center justify-between border-b border-[#e2e8f0] bg-[#f8fafc] px-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#cbd5e1]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#cbd5e1]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#cbd5e1]" />
          </div>

          <div className="flex h-6 items-center rounded-md border border-[#e2e8f0] bg-white px-3 text-[10px] text-[#64748b]">
            <span className="text-[#94a3b8] mr-1">https://</span>
            app.route.dev/observability/distributed-traces
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsLiveStreaming(!isLiveStreaming)}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[9.5px] font-semibold text-emerald-700 border border-emerald-200"
            >
              <span className={`h-1.5 w-1.5 rounded-full bg-emerald-600 ${isLiveStreaming ? "animate-ping" : ""}`} />
              {isLiveStreaming ? "LIVE TRACES (142/s)" : "PAUSED"}
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-3.5 sm:p-5 lg:p-5.5 bg-white">
          {/* Header */}
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between pb-3.5 border-b border-[#f1f5f9]">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[18px] font-semibold tracking-[-0.03em] text-[#0f172a]">
                  Observability & Distributed Traces
                </h3>
                <span className="rounded-md bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-700 border border-sky-100">
                  Zero Overhead
                </span>
              </div>
              <p className="text-[11.5px] text-[#64748b]">
                Real-time edge execution waterfall, cold start detection, and error telemetry
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10.5px] font-medium text-[#64748b]">Environment:</span>
              <span className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-2.5 py-0.8 text-[10.5px] font-semibold text-[#0f172a]">
                Production (Global Edge)
              </span>
            </div>
          </div>

          {/* 5 KPI Metric Cards */}
          <div className="mt-3.5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5 sm:gap-2.5">
            {/* 1. P95 LATENCY */}
            <div className="rounded-xl border border-[#e2e8f0] bg-white p-2.5 sm:p-3 shadow-xs">
              <p className="text-[9.5px] font-semibold uppercase tracking-[0.06em] text-[#8695a8]">
                P95 LATENCY
              </p>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-[18px] sm:text-[20px] font-bold tracking-tight text-[#0f172a]">
                  42.2ms
                </span>
                <span className="inline-flex items-center gap-0.5 rounded-full bg-[#ecfdf5] px-1 py-0.2 text-[9.5px] font-semibold text-[#059669]">
                  ↘ -14ms
                </span>
              </div>
            </div>

            {/* 2. ERROR RATE */}
            <div className="rounded-xl border border-[#e2e8f0] bg-white p-3.5 shadow-xs">
              <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#8695a8]">
                EDGE ERROR RATE
              </p>
              <div className="mt-1.5 flex items-baseline gap-2">
                <span className="text-[20px] sm:text-[22px] font-bold tracking-tight text-[#0f172a]">
                  0.012%
                </span>
                <span className="inline-flex items-center gap-0.5 rounded-full bg-[#ecfdf5] px-1.5 py-0.5 text-[10px] font-semibold text-[#059669]">
                  ↘ -0.04%
                </span>
              </div>
            </div>

            {/* 3. ACTIVE TRACES */}
            <div className="rounded-xl border border-[#e2e8f0] bg-white p-3.5 shadow-xs">
              <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#8695a8]">
                INGESTED TRACES
              </p>
              <div className="mt-1.5 flex items-baseline gap-2">
                <span className="text-[20px] sm:text-[22px] font-bold tracking-tight text-[#0f172a]">
                  1.42M
                </span>
                <span className="inline-flex items-center gap-0.5 rounded-full bg-[#ecfdf5] px-1.5 py-0.5 text-[10px] font-semibold text-[#059669]">
                  ↗ +8.2%
                </span>
              </div>
            </div>

            {/* 4. EDGE EXECUTION */}
            <div className="rounded-xl border border-[#e2e8f0] bg-white p-3.5 shadow-xs">
              <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#8695a8]">
                COLD STARTS
              </p>
              <div className="mt-1.5 flex items-baseline gap-2">
                <span className="text-[20px] sm:text-[22px] font-bold tracking-tight text-[#0f172a]">
                  0.00%
                </span>
                <span className="inline-flex items-center gap-0.5 rounded-full bg-[#ecfdf5] px-1.5 py-0.5 text-[10px] font-semibold text-[#059669]">
                  Instant
                </span>
              </div>
            </div>

            {/* 5. UPTIME SLA */}
            <div className="col-span-2 sm:col-span-1 rounded-xl border border-[#e2e8f0] bg-white p-3.5 shadow-xs">
              <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#8695a8]">
                UPTIME HEALTH
              </p>
              <div className="mt-1.5 flex items-baseline gap-2">
                <span className="text-[20px] sm:text-[22px] font-bold tracking-tight text-[#0f172a]">
                  99.994%
                </span>
                <span className="inline-flex items-center gap-0.5 rounded-full bg-[#ecfdf5] px-1.5 py-0.5 text-[10px] font-semibold text-[#059669]">
                  Optimal
                </span>
              </div>
            </div>
          </div>

          {/* Trace Waterfall Explorer */}
          <div className="mt-5 rounded-xl border border-[#e2e8f0] bg-white p-4 sm:p-5 shadow-xs">
            {/* Trace Title Bar */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-[#f1f5f9]">
              <div className="flex items-center gap-2.5">
                <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold font-mono text-emerald-800">
                  200 OK
                </span>
                <span className="font-mono text-[12px] font-bold text-[#0f172a]">
                  POST /api/telemetry/collect
                </span>
                <span className="text-[11px] text-[#94a3b8]">· Trace ID: rt_94f820c78a</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-medium text-[#64748b]">
                <span>Total Duration:</span>
                <span className="font-bold text-[#2563eb] text-[13px]">42.2ms</span>
              </div>
            </div>

            {/* Waterfall Diagram */}
            <div className="mt-4 space-y-2">
              {traceSpans.map((span) => {
                const isSelected = selectedSpan?.id === span.id;
                return (
                  <div
                    key={span.id}
                    onClick={() => setSelectedSpan(span)}
                    className={`group relative flex flex-col sm:flex-row sm:items-center justify-between rounded-lg p-2.5 transition-all cursor-pointer border ${
                      isSelected
                        ? "border-[#2563eb] bg-[#eff6ff]/60 shadow-xs"
                        : "border-transparent bg-[#f8fafc] hover:bg-slate-100"
                    }`}
                  >
                    {/* Span Name */}
                    <div className="w-full sm:w-[260px] shrink-0 text-[11.5px] font-medium text-[#1e293b]">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: span.color }}
                        />
                        <span className="truncate">{span.name}</span>
                      </div>
                      <span className="text-[10px] text-[#94a3b8] ml-4 font-mono">
                        {span.service}
                      </span>
                    </div>

                    {/* Visual Timeline Bar */}
                    <div className="mt-2 sm:mt-0 relative flex-1 h-5 mx-2 bg-[#e2e8f0]/50 rounded overflow-hidden">
                      <div
                        className="absolute h-full rounded transition-all duration-300"
                        style={{
                          left: `${span.offsetPct}%`,
                          width: `${Math.max(span.widthPct, 4)}%`,
                          backgroundColor: span.color,
                        }}
                      />
                    </div>

                    {/* Span Duration */}
                    <div className="w-16 text-right font-mono text-[11px] font-semibold text-[#0f172a] shrink-0">
                      {span.durationMs}ms
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Span Inspector Panel */}
            {selectedSpan && (
              <div className="mt-4 rounded-lg border border-[#cbd5e1] bg-[#f8fafc] p-3.5 text-[11px]">
                <div className="flex items-center justify-between pb-2 border-b border-[#e2e8f0]">
                  <div className="flex items-center gap-2">
                    <Layers size={13} className="text-[#2563eb]" />
                    <span className="font-semibold text-[#0f172a]">
                      Span Details: {selectedSpan.name}
                    </span>
                  </div>
                  <span className="font-mono text-[#2563eb] font-bold">
                    {selectedSpan.durationMs}ms duration
                  </span>
                </div>
                <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[10.5px]">
                  <div>
                    <span className="text-[#8695a8] uppercase text-[9px] font-semibold block">
                      REGION & POP
                    </span>
                    <span className="font-medium text-[#1e293b]">
                      {selectedSpan.details.region}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8695a8] uppercase text-[9px] font-semibold block">
                      RUNTIME ENGINE
                    </span>
                    <span className="font-medium text-[#1e293b]">
                      {selectedSpan.details.runtime}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8695a8] uppercase text-[9px] font-semibold block">
                      MEMORY PROFILE
                    </span>
                    <span className="font-medium text-[#1e293b]">
                      {selectedSpan.details.memory}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8695a8] uppercase text-[9px] font-semibold block">
                      DIAGNOSTIC TAGS
                    </span>
                    <span className="font-mono text-[#475569] truncate block">
                      {selectedSpan.details.tags}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Live Edge Log Stream */}
          <div className="mt-4 rounded-xl border border-[#e2e8f0] bg-[#fafbfc] p-3.5">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#e2e8f0]">
              <div className="flex items-center gap-2 text-[11px] font-semibold text-[#0f172a]">
                <Activity size={12} className="text-[#0284c7]" />
                <span>Live Edge Request Stream</span>
              </div>
              <div className="flex items-center gap-1 text-[10px]">
                {(["all", "errors", "slow"] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setLogFilter(filter)}
                    className={`rounded px-2 py-0.5 uppercase tracking-wider font-semibold transition-colors ${
                      logFilter === filter
                        ? "bg-[#2563eb] text-white"
                        : "bg-white text-[#64748b] hover:text-[#0f172a] border border-[#e2e8f0]"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-2.5 space-y-1.5 font-mono text-[10.5px]">
              {[
                { status: "200", method: "POST", path: "/api/telemetry/collect", time: "14ms", pop: "iad1", isp: "Jio Fiber", timeAgo: "1s ago" },
                { status: "200", method: "GET", path: "/pricing", time: "22ms", pop: "fra1", isp: "Deutsche Telekom", timeAgo: "3s ago" },
                { status: "304", method: "GET", path: "/_next/static/chunks/main.js", time: "4ms", pop: "sin1", isp: "Singtel", timeAgo: "4s ago" },
                { status: "200", method: "POST", path: "/api/events/batch", time: "29ms", pop: "iad1", isp: "Comcast Xfinity", timeAgo: "6s ago" },
              ].map((log, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded bg-white px-2.5 py-1.5 border border-[#e2e8f0] shadow-2xs hover:border-[#cbd5e1]"
                >
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[9px] font-bold text-emerald-800">
                      {log.status}
                    </span>
                    <span className="text-[#64748b]">{log.method}</span>
                    <span className="font-semibold text-[#0f172a]">{log.path}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#64748b]">
                    <span className="hidden sm:inline text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded text-[9.5px]">
                      {log.pop} · {log.isp}
                    </span>
                    <span className="font-semibold text-[#2563eb]">{log.time}</span>
                    <span className="text-[9.5px] text-[#94a3b8]">{log.timeAgo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
