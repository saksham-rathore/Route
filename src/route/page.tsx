"use client";

import React from "react";
import { Navbar } from "@/components/Navbar/page";
import { Hero } from "@/components/Hero/page";
import { Demo } from "@/components/Demo/page";
import { Features } from "@/components/Features/page";
import { HowItWorks } from "@/components/HowItWorks/page";
import { Testimonials } from "@/components/Testimonials/page";
import { Comparison } from "@/components/Comparison/page";
import { FAQ } from "@/components/FAQ/page";
import { CTA } from "@/components/CTA/page";
import { Footer } from "@/components/Footer/page";

export default function RouteLandingPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-blue-100 selection:text-blue-900 font-sans">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[520px] bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08)_0%,rgba(240,247,255,0.7)_45%,transparent_75%)] blur-3xl" />
        <div className="absolute top-[35%] right-[-8%] w-[450px] h-[450px] bg-blue-500/[0.04] rounded-full blur-[100px]" />
        <div className="absolute bottom-[25%] left-[-8%] w-[450px] h-[450px] bg-indigo-500/[0.04] rounded-full blur-[100px]" />
      </div>

      {/* Navigation Header */}
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10">
        <Hero />
        <Demo />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Comparison />
        <FAQ />
        <CTA />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}