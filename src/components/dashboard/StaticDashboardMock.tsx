"use client";

import React, { useState } from "react";
import {
  Home,
  Globe,
  Network,
  AlertTriangle,
  FileText,
  Gauge,
  Zap,
  Code2,
  Copy,
  Check,
  Download,
  Moon,
  Maximize2,
  ChevronLeft,
  MessageSquare,
  TrendingUp,
  Sparkles,
} from "lucide-react";

export type MockTab = "overview" | "map" | "vitals";

interface Props {
  initialTab?: MockTab;
  hideRightSidebar?: boolean;
}

export function StaticDashboardMock({
  initialTab = "overview",
  hideRightSidebar = false,
}: Props) {
  const [activeTab, setActiveTab] = useState<MockTab>(initialTab);
  const [range, setRange] = useState<string>("24h");
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [copiedProjectId, setCopiedProjectId] = useState(false);
  const [mapSubTab, setMapSubTab] = useState<"countries" | "cities">("countries");

  const handleCopySnippet = () => {
    navigator.clipboard?.writeText(
      `<script\n  src="http://localhost:3000/beacon.js"\n  data-pid="cmv57ygfj000174wcn3d9mk2k"\n  data-domain="test-route-psi.vercel.app"\n  strategy="afterInteractive"\n/>`
    );
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const handleCopyProjectId = () => {
    navigator.clipboard?.writeText("cmv57ygfj000174wcn3d9mk2k");
    setCopiedProjectId(true);
    setTimeout(() => setCopiedProjectId(false), 2000);
  };

  const ranges = ["1h", "24h", "7d", "30d", "90d", "1y"];

  return (
    <div className="w-full bg-white font-instrument-sans text-[#0f172a] select-none text-left">
      {/* ---------------------------------------------------------------- */}
      {/* TOP SUB-HEADER BAR (Matching User Screenshot)                     */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex h-11 items-center justify-between border-b border-[#e2e8f0] bg-white px-3 sm:px-4 text-[11.5px]">
        {/* Left: Project selector breadcrumb */}
        <div className="flex items-center gap-2 overflow-hidden">
          <button
            type="button"
            className="flex items-center gap-1 text-[#64748b] hover:text-[#0f172a] transition-colors cursor-pointer"
          >
            <ChevronLeft size={13} />
            <span className="hidden sm:inline font-medium">All Projects</span>
          </button>
          <span className="text-[#cbd5e1]">/</span>
          <span className="font-semibold text-[#0f172a]">test-route</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#fefce8] px-2 py-0.5 text-[10px] font-medium text-[#b45309]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#eab308]" />
            Connected · Idle
          </span>
          <span className="hidden md:inline text-[10.5px] text-[#94a3b8]">
            24h range
          </span>
        </div>

        {/* Right: Actions & User Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="rounded-lg bg-[#0284C7] px-2.5 py-1 text-[11px] font-semibold text-white shadow-xs transition-colors hover:bg-[#1d4ed8] cursor-pointer"
          >
            Get Started
          </button>

          {/* User profile */}
          <div className="flex items-center gap-2 border-l border-[#e2e8f0] pl-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0284c7] text-[10px] font-bold text-white">
              S
            </div>
            <div className="hidden lg:block text-left leading-none">
              <p className="text-[10.5px] font-semibold text-[#0f172a]">_Sam_</p>
              <p className="text-[9px] text-[#94a3b8] truncate max-w-[110px]">
                samrathore07082007@gmail.com
              </p>
            </div>
            <Moon size={13} className="text-[#94a3b8] hover:text-[#475569] cursor-pointer" />
            <Maximize2 size={13} className="text-[#94a3b8] hover:text-[#475569] cursor-pointer" />
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* 3-COLUMN MAIN LAYOUT (Left Nav + Main Content + Right Sidebar)   */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex min-h-[580px] w-full">
        {/* ============================================================== */}
        {/* 1. LEFT SIDEBAR                                                */}
        {/* ============================================================== */}
        <aside className="hidden w-[185px] shrink-0 border-r border-[#e2e8f0] bg-[#fafbfc] p-3 md:flex md:flex-col md:justify-between">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-2 px-1 pb-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#0284C7] text-white">
                <Sparkles size={13} strokeWidth={2.5} />
              </div>
              <span className="font-bold text-[14.5px] tracking-tight text-[#0f172a]">
                Route
              </span>
            </div>

            {/* Add Project Button */}
            <button
              type="button"
              className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#0284C7] py-1.5 text-[11px] font-semibold text-white shadow-xs transition-colors hover:bg-[#1d4ed8] cursor-pointer"
            >
              <span className="text-sm font-bold leading-none">+</span>
              <span>Add Project</span>
            </button>

            {/* Navigation Group 1: PORTFOLIO */}
            <div className="mt-3.5">
              <p className="px-2 text-[9px] font-bold uppercase tracking-[0.14em] text-[#94a3b8]">
                PORTFOLIO
              </p>
              <div className="mt-1 space-y-0.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setActiveTab("overview")}
                  className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 font-medium transition-colors text-left cursor-pointer ${
                    activeTab === "overview"
                      ? "bg-[#eff6ff] font-semibold text-[#0284C7] border border-[#dbeafe]"
                      : "text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a]"
                  }`}
                >
                  <Home size={13} strokeWidth={activeTab === "overview" ? 2.5 : 2} />
                  <span>Overview</span>
                </button>
              </div>
            </div>

            {/* Navigation Group 2: ANALYTICS */}
            <div className="mt-3.5">
              <p className="px-2 text-[9px] font-bold uppercase tracking-[0.14em] text-[#94a3b8]">
                ANALYTICS
              </p>
              <div className="mt-1 space-y-0.5 text-[11px]">
                {[
                  { id: "map", label: "Global Map", icon: Globe },
                  { id: "endpoints", label: "Endpoints", icon: Network },
                  { id: "errors", label: "Errors", icon: AlertTriangle },
                  { id: "pages", label: "Pages", icon: FileText },
                  { id: "vitals", label: "Web Vitals", icon: Gauge },
                  { id: "sessions", label: "Sessions", icon: Zap },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        if (item.id === "map" || item.id === "vitals") {
                          setActiveTab(item.id);
                        }
                      }}
                      className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 font-medium transition-colors text-left cursor-pointer ${
                        isActive
                          ? "bg-[#eff6ff] font-semibold text-[#0284C7] border border-[#dbeafe]"
                          : "text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a]"
                      }`}
                    >
                      <Icon size={13} strokeWidth={isActive ? 2.5 : 2} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Group 3: SETUP */}
            <div className="mt-3.5">
              <p className="px-2 text-[9px] font-bold uppercase tracking-[0.14em] text-[#94a3b8]">
                SETUP
              </p>
              <div className="mt-1 space-y-0.5 text-[11px]">
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 font-medium text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] text-left cursor-pointer"
                >
                  <Code2 size={13} strokeWidth={2} />
                  <span>Installation</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Sidebar Action Buttons */}
          <div className="border-t border-[#e2e8f0] pt-2.5 space-y-1.5">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#0284C7] py-1.5 text-[11px] font-semibold text-white shadow-xs transition-colors hover:bg-[#1d4ed8] cursor-pointer"
            >
              <MessageSquare size={12} />
              <span>Share feedback</span>
            </button>
            <button
              type="button"
              className="flex w-full items-center justify-center gap-1 rounded-lg border border-[#e2e8f0] bg-white py-1 text-[11px] font-medium text-[#64748b] shadow-2xs hover:bg-[#f8fafc] cursor-pointer"
            >
              <ChevronLeft size={12} />
              <span>Back</span>
            </button>
          </div>
        </aside>

        {/* ============================================================== */}
        {/* 2. CENTER CONTENT VIEW (Dynamic by Tab: overview | map | vitals) */}
        {/* ============================================================== */}
        <div className="min-w-0 flex-1 p-3.5 sm:p-5 lg:p-5 bg-white overflow-x-hidden">
          {/* TAB 1: OVERVIEW (IMAGE 1) */}
          {activeTab === "overview" && (
            <div className="space-y-3.5">
              {/* Header Title + Range Buttons */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-1">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#0284C7]" />
                  <h2 className="text-[16px] font-bold tracking-tight text-[#0f172a]">
                    test-route Overview
                  </h2>
                </div>

                {/* Range Pills */}
                <div className="inline-flex rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-0.5 text-[10.5px] font-medium text-[#64748b]">
                  {ranges.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRange(r)}
                      className={`rounded-md px-2 py-0.5 transition-all ${
                        range === r
                          ? "bg-white font-semibold text-[#0284C7] shadow-xs"
                          : "hover:text-[#0f172a]"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4 KPI Stat Cards */}
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {/* 1. Total Requests */}
                <div className="rounded-xl border border-[#e2e8f0] bg-white p-3 shadow-xs">
                  <p className="text-[9.5px] font-semibold uppercase tracking-[0.08em] text-[#8695a8]">
                    TOTAL REQUESTS
                  </p>
                  <p className="mt-1 text-[22px] font-bold tracking-tight text-[#0f172a]">
                    15
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-[#059669]">
                    <TrendingUp size={10} />
                    <span>0% vs prev period</span>
                  </div>
                </div>

                {/* 2. Avg Latency */}
                <div className="rounded-xl border border-[#e2e8f0] bg-white p-3 shadow-xs">
                  <p className="text-[9.5px] font-semibold uppercase tracking-[0.08em] text-[#8695a8]">
                    AVG LATENCY
                  </p>
                  <p className="mt-1 text-[22px] font-bold tracking-tight text-[#0f172a]">
                    0ms
                  </p>
                  <p className="mt-1 text-[10px] text-[#94a3b8]">0 api requests</p>
                </div>

                {/* 3. P95 Latency */}
                <div className="rounded-xl border border-[#e2e8f0] bg-white p-3 shadow-xs">
                  <p className="text-[9.5px] font-semibold uppercase tracking-[0.08em] text-[#8695a8]">
                    P95 LATENCY
                  </p>
                  <p className="mt-1 text-[22px] font-bold tracking-tight text-[#0284C7]">
                    0ms
                  </p>
                  <p className="mt-1 text-[10px] text-[#94a3b8]">p95 over selected range</p>
                </div>

                {/* 4. Error Rate */}
                <div className="rounded-xl border border-[#e2e8f0] bg-white p-3 shadow-xs">
                  <p className="text-[9.5px] font-semibold uppercase tracking-[0.08em] text-[#8695a8]">
                    ERROR RATE
                  </p>
                  <p className="mt-1 text-[22px] font-bold tracking-tight text-[#0f172a]">
                    0.00%
                  </p>
                  <p className="mt-1 text-[10px] text-[#94a3b8]">0 errors</p>
                </div>
              </div>

              {/* Chart 1: Latency Distribution */}
              <div className="rounded-xl border border-[#e2e8f0] bg-white p-3.5 sm:p-4 shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#f1f5f9]">
                  <div>
                    <h3 className="text-[13px] font-bold text-[#0f172a]">
                      Latency Distribution
                    </h3>
                    <p className="text-[10px] text-[#8695a8]">
                      p50 / p95 / p99 over selected range
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-[#64748b]">
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#0f172a]" /> p50
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#0284C7]" /> p95
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#e11d48]" /> p99
                    </span>
                  </div>
                </div>

                <div className="mt-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[20px] font-bold text-[#0284C7]">0ms</span>
                    <span className="text-[10px] text-[#94a3b8]">p95 over selected range</span>
                  </div>

                  {/* Latency Distribution SVG */}
                  <div className="relative mt-2 h-[100px] w-full">
                    <svg
                      viewBox="0 0 680 90"
                      preserveAspectRatio="none"
                      className="h-full w-full"
                    >
                      <line x1="30" y1="20" x2="670" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="30" y1="42" x2="670" y2="42" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="30" y1="64" x2="670" y2="64" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="30" y1="78" x2="670" y2="78" stroke="#cbd5e1" strokeWidth="1.2" />

                      <text x="22" y="24" textAnchor="end" fill="#94a3b8" fontSize="8">4ms</text>
                      <text x="22" y="46" textAnchor="end" fill="#94a3b8" fontSize="8">3ms</text>
                      <text x="22" y="68" textAnchor="end" fill="#94a3b8" fontSize="8">2ms</text>
                      <text x="22" y="82" textAnchor="end" fill="#94a3b8" fontSize="8">0ms</text>

                      {/* Flat Baseline at 0ms */}
                      <line x1="30" y1="78" x2="670" y2="78" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Chart 2: Traffic Over Time (Smooth Gaussian Hill Peak at 17:57) */}
              <div className="rounded-xl border border-[#e2e8f0] bg-white p-3.5 sm:p-4 shadow-xs">
                <div className="pb-2 border-b border-[#f1f5f9]">
                  <h3 className="text-[13px] font-bold text-[#0f172a]">
                    Traffic Over Time
                  </h3>
                  <p className="text-[10px] text-[#8695a8]">
                    Requests vs errors per bucket
                  </p>
                </div>

                <div className="relative mt-2 h-[140px] w-full">
                  <svg
                    viewBox="0 0 680 120"
                    preserveAspectRatio="none"
                    className="h-full w-full"
                  >
                    <defs>
                      <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0284C7" stopOpacity="0.28" />
                        <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.10" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Grid */}
                    <line x1="30" y1="18" x2="670" y2="18" stroke="#f8fafc" strokeWidth="1" />
                    <line x1="30" y1="42" x2="670" y2="42" stroke="#f8fafc" strokeWidth="1" />
                    <line x1="30" y1="68" x2="670" y2="68" stroke="#f8fafc" strokeWidth="1" />
                    <line x1="30" y1="94" x2="670" y2="94" stroke="#f8fafc" strokeWidth="1" />
                    <line x1="30" y1="102" x2="670" y2="102" stroke="#e2e8f0" strokeWidth="1" />

                    <text x="22" y="21" textAnchor="end" fill="#94a3b8" fontSize="8">16</text>
                    <text x="22" y="46" textAnchor="end" fill="#94a3b8" fontSize="8">12</text>
                    <text x="22" y="72" textAnchor="end" fill="#94a3b8" fontSize="8">8</text>
                    <text x="22" y="97" textAnchor="end" fill="#94a3b8" fontSize="8">4</text>
                    <text x="22" y="105" textAnchor="end" fill="#94a3b8" fontSize="8">0</text>

                    {/* Gaussian Hill Peak Area */}
                    <path
                      d="M 30 102 L 530 102 C 545 102 555 98 565 65 C 572 40 577 20 585 20 C 593 20 598 40 605 65 C 615 98 625 102 640 102 L 670 102 Z"
                      fill="url(#trafficGradient)"
                    />

                    {/* Gaussian Hill Peak Line Stroke */}
                    <path
                      d="M 30 102 L 530 102 C 545 102 555 98 565 65 C 572 40 577 20 585 20 C 593 20 598 40 605 65 C 615 98 625 102 640 102 L 670 102"
                      fill="none"
                      stroke="#0284c7"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Timeline labels at bottom */}
                    <text x="35" y="115" textAnchor="start" fill="#94a3b8" fontSize="7.5">20:57</text>
                    <text x="110" y="115" textAnchor="middle" fill="#94a3b8" fontSize="7.5">23:57</text>
                    <text x="190" y="115" textAnchor="middle" fill="#94a3b8" fontSize="7.5">03:57</text>
                    <text x="270" y="115" textAnchor="middle" fill="#94a3b8" fontSize="7.5">07:27</text>
                    <text x="350" y="115" textAnchor="middle" fill="#94a3b8" fontSize="7.5">10:27</text>
                    <text x="430" y="115" textAnchor="middle" fill="#94a3b8" fontSize="7.5">13:27</text>
                    <text x="510" y="115" textAnchor="middle" fill="#94a3b8" fontSize="7.5">16:57</text>
                    <text x="585" y="115" textAnchor="middle" fill="#0284c7" fontSize="7.5" fontWeight="600">17:57</text>
                    <text x="660" y="115" textAnchor="end" fill="#94a3b8" fontSize="7.5">19:27</text>
                  </svg>
                </div>
              </div>

              {/* Bottom 2 mini cards: Cumulative & Request Delta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pb-2">
                <div className="rounded-xl border border-[#e2e8f0] bg-white p-3 shadow-xs">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <p className="text-[11px] font-bold text-[#0f172a]">
                        Cumulative Requests
                      </p>
                      <p className="text-[9.5px] text-[#94a3b8]">15 total</p>
                    </div>
                    <span className="text-[17px] font-bold text-[#0284C7]">15</span>
                  </div>
                  <div className="mt-2 h-7 w-full">
                    <svg viewBox="0 0 260 25" preserveAspectRatio="none" className="h-full w-full">
                      <path
                        d="M 0 22 L 200 22 Q 220 22 230 4 L 260 4"
                        fill="none"
                        stroke="#0284C7"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>

                <div className="rounded-xl border border-[#e2e8f0] bg-white p-3 shadow-xs">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <p className="text-[11px] font-bold text-[#0f172a]">
                        Request Delta
                      </p>
                      <p className="text-[9.5px] text-[#94a3b8]">
                        Bucket over bucket change
                      </p>
                    </div>
                    <span className="text-[17px] font-bold text-[#059669]">+0%</span>
                  </div>
                  <div className="mt-2 flex items-center justify-end gap-3 text-[9.5px] text-[#64748b]">
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-xs bg-[#0d9488]" /> up
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-xs bg-[#e11d48]" /> down
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GLOBAL MAP (IMAGE 2) */}
          {activeTab === "map" && (
            <div className="space-y-3.5">
              {/* Header Title + Range Buttons */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-1">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#0284C7]" />
                  <h2 className="text-[16px] font-bold tracking-tight text-[#0f172a]">
                    Global Map
                  </h2>
                </div>

                {/* Range Pills */}
                <div className="inline-flex rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-0.5 text-[10.5px] font-medium text-[#64748b]">
                  {ranges.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRange(r)}
                      className={`rounded-md px-2 py-0.5 transition-all ${
                        range === r
                          ? "bg-white font-semibold text-[#0284C7] shadow-xs"
                          : "hover:text-[#0f172a]"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2 Big Stat Cards */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-xl border border-[#e2e8f0] bg-white p-3.5 sm:p-4 shadow-xs">
                  <p className="text-[9.5px] font-semibold uppercase tracking-[0.08em] text-[#8695a8]">
                    VISITORS
                  </p>
                  <p className="mt-1 text-[26px] sm:text-[28px] font-bold tracking-tight text-[#0f172a]">
                    2
                  </p>
                </div>

                <div className="rounded-xl border border-[#e2e8f0] bg-white p-3.5 sm:p-4 shadow-xs">
                  <p className="text-[9.5px] font-semibold uppercase tracking-[0.08em] text-[#8695a8]">
                    SESSIONS
                  </p>
                  <p className="mt-1 text-[26px] sm:text-[28px] font-bold tracking-tight text-[#0f172a]">
                    2
                  </p>
                </div>
              </div>

              {/* Visitors by Country Card */}
              <div className="rounded-xl border border-[#e2e8f0] bg-white p-3.5 sm:p-4 shadow-xs">
                <div className="flex items-center justify-between pb-2.5 border-b border-[#f1f5f9]">
                  <div>
                    <h3 className="text-[13px] font-bold text-[#0f172a]">
                      Visitors by Country
                    </h3>
                    <p className="text-[10px] text-[#8695a8]">
                      Ranked distribution for the selected range
                    </p>
                  </div>

                  {/* Toggle Countries / Cities */}
                  <div className="inline-flex rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-0.5 text-[10.5px] font-medium text-[#64748b]">
                    <button
                      type="button"
                      onClick={() => setMapSubTab("countries")}
                      className={`rounded-md px-2 py-0.5 transition-all ${
                        mapSubTab === "countries"
                          ? "bg-white font-semibold text-[#0f172a] shadow-xs"
                          : "hover:text-[#0f172a]"
                      }`}
                    >
                      Countries
                    </button>
                    <button
                      type="button"
                      onClick={() => setMapSubTab("cities")}
                      className={`rounded-md px-2 py-0.5 transition-all ${
                        mapSubTab === "cities"
                          ? "bg-white font-semibold text-[#0f172a] shadow-xs"
                          : "hover:text-[#0f172a]"
                      }`}
                    >
                      Cities
                    </button>
                  </div>
                </div>

                {/* Horizontal Bar Chart (Matching Screenshot 2) */}
                <div className="mt-4 px-2">
                  <div className="relative pt-6 pb-6">
                    {/* Vertical grid lines */}
                    <div className="absolute inset-0 flex justify-between pointer-events-none text-[9px] text-[#94a3b8]">
                      <div className="h-full border-r border-[#f1f5f9] flex flex-col justify-end pb-0">
                        <span className="translate-y-4">0</span>
                      </div>
                      <div className="h-full border-r border-[#f1f5f9] flex flex-col justify-end pb-0">
                        <span className="translate-y-4">0.5</span>
                      </div>
                      <div className="h-full border-r border-[#f1f5f9] flex flex-col justify-end pb-0">
                        <span className="translate-y-4">1</span>
                      </div>
                      <div className="h-full border-r border-[#f1f5f9] flex flex-col justify-end pb-0">
                        <span className="translate-y-4">1.5</span>
                      </div>
                      <div className="h-full flex flex-col justify-end pb-0">
                        <span className="translate-y-4">2</span>
                      </div>
                    </div>

                    {/* Single Ranked Bar */}
                    <div className="relative z-10 flex items-center gap-4 py-3">
                      <span className="w-16 text-right text-[11px] font-medium text-[#334155]">
                        Unknown
                      </span>
                      <div className="flex-1 h-3.5 bg-slate-100 rounded-xs overflow-hidden">
                        <div
                          className="h-full bg-[#0284c7] rounded-xs transition-all duration-700"
                          style={{ width: "100%" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Breakdown Table Card */}
              <div className="rounded-xl border border-[#e2e8f0] bg-white p-3.5 sm:p-4 shadow-xs">
                <div className="pb-2">
                  <h3 className="text-[13px] font-bold text-[#0f172a]">
                    Breakdown table
                  </h3>
                  <p className="text-[10px] text-[#8695a8]">1 locations</p>
                </div>

                <div className="mt-2 overflow-x-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="border-b border-[#f1f5f9] text-[9.5px] font-bold uppercase tracking-[0.06em] text-[#8695a8]">
                        <th className="py-2 font-medium">LOCATION</th>
                        <th className="py-2 font-medium text-center">VISITORS</th>
                        <th className="py-2 font-medium text-center">SESSIONS</th>
                        <th className="py-2 font-medium">SHARE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f8fafc]">
                      <tr className="text-[#334155]">
                        <td className="py-2.5 font-medium text-[#0f172a]">Unknown</td>
                        <td className="py-2.5 text-center font-semibold text-[#0f172a]">2</td>
                        <td className="py-2.5 text-center font-semibold text-[#0f172a]">2</td>
                        <td className="py-2.5 w-48">
                          <div className="flex items-center gap-2">
                            <div className="h-2 flex-1 rounded-full bg-slate-100 overflow-hidden">
                              <div className="h-full bg-[#0284c7] rounded-full w-full" />
                            </div>
                            <span className="text-[10.5px] font-semibold text-[#0f172a]">
                              100%
                            </span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: WEB VITALS (IMAGE 3) */}
          {activeTab === "vitals" && (
            <div className="space-y-3.5">
              {/* Header Title + Range Buttons */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-1">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#059669] animate-pulse" />
                    <span className="text-[10px] font-medium text-[#059669]">
                      Live · Updated just now
                    </span>
                  </div>
                  <h2 className="mt-0.5 text-[18px] font-bold tracking-tight text-[#0f172a]">
                    Web Vitals
                  </h2>
                  <p className="text-[10.5px] text-[#64748b]">
                    Google Core Web Vitals — LCP, INP, and CLS
                  </p>
                </div>

                {/* Range Pills + Export */}
                <div className="flex items-center gap-2">
                  <div className="inline-flex rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-0.5 text-[10.5px] font-medium text-[#64748b]">
                    {ranges.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRange(r)}
                        className={`rounded-md px-2 py-0.5 transition-all ${
                          range === r
                            ? "bg-white font-semibold text-[#0284C7] shadow-xs"
                            : "hover:text-[#0f172a]"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-lg border border-[#e2e8f0] bg-white px-2 py-1 text-[10.5px] font-medium text-[#475569] shadow-2xs hover:bg-[#f8fafc]"
                  >
                    <Download size={10} />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              {/* 4 Web Vital KPI Cards */}
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {/* LCP */}
                <div className="rounded-xl border border-[#e2e8f0] bg-white p-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#0f172a]">LCP</span>
                    <span className="rounded-full bg-[#ecfdf5] px-1.5 py-0.2 text-[9px] font-bold text-[#059669]">
                      GOOD
                    </span>
                  </div>
                  <p className="text-[9px] text-[#94a3b8] mt-0.5">Largest Contentful Paint</p>
                  <p className="mt-1 text-[22px] font-bold tracking-tight text-[#0f172a]">
                    210 <span className="text-[13px] font-normal text-[#64748b]">ms</span>
                  </p>
                  <div className="mt-2 h-1 w-full rounded-full bg-[#059669]" />
                  <div className="mt-1 flex justify-between text-[8.5px] text-[#94a3b8]">
                    <span>4 samples</span>
                    <span className="text-[#059669] font-medium">100% good 0% poor</span>
                  </div>
                </div>

                {/* FCP */}
                <div className="rounded-xl border border-[#e2e8f0] bg-white p-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#0f172a]">FCP</span>
                    <span className="rounded-full bg-[#ecfdf5] px-1.5 py-0.2 text-[9px] font-bold text-[#059669]">
                      GOOD
                    </span>
                  </div>
                  <p className="text-[9px] text-[#94a3b8] mt-0.5">First Contentful Paint</p>
                  <p className="mt-1 text-[22px] font-bold tracking-tight text-[#0f172a]">
                    172 <span className="text-[13px] font-normal text-[#64748b]">ms</span>
                  </p>
                  <div className="mt-2 h-1 w-full rounded-full bg-[#059669]" />
                  <div className="mt-1 flex justify-between text-[8.5px] text-[#94a3b8]">
                    <span>2 samples</span>
                    <span className="text-[#059669] font-medium">100% good 0% poor</span>
                  </div>
                </div>

                {/* CLS */}
                <div className="rounded-xl border border-[#e2e8f0] bg-white p-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#0f172a]">CLS</span>
                    <span className="rounded-full bg-[#ecfdf5] px-1.5 py-0.2 text-[9px] font-bold text-[#059669]">
                      GOOD
                    </span>
                  </div>
                  <p className="text-[9px] text-[#94a3b8] mt-0.5">Cumulative Layout Shift</p>
                  <p className="mt-1 text-[22px] font-bold tracking-tight text-[#0f172a]">
                    0.001
                  </p>
                  <div className="mt-2 h-1 w-full rounded-full bg-[#059669]" />
                  <div className="mt-1 flex justify-between text-[8.5px] text-[#94a3b8]">
                    <span>2 samples</span>
                    <span className="text-[#059669] font-medium">100% good 0% poor</span>
                  </div>
                </div>

                {/* TTFB */}
                <div className="rounded-xl border border-[#e2e8f0] bg-white p-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#0f172a]">TTFB</span>
                    <span className="rounded-full bg-[#ecfdf5] px-1.5 py-0.2 text-[9px] font-bold text-[#059669]">
                      GOOD
                    </span>
                  </div>
                  <p className="text-[9px] text-[#94a3b8] mt-0.5">Time to First Byte</p>
                  <p className="mt-1 text-[22px] font-bold tracking-tight text-[#0f172a]">
                    28 <span className="text-[13px] font-normal text-[#64748b]">ms</span>
                  </p>
                  <div className="mt-2 h-1 w-full rounded-full bg-[#059669]" />
                  <div className="mt-1 flex justify-between text-[8.5px] text-[#94a3b8]">
                    <span>2 samples</span>
                    <span className="text-[#059669] font-medium">100% good 0% poor</span>
                  </div>
                </div>
              </div>

              {/* Vitals Over Time Scatter Plot Card */}
              <div className="rounded-xl border border-[#e2e8f0] bg-white p-3.5 sm:p-4 shadow-xs">
                <div className="pb-2 border-b border-[#f1f5f9]">
                  <h3 className="text-[13px] font-bold text-[#0f172a]">
                    Vitals Over Time
                  </h3>
                  <p className="text-[10px] text-[#8695a8]">
                    p75 values per metric over the selected time range
                  </p>
                </div>

                <div className="relative mt-3 h-[180px] w-full">
                  <svg
                    viewBox="0 0 680 150"
                    preserveAspectRatio="none"
                    className="h-full w-full"
                  >
                    {/* Dotted horizontal grid lines */}
                    <line x1="40" y1="20" x2="670" y2="20" stroke="#e2e8f0" strokeDasharray="3 3" />
                    <line x1="40" y1="50" x2="670" y2="50" stroke="#e2e8f0" strokeDasharray="3 3" />
                    <line x1="40" y1="80" x2="670" y2="80" stroke="#e2e8f0" strokeDasharray="3 3" />
                    <line x1="40" y1="110" x2="670" y2="110" stroke="#e2e8f0" strokeDasharray="3 3" />
                    <line x1="40" y1="135" x2="670" y2="135" stroke="#e2e8f0" strokeWidth="1" />

                    <text x="32" y="24" textAnchor="end" fill="#94a3b8" fontSize="8.5">1600</text>
                    <text x="32" y="54" textAnchor="end" fill="#94a3b8" fontSize="8.5">1200</text>
                    <text x="32" y="84" textAnchor="end" fill="#94a3b8" fontSize="8.5">800</text>
                    <text x="32" y="114" textAnchor="end" fill="#94a3b8" fontSize="8.5">400</text>
                    <text x="32" y="138" textAnchor="end" fill="#94a3b8" fontSize="8.5">0</text>

                    {/* Scatter dots in center */}
                    {/* LCP (Purple ring at 1600) */}
                    <circle cx="360" cy="20" r="5" fill="none" stroke="#a855f7" strokeWidth="2.5" />
                    <circle cx="360" cy="20" r="2.5" fill="#a855f7" />

                    {/* FCP (Cyan ring at 800) */}
                    <circle cx="360" cy="80" r="5" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
                    <circle cx="360" cy="80" r="2.5" fill="#38bdf8" />

                    {/* TTFB (Green ring at ~115) */}
                    <circle cx="360" cy="118" r="5" fill="none" stroke="#10b981" strokeWidth="2.5" />
                    <circle cx="360" cy="118" r="2.5" fill="#10b981" />

                    {/* CLS (Yellow ring at ~128) */}
                    <circle cx="360" cy="128" r="5" fill="none" stroke="#eab308" strokeWidth="2.5" />
                    <circle cx="360" cy="128" r="2.5" fill="#eab308" />
                  </svg>
                </div>

                {/* Legend */}
                <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-[10px] text-[#64748b]">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#eab308]" /> CLS
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#38bdf8]" /> FCP
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#f43f5e]" /> INP
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#a855f7]" /> LCP
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#10b981]" /> TTFB
                  </span>
                </div>
              </div>

              {/* Performance by Country Table Card */}
              <div className="rounded-xl border border-[#e2e8f0] bg-white p-3.5 sm:p-4 shadow-xs">
                <div className="flex items-center justify-between pb-2">
                  <h3 className="text-[13px] font-bold text-[#0f172a]">
                    Performance by Country
                  </h3>
                  <span className="text-[9.5px] text-[#94a3b8]">p75 values</span>
                </div>

                <div className="mt-1 overflow-x-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="border-b border-[#f1f5f9] text-[9.5px] font-bold uppercase tracking-[0.06em] text-[#8695a8]">
                        <th className="py-2 font-medium">COUNTRY</th>
                        <th className="py-2 font-medium text-center">SAMPLES</th>
                        <th className="py-2 font-medium text-center">LCP</th>
                        <th className="py-2 font-medium text-center">FCP</th>
                        <th className="py-2 font-medium text-center">CLS</th>
                        <th className="py-2 font-medium text-center">INP</th>
                        <th className="py-2 font-medium text-center">TTFB</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f8fafc]">
                      <tr className="text-[#334155]">
                        <td className="py-2.5 font-medium text-[#0f172a] flex items-center gap-1.5">
                          <span className="text-[10px] font-semibold text-[#64748b]">IN</span>
                          <span>India</span>
                        </td>
                        <td className="py-2.5 text-center text-[#64748b]">8</td>
                        <td className="py-2.5 text-center font-medium text-[#0f172a]">1586ms</td>
                        <td className="py-2.5 text-center font-medium text-[#0f172a]">661ms</td>
                        <td className="py-2.5 text-center font-medium text-[#0f172a]">0.001</td>
                        <td className="py-2.5 text-center text-[#94a3b8]">—</td>
                        <td className="py-2.5 text-center font-medium text-[#0f172a]">131ms</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* 3. RIGHT SIDEBAR PANELS (Installation, Quick Links, Project)   */}
        {/* ============================================================== */}
        {!hideRightSidebar && (
          <aside className="hidden w-[210px] shrink-0 border-l border-[#e2e8f0] bg-[#fafbfc] p-3 xl:flex xl:flex-col xl:gap-3 text-left">
          {/* Card 1: Installation */}
          <div className="rounded-xl border border-[#e2e8f0] bg-white p-3 shadow-xs">
            <div className="flex items-center justify-between pb-1.5">
              <span className="flex items-center gap-1 text-[11px] font-bold text-[#0f172a]">
                <Code2 size={12} className="text-[#0284C7]" />
                Installation
              </span>
              <button
                type="button"
                onClick={handleCopySnippet}
                className="text-[#94a3b8] hover:text-[#0284C7] transition-colors cursor-pointer"
                title="Copy snippet"
              >
                {copiedSnippet ? <Check size={12} className="text-[#059669]" /> : <Copy size={12} />}
              </button>
            </div>
            <p className="text-[9.5px] text-[#64748b]">
              Add this snippet inside your website&apos;s{" "}
              <code className="text-[#0284C7] font-mono bg-blue-50 px-1 py-0.2 rounded-xs">
                &lt;head&gt;
              </code>
              .
            </p>

            {/* Code Box */}
            <div className="mt-2 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-2 text-[9px] font-mono text-[#475569] leading-relaxed overflow-x-auto no-scrollbar">
              <p className="text-[#0284c7]">&lt;script</p>
              <p className="pl-2">src=&quot;http://localhost:3000/beacon.js&quot;</p>
              <p className="pl-2">data-pid=&quot;cmv57yg...&quot;</p>
              <p className="pl-2">data-domain=&quot;test-route...&quot;</p>
              <p className="pl-2">strategy=&quot;afterInteractive&quot;</p>
              <p className="text-[#0284c7]">/&gt;</p>
            </div>

            <div className="mt-2 flex items-center justify-between text-[9px]">
              <span className="text-[#94a3b8]">One script, no package install</span>
              <button type="button" className="font-semibold text-[#0284C7] hover:underline cursor-pointer">
                Configure &gt;
              </button>
            </div>
          </div>

          {/* Card 2: Quick Links */}
          <div className="rounded-xl border border-[#e2e8f0] bg-white p-3 shadow-xs">
            <p className="text-[11px] font-bold text-[#0f172a] mb-2">
              Quick Links
            </p>
            <div className="space-y-1.5 text-[10.5px]">
              <button
                type="button"
                className="flex items-center gap-2 text-[#64748b] hover:text-[#0284C7] transition-colors w-full text-left cursor-pointer"
              >
                <Network size={11} className="text-[#94a3b8]" />
                <span>View Endpoints</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-2 text-[#64748b] hover:text-[#0284C7] transition-colors w-full text-left cursor-pointer"
              >
                <AlertTriangle size={11} className="text-[#94a3b8]" />
                <span>View Errors</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("map")}
                className="flex items-center gap-2 text-[#64748b] hover:text-[#0284C7] transition-colors w-full text-left cursor-pointer"
              >
                <Globe size={11} className="text-[#94a3b8]" />
                <span>Global Map</span>
              </button>
              <button
                type="button"
                className="flex items-center gap-2 text-[#64748b] hover:text-[#0284C7] transition-colors w-full text-left cursor-pointer"
              >
                <Zap size={11} className="text-[#94a3b8]" />
                <span>Sessions</span>
              </button>
            </div>
          </div>

          {/* Card 3: Project Info */}
          <div className="rounded-xl border border-[#e2e8f0] bg-white p-3 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#0f172a]">
                Project Info
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#059669]" />
            </div>

            <div>
              <p className="text-[8.5px] font-semibold uppercase tracking-[0.06em] text-[#94a3b8]">
                PROJECT ID
              </p>
              <div className="mt-0.5 flex items-center justify-between rounded-md border border-[#e2e8f0] bg-[#f8fafc] px-2 py-1 text-[9.5px] font-mono text-[#475569]">
                <span className="truncate max-w-[130px]">cmv57ygfj000174wcn3d9mk2k</span>
                <button
                  type="button"
                  onClick={handleCopyProjectId}
                  className="text-[#94a3b8] hover:text-[#0284C7] ml-1 cursor-pointer"
                  title="Copy project id"
                >
                  {copiedProjectId ? <Check size={11} className="text-[#059669]" /> : <Copy size={11} />}
                </button>
              </div>
            </div>

            <div>
              <p className="text-[8.5px] font-semibold uppercase tracking-[0.06em] text-[#94a3b8]">
                DOMAIN
              </p>
              <p className="mt-0.5 text-[10px] font-medium text-[#0f172a] truncate">
                ▲ test-route-psi.vercel.app
              </p>
            </div>

            <div className="grid grid-cols-2 gap-1 text-[9.5px] pt-1 border-t border-[#f1f5f9]">
              <div>
                <p className="text-[8.5px] text-[#94a3b8]">CREATED</p>
                <p className="font-medium text-[#475569]">Oct 12, 2026</p>
              </div>
              <div>
                <p className="text-[8.5px] text-[#94a3b8]">STACK</p>
                <p className="font-medium text-[#475569]">nextjs</p>
              </div>
            </div>
          </div>
        </aside>
      )}
    </div>
    </div>
  );
}
