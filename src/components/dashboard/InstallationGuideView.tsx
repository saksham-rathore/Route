"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Terminal, Play, Zap } from "lucide-react";
import { FRAMEWORKS, getSnippet, type FrameworkId } from "@/lib/stacks";

import { useProjectRealtime } from "@/hooks/use-project-realtime";

interface Props {
  projectId: string;
  domain: string;
  initialFramework?: string | null;
  realtime?: { connected: boolean; live: boolean };
}

function validFw(v: string | null | undefined): FrameworkId {
  return (FRAMEWORKS.some((f) => f.id === v) ? v : "nextjs") as FrameworkId;
}

export default function InstallationGuideView({ projectId, domain, initialFramework, realtime }: Props) {
  const [fw, setFw] = useState<FrameworkId>(validFw(initialFramework));
  const [copied, setCopied] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [log, setLog] = useState<string[] | null>(null);
  // If parent already subscribed (dashboard header), reuse it; else subscribe here (standalone use).
  const own = useProjectRealtime(realtime ? null : projectId || null);
  const connected = realtime?.connected ?? own.connected;
  const live = realtime?.live ?? own.live;

  const beaconSrc = typeof window !== "undefined" ? `${window.location.origin}/beacon.js` : "/beacon.js";
  const beaconApi = typeof window !== "undefined" ? `${window.location.origin}/api/collect` : "/api/collect";
  const snippet = useMemo(() => getSnippet(fw, { beaconSrc, beaconApi, projectId, domain }), [fw, beaconSrc, beaconApi, projectId, domain]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
    } catch {
      /* clipboard unavailable */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const verify = async () => {
    setVerifying(true);
    setLog(["[*] Sending test ping to /api/collect ..."]);
    try {
      const res = await fetch("/api/collect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: projectId,
          session_id: `verify_${Date.now()}`,
          visitor_id: "verify_visitor",
          host: domain,
          page: "/verify-installation",
          device: { device: "desktop", browser: "verify" },
          events: [{ type: "page_view", name: "page_view", properties: {}, page: "/verify-installation", timestamp: Date.now() }],
          measurements: [],
          vitals: [],
          errors: [],
        }),
      });
      const json = await res.json().catch(() => null);
      setLog((p) => [...(p || []), res.ok ? `[+] Project resolved: ${projectId}` : `[-] HTTP ${res.status}`, json?.success ? "[✓] Status 200 OK — pipeline verified! Check Overview in ~10s." : `[-] ${(json as { error?: string })?.error || "failed"}`]);
    } catch (e) {
      setLog((p) => [...(p || []), `[-] ${e instanceof Error ? e.message : "network error"}`]);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="flex flex-col gap-3.5 pb-4">
      <div className="flex items-center gap-2 pt-0.5">
        <h1 className="flex items-center gap-2 text-[15px] font-semibold text-slate-900 dark:text-white"><span className="h-2 w-2 rounded-full bg-[#0284c7]" />Installation</h1>
        <span className="rounded-md bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-700 border border-sky-100">{"< 60 SEC SETUP"}</span>
        {connected ? (
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
            <span className={`h-1.5 w-1.5 rounded-full ${live ? "animate-pulse bg-emerald-500" : "bg-emerald-500"}`} />
            {live ? "Script connected · receiving live" : "Script connected"}
          </span>
        ) : (
          <span className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
            Waiting for script…
          </span>
        )}
      </div>

      <div className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-5 inside-shadow dark:border-[#1e2738] dark:bg-[#121927]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div>
            <h3 className="text-[16px] font-semibold text-slate-900 dark:text-white">Install for your stack</h3>
            <p className="text-[12px] text-slate-500">Same beacon, framework-specific snippet. Project key is baked in.</p>
          </div>
          <code className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-[11px] font-semibold text-[#0284C7]">{projectId || "—"}</code>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {FRAMEWORKS.map((f) => (
            <button key={f.id} onClick={() => setFw(f.id)} className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold border transition ${fw === f.id ? "border-[#0284C7] bg-[#eff6ff] text-[#0284C7]" : "border-slate-200 bg-white text-slate-500 hover:text-slate-900"}`}>
              <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold text-white ${f.badgeBg}`}>{f.letter}</span>
              {f.name}
            </button>
          ))}
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-slate-300 bg-[#0f172a] text-slate-100">
          <div className="flex items-center justify-between border-b border-slate-700 bg-[#1e293b] px-4 py-2 text-[11px]">
            <span className="font-mono text-slate-400">{snippet.filename}</span>
            <button onClick={copy} className="flex items-center gap-1.5 rounded-md bg-slate-700 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-slate-600">
              {copied ? (<><Check size={12} className="text-emerald-400" /><span className="text-emerald-300">Copied!</span></>) : (<><Copy size={12} /><span>Copy</span></>)}
            </button>
          </div>
          <pre className="overflow-x-auto whitespace-pre-wrap break-all p-4 font-mono text-[12px] leading-relaxed"><code>{snippet.code}</code></pre>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="flex items-center gap-2 text-[12px] font-bold text-slate-900"><Terminal size={13} className="text-[#0284C7]" />Live verification</span>
              <button disabled={verifying} onClick={verify} className="flex items-center gap-1.5 rounded-lg bg-[#0284C7] px-3 py-1 text-[11px] font-medium text-white disabled:opacity-50">
                <Play size={11} fill="currentColor" /><span>{verifying ? "Sending..." : "Send Test Ping"}</span>
              </button>
            </div>
            <div className="mt-3 min-h-[110px] rounded-lg bg-[#090d16] p-3 font-mono text-[11px] text-slate-200">
              {log ? log.map((l, i) => (<p key={i} className={l.includes("✓") || l.includes("[+]") ? "text-emerald-400" : l.includes("[-]") ? "text-red-400" : "text-slate-400"}>{l}</p>)) : (
                <p className="flex flex-col items-center gap-1 py-5 text-center text-slate-500"><Zap size={16} className="text-sky-400" />Click “Send Test Ping” to verify your pipeline end-to-end.</p>
              )}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h5 className="text-[12px] font-semibold text-slate-900">What you get</h5>
            <ul className="mt-2 space-y-2 text-[11.5px] text-slate-500">
              <li className="rounded-lg border border-slate-200 bg-slate-50/60 p-2.5"><b className="text-slate-800">Pageviews + sessions</b> — automatic, no code.</li>
              <li className="rounded-lg border border-slate-200 bg-slate-50/60 p-2.5"><b className="text-slate-800">API latency</b> — fetch/XHR auto-instrumented.</li>
              <li className="rounded-lg border border-slate-200 bg-slate-50/60 p-2.5"><b className="text-slate-800">Web vitals + errors</b> — LCP/CLS/INP/FCP/TTFB + JS errors.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
