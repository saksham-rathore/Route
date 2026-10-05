"use client";

import React, { useState } from "react";
import {
  Code2,
  Copy,
  Check,
  Terminal,
  Zap,
  ShieldCheck,
  Sparkles,
  Play,
  ArrowRight,
  Layers,
  Cpu,
} from "lucide-react";

interface FrameworkOption {
  id: string;
  name: string;
  badge: string;
  installCommand?: string;
  snippet: string;
  filename: string;
}

const frameworks: FrameworkOption[] = [
  {
    id: "html",
    name: "HTML / Script Tag",
    badge: "Universal",
    snippet: `<!-- Add to <head> before closing tag -->
<script
  defer
  src="https://cdn.route.dev/telemetry.js"
  data-site-id="rt_live_948f2a1b"
></script>`,
    filename: "index.html",
  },
  {
    id: "nextjs",
    name: "Next.js (App Router)",
    badge: "Recommended",
    installCommand: "npm install @route/analytics",
    snippet: `// app/layout.tsx
import { RouteAnalytics } from "@route/analytics/next";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <RouteAnalytics siteId={process.env.NEXT_PUBLIC_ROUTE_KEY!} />
      </body>
    </html>
  );
}`,
    filename: "app/layout.tsx",
  },
  {
    id: "vite",
    name: "React / Vite",
    badge: "Modern",
    installCommand: "npm install @route/analytics",
    snippet: `// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { initRoute } from "@route/analytics";
import App from "./App";

initRoute({
  siteId: "rt_live_948f2a1b",
  trackWebVitals: true,
});

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);`,
    filename: "src/main.tsx",
  },
  {
    id: "nuxt",
    name: "Nuxt 3",
    badge: "Vue",
    installCommand: "npm install @route/analytics-vue",
    snippet: `// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["@route/analytics-vue/nuxt"],
  routeAnalytics: {
    siteId: "rt_live_948f2a1b",
  },
});`,
    filename: "nuxt.config.ts",
  },
  {
    id: "svelte",
    name: "SvelteKit",
    badge: "Svelte",
    installCommand: "npm install @route/analytics",
    snippet: `<!-- src/routes/+layout.svelte -->
<script>
  import { onMount } from 'svelte';
  import { initRoute } from '@route/analytics';

  onMount(() => {
    initRoute({ siteId: 'rt_live_948f2a1b' });
  });
</script>

<slot />`,
    filename: "+layout.svelte",
  },
];

