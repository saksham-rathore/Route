import { NextRequest } from "next/server";
import type { EventType } from "@/generated/prisma/client";
import { prisma } from "../../../../lib/prisma";
import { fail, ok, paginationMeta, parseRange, requireProject, requireUser } from "../../../../lib/api";

// GET /api/errors?projectId=&from=&to=&q=&page=&limit=
// Paginated JS + promise errors, newest first, optional message search.
export async function GET(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return fail("Unauthorized", 401);

  const sp = req.nextUrl.searchParams;
  const project = await requireProject(user.id, sp.get("projectId"));
  if (!project) return fail("Project not found", 404);

  const { from, to, page, limit, skip } = parseRange(sp);
  const q = sp.get("q")?.trim();

  const where = {
    projectId: project.id,
    eventType: { in: ["JAVASCRIPT_ERROR", "PROMISE_ERROR"] as EventType[] },
    eventTime: { gte: from, lte: to },
    ...(q ? { errorMessage: { contains: q, mode: "insensitive" as const } } : {}),
  };

  const [total, errors] = await Promise.all([
    prisma.event.count({ where }),
    prisma.event.findMany({
      where,
      orderBy: { eventTime: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        eventType: true,
        eventName: true,
        pagePath: true,
        host: true,
        eventTime: true,
        browser: true,
        deviceType: true,
        errorMessage: true,
        errorFilename: true,
        errorLine: true,
        errorColumn: true,
        beaconSessionId: true,
        beaconVisitorId: true,
      },
    }),
  ]);

  return ok({ errors, pagination: paginationMeta(page, limit, total) });
}
