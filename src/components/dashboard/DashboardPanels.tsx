"use client";

import React, { useState } from "react";
import { Copy, Check, Radio, MessageSquare } from "lucide-react";

const ranges = ["1h", "24h", "7d", "30d", "90d", "1y"];

const stats = [
  {
    label: "TOTAL REQUESTS",
    value: "1,052",
    delta: "↑ 9.9% vs prev 24h",
    deltaTone: "text-[#059669]",
    valueTone: "text-slate-900",
  },
  {
    label: "P50 LATENCY",
    value: "46ms",
    delta: "↑ 4.2% vs prev 24h",
    deltaTone: "text-[#059669]",
    valueTone: "text-slate-900",
  },
  {
    label: "P95 LATENCY",
    value: "146ms",
    delta: "↑ 0.2% vs prev 24h",
    deltaTone: "text-[#059669]",
    valueTone: "text-[#0284c7]",
  },
  {
    label: "ERROR RATE",
    value: "0.19%",
    delta: "↔ same as prev 24h",
    deltaTone: "text-slate-400",
    valueTone: "text-slate-900",
  },
];

export function DashboardRangePills() {
  const [activeRange, setActiveRange] = useState("24h");

  return (
    <div className="flex items-center gap-1 rounded-lg border border-slate-200/80 bg-white p-1 text-[11.5px] font-medium text-slate-500 inside-shadow">
      {ranges.map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => setActiveRange(r)}
          style={
            r === activeRange
              ? {
                  background:
                    "radial-gradient(circle, color(srgb 0.00784314 0.517647 0.780392 / 0.68) 0%, rgb(2, 132, 199) 64%)",
                  boxShadow: "0 1px 4px rgba(2, 132, 199, 0.35)",
                }
              : undefined
          }
          className={
            r === activeRange
              ? "rounded-md px-2.5 py-1 font-semibold text-white"
              : "rounded-md px-2.5 py-1 transition hover:bg-slate-100 hover:text-slate-800"
          }
        >
          {r}
        </button>
      ))}
    </div>
  );
}

