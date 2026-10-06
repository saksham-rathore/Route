"use client";

import React, { useState } from "react";

// X-axis timestamps matching the exact latest screenshot
const timeLabels = [
  "18:02",
  "21:02",
  "00:02",
  "03:02",
  "06:02",
  "09:02",
  "12:02",
  "15:02",
];

export function LatencyDistributionChart() {
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);

  // viewBox: 860 width x 215 height
  const yTicks = [
    { label: "240ms", y: 22 },
    { label: "180ms", y: 62 },
    { label: "120ms", y: 102 },
    { label: "60ms", y: 142 },
    { label: "0ms", y: 182 },
  ];

  // SVG smooth paths matching exact waves in the screenshot
  const p99Line =
    "M 55,70 C 110,61 160,56 220,61 C 280,65 330,79 390,81 C 420,84 440,70 470,70 C 500,70 530,88 590,84 C 640,79 680,61 720,29 C 760,36 790,61 840,68";
  const p99Area = `${p99Line} L 840,182 L 55,182 Z`;

  const p95Line =
    "M 55,91 C 110,81 160,79 220,84 C 280,88 330,102 390,111 C 420,113 440,102 470,102 C 500,102 530,118 590,116 C 640,111 680,95 720,72 C 760,79 790,95 840,100";
  const p95Area = `${p95Line} L 840,182 L 55,182 Z`;

  const p50Line =
    "M 55,150 C 110,148 160,148 220,149 C 280,150 330,152 390,155 C 420,155 440,153 470,153 C 500,153 530,155 590,152 C 640,150 680,148 720,147 C 760,148 790,150 840,151";
  const p50Area = `${p50Line} L 840,182 L 55,182 Z`;

  return (
    <div className="relative mt-2 w-full select-none overflow-hidden">
      <svg
        viewBox="0 0 860 215"
        className="h-auto w-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* p99 landing page rose-red gradient */}
          <linearGradient id="p99Grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e11d48" stopOpacity="0.07" />
            <stop offset="100%" stopColor="#e11d48" stopOpacity="0.0" />
          </linearGradient>

          {/* p95 landing page Route blue gradient */}
          <linearGradient id="p95Grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.09" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
          </linearGradient>

          {/* p50 dark charcoal gradient */}
          <linearGradient id="p50Grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f172a" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines & Y labels */}
        {yTicks.map((tick) => (
          <g key={tick.label}>
            <line
              x1="52"
              y1={tick.y}
              x2="840"
              y2={tick.y}
              stroke="#f1f5f9"
              strokeWidth="0.8"
            />
            <text
              x="44"
              y={tick.y + 3.5}
              textAnchor="end"
              fill="#94a3b8"
              fontSize="10"
              fontFamily="inherit"
              className="tabular-nums font-medium"
            >
              {tick.label}
            </text>
          </g>
        ))}

        {/* Shaded Areas */}
        <path d={p99Area} fill="url(#p99Grad)" />
        <path d={p95Area} fill="url(#p95Grad)" />
        <path d={p50Area} fill="url(#p50Grad)" />

        {/* Continuous Wave Lines - slightly thin elegant strokes */}
        <path
          d={p99Line}
          stroke="#e11d48"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={p95Line}
          stroke="#0284c7"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={p50Line}
          stroke="#0f172a"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* X-axis labels */}
        {timeLabels.map((time, idx) => {
          const x = 55 + (idx * (840 - 55)) / (timeLabels.length - 1);
          return (
            <text
              key={time}
              x={x}
              y="204"
              textAnchor={idx === 0 ? "start" : idx === timeLabels.length - 1 ? "end" : "middle"}
              fill="#94a3b8"
              fontSize="9.5"
              fontFamily="inherit"
              className="tabular-nums font-medium"
            >
              {time}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

export function CumulativeRequestsChart() {
  const yTicks = [
    { label: "1200", y: 20 },
    { label: "900", y: 55 },
    { label: "600", y: 90 },
    { label: "300", y: 125 },
    { label: "0", y: 160 },
  ];

  // Upward smooth climbing curve from 0 to ~1050
  const linePath =
    "M 45,160 C 110,146 170,125 230,104 C 290,83 350,55 405,37";
  const areaPath = `${linePath} L 405,160 L 45,160 Z`;

  return (
    <div className="relative mt-2 w-full select-none overflow-hidden">
      <svg
        viewBox="0 0 420 185"
        className="h-auto w-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="blueAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {yTicks.map((tick) => (
          <g key={tick.label}>
            <line
              x1="45"
              y1={tick.y}
              x2="405"
              y2={tick.y}
              stroke="#f1f5f9"
              strokeWidth="0.8"
            />
            <text
              x="36"
              y={tick.y + 3.5}
              textAnchor="end"
              fill="#94a3b8"
              fontSize="9.5"
              fontFamily="inherit"
              className="tabular-nums font-medium"
            >
              {tick.label}
            </text>
          </g>
        ))}

        {/* Shaded Area */}
        <path d={areaPath} fill="url(#blueAreaGrad)" />

        {/* Rising Curve - thin elegant stroke */}
        <path
          d={linePath}
          stroke="#0284c7"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* X-axis labels */}
        {timeLabels.map((time, idx) => {
          const x = 45 + (idx * (405 - 45)) / (timeLabels.length - 1);
          return (
            <text
              key={time}
              x={x}
              y="178"
              textAnchor={idx === 0 ? "start" : idx === timeLabels.length - 1 ? "end" : "middle"}
              fill="#94a3b8"
              fontSize="9"
              fontFamily="inherit"
              className="tabular-nums font-medium"
            >
              {time}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

export function RequestDeltaChart() {
  const yTicks = [
    { label: "12", y: 22 },
    { label: "6", y: 56 },
    { label: "0", y: 90 },
    { label: "-6", y: 124 },
    { label: "-12", y: 158 },
  ];

  // baseline: y = 90
  // scale: 12 units = 68px (approx 5.67px per unit)
  const bars = [
    // Negative cluster (landing page rose-red #e11d48)
    { x: 50, val: -11.5, type: "down" },
    { x: 64, val: -3.5, type: "down" },
    { x: 78, val: -4.0, type: "down" },
    { x: 92, val: -3.0, type: "down" },
    { x: 106, val: -8.0, type: "down" },
    // Positive cluster (landing page teal #0d9488)
    { x: 128, val: 8.5, type: "up" },
    { x: 142, val: 2.2, type: "up" },
    { x: 156, val: 4.5, type: "up" },
    { x: 170, val: 6.2, type: "up" },
    { x: 184, val: 6.2, type: "up" },
    { x: 198, val: 11.5, type: "up" },
    // Negative cluster (landing page rose-red #e11d48)
    { x: 220, val: -11.5, type: "down" },
    { x: 234, val: -4.0, type: "down" },
    { x: 248, val: -4.0, type: "down" },
    { x: 262, val: -3.0, type: "down" },
    { x: 276, val: -5.0, type: "down" },
    // Positive cluster (landing page teal #0d9488)
    { x: 298, val: 9.0, type: "up" },
    { x: 312, val: 4.5, type: "up" },
    { x: 326, val: 5.8, type: "up" },
    { x: 340, val: 4.8, type: "up" },
  ];

  return (
    <div className="relative mt-2 w-full select-none overflow-hidden">
      <svg
        viewBox="0 0 420 185"
        className="h-auto w-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Horizontal grid lines */}
        {yTicks.map((tick) => (
          <g key={tick.label}>
            <line
              x1="45"
              y1={tick.y}
              x2="405"
              y2={tick.y}
              stroke={tick.label === "0" ? "#e2e8f0" : "#f1f5f9"}
              strokeWidth={tick.label === "0" ? "1" : "0.8"}
            />
            <text
              x="36"
              y={tick.y + 3.5}
              textAnchor="end"
              fill="#94a3b8"
              fontSize="9.5"
              fontFamily="inherit"
              className="tabular-nums font-medium"
            >
              {tick.label}
            </text>
          </g>
        ))}

        {/* Delta Bars */}
        {bars.map((b, i) => {
          const height = Math.abs(b.val) * 5.67;
          const y = b.val >= 0 ? 90 - height : 90;
          const fill = b.type === "up" ? "#0d9488" : "#e11d48";

          return (
            <rect
              key={i}
              x={b.x}
              y={y}
              width="8.8"
              height={height}
              fill={fill}
              rx="1.5"
            />
          );
        })}

        {/* X-axis labels */}
        {timeLabels.map((time, idx) => {
          const x = 45 + (idx * (405 - 45)) / (timeLabels.length - 1);
          return (
            <text
              key={time}
              x={x}
              y="178"
              textAnchor={idx === 0 ? "start" : idx === timeLabels.length - 1 ? "end" : "middle"}
              fill="#94a3b8"
              fontSize="9"
              fontFamily="inherit"
              className="tabular-nums font-medium"
            >
              {time}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
