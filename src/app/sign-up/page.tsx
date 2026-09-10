"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SignUp } from "@/lib/actions/auth-actions";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);
    console.log(email,password)

    try {
      const result = await SignUp(username, email, password);
      if (result) {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f4f6f9] p-6 font-body antialiased">
      {/* Container Card */}
      <div className="w-full max-w-[450px] bg-white border border-slate-100 rounded-2xl p-10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.07),0_0_1px_rgba(0,0,0,0.08)]">
        {/* Category Header */}
        <div className="text-left mb-6">
          <span className="text-[10px] font-bold text-slate-400 tracking-[0.15em] uppercase font-display">
            Get started
          </span>
          <h1 className="text-[32px] font-bold text-[#0f172a] tracking-tight font-display mt-1 leading-[1.15]">
            Create your account
          </h1>
          <p className="text-[14px] text-slate-500 font-body mt-2 leading-[1.5]">
            Start monitoring your app with the same clean workflow as
            onboarding.
          </p>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-3 mb-6">
          <button
            type="button"
            className="w-full bg-[#f8fafc] hover:bg-[#f1f5f9] border border-slate-200/80 text-[#334155] font-semibold rounded-lg py-2.5 text-[14px] flex items-center justify-center gap-2.5 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer"
          >
            <svg
              className="w-[18px] h-[18px] text-[#0f172a]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            Continue with GitHub
          </button>

          <button
            type="button"
            className="w-full bg-[#f8fafc] hover:bg-[#f1f5f9] border border-slate-200/80 text-[#334155] font-semibold rounded-lg py-2.5 text-[14px] flex items-center justify-center gap-2.5 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer"
          >
            <svg className="w-[16px] h-[16px]" viewBox="0 0 24 24">
              <path
                fill="#000000ff"
                d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.579-7.859-7.989 0-4.41 3.529-7.989 7.859-7.989 2.464 0 4.12 1.018 5.059 1.914l3.39-3.26C18.36 1.47 15.54 0 12.24 0 5.48 0 0 5.37 0 12s5.48 12 12.24 12c7.06 0 11.75-4.84 11.75-11.72 0-.78-.08-1.395-.18-1.995H12.24z"
              />
            </svg>
            Continue with Google
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-7 flex items-center justify-center">
          <div className="border-t border-slate-100 w-full" />
          <span className="absolute bg-white px-4 text-[10px] font-bold text-slate-400 tracking-[0.15em] uppercase font-display">
            Or continue with email
          </span>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-[13px]">
            {errorMessage}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSignUp} className="space-y-4">
          {/* Username Section */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase font-display mb-2">
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="yourusername"
                className="w-full bg-white border border-slate-200 focus:border-slate-400 focus:ring-0 rounded-lg pl-11 pr-4 py-2.5 text-[14px] text-slate-800 placeholder-slate-400 outline-none transition-all"
              />
            </div>
          </div>

          {/* Email Section */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase font-display mb-2">
              Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white border border-slate-200 focus:border-slate-400 focus:ring-0 rounded-lg pl-11 pr-4 py-2.5 text-[14px] text-slate-800 placeholder-slate-400 outline-none transition-all"
              />
            </div>
          </div>

          {/* Password Section */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 tracking-wider uppercase font-display mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white border border-slate-200 focus:border-slate-400 focus:ring-0 rounded-lg px-4 py-2.5 text-[14px] text-slate-800 placeholder-slate-400 outline-none transition-all"
            />
          </div>

          {/* Terms and Conditions Checkbox */}
          <div className="flex items-center gap-2.5 pt-2">
            <input
              type="checkbox"
              id="terms"
              required
              className="w-4.5 h-4.5 border-slate-300 rounded text-blue-600 focus:ring-blue-500/30 cursor-pointer"
            />
            <label
              htmlFor="terms"
              className="text-[13px] text-slate-500 font-body select-none cursor-pointer"
            >
              I agree to the{" "}
              <a
                href="#"
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              >
                Terms and Conditions
              </a>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg py-3 text-[14px] transition-all shadow-[0_4px_15px_rgba(37,99,235,0.25)] active:scale-[0.99] flex items-center justify-center gap-1.5 cursor-pointer mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
            {!isLoading && (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-[14px] text-slate-500 mt-8 font-body">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

