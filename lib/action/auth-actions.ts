import { auth } from "../auth";

export const signUp = async (name: string, email: string, password: string) => {
  const result = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
      callbackURL: "/dashboard",
    },
  });
  return result;
};

export const signIn = async (email: string, password: string) => {
  const result = await auth.api.signInEmail({
    body: {
      email,
      password,
      callbackURL: "/dashboard",
    },
  });
  return result;
};
