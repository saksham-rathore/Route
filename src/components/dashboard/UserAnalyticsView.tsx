"use client";

import { Fragment, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useHorizontalWheelScroll } from "@/hooks/useHorizontalWheelScroll";
import { AnimatePresence, motion } from "framer-motion";
import {
    dashboardChartHeight,
    dashboardPanelBodyClass,
    dashboardPanelHeaderClass,
    dashboardRankedPanelMinHeight,
    dashboardMetricGridFourClass,
    dashboardMetricGridFiveClass,
    dashboardMetricGridThreeClass,
} from '@/components/dashboard/chart-layout';
import {
    ArrowDownRight,
    ArrowUpRight,
    ArrowRightStraight,
    Clock3,
    FileText,
    Globe,
    LayoutGrid,
    Loader2,
    MapPin,
    Monitor,
    X,
} from "@/components/dashboard/icons";
import { DashboardAnalyticsPageSkeleton } from "@/components/dashboard/DashboardSkeleton";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import {
    selectFilters,
    setFilter,
    useAllowedTimeRanges,
    useAppDispatch,
    useAppSelector,
    useGetUserAnalyticsDevicesQuery,
    useGetUserAnalyticsEngagementQuery,
    useGetUserAnalyticsGeographyQuery,
    useGetUserAnalyticsJourneysQuery,
    useGetUserAnalyticsOverviewQuery,
    useGetUserAnalyticsPageviewsQuery,
    useGetUserAnalyticsReferrersQuery,
    useGetUserAnalyticsRetentionQuery,
    useGetUserAnalyticsVisitsQuery,
    useGetUserAnalyticsHeatmapQuery,
    type UserAnalyticsBreakdownItem,
    type UserAnalyticsCountryItem,
    type UserAnalyticsEngagementPage,
    type UserAnalyticsReferrerItem,
    type UserAnalyticsRetentionResponse,
    type UserAnalyticsTopPage,
    type UserAnalyticsJourneysResponse,
    type UserAnalyticsJourneySequenceRow,
    type UserAnalyticsVisitSession,
    isQueryPending,
    shouldShowQueryError,
} from "@/lib/redux";
import { ExportDropdown } from "./ExportDropdown";
import {
    exportCSV,
    exportFilename,
    exportJSON,
    type ExportColumn,
} from "@/lib/core/export";
import { type UserAnalyticsTab } from "@/lib/user-analytics/tabs";
import {
    getRetentionGridCaption,
    getRetentionDisplayDayOffsets,
    getRetentionSummaryMetrics,
} from "@/lib/user-analytics/retention-display";
import {
    FaApple,
    FaChrome,
    FaDesktop,
    FaEdge,
    FaFirefox,
    FaGlobe,
    FaLaptop,
    FaMobileAlt,
    FaOpera,
    FaSafari,
    FaTabletAlt,
    FaWindows,
} from "react-icons/fa";
import {
    getCountryFlagSrc,
    getCountryCompactDisplayName,
    normalizeCountryDisplayName,
    resolveCountryCode,
} from "./country-flags";
import { DomainFavicon } from "./DomainFavicon";
import { DashboardSection } from "./DashboardSection";
import { GeographyHeatmap } from "@/components/analytics/GeographyHeatmap";
import { PublicEmbedBadgeSection } from "@/components/dashboard/PublicEmbedBadgeSection";
import { ClickHeatmap, type HeatmapExportHandlers } from "@/components/dashboard/heatmap/ClickHeatmap";
import { getUserAnalyticsChartAxisProps } from "@/lib/core/chart-time-axis";

interface UserAnalyticsDashboardProps {
    projectId: string;
    tab: UserAnalyticsTab;
}

type UserAnalyticsRange = "24h" | "7d" | "30d" | "90d" | "1y";
type ExportableRow = Record<string, unknown>;

/** Journey flow is fixed to 3 columns (steps 1–3). */
const JOURNEY_STEPS = 3;
const JOURNEY_NODE_HEIGHT = 62;
const JOURNEY_NODE_GAP = 10;
const JOURNEY_HEADER_HEIGHT = 132;
const JOURNEY_CARD_WIDTH = 280;
const JOURNEY_CONNECTOR_GAP = 72;
const JOURNEY_NODE_LIMIT_PER_COLUMN = 20;
const JOURNEY_FLOW_MIN_HEIGHT = 640;

