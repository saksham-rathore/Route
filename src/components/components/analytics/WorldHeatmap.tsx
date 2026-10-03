"use client";

import { useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { WorldTooltip } from "./WorldTooltip";
import type {
  WorldHeatmapProps,
  WorldTooltipState,
} from "./world-map-types";
import { formatVisitors, getCountryName } from "./map-utils";

// Stylized realistic continent & country geometries for pure SVG world rendering
interface MapCountryRegion {
  code: string;
  name: string;
  d: string;
  cx: number;
  cy: number;
}

// Curated accurate geographic paths for SVG world map projection (Equirectangular / Robinson inspired)
const WORLD_REGIONS: MapCountryRegion[] = [
  // North America
  {
    code: "CA",
    name: "Canada",
    d: "M 130 90 L 160 70 L 220 65 L 290 85 L 295 125 L 260 135 L 210 138 L 150 140 L 135 120 Z M 275 60 L 320 50 L 340 75 L 305 90 Z",
    cx: 210,
    cy: 105,
  },
  {
    code: "US",
    name: "United States",
    d: "M 140 142 L 210 140 L 260 137 L 295 128 L 290 175 L 285 200 L 270 215 L 245 220 L 225 200 L 175 190 L 150 175 Z M 100 85 L 125 75 L 135 95 L 115 110 Z",
    cx: 215,
    cy: 175,
  },
  {
    code: "MX",
    name: "Mexico",
    d: "M 175 195 L 225 202 L 235 235 L 215 260 L 200 240 L 180 215 Z",
    cx: 205,
    cy: 228,
  },
  // South America
  {
    code: "BR",
    name: "Brazil",
    d: "M 285 255 L 340 260 L 380 295 L 350 350 L 315 365 L 295 320 L 280 280 Z",
    cx: 330,
    cy: 310,
  },
  {
    code: "AR",
    name: "Argentina",
    d: "M 290 350 L 315 365 L 305 430 L 285 440 L 275 390 Z",
    cx: 295,
    cy: 395,
  },
  {
    code: "CO",
    name: "Colombia",
    d: "M 240 240 L 270 245 L 265 275 L 245 265 Z",
    cx: 255,
    cy: 255,
  },
  {
    code: "CL",
    name: "Chile",
    d: "M 270 340 L 285 345 L 275 435 L 265 425 Z",
    cx: 272,
    cy: 385,
  },
  // Europe
  {
    code: "GB",
    name: "United Kingdom",
    d: "M 460 120 L 475 115 L 480 140 L 465 145 Z M 450 128 L 460 125 L 458 138 Z",
    cx: 470,
    cy: 130,
  },
  {
    code: "FR",
    name: "France",
    d: "M 470 150 L 500 148 L 505 175 L 475 180 L 465 165 Z",
    cx: 485,
    cy: 165,
  },
  {
    code: "DE",
    name: "Germany",
    d: "M 505 135 L 530 135 L 535 160 L 510 162 L 502 145 Z",
    cx: 518,
    cy: 148,
  },
  {
    code: "ES",
    name: "Spain",
    d: "M 445 180 L 475 178 L 470 210 L 440 205 Z",
    cx: 455,
    cy: 195,
  },
  {
    code: "IT",
    name: "Italy",
    d: "M 515 165 L 535 170 L 530 205 L 518 190 Z",
    cx: 525,
    cy: 185,
  },
  {
    code: "NL",
    name: "Netherlands",
    d: "M 498 132 L 510 132 L 508 142 L 496 140 Z",
    cx: 502,
    cy: 136,
  },
  {
    code: "SE",
    name: "Sweden",
    d: "M 525 75 L 545 70 L 540 125 L 520 125 Z",
    cx: 532,
    cy: 98,
  },
  {
    code: "PL",
    name: "Poland",
    d: "M 535 135 L 565 135 L 560 160 L 535 160 Z",
    cx: 550,
    cy: 148,
  },
  // Africa
  {
    code: "EG",
    name: "Egypt",
    d: "M 565 210 L 610 210 L 605 245 L 565 245 Z",
    cx: 585,
    cy: 228,
  },
  {
    code: "NG",
    name: "Nigeria",
    d: "M 495 265 L 535 265 L 530 295 L 495 290 Z",
    cx: 515,
    cy: 280,
  },
  {
    code: "ZA",
    name: "South Africa",
    d: "M 535 375 L 585 370 L 575 425 L 530 420 Z",
    cx: 555,
    cy: 395,
  },
  {
    code: "KE",
    name: "Kenya",
    d: "M 585 275 L 615 275 L 610 315 L 580 310 Z",
    cx: 598,
    cy: 295,
  },
  // Asia
  {
    code: "RU",
    name: "Russia",
    d: "M 565 70 L 680 55 L 820 60 L 890 85 L 850 120 L 760 125 L 650 115 L 570 125 Z",
    cx: 710,
    cy: 90,
  },
  {
    code: "CN",
    name: "China",
    d: "M 670 160 L 765 150 L 785 200 L 735 235 L 675 220 L 655 180 Z",
    cx: 720,
    cy: 190,
  },
  {
    code: "IN",
    name: "India",
    d: "M 650 195 L 690 195 L 705 245 L 675 285 L 645 235 Z",
    cx: 672,
    cy: 240,
  },
  {
    code: "JP",
    name: "Japan",
    d: "M 825 160 L 845 155 L 835 195 L 815 200 Z",
    cx: 830,
    cy: 178,
  },
  {
    code: "SA",
    name: "Saudi Arabia",
    d: "M 590 220 L 645 225 L 635 270 L 595 265 Z",
    cx: 618,
    cy: 245,
  },
  {
    code: "AE",
    name: "United Arab Emirates",
    d: "M 640 235 L 655 235 L 652 248 L 638 245 Z",
    cx: 647,
    cy: 240,
  },
  {
    code: "ID",
    name: "Indonesia",
    d: "M 740 295 L 805 295 L 830 310 L 755 315 Z M 720 280 L 745 285 L 735 300 Z",
    cx: 775,
    cy: 305,
  },
  // Oceania
  {
    code: "AU",
    name: "Australia",
    d: "M 770 345 L 860 340 L 865 410 L 785 415 L 760 380 Z",
    cx: 815,
    cy: 375,
  },
  {
    code: "NZ",
    name: "New Zealand",
    d: "M 885 415 L 905 405 L 895 440 L 880 435 Z",
    cx: 892,
    cy: 422,
  },
];

// Background continent mass outlines for visual depth
const CONTINENT_BACKDROPS = [
  // North America outline
  "M 90 60 Q 200 40 340 60 L 300 130 L 290 210 L 220 240 L 180 200 L 130 160 L 90 100 Z",
  // South America outline
  "M 235 235 Q 310 240 375 280 L 350 360 L 305 440 L 265 425 L 245 320 Z",
  // Eurasia outline
  "M 440 160 Q 560 50 890 70 L 860 160 L 780 240 L 640 280 L 560 210 L 440 210 Z",
  // Africa outline
  "M 450 190 Q 580 180 620 230 L 610 320 L 560 430 L 500 370 L 470 270 Z",
  // Australia outline
  "M 750 330 Q 840 320 880 350 L 870 420 L 770 425 Z",
];

export function WorldHeatmap({
  data = {},
  className = "",
  isLoading = false,
  emptyLabel = "No traffic data",
  selectedCountryCode,
  selectedCountryName,
  valueLabel = "Visitors",
  valueFormatter = formatVisitors,
  secondaryLabel = "Share",
  secondaryFormatter,
  onCountrySelect,
  onClearSelection,
}: WorldHeatmapProps) {
  const [tooltip, setTooltip] = useState<WorldTooltipState | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Calculate totals and metrics
  const { maxVal, totalVal } = useMemo(() => {
    let max = 0;
    let sum = 0;
    if (data) {
      Object.values(data).forEach((val) => {
        const num = Number(val) || 0;
        if (num > max) max = num;
        sum += num;
      });
    }
    return { maxVal: max || 1, totalVal: sum || 1 };
  }, [data]);

  // Interpolate color based on traffic weight
  const getCountryColor = (code: string) => {
    const val = data?.[code] || 0;
    if (!val || val <= 0) {
      return "#f1f5f9"; // Subtle neutral slate
    }
    const ratio = Math.min(1, Math.max(0.15, val / maxVal));

    if (ratio > 0.8) return "#1d4ed8"; // Deep blue
    if (ratio > 0.5) return "#2563eb"; // Brand primary blue
    if (ratio > 0.3) return "#3b82f6"; // Medium blue
    if (ratio > 0.15) return "#60a5fa"; // Light-medium blue
    return "#93c5fd"; // Soft blue
  };

  const handleMouseEnter = (e: ReactMouseEvent, region: MapCountryRegion) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const val = data?.[region.code] || 0;
    const pct = totalVal > 0 ? (val / totalVal) * 100 : 0;

    setTooltip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      metric: {
        countryCode: region.code,
        countryName: region.name,
        visitors: val,
        percentage: Number(pct.toFixed(1)),
      },
    });
  };

  const handleMouseMove = (e: ReactMouseEvent) => {
    if (!containerRef.current || !tooltip) return;
    const rect = containerRef.current.getBoundingClientRect();
    setTooltip((prev) =>
      prev
        ? {
            ...prev,
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          }
        : null
    );
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  const handleCountryClick = (region: MapCountryRegion) => {
    if (onCountrySelect) {
      onCountrySelect(region.code, region.name);
    }
  };

  if (isLoading) {
    return (
      <div className={`relative flex h-full min-h-[360px] items-center justify-center bg-zinc-50/70 p-6 ${className}`}>
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <p className="text-xs font-medium text-zinc-500">Loading world geography...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative h-full w-full select-none overflow-hidden bg-white ${className}`}
    >
      {/* Interactive World Map SVG */}
      <div
        className="flex h-full w-full items-center justify-center p-3 transition-transform duration-200"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        <svg
          viewBox="0 0 960 480"
          className="h-full max-h-[560px] w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Subtle Grid Pattern for cartographic aesthetic */}
            <pattern id="world-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" strokeWidth="0.8" />
            </pattern>
            {/* Subtle glow filter for active selected country */}
            <filter id="country-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#2563eb" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Cartographic Background Grid */}
          <rect width="960" height="480" fill="url(#world-grid)" />

          {/* Continental Shelf Outlines (soft background context) */}
          <g opacity="0.4">
            {CONTINENT_BACKDROPS.map((pathD, idx) => (
              <path
                key={idx}
                d={pathD}
                fill="#f8fafc"
                stroke="#e2e8f0"
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />
            ))}
          </g>

          {/* Interactive Country Polygons */}
          <g>
            {WORLD_REGIONS.map((region) => {
              const isSelected =
                (selectedCountryCode && selectedCountryCode === region.code) ||
                (selectedCountryName && selectedCountryName === region.name);
              const val = data?.[region.code] || 0;
              const fillColor = isSelected ? "#2563eb" : getCountryColor(region.code);

              return (
                <g key={region.code} className="cursor-pointer">
                  {/* Country Polygon */}
                  <path
                    d={region.d}
                    fill={fillColor}
                    stroke={isSelected ? "#1d4ed8" : "#cbd5e1"}
                    strokeWidth={isSelected ? "2" : "1"}
                    filter={isSelected ? "url(#country-glow)" : undefined}
                    className="transition-all duration-150 hover:brightness-95 hover:stroke-blue-600"
                    onMouseEnter={(e) => handleMouseEnter(e, region)}
                    onClick={() => handleCountryClick(region)}
                  />

                  {/* Activity Indicator Dot if country has traffic */}
                  {val > 0 && (
                    <circle
                      cx={region.cx}
                      cy={region.cy}
                      r={isSelected ? "4.5" : "3"}
                      fill={isSelected ? "#ffffff" : "#2563eb"}
                      stroke="#ffffff"
                      strokeWidth="1"
                      className="pointer-events-none transition-transform"
                    />
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Floating Controls: Zoom In, Zoom Out, Reset */}
      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white/95 p-1 shadow-xs backdrop-blur-xs">
        <button
          type="button"
          onClick={() => setZoomLevel((z) => Math.min(2, Number((z + 0.2).toFixed(1))))}
          className="flex h-7 w-7 items-center justify-center rounded text-xs font-semibold text-zinc-700 hover:bg-zinc-100"
          title="Zoom In"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => setZoomLevel((z) => Math.max(0.8, Number((z - 0.2).toFixed(1))))}
          className="flex h-7 w-7 items-center justify-center rounded text-xs font-semibold text-zinc-700 hover:bg-zinc-100"
          title="Zoom Out"
        >
          −
        </button>
        {zoomLevel !== 1 && (
          <button
            type="button"
            onClick={() => setZoomLevel(1)}
            className="px-2 py-1 text-[11px] font-medium text-blue-600 hover:bg-blue-50 rounded"
          >
            Reset
          </button>
        )}
      </div>

      {/* Traffic Legend at Bottom Right */}
      <div className="absolute bottom-3 right-3 hidden items-center gap-2 rounded-lg border border-zinc-200 bg-white/95 px-3 py-1.5 text-[11px] text-zinc-600 shadow-xs backdrop-blur-xs sm:flex">
        <span>0</span>
        <div className="h-2 w-20 rounded-full bg-gradient-to-r from-blue-100 via-blue-400 to-blue-700" />
        <span>{formatVisitors(maxVal)}</span>
      </div>

      {/* Clear Filter Badge if country selected */}
      {(selectedCountryCode || selectedCountryName) && onClearSelection && (
        <button
          type="button"
          onClick={onClearSelection}
          className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 shadow-xs hover:bg-blue-100"
        >
          <span>Selected: {selectedCountryName || selectedCountryCode}</span>
          <span className="text-blue-500 font-bold">×</span>
        </button>
      )}

      {/* Floating Tooltip */}
      <WorldTooltip
        tooltip={tooltip}
        valueLabel={valueLabel}
        valueFormatter={valueFormatter}
        secondaryLabel={secondaryLabel}
        secondaryValue={
          tooltip && secondaryFormatter
            ? secondaryFormatter(tooltip.metric.countryCode)
            : tooltip
              ? `${tooltip.metric.percentage}%`
              : null
        }
      />
    </div>
  );
}
