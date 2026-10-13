"use client";

import React from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Gauge,
  MessageSquare,
  Code2,
  Home,
  Globe,
  Network,
  AlertTriangle,
  FileText,
  Zap,
} from "lucide-react";

export type DashboardTab =
  | "overview"
  | "map"
  | "endpoints"
  | "errors"
  | "pages"
  | "vitals"
  | "sessions"
  | "installation";

interface NavItem {
  id: DashboardTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const portfolio: NavItem[] = [
  { id: "overview", label: "Overview", icon: Home },
];

const analytics: NavItem[] = [
  { id: "map", label: "Global Map", icon: Globe },
  { id: "endpoints", label: "Endpoints", icon: Network },
  { id: "errors", label: "Errors", icon: AlertTriangle },
  { id: "pages", label: "Pages", icon: FileText },
  { id: "vitals", label: "Web Vitals", icon: Gauge },
  { id: "sessions", label: "Sessions", icon: Zap },
];

const setup: NavItem[] = [
  { id: "installation", label: "Installation", icon: Code2 },
];

interface Props {
  activeTab?: string;
  onTabChange?: (tab: DashboardTab) => void;
  onBackToProjects?: () => void;
  onAddProject?: () => void;
}

export default function DashboardSidebar({
  activeTab = "overview",
  onTabChange,
  onBackToProjects,
  onAddProject,
}: Props) {
  const renderNavItem = (t: NavItem) => {
    const isActive = activeTab === t.id;
    const Icon = t.icon;
    return (
      <button
        key={t.id}
        type="button"
        onClick={() => onTabChange?.(t.id)}
        className={`group flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 text-[11.5px] transition text-left ${
          isActive
            ? "bg-slate-100/90 border border-slate-200/70 py-1.5 font-medium text-slate-900 inside-shadow dark:border-slate-800 dark:bg-[#141d2e] dark:text-white"
            : "py-1 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-[#141d2e]/60 dark:hover:text-slate-200"
        }`}
      >
        <Icon
          className={`h-3.5 w-3.5 shrink-0 transition-colors ${
            isActive
              ? "text-[#0284c7] dark:text-sky-400"
              : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"
          }`}
        />
        <span className="truncate">{t.label}</span>
      </button>
    );
  };

  return (
    <aside className="flex w-full shrink-0 flex-col gap-2.5 lg:w-[195px] xl:w-[205px] h-full overflow-y-auto no-scrollbar">
      <Link href="/" className="flex items-center gap-2 px-1 py-0.5">
        <img src="/logo.svg" alt="Route" className="h-[22px] w-[22px] shrink-0 object-contain" />
        <span className="font-sans text-[17.5px] font-bold leading-none tracking-tight text-slate-900 dark:text-white">Route</span>
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
        <p className="px-1 text-[9px] font-bold tracking-[0.08em] text-slate-400 dark:text-slate-500">PORTFOLIO</p>
        <nav className="mt-1 flex flex-col gap-0.5">
          {portfolio.map(renderNavItem)}
        </nav>
      </div>

      <div>
        <p className="px-1 text-[9px] font-bold tracking-[0.08em] text-slate-400 dark:text-slate-500">ANALYTICS</p>
        <nav className="mt-1 flex flex-col gap-0.5">
          {analytics.map(renderNavItem)}
        </nav>
      </div>

      <div>
        <p className="px-1 text-[9px] font-bold tracking-[0.08em] text-slate-400 dark:text-slate-500">SETUP</p>
        <nav className="mt-1 flex flex-col gap-0.5">
          {setup.map(renderNavItem)}
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
        <button
          type="button"
          onClick={onBackToProjects}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white px-3 py-1.5 text-[11.5px] font-medium text-slate-600 inside-shadow transition hover:bg-slate-50 cursor-pointer dark:border-slate-800 dark:bg-[#121927] dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <ChevronLeft className="h-3.5 w-3.5 text-slate-400" />
          <span>Back</span>
        </button>
      </div>
    </aside>
  );
}
