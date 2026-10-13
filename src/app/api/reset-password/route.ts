import { NextResponse } from "next/server";
import { auth } from "../../../../lib/auth";

export async function POST(req: Request) {
  try {
    const { newPassword, token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "Reset token is missing or invalid." },
        { status: 400 }
      );
    }

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    const result = await auth.api.resetPassword({
      body: {
        newPassword,
        token,
      },
      headers: req.headers,
      asResponse: true,
    });

    return result;
  } catch (error: any) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to reset password." },
      { status: 500 }
    );
  }
}