export const InstallationView = () => {
  const [activeFw, setActiveFw] = useState<FrameworkOption>(frameworks[0]);
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationOutput, setVerificationOutput] = useState<string[] | null>(null);

  const handleCopy = () => {
    const textToCopy = activeFw.installCommand
      ? `${activeFw.installCommand}\n\n${activeFw.snippet}`
      : activeFw.snippet;
    navigator.clipboard?.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const runTestBeacon = () => {
    setIsVerifying(true);
    setVerificationOutput([
      "[*] Initiating test beacon from browser runtime...",
    ]);

    setTimeout(() => {
      setVerificationOutput((prev) => [
        ...(prev || []),
        "[+] Resolving nearest Anycast Edge PoP: iad1 (Ashburn, US)",
        "[+] TLS 1.3 handshake: 8.2ms",
      ]);
    }, 400);

    setTimeout(() => {
      setVerificationOutput((prev) => [
        ...(prev || []),
        "[+] Edge context enriched: ISP: Local Fiber, City: Ashburn, Geo: US",
        "[+] Web vitals payload: LCP 1.1s, INP 42ms, CLS 0.00",
        "[✓] Status 200 OK — Telemetry pipeline verified in 18ms!",
      ]);
      setIsVerifying(false);
    }, 900);
  };

  return (
    <div className="w-full font-instrument-sans text-[#0f172a]">
      {/* Outer Mock Frame */}
      <div className="overflow-hidden rounded-[16px] border border-[#d8e0ea] bg-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),inset_0_2px_6px_0_rgba(15,23,42,0.04),0_12px_40px_-10px_rgba(15,23,42,0.06)]">
        {/* Top Browser Bar */}
        <div className="flex h-10 items-center justify-between border-b border-[#e2e8f0] bg-[#f8fafc] px-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#cbd5e1]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#cbd5e1]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#cbd5e1]" />
          </div>

          <div className="flex h-6 items-center rounded-md border border-[#e2e8f0] bg-white px-3 text-[10px] text-[#64748b]">
            <span className="text-[#94a3b8] mr-1">https://</span>
            app.route.dev/onboarding/installation
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[9.5px] font-semibold text-emerald-700 border border-emerald-200">
              <Zap size={10} />
              &lt; 60 SEC SETUP
            </span>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-4 sm:p-6 lg:p-7 bg-white">
          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-[#f1f5f9]">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[20px] font-semibold tracking-[-0.03em] text-[#0f172a]">
                  One-Line Universal Installation
                </h3>
                <span className="rounded-md bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-700 border border-sky-100">
                  Featherweight &lt; 1.2 KB
                </span>
              </div>
              <p className="text-[12px] text-[#64748b]">
                Zero dependencies. Zero cookie banners. Instant data flow to your dashboard.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-[#64748b]">Project Key:</span>
              <code className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-2.5 py-1 text-[11px] font-mono text-[#2563eb] font-semibold">
                rt_live_948f2a1b
              </code>
            </div>
          </div>

          {/* Framework Selector Pills */}
          <div className="mt-5 flex flex-wrap gap-2">
            {frameworks.map((fw) => (
              <button
                key={fw.id}
                type="button"
                onClick={() => setActiveFw(fw)}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-all border ${
                  activeFw.id === fw.id
                    ? "border-[#2563eb] bg-[#eff6ff] text-[#2563eb] shadow-xs"
                    : "border-[#e2e8f0] bg-white text-[#64748b] hover:border-[#cbd5e1] hover:text-[#0f172a]"
                }`}
              >
                <span>{fw.name}</span>
                <span className={`text-[9.5px] px-1.5 py-0.2 rounded font-medium ${
                  activeFw.id === fw.id ? "bg-[#2563eb] text-white" : "bg-slate-100 text-[#64748b]"
                }`}>
                  {fw.badge}
                </span>
              </button>
            ))}
          </div>

          {/* Code Snippet Box */}
          <div className="mt-4 rounded-xl border border-[#cbd5e1] bg-[#0f172a] text-[#f8fafc] shadow-xs overflow-hidden">
            {/* Snippet Header */}
            <div className="flex items-center justify-between border-b border-[#334155] bg-[#1e293b] px-4 py-2 text-[11px]">
              <span className="font-mono text-[#94a3b8] flex items-center gap-1.5">
                <Code2 size={13} className="text-[#38bdf8]" />
                {activeFw.filename}
              </span>

              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-md bg-[#334155] px-2.5 py-1 text-[10.5px] font-medium text-white transition-colors hover:bg-[#475569]"
              >
                {copied ? (
                  <>
                    <Check size={11} className="text-emerald-400" />
                    <span className="text-emerald-300">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={11} />
                    <span>Copy Snippet</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Content */}
            <div className="p-4 overflow-x-auto text-[12px] font-mono leading-relaxed">
              {activeFw.installCommand && (
                <div className="mb-3 pb-3 border-b border-[#334155]">
                  <span className="text-[#94a3b8] select-none">$ </span>
                  <span className="text-emerald-400 font-semibold">{activeFw.installCommand}</span>
                </div>
              )}
              <pre className="text-[#e2e8f0] whitespace-pre">
                <code>{activeFw.snippet}</code>
              </pre>
            </div>
          </div>

          {/* Live Verification Simulator & Guarantees */}
          <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Live Verification Console */}
            <div className="rounded-xl border border-[#e2e8f0] bg-[#fafbfc] p-4 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#e2e8f0]">
                <div className="flex items-center gap-2">
                  <Terminal size={13} className="text-[#2563eb]" />
                  <span className="text-[12px] font-bold text-[#0f172a]">
                    Live Telemetry Ingestion Simulator
                  </span>
                </div>
                <button
                  type="button"
                  disabled={isVerifying}
                  onClick={runTestBeacon}
                  className="flex items-center gap-1.5 rounded-lg bg-[#2563eb] px-3 py-1 text-[11px] font-medium text-white shadow-xs hover:bg-[#1d4ed8] transition-colors disabled:opacity-50"
                >
                  <Play size={11} fill="currentColor" />
                  <span>{isVerifying ? "Dispatching..." : "Send Test Ping"}</span>
                </button>
              </div>

              {/* Console Body */}
              <div className="mt-3 min-h-[120px] rounded-lg border border-[#cbd5e1] bg-[#090d16] p-3 font-mono text-[10.5px] text-[#e2e8f0]">
                {verificationOutput ? (
                  <div className="space-y-1">
                    {verificationOutput.map((line, idx) => (
                      <p
                        key={idx}
                        className={
                          line.includes("✓")
                            ? "text-emerald-400 font-semibold"
                            : line.includes("[+]")
                            ? "text-sky-300"
                            : "text-[#94a3b8]"
                        }
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center py-6 text-[#64748b]">
                    <Zap size={18} className="text-[#38bdf8] mb-1.5" />
                    <p className="text-[11px]">Click &quot;Send Test Ping&quot; to test your edge pipeline.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Architecture Guarantees */}
            <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-xs">
              <h5 className="text-[12px] font-semibold text-[#0f172a]">
                Why Developers Love Route&apos;s Script
              </h5>

              <div className="mt-3 space-y-2.5">
                {[
                  {
                    title: "Zero Cookies Required",
                    desc: "100% compliant with GDPR, CCPA, and PECR without banner banners.",
                    icon: ShieldCheck,
                    badge: "Privacy First",
                  },
                  {
                    title: "< 1.2 KB Featherweight Script",
                    desc: "45x lighter than Google Analytics. Saves bandwidth on mobile 4G.",
                    icon: Zap,
                    badge: "Ultralight",
                  },
                  {
                    title: "0ms Main Thread Blocking",
                    desc: "Dispatched asynchronously via sendBeacon with zero impact on user interaction.",
                    icon: Cpu,
                    badge: "100% Async",
                  },
                ].map((feat) => {
                  const Icon = feat.icon;
                  return (
                    <div
                      key={feat.title}
                      className="rounded-lg border border-[#e2e8f0] bg-[#fafbfc] p-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[11.5px] font-bold text-[#0f172a]">
                          <Icon size={12} className="text-[#2563eb]" />
                          {feat.title}
                        </span>
                        <span className="rounded bg-sky-50 px-1.5 py-0.2 text-[9px] font-bold text-sky-700 border border-sky-100">
                          {feat.badge}
                        </span>
                      </div>
                      <p className="mt-1 text-[10.5px] text-[#64748b]">
                        {feat.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
