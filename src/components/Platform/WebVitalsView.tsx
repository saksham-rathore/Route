"use client";

import React, { useState } from "react";
import {
  Gauge,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Monitor,
  Tablet,
  Sparkles,
  ArrowUpRight,
  TrendingDown,
  Layers,
  HelpCircle,
} from "lucide-react";

interface VitalMetric {
  name: string;
  acronym: string;
  value: string;
  unit: string;
  threshold: string;
  goodPct: number;
  needsImpPct: number;
  poorPct: number;
  status: "good" | "needs-improvement" | "poor";
  attribution: string;
  description: string;
}

const vitalsData: VitalMetric[] = [
  {
    name: "Largest Contentful Paint",
    acronym: "LCP",
    value: "1.42",
    unit: "s",
    threshold: "Target < 2.5s",
    goodPct: 94.8,
    needsImpPct: 4.1,
    poorPct: 1.1,
    status: "good",
    attribution: "Hero cover image: img.hero-banner.avif (48kb)",
    description: "Measures visual perceived loading speed of main content block.",
  },
  {
    name: "Interaction to Next Paint",
    acronym: "INP",
    value: "78",
    unit: "ms",
    threshold: "Target < 200ms",
    goodPct: 97.2,
    needsImpPct: 2.3,
    poorPct: 0.5,
    status: "good",
    attribution: "Checkout button click: button#cta-start (12ms input delay)",
    description: "Measures overall responsiveness to all user clicks and key presses.",
  },
  {
    name: "Cumulative Layout Shift",
    acronym: "CLS",
    value: "0.018",
    unit: "",
    threshold: "Target < 0.10",
    goodPct: 98.9,
    needsImpPct: 0.9,
    poorPct: 0.2,
    status: "good",
    attribution: "Font size-adjust fallback prevents layout reflows",
    description: "Measures visual layout stability and unwanted element jumping.",
  },
  {
    name: "First Contentful Paint",
    acronym: "FCP",
    value: "0.78",
    unit: "s",
    threshold: "Target < 1.8s",
    goodPct: 96.4,
    needsImpPct: 2.8,
    poorPct: 0.8,
    status: "good",
    attribution: "Critical inline CSS & HTTP/3 server push",
    description: "Measures time from navigation start to first rendered DOM pixel.",
  },
  {
    name: "Time to First Byte",
    acronym: "TTFB",
    value: "112",
    unit: "ms",
    threshold: "Target < 800ms",
    goodPct: 99.1,
    needsImpPct: 0.7,
    poorPct: 0.2,
    status: "good",
    attribution: "Edge worker cache hit at nearest PoP",
    description: "Measures network latency and backend server response readiness.",
  },
];