export function DashboardStatCards() {
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-xl border border-slate-200/80 bg-white p-3.5 sm:p-4 inside-shadow transition-all"
        >
          <p className="text-[10px] font-semibold tracking-[0.08em] text-slate-400">
            {s.label}
          </p>
          <p
            className={`mt-1 font-sans text-[25px] sm:text-[27px] font-semibold leading-tight tracking-tight tabular-nums ${s.valueTone}`}
          >
            {s.value}
          </p>
          <p className={`mt-1 flex items-center text-[11px] sm:text-[11.5px] font-medium ${s.deltaTone}`}>
            {s.delta}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function DashboardRightPanel() {
  const [copied, setCopied] = useState(false);

  const scriptCode = `<script\n  defer\n  src="https://cdn.route.dev/script.js"\n  data-pid="YOUR_PROJECT_ID"\n  data-domain="route.dev"\n></script>`;

  function copySnippet() {
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <aside className="relative flex w-full shrink-0 flex-col gap-4 lg:w-[295px] xl:w-[315px] h-full overflow-y-auto no-scrollbar">
      {/* Top right icon controls using Theme.svg and Cross.svg */}
      <div className="flex justify-end gap-2 pb-0.5">
        <button
          type="button"
          aria-label="Toggle theme"
          className="flex h-7.5 w-7.5 items-center justify-center rounded-lg border border-slate-200/80 bg-white p-1.5 text-slate-500 inside-shadow transition hover:brightness-95 cursor-pointer"
        >
          <img src="/Theme.svg" className="h-full w-full object-contain" alt="Theme" />
        </button>
        <button
          type="button"
          aria-label="Close"
          className="flex h-7.5 w-7.5 items-center justify-center rounded-lg border border-slate-200/80 bg-white p-1.5 text-slate-500 inside-shadow transition hover:brightness-95 cursor-pointer"
        >
          <img src="/Cross.svg" className="h-full w-full object-contain" alt="Close" />
        </button>
      </div>

      {/* 1. Installation Card using Power.svg */}
      <section className="rounded-xl border border-slate-200/80 bg-white p-4.5 sm:p-5 inside-shadow">
        <div className="mb-2.5 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-[13px] font-semibold text-slate-900">
            <span className="flex h-4.5 w-4.5 items-center justify-center rounded-md bg-blue-50/80 p-0.5">
              <img src="/Power.svg" className="h-full w-full object-contain" alt="Installation" />
            </span>
            Installation
          </h3>
          <button
            type="button"
            onClick={copySnippet}
            title="Copy snippet"
            className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-200/80 bg-white text-slate-400 inside-shadow transition hover:text-slate-700 cursor-pointer"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
          </button>
        </div>

        <p className="mb-2.5 text-[11.5px] leading-relaxed text-slate-500">
          Add this snippet inside your website&apos;s{" "}
          <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px] text-teal-600">&lt;head&gt;</code>.
        </p>

        {/* Code block with inside shadow and syntax coloring */}
        <pre className="overflow-x-auto rounded-lg border border-slate-200/70 bg-[#fbfbfa] p-3.5 sm:p-4 font-mono text-[10.5px] sm:text-[11px] leading-[1.7] text-slate-700 inside-shadow-inset select-all">
          <code>
            <span className="text-orange-500">&lt;script</span>
            {"\n  "}
            <span className="text-teal-600">defer</span>
            {"\n  "}
            <span className="text-slate-500">src=</span>
            <span className="text-emerald-600">&quot;https://cdn.route.dev/script.js&quot;</span>
            {"\n  "}
            <span className="text-slate-500">data-pid=</span>
            <span className="text-emerald-600">&quot;YOUR_PROJECT_ID&quot;</span>
            {"\n  "}
            <span className="text-slate-500">data-domain=</span>
            <span className="text-emerald-600">&quot;route.dev&quot;</span>
            {"\n"}
            <span className="text-orange-500">&gt;&lt;/script&gt;</span>
          </code>
        </pre>

        <div className="mt-3 flex items-center justify-between text-[11.5px]">
          <span className="text-slate-400">One script, no package install</span>
          <span className="cursor-pointer font-medium text-blue-600 hover:underline">
            Configure ›
          </span>
        </div>
      </section>

      {/* 2. Quick Links Card using Link.svg */}
      <section className="rounded-xl border border-slate-200/80 bg-white p-4.5 sm:p-5 inside-shadow">
        <h3 className="mb-2.5 flex items-center gap-2 text-[13px] font-semibold text-slate-900">
          <span className="flex h-4.5 w-4.5 items-center justify-center rounded-md bg-blue-50/80 p-0.5">
            <img src="/Link.svg" className="h-full w-full object-contain" alt="Links" />
          </span>
          Quick Links
        </h3>

        <ul className="flex flex-col text-[12px] text-slate-600">
          <li className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 transition hover:bg-slate-50 hover:text-slate-900">
            <img src="/Endpoints.svg" className="h-3.5 w-3.5 shrink-0 object-contain" alt="Endpoints" />
            <span>View Endpoints</span>
          </li>
          <li className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 transition hover:bg-slate-50 hover:text-slate-900">
            <Radio className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span>View ISPs</span>
          </li>
          <li className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 transition hover:bg-slate-50 hover:text-slate-900">
            <img src="/GlobalMap.svg" className="h-3.5 w-3.5 shrink-0 object-contain" alt="Global Map" />
            <span>Global Map</span>
          </li>
          <li className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 transition hover:bg-slate-50 hover:text-slate-900">
            <img src="/Time.svg" className="h-3.5 w-3.5 shrink-0 object-contain" alt="Time Series" />
            <span>Time Series</span>
          </li>
        </ul>
      </section>

      {/* 3. Project Info Card */}
      <section className="rounded-xl border border-slate-200/80 bg-white p-4.5 sm:p-5 inside-shadow">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-[13px] font-semibold text-slate-900">
            <span className="flex h-4.5 w-4.5 items-center justify-center rounded-md bg-blue-50 text-[10px] font-bold text-blue-600">
              ⓘ
            </span>
            Project Info
          </h3>
          <span className="relative flex h-2 w-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </span>
        </div>

        <p className="text-[9.5px] font-semibold tracking-[0.08em] text-slate-400">
          ⎋ PROJECT ID
        </p>
        <div className="mb-3 mt-1.5 rounded-md border border-blue-100 bg-blue-50/50 px-3 py-2 font-mono text-[11px] text-slate-700 inside-shadow-inset select-all">
          YOUR_PROJECT_ID
        </div>

        <p className="text-[9.5px] font-semibold tracking-[0.08em] text-slate-400">
          DOMAIN
        </p>
        <p className="mb-3 mt-1 text-[12.5px] font-semibold text-slate-900">
          route.dev
        </p>

        <div className="flex gap-8">
          <div>
            <p className="text-[9.5px] font-semibold tracking-[0.08em] text-slate-400">
              CREATED
            </p>
            <p className="mt-1 text-[11.5px] font-medium text-slate-700">
              Not available
            </p>
          </div>
          <div>
            <p className="text-[9.5px] font-semibold tracking-[0.08em] text-slate-400">
              STACK
            </p>
            <p className="mt-1 text-[11.5px] font-medium text-slate-700">
              Next.js
            </p>
          </div>
        </div>
      </section>

      {/* Bottom Floating Action Button with previous signature gradient */}
      <div className="fixed bottom-5 right-5 z-50">
        <button
          type="button"
          aria-label="Open support chat"
          style={{
            background:
              "radial-gradient(circle, color(srgb 0.00784314 0.517647 0.780392 / 0.68) 0%, rgb(2, 132, 199) 64%)",
            boxShadow:
              "0 4px 14px rgba(2, 132, 199, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
          }}
          className="flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:brightness-105 active:scale-95 cursor-pointer"
        >
          <MessageSquare className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
