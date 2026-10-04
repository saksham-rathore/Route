"use client";

import React, { useState } from "react";

interface DataPoint {
  date: string;
  current: number;
  previous: number;
  x: number;
  yTop: number;
  yBot: number;
}

const dataPoints: DataPoint[] = [
  { date: "Apr 16", current: 5200, previous: 4350, x: 40, yTop: 50.0, yBot: 73.1 },
  { date: "Apr 20", current: 5320, previous: 4450, x: 143, yTop: 46.6, yBot: 70.4 },
  { date: "Apr 24", current: 5480, previous: 4620, x: 246, yTop: 42.2, yBot: 65.7 },
  { date: "Apr 28", current: 5450, previous: 4550, x: 349, yTop: 43.0, yBot: 67.6 },
  { date: "May 02", current: 5650, previous: 4820, x: 451, yTop: 37.6, yBot: 60.3 },
  { date: "May 06", current: 5630, previous: 4800, x: 554, yTop: 38.1, yBot: 60.8 },
  { date: "May 10", current: 5880, previous: 5020, x: 657, yTop: 31.3, yBot: 54.8 },
  { date: "May 14", current: 5800, previous: 4920, x: 760, yTop: 33.5, yBot: 57.5 },
];

const topSpline =
  "M 40 50 C 57.2 49.4, 108.7 47.9, 143 46.6 C 177.3 45.3, 211.7 42.8, 246 42.2 C 280.3 41.6, 314.8 43.8, 349 43 C 383.2 42.2, 416.8 38.4, 451 37.6 C 485.2 36.8, 519.7 39.1, 554 38.1 C 588.3 37.1, 622.7 32.1, 657 31.3 C 691.3 30.5, 742.8 33.1, 760 33.5";

const botSpline =
  "M 40 73.1 C 57.2 72.6, 108.7 71.6, 143 70.4 C 177.3 69.2, 211.7 66.2, 246 65.7 C 280.3 65.2, 314.8 68.5, 349 67.6 C 383.2 66.7, 416.8 61.4, 451 60.3 C 485.2 59.2, 519.7 61.7, 554 60.8 C 588.3 59.9, 622.7 55.3, 657 54.8 C 691.3 54.3, 742.8 57.0, 760 57.5";

const bandPath =
  "M 40 50 C 57.2 49.4, 108.7 47.9, 143 46.6 C 177.3 45.3, 211.7 42.8, 246 42.2 C 280.3 41.6, 314.8 43.8, 349 43 C 383.2 42.2, 416.8 38.4, 451 37.6 C 485.2 36.8, 519.7 39.1, 554 38.1 C 588.3 37.1, 622.7 32.1, 657 31.3 C 691.3 30.5, 742.8 33.1, 760 33.5 L 760 57.5 C 742.8 57.0, 691.3 54.3, 657 54.8 C 622.7 55.3, 588.3 59.9, 554 60.8 C 519.7 61.7, 485.2 59.2, 451 60.3 C 416.8 61.4, 383.2 66.7, 349 67.6 C 314.8 68.5, 280.3 65.2, 246 65.7 C 211.7 66.2, 177.3 69.2, 143 70.4 C 108.7 71.6, 57.2 72.6, 40 73.1 Z";

const botAreaPath =
  "M 40 73.1 C 57.2 72.6, 108.7 71.6, 143 70.4 C 177.3 69.2, 211.7 66.2, 246 65.7 C 280.3 65.2, 314.8 68.5, 349 67.6 C 383.2 66.7, 416.8 61.4, 451 60.3 C 485.2 59.2, 519.7 61.7, 554 60.8 C 588.3 59.9, 622.7 55.3, 657 54.8 C 691.3 54.3, 742.8 57.0, 760 57.5 L 760 192 L 40 192 Z";

