"use client";

import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Globe2,
  Users,
  MousePointer2,
  Compass,
  Laptop,
  Share2,
  Bell,
  History,
  Activity,
  Settings,
  Plus,
  Search,
  Download,
  Terminal,
  Check,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface DataPoint {
  date: string;
  current: number;
  previous: number;
  x: number;
  yTop: number;
  yBot: number;
}

const chartPoints: DataPoint[] = [
  { date: "Apr 15", current: 4320, previous: 3800, x: 40, yTop: 54, yBot: 68 },
  { date: "Apr 19", current: 4890, previous: 4120, x: 120, yTop: 45, yBot: 62 },
  { date: "Apr 23", current: 4580, previous: 4310, x: 200, yTop: 50, yBot: 59 },
  { date: "Apr 27", current: 5210, previous: 4420, x: 280, yTop: 39, yBot: 57 },
  { date: "May 01", current: 5490, previous: 4680, x: 360, yTop: 35, yBot: 53 },
  { date: "May 05", current: 5120, previous: 4790, x: 440, yTop: 41, yBot: 51 },
  { date: "May 09", current: 5890, previous: 4920, x: 520, yTop: 29, yBot: 49 },
  { date: "May 13", current: 5640, previous: 5080, x: 600, yTop: 33, yBot: 46 },
  { date: "May 17", current: 6240, previous: 5150, x: 680, yTop: 24, yBot: 45 },
];