export const WebVitalsView = () => {
  const [selectedVital, setSelectedVital] = useState<VitalMetric>(vitalsData[0]);

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
            app.route.dev/web-vitals/field-measurements
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[9.5px] font-semibold text-emerald-700 border border-emerald-200">
              <CheckCircle2 size={10} />
              CWV ASSESSMENT: PASSED
            </span>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-4 sm:p-6 lg:p-7 bg-white">
          {/* Header Banner */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-[#f1f5f9]">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[20px] font-semibold tracking-[-0.03em] text-[#0f172a]">
                  Core Web Vitals Field Data
                </h3>
                <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                  Google Search Qualified
                </span>
              </div>
              <p className="text-[12px] text-[#64748b]">
                Real Chrome & Safari user 75th percentile (p75) field measurements directly in production
              </p>
            </div>

            {/* Score Pill */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/70 px-3.5 py-2">
                <div className="text-right">
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-emerald-800">
                    PERFORMANCE SCORE
                  </span>
                  <span className="text-[20px] font-bold text-emerald-900 leading-tight">
                    98 <span className="text-[12px] font-normal text-emerald-700">/ 100</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 5 Web Vitals Metric Cards */}
          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5 sm:gap-3">
            {vitalsData.map((vital) => {
              const isSelected = selectedVital.acronym === vital.acronym;
              return (
                <div
                  key={vital.acronym}
                  onClick={() => setSelectedVital(vital)}
                  className={`rounded-xl border p-3.5 transition-all cursor-pointer ${
                    isSelected
                      ? "border-[#2563eb] bg-[#eff6ff]/70 shadow-xs ring-1 ring-[#2563eb]/20"
                      : "border-[#e2e8f0] bg-white hover:border-[#cbd5e1] hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#2563eb]">
                      {vital.acronym}
                    </span>
                    <span className="rounded bg-emerald-50 px-1.5 py-0.2 text-[9px] font-bold text-emerald-700">
                      Good
                    </span>
                  </div>

                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-[22px] font-bold tracking-tight text-[#0f172a]">
                      {vital.value}
                    </span>
                    <span className="text-[12px] font-medium text-[#64748b]">
                      {vital.unit}
                    </span>
                  </div>

                  <p className="mt-0.5 text-[9.5px] text-[#8695a8]">
                    {vital.threshold}
                  </p>

                  {/* Multi-segment progress bar */}
                  <div className="mt-2.5 flex h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="bg-emerald-500 h-full"
                      style={{ width: `${vital.goodPct}%` }}
                    />
                    <div
                      className="bg-amber-400 h-full"
                      style={{ width: `${vital.needsImpPct}%` }}
                    />
                    <div
                      className="bg-rose-500 h-full"
                      style={{ width: `${vital.poorPct}%` }}
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-[9px] text-[#94a3b8] font-mono">
                    <span>{vital.goodPct}% passing</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Deep-dive Attribution & Device Segments */}
          <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left: Selected Vital Deep Dive (2 cols) */}
            <div className="lg:col-span-2 rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9]">
                <div>
                  <h4 className="text-[14px] font-semibold text-[#0f172a]">
                    Diagnostic Attribution: {selectedVital.name} ({selectedVital.acronym})
                  </h4>
                  <p className="text-[11px] text-[#64748b]">
                    {selectedVital.description}
                  </p>
                </div>
                <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-[#2563eb]">
                  Field Aggregated
                </span>
              </div>

              {/* Attribution Callout */}
              <div className="mt-3.5 rounded-lg border border-[#e2e8f0] bg-[#fafbfc] p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8695a8] block">
                  PRIMARY ELEMENT IMPACT
                </span>
                <p className="mt-1 font-mono text-[11.5px] font-semibold text-[#0f172a]">
                  {selectedVital.attribution}
                </p>
              </div>

              {/* Distribution Histogram Breakdown */}
              <div className="mt-4">
                <span className="text-[11px] font-semibold text-[#0f172a] block">
                  Experience Distribution across Real Sessions
                </span>
                <div className="mt-2 space-y-2 text-[11px]">
                  <div>
                    <div className="flex justify-between text-[10.5px] mb-1">
                      <span className="text-emerald-700 font-semibold">Good ({selectedVital.goodPct}%)</span>
                      <span className="text-[#64748b]">{selectedVital.threshold}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#f1f5f9] overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${selectedVital.goodPct}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10.5px] mb-1">
                      <span className="text-amber-700 font-semibold">Needs Improvement ({selectedVital.needsImpPct}%)</span>
                      <span className="text-[#64748b]">Slightly delayed</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#f1f5f9] overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${selectedVital.needsImpPct}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10.5px] mb-1">
                      <span className="text-rose-700 font-semibold">Poor ({selectedVital.poorPct}%)</span>
                      <span className="text-[#64748b]">Frustrating</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#f1f5f9] overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: `${selectedVital.poorPct}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Device Experience Segment Matrix */}
            <div className="rounded-xl border border-[#e2e8f0] bg-[#fafbfc] p-4 shadow-xs">
              <h5 className="text-[12.5px] font-semibold text-[#0f172a]">
                Device Experience Segments
              </h5>
              <p className="text-[10.5px] text-[#64748b] mt-0.5">
                Breakdown by hardware capacity and connection
              </p>

              <div className="mt-3.5 space-y-2.5">
                {[
                  { device: "Desktop (Fiber / Cable)", icon: Monitor, lcp: "1.02s", inp: "38ms", pass: "99.2%" },
                  { device: "Mobile (High-tier 5G)", icon: Smartphone, lcp: "1.34s", inp: "62ms", pass: "96.4%" },
                  { device: "Mobile (Low-tier 4G)", icon: Smartphone, lcp: "1.92s", inp: "94ms", pass: "89.8%" },
                  { device: "Tablet Devices", icon: Tablet, lcp: "1.28s", inp: "55ms", pass: "97.1%" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.device}
                      className="rounded-lg border border-[#e2e8f0] bg-white p-2.5 shadow-2xs"
                    >
                      <div className="flex items-center justify-between text-[11px] font-medium text-[#1e293b]">
                        <span className="flex items-center gap-1.5">
                          <Icon size={12} className="text-[#2563eb]" />
                          <span>{item.device}</span>
                        </span>
                        <span className="text-emerald-700 font-bold">{item.pass}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[10px] text-[#64748b] font-mono">
                        <span>LCP: {item.lcp}</span>
                        <span>INP: {item.inp}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
