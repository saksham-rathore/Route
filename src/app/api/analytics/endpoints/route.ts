import { NextRequest } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { fail, ok, parseRange, requireProject, requireUser } from "../../../../../lib/api";

// GET /api/analytics/endpoints?projectId=&range=24h&search=
export async function GET(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return fail("Unauthorized", 401);

  const sp = req.nextUrl.searchParams;
  const project = await requireProject(user.id, sp.get("projectId"));
  if (!project) return fail("Project not found", 404);

  const { from, to, range } = parseRange(sp);
  const search = sp.get("search")?.toLowerCase().trim() || "";

  const rows = await prisma.event.findMany({
    where: { projectId: project.id, eventType: "API_REQUEST", eventTime: { gte: from, lte: to } },
    select: { url: true, method: true, statusCode: true, durationMs: true, eventTime: true },
    orderBy: { eventTime: "desc" },
    take: 10000,
  });

  const map = new Map<string, { method: string; durations: number[]; errors: number; lastSeen: Date }>();
  for (const r of rows) {
    const url = r.url || "unknown";
    if (search && !url.toLowerCase().includes(search)) continue;
    const key = `${r.method || "GET"} ${url}`;
    if (!map.has(key)) map.set(key, { method: r.method || "GET", durations: [], errors: 0, lastSeen: r.eventTime });
    const e = map.get(key)!;
    if (r.durationMs != null) e.durations.push(r.durationMs);
    if ((r.statusCode || 0) >= 400) e.errors += 1;
    if (r.eventTime > e.lastSeen) e.lastSeen = r.eventTime;
  }

  const pct = (arr: number[], p: number) => {
    if (!arr.length) return 0;
    const s = [...arr].sort((a, b) => a - b);
    return s[Math.min(s.length - 1, Math.ceil(s.length * (p / 100)) - 1)];
  };

  const endpoints = Array.from(map.entries())
    .map(([endpoint, d]) => ({
      endpoint,
      url: endpoint.split(" ").slice(1).join(" "),
      method: d.method,
      requests: d.durations.length,
      p50: pct(d.durations, 50),
      p95: pct(d.durations, 95),
      p99: pct(d.durations, 99),
      avg: d.durations.length ? Math.round(d.durations.reduce((a, b) => a + b, 0) / d.durations.length) : 0,
      errors: d.errors,
      errorRate: d.durations.length ? Number(((d.errors / d.durations.length) * 100).toFixed(2)) : 0,
      lastSeen: d.lastSeen,
    }))
    .sort((a, b) => b.requests - a.requests)
    .slice(0, 50);

  const summary = {
    totalEndpoints: endpoints.length,
    totalRequests: endpoints.reduce((a, e) => a + e.requests, 0),
    avgLatency: endpoints.length ? Math.round(endpoints.reduce((a, e) => a + e.avg, 0) / endpoints.length) : 0,
    errorEndpoints: endpoints.filter((e) => e.errorRate > 0).length,
  };

  return ok({ range, from, to, summary, endpoints });
}