function formatJourneyVisitors(value: number | null | undefined) {
    if (value == null) return "-";
    return new Intl.NumberFormat("en", {
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(value);
}

const JOURNEY_PATH_LABEL_MAX = 28;

function shortenJourneyPath(path: string, max = JOURNEY_PATH_LABEL_MAX) {
    const normalized = path.trim() || "/";
    if (normalized.length <= max) return normalized;
    return `${normalized.slice(0, max - 1)}…`;
}

function getJourneySequenceKey(paths: string[]) {
    return paths.join("\u0001");
}

function getJourneyRouteSummary(paths: string[]) {
    if (!paths.length) {
        return { label: "-", stepCount: 0 };
    }

    if (paths.length === 1) {
        return { label: shortenJourneyPath(paths[0], 48), stepCount: 1 };
    }

    const first = shortenJourneyPath(paths[0]);
    const last = shortenJourneyPath(paths[paths.length - 1]);

    if (paths.length === 2) {
        return { label: `${first} → ${last}`, stepCount: 2 };
    }

    return {
        label: `${first} → … → ${last}`,
        stepCount: paths.length,
    };
}

type JourneyPathSegment = {
    path: string;
    count: number;
    stepIndex: number;
};

function collapseConsecutiveJourneyPaths(paths: string[]): JourneyPathSegment[] {
    const segments: JourneyPathSegment[] = [];

    for (let index = 0; index < paths.length; index += 1) {
        const path = paths[index] || "/";
        const last = segments[segments.length - 1];
        if (last && last.path === path) {
            last.count += 1;
            continue;
        }
        segments.push({ path, count: 1, stepIndex: index + 1 });
    }

    return segments;
}

function JourneyPathBreadcrumb({
    paths,
    maxSegments = 5,
}: {
    paths: string[];
    maxSegments?: number;
}) {
    const segments = collapseConsecutiveJourneyPaths(paths);

    if (!segments.length) {
        return <span className="text-[13px] text-[color:var(--dash-text-soft)]">—</span>;
    }

    let display = segments;
    if (segments.length > maxSegments) {
        display = [
            ...segments.slice(0, Math.max(1, maxSegments - 2)),
            { path: "…", count: 1, stepIndex: -2 },
            segments[segments.length - 1]!,
        ];
    }

    return (
        <div className="flex min-w-0 flex-wrap items-center gap-1">
            {display.map((segment, index) => (
                <Fragment key={`${segment.path}-${segment.stepIndex}-${index}`}>
                    {index > 0 ? (
                        <ArrowRightStraight
                            className="h-3 w-3 shrink-0 text-[color:var(--dash-text-muted)]"
                            strokeWidth={1.75}
                            aria-hidden="true"
                        />
                    ) : null}
                    {segment.path === "…" ? (
                        <span className="text-[12px] text-[color:var(--dash-text-muted)]">…</span>
                    ) : (
                        <span
                            className="max-w-[148px] truncate text-[13px] font-medium text-[color:var(--dash-text)]"
                            title={segment.path}
                        >
                            {shortenJourneyPath(segment.path, 24)}
                            {segment.count > 1 ? (
                                <span className="ml-1 text-[11px] font-normal text-[color:var(--dash-text-muted)]">
                                    ×{segment.count}
                                </span>
                            ) : null}
                        </span>
                    )}
                </Fragment>
            ))}
        </div>
    );
}

function JourneyPathDetailModal({
    row,
    onClose,
}: {
    row: UserAnalyticsJourneySequenceRow;
    onClose: () => void;
}) {
    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    useEffect(() => {
        const handler = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [onClose]);

    const summary = getJourneyRouteSummary(row.paths);
    const segments = collapseConsecutiveJourneyPaths(row.paths);
    const entryPath = row.entryPath || row.paths[0] || "-";
    const exitPath =
        row.exitPath || row.paths[row.paths.length - 1] || "-";

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[1400] flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
            >
                <motion.div
                    className="absolute inset-0 bg-black/65"
                    onClick={onClose}
                    aria-hidden="true"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                />
                <motion.div
                    className="dashboard-panel relative z-[1] flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden"
                    initial={{ opacity: 0, y: 14, scale: 0.99 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.99 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="journey-route-title"
                >
                    <div className="flex items-start justify-between gap-3 border-b border-[color:var(--dash-divider)] px-4 py-3.5">
                        <div className="min-w-0">
                            <h3
                                id="journey-route-title"
                                className="text-[15px] font-semibold text-[color:var(--dash-text)]"
                            >
                                Session route
                            </h3>
                            <p className="mt-1 text-[12px] text-[color:var(--dash-text-soft)]">
                                {summary.stepCount}{" "}
                                {summary.stepCount === 1 ? "page" : "pages"} ·{" "}
                                {segments.length}{" "}
                                {segments.length === 1 ? "stop" : "stops"} ·{" "}
                                {formatNumber(row.currentVisits)} visits
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[color:var(--dash-bg-subtle)] text-[color:var(--dash-text-soft)] transition hover:bg-[color:var(--dash-surface-hover)] hover:text-[color:var(--dash-text)]"
                            aria-label="Close session route"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    </div>

                    <div className="border-b border-[color:var(--dash-divider)] bg-[color:var(--dash-bg-subtle)] px-4 py-2.5">
                        <div className="flex min-w-0 flex-wrap items-center gap-1.5 text-[12px] text-[color:var(--dash-text-soft)]">
                            <span className="font-medium text-[color:var(--dash-text-muted)]">
                                From
                            </span>
                            <span
                                className="max-w-[40%] truncate font-medium text-[color:var(--dash-text)]"
                                title={entryPath}
                            >
                                {shortenJourneyPath(entryPath, 32)}
                            </span>
                            <ArrowRightStraight
                                className="h-3 w-3 shrink-0 text-[color:var(--dash-text-muted)]"
                                strokeWidth={1.75}
                                aria-hidden="true"
                            />
                            <span className="font-medium text-[color:var(--dash-text-muted)]">
                                To
                            </span>
                            <span
                                className="max-w-[40%] truncate font-medium text-[color:var(--dash-text)]"
                                title={exitPath}
                            >
                                {shortenJourneyPath(exitPath, 32)}
                            </span>
                        </div>
                    </div>

                    <div className="max-h-[min(68vh,520px)] overflow-y-auto px-4 py-3.5">
                        <div className="relative">
                            {segments.map((segment, index) => {
                                const isFirst = index === 0;
                                const isLast = index === segments.length - 1;
                                return (
                                    <div
                                        key={`${segment.path}-${segment.stepIndex}-${index}`}
                                        className="relative flex gap-3 pb-3 last:pb-0"
                                    >
                                        {!isLast ? (
                                            <span
                                                className="absolute left-[11px] top-6 bottom-0 w-px bg-[color:var(--dash-divider)]"
                                                aria-hidden="true"
                                            />
                                        ) : null}
                                        <span
                                            className={`relative z-[1] mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-medium tabular-nums ${
                                                isFirst
                                                    ? "border-[color:var(--dash-blue)] bg-[color:var(--dash-blue-soft)] text-[color:var(--dash-blue)]"
                                                    : isLast
                                                      ? "border-[color:var(--dash-border-strong)] bg-[color:var(--dash-surface)] text-[color:var(--dash-text)]"
                                                      : "border-[color:var(--dash-divider)] bg-[color:var(--dash-surface)] text-[color:var(--dash-text-muted)]"
                                            }`}
                                        >
                                            {index + 1}
                                        </span>
                                        <div className="min-w-0 flex-1 pt-0.5">
                                            <p
                                                className="break-words text-[13px] font-medium leading-snug text-[color:var(--dash-text)]"
                                                title={segment.path}
                                            >
                                                {segment.path}
                                            </p>
                                            <p className="mt-0.5 text-[11px] text-[color:var(--dash-text-muted)]">
                                                {isFirst
                                                    ? "Entry"
                                                    : isLast
                                                      ? "Exit"
                                                      : "Visited"}
                                                {segment.count > 1
                                                    ? ` · same page ${segment.count} times in a row`
                                                    : null}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
const CHART_PRIMARY = "var(--dash-blue)";
const CHART_PRIMARY_SOFT = "var(--dash-blue)";
const CHART_LINE = "var(--dash-chart-line)";
const CHART_AXIS = "var(--dash-chart-axis)";
const CHART_GRID = "var(--dash-grid)";

const TAB_META: Record<
    UserAnalyticsTab,
    { title: string; description: string }
> = {
    overview: {
        title: "User Analytics",
        description: "Insights into user behavior across the platform.",
    },
    pageviews: {
        title: "Pageviews",
        description:
            "Track page volume, route type mix, and the pages users spend time on.",
    },
    visits: {
        title: "Visits & Sessions",
        description:
            "Understand visit quality, bounce patterns, and recent session flows.",
    },
    journeys: {
        title: "Journeys",
        description:
            "Follow how visitors arrive, move through pages, and exit.",
    },
    retention: {
        title: "Retention",
        description:
            "See how many new visitors return on later days, grouped by their first-visit cohort.",
    },
    geography: {
        title: "Geography",
        description:
            "See where visitors are coming from by country, region, city, timezone, and language.",
    },
    devices: {
        title: "Devices & Browsers",
        description:
            "Break down usage by device type, browser, operating system, and screen size.",
    },
    referrers: {
        title: "Referrers & UTM",
        description:
            "Measure acquisition channels, referrers, campaigns, and paid traffic identifiers.",
    },
    engagement: {
        title: "Scroll & Engagement",
        description:
            "Review scroll depth, route behavior, and which pages keep visitors engaged.",
    },
    heatmap: {
        title: "Heatmap",
        description:
            "See where users click and how far they scroll, overlaid on the live page.",
    },
    embed: {
        title: "Public embed badge",
        description:
            "Show live visitors and/or rolling stats on your site; copy install snippets and control badge behavior.",
    },
};

function formatNumber(value: number | null | undefined) {
    if (value == null) return "-";
    return value.toLocaleString();
}

function formatPercent(value: number | null | undefined) {
    if (value == null) return "-";
    return `${value.toFixed(1)}%`;
}

function formatDuration(value: number | null | undefined) {
    if (value == null) return "-";
    const totalSeconds = Math.max(0, Math.round(value / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function formatDecimal(value: number | null | undefined, digits = 1) {
    if (value == null) return "-";
    return value.toFixed(digits);
}

function getMetricCurrent(
    metric:
        | number
        | { current?: number | null; changePct?: number | null }
        | null
        | undefined
) {
    if (typeof metric === "number") return metric;
    return metric?.current ?? null;
}

function getMetricChangePct(
    metric:
        | number
        | { current?: number | null; changePct?: number | null }
        | null
        | undefined
) {
    if (typeof metric === "number") return null;
    return metric?.changePct ?? null;
}

function CountryFlag({
    country,
    className = "h-4 w-5 text-sm",
}: {
    country: string | null | undefined;
    className?: string;
}) {
    const flagSrc = getCountryFlagSrc(country);

    if (!flagSrc) return null;

    return (
        <img
            src={flagSrc}
            alt=""
            aria-hidden="true"
            className={`inline-block shrink-0 rounded-[2px] object-cover align-middle ${className}`}
            loading="lazy"
        />
    );
}

function CountryLabel({ country }: { country: string | null | undefined }) {
    const code = resolveCountryCode(country);
    const displayName = normalizeCountryDisplayName(country);
    const compactName = getCountryCompactDisplayName(country);

    if (!code) {
        return (
            <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[color:var(--dash-text-muted)]">
                --
            </span>
        );
    }

    return (
        <span
            title={displayName}
            aria-label={displayName}
            className="inline-flex min-w-0 max-w-full items-center gap-2 align-middle"
        >
            <CountryFlag country={country} className="h-3.5 w-5 shrink-0 rounded-[2px]" />
            <span className="truncate text-lg font-semibold text-[color:var(--dash-text)]">
                {compactName}
            </span>
        </span>
    );
}

function CountryFlagOnly({ country }: { country: string | null | undefined }) {
    const code = resolveCountryCode(country);

    if (!code) {
        return (
            <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[color:var(--dash-text-muted)]">
                --
            </span>
        );
    }

    return (
        <span
            title={normalizeCountryDisplayName(country)}
            aria-label={normalizeCountryDisplayName(country)}
            className="inline-flex min-h-4 min-w-5 items-center justify-center align-middle"
        >
            <CountryFlag
                country={country}
                className="h-3.5 w-5 rounded-[2px]"
            />
        </span>
    );
}

function normalizeBreakdownLabel(value: string | null | undefined) {
    return value?.trim().toLowerCase() ?? "";
}

function getBrowserIconMeta(value: string | null | undefined): {
    Icon: typeof FaChrome;
    className: string;
} | null {
    const normalized = normalizeBreakdownLabel(value);

    if (normalized.includes("chrome") || normalized.includes("chromium")) {
        return { Icon: FaChrome, className: "text-[#4285F4]" };
    }
    if (normalized.includes("safari") || normalized.includes("webkit")) {
        return { Icon: FaSafari, className: "text-[#006CFF]" };
    }
    if (normalized.includes("firefox") || normalized.includes("mozilla")) {
        return { Icon: FaFirefox, className: "text-orange-400" };
    }
    if (normalized.includes("edge")) {
        return { Icon: FaEdge, className: "text-[#0078D7]" };
    }
    if (normalized.includes("opera")) {
        return { Icon: FaOpera, className: "text-red-500" };
    }

    return null;
}

function getBrowserIconSrc(value: string | null | undefined) {
    const normalized = normalizeBreakdownLabel(value);

    if (getBrowserIconMeta(value)) {
        return null;
    }

    if (normalized.includes("brave")) {
        return "https://img.icons8.com/color/48/brave-web-browser.png";
    }
    if (normalized.includes("arc")) {
        return "https://www.google.com/s2/favicons?domain=arc.net&sz=32";
    }
    if (normalized.includes("vivaldi")) {
        return "https://www.google.com/s2/favicons?domain=vivaldi.com&sz=32";
    }
    if (normalized.includes("samsung")) {
        return "https://www.google.com/s2/favicons?domain=samsung.com&sz=32";
    }

    return null;
}

function getOSIconSrc(value: string | null | undefined) {
    const normalized = normalizeBreakdownLabel(value);

    if (
        normalized.includes("mac") ||
        normalized.includes("ios") ||
        normalized.includes("ipad")
    ) {
        return "https://img.icons8.com/color/48/mac-os.png";
    }
    if (normalized.includes("windows")) {
        return "https://img.icons8.com/color/48/windows-10.png";
    }
    if (normalized.includes("android")) {
        return "https://img.icons8.com/color/48/android-os.png";
    }
    if (normalized.includes("linux") || normalized.includes("ubuntu")) {
        return "https://img.icons8.com/color/48/linux.png";
    }

    return null;
}

function DeviceGlyph({ value }: { value: string | null | undefined }) {
    const normalized = normalizeBreakdownLabel(value);
    let Icon = FaDesktop;
    let className = "text-[color:var(--dash-success)]";

    if (
        normalized.includes("mobile") ||
        normalized.includes("phone") ||
        normalized.includes("iphone") ||
        normalized.includes("android")
    ) {
        Icon = FaMobileAlt;
        className = "text-sky-300";
    } else if (normalized.includes("tablet") || normalized.includes("ipad")) {
        Icon = FaTabletAlt;
        className = "text-cyan-300";
    } else if (
        normalized.includes("laptop") ||
        normalized.includes("notebook") ||
        normalized.includes("macbook") ||
        normalized.includes("chromebook")
    ) {
        Icon = FaLaptop;
        className = "text-violet-300";
    }

    return (
        <span
            className={`inline-flex h-5 w-5 shrink-0 items-center justify-center ${className}`}
        >
            <Icon className="h-4 w-4" />
        </span>
    );
}

function BrowserGlyph({ value }: { value: string | null | undefined }) {
    const browserIcon = getBrowserIconMeta(value);

    if (browserIcon) {
        const { Icon, className } = browserIcon;
        return (
            <span
                className={`inline-flex h-5 w-5 shrink-0 items-center justify-center ${className}`}
            >
                <Icon className="h-4 w-4" />
            </span>
        );
    }

    const iconSrc = getBrowserIconSrc(value);

    if (iconSrc) {
        return (
            <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden rounded-[4px]">
                <img
                    src={iconSrc}
                    alt=""
                    aria-hidden="true"
                    className="h-4 w-4 object-contain"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                />
            </span>
        );
    }

    return (
        <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center text-[color:var(--dash-text-soft)]">
            <FaGlobe className="h-4 w-4" />
        </span>
    );
}

function CountryBreakdownLabel({
    country,
}: {
    country: string | null | undefined;
}) {
    const displayName = normalizeCountryDisplayName(country);
    const code = resolveCountryCode(country);

    if (!code) {
        return <span>{displayName}</span>;
    }

    return (
        <span className="inline-flex items-center gap-2">
            <CountryFlag
                country={country}
                className="h-3.5 w-5 rounded-[2px]"
            />
            <span className="truncate">{displayName}</span>
        </span>
    );
}

function DeviceLabel({ value }: { value: string | null | undefined }) {
    const label = value || "-";

    return (
        <span className="inline-flex min-w-0 items-center gap-2">
            <DeviceGlyph value={value} />
            <span className="truncate">{label}</span>
        </span>
    );
}

function BrowserLabel({ value }: { value: string | null | undefined }) {
    const label = value || "-";

    return (
        <span className="inline-flex min-w-0 items-center gap-2">
            <BrowserGlyph value={value} />
            <span className="truncate">{label}</span>
        </span>
    );
}

function OSGlyph({ value }: { value: string | null | undefined }) {
    const iconSrc = getOSIconSrc(value);
    const normalized = normalizeBreakdownLabel(value);
    let Icon = FaDesktop;
    let className = "text-[color:var(--dash-text-soft)]";

    if (
        normalized.includes("chrome os") ||
        normalized.includes("chromeos")
    ) {
        return (
            <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center text-[#4285F4]">
                <FaChrome className="h-4 w-4" />
            </span>
        );
    }

    if (iconSrc) {
        return (
            <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden rounded-[4px]">
                <img
                    src={iconSrc}
                    alt=""
                    aria-hidden="true"
                    className="h-4 w-4 object-contain"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                />
            </span>
        );
    }

    if (
        normalized.includes("mac") ||
        normalized.includes("ios") ||
        normalized.includes("ipad")
    ) {
        Icon = FaApple;
        className = "text-slate-200";
    } else if (normalized.includes("windows")) {
        Icon = FaWindows;
        className = "text-sky-300";
    }

    return (
        <span
            className={`inline-flex h-5 w-5 shrink-0 items-center justify-center ${className}`}
        >
            <Icon className="h-4 w-4" />
        </span>
    );
}

function OSLabel({ value }: { value: string | null | undefined }) {
    const label = value || "-";

    return (
        <span className="inline-flex min-w-0 items-center gap-2">
            <OSGlyph value={value} />
            <span className="truncate">{label}</span>
        </span>
    );
}

function looksLikeDomain(value: string | null | undefined) {
    if (!value) return false;

    const trimmed = value.trim().toLowerCase();
    if (!trimmed) return false;
    if (trimmed === "direct" || trimmed === "-") return false;

    return (
        trimmed.startsWith("http://") ||
        trimmed.startsWith("https://") ||
        trimmed.includes(".")
    );
}

function DomainTextLabel({
    value,
    fallback = "-",
}: {
    value: string | null | undefined;
    fallback?: string;
}) {
    const label = value?.trim() || fallback;

    return (
        <span className="inline-flex min-w-0 items-center gap-2">
            {looksLikeDomain(value) ? (
                <DomainFavicon
                    domain={value}
                    className="h-4 w-4 shrink-0 rounded-[4px]"
                />
            ) : null}
            <span className="truncate">{label}</span>
        </span>
    );
}

function ReferrerSublabel({
    routeType,
    referrerDomain,
    occurredAt,
}: {
    routeType: "load" | "spa";
    referrerDomain: string | null;
    occurredAt: string;
}) {
    return (
        <span className="inline-flex min-w-0 items-center gap-1.5">
            <span>{routeType.toUpperCase()}</span>
            <span>-</span>
            <DomainTextLabel value={referrerDomain} fallback="Direct" />
            <span>-</span>
            <span>{formatRelativeTime(occurredAt)}</span>
        </span>
    );
}

function PageviewLabel({
    path,
}: {
    path: string;
}) {
    return (
        <span className="truncate">{path}</span>
    );
}

function DeviceAndBrowserLabel({
    device,
    browser,
}: {
    device: string | null | undefined;
    browser: string | null | undefined;
}) {
    return (
        <span className="inline-flex min-w-0 items-center gap-3">
            <DeviceLabel value={device} />
            <BrowserLabel value={browser} />
        </span>
    );
}

function formatLocaleName(value: string): string {
    const normalized = value.trim().replace("_", "-");
    if (!normalized) return "Unknown";

    const [languageCode, regionCode] = normalized.split("-");

    try {
        const languageNames = new Intl.DisplayNames(undefined, {
            type: "language",
        });
        const regionNames = new Intl.DisplayNames(undefined, {
            type: "region",
        });
        const languageName = languageNames.of(languageCode) ?? languageCode;
        const regionName = regionCode ? regionNames.of(regionCode) : null;

        return regionName ? `${languageName} - ${regionName}` : languageName;
    } catch {
        return normalized;
    }
}

function breakdownRows(
    items: Array<UserAnalyticsBreakdownItem | UserAnalyticsCountryItem>,
    valueLabel = "visits",
    options?: {
        countryFlags?: boolean;
        iconType?: "device" | "browser" | "os";
        labelFormatter?: (value: string) => string;
    }
): RankedMetricRow[] {
    return items.map((item) => ({
        id: item.label,
        label: options?.countryFlags ? (
            <CountryBreakdownLabel country={item.label} />
        ) : options?.iconType === "device" ? (
            <DeviceLabel value={item.label} />
        ) : options?.iconType === "browser" ? (
            <BrowserLabel value={item.label} />
        ) : options?.iconType === "os" ? (
            <OSLabel value={item.label} />
        ) : (
            (options?.labelFormatter?.(item.label) ?? item.label)
        ),
        sublabel: options?.countryFlags
            ? `${formatNumber(item.value)} visits`
            : "uniqueVisitors" in item
              ? `${formatNumber(
                    typeof item.uniqueVisitors === "number"
                        ? item.uniqueVisitors
                        : getMetricCurrent(item.uniqueVisitors as never)
                )} visitors`
              : `${formatNumber(item.value)} ${valueLabel}`,
        value: formatPercent(item.pct),
        rawValue: item.value,
        barPct: item.pct,
    }));
}

function topPageRows(
    pages: UserAnalyticsTopPage[],
    metric: "views" | "unique" = "views"
): RankedMetricRow[] {
    return pages.map((page) => {
        const rawValue = metric === "unique" ? page.uniqueVisitors : page.views;

        return {
            id: page.path,
            label: page.path,
            sublabel: page.title || "Untitled page",
            value: formatNumber(rawValue),
            rawValue,
        };
    });
}

function formatRelativeTime(value: string) {
    const diffMs = Date.now() - new Date(value).getTime();
    const diffMinutes = Math.max(0, Math.round(diffMs / 60_000));

    if (diffMinutes < 60) return `${diffMinutes}m ago`;

    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    return `${Math.round(diffHours / 24)}d ago`;
}

function getMetricTone(changePct: number | null, invert = false) {
    if (changePct == null || changePct === 0) {
        return { className: "text-[color:var(--dash-text-muted)]", icon: null };
    }

    const positive = invert ? changePct < 0 : changePct > 0;

    return positive
        ? {
              className: "text-[color:var(--dash-success)]",
              icon: <ArrowUpRight className="h-3.5 w-3.5" />,
          }
        : {
              className: "text-[color:var(--dash-danger)]",
              icon: <ArrowDownRight className="h-3.5 w-3.5" />,
          };
}

function Panel({
    title,
    eyebrow,
    children,
    headerAction,
    className = "",
    bodyClassName = "",
}: {
    title: string;
    eyebrow?: string;
    children: React.ReactNode;
    headerAction?: React.ReactNode;
    className?: string;
    bodyClassName?: string;
}) {
    return (
        <section className={`dashboard-panel overflow-hidden ${className}`}>
            <div className={dashboardPanelHeaderClass}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                        {eyebrow ? (
                            <p className="mb-1 text-[10px] uppercase tracking-[0.22em] text-[color:var(--dash-text-muted)]">
                                {eyebrow}
                            </p>
                        ) : null}
                        <h2 className="text-sm font-semibold text-[color:var(--dash-text)]">
                            {title}
                        </h2>
                    </div>
                    {headerAction ? (
                        <div className="min-w-0 shrink-0">{headerAction}</div>
                    ) : null}
                </div>
            </div>
            <div className={`${dashboardPanelBodyClass} ${bodyClassName}`.trim()}>
                {children}
            </div>
        </section>
    );
}

function formatCohortDateLabel(value: string) {
    const date = new Date(`${value}T00:00:00.000Z`);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        timeZone: "UTC",
    });
}

function getRetentionCellStyle(pct: number | null) {
    const intensity = Math.min(Math.max(pct ?? 0, 0), 100);
    return {
        backgroundColor: `color-mix(in srgb, var(--dash-blue) ${intensity}%, transparent)`,
    } as const;
}

function RetentionHeatmap({ data }: { data: UserAnalyticsRetentionResponse }) {
    const scrollRef = useHorizontalWheelScroll<HTMLDivElement>();
    const dayOffsets =
        data.displayDayOffsets ??
        getRetentionDisplayDayOffsets(data.maxDayOffset, data.range);
    const tableMinWidth = 148 + dayOffsets.length * 72;
    const gridCaption = getRetentionGridCaption(data.maxDayOffset, data.range);

    const getCohortCell = (
        values: UserAnalyticsRetentionResponse["cohorts"][number]["values"],
        dayOffset: number,
    ) => values[dayOffset] ?? { dayOffset, users: 0, pct: null };

    const getAverageCell = (
        averages: UserAnalyticsRetentionResponse["averages"],
        dayOffset: number,
    ) => averages[dayOffset] ?? { dayOffset, pct: null };

    if (!data.cohorts.length) {
        return (
            <Panel title="Cohort retention">
                <div className="px-5 py-10 text-center">
                    <p className="text-sm text-[color:var(--dash-text-soft)]">
                        No cohort data for this range yet.
                    </p>
                </div>
            </Panel>
        );
    }

    return (
        <Panel title="Cohort retention" bodyClassName="min-w-0">
            <p className="mb-3 px-5 text-xs text-[color:var(--dash-text-muted)]">
                {gridCaption}
            </p>
            <div
                ref={scrollRef}
                className="retention-grid-scroll w-full min-w-0 touch-pan-x"
            >
                <table
                    className="border-collapse text-left text-xs"
                    style={{ minWidth: tableMinWidth }}
                >
                    <thead>
                        <tr className="border-b border-[color:var(--dash-divider)] bg-[color:var(--dash-bg-subtle)]">
                            <th className="sticky left-0 z-10 min-w-[148px] bg-[color:var(--dash-bg-subtle)] px-4 py-3 font-medium text-[color:var(--dash-text-muted)]">
                                Cohort
                            </th>
                            {dayOffsets.map((dayOffset) => (
                                <th
                                    key={dayOffset}
                                    className="min-w-[72px] whitespace-nowrap px-3 py-3 text-center font-medium text-[color:var(--dash-text-muted)]"
                                >
                                    Day {dayOffset}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.cohorts.map((cohort) => (
                            <tr
                                key={cohort.cohortDate}
                                className="border-b border-[color:var(--dash-divider)] last:border-b-0"
                            >
                                <td className="sticky left-0 z-10 bg-[color:var(--dash-surface)] px-4 py-3">
                                    <div className="font-medium text-[color:var(--dash-text)]">
                                        {formatCohortDateLabel(cohort.cohortDate)}
                                    </div>
                                    <div className="mt-0.5 text-[11px] text-[color:var(--dash-text-muted)]">
                                        {formatNumber(cohort.cohortSize)} visitors
                                    </div>
                                </td>
                                {dayOffsets.map((dayOffset) => {
                                    const cell = getCohortCell(cohort.values, dayOffset);
                                    return (
                                    <td
                                        key={`${cohort.cohortDate}-${dayOffset}`}
                                        className="px-1 py-1"
                                        title={`${formatNumber(cell.users)} visitors (${cell.pct != null ? formatPercent(cell.pct) : "--"})`}
                                    >
                                        <div
                                            className="flex h-11 items-center justify-center rounded-md px-2 text-[11px] font-medium tabular-nums text-[color:var(--dash-text)] transition hover:brightness-95"
                                            style={getRetentionCellStyle(cell.pct)}
                                        >
                                            {cell.pct != null ? formatPercent(cell.pct) : "--"}
                                        </div>
                                    </td>
                                    );
                                })}
                            </tr>
                        ))}
                        <tr className="border-t border-[color:var(--dash-divider)] bg-[color:var(--dash-bg-subtle)]">
                            <td className="sticky left-0 z-10 bg-[color:var(--dash-bg-subtle)] px-4 py-3 font-medium text-[color:var(--dash-text)]">
                                Average
                            </td>
                            {dayOffsets.map((dayOffset) => {
                                const cell = getAverageCell(data.averages, dayOffset);
                                return (
                                <td
                                    key={`avg-${dayOffset}`}
                                    className="px-1 py-1"
                                >
                                    <div
                                        className="flex h-11 items-center justify-center rounded-md px-2 text-[11px] font-semibold tabular-nums text-[color:var(--dash-text)]"
                                        style={getRetentionCellStyle(cell.pct)}
                                    >
                                        {cell.pct != null ? formatPercent(cell.pct) : "--"}
                                    </div>
                                </td>
                                );
                            })}
                        </tr>
                    </tbody>
                </table>
            </div>
        </Panel>
    );
}

function MetricCard({
    label,
    value,
    changePct,
    invert = false,
}: {
    label: string;
    value: string;
    changePct: number | null;
    invert?: boolean;
}) {
    const tone = getMetricTone(changePct, invert);

    return (
        <div className="dashboard-panel dashboard-metric-card min-w-0 p-5">
            <p className="dashboard-metric-label truncate text-[10px] uppercase tracking-[0.2em] text-[color:var(--dash-text-muted)]">
                {label}
            </p>
            <div className="dashboard-metric-body mt-4 min-w-0">
                <p className="dashboard-metric-value text-[24px] font-semibold leading-none tracking-tight tabular-nums text-[color:var(--dash-text)]">
                    {value}
                </p>
                {changePct != null ? (
                    <div
                        className={`dashboard-metric-delta inline-flex items-center gap-1 rounded-full bg-[color:var(--dash-metric-delta-bg)] px-2 py-1 text-xs font-medium ${tone.className}`}
                    >
                        {tone.icon}
                        <span>{`${Math.abs(changePct).toFixed(1)}%`}</span>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

function JourneyStatCell({
    label,
    value,
    changePct = null,
    mono = false,
    textual = false,
}: {
    label: string;
    value: ReactNode;
    changePct?: number | null;
    mono?: boolean;
    /** Long labels (country names, etc.) — smaller than numeric metrics */
    textual?: boolean;
}) {
    const tone = getMetricTone(changePct, false);
    const valueClassName = mono
        ? "block min-w-0 truncate text-lg font-semibold leading-snug text-[color:var(--dash-text)]"
        : textual
          ? "block min-w-0 truncate text-lg font-semibold leading-snug text-[color:var(--dash-text)]"
          : "block text-2xl font-semibold leading-none tabular-nums text-[color:var(--dash-text)]";

    return (
        <div className="dashboard-panel dashboard-metric-card min-w-0 p-5">
            <p className="dashboard-metric-label truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--dash-text-muted)]">
                {label}
            </p>
            <div className="dashboard-metric-body mt-4 min-w-0">
                <div
                    className={`dashboard-metric-value ${valueClassName}`}
                    title={typeof value === "string" ? value : undefined}
                >
                    {value}
                </div>
                {changePct != null ? (
                    <span
                        className={`dashboard-metric-delta inline-flex items-center gap-1 rounded-full bg-[color:var(--dash-metric-delta-bg)] px-2 py-1 text-xs font-medium tabular-nums ${tone.className}`}
                    >
                        {tone.icon}
                        {Math.abs(changePct).toFixed(1)}%
                    </span>
                ) : null}
            </div>
        </div>
    );
}

function SummaryBadge({
    icon: Icon,
    label,
    value,
    changePct = null,
    invert = false,
    className = "",
    valueClassName = "",
    hideIcon = false,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: React.ReactNode;
    changePct?: number | null;
    invert?: boolean;
    className?: string;
    valueClassName?: string;
    hideIcon?: boolean;
}) {
    const tone = getMetricTone(changePct, invert);

    return (
        <div
            className={`flex min-h-[42px] min-w-[112px] items-center gap-2.5 rounded-md border border-[color:var(--dash-divider)] bg-[color:var(--dash-surface)] px-3 py-2 ${className}`}
        >
            {hideIcon ? null : (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] bg-[color:var(--dash-bg-subtle)] text-[color:var(--dash-blue)]">
                    <Icon className="h-3.5 w-3.5" />
                </div>
            )}
            <div className="min-w-0">
                <div className="text-[9px] font-medium uppercase tracking-[0.14em] text-[color:var(--dash-text-muted)]">
                    {label}
                </div>
                <div
                    className={`mt-0.5 text-base font-semibold leading-tight text-[color:var(--dash-text)] ${valueClassName}`}
                >
                    {value}
                </div>
                {changePct != null ? (
                    <div
                        className={`mt-1 inline-flex items-center gap-1 text-[10px] font-medium tabular-nums ${tone.className}`}
                    >
                        {tone.icon}
                        <span>{`${Math.abs(changePct).toFixed(1)}%`}</span>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

function InsightRail({
    items,
}: {
    items: Array<{
        icon: React.ComponentType<{ className?: string }>;
        label: string;
        value: React.ReactNode;
    }>;
}) {
    return (
        <div className={dashboardMetricGridFourClass}>
            {items.map((item) => (
                <div key={item.label} className="dashboard-panel dashboard-metric-card min-w-0 p-5">
                    <p className="dashboard-metric-label truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--dash-text-muted)]">
                        {item.label}
                    </p>
                    <div className="dashboard-metric-body mt-4 min-w-0 text-lg font-semibold leading-snug tracking-tight text-[color:var(--dash-text)] dashboard-metric-value">
                        {item.value}
                    </div>
                </div>
            ))}
        </div>
    );
}

interface RankedMetricRow {
    id: string;
    label: React.ReactNode;
    sublabel?: React.ReactNode;
    value: string;
    secondaryValue?: React.ReactNode;
    rawValue: number;
    barPct?: number;
    detailLines?: React.ReactNode[];
}

interface RankedMetricTab {
    id: string;
    label: string;
    /** Shown in tab label as `Label (count)`; defaults to row count when omitted. */
    count?: number;
    metricLabel: string;
    secondaryMetricLabel?: string;
    rows: RankedMetricRow[];
    emptyText?: string;
    previewCount?: number;
}

function RankedMetricPanel({
    title,
    tabs,
    className = "",
    barMode = "auto",
}: {
    title?: string;
    tabs: RankedMetricTab[];
    className?: string;
    barMode?: "auto" | "none";
}) {
    const [activeTabId, setActiveTabId] = useState(tabs[0]?.id ?? "");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const activeTab = tabs.find((item) => item.id === activeTabId) ?? tabs[0];
    const previewCount = activeTab?.previewCount ?? 5;
    const maxValue = Math.max(
        ...(activeTab?.rows.map((row) => row.rawValue) ?? [0]),
        0
    );
    const canExpand = (activeTab?.rows.length ?? 0) > previewCount;
    const visibleRows = activeTab?.rows.slice(0, previewCount);
    const panelTitle = title ?? activeTab?.label;
    const singleTabHeaderLabel =
        activeTab?.label && activeTab.label !== panelTitle
            ? activeTab.label
            : activeTab?.metricLabel
              ? `${activeTab.metricLabel} Breakdown`
              : "Breakdown";

    useEffect(() => {
        setIsModalOpen(false);
    }, [activeTabId]);

    useEffect(() => {
        if (!isModalOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsModalOpen(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isModalOpen]);

    return (
        <>
            <section
                className={`dashboard-panel flex h-full ${dashboardRankedPanelMinHeight} flex-col overflow-hidden ${className}`}
            >
                <div className="border-b border-[color:var(--dash-divider)]">
                    <div className="px-5 py-3.5">
                        <h2 className="truncate text-xl font-semibold tracking-tight text-[color:var(--dash-text)]">
                            {panelTitle}
                        </h2>
                    </div>
                    {tabs.length > 1 ? (
                        <div className="flex min-h-[52px] items-center justify-between gap-4 px-5 py-2">
                            <div className="flex min-w-0 flex-wrap items-end gap-5">
                                {tabs.map((tab) => {
                                    const tabCount = tab.count ?? tab.rows.length;

                                    return (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            onClick={() => setActiveTabId(tab.id)}
                                            className={`border-b-2 pb-2 text-sm font-medium transition-colors ${
                                                activeTab?.id === tab.id
                                                    ? "border-[color:var(--dash-chart-secondary)] text-[color:var(--dash-text)]"
                                                    : "border-transparent text-[color:var(--dash-text-soft)] hover:text-[color:var(--dash-text)]"
                                            }`}
                                        >
                                            {tab.label} ({formatNumber(tabCount)})
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="flex shrink-0 items-center gap-6">
                                {activeTab?.secondaryMetricLabel ? (
                                    <p className="w-16 text-right text-[10px] font-medium uppercase tracking-[0.18em] text-[color:var(--dash-text-muted)]">
                                        {activeTab.secondaryMetricLabel}
                                    </p>
                                ) : null}
                                <p className="w-16 text-right text-[10px] font-medium uppercase tracking-[0.18em] text-[color:var(--dash-text-muted)]">
                                    {activeTab?.metricLabel}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex min-h-[52px] items-center justify-between gap-4 px-5 py-2">
                            <p className="min-w-0 truncate text-sm font-medium text-[color:var(--dash-text)]">
                                {singleTabHeaderLabel}
                            </p>
                            <div className="flex shrink-0 items-center gap-6">
                                {activeTab?.secondaryMetricLabel ? (
                                    <p className="w-16 text-right text-[10px] font-medium uppercase tracking-[0.18em] text-[color:var(--dash-text-muted)]">
                                        {activeTab.secondaryMetricLabel}
                                    </p>
                                ) : null}
                                <p className="w-16 text-right text-[10px] font-medium uppercase tracking-[0.18em] text-[color:var(--dash-text-muted)]">
                                    {activeTab?.metricLabel}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="relative flex-1 px-4 py-4">
                    {activeTab?.rows.length ? (
                        <div className="space-y-2">
                            {visibleRows?.map((row) => {
                                const width =
                                    row.barPct ??
                                    (maxValue > 0
                                        ? (row.rawValue / maxValue) * 100
                                        : 0);
                                const showBar = barMode === "auto" && width > 0;

                                return (
                                    <div
                                        key={row.id}
                                        className={`group relative grid min-h-[54px] items-center gap-4 overflow-hidden rounded-md px-3 py-2 ${
                                            row.secondaryValue != null
                                                ? "grid-cols-[minmax(0,1fr)_auto_auto]"
                                                : "grid-cols-[minmax(0,1fr)_auto]"
                                        }`}
                                    >
                                        {showBar ? (
                                            <div
                                                className="absolute inset-y-0 left-0 rounded-md transition-colors"
                                                style={{
                                                    backgroundColor:
                                                        "var(--dash-meter-fill)",
                                                    width: `${Math.max(4, Math.min(width, 100))}%`,
                                                }}
                                            />
                                        ) : (
                                            <div className="absolute inset-0 rounded-md bg-transparent transition-colors group-hover:bg-[color:var(--dash-surface-hover)]" />
                                        )}
                                        <div className="relative min-w-0">
                                            <p className="truncate text-sm font-semibold text-[color:var(--dash-text)]">
                                                {row.label}
                                            </p>
                                            {row.sublabel ? (
                                                <p className="mt-0.5 truncate text-xs text-[color:var(--dash-text-soft)]">
                                                    {row.sublabel}
                                                </p>
                                            ) : null}
                                        </div>
                                        {row.secondaryValue != null ? (
                                            <div className="relative w-16 shrink-0 text-right">
                                                <p className="text-sm font-semibold tabular-nums text-[color:var(--dash-text)]">
                                                    {row.secondaryValue}
                                                </p>
                                            </div>
                                        ) : null}
                                        <div className="relative w-16 shrink-0 text-right">
                                            <p className="text-sm font-semibold tabular-nums text-[color:var(--dash-text)]">
                                                {row.value}
                                            </p>
                                            {row.detailLines?.length ? (
                                                <div className="mt-1 space-y-0.5 text-[11px] text-[color:var(--dash-text-muted)]">
                                                    {row.detailLines.map(
                                                        (line, index) => (
                                                            <div
                                                                key={`${row.id}-detail-${index}`}
                                                            >
                                                                {line}
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex h-full min-h-[180px] items-center justify-center text-sm text-[color:var(--dash-text-soft)]">
                            {activeTab?.emptyText ??
                                "No data available for this range."}
                        </div>
                    )}

                    {canExpand ? (
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[color:var(--dash-surface)] via-[color:var(--dash-surface)]/94 to-transparent" />
                    ) : null}
                </div>

                <div className="flex items-center justify-center gap-2 px-4 pb-4">
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        disabled={!canExpand}
                        className="dashboard-button-secondary rounded-full px-4 py-2 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-45"
                    >
                        View All
                    </button>
                </div>
            </section>

            <AnimatePresence>
                {isModalOpen && activeTab ? (
                <motion.div
                    className="fixed inset-0 z-[1400] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                >
                    <motion.div
                        className="absolute inset-0 bg-black/65"
                        onClick={() => setIsModalOpen(false)}
                        aria-hidden="true"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                    />
                    <motion.div
                        className="dashboard-panel relative z-[1] flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden"
                        initial={{ opacity: 0, y: 18, scale: 0.985 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.985 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        <div className="flex items-center justify-between border-b border-[color:var(--dash-divider)] px-5 py-4">
                            <div className="min-w-0">
                                <h3 className="truncate text-base font-semibold text-[color:var(--dash-text)]">
                                    {title ?? activeTab.label}
                                </h3>
                                <p className="mt-1 text-xs text-[color:var(--dash-text-muted)]">
                                    {activeTab.rows.length.toLocaleString()} items in this
                                    list
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="flex h-9 w-9 items-center justify-center rounded-md bg-[color:var(--dash-bg-subtle)] text-[color:var(--dash-text-soft)] transition hover:bg-[color:var(--dash-surface-hover)] hover:text-[color:var(--dash-text)]"
                                aria-label="Close modal"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="flex min-h-[52px] items-center justify-between gap-4 border-b border-[color:var(--dash-divider)] px-5 py-3">
                            <div className="flex min-w-0 flex-wrap items-end gap-5">
                                <span className="border-b-2 border-[color:var(--dash-chart-secondary)] pb-2 text-sm font-medium text-[color:var(--dash-text)]">
                                    {activeTab.label}
                                </span>
                            </div>
                            <div className="flex shrink-0 items-center gap-6">
                                {activeTab.secondaryMetricLabel ? (
                                    <p className="w-16 text-right text-[10px] font-medium uppercase tracking-[0.18em] text-[color:var(--dash-text-muted)]">
                                        {activeTab.secondaryMetricLabel}
                                    </p>
                                ) : null}
                                <p className="w-16 text-right text-[10px] font-medium uppercase tracking-[0.18em] text-[color:var(--dash-text-muted)]">
                                    {activeTab.metricLabel}
                                </p>
                            </div>
                        </div>

                        <div className="overflow-y-auto px-4 py-4">
                            <div className="space-y-2">
                                {activeTab.rows.map((row) => {
                                    const width =
                                        row.barPct ??
                                        (maxValue > 0
                                            ? (row.rawValue / maxValue) * 100
                                            : 0);
                                    const showBar =
                                        barMode === "auto" && width > 0;

                                    return (
                                        <div
                                            key={`modal-${row.id}`}
                                            className={`group relative grid min-h-[54px] items-center gap-4 overflow-hidden rounded-md px-3 py-2 ${
                                                row.secondaryValue != null
                                                    ? "grid-cols-[minmax(0,1fr)_auto_auto]"
                                                    : "grid-cols-[minmax(0,1fr)_auto]"
                                            }`}
                                        >
                                            {showBar ? (
                                                <div
                                                    className="absolute inset-y-0 left-0 rounded-md"
                                                    style={{
                                                        backgroundColor:
                                                            "var(--dash-meter-fill)",
                                                        width: `${Math.max(4, Math.min(width, 100))}%`,
                                                    }}
                                                />
                                            ) : (
                                                <div className="absolute inset-0 rounded-md bg-transparent" />
                                            )}
                                            <div className="relative min-w-0">
                                                <p className="truncate text-sm font-semibold text-[color:var(--dash-text)]">
                                                    {row.label}
                                                </p>
                                                {row.sublabel ? (
                                                    <p className="mt-0.5 truncate text-xs text-[color:var(--dash-text-soft)]">
                                                        {row.sublabel}
                                                    </p>
                                                ) : null}
                                            </div>
                                            {row.secondaryValue != null ? (
                                                <div className="relative w-16 shrink-0 text-right">
                                                    <p className="text-sm font-semibold tabular-nums text-[color:var(--dash-text)]">
                                                        {row.secondaryValue}
                                                    </p>
                                                </div>
                                            ) : null}
                                            <div className="relative w-16 shrink-0 text-right">
                                                <p className="text-sm font-semibold tabular-nums text-[color:var(--dash-text)]">
                                                    {row.value}
                                                </p>
                                                {row.detailLines?.length ? (
                                                    <div className="mt-1 space-y-0.5 text-[11px] text-[color:var(--dash-text-muted)]">
                                                        {row.detailLines.map(
                                                            (line, index) => (
                                                                <div
                                                                    key={`modal-${row.id}-detail-${index}`}
                                                                >
                                                                    {line}
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            ) : null}
            </AnimatePresence>
        </>
    );
}

function LoadingPanel() {
    return <DashboardAnalyticsPageSkeleton />;
}

function buildPageviewEventRows(
    rows: Array<{
        id: string;
        path: string;
        title: string | null;
        routeType: "load" | "spa";
        referrerDomain: string | null;
        pageDurationMs: number | null;
        scrollPercentage: number | null;
        occurredAt: string;
    }>
): RankedMetricRow[] {
    return rows.map((row) => ({
        id: row.id,
        label: (
            <PageviewLabel
                path={row.path}
            />
        ),
        sublabel: (
            <ReferrerSublabel
                routeType={row.routeType}
                referrerDomain={row.referrerDomain}
                occurredAt={row.occurredAt}
            />
        ),
        value:
            row.pageDurationMs != null
                ? formatDuration(row.pageDurationMs)
                : "-",
        secondaryValue:
            row.scrollPercentage != null
                ? formatPercent(row.scrollPercentage)
                : "-",
        rawValue: row.pageDurationMs ?? 0,
    }));
}

function buildVisitRows(
    visits: UserAnalyticsVisitSession[]
): RankedMetricRow[] {
    return visits.map((visit) => ({
        id: visit.id,
        label: visit.entryPath,
        sublabel: `Exit ${visit.exitPath} - ${visit.visitorKey}`,
        value: formatDuration(visit.durationMs),
        rawValue: visit.durationMs,
        detailLines: [
            <span key="pages">
                {visit.pageviewCount}{" "}
                {visit.pageviewCount === 1 ? "page" : "pages"}
                {visit.isBounce ? " - bounce" : ""}
            </span>,
            visit.country ? (
                <span
                    key="country"
                    className="inline-flex items-center justify-end gap-2"
                >
                    <CountryLabel country={visit.country} />
                </span>
            ) : (
                "-"
            ),
            <span key="device">
                <DeviceAndBrowserLabel
                    device={visit.device}
                    browser={visit.browser}
                />
            </span>,
            <span key="last-activity">
                {formatRelativeTime(visit.lastActivityAt)}
            </span>,
        ],
    }));
}

function CountryCodeBadge({ country }: { country: string | null | undefined }) {
    const code = resolveCountryCode(country);
    if (!code) {
        return (
            <span className="inline-flex min-w-[28px] items-center justify-center rounded-[6px] bg-[color:var(--dash-bg-subtle)] px-1.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[color:var(--dash-text-muted)] shadow-[var(--dash-control-shadow)]">
                --
            </span>
        );
    }

    return (
        <span className="inline-flex min-w-[28px] items-center justify-center rounded-[6px] bg-[color:var(--dash-bg-subtle)] px-1.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[color:var(--dash-text-soft)] shadow-[var(--dash-control-shadow)]">
            {code}
        </span>
    );
}

function LatestVisitsTable({
    visits,
}: {
    visits: UserAnalyticsVisitSession[];
}) {
    const scrollRef = useHorizontalWheelScroll<HTMLDivElement>();

    return (
        <Panel title="Latest Visits">
            {visits.length ? (
                <>
                    <div
                        ref={scrollRef}
                        className="w-full min-w-0 overflow-x-auto overscroll-x-contain rounded-lg border border-[color:var(--dash-divider)] bg-[color:var(--dash-surface)]"
                    >
                        <table className="min-w-[900px] w-full table-fixed">
                            <colgroup>
                                <col className="w-[17%]" />
                                <col className="w-[15%]" />
                                <col className="w-[13%]" />
                                <col className="w-[14%]" />
                                <col className="w-[11%]" />
                                <col className="w-[8%]" />
                                <col className="w-[10%]" />
                                <col className="w-[12%]" />
                            </colgroup>
                            <thead className="bg-[color:var(--dash-bg-subtle)]">
                                <tr className="text-left">
                                    <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-[0.16em] text-[color:var(--dash-text-muted)]">
                                        Entry
                                    </th>
                                    <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-[0.16em] text-[color:var(--dash-text-muted)]">
                                        Exit
                                    </th>
                                    <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-[0.16em] text-[color:var(--dash-text-muted)]">
                                        Country
                                    </th>
                                    <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-[0.16em] text-[color:var(--dash-text-muted)]">
                                        Device
                                    </th>
                                    <th className="px-4 py-3 text-[10px] font-medium uppercase tracking-[0.16em] text-[color:var(--dash-text-muted)]">
                                        Source
                                    </th>
                                    <th className="px-3 py-3 text-center text-[10px] font-medium uppercase tracking-[0.16em] text-[color:var(--dash-text-muted)]">
                                        Pages
                                    </th>
                                    <th className="px-3 py-3 text-center text-[10px] font-medium uppercase tracking-[0.16em] text-[color:var(--dash-text-muted)]">
                                        Duration
                                    </th>
                                    <th className="px-4 py-3 text-right text-[10px] font-medium uppercase tracking-[0.16em] text-[color:var(--dash-text-muted)]">
                                        Seen
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {visits.map((visit) => (
                                    <tr
                                        key={visit.id}
                                        className="border-t border-[color:var(--dash-divider)] transition-colors hover:bg-[color:var(--dash-surface-hover)]"
                                    >
                                        <td className="px-4 py-3.5 align-middle">
                                            <div className="truncate text-sm font-medium text-[color:var(--dash-text)]">
                                                {visit.entryPath}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 align-middle">
                                            <div className="truncate text-sm text-[color:var(--dash-text-soft)]">
                                                {visit.exitPath}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 align-middle">
                                            <div className="ml-4 flex items-center">
                                                <CountryFlagOnly
                                                    country={visit.country}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 align-middle">
                                            <div className="text-sm text-[color:var(--dash-text-soft)]">
                                                <DeviceLabel
                                                    value={visit.device}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 align-middle">
                                            <div className="truncate text-sm text-[color:var(--dash-text-soft)]">
                                                {visit.channel || "-"}
                                            </div>
                                        </td>
                                        <td className="px-3 py-3.5 text-center align-middle whitespace-nowrap">
                                            <span className="text-sm font-semibold tabular-nums text-[color:var(--dash-text)]">
                                                {visit.pageviewCount}
                                            </span>
                                        </td>
                                        <td className="px-3 py-3.5 text-center align-middle whitespace-nowrap text-sm font-semibold tabular-nums text-[color:var(--dash-text)]">
                                            {formatDuration(visit.durationMs)}
                                        </td>
                                        <td className="px-4 py-3.5 text-right align-middle whitespace-nowrap text-sm text-[color:var(--dash-text-muted)]">
                                            {formatRelativeTime(
                                                visit.lastActivityAt
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="space-y-2 lg:hidden">
                        {visits.map((visit) => (
                            <div
                                key={visit.id}
                                className="rounded-md border border-[color:var(--dash-divider)] bg-[color:var(--dash-surface)] px-4 py-3"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="truncate text-sm font-medium text-[color:var(--dash-text)]">
                                            {visit.entryPath}
                                        </div>
                                        <div className="mt-1 truncate text-xs text-[color:var(--dash-text-soft)]">
                                            Exit {visit.exitPath}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-medium text-[color:var(--dash-text)]">
                                            {formatDuration(visit.durationMs)}
                                        </div>
                                        <div className="mt-1 text-[11px] text-[color:var(--dash-text-muted)]">
                                            {formatRelativeTime(
                                                visit.lastActivityAt
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[11px]">
                                    <div>
                                        <div className="uppercase tracking-[0.14em] text-[color:var(--dash-text-muted)]">
                                            Country
                                        </div>
                                        <div className="mt-1 flex items-center gap-2 text-[color:var(--dash-text)]">
                                            <CountryFlagOnly
                                                country={visit.country}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="uppercase tracking-[0.14em] text-[color:var(--dash-text-muted)]">
                                            Device
                                        </div>
                                        <div className="mt-1 text-[color:var(--dash-text)]">
                                            <DeviceLabel value={visit.device} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="uppercase tracking-[0.14em] text-[color:var(--dash-text-muted)]">
                                            Source
                                        </div>
                                        <div className="mt-1 text-[color:var(--dash-text)]">
                                            {visit.channel || "-"}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="uppercase tracking-[0.14em] text-[color:var(--dash-text-muted)]">
                                            Pages
                                        </div>
                                        <div className="mt-1 text-[color:var(--dash-text)]">
                                            {visit.pageviewCount}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="flex min-h-[180px] items-center justify-center text-sm text-[color:var(--dash-text-soft)]">
                    No recent visits available for this range.
                </div>
            )}
        </Panel>
    );
}

function ChartTooltip({
    active,
    payload,
    label,
}: {
    active?: boolean;
    payload?: Array<{ color?: string; name?: string; value?: number | string }>;
    label?: string;
}) {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-md bg-[color:var(--dash-surface)] p-3 shadow-[var(--dash-menu-shadow)]">
            {label ? (
                <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-[color:var(--dash-text-muted)]">
                    {label}
                </p>
            ) : null}
            <div className="space-y-1.5">
                {payload.map((entry) => (
                    <div
                        key={entry.name}
                        className="flex items-center justify-between gap-4 text-xs"
                    >
                        <div className="flex items-center gap-2">
                            <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-[color:var(--dash-text-soft)]">
                                {entry.name}
                            </span>
                        </div>
                        <span className="font-medium text-[color:var(--dash-text)]">
                            {formatNumber(Number(entry.value ?? 0))}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function CompactMetricGrid({ children }: { children: React.ReactNode }) {
    return (
        <div className={dashboardMetricGridFourClass}>
            {children}
        </div>
    );
}

// Heatmap lives inside UserAnalyticsDashboard shell (shared header + range).
function ClickHeatmapSection({
    projectId,
    range,
    onRegisterExport,
}: {
    projectId: string;
    range: UserAnalyticsRange;
    onRegisterExport: (handlers: HeatmapExportHandlers | null) => void;
}) {
    return (
        <ClickHeatmap
            projectId={projectId}
            range={range}
            onRegisterExport={onRegisterExport}
        />
    );
}

export function UserAnalyticsDashboard({
    projectId,
    tab,
}: UserAnalyticsDashboardProps) {
    const dispatch = useAppDispatch();
    const filters = useAppSelector(selectFilters("userAnalytics")) as {
        range: string;
    };
    const range = filters.range as UserAnalyticsRange;
    const timeRanges = useAllowedTimeRanges(["24h", "7d", "30d", "90d", "1y"]);
    const meta = TAB_META[tab];
    const [journeyStartInput, setJourneyStartInput] = useState<string>("");
    const [journeyStartPath, setJourneyStartPath] = useState<string>("");
    const [journeyRouteSearchOpen, setJourneyRouteSearchOpen] = useState(false);
    const [journeySelection, setJourneySelection] = useState<{
        step: number;
        path: string;
    } | null>(null);
    const [journeyDetailRow, setJourneyDetailRow] =
        useState<UserAnalyticsJourneySequenceRow | null>(null);
    const [selectedJourneySequenceKey, setSelectedJourneySequenceKey] =
        useState<string | null>(null);
    const [heatmapExport, setHeatmapExport] =
        useState<HeatmapExportHandlers | null>(null);

    useEffect(() => {
        if (tab !== "heatmap") {
            setHeatmapExport(null);
        }
    }, [tab]);

    const applyJourneyStartPath = useCallback((path: string) => {
        const nextPath = path.trim();
        setJourneyStartInput(nextPath);
        setJourneyStartPath(nextPath);
        setJourneyRouteSearchOpen(false);
        setJourneySelection(null);
        setSelectedJourneySequenceKey(null);
    }, []);

    const clearJourneyStartPath = useCallback(() => {
        setJourneyStartInput("");
        setJourneyStartPath("");
        setJourneyRouteSearchOpen(false);
        setJourneySelection(null);
        setSelectedJourneySequenceKey(null);
    }, []);

    useEffect(() => {
        if (tab !== "journeys") return;
        const handler = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setJourneySelection(null);
                setSelectedJourneySequenceKey(null);
                setJourneyDetailRow(null);
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [tab]);

    useEffect(() => {
        const selected = timeRanges.find((item) => item.value === range);
        if (selected && !selected.disabled) return;

        const nextRange = timeRanges.find((item) => !item.disabled)?.value as
            | UserAnalyticsRange
            | undefined;
        if (nextRange) {
            dispatch(
                setFilter({
                    page: "userAnalytics",
                    key: "range",
                    value: nextRange,
                })
            );
        }
    }, [dispatch, range, timeRanges]);

    const overviewQuery = useGetUserAnalyticsOverviewQuery(
        { projectId, range },
        { skip: tab !== "overview" }
    );
    const pageviewsQuery = useGetUserAnalyticsPageviewsQuery(
        { projectId, range },
        { skip: tab !== "pageviews" }
    );
    const visitsQuery = useGetUserAnalyticsVisitsQuery(
        { projectId, range },
        { skip: tab !== "visits" }
    );
    const journeysQuery = useGetUserAnalyticsJourneysQuery(
        {
            projectId,
            range,
            steps: JOURNEY_STEPS,
            startPath: journeyStartPath,
        },
        { skip: tab !== "journeys" }
    );
    const geographyQuery = useGetUserAnalyticsGeographyQuery(
        { projectId, range },
        { skip: tab !== "geography" }
    );
    const devicesQuery = useGetUserAnalyticsDevicesQuery(
        { projectId, range },
        { skip: tab !== "devices" }
    );
    const referrersQuery = useGetUserAnalyticsReferrersQuery(
        { projectId, range },
        { skip: tab !== "referrers" }
    );
    const engagementQuery = useGetUserAnalyticsEngagementQuery(
        { projectId, range },
        { skip: tab !== "engagement" }
    );
    const retentionQuery = useGetUserAnalyticsRetentionQuery(
        { projectId, range },
        { skip: tab !== "retention" }
    );
    const inactiveQueryAnchor = useGetUserAnalyticsOverviewQuery(
        { projectId, range },
        { skip: true }
    );
    const journeyColumns = useMemo<UserAnalyticsJourneysResponse["columns"]>(
        () => journeysQuery.data?.columns ?? [],
        [journeysQuery.data]
    );
    const journeySequenceRows = useMemo(() => {
        const rows = journeysQuery.data?.sequences ?? [];
        const multiStep = rows.filter((row) => row.paths.length > 1);
        const pool = multiStep.length > 0 ? multiStep : rows;
        return [...pool].sort((a, b) => {
            if (b.currentVisits !== a.currentVisits) {
                return b.currentVisits - a.currentVisits;
            }
            return b.paths.length - a.paths.length;
        });
    }, [journeysQuery.data]);
    const journeySummary = journeysQuery.data?.summary;

    const journeyDisplayColumns = useMemo(() => {
        return journeyColumns.map((column) => ({
            ...column,
            nodes: column.nodes.slice(0, JOURNEY_NODE_LIMIT_PER_COLUMN),
        }));
    }, [journeyColumns]);

    const journeyRouteSuggestions = useMemo(() => {
        const routes = new Set<string>(journeysQuery.data?.routeSuggestions ?? []);
        for (const column of journeyColumns) {
            for (const node of column.nodes) {
                routes.add(node.path);
            }
        }
        for (const sequence of journeySequenceRows) {
            for (const path of sequence.paths) {
                if (path) routes.add(path);
            }
        }
        return Array.from(routes).sort((a, b) => a.localeCompare(b));
    }, [journeyColumns, journeySequenceRows, journeysQuery.data]);

    const filteredJourneyRouteSuggestions = useMemo(() => {
        const query = journeyStartInput.trim().toLowerCase();
        const suggestions = query
            ? journeyRouteSuggestions.filter((path) =>
                  path.toLowerCase().includes(query)
              )
            : journeyRouteSuggestions;

        return suggestions;
    }, [journeyRouteSuggestions, journeyStartInput]);

    useEffect(() => {
        if (!journeyStartPath) return;

        for (const column of journeyDisplayColumns) {
            const match = column.nodes.find((node) => node.path === journeyStartPath);
            if (!match) continue;

            const nextSelection = { step: column.step, path: match.path };
            if (
                journeySelection?.step !== nextSelection.step ||
                journeySelection.path !== nextSelection.path
            ) {
                setJourneySelection(nextSelection);
            }
            return;
        }
    }, [journeyDisplayColumns, journeySelection, journeyStartPath]);

    const journeyNodeIndex = useMemo(() => {
        const index = new Map<string, { columnIndex: number; rowIndex: number }>();
        journeyDisplayColumns.forEach((column, columnIndex) => {
            column.nodes.forEach((node, rowIndex) => {
                index.set(`${column.step}:${node.path}`, { columnIndex, rowIndex });
            });
        });
        return index;
    }, [journeyDisplayColumns]);

    const journeyConnectionMap = useMemo(() => {
        const forward = new Map<string, Array<{ key: string; visits: number }>>();
        const backward = new Map<string, Array<{ key: string; visits: number }>>();

        const add = (
            map: Map<string, Array<{ key: string; visits: number }>>,
            fromKey: string,
            toKey: string,
            visits: number
        ) => {
            const list = map.get(fromKey) ?? [];
            const existing = list.find((item) => item.key === toKey);
            if (existing) existing.visits += visits;
            else list.push({ key: toKey, visits });
            map.set(fromKey, list);
        };

        for (const sequence of journeySequenceRows) {
            for (let index = 0; index < sequence.paths.length - 1; index += 1) {
                const fromPath = sequence.paths[index];
                const toPath = sequence.paths[index + 1];
                if (!fromPath || !toPath) continue;

                const fromStep = index + 1;
                const toStep = index + 2;
                const fromKey = `${fromStep}:${fromPath}`;
                const toKey = `${toStep}:${toPath}`;

                if (!journeyNodeIndex.has(fromKey)) continue;
                if (!journeyNodeIndex.has(toKey)) continue;

                add(forward, fromKey, toKey, sequence.currentVisits);
                add(backward, toKey, fromKey, sequence.currentVisits);
            }
        }
        return { forward, backward };
    }, [journeySequenceRows, journeyNodeIndex]);

    const allJourneyEdges = useMemo(() => {
        const edges: Array<{
            id: string;
            from: string;
            to: string;
            visits: number;
            columnIndex: number;
            fromRow: number;
            toRow: number;
        }> = [];
        const seen = new Set<string>();

        for (const [fromKey, items] of journeyConnectionMap.forward.entries()) {
            const fromInfo = journeyNodeIndex.get(fromKey);
            if (!fromInfo) continue;
            for (const item of items) {
                const toInfo = journeyNodeIndex.get(item.key);
                if (!toInfo) continue;
                const id = `${fromKey}->${item.key}`;
                if (seen.has(id)) continue;
                seen.add(id);
                edges.push({
                    id,
                    from: fromKey,
                    to: item.key,
                    visits: item.visits,
                    columnIndex: fromInfo.columnIndex,
                    fromRow: fromInfo.rowIndex,
                    toRow: toInfo.rowIndex,
                });
            }
        }
        return edges;
    }, [journeyConnectionMap, journeyNodeIndex]);

    useEffect(() => {
        if (!journeyDisplayColumns.length) {
            if (journeySelection !== null) setJourneySelection(null);
            return;
        }
        if (
            journeySelection &&
            journeyNodeIndex.has(`${journeySelection.step}:${journeySelection.path}`)
        ) {
            return;
        }
        if (journeySelection !== null) setJourneySelection(null);
    }, [journeyDisplayColumns, journeyNodeIndex, journeySelection]);

    const selectedJourneyKey = journeySelection
        ? `${journeySelection.step}:${journeySelection.path}`
        : null;

    const highlightedJourneyKeys = useMemo(() => {
        if (selectedJourneySequenceKey) {
            const row = journeySequenceRows.find(
                (sequence) =>
                    getJourneySequenceKey(sequence.paths) ===
                    selectedJourneySequenceKey,
            );
            if (!row) return new Set<string>();

            const keys = new Set<string>();
            for (
                let index = 0;
                index < Math.min(row.paths.length, JOURNEY_STEPS);
                index += 1
            ) {
                const path = row.paths[index];
                if (!path) continue;
                const key = `${index + 1}:${path}`;
                if (journeyNodeIndex.has(key)) keys.add(key);
            }
            return keys;
        }

        if (!selectedJourneyKey) return new Set<string>();

        const reachable = new Set<string>([selectedJourneyKey]);
        const walk = (
            startKey: string,
            direction: "forward" | "backward"
        ) => {
            const queue = [startKey];
            const visited = new Set<string>([startKey]);
            while (queue.length) {
                const currentKey = queue.shift();
                if (!currentKey) continue;
                const items = (direction === "forward"
                    ? journeyConnectionMap.forward.get(currentKey)
                    : journeyConnectionMap.backward.get(currentKey)) ?? [];
                for (const item of items) {
                    reachable.add(item.key);
                    if (!visited.has(item.key)) {
                        visited.add(item.key);
                        queue.push(item.key);
                    }
                }
            }
        };

        walk(selectedJourneyKey, "forward");
        walk(selectedJourneyKey, "backward");
        return reachable;
    }, [
        selectedJourneyKey,
        selectedJourneySequenceKey,
        journeyConnectionMap,
        journeyNodeIndex,
        journeySequenceRows,
    ]);

    const highlightedJourneyEdgeIds = useMemo(() => {
        if (!selectedJourneyKey) return new Set<string>();
        const ids = new Set<string>();
        for (const edge of allJourneyEdges) {
            if (
                highlightedJourneyKeys.has(edge.from) &&
                highlightedJourneyKeys.has(edge.to)
            ) {
                ids.add(edge.id);
            }
        }
        return ids;
    }, [allJourneyEdges, highlightedJourneyKeys, selectedJourneyKey]);

    const journeyFlowDimensions = useMemo(() => {
        const columnsCount = journeyDisplayColumns.length;
        const maxNodes = journeyDisplayColumns.reduce(
            (max, column) => Math.max(max, column.nodes.length),
            0
        );
        const flowWidth = columnsCount > 0
            ? columnsCount * JOURNEY_CARD_WIDTH +
              Math.max(0, columnsCount - 1) * JOURNEY_CONNECTOR_GAP
            : 0;
        const flowHeight = maxNodes > 0
            ? JOURNEY_HEADER_HEIGHT +
              maxNodes * JOURNEY_NODE_HEIGHT +
              Math.max(0, maxNodes - 1) * JOURNEY_NODE_GAP
            : 0;
        return { flowWidth, flowHeight, columnsCount, maxNodes };
    }, [journeyDisplayColumns]);

    const activeQuery = (() => {
        switch (tab) {
            case "overview":
                return overviewQuery;
            case "pageviews":
                return pageviewsQuery;
            case "visits":
                return visitsQuery;
            case "journeys":
                return journeysQuery;
            case "geography":
                return geographyQuery;
            case "devices":
                return devicesQuery;
            case "referrers":
                return referrersQuery;
            case "engagement":
                return engagementQuery;
            case "retention":
                return retentionQuery;
            case "heatmap":
            case "embed":
                return inactiveQueryAnchor;
        }
    })();

    const exportConfig = useMemo(() => {
        switch (tab) {
            case "overview":
                return {
                    rows: overviewQuery.data?.topPages ?? [],
                    columns: [
                        { key: "path", header: "Path" },
                        { key: "views", header: "Views" },
                        { key: "uniqueVisitors", header: "Unique Visitors" },
                        { key: "avgDurationMs", header: "Avg Duration (ms)" },
                    ] as ExportColumn<UserAnalyticsTopPage>[],
                    json: overviewQuery.data,
                };
            case "pageviews":
                return {
                    rows: pageviewsQuery.data?.pages ?? [],
                    columns: [
                        { key: "path", header: "Path" },
                        { key: "views", header: "Views" },
                        { key: "uniqueVisitors", header: "Unique Visitors" },
                        { key: "avgDurationMs", header: "Avg Duration (ms)" },
                        { key: "loadViews", header: "Load Views" },
                        { key: "spaViews", header: "SPA Views" },
                    ] as ExportColumn<UserAnalyticsTopPage>[],
                    json: pageviewsQuery.data,
                };
            case "journeys":
                return {
                    rows: journeysQuery.data?.sequences ?? [],
                    columns: [
                        { key: "source", header: "Source" },
                        { key: "paths", header: "Paths" },
                        { key: "entryPath", header: "Entry Path" },
                        { key: "exitPath", header: "Exit Path" },
                        { key: "currentVisits", header: "Current Visits" },
                        { key: "previousVisits", header: "Previous Visits" },
                        { key: "changePct", header: "Change %" },
                        { key: "sharePct", header: "Share %" },
                    ] as ExportColumn<Record<string, unknown>>[],
                    json: journeysQuery.data,
                };
            case "visits":
                return {
                    rows: visitsQuery.data?.visits ?? [],
                    columns: [
                        { key: "visitorKey", header: "Visitor Key" },
                        { key: "startedAt", header: "Started At" },
                        { key: "durationMs", header: "Duration (ms)" },
                        { key: "pageviewCount", header: "Pageviews" },
                        { key: "entryPath", header: "Entry Path" },
                        { key: "exitPath", header: "Exit Path" },
                    ] as ExportColumn<UserAnalyticsVisitSession>[],
                    json: visitsQuery.data,
                };
            case "geography":
                return {
                    rows: geographyQuery.data?.countries ?? [],
                    columns: [
                        { key: "label", header: "Country" },
                        { key: "value", header: "Visits" },
                        { key: "uniqueVisitors", header: "Unique Visitors" },
                        { key: "pct", header: "Share (%)" },
                    ] as ExportColumn<UserAnalyticsCountryItem>[],
                    json: geographyQuery.data,
                };
            case "devices":
                return {
                    rows: devicesQuery.data?.devices ?? [],
                    columns: [
                        { key: "label", header: "Device" },
                        { key: "value", header: "Visits" },
                        { key: "pct", header: "Share (%)" },
                    ] as ExportColumn<UserAnalyticsBreakdownItem>[],
                    json: devicesQuery.data,
                };
            case "referrers":
                return {
                    rows: referrersQuery.data?.referrers ?? [],
                    columns: [
                        { key: "label", header: "Referrer" },
                        { key: "value", header: "Visits" },
                        { key: "uniqueVisitors", header: "Unique Visitors" },
                        { key: "pct", header: "Share (%)" },
                    ] as ExportColumn<UserAnalyticsReferrerItem>[],
                    json: referrersQuery.data,
                };
            case "engagement":
                return {
                    rows: engagementQuery.data?.topPages ?? [],
                    columns: [
                        { key: "path", header: "Path" },
                        { key: "views", header: "Views" },
                        { key: "avgDurationMs", header: "Avg Duration (ms)" },
                        {
                            key: "avgScrollPercentage",
                            header: "Avg Scroll (%)",
                        },
                    ] as ExportColumn<UserAnalyticsEngagementPage>[],
                    json: engagementQuery.data,
                };
            case "retention": {
                const retentionData = retentionQuery.data;
                const exportOffsets = new Set(
                    retentionData?.displayDayOffsets ??
                        getRetentionDisplayDayOffsets(
                            retentionData?.maxDayOffset ?? 0,
                            retentionData?.range,
                        ),
                );
                return {
                    rows:
                        retentionData?.cohorts.flatMap((cohort) =>
                            cohort.values
                                .filter((cell) => exportOffsets.has(cell.dayOffset))
                                .map((cell) => ({
                                    cohortDate: cohort.cohortDate,
                                    cohortSize: cohort.cohortSize,
                                    dayOffset: cell.dayOffset,
                                    users: cell.users,
                                    pct: cell.pct,
                                }))
                        ) ?? [],
                    columns: [
                        { key: "cohortDate", header: "Cohort Date" },
                        { key: "cohortSize", header: "Cohort Size" },
                        { key: "dayOffset", header: "Day Offset" },
                        { key: "users", header: "Users" },
                        { key: "pct", header: "Retention (%)" },
                    ] as ExportColumn<ExportableRow>[],
                    json: retentionData,
                };
            }
            case "heatmap":
            case "embed":
                return {
                    rows: [] as ExportableRow[],
                    columns: [] as ExportColumn<ExportableRow>[],
                    json: null,
                };
        }
    }, [
        devicesQuery.data,
        engagementQuery.data,
        geographyQuery.data,
        journeysQuery.data,
        overviewQuery.data,
        pageviewsQuery.data,
        referrersQuery.data,
        retentionQuery.data,
        tab,
        visitsQuery.data,
        inactiveQueryAnchor,
    ]);

    const handleExportCSV = useCallback(() => {
        if (tab === "heatmap" && heatmapExport?.hasData) {
            heatmapExport.exportCSV();
            return;
        }
        if (!exportConfig.rows.length) return;
        exportCSV(
            exportConfig.rows as unknown as ExportableRow[],
            exportConfig.columns as unknown as ExportColumn<ExportableRow>[],
            exportFilename(`user-${tab}`, projectId, range, "csv")
        );
    }, [exportConfig, heatmapExport, projectId, range, tab]);

    const handleExportJSON = useCallback(() => {
        if (tab === "heatmap" && heatmapExport) {
            heatmapExport.exportJSON();
            return;
        }
        if (!exportConfig.json) return;
        exportJSON(
            exportConfig.json,
            exportFilename(`user-${tab}`, projectId, range, "json")
        );
    }, [exportConfig.json, heatmapExport, projectId, range, tab]);

    const setRange = (nextRange: UserAnalyticsRange) => {
        dispatch(
            setFilter({ page: "userAnalytics", key: "range", value: nextRange })
        );
    };

    const renderContent = () => {
        if (tab === "heatmap") {
            return (
                <ClickHeatmapSection
                    projectId={projectId}
                    range={range}
                    onRegisterExport={setHeatmapExport}
                />
            );
        }

        if (tab === "embed") {
            return <PublicEmbedBadgeSection projectId={projectId} />;
        }

        if (shouldShowQueryError(activeQuery)) {
            return (
                <div className="dashboard-panel p-10 text-center">
                    <p className="text-lg font-medium text-[color:var(--dash-text)]">
                        Unable to load {meta.title.toLowerCase()}
                    </p>
                    <p className="mt-2 text-sm text-[color:var(--dash-text-soft)]">
                        The user analytics endpoints are available, but this
                        project does not have readable data right now.
                    </p>
                    {"refetch" in activeQuery && activeQuery.refetch ? (
                        <button
                            type="button"
                            onClick={() => void activeQuery.refetch()}
                            className="mt-4 text-sm text-[color:var(--dash-blue)] hover:underline"
                        >
                            Try again
                        </button>
                    ) : null}
                </div>
            );
        }

        if (isQueryPending(activeQuery) && tab !== "journeys") {
            return <LoadingPanel />;
        }

        if (!activeQuery.data && tab !== "journeys") {
            return <LoadingPanel />;
        }

        if (tab === "overview") {
            const overview = overviewQuery.data!;
            const overviewChartAxis = getUserAnalyticsChartAxisProps(
                range,
                overview.timeseries,
            );
            return (
                <>
                    <div className={dashboardMetricGridFiveClass}>
                        <MetricCard
                            label="Pageviews"
                            value={formatNumber(
                                getMetricCurrent(overview.summary.pageviews)
                            )}
                            changePct={getMetricChangePct(
                                overview.summary.pageviews
                            )}
                        />
                        <MetricCard
                            label="Unique Visitors"
                            value={formatNumber(
                                getMetricCurrent(
                                    overview.summary.uniqueVisitors
                                )
                            )}
                            changePct={getMetricChangePct(
                                overview.summary.uniqueVisitors
                            )}
                        />
                        <MetricCard
                            label="Total Visits"
                            value={formatNumber(
                                getMetricCurrent(overview.summary.totalVisits)
                            )}
                            changePct={getMetricChangePct(
                                overview.summary.totalVisits
                            )}
                        />
                        <MetricCard
                            label="Avg Duration"
                            value={formatDuration(
                                getMetricCurrent(overview.summary.avgDurationMs)
                            )}
                            changePct={getMetricChangePct(
                                overview.summary.avgDurationMs
                            )}
                        />
                        <MetricCard
                            label="Bounce Rate"
                            value={formatPercent(
                                getMetricCurrent(overview.summary.bounceRate)
                            )}
                            changePct={getMetricChangePct(
                                overview.summary.bounceRate
                            )}
                            invert
                        />
                    </div>

                    <DashboardSection id="ua-overview-pageviews-over-time" as="div">
                    <Panel
                        title="Pageviews Over Time"
                        eyebrow="Current vs Previous Period"
                    >
                        <div className={dashboardChartHeight.tall}>
                            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                <AreaChart
                                    data={overview.timeseries}
                                    margin={{
                                        top: 10,
                                        right: 8,
                                        left: -16,
                                        bottom: 0,
                                    }}
                                >
                                    <defs>
                                        <linearGradient
                                            id="uaCurrent"
                                            x1="0"
                                            x2="0"
                                            y1="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor={CHART_PRIMARY}
                                                stopOpacity={0.18}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor={CHART_PRIMARY}
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                        <filter
                                            id="uaLineShadow"
                                            x="-12%"
                                            y="-20%"
                                            width="124%"
                                            height="160%"
                                        >
                                            <feDropShadow
                                                dx="0"
                                                dy="8"
                                                stdDeviation="5"
                                                floodColor="var(--dash-chart-primary)"
                                                floodOpacity="0.22"
                                            />
                                        </filter>
                                    </defs>
                                    <CartesianGrid
                                        stroke={CHART_GRID}
                                        vertical={false}
                                    />
                                    <XAxis
                                        dataKey="label"
                                        interval={overviewChartAxis.interval}
                                        minTickGap={overviewChartAxis.minTickGap}
                                        tickFormatter={overviewChartAxis.tickFormatter}
                                        tick={{
                                            fill: CHART_AXIS,
                                            fontSize: 11,
                                        }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        tick={{
                                            fill: CHART_AXIS,
                                            fontSize: 11,
                                        }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        content={<ChartTooltip />}
                                        cursor={{
                                            fill: "color-mix(in srgb, var(--dash-text) 10%, transparent)",
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="previous"
                                        name="Previous Period"
                                        stroke={CHART_LINE}
                                        fill="none"
                                        strokeWidth={2}
                                        strokeOpacity={0.34}
                                        dot={false}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="current"
                                        name="Current Period"
                                        stroke={CHART_PRIMARY}
                                        fill="url(#uaCurrent)"
                                        strokeWidth={2.5}
                                        dot={false}
                                        filter="url(#uaLineShadow)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Panel>
                    </DashboardSection>

                    <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2 [&>*]:min-w-0">
                        <DashboardSection
                            id="ua-overview-pages"
                            as="div"
                        >
                            <RankedMetricPanel
                                title="Pages"
                                tabs={[
                                    {
                                        id: "pages",
                                        label: "Pages",
                                        metricLabel: "Views",
                                        rows: topPageRows(overview.topPages),
                                    },
                                    {
                                        id: "visitors",
                                        label: "Visitors",
                                        metricLabel: "Visitors",
                                        rows: topPageRows(
                                            overview.topPages,
                                            "unique"
                                        ),
                                    },
                                ]}
                            />
                        </DashboardSection>

                        <DashboardSection
                            id="ua-overview-traffic-acquisition"
                            as="div"
                        >
                            <RankedMetricPanel
                                title="Traffic Acquisition"
                                tabs={[
                                    {
                                        id: "channels",
                                        label: "Channels",
                                        metricLabel: "Visits",
                                        rows: overview.channels.map((channel) => ({
                                            id: channel.label,
                                            label: channel.label,
                                            sublabel: formatPercent(channel.pct),
                                            value: formatNumber(channel.value),
                                            rawValue: channel.value,
                                            barPct: channel.pct,
                                        })),
                                    },
                                ]}
                            />
                        </DashboardSection>
                        <DashboardSection
                            id="ua-overview-environment"
                            as="div"
                        >
                            <RankedMetricPanel
                                title="Environment"
                                tabs={[
                                    {
                                        id: "devices",
                                        label: "Devices",
                                        metricLabel: "Share",
                                        rows: breakdownRows(
                                            overview.devices,
                                            "visits",
                                            {
                                                iconType: "device",
                                            }
                                        ),
                                    },
                                    {
                                        id: "browsers",
                                        label: "Browsers",
                                        metricLabel: "Share",
                                        rows: breakdownRows(
                                            overview.browsers,
                                            "visits",
                                            {
                                                iconType: "browser",
                                            }
                                        ),
                                    },
                                ]}
                            />
                        </DashboardSection>

                        <DashboardSection
                            id="ua-overview-countries"
                            as="div"
                        >
                            <RankedMetricPanel
                                title="Countries"
                                tabs={[
                                    {
                                        id: "countries",
                                        label: "Countries",
                                        metricLabel: "Visitors",
                                        rows: breakdownRows(
                                            overview.geography,
                                            "visitors",
                                            { countryFlags: true }
                                        ),
                                    },
                                ]}
                            />
                        </DashboardSection>
                    </div>
                </>
            );
        }

        if (tab === "pageviews") {
            const pageviews = pageviewsQuery.data!;
            const pageviewsChartAxis = getUserAnalyticsChartAxisProps(
                range,
                pageviews.timeseries,
            );
            return (
                <>
                    <DashboardSection id="ua-pageviews-summary" as="div">
                        <CompactMetricGrid>
                            <MetricCard
                                label="Total Pageviews"
                                value={formatNumber(
                                    getMetricCurrent(
                                        pageviews.summary.totalPageviews
                                    )
                                )}
                                changePct={getMetricChangePct(
                                    pageviews.summary.totalPageviews
                                )}
                            />
                            <MetricCard
                                label="Unique Visitors"
                                value={formatNumber(
                                    getMetricCurrent(
                                        pageviews.summary.uniqueVisitors
                                    )
                                )}
                                changePct={getMetricChangePct(
                                    pageviews.summary.uniqueVisitors
                                )}
                            />
                            <MetricCard
                                label="Avg Duration"
                                value={formatDuration(
                                    getMetricCurrent(
                                        pageviews.summary.avgDurationMs
                                    )
                                )}
                                changePct={getMetricChangePct(
                                    pageviews.summary.avgDurationMs
                                )}
                            />
                            <MetricCard
                                label="SPA Share"
                                value={formatPercent(
                                    getMetricCurrent(pageviews.summary.spaShare)
                                )}
                                changePct={getMetricChangePct(
                                    pageviews.summary.spaShare
                                )}
                            />
                        </CompactMetricGrid>
                    </DashboardSection>

                    <DashboardSection id="ua-pageviews-trend" as="div">
                        <Panel title="Pageview Trend" eyebrow="Current Period">
                            <div className={dashboardChartHeight.standard}>
                                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                    <AreaChart
                                        data={pageviews.timeseries}
                                        margin={{
                                            top: 10,
                                            right: 8,
                                            left: -16,
                                            bottom: 0,
                                        }}
                                    >
                                        <defs>
                                            <linearGradient
                                                id="uaPageviews"
                                                x1="0"
                                                x2="0"
                                                y1="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor={CHART_PRIMARY}
                                                    stopOpacity={0.18}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor={CHART_PRIMARY}
                                                    stopOpacity={0}
                                                />
                                            </linearGradient>
                                            <filter
                                                id="uaPageviewsShadow"
                                                x="-12%"
                                                y="-20%"
                                                width="124%"
                                                height="160%"
                                            >
                                                <feDropShadow
                                                    dx="0"
                                                    dy="8"
                                                    stdDeviation="5"
                                                    floodColor="var(--dash-chart-primary)"
                                                    floodOpacity="0.22"
                                                />
                                            </filter>
                                        </defs>
                                        <CartesianGrid
                                            stroke={CHART_GRID}
                                            vertical={false}
                                        />
                                        <XAxis
                                            dataKey="label"
                                            interval={pageviewsChartAxis.interval}
                                            minTickGap={pageviewsChartAxis.minTickGap}
                                            tickFormatter={pageviewsChartAxis.tickFormatter}
                                            tick={{
                                                fill: CHART_AXIS,
                                                fontSize: 11,
                                            }}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            tick={{
                                                fill: CHART_AXIS,
                                                fontSize: 11,
                                            }}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <Tooltip content={<ChartTooltip />} />
                                        <Area
                                            type="monotone"
                                            dataKey="pageviews"
                                            stroke={CHART_PRIMARY}
                                            fill="url(#uaPageviews)"
                                            strokeWidth={2.5}
                                            dot={false}
                                            filter="url(#uaPageviewsShadow)"
                                            name="Pageviews"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Panel>
                    </DashboardSection>

                    <div className="grid items-stretch gap-5 lg:grid-cols-2">
                        <DashboardSection id="ua-pageviews-recent-pageviews" as="div">
                            <RankedMetricPanel
                                title="Recent Pageviews"
                                tabs={[
                                    {
                                        id: "recent-pageviews",
                                        label: "Recent",
                                        secondaryMetricLabel: "Scroll",
                                        metricLabel: "Duration",
                                        rows: buildPageviewEventRows(
                                            pageviews.recentPageviews
                                        ),
                                        emptyText:
                                            "No recent pageviews available for this range.",
                                    },
                                ]}
                                barMode="none"
                                className="min-h-[260px] sm:min-h-[320px]"
                            />
                        </DashboardSection>

                        <DashboardSection id="ua-pageviews-pages" as="div">
                            <RankedMetricPanel
                                title="Pages"
                                tabs={[
                                    {
                                        id: "pages",
                                        label: "Pages",
                                        metricLabel: "Views",
                                        rows: topPageRows(pageviews.pages),
                                    },
                                    {
                                        id: "visitors",
                                        label: "Visitors",
                                        metricLabel: "Visitors",
                                        rows: topPageRows(
                                            pageviews.pages,
                                            "unique"
                                        ),
                                    },
                                    {
                                        id: "spa",
                                        label: "SPA",
                                        metricLabel: "Views",
                                        rows: pageviews.pages.map((page) => ({
                                            id: `${page.path}-spa`,
                                            label: page.path,
                                            sublabel: `${formatNumber(page.loadViews)} load views`,
                                            value: formatNumber(page.spaViews),
                                            rawValue: page.spaViews,
                                        })),
                                    },
                                ]}
                                className="min-h-[260px] sm:min-h-[320px]"
                            />
                        </DashboardSection>
                    </div>
                </>
            );
        }

        if (tab === "visits") {
            const visits = visitsQuery.data!;
            const visitsChartAxis = getUserAnalyticsChartAxisProps(
                range,
                visits.timeseries,
            );
            return (
                <>
                    <DashboardSection id="ua-visits-summary" as="div" className={dashboardMetricGridFiveClass}>
                        <MetricCard
                            label="Total Visits"
                            value={formatNumber(
                                getMetricCurrent(visits.summary.totalVisits)
                            )}
                            changePct={getMetricChangePct(
                                visits.summary.totalVisits
                            )}
                        />
                        <MetricCard
                            label="Unique Visitors"
                            value={formatNumber(
                                getMetricCurrent(visits.summary.uniqueVisitors)
                            )}
                            changePct={getMetricChangePct(
                                visits.summary.uniqueVisitors
                            )}
                        />
                        <MetricCard
                            label="Avg Duration"
                            value={formatDuration(
                                getMetricCurrent(visits.summary.avgDurationMs)
                            )}
                            changePct={getMetricChangePct(
                                visits.summary.avgDurationMs
                            )}
                        />
                        <MetricCard
                            label="Pages / Visit"
                            value={formatDecimal(
                                getMetricCurrent(
                                    visits.summary.avgPagesPerVisit
                                )
                            )}
                            changePct={getMetricChangePct(
                                visits.summary.avgPagesPerVisit
                            )}
                        />
                        <MetricCard
                            label="Bounce Rate"
                            value={formatPercent(
                                getMetricCurrent(visits.summary.bounceRate)
                            )}
                            changePct={getMetricChangePct(
                                visits.summary.bounceRate
                            )}
                            invert
                        />
                    </DashboardSection>

                    <DashboardSection id="ua-visits-volume" as="div">
                    <Panel title="Visit Volume" eyebrow="Sessions Over Time">
                        <div className={dashboardChartHeight.standard}>
                            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                <BarChart
                                    data={visits.timeseries}
                                    margin={{
                                        top: 10,
                                        right: 8,
                                        left: -16,
                                        bottom: 0,
                                    }}
                                >
                                    <CartesianGrid
                                        stroke={CHART_GRID}
                                        vertical={false}
                                    />
                                    <XAxis
                                        dataKey="label"
                                        interval={visitsChartAxis.interval}
                                        minTickGap={visitsChartAxis.minTickGap}
                                        tickFormatter={visitsChartAxis.tickFormatter}
                                        tick={{
                                            fill: CHART_AXIS,
                                            fontSize: 11,
                                        }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        tick={{
                                            fill: CHART_AXIS,
                                            fontSize: 11,
                                        }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        content={<ChartTooltip />}
                                        cursor={{
                                            fill: "color-mix(in srgb, var(--dash-bg-subtle) 78%, var(--dash-text) 22%)",
                                            fillOpacity: 0.72,
                                        }}
                                    />
                                    <Bar
                                        dataKey="visits"
                                        radius={[6, 6, 0, 0]}
                                        fill={CHART_PRIMARY_SOFT}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Panel>
                    </DashboardSection>

                    <DashboardSection id="ua-visits-latest-visits" as="div">
                        <LatestVisitsTable visits={visits.visits} />
                    </DashboardSection>
                </>
            );
        }

        if (tab === "journeys") {
            const hasJourneyNodes = journeyDisplayColumns.some(
                (column) => column.nodes.length > 0
            );
            const hasJourneyFilters = !!journeyStartPath;

            return (
                <>
                    <DashboardSection
                        id="ua-journeys-summary"
                        as="div"
                        className={dashboardMetricGridFourClass}
                    >
                        <JourneyStatCell
                            label="Total Visits"
                            value={formatNumber(journeySummary?.totalVisits ?? 0)}
                        />
                        <JourneyStatCell
                            label="Avg Steps"
                            value={formatNumber(journeySummary?.avgSteps ?? 0)}
                        />
                        <JourneyStatCell
                            label="Top Entry"
                            value={journeySummary?.topEntryPath ?? "-"}
                            mono
                        />
                        <JourneyStatCell
                            label="Top Exit"
                            value={journeySummary?.topExitPath ?? "-"}
                            mono
                        />
                    </DashboardSection>

                    <DashboardSection id="ua-journeys-flow" as="div">
                        <Panel
                            title="User Journey"
                            eyebrow="Route Journey"
                            className="overflow-visible"
                            headerAction={
                                <div
                                    className="relative w-full sm:w-[360px]"
                                    onBlur={() => {
                                        window.setTimeout(
                                            () => setJourneyRouteSearchOpen(false),
                                            120
                                        );
                                    }}
                                >
                                    <div className="flex min-w-0 items-center gap-2 rounded-lg border border-[color:var(--dash-divider)] bg-[color:var(--dash-input-bg)] px-3 py-1.5 transition-colors focus-within:border-[color:var(--dash-blue)] focus-within:bg-[color:var(--dash-surface)]">
                                        <input
                                            type="search"
                                            spellCheck={false}
                                            value={journeyStartInput}
                                            placeholder="Search route path"
                                            onFocus={() => setJourneyRouteSearchOpen(true)}
                                            onChange={(event) => {
                                                setJourneyStartInput(event.target.value);
                                                setJourneyRouteSearchOpen(true);
                                            }}
                                            onKeyDown={(event) => {
                                                if (event.key === "Escape") {
                                                    setJourneyRouteSearchOpen(false);
                                                    return;
                                                }
                                                if (event.key === "Enter") {
                                                    event.preventDefault();
                                                    const nextPath =
                                                        filteredJourneyRouteSuggestions[0] ??
                                                        journeyStartInput.trim();
                                                    if (nextPath) {
                                                        applyJourneyStartPath(nextPath);
                                                    }
                                                }
                                            }}
                                            className="min-w-0 flex-1 bg-transparent text-sm text-[color:var(--dash-text)] placeholder:text-[color:var(--dash-text-muted)] focus:outline-none"
                                        />
                                        {journeyStartPath ? (
                                            <button
                                                type="button"
                                                onMouseDown={(event) => {
                                                    event.preventDefault();
                                                    clearJourneyStartPath();
                                                }}
                                                className="shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-medium text-[color:var(--dash-blue)] transition hover:bg-[color:var(--dash-blue-soft)]"
                                            >
                                                Clear
                                            </button>
                                        ) : null}
                                    </div>
                                    {journeyRouteSearchOpen &&
                                    filteredJourneyRouteSuggestions.length ? (
                                        <div className="dashboard-menu absolute right-0 top-full z-[500] mt-2 max-h-64 w-full overflow-y-auto p-1">
                                            {filteredJourneyRouteSuggestions.map((path) => (
                                                <button
                                                    key={path}
                                                    type="button"
                                                    onMouseDown={(event) => {
                                                        event.preventDefault();
                                                        applyJourneyStartPath(path);
                                                    }}
                                                    className="flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-xs text-[color:var(--dash-text-soft)] transition hover:bg-[color:var(--dash-surface-hover)] hover:text-[color:var(--dash-text)]"
                                                >
                                                    <span className="min-w-0 truncate font-mono">
                                                        {path}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>
                            }
                        >
                            <div className="flex flex-col gap-5">
                                {journeysQuery.isFetching ? (
                                    <div className="inline-flex self-start items-center gap-1.5 rounded-md bg-[color:var(--dash-bg-subtle)] px-2.5 py-1.5 text-[11px] text-[color:var(--dash-text-muted)]">
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                        Updating routes
                                    </div>
                                ) : null}
                                {selectedJourneyKey || selectedJourneySequenceKey ? (
                                    <p className="text-[11px] text-[color:var(--dash-text-muted)]">
                                        {selectedJourneySequenceKey ? (
                                            <>
                                                Highlighting selected journey. Press{" "}
                                            </>
                                        ) : (
                                            <>
                                                Highlighting paths through{" "}
                                                <span className="font-medium text-[color:var(--dash-text)]">
                                                    {journeySelection?.path}
                                                </span>{" "}
                                                at step {journeySelection?.step}. Press{" "}
                                            </>
                                        )}
                                        <kbd className="rounded border border-[color:var(--dash-border)] bg-[color:var(--dash-bg-subtle)] px-1.5 py-0.5 text-[10px] font-medium text-[color:var(--dash-text-soft)]">
                                            Esc
                                        </kbd>{" "}
                                        or click again to clear.
                                    </p>
                                ) : null}
                                {hasJourneyNodes ? (
                                    <div className="-mx-1 overflow-x-auto rounded-xl border border-[color:var(--dash-divider)] bg-[color:var(--dash-bg)] px-2 py-4 sm:px-4">
                                        <div className="flex min-w-max justify-center">
                                            <div
                                                className="relative mx-auto"
                                                style={{
                                                    width: Math.max(
                                                        journeyFlowDimensions.flowWidth,
                                                        JOURNEY_CARD_WIDTH * 2
                                                    ),
                                                    height:
                                                        Math.max(
                                                            journeyFlowDimensions.flowHeight ||
                                                                JOURNEY_HEADER_HEIGHT,
                                                            JOURNEY_FLOW_MIN_HEIGHT
                                                        ),
                                                }}
                                            >
                                            <svg
                                                className="pointer-events-none absolute inset-0 h-full w-full"
                                                width={
                                                    journeyFlowDimensions.flowWidth
                                                }
                                                height={
                                                    journeyFlowDimensions.flowHeight
                                                }
                                                aria-hidden="true"
                                            >
                                                {allJourneyEdges.map((edge) => {
                                                    const isHighlighted =
                                                        highlightedJourneyEdgeIds.has(
                                                            edge.id
                                                        );
                                                    if (!isHighlighted) {
                                                        return null;
                                                    }
                                                    const x1 =
                                                        edge.columnIndex *
                                                            (JOURNEY_CARD_WIDTH +
                                                                JOURNEY_CONNECTOR_GAP) +
                                                        JOURNEY_CARD_WIDTH;
                                                    const x2 =
                                                        x1 + JOURNEY_CONNECTOR_GAP;
                                                    const y1 =
                                                        JOURNEY_HEADER_HEIGHT +
                                                        edge.fromRow *
                                                            (JOURNEY_NODE_HEIGHT +
                                                                JOURNEY_NODE_GAP) +
                                                        JOURNEY_NODE_HEIGHT / 2;
                                                    const y2 =
                                                        JOURNEY_HEADER_HEIGHT +
                                                        edge.toRow *
                                                            (JOURNEY_NODE_HEIGHT +
                                                                JOURNEY_NODE_GAP) +
                                                        JOURNEY_NODE_HEIGHT / 2;
                                                    const handle =
                                                        JOURNEY_CONNECTOR_GAP * 0.55;
                                                    return (
                                                        <path
                                                            key={edge.id}
                                                            d={`M ${x1} ${y1} C ${x1 + handle} ${y1}, ${x2 - handle} ${y2}, ${x2} ${y2}`}
                                                            fill="none"
                                                            stroke="var(--dash-blue)"
                                                            strokeWidth={2.5}
                                                            strokeLinecap="round"
                                                            opacity={0.9}
                                                        />
                                                    );
                                                })}
                                            </svg>

                                            {journeyDisplayColumns.map(
                                                (
                                                    column: UserAnalyticsJourneysResponse["columns"][number],
                                                    index: number
                                                ) => {
                                                    const previousColumnVisits =
                                                        index > 0
                                                            ? journeyDisplayColumns[
                                                                  index - 1
                                                              ]?.totalVisits ?? 0
                                                            : 0;
                                                    const dropOffPct =
                                                        index > 0 &&
                                                        previousColumnVisits > 0
                                                            ? Math.max(
                                                                  0,
                                                                  Math.round(
                                                                      ((previousColumnVisits -
                                                                          column.totalVisits) /
                                                                          previousColumnVisits) *
                                                                          100
                                                                  )
                                                              )
                                                            : null;

                                                    return (
                                                        <div
                                                            key={column.step}
                                                            className="absolute top-0"
                                                            style={{
                                                                left:
                                                                    index *
                                                                    (JOURNEY_CARD_WIDTH +
                                                                        JOURNEY_CONNECTOR_GAP),
                                                                width: JOURNEY_CARD_WIDTH,
                                                            }}
                                                        >
                                                            <div
                                                                className="flex flex-col items-center justify-center gap-2 px-3 text-center"
                                                                style={{
                                                                    height: JOURNEY_HEADER_HEIGHT,
                                                                }}
                                                            >
                                                                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--dash-text-muted)]">
                                                                    Step{' '}
                                                                    <span className="tabular-nums text-[color:var(--dash-blue)]">
                                                                        {column.step}
                                                                    </span>
                                                                </p>
                                                                <div className="flex items-baseline gap-1.5">
                                                                    <span className="text-[26px] font-semibold leading-none tracking-tight tabular-nums text-[color:var(--dash-text)]">
                                                                        {formatJourneyVisitors(
                                                                            column.totalVisits
                                                                        )}
                                                                    </span>
                                                                    <span className="text-[11px] font-medium text-[color:var(--dash-text-muted)]">
                                                                        visitors
                                                                    </span>
                                                                </div>
                                                                {dropOffPct != null ? (
                                                                    <span className="text-[10px] font-medium tabular-nums text-[color:var(--dash-text-muted)]">
                                                                        <span className="text-[color:var(--dash-danger)]">−{dropOffPct}%</span> vs prior step
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-[10px] font-medium text-[color:var(--dash-text-muted)]">
                                                                        entry step
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {column.nodes.length ? (
                                                                column.nodes.map(
                                                                    (
                                                                        node: UserAnalyticsJourneysResponse["columns"][number]["nodes"][number],
                                                                        rowIndex: number
                                                                    ) => {
                                                                        const nodeKey = `${column.step}:${node.path}`;
                                                                        const isSelected =
                                                                            selectedJourneyKey === nodeKey;
                                                                        const isConnected =
                                                                            !isSelected &&
                                                                            highlightedJourneyKeys.has(
                                                                                nodeKey
                                                                            );
                                                                        const isFaded =
                                                                            selectedJourneyKey != null &&
                                                                            !isSelected &&
                                                                            !isConnected;
                                                                        const showShare =
                                                                            column.step === 1;
                                                                        return (
                                                                            <button
                                                                                key={nodeKey}
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    setSelectedJourneySequenceKey(
                                                                                        null,
                                                                                    );
                                                                                    setJourneySelection(
                                                                                        isSelected
                                                                                            ? null
                                                                                            : {
                                                                                                  step: column.step,
                                                                                                  path: node.path,
                                                                                              },
                                                                                    );
                                                                                }}
                                                                                title={`${node.path}\n${formatNumber(node.visits)} visitors\n${formatPercent(node.sharePct)} of step · ${formatPercent(node.dropoffPct)} drop-off`}
                                                                                className={`group absolute flex w-full items-center gap-2.5 rounded-[12px] border px-3.5 py-2.5 text-left transition-[transform,box-shadow,opacity,border-color,background-color,color] duration-150 ${
                                                                                    isSelected
                                                                                        ? "dashboard-button-primary !rounded-[12px] z-[2] border-transparent text-[color:var(--dash-text-on-accent)] !shadow-[0_10px_24px_rgba(39,95,200,0.28)]"
                                                                                        : isConnected
                                                                                          ? "dashboard-button-primary !rounded-[12px] z-[1] border-transparent text-[color:var(--dash-text-on-accent)] !shadow-none"
                                                                                          : isFaded
                                                                                            ? "z-0 border-[color:var(--dash-divider)] bg-[color:var(--dash-surface)] text-[color:var(--dash-text-soft)] opacity-50"
                                                                                            : "z-0 border-[color:var(--dash-divider)] bg-[color:var(--dash-surface)] text-[color:var(--dash-text)] hover:-translate-y-px hover:border-[color:var(--dash-border-strong)] hover:bg-[color:var(--dash-surface-hover)] hover:shadow-[0_4px_12px_rgba(15,23,42,0.06)]"
                                                                                }`}
                                                                                style={{
                                                                                    top:
                                                                                        JOURNEY_HEADER_HEIGHT +
                                                                                        rowIndex *
                                                                                            (JOURNEY_NODE_HEIGHT +
                                                                                                JOURNEY_NODE_GAP),
                                                                                    height: JOURNEY_NODE_HEIGHT,
                                                                                }}
                                                                            >
                                                                                <span
                                                                                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
                                                                                        isSelected || isConnected
                                                                                            ? "bg-[color:rgba(255,255,255,0.18)] text-[color:var(--dash-text-on-accent)]"
                                                                                            : "bg-[color:var(--dash-bg-subtle)] text-[color:var(--dash-text-soft)]"
                                                                                    }`}
                                                                                >
                                                                                    <FileText className="h-3.5 w-3.5" />
                                                                                </span>
                                                                                <div className="min-w-0 flex-1">
                                                                                    <div className="truncate text-[13px] font-semibold leading-snug">
                                                                                        {node.path}
                                                                                    </div>
                                                                                    <div
                                                                                        className={`mt-0.5 truncate text-[10px] font-medium tabular-nums ${
                                                                                            isSelected || isConnected
                                                                                                ? "text-[color:rgba(255,255,255,0.85)]"
                                                                                                : "text-[color:var(--dash-text-muted)]"
                                                                                        }`}
                                                                                    >
                                                                                        {showShare
                                                                                            ? `${formatPercent(node.sharePct)} of visitors at this step`
                                                                                            : `${formatPercent(node.continuationPct)} continue · ${formatPercent(node.dropoffPct)} drop-off`}
                                                                                    </div>
                                                                                </div>
                                                                                <span
                                                                                    className={`shrink-0 rounded-md px-2 py-1 text-[11px] font-semibold tabular-nums tracking-tight ${
                                                                                        isSelected || isConnected
                                                                                            ? "bg-[color:rgba(255,255,255,0.2)] text-[color:var(--dash-text-on-accent)]"
                                                                                            : "bg-[color:var(--dash-bg-subtle)] text-[color:var(--dash-text-soft)]"
                                                                                    }`}
                                                                                >
                                                                                    {formatJourneyVisitors(
                                                                                        node.visits
                                                                                    )}
                                                                                </span>
                                                                            </button>
                                                                        );
                                                                    }
                                                                )
                                                            ) : (
                                                                <div
                                                                    className="rounded-md border border-dashed border-[color:var(--dash-border)] px-3 py-6 text-center text-xs text-[color:var(--dash-text-muted)]"
                                                                    style={{
                                                                        position: "absolute",
                                                                        top: JOURNEY_HEADER_HEIGHT,
                                                                        width: "100%",
                                                                    }}
                                                                >
                                                                    No routes
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                }
                                            )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-xl border border-dashed border-[color:var(--dash-border)] px-6 py-16 text-center text-sm text-[color:var(--dash-text-soft)]">
                                        No journey paths found for this range.
                                    </div>
                                )}
                            </div>
                        </Panel>
                    </DashboardSection>

                    <DashboardSection id="ua-journeys-paths" as="div">
                        <Panel
                            title="Top Journey Paths"
                            eyebrow="Click To Highlight"
                            bodyClassName="!pt-0"
                        >
                            {journeySequenceRows.length ? (
                                <ul className="divide-y divide-[color:var(--dash-divider)]">
                                    {journeySequenceRows
                                        .slice(0, 12)
                                        .map((row, index) => {
                                            const firstPath = row.paths[0];
                                            const sequenceKey =
                                                getJourneySequenceKey(row.paths);
                                            const routeSummary =
                                                getJourneyRouteSummary(row.paths);
                                            const isHighlighted =
                                                selectedJourneySequenceKey ===
                                                sequenceKey;
                                            const handleClick = () => {
                                                if (!firstPath) return;
                                                if (isHighlighted) {
                                                    setJourneySelection(null);
                                                    setSelectedJourneySequenceKey(
                                                        null,
                                                    );
                                                } else {
                                                    setSelectedJourneySequenceKey(
                                                        sequenceKey,
                                                    );
                                                    setJourneySelection({
                                                        step: 1,
                                                        path: firstPath,
                                                    });
                                                }
                                            };
                                            return (
                                                <li
                                                    key={sequenceKey}
                                                    className={`flex min-h-[52px] items-center justify-between gap-3 -mx-4 px-4 py-2.5 transition-[background-color] duration-150 sm:-mx-5 sm:px-5 ${
                                                        isHighlighted
                                                            ? "bg-[color:var(--dash-blue-soft)]"
                                                            : "bg-transparent"
                                                    }`}
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={handleClick}
                                                        className="min-w-0 flex-1 text-left"
                                                    >
                                                        <JourneyPathBreadcrumb
                                                            paths={row.paths}
                                                        />
                                                        <p className="mt-1 text-[11px] text-[color:var(--dash-text-muted)]">
                                                            {routeSummary.stepCount}{" "}
                                                            {routeSummary.stepCount === 1
                                                                ? "page"
                                                                : "pages"}
                                                            <span className="mx-1.5 text-[color:var(--dash-divider)]">
                                                                ·
                                                            </span>
                                                            <span className="tabular-nums text-[color:var(--dash-text-soft)]">
                                                                {formatNumber(
                                                                    row.currentVisits
                                                                )}{" "}
                                                                visits
                                                            </span>
                                                            <span className="mx-1.5 text-[color:var(--dash-divider)]">
                                                                ·
                                                            </span>
                                                            <span className="tabular-nums">
                                                                {formatPercent(
                                                                    row.sharePct
                                                                )}{" "}
                                                                share
                                                            </span>
                                                            {row.changePct != null ? (
                                                                <>
                                                                    <span className="mx-1.5 text-[color:var(--dash-divider)]">
                                                                        ·
                                                                    </span>
                                                                    <span
                                                                        className={`tabular-nums ${
                                                                            row.changePct > 0
                                                                                ? "text-[color:var(--dash-success)]"
                                                                                : row.changePct < 0
                                                                                  ? "text-[color:var(--dash-danger)]"
                                                                                  : "text-[color:var(--dash-text-soft)]"
                                                                        }`}
                                                                    >
                                                                        {row.changePct > 0
                                                                            ? "+"
                                                                            : ""}
                                                                        {row.changePct.toFixed(
                                                                            1
                                                                        )}
                                                                        %
                                                                    </span>
                                                                </>
                                                            ) : null}
                                                        </p>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setJourneyDetailRow(row)
                                                        }
                                                        className="shrink-0 self-center text-[11px] font-medium text-[color:var(--dash-blue)] transition hover:text-[color:var(--dash-blue-hover)]"
                                                    >
                                                        View route
                                                    </button>
                                                </li>
                                            );
                                        })}
                                </ul>
                            ) : (
                                <div className="rounded-xl border border-dashed border-[color:var(--dash-border)] px-6 py-10 text-center text-[12px] text-[color:var(--dash-text-soft)]">
                                    No journey paths found for this range.
                                </div>
                            )}
                        </Panel>
                    </DashboardSection>

                    {journeyDetailRow ? (
                        <JourneyPathDetailModal
                            row={journeyDetailRow}
                            onClose={() => setJourneyDetailRow(null)}
                        />
                    ) : null}
                </>
            );
        }

        if (tab === "geography") {
            const geography = geographyQuery.data!;
            return (
                <>
                    <DashboardSection
                        id="ua-geography-summary"
                        as="div"
                        className={dashboardMetricGridFourClass}
                    >
                        <JourneyStatCell
                            label="Countries"
                            value={formatNumber(
                                getMetricCurrent(
                                    geography.summary.totalCountries
                                )
                            )}
                        />
                        <JourneyStatCell
                            label="Regions"
                            value={formatNumber(
                                getMetricCurrent(geography.summary.totalRegions)
                            )}
                        />
                        <JourneyStatCell
                            label="Cities"
                            value={formatNumber(
                                getMetricCurrent(geography.summary.totalCities)
                            )}
                        />
                        <JourneyStatCell
                            label="Top Country"
                            textual
                            value={
                                <CountryLabel
                                    country={geography.summary.topCountry}
                                />
                            }
                        />
                    </DashboardSection>

                    <DashboardSection id="ua-geography-heatmap" as="div">
                        <GeographyHeatmap projectId={projectId} embedded />
                    </DashboardSection>

                    <div className="grid items-stretch gap-5 lg:grid-cols-2">
                        <DashboardSection id="ua-geography-locations" as="div">
                        <RankedMetricPanel
                            title="Locations"
                            tabs={[
                                {
                                    id: "countries",
                                    label: "Countries",
                                    count:
                                        getMetricCurrent(
                                            geography.summary.totalCountries
                                        ) ?? 0,
                                    metricLabel: "Visitors",
                                    rows: breakdownRows(
                                        geography.countries,
                                        "visitors",
                                        { countryFlags: true }
                                    ),
                                },
                                {
                                    id: "regions",
                                    label: "Regions",
                                    count:
                                        getMetricCurrent(
                                            geography.summary.totalRegions
                                        ) ?? 0,
                                    metricLabel: "Visits",
                                    rows: geography.regions.map((region) => ({
                                        id: `${region.country}-${region.label}`,
                                        label: (
                                            <span className="inline-flex items-center gap-2">
                                                <CountryFlagOnly
                                                    country={region.country}
                                                />
                                                <span className="truncate">
                                                    {region.label}
                                                </span>
                                            </span>
                                        ),
                                        sublabel: region.country
                                            ? normalizeCountryDisplayName(
                                                  region.country
                                              )
                                            : "Unknown country",
                                        value: formatNumber(region.value),
                                        rawValue: region.value,
                                        barPct: region.pct,
                                    })),
                                    emptyText:
                                        "No regional data for this range.",
                                },
                                {
                                    id: "cities",
                                    label: "Cities",
                                    count:
                                        getMetricCurrent(
                                            geography.summary.totalCities
                                        ) ?? 0,
                                    metricLabel: "Visits",
                                    rows: geography.cities.map((city) => ({
                                        id: `${city.country}-${city.region}-${city.label}`,
                                        label: (
                                            <span className="inline-flex items-center gap-2">
                                                <CountryFlagOnly
                                                    country={city.country}
                                                />
                                                <span className="truncate">
                                                    {city.label}
                                                </span>
                                            </span>
                                        ),
                                        sublabel: (
                                            <span className="inline-flex flex-wrap items-center gap-1.5">
                                                {city.region ? (
                                                    <span>{city.region}</span>
                                                ) : null}
                                                {city.country ? (
                                                    <span>
                                                        {city.region ? "• " : ""}
                                                        {normalizeCountryDisplayName(
                                                            city.country
                                                        )}
                                                    </span>
                                                ) : null}
                                                {!city.region &&
                                                !city.country ? (
                                                    <span>
                                                        Unknown location
                                                    </span>
                                                ) : null}
                                            </span>
                                        ),
                                        value: formatNumber(city.value),
                                        rawValue: city.value,
                                        barPct: city.pct,
                                    })),
                                    emptyText: "No city data for this range.",
                                },
                            ]}
                        />
                        </DashboardSection>

                        <DashboardSection id="ua-geography-context" as="div">
                        <RankedMetricPanel
                            title="Context"
                            tabs={[
                                {
                                    id: "timezones",
                                    label: "Timezones",
                                    metricLabel: "Pageviews",
                                    rows: breakdownRows(
                                        geography.timezones,
                                        "pageviews"
                                    ),
                                },
                                {
                                    id: "languages",
                                    label: "Languages",
                                    metricLabel: "Pageviews",
                                    rows: breakdownRows(
                                        geography.languages,
                                        "pageviews",
                                        { labelFormatter: formatLocaleName }
                                    ),
                                },
                            ]}
                        />
                        </DashboardSection>
                    </div>
                </>
            );
        }

        if (tab === "devices") {
            const devices = devicesQuery.data!;
            return (
                <>
                    <DashboardSection id="ua-devices-insights" as="div">
                    <InsightRail
                        items={[
                            {
                                icon: Monitor,
                                label: "Top Device",
                                value: (
                                    <DeviceLabel
                                        value={devices.summary.topDevice}
                                    />
                                ),
                            },
                            {
                                icon: Globe,
                                label: "Top Browser",
                                value: (
                                    <BrowserLabel
                                        value={devices.summary.topBrowser}
                                    />
                                ),
                            },
                            {
                                icon: LayoutGrid,
                                label: "Top OS",
                                value: (
                                    <OSLabel value={devices.summary.topOs} />
                                ),
                            },
                            {
                                icon: MapPin,
                                label: "Screen Sizes",
                                value: formatNumber(devices.screenSizes.length),
                            },
                        ]}
                    />
                    </DashboardSection>

                    <div className="grid items-stretch gap-5 xl:grid-cols-2">
                        <DashboardSection id="ua-devices-environment" as="div">
                        <RankedMetricPanel
                            title="Environment"
                            tabs={[
                                {
                                    id: "devices",
                                    label: "Devices",
                                    metricLabel: "Share",
                                    rows: breakdownRows(
                                        devices.devices,
                                        "visits",
                                        {
                                            iconType: "device",
                                        }
                                    ),
                                },
                                {
                                    id: "browsers",
                                    label: "Browsers",
                                    metricLabel: "Share",
                                    rows: breakdownRows(
                                        devices.browsers,
                                        "visits",
                                        {
                                            iconType: "browser",
                                        }
                                    ),
                                },
                                {
                                    id: "operating-systems",
                                    label: "Operating Systems",
                                    metricLabel: "Share",
                                    rows: breakdownRows(
                                        devices.operatingSystems,
                                        "visits",
                                        {
                                            iconType: "os",
                                        }
                                    ),
                                },
                            ]}
                        />
                        </DashboardSection>

                        <DashboardSection id="ua-devices-screen-sizes" as="div">
                        <RankedMetricPanel
                            title="Top Screen Sizes"
                            tabs={[
                                {
                                    id: "screen-sizes",
                                    label: "Resolution",
                                    metricLabel: "Pageviews",
                                    rows: devices.screenSizes.map((row) => ({
                                        id: row.label,
                                        label: row.label,
                                        sublabel: formatPercent(row.pct),
                                        value: formatNumber(row.value),
                                        rawValue: row.value,
                                        barPct: row.pct,
                                    })),
                                },
                            ]}
                        />
                        </DashboardSection>
                    </div>
                </>
            );
        }

        if (tab === "referrers") {
            const referrers = referrersQuery.data!;
            return (
                <>
                    <DashboardSection id="ua-referrers-summary" as="div" className={dashboardMetricGridThreeClass}>
                        <MetricCard
                            label="Direct Visits"
                            value={formatNumber(
                                getMetricCurrent(referrers.summary.directVisits)
                            )}
                            changePct={getMetricChangePct(
                                referrers.summary.directVisits
                            )}
                        />
                        <MetricCard
                            label="Attributed Visits"
                            value={formatNumber(
                                getMetricCurrent(
                                    referrers.summary.attributedVisits
                                )
                            )}
                            changePct={getMetricChangePct(
                                referrers.summary.attributedVisits
                            )}
                        />
                        <MetricCard
                            label="Campaign Visits"
                            value={formatNumber(
                                getMetricCurrent(
                                    referrers.summary.campaignVisits
                                )
                            )}
                            changePct={getMetricChangePct(
                                referrers.summary.campaignVisits
                            )}
                        />
                    </DashboardSection>

                    <div className="grid items-stretch gap-5 xl:grid-cols-2">
                        <DashboardSection id="ua-referrers-sources" as="div">
                        <RankedMetricPanel
                            title="Sources"
                            tabs={[
                                {
                                    id: "referrers",
                                    label: "Referrers",
                                    metricLabel: "Visitors",
                                    rows: referrers.referrers.map((row) => ({
                                        id: row.label,
                                        label: (
                                            <DomainTextLabel
                                                value={row.label}
                                                fallback="Direct"
                                            />
                                        ),
                                        sublabel: `${formatNumber(row.value)} visits`,
                                        value: formatNumber(row.uniqueVisitors),
                                        rawValue: row.uniqueVisitors,
                                        barPct: row.pct,
                                    })),
                                },
                                {
                                    id: "channels",
                                    label: "Channels",
                                    metricLabel: "Visits",
                                    rows: breakdownRows(referrers.channels),
                                },
                            ]}
                        />
                        </DashboardSection>

                        <DashboardSection id="ua-referrers-attribution" as="div">
                        <RankedMetricPanel
                            title="Attribution"
                            tabs={[
                                {
                                    id: "utm",
                                    label: "UTM Parameters",
                                    metricLabel: "Visitors",
                                    rows: referrers.campaigns.map(
                                        (campaign) => ({
                                            id: `${campaign.source}-${campaign.medium}-${campaign.campaign}`,
                                            label:
                                                campaign.campaign ? (
                                                    campaign.campaign
                                                ) : (
                                                    <DomainTextLabel
                                                        value={campaign.source}
                                                    />
                                                ),
                                            sublabel:
                                                [
                                                    campaign.source,
                                                    campaign.medium,
                                                ]
                                                    .filter(Boolean)
                                                    .join(" / ") ||
                                                "Unlabeled campaign",
                                            value: formatNumber(
                                                campaign.uniqueVisitors
                                            ),
                                            rawValue: campaign.uniqueVisitors,
                                        })
                                    ),
                                },
                                {
                                    id: "click-ids",
                                    label: "Click IDs",
                                    metricLabel: "Pageviews",
                                    rows: breakdownRows(
                                        referrers.clickIds,
                                        "pageviews"
                                    ),
                                },
                            ]}
                        />
                        </DashboardSection>
                    </div>
                </>
            );
        }

        if (tab === "retention") {
            const retention = retentionQuery.data!;
            const summaryMetrics = getRetentionSummaryMetrics(range, retention.summary);
            const summaryGridClass =
                summaryMetrics.length >= 4
                    ? dashboardMetricGridFourClass
                    : dashboardMetricGridThreeClass;

            return (
                <>
                    <DashboardSection id="ua-retention-summary" as="div" className={summaryGridClass}>
                        {summaryMetrics.map((metric) => (
                            <MetricCard
                                key={metric.label}
                                label={metric.label}
                                value={
                                    metric.kind === "count"
                                        ? formatNumber(metric.value)
                                        : formatPercent(metric.value)
                                }
                                changePct={null}
                            />
                        ))}
                    </DashboardSection>

                    <DashboardSection id="ua-retention-grid" as="div">
                        <RetentionHeatmap data={retention} />
                    </DashboardSection>
                </>
            );
        }

        const engagement = engagementQuery.data!;
        return (
            <>
                <DashboardSection id="ua-engagement-summary" as="div" className={dashboardMetricGridFiveClass}>
                    <MetricCard
                        label="Avg Scroll"
                        value={formatPercent(
                            getMetricCurrent(
                                engagement.summary.avgScrollPercentage
                            )
                        )}
                        changePct={getMetricChangePct(
                            engagement.summary.avgScrollPercentage
                        )}
                    />
                    <MetricCard
                        label="Avg Duration"
                        value={formatDuration(
                            getMetricCurrent(engagement.summary.avgDurationMs)
                        )}
                        changePct={getMetricChangePct(
                            engagement.summary.avgDurationMs
                        )}
                    />
                    <MetricCard
                        label="Deep Scroll Rate"
                        value={formatPercent(
                            getMetricCurrent(engagement.summary.deepScrollRate)
                        )}
                        changePct={getMetricChangePct(
                            engagement.summary.deepScrollRate
                        )}
                    />
                    <MetricCard
                        label="Engaged Visit Rate"
                        value={formatPercent(
                            getMetricCurrent(
                                engagement.summary.engagedVisitRate
                            )
                        )}
                        changePct={getMetricChangePct(
                            engagement.summary.engagedVisitRate
                        )}
                    />
                    <MetricCard
                        label="Pages / Visit"
                        value={formatDecimal(
                            getMetricCurrent(
                                engagement.summary.avgPagesPerVisit
                            )
                        )}
                        changePct={getMetricChangePct(
                            engagement.summary.avgPagesPerVisit
                        )}
                    />
                </DashboardSection>

                <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2 [&>*]:min-w-0">
                    <DashboardSection id="ua-engagement-top-pages" as="div">
                    <RankedMetricPanel
                        title="Top Pages"
                        tabs={[
                            {
                                id: "duration",
                                label: "Duration",
                                metricLabel: "Avg Time",
                                rows: [...engagement.topPages]
                                    .sort(
                                        (a, b) =>
                                            b.avgDurationMs - a.avgDurationMs
                                    )
                                    .map((page) => ({
                                    id: `${page.path}-duration`,
                                    label: page.path,
                                    sublabel: `${formatNumber(page.views)} views`,
                                    value: formatDuration(page.avgDurationMs),
                                    rawValue: page.avgDurationMs,
                                })),
                            },
                            {
                                id: "scroll",
                                label: "Scroll",
                                metricLabel: "Avg Scroll",
                                rows: [...engagement.topPages]
                                    .sort(
                                        (a, b) =>
                                            (b.avgScrollPercentage ?? 0) -
                                            (a.avgScrollPercentage ?? 0)
                                    )
                                    .map((page) => ({
                                    id: `${page.path}-scroll`,
                                    label: page.path,
                                    sublabel: `${formatNumber(page.views)} views`,
                                    value:
                                        page.avgScrollPercentage != null
                                            ? formatPercent(
                                                  page.avgScrollPercentage
                                              )
                                            : "-",
                                    rawValue: page.avgScrollPercentage ?? 0,
                                    barPct: page.avgScrollPercentage ?? 0,
                                })),
                            },
                        ]}
                    />
                    </DashboardSection>

                    <DashboardSection id="ua-engagement-behavior-mix" as="div">
                    <RankedMetricPanel
                        title="Behavior Mix"
                        tabs={[
                            {
                                id: "route-types-distribution",
                                label: "Route Types",
                                metricLabel: "Pageviews",
                                rows: breakdownRows(
                                    engagement.routeTypes,
                                    "pageviews"
                                ),
                            },
                            {
                                id: "visit-depth-compare",
                                label: "Visit Depth",
                                metricLabel: "Visits",
                                rows: breakdownRows(
                                    engagement.visitDepth,
                                    "visits"
                                ),
                            },
                            {
                                id: "scroll-depth",
                                label: "Scroll Depth",
                                metricLabel: "Pageviews",
                                rows: breakdownRows(
                                    engagement.scrollBuckets,
                                    "pageviews"
                                ),
                            },
                        ]}
                    />
                    </DashboardSection>
                </div>
            </>
        );
    };

    return (
        <div
            className={
                tab === "heatmap"
                    ? "mx-auto max-w-[92rem] px-4 sm:px-6 py-8"
                    : "max-w-350 mx-auto px-4 sm:px-6 py-8"
            }
        >
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight text-[color:var(--dash-text)]">
                        {meta.title}
                    </h1>
                    <p className="mt-1 text-sm text-[color:var(--dash-text-soft)]">
                        {meta.description}
                    </p>
                </div>

                <div className="flex self-start items-center gap-2">
                    {tab !== "embed" ? (
                        <>
                            <div className="dashboard-control flex flex-wrap shrink-0 p-0.5">
                                {timeRanges.map((item) => (
                                    <button
                                        key={item.value}
                                        onClick={() =>
                                            !item.disabled &&
                                            setRange(item.value as UserAnalyticsRange)
                                        }
                                        disabled={item.disabled}
                                        title={
                                            item.disabled
                                                ? "Upgrade plan for longer retention"
                                                : undefined
                                        }
                                        className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                                            item.disabled
                                                ? "cursor-not-allowed text-[color:var(--dash-text-muted)] opacity-45"
                                                : range === item.value
                                                  ? "bg-[color:var(--dash-blue)] text-[color:var(--dash-text-on-accent)] shadow-[var(--dash-button-shadow)]"
                                                  : "text-[color:var(--dash-text-soft)] hover:text-[color:var(--dash-text)]"
                                        }`}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>

                            <ExportDropdown
                                onExportCSV={handleExportCSV}
                                onExportJSON={handleExportJSON}
                                disabled={
                                    tab === "heatmap"
                                        ? !heatmapExport?.hasData
                                        : !activeQuery.data
                                }
                            />
                        </>
                    ) : null}
                </div>
            </div>

            {tab !== "embed" && activeQuery.isFetching && activeQuery.data ? (
                <div className="mb-4 flex items-center gap-2 text-xs text-[color:var(--dash-text-soft)]">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Refreshing data...
                </div>
            ) : null}

            <div className="space-y-5">{renderContent()}</div>
        </div>
    );
}