export const StepTwo = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const activePoint = hoveredIdx !== null ? dataPoints[hoveredIdx] : null;

  return (
    <div className="mt-20 text-left font-instrument-sans">
      {/* Step 02 Eyebrow, Heading & Subtitle */}
      <div>
        <p className="max-w-[720px] text-[16px] font-medium leading-[1.42] tracking-[-0.02em] text-[#77736c] sm:text-[12px] uppercase">
          STEP 02
        </p>
        <h3 className="max-w-[720px] text-[24px] font-medium leading-[1.3] tracking-[-0.04em] text-[#0284C7] sm:text-[40px] mt-1">
          Flow the data through the edge
        </h3>
        <p className="max-w-[720px] text-[15px] font-medium leading-[1.45] tracking-[-0.02em] text-[#77736c] sm:text-[16px] mt-2">
          Requests are captured in the browser, enriched at the edge, and
          stitched together with network context like ISP, city, and country
          before they ever reach the dashboard.
        </p>
      </div>

      {/* Main Framed Container */}
      <div className="mt-7 rounded-[18px] border border-[#cfd6e2] bg-[#e0e4eb] p-3 sm:p-3.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]">
        {/* Top 4 Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
          {/* 1. EDGE ENRICHED REQUESTS */}
          <div className="rounded-[14px] border border-[#d6dde8] bg-white p-4 sm:p-5 shadow-xs transition-shadow hover:shadow-sm">
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8695a8]">
              EDGE ENRICHED REQUESTS
            </p>
            <div className="mt-2.5 flex items-center gap-2 sm:gap-2.5">
              <span className="text-[22px] sm:text-[28px] font-bold tracking-tight text-[#0f172a]">
                149,402
              </span>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-[#ecfdf5] px-2 py-0.5 text-[11px] sm:text-[12px] font-semibold text-[#059669]">
                <span className="text-[12px] font-bold leading-none">↗</span>
                12.0%
              </span>
            </div>
          </div>

          {/* 2. ISP MATCHES */}
          <div className="rounded-[14px] border border-[#d6dde8] bg-white p-4 sm:p-5 shadow-xs transition-shadow hover:shadow-sm">
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8695a8]">
              ISP MATCHES
            </p>
            <div className="mt-2.5 flex items-center gap-2 sm:gap-2.5">
              <span className="text-[22px] sm:text-[28px] font-bold tracking-tight text-[#0f172a]">
                98.4%
              </span>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-[#ecfdf5] px-2 py-0.5 text-[11px] sm:text-[12px] font-semibold text-[#059669]">
                <span className="text-[12px] font-bold leading-none">↗</span>
                8.4%
              </span>
            </div>
          </div>

          {/* 3. CITIES RESOLVED */}
          <div className="rounded-[14px] border border-[#d6dde8] bg-white p-4 sm:p-5 shadow-xs transition-shadow hover:shadow-sm">
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8695a8]">
              CITIES RESOLVED
            </p>
            <div className="mt-2.5 flex items-center gap-2 sm:gap-2.5">
              <span className="text-[22px] sm:text-[28px] font-bold tracking-tight text-[#0f172a]">
                1,284
              </span>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-[#ecfdf5] px-2 py-0.5 text-[11px] sm:text-[12px] font-semibold text-[#059669]">
                <span className="text-[12px] font-bold leading-none">↗</span>
                6.2%
              </span>
            </div>
          </div>

          {/* 4. COUNTRIES TAGGED */}
          <div className="rounded-[14px] border border-[#d6dde8] bg-white p-4 sm:p-5 shadow-xs transition-shadow hover:shadow-sm">
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8695a8]">
              COUNTRIES TAGGED
            </p>
            <div className="mt-2.5 flex items-center gap-2 sm:gap-2.5">
              <span className="text-[22px] sm:text-[28px] font-bold tracking-tight text-[#0f172a]">
                86
              </span>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-[#ecfdf5] px-2 py-0.5 text-[11px] sm:text-[12px] font-semibold text-[#059669]">
                <span className="text-[12px] font-bold leading-none">↗</span>
                2.1%
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Chart Card */}
        <div className="relative mt-3 sm:mt-3.5 rounded-[14px] border border-[#d6dde8] bg-white p-5 sm:p-6 shadow-xs">
          {/* Card Header */}
          <div className="pb-3 border-b border-[#edf2f7]">
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8695a8]">
              CURRENT VS PREVIOUS PERIOD
            </p>
            <h4 className="mt-1 text-[14px] sm:text-[15px] font-bold tracking-[-0.02em] text-[#0f172a]">
              Requests Enriched At The Edge
            </h4>
          </div>

          {/* Floating Tooltip when hovering */}
          {activePoint && (
            <div
              className="pointer-events-none absolute z-20 hidden sm:flex flex-col gap-0.5 rounded-lg border border-[#cbd5e1] bg-white/95 px-3 py-2 text-xs shadow-md backdrop-blur-xs transition-all duration-100"
              style={{
                left: `clamp(40px, ${(activePoint.x / 800) * 100}%, calc(100% - 150px))`,
                top: "70px",
                transform: "translateX(-50%)",
              }}
            >
              <div className="font-semibold text-[#0f172a]">{activePoint.date}</div>
              <div className="flex items-center gap-2 text-[#2563eb] font-medium">
                <span>Current:</span>
                <span className="font-bold">{activePoint.current.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-[#64748b]">
                <span>Previous:</span>
                <span>{activePoint.previous.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Chart SVG */}
          <div className="relative mt-2 w-full overflow-hidden">
            <svg
              viewBox="0 0 800 230"
              className="w-full h-auto select-none"
              style={{ fontFamily: '"Instrument Sans", ui-sans-serif, system-ui, sans-serif' }}
            >
              <defs>
                <linearGradient id="stepTwoBotAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.22" />
                  <stop offset="60%" stopColor="#dbeafe" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#eff6ff" stopOpacity="0.0" />
                </linearGradient>

                <linearGradient id="stepTwoTopBandGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.13" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.08" />
                </linearGradient>
              </defs>

              {/* Horizontal Gridlines */}
              <line x1="40" y1="28" x2="760" y2="28" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="69" x2="760" y2="69" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="110" x2="760" y2="110" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="151" x2="760" y2="151" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="192" x2="760" y2="192" stroke="#f1f5f9" strokeWidth="1" />

              {/* Y-Axis Numerical Labels */}
              <text x="40" y="22" fill="#8695a8" fontSize="11" fontWeight="500">
                6000
              </text>
              <text x="40" y="63" fill="#8695a8" fontSize="11" fontWeight="500">
                4500
              </text>
              <text x="40" y="104" fill="#8695a8" fontSize="11" fontWeight="500">
                3000
              </text>
              <text x="40" y="145" fill="#8695a8" fontSize="11" fontWeight="500">
                1500
              </text>
              <text x="40" y="186" fill="#8695a8" fontSize="11" fontWeight="500">
                0
              </text>

              {/* Shaded Area Under Bottom Curve */}
              <path d={botAreaPath} fill="url(#stepTwoBotAreaGradient)" />

              {/* Shaded Band Between Top Curve & Bottom Curve */}
              <path d={bandPath} fill="url(#stepTwoTopBandGradient)" />

              {/* Bottom Curve Stroke (Light Blue) */}
              <path
                d={botSpline}
                fill="none"
                stroke="#93c5fd"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Top Curve Stroke (Deep Blue) */}
              <path
                d={topSpline}
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Active Indicator Line and Points on Hover */}
              {activePoint && (
                <g>
                  <line
                    x1={activePoint.x}
                    y1="28"
                    x2={activePoint.x}
                    y2="192"
                    stroke="#94a3b8"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <circle
                    cx={activePoint.x}
                    cy={activePoint.yBot}
                    r="4"
                    fill="#93c5fd"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <circle
                    cx={activePoint.x}
                    cy={activePoint.yTop}
                    r="4.5"
                    fill="#2563eb"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                </g>
              )}

              {/* X-Axis Date Labels */}
              <text x="40" y="214" textAnchor="start" fill="#8695a8" fontSize="11" fontWeight="500">
                Apr 16
              </text>
              <text x="143" y="214" textAnchor="middle" fill="#8695a8" fontSize="11" fontWeight="500">
                Apr 20
              </text>
              <text x="246" y="214" textAnchor="middle" fill="#8695a8" fontSize="11" fontWeight="500">
                Apr 24
              </text>
              <text x="349" y="214" textAnchor="middle" fill="#8695a8" fontSize="11" fontWeight="500">
                Apr 28
              </text>
              <text x="451" y="214" textAnchor="middle" fill="#8695a8" fontSize="11" fontWeight="500">
                May 02
              </text>
              <text x="554" y="214" textAnchor="middle" fill="#8695a8" fontSize="11" fontWeight="500">
                May 06
              </text>
              <text x="657" y="214" textAnchor="middle" fill="#8695a8" fontSize="11" fontWeight="500">
                May 10
              </text>
              <text x="760" y="214" textAnchor="end" fill="#8695a8" fontSize="11" fontWeight="500">
                May 14
              </text>

              {/* Transparent Hover Hit Areas across the 8 columns */}
              {dataPoints.map((pt, i) => (
                <rect
                  key={pt.date}
                  x={pt.x - 30}
                  y="20"
                  width="60"
                  height="190"
                  fill="transparent"
                  className="cursor-crosshair"
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              ))}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
