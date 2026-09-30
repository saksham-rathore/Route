import { NextRequest } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { fail, ok, parseRange, requireProject, requireUser } from "../../../../../lib/api";

// GET /api/analytics/overview?projectId=&from=&to=
// Dashboard stat cards: pageviews, sessions, visitors, custom events,
// API volume + avg/p95 duration, error count, top pages, web-vital averages.
export async function GET(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return fail("Unauthorized", 401);

  const sp = req.nextUrl.searchParams;
  const project = await requireProject(user.id, sp.get("projectId"));
  if (!project) return fail("Project not found", 404);

  const { from, to } = parseRange(sp);
  const range = { gte: from, lte: to };
  const where = { projectId: project.id, eventTime: range };

  const [
    pageviews,
    sessions,
    uniqueVisitors,
    customEvents,
    apiRequests,
    apiAvg,
    errorCount,
    topPages,
    vitalAvg,
    vitalRatings,
    durations,
  ] = await Promise.all([
    prisma.event.count({ where: { ...where, eventType: "PAGE_VIEW" } }),
    prisma.analyticsSession.count({
      where: { projectId: project.id, lastActivityAt: range },
    }),
    prisma.visitor.count({
      where: { projectId: project.id, lastSeenAt: range },
    }),
    prisma.event.count({ where: { ...where, eventType: "CUSTOM" } }),
    prisma.event.count({ where: { ...where, eventType: "API_REQUEST" } }),
    prisma.event.aggregate({
      _avg: { durationMs: true },
      where: { ...where, eventType: "API_REQUEST" },
    }),
    prisma.event.count({
      where: { ...where, eventType: { in: ["JAVASCRIPT_ERROR", "PROMISE_ERROR"] } },
    }),
    prisma.event.groupBy({
      by: ["pagePath"],
      _count: { _all: true },
      where: { ...where, eventType: "PAGE_VIEW" },
      orderBy: { _count: { pagePath: "desc" } },
      take: 10,
    }),
    prisma.event.groupBy({
      by: ["eventName"],
      _avg: { valueMs: true },
      _count: { _all: true },
      where: { ...where, eventType: "WEB_VITAL" },
    }),
    prisma.event.groupBy({
      by: ["eventName", "rating"],
      _count: { _all: true },
      where: { ...where, eventType: "WEB_VITAL" },
    }),
    prisma.event.findMany({
      where: { ...where, eventType: "API_REQUEST", durationMs: { not: null } },
      select: { durationMs: true },
      orderBy: { eventTime: "desc" },
      take: 5000,
    }),
  ]);

  // p95 from the sampled durations
  const sorted = durations
    .map((d) => d.durationMs ?? 0)
    .sort((a, b) => a - b);
  const p95ApiDurationMs =
    sorted.length > 0 ? sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * 0.95) - 1)] : null;

  const vitals = vitalAvg.map((v) => {
    const ratings = vitalRatings.filter((r) => r.eventName === v.eventName);
    const count = (rating: string) =>
      ratings.find((r) => r.rating === rating)?._count._all ?? 0;
    return {
      name: v.eventName,
      avg: v._avg.valueMs,
      count: v._count._all,
      good: count("good"),
      needsImprovement: count("needs_improvement"),
      poor: count("poor"),
    };
  });

  return ok({
    project: { id: project.id, projectId: project.projectId, name: project.name },
    range: { from, to },
    stats: {
      pageviews,
      sessions,
      uniqueVisitors,
      customEvents,
      apiRequests,
      errorCount,
      avgApiDurationMs: apiAvg._avg.durationMs,
      p95ApiDurationMs,
    },
    topPages: topPages.map((p) => ({ page: p.pagePath, views: p._count._all })),
    vitals,
  });
}
