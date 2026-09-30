import { z } from "zod";

export const MAX_BATCH = 500;

export const DeviceSchema = z.object({
  device: z.string().max(32).default("desktop"),
  browser: z.string().max(64).default("unknown"),
  screen_width: z.coerce.number().int().nullable().optional(),
  screen_height: z.coerce.number().int().nullable().optional(),
  language: z.string().max(16).nullable().optional(),
});

export const BeaconEventSchema = z.object({
  type: z.enum(["page_view", "session_start", "custom"]),
  name: z.string().max(128).nullable().optional(),
  properties: z.record(z.string(), z.unknown()).optional().default({}),
  page: z.string().max(2048).optional().default("/"),
  timestamp: z.coerce.number(),
  session_id: z.string().max(128).optional(),
  visitor_id: z.string().max(128).optional(),
});

export const MeasurementSchema = z.object({
  type: z.literal("api_request").optional().default("api_request"),
  url: z.string().max(2048),
  method: z.string().max(16).optional().default("GET"),
  status: z.coerce.number().int().min(0).max(999).optional().default(0),
  duration: z.coerce.number().min(0).max(3600000),
  page: z.string().max(2048).optional().default("/"),
  timestamp: z.coerce.number(),
});

export const VitalSchema = z.object({
  type: z.literal("web_vital").optional().default("web_vital"),
  name: z.enum(["LCP", "CLS", "INP", "FCP", "TTFB"]),
  value: z.coerce.number().min(0).max(3600000),
  rating: z.enum(["good", "needs-improvement", "poor"]).nullable().optional(),
  page: z.string().max(2048).optional().default("/"),
  timestamp: z.coerce.number(),
});

export const ErrorSchema = z.object({
  type: z.enum(["javascript_error", "promise_error"]),
  message: z.string().max(5000).nullable().optional(),
  filename: z.string().max(2048).nullable().optional(),
  line: z.coerce.number().int().nullable().optional(),
  column: z.coerce.number().int().nullable().optional(),
  page: z.string().max(2048).optional().default("/"),
  timestamp: z.coerce.number(),
});

export const CollectSchema = z.object({
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