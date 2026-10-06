"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";

export default function OnboardingHeader() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Sync initial state with document class
    if (typeof document !== "undefined") {
      setIsDark(document.documentElement.classList.contains("dark"));
    }
  }, []);

  function toggleTheme() {
    setIsDark((prev) => !prev);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark");
    }
  }

  return (
    <header className="h-[65px] shrink-0 border-b border-[#dfe4ec] bg-[#eef1f6] dark:border-[#1c2433] dark:bg-[#0c111b] transition-colors duration-200">
      <div className="mx-auto flex h-full max-w-[1104px] items-center justify-between px-4 sm:px-6">
        {/* Route Brand & Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <img
            src="/logo.svg"
            alt="Route logo"
            className="h-7 w-7 object-contain transition-transform duration-200 group-hover:scale-105"
          />
          <span className="font-sans text-[24px] font-bold leading-none tracking-[-0.04em] text-[#0b1220] dark:text-white">
            Route<span className="text-[#0284c7]">.</span>
          </span>
        </Link>

        {/* Theme Toggle Button */}
        <button
          type="button"
          aria-label="Toggle theme"
          onClick={toggleTheme}
          className="flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-lg border border-slate-200/80 bg-white text-slate-600 shadow-xs transition hover:bg-slate-50 dark:border-[#1c2433] dark:bg-[#151d2e] dark:text-[#cbd5e1] inside-shadow"
        >
          {isDark ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-slate-600" />
          )}
        </button>
      </div>
    </header>
  );
}
