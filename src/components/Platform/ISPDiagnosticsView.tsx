"use client";

import React, { useState } from "react";
import {
  Wifi,
  Globe,
  Radio,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  MapPin,
  ShieldCheck,
  Server,
} from "lucide-react";

interface CarrierData {
  asn: string;
  name: string;
  country: string;
  latencyMs: number;
  reliability: string;
  samples: string;
  status: "optimal" | "good" | "degraded";
  trend: string;
}

const carrierList: CarrierData[] = [
  {
    asn: "AS55836",
    name: "Reliance Jio",
    country: "India",
    latencyMs: 124,
    reliability: "99.9%",
    samples: "42.1k",
    status: "optimal",
    trend: "-18ms vs last week",
  },
  {
    asn: "AS7018",
    name: "AT&T Internet",
    country: "United States",
    latencyMs: 34,
    reliability: "100%",
    samples: "21.0k",
    status: "optimal",
    trend: "-4ms vs last week",
  },
  {
    asn: "AS7922",
    name: "Comcast Xfinity",
    country: "United States",
    latencyMs: 38,
    reliability: "100%",
    samples: "29.2k",
    status: "optimal",
    trend: "-6ms vs last week",
  },
  {
    asn: "AS9498",
    name: "Bharti Airtel",
    country: "India",
    latencyMs: 168,
    reliability: "99.8%",
    samples: "38.4k",
    status: "good",
    trend: "+4ms vs last week",
  },
  {
    asn: "AS3320",
    name: "Deutsche Telekom",
    country: "Germany",
    latencyMs: 42,
    reliability: "99.9%",
    samples: "18.5k",
    status: "optimal",
    trend: "-8ms vs last week",
  },
  {
    asn: "AS9829",
    name: "BSNL Broadband",
    country: "India",
    latencyMs: 1840,
    reliability: "94.1%",
    samples: "8.2k",
    status: "degraded",
    trend: "+620ms peering congestion",
  },
];

