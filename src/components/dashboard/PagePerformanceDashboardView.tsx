"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Download, Search, ArrowUpDown, Loader2 } from "lucide-react";

interface ProjectData {
  id: string;
  projectId?: string;
  name: string;
  domain: string;
}

interface PagePerformanceDashboardViewProps {
  project?: ProjectData | null;
}

interface PageRow {
  pagePath: string;
  requests: number;
  p50: number;
  p95: number;
  p99: number;
  errorRate: number;
  lcp: number;
  fcp: number;
  cls: number;
  inp: number | null;
  ttfb: number;
}

const ranges = ["1h", "24h", "7d", "30d", "90d", "1y"];

export default function PagePerformanceDashboardView({
  project,
}: PagePerformanceDashboardViewProps) {
  const [activeRange, setActiveRange] = useState("24h");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [loading, setLoading] = useState(false);

  const [summary, setSummary] = useState({
    totalPages: 1,
    totalRequests: 36,
    avgP95: 324,
    pagesWithErrors: 0,
  });

  const [pageRows, setPageRows] = useState<PageRow[]>([
    {
      pagePath: "/",
      requests: 36,
      p50: 90,
      p95: 324,
      p99: 912,
      errorRate: 0.0,
      lcp: 1586,
      fcp: 663,
      cls: 0.001,
      inp: null,
      ttfb: 131,
    },
  ]);

  useEffect(() => {
    async function loadPages() {
      if (!project?.id && !project?.projectId) return;
      try {
        setLoading(true);
        const pid = project.id || project.projectId;
        const res = await fetch(`/api/analytics/pages?projectId=${pid}&range=${activeRange}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.summary) {
          setSummary(data.summary);
        }
        if (data.pages && Array.isArray(data.pages) && data.pages.length > 0) {
          setPageRows(data.pages);
        }
      } catch (err) {
        console.error("Failed to load page performance data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadPages();
  }, [project, activeRange]);

  const filteredAndSortedRows = useMemo(() => {
    let rows = [...pageRows];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter((r) => r.pagePath.toLowerCase().includes(q));
    }
    rows.sort((a, b) => {
      return sortOrder === "desc"
        ? b.requests - a.requests
        : a.requests - b.requests;
    });
    return rows;
  }, [pageRows, search, sortOrder]);

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  const handleExport = () => {
    const exportData = {
      project: project?.name,
      range: activeRange,
      summary,
      pages: filteredAndSortedRows,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `page-performance-${project?.name || "report"}-${activeRange}.json`;
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
            <span className="text-slate-400">Updated 15s ago</span>
          </div>

          <h1 className="text-[24px] sm:text-[26px] font-bold tracking-tight text-slate-900 dark:text-white">
            Page Performance
          </h1>
          <p className="mt-0.5 text-[13px] text-slate-500 dark:text-slate-400">
            Aggregated vitals, latency, and errors per URL path
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

      {/* 2. Search pages input */}
      <div className="relative w-full max-w-[280px]">
        <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search pages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-[36px] w-full rounded-lg border border-slate-200/80 bg-white pr-3 pl-9 text-[12.5px] text-slate-800 placeholder-slate-400 inside-shadow-inset outline-none transition focus:border-sky-500 dark:border-[#1e2738] dark:bg-[#121927] dark:text-white"
        />
      </div>

      {/* 3. Four Metric Stat Cards */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        {/* TOTAL PAGES */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4.5 inside-shadow dark:border-[#1e2738] dark:bg-[#121927]">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            TOTAL PAGES
          </div>
          <div className="mt-2 text-[27px] font-bold leading-none tracking-tight text-slate-900 dark:text-white tabular-nums">
            {summary.totalPages}
          </div>
        </div>

        {/* TOTAL REQUESTS */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4.5 inside-shadow dark:border-[#1e2738] dark:bg-[#121927]">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            TOTAL REQUESTS
          </div>
          <div className="mt-2 text-[27px] font-bold leading-none tracking-tight text-slate-900 dark:text-white tabular-nums">
            {summary.totalRequests.toLocaleString()}
          </div>
        </div>

        {/* AVG P95 */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4.5 inside-shadow dark:border-[#1e2738] dark:bg-[#121927]">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            AVG P95
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-[27px] font-bold leading-none tracking-tight text-slate-900 dark:text-white tabular-nums">
              {summary.avgP95}
            </span>
            <span className="text-[14px] font-medium text-slate-600 dark:text-slate-400">
              ms
            </span>
          </div>
        </div>

        {/* PAGES WITH ERRORS */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4.5 inside-shadow dark:border-[#1e2738] dark:bg-[#121927]">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            PAGES WITH ERRORS
          </div>
          <div className="mt-2 text-[27px] font-bold leading-none tracking-tight text-slate-900 dark:text-white tabular-nums">
            {summary.pagesWithErrors}
          </div>
        </div>
      </div>

      {/* 4. Page Performance Table */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 inside-shadow dark:border-[#1e2738] dark:bg-[#121927] mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:border-slate-800">
                <th className="pb-3 pr-4 font-semibold">PAGE PATH</th>
                <th className="pb-3 px-3 font-semibold">
                  <button
                    type="button"
                    onClick={toggleSort}
                    className="flex items-center gap-1 hover:text-slate-700 cursor-pointer"
                  >
                    <span>REQUESTS</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="pb-3 px-3 font-semibold">P50</th>
                <th className="pb-3 px-3 font-semibold">P95</th>
                <th className="pb-3 px-3 font-semibold">P99</th>
                <th className="pb-3 px-3 font-semibold">ERROR RATE</th>
                <th className="pb-3 px-3 font-semibold text-emerald-600 dark:text-emerald-400">
                  LCP
                </th>
                <th className="pb-3 px-3 font-semibold text-emerald-600 dark:text-emerald-400">
                  FCP
                </th>
                <th className="pb-3 px-3 font-semibold text-emerald-600 dark:text-emerald-400">
                  CLS
                </th>
                <th className="pb-3 px-3 font-semibold">INP</th>
                <th className="pb-3 pl-3 font-semibold text-emerald-600 dark:text-emerald-400">
                  TTFB
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 dark:divide-slate-800 dark:text-slate-300">
              {filteredAndSortedRows.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-slate-400">
                    No pages matching &quot;{search}&quot;
                  </td>
                </tr>
              ) : (
                filteredAndSortedRows.map((row) => (
                  <tr
                    key={row.pagePath}
                    className="transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                  >
                    {/* PAGE PATH */}
                    <td className="py-3.5 pr-4 font-mono font-medium text-slate-900 dark:text-white">
                      {row.pagePath}
                    </td>

                    {/* REQUESTS */}
                    <td className="py-3.5 px-3 tabular-nums font-medium text-slate-800 dark:text-slate-200">
                      {row.requests}
                    </td>

                    {/* P50 */}
                    <td className="py-3.5 px-3 tabular-nums font-mono text-slate-700 dark:text-slate-300">
                      {row.p50} ms
                    </td>

                    {/* P95 */}
                    <td className="py-3.5 px-3 tabular-nums font-mono text-slate-700 dark:text-slate-300">
                      {row.p95} ms
                    </td>

                    {/* P99 */}
                    <td className="py-3.5 px-3 tabular-nums font-mono text-slate-700 dark:text-slate-300">
                      {row.p99} ms
                    </td>

                    {/* ERROR RATE */}
                    <td className="py-3.5 px-3 tabular-nums text-slate-700 dark:text-slate-300">
                      {row.errorRate.toFixed(2)}%
                    </td>

                    {/* LCP (Green) */}
                    <td className="py-3.5 px-3 tabular-nums font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      {row.lcp.toLocaleString()}
                    </td>

                    {/* FCP (Green) */}
                    <td className="py-3.5 px-3 tabular-nums font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      {row.fcp}
                    </td>

                    {/* CLS (Green) */}
                    <td className="py-3.5 px-3 tabular-nums font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      {row.cls}
                    </td>

                    {/* INP */}
                    <td className="py-3.5 px-3 text-slate-400">
                      {row.inp != null ? `${row.inp} ms` : "-"}
                    </td>

                    {/* TTFB (Green) */}
                    <td className="py-3.5 pl-3 tabular-nums font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      {row.ttfb}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
