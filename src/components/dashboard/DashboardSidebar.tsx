"use client";

import React from "react";
import Link from "next/link";
import {
  Bell,
  ChevronLeft,
  Gauge,
  History,
  LayoutDashboard,
  LayoutGrid,
  Layers,
  MessageSquare,
  Radio,
  Settings,
} from "lucide-react";

export default function DashboardSidebar() {
  return (
    <aside className="flex w-full shrink-0 flex-col gap-2.5 lg:w-[195px] xl:w-[205px] h-full overflow-y-auto no-scrollbar">
      {/* Brand */}
      <Link href="/" className="flex items-center gap-2 px-1 py-0.5">
        <img
          src="/logo.svg"
          alt="Route"
          className="h-[22px] w-[22px] shrink-0 object-contain"
        />
        <span className="font-sans text-[17.5px] font-bold leading-none tracking-tight text-slate-900">
          Route
        </span>
      </Link>

      {/* Add Project button with previous button gradient */}
      <button
        type="button"
        style={{
          background:
            "radial-gradient(circle, color(srgb 0.00784314 0.517647 0.780392 / 0.68) 0%, rgb(2, 132, 199) 64%)",
          boxShadow:
            "0 2px 8px rgba(2, 132, 199, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.28)",
        }}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-semibold text-white transition hover:brightness-105 active:scale-[0.99]"
      >
        <span className="text-sm leading-none font-bold">+</span>
        <span>Add Project</span>
      </button>

      {/* Observability dropdown card with inside shadow */}
      <div className="flex items-center justify-between rounded-lg border border-slate-200/80 bg-white px-2.5 py-1.5 text-[11.5px] font-medium text-slate-800 inside-shadow cursor-pointer">
        <span className="flex items-center gap-2">
          <span className="flex h-4 w-4 items-center justify-center rounded-xs bg-blue-50 text-[10px] text-blue-600">
            ◎
          </span>
          Observability
        </span>
        <span className="text-[11px] text-slate-400">⤢</span>
      </div>

      {/* Search Input using /search.svg */}
      <div className="flex items-center justify-between rounded-lg border border-slate-200/80 bg-white px-2.5 py-1.5 text-[11.5px] text-slate-400 inside-shadow-inset">
        <span className="flex items-center gap-2">
          <img src="/search.svg" className="h-3.5 w-3.5 shrink-0 object-contain" alt="Search" />
          <span>Search</span>
        </span>
        <kbd className="rounded bg-slate-100 px-1 py-0.5 text-[8.5px] font-semibold text-slate-500">
          CTRL + K
        </kbd>
      </div>

      {/* PORTFOLIO section */}
      <div className="pt-0.5">
        <p className="px-1 text-[9px] font-bold tracking-[0.08em] text-slate-400">
          PORTFOLIO
        </p>
        <nav className="mt-1 flex flex-col gap-0.5">
          <span className="flex cursor-pointer items-center gap-2 rounded-lg bg-slate-100/90 border border-slate-200/70 px-2.5 py-1.5 text-[11.5px] font-medium text-slate-900 inside-shadow">
            <img src="/Home.svg" className="h-4 w-4 shrink-0 object-contain" alt="Overview" />
            <span>Overview</span>
          </span>
        </nav>
      </div>

      {/* ANALYTICS section using newly added SVGs */}
      <div>
        <p className="px-1 text-[9px] font-bold tracking-[0.08em] text-slate-400">
          ANALYTICS
        </p>
        <nav className="mt-1 flex flex-col gap-0.5">
          <span className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1 text-[11.5px] text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
            <img src="/GlobalMap.svg" className="h-3.5 w-3.5 shrink-0 object-contain" alt="Global Map" />
            <span>Global Map</span>
          </span>

          <span className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1 text-[11.5px] text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
            <img src="/Endpoints.svg" className="h-3.5 w-3.5 shrink-0 object-contain" alt="Endpoints" />
            <span>Endpoints</span>
          </span>

          <span className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1 text-[11.5px] text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
            <Radio className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span>ISPs</span>
          </span>

          <span className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1 text-[11.5px] text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
            <img src="/Error.svg" className="h-3.5 w-3.5 shrink-0 object-contain" alt="Errors" />
            <span>Errors</span>
          </span>

          <span className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1 text-[11.5px] text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
            <img src="/Pages.svg" className="h-3.5 w-3.5 shrink-0 object-contain" alt="Pages" />
            <span>Pages</span>
          </span>

          <span className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1 text-[11.5px] text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
            <Gauge className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span>Web Vitals</span>
          </span>

          <span className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1 text-[11.5px] text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
            <img src="/Network.svg" className="h-3.5 w-3.5 shrink-0 object-contain" alt="Network" />
            <span>Network</span>
          </span>

          <span className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1 text-[11.5px] text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
            <Layers className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span>Third Parties</span>
          </span>

          <span className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1 text-[11.5px] text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
            <img src="/Power.svg" className="h-3.5 w-3.5 shrink-0 object-contain" alt="Sessions" />
            <span>Sessions</span>
          </span>

          <span className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1 text-[11.5px] text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
            <img src="/Time.svg" className="h-3.5 w-3.5 shrink-0 object-contain" alt="Time Series" />
            <span>Time Series</span>
          </span>
        </nav>
      </div>

      {/* CONFIGURATION section */}
      <div>
        <p className="px-1 text-[9px] font-bold tracking-[0.08em] text-slate-400">
          CONFIGURATION
        </p>
        <nav className="mt-1 flex flex-col gap-0.5">
          <span className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1 text-[11.5px] text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
            <Bell className="h-3.5 w-3.5 text-slate-400" />
            <span>Alerts</span>
          </span>
          <span className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1 text-[11.5px] text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
            <History className="h-3.5 w-3.5 text-slate-400" />
            <span>Alert History</span>
          </span>
          <span className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1 text-[11.5px] text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
            <LayoutGrid className="h-3.5 w-3.5 text-slate-400" />
            <span>Status Page</span>
          </span>
          <span className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1 text-[11.5px] text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
            <Settings className="h-3.5 w-3.5 text-slate-400" />
            <span>Settings</span>
          </span>
        </nav>
      </div>

      {/* Bottom actions with gradient */}
      <div className="mt-auto flex flex-col gap-1.5 pt-2">
        <button
          type="button"
          style={{
            background:
              "radial-gradient(circle, color(srgb 0.00784314 0.517647 0.780392 / 0.68) 0%, rgb(2, 132, 199) 64%)",
            boxShadow:
              "0 2px 8px rgba(2, 132, 199, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.25)",
          }}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-[11.5px] font-semibold text-white transition hover:brightness-105 active:scale-[0.99]"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>Share feedback</span>
        </button>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white px-3 py-1.5 text-[11.5px] font-medium text-slate-600 inside-shadow transition hover:bg-slate-50"
        >
          <ChevronLeft className="h-3.5 w-3.5 text-slate-400" />
          <span>Back</span>
        </button>
      </div>
    </aside>
  );
}
