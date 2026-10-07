import { NextResponse } from "next/server";
import { auth } from "../../../../lib/auth";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    const result = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        callbackURL: "/Onboarding",
      },
      headers: req.headers,
      asResponse: true,
    });

    return result;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}