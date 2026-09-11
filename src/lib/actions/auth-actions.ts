"use server";

import { headers } from "next/headers";
import { auth } from "../auth";

export const SignUp = async (
  username: string,
  email: string,
  password: string,
) => {
  try {
    const result = await auth.api.signUpEmail({
      body: {
        name: username,
        email,
        password,
        callbackURL: "/dashboard",
      },
      headers: await headers(),
    });
    return { success: true, data: result };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to create account",
    };
  }
};

export const SignIn = async (email: string, password: string) => {
  try {
    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
        callbackURL: "/dashboard",
      },
      headers: await headers(),
    });
    return { success: true, data: result };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Invalid email or password",
    };
  }
};

export const SignOut = async () => {
  const result = await auth.api.signOut({ headers: await headers() });
  return result;
};
