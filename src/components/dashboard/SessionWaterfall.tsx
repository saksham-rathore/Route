"use client";

import { useState, useMemo, useCallback } from "react";
import {
    ChevronRight,
    ChevronDown,
    AlertTriangle,
    Globe,
    Wifi,
    Clock,
    ArrowLeft,
    Hash,
    Zap,
    Search,
} from "@/components/dashboard/icons";
import { FilterDropdown } from "./FilterDropdown";
import { ExportDropdown } from "./ExportDropdown";
import {
    getCountryFlagSrc,
    normalizeCountryDisplayName,
} from "./country-flags";
import { DomainFavicon } from "./DomainFavicon";
import {
    exportCSV,
    exportJSON,
    exportFilename,
    type ExportColumn,
} from "@/lib/core/export";
import {
    selectFilters,
    setFilter,
    useAppDispatch,
    useAppSelector,
    useGetSessionsQuery,
    useGetSessionDetailQuery,
    useAllowedTimeRanges,
    type SessionSummary,
    type SessionRequest,
    type SessionError,
    type SessionVital,
} from "@/lib/redux";
import type { TimeRange } from "@/lib/redux/hooks/useAllowedTimeRanges";
import { DashboardMetricCard } from "./DashboardMetricCard";
import { DashboardQueryLoading } from "./DashboardQueryStatus";
import { dashboardMetricGridFourClass } from "./chart-layout";

interface SessionWaterfallProps {
    projectId: string;
}

// Format duration
const fmtMs = (ms: number | null) =>
    ms == null ? "-" : `${Math.round(ms)}ms`;

// Format session duration
const fmtDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
};

const formatSessionErrorMessage = (error: SessionError): string => {
    const rawMessage = error.message?.trim();
    if (!rawMessage) {
        return error.type === "js"
            ? "A JavaScript error interrupted this session action."
            : "A request failed during this session.";
    }

    const normalized = rawMessage.toLowerCase();

    if (normalized.includes("cannot read properties of undefined")) {
        return "Something on the page tried to use data that was not available yet.";
    }

    if (normalized.includes("cannot read properties of null")) {
        return "Something on the page expected content that was missing.";
    }

    if (normalized.includes("is not a function")) {
        return "A page script called something that was not available as expected.";
    }

    if (normalized.includes("failed to fetch")) {
        return "The page could not reach a required network resource.";
    }

    if (
        normalized.includes("networkerror") ||
        normalized.includes("network error")
    ) {
        return "A network issue interrupted part of this session.";
    }

    if (normalized.includes("timeout")) {
        return "An operation took too long to complete during this session.";
    }

    if (error.type === "js") {
        return "A JavaScript error occurred during this session.";
    }

    return rawMessage;
};

function formatSessionErrorLocation(error: SessionError): string | null {
    if (error.filename) {
        const line = error.line != null ? `:${error.line}` : "";
        const col = error.col != null ? `:${error.col}` : "";
        return `${error.filename}${line}${col}`;
    }

    if (error.page) {
        try {
            const url = new URL(error.page);
            return `${url.pathname}${url.search}`;
        } catch {
            return error.page;
        }
    }

    return null;
}

function formatSessionErrorTimestamp(ts: string): string {
    const date = new Date(ts);
    if (Number.isNaN(date.getTime())) return ts;
    return date.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}

