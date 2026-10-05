"use client";

import React, { useState } from "react";
import { UserAnalyticsView } from "./UserAnalyticsView";
import { ObservabilityView } from "./ObservabilityView";
// import { ISPDiagnosticsView } from "./ISPDiagnosticsView";
import { WebVitalsView } from "./WebVitalsView";
import { InstallationView } from "./InstallationView";

export type PlatformTab =
  | "analytics"
  | "observability"
  // | "isp"
  | "vitals"
  | "installation";

interface TabConfig {
  id: PlatformTab;
  label: string;
  eyebrow: string;
  headline: string;
}

const tabs: TabConfig[] = [
  {
    id: "analytics",
    label: "User Analytics",
    eyebrow: "USER ANALYTICS",
    headline: "See how users actually use your product.",
  },
  {
    id: "observability",
    label: "Observability",
    eyebrow: "OBSERVABILITY",
    headline: "End-to-end edge tracing & real-time error telemetry.",
  },
  // {
  //   id: "isp",
  //   label: "ISP Diagnostics",
  //   eyebrow: "ISP & NETWORK DIAGNOSTICS",
  //   headline: "Diagnose carrier throttling & BGP edge routing bottlenecks.",
  // },
  {
    id: "vitals",
    label: "Web Vitals",
    eyebrow: "CORE WEB VITALS",
    headline: "Real-user field performance metrics that drive SEO rank.",
  },
  {
    id: "installation",
    label: "Installation",
    eyebrow: "ONE-LINE INSTALLATION",
    headline: "One script. Zero bundle bloat. Live in 60 seconds.",
  },
];

export const PlatformSection = () => {
  const [activeTab, setActiveTab] = useState<PlatformTab>("analytics");

  const currentTabConfig = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <section id="platform" className="w-full bg-white pb-28 pt-16 px-4 sm:px-6 lg:px-8 font-instrument-sans border-t border-[#edf2f7]">
      <div className="mx-auto max-w-[1140px]">
        {/* Section Header */}
        <div className="text-center">
          <p className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.3em] text-[#0284C7]">
            PLATFORM
          </p>

          <h2 className="font-lastik mx-auto mt-3 max-w-[880px] text-center text-[34px] sm:text-[44px] md:text-[52px] font-medium leading-[1.08] tracking-[-0.04em] text-[#0f172a]">
            Everything you need to understand{" "}
            <span className="text-[#0284C7]">real user experience.</span>
          </h2>

          <p className="mx-auto mt-3.5 max-w-[640px] text-[15px] sm:text-[17px] font-medium leading-[1.45] tracking-[-0.02em] text-[#77736c]">
            Five pillars of visibility, from user analytics and observability to one-line installation.
          </p>

          {/* Interactive Navigation Pills (Matching Screenshot) */}
          <div className="mt-8 flex justify-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-1 sm:gap-2 rounded-full border border-[#cbd5e1] bg-white p-1.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`rounded-full px-4 py-2 text-[12.5px] sm:text-[13.5px] font-medium transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-[#0284C7] text-white font-semibold shadow-xs"
                        : "text-[#64748b] hover:text-[#0f172a] hover:bg-slate-50"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Outer Presentation Card Container with Inside Shadow Border & Normal White Background */}
        <div
          className="mt-7 sm:mt-8 rounded-[20px] sm:rounded-[24px] border border-[#d6dde8] bg-white p-3.5 sm:p-5 lg:p-5.5"
          style={{
            boxShadow:
              "rgba(255, 255, 255, 0.85) 0px 1px 0px 0px inset, rgba(15, 23, 42, 0.08) 0px 2px 8px 0px inset, rgba(15, 23, 42, 0.05) 0px -1px 0px 0px inset, rgba(15, 23, 42, 0.04) 0px 20px 50px -10px",
          }}
        >
          {/* Card Eyebrow & Title */}
          <div className="mb-3 sm:mb-3.5">
            <p className="text-[10.5px] sm:text-[11.5px] font-bold uppercase tracking-[0.2em] text-[#0284C7]">
              {currentTabConfig.eyebrow}
            </p>
            <h3 className="mt-1 text-[20px] sm:text-[24px] font-semibold tracking-[-0.03em] text-[#0f172a]">
              {currentTabConfig.headline}
            </h3>
          </div>

          {/* Active System Render */}
          <div className="transition-opacity duration-300">
            {activeTab === "analytics" && <UserAnalyticsView />}
            {activeTab === "observability" && <ObservabilityView />}
            {/* {activeTab === "isp" && <ISPDiagnosticsView />} */}
            {activeTab === "vitals" && <WebVitalsView />}
            {activeTab === "installation" && <InstallationView />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformSection;