const regions = [
  { name: "North America", latency: "28ms", status: "Optimal", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  { name: "Western Europe", latency: "34ms", status: "Optimal", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  { name: "Asia-Pacific", latency: "78ms", status: "Good", color: "text-blue-700 bg-blue-50 border-blue-200" },
  { name: "Latin America", latency: "142ms", status: "Fair", color: "text-amber-700 bg-amber-50 border-amber-200" },
];

export const ISPDiagnosticsView = () => {
  const [selectedCarrier, setSelectedCarrier] = useState<CarrierData>(carrierList[0]);

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
            app.route.dev/isp-diagnostics/carrier-intelligence
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[9.5px] font-semibold text-blue-700 border border-blue-200">
              <Wifi size={10} />
              REAL-USER TELEMETRY
            </span>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-4 sm:p-6 lg:p-7 bg-white">
          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-[#f1f5f9]">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[20px] font-semibold tracking-[-0.03em] text-[#0f172a]">
                  ISP & Network Carrier Diagnostics
                </h3>
                <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-100">
                  Autonomous Edge Enrichment
                </span>
              </div>
              <p className="text-[12px] text-[#64748b]">
                Detect last-mile carrier degradation, BGP peering throttling, and submarine cable anomalies
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-[#64748b]">Telemetry Engine:</span>
              <span className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-2.5 py-1 text-[11px] font-semibold text-[#0f172a]">
                BGP + DNS Resolver
              </span>
            </div>
          </div>

          {/* 5 KPI Metric Cards */}
          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5 sm:gap-3">
            {/* 1. ENRICHED REQUESTS */}
            <div className="rounded-xl border border-[#e2e8f0] bg-white p-3.5 shadow-xs">
              <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#8695a8]">
                EDGE ENRICHED REQS
              </p>
              <div className="mt-1.5 flex items-baseline gap-2">
                <span className="text-[20px] sm:text-[22px] font-bold tracking-tight text-[#0f172a]">
                  149,402
                </span>
                <span className="inline-flex items-center gap-0.5 rounded-full bg-[#ecfdf5] px-1.5 py-0.5 text-[10px] font-semibold text-[#059669]">
                  ↗ 12.0%
                </span>
              </div>
            </div>

            {/* 2. CARRIER MATCH RATE */}
            <div className="rounded-xl border border-[#e2e8f0] bg-white p-3.5 shadow-xs">
              <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#8695a8]">
                CARRIER MATCH RATE
              </p>
              <div className="mt-1.5 flex items-baseline gap-2">
                <span className="text-[20px] sm:text-[22px] font-bold tracking-tight text-[#0f172a]">
                  98.4%
                </span>
                <span className="inline-flex items-center gap-0.5 rounded-full bg-[#ecfdf5] px-1.5 py-0.5 text-[10px] font-semibold text-[#059669]">
                  ↗ 8.4%
                </span>
              </div>
            </div>

            {/* 3. CITIES RESOLVED */}
            <div className="rounded-xl border border-[#e2e8f0] bg-white p-3.5 shadow-xs">
              <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#8695a8]">
                CITIES RESOLVED
              </p>
              <div className="mt-1.5 flex items-baseline gap-2">
                <span className="text-[20px] sm:text-[22px] font-bold tracking-tight text-[#0f172a]">
                  1,284
                </span>
                <span className="inline-flex items-center gap-0.5 rounded-full bg-[#ecfdf5] px-1.5 py-0.5 text-[10px] font-semibold text-[#059669]">
                  ↗ 6.2%
                </span>
              </div>
            </div>

            {/* 4. COUNTRIES MONITORED */}
            <div className="rounded-xl border border-[#e2e8f0] bg-white p-3.5 shadow-xs">
              <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#8695a8]">
                COUNTRIES TAGGED
              </p>
              <div className="mt-1.5 flex items-baseline gap-2">
                <span className="text-[20px] sm:text-[22px] font-bold tracking-tight text-[#0f172a]">
                  86
                </span>
                <span className="inline-flex items-center gap-0.5 rounded-full bg-[#ecfdf5] px-1.5 py-0.5 text-[10px] font-semibold text-[#059669]">
                  ↗ 2.1%
                </span>
              </div>
            </div>

            {/* 5. AVG JITTER */}
            <div className="col-span-2 sm:col-span-1 rounded-xl border border-[#e2e8f0] bg-white p-3.5 shadow-xs">
              <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#8695a8]">
                AVG ROUTE JITTER
              </p>
              <div className="mt-1.5 flex items-baseline gap-2">
                <span className="text-[20px] sm:text-[22px] font-bold tracking-tight text-[#0f172a]">
                  2.4ms
                </span>
                <span className="inline-flex items-center gap-0.5 rounded-full bg-[#ecfdf5] px-1.5 py-0.5 text-[10px] font-semibold text-[#059669]">
                  ↘ -0.8ms
                </span>
              </div>
            </div>
          </div>

          {/* Carrier Diagnostics Matrix */}
          <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Carrier Table (Left 2 cols) */}
            <div className="lg:col-span-2 rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9]">
                <div>
                  <h4 className="text-[13.5px] font-semibold text-[#0f172a]">
                    Major Internet Service Providers (ISPs)
                  </h4>
                  <p className="text-[11px] text-[#64748b]">
                    Live telemetry aggregated from real end-user connections
                  </p>
                </div>
                <span className="text-[10.5px] font-medium text-[#2563eb]">
                  Click to inspect
                </span>
              </div>

              <div className="mt-3 space-y-2">
                {carrierList.map((carrier) => {
                  const isSelected = selectedCarrier.asn === carrier.asn;
                  return (
                    <div
                      key={carrier.asn}
                      onClick={() => setSelectedCarrier(carrier)}
                      className={`flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#2563eb] bg-[#eff6ff]/70 shadow-xs"
                          : "border-[#e2e8f0] bg-[#fafbfc] hover:border-[#cbd5e1] hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white border border-[#e2e8f0] text-[#2563eb]">
                          <Wifi size={13} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[12px] font-semibold text-[#0f172a]">
                              {carrier.name}
                            </span>
                            <span className="font-mono text-[9.5px] text-[#94a3b8]">
                              {carrier.asn}
                            </span>
                          </div>
                          <span className="text-[10.5px] text-[#64748b]">
                            {carrier.country} · {carrier.samples} requests
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span
                            className={`font-mono text-[13px] font-bold ${
                              carrier.status === "degraded"
                                ? "text-[#e11d48]"
                                : carrier.status === "good"
                                ? "text-[#d97706]"
                                : "text-[#059669]"
                            }`}
                          >
                            {carrier.latencyMs >= 1000
                              ? `${(carrier.latencyMs / 1000).toFixed(2)}s`
                              : `${carrier.latencyMs}ms`}
                          </span>
                          <span className="block text-[9.5px] text-[#94a3b8]">
                            {carrier.reliability} uptime
                          </span>
                        </div>

                        <span
                          className={`rounded-full px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-wide border ${
                            carrier.status === "degraded"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : carrier.status === "good"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          {carrier.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Selected Carrier Deep Dive & Region Matrix */}
            <div className="space-y-4">
              {/* Carrier Detail Card */}
              <div className="rounded-xl border border-[#e2e8f0] bg-[#fafbfc] p-4 shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#e2e8f0]">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#8695a8]">
                    CARRIER ROUTING TELEMETRY
                  </span>
                  <span className="font-mono text-[10px] text-[#2563eb] font-semibold">
                    {selectedCarrier.asn}
                  </span>
                </div>

                <div className="mt-3">
                  <h5 className="text-[15px] font-bold text-[#0f172a]">
                    {selectedCarrier.name}
                  </h5>
                  <p className="mt-1 text-[11px] text-[#64748b]">
                    {selectedCarrier.trend}
                  </p>

                  <div className="mt-3 space-y-2 text-[11px]">
                    <div className="flex justify-between py-1 border-b border-[#e2e8f0]/60">
                      <span className="text-[#8695a8]">Average RTT Latency:</span>
                      <span className="font-mono font-bold text-[#0f172a]">
                        {selectedCarrier.latencyMs}ms
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#e2e8f0]/60">
                      <span className="text-[#8695a8]">Edge Handshake Success:</span>
                      <span className="font-mono font-bold text-emerald-700">
                        {selectedCarrier.reliability}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#e2e8f0]/60">
                      <span className="text-[#8695a8]">Root Peering:</span>
                      <span className="font-mono text-[#0f172a]">
                        Tier-1 Transatlantic Anycast
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Geographic Latency Matrix */}
              <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-xs">
                <h5 className="text-[12px] font-semibold text-[#0f172a]">
                  Global Latency by Region
                </h5>
                <div className="mt-2.5 space-y-1.5">
                  {regions.map((reg) => (
                    <div
                      key={reg.name}
                      className="flex items-center justify-between rounded-md bg-[#fafbfc] px-2.5 py-1.5 border border-[#e2e8f0] text-[11px]"
                    >
                      <span className="font-medium text-[#334155]">{reg.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#0f172a]">{reg.latency}</span>
                        <span className={`rounded px-1.5 py-0.2 text-[9.5px] font-semibold border ${reg.color}`}>
                          {reg.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
