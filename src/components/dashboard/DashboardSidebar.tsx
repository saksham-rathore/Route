"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Gauge, MessageSquare, Code2 } from "lucide-react";

export type DashboardTab =
  | "overview"
  | "map"
  | "endpoints"
  | "errors"
  | "pages"
  | "vitals"
  | "sessions"
  | "installation";

const portfolio: { id: DashboardTab; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "/Home.svg" },
];

const analytics: { id: DashboardTab; label: string; icon?: string; lucide?: boolean }[] = [
  { id: "map", label: "Global Map", icon: "/GlobalMap.svg" },
  { id: "endpoints", label: "Endpoints", icon: "/Endpoints.svg" },
  { id: "errors", label: "Errors", icon: "/Error.svg" },
  { id: "pages", label: "Pages", icon: "/Pages.svg" },
  { id: "vitals", label: "Web Vitals", lucide: true },
  { id: "sessions", label: "Sessions", icon: "/Power.svg" },
];

const setup: { id: DashboardTab; label: string }[] = [{ id: "installation", label: "Installation" }];

interface Props {
  activeTab?: string;
  onTabChange?: (tab: DashboardTab) => void;
  onBackToProjects?: () => void;
  onAddProject?: () => void;
}

export default function DashboardSidebar({ activeTab = "overview", onTabChange, onBackToProjects, onAddProject }: Props) {
  const getTabClass = (tabId: string) => {
    const isActive = activeTab === tabId;
    return isActive
      ? "flex cursor-pointer items-center gap-2 rounded-lg bg-slate-100/90 border border-slate-200/70 px-2.5 py-1.5 text-[11.5px] font-medium text-slate-900 inside-shadow"
      : "flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1 text-[11.5px] text-slate-600 transition hover:bg-slate-100 hover:text-slate-900";
  };

  return (
    <aside className="flex w-full shrink-0 flex-col gap-2.5 lg:w-[195px] xl:w-[205px] h-full overflow-y-auto no-scrollbar">
      <Link href="/" className="flex items-center gap-2 px-1 py-0.5">
        <img src="/logo.svg" alt="Route" className="h-[22px] w-[22px] shrink-0 object-contain" />
        <span className="font-sans text-[17.5px] font-bold leading-none tracking-tight text-slate-900">Route</span>
      </Link>

      <button
        type="button"
        onClick={onAddProject}
        style={{
          background: "radial-gradient(circle, color(srgb 0.00784314 0.517647 0.780392 / 0.68) 0%, rgb(2, 132, 199) 64%)",
          boxShadow: "0 2px 8px rgba(2, 132, 199, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.28)",
        }}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-semibold text-white transition hover:brightness-105 active:scale-[0.99] cursor-pointer"
      >
        <span className="text-sm leading-none font-bold">+</span>
        <span>Add Project</span>
      </button>

      <div>
        <p className="px-1 text-[9px] font-bold tracking-[0.08em] text-slate-400">PORTFOLIO</p>
        <nav className="mt-1 flex flex-col gap-0.5">
          {portfolio.map((t) => (
            <span key={t.id} onClick={() => onTabChange?.(t.id)} className={getTabClass(t.id)}>
              <img src={t.icon} className="h-4 w-4 shrink-0 object-contain" alt={t.label} />
              <span>{t.label}</span>
            </span>
          ))}
        </nav>
      </div>

      <div>
        <p className="px-1 text-[9px] font-bold tracking-[0.08em] text-slate-400">ANALYTICS</p>
        <nav className="mt-1 flex flex-col gap-0.5">
          {analytics.map((t) => (
            <span key={t.id} onClick={() => onTabChange?.(t.id)} className={getTabClass(t.id)}>
              {t.lucide ? (
                <Gauge className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              ) : (
                <img src={t.icon} className="h-3.5 w-3.5 shrink-0 object-contain" alt={t.label} />
              )}
              <span>{t.label}</span>
            </span>
          ))}
        </nav>
      </div>

      <div>
        <p className="px-1 text-[9px] font-bold tracking-[0.08em] text-slate-400">SETUP</p>
        <nav className="mt-1 flex flex-col gap-0.5">
          {setup.map((t) => (
            <span key={t.id} onClick={() => onTabChange?.(t.id)} className={getTabClass(t.id)}>
              <Code2 className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span>{t.label}</span>
            </span>
          ))}
        </nav>
      </div>

      <div className="mt-auto flex flex-col gap-1.5 pt-2">
        <button
          type="button"
          style={{
            background: "radial-gradient(circle, color(srgb 0.00784314 0.517647 0.780392 / 0.68) 0%, rgb(2, 132, 199) 64%)",
            boxShadow: "0 2px 8px rgba(2, 132, 199, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.25)",
          }}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-[11.5px] font-semibold text-white transition hover:brightness-105 active:scale-[0.99] cursor-pointer"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>Share feedback</span>
        </button>
        <button type="button" onClick={onBackToProjects} className="flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white px-3 py-1.5 text-[11.5px] font-medium text-slate-600 inside-shadow transition hover:bg-slate-50 cursor-pointer">
          <ChevronLeft className="h-3.5 w-3.5 text-slate-400" />
          <span>Back</span>
        </button>
      </div>
    </aside>
  );
}
