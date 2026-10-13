import React, { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  Copy,
  GitBranch,
  Globe2,
  HeartPulse,
  MousePointer2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import Navbar from "../Navbar";
import RouteBento from "../RouteBento";
import { SnippetCopyButton } from "../SnippetCopyButton";
import { div } from "framer-motion/client";
import { HowItWorks } from "../HowItWorks";
import { Footer } from "../Footer";
import { PlatformSection } from "../Platform";
import { FAQ } from "../FAQ";
import { StaticDashboardMock } from "../dashboard/StaticDashboardMock";

const trafficSources = [
  { name: "Google", value: 48, visitors: "12,842" },
  { name: "Direct", value: 27, visitors: "7,231" },
  { name: "Twitter / X", value: 14, visitors: "3,749" },
  { name: "LinkedIn", value: 8, visitors: "2,143" },
  { name: "Other", value: 3, visitors: "804" },
];

const events = [
  ["Page view", "/pricing", "2s ago"],
  ["Button click", "Start free", "8s ago"],
  ["Page view", "/features", "14s ago"],
  ["Signup", "New account", "21s ago"],
];

function BrowserWindow() {
  return (
    <div className="relative mx-auto my-6 sm:my-10 w-full max-w-[1280px] px-2 sm:px-6 md:px-10">
      {/* 1. EXTERIOR BORDER GRID LINES & ARCHITECTURAL BLUEPRINT ACCENTS     */}

      {/* Subtle blueprint grid pattern radiating outside the card */}
      <div
        className="pointer-events-none absolute -inset-x-8 sm:-inset-x-16 -inset-y-10 sm:-inset-y-16 -z-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(203, 213, 225, 0.28) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(203, 213, 225, 0.28) 1px, transparent 1px)
          `,
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse 65% 55% at 50% 50%, #000 35%, transparent 95%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 65% 55% at 50% 50%, #000 35%, transparent 95%)",
        }}
      />

      {/* Soft ambient background glow matching Route palette */}
      <div className="pointer-events-none absolute inset-x-8 inset-y-6 -z-10 rounded-[32px] bg-[radial-gradient(ellipse_at_center,rgba(224,236,255,0.7)_0%,rgba(241,245,249,0.35)_50%,transparent_75%)] blur-2xl opacity-75" />

      {/* Extended Outer Guide Grid Lines */}
      {/* Top horizontal extended border line */}
      <div className="pointer-events-none absolute -top-px left-[-40px] right-[-40px] sm:left-[-100px] sm:right-[-100px] h-[1px] bg-gradient-to-r from-transparent via-[#cbd5e1] to-transparent" />
      {/* Secondary Top guide line */}
      <div className="pointer-events-none absolute -top-6 left-[-20px] right-[-20px] sm:left-[-60px] sm:right-[-60px] h-[1px] border-t border-dashed border-[#e2e8f0]" />

      {/* Bottom horizontal extended border line */}
      <div className="pointer-events-none absolute -bottom-px left-[-40px] right-[-40px] sm:left-[-100px] sm:right-[-100px] h-[1px] bg-gradient-to-r from-transparent via-[#cbd5e1] to-transparent" />
      {/* Secondary Bottom guide line */}
      <div className="pointer-events-none absolute -bottom-6 left-[-20px] right-[-20px] sm:left-[-60px] sm:right-[-60px] h-[1px] border-b border-dashed border-[#e2e8f0]" />

      {/* Left vertical extended border line */}
      <div className="pointer-events-none absolute -left-px top-[-30px] bottom-[-30px] sm:top-[-60px] sm:bottom-[-60px] w-[1px] bg-gradient-to-b from-transparent via-[#cbd5e1] to-transparent" />
      {/* Secondary Left guide line */}
      <div className="pointer-events-none absolute -left-6 top-[-20px] bottom-[-20px] sm:top-[-40px] sm:bottom-[-40px] w-[1px] border-l border-dashed border-[#e2e8f0]" />

      {/* Right vertical extended border line */}
      <div className="pointer-events-none absolute -right-px top-[-30px] bottom-[-30px] sm:top-[-60px] sm:bottom-[-60px] w-[1px] bg-gradient-to-b from-transparent via-[#cbd5e1] to-transparent" />
      {/* Secondary Right guide line */}
      <div className="pointer-events-none absolute -right-6 top-[-20px] bottom-[-20px] sm:top-[-40px] sm:bottom-[-40px] w-[1px] border-r border-dashed border-[#e2e8f0]" />

      {/* Technical Corner Crosshairs (+) */}
      <span className="pointer-events-none absolute -top-3 -left-3 z-20 font-mono text-[13px] font-light leading-none text-[#94a3b8] select-none">
        +
      </span>
      <span className="pointer-events-none absolute -top-3 -right-3 z-20 font-mono text-[13px] font-light leading-none text-[#94a3b8] select-none">
        +
      </span>
      <span className="pointer-events-none absolute -bottom-3 -left-3 z-20 font-mono text-[13px] font-light leading-none text-[#94a3b8] select-none">
        +
      </span>
      <span className="pointer-events-none absolute -bottom-3 -right-3 z-20 font-mono text-[13px] font-light leading-none text-[#94a3b8] select-none">
        +
      </span>

      {/* 2. OUTER PRESENTATION CARD (Exact previous colors, shadow & fonts) */}
      <div
        className="relative z-10 rounded-[20px] sm:rounded-[24px] border border-[#d6dde8] bg-white p-3.5 sm:p-5 lg:p-5.5 text-left"
        style={{
          boxShadow:
            "rgba(255, 255, 255, 0.85) 0px 1px 0px 0px inset, rgba(15, 23, 42, 0.08) 0px 2px 8px 0px inset, rgba(15, 23, 42, 0.05) 0px -1px 0px 0px inset, rgba(15, 23, 42, 0.04) 0px 20px 50px -10px",
        }}
      >
        {/* Card Eyebrow & Title matching screenshot */}
        <div className="mb-3 sm:mb-3.5">
          <p className="text-[10.5px] sm:text-[11.5px] font-bold uppercase tracking-[0.2em] text-[#0284C7] font-instrument-sans">
            USER ANALYTICS
          </p>
          <h3 className="mt-1 text-[20px] sm:text-[24px] font-semibold tracking-[-0.03em] text-[#0f172a] font-lastik">
            See how users actually use your product.
          </h3>
        </div>

        {/* 3. INNER BROWSER MOCK FRAME (Clean neutral dots & previous styling)*/}
        <div className="overflow-hidden rounded-[16px] border border-[#d8e0ea] bg-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),inset_0_2px_6px_0_rgba(15,23,42,0.04),0_12px_40px_-10px_rgba(15,23,42,0.06)]">
          {/* Top Browser Bar */}
          <div className="flex h-10 items-center justify-between border-b border-[#e2e8f0] bg-[#f8fafc] px-4 font-instrument-sans">
            {/* 3 Neutral Dots matching screenshot */}
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#cbd5e1]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#cbd5e1]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#cbd5e1]" />
            </div>

            {/* Address bar pill */}
            <div className="flex h-6 items-center rounded-md border border-[#e2e8f0] bg-white px-3 text-[10px] text-[#64748b]">
              <span className="text-[#94a3b8] mr-1">https://</span>
              app.route.dev/analytics/user-behavior
            </div>

            {/* DEMO DATA badge matching screenshot */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[9.5px] font-semibold text-blue-700 font-instrument-sans">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0284C7] animate-pulse" />
                DEMO DATA
              </span>
            </div>
          </div>

          {/* 1st Component: Overview Dashboard (Rendered UI component without working backend) */}
          <div className="relative w-full bg-white overflow-hidden">
            <StaticDashboardMock initialTab="overview" />
          </div>
        </div>
      </div>
    </div>
  );
}

function EventPanel() {
  return (
    <div className="rounded-[20px] border border-[#d8d3c8] bg-[#fbfaf7] p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[11px] text-[#8b877e]">Live activity</p>
          <p className="mt-1 text-[20px] font-semibold tracking-[-0.04em]">
            What&apos;s happening now
          </p>
        </div>

        <div className="flex items-center gap-2 text-[9px] text-[#77736c]">
          <span className="h-2 w-2 rounded-full bg-[#24231f]" />
          Live
        </div>
      </div>

      <div className="divide-y divide-[#e5e1d8]">
        {events.map(([event, detail, time]) => (
          <div
            key={`${event}-${detail}`}
            className="flex items-center justify-between py-4"
          >
            <div>
              <p className="text-[11px] font-semibold">{event}</p>
              <p className="mt-1 text-[10px] text-[#8b877e]">{detail}</p>
            </div>

            <span className="text-[9px] text-[#aaa49a]">{time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FunnelPanel() {
  return (
    <div className="rounded-[20px] border border-[#d8d3c8] bg-white p-6">
      <div className="mb-7">
        <p className="text-[11px] text-[#8b877e]">Signup funnel</p>
        <p className="mt-1 text-[20px] font-semibold tracking-[-0.04em]">
          From visit to customer
        </p>
      </div>

      <div className="space-y-3">
        {[
          ["Visitors", "26,769", "100%"],
          ["Viewed pricing", "8,421", "31.5%"],
          ["Started signup", "4,281", "16.0%"],
          ["Created account", "2,841", "10.6%"],
        ].map(([name, value, percentage], index) => (
          <div key={name}>
            <div className="mb-2 flex justify-between text-[10px]">
              <span>{name}</span>
              <span className="text-[#8b877e]">
                {value} · {percentage}
              </span>
            </div>

            <div className="h-9 overflow-hidden rounded-lg bg-[#e8e4db]">
              <div
                className="flex h-full items-center bg-[#24231f] px-3 text-[9px] text-white"
                style={{ width: `${100 - index * 18}%` }}
              >
                {percentage}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RevenuePanel() {
  return (
    <div className="rounded-[20px] border border-[#d8d3c8] bg-white p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] text-[#8b877e]">Revenue</p>
          <p className="mt-1 text-[28px] font-semibold tracking-[-0.05em]">
            $84,420
          </p>
          <p className="mt-1 text-[10px] text-[#77736c]">
            +18.8% compared to last month
          </p>
        </div>

        <TrendingUp size={19} strokeWidth={1.5} />
      </div>

      <div className="mt-8 h-36">
        <svg
          viewBox="0 0 600 140"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <path
            d="M0 115 C60 108 70 95 120 98 S180 110 225 78 S280 88 325 62 S390 75 425 55 S490 68 530 30 S570 36 600 18"
            fill="none"
            stroke="#24231f"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  );
}

function Feature({
  number,
  eyebrow,
  title,
  description,
  children,
}: {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-[#d8d3c8] py-24">
      <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <div className="mb-8 flex items-center gap-4">
            <span className="text-[12px] font-medium text-[#8c887f]">
              {number}
            </span>

            <span className="h-px w-10 bg-[#cfc9be]" />

            <span className="text-[11px] uppercase tracking-[0.16em] text-[#8c887f]">
              {eyebrow}
            </span>
          </div>

          <h2 className="font-lastik text-[42px] leading-[1.05] tracking-[-0.035em] md:text-[54px]">
            {title}
          </h2>

          <p className="mt-6 max-w-[470px] text-[16px] font-medium leading-7 text-[#77736c]">
            {description}
          </p>

          <a
            href="#"
            className="mt-8 inline-flex items-center gap-2 text-[13px] font-semibold"
          >
            Explore {eyebrow.toLowerCase()}
            <ArrowRight size={15} />
          </a>
        </div>

        <div>{children}</div>
      </div>
    </section>
  );
}

function Nav() {
  return (
    <header>
      <Navbar />
    </header>
  );
}

export default function Home() {
  const [activeHeroTab, setActiveHeroTab] = useState<
    "pageviews" | "journeys" | "vitals"
  >("pageviews");

  return (
    <main className="overflow-hidden bg-white text-[#24231f]">
      <Nav />

      {/* HERO */}
      <section className="mx-auto max-w-[1400px] px-4 pb-24 pt-24 text-center md:pb-32 md:pt-32 sm:px-6 lg:px-8">
        <div className="group relative mx-auto flex w-fit cursor-pointer items-center justify-center overflow-hidden rounded-full p-[1.5px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_25px_-4px_rgba(154,115,248,0.28)] active:translate-y-0 active:scale-[0.98]">
          {/* Base border background */}
          <div className="absolute inset-0 rounded-full bg-[#d8d3c8]/80 transition-colors duration-300 group-hover:bg-[#c4bed3]" />

          {/* Animated line tracing around the border (border beam) */}
          <div className="absolute inset-[-1000%] animate-border-line bg-[conic-gradient(from_0deg,transparent_0_300deg,#9a73f8_340deg,#d8b4fe_355deg,transparent_360deg)] opacity-90 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Badge inner pill */}
          <div className="relative z-10 flex items-center gap-2 rounded-full bg-[#fbfaf7] px-4 py-2 font-instrument-sans transition-colors duration-300 group-hover:bg-white">
            <div className="pointer-events-none absolute inset-0 -translate-x-full rounded-full bg-gradient-to-r from-transparent via-white/80 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
            <img
              src="/svg_35.svg"
              alt=""
              className="relative z-10 h-[19px] w-[19px] transition-transform duration-500 ease-out group-hover:scale-125 group-hover:rotate-12"
            />
            <span className="relative z-10 font-instrument-sans text-[13px] font-medium leading-[19.5px] text-[#505050] transition-colors duration-300 group-hover:text-[#18161b]">
              Privacy-first website analytics
              <span className="absolute -bottom-0.5 left-0 h-[1.5px] w-0 rounded-full bg-gradient-to-r from-[#9a73f8] to-[#60a5fa] transition-all duration-300 ease-out group-hover:w-full" />
            </span>
          </div>
        </div>

        <h1
          className="font-lastik mx-auto mt-8 max-w-[980px] text-center text-[#24231f]"
          style={{
            fontSize: "clamp(44px, 8vw, 70px)",
            lineHeight: 1.05,
            letterSpacing: "-0.07em",
          }}
        >
          Understand what your website is <br />
          <span className="text-sky-600">really doing.</span>
        </h1>

        <p className="mx-auto mb-3 mt-8 max-w-[720px] px-1 text-center text-[16px] font-medium leading-[1.42] tracking-[-0.02em] text-[#77736c] sm:mb-6 sm:px-5 sm:text-[20px]">
          Route turns traffic, behavior, conversion, and revenue into one clear
          picture — without invasive tracking or complicated dashboards.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="/auth/sign-up"
            className="inline-flex items-center justify-center rounded-[14px] bg-[#0284C7] px-7 py-2.5 text-[15px] font-semibold text-white font-instrument shadow-[0_2px_10px_rgba(2,132,199,0.32),inset_0_1px_0_rgba(255,255,255,0.25)] transition-all hover:brightness-105 active:scale-[0.99]"
          >
            Start for free
          </a>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-[14px] border border-[#cbd5e1] bg-white px-7 py-2.5 text-[15px] font-medium text-[#1e293b] font-instrument transition-all hover:bg-slate-50/90 active:scale-[0.99]"
            style={{
              boxShadow:
                "inset 0 1.5px 2px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.05)",
            }}
          >
            Get a demo
          </button>
        </div>

        {/* 4 AI Logos directly imported from public SVGs */}
        <div className="mt-5 flex items-center justify-center gap-6 sm:gap-7">
          <img
            src="/GPT.svg"
            alt="OpenAI ChatGPT"
            className="h-[18px] w-[18px] object-contain transition-transform duration-200 hover:scale-110 cursor-pointer"
            title="OpenAI ChatGPT"
          />
          <img
            src="/Claude.svg"
            alt="Anthropic Claude"
            className="h-[18px] w-[18px] object-contain transition-transform duration-200 hover:scale-110 cursor-pointer"
            title="Anthropic Claude"
          />
          <img
            src="/Perplexity.svg"
            alt="Perplexity AI"
            className="h-[18px] w-[18px] object-contain transition-transform duration-200 hover:scale-110 cursor-pointer"
            title="Perplexity AI"
          />
          <img
            src="/Grok.svg"
            alt="xAI Grok"
            className="h-[18px] w-[18px] object-contain transition-transform duration-200 hover:scale-110 cursor-pointer"
            title="xAI Grok"
          />
        </div>

        {/* 3 Highlight Chips */}
        <div className="mt-10 sm:mt-20 flex flex-wrap items-center justify-center gap-3">
          <div
            className="inline-flex items-center gap-2 rounded-[9px] border border-[#cbd5e1] bg-white px-3.5 py-1.5 transition-all cursor-pointer hover:bg-slate-50/80"
            style={{
              boxShadow:
                "inset 0 1.5px 3px rgba(0, 0, 0, 0.08), inset 0 0 0 1px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.04)",
            }}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-[6px] border border-[#fde68a] bg-[#fef3c7] text-[#d97706]">
              <BarChart3 size={13} strokeWidth={2.4} />
            </span>
            <span className="text-[13px] font-medium font-instrument text-[#1e293b]">
              Pageviews & sessions
            </span>
          </div>

          <div
            className="inline-flex items-center gap-2 rounded-[9px] border border-[#cbd5e1] bg-white px-3.5 py-1.5 transition-all cursor-pointer hover:bg-slate-50/80"
            style={{
              boxShadow:
                "inset 0 1.5px 3px rgba(0, 0, 0, 0.08), inset 0 0 0 1px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.04)",
            }}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-[6px] border border-[#99f6e4] bg-[#ccfbf1] text-[#0d9488]">
              <GitBranch size={13} strokeWidth={2.4} />
            </span>
            <span className="text-[13px] font-medium font-instrument text-[#1e293b]">
              Journey paths
            </span>
          </div>

          <div
            className="inline-flex items-center gap-2 rounded-[9px] border border-[#cbd5e1] bg-white px-3.5 py-1.5 transition-all cursor-pointer hover:bg-slate-50/80"
            style={{
              boxShadow:
                "inset 0 1.5px 3px rgba(0, 0, 0, 0.08), inset 0 0 0 1px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.04)",
            }}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-[6px] border border-[#ddd6fe] bg-[#ede9fe] text-[#8b5cf6]">
              <HeartPulse size={13} strokeWidth={2.4} />
            </span>
            <span className="text-[13px] font-medium font-instrument text-[#1e293b]">
              Core Web Vitals
            </span>
          </div>
        </div>

        {/* Dashboard (BrowserWindow) */}
        <div className="mt-4 sm:mt-4 text-left">
          <BrowserWindow />
        </div>
        <div id="features" className="mt-24 sm:mt-28">
          <RouteBento />
        </div>
      </section>

      {/* INTRO: HOW IT WORKS */}
      <div>
        <HowItWorks />
      </div>

      {/* PLATFORM SYSTEMS (User Analytics, Observability, ISP Diagnostics, Web Vitals, Installation) */}
      <PlatformSection />

      {/* FAQ SECTION */}
      <FAQ />

      {/* FOOTER */}
      <Footer />
    </main>
  );
}
