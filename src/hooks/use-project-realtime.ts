"use client";

import { useEffect, useRef, useState } from "react";

export interface IngestEvent {
  projectId: string;
  at: string;
  host: string | null;
  page: string | null;
  counts: { events: number; measurements: number; vitals: number; errors: number; total: number };
}

interface LiveResp {
  success: boolean;
  projectId?: string;
  connected?: boolean;
  live?: boolean;
  totalEvents?: number;
  lastEventAt?: string | null;
}

const IDLE_MS = 90_000; // beacon flushes every 10s while site open; 90s without ingest => idle
export const ROUTE_INGEST_EVENT = "route:ingest";

export function useProjectRealtime(projectKey?: string | null) {
  const [connected, setConnected] = useState(false);
  const [live, setLive] = useState(false);
  const [tick, setTick] = useState(0);
  const [lastIngest, setLastIngest] = useState<IngestEvent | null>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!projectKey) return;
    let cancelled = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let client: any = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let channel: any = null;

    const markIngest = (evt: IngestEvent) => {
      if (cancelled) return;
      setConnected(true);
      setLive(true);
      setLastIngest(evt);
      setTick((t) => t + 1);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent(ROUTE_INGEST_EVENT, { detail: evt }));
      }
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        if (!cancelled) setLive(false);
      }, IDLE_MS);
    };

    (async () => {
      // 1. Initial DB-backed state (works even if Ably is down / key missing)
      try {
        const res = await fetch(`/api/projects/${encodeURIComponent(projectKey)}/live`);
        const json = (await res.json().catch(() => null)) as LiveResp | null;
        if (!cancelled && json?.success) {
          setConnected(!!json.connected);
          setLive(!!json.live);
          if (json.live) {
            if (idleTimer.current) clearTimeout(idleTimer.current);
            idleTimer.current = setTimeout(() => {
              if (!cancelled) setLive(false);
            }, IDLE_MS);
          }
        }
      } catch {
        // ignore — realtime subscribe below is the live path
      }

      // 2. Resolve channel + subscribe via Ably (authCallback keeps our {success,...} envelope)
      try {
        const tokRes = await fetch(`/api/ably/token?projectId=${encodeURIComponent(projectKey)}`);
        const tokJson = await tokRes.json().catch(() => null);
        if (cancelled || !tokRes.ok || !tokJson?.tokenRequest || !tokJson?.channel) return;
        const channelName: string = tokJson.channel;

        const Ably = await import("ably");
        client = new Ably.Realtime({
          authCallback: async (_params, callback) => {
            try {
              const r = await fetch(`/api/ably/token?projectId=${encodeURIComponent(projectKey)}`);
              const j = await r.json().catch(() => null);
              if (!r.ok || !j?.tokenRequest) return callback("token request failed", null);
              callback(null, j.tokenRequest);
            } catch {
              callback("auth failed", null);
            }
          },
        });

        channel = client.channels.get(channelName);
        await channel.subscribe("ingest", (msg: { data: IngestEvent }) => markIngest(msg.data));
        // Catch up: replay last message so a newly opened dashboard shows fresh data instantly
        try {
          const history = await channel.history({ limit: 1 });
          const first = history?.items?.[0]?.data as IngestEvent | undefined;
          if (first?.at) markIngest(first);
        } catch {
          // history is best-effort
        }
      } catch {
        // Ably unavailable — DB polling state above still applies
      }
    })();

    return () => {
      cancelled = true;
      if (idleTimer.current) clearTimeout(idleTimer.current);
      try {
        channel?.unsubscribe?.();
      } catch {}
      try {
        client?.close?.();
      } catch {}
    };
  }, [projectKey]);

  return { connected, live, tick, lastIngest };
}
