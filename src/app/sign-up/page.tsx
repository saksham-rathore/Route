"use client";

import React from "react";
import Link from "next/link";
import { Moon, GitBranch } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen w-full bg-[#eef2f6] flex flex-col font-instrument-sans antialiased text-[#0f172a]">
      {/* Top Bar with Theme Toggle on Right */}
      <header className="w-full flex items-center justify-end px-6 py-5 sm:px-10 lg:px-14">
        {/* Theme Toggle Button */}
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
            <span className="font-lastik text-[26px] font-normal leading-none tracking-[-0.02em] text-[#0f172a]">
              Route
            </span>
          </Link>
        </div>

        {/* Card with Inside Shadow Border */}
        <div
          className="w-full max-w-[450px] rounded-[18px] border border-slate-200/80 bg-white p-7 sm:p-9"
          style={{
            boxShadow:
              "inset 0 1.5px 3px rgba(255, 255, 255, 0.9), inset 0 0 0 1px rgba(0, 0, 0, 0.03), 0 14px 45px -10px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(0, 0, 0, 0.03)",
          }}
        >
          {/* Category Header */}
          <span className="text-[10.5px] font-bold text-[#8c9ba8] tracking-[0.14em] uppercase block font-instrument-sans">
            GET STARTED
          </span>
          <h1 className="font-lastik mt-2 text-[30px] sm:text-[34px] font-normal tracking-[-0.03em] text-[#0f172a] leading-tight">
            Create your account
          </h1>
          <p className="mt-2 font-instrument-sans text-[13.5px] leading-[1.5] text-[#64748b]">
            Start monitoring your app with the same clean workflow as onboarding.
          </p>

          {/* OAuth Buttons with Inside Shadow Border */}
          <div className="mt-6 space-y-2.5">
            <button
              type="button"
              style={{
                boxShadow:
                  "inset 0 1.5px 3px rgba(0, 0, 0, 0.06), inset 0 0 0 1px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.03)",
              }}
              className="flex h-11 w-full items-center justify-center gap-2.5 rounded-[10px] border border-slate-200/90 bg-[#f1f4f8] text-[13.5px] font-medium text-[#1e293b] hover:bg-[#e8edf4] transition-colors cursor-pointer active:scale-[0.99] font-instrument-sans"
            >
              <img src="/GithubSign.svg" alt="Github" />
              <span>Continue with GitHub</span>
            </button>

            <button
              type="button"
              style={{
                boxShadow:
                  "inset 0 1.5px 3px rgba(0, 0, 0, 0.06), inset 0 0 0 1px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.03)",
              }}
              className="flex h-11 w-full items-center justify-center gap-2.5 rounded-[10px] border border-slate-200/90 bg-[#f1f4f8] text-[13.5px] font-medium text-[#1e293b] hover:bg-[#e8edf4] transition-colors cursor-pointer active:scale-[0.99] font-instrument-sans"
            >
              <img src="/Google.svg" alt="google" />
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="border-t border-slate-200/80 w-full" />
            <span className="absolute bg-white px-3 text-[10px] font-bold text-[#8c9ba8] tracking-[0.14em] uppercase font-instrument-sans">
              OR CONTINUE WITH EMAIL
            </span>
          </div>

          {/* Input Form with Inside Shadow Border */}
          <form className="space-y-4">
            <div>
              <label className="block text-[10.5px] font-bold text-[#64748b] tracking-[0.12em] uppercase mb-1.5 font-instrument-sans">
                USERNAME
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="yourusername"
                  style={{
                    boxShadow: "inset 0 1.5px 3px rgba(0, 0, 0, 0.05)",
                  }}
                  className="w-full rounded-[10px] border border-slate-200 bg-white pl-10 pr-3.5 py-2.5 text-[14px] text-[#0f172a] placeholder-[#94a3b8] outline-none transition-all focus:border-[#0284c7] focus:ring-2 focus:ring-[#0284c7]/10 font-instrument-sans"
                />
              </div>
            </div>

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
                  placeholder="you@example.com"
                  style={{
                    boxShadow: "inset 0 1.5px 3px rgba(0, 0, 0, 0.05)",
                  }}
                  className="w-full rounded-[10px] border border-slate-200 bg-white pl-10 pr-3.5 py-2.5 text-[14px] text-[#0f172a] placeholder-[#94a3b8] outline-none transition-all focus:border-[#0284c7] focus:ring-2 focus:ring-[#0284c7]/10 font-instrument-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10.5px] font-bold text-[#64748b] tracking-[0.12em] uppercase mb-1.5 font-instrument-sans">
                PASSWORD
              </label>
              <input
                type="password"
                placeholder="........"
                style={{
                  boxShadow: "inset 0 1.5px 3px rgba(0, 0, 0, 0.05)",
                }}
                className="w-full rounded-[10px] border border-slate-200 bg-white px-3.5 py-2.5 text-[14px] text-[#0f172a] placeholder-[#94a3b8] outline-none transition-all focus:border-[#0284c7] focus:ring-2 focus:ring-[#0284c7]/10 font-instrument-sans"
              />
            </div>

            {/* Checkbox */}
            <div className="flex items-center gap-2.5 pt-1">
              <input
                type="checkbox"
                id="terms"
                className="h-4 w-4 rounded-[4px] border-slate-300 text-[#0284c7] focus:ring-2 focus:ring-[#0284c7]/20 cursor-pointer"
              />
              <label htmlFor="terms" className="text-[12.5px] text-[#0284c7] cursor-pointer select-none font-instrument-sans">
                I agree to the{" "}
                <a href="#" className="font-medium text-[#0284c7]">
                  Terms and Conditions
                </a>
              </label>
            </div>

            {/* Submit Button with user's signature button gradient & shadow border */}
            <button
              type="button"
              style={{
                background:
                  "radial-gradient(circle, color(srgb 0.00784314 0.517647 0.780392 / 0.68) 0%, rgb(2, 132, 199) 64%)",
                boxShadow:
                  "0 2px 10px rgba(2, 132, 199, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.28), inset 0 -1px 2px rgba(0, 0, 0, 0.15)",
              }}
              className="group mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-[11px] text-[14px] font-semibold text-white transition-all duration-200 hover:brightness-105 active:scale-[0.99] cursor-pointer font-instrument-sans"
            >
              <span>Create Account</span>
              <span className="text-[15px] font-normal leading-none transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </button>
          </form>

          {/* Footer Link */}
          <p className="mt-6 text-center text-[13.5px] text-[#64748b] font-instrument-sans">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-[#0284c7] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
