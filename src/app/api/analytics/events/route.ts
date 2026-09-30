import { NextRequest } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { fail, ok, paginationMeta, parseRange, requireProject, requireUser } from "../../../../../lib/api";

const EVENT_TYPES = [
  "PAGE_VIEW",
  "SESSION_START",
  "CUSTOM",
  "API_REQUEST",
  "WEB_VITAL",
  "JAVASCRIPT_ERROR",
  "PROMISE_ERROR",
] as const;

// GET /api/analytics/events?projectId=&from=&to=&eventType=&page=&limit=
// Paginated event feed (custom-events tab, API-request table, page-view list).
export async function GET(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return fail("Unauthorized", 401);

  const sp = req.nextUrl.searchParams;
  const project = await requireProject(user.id, sp.get("projectId"));
  if (!project) return fail("Project not found", 404);

  const { from, to, page, limit, skip } = parseRange(sp);

  const eventType = sp.get("eventType");
  if (eventType && !(EVENT_TYPES as readonly string[]).includes(eventType)) {
    return fail(`Invalid eventType. Use one of: ${EVENT_TYPES.join(", ")}`, 400);
  }

  const pageSearch = sp.get("page");
  const where = {
    projectId: project.id,
    eventTime: { gte: from, lte: to },
    ...(eventType ? { eventType: eventType as (typeof EVENT_TYPES)[number] } : {}),
    ...(pageSearch ? { pagePath: { contains: pageSearch } } : {}),
  };

  const [total, events] = await Promise.all([
    prisma.event.count({ where }),
    prisma.event.findMany({
      where,
      orderBy: { eventTime: "desc" },
      skip,
      take: limit,
    }),
  ]);

  return ok({ events, pagination: paginationMeta(page, limit, total) });
}
