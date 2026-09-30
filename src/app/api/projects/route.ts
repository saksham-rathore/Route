import { NextRequest } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { CreateProjectSchema } from "../../../../lib/validator/project";
import { fail, ok, requireUser } from "../../../../lib/api";

// POST /api/projects — create a project (also registers its domain)
export async function POST(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return fail("Unauthorized", 401);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Invalid JSON", 400);
  }

  const parsed = CreateProjectSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Invalid project data", 400, parsed.error.flatten().fieldErrors);
  }

  const { name, domain } = parsed.data;

  const existing = await prisma.project.findUnique({ where: { domain } });
  if (existing) return fail("A project with this domain already exists", 409);

  const project = await prisma.project.create({
    data: {
      name,
      domain,
      ownerId: user.id,
      domains: { create: { domain } },
    },
    include: { domains: true },
  });

  return ok({ project }, { status: 201 });
}

// GET /api/projects — list my projects with usage counts
export async function GET(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return fail("Unauthorized", 401);

  const projects = await prisma.project.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { events: true, analyticsSessions: true, visitors: true },
      },
    },
  });

  return ok({ projects });
}
