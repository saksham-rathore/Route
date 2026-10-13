"use client";

import React from "react";
import { StaticDashboardMock } from "../dashboard/StaticDashboardMock";

export const StepThree = () => {
  return (
    <div className="mt-20 text-left font-instrument-sans">
      {/* Header */}
      <div>
        <p className="max-w-[720px] text-[16px] font-medium leading-[1.42] tracking-[-0.02em] text-[#77736c] sm:text-[12px] uppercase">
          STEP 03
        </p>
        <h3 className="max-w-[720px] text-[24px] font-medium leading-[1.3] tracking-[-0.04em] text-[#0284C7] sm:text-[40px] mt-1">
          See the experience in the dashboard
        </h3>
        <p className="max-w-[720px] text-[15px] font-medium leading-[1.45] tracking-[-0.02em] text-[#77736c] sm:text-[16px] mt-2">
          Open the dashboard and inspect where latency is coming from, which
          carriers are hurting real users, and how web vitals shift by
          geography and connection quality.
        </p>
      </div>

      {/* Main Presentation Card (Matching previous colors, shadow & fonts) */}
      <div
        className="mt-7 sm:mt-8 rounded-[20px] sm:rounded-[24px] border border-[#d6dde8] bg-white p-3.5 sm:p-5 lg:p-5.5 text-left"
        style={{
          boxShadow:
            "rgba(255, 255, 255, 0.85) 0px 1px 0px 0px inset, rgba(15, 23, 42, 0.08) 0px 2px 8px 0px inset, rgba(15, 23, 42, 0.05) 0px -1px 0px 0px inset, rgba(15, 23, 42, 0.04) 0px 20px 50px -10px",
        }}
      >
        {/* Card Eyebrow & Title */}
        <div className="mb-3 sm:mb-3.5">
          <p className="text-[10.5px] sm:text-[11.5px] font-bold uppercase tracking-[0.2em] text-[#0284C7] font-instrument-sans">
            CORE WEB VITALS
          </p>
          <h3 className="mt-1 text-[20px] sm:text-[24px] font-semibold tracking-[-0.03em] text-[#0f172a] font-lastik">
            Monitor real-world user performance: LCP, FCP, and CLS.
          </h3>
        </div>

        {/* Browser Mock Frame */}
        <div className="overflow-hidden rounded-[16px] border border-[#d8e0ea] bg-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),inset_0_2px_6px_0_rgba(15,23,42,0.04),0_12px_40px_-10px_rgba(15,23,42,0.06)]">
          {/* Top Browser Bar */}
          <div className="flex h-10 items-center justify-between border-b border-[#e2e8f0] bg-[#f8fafc] px-4 font-instrument-sans">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#cbd5e1]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#cbd5e1]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#cbd5e1]" />
            </div>

            <div className="flex h-6 items-center rounded-md border border-[#e2e8f0] bg-white px-3 text-[10px] text-[#64748b]">
              <span className="text-[#94a3b8] mr-1">https://</span>
              app.route.dev/analytics/web-vitals
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[9.5px] font-semibold text-blue-700 font-instrument-sans">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
                DEMO DATA
              </span>
            </div>
          </div>

          {/* 3rd Component (Web Vitals Dashboard) */}
          <StaticDashboardMock initialTab="vitals" hideRightSidebar />
        </div>
      </div>
    </div>
  );
};
