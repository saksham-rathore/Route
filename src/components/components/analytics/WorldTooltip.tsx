"use client";

import { useEffect, useState } from "react";
import type { WorldTooltipState } from "./world-map-types";
import { formatVisitors } from "./map-utils";

function useIsLightTheme() {
  const [isLightTheme, setIsLightTheme] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const resolveTheme = () => {
      const attr = document.documentElement.dataset.dashboardTheme;
      if (attr === "light") return true;
      if (attr === "dark") return false;
      return !window.matchMedia("(prefers-color-scheme: dark)").matches;
    };

    const updateTheme = () => setIsLightTheme(resolveTheme());
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const observer = new MutationObserver(updateTheme);

    updateTheme();
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-dashboard-theme"],
    });
    media.addEventListener("change", updateTheme);

    return () => {
      observer.disconnect();
      media.removeEventListener("change", updateTheme);
    };
  }, []);

  return isLightTheme;
}

export function WorldTooltip({
  tooltip,
  valueLabel = "Visitors",
  valueFormatter = formatVisitors,
  secondaryLabel = "Share",
  secondaryValue,
  containerWidth,
}: {
  tooltip: WorldTooltipState | null;
  valueLabel?: string;
  valueFormatter?: (value: number) => string;
  secondaryLabel?: string;
  secondaryValue?: string | null;
  containerWidth?: number;
}) {
  const isLightTheme = useIsLightTheme();

  if (!tooltip) return null;

  const estimatedWidth = 220;
  const left = containerWidth
    ? Math.max(12, Math.min(tooltip.x + 12, containerWidth - estimatedWidth - 12))
    : tooltip.x + 12;

  return (
    <div
      className="pointer-events-none absolute z-20 hidden rounded-md px-2.5 py-1.5 text-xs shadow-[0_10px_30px_rgba(0,0,0,0.18)] md:block"
      style={{
        left,
        top: tooltip.y - 12,
        transform: "translateY(-100%)",
        background: isLightTheme ? "rgba(255,255,255,0.96)" : "rgba(22,24,29,0.95)",
        border: isLightTheme
          ? "1px solid rgba(37,99,235,0.14)"
          : "1px solid rgba(255,255,255,0.10)",
        color: isLightTheme ? "#0f172a" : "#ffffff",
      }}
      role="status"
      aria-live="polite"
    >
      <div
        className="font-medium"
        style={{ color: isLightTheme ? "#0f172a" : "#ffffff" }}
      >
        {tooltip.metric.countryName}:{" "}
        <span style={{ color: isLightTheme ? "#1e3a8a" : "rgba(255,255,255,0.92)" }}>
          {valueFormatter(tooltip.metric.visitors)}
        </span>
      </div>
      <div
        className="mt-0.5 text-[11px]"
        style={{ color: isLightTheme ? "rgba(15,23,42,0.72)" : "rgba(255,255,255,0.68)" }}
      >
        {valueLabel}
        {secondaryValue ? ` • ${secondaryLabel}: ${secondaryValue}` : ""}
      </div>
    </div>
  );
}
