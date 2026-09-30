import { NextRequest } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { fail, ok, parseRange, requireProject, requireUser } from "../../../../../lib/api";

const VITAL_NAMES = ["LCP", "CLS", "INP", "FCP", "TTFB"] as const;

// GET /api/analytics/vitals?projectId=&from=&to=&name=
// Per-vital averages + rating breakdown + latest 50 measurements.
export async function GET(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return fail("Unauthorized", 401);

  const sp = req.nextUrl.searchParams;
  const project = await requireProject(user.id, sp.get("projectId"));
  if (!project) return fail("Project not found", 404);

  const { from, to } = parseRange(sp);
  const name = sp.get("name");
  if (name && !(VITAL_NAMES as readonly string[]).includes(name)) {
    return fail(`Invalid name. Use one of: ${VITAL_NAMES.join(", ")}`, 400);
  }

  const where = {
    projectId: project.id,
    eventType: "WEB_VITAL" as const,
    eventTime: { gte: from, lte: to },
    ...(name ? { eventName: name } : {}),
  };

  const [averages, ratings, latest] = await Promise.all([
    prisma.event.groupBy({
      by: ["eventName"],
      _avg: { valueMs: true },
      _min: { valueMs: true },
      _max: { valueMs: true },
      _count: { _all: true },
      where,
    }),
    prisma.event.groupBy({ by: ["eventName", "rating"], _count: { _all: true }, where }),
    prisma.event.findMany({
      where,
      orderBy: { eventTime: "desc" },
      take: 50,
      select: {
        eventName: true,
        valueMs: true,
        rating: true,
        pagePath: true,
        eventTime: true,
        browser: true,
        deviceType: true,
      },
    }),
  ]);

  const vitals = averages.map((v) => {
    const forName = ratings.filter((r) => r.eventName === v.eventName);
    const count = (rating: string) =>
      forName.find((r) => r.rating === rating)?._count._all ?? 0;
    return {
      name: v.eventName,
      avg: v._avg.valueMs,
      min: v._min.valueMs,
      max: v._max.valueMs,
      count: v._count._all,
      good: count("good"),
      needsImprovement: count("needs_improvement"),
      poor: count("poor"),
    };
  });

  return ok({ vitals, latest });
}
