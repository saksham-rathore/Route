import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { CreateProjectSchema } from "../validator/project";
import { auth } from "@/lib/auth";
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

// Delete projects
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await prisma.project.deleteMany({
      where: {
        ownerId: session.user.id,
      },
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Failed to delete project:", error);

    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 },
    );
  }
}