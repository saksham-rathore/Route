"use client";

import { useCallback, useEffect, useState } from "react";

export type RangeKey = "1h" | "24h" | "7d" | "30d" | "90d" | "1y";

export function useAnalytics<T>(url: string | null, opts?: { live?: boolean; liveDebounceMs?: number }) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!url) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(url);
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) throw new Error(json?.error || "Failed to load");
      setData(json as T);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  // Realtime: re-fetch (debounced) whenever an Ably ingest event lands.
  useEffect(() => {
    if (!opts?.live || !url) return;
    const wait = opts.liveDebounceMs ?? 5000;
    let t: ReturnType<typeof setTimeout> | null = null;
    const onIngest = () => {
      if (t) return; // trailing-edge throttle
      t = setTimeout(() => {
        t = null;
        refetch();
      }, wait);
    };
    window.addEventListener("route:ingest", onIngest);
    return () => {
      window.removeEventListener("route:ingest", onIngest);
      if (t) clearTimeout(t);
    };
  }, [opts?.live, opts?.liveDebounceMs, url, refetch]);

  return { data, loading, error, refetch };
}

export function buildQuery(projectId?: string | null, range?: string, extra?: Record<string, string>) {
  const sp = new URLSearchParams();
  if (projectId) sp.set("projectId", projectId);
  if (range) sp.set("range", range);
  if (extra) for (const [k, v] of Object.entries(extra)) if (v) sp.set(k, v);
  const q = sp.toString();
  return q ? `?${q}` : "";
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white/60 p-10 text-center dark:border-[#1e2738] dark:bg-transparent">
      <p className="text-[13px] font-semibold text-slate-700 dark:text-slate-200">{title}</p>
      {hint && <p className="mt-1 text-[12px] text-slate-400">{hint}</p>}
    </div>
  );
}

export function SectionCard({ title, subtitle, right, children }: { title: string; subtitle?: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200/80 bg-white p-3.5 sm:p-4 inside-shadow dark:border-[#1e2738] dark:bg-[#121927]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[13px] font-semibold text-slate-900 dark:text-white">{title}</h2>
          {subtitle && <p className="mt-0.5 text-[11.5px] text-slate-400">{subtitle}</p>}
        </div>
        {right}
      </div>
      <div className="mt-2">{children}</div>
    </section>
  );
}
