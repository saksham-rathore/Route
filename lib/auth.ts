import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { getResend } from "./email";

// `next build` imports this module while collecting page data, before
// deploy-time (e.g. Render) env vars may exist. better-auth throws when no
// secret is configured, so use a placeholder ONLY for the production build
// phase — at runtime a missing BETTER_AUTH_SECRET still fails loudly.
const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";
const secret =
  process.env.BETTER_AUTH_SECRET ||
  (isBuildPhase
    ? "build-phase-placeholder-secret-not-for-runtime-use-00000000"
    : undefined);

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),

  emailAndPassword: {
    enabled: true,

    // Revoke active sessions after a password reset.
    revokeSessionsOnPasswordReset: true,

    sendResetPassword: async ({ user, url }) => {
      const fromEmail = process.env.EMAIL_FROM || "Route <onboarding@resend.dev>";
      const { error } = await getResend().emails.send({
        from: fromEmail,
        to: user.email,
        subject: "Reset your Route account password",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
                <tr>
                  <td align="center">
                    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
                      <tr>
                        <td style="padding: 36px 36px 24px 36px;">
                          <div style="display: flex; align-items: center; margin-bottom: 24px;">
                            <span style="font-size: 22px; font-weight: 700; color: #0f172a; letter-spacing: -0.02em;">Route</span>
                          </div>
                          <h1 style="font-size: 22px; font-weight: 600; color: #0f172a; margin: 0 0 12px 0;">Reset your password</h1>
                          <p style="font-size: 14px; line-height: 24px; color: #475569; margin: 0 0 24px 0;">
                            Hi ${user.name || "there"},<br>
                            We received a request to reset your password. Click the button below to choose a new password. This link is valid for 1 hour.
                          </p>
                          <div style="margin: 28px 0;">
                            <a href="${url}" style="background-color: #0284c7; color: #ffffff; padding: 12px 28px; border-radius: 9px; font-size: 14px; font-weight: 600; text-decoration: none; display: inline-block; box-shadow: 0 2px 6px rgba(2, 132, 199, 0.3);">
                              Reset Password
                            </a>
                          </div>
                          <p style="font-size: 13px; line-height: 20px; color: #64748b; margin: 24px 0 0 0;">
                            If you didn't request a password reset, you can safely ignore this email. Your password will not change until you access the link above.
                          </p>
                          <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 28px 0;" />
                          <p style="font-size: 12px; line-height: 18px; color: #94a3b8; margin: 0; word-break: break-all;">
                            If button isn't working, copy and paste this URL into your browser:<br>
                            <a href="${url}" style="color: #0284c7; text-decoration: underline;">${url}</a>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `,
      });

      if (error) {
        console.error("Resend error sending password reset:", error);
        throw new Error(error.message || "Failed to send password reset email");
      }
    },
  },

  secret,

  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

  // Only register providers whose credentials are configured; undefined
  // clientId/clientSecret entries break better-auth init during builds
  // where OAuth env vars aren't set yet.
  socialProviders: {
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? {
          github: {
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          },
        }
      : {}),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
  },
});
