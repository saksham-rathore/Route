import { NextRequest } from "next/server";
import { fail, ok, requireProject, requireUser } from "../../../../../../lib/api";
import { prisma } from "../../../../../../lib/prisma";

const LIVE_WINDOW_MS = 2 * 60 * 1000; // ingested within last 2 min => "Live"

// GET /api/projects/:key/live — initial connected/live state + fallback when Ably is unreachable.
export async function GET(req: NextRequest, ctx: { params: Promise<{ projectId: string }> }) {
  const user = await requireUser(req);
  if (!user) return fail("Unauthorized", 401);

  const { projectId: key } = await ctx.params;
  const project = await requireProject(user.id, key);
  if (!project) return fail("Project not found", 404);

  const [totalEvents, latest] = await Promise.all([
    prisma.event.count({ where: { projectId: project.id } }),
    prisma.event.findFirst({
      where: { projectId: project.id },
      orderBy: { eventTime: "desc" },
      select: { eventTime: true, pagePath: true, host: true },
    }),
  ]);

  const lastEventAt = latest?.eventTime ?? null;
  const connected = totalEvents > 0;
  const live = lastEventAt ? Date.now() - lastEventAt.getTime() < LIVE_WINDOW_MS : false;

  return ok({
    projectId: project.projectId,
    connected,
    live,
    totalEvents,
    lastEventAt,
    lastPage: latest?.pagePath ?? null,
    lastHost: latest?.host ?? null,
  });
}
