"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Moon, CheckCircle2, AlertCircle } from "lucide-react";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const errorParam = searchParams.get("error");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    errorParam === "INVALID_TOKEN"
      ? "This password reset link is invalid or has expired. Please request a new one."
      : ""
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    if (!token) {
      setErrorMessage("Reset token is missing. Please request a new password reset link.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify and try again.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newPassword: password,
          token,
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/sign-in");
        }, 2200);
      } else {
        setErrorMessage(
          data?.error ||
          data?.message ||
          "Failed to reset password. The link may have expired."
        );
      }
    } catch {
      setErrorMessage("Something went wrong. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[450px] rounded-[18px] border border-slate-200/80 bg-white p-7 sm:p-9 inside-shadow"
      style={{
        boxShadow:
          "inset 0 1.5px 3px 0 rgba(0, 0, 0, 0.08), inset 0 -1px 2px 0 rgba(255, 255, 255, 0.9), inset 0 0 0 1px rgba(226, 232, 240, 0.9), 0 14px 45px -10px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(0, 0, 0, 0.03)",
      }}
    >
      {isSuccess ? (
        <div className="text-center py-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4 border border-emerald-100">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="font-lastik text-[26px] font-normal tracking-[-0.03em] text-[#0f172a]">
            Password Updated!
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed text-[#64748b] font-instrument-sans">
            Your password has been changed successfully. Redirecting you to sign in...
          </p>
          <div className="mt-6">
            <Link
              href="/sign-in"
              className="inline-flex h-11 w-full items-center justify-center rounded-[11px] text-[14px] font-semibold text-white font-instrument-sans"
              style={{
                background:
                  "radial-gradient(circle, color(srgb 0.00784314 0.517647 0.780392 / 0.68) 0%, rgb(2, 132, 199) 64%)",
                boxShadow: "0 2px 10px rgba(2, 132, 199, 0.35)",
              }}
            >
              Sign In Now
            </Link>
          </div>
        </div>
      ) : !token && !isSuccess ? (
        <div>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 mb-4 border border-amber-200">
            <AlertCircle size={26} />
          </div>
          <h1 className="font-lastik text-center text-[26px] font-normal tracking-[-0.03em] text-[#0f172a] leading-tight">
            Invalid or Expired Link
          </h1>
          <p className="mt-2 text-center text-[13.5px] leading-relaxed text-[#64748b] font-instrument-sans">
            {errorMessage || "This password reset link is invalid or has expired. Password reset links are one-time use and valid for 1 hour."}
          </p>
          <div className="mt-6 space-y-3">
            <Link
              href="/sign-in"
              className="flex h-11 w-full items-center justify-center rounded-[11px] text-[14px] font-semibold text-white font-instrument-sans"
              style={{
                background:
                  "radial-gradient(circle, color(srgb 0.00784314 0.517647 0.780392 / 0.68) 0%, rgb(2, 132, 199) 64%)",
                boxShadow: "0 2px 10px rgba(2, 132, 199, 0.35)",
              }}
            >
              Request a New Link
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <span className="text-[10.5px] font-bold text-[#8c9ba8] tracking-[0.14em] uppercase block font-instrument-sans">
            CREATE NEW PASSWORD
          </span>
          <h1 className="font-lastik mt-2 text-[30px] sm:text-[34px] font-normal tracking-[-0.03em] text-[#0f172a] leading-tight">
            Set a new password
          </h1>
          <p className="mt-2 font-instrument-sans text-[13.5px] leading-[1.5] text-[#64748b]">
            Choose a strong password with at least 8 characters to protect your account.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {errorMessage && (
              <div className="p-3 rounded-[10px] text-[13px] font-medium bg-red-50 text-red-700 border border-red-200 font-instrument-sans">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-[10.5px] font-bold text-[#64748b] tracking-[0.12em] uppercase mb-1.5 font-instrument-sans">
                NEW PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  style={{
                    boxShadow: "inset 0 1.5px 3px rgba(0, 0, 0, 0.05)",
                  }}
                  className="w-full rounded-[10px] border border-slate-200 bg-white pl-3.5 pr-10 py-2.5 text-[14px] text-[#0f172a] placeholder-[#94a3b8] outline-none transition-all focus:border-[#0284c7] focus:ring-2 focus:ring-[#0284c7]/10 font-instrument-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 cursor-pointer text-slate-500 hover:text-slate-800 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <img
                    src={showPassword ? "/EyeClose.svg" : "/Eye.svg"}
                    alt="toggle password"
                    className="h-[18px] w-[18px] object-contain opacity-70 hover:opacity-100 transition-opacity"
                  />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10.5px] font-bold text-[#64748b] tracking-[0.12em] uppercase mb-1.5 font-instrument-sans">
                CONFIRM NEW PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  style={{
                    boxShadow: "inset 0 1.5px 3px rgba(0, 0, 0, 0.05)",
                  }}
                  className="w-full rounded-[10px] border border-slate-200 bg-white pl-3.5 pr-10 py-2.5 text-[14px] text-[#0f172a] placeholder-[#94a3b8] outline-none transition-all focus:border-[#0284c7] focus:ring-2 focus:ring-[#0284c7]/10 font-instrument-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 cursor-pointer text-slate-500 hover:text-slate-800 transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  <img
                    src={showConfirmPassword ? "/EyeClose.svg" : "/Eye.svg"}
                    alt="toggle password"
                    className="h-[18px] w-[18px] object-contain opacity-70 hover:opacity-100 transition-opacity"
                  />
                </button>
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
              <span>{isLoading ? "Updating password..." : "Update Password"}</span>
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
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
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

        <Suspense
          fallback={
            <div className="w-full max-w-[450px] rounded-[18px] border border-slate-200/80 bg-white p-9 text-center text-[#64748b]">
              Loading reset password form...
            </div>
          }
        >
          <ResetPasswordContent />
        </Suspense>
      </main>
    </div>
  );
}
