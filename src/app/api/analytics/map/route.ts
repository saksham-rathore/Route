import { NextRequest } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { fail, ok, parseRange, requireProject, requireUser } from "../../../../../lib/api";

// GET /api/analytics/map?projectId=&range=24h
// Geographic distribution: by country + city + time-trend for the Global Map page.
export async function GET(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return fail("Unauthorized", 401);

  const sp = req.nextUrl.searchParams;
  const project = await requireProject(user.id, sp.get("projectId"));
  if (!project) return fail("Project not found", 404);

  const { from, to, range } = parseRange(sp);
  const where = { projectId: project.id, eventTime: { gte: from, lte: to } };

  const [events, sessions] = await Promise.all([
    prisma.event.findMany({
      where,
      select: { country: true, city: true, eventType: true, eventTime: true },
      take: 20000,
    }),
    prisma.analyticsSession.findMany({
      where: { projectId: project.id, lastActivityAt: { gte: from, lte: to } },
      select: { country: true, city: true, startedAt: true },
      take: 5000,
    }),
  ]);

  const byCountry = new Map<string, { visitors: number; sessions: number; pageviews: number; errors: number }>();
  const byCity = new Map<string, { country: string; visitors: number; sessions: number }>();

  const bump = (map: Map<string, { visitors: number; sessions: number; pageviews?: number; errors?: number; country?: string }>, key: string, extra?: { country?: string }) => {
    if (!map.has(key)) map.set(key, { visitors: 0, sessions: 0, pageviews: 0, errors: 0, ...extra } as never);
    return map.get(key)!;
  };

  for (const e of events) {
    const c = e.country || "Unknown";
    const row = bump(byCountry, c);
    if (e.eventType === "PAGE_VIEW") row.pageviews = (row.pageviews || 0) + 1;
    if (e.eventType === "JAVASCRIPT_ERROR" || e.eventType === "PROMISE_ERROR") row.errors = (row.errors || 0) + 1;
    if (e.city) {
      const cityRow = bump(byCity, e.city, { country: c }) as { country: string; visitors: number; sessions: number };
      cityRow.visitors += 1;
    }
  }
  for (const s of sessions) {
    const c = s.country || "Unknown";
    const row = bump(byCountry, c);
    row.sessions += 1;
    row.visitors += 1;
  }

  const countries = Array.from(byCountry.entries())
    .map(([country, v]) => ({ country, ...v }))
    .sort((a, b) => b.visitors - a.visitors)
    .slice(0, 30);

  const cities = Array.from(byCity.entries())
    .map(([city, v]) => ({ city, ...v }))
    .sort((a, b) => b.visitors - a.visitors)
    .slice(0, 30);

  const totalVisitors = countries.reduce((a, c) => a + c.visitors, 0);
  const totalSessions = countries.reduce((a, c) => a + c.sessions, 0);

  return ok({ range, from, to, totals: { visitors: totalVisitors, sessions: totalSessions }, countries, cities });
}
