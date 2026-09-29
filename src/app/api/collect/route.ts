import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../lib/prisma";

// ─── Beacon payload shapes (must match public/beacon.js buildPayload()) ───
// {
//   project_id, session_id, visitor_id, host, page,
//   device: { device, browser, screen_width, screen_height, language },
//   events: [{ type: page_view|session_start|custom, name, properties, page, timestamp, session_id, visitor_id }],
//   measurements: [{ type: api_request, url, method, status, duration, page, timestamp }],
//   vitals: [{ type: web_vital, name: LCP|CLS|INP|FCP|TTFB, value, rating, page, timestamp }],
//   errors: [{ type: javascript_error|promise_error, message, filename?, line?, column?, page, timestamp }]
// }

const MAX_BATCH = 500;

const DeviceSchema = z.object({
  device: z.string().max(32).default("desktop"),
  browser: z.string().max(64).default("unknown"),
  screen_width: z.coerce.number().int().nullable().optional(),
  screen_height: z.coerce.number().int().nullable().optional(),
  language: z.string().max(16).nullable().optional(),
});

const BeaconEventSchema = z.object({
  type: z.enum(["page_view", "session_start", "custom"]),
  name: z.string().max(128).nullable().optional(),
  properties: z.record(z.string(), z.unknown()).optional().default({}),
  page: z.string().max(2048).optional().default("/"),
  timestamp: z.coerce.number(),
  session_id: z.string().max(128).optional(),
  visitor_id: z.string().max(128).optional(),
});

const MeasurementSchema = z.object({
  type: z.literal("api_request").optional().default("api_request"),
  url: z.string().max(2048),
  method: z.string().max(16).optional().default("GET"),
  status: z.coerce.number().int().min(0).max(999).optional().default(0),
  duration: z.coerce.number().min(0).max(3600000),
  page: z.string().max(2048).optional().default("/"),
  timestamp: z.coerce.number(),
});

const VitalSchema = z.object({
  type: z.literal("web_vital").optional().default("web_vital"),
  name: z.enum(["LCP", "CLS", "INP", "FCP", "TTFB"]),
  value: z.coerce.number().min(0).max(3600000),
  rating: z.enum(["good", "needs-improvement", "poor"]).nullable().optional(),
  page: z.string().max(2048).optional().default("/"),
  timestamp: z.coerce.number(),
});

const ErrorSchema = z.object({
  type: z.enum(["javascript_error", "promise_error"]),
  message: z.string().max(5000).nullable().optional(),
  filename: z.string().max(2048).nullable().optional(),
  line: z.coerce.number().int().nullable().optional(),
  column: z.coerce.number().int().nullable().optional(),
  page: z.string().max(2048).optional().default("/"),
  timestamp: z.coerce.number(),
});

const CollectSchema = z.object({
  // beacon sends snake_case; accept camelCase too for backwards compat
  project_id: z.string().min(1).max(128).optional(),
  projectId: z.string().min(1).max(128).optional(),
  session_id: z.string().min(1).max(128),
  sessionId: z.string().min(1).max(128).optional(),
  visitor_id: z.string().min(1).max(128),
  visitorId: z.string().min(1).max(128).optional(),
  host: z.string().max(255).optional().default(""),
  page: z.string().max(2048).optional().default("/"),
  device: DeviceSchema.optional().default({
    device: "desktop",
    browser: "unknown",
  }),
  events: z.array(BeaconEventSchema).max(MAX_BATCH).optional().default([]),
  measurements: z.array(MeasurementSchema).max(MAX_BATCH).optional().default([]),
  vitals: z.array(VitalSchema).max(MAX_BATCH).optional().default([]),
  errors: z.array(ErrorSchema).max(MAX_BATCH).optional().default([]),
});

type CollectInput = z.infer<typeof CollectSchema>;

