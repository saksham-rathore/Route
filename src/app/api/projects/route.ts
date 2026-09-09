import { Prisma } from "@prisma/client";
import { ProjectDomain } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// CREATE Project
export async function POST() {
  try {
    const createProject = await prisma.project.create({
      data: {
        name: "route",
        domain: "route.com",
        ownerId: "Add userId",
      },
    });
    return NextResponse.json(createProject);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to create Project",
      },
      { status: 500 },
    );
  }
}

// GET project
export async function GET() {
  try {
    const getProjects = await prisma.project.findMany();
    return NextResponse.json(getProjects);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch Projects",
      },
      { status: 500 },
    );
  }
}

// DELETE project
export async function DELETE() {
  try {
    const deleteProject = await prisma.project.deleteMany();
    return NextResponse.json(deleteProject);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch delete",
      },
      { status: 500 },
    );
  }
}
