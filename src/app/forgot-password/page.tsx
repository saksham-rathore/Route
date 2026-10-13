"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Moon } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          redirectTo: `${window.location.origin}/reset-password`,
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Password reset link sent! Check your inbox and spam folder.",
        });
      } else {
        setMessage({
          type: "error",
          text:
            data?.error ||
            data?.message ||
            "Failed to send reset link. Please check the email and try again.",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Failed to send reset email. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#eef2f6] flex flex-col font-instrument-sans antialiased text-[#0f172a]">
      {/* Top Bar with Theme Toggle */}
      <header className="w-full flex items-center justify-end px-6 py-5 sm:px-10 lg:px-14">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-[9px] border border-slate-200/90 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          style={{
            boxShadow:
              "inset 0 1px 2px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.04)",
          }}
          aria-label="Toggle theme"
        >
          <Moon size={16} strokeWidth={2} />
        </button>
      </header>

      {/* Main Centered Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-12 pt-2 sm:pb-16">
        {/* Brand Logo in Middle */}
        <div className="mb-6 flex items-center justify-center">
          <Link href="/" className="flex items-center gap-2.5 group">
            <img
              src="/logo.svg"
              alt="Route"
              className="h-10 w-10 object-contain rounded-xl shadow-[0_3px_12px_rgba(2,132,199,0.22)] transition-transform duration-200 group-hover:scale-105"
            />
            <span className="text-[26px] font-normal leading-none tracking-[-0.02em] text-[#0f172a]">
              Route
            </span>
          </Link>
        </div>

        {/* Card */}
        <div
          className="w-full max-w-[450px] rounded-[18px] border border-slate-200/80 bg-white p-7 sm:p-9 inside-shadow"
          style={{
            boxShadow:
              "inset 0 1.5px 3px 0 rgba(0, 0, 0, 0.08), inset 0 -1px 2px 0 rgba(255, 255, 255, 0.9), inset 0 0 0 1px rgba(226, 232, 240, 0.9), 0 14px 45px -10px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(0, 0, 0, 0.03)",
          }}
        >
          <span className="text-[10.5px] font-bold text-[#8c9ba8] tracking-[0.14em] uppercase block font-instrument-sans">
            PASSWORD RECOVERY
          </span>
          <h1 className="font-lastik mt-2 text-[30px] sm:text-[34px] font-normal tracking-[-0.03em] text-[#0f172a] leading-tight">
            Forgot your password?
          </h1>
          <p className="mt-2 font-instrument-sans text-[13.5px] leading-[1.5] text-[#64748b]">
            Enter the email associated with your account and we&apos;ll send you a link to reset your password.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {message && (
              <div
                className={`p-3 rounded-[10px] text-[13px] font-medium ${
                  message.type === "success"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message.text}
              </div>
            )}

            <div>
              <label className="block text-[10.5px] font-bold text-[#64748b] tracking-[0.12em] uppercase mb-1.5 font-instrument-sans">
                EMAIL
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94a3b8]">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{
                    boxShadow: "inset 0 1.5px 3px rgba(0, 0, 0, 0.05)",
                  }}
                  className="w-full rounded-[10px] border border-slate-200 bg-white pl-10 pr-3.5 py-2.5 text-[14px] text-[#0f172a] placeholder-[#94a3b8] outline-none transition-all focus:border-[#0284c7] focus:ring-2 focus:ring-[#0284c7]/10 font-instrument-sans"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                background:
                  "radial-gradient(circle, color(srgb 0.00784314 0.517647 0.780392 / 0.68) 0%, rgb(2, 132, 199) 64%)",
                boxShadow:
                  "0 2px 10px rgba(2, 132, 199, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.28), inset 0 -1px 2px rgba(0, 0, 0, 0.15)",
              }}
              className="group mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-[11px] text-[14px] font-semibold text-white transition-all duration-200 hover:brightness-105 active:scale-[0.99] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed font-instrument-sans"
            >
              <span>{isLoading ? "Sending link..." : "Send Reset Link"}</span>
              {!isLoading && (
                <span className="text-[15px] font-normal leading-none transition-transform duration-200 group-hover:translate-x-0.5">
                  →
                </span>
              )}
            </button>

            <div className="pt-2 text-center">
              <Link
                href="/sign-in"
                className="text-[13px] font-medium text-[#64748b] hover:text-[#0f172a] transition-colors font-instrument-sans"
              >
                ← Back to Sign In
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