function toDate(ts: number): Date {
  const d = new Date(ts);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

function mapBeaconEventType(t: string): "PAGE_VIEW" | "SESSION_START" | "CUSTOM" {
  if (t === "page_view") return "PAGE_VIEW";
  if (t === "session_start") return "SESSION_START";
  return "CUSTOM";
}

function mapRating(r: string | null | undefined): "good" | "needs_improvement" | "poor" | null {
  if (!r) return null;
  if (r === "needs-improvement") return "needs_improvement";
  if (r === "good" || r === "poor") return r;
  return null;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    let raw: unknown;
    try {
      raw = await req.json();
    } catch {
      // sendBeacon with Blob should still parse as JSON; if not, reject
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400, headers: corsHeaders });
    }

    const parsed = CollectSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400, headers: corsHeaders },
      );
    }

    const data: CollectInput = parsed.data;
    const publicProjectId = data.project_id ?? data.projectId;
    if (!publicProjectId) {
      return NextResponse.json({ error: "project_id is required" }, { status: 400, headers: corsHeaders });
    }

    const project = await prisma.project.findUnique({
      where: { projectId: publicProjectId },
      select: { id: true, projectId: true, status: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404, headers: corsHeaders });
    }

    if (project.status === "PAUSED") {
      return NextResponse.json({ success: true, ignored: true }, { headers: corsHeaders });
    }

    const beaconSessionId = data.session_id;
    const beaconVisitorId = data.visitor_id;
    const device = data.device ?? { device: "desktop", browser: "unknown" };
    const now = new Date();

    // Upsert visitor (one row per beacon visitor_id per project)
    const visitor = await prisma.visitor.upsert({
      where: {
        projectId_beaconVisitorId: {
          projectId: project.id,
          beaconVisitorId,
        },
      },
      create: {
        projectId: project.id,
        beaconVisitorId,
        firstSeenAt: now,
        lastSeenAt: now,
        sessionCount: 1,
        lastHost: data.host || undefined,
        lastDevice: device.device || undefined,
        lastBrowser: device.browser || undefined,
        language: device.language || undefined,
      },
      update: {
        lastSeenAt: now,
        lastHost: data.host || undefined,
        lastDevice: device.device || undefined,
        lastBrowser: device.browser || undefined,
        language: device.language || undefined,
      },
      select: { id: true },
    });

    // Upsert session (one row per beacon session_id; beacon flushes many times per session)
    let session = await prisma.analyticsSession.findUnique({
      where: { beaconSessionId },
      select: { id: true },
    });

    if (!session) {
      session = await prisma.analyticsSession.create({
        data: {
          projectId: project.id,
          beaconSessionId,
          visitorId: visitor.id,
          beaconVisitorId,
          startedAt: now,
          lastActivityAt: now,
          host: data.host || undefined,
          landingPage: data.page || undefined,
          device: device.device || undefined,
          browser: device.browser || undefined,
          screenWidth: device.screen_width ?? undefined,
          screenHeight: device.screen_height ?? undefined,
          language: device.language || undefined,
        },
        select: { id: true },
      });
      // new session for an existing visitor -> bump count
      await prisma.visitor.update({
        where: { id: visitor.id },
        data: { sessionCount: { increment: 1 } },
      }).catch(() => {});
    } else {
      await prisma.analyticsSession.update({
        where: { id: session.id },
        data: { lastActivityAt: now },
      }).catch(() => {});
    }

    const rows: {
      projectId: string;
      sessionId: string | null;
      beaconSessionId: string;
      beaconVisitorId: string;
      eventType: "PAGE_VIEW" | "SESSION_START" | "CUSTOM" | "API_REQUEST" | "WEB_VITAL" | "JAVASCRIPT_ERROR" | "PROMISE_ERROR";
      eventName: string | null;
      pagePath: string | null;
      host: string | null;
      eventTime: Date;
      browser: string | null;
      deviceType: string | null;
      language: string | null;
      screenWidth: number | null;
      screenHeight: number | null;
      url: string | null;
      method: string | null;
      statusCode: number | null;
      durationMs: number | null;
      valueMs: number | null;
      rating: "good" | "needs_improvement" | "poor" | null;
      errorMessage: string | null;
      errorFilename: string | null;
      errorLine: number | null;
      errorColumn: number | null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      metadata: any;
    }[] = [];

    for (const e of data.events) {
      rows.push({
        projectId: project.id,
        sessionId: session.id,
        beaconSessionId,
        beaconVisitorId,
        eventType: mapBeaconEventType(e.type),
        eventName: e.name ?? e.type,
        pagePath: e.page ?? data.page ?? "/",
        host: data.host || null,
        eventTime: toDate(e.timestamp),
        browser: device.browser || null,
        deviceType: device.device || null,
        language: device.language || null,
        screenWidth: device.screen_width ?? null,
        screenHeight: device.screen_height ?? null,
        url: null,
        method: null,
        statusCode: null,
        durationMs: null,
        valueMs: null,
        rating: null,
        errorMessage: null,
        errorFilename: null,
        errorLine: null,
        errorColumn: null,
        metadata:
          e.properties && Object.keys(e.properties).length > 0
            ? (e.properties as Record<string, unknown>)
            : undefined,
      });
    }

    for (const m of data.measurements) {
      rows.push({
        projectId: project.id,
        sessionId: session.id,
        beaconSessionId,
        beaconVisitorId,
        eventType: "API_REQUEST",
        eventName: "api_request",
        pagePath: m.page ?? data.page ?? "/",
        host: data.host || null,
        eventTime: toDate(m.timestamp),
        browser: device.browser || null,
        deviceType: device.device || null,
        language: device.language || null,
        screenWidth: device.screen_width ?? null,
        screenHeight: device.screen_height ?? null,
        url: m.url,
        method: (m.method || "GET").toUpperCase().slice(0, 16),
        statusCode: m.status ?? 0,
        durationMs: Math.round(m.duration),
        valueMs: null,
        rating: null,
        errorMessage: null,
        errorFilename: null,
        errorLine: null,
        errorColumn: null,
        metadata: undefined,
      });
    }

    for (const v of data.vitals) {
      rows.push({
        projectId: project.id,
        sessionId: session.id,
        beaconSessionId,
        beaconVisitorId,
        eventType: "WEB_VITAL",
        eventName: v.name,
        pagePath: v.page ?? data.page ?? "/",
        host: data.host || null,
        eventTime: toDate(v.timestamp),
        browser: device.browser || null,
        deviceType: device.device || null,
        language: device.language || null,
        screenWidth: device.screen_width ?? null,
        screenHeight: device.screen_height ?? null,
        url: null,
        method: null,
        statusCode: null,
        durationMs: null,
        valueMs: v.value,
        rating: mapRating(v.rating),
        errorMessage: null,
        errorFilename: null,
        errorLine: null,
        errorColumn: null,
        metadata: undefined,
      });
    }

    for (const er of data.errors) {
      rows.push({
        projectId: project.id,
        sessionId: session.id,
        beaconSessionId,
        beaconVisitorId,
        eventType: er.type === "javascript_error" ? "JAVASCRIPT_ERROR" : "PROMISE_ERROR",
        eventName: er.type,
        pagePath: er.page ?? data.page ?? "/",
        host: data.host || null,
        eventTime: toDate(er.timestamp),
        browser: device.browser || null,
        deviceType: device.device || null,
        language: device.language || null,
        screenWidth: device.screen_width ?? null,
        screenHeight: device.screen_height ?? null,
        url: null,
        method: null,
        statusCode: null,
        durationMs: null,
        valueMs: null,
        rating: null,
        errorMessage: er.message || null,
        errorFilename: er.filename || null,
        errorLine: er.line ?? null,
        errorColumn: er.column ?? null,
        metadata: undefined,
      });
    }

    if (rows.length > 0) {
      // createMany is faster than N creates and matches beacon's batched flush model
      await prisma.event.createMany({ data: rows });
    }

    return NextResponse.json(
      {
        success: true,
        ingested: {
          events: data.events.length,
          measurements: data.measurements.length,
          vitals: data.vitals.length,
          errors: data.errors.length,
        },
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    console.error("Collect error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500, headers: corsHeaders });
  }
}
