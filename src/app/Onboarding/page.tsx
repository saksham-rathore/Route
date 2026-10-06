"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Moon, Sun, Check, ArrowRight } from "lucide-react";

interface Platform {
  id: string;
  name: string;
  letter: string;
  badgeBg: string;
  badgeText: string;
}

const platforms: Platform[] = [
  { id: "nextjs", name: "Next.js", letter: "N", badgeBg: "bg-black", badgeText: "text-white" },
  { id: "react", name: "React", letter: "R", badgeBg: "bg-[#0a8fb5]", badgeText: "text-white" },
  { id: "vue", name: "Vue", letter: "V", badgeBg: "bg-[#2f9e6e]", badgeText: "text-white" },
  { id: "svelte", name: "Svelte", letter: "S", badgeBg: "bg-[#e0451f]", badgeText: "text-white" },
  { id: "angular", name: "Angular", letter: "A", badgeBg: "bg-[#c2262e]", badgeText: "text-white" },
  { id: "wordpress", name: "WordPress", letter: "W", badgeBg: "bg-[#2a6aa1]", badgeText: "text-white" },
  { id: "html", name: "HTML", letter: "H", badgeBg: "bg-[#e2662b]", badgeText: "text-white" },
];

export default function OnboardingPage() {

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
            
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:py-20">
        <section className="h-fit w-full max-w-[516px] rounded-2xl border border-[#d9e0ee] bg-white p-[22px] sm:p-[28px] shadow-[0_1px_2px_rgba(20,40,90,.04),0_8px_24px_rgba(20,40,90,.05)] dark:border-[#222c40] dark:bg-[#121927] dark:shadow-[0_8px_28px_rgba(0,0,0,.4)] inside-shadow transition-colors">
          {/* Step Badge */}
          <div className="mb-[14px] text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5b6577] dark:text-[#8b97ab]">
            Step 1 of 2
          </div>

          {/* Title & Description */}
          <h1 className="mb-2 text-[26px] font-semibold leading-[1.2] tracking-[-0.025em] text-[#0b1220] dark:text-white">
            Create your first project
          </h1>

          <p className="mb-[26px] text-[14.5px] leading-relaxed text-[#4b5565] dark:text-[#a3adbf]">
            One script tag unlocks user analytics and real-user observability for your app.
          </p>

          <form>
            {/* Project Name */}
            <div className="mb-[22px]">
              <label
                htmlFor="projectName"
                className="mb-[8px] block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5b6577] dark:text-[#8b97ab]"
              >
                Project name
              </label>
              <input
                id="projectName"
                type="text"
        
                placeholder="my-app"
                required
                autoComplete="off"
                className="h-[42px] w-full rounded-lg border border-[#dde2ea] bg-white px-4 text-[14.5px] text-[#0b1220] outline-none transition-all placeholder:text-[#8a93a3] hover:border-[#c4ccda] focus:border-[#0284c7] focus:ring-2 focus:ring-[#0284c7]/20 inside-shadow-inset dark:border-[#263148] dark:bg-[#0e1522] dark:text-white dark:placeholder:text-[#5f6b80]"
              />
            </div>

            {/* Domain */}
            <div className="mb-[22px]">
              <label
                htmlFor="domain"
                className="mb-[8px] block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5b6577] dark:text-[#8b97ab]"
              >
                Domain
              </label>
              <input
                id="domain"
                type="text"
        
                placeholder="route.dev"
                required
                autoComplete="off"
                className="h-[42px] w-full rounded-lg border border-[#dde2ea] bg-white px-4 text-[14.5px] text-[#0b1220] outline-none transition-all placeholder:text-[#8a93a3] hover:border-[#c4ccda] focus:border-[#0284c7] focus:ring-2 focus:ring-[#0284c7]/20 inside-shadow-inset dark:border-[#263148] dark:bg-[#0e1522] dark:text-white dark:placeholder:text-[#5f6b80]"
              />
              <p className="mt-2 text-xs text-[#6b7585] dark:text-[#8590a3]">
                Public production domain only — no localhost or private IPs.
              </p>
            </div>

            {/* Platform Dropdown */}
            <div className="mb-[26px]">
              <label className="mb-[8px] block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5b6577] dark:text-[#8b97ab]">
                Platform
              </label>

              <div className="relative">
                <button
                  type="button"
                  className="flex h-[42px] w-full cursor-pointer items-center justify-between rounded-lg border border-[#dde2ea] bg-white px-3.5 text-[14.5px] transition hover:border-[#c4ccda] focus:border-[#0284c7] focus:ring-2 focus:ring-[#0284c7]/20 inside-shadow-inset dark:border-[#263148] dark:bg-[#0e1522]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] font-bold text-white">
                      N
                    </span>
                    <span className="font-medium text-[#0b1220] dark:text-white">
                      Next.js
                    </span>
                  </div>

                  <ChevronDown className="h-4 w-4 text-[#5b6577] transition-transform duration-200 dark:text-[#8b97ab]" />
                </button>
              </div>
            </div>

            {/* Submit Button with Previous Signature Radial Gradient */}
            <button
              type="submit"
              style={{
                background:
                  "radial-gradient(circle, color(srgb 0.00784314 0.517647 0.780392 / 0.68) 0%, rgb(2, 132, 199) 64%)",
                boxShadow:
                  "0 2px 10px rgba(2, 132, 199, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
              }}
              className="flex h-[42px] w-full cursor-pointer items-center justify-center gap-2 rounded-lg text-[14.5px] font-semibold text-white transition hover:brightness-105 active:scale-[0.99]"
            >
              <span>Create project</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}