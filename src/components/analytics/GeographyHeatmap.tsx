"use client";

import { useMemo, useRef, useState } from "react";
import { WorldHeatmap } from "./WorldHeatmap";
import type { GeographyRange, CountryAggregate } from "./world-map-types";

// Clean inline SVG icons (no external icon dependencies required)
function GlobeIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

function LoaderIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

// Helpers
const getCountryFlagSrc = (code: string | null | undefined) =>
  code ? `https://flagcdn.com/${code.toLowerCase()}.svg` : null;

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US").format(value);

// Default mock datasets - ready for you to replace with your own React state or API hooks
const TIME_RANGES: { label: string; value: GeographyRange; disabled?: boolean }[] = [
  { label: "24 Hours", value: "24h" },
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
];

const MOCK_COUNTRIES: CountryAggregate[] = [
  {
    countryCode: "US",
    countryName: "United States",
    pageviews: 42890,
    uniqueVisitors: 28410,
    cityCount: 48,
  },
  {
    countryCode: "IN",
    countryName: "India",
    pageviews: 24650,
    uniqueVisitors: 17290,
    cityCount: 36,
  },
  {
    countryCode: "DE",
    countryName: "Germany",
    pageviews: 16120,
    uniqueVisitors: 11450,
    cityCount: 22,
  },
  {
    countryCode: "GB",
    countryName: "United Kingdom",
    pageviews: 14890,
    uniqueVisitors: 10320,
    cityCount: 25,
  },
  {
    countryCode: "CA",
    countryName: "Canada",
    pageviews: 10540,
    uniqueVisitors: 7210,
    cityCount: 16,
  },
  {
    countryCode: "FR",
    countryName: "France",
    pageviews: 9180,
    uniqueVisitors: 6420,
    cityCount: 18,
  },
  {
    countryCode: "JP",
    countryName: "Japan",
    pageviews: 8340,
    uniqueVisitors: 5790,
    cityCount: 12,
  },
  {
    countryCode: "AU",
    countryName: "Australia",
    pageviews: 6720,
    uniqueVisitors: 4510,
    cityCount: 9,
  },
  {
    countryCode: "BR",
    countryName: "Brazil",
    pageviews: 5410,
    uniqueVisitors: 3680,
    cityCount: 15,
  },
  {
    countryCode: "NL",
    countryName: "Netherlands",
    pageviews: 4230,
    uniqueVisitors: 2950,
    cityCount: 11,
  },
];

interface GeographyHeatmapProps {
  embedded?: boolean;
  initialRange?: GeographyRange;
  initialCountries?: CountryAggregate[];
}

export function GeographyHeatmap({
  embedded = false,
  initialRange = "24h",
  initialCountries = MOCK_COUNTRIES,
}: GeographyHeatmapProps) {
  // TODO: Replace with your own custom React state, hooks, or backend fetch logic
  const [range, setRange] = useState<GeographyRange>(initialRange);
  const [countryAggregates, setCountryAggregates] = useState<CountryAggregate[]>(initialCountries);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const heatmapRef = useRef<HTMLDivElement | null>(null);

  // Derived heatmap data map (countryCode -> pageviews)
  const heatmapData = useMemo(() => {
    return countryAggregates.reduce((acc, curr) => {
      acc[curr.countryCode] = curr.pageviews;
      return acc;
    }, {} as Record<string, number>);
  }, [countryAggregates]);

  const aggregateByCode = useMemo(() => {
    return new Map(countryAggregates.map((c) => [c.countryCode, c]));
  }, [countryAggregates]);

  const selectedCountryCode = useMemo(() => {
    if (!selectedCountry) return null;
    const match = countryAggregates.find(
      (c) =>
        c.countryName.toLowerCase() === selectedCountry.toLowerCase() ||
        c.countryCode.toLowerCase() === selectedCountry.toLowerCase()
    );
    return match ? match.countryCode : null;
  }, [selectedCountry, countryAggregates]);

  const handleCountrySelect = (countryName: string) => {
    setSelectedCountry((prev) => (prev === countryName ? null : countryName));
  };

  const clearSelectedCountry = () => {
    setSelectedCountry(null);
  };

  const handleRangeChange = (newRange: GeographyRange) => {
    setRange(newRange);
    // Simulating quick refresh feedback for UI demonstration
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 400);
  };

  return (
    <div
      className={
        embedded
          ? "w-full"
          : "mx-auto max-w-[1440px] px-4 py-8 sm:px-6"
      }
    >
      <style jsx global>{`
        .heatmap-country-scroll {
          scrollbar-gutter: stable;
          scrollbar-width: thin;
          scrollbar-color: rgba(148, 163, 184, 0.35) transparent;
        }

        .heatmap-country-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .heatmap-country-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .heatmap-country-scroll::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.48);
          border-radius: 999px;
        }

        .heatmap-country-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.65);
        }
      `}</style>

      {/* Header section */}
      {!embedded ? (
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
              Geography Heatmap
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Compare pageviews and visitors by country inside the User Analytics workspace.
            </p>
          </div>

          {/* Time range selector tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center rounded-lg border border-zinc-200 bg-zinc-50/80 p-0.5 shadow-xs">
              {TIME_RANGES.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => !item.disabled && handleRangeChange(item.value)}
                  disabled={item.disabled}
                  title={item.disabled ? "Upgrade plan for longer retention" : undefined}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                    item.disabled
                      ? "cursor-not-allowed text-zinc-400 opacity-50"
                      : range === item.value
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* Refresh indicator */}
      {isRefreshing ? (
        <div className="mb-4 flex items-center gap-2 text-xs text-blue-600">
          <LoaderIcon className="h-3.5 w-3.5 animate-spin" />
          Refreshing geography heatmap...
        </div>
      ) : null}

      {embedded ? (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-zinc-900">
              Visitor geography
            </div>
            <div className="text-xs text-zinc-500">
              Country-level choropleth for pageviews and visitors.
            </div>
          </div>
        </div>
      ) : null}

      {/* Main panel: World Heatmap + Country Rankings List */}
      <div ref={heatmapRef}>
        <div
          id="ua-geography-heatmap-map"
          className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xs"
        >
          <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_320px]">
            {/* World Map Choropleth Canvas */}
            <div className="relative h-[clamp(440px,46vw,640px)] overflow-hidden border-b border-zinc-200 bg-white xl:border-b-0 xl:border-r">
              <WorldHeatmap
                data={heatmapData}
                isLoading={false}
                className="h-full rounded-none border-0 bg-transparent shadow-none"
                emptyLabel="No country data"
                emptyDescription=""
                selectedCountryCode={selectedCountryCode}
                selectedCountryName={selectedCountry}
                valueLabel="Pageviews"
                valueFormatter={formatNumber}
                secondaryLabel="Unique visitors"
                secondaryFormatter={(countryCode) => {
                  const aggregate = aggregateByCode.get(countryCode);
                  return aggregate ? formatNumber(aggregate.uniqueVisitors) : "-";
                }}
                onCountrySelect={(_, countryName) => handleCountrySelect(countryName)}
                onClearSelection={clearSelectedCountry}
              />
            </div>

            {/* Country Rankings Sidebar */}
            <div className="flex max-h-[420px] min-h-[420px] flex-col overflow-hidden bg-white p-3 xl:h-[clamp(440px,46vw,640px)] xl:max-h-none xl:min-h-0 xl:p-4">
              <div className="mb-3 flex items-center justify-between gap-3 border-b border-zinc-100 pb-3">
                <div className="text-sm font-semibold text-zinc-900">
                  Countries
                </div>
                <div className="text-xs text-zinc-500">
                  {countryAggregates.length} locations
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-hidden">
                <div
                  className="heatmap-country-scroll h-full space-y-1.5 overflow-y-auto pr-1 overscroll-y-auto"
                  style={{ scrollbarGutter: "stable" }}
                >
                  {countryAggregates.length ? (
                    countryAggregates.map((country, index) => {
                      const isSelected = selectedCountry === country.countryName;
                      const flagSrc = getCountryFlagSrc(country.countryCode);

                      return (
                        <button
                          key={country.countryCode}
                          type="button"
                          onClick={() => handleCountrySelect(country.countryName)}
                          className={`w-full rounded-lg border px-3 py-2.5 text-left transition-all ${
                            isSelected
                              ? "border-blue-500 bg-blue-50/70 shadow-xs"
                              : "border-zinc-200/80 bg-zinc-50/50 hover:border-blue-300 hover:bg-zinc-50"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {/* Rank number */}
                            <div className="w-5 text-[11px] font-medium text-zinc-400">
                              {index + 1}
                            </div>

                            {/* Country Flag image or fallback */}
                            <div className="inline-flex h-6 w-7 items-center justify-center">
                              {flagSrc ? (
                                <img
                                  src={flagSrc}
                                  alt=""
                                  className="h-4 w-5 rounded-[2px] object-cover shadow-2xs"
                                  loading="lazy"
                                />
                              ) : (
                                <GlobeIcon className="h-3.5 w-3.5 text-zinc-400" />
                              )}
                            </div>

                            {/* Name & City Count */}
                            <div className="min-w-0 flex-1">
                              <div
                                className="line-clamp-1 truncate text-[13px] font-medium leading-4 text-zinc-900"
                                title={country.countryName}
                              >
                                {country.countryName}
                              </div>
                              <div className="mt-0.5 text-[10px] leading-4 text-zinc-500">
                                {country.cityCount} cities
                              </div>
                            </div>

                            {/* Metrics: Pageviews & Visitors */}
                            <div className="text-right">
                              <div className="font-mono text-[11px] font-medium leading-4 text-zinc-900">
                                {formatNumber(country.pageviews)}
                              </div>
                              <div className="text-[10px] leading-4 text-zinc-500">
                                {formatNumber(country.uniqueVisitors)} visitors
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div
                      className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-4 text-center"
                      role="status"
                    >
                      <p className="text-[13px] font-medium leading-4 text-zinc-900">
                        No country data
                      </p>
                      <p className="mt-1 text-[10px] leading-4 text-zinc-500">
                        Traffic will appear here for this range.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
