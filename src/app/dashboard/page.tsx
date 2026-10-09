"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import {
  CumulativeRequestsChart,
  LatencyDistributionChart,
  RequestDeltaChart,
} from "@/components/dashboard/DashboardCharts";
import DashboardRightPanel, {
  DashboardRangePills,
  DashboardStatCards,
} from "@/components/dashboard/DashboardPanels";

export default function DashboardPage() {
  const router = useRouter();
  const [project, setProject] = useState<any[]>([]);

  useEffect(() => {
    async function checkProjects() {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        if (data.projects && Array.isArray(data.projects)) {
          setProject(data.projects);
          if (data.projects.length === 0) {
            router.push("/Onboarding");
          }
        }
      } catch (err) {
        console.error("Failed to check projects:", err);
      }
    }
    checkProjects();
  }, [router]);

  return (
    <div className="h-screen w-full bg-[#eef2f7] font-sans antialiased flex overflow-hidden">
      {/* 1. Left Sidebar Column (starts from the very top with Route logo) */}
      <div className="shrink-0 h-full border-r border-slate-200/80 bg-white px-3 py-3">
        <DashboardSidebar />
      </div>

      {/* 2. Center Column (DEMO DATA & Get Started are inside the top of this charts area) */}
      <main className="min-w-0 flex-1 h-full overflow-y-auto no-scrollbar px-4.5 py-3.5 sm:px-6 flex flex-col gap-3.5">
        {/* Top Header Row of Center Column: DEMO DATA ... Get Started */}
        <div className="flex items-center justify-between pb-0.5">
          <div className="flex items-center gap-3 text-[12px]">
            <span className="tracking-wider text-slate-400">
              DEMO DATA
            </span>
            <span className="flex items-center gap-1.5 font-medium text-emerald-600">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Live
            </span>
            <span className="text-slate-400">Updated 20s ago</span>
          </div>

          <button
            type="button"
            style={{
              background:
                "radial-gradient(circle, color(srgb 0.00784314 0.517647 0.780392 / 0.68) 0%, rgb(2, 132, 199) 64%)",
              boxShadow:
                "0 2px 8px rgba(2, 132, 199, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.28)",
            }}
            className="rounded-lg px-4 py-2 text-[12.5px] font-semibold text-white transition hover:brightness-105 active:scale-[0.99]"
          >
            Get Started
          </button>
        </div>

        {/* Overview Subheader Row with Range Selector */}
        <div className="flex items-center justify-between pt-0.5">
          <h1 className="flex items-center gap-2 text-[15px] font-semibold text-slate-900">
            <span className="h-2 w-2 rounded-full bg-[#0284c7]" />
            Overview
          </h1>
          <DashboardRangePills />
        </div>

        {/* 4 Stat Cards */}
        <DashboardStatCards />

        {/* Latency Distribution Card with inside shadow */}
        <section className="rounded-xl border border-slate-200/80 bg-white p-3.5 sm:p-4 inside-shadow">
          <div className="flex items-center justify-between">
            <h2 className="text-[12.5px] font-medium text-slate-500">
              Latency Distribution
            </h2>
            <div className="flex items-center gap-3.5 text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0f172a]" /> p50
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0284c7]" /> p95
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#e11d48]" /> p99
              </span>
            </div>
          </div>

          <p className="mt-1 flex items-baseline gap-2">
            <span className="font-sans text-[25px] sm:text-[27px] font-semibold leading-none tracking-tight text-[#0284c7] tabular-nums">
              146ms
            </span>
            <span className="text-[11px] font-normal text-slate-400">
              p95 over selected range
            </span>
          </p>

          <LatencyDistributionChart />
        </section>

        {/* Bottom row (Cumulative Requests & Request Delta) with inside shadow */}
        <div className="grid gap-3 md:grid-cols-2 pb-4">
          {/* Cumulative Requests */}
          <section className="rounded-xl border border-slate-200/80 bg-white p-3.5 sm:p-4 inside-shadow">
            <h2 className="text-[12.5px] font-medium text-slate-500">
              Cumulative Requests
            </h2>
            <p className="mt-1 font-sans text-[22px] sm:text-[24px] font-semibold leading-none tracking-tight text-[#0284c7] tabular-nums">
              1,052
            </p>
            <CumulativeRequestsChart />
          </section>

          {/* Request Delta */}
          <section className="rounded-xl border border-slate-200/80 bg-white p-3.5 sm:p-4 inside-shadow">
            <div className="flex items-center justify-between">
              <h2 className="text-[12.5px] font-medium text-slate-500">
                Request Delta
              </h2>
              <div className="flex items-center gap-3.5 text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-xs bg-[#0d9488]" /> up
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-xs bg-[#e11d48]" /> down
                </span>
              </div>
            </div>
            <p className="mt-1 font-sans text-[22px] sm:text-[24px] font-semibold leading-none tracking-tight text-[#0f172a] tabular-nums">
              53
            </p>
            <RequestDeltaChart />
          </section>
        </div>
      </main>

      {/* 3. Right Panel Column (starts from the very top with Theme.svg & Cross.svg) */}
      <div className="shrink-0 h-full border-l border-slate-200/80 bg-[#f5f6f9]/50 px-3.5 py-3.5 overflow-y-auto no-scrollbar">
        <DashboardRightPanel />
      </div>
    </div>
  );
}
