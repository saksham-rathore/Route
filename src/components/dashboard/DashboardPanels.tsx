"use client";

import React, { useState } from "react";
import {
  Copy,
  Check,
  Radio,
  MessageSquare,
  Moon,
  Maximize2,
  Link2,
  Network,
  AlertTriangle,
  Globe,
  Zap,
  Code2,
} from "lucide-react";

export const RANGES = ["1h", "24h", "7d", "30d", "90d", "1y"] as const;
export type RangeKey = (typeof RANGES)[number];

export function DashboardRangePills({
  value,
  onChange,
}: {
  value: RangeKey;
  onChange: (r: RangeKey) => void;
}) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-slate-200/80 bg-white p-1 text-[11.5px] font-medium text-slate-500 inside-shadow dark:border-slate-800 dark:bg-[#121927]">
      {RANGES.map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => onChange(r)}
          style={
            r === value
              ? {
                  background:
                    "radial-gradient(circle, color(srgb 0.00784314 0.517647 0.780392 / 0.68) 0%, rgb(2, 132, 199) 64%)",
                  boxShadow: "0 1px 4px rgba(2, 132, 199, 0.35)",
                }
              : undefined
          }
          className={
            r === value
              ? "rounded-md px-2.5 py-1 font-semibold text-white"
              : "rounded-md px-2.5 py-1 transition hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800"
          }
        >
          {r}
        </button>
      ))}
    </div>
  );
}

export interface StatItem {
  label: string;
  value: string;
  delta: string;
  deltaTone?: string;
  valueTone?: string;
}

export function DashboardStatCards({ stats, loading }: { stats: StatItem[]; loading?: boolean }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse rounded-xl border border-slate-200/80 bg-white p-3.5 sm:p-4 dark:border-[#1e2738] dark:bg-[#121927]">
            <div className="h-3 w-24 rounded bg-slate-100 dark:bg-slate-800" />
            <div className="mt-2 h-7 w-20 rounded bg-slate-100 dark:bg-slate-800" />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-xl border border-slate-200/80 bg-white p-3.5 sm:p-4 inside-shadow transition-all dark:border-[#1e2738] dark:bg-[#121927]"
        >
          <p className="text-[10px] font-semibold tracking-[0.08em] text-slate-400">{s.label}</p>
          <p className={`mt-1 font-sans text-[25px] sm:text-[27px] font-semibold leading-tight tracking-tight tabular-nums dark:text-white ${s.valueTone ?? "text-slate-900"}`}>
            {s.value}
          </p>
          <p className={`mt-1 flex items-center text-[11px] sm:text-[11.5px] font-medium ${s.deltaTone ?? "text-slate-400"}`}>
            {s.delta}
          </p>
        </div>
      ))}
    </div>
  );
}

interface DashboardRightPanelProps {
  project?: {
    id: string;
    projectId?: string;
    name: string;
    domain: string;
    createdAt?: string;
    framework?: string;
  } | null;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  onNavigateTab?: (tab: string) => void;
}

export function snippetForProject(projectId: string, domain: string) {
  return `<script\n  src="${typeof window !== "undefined" ? window.location.origin : ""}/beacon.js"\n  data-pid="${projectId}"\n  data-domain="${domain}"\n  strategy="afterInteractive"\n/>`;
}

