"use client";

import React from "react";

export const CTA = () => {
  return (
    <section className="py-20 relative overflow-hidden bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="rounded-3xl border border-blue-200 bg-[radial-gradient(ellipse_at_top,rgba(219,234,254,0.6)_0%,rgba(248,250,252,0.95)_70%)] p-10 sm:p-16 shadow-[0_12px_45px_rgba(37,99,235,0.08)]">
          <h2 className="text-3xl sm:text-5xl font-bold text-zinc-950 tracking-tight">
            Ready to see your app through your users' eyes?
          </h2>
          <p className="mt-4 text-zinc-600 text-sm sm:text-base max-w-xl mx-auto">
            Join engineering and product teams getting real visibility into
            their user journeys, Core Web Vitals, and API performance.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="#demo"
              className="px-8 py-3.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/30 transition hover:scale-[1.02]"
            >
              Get Started for Free
            </a>
            <a
              href="#demo"
              className="px-8 py-3.5 rounded-xl text-sm font-semibold text-zinc-800 hover:text-zinc-950 bg-white border border-zinc-300 hover:bg-zinc-50 shadow-xs transition"
            >
              View Live Demo
            </a>
          </div>
          <p className="mt-4 text-xs text-zinc-500">
            Takes 60 seconds · No credit card required · Free tier forever
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
