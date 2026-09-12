import { Prisma } from "@/generated/prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { CreateProjectSchema } from "../../../../../lib/validator/project";
import { auth } from "../../../../../lib/auth";
import { prisma } from "../../../../../lib/prisma";
import { headers } from "next/headers";

// Create project
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // user is authenticated
    const body = await req.json();

    const validator = CreateProjectSchema.safeParse(body);

    if (!validator.success) {
      return NextResponse.json(
        {
          error: "Invalid Project data",
          details: validator.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { name, Domain } = validator.data;

    const project = await prisma.project.create({
      data: {
        name,
        domain: Domain,
        ownerId: session.user.id,
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to create Project",
      },
      { status: 500 },
    );
  }
}

// Get projects
export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      where: {
        ownerId: session.user.id,
      },
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Failed to fetch projects:", error);

    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}

// update Project
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await params;

    const body = await req.json();

    const { name, domain } = body;

    const existingProject = await prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId: session.user.id,
      },
    });

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const Project = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        ...(name !== undefined && { name }),
        ...(domain !== undefined && { domain }),
      },
    });

    return NextResponse.json({ Project }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch projects:", error);

    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}

// delete Project
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await params;

    const existingProject = await prisma.project.deleteMany({
      where: {
        id: projectId,
        ownerId: session.user.id,
      },
    });

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const Project = await prisma.project.delete({
      where: {
        id: projectId,
      },
    });

    return NextResponse.json({ Project }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch projects:", error);

    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}
