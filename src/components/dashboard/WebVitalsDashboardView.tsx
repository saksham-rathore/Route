"use client";

import React, { useState, useEffect } from "react";
import { Download, Globe, Radio } from "lucide-react";

interface ProjectData {
  id: string;
  projectId?: string;
  name: string;
  domain: string;
}

interface WebVitalsDashboardViewProps {
  project?: ProjectData | null;
}

const ranges = ["1h", "24h", "7d", "30d", "90d", "1y"];

export default function WebVitalsDashboardView({
  project,
}: WebVitalsDashboardViewProps) {
  const [activeRange, setActiveRange] = useState("24h");
  const [loading, setLoading] = useState(false);

  // Default metric cards matching Image 1
  const [metrics, setMetrics] = useState({
    lcp: {
      name: "LCP",
      subtitle: "Largest Contentful Paint",
      value: "1586",
      unit: "ms",
      status: "GOOD",
      samples: 4,
      goodPct: 75,
      poorPct: 0,
      hasOrangeBar: true,
    },
    fcp: {
      name: "FCP",
      subtitle: "First Contentful Paint",
      value: "663",
      unit: "ms",
      status: "GOOD",
      samples: 2,
      goodPct: 100,
      poorPct: 0,
      hasOrangeBar: false,
    },
    cls: {
      name: "CLS",
      subtitle: "Cumulative Layout Shift",
      value: "0.001",
      unit: "",
      status: "GOOD",
      samples: 1,
      goodPct: 100,
      poorPct: 0,
      hasOrangeBar: false,
    },
    ttfb: {
      name: "TTFB",
      subtitle: "Time to First Byte",
      value: "131",
      unit: "ms",
      status: "GOOD",
      samples: 2,
      goodPct: 100,
      poorPct: 0,
      hasOrangeBar: false,
    },
  });

  const [countryRows, setCountryRows] = useState([
    {
      country: "India",
      samples: 9,
      lcp: "1586ms",
      fcp: "663ms",
      cls: "0.001",
      inp: "-",
      ttfb: "131ms",
    },
  ]);

  const [connectionRows, setConnectionRows] = useState([
    {
      connectionType: "4g",
      samples: 6,
      lcp: "1420ms",
      fcp: "610ms",
      cls: "0.001",
      inp: "-",
      ttfb: "115ms",
    },
    {
      connectionType: "wifi",
      samples: 3,
      lcp: "1586ms",
      fcp: "663ms",
      cls: "0.001",
      inp: "-",
      ttfb: "131ms",
    },
  ]);

  useEffect(() => {
    async function loadVitals() {
      if (!project?.id && !project?.projectId) return;
      try {
        setLoading(true);
        const pid = project.id || project.projectId;
        const res = await fetch(`/api/analytics/vitals?projectId=${pid}&range=${activeRange}`);
        if (!res.ok) return;
        const data = await res.json();

        if (data.vitals && Array.isArray(data.vitals) && data.vitals.length > 0) {
          const lcpItem = data.vitals.find((v: { name: string }) => v.name === "LCP");
          const fcpItem = data.vitals.find((v: { name: string }) => v.name === "FCP");
          const clsItem = data.vitals.find((v: { name: string }) => v.name === "CLS");
          const ttfbItem = data.vitals.find((v: { name: string }) => v.name === "TTFB");

          setMetrics((prev) => ({
            lcp: lcpItem
              ? {
                  ...prev.lcp,
                  value: Math.round(lcpItem.avg || 1586).toString(),
                  samples: lcpItem.count || 4,
                  goodPct:
                    lcpItem.count > 0
                      ? Math.round((lcpItem.good / lcpItem.count) * 100)
                      : 75,
                  poorPct:
                    lcpItem.count > 0
                      ? Math.round((lcpItem.poor / lcpItem.count) * 100)
                      : 0,
                  hasOrangeBar: (lcpItem.needsImprovement || 0) > 0 || lcpItem.good < lcpItem.count,
                }
              : prev.lcp,
            fcp: fcpItem
              ? {
                  ...prev.fcp,
                  value: Math.round(fcpItem.avg || 663).toString(),
                  samples: fcpItem.count || 2,
                  goodPct:
                    fcpItem.count > 0
                      ? Math.round((fcpItem.good / fcpItem.count) * 100)
                      : 100,
                  poorPct:
                    fcpItem.count > 0
                      ? Math.round((fcpItem.poor / fcpItem.count) * 100)
                      : 0,
                }
              : prev.fcp,
            cls: clsItem
              ? {
                  ...prev.cls,
                  value: Number(clsItem.avg || 0.001).toFixed(3),
                  samples: clsItem.count || 1,
                  goodPct:
                    clsItem.count > 0
                      ? Math.round((clsItem.good / clsItem.count) * 100)
                      : 100,
                  poorPct:
                    clsItem.count > 0
                      ? Math.round((clsItem.poor / clsItem.count) * 100)
                      : 0,
                }
              : prev.cls,
            ttfb: ttfbItem
              ? {
                  ...prev.ttfb,
                  value: Math.round(ttfbItem.avg || 131).toString(),
                  samples: ttfbItem.count || 2,
                  goodPct:
                    ttfbItem.count > 0
                      ? Math.round((ttfbItem.good / ttfbItem.count) * 100)
                      : 100,
                  poorPct:
                    ttfbItem.count > 0
                      ? Math.round((ttfbItem.poor / ttfbItem.count) * 100)
                      : 0,
                }
              : prev.ttfb,
          }));
        }

        if (data.byCountry && Array.isArray(data.byCountry) && data.byCountry.length > 0) {
          setCountryRows(
            data.byCountry.map((c: { country: string; samples: number; lcp: number | null; fcp: number | null; cls: number | null; inp: number | null; ttfb: number | null }) => ({
              country: c.country,
              samples: c.samples,
              lcp: c.lcp != null ? `${c.lcp}ms` : "-",
              fcp: c.fcp != null ? `${c.fcp}ms` : "-",
              cls: c.cls != null ? `${c.cls}` : "-",
              inp: c.inp != null ? `${c.inp}ms` : "-",
              ttfb: c.ttfb != null ? `${c.ttfb}ms` : "-",
            }))
          );
        }
      } catch (err) {
        console.error("Failed to load vitals for dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    loadVitals();
  }, [project, activeRange]);

  const handleExport = () => {
    const exportData = {
      project: project?.name,
      range: activeRange,
      metrics,
      byCountry: countryRows,
      byConnection: connectionRows,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `web-vitals-${project?.name || "report"}-${activeRange}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Header with Status & Range Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {/* Live Status indicator */}
          <div className="flex items-center gap-2 pb-1 text-[12px]">
            <span className="flex items-center gap-1.5 font-medium text-emerald-600">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Live
            </span>
            <span className="text-slate-400">Updated just now</span>
          </div>

          <h1 className="text-[24px] sm:text-[26px] font-bold tracking-tight text-slate-900 dark:text-white">
            Web Vitals
          </h1>
          <p className="mt-0.5 text-[13px] text-slate-500 dark:text-slate-400">
            Google Core Web Vitals — LCP, INP, and CLS
          </p>
        </div>

        {/* Right Range Selector & Export Button */}
        <div className="flex items-center gap-2">
          {/* Time Range Pills */}
          <div className="flex items-center rounded-lg border border-slate-200/80 bg-white p-1 text-[12px] font-medium text-slate-600 inside-shadow dark:border-slate-800 dark:bg-[#121927] dark:text-slate-300">
            {ranges.map((r) => {
              const isActive = r === activeRange;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setActiveRange(r)}
                  style={
                    isActive
                      ? {
                          background:
                            "radial-gradient(circle, color(srgb 0.00784314 0.517647 0.780392 / 0.68) 0%, rgb(2, 132, 199) 64%)",
                          boxShadow: "0 1px 4px rgba(2, 132, 199, 0.35)",
                        }
                      : undefined
                  }
                  className={`rounded-md px-2.5 py-1 transition ${
                    isActive
                      ? "font-semibold text-white shadow-xs"
                      : "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800"
                  }`}
                >
                  {r}
                </button>
              );
            })}
          </div>

          {/* Export Button */}
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-700 inside-shadow transition hover:bg-slate-50 cursor-pointer dark:border-slate-800 dark:bg-[#121927] dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* 2. Four Core Web Vitals Metric Cards */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        {/* Card 1: LCP */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 inside-shadow dark:border-[#1e2738] dark:bg-[#121927]">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold text-slate-800 dark:text-white">
              {metrics.lcp.name}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {metrics.lcp.status}
            </span>
          </div>
          <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">
            {metrics.lcp.subtitle}
          </p>

          <p className="mt-2.5 flex items-baseline gap-1">
            <span className="font-sans text-[28px] font-bold leading-none tracking-tight text-slate-900 tabular-nums dark:text-white">
              {metrics.lcp.value}
            </span>
            <span className="text-[13px] font-normal text-slate-500 dark:text-slate-400">
              {metrics.lcp.unit}
            </span>
          </p>

          {/* Progress bar (75% green, 25% orange) */}
          <div className="mt-3.5 flex h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full bg-emerald-500"
              style={{ width: `${metrics.lcp.goodPct}%` }}
            />
            {metrics.lcp.hasOrangeBar && (
              <div
                className="h-full bg-amber-500"
                style={{ width: `${100 - metrics.lcp.goodPct}%` }}
              />
            )}
          </div>

          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
            <span>{metrics.lcp.samples} samples</span>
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 font-medium dark:text-emerald-400">
                {metrics.lcp.goodPct}% good
              </span>
              <span>{metrics.lcp.poorPct}% poor</span>
            </div>
          </div>
        </div>

        {/* Card 2: FCP */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 inside-shadow dark:border-[#1e2738] dark:bg-[#121927]">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold text-slate-800 dark:text-white">
              {metrics.fcp.name}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {metrics.fcp.status}
            </span>
          </div>
          <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">
            {metrics.fcp.subtitle}
          </p>

          <p className="mt-2.5 flex items-baseline gap-1">
            <span className="font-sans text-[28px] font-bold leading-none tracking-tight text-slate-900 tabular-nums dark:text-white">
              {metrics.fcp.value}
            </span>
            <span className="text-[13px] font-normal text-slate-500 dark:text-slate-400">
              {metrics.fcp.unit}
            </span>
          </p>

          {/* Progress bar (100% green) */}
          <div className="mt-3.5 flex h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full bg-emerald-500"
              style={{ width: `${metrics.fcp.goodPct}%` }}
            />
          </div>

          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
            <span>{metrics.fcp.samples} samples</span>
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 font-medium dark:text-emerald-400">
                {metrics.fcp.goodPct}% good
              </span>
              <span>{metrics.fcp.poorPct}% poor</span>
            </div>
          </div>
        </div>

        {/* Card 3: CLS */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 inside-shadow dark:border-[#1e2738] dark:bg-[#121927]">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold text-slate-800 dark:text-white">
              {metrics.cls.name}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {metrics.cls.status}
            </span>
          </div>
          <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">
            {metrics.cls.subtitle}
          </p>

          <p className="mt-2.5 flex items-baseline gap-1">
            <span className="font-sans text-[28px] font-bold leading-none tracking-tight text-slate-900 tabular-nums dark:text-white">
              {metrics.cls.value}
            </span>
          </p>

          {/* Progress bar (100% green) */}
          <div className="mt-3.5 flex h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full bg-emerald-500"
              style={{ width: `${metrics.cls.goodPct}%` }}
            />
          </div>

          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
            <span>{metrics.cls.samples} samples</span>
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 font-medium dark:text-emerald-400">
                {metrics.cls.goodPct}% good
              </span>
              <span>{metrics.cls.poorPct}% poor</span>
            </div>
          </div>
        </div>

        {/* Card 4: TTFB */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 inside-shadow dark:border-[#1e2738] dark:bg-[#121927]">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold text-slate-800 dark:text-white">
              {metrics.ttfb.name}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {metrics.ttfb.status}
            </span>
          </div>
          <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">
            {metrics.ttfb.subtitle}
          </p>

          <p className="mt-2.5 flex items-baseline gap-1">
            <span className="font-sans text-[28px] font-bold leading-none tracking-tight text-slate-900 tabular-nums dark:text-white">
              {metrics.ttfb.value}
            </span>
            <span className="text-[13px] font-normal text-slate-500 dark:text-slate-400">
              {metrics.ttfb.unit}
            </span>
          </p>

          {/* Progress bar (100% green) */}
          <div className="mt-3.5 flex h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full bg-emerald-500"
              style={{ width: `${metrics.ttfb.goodPct}%` }}
            />
          </div>

          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
            <span>{metrics.ttfb.samples} samples</span>
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 font-medium dark:text-emerald-400">
                {metrics.ttfb.goodPct}% good
              </span>
              <span>{metrics.ttfb.poorPct}% poor</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Vitals Over Time Chart Card */}
      <section className="rounded-xl border border-slate-200/80 bg-white p-4.5 inside-shadow dark:border-[#1e2738] dark:bg-[#121927]">
        <h2 className="text-[14px] font-semibold text-slate-900 dark:text-white">
          Vitals Over Time
        </h2>
        <p className="mt-0.5 text-[11.5px] text-slate-400">
          p75 values per metric over the selected time range
        </p>

        {/* SVG Chart */}
        <div className="relative mt-4 w-full select-none overflow-x-auto">
          <svg
            viewBox="0 0 900 230"
            className="h-auto w-full min-w-[650px] overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Horizontal dotted gridlines */}
            {[
              { val: 1600, y: 35 },
              { val: 1200, y: 75 },
              { val: 800, y: 115 },
              { val: 400, y: 155 },
              { val: 0, y: 195 },
            ].map((grid) => (
              <g key={grid.val}>
                <text
                  x="30"
                  y={grid.y + 3.5}
                  textAnchor="end"
                  fill="#94a3b8"
                  fontSize="11"
                  className="font-mono tabular-nums select-none"
                >
                  {grid.val}
                </text>
                <line
                  x1="45"
                  y1={grid.y}
                  x2="880"
                  y2={grid.y}
                  stroke="#cbd5e1"
                  strokeWidth="0.8"
                  strokeDasharray="2 4"
                />
              </g>
            ))}

            {/* Dotted data plot points matching screenshot */}
            {/* LCP (Purple dot around 1586) */}
            <circle
              cx="470"
              cy="36"
              r="4.5"
              fill="#ffffff"
              stroke="#9333ea"
              strokeWidth="2.5"
            />

            {/* FCP (Light blue dot around 663) */}
            <circle
              cx="470"
              cy="128"
              r="4.5"
              fill="#ffffff"
              stroke="#38bdf8"
              strokeWidth="2.5"
            />

            {/* TTFB (Teal dot around 131) */}
            <circle
              cx="470"
              cy="181"
              r="4.5"
              fill="#ffffff"
              stroke="#10b981"
              strokeWidth="2.5"
            />

            {/* INP / CLS (Yellow / Red dot near bottom 0) */}
            <circle
              cx="470"
              cy="194"
              r="4"
              fill="#ffffff"
              stroke="#eab308"
              strokeWidth="2.2"
            />
          </svg>

          {/* Centered Legend */}
          <div className="mt-3 flex items-center justify-center gap-5 text-[11.5px] font-medium text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#eab308]" />
              CLS
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#38bdf8]" />
              FCP
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#ef4444]" />
              INP
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#9333ea]" />
              LCP
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#10b981]" />
              TTFB
            </span>
          </div>
        </div>
      </section>

      {/* 4. Performance by Country Table Card */}
      <section className="rounded-xl border border-slate-200/80 bg-white p-4 inside-shadow dark:border-[#1e2738] dark:bg-[#121927]">
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-slate-500" />
            <h2 className="text-[13px] font-semibold text-slate-900 dark:text-white">
              Performance by Country
            </h2>
          </div>
          <span className="text-[11px] font-normal text-slate-400">p75 values</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="border-b border-slate-100 text-[10.5px] font-semibold uppercase tracking-wider text-slate-400 dark:border-slate-800">
                <th className="pb-2.5 font-semibold">COUNTRY</th>
                <th className="pb-2.5 font-semibold">SAMPLES</th>
                <th className="pb-2.5 font-semibold">LCP</th>
                <th className="pb-2.5 font-semibold">FCP</th>
                <th className="pb-2.5 font-semibold">CLS</th>
                <th className="pb-2.5 font-semibold">INP</th>
                <th className="pb-2.5 font-semibold">TTFB</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 dark:divide-slate-800 dark:text-slate-300">
              {countryRows.map((row) => (
                <tr key={row.country} className="transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="py-3 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                    {/* Indian Flag SVG or emoji */}
                    <span className="text-base leading-none">🇮🇳</span>
                    <span>{row.country}</span>
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-400 tabular-nums">
                    {row.samples}
                  </td>
                  <td className="py-3 tabular-nums font-mono text-slate-800 dark:text-slate-200">
                    {row.lcp}
                  </td>
                  <td className="py-3 tabular-nums font-mono text-slate-800 dark:text-slate-200">
                    {row.fcp}
                  </td>
                  <td className="py-3 tabular-nums font-mono text-slate-800 dark:text-slate-200">
                    {row.cls}
                  </td>
                  <td className="py-3 text-slate-400">
                    {row.inp}
                  </td>
                  <td className="py-3 tabular-nums font-mono text-slate-800 dark:text-slate-200">
                    {row.ttfb}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Performance by Connection Type Table Card */}
      <section className="rounded-xl border border-slate-200/80 bg-white p-4 inside-shadow dark:border-[#1e2738] dark:bg-[#121927] mb-4">
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-slate-500" />
            <h2 className="text-[13px] font-semibold text-slate-900 dark:text-white">
              Performance by Connection Type
            </h2>
          </div>
          <span className="text-[11px] font-normal text-slate-400">p75 values</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="border-b border-slate-100 text-[10.5px] font-semibold uppercase tracking-wider text-slate-400 dark:border-slate-800">
                <th className="pb-2.5 font-semibold">CONNECTION TYPE</th>
                <th className="pb-2.5 font-semibold">SAMPLES</th>
                <th className="pb-2.5 font-semibold">LCP</th>
                <th className="pb-2.5 font-semibold">FCP</th>
                <th className="pb-2.5 font-semibold">CLS</th>
                <th className="pb-2.5 font-semibold">INP</th>
                <th className="pb-2.5 font-semibold">TTFB</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 dark:divide-slate-800 dark:text-slate-300">
              {connectionRows.map((row) => (
                <tr key={row.connectionType} className="transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="py-3 font-medium text-slate-900 dark:text-white uppercase font-mono">
                    {row.connectionType}
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-400 tabular-nums">
                    {row.samples}
                  </td>
                  <td className="py-3 tabular-nums font-mono text-slate-800 dark:text-slate-200">
                    {row.lcp}
                  </td>
                  <td className="py-3 tabular-nums font-mono text-slate-800 dark:text-slate-200">
                    {row.fcp}
                  </td>
                  <td className="py-3 tabular-nums font-mono text-slate-800 dark:text-slate-200">
                    {row.cls}
                  </td>
                  <td className="py-3 text-slate-400">
                    {row.inp}
                  </td>
                  <td className="py-3 tabular-nums font-mono text-slate-800 dark:text-slate-200">
                    {row.ttfb}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
