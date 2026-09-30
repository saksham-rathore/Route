import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";
import { prisma } from "./prisma";

// ─── Auth ───

export async function requireUser(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  return session?.user ?? null;
}

// ─── Project ownership ───
// `key` accepts either the internal id or the public projectId (beacon data-pid).
export async function requireProject(userId: string, key: string | null) {
  if (!key) return null;
  return prisma.project.findFirst({
    where: { ownerId: userId, OR: [{ id: key }, { projectId: key }] },
  });
}

// Public lookup for the beacon ingest path (no owner check).
export async function findProjectByPublicId(publicId: string) {
  return prisma.project.findUnique({ where: { projectId: publicId } });
}

// ─── Standard JSON envelope ───

export function ok<T extends Record<string, unknown>>(
  data: T,
  init?: { status?: number },
) {
  return NextResponse.json({ success: true, ...data }, { status: init?.status ?? 200 });
}

export function fail(error: string, status = 400, details?: unknown) {
  return NextResponse.json(
    { success: false, error, ...(details !== undefined ? { details } : {}) },
    { status },
  );
}

// ─── Query helpers ───

const DEFAULT_RANGE_DAYS = 7;
const MAX_LIMIT = 100;

export function parseRange(sp: URLSearchParams) {
  const now = new Date();
  const toRaw = sp.get("to");
  const fromRaw = sp.get("from");
  const to = toRaw ? new Date(toRaw) : now;
  const from = fromRaw
    ? new Date(fromRaw)
    : new Date(now.getTime() - DEFAULT_RANGE_DAYS * 24 * 3600 * 1000);

  const page = Math.max(1, Number.parseInt(sp.get("page") ?? "1", 10) || 1);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, Number.parseInt(sp.get("limit") ?? "25", 10) || 25),
  );

  return {
    from: Number.isNaN(from.getTime()) ? new Date(now.getTime() - DEFAULT_RANGE_DAYS * 24 * 3600 * 1000) : from,
    to: Number.isNaN(to.getTime()) ? now : to,
    page,
    limit,
    skip: (page - 1) * limit,
  };
}

export function paginationMeta(page: number, limit: number, total: number) {
  return { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) };
}
