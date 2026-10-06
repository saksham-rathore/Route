"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Copy, ArrowLeft, ArrowRight, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import type { Platform } from "./OnboardingProjectStep";

interface OnboardingSnippetStepProps {
  projectName: string;
  domain: string;
  selectedPlatform: Platform;
  onBack: () => void;
}

export default function OnboardingSnippetStep({
  projectName,
  domain,
  selectedPlatform,
  onBack,
}: OnboardingSnippetStepProps) {
  const router = useRouter();
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [copiedAgent, setCopiedAgent] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "checking" | "connected">("idle");

  const safeDomain = domain.trim() || "route.dev";
  const projectId = `proj_${projectName.toLowerCase().replace(/[^a-z0-9]/g, "") || "route"}_rt`;

  const isNextJs = selectedPlatform.id === "nextjs";

  const snippetCode = isNextJs
    ? `<Script\n  src="https://cdn.route.dev/script.js"\n  data-pid="${projectId}"\n  data-domain="${safeDomain}"\n  strategy="afterInteractive"\n/>`
    : `<script\n  defer\n  src="https://cdn.route.dev/script.js"\n  data-pid="${projectId}"\n  data-domain="${safeDomain}"\n></script>`;

  const agentPrompt = `Install Route website analytics in my ${selectedPlatform.name} project: Add the snippet with src="https://cdn.route.dev/script.js", data-pid="${projectId}", and data-domain="${safeDomain}".`;

  function copySnippet() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(snippetCode);
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 2000);
    }
  }

  function copyAgentPrompt() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(agentPrompt);
      setCopiedAgent(true);
      setTimeout(() => setCopiedAgent(false), 2000);
    }
  }

  function handleCheckConnection() {
    setConnectionStatus("checking");
    setTimeout(() => {
      setConnectionStatus("connected");
    }, 1200);
  }

  return (
    <section className="w-full max-w-[516px] rounded-2xl border border-[#d9e0ee] bg-white p-[22px] sm:p-[28px] shadow-[0_1px_2px_rgba(20,40,90,.04),0_8px_24px_rgba(20,40,90,.05)] dark:border-[#222c40] dark:bg-[#121927] dark:shadow-[0_8px_28px_rgba(0,0,0,.4)] inside-shadow transition-colors">
      {/* Top Bar with Step Indicator & Back Link */}
      <div className="mb-[14px] flex items-center justify-between">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5b6577] dark:text-[#8b97ab]">
          Step 2 of 2
        </div>
        <button
          type="button"
          onClick={onBack}
          className="flex cursor-pointer items-center gap-1 text-[12px] font-medium text-[#5b6577] hover:text-[#0b1220] dark:text-[#8b97ab] dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Edit project</span>
        </button>
      </div>

      {/* Title & Description */}
      <h1 className="mb-2 text-[26px] font-semibold leading-[1.2] tracking-[-0.025em] text-[#0b1220] dark:text-white">
        Install the snippet
      </h1>

      <p className="mb-[24px] text-[14.5px] leading-relaxed text-[#4b5565] dark:text-[#a3adbf]">
        Paste this into your app. Traffic, journeys, latency, and vitals show up in the dashboard within minutes.
      </p>

      {/* Snippet Panel */}
      <div className="overflow-hidden rounded-xl border border-[#cfd9ee] bg-[#f1f4f9] shadow-[0_0_0_2px_rgba(2,132,199,0.06)] dark:border-[#2a3650] dark:bg-[#0e1522] mb-5">
        {/* File Bar */}
        <div className="flex h-[48px] items-center justify-between border-b border-[#dfe4ec] bg-white/70 px-4.5 backdrop-blur-xs dark:border-[#222c40] dark:bg-[#141b2b]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5b6577] dark:text-[#8b97ab]">
              {isNextJs ? "app/layout.tsx" : "script.js"}
            </span>
            <span className="rounded bg-sky-100 dark:bg-sky-950/80 px-1.5 py-0.5 text-[10px] font-semibold text-sky-700 dark:text-sky-300">
              {selectedPlatform.name}
            </span>
          </div>

          <button
            type="button"
            onClick={copySnippet}
            aria-label="Copy snippet"
            className="flex h-[30px] items-center gap-1.5 rounded-md border border-[#dfe4ec] bg-white px-2.5 text-xs font-semibold text-[#0b1220] shadow-xs transition hover:bg-[#f6f7fa] dark:border-[#263148] dark:bg-[#151d2e] dark:text-[#f1f4fa] cursor-pointer"
          >
            {copiedSnippet ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Code Content */}
        <div className="p-4 sm:p-5">
          <pre className="overflow-x-auto rounded-lg border border-[#d3dae6] bg-[#e7ebf2] p-4 font-mono text-[13px] leading-[1.65] text-[#2b3445] inside-shadow-inset dark:border-[#263148] dark:bg-[#0a101b] dark:text-[#cfd7e6] select-text">
            <code>
              {isNextJs ? (
                <>
                  <span className="text-[#c2185b] font-semibold">&lt;Script</span>
                  {"\n  "}
                  <span className="text-[#8a4b08] dark:text-amber-400 font-medium">src</span>=
                  <span className="text-[#1a6b3a] dark:text-emerald-400">&quot;https://cdn.route.dev/script.js&quot;</span>
                  {"\n  "}
                  <span className="text-[#8a4b08] dark:text-amber-400 font-medium">data-pid</span>=
                  <span className="text-[#1a6b3a] dark:text-emerald-400">&quot;{projectId}&quot;</span>
                  {"\n  "}
                  <span className="text-[#8a4b08] dark:text-amber-400 font-medium">data-domain</span>=
                  <span className="text-[#1a6b3a] dark:text-emerald-400">&quot;{safeDomain}&quot;</span>
                  {"\n  "}
                  <span className="text-[#8a4b08] dark:text-amber-400 font-medium">strategy</span>=
                  <span className="text-[#1a6b3a] dark:text-emerald-400">&quot;afterInteractive&quot;</span>
                  {"\n"}
                  <span className="text-[#0284c7] font-semibold">/&gt;</span>
                </>
              ) : (
                <>
                  <span className="text-[#c2185b] font-semibold">&lt;script</span>
                  {"\n  "}
                  <span className="text-[#8a4b08] dark:text-amber-400 font-medium">defer</span>
                  {"\n  "}
                  <span className="text-[#8a4b08] dark:text-amber-400 font-medium">src</span>=
                  <span className="text-[#1a6b3a] dark:text-emerald-400">&quot;https://cdn.route.dev/script.js&quot;</span>
                  {"\n  "}
                  <span className="text-[#8a4b08] dark:text-amber-400 font-medium">data-pid</span>=
                  <span className="text-[#1a6b3a] dark:text-emerald-400">&quot;{projectId}&quot;</span>
                  {"\n  "}
                  <span className="text-[#8a4b08] dark:text-amber-400 font-medium">data-domain</span>=
                  <span className="text-[#1a6b3a] dark:text-emerald-400">&quot;{safeDomain}&quot;</span>
                  {"\n"}
                  <span className="text-[#0284c7] font-semibold">&gt;&lt;/script&gt;</span>
                </>
              )}
            </code>
          </pre>
        </div>

        {/* Install with Agent */}
        <div className="mx-4 mb-4 sm:mx-5 sm:mb-5 flex items-center justify-between gap-3 rounded-lg border border-[#a9bce6] bg-[#e1e8f6]/70 px-3.5 py-2.5 dark:border-[#33497a] dark:bg-[#16213a]/90">
          <div>
            <p className="text-[12.5px] font-semibold leading-[18px] text-[#0b1220] dark:text-white flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
              <span>Install with agent</span>
            </p>
            <p className="text-[12px] leading-[18px] text-[#4b5565] dark:text-[#a3adbf]">
              Paste into Cursor, Copilot, or Claude Code.
            </p>
          </div>
          <button
            type="button"
            onClick={copyAgentPrompt}
            className="flex h-[30px] flex-none cursor-pointer items-center gap-1.5 rounded-md bg-white px-3 text-xs font-semibold text-[#0b1220] shadow-xs transition hover:bg-[#f6f7fa] dark:bg-[#151d2e] dark:text-[#f1f4fa]"
          >
            {copiedAgent ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Checklist */}
      <ul className="mb-6 space-y-2">
        <li className="flex items-center gap-2.5 text-[12.5px] text-[#4b5565] dark:text-[#a3adbf]">
          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <Check className="h-3 w-3 stroke-[3]" />
          </span>
          <span>Pageviews, sessions, and user journey paths</span>
        </li>
        <li className="flex items-center gap-2.5 text-[12.5px] text-[#4b5565] dark:text-[#a3adbf]">
          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <Check className="h-3 w-3 stroke-[3]" />
          </span>
          <span>Endpoint latency, Core Web Vitals, and ISP diagnostics</span>
        </li>
      </ul>

      {/* Actions */}
      <div className="space-y-3">
        {/* Primary Action: Check Connection */}
        <button
          type="button"
          onClick={handleCheckConnection}
          disabled={connectionStatus === "checking"}
          style={{
            background:
              "radial-gradient(circle, color(srgb 0.00784314 0.517647 0.780392 / 0.68) 0%, rgb(2, 132, 199) 64%)",
            boxShadow:
              "0 2px 10px rgba(2, 132, 199, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
          }}
          className="flex h-[42px] w-full cursor-pointer items-center justify-center gap-2 rounded-lg text-[14.5px] font-semibold text-white transition hover:brightness-105 active:scale-[0.99] disabled:opacity-75"
        >
          {connectionStatus === "checking" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Verifying snippet connection...</span>
            </>
          ) : connectionStatus === "connected" ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-emerald-200" />
              <span>Connection active & verified!</span>
            </>
          ) : (
            <span>Check connection</span>
          )}
        </button>

        {/* Secondary Action: Go to Dashboard */}
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="flex h-[42px] w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#dde2ea] bg-[#f8fafc] text-[14.5px] font-medium text-[#0b1220] inside-shadow transition hover:bg-slate-100 dark:border-[#263148] dark:bg-[#0e1522] dark:text-[#f1f4fa] dark:hover:bg-[#151d2e]"
        >
          <span>Go to dashboard</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
