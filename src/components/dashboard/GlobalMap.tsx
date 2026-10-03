"use client";

/**
 * Full-section global map for dashboard geography and network latency.
 */

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, MapPin, X } from "lucide-react";
import { DashboardMetricCard } from "./DashboardMetricCard";
import { dashboardMetricGridFourClass } from "@/components/dashboard/chart-layout";
import { ExportDropdown } from "./ExportDropdown";
import {
    exportCSV,
    exportJSON,
    exportFilename,
    type ExportColumn,
} from "@/lib/core/export";
import { FlatWorldMap } from "./FlatWorldMap";
import {
    useGetMapDataQuery,
    useAppSelector,
    useAppDispatch,
    selectMapState,
    setSelectedCountry,
    CityDataPoint,
    CountrySummary,
    MetricWithComparison,
    useAllowedTimeRanges,
    isQueryPending,
    shouldShowQueryError,
} from "@/lib/redux";
import type { TimeRange } from "@/lib/redux";
import {
    getCountryFlagSrc,
    normalizeCountryDisplayName,
} from "./country-flags";
import { DashboardSection } from "./DashboardSection";
import { DashboardMapViewSkeleton } from "./DashboardSkeleton";

interface GlobalMapProps {
    projectId: string;
    range?: TimeRange;
    onRangeChange?: (range: TimeRange) => void;
}

const getLatencyColor = (p95: number): string => {
    if (p95 <= 100) return "var(--dash-success)";
    if (p95 <= 250) return "#f59e0b";
    return "#ef4444";
};

const getStatusLabel = (p95: number): string => {
    if (p95 <= 100) return "Excellent";
    if (p95 <= 250) return "Fair";
    return "Poor";
};

const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
};

const resolveMetricValue = (
    value: number | MetricWithComparison | null | undefined
): number => {
    if (typeof value === "number") return value;
    if (value && typeof value === "object" && typeof value.current === "number") {
        return value.current;
    }
    return 0;
};

export function GlobalMap({
    projectId,
    range: propRange,
    onRangeChange,
}: GlobalMapProps) {
    const dispatch = useAppDispatch();
    const { selectedCountry } = useAppSelector(selectMapState);
    const [mounted, setMounted] = useState(false);
    const [isLightTheme, setIsLightTheme] = useState(false);
    const [internalRange, setInternalRange] = useState<TimeRange>("24h");
    const [showTopCountries, setShowTopCountries] = useState(true);
    const range = propRange ?? internalRange;
    const setRange = onRangeChange ?? setInternalRange;

    useEffect(() => {
        setMounted(true);
    }, []);

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

    const timeRanges = useAllowedTimeRanges([
        "1h",
        "6h",
        "24h",
        "7d",
        "30d",
        "90d",
        "1y",
    ]);

    const {
        data: mapData,
        isLoading,
        isFetching,
    } = useGetMapDataQuery({
        projectId,
        range,
    });

    const cities = useMemo(() => mapData?.cities ?? [], [mapData?.cities]);
    const countries = useMemo(
        () => mapData?.countries ?? [],
        [mapData?.countries]
    );
    const topCountries = useMemo(
        () => mapData?.topCountries ?? [],
        [mapData?.topCountries]
    );
    const totalRequests = mapData?.totalRequests || 0;
    const totalCountries = resolveMetricValue(mapData?.totalCountries);
    const totalCities = resolveMetricValue(mapData?.totalCities);
    const avgP95 = mapData?.avgP95 || 0;

    const handleClosePanel = useCallback(() => {
        dispatch(setSelectedCountry(null));
    }, [dispatch]);

    const countryPanelRef = useRef<HTMLDivElement>(null);
    const mapToolbarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!selectedCountry) return;

        const handlePointerDown = (event: PointerEvent) => {
            if (!countryPanelRef.current) return;

            const target = event.target as HTMLElement;
            if (countryPanelRef.current.contains(target)) return;
            if (mapToolbarRef.current?.contains(target)) return;
            if (target.closest("[data-geo-map]")) return;

            handleClosePanel();
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") handleClosePanel();
        };

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedCountry, handleClosePanel]);

    const handleExportCSV = useCallback(() => {
        if (!cities?.length) return;
        const columns: ExportColumn<CityDataPoint>[] = [
            { key: "city", header: "City" },
            { key: "country", header: "Country" },
            { key: "requests", header: "Requests" },
            { key: "p50", header: "p50 (ms)" },
            { key: "p95", header: "p95 (ms)" },
            { key: "p99", header: "p99 (ms)" },
            { key: (r) => r.errorRate, header: "Error Rate (%)" },
            { key: "topIsp", header: "Top ISP" },
            { key: (r) => r.coordinates[0], header: "Longitude" },
            { key: (r) => r.coordinates[1], header: "Latitude" },
        ];
        exportCSV(
            cities,
            columns,
            exportFilename("map", projectId, range, "csv")
        );
    }, [cities, projectId, range]);

    const handleExportJSON = useCallback(() => {
        if (!mapData) return;
        exportJSON(mapData, exportFilename("map", projectId, range, "json"));
    }, [mapData, projectId, range]);

    const selectedCountryData = useMemo(() => {
        return (
            countries.find(
                (c: CountrySummary) => c.country === selectedCountry
            ) || null
        );
    }, [countries, selectedCountry]);

    if (!mounted) {
        return (
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4 sm:px-5 lg:px-6 lg:overflow-hidden">
                <div className="mx-auto flex w-full max-w-[1360px] flex-1 flex-col min-h-0 animate-[fade-in_180ms_ease-out]">
                    <div className="dashboard-panel flex flex-1 min-h-[min(280px,40vh)] items-center justify-center p-5">
                        <DashboardMapViewSkeleton />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4 sm:px-5 lg:px-6 lg:overflow-hidden">
            <div className="mx-auto flex w-full max-w-[1360px] flex-1 flex-col min-h-0 animate-[fade-in_180ms_ease-out]">
                <DashboardSection id="map-summary" className="mb-4 shrink-0">
                    <div className={dashboardMetricGridFourClass}>
                        <DashboardMetricCard label="Countries" value={String(totalCountries)} />
                        <DashboardMetricCard label="Cities" value={String(totalCities)} />
                        <DashboardMetricCard label="Requests" value={formatNumber(totalRequests)} />
                        <DashboardMetricCard label="Avg p95" value={`${avgP95}ms`} />
                    </div>
                </DashboardSection>

                <div className="mb-4 flex shrink-0 flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div ref={mapToolbarRef} className="hidden min-w-0 lg:block">
                        <TopCountriesDropdown
                            countries={topCountries}
                            isLoading={isLoading}
                            isOpen={showTopCountries}
                            onToggle={() => setShowTopCountries((isOpen) => !isOpen)}
                            onClose={() => setShowTopCountries(false)}
                            onSelect={(country) => {
                                setShowTopCountries(false);
                                dispatch(setSelectedCountry(country));
                            }}
                        />
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                        <div className="dashboard-control flex flex-wrap self-start p-0.5">
                            {timeRanges.map((timeRange) => (
                                <button
                                    key={timeRange.value}
                                    onClick={() =>
                                        !timeRange.disabled &&
                                        setRange(timeRange.value)
                                    }
                                    disabled={timeRange.disabled}
                                    title={
                                        timeRange.disabled
                                            ? "Upgrade plan for longer retention"
                                            : undefined
                                    }
                                    className={`
                    rounded px-3 py-1.5 text-xs font-medium transition-colors
                    ${
                        timeRange.disabled
                            ? "cursor-not-allowed text-[color:var(--dash-text-muted)] opacity-45"
                            : range === timeRange.value
                              ? "bg-[color:var(--dash-blue)] text-[color:var(--dash-text-on-accent)] shadow-[var(--dash-button-shadow)]"
                              : "text-[color:var(--dash-text-soft)] hover:text-[color:var(--dash-text)]"
                    }
                  `}
                                >
                                    {timeRange.label}
                                </button>
                            ))}
                        </div>
                        <ExportDropdown
                            onExportCSV={handleExportCSV}
                            onExportJSON={handleExportJSON}
                            disabled={!cities.length}
                        />
                    </div>
                </div>

                <DashboardSection
                    id="map-view"
                    as="section"
                    className="dashboard-panel relative min-h-[min(280px,40vh)] flex-1 overflow-hidden p-0"
                >
                {(isLoading || isFetching) && !mapData ? (
                    <div className="absolute inset-0 z-[600] bg-inherit p-4 sm:p-5">
                        <DashboardMapViewSkeleton />
                    </div>
                ) : null}
                <AnimatePresence>
                    {selectedCountryData ? (
                        <motion.div
                            ref={countryPanelRef}
                            key={`country-panel-${selectedCountryData.country}`}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 12 }}
                            transition={{ duration: 0.18, ease: "easeOut" }}
                            className="pointer-events-none absolute top-3 left-3 z-[480] hidden w-[min(320px,calc(100%-1.5rem))] max-w-[320px] lg:block"
                        >
                            <section className="dashboard-panel pointer-events-auto max-h-[min(420px,calc(100%-1.5rem))] overflow-y-auto p-4 shadow-[var(--dash-menu-shadow)]">
                                <CountryPanel
                                    data={selectedCountryData}
                                    onClose={handleClosePanel}
                                    cities={cities.filter(
                                        (c: CityDataPoint) =>
                                            c.country === selectedCountry
                                    )}
                                />
                            </section>
                        </motion.div>
                    ) : null}
                </AnimatePresence>
                <div className="absolute bottom-4 left-[3.75rem] z-[450] hidden items-center gap-3 rounded-md border border-[color:var(--dash-border)] bg-[color:var(--dash-surface)]/90 px-3 py-2 backdrop-blur-sm sm:flex">
                    <LegendDot color="var(--dash-success)" label="≤100ms" />
                    <LegendDot color="#f59e0b" label="≤250ms" />
                    <LegendDot color="#ef4444" label=">250ms" />
                </div>
                <FlatWorldMap
                    cities={cities}
                    selectedCountry={selectedCountry}
                    isLightTheme={isLightTheme}
                    onSelectCountry={(country) => {
                        setShowTopCountries(false);
                        dispatch(setSelectedCountry(country));
                    }}
                />
                </DashboardSection>

                <MobileMapCountryPanel
                className="mt-4 shrink-0"
                countries={countries}
                selectedCountry={selectedCountry}
                selectedCountryData={selectedCountryData}
                cities={cities}
                isLoading={isLoading}
                onSelect={(country) => dispatch(setSelectedCountry(country))}
                onClose={handleClosePanel}
            />
            </div>
        </div>
    );
}

function MobileMapCountryPanel({
    className,
    countries,
    selectedCountry,
    selectedCountryData,
    cities,
    isLoading,
    onSelect,
    onClose,
}: {
    className?: string;
    countries: CountrySummary[];
    selectedCountry: string | null;
    selectedCountryData: CountrySummary | null;
    cities: CityDataPoint[];
    isLoading: boolean;
    onSelect: (country: string) => void;
    onClose: () => void;
}) {
    return (
        <section
            className={[
                "overflow-hidden rounded-lg border border-[color:var(--dash-border)] bg-[color:var(--dash-surface)] lg:hidden",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <div className="border-b border-[color:var(--dash-divider)] px-4 py-3">
                <h3 className="text-sm font-semibold text-[color:var(--dash-text)]">Countries</h3>
                <p className="mt-0.5 text-xs text-[color:var(--dash-text-soft)]">
                    Tap a country to inspect latency and cities.
                </p>
            </div>

            {selectedCountryData ? (
                <div className="p-4">
                    <CountryPanel
                        data={selectedCountryData}
                        onClose={onClose}
                        cities={cities.filter((city) => city.country === selectedCountry)}
                    />
                </div>
            ) : (
                <div className="max-h-[360px] overflow-y-auto p-2">
                    {countries.length === 0 && !isLoading ? (
                        <div className="px-3 py-8 text-center text-[color:var(--dash-text-muted)]">
                            <MapPin className="mx-auto mb-2 h-7 w-7 opacity-50" />
                            <p className="text-sm">No data available</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {countries.map((country) => (
                                <button
                                    key={country.country}
                                    type="button"
                                    onClick={() => onSelect(country.country)}
                                    className="w-full rounded-lg border border-[color:var(--dash-border)] bg-[color:var(--dash-input-bg)] px-2.5 py-2.5 text-left transition-colors hover:border-[color:var(--dash-blue)]/35 hover:bg-[color:var(--dash-surface-hover)]"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[color:var(--dash-bg-subtle)]">
                                            {getCountryFlagSrc(country.country) ? (
                                                <img
                                                    src={getCountryFlagSrc(country.country)!}
                                                    alt=""
                                                    className="h-4 w-5 rounded-[2px] object-cover"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <span className="text-[10px] text-[color:var(--dash-text-muted)]">-</span>
                                            )}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="truncate text-xs font-medium text-[color:var(--dash-text)]">
                                                    {normalizeCountryDisplayName(country.country)}
                                                </span>
                                                <span className="shrink-0 font-mono text-[10px] text-[color:var(--dash-text-soft)]">
                                                    {formatNumber(country.requests)}
                                                </span>
                                            </div>
                                            <p className="mt-1 text-[10px] text-[color:var(--dash-text-muted)]">
                                                p95 {country.p95}ms · {country.cityCount} cities
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}

function LegendDot({ color, label }: { color: string; label: string }) {
    return (
        <span className="flex items-center gap-1.5">
            <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: color }}
            />
            <span className="text-[10px] text-[color:var(--dash-text-soft)]">
                {label}
            </span>
        </span>
    );
}

function TopCountriesDropdown({
    countries,
    isLoading,
    isOpen,
    onToggle,
    onClose,
    onSelect,
}: {
    countries: CountrySummary[];
    isLoading: boolean;
    isOpen: boolean;
    onToggle: () => void;
    onClose: () => void;
    onSelect: (country: string) => void;
}) {
    return (
        <div className="relative">
            <button
                type="button"
                onClick={onToggle}
                className={`dashboard-button-secondary gap-2 px-3 py-1.5 text-xs ${
                    isOpen
                        ? "bg-[color:var(--dash-blue-soft)] text-[color:var(--dash-blue)]"
                        : ""
                }`}
                aria-expanded={isOpen}
                aria-haspopup="menu"
                aria-label="Toggle top countries"
                title="Top countries"
            >
                <Layers className="h-3.5 w-3.5" />
                Countries
            </button>

            <AnimatePresence>
                {isOpen ? (
                    <motion.div
                        key="top-countries-dropdown"
                        initial={{ opacity: 0, y: -4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.98 }}
                        transition={{ duration: 0.14, ease: "easeOut" }}
                        className="dashboard-menu absolute left-0 top-full z-[520] mt-2 w-[min(284px,calc(100vw-32px))] overflow-hidden p-0"
                        role="menu"
                    >
                        <div className="flex items-center justify-between border-b border-[color:var(--dash-divider)] px-3 py-2.5">
                            <div className="min-w-0">
                                <div className="truncate text-sm font-semibold text-[color:var(--dash-text)]">
                                    Top Countries
                                </div>
                                <div className="text-[10px] uppercase tracking-[0.16em] text-[color:var(--dash-text-muted)]">
                                    Request volume
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex h-7 w-7 items-center justify-center rounded-md text-[color:var(--dash-text-muted)] transition hover:bg-[color:var(--dash-bg-subtle)] hover:text-[color:var(--dash-text)]"
                                aria-label="Close countries dropdown"
                                title="Close"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </div>

                        <div className="max-h-[360px] overflow-auto p-1.5">
                            {countries.length === 0 && !isLoading ? (
                                <div className="px-3 py-8 text-center text-[color:var(--dash-text-muted)]">
                                    <MapPin className="mx-auto mb-2 h-7 w-7 opacity-50" />
                                    <p className="text-sm">No data available</p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {countries.map((country) => (
                                        <button
                                            key={country.country}
                                            type="button"
                                            onClick={() => onSelect(country.country)}
                                            className="w-full rounded-md px-2.5 py-2.5 text-left transition-colors hover:bg-[color:var(--dash-bg-subtle)]"
                                            role="menuitem"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[color:var(--dash-input-bg)]">
                                                    {getCountryFlagSrc(country.country) ? (
                                                        <img
                                                            src={
                                                                getCountryFlagSrc(
                                                                    country.country
                                                                )!
                                                            }
                                                            alt=""
                                                            className="h-4 w-5 rounded-[2px] object-cover"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <span className="text-[10px] text-[color:var(--dash-text-muted)]">
                                                            --
                                                        </span>
                                                    )}
                                                </span>
                                                <div className="min-w-0 flex-1 text-left">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className="min-w-0 truncate text-xs font-medium text-[color:var(--dash-text)]">
                                                            {normalizeCountryDisplayName(
                                                                country.country
                                                            )}
                                                        </span>
                                                        <span className="shrink-0 font-mono text-[10px] text-[color:var(--dash-text-soft)]">
                                                            {formatNumber(
                                                                country.requests
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="mt-1 flex items-center gap-2">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-[#ef4444]" />
                                                        <span className="text-[10px] text-[color:var(--dash-text-muted)]">
                                                            p95 {country.p95}ms -{" "}
                                                            {country.cityCount} cities
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    );
}

interface CountryPanelProps {
    data: CountrySummary;
    onClose: () => void;
    cities: CityDataPoint[];
}

function CountryPanel({ data, onClose, cities }: CountryPanelProps) {
    const color = getLatencyColor(data.p95);
    const status = getStatusLabel(data.p95);
    const topCities = cities.slice(0, 5);

    return (
        <div>
            <div className="mb-4 flex items-center justify-between">
                <div className="flex min-w-0 items-center gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center">
                        {getCountryFlagSrc(data.country) ? (
                            <img
                                src={getCountryFlagSrc(data.country)!}
                                alt=""
                                className="h-5 w-6 rounded-[2px] object-cover"
                                loading="lazy"
                            />
                        ) : (
                            <span className="text-[10px] text-[color:var(--dash-text-muted)]">
                                --
                            </span>
                        )}
                    </span>
                    <div className="min-w-0">
                        <h4 className="sr-only">
                            {normalizeCountryDisplayName(data.country)}
                        </h4>
                        <div className="flex items-center gap-1.5">
                            <div
                                className="h-1.5 w-1.5 rounded-full"
                                style={{ backgroundColor: color }}
                            />
                            <span className="text-[10px]" style={{ color }}>
                                {status}
                            </span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-[color:var(--dash-text-muted)] transition hover:bg-[color:var(--dash-surface-hover)] hover:text-[color:var(--dash-text)]"
                    aria-label="Close country detail"
                    title="Close"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-2">
                <CountryStat
                    label="Requests"
                    value={formatNumber(data.requests)}
                />
                <CountryStat label="Cities" value={data.cityCount} />
                <CountryStat
                    label="p95 Latency"
                    value={`${data.p95}ms`}
                    valueColor={color}
                />
                <CountryStat
                    label="Error Rate"
                    value={`${data.errorRate.toFixed(2)}%`}
                    valueColor={
                        data.errorRate > 1
                            ? "var(--dash-danger)"
                            : "var(--dash-success)"
                    }
                />
            </div>

            {topCities.length > 0 && (
                <div>
                    <div className="mb-2 text-[10px] uppercase text-[color:var(--dash-text-muted)]">
                        Top Cities
                    </div>
                    <div className="space-y-1.5">
                        {topCities.map((city: CityDataPoint) => (
                            <div
                                key={city.city}
                                className="flex items-center justify-between rounded-md bg-[color:var(--dash-input-bg)] px-2 py-1.5"
                            >
                                <div className="flex min-w-0 items-center gap-2">
                                    <MapPin className="h-3 w-3 shrink-0 text-[color:var(--dash-text-muted)]" />
                                    <span className="truncate text-xs text-[color:var(--dash-text)]">
                                        {city.city}
                                    </span>
                                </div>
                                <div className="ml-3 flex shrink-0 items-center gap-3">
                                    <span className="font-mono text-[10px] text-[color:var(--dash-text-soft)]">
                                        {formatNumber(city.requests)}
                                    </span>
                                    <span
                                        className="font-mono text-[10px]"
                                        style={{
                                            color: getLatencyColor(city.p95),
                                        }}
                                    >
                                        {city.p95}ms
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function CountryStat({
    label,
    value,
    valueColor,
}: {
    label: string;
    value: string | number;
    valueColor?: string;
}) {
    return (
        <div className="rounded-md bg-[color:var(--dash-input-bg)] p-3 shadow-[var(--dash-control-shadow)]">
            <div className="mb-1 text-[10px] text-[color:var(--dash-text-muted)]">
                {label}
            </div>
            <div
                className="font-mono text-lg text-[color:var(--dash-text)]"
                style={{ color: valueColor }}
            >
                {value}
            </div>
        </div>
    );
}
