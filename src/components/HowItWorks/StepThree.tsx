"use client";

import React from "react";

interface LatencyItem {
  country: string;
  latency: string;
  percentage: number;
  textColor: string;
  barColor: string;
}

const latencyRegions: LatencyItem[] = [
  {
    country: "United States",
    latency: "812ms",
    percentage: 72,
    textColor: "text-[#e11d48]",
    barColor: "bg-[#e11d48]",
  },
  {
    country: "Brazil",
    latency: "548ms",
    percentage: 56,
    textColor: "text-[#e11d48]",
    barColor: "bg-[#e11d48]",
  },
  {
    country: "United Kingdom",
    latency: "318ms",
    percentage: 40,
    textColor: "text-[#d97706]",
    barColor: "bg-[#d97706]",
  },
  {
    country: "India",
    latency: "226ms",
    percentage: 32,
    textColor: "text-[#d97706]",
    barColor: "bg-[#d97706]",
  },
  {
    country: "Japan",
    latency: "201ms",
    percentage: 26,
    textColor: "text-[#0d9488]",
    barColor: "bg-[#0d9488]",
  },
  {
    country: "Canada",
    latency: "172ms",
    percentage: 19,
    textColor: "text-[#0d9488]",
    barColor: "bg-[#0d9488]",
  },
];

const carriers = [
  { name: "Airtel", latency: "267ms", textColor: "text-[#d97706]" },
  { name: "Reliance Jio", latency: "124ms", textColor: "text-[#0d9488]" },
  { name: "BSNL", latency: "1.84s", textColor: "text-[#e11d48]" },
];

const vitals = [
  { label: "LCP", value: "1.8s", color: "text-[#0d9488]" },
  { label: "CLS", value: "0.12", color: "text-[#d97706]" },
  { label: "INP", value: "210ms", color: "text-[#d97706]" },
  { label: "FCP", value: "0.9s", color: "text-[#0d9488]" },
];

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

      {/* Main Framed Container */}
      <div className="mt-7 rounded-[18px] border border-[#cfd6e2] bg-[#e0e4eb] p-3 sm:p-3.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]">
        {/* Inner Big Card: Dashboard Preview */}
        <div className="rounded-[14px] border border-[#d6dde8] bg-white p-5 sm:p-6 shadow-xs">
          {/* Card Eyebrow and Title */}
          <div className="pb-3 border-b border-[#edf2f7]">
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8695a8]">
              DASHBOARD PREVIEW
            </p>
            <h4 className="mt-1 text-[14px] sm:text-[15px] font-bold tracking-[-0.02em] text-[#0f172a]">
              Real user network telemetry
            </h4>
          </div>

          {/* 2-Column Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 mt-4">
            {/* Left Column: Latency by Region */}
            <div className="lg:col-span-7 rounded-[12px] border border-[#d6dde8] bg-[#f8fafc]/40 p-4 sm:p-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#edf2f7]">
                <span className="text-[13px] sm:text-[13.5px] font-bold text-[#0f172a]">
                  Latency by region
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8695a8]">
                  P95
                </span>
              </div>

              {/* 6 Region rows with progress bars */}
              <div className="mt-4 space-y-4">
                {latencyRegions.map((item) => (
                  <div key={item.country} className="space-y-1.5">
                    <div className="flex items-center justify-between text-[12.5px] sm:text-[13px]">
                      <span className="font-medium text-[#334155]">
                        {item.country}
                      </span>
                      <span className={`font-semibold ${item.textColor}`}>
                        {item.latency}
                      </span>
                    </div>
                    <div className="h-1.5 sm:h-2 w-full rounded-full bg-[#e2e8f0]/80 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.barColor} transition-all duration-500`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Carriers & Vitals */}
            <div className="lg:col-span-5 flex flex-col gap-3.5 sm:gap-4">
              {/* Carriers Card */}
              <div className="rounded-[12px] border border-[#d6dde8] bg-[#f8fafc]/40 p-4 sm:p-5">
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8695a8] mb-3">
                  CARRIERS
                </p>
                <div className="space-y-3">
                  {carriers.map((carrier) => (
                    <div
                      key={carrier.name}
                      className="flex items-center justify-between text-[12.5px] sm:text-[13px]"
                    >
                      <span className="font-medium text-[#334155]">
                        {carrier.name}
                      </span>
                      <span className={`font-semibold ${carrier.textColor}`}>
                        {carrier.latency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vitals Card */}
              <div className="rounded-[12px] border border-[#d6dde8] bg-[#f8fafc]/40 p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8695a8] mb-2.5">
                  VITALS
                </p>
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  {vitals.map((vital) => (
                    <div
                      key={vital.label}
                      className="rounded-[10px] border border-[#d6dde8] bg-white p-3 sm:p-3.5 shadow-2xs"
                    >
                      <p className="text-[10px] sm:text-[10.5px] font-semibold uppercase text-[#8695a8]">
                        {vital.label}
                      </p>
                      <p
                        className={`text-[19px] sm:text-[21px] font-bold tracking-tight ${vital.color} mt-1`}
                      >
                        {vital.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
