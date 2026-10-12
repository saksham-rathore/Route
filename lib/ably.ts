import Ably from "ably";

// Channel per project. Uses the PUBLIC projectId (beacon data-pid)
// so the browser never needs the internal cuid.
export function channelForProject(publicProjectId: string) {
  return `route:project:${publicProjectId}`;
}

let rest: Ably.Rest | null = null;

export function getAblyRest(): Ably.Rest | null {
  const key = process.env.ABLY_API_KEY;
  if (!key) return null;
  if (!rest) rest = new Ably.Rest({ key });
  return rest;
}

export interface IngestPayload {
  projectId: string;
  at: string;
  host: string | null;
  page: string | null;
  counts: { events: number; measurements: number; vitals: number; errors: number; total: number };
}

// Fire-and-forget: never throw, never block /api/collect.
export async function publishIngest(publicProjectId: string, payload: IngestPayload) {
  try {
    const client = getAblyRest();
    if (!client) return;
    const channel = client.channels.get(channelForProject(publicProjectId));
    await channel.publish("ingest", payload);
  } catch {
    // realtime is best-effort; ingest already persisted in Postgres
  }
}
