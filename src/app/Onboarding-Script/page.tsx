"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Moon, Check, Copy, Loader2 } from "lucide-react";

function OnboardingScriptContent() {


  return (
    <div className="flex min-h-screen w-full flex-col bg-[#eef2f6] font-sans text-[#0b1220] antialiased transition-colors duration-200 dark:bg-[#0c111b] dark:text-[#f1f4fa]">
      {/* Header */}
      <header className="h-[65px] shrink-0 border-b border-[#dfe4ec] bg-[#eef2f6] dark:border-[#1c2433] dark:bg-[#0c111b] transition-colors duration-200">
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
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:py-16">
        <section className="w-full max-w-[500px] rounded-2xl border border-[#d9e0ee] bg-white p-[26px] sm:p-[32px] shadow-[0_1px_2px_rgba(20,40,90,.04),0_8px_24px_rgba(20,40,90,.05)] dark:border-[#222c40] dark:bg-[#121927] dark:shadow-[0_8px_28px_rgba(0,0,0,.4)] inside-shadow transition-colors">
          {/* Step Badge */}
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#627084] dark:text-[#8b97ab]">
            STEP 2 OF 2
          </div>

          {/* Title & Description */}
          <h1 className="mb-2 text-[26px] sm:text-[28px] font-bold tracking-[-0.025em] text-[#0b1220] dark:text-white leading-[1.2]">
            Install the snippet
          </h1>

          <p className="mb-6 text-[14px] leading-relaxed text-[#4b5565] dark:text-[#a3adbf]">
            Paste this into your app. Traffic, journeys, latency, and vitals
            show up in the dashboard within minutes.
          </p>

          {/* Snippet Panel */}
          <div className="overflow-hidden rounded-[14px] border border-[#cfdaea] bg-[#edf2f9] p-3.5 sm:p-4 dark:border-[#26334a] dark:bg-[#0e1624]">
            {/* Header with SCRIPT.JS and Copy Icon */}
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-[#64748b] dark:text-[#8b97ab]">
                SCRIPT.JS
              </span>

              <button
                type="button"
                aria-label="Copy snippet"
                title="Copy snippet"
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-[#d0dbe9] bg-white text-[#5b6577] shadow-2xs transition hover:bg-slate-50 hover:text-[#0b1220] dark:border-[#26334a] dark:bg-[#151f30] dark:text-[#cbd5e1]"
              >
                <Copy className="h-3 w-3" />
              </button>
            </div>

            {/* Code Box */}
            <div className="rounded-[10px] border border-[#d5dfea] bg-[#e6ecf4] p-3.5 sm:p-4 font-mono text-[12.5px] sm:text-[13px] leading-[1.65] select-text dark:border-[#222e42] dark:bg-[#0a111c]">
              <div>
                <span className="text-[#64748b] dark:text-[#7f8ea3]">&lt;</span>
                <span className="font-medium text-[#d9465b]">Script</span>
              </div>
              <div className="pl-4">
                <span className="font-medium text-[#a8501f] dark:text-amber-400">
                  src
                </span>
                <span className="text-[#64748b] dark:text-[#7f8ea3]">=</span>
                <span className="text-[#0d9488] dark:text-emerald-400">
            
                </span>
              </div>
              <div className="pl-4">
                <span className="font-medium text-[#a8501f] dark:text-amber-400">
                  data-pid
                </span>
                <span className="text-[#64748b] dark:text-[#7f8ea3]">=</span>
                <span className="text-[#0d9488] dark:text-emerald-400">
                 
                </span>
              </div>
              <div className="pl-4">
                <span className="font-medium text-[#a8501f] dark:text-amber-400">
                  data-domain
                </span>
                <span className="text-[#64748b] dark:text-[#7f8ea3]">=</span>
                <span className="text-[#0d9488] dark:text-emerald-400">
         
                </span>
              </div>
              <div className="pl-4">
                <span className="font-medium text-[#a8501f] dark:text-amber-400">
                  strategy
                </span>
                <span className="text-[#64748b] dark:text-[#7f8ea3]">=</span>
                <span className="text-[#0d9488] dark:text-emerald-400">
                  &quot;afterInteractive&quot;
                </span>
              </div>
              <div>
                <span className="font-medium text-[#2563eb] dark:text-sky-400">
                  /&gt;
                </span>
              </div>
            </div>

            {/* Install with Agent */}
            <div className="mt-3.5 flex items-center justify-between gap-3 rounded-[10px] border border-[#c5d5e8] bg-[#dbe6f6]/85 px-3.5 py-2.5 dark:border-[#2d3d59] dark:bg-[#142137]">
              <div>
                <p className="text-[12px] font-semibold leading-tight text-[#0b1220] dark:text-white">
                  Install with agent
                </p>
                <p className="mt-0.5 text-[11px] leading-tight text-[#4b5565] dark:text-[#a3adbf]">
                  Paste into Cursor, Copilot, or Claude Code.
                </p>
              </div>

              <button
                type="button"
             
                className="flex cursor-pointer items-center gap-1.5 rounded-[7px] border border-[#c7d6e8] bg-white px-2.5 py-1 text-[11.5px] font-semibold text-[#0b1220] shadow-2xs transition hover:bg-slate-50 dark:border-[#2e3e5c] dark:bg-[#182338] dark:text-white"
              >
             
                  <>
                    <Check className="h-3 w-3 text-emerald-600" />
                    <span className="text-emerald-600">Copied</span>
                  </>
             
                  <>
                    <Copy className="h-3 w-3 text-[#4b5565] dark:text-[#a3adbf]" />
                    <span>Copy</span>
                  </>
           
              </button>
            </div>
          </div>

          {/* Checklist */}
          <ul className="my-5 space-y-2">
            <li className="flex items-center gap-2.5 text-[12.5px] text-[#526071] dark:text-[#94a3b8]">
              <Check className="h-4 w-4 shrink-0 stroke-[2.5] text-[#0d9488]" />
              <span>Pageviews, sessions, and journey paths</span>
            </li>
            <li className="flex items-center gap-2.5 text-[12.5px] text-[#526071] dark:text-[#94a3b8]">
              <Check className="h-4 w-4 shrink-0 stroke-[2.5] text-[#0d9488]" />
              <span>Endpoint latency, Core Web Vitals, and ISP context</span>
            </li>
          </ul>

          {/* Actions */}
          <div className="space-y-3">
            {/* Primary Action Button using user's radial gradient */}
            <button
              type="button"
              style={{
                background:
                  "radial-gradient(circle, color(srgb 0.00784314 0.517647 0.780392 / 0.68) 0%, rgb(2, 132, 199) 64%)",
                boxShadow:
                  "0 2px 10px rgba(2, 132, 199, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
              }}
              className="flex h-[42px] w-full cursor-pointer items-center justify-center gap-2 rounded-lg text-[14.5px] font-semibold text-white transition hover:brightness-105 active:scale-[0.99] disabled:opacity-75"
            >
           
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Checking connection...</span>
                </>
            
                <>
                  <Check className="h-4 w-4 stroke-[2.5]" />
                  <span>Connection verified!</span>
                </>
          
                <span>Check connection</span>
  
            </button>

            {/* Secondary Action: Go to dashboard */}
            <Link
              href="/dashboard"
              className="flex h-[42px] w-full cursor-pointer items-center justify-center rounded-lg border border-[#dde2ea] bg-[#f7f8fb] text-[14.5px] font-medium text-[#0b1220] inside-shadow transition hover:bg-[#f0f2f7] dark:border-[#263148] dark:bg-[#0e1522] dark:text-[#f1f4fa] dark:hover:bg-[#151d2e]"
            >
              <span>Go to dashboard</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function OnboardingScriptPage() {
  return (
    <Suspense fallback={null}>
      <OnboardingScriptContent />
    </Suspense>
  );
}
