"use client";

import React, { useState } from "react";
import Comparison from "@/components/Comparison";


export default function RouteLandingPage() {
  const [activeTab, setActiveTab] = useState<"pageviews" | "journeys" | "vitals">("pageviews");

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-blue-100 selection:text-blue-900 font-sans relative">
      {/* Background Ambient Glow matching screenshot */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top radial bloom */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[650px] bg-[radial-gradient(ellipse_75%_55%_at_50%_-5%,rgba(59,130,246,0.18)_0%,rgba(147,197,253,0.12)_35%,transparent_70%)] dark:bg-[radial-gradient(ellipse_75%_55%_at_50%_-5%,rgba(59,130,246,0.12)_0%,rgba(30,58,138,0.15)_35%,transparent_70%)] blur-3xl" />

        {/* Left glow */}
        <div className="absolute top-[18%] -left-[10%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(59,130,246,0.12)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(59,130,246,0.06)_0%,transparent_70%)] blur-[100px]" />

        {/* Right glow */}
        <div className="absolute top-[22%] -right-[10%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(99,102,241,0.12)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(99,102,241,0.06)_0%,transparent_70%)] blur-[100px]" />
      </div>
      
        <Comparison />
       
    </div>
  );
}