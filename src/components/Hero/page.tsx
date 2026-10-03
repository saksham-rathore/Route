"use client";

import React from "react";

export const Hero = () => {
  return (
    <section className="pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Announcement Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/90 border border-blue-200 text-xs font-medium text-blue-700 mb-8 hover:bg-blue-100/70 transition-colors cursor-pointer shadow-xs">
          <span className="flex h-1.5 w-1.5 rounded-full bg-blue-600 animate-ping" />
          <span className="font-semibold">Next-Gen Telemetry Beacon</span>
          <span className="text-zinc-400">|</span>
          <span className="text-zinc-600">Cookie-Free &amp; Under 1.2KB</span>
          <svg
            className="w-3.5 h-3.5 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>

        {/* Giant Headline with Typography Precision */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-zinc-950 leading-[1.06] max-w-4xl">
          Web{" "}
          <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600">
            analytics
            <svg
              aria-hidden="true"
              viewBox="0 0 120 18"
              preserveAspectRatio="none"
              className="absolute left-0 -bottom-1.5 w-full h-2 text-blue-500"
            >
              <path
                d="M4 10 C 16 7, 28 13, 40 10 S 64 7, 76 10 S 100 13, 116 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </span>{" "}
          and network{" "}
          <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-600">
            observability
            <svg
              aria-hidden="true"
              viewBox="0 0 120 18"
              preserveAspectRatio="none"
              className="absolute left-0 -bottom-1.5 w-full h-2 text-indigo-500"
            >
              <path
                d="M4 10 C 16 7, 28 13, 40 10 S 64 7, 76 10 S 100 13, 116 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </span>{" "}
          for real users.
        </h1>

        {/* Subtitle */}
        <p className="mt-6 max-w-2xl text-base sm:text-lg text-zinc-600 leading-relaxed font-normal">
          Web analytics and network observability for humans and AI agents.
          Track journeys, Core Web Vitals, API latency, error stack traces,
          and ISP diagnostics from one lightweight beacon.
        </p>

        {/* CTA Group */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <a
            href="#demo"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-[0_4px_16px_rgba(37,99,235,0.3)] transition-all hover:scale-[1.02]"
          >
            <span>Start for free</span>
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>

          <a
            href="#demo"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-zinc-800 hover:text-zinc-950 bg-white hover:bg-zinc-50 border border-zinc-300 shadow-xs transition-all hover:border-zinc-400"
          >
            <svg
              className="w-4 h-4 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Get a live demo</span>
          </a>
        </div>

        {/* Ask AI Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-zinc-500">
          <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 font-medium">
            Ask AI about Route:
          </span>
          <div className="flex items-center gap-1.5">
            <a
              href="https://chatgpt.com/?q=Tell+me+about+Route+web+analytics+and+network+observability"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 rounded-md bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 hover:text-zinc-950 transition shadow-2xs flex items-center gap-1.5"
              title="Ask ChatGPT about Route"
            >
              <svg className="w-3.5 h-3.5 text-zinc-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12z" />
              </svg>
              ChatGPT
            </a>
            <a
              href="https://claude.ai"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 rounded-md bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 hover:text-[#d97757] transition shadow-2xs flex items-center gap-1.5"
              title="Ask Claude about Route"
            >
              <svg className="w-3.5 h-3.5 text-[#d97757]" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="9" />
              </svg>
              Claude
            </a>
            <a
              href="https://www.perplexity.ai"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1 rounded-md bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 hover:text-[#20b8cd] transition shadow-2xs flex items-center gap-1.5"
              title="Ask Perplexity about Route"
            >
              <svg className="w-3.5 h-3.5 text-[#20b8cd]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <line x1="12" y1="4" x2="12" y2="20" />
              </svg>
              Perplexity
            </a>
          </div>
        </div>

        {/* Quick Metrics Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white border border-zinc-200 text-zinc-700 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            &lt; 1.2 KB Script
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white border border-zinc-200 text-zinc-700 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            100% Cookie-Free &amp; GDPR
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white border border-zinc-200 text-zinc-700 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            Real-Time Journey Paths
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white border border-zinc-200 text-zinc-700 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            ISP &amp; Carrier Latency
          </span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
