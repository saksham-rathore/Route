"use client";

import React from "react";
import { Comparison } from "@/components/Comparison/page";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-blue-100 selection:text-blue-900 font-sans">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[520px] bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08)_0%,rgba(240,247,255,0.7)_45%,transparent_75%)] blur-3xl" />
        <div className="absolute top-[35%] right-[-8%] w-[450px] h-[450px] bg-blue-500/[0.04] rounded-full blur-[100px]" />
        <div className="absolute bottom-[25%] left-[-8%] w-[450px] h-[450px] bg-indigo-500/[0.04] rounded-full blur-[100px]" />
      </div>
      <main className="relative z-10">
        <Comparison />
      </main>
    </div>
  );
}
