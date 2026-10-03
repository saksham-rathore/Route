"use client";

import React from "react";

export const Demo = () => {
  return (
    <section id="demo" className="py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-zinc-200/90 bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
          {/* Dashboard Browser Frame Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200/80 bg-zinc-50/90">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400/90" />
                <span className="w-3 h-3 rounded-full bg-amber-400/90" />
                <span className="w-3 h-3 rounded-full bg-emerald-400/90" />
              </div>
              <span className="ml-3 font-mono text-xs text-zinc-600 flex items-center gap-2">
                <span className="text-zinc-400">https://</span>
                route.dev/dashboard/production
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live · 3,420 events/min
              </span>
            </div>
          </div>

          {/* Dashboard Content Mockup */}
          <div className="p-4 sm:p-6 space-y-6 bg-white">
            {/* Metric Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 rounded-xl bg-zinc-50/80 border border-zinc-200/80">
                <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
                  <span>Unique Visitors</span>
                  <span className="text-emerald-600 font-mono font-semibold">+18.4%</span>
                </div>
                <div className="mt-2 text-2xl font-bold font-mono text-zinc-950">
                  124,890
                </div>
                <div className="mt-1 text-[11px] text-zinc-500">
                  Real browsers worldwide
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50/80 border border-zinc-200/80">
                <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
                  <span>p95 API Latency</span>
                  <span className="text-emerald-600 font-mono font-semibold">-14ms</span>
                </div>
                <div className="mt-2 text-2xl font-bold font-mono text-blue-600">
                  42ms
                </div>
                <div className="mt-1 text-[11px] text-zinc-500">
                  DNS + TLS + TTFB
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50/80 border border-zinc-200/80">
                <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
                  <span>Core Web Vitals</span>
                  <span className="text-emerald-600 font-mono font-semibold">99.2% Good</span>
                </div>
                <div className="mt-2 text-2xl font-bold font-mono text-emerald-600">
                  1.1s <span className="text-xs text-zinc-500">LCP</span>
                </div>
                <div className="mt-1 text-[11px] text-zinc-500">
                  INP: 38ms · CLS: 0.002
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50/80 border border-zinc-200/80">
                <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
                  <span>Client Error Rate</span>
                  <span className="text-emerald-600 font-mono font-semibold">0.01%</span>
                </div>
                <div className="mt-2 text-2xl font-bold font-mono text-indigo-600">
                  0 errors
                </div>
                <div className="mt-1 text-[11px] text-zinc-500">
                  0 unhandled promises
                </div>
              </div>
            </div>

            {/* Live Event Stream & ISP Diagnostics Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Event Stream (2 cols) */}
              <div className="lg:col-span-2 rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-zinc-700 font-bold">
                      Live Event Stream
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-mono font-semibold">
                      Auto-refreshing
                    </span>
                  </div>
                  <span className="font-mono text-xs text-zinc-500">
                    GET /api/analytics/events
                  </span>
                </div>

                <div className="mt-3 divide-y divide-zinc-200/60 font-mono text-xs">
                  <div className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                        API_REQUEST
                      </span>
                      <span className="text-zinc-800 font-medium">/api/v1/checkout</span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-500">
                      <span className="text-emerald-600 font-semibold">200 OK</span>
                      <span className="text-zinc-900 font-bold">32ms</span>
                      <span className="text-zinc-500 text-[11px]">Jio Fiber (IN)</span>
                    </div>
                  </div>

                  <div className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                        PAGE_VIEW
                      </span>
                      <span className="text-zinc-800 font-medium">/pricing</span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-500">
                      <span className="text-zinc-600">Direct</span>
                      <span className="text-zinc-900 font-bold">18ms</span>
                      <span className="text-zinc-500 text-[11px]">Cloudflare (US)</span>
                    </div>
                  </div>

                  <div className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                        WEB_VITAL
                      </span>
                      <span className="text-zinc-800 font-medium">INP: 24ms</span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-500">
                      <span className="text-emerald-600 font-semibold">Good</span>
                      <span className="text-zinc-900 font-bold">FCP 0.6s</span>
                      <span className="text-zinc-500 text-[11px]">Vodafone (UK)</span>
                    </div>
                  </div>

                  <div className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold">
                        SESSION_START
                      </span>
                      <span className="text-zinc-800 font-medium">/docs/installation</span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-500">
                      <span className="text-zinc-600">Google Search</span>
                      <span className="text-zinc-900 font-bold">14ms</span>
                      <span className="text-zinc-500 text-[11px]">Deutsche Tel (DE)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ISP & Telemetry Sidebar (1 col) */}
              <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
                    <span className="font-mono text-xs uppercase tracking-wider text-zinc-700 font-bold">
                      Carrier Latency
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      p95 Timing
                    </span>
                  </div>
                  <div className="mt-3 space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between text-zinc-700 mb-1">
                        <span className="font-medium">Cloudflare Warp</span>
                        <span className="font-mono text-emerald-600 font-bold">14ms</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-zinc-200 overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full w-[24%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-zinc-700 mb-1">
                        <span className="font-medium">Jio Fiber</span>
                        <span className="font-mono text-blue-600 font-bold">24ms</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-zinc-200 overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full w-[38%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-zinc-700 mb-1">
                        <span className="font-medium">Verizon Fios</span>
                        <span className="font-mono text-blue-600 font-bold">31ms</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-zinc-200 overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full w-[45%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-zinc-700 mb-1">
                        <span className="font-medium">Comcast / Xfinity</span>
                        <span className="font-mono text-amber-600 font-bold">54ms</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-zinc-200 overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full w-[70%]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-200 flex items-center justify-between text-[11px] text-zinc-500">
                  <span>Edge Hops Monitored</span>
                  <span className="font-mono text-zinc-950 font-bold">184 ISPs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
