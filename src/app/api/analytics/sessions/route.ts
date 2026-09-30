import { NextRequest } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { fail, ok, paginationMeta, parseRange, requireProject, requireUser } from "../../../../../lib/api";

// GET /api/analytics/sessions?projectId=&from=&to=&page=&limit=
// Paginated session list with per-session event counts.
export async function GET(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return fail("Unauthorized", 401);

  const sp = req.nextUrl.searchParams;
  const project = await requireProject(user.id, sp.get("projectId"));
  if (!project) return fail("Project not found", 404);

  const { from, to, page, limit, skip } = parseRange(sp);
  const where = {
    projectId: project.id,
    lastActivityAt: { gte: from, lte: to },
  };

  const [total, sessions] = await Promise.all([
    prisma.analyticsSession.count({ where }),
    prisma.analyticsSession.findMany({
      where,
      orderBy: { lastActivityAt: "desc" },
      skip,
      take: limit,
      include: { _count: { select: { events: true } } },
    }),
  ]);

  return ok({ sessions, pagination: paginationMeta(page, limit, total) });
}