export const UserAnalyticsView = () => {
  const [timeframe, setTimeframe] = useState<"24H" | "7D" | "30D">("30D");
  const [activeBottomTab, setActiveBottomTab] = useState<"pages" | "acquisition">("pages");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [apiReportCopied, setApiReportCopied] = useState(false);

  const activePoint = hoveredIdx !== null ? chartPoints[hoveredIdx] : null;

  const handleCopyApi = () => {
    navigator.clipboard?.writeText(
      'curl -X GET "https://api.route.dev/v1/analytics/report?range=30d" \\\n  -H "Authorization: Bearer rt_live_948f2a1b"'
    );
    setApiReportCopied(true);
    setTimeout(() => setApiReportCopied(false), 2200);
  };

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
            app.route.dev/analytics/user-behavior
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[9.5px] font-semibold text-blue-700">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
              DEMO DATA
            </span>
          </div>
        </div>

        {/* Dashboard Shell: Sidebar + Content */}
        <div className="flex min-h-[460px]">
          {/* Left Sidebar */}
          <aside className="hidden w-[185px] shrink-0 border-r border-[#e2e8f0] bg-[#fafbfc] p-3 lg:flex lg:flex-col lg:justify-between">
            <div>
              {/* Logo */}
              <div className="flex items-center justify-between px-1.5 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex h-5.5 w-5.5 items-center justify-center rounded-md bg-[#2563eb] text-white">
                    <BarChart3 size={12} strokeWidth={2.5} />
                  </div>
                  <span className="font-semibold text-[13.5px] tracking-tight text-[#0f172a]">
                    Dash
                  </span>
                </div>
              </div>

              {/* Add Project Button */}
              <button
                type="button"
                className="mt-0.5 flex w-full items-center justify-between rounded-lg border border-[#e2e8f0] bg-white px-2.5 py-1 text-[10.5px] font-medium text-[#334155] shadow-xs transition-colors hover:border-[#cbd5e1] hover:bg-[#f8fafc]"
              >
                <span className="flex items-center gap-1.5">
                  <Plus size={11} className="text-[#2563eb]" />
                  <span>Add Project</span>
                </span>
                <span className="text-[9.5px] text-[#94a3b8]">⌘N</span>
              </button>

              {/* Search Bar */}
              <div className="mt-2 flex items-center justify-between rounded-lg border border-[#e2e8f0] bg-white px-2.5 py-1 text-[10px] text-[#94a3b8]">
                <span className="flex items-center gap-1.5">
                  <Search size={10} />
                  <span>Search</span>
                </span>
                <kbd className="rounded bg-[#f1f5f9] px-1 py-0.2 text-[8.5px] font-mono text-[#64748b]">
                  Ctrl+K
                </kbd>
              </div>

              {/* Navigation Menu */}
              <div className="mt-3">
                <p className="px-2 text-[8.5px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">
                  MAIN PAGES
                </p>
                <div className="mt-1 space-y-0.5 text-[10.5px]">
                  {[
                    { label: "Overview", icon: BarChart3, active: true },
                    { label: "Realtime", icon: Activity, active: false },
                    { label: "Visits & Sources", icon: Globe2, active: false },
                    { label: "Journeys", icon: Compass, active: false },
                    { label: "Geography", icon: Globe2, active: false },
                    { label: "Devices & Browsers", icon: Laptop, active: false },
                    { label: "Referrers & UTM", icon: Share2, active: false },
                    { label: "Leads & Conversions", icon: Users, active: false },
                    { label: "Public badge", icon: Sparkles, active: false },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className={`flex items-center gap-2 rounded-md px-2 py-1 font-medium transition-colors cursor-pointer ${
                          item.active
                            ? "bg-[#eff6ff] font-semibold text-[#2563eb]"
                            : "text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a]"
                        }`}
                      >
                        <Icon size={11.5} strokeWidth={item.active ? 2.5 : 2} />
                        <span className="truncate">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-3">
                <p className="px-2 text-[8.5px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">
                  CONFIGURATION
                </p>
                <div className="mt-1 space-y-0.5 text-[10.5px] text-[#64748b]">
                  {[
                    { label: "Alerts", icon: Bell },
                    { label: "Alert history", icon: History },
                    { label: "Status Page", icon: Activity },
                    { label: "Settings", icon: Settings },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="flex items-center gap-2 rounded-md px-2 py-1 font-medium transition-colors cursor-pointer hover:bg-[#f1f5f9] hover:text-[#0f172a]"
                      >
                        <Icon size={11.5} strokeWidth={2} />
                        <span className="truncate">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* User Profile at bottom */}
            <div className="border-t border-[#e2e8f0] pt-2">
              <div className="flex items-center gap-2 rounded-md p-1 hover:bg-[#f1f5f9] cursor-pointer">
                <div className="flex h-5.5 w-5.5 items-center justify-center rounded-full bg-[#0284c7] text-[9.5px] font-semibold text-white">
                  R
                </div>
                <div className="min-w-0 flex-1 leading-tight">
                  <p className="truncate text-[10px] font-semibold text-[#0f172a]">
                    Route Workspace
                  </p>
                  <p className="truncate text-[8.5px] text-[#94a3b8]">
                    Pro Plan · Active
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Dashboard Canvas */}
          <div className="min-w-0 flex-1 p-3.5 sm:p-5 lg:p-5.5 bg-white">
            {/* Header / Controls */}
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between pb-3.5 border-b border-[#f1f5f9]">
              <div>
                <h3 className="text-[18px] font-semibold tracking-[-0.03em] text-[#0f172a]">
                  User Analytics
                </h3>
                <p className="text-[11.5px] text-[#64748b]">
                  Insights into user behavior across the platform
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Time range toggle */}
                <div className="inline-flex rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-0.5 text-[10.5px] font-medium text-[#64748b]">
                  {(["24H", "7D", "30D"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTimeframe(t)}
                      className={`rounded-md px-2 py-0.8 transition-all ${
                        timeframe === t
                          ? "bg-white font-semibold text-[#2563eb] shadow-xs"
                          : "hover:text-[#0f172a]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {/* Export button */}
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#e2e8f0] bg-white px-2 py-0.8 text-[10.5px] font-medium text-[#475569] shadow-xs hover:bg-[#f8fafc]"
                >
                  <Download size={10.5} />
                  <span>Export</span>
                </button>

                {/* Get started button */}
                <button
                  type="button"
                  className="rounded-lg bg-[#2563eb] px-2.5 py-0.8 text-[10.5px] font-medium text-white shadow-xs hover:bg-[#1d4ed8] transition-colors"
                >
                  Get Started
                </button>
              </div>
            </div>

            {/* 5 KPI Metric Cards (Matching Screenshot) */}
            <div className="mt-3.5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5 sm:gap-2.5">
              {/* 1. SESSIONS */}
              <div className="rounded-xl border border-[#e2e8f0] bg-white p-2.5 sm:p-3 shadow-xs transition-shadow hover:shadow-sm">
                <p className="text-[9.5px] font-semibold uppercase tracking-[0.06em] text-[#8695a8]">
                  SESSIONS
                </p>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-[18px] sm:text-[20px] font-bold tracking-tight text-[#0f172a]">
                    149,402
                  </span>
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-[#ecfdf5] px-1 py-0.2 text-[9.5px] font-semibold text-[#059669]">
                    <TrendingUp size={9} />
                    12%
                  </span>
                </div>
              </div>

              {/* 2. UNIQUE VISITORS */}
              <div className="rounded-xl border border-[#e2e8f0] bg-white p-2.5 sm:p-3 shadow-xs transition-shadow hover:shadow-sm">
                <p className="text-[9.5px] font-semibold uppercase tracking-[0.06em] text-[#8695a8]">
                  UNIQUE VISITORS
                </p>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-[18px] sm:text-[20px] font-bold tracking-tight text-[#0f172a]">
                    21,053
                  </span>
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-[#ecfdf5] px-1 py-0.2 text-[9.5px] font-semibold text-[#059669]">
                    <TrendingUp size={9} />
                    3.4%
                  </span>
                </div>
              </div>

              {/* 3. TOTAL VISITS */}
              <div className="rounded-xl border border-[#e2e8f0] bg-white p-2.5 sm:p-3 shadow-xs transition-shadow hover:shadow-sm">
                <p className="text-[9.5px] font-semibold uppercase tracking-[0.06em] text-[#8695a8]">
                  TOTAL VISITS
                </p>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-[18px] sm:text-[20px] font-bold tracking-tight text-[#0f172a]">
                    50,531
                  </span>
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-[#fff1f2] px-1 py-0.2 text-[9.5px] font-semibold text-[#e11d48]">
                    <TrendingDown size={9} />
                    2.1%
                  </span>
                </div>
              </div>

              {/* 4. AVG DURATION */}
              <div className="rounded-xl border border-[#e2e8f0] bg-white p-2.5 sm:p-3 shadow-xs transition-shadow hover:shadow-sm">
                <p className="text-[9.5px] font-semibold uppercase tracking-[0.06em] text-[#8695a8]">
                  AVG DURATION
                </p>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-[18px] sm:text-[20px] font-bold tracking-tight text-[#0f172a]">
                    5:02
                  </span>
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-[#fff1f2] px-1 py-0.2 text-[9.5px] font-semibold text-[#e11d48]">
                    <TrendingDown size={9} />
                    0.8%
                  </span>
                </div>
              </div>

              {/* 5. BOUNCE RATE */}
              <div className="col-span-2 sm:col-span-1 rounded-xl border border-[#e2e8f0] bg-white p-2.5 sm:p-3 shadow-xs transition-shadow hover:shadow-sm">
                <p className="text-[9.5px] font-semibold uppercase tracking-[0.06em] text-[#8695a8]">
                  BOUNCE RATE
                </p>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-[18px] sm:text-[20px] font-bold tracking-tight text-[#0f172a]">
                    32.4%
                  </span>
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-[#ecfdf5] px-1 py-0.2 text-[9.5px] font-semibold text-[#059669]">
                    <TrendingUp size={9} />
                    1.1%
                  </span>
                </div>
              </div>
            </div>

            {/* Main Spline Chart Card (Matching Screenshot) */}
            <div className="relative mt-2.5 rounded-xl border border-[#e2e8f0] bg-white p-3 sm:p-3.5 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#f1f5f9]">
                <div>
                  <p className="text-[9.5px] font-semibold uppercase tracking-[0.08em] text-[#8695a8]">
                    CURRENT VS PREVIOUS PERIOD
                  </p>
                  <h4 className="mt-0.5 text-[13px] font-semibold tracking-[-0.02em] text-[#0f172a]">
                    Pageviews Over Time
                  </h4>
                </div>

                <div className="flex items-center gap-3 text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#2563eb]" />
                    <span className="font-medium text-[#475569]">Current</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#cbd5e1]" />
                    <span className="text-[#94a3b8]">Previous</span>
                  </div>
                </div>
              </div>

              {/* Chart SVG Canvas */}
              <div className="relative mt-2.5 h-[125px] sm:h-[145px] w-full">
                {/* Horizontal Grid lines */}
                {[0, 25, 50, 75, 100].map((percent) => (
                  <div
                    key={percent}
                    className="absolute left-0 right-0 border-t border-[#f1f5f9]"
                    style={{ top: `${percent}%` }}
                  />
                ))}

                {/* SVG Curve */}
                <svg
                  viewBox="0 0 720 100"
                  preserveAspectRatio="none"
                  className="absolute inset-0 h-full w-full overflow-visible"
                >
                  <defs>
                    <linearGradient id="userAnalyticsGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0.00" />
                    </linearGradient>
                  </defs>

                  {/* Gradient Area under current line */}
                  <path
                    d="M 40 54 C 80 49, 100 46, 120 45 C 160 44, 180 51, 200 50 C 240 49, 260 40, 280 39 C 320 38, 340 36, 360 35 C 400 34, 420 42, 440 41 C 480 40, 500 30, 520 29 C 560 28, 580 34, 600 33 C 640 32, 660 25, 680 24 L 680 100 L 40 100 Z"
                    fill="url(#userAnalyticsGlow)"
                  />

                  {/* Previous period line (dashed / lighter) */}
                  <path
                    d="M 40 68 C 80 65, 100 63, 120 62 C 160 61, 180 60, 200 59 C 240 58, 260 58, 280 57 C 320 56, 340 54, 360 53 C 400 52, 420 52, 440 51 C 480 50, 500 50, 520 49 C 560 48, 580 47, 600 46 C 640 45, 660 45, 680 45"
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="1.8"
                    strokeDasharray="4 4"
                  />

                  {/* Current period line (solid vibrant blue) */}
                  <path
                    d="M 40 54 C 80 49, 100 46, 120 45 C 160 44, 180 51, 200 50 C 240 49, 260 40, 280 39 C 320 38, 340 36, 360 35 C 400 34, 420 42, 440 41 C 480 40, 500 30, 520 29 C 560 28, 580 34, 600 33 C 640 32, 660 25, 680 24"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  {/* Interactive points */}
                  {chartPoints.map((pt, i) => (
                    <g key={pt.date}>
                      <circle
                        cx={pt.x}
                        cy={pt.yTop}
                        r={hoveredIdx === i ? 5.5 : 3.5}
                        fill="#ffffff"
                        stroke="#2563eb"
                        strokeWidth={hoveredIdx === i ? 3 : 2}
                        className="cursor-pointer transition-all duration-150"
                        onMouseEnter={() => setHoveredIdx(i)}
                      />
                    </g>
                  ))}
                </svg>

                {/* Tooltip */}
                {activePoint && (
                  <div
                    className="pointer-events-none absolute z-20 flex flex-col gap-0.5 rounded-lg border border-[#cbd5e1] bg-white/95 px-3 py-2 text-xs shadow-md backdrop-blur-xs transition-all duration-100"
                    style={{
                      left: `clamp(30px, ${(activePoint.x / 720) * 100}%, calc(100% - 130px))`,
                      top: "20px",
                      transform: "translateX(-50%)",
                    }}
                  >
                    <div className="font-semibold text-[#0f172a]">{activePoint.date}</div>
                    <div className="flex items-center gap-2 text-[#2563eb] font-semibold">
                      <span>Current:</span>
                      <span>{activePoint.current.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#64748b]">
                      <span>Previous:</span>
                      <span>{activePoint.previous.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* X-Axis Date Labels */}
              <div className="mt-2 flex justify-between px-2 text-[9.5px] sm:text-[10.5px] font-medium text-[#94a3b8]">
                {chartPoints.map((pt, i) => (
                  <span
                    key={pt.date}
                    className={`cursor-pointer transition-colors ${
                      hoveredIdx === i ? "font-bold text-[#2563eb]" : "hover:text-[#475569]"
                    }`}
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  >
                    {pt.date}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Sub-sections: Pages vs Traffic Acquisition & API Button */}
            <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 pt-2 border-t border-[#f1f5f9]">
              {/* Tab selector */}
              <div className="flex items-center gap-3.5 text-[11.5px]">
                <button
                  type="button"
                  onClick={() => setActiveBottomTab("pages")}
                  className={`pb-0.5 font-semibold transition-colors border-b-2 ${
                    activeBottomTab === "pages"
                      ? "border-[#2563eb] text-[#2563eb]"
                      : "border-transparent text-[#64748b] hover:text-[#0f172a]"
                  }`}
                >
                  Top Pages
                </button>
                <button
                  type="button"
                  onClick={() => setActiveBottomTab("acquisition")}
                  className={`pb-0.5 font-semibold transition-colors border-b-2 ${
                    activeBottomTab === "acquisition"
                      ? "border-[#2563eb] text-[#2563eb]"
                      : "border-transparent text-[#64748b] hover:text-[#0f172a]"
                  }`}
                >
                  Traffic Acquisition
                </button>
              </div>

              {/* Generate report via API button */}
              <button
                type="button"
                onClick={handleCopyApi}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563eb] px-3 py-1 text-[10.5px] font-medium text-white shadow-xs hover:bg-[#1d4ed8] transition-colors"
              >
                {apiReportCopied ? (
                  <>
                    <Check size={11} className="text-emerald-300" />
                    <span>cURL Copied!</span>
                  </>
                ) : (
                  <>
                    <Terminal size={11} />
                    <span>Generate report via API</span>
                  </>
                )}
              </button>
            </div>

            {/* Bottom Content Table based on sub-tab */}
            <div className="mt-2 rounded-lg border border-[#f1f5f9] bg-[#fafbfc] p-2 text-[10.5px]">
              {activeBottomTab === "pages" ? (
                <div className="space-y-1.5">
                  {[
                    { path: "/", views: "74,210", share: "49.6%", avgTime: "2m 14s", bounce: "28%" },
                    { path: "/pricing", views: "31,840", share: "21.3%", avgTime: "4m 02s", bounce: "18%" },
                    { path: "/docs/installation", views: "19,510", share: "13.0%", avgTime: "6m 45s", bounce: "12%" },
                    { path: "/blog/zero-cookie-analytics", views: "14,920", share: "10.0%", avgTime: "3m 30s", bounce: "34%" },
                  ].map((row) => (
                    <div
                      key={row.path}
                      className="flex items-center justify-between rounded-md bg-white px-2.5 py-1.5 border border-[#e2e8f0] shadow-2xs hover:border-[#cbd5e1]"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium text-[#2563eb]">{row.path}</span>
                      </div>
                      <div className="flex items-center gap-4 text-[10.5px] text-[#64748b]">
                        <span>{row.views} views</span>
                        <span className="hidden sm:inline text-[#94a3b8]">{row.share}</span>
                        <span className="hidden md:inline font-mono">{row.avgTime}</span>
                        <span className="text-[#059669] font-medium">{row.bounce} bounce</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {[
                    { source: "Google Search", visitors: "48%", count: "71,712", icon: "🔍" },
                    { source: "Direct Traffic", visitors: "27%", count: "40,338", icon: "⚡" },
                    { source: "Twitter / X", visitors: "14%", count: "20,916", icon: "🐦" },
                    { source: "GitHub & Docs", visitors: "8%", count: "11,952", icon: "🐙" },
                  ].map((src) => (
                    <div
                      key={src.source}
                      className="rounded-md border border-[#e2e8f0] bg-white p-2.5 shadow-2xs"
                    >
                      <div className="flex items-center justify-between text-[11px] font-semibold text-[#0f172a]">
                        <span className="flex items-center gap-1.5">
                          <span>{src.icon}</span>
                          <span>{src.source}</span>
                        </span>
                        <span className="text-[#2563eb]">{src.visitors}</span>
                      </div>
                      <p className="mt-1 text-[10px] text-[#94a3b8] font-mono">
                        {src.count} visitors
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
