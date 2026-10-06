"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Moon, Sun, Check, Copy } from "lucide-react";

export default function OnboardingScriptPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#eef1f6] font-sans text-[#0b1220] antialiased transition-colors duration-200 dark:bg-[#0c111b] dark:text-[#f1f4fa]">
      {/* Header */}
      <header className="h-[65px] shrink-0 border-b border-[#dfe4ec] bg-[#eef1f6] dark:border-[#1c2433] dark:bg-[#0c111b] transition-colors duration-200">
        <div className="mx-auto flex h-full max-w-[1104px] items-center justify-between px-4 sm:px-6">
          {/* Logo & Brand */}
          <Link href="/" className="group flex items-center gap-2.5">
            <img
              src="/logo.svg"
              alt="Route logo"
              className="h-7 w-7 object-contain transition-transform duration-200 group-hover:scale-105"
            />
            <span className="font-sans text-[24px] font-semibold leading-none tracking-[-0.04em] text-[#0b1220] dark:text-white">
              Route
            </span>
          </Link>

          {/* Theme Toggle */}
          <button
            type="button"
            aria-label="Toggle theme"
            className="flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-lg border border-slate-200/80 bg-white text-slate-600 shadow-xs transition hover:bg-slate-50 dark:border-[#1c2433] dark:bg-[#151d2e] dark:text-[#cbd5e1] inside-shadow"
          >
            <Moon className="h-4 w-4 text-slate-600 dark:text-slate-300" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:py-20">
        <section className="h-fit w-full max-w-[516px] rounded-2xl border border-[#d9e0ee] bg-white p-[22px] sm:p-[28px] shadow-[0_1px_2px_rgba(20,40,90,.04),0_8px_24px_rgba(20,40,90,.05)] dark:border-[#222c40] dark:bg-[#121927] dark:shadow-[0_8px_28px_rgba(0,0,0,.4)] inside-shadow transition-colors">
          {/* Step Badge */}
          <div className="mb-[14px] text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5b6577] dark:text-[#8b97ab]">
            Step 2 of 2
          </div>

          {/* Title & Description */}
          <h1 className="mb-2 text-[26px] font-semibold leading-[1.2] tracking-[-0.025em] text-[#0b1220] dark:text-white">
            Install the snippet
          </h1>

          <p className="mb-[26px] text-[14.5px] leading-relaxed text-[#4b5565] dark:text-[#a3adbf]">
            Paste this into your app. Traffic, journeys, latency, and vitals
            show up in the dashboard within minutes.
          </p>

          {/* Snippet Panel */}
          <div className="overflow-hidden rounded-xl border border-[#cfd9ee] bg-[#f1f4f9] shadow-[0_0_0_2px_rgba(2,132,199,0.06)] dark:border-[#2a3650] dark:bg-[#0e1522]">
            {/* File Bar */}
            <div className="flex h-[38px] items-center justify-between border-b border-[#dfe4ec] bg-white/70 px-4 backdrop-blur-xs dark:border-[#222c40] dark:bg-[#141b2b]">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#738094] dark:text-[#8b97ab]">
                SCRIPT.JS
              </span>
              <button
                type="button"
                aria-label="Copy snippet"
                className="flex h-[26px] w-[26px] cursor-pointer items-center justify-center rounded-md border border-[#dfe4ec] bg-white text-[#5b6577] shadow-2xs transition hover:bg-[#f6f7fa] hover:text-[#0b1220] dark:border-[#263148] dark:bg-[#151d2e] dark:text-[#cbd5e1]"
              >
                <Copy className="h-3 w-3" />
              </button>
            </div>

            {/* Code */}
            <div className="p-3 pb-2.5 sm:p-3.5 sm:pb-2.5">
              <pre className="overflow-x-auto rounded-lg border border-[#d3dae6] bg-[#f8fafc] p-3 sm:p-3.5 font-mono text-[12px] sm:text-[12.5px] leading-[1.65] text-[#2b3445] inside-shadow-inset dark:border-[#263148] dark:bg-[#0a101b] dark:text-[#cfd7e6] select-text">
                <code>
                  <div>
                    <span className="text-[#94a3b8]">&lt;</span>
                    <span className="font-bold text-[#c73c4d]">script</span>
                    <span className="text-amber-500 font-medium"> defer</span>
                  </div>
                  <div className="pl-3.5 sm:pl-4">
                    <span className="text-amber-500 font-medium">src</span>
                    <span className="text-[#94a3b8]">=</span>
                    <span className="text-teal-600 dark:text-emerald-400">&quot;https://cdn.route.dev/script.js&quot;</span>
                  </div>
                  <div className="pl-3.5 sm:pl-4">
                    <span className="text-amber-500 font-medium">data-pid</span>
                    <span className="text-[#94a3b8]">=</span>
                    <span className="text-teal-600 dark:text-emerald-400">&quot;YOUR_PROJECT_ID&quot;</span>
                  </div>
                  <div className="pl-3.5 sm:pl-4">
                    <span className="text-amber-500 font-medium">data-domain</span>
                    <span className="text-[#94a3b8]">=</span>
                    <span className="text-teal-600 dark:text-emerald-400">&quot;route.dev&quot;</span>
                  </div>
                  <div>
                    <span className="text-[#94a3b8]">&gt;&lt;/</span>
                    <span className="font-bold text-[#c73c4d]">script</span>
                    <span className="text-[#94a3b8]">&gt;</span>
                  </div>
                </code>
              </pre>
            </div>

            {/* Install with Agent */}
            <div className="mx-3 mb-3 sm:mx-3.5 sm:mb-3.5 flex items-center justify-between gap-3 rounded-lg border border-[#a9bce6] bg-[#e1e8f6]/80 px-3 py-2 dark:border-[#33497a] dark:bg-[#16213a]">
              <div>
                <p className="text-[11.5px] font-semibold leading-tight text-[#0b1220] dark:text-white">
                  Install with agent
                </p>
                <p className="text-[11px] leading-tight text-[#4b5565] dark:text-[#a3adbf]">
                  Paste into Cursor, Copilot, or Claude Code.
                </p>
              </div>
              <button
                type="button"
                className="flex h-[26px] flex-none cursor-pointer items-center gap-1 rounded-md bg-white px-2.5 text-[11px] font-semibold text-[#0b1220] shadow-xs hover:bg-[#f6f7fa] dark:bg-[#151d2e] dark:text-[#f1f4fa]"
              >
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </button>
            </div>
          </div>

          {/* Checklist */}
          <ul className="mb-6 mt-[18px] space-y-2">
            <li className="flex items-center gap-2.5 text-[12.5px] text-[#5b6577] dark:text-[#8b97ab]">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                <Check className="h-3 w-3 stroke-[3]" />
              </span>
              <span>Pageviews, sessions, and journey paths</span>
            </li>
            <li className="flex items-center gap-2.5 text-[12.5px] text-[#5b6577] dark:text-[#8b97ab]">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                <Check className="h-3 w-3 stroke-[3]" />
              </span>
              <span>Endpoint latency, Core Web Vitals, and ISP context</span>
            </li>
          </ul>

          {/* Actions */}
          <div className="space-y-3">
            {/* Check Connection Button with Previous Signature Radial Gradient */}
            <button
              type="button"
              style={{
                background:
                  "radial-gradient(circle, color(srgb 0.00784314 0.517647 0.780392 / 0.68) 0%, rgb(2, 132, 199) 64%)",
                boxShadow:
                  "0 2px 10px rgba(2, 132, 199, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
              }}
              className="flex h-[42px] w-full cursor-pointer items-center justify-center gap-2 rounded-lg text-[14.5px] font-semibold text-white transition hover:brightness-105 active:scale-[0.99]"
            >
              <span>Check connection</span>
            </button>

            {/* Go to Dashboard Button */}
            <Link
              href="/dashboard"
              className="flex h-[42px] w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#dde2ea] bg-[#f7f8fb] text-[14.5px] font-medium text-[#0b1220] inside-shadow transition hover:bg-[#f0f2f7] dark:border-[#263148] dark:bg-[#0e1522] dark:text-[#f1f4fa] dark:hover:bg-[#151d2e]"
            >
              <span>Go to dashboard</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
