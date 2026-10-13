import { Resend } from "resend";

let client: Resend | null = null;

// Lazily created so that importing this module never throws during
// `next build` page-data collection on deploy targets (e.g. Render)
// where RESEND_API_KEY isn't set as a build-time env var.
// The real key is still required at runtime when sending mail.
export function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY is not set. Add it to your environment to send emails.",
    );
  }
  if (!client) client = new Resend(apiKey);
  return client;
}