export default function DashboardRightPanel({ project, user, onNavigateTab }: DashboardRightPanelProps) {
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const projectId = project?.projectId || project?.id || "";
  const projectDomain = project?.domain || "";
  const projectCreated = project?.createdAt
    ? new Date(project.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "—";
  const projectStack = project?.framework || "script";

  const scriptCode = snippetForProject(projectId, projectDomain);

  function copySnippet() {
    navigator.clipboard.writeText(scriptCode);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  }

  function copyProjectId() {
    navigator.clipboard.writeText(projectId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  }

  const userName = user?.name || "—";
  const userEmail = user?.email || "";

  return (
    <aside className="relative flex w-full shrink-0 flex-col gap-4 lg:w-[295px] xl:w-[315px] h-full overflow-y-auto no-scrollbar">
      <div className="flex items-center justify-between pb-1 pt-0.5">
        <div className="flex items-center gap-2.5 min-w-0">
          {user?.image ? (
            <img src={user.image} alt={userName} className="h-8 w-8 rounded-full object-cover shrink-0" />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0284c7] text-white text-[12px] font-bold shrink-0">
              {userName.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <div className="text-[12px] font-semibold text-slate-800 dark:text-white truncate leading-tight">{userName}</div>
            <div className="text-[10.5px] text-slate-400 dark:text-slate-500 truncate leading-tight mt-0.5">{userEmail}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button type="button" aria-label="Toggle theme" className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200/80 bg-white p-1 text-slate-500 inside-shadow transition hover:bg-slate-50 cursor-pointer dark:border-slate-800 dark:bg-[#121927]">
            <Moon className="h-3.5 w-3.5" />
          </button>
          <button type="button" aria-label="Expand" className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200/80 bg-white p-1 text-slate-500 inside-shadow transition hover:bg-slate-50 cursor-pointer dark:border-slate-800 dark:bg-[#121927]">
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <section className="rounded-xl border border-slate-200/80 bg-white p-4 inside-shadow dark:border-[#1e2738] dark:bg-[#121927]">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-[13px] font-semibold text-slate-900 dark:text-white">
            <span className="flex h-4.5 w-4.5 items-center justify-center rounded-md bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <Code2 className="h-3 w-3" />
            </span>
            Installation
          </h3>
          <button type="button" onClick={copySnippet} title="Copy snippet" className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-200/80 bg-white text-slate-400 inside-shadow transition hover:text-slate-700 cursor-pointer dark:border-slate-800 dark:bg-[#121927]">
            {copiedScript ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
          </button>
        </div>
        <p className="mb-2.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
          Add this snippet inside your website&apos;s <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[10.5px] text-teal-600 dark:bg-slate-800">&lt;head&gt;</code>.
        </p>
        <pre className="overflow-x-auto rounded-lg border border-slate-200/70 bg-[#fbfbfa] p-3 font-mono text-[10.5px] leading-[1.65] text-slate-700 inside-shadow-inset select-all dark:border-slate-800 dark:bg-[#0c111b] dark:text-slate-300">
          <code>{scriptCode}</code>
        </pre>
        <div className="mt-2.5 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">One script, no package install</span>
          <span onClick={() => onNavigateTab?.("installation")} className="cursor-pointer font-medium text-blue-600 hover:underline">
            Configure ›
          </span>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200/80 bg-white p-4 inside-shadow dark:border-[#1e2738] dark:bg-[#121927]">
        <h3 className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-slate-900 dark:text-white">
          <span className="flex h-4.5 w-4.5 items-center justify-center rounded-md bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
            <Link2 className="h-3 w-3" />
          </span>
          Quick Links
        </h3>
        <ul className="flex flex-col text-[12px] text-slate-600 dark:text-slate-300">
          <li onClick={() => onNavigateTab?.("endpoints")} className="group flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 transition hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-800">
            <Network className="h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-300" />
            <span>View Endpoints</span>
          </li>
          <li onClick={() => onNavigateTab?.("errors")} className="group flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 transition hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-800">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-rose-500 dark:text-slate-500 dark:group-hover:text-rose-400" />
            <span>View Errors</span>
          </li>
          <li onClick={() => onNavigateTab?.("map")} className="group flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 transition hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-800">
            <Globe className="h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-300" />
            <span>Global Map</span>
          </li>
          <li onClick={() => onNavigateTab?.("sessions")} className="group flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 transition hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-800">
            <Zap className="h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-300" />
            <span>Sessions</span>
          </li>
        </ul>
      </section>

      <section className="rounded-xl border border-slate-200/80 bg-white p-4 inside-shadow dark:border-[#1e2738] dark:bg-[#121927]">
        <div className="mb-2.5 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-[13px] font-semibold text-slate-900 dark:text-white">
            <span className="flex h-4.5 w-4.5 items-center justify-center rounded-md bg-blue-50 text-[10px] font-bold text-blue-600">ⓘ</span>
            Project Info
          </h3>
          <span className="relative flex h-2 w-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </span>
        </div>
        <p className="text-[9px] font-semibold tracking-[0.08em] text-slate-400">PROJECT ID</p>
        <div className="mb-3 mt-1.5 flex items-center justify-between rounded-md border border-blue-100 bg-[#eff6ff]/70 px-2.5 py-1.5 font-mono text-[11px] text-slate-700 inside-shadow-inset select-all dark:border-blue-900/40 dark:bg-blue-950/20 dark:text-blue-300">
          <span className="truncate">{projectId || "—"}</span>
          <button type="button" onClick={copyProjectId} className="text-slate-400 hover:text-slate-700 ml-1 cursor-pointer">
            {copiedId ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
          </button>
        </div>
        <p className="text-[9px] font-semibold tracking-[0.08em] text-slate-400">DOMAIN</p>
        <p className="mb-3 mt-1 text-[12.5px] font-semibold text-slate-900 dark:text-white truncate flex items-center gap-1.5">
          <span className="text-[10px]">▲</span>
          <span>{projectDomain || "—"}</span>
        </p>
        <div className="flex gap-8">
          <div>
            <p className="text-[9px] font-semibold tracking-[0.08em] text-slate-400">CREATED</p>
            <p className="mt-1 text-[11.5px] font-medium text-slate-700 dark:text-slate-300">{projectCreated}</p>
          </div>
          <div>
            <p className="text-[9px] font-semibold tracking-[0.08em] text-slate-400">STACK</p>
            <p className="mt-1 text-[11.5px] font-medium text-slate-700 dark:text-slate-300">{projectStack}</p>
          </div>
        </div>
      </section>

      <div className="fixed bottom-5 right-5 z-50">
        <button type="button" aria-label="Open support chat" style={{ background: "radial-gradient(circle, color(srgb 0.00784314 0.517647 0.780392 / 0.68) 0%, rgb(2, 132, 199) 64%)", boxShadow: "0 4px 14px rgba(2, 132, 199, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)" }} className="flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:brightness-105 active:scale-95 cursor-pointer">
          <MessageSquare className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
