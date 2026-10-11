import { NextRequest } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { fail, ok, parseRange, requireProject, requireUser } from "../../../../../lib/api";

// GET /api/analytics/timeseries?projectId=&range=24h
// Bucketed series for graphs: requests, p50/p95/p99 latency, delta, errors.
export async function GET(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return fail("Unauthorized", 401);

  const sp = req.nextUrl.searchParams;
  const project = await requireProject(user.id, sp.get("projectId"));
  if (!project) return fail("Project not found", 404);

  const { from, to, range } = parseRange(sp);
  const where = { projectId: project.id, eventTime: { gte: from, lte: to } };

  const bucketCount = range === "1h" ? 12 : range === "24h" ? 16 : range === "7d" ? 14 : range === "30d" ? 15 : 12;
  const span = Math.max(1, to.getTime() - from.getTime());
  const bucketMs = span / bucketCount;

  const events = await prisma.event.findMany({
    where,
    select: { eventTime: true, eventType: true, durationMs: true },
    orderBy: { eventTime: "asc" },
    take: 20000,
  });

  const buckets: { t: number; requests: number; durations: number[]; errors: number }[] = Array.from(
    { length: bucketCount },
    (_, i) => ({ t: from.getTime() + bucketMs * (i + 0.5), requests: 0, durations: [], errors: 0 }),
  );

  for (const e of events) {
    const idx = Math.min(bucketCount - 1, Math.max(0, Math.floor((e.eventTime.getTime() - from.getTime()) / bucketMs)));
    const b = buckets[idx];
    b.requests += 1;
    if (e.durationMs != null) b.durations.push(e.durationMs);
    if (e.eventType === "JAVASCRIPT_ERROR" || e.eventType === "PROMISE_ERROR") b.errors += 1;
  }

  const pct = (arr: number[], p: number) => {
    if (!arr.length) return 0;
    const s = [...arr].sort((a, b) => a - b);
    return s[Math.min(s.length - 1, Math.ceil(s.length * (p / 100)) - 1)];
  };

  const fmt = (t: number) =>
    new Date(t).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });

  let cumulative = 0;
  const series = buckets.map((b) => {
    cumulative += b.requests;
    return {
      time: fmt(b.t),
      ts: b.t,
      requests: b.requests,
      cumulative,
      p50: pct(b.durations, 50),
      p95: pct(b.durations, 95),
      p99: pct(b.durations, 99),
      errors: b.errors,
    };
  });

  const deltas = series.map((s, i) => ({
    time: s.time,
    delta: i === 0 ? 0 : s.requests - series[i - 1].requests,
    up: i === 0 ? 0 : Math.max(0, s.requests - series[i - 1].requests),
    down: i === 0 ? 0 : Math.min(0, s.requests - series[i - 1].requests),
  }));

  const totals = events.length;
  const prevFrom = new Date(from.getTime() - span);
  const prevCount = await prisma.event.count({
    where: { projectId: project.id, eventTime: { gte: prevFrom, lt: from } },
  });
  const deltaPct = prevCount > 0 ? Number((((totals - prevCount) / prevCount) * 100).toFixed(1)) : 0;

  return ok({ range, from, to, series, deltas, totals, prevCount, deltaPct });
}