function SessionErrorRow({ error }: { error: SessionError }) {
    const [expanded, setExpanded] = useState(false);
    const friendlyMessage = formatSessionErrorMessage(error);
    const rawMessage = error.message?.trim() || null;
    const location = formatSessionErrorLocation(error);
    const showRawMessage =
        !!rawMessage &&
        rawMessage !== friendlyMessage &&
        rawMessage.toLowerCase() !== friendlyMessage.toLowerCase();
    const hasExpandableDetails =
        showRawMessage || !!location || !!error.page || !!error.filename;

    return (
        <div className="mx-0.5 my-1 overflow-hidden rounded-lg bg-[color:color-mix(in_srgb,var(--dash-danger)_6%,var(--dash-bg-elevated))]">
            <div className="flex items-center gap-4 px-3 py-3">
                <div className="flex min-w-0 w-72 shrink-0 items-center gap-2">
                    <span className={sessionCapsuleClass("danger")}>
                        {error.type === "js" ? "JS ERR" : "HTTP"}
                    </span>
                    <span
                        className="min-w-0 flex-1 truncate text-[11px] text-[color:color-mix(in_srgb,var(--dash-danger)_80%,var(--dash-text)_20%)]"
                        title={friendlyMessage}
                    >
                        {friendlyMessage}
                    </span>
                </div>

                <div className="min-w-0 flex-1" />

                {!expanded && location ? (
                    <span
                        className="max-w-[220px] shrink-0 truncate font-mono text-[10px] text-[color:var(--dash-text-muted)]"
                        title={location}
                    >
                        {location}
                    </span>
                ) : (
                    <span className="w-16 shrink-0" />
                )}

                {hasExpandableDetails ? (
                    <button
                        type="button"
                        onClick={() => setExpanded((open) => !open)}
                        aria-expanded={expanded}
                        aria-label={
                            expanded ? "Hide error details" : "Show error details"
                        }
                        className="flex shrink-0 items-center gap-1 text-[10px] font-medium text-[color:var(--dash-blue)] transition-colors hover:text-[color:var(--dash-blue-hover)]"
                    >
                        <span className="hidden sm:inline">
                            {expanded ? "Hide" : "Details"}
                        </span>
                        <ChevronDown
                            className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`}
                        />
                    </button>
                ) : null}
            </div>

            {expanded ? (
                <div className="space-y-2 border-t border-[color:color-mix(in_srgb,var(--dash-danger)_18%,var(--dash-border))] px-3 pb-3 pt-2">
                    {showRawMessage ? (
                        <div>
                            <p className="mb-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[color:var(--dash-text-muted)]">
                                Original message
                            </p>
                            <p className="whitespace-pre-wrap break-words font-mono text-[10px] leading-4 text-[color:var(--dash-text-soft)]">
                                {rawMessage}
                            </p>
                        </div>
                    ) : null}
                    {error.filename ? (
                        <div>
                            <p className="mb-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[color:var(--dash-text-muted)]">
                                Source
                            </p>
                            <p className="break-all font-mono text-[10px] text-[color:var(--dash-text-soft)]">
                                {error.filename}
                                {error.line != null ? `:${error.line}` : ""}
                                {error.col != null ? `:${error.col}` : ""}
                            </p>
                        </div>
                    ) : null}
                    {error.page ? (
                        <div>
                            <p className="mb-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[color:var(--dash-text-muted)]">
                                Page
                            </p>
                            <p className="break-all font-mono text-[10px] text-[color:var(--dash-text-soft)]">
                                {error.page}
                            </p>
                        </div>
                    ) : null}
                    {!error.filename && location ? (
                        <div>
                            <p className="mb-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[color:var(--dash-text-muted)]">
                                Location
                            </p>
                            <p className="break-all font-mono text-[10px] text-[color:var(--dash-text-soft)]">
                                {location}
                            </p>
                        </div>
                    ) : null}
                    <div>
                        <p className="mb-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[color:var(--dash-text-muted)]">
                            Timestamp
                        </p>
                        <p className="font-mono text-[10px] text-[color:var(--dash-text-soft)]">
                            {formatSessionErrorTimestamp(error.ts)}
                        </p>
                    </div>
                </div>
            ) : null}
        </div>
    );
}

// Resource type label from file extension
const resourceLabel = (path: string) => {
    const ext = path.split(".").pop()?.split("?")[0]?.toLowerCase();
    if (!ext) return "RES";
    if (["js", "mjs", "jsx", "ts", "tsx"].includes(ext)) return "JS";
    if (["css", "scss", "less"].includes(ext)) return "CSS";
    if (
        ["png", "jpg", "jpeg", "gif", "svg", "webp", "avif", "ico"].includes(
            ext
        )
    )
        return "IMG";
    if (["woff", "woff2", "ttf", "otf", "eot"].includes(ext)) return "FONT";
    if (["json", "xml"].includes(ext)) return "DATA";
    return "RES";
};

// Core Web Vitals thresholds (web.dev p75 definitions)
const CWV_THRESHOLDS: Record<
    string,
    { good: number; poor: number }
> = {
    LCP: { good: 2500, poor: 4000 },
    FCP: { good: 1800, poor: 3000 },
    CLS: { good: 100, poor: 250 },
    INP: { good: 200, poor: 500 },
    TTFB: { good: 800, poor: 1800 },
};

type VitalRating = "good" | "needs-improvement" | "poor";

function getVitalRating(name: string, value: number): VitalRating {
    const t = CWV_THRESHOLDS[name];
    if (!t) return "good";
    if (value <= t.good) return "good";
    if (value <= t.poor) return "needs-improvement";
    return "poor";
}

function vitalMarkerColor(rating: VitalRating): string {
    if (rating === "good") return "var(--dash-success)";
    if (rating === "needs-improvement") return "var(--dash-warning)";
    return "var(--dash-danger)";
}

// Shared session detail capsules (method, status, vitals, errors, tags)
type SessionCapsuleTone =
    | "neutral"
    | "blue"
    | "success"
    | "warning"
    | "danger";

const SESSION_CAPSULE_BASE =
    "inline-flex h-[18px] shrink-0 items-center justify-center rounded-sm border px-1.5 font-mono text-[10px] font-semibold leading-none";

const SESSION_CAPSULE_TONE: Record<SessionCapsuleTone, string> = {
    neutral:
        "border-[color:var(--dash-border-strong)]/50 bg-[color:var(--dash-input-bg)] text-[color:var(--dash-text-soft)]",
    blue: "border-[color:var(--dash-blue)]/35 bg-[color:color-mix(in_srgb,var(--dash-blue)_10%,transparent)] text-[color:var(--dash-blue)]",
    success:
        "border-[color:var(--dash-success)]/35 bg-[color:var(--dash-success)]/10 text-[color:var(--dash-success)]",
    warning:
        "border-[color:var(--dash-warning)]/35 bg-[color:var(--dash-warning)]/10 text-[color:var(--dash-warning)]",
    danger:
        "border-[color:var(--dash-danger)]/30 bg-[color:var(--dash-danger)]/10 text-[color:var(--dash-danger)]",
};

function sessionCapsuleClass(
    tone: SessionCapsuleTone,
    extra?: string,
): string {
    return [SESSION_CAPSULE_BASE, SESSION_CAPSULE_TONE[tone], extra]
        .filter(Boolean)
        .join(" ");
}

function vitalCapsuleTone(rating: VitalRating): SessionCapsuleTone {
    if (rating === "good") return "success";
    if (rating === "needs-improvement") return "warning";
    return "danger";
}

function statusCapsuleTone(status: number | null): SessionCapsuleTone {
    if (!status) return "neutral";
    if (status < 300) return "success";
    if (status < 400) return "warning";
    return "danger";
}

const METHOD_CAPSULE_CLASS = `${sessionCapsuleClass("neutral")} min-w-[2.25rem] text-center`;

function clampTimelinePercent(value: number): number {
    return Math.min(99, Math.max(1, value));
}

const SESSION_TIMELINE_TRACK =
    "pointer-events-none absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-[color:color-mix(in_srgb,var(--dash-border-strong)_55%,var(--dash-input-bg))] shadow-[inset_0_1px_0_color-mix(in_srgb,var(--dash-text)_8%,transparent)]";

const SESSION_TIMELINE_MARKER =
    "absolute top-1/2 z-[1] h-4 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[color:color-mix(in_srgb,var(--dash-text)_22%,transparent)] shadow-[0_0_0_2px_var(--dash-bg-elevated),0_1px_3px_color-mix(in_srgb,black_30%,transparent)]";

function requestTimelineMarkerColor(status: number | null): string {
    const tone = statusCapsuleTone(status);
    if (tone === "success") return "var(--dash-success)";
    if (tone === "warning") return "var(--dash-warning)";
    if (tone === "danger") return "var(--dash-danger)";
    return "var(--dash-blue)";
}

function buildRequestMarkerTitle(
    durationMs: number,
    phases: { key: string; ms: number }[],
): string {
    if (phases.length === 0) {
        return `${fmtMs(durationMs)} total`;
    }

    return phases.map((phase) => `${phase.key}: ${phase.ms}ms`).join(" · ");
}

// Waterfall bar colors for timing phases
const PHASE_COLORS: Record<string, string> = {
    dns: "var(--dash-text-muted)",
    tcp: "var(--dash-blue)",
    tls: "var(--dash-text-soft)",
    ttfb: "var(--dash-warning)",
    transfer: "var(--dash-success)",
};

function RequestHostLabel({ request }: { request: SessionRequest }) {
    return (
        <span className="inline-flex min-w-0 items-center gap-2">
            <DomainFavicon
                domain={request.host}
                className="h-3.5 w-3.5 shrink-0 rounded-[4px]"
            />
            <span className="truncate font-mono">
                {request.path}
            </span>
        </span>
    );
}

export function SessionWaterfall({ projectId }: SessionWaterfallProps) {
    const dispatch = useAppDispatch();
    const filters = useAppSelector(selectFilters("sessions")) as { range: string };
    const timeRange = filters.range as TimeRange;
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
        null
    );
    const [searchId, setSearchId] = useState("");
    const [filterCountry, setFilterCountry] = useState<string | null>(null);
    const [filterConn, setFilterConn] = useState<string | null>(null);
    const [filterPage, setFilterPage] = useState<string | null>(null);
    const [filterErrors, setFilterErrors] = useState<boolean>(false);

    const timeRanges = useAllowedTimeRanges(["1h", "24h", "7d", "30d", "90d", "1y"]);

    const { data: sessionsData, isLoading } = useGetSessionsQuery({
        projectId,
        range: timeRange,
    });

    const { data: detail, isLoading: isLoadingDetail } =
        useGetSessionDetailQuery(
            { projectId, sessionId: selectedSessionId! },
            { skip: !selectedSessionId }
        );

    const sessions = sessionsData?.sessions || [];

    // Derive filter options from data
    const filterOptions = useMemo(() => {
        const countries = new Map<string, number>();
        const conns = new Map<string, number>();
        const pages = new Map<string, number>();

        for (const s of sessions) {
            if (s.country)
                countries.set(s.country, (countries.get(s.country) || 0) + 1);
            if (s.connType)
                conns.set(s.connType, (conns.get(s.connType) || 0) + 1);
            if (s.page) pages.set(s.page, (pages.get(s.page) || 0) + 1);
        }

        return {
            countries: Array.from(countries.entries())
                .sort((a, b) => b[1] - a[1])
                .map(([code, count]) => ({ value: code, label: code, count })),
            conns: Array.from(conns.entries())
                .sort((a, b) => b[1] - a[1])
                .map(([type, count]) => ({ value: type, label: type, count })),
            pages: Array.from(pages.entries())
                .sort((a, b) => b[1] - a[1])
                .map(([page, count]) => ({ value: page, label: page, count })),
        };
    }, [sessions]);

    const hasActiveFilters =
        filterCountry || filterConn || filterPage || filterErrors || searchId;

    const clearFilters = useCallback(() => {
        setSearchId("");
        setFilterCountry(null);
        setFilterConn(null);
        setFilterPage(null);
        setFilterErrors(false);
    }, []);

    const filtered = useMemo(() => {
        return sessions.filter((s) => {
            if (
                searchId &&
                !s.sessionId?.toLowerCase().includes(searchId.toLowerCase())
            )
                return false;
            if (filterCountry && s.country !== filterCountry) return false;
            if (filterConn && s.connType !== filterConn) return false;
            if (filterPage && s.page !== filterPage) return false;
            if (filterErrors && s.httpErrors + s.jsErrors === 0) return false;
            return true;
        });
    }, [
        sessions,
        searchId,
        filterCountry,
        filterConn,
        filterPage,
        filterErrors,
    ]);

    const handleExportCSV = useCallback(() => {
        if (!filtered.length) return;
        const columns: ExportColumn<SessionSummary>[] = [
            { key: "sessionId", header: "Session ID" },
            { key: "startTime", header: "Start Time" },
            { key: "endTime", header: "End Time" },
            { key: "requestCount", header: "Requests" },
            { key: "httpErrors", header: "HTTP Errors" },
            { key: "jsErrors", header: "JS Errors" },
            { key: "avgDur", header: "Avg Duration (ms)" },
            { key: "p95", header: "p95 (ms)" },
            { key: (row) => row.page ?? "", header: "Page" },
            { key: (row) => row.country ?? "", header: "Country" },
            { key: (row) => row.connType ?? "", header: "Connection" },
        ];
        exportCSV(
            filtered,
            columns,
            exportFilename("sessions", projectId, timeRange, "csv")
        );
    }, [filtered, projectId, timeRange]);

    const handleExportJSON = useCallback(() => {
        if (!filtered.length) return;
        exportJSON(
            filtered,
            exportFilename("sessions", projectId, timeRange, "json")
        );
    }, [filtered, projectId, timeRange]);

    // If a session is selected, show its waterfall
    if (selectedSessionId && detail) {
        return (
            <SessionDetail
                detail={detail}
                onBack={() => setSelectedSessionId(null)}
            />
        );
    }

    if (selectedSessionId && isLoadingDetail) {
        return (
            <div className="mx-auto max-w-[1320px] px-4 py-8 sm:px-6 sm:py-9 lg:px-8">
                <button
                    onClick={() => setSelectedSessionId(null)}
                    className="mb-6 flex items-center gap-1.5 text-sm text-[color:var(--dash-text-soft)] transition-colors hover:text-[color:var(--dash-text)]"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to sessions
                </button>
                <DashboardQueryLoading variant="table" rows={8} />
            </div>
        );
    }

    return (
        <div className="max-w-350 mx-auto space-y-7 px-4 py-8 sm:px-6">
            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight text-[color:var(--dash-text)]">
                        Sessions
                    </h1>
                    <p className="mt-1 text-sm text-[color:var(--dash-text-soft)]">
                        Inspect individual user sessions and their request
                        waterfall
                    </p>
                </div>
                <div className="flex self-start items-center gap-2">
                    <div className="dashboard-control flex flex-wrap p-0.5">
                        {timeRanges.map((r) => (
                            <button
                                key={r.value}
                                onClick={() =>
                                    !r.disabled &&
                                    dispatch(
                                        setFilter({
                                            page: "sessions",
                                            key: "range",
                                            value: r.value,
                                        })
                                    )
                                }
                                disabled={r.disabled}
                                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                                    r.disabled
                                        ? "cursor-not-allowed text-[color:var(--dash-text-muted)] opacity-45"
                                        : timeRange === r.value
                                          ? "bg-[color:var(--dash-blue)] text-[color:var(--dash-text-on-accent)] shadow-[var(--dash-button-shadow)]"
                                          : "text-[color:var(--dash-text-soft)] hover:text-[color:var(--dash-text)]"
                                }`}
                            >
                                {r.label}
                            </button>
                        ))}
                    </div>
                    <ExportDropdown
                        onExportCSV={handleExportCSV}
                        onExportJSON={handleExportJSON}
                        disabled={!filtered.length}
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-wrap items-center gap-2">
                {/* Session ID search */}
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-[#555]" />
                    <input
                        type="text"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        placeholder="Search sessions..."
                        className="w-44 rounded-md border border-[#222] bg-[#111] py-1.5 pl-7 pr-3 text-xs font-mono text-[color:var(--dash-text)] placeholder-[#555] transition-colors focus:border-[#3b82f6] focus:outline-none"
                    />
                </div>

                {/* Country */}
                <FilterDropdown
                    label="Country"
                    icon={<Globe className="w-3 h-3" />}
                    value={filterCountry}
                    options={filterOptions.countries}
                    onChange={setFilterCountry}
                />

                {/* Connection */}
                <FilterDropdown
                    label="Connection"
                    icon={<Wifi className="w-3 h-3" />}
                    value={filterConn}
                    options={filterOptions.conns}
                    onChange={setFilterConn}
                />

                {/* Page */}
                <FilterDropdown
                    label="Page"
                    icon={<Hash className="w-3 h-3" />}
                    value={filterPage}
                    options={filterOptions.pages}
                    onChange={setFilterPage}
                />

                {/* Errors only toggle */}
                <button
                    onClick={() => setFilterErrors(!filterErrors)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-md border transition-colors ${
                        filterErrors
                            ? "border-transparent bg-[color:color-mix(in_srgb,var(--dash-danger)_10%,var(--dash-bg-elevated))] text-[color:var(--dash-danger)]"
                            : "border-transparent bg-[color:var(--dash-input-bg)] text-[color:var(--dash-text-soft)] hover:bg-[color:color-mix(in_srgb,var(--dash-surface-hover)_72%,var(--dash-border-strong))] hover:text-[color:var(--dash-text)]"
                    }`}
                >
                    <AlertTriangle className="w-3 h-3" />
                    Has errors
                </button>

                {/* Clear all */}
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="ml-1 text-[11px] text-[color:var(--dash-text-muted)] transition-colors hover:text-[color:var(--dash-text)]"
                    >
                        Clear all
                    </button>
                )}

            </div>

            {/* Sessions list */}
            {isLoading ? (
                <DashboardQueryLoading variant="table" rows={8} />
            ) : filtered.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center text-[color:var(--dash-text-soft)]">
                    <Clock className="mb-3 h-8 w-8 text-[color:var(--dash-text-muted)]" />
                    <p className="text-sm">No sessions found</p>
                    <p className="text-xs mt-1">
                        Sessions with 2+ requests will appear here
                    </p>
                </div>
            ) : (
                <div className="space-y-2.5">
                    {filtered.map((session) => (
                        <SessionRow
                            key={session.sessionId}
                            session={session}
                            onClick={() =>
                                setSelectedSessionId(session.sessionId)
                            }
                        />
                    ))}
                </div>
            )}

            {/* AI Pill */}
        </div>
    );
}

// Session list row
function SessionRow({
    session,
    onClick,
}: {
    session: SessionSummary;
    onClick: () => void;
}) {
    const totalErrors = session.httpErrors + session.jsErrors;
    const duration =
        session.startTime && session.endTime
            ? Math.round(
                  (new Date(session.endTime).getTime() -
                      new Date(session.startTime).getTime()) /
                      1000
              )
            : 0;

    return (
        <button
            onClick={onClick}
            className="group w-full rounded-lg bg-[color:var(--dash-bg-elevated)] px-5 py-4 text-left shadow-[var(--dash-control-shadow)] transition-colors hover:bg-[color:color-mix(in_srgb,var(--dash-surface-hover)_72%,var(--dash-border-strong))]"
        >
            {/* Top row: session info + stats */}
            <div className="flex items-center justify-between gap-4">
                {/* Left: ID + page */}
                <div className="flex min-w-0 flex-1 items-center gap-3.5">
                    <code className="shrink-0 rounded-md bg-[color:var(--dash-input-bg)] px-2 py-0.5 font-mono text-[11px] text-[color:var(--dash-text-muted)]">
                        {session.sessionId?.slice(0, 8)}
                    </code>

                    {session.page && (
                        <span className="max-w-[250px] truncate text-sm text-[color:var(--dash-text)]">
                            {session.page}
                        </span>
                    )}
                </div>

                {/* Right: stats — fixed widths for column alignment */}
                <div className="flex items-center shrink-0">
                    <div className="flex items-center gap-1.5 w-16 justify-end">
                        <Hash className="h-3 w-3 text-[color:var(--dash-text-muted)]" />
                        <span className="font-mono text-xs text-[color:var(--dash-text)]">
                            {session.requestCount}
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5 w-24 justify-end">
                        <Zap className="h-3 w-3 text-[color:var(--dash-text-muted)]" />
                        <span className="font-mono text-xs text-[color:var(--dash-blue)]">
                            {fmtMs(session.p95)}
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5 w-14 justify-end">
                        <AlertTriangle
                            className={`h-3 w-3 ${totalErrors > 0 ? "text-[color:var(--dash-danger)]" : "text-[color:var(--dash-text-muted)]"}`}
                        />
                        <span
                            className={`font-mono text-xs ${totalErrors > 0 ? "text-[color:var(--dash-danger)]" : "text-[color:var(--dash-text-muted)]"}`}
                        >
                            {totalErrors}
                        </span>
                    </div>

                    <span className="w-16 text-right font-mono text-xs text-[color:var(--dash-text-soft)]">
                        {fmtDuration(duration)}
                    </span>

                    <ChevronRight className="ml-3 h-3.5 w-3.5 text-[color:var(--dash-text-muted)] transition-colors group-hover:text-[color:var(--dash-text)]" />
                </div>
            </div>

            {/* Bottom row: metadata + time */}
            <div className="mt-3 flex items-center gap-3 text-[11px] text-[color:var(--dash-text-muted)]">
                <span className="font-mono">
                    {new Date(session.startTime).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                    })}
                </span>

                {session.country && (
                    <>
                        <span className="text-[color:var(--dash-border-strong)]">
                            /
                        </span>
                        <span
                            title={normalizeCountryDisplayName(session.country)}
                            aria-label={normalizeCountryDisplayName(
                                session.country
                            )}
                            className="flex items-center gap-1.5"
                        >
                            {getCountryFlagSrc(session.country) ? (
                                <img
                                    src={getCountryFlagSrc(session.country)!}
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
                    </>
                )}
                {session.connType && (
                    <>
                        <span className="text-[color:var(--dash-border-strong)]">
                            /
                        </span>
                        <span className="flex items-center gap-1">
                            <Wifi className="w-3 h-3" />
                            {session.connType}
                        </span>
                    </>
                )}
            </div>
        </button>
    );
}

// Session detail view with waterfall
function SessionDetail({
    detail,
    onBack,
}: {
    detail: {
        sessionId: string;
        requests: SessionRequest[];
        errors: SessionError[];
        vitals: SessionVital[];
    };
    onBack: () => void;
}) {
    const requests = detail.requests || [];
    const errors = detail.errors || [];
    const rawVitals = detail.vitals || [];

    // Deduplicate vitals — keep the last value per metric name
    const vitals = useMemo(() => {
        const map = new Map<string, SessionVital>();
        for (const v of rawVitals) {
            map.set(v.name, v);
        }
        return Array.from(map.values());
    }, [rawVitals]);

    // Compute waterfall timeline
    // minTs = earliest event start, maxTs = latest event *end* (start + duration)
    const allStartTimestamps = [
        ...requests.map((r) => new Date(r.ts).getTime()),
        ...errors.map((e) => new Date(e.ts).getTime()),
        ...rawVitals.map((v) => new Date(v.ts).getTime()),
    ];
    const allEndTimestamps = [
        ...requests.map((r) => new Date(r.ts).getTime() + (r.dur || 0)),
        ...errors.map((e) => new Date(e.ts).getTime()),
        ...rawVitals.map((v) => new Date(v.ts).getTime()),
    ];
    const minTs = Math.min(...allStartTimestamps);
    const maxTs = Math.max(...allEndTimestamps);
    const totalSpan = Math.max(maxTs - minTs, 1);

    // Max request duration for scaling waterfall bars
    const maxDur = Math.max(...requests.map((r) => r.dur || 0), 1);

    // Merge events into a timeline (use rawVitals for timeline, deduplicated vitals for summary)
    type TimelineEvent =
        | { kind: "request"; data: SessionRequest; ts: number }
        | { kind: "error"; data: SessionError; ts: number }
        | { kind: "vital"; data: SessionVital; ts: number };

    const timeline: TimelineEvent[] = useMemo(() => {
        // Deduplicate vitals in timeline too
        const vitalMap = new Map<string, SessionVital>();
        for (const v of rawVitals) {
            vitalMap.set(v.name, v);
        }
        const dedupedVitals = Array.from(vitalMap.values());

        return [
            ...requests.map((r) => ({
                kind: "request" as const,
                data: r,
                ts: new Date(r.ts).getTime(),
            })),
            ...errors.map((e) => ({
                kind: "error" as const,
                data: e,
                ts: new Date(e.ts).getTime(),
            })),
            ...dedupedVitals.map((v) => ({
                kind: "vital" as const,
                data: v,
                ts: new Date(v.ts).getTime(),
            })),
        ].sort((a, b) => a.ts - b.ts);
    }, [requests, errors, rawVitals]);

    return (
        <div className="mx-auto max-w-[1320px] space-y-7 px-4 py-8 sm:px-6 sm:py-9 lg:px-8">
            {/* Header */}
            <div className="flex flex-wrap items-center gap-3.5">
                <button
                    onClick={onBack}
                    className="flex items-center gap-1.5 text-sm text-[color:var(--dash-text-soft)] transition-colors hover:text-[color:var(--dash-text)]"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Sessions
                </button>
                <code className="rounded-md bg-[color:var(--dash-bg-subtle)] px-3 py-1 font-mono text-sm text-[color:var(--dash-text-soft)]">
                    {detail.sessionId}
                </code>
            </div>

            {/* Summary cards */}
            <div className={dashboardMetricGridFourClass}>
                <DashboardMetricCard
                    label="Requests"
                    value={String(requests.length)}
                    tone="font-mono text-[color:var(--dash-text)]"
                />
                <DashboardMetricCard
                    label="Errors"
                    value={String(errors.length)}
                    tone={`font-mono font-semibold ${errors.length > 0 ? "text-[color:var(--dash-danger)]" : "text-[color:var(--dash-text-muted)]"}`}
                />
                <DashboardMetricCard
                    label="Duration"
                    value={
                        totalSpan < 1000
                            ? `${totalSpan}ms`
                            : `${(totalSpan / 1000).toFixed(1)}s`
                    }
                    tone="font-mono text-[color:var(--dash-text)]"
                />
                <div className="dashboard-panel dashboard-metric-card min-w-0 p-5">
                    <p className="dashboard-metric-label truncate text-[10px] uppercase tracking-[0.2em] text-[color:var(--dash-text-muted)]">
                        Vitals
                    </p>
                    <div className="dashboard-metric-body mt-4 min-w-0 flex flex-wrap gap-2">
                        {vitals.length === 0 ? (
                            <span className="text-sm text-[color:var(--dash-text-muted)]">
                                --
                            </span>
                        ) : (
                            vitals.map((v) => {
                                const rating = getVitalRating(v.name, v.value);
                                return (
                                <span
                                    key={v.name}
                                    className={sessionCapsuleClass(
                                        vitalCapsuleTone(rating),
                                        "gap-1 tabular-nums",
                                    )}
                                >
                                    <span>{v.name}</span>
                                    <span>
                                        {v.name === "CLS"
                                            ? (v.value / 1000).toFixed(2)
                                            : `${Math.round(v.value)}ms`}
                                    </span>
                                </span>
                            );
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* Waterfall phase legend */}
            <div className="flex flex-wrap items-center gap-4 rounded-lg bg-[color:var(--dash-bg-elevated)] px-5 py-4 text-[10px] text-[color:var(--dash-text-muted)] shadow-[var(--dash-control-shadow)]">
                {Object.entries(PHASE_COLORS).map(([phase, color]) => (
                    <span key={phase} className="flex items-center gap-1.5">
                        <span
                            className="w-2 h-2 rounded-sm"
                            style={{ backgroundColor: color }}
                        />
                        {phase.toUpperCase()}
                    </span>
                ))}
            </div>

            {/* Timeline */}
            <div className="overflow-hidden rounded-xl bg-[color:var(--dash-bg-elevated)] shadow-[var(--dash-card-shadow)]">
                <div className="bg-[color:var(--dash-bg-subtle)] px-5 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-72 shrink-0 text-[10px] font-medium uppercase tracking-[0.14em] text-[color:var(--dash-text-muted)]">
                            Event
                        </div>
                        <div className="relative h-4 flex-1">
                            {[0, 25, 50, 75, 100].map((pct) => (
                                <span
                                    key={pct}
                                    className="absolute -translate-x-1/2 font-mono text-[9px] text-[color:var(--dash-text-muted)]"
                                    style={{ left: `${pct}%` }}
                                >
                                    {totalSpan < 2000
                                        ? `${Math.round((totalSpan * pct) / 100)}ms`
                                        : `${((totalSpan * pct) / 100000).toFixed(1)}s`}
                                </span>
                            ))}
                        </div>
                        <div className="w-16 shrink-0 text-right text-[10px] font-medium uppercase tracking-[0.14em] text-[color:var(--dash-text-muted)]">
                            Total
                        </div>
                    </div>
                </div>
                <div className="space-y-1.5 p-3 sm:p-4">
                    {timeline.map((event) => {
                        if (event.kind === "request") {
                            const r = event.data;
                            // Both position and width on the SAME time axis (% of total session span)
                            const startPct =
                                ((event.ts - minTs) / totalSpan) * 100;

                            // Build phases for marker tooltip
                            const phases: {
                                key: string;
                                ms: number;
                                color: string;
                            }[] = [];
                            if (r.dns)
                                phases.push({
                                    key: "dns",
                                    ms: r.dns,
                                    color: PHASE_COLORS.dns,
                                });
                            if (r.tcp)
                                phases.push({
                                    key: "tcp",
                                    ms: r.tcp,
                                    color: PHASE_COLORS.tcp,
                                });
                            if (r.tls)
                                phases.push({
                                    key: "tls",
                                    ms: r.tls,
                                    color: PHASE_COLORS.tls,
                                });
                            if (r.ttfb)
                                phases.push({
                                    key: "ttfb",
                                    ms: r.ttfb,
                                    color: PHASE_COLORS.ttfb,
                                });
                            const phaseTotalMs = phases.reduce(
                                (sum, p) => sum + p.ms,
                                0
                            );
                            const remaining = r.dur - phaseTotalMs;
                            const barLeft = clampTimelinePercent(startPct);
                            const requestMarkerTitle = buildRequestMarkerTitle(
                                r.dur,
                                phases,
                            );
                            if (phases.length > 0 && remaining > 0) {
                                phases.push({
                                    key: "transfer",
                                    ms: remaining,
                                    color: PHASE_COLORS.transfer,
                                });
                            }

                            return (
                                <div
                                    key={`req-${r.id}`}
                                    className="group flex items-center gap-4 rounded-lg bg-transparent px-3 py-3 transition-colors hover:bg-[color:color-mix(in_srgb,var(--dash-surface-hover)_72%,var(--dash-border-strong))]"
                                >
                                    {/* Method + status + path */}
                                    <div className="flex min-w-0 w-72 shrink-0 items-center gap-2.5">
                                        {r.method === "RESOURCE" ? (
                                            <span className={METHOD_CAPSULE_CLASS}>
                                                {resourceLabel(r.path)}
                                            </span>
                                        ) : r.method === "NAVIGATION" ? (
                                            <span
                                                className={`${sessionCapsuleClass("blue")} min-w-[2.25rem] text-center`}
                                            >
                                                NAV
                                            </span>
                                        ) : (
                                            <span className={METHOD_CAPSULE_CLASS}>
                                                {r.method}
                                            </span>
                                        )}
                                        <span
                                            className={`${sessionCapsuleClass(statusCapsuleTone(r.status))} min-w-[2.25rem] tabular-nums`}
                                        >
                                            {r.status || "---"}
                                        </span>
                                        <span
                                            className="truncate text-[11px] text-[color:var(--dash-text-soft)]"
                                            title={`${r.host}${r.path}`}
                                        >
                                            <RequestHostLabel request={r} />
                                        </span>
                                        {r.is_third_party && (
                                            <span
                                                className={sessionCapsuleClass(
                                                    "neutral",
                                                )}
                                            >
                                                3P
                                            </span>
                                        )}
                                    </div>

                                    {/* Timeline marker — same pill style as vitals */}
                                    <div className="relative -ml-5 h-5 flex-1">
                                        <div
                                            className={SESSION_TIMELINE_TRACK}
                                            aria-hidden
                                        />
                                        <div
                                            className={SESSION_TIMELINE_MARKER}
                                            style={{
                                                left: `${barLeft}%`,
                                                backgroundColor:
                                                    requestTimelineMarkerColor(
                                                        r.status,
                                                    ),
                                            }}
                                            title={requestMarkerTitle}
                                        />
                                    </div>

                                    {/* Duration */}
                                    <span className="w-16 shrink-0 text-right font-mono text-[11px] text-[color:var(--dash-text-soft)]">
                                        {fmtMs(r.dur)}
                                    </span>
                                </div>
                            );
                        }

                        if (event.kind === "error") {
                            const e = event.data;
                            return (
                                <SessionErrorRow key={`err-${e.id}`} error={e} />
                            );
                        }

                        if (event.kind === "vital") {
                            const v = event.data;
                            const rating = getVitalRating(v.name, v.value);
                            const vitalElapsedMs = event.ts - minTs;
                            const vitalTimeLabel =
                                totalSpan < 2000
                                    ? `${Math.round(vitalElapsedMs)}ms`
                                    : `${(vitalElapsedMs / 1000).toFixed(1)}s`;
                            const vitalLeft = clampTimelinePercent(
                                (vitalElapsedMs / totalSpan) * 100,
                            );
                            const vitalColor = vitalMarkerColor(rating);
                            return (
                                <div
                                    key={`vital-${v.name}`}
                                    className="my-0.5 flex items-center gap-4 rounded-lg px-3 py-3 transition-colors hover:bg-[color:color-mix(in_srgb,var(--dash-surface-hover)_72%,var(--dash-border-strong))]"
                                >
                                    <div className="flex w-72 shrink-0 items-center gap-2.5">
                                        <span
                                            className={sessionCapsuleClass(
                                                vitalCapsuleTone(rating),
                                                "gap-1 tabular-nums",
                                            )}
                                        >
                                            <span>{v.name}</span>
                                            <span>
                                                {v.name === "CLS"
                                                    ? (v.value / 1000).toFixed(2)
                                                    : `${Math.round(v.value)}ms`}
                                            </span>
                                        </span>
                                    </div>
                                    <div
                                        className="relative -ml-5 h-5 flex-1"
                                        title={`${v.name} recorded at ${vitalTimeLabel} into session`}
                                    >
                                        <div
                                            className={SESSION_TIMELINE_TRACK}
                                            aria-hidden
                                        />
                                        <div
                                            className={SESSION_TIMELINE_MARKER}
                                            style={{
                                                left: `${vitalLeft}%`,
                                                backgroundColor: vitalColor,
                                            }}
                                        />
                                    </div>
                                    <span className="w-16 shrink-0 text-right font-mono text-[10px] tabular-nums text-[color:var(--dash-text-muted)]">
                                        {vitalTimeLabel}
                                    </span>
                                </div>
                            );
                        }

                        return null;
                    })}
                </div>
            </div>

            {timeline.length === 0 && (
                <div className="py-12 text-center text-sm text-[color:var(--dash-text-muted)]">
                    No events found for this session
                </div>
            )}
        </div>
    );
}
