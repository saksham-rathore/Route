import { NextResponse } from "next/server";
import { auth } from "../../../../lib/auth";

export async function POST(req: Request) {
  try {
    const { email, redirectTo } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email address is required." },
        { status: 400 }
      );
    }

    const result = await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo: redirectTo || "/reset-password",
      },
      headers: req.headers,
      asResponse: true,
    });

    return result;
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process password reset request." },
      { status: 500 }
    );
  }
}
