import { NextRequest } from "next/server";
import Ably from "ably";
import { fail, ok, requireProject, requireUser } from "../../../../../lib/api";
import { channelForProject } from "../../../../../lib/ably";

// GET /api/ably/token?projectId=<id|publicId>
// Returns an Ably TokenRequest scoped to ONE project channel (subscribe + presence only).
// Browser uses it via `new Ably.Realtime({ authUrl: "/api/ably/token?projectId=..." })`.
export async function GET(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return fail("Unauthorized", 401);

  const key = process.env.ABLY_API_KEY;
  if (!key) return fail("Realtime not configured", 500);

  const projectKey = req.nextUrl.searchParams.get("projectId");
  const project = await requireProject(user.id, projectKey);
  if (!project) return fail("Project not found", 404);

  try {
    const rest = new Ably.Rest({ key });
    const channel = channelForProject(project.projectId);
    const tokenRequest = await rest.auth.createTokenRequest({
      clientId: user.id,
      ttl: 3600_000,
      capability: {
        [channel]: ["subscribe", "presence", "history"],
      },
    });
    return ok({ tokenRequest, channel, projectId: project.projectId });
  } catch {
    return fail("Failed to create token", 500);
  }
}
