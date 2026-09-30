import { NextRequest } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { UpdateProjectSchema } from "../../../../../lib/validator/project";
import { fail, ok, requireProject, requireUser } from "../../../../../lib/api";

type Ctx = { params: Promise<{ projectId: string }> };

// GET /api/projects/[projectId] — one project (id or public projectId)
export async function GET(req: NextRequest, { params }: Ctx) {
  const user = await requireUser(req);
  if (!user) return fail("Unauthorized", 401);

  const { projectId } = await params;
  const project = await requireProject(user.id, projectId);
  if (!project) return fail("Project not found", 404);

  const full = await prisma.project.findUnique({
    where: { id: project.id },
    include: {
      domains: true,
      _count: { select: { events: true, analyticsSessions: true, visitors: true } },
    },
  });

  return ok({ project: full });
}

// PATCH /api/projects/[projectId] — rename, change domain, pause/resume, retention
export async function PATCH(req: NextRequest, { params }: Ctx) {
  const user = await requireUser(req);
  if (!user) return fail("Unauthorized", 401);

  const { projectId } = await params;
  const project = await requireProject(user.id, projectId);
  if (!project) return fail("Project not found", 404);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Invalid JSON", 400);
  }

  const parsed = UpdateProjectSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Invalid project data", 400, parsed.error.flatten().fieldErrors);
  }

  if (parsed.data.domain && parsed.data.domain !== project.domain) {
    const taken = await prisma.project.findUnique({ where: { domain: parsed.data.domain } });
    if (taken) return fail("A project with this domain already exists", 409);
  }

  const updated = await prisma.project.update({
    where: { id: project.id },
    data: {
      ...(parsed.data.name !== undefined ? { name: parsed.data.name } : {}),
      ...(parsed.data.domain !== undefined ? { domain: parsed.data.domain } : {}),
      ...(parsed.data.status !== undefined ? { status: parsed.data.status } : {}),
      ...(parsed.data.timeZone !== undefined ? { timeZone: parsed.data.timeZone } : {}),
      ...(parsed.data.dataRetentionDays !== undefined
        ? { dataRetentionDays: parsed.data.dataRetentionDays }
        : {}),
    },
  });

  return ok({ project: updated });
}

// DELETE /api/projects/[projectId] — delete project + all its analytics (cascade)
export async function DELETE(req: NextRequest, { params }: Ctx) {
  const user = await requireUser(req);
  if (!user) return fail("Unauthorized", 401);

  const { projectId } = await params;
  const result = await prisma.project.deleteMany({
    where: {
      ownerId: user.id,
      OR: [{ id: projectId }, { projectId }],
    },
  });

  if (result.count === 0) return fail("Project not found", 404);

  return ok({ deleted: true });
}
