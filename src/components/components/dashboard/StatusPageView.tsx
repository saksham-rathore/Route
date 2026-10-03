"use client";

import {
    type ChangeEvent,
    Children,
    type CSSProperties,
    type InputHTMLAttributes,
    isValidElement,
    type ReactNode,
    type SelectHTMLAttributes,
    type TextareaHTMLAttributes,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import Link from "next/link";
import { dashboardMetricGridFiveClass } from "@/components/dashboard/chart-layout";
import {
    AlertTriangle,
    BellRing,
    ChevronDown,
    CheckCircle2,
    Copy,
    ExternalLink,
    Globe,
    Loader2,
    Mail,
    Pencil,
    Plus,
    RefreshCw,
    X,
    Save,
    ShieldCheck,
    Trash2,
    Zap,
} from "@/components/dashboard/icons";
import { createPortal } from "react-dom";
import { ToastContainer, useToast } from "@/components/ui/Toast";
import {
    StatusPageDisplayModulePicker,
    type StatusPageDisplayModuleOption,
} from "@/components/status/StatusPageDisplayModulePicker";
import { UptimeBarStrip } from "@/components/status/UptimeBarStrip";
import {
    useDeleteStatusPageComponentMutation,
    useDeleteStatusPageDomainMutation,
    useDeleteStatusPageIncidentMutation,
    useDeleteStatusPageUptimeMonitorMutation,
    useGetStatusPageAdminDataQuery,
    usePostStatusPageIncidentUpdateMutation,
    useRefreshStatusPageDomainMutation,
    useSaveStatusPageComponentMutation,
    useSaveStatusPageDomainMutation,
    useSaveStatusPageIncidentMutation,
    useSaveStatusPageUptimeMonitorMutation,
    useUpdateStatusPageSettingsMutation,
    isQueryPending,
    shouldShowQueryError,
} from "@/lib/redux";
import {
    getCountryFlagSrc,
    normalizeCountryDisplayName,
} from "./country-flags";
import { DomainFavicon } from "./DomainFavicon";
import {
    getStatusPageAccentVars,
    normalizeStatusPageHostname,
    getHostedStatusPageUrl,
    normalizeStatusPageSlug,
    STATUS_PAGE_ADMIN_POLL_INTERVAL_MS,
    STATUS_PAGE_COMPONENT_SOURCES,
    STATUS_PAGE_CUSTOM_DOMAIN_DISABLED_REASON,
    STATUS_PAGE_CUSTOM_DOMAIN_META,
    STATUS_PAGE_CUSTOM_DOMAIN_TEMPORARILY_DISABLED,
    STATUS_PAGE_DEFAULT_ACCENT_COLOR,
    STATUS_PAGE_INCIDENT_IMPACTS,
    STATUS_PAGE_INCIDENT_STATUSES,
    STATUS_PAGE_PUBLIC_POLL_INTERVAL_MS,
    STATUS_PAGE_STATUS_META,
    type StatusPageAdminData,
    type StatusPageComponentSource,
    type StatusPageComponentView,
    type StatusPageCustomDomainView,
    type StatusPageDisplayOptions,
    type StatusPageIncidentImpact,
    type StatusPageIncidentStatus,
    type StatusPageIncidentView,
    type StatusPageLinkedAlertRule,
    type StatusPageStatus,
    type StatusPageUptimeCheckStatus,
    type StatusPageUptimeMonitorMethod,
    type StatusPageUptimeMonitorView,
} from "@/lib/status-pages";

interface StatusPageViewProps {
    projectId: string;
}

interface ConfirmModalState {
    isOpen: boolean;
    title: string;
    description: string;
    itemName: string;
    onConfirm: () => void;
    isLoading?: boolean;
}

interface StatusPageSettingsForm {
    name: string;
    slug: string;
    description: string;
    logoUrl: string;
    accentColor: string;
    supportUrl: string;
    docsUrl: string;
    homepageUrl: string;
    showRouteBranding: boolean;
    isPublished: boolean;
    displayOptions: StatusPageDisplayOptions;
}

interface ComponentDraft {
    id?: string;
    name: string;
    description: string;
    sourceType: StatusPageComponentSource;
    manualStatus: StatusPageStatus;
    isVisible: boolean;
    linkedAlertRules: Array<{
        alertRuleId: string;
        publicStatus: Exclude<StatusPageStatus, "operational" | "unknown">;
    }>;
}

interface IncidentDraft {
    id?: string;
    title: string;
    status: StatusPageIncidentStatus;
    impact: StatusPageIncidentImpact;
    summary: string;
    affectedRegions: string;
    affectedIsps: string;
    internalNotes: string;
    startedAt: string;
    resolvedAt: string;
    componentIds: string[];
}

interface UptimeMonitorDraft {
    id?: string;
    name: string;
    url: string;
    method: StatusPageUptimeMonitorMethod;
    expectedStatusMin: number;
    expectedStatusMax: number;
    timeoutMs: number;
    isEnabled: boolean;
    isVisible: boolean;
    emailEnabled: boolean;
    webhookEnabled: boolean;
    slackEnabled: boolean;
}

interface SlackStatus {
    configured: boolean;
    installed: boolean;
    linked: boolean;
    needsInstall: boolean;
    needsLogin: boolean;
    installUrl: string | null;
}

interface IncidentUpdateDraft {
    incidentId: string;
    title: string;
    status: StatusPageIncidentStatus;
    message: string;
}

const MANUAL_STATUS_OPTIONS: Array<{
    value: Exclude<StatusPageStatus, "unknown">;
    label: string;
}> = [
    { value: "operational", label: "Operational" },
    { value: "degraded_performance", label: "Degraded Performance" },
    { value: "partial_outage", label: "Partial Outage" },
    { value: "major_outage", label: "Major Outage" },
    { value: "maintenance", label: "Maintenance" },
];

const ALERT_PUBLIC_STATUS_OPTIONS: Array<{
    value: Exclude<StatusPageStatus, "operational" | "unknown">;
    label: string;
}> = [
    { value: "degraded_performance", label: "Degraded Performance" },
    { value: "partial_outage", label: "Partial Outage" },
    { value: "major_outage", label: "Major Outage" },
    { value: "maintenance", label: "Maintenance" },
];

function getStatusPageThemeStyle(accentColor: string): CSSProperties {
    const accentVars = getStatusPageAccentVars(accentColor);
    return {
        "--status-accent": accentVars.accent,
        "--status-accent-hover": accentVars.accentHover,
        "--status-accent-soft": accentVars.accentSoft,
        "--status-accent-border": accentVars.accentBorder,
        "--dash-blue": accentVars.accent,
        "--dash-blue-hover": accentVars.accentHover,
        "--dash-blue-soft": accentVars.accentSoft,
    } as CSSProperties;
}

function emptySettingsForm(projectName = ""): StatusPageSettingsForm {
    return {
        name: projectName,
        slug: normalizeStatusPageSlug(projectName),
        description: "",
        logoUrl: "",
        accentColor: STATUS_PAGE_DEFAULT_ACCENT_COLOR,
        supportUrl: "",
        docsUrl: "",
        homepageUrl: "",
        showRouteBranding: true,
        isPublished: false,
        displayOptions: {
            showComponents: true,
            showIncidents: true,
            showIncidentHistory: true,
            showObservability: true,
            showNetwork: true,
            showUserAnalytics: false,
        },
    };
}

function componentToDraft(component: StatusPageComponentView): ComponentDraft {
    return {
        id: component.id,
        name: component.name,
        description: component.description ?? "",
        sourceType: component.sourceType,
        manualStatus: component.manualStatus,
        isVisible: component.isVisible,
        linkedAlertRules: component.linkedAlertRules.map((rule) => ({
            alertRuleId: rule.id,
            publicStatus: rule.publicStatus,
        })),
    };
}

function emptyComponentDraft(): ComponentDraft {
    return {
        name: "",
        description: "",
        sourceType: "alert_rules",
        manualStatus: "operational",
        isVisible: true,
        linkedAlertRules: [],
    };
}

function monitorToDraft(monitor: StatusPageUptimeMonitorView): UptimeMonitorDraft {
    return {
        id: monitor.id,
        name: monitor.name,
        url: monitor.url,
        method: monitor.method,
        expectedStatusMin: monitor.expectedStatusMin,
        expectedStatusMax: monitor.expectedStatusMax,
        timeoutMs: monitor.timeoutMs,
        isEnabled: monitor.isEnabled,
        isVisible: monitor.isVisible,
        emailEnabled: monitor.emailEnabled,
        webhookEnabled: monitor.webhookEnabled,
        slackEnabled: monitor.slackEnabled,
    };
}

function emptyUptimeMonitorDraft(timeoutMs: number): UptimeMonitorDraft {
    return {
        name: "",
        url: "",
        method: "GET",
        expectedStatusMin: 200,
        expectedStatusMax: 399,
        timeoutMs,
        isEnabled: true,
        isVisible: true,
        emailEnabled: true,
        webhookEnabled: false,
        slackEnabled: false,
    };
}

function incidentToDraft(incident: StatusPageIncidentView): IncidentDraft {
    return {
        id: incident.id,
        title: incident.title,
        status: incident.status,
        impact: incident.impact,
        summary: incident.summary,
        affectedRegions: incident.affectedRegions.join(", "),
        affectedIsps: incident.affectedIsps.join(", "),
        internalNotes: incident.internalNotes ?? "",
        startedAt: toDateTimeLocal(incident.startedAt),
        resolvedAt: incident.resolvedAt
            ? toDateTimeLocal(incident.resolvedAt)
            : "",
        componentIds: incident.affectedComponents.map(
            (component) => component.id
        ),
    };
}

function emptyIncidentDraft(): IncidentDraft {
    return {
        title: "",
        status: "investigating",
        impact: "minor",
        summary: "",
        affectedRegions: "",
        affectedIsps: "",
        internalNotes: "",
        startedAt: toDateTimeLocal(new Date().toISOString()),
        resolvedAt: "",
        componentIds: [],
    };
}

function toDateTimeLocal(value: string): string {
    const date = new Date(value);
    const offsetMs = date.getTimezoneOffset() * 60_000;
    return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function fromCommaSeparated(value: string): string[] {
    return value
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean);
}

function formatDateTime(value: string | null | undefined): string {
    if (!value) return "Never";
    return new Date(value).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
    });
}

function formatNumber(value: number | null | undefined): string {
    if (value === null || value === undefined) return "No data";
    return value.toLocaleString();
}

function formatPercent(value: number | null | undefined): string {
    if (value === null || value === undefined) return "No data";
    return `${value.toFixed(2)}%`;
}

function formatMs(value: number | null | undefined): string {
    if (value === null || value === undefined) return "No data";
    if (value < 1_000) return `${Math.round(value)}ms`;
    if (value < 60_000)
        return `${(value / 1_000).toFixed(value >= 10_000 ? 0 : 1)}s`;

    const minutes = Math.floor(value / 60_000);
    const seconds = Math.round((value % 60_000) / 1_000);
    return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
}

function getErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof Error) return error.message;
    if (error && typeof error === "object") {
        if (
            "data" in error &&
            error.data &&
            typeof error.data === "object" &&
            "error" in error.data
        ) {
            const message = (error.data as { error?: unknown }).error;
            if (typeof message === "string") return message;
        }
        if ("error" in error) {
            const message = (error as { error?: unknown }).error;
            if (typeof message === "string") return message;
        }
    }
    return fallback;
}

function statusBadgeStyle(status: StatusPageStatus) {
    const meta = STATUS_PAGE_STATUS_META[status];
    return {
        color: meta.color,
        backgroundColor: meta.glow,
        borderColor: `${meta.color}33`,
    };
}

function domainBadgeStyle(status: StatusPageCustomDomainView["status"]) {
    const meta = STATUS_PAGE_CUSTOM_DOMAIN_META[status];
    return {
        color: meta.color,
        backgroundColor: meta.glow,
        borderColor: `${meta.color}33`,
    };
}

function uptimeStatusTone(status: StatusPageUptimeCheckStatus | null | undefined): StatusPageStatus {
    if (status === "up") return "operational";
    if (status === "down" || status === "timeout") return "major_outage";
    if (status === "error") return "degraded_performance";
    return "unknown";
}

function uptimeStatusLabel(status: StatusPageUptimeCheckStatus | null | undefined): string {
    if (status === "up") return "Up";
    if (status === "down") return "Down";
    if (status === "timeout") return "Timeout";
    if (status === "error") return "Error";
    return "Awaiting check";
}

function humanizeCloudflareState(
    value: string | null | undefined,
    fallback: string
) {
    if (!value) return fallback;
    return value
        .replace(/_/g, " ")
        .replace(/^\w/, (letter) => letter.toUpperCase());
}

function accentPreviewStyle(accentColor: string) {
    return {
        borderColor: "#222",
        backgroundColor: "#0e0e0e",
        backgroundImage: `linear-gradient(180deg, ${accentColor}14 0%, rgba(14, 14, 14, 0) 48%)`,
    };
}

function accentChipStyle(accentColor: string) {
    return {
        color: accentColor,
        borderColor: `${accentColor}2c`,
        backgroundColor: `${accentColor}14`,
    };
}

function DomainDisplay({
    value,
    className = "",
}: {
    value: string | null | undefined;
    className?: string;
}) {
    if (!value) return null;

    return (
        <div className={`inline-flex min-w-0 items-center gap-2 ${className}`}>
            <DomainFavicon
                domain={value}
                className="h-4 w-4 shrink-0 rounded-[4px]"
            />
            <span className="min-w-0 break-all">{value}</span>
        </div>
    );
}

function SectionHeader({
    title,
    description,
    action,
}: {
    title: string;
    description: string;
    action?: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="min-w-0 flex-1">
                <h2 className="text-lg font-semibold tracking-tight text-white">
                    {title}
                </h2>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[#7a7a7a]">
                    {description}
                </p>
            </div>
            {action ? (
                <div className="flex shrink-0 items-center self-start sm:self-auto">
                    {action}
                </div>
            ) : null}
        </div>
    );
}

function ModalShell({
    title,
    description,
    onClose,
    children,
}: {
    title: string;
    description: string;
    onClose: () => void;
    children: React.ReactNode;
}) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    if (!mounted) return null;

    return createPortal(
        <div
            className="dashboard-theme fixed inset-0 z-[1400] overflow-y-auto bg-black/65 p-4"
            onClick={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="mx-auto flex min-h-full w-full max-w-3xl items-center justify-center">
                <div className="dashboard-panel relative w-full max-w-3xl overflow-hidden border border-[color:var(--dash-divider)]">
                    <div className="flex items-start justify-between gap-4 border-b border-[color:var(--dash-divider)] px-5 py-4 sm:px-6">
                        <div className="min-w-0">
                            <h3 className="text-lg font-semibold text-[color:var(--dash-text)]">
                                {title}
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm leading-6 text-[color:var(--dash-text-soft)]">
                                {description}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[color:var(--dash-bg-subtle)] text-[color:var(--dash-text-soft)] transition hover:bg-[color:var(--dash-surface-hover)] hover:text-[color:var(--dash-text)]"
                            aria-label="Close modal"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="max-h-[min(80vh,860px)] overflow-y-auto px-5 py-5 sm:px-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

function StatCard({
    label,
    value,
    hint,
}: {
    label: string;
    value: string;
    hint: string;
}) {
    return (
        <div className="rounded-lg border border-[#222] bg-[#0f0f0f] p-4">
            <div className="text-[11px] uppercase tracking-[0.16em] text-[#5e5e5e]">
                {label}
            </div>
            <div className="mt-3 text-2xl font-semibold tracking-tight text-white">
                {value}
            </div>
            <div className="mt-1 text-sm text-[#757575]">{hint}</div>
        </div>
    );
}

function SkeletonBlock({ className }: { className: string }) {
    return (
        <div
            aria-hidden
            className={`animate-pulse rounded-md bg-[color:var(--dash-bg-subtle)] ${className}`}
        />
    );
}

function StatusPageViewSkeleton() {
    return (
        <div className="mx-auto max-w-[1400px] space-y-8 px-4 py-6 pb-24 sm:px-6 sm:py-8 lg:px-8">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                <div className="max-w-3xl">
                    <SkeletonBlock className="h-3 w-36" />
                    <SkeletonBlock className="mt-4 h-11 w-72" />
                    <SkeletonBlock className="mt-4 h-4 w-full max-w-2xl" />
                    <SkeletonBlock className="mt-3 h-4 w-full max-w-[34rem]" />
                    <div className="mt-6 flex flex-wrap gap-3">
                        <SkeletonBlock className="h-9 w-40 rounded-full" />
                        <SkeletonBlock className="h-5 w-32" />
                        <SkeletonBlock className="h-5 w-36" />
                    </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <SkeletonBlock className="h-11 w-36" />
                    <SkeletonBlock className="h-11 w-52" />
                </div>
            </div>

            <div className="space-y-10 border-t border-[#181818] pt-8">
                <section className="space-y-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <SkeletonBlock className="h-8 w-32" />
                            <SkeletonBlock className="mt-3 h-4 w-72" />
                        </div>
                        <SkeletonBlock className="h-11 w-36" />
                    </div>

                    <div className={dashboardMetricGridFiveClass}>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div
                                key={index}
                                className="rounded-lg border border-[#222] bg-[#0f0f0f] p-4"
                            >
                                <SkeletonBlock className="h-3 w-24" />
                                <SkeletonBlock className="mt-4 h-10 w-24" />
                                <SkeletonBlock className="mt-3 h-4 w-32" />
                            </div>
                        ))}
                    </div>

                    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                        <div className="rounded-lg border border-[#222] bg-[#090909] p-5">
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0 flex-1">
                                    <SkeletonBlock className="h-5 w-40" />
                                    <SkeletonBlock className="mt-3 h-4 w-full max-w-md" />
                                </div>
                                <SkeletonBlock className="h-11 w-11" />
                            </div>
                            <div className="mt-5 grid gap-4 md:grid-cols-2">
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className={
                                            index > 3
                                                ? "md:col-span-2"
                                                : undefined
                                        }
                                    >
                                        <SkeletonBlock className="h-3 w-24" />
                                        <SkeletonBlock className="mt-3 h-11 w-full" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="rounded-lg border border-[#222] bg-[#111] px-4 py-3">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="min-w-0 flex-1">
                                        <SkeletonBlock className="h-5 w-32" />
                                        <SkeletonBlock className="mt-3 h-4 w-full max-w-xs" />
                                    </div>
                                    <SkeletonBlock className="h-6 w-11 rounded-full" />
                                </div>
                            </div>

                            {Array.from({ length: 3 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="rounded-lg border border-[#222] bg-[#090909] p-5"
                                >
                                    <SkeletonBlock className="h-5 w-36" />
                                    <SkeletonBlock className="mt-4 h-4 w-full" />
                                    <SkeletonBlock className="mt-3 h-4 w-full max-w-[18rem]" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <SkeletonBlock className="h-8 w-44" />
                            <SkeletonBlock className="mt-3 h-4 w-80" />
                        </div>
                    </div>

                    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                        {Array.from({ length: 2 }).map((_, index) => (
                            <div
                                key={index}
                                className="rounded-lg border border-[#222] bg-[#090909] p-5"
                            >
                                <SkeletonBlock className="h-5 w-40" />
                                <SkeletonBlock className="mt-3 h-4 w-full max-w-xs" />
                                <div className="mt-5 space-y-3">
                                    {Array.from({ length: 3 }).map(
                                        (__, innerIndex) => (
                                            <div
                                                key={innerIndex}
                                                className="rounded-lg border border-[#1f1f1f] bg-[#0e0e0e] p-4"
                                            >
                                                <SkeletonBlock className="h-4 w-32" />
                                                <SkeletonBlock className="mt-3 h-4 w-full" />
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="space-y-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <SkeletonBlock className="h-8 w-32" />
                            <SkeletonBlock className="mt-3 h-4 w-[28rem]" />
                        </div>
                        <SkeletonBlock className="h-11 w-36" />
                    </div>

                    <div className="grid gap-4 xl:grid-cols-2">
                        {Array.from({ length: 2 }).map((_, index) => (
                            <div
                                key={index}
                                className="rounded-lg border border-[#222] bg-[#090909] p-5"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0 flex-1">
                                        <SkeletonBlock className="h-5 w-40" />
                                        <SkeletonBlock className="mt-3 h-4 w-full max-w-sm" />
                                        <SkeletonBlock className="mt-3 h-4 w-48" />
                                    </div>
                                    <div className="flex gap-2">
                                        <SkeletonBlock className="h-9 w-9" />
                                        <SkeletonBlock className="h-9 w-9" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="space-y-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <SkeletonBlock className="h-8 w-28" />
                            <SkeletonBlock className="mt-3 h-4 w-[24rem]" />
                        </div>
                        <SkeletonBlock className="h-11 w-40" />
                    </div>

                    <div className="rounded-lg border border-[#222] bg-[#090909] p-5">
                        <SkeletonBlock className="h-6 w-56" />
                        <SkeletonBlock className="mt-4 h-4 w-full max-w-3xl" />
                        <div className="mt-5 space-y-3 border-t border-[#171717] pt-5">
                            {Array.from({ length: 2 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4"
                                >
                                    <SkeletonBlock className="h-4 w-32" />
                                    <SkeletonBlock className="mt-3 h-4 w-full" />
                                    <SkeletonBlock className="mt-2 h-4 w-full max-w-2xl" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

function Pill({ label, tone }: { label: string; tone: StatusPageStatus }) {
    const style = statusBadgeStyle(tone);
    return (
        <span
            className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium"
            style={style}
        >
            {label}
        </span>
    );
}

function Field({
    label,
    children,
    hint,
}: {
    label: string;
    children: React.ReactNode;
    hint?: string;
}) {
    return (
        <label className="block space-y-2">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--dash-text-muted)]">
                {label}
            </div>
            {children}
            {hint ? (
                <div className="mt-2 text-xs text-[color:var(--dash-text-muted)]">
                    {hint}
                </div>
            ) : null}
        </label>
    );
}

const fieldControlClassName =
    "dashboard-control w-full min-w-0 rounded-md border border-[color:var(--dash-divider)] bg-[color:var(--dash-input-bg)] px-3 py-2.5 text-sm text-[color:var(--dash-text)] shadow-[var(--dash-control-shadow)] outline-none transition-[border-color,box-shadow] placeholder:text-[color:var(--dash-text-muted)] hover:border-[color:var(--dash-border-strong)] focus:border-[color:color-mix(in_srgb,var(--dash-blue)_38%,var(--dash-divider))] focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60";

const modalSectionClassName =
    "rounded-lg border border-[color:var(--dash-divider)] bg-[color:var(--dash-bg-subtle)] p-4";

const modalNestedCardClassName =
    "rounded-lg border border-[color:var(--dash-divider)] bg-[color:var(--dash-bg-elevated)] p-4";

const modalEmptyStateClassName =
    "rounded-lg border border-dashed border-[color:var(--dash-border-strong)] px-4 py-5 text-sm text-[color:var(--dash-text-muted)]";

const modalFooterClassName =
    "flex items-center justify-end gap-3 border-t border-[color:var(--dash-divider)] pt-5";

const modalCancelButtonClassName =
    "dashboard-button-secondary px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50";

const modalCheckboxClassName = (checked: boolean) =>
    `h-4 w-4 shrink-0 rounded border ${checked ? "border-[color:var(--dash-blue)] bg-[color:var(--dash-blue)]" : "border-[color:var(--dash-border-strong)] bg-[color:var(--dash-surface)]"}`;

const dashboardButtonClassName =
    "dashboard-button-primary inline-flex shrink-0 items-center gap-2 whitespace-nowrap px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-55";

const dashboardButtonCompactClassName =
    "dashboard-button-primary inline-flex items-center gap-2 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60";

function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
    const { className, ...rest } = props;
    return (
        <input
            {...rest}
            className={`${fieldControlClassName} h-11 ${className ?? ""}`}
        />
    );
}

function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
    const { className, ...rest } = props;
    return (
        <textarea
            {...rest}
            className={`${fieldControlClassName} min-h-[120px] resize-y leading-6 ${className ?? ""}`}
        />
    );
}

function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
    const { className, value, onChange, disabled, children, id, name } = props;
    const [open, setOpen] = useState(false);
    const [menuStyle, setMenuStyle] = useState<CSSProperties>({});
    const rootRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const options = useMemo(() => {
        const items: Array<{ value: string; label: string }> = [];
        Children.forEach(children, (child) => {
            if (
                isValidElement<{ value?: string; children?: ReactNode }>(child) &&
                child.type === "option"
            ) {
                const optionValue =
                    child.props.value != null ? String(child.props.value) : "";
                const label =
                    typeof child.props.children === "string" ||
                    typeof child.props.children === "number"
                        ? String(child.props.children)
                        : optionValue;
                items.push({ value: optionValue, label });
            }
        });
        return items;
    }, [children]);

    const stringValue = value != null ? String(value) : "";
    const selected =
        options.find((option) => option.value === stringValue) ?? options[0];

    const updateMenuPosition = useCallback(() => {
        const button = buttonRef.current;
        if (!button) return;

        const rect = button.getBoundingClientRect();
        setMenuStyle({
            position: "fixed",
            top: rect.bottom + 8,
            left: rect.left,
            width: rect.width,
            zIndex: 1500,
        });
    }, []);

    useEffect(() => {
        if (!open) return;

        updateMenuPosition();
        const onScroll = () => updateMenuPosition();
        const onResize = () => updateMenuPosition();
        window.addEventListener("scroll", onScroll, true);
        window.addEventListener("resize", onResize);
        return () => {
            window.removeEventListener("scroll", onScroll, true);
            window.removeEventListener("resize", onResize);
        };
    }, [open, updateMenuPosition]);

    useEffect(() => {
        if (!open) return;

        const onPointerDown = (event: MouseEvent) => {
            const target = event.target as Node;
            if (
                rootRef.current?.contains(target) ||
                menuRef.current?.contains(target)
            ) {
                return;
            }
            setOpen(false);
        };
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.stopPropagation();
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("mousedown", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [open]);

    const handleSelect = (nextValue: string) => {
        onChange?.({
            target: { value: nextValue, name: name ?? "" },
            currentTarget: { value: nextValue, name: name ?? "" },
        } as ChangeEvent<HTMLSelectElement>);
        setOpen(false);
    };

    return (
        <>
            <div ref={rootRef} className={`relative w-full ${className ?? ""}`}>
                <button
                    ref={buttonRef}
                    id={id}
                    type="button"
                    disabled={disabled}
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    onClick={() => {
                        if (disabled) return;
                        setOpen((current) => {
                            const next = !current;
                            if (next) {
                                window.requestAnimationFrame(updateMenuPosition);
                            }
                            return next;
                        });
                    }}
                    className="dashboard-control flex h-11 w-full min-w-0 items-center justify-between gap-3 px-3 py-2.5 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <span className="truncate font-medium text-[color:var(--dash-text)]">
                        {selected?.label ?? "-"}
                    </span>
                    <ChevronDown
                        className={`h-4 w-4 shrink-0 text-[color:var(--dash-text-muted)] transition-transform ${open ? "rotate-180" : ""}`}
                    />
                </button>
            </div>
            {open && typeof document !== "undefined"
                ? createPortal(
                      <div
                          ref={menuRef}
                          role="listbox"
                          style={menuStyle}
                          className="dashboard-menu overflow-hidden py-1"
                      >
                          {options.map((option) => {
                              const active = option.value === stringValue;
                              return (
                                  <button
                                      key={option.value}
                                      type="button"
                                      role="option"
                                      aria-selected={active}
                                      onClick={() => handleSelect(option.value)}
                                      className={`flex w-full items-center px-3 py-2 text-left text-sm transition-colors ${
                                          active
                                              ? "bg-[color:color-mix(in_srgb,var(--dash-blue)_14%,transparent)] text-[color:var(--dash-blue)]"
                                              : "text-[color:var(--dash-text-soft)] hover:bg-[color:var(--dash-surface-hover)] hover:text-[color:var(--dash-text)]"
                                      }`}
                                  >
                                      {option.label}
                                  </button>
                              );
                          })}
                      </div>,
                      document.body
                  )
                : null}
        </>
    );
}

function Toggle({
    checked,
    onChange,
    label,
    description,
    disabled = false,
}: {
    checked: boolean;
    onChange: (value: boolean) => void;
    label: string;
    description: string;
    disabled?: boolean;
}) {
    return (
        <button
            type="button"
            onClick={() => !disabled && onChange(!checked)}
            disabled={disabled}
            className={`flex w-full items-center gap-3 rounded-lg border border-[color:var(--dash-border)] bg-[color:var(--dash-bg-elevated)] px-4 py-3 text-left transition ${disabled ? "cursor-not-allowed opacity-70" : "hover:border-[color:var(--dash-divider)]"}`}
        >
            <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-[color:var(--dash-text)]">{label}</div>
                <div className="mt-1 text-sm text-[color:var(--dash-text-soft)]">{description}</div>
            </div>
            <div
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-[color:var(--dash-blue)]" : "bg-[color:var(--dash-border-strong)]"}`}
            >
                <div
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${checked ? "left-[22px]" : "left-0.5"}`}
                />
            </div>
        </button>
    );
}

function ComponentModal({
    draft,
    availableAlertRules,
    isSubmitting,
    onClose,
    onChange,
    onSubmit,
}: {
    draft: ComponentDraft;
    availableAlertRules: StatusPageAdminData["availableAlertRules"];
    isSubmitting: boolean;
    onClose: () => void;
    onChange: (draft: ComponentDraft) => void;
    onSubmit: () => void;
}) {
    const isEditing = Boolean(draft.id);

    const toggleLinkedRule = useCallback(
        (ruleId: string) => {
            const exists = draft.linkedAlertRules.some(
                (rule) => rule.alertRuleId === ruleId
            );
            onChange({
                ...draft,
                sourceType: "alert_rules",
                linkedAlertRules: exists
                    ? draft.linkedAlertRules.filter(
                          (rule) => rule.alertRuleId !== ruleId
                      )
                    : [
                          ...draft.linkedAlertRules,
                          {
                              alertRuleId: ruleId,
                              publicStatus: "degraded_performance",
                          },
                      ],
            });
        },
        [draft, onChange]
    );

    return (
        <ModalShell
            title={isEditing ? "Edit Component" : "Add Component"}
            description="Alert rules drive the public status for this customer-facing service."
            onClose={onClose}
        >
            <div className="space-y-6">
                <Field label="Name">
                    <TextInput
                        value={draft.name}
                        placeholder="API"
                        onChange={(event) =>
                            onChange({ ...draft, name: event.target.value })
                        }
                    />
                </Field>

                <Field label="Description">
                    <TextArea
                        rows={3}
                        value={draft.description}
                        placeholder="Public-facing description for customers."
                        onChange={(event) =>
                            onChange({
                                ...draft,
                                description: event.target.value,
                            })
                        }
                    />
                </Field>

                <Toggle
                    checked={draft.isVisible}
                    onChange={(value) =>
                        onChange({ ...draft, isVisible: value })
                    }
                    label="Visible on the public page"
                    description="Hide internal services without deleting the configuration."
                />

                <div className={`space-y-4 ${modalSectionClassName}`}>
                    <div>
                        <div className="text-sm font-medium text-[color:var(--dash-text)]">
                            Linked Alert Rules
                        </div>
                        <div className="mt-1 text-sm text-[color:var(--dash-text-soft)]">
                            Current public health is derived from the latest
                            evaluations for the alert rules you select.
                        </div>
                    </div>
                    {availableAlertRules.length === 0 ? (
                        <div className={modalEmptyStateClassName}>
                            No alert rules exist for this project yet. Create an
                            alert first so this component can show real health
                            instead of an empty placeholder.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {availableAlertRules.map((rule) => {
                                const selected = draft.linkedAlertRules.find(
                                    (entry) => entry.alertRuleId === rule.id
                                );
                                return (
                                    <div
                                        key={rule.id}
                                        className={modalNestedCardClassName}
                                    >
                                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    toggleLinkedRule(rule.id)
                                                }
                                                className="flex items-start gap-3 text-left"
                                            >
                                                <div
                                                    className={`mt-0.5 ${modalCheckboxClassName(Boolean(selected))}`}
                                                />
                                                <div>
                                                    <div className="text-sm font-medium text-[color:var(--dash-text)]">
                                                        {rule.name}
                                                    </div>
                                                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[color:var(--dash-text-muted)]">
                                                        <span>
                                                            {rule.enabled
                                                                ? "Enabled"
                                                                : "Disabled"}
                                                        </span>
                                                        <span>
                                                            Latest:{" "}
                                                            {rule.latestStatus
                                                                ? rule.latestStatus.replace(
                                                                      /_/g,
                                                                      " "
                                                                  )
                                                                : "Awaiting first evaluation"}
                                                        </span>
                                                        {rule.latestStatusAt ? (
                                                            <span>
                                                                {formatDateTime(
                                                                    rule.latestStatusAt
                                                                )}
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </button>
                                            {selected ? (
                                                <div className="md:w-56">
                                                    <Select
                                                        value={
                                                            selected.publicStatus
                                                        }
                                                        onChange={(event) =>
                                                            onChange({
                                                                ...draft,
                                                                sourceType:
                                                                    "alert_rules",
                                                                linkedAlertRules:
                                                                    draft.linkedAlertRules.map(
                                                                        (
                                                                            entry
                                                                        ) =>
                                                                            entry.alertRuleId ===
                                                                            rule.id
                                                                                ? {
                                                                                      ...entry,
                                                                                      publicStatus:
                                                                                          event
                                                                                              .target
                                                                                              .value as Exclude<
                                                                                              StatusPageStatus,
                                                                                              | "operational"
                                                                                              | "unknown"
                                                                                          >,
                                                                                  }
                                                                                : entry
                                                                    ),
                                                            })
                                                        }
                                                    >
                                                        {ALERT_PUBLIC_STATUS_OPTIONS.map(
                                                            (option) => (
                                                                <option
                                                                    key={
                                                                        option.value
                                                                    }
                                                                    value={
                                                                        option.value
                                                                    }
                                                                >
                                                                    {
                                                                        option.label
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </Select>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className={modalFooterClassName}>
                    <button
                        type="button"
                        onClick={onClose}
                        className={modalCancelButtonClassName}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={
                            isSubmitting || availableAlertRules.length === 0
                        }
                        className={dashboardButtonCompactClassName}
                    >
                        {isSubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        {isEditing ? "Save component" : "Create component"}
                    </button>
                </div>
            </div>
        </ModalShell>
    );
}

function UptimeMonitorModal({
    draft,
    maxTimeoutMs,
    canUseWebhooks,
    canUseSlackAlerts,
    slackStatus,
    isSubmitting,
    onClose,
    onChange,
    onSubmit,
}: {
    draft: UptimeMonitorDraft;
    maxTimeoutMs: number;
    canUseWebhooks: boolean;
    canUseSlackAlerts: boolean;
    slackStatus: SlackStatus;
    isSubmitting: boolean;
    onClose: () => void;
    onChange: (draft: UptimeMonitorDraft) => void;
    onSubmit: () => void;
}) {
    const isEditing = Boolean(draft.id);
    const normalizedTimeout = Math.max(1_000, Math.min(maxTimeoutMs, draft.timeoutMs));
    const canEnableSlack = canUseSlackAlerts && slackStatus.configured;
    const visibleChannelCount = 1 + (canUseWebhooks ? 1 : 0) + (canUseSlackAlerts ? 1 : 0);

    return (
        <ModalShell
            title={isEditing ? "Edit Uptime Monitor" : "Add Uptime Monitor"}
            description="Route will check this URL on the configured worker schedule and publish the latest status on your status page."
            onClose={onClose}
        >
            <form
                className="space-y-5"
                onSubmit={(event) => {
                    event.preventDefault();
                    onSubmit();
                }}
            >
                <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Monitor Name">
                        <TextInput
                            value={draft.name}
                            onChange={(event) =>
                                onChange({ ...draft, name: event.target.value })
                            }
                            placeholder="Production API"
                        />
                    </Field>
                    <Field label="Method">
                        <Select
                            value={draft.method}
                            onChange={(event) =>
                                onChange({
                                    ...draft,
                                    method: event.target.value as StatusPageUptimeMonitorMethod,
                                })
                            }
                        >
                            <option value="GET">GET</option>
                            <option value="HEAD">HEAD</option>
                        </Select>
                    </Field>
                    <div className="md:col-span-2">
                        <Field label="URL">
                            <TextInput
                                value={draft.url}
                                onChange={(event) =>
                                    onChange({ ...draft, url: event.target.value })
                                }
                                placeholder="https://api.example.com/health"
                            />
                        </Field>
                    </div>
                    <Field label="Expected Status Min">
                        <TextInput
                            type="number"
                            min={100}
                            max={599}
                            value={draft.expectedStatusMin}
                            onChange={(event) =>
                                onChange({
                                    ...draft,
                                    expectedStatusMin: Number(event.target.value),
                                })
                            }
                        />
                    </Field>
                    <Field label="Expected Status Max">
                        <TextInput
                            type="number"
                            min={100}
                            max={599}
                            value={draft.expectedStatusMax}
                            onChange={(event) =>
                                onChange({
                                    ...draft,
                                    expectedStatusMax: Number(event.target.value),
                                })
                            }
                        />
                    </Field>
                    <div className="md:col-span-2">
                        <Field
                            label="Timeout"
                            hint={`This plan allows up to ${formatMs(maxTimeoutMs)} per check.`}
                        >
                            <TextInput
                                type="number"
                                min={1_000}
                                max={maxTimeoutMs}
                                step={500}
                                value={normalizedTimeout}
                                onChange={(event) =>
                                    onChange({
                                        ...draft,
                                        timeoutMs: Number(event.target.value),
                                    })
                                }
                            />
                        </Field>
                    </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                    <Toggle
                        checked={draft.isEnabled}
                        onChange={(value) => onChange({ ...draft, isEnabled: value })}
                        label="Checks enabled"
                        description="The worker will include this URL in scheduled checks."
                    />
                    <Toggle
                        checked={draft.isVisible}
                        onChange={(value) => onChange({ ...draft, isVisible: value })}
                        label="Show publicly"
                        description="Visible monitors appear on the public status page."
                    />
                </div>

                <div className={modalSectionClassName}>
                    <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--dash-text-muted)]">
                        Alert channels
                    </div>
                    <div className={`grid gap-3 ${visibleChannelCount > 1 ? "md:grid-cols-2" : ""} ${visibleChannelCount > 2 ? "xl:grid-cols-3" : ""}`}>
                        <Toggle
                            checked={draft.emailEnabled}
                            onChange={(value) => onChange({ ...draft, emailEnabled: value })}
                            label="Email"
                            description="Use the project email recipients."
                        />
                        {canUseWebhooks ? (
                            <Toggle
                                checked={draft.webhookEnabled}
                                onChange={(value) => onChange({ ...draft, webhookEnabled: value })}
                                label="Webhook"
                                description="Post downtime events to the project webhook."
                            />
                        ) : null}
                        {canUseSlackAlerts ? (
                            <Toggle
                                checked={draft.slackEnabled && canEnableSlack}
                                onChange={(value) => onChange({ ...draft, slackEnabled: value })}
                                label="Slack"
                                description={
                                    slackStatus.configured
                                        ? "Send downtime alerts to the connected Slack workspace."
                                        : "Connect Slack in Alerts before enabling this channel."
                                }
                                disabled={!canEnableSlack}
                            />
                        ) : null}
                    </div>
                </div>

                <div className={modalFooterClassName}>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className={modalCancelButtonClassName}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={dashboardButtonCompactClassName}
                    >
                        {isSubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        {isEditing ? "Save monitor" : "Create monitor"}
                    </button>
                </div>
            </form>
        </ModalShell>
    );
}

function IncidentModal({
    draft,
    components,
    isSubmitting,
    onClose,
    onChange,
    onSubmit,
}: {
    draft: IncidentDraft;
    components: StatusPageComponentView[];
    isSubmitting: boolean;
    onClose: () => void;
    onChange: (draft: IncidentDraft) => void;
    onSubmit: () => void;
}) {
    const isEditing = Boolean(draft.id);

    return (
        <ModalShell
            title={isEditing ? "Edit Incident" : "Create Incident"}
            description="Public incidents are the source of truth for what customers should know right now."
            onClose={onClose}
        >
            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Title">
                        <TextInput
                            value={draft.title}
                            placeholder="Checkout latency affecting Airtel users"
                            onChange={(event) =>
                                onChange({
                                    ...draft,
                                    title: event.target.value,
                                })
                            }
                        />
                    </Field>
                    <Field label="Current Stage">
                        <Select
                            value={draft.status}
                            onChange={(event) =>
                                onChange({
                                    ...draft,
                                    status: event.target
                                        .value as StatusPageIncidentStatus,
                                })
                            }
                        >
                            {STATUS_PAGE_INCIDENT_STATUSES.map((status) => (
                                <option key={status} value={status}>
                                    {status.replace(/^\w/, (value) =>
                                        value.toUpperCase()
                                    )}
                                </option>
                            ))}
                        </Select>
                    </Field>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Impact">
                        <Select
                            value={draft.impact}
                            onChange={(event) =>
                                onChange({
                                    ...draft,
                                    impact: event.target
                                        .value as StatusPageIncidentImpact,
                                })
                            }
                        >
                            {STATUS_PAGE_INCIDENT_IMPACTS.map((impact) => (
                                <option key={impact} value={impact}>
                                    {impact.replace(/^\w/, (value) =>
                                        value.toUpperCase()
                                    )}
                                </option>
                            ))}
                        </Select>
                    </Field>
                    <Field label="Started At">
                        <TextInput
                            type="datetime-local"
                            value={draft.startedAt}
                            onChange={(event) =>
                                onChange({
                                    ...draft,
                                    startedAt: event.target.value,
                                })
                            }
                        />
                    </Field>
                </div>

                <Field label="Public Summary">
                    <TextArea
                        rows={4}
                        value={draft.summary}
                        placeholder="Users on Airtel in Mumbai may experience elevated latency during checkout while we investigate."
                        onChange={(event) =>
                            onChange({ ...draft, summary: event.target.value })
                        }
                    />
                </Field>

                <div className="grid gap-4 md:grid-cols-2">
                    <Field
                        label="Affected Regions"
                        hint="Comma separated. Example: Mumbai, Delhi"
                    >
                        <TextInput
                            value={draft.affectedRegions}
                            onChange={(event) =>
                                onChange({
                                    ...draft,
                                    affectedRegions: event.target.value,
                                })
                            }
                        />
                    </Field>
                    <Field
                        label="Affected ISPs"
                        hint="Comma separated. Example: Airtel, Jio"
                    >
                        <TextInput
                            value={draft.affectedIsps}
                            onChange={(event) =>
                                onChange({
                                    ...draft,
                                    affectedIsps: event.target.value,
                                })
                            }
                        />
                    </Field>
                </div>

                <Field label="Internal Notes">
                    <TextArea
                        rows={3}
                        value={draft.internalNotes}
                        placeholder="Optional notes that stay only in the dashboard."
                        onChange={(event) =>
                            onChange({
                                ...draft,
                                internalNotes: event.target.value,
                            })
                        }
                    />
                </Field>

                <div className={modalSectionClassName}>
                    <div className="text-sm font-medium text-[color:var(--dash-text)]">
                        Affected Components
                    </div>
                    <div className="mt-1 text-sm text-[color:var(--dash-text-soft)]">
                        Choose which public services should appear as affected
                        in the incident detail.
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                        {components.length === 0 ? (
                            <div className={modalEmptyStateClassName}>
                                No components yet. Add components first to link
                                incidents to services.
                            </div>
                        ) : (
                            components.map((component) => {
                                const checked = draft.componentIds.includes(
                                    component.id
                                );
                                return (
                                    <button
                                        key={component.id}
                                        type="button"
                                        onClick={() =>
                                            onChange({
                                                ...draft,
                                                componentIds: checked
                                                    ? draft.componentIds.filter(
                                                          (id) =>
                                                              id !==
                                                              component.id
                                                      )
                                                    : [
                                                          ...draft.componentIds,
                                                          component.id,
                                                      ],
                                            })
                                        }
                                        className={`flex items-center gap-3 ${modalNestedCardClassName} px-4 py-3 text-left transition-colors hover:bg-[color:var(--dash-surface-hover)]`}
                                    >
                                        <div
                                            className={modalCheckboxClassName(checked)}
                                        />
                                        <div>
                                            <div className="text-sm text-[color:var(--dash-text)]">
                                                {component.name}
                                            </div>
                                            <div className="mt-1 text-xs text-[color:var(--dash-text-muted)]">
                                                {component.description ||
                                                    component.statusReason}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Field
                        label="Resolved At"
                        hint="Leave empty while the incident is active."
                    >
                        <TextInput
                            type="datetime-local"
                            value={draft.resolvedAt}
                            onChange={(event) =>
                                onChange({
                                    ...draft,
                                    resolvedAt: event.target.value,
                                })
                            }
                        />
                    </Field>
                </div>

                <div className={modalFooterClassName}>
                    <button
                        type="button"
                        onClick={onClose}
                        className={modalCancelButtonClassName}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={isSubmitting}
                        className={dashboardButtonCompactClassName}
                    >
                        {isSubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <BellRing className="h-4 w-4" />
                        )}
                        {isEditing ? "Save incident" : "Create incident"}
                    </button>
                </div>
            </div>
        </ModalShell>
    );
}

function IncidentUpdateModal({
    draft,
    isSubmitting,
    onClose,
    onChange,
    onSubmit,
}: {
    draft: IncidentUpdateDraft;
    isSubmitting: boolean;
    onClose: () => void;
    onChange: (draft: IncidentUpdateDraft) => void;
    onSubmit: () => void;
}) {
    return (
        <ModalShell
            title={`Post Update — ${draft.title}`}
            description="Every update is appended to the public timeline and can optionally advance the incident stage."
            onClose={onClose}
        >
            <div className="space-y-6">
                <Field label="Status">
                    <Select
                        value={draft.status}
                        onChange={(event) =>
                            onChange({
                                ...draft,
                                status: event.target
                                    .value as StatusPageIncidentStatus,
                            })
                        }
                    >
                        {STATUS_PAGE_INCIDENT_STATUSES.map((status) => (
                            <option key={status} value={status}>
                                {status.replace(/^\w/, (value) =>
                                    value.toUpperCase()
                                )}
                            </option>
                        ))}
                    </Select>
                </Field>

                <Field label="Public Update Message">
                    <TextArea
                        rows={5}
                        value={draft.message}
                        placeholder="We identified elevated latency for Airtel users in Mumbai and are routing traffic through an alternate path."
                        onChange={(event) =>
                            onChange({ ...draft, message: event.target.value })
                        }
                    />
                </Field>

                <div className={modalFooterClassName}>
                    <button
                        type="button"
                        onClick={onClose}
                        className={modalCancelButtonClassName}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={isSubmitting}
                        className={dashboardButtonCompactClassName}
                    >
                        {isSubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Zap className="h-4 w-4" />
                        )}
                        Publish update
                    </button>
                </div>
            </div>
        </ModalShell>
    );
}

function ConfirmModal({
    title,
    description,
    itemName,
    isOpen,
    isLoading,
    onClose,
    onConfirm,
}: {
    title: string;
    description: string;
    itemName: string;
    isOpen: boolean;
    isLoading?: boolean;
    onClose: () => void;
    onConfirm: () => void;
}) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape" && !isLoading) {
                onClose();
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, isLoading, onClose]);

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div
            className="dashboard-theme fixed inset-0 z-[1400] flex items-center justify-center bg-black/65 p-4"
            onClick={(event) => {
                if (event.target === event.currentTarget && !isLoading) {
                    onClose();
                }
            }}
        >
            <div
                className="dashboard-panel w-full max-w-md border border-[color:var(--dash-divider)] p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center gap-3 text-[color:var(--dash-danger)]">
                    <AlertTriangle className="h-6 w-6" />
                    <h3 className="text-lg font-semibold text-[color:var(--dash-text)]">
                        {title}
                    </h3>
                </div>

                <p className="mt-4 text-sm text-[color:var(--dash-text-soft)]">
                    {description}
                    <span className="font-medium text-[color:var(--dash-text)]">
                        {" "}
                        {itemName}
                    </span>
                    .
                </p>

                <div className="flex items-center justify-end gap-3 pt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className={modalCancelButtonClassName}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="dashboard-button-danger px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isLoading
                            ? "Deleting..."
                            : `Delete ${title.replace("Delete ", "")}`}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

export function StatusPageView({ projectId }: StatusPageViewProps) {
    const { toasts, addToast, removeToast } = useToast();

    const {
        data,
        error: statusPageError,
        isLoading,
        isFetching,
        refetch,
    } = useGetStatusPageAdminDataQuery(
        { projectId },
        {
            pollingInterval: STATUS_PAGE_ADMIN_POLL_INTERVAL_MS,
            skipPollingIfUnfocused: true,
        }
    );
    const [updateStatusPageSettings, { isLoading: isSavingSettings }] =
        useUpdateStatusPageSettingsMutation();
    const [saveStatusPageComponent, { isLoading: isSavingComponent }] =
        useSaveStatusPageComponentMutation();
    const [deleteStatusPageComponentMutation] =
        useDeleteStatusPageComponentMutation();
    const [saveStatusPageUptimeMonitor, { isLoading: isSavingUptimeMonitor }] =
        useSaveStatusPageUptimeMonitorMutation();
    const [deleteStatusPageUptimeMonitorMutation] =
        useDeleteStatusPageUptimeMonitorMutation();
    const [saveStatusPageIncident, { isLoading: isSavingIncident }] =
        useSaveStatusPageIncidentMutation();
    const [deleteStatusPageIncidentMutation] =
        useDeleteStatusPageIncidentMutation();
    const [
        postStatusPageIncidentUpdateMutation,
        { isLoading: isPostingIncidentUpdate },
    ] = usePostStatusPageIncidentUpdateMutation();
    const [saveStatusPageDomainMutation, { isLoading: isSavingDomain }] =
        useSaveStatusPageDomainMutation();
    const [refreshStatusPageDomainMutation, { isLoading: isRefreshingDomain }] =
        useRefreshStatusPageDomainMutation();
    const [deleteStatusPageDomainMutation] =
        useDeleteStatusPageDomainMutation();
    const [settingsForm, setSettingsForm] =
        useState<StatusPageSettingsForm>(emptySettingsForm());
    const [settingsDirty, setSettingsDirty] = useState(false);

    const [componentDraft, setComponentDraft] = useState<ComponentDraft | null>(
        null
    );
    const [uptimeMonitorDraft, setUptimeMonitorDraft] =
        useState<UptimeMonitorDraft | null>(null);
    const [incidentDraft, setIncidentDraft] = useState<IncidentDraft | null>(
        null
    );
    const [incidentUpdateDraft, setIncidentUpdateDraft] =
        useState<IncidentUpdateDraft | null>(null);
    const [slackStatus, setSlackStatus] = useState<SlackStatus>({
        configured: false,
        installed: false,
        linked: false,
        needsInstall: false,
        needsLogin: false,
        installUrl: null,
    });
    const [customDomainInput, setCustomDomainInput] = useState("");
    const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
        isOpen: false,
        title: "",
        description: "",
        itemName: "",
        onConfirm: () => {},
        isLoading: false,
    });
    const isSubmittingModal =
        isSavingComponent ||
        isSavingUptimeMonitor ||
        isSavingIncident ||
        isPostingIncidentUpdate;
    const isRefreshing = isFetching && Boolean(data);
    const statusPageQueryState = {
        data,
        error: statusPageError,
        isLoading,
        isFetching,
        isUninitialized: false,
    };

    useEffect(() => {
        let cancelled = false;

        async function loadSlackStatus() {
            try {
                const response = await fetch(`/api/projects/${projectId}/slack/status`);
                const json = (await response.json()) as SlackStatus & { error?: string };
                if (!response.ok) throw new Error(json.error ?? "Failed to load Slack status");
                if (!cancelled) {
                    setSlackStatus({
                        configured: Boolean(json.configured),
                        installed: Boolean(json.installed),
                        linked: Boolean(json.linked),
                        needsInstall: Boolean(json.needsInstall),
                        needsLogin: Boolean(json.needsLogin),
                        installUrl: json.installUrl ?? null,
                    });
                }
            } catch {
                if (!cancelled) {
                    setSlackStatus({
                        configured: false,
                        installed: false,
                        linked: false,
                        needsInstall: false,
                        needsLogin: false,
                        installUrl: null,
                    });
                }
            }
        }

        void loadSlackStatus();
        return () => {
            cancelled = true;
        };
    }, [projectId]);
    const isPremiumCustomDomainDisabled =
        Boolean(data?.plan.canUseCustomDomain) &&
        STATUS_PAGE_CUSTOM_DOMAIN_TEMPORARILY_DISABLED;

    useEffect(() => {
        if (!data || settingsDirty) return;

        if (data.statusPage) {
            setSettingsForm({
                name: data.statusPage.name,
                slug: data.statusPage.slug,
                description: data.statusPage.description ?? "",
                logoUrl: data.statusPage.logoUrl ?? "",
                accentColor: data.statusPage.accentColor,
                supportUrl: data.statusPage.supportUrl ?? "",
                docsUrl: data.statusPage.docsUrl ?? "",
                homepageUrl: data.statusPage.homepageUrl ?? "",
                showRouteBranding: data.statusPage.showRouteBranding,
                isPublished: data.statusPage.isPublished,
                displayOptions: data.statusPage.displayOptions,
            });
            return;
        }

        setSettingsForm(emptySettingsForm(data.project.name));
    }, [data, settingsDirty]);

    useEffect(() => {
        setCustomDomainInput(data?.customDomain?.hostname ?? "");
    }, [data?.customDomain?.hostname]);

    const publicUrl = useMemo(() => {
        const slug = normalizeStatusPageSlug(settingsForm.slug);
        return slug ? getHostedStatusPageUrl(slug) : null;
    }, [settingsForm.slug]);

    const previewUrl = useMemo(() => {
        if (!publicUrl) return null;
        if (typeof window === "undefined") return publicUrl;

        const host = window.location.hostname;
        const isLocal =
            host === "localhost" ||
            host === "127.0.0.1" ||
            host.endsWith(".local");
        if (!isLocal) return publicUrl;

        return `${window.location.origin}/status/${normalizeStatusPageSlug(settingsForm.slug)}`;
    }, [publicUrl, settingsForm.slug]);
    const activeCustomDomainUrl = useMemo(() => {
        if (data?.customDomain?.status !== "active") return null;
        return `https://${data.customDomain.hostname}`;
    }, [data?.customDomain?.hostname, data?.customDomain?.status]);
    const savedHostedPreviewUrl = useMemo(() => {
        if (!data?.statusPage?.isPublished) return null;
        if (typeof window === "undefined") return data.statusPage.publicUrl;

        const host = window.location.hostname;
        const isLocal =
            host === "localhost" ||
            host === "127.0.0.1" ||
            host.endsWith(".local");

        return isLocal
            ? `${window.location.origin}/status/${data.statusPage.slug}`
            : data.statusPage.publicUrl;
    }, [data?.statusPage?.isPublished, data?.statusPage?.publicUrl, data?.statusPage?.slug]);
    const primaryPublicUrl = data?.statusPage?.isPublished
        ? activeCustomDomainUrl ?? savedHostedPreviewUrl
        : null;

    const handleSettingsChange = useCallback(
        <K extends keyof StatusPageSettingsForm>(
            key: K,
            value: StatusPageSettingsForm[K]
        ) => {
            setSettingsDirty(true);
            setSettingsForm((current) => ({
                ...current,
                [key]:
                    key === "slug"
                        ? normalizeStatusPageSlug(String(value))
                        : value,
            }));
        },
        []
    );

    const handleDisplayOptionChange = useCallback(
        (key: keyof StatusPageDisplayOptions, value: boolean) => {
            setSettingsDirty(true);
            setSettingsForm((current) => ({
                ...current,
                displayOptions: {
                    ...current.displayOptions,
                    [key]: value,
                },
            }));
        },
        []
    );

    const saveSettings = useCallback(async () => {
        try {
            await updateStatusPageSettings({
                projectId,
                settings: {
                    ...settingsForm,
                    slug: normalizeStatusPageSlug(settingsForm.slug),
                },
            }).unwrap();
            setSettingsDirty(false);
            addToast("success", "Status page settings saved.");
        } catch (error) {
            addToast(
                "error",
                getErrorMessage(error, "Failed to save settings")
            );
        }
    }, [addToast, projectId, settingsForm, updateStatusPageSettings]);

    const saveComponent = useCallback(async () => {
        if (!componentDraft) return;
        try {
            await saveStatusPageComponent({
                projectId,
                componentId: componentDraft.id,
                body: {
                    ...componentDraft,
                    sourceType: "alert_rules",
                },
            }).unwrap();
            setComponentDraft(null);
            addToast(
                "success",
                componentDraft.id ? "Component updated." : "Component created."
            );
        } catch (error) {
            addToast(
                "error",
                getErrorMessage(error, "Failed to save component")
            );
        }
    }, [addToast, componentDraft, projectId, saveStatusPageComponent]);

    const deleteComponent = useCallback(
        (component: StatusPageComponentView) => {
            setConfirmModal({
                isOpen: true,
                title: "Delete Component",
                description:
                    "This action cannot be undone. This will permanently delete the component",
                itemName: component.name,
                isLoading: false,
                onConfirm: async () => {
                    setConfirmModal((prev) => ({ ...prev, isLoading: true }));
                    try {
                        await deleteStatusPageComponentMutation({
                            projectId,
                            componentId: component.id,
                        }).unwrap();
                        setConfirmModal((prev) => ({
                            ...prev,
                            isOpen: false,
                            isLoading: false,
                        }));
                        addToast("success", "Component deleted.");
                    } catch (error) {
                        setConfirmModal((prev) => ({
                            ...prev,
                            isLoading: false,
                        }));
                        addToast(
                            "error",
                            getErrorMessage(error, "Failed to delete component")
                        );
                    }
                },
            });
        },
        [addToast, deleteStatusPageComponentMutation, projectId]
    );

    const saveUptimeMonitor = useCallback(async () => {
        if (!uptimeMonitorDraft) return;
        try {
            await saveStatusPageUptimeMonitor({
                projectId,
                monitorId: uptimeMonitorDraft.id,
                body: {
                    ...uptimeMonitorDraft,
                    webhookEnabled:
                        data?.plan.canUseWebhooks === true &&
                        uptimeMonitorDraft.webhookEnabled,
                    slackEnabled:
                        data?.plan.canUseSlackAlerts === true &&
                        slackStatus.configured &&
                        uptimeMonitorDraft.slackEnabled,
                    timeoutMs: Math.max(
                        1_000,
                        Math.min(
                            data?.plan.uptimeCheckTimeoutMs ?? uptimeMonitorDraft.timeoutMs,
                            uptimeMonitorDraft.timeoutMs
                        )
                    ),
                },
            }).unwrap();
            setUptimeMonitorDraft(null);
            addToast(
                "success",
                uptimeMonitorDraft.id
                    ? "Uptime monitor updated."
                    : "Uptime monitor created."
            );
        } catch (error) {
            addToast(
                "error",
                getErrorMessage(error, "Failed to save uptime monitor")
            );
        }
    }, [
        addToast,
        data?.plan.canUseSlackAlerts,
        data?.plan.uptimeCheckTimeoutMs,
        data?.plan.canUseWebhooks,
        projectId,
        saveStatusPageUptimeMonitor,
        slackStatus.configured,
        uptimeMonitorDraft,
    ]);

    const deleteUptimeMonitor = useCallback(
        (monitor: StatusPageUptimeMonitorView) => {
            setConfirmModal({
                isOpen: true,
                title: "Delete Monitor",
                description:
                    "This action cannot be undone. This will permanently delete the uptime monitor",
                itemName: monitor.name,
                isLoading: false,
                onConfirm: async () => {
                    setConfirmModal((prev) => ({ ...prev, isLoading: true }));
                    try {
                        await deleteStatusPageUptimeMonitorMutation({
                            projectId,
                            monitorId: monitor.id,
                        }).unwrap();
                        setConfirmModal((prev) => ({
                            ...prev,
                            isOpen: false,
                            isLoading: false,
                        }));
                        addToast("success", "Uptime monitor deleted.");
                    } catch (error) {
                        setConfirmModal((prev) => ({
                            ...prev,
                            isLoading: false,
                        }));
                        addToast(
                            "error",
                            getErrorMessage(error, "Failed to delete uptime monitor")
                        );
                    }
                },
            });
        },
        [addToast, deleteStatusPageUptimeMonitorMutation, projectId]
    );

    const saveIncident = useCallback(async () => {
        if (!incidentDraft) return;
        try {
            await saveStatusPageIncident({
                projectId,
                incidentId: incidentDraft.id,
                body: {
                    ...incidentDraft,
                    affectedRegions: fromCommaSeparated(
                        incidentDraft.affectedRegions
                    ),
                    affectedIsps: fromCommaSeparated(
                        incidentDraft.affectedIsps
                    ),
                    startedAt: incidentDraft.startedAt
                        ? new Date(incidentDraft.startedAt).toISOString()
                        : undefined,
                    resolvedAt: incidentDraft.resolvedAt
                        ? new Date(incidentDraft.resolvedAt).toISOString()
                        : null,
                },
            }).unwrap();
            setIncidentDraft(null);
            addToast(
                "success",
                incidentDraft.id ? "Incident updated." : "Incident created."
            );
        } catch (error) {
            addToast(
                "error",
                getErrorMessage(error, "Failed to save incident")
            );
        }
    }, [addToast, incidentDraft, projectId, saveStatusPageIncident]);

    const deleteIncident = useCallback(
        (incident: StatusPageIncidentView) => {
            setConfirmModal({
                isOpen: true,
                title: "Delete Incident",
                description:
                    "This action cannot be undone. This will permanently delete the incident",
                itemName: incident.title,
                isLoading: false,
                onConfirm: async () => {
                    setConfirmModal((prev) => ({ ...prev, isLoading: true }));
                    try {
                        await deleteStatusPageIncidentMutation({
                            projectId,
                            incidentId: incident.id,
                        }).unwrap();
                        setConfirmModal((prev) => ({
                            ...prev,
                            isOpen: false,
                            isLoading: false,
                        }));
                        addToast("success", "Incident deleted.");
                    } catch (error) {
                        setConfirmModal((prev) => ({
                            ...prev,
                            isLoading: false,
                        }));
                        addToast(
                            "error",
                            getErrorMessage(error, "Failed to delete incident")
                        );
                    }
                },
            });
        },
        [addToast, deleteStatusPageIncidentMutation, projectId]
    );

    const postIncidentUpdate = useCallback(async () => {
        if (!incidentUpdateDraft) return;
        try {
            await postStatusPageIncidentUpdateMutation({
                projectId,
                incidentId: incidentUpdateDraft.incidentId,
                body: {
                    status: incidentUpdateDraft.status,
                    message: incidentUpdateDraft.message,
                },
            }).unwrap();
            setIncidentUpdateDraft(null);
            addToast("success", "Incident update published.");
        } catch (error) {
            addToast(
                "error",
                getErrorMessage(error, "Failed to post incident update")
            );
        }
    }, [
        addToast,
        incidentUpdateDraft,
        postStatusPageIncidentUpdateMutation,
        projectId,
    ]);

    const copyPublicUrl = useCallback(async () => {
        if (!primaryPublicUrl) return;
        try {
            await navigator.clipboard.writeText(primaryPublicUrl);
            addToast("success", "Public URL copied.");
        } catch {
            addToast("error", "Failed to copy public URL.");
        }
    }, [addToast, primaryPublicUrl]);

    const copyText = useCallback(
        async (value: string, label: string) => {
            try {
                await navigator.clipboard.writeText(value);
                addToast("success", `${label} copied.`);
            } catch {
                addToast("error", `Failed to copy ${label.toLowerCase()}.`);
            }
        },
        [addToast]
    );

    const saveCustomDomain = useCallback(async () => {
        if (isPremiumCustomDomainDisabled) {
            addToast("error", STATUS_PAGE_CUSTOM_DOMAIN_DISABLED_REASON);
            return;
        }

        try {
            await saveStatusPageDomainMutation({
                projectId,
                hostname: normalizeStatusPageHostname(customDomainInput),
            }).unwrap();
            addToast(
                "success",
                "Custom domain saved. Add the setup records below, then refresh verification until the hostname becomes active."
            );
        } catch (error) {
            addToast(
                "error",
                getErrorMessage(error, "Failed to save custom domain")
            );
        }
    }, [
        addToast,
        customDomainInput,
        isPremiumCustomDomainDisabled,
        projectId,
        saveStatusPageDomainMutation,
    ]);

    const refreshCustomDomain = useCallback(async () => {
        if (isPremiumCustomDomainDisabled) {
            addToast("error", STATUS_PAGE_CUSTOM_DOMAIN_DISABLED_REASON);
            return;
        }

        try {
            await refreshStatusPageDomainMutation({ projectId }).unwrap();
            addToast("success", "Custom domain verification refreshed.");
        } catch (error) {
            addToast(
                "error",
                getErrorMessage(error, "Failed to refresh custom domain")
            );
        }
    }, [
        addToast,
        isPremiumCustomDomainDisabled,
        projectId,
        refreshStatusPageDomainMutation,
    ]);

    const deleteCustomDomain = useCallback(() => {
        if (isPremiumCustomDomainDisabled) {
            addToast("error", STATUS_PAGE_CUSTOM_DOMAIN_DISABLED_REASON);
            return;
        }

        setConfirmModal({
            isOpen: true,
            title: "Remove Domain",
            description:
                "This action cannot be undone. This will permanently remove the custom domain",
            itemName: customDomainInput || "Custom domain",
            isLoading: false,
            onConfirm: async () => {
                setConfirmModal((prev) => ({ ...prev, isLoading: true }));
                try {
                    await deleteStatusPageDomainMutation({
                        projectId,
                    }).unwrap();
                    setCustomDomainInput("");
                    setConfirmModal((prev) => ({
                        ...prev,
                        isOpen: false,
                        isLoading: false,
                    }));
                    addToast("success", "Custom domain removed.");
                } catch (error) {
                    setConfirmModal((prev) => ({ ...prev, isLoading: false }));
                    addToast(
                        "error",
                        getErrorMessage(error, "Failed to remove custom domain")
                    );
                }
            },
        });
    }, [
        addToast,
        deleteStatusPageDomainMutation,
        isPremiumCustomDomainDisabled,
        projectId,
        customDomainInput,
    ]);

    if (isQueryPending(statusPageQueryState)) {
        return <StatusPageViewSkeleton />;
    }

    if (shouldShowQueryError(statusPageQueryState)) {
        const loadError = getErrorMessage(
            statusPageError,
            "Failed to load status page",
        );
        const needsMigration =
            loadError.toLowerCase().includes("migration") ||
            loadError.toLowerCase().includes("tables are missing");
        return (
            <div className="rounded-3xl border border-[#2a1717] bg-[#120d0d] p-8">
                <h1 className="text-xl font-semibold text-white">
                    Status Page
                </h1>
                <p className="mt-2 text-sm text-[#d0a5a5]">{loadError}</p>
                {needsMigration ? (
                    <div className="mt-4 rounded-lg border border-[#3a2d18] bg-[#151109] px-4 py-3 text-sm text-[#d2b27b]">
                        Run the latest status page SQL migration from{" "}
                        <code className="font-mono text-[#f3d39b]">
                            migrations/007_add_status_page_display_options.sql
                        </code>{" "}
                        in the Neon SQL editor, then refresh this page.
                    </div>
                ) : null}
                <button
                    type="button"
                    onClick={() => void refetch()}
                    className="mt-5 rounded-md border border-[#3d2222] px-4 py-2 text-sm text-white transition hover:border-[#5a3030]"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!data) return null;

    const normalizedCustomDomain =
        normalizeStatusPageHostname(customDomainInput);
    const customDomainDirty =
        normalizedCustomDomain !== (data.customDomain?.hostname ?? "");
    const customDomain = data.customDomain;
    const customDomainState = customDomain
        ? STATUS_PAGE_CUSTOM_DOMAIN_META[customDomain.status]
        : null;
    const canAddUptimeMonitor =
        data.plan.canUseUptimeMonitoring &&
        data.uptimeMonitors.length < data.plan.maxUptimeMonitors;
    const uptimeLimitLabel = `${data.uptimeMonitors.length}/${data.plan.maxUptimeMonitors}`;
    const uptimeChecks24h = data.uptimeMonitors.reduce(
        (total, monitor) => total + monitor.stats24h.checkCount,
        0
    );
    const uptimeUpChecks24h = data.uptimeMonitors.reduce(
        (total, monitor) => total + monitor.stats24h.upCount,
        0
    );
    const uptimePercent24h =
        uptimeChecks24h > 0
            ? Number(((uptimeUpChecks24h * 100) / uptimeChecks24h).toFixed(2))
            : null;
    const goodVitalsLabel =
        data.metrics.goodVitalsRatio24h === null
            ? "No samples yet"
            : `${data.metrics.goodVitalsRatio24h.toFixed(2)}% good`;
    const displayModuleOptions: StatusPageDisplayModuleOption[] = [
        {
            key: "showComponents",
            label: "Service components",
            description: "Current health for the services customers care about.",
            meta: `${data.summary.visibleComponentCount} service${data.summary.visibleComponentCount === 1 ? "" : "s"}`,
            isRecommended: true,
        },
        {
            key: "showIncidents",
            label: "Active incidents",
            description: "Ongoing public incidents and timeline updates.",
            meta: `${data.summary.activeIncidentCount} active`,
            isRecommended: true,
        },
        {
            key: "showIncidentHistory",
            label: "Resolved incidents",
            description: "Past public incidents after they are resolved.",
            meta: `${data.incidents.filter((incident) => !incident.isActive).length} resolved`,
        },
        {
            key: "showObservability",
            label: "Observability",
            description: "Requests, latency, HTTP errors, JS errors, and Web Vitals.",
            meta: `${formatNumber(data.metrics.requests24h)} requests`,
            isRecommended: true,
        },
        {
            key: "showNetwork",
            label: "Network context",
            description: "Top ISPs, countries, and telemetry freshness.",
            meta: `${data.metrics.topIsps.length + data.metrics.topCountries.length} signals`,
        },
        {
            key: "showUserAnalytics",
            label: "User analytics",
            description: "Pageviews, visitors, visits, top pages, devices, and channels.",
            meta: `${formatNumber(data.analytics.pageviews)} views`,
        },
    ];

    const accentStyle = getStatusPageThemeStyle(
        settingsForm.accentColor || STATUS_PAGE_DEFAULT_ACCENT_COLOR
    );

    return (
        <div
            className="mx-auto max-w-[1400px] space-y-8 px-4 py-6 pb-24 sm:px-6 sm:py-8 lg:px-8"
            style={accentStyle}
        >
            <ToastContainer toasts={toasts} remove={removeToast} />

            <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                <div className="max-w-3xl">
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#5f5f5f]">
                        <Globe className="h-3.5 w-3.5" />
                        Public Status Page
                    </div>
                    <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                        Status Page
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[#828282]">
                        Publish a customer-facing status page on the hosted Route
                        URL by default, or connect a premium custom domain. Live
                        component health is derived from alert history, incident
                        updates are manual and explicit, and the public page
                        polls every{" "}
                        {Math.floor(STATUS_PAGE_PUBLIC_POLL_INTERVAL_MS / 1000)}{" "}
                        seconds to stay accurate without the cost of sockets.
                    </p>
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                        <Pill
                            label={data.summary.label}
                            tone={data.summary.status}
                        />
                        <span className="text-sm text-[#777]">
                            {data.summary.activeIncidentCount} active incident
                            {data.summary.activeIncidentCount === 1 ? "" : "s"}
                        </span>
                        <span className="text-sm text-[#777]">
                            {data.summary.visibleComponentCount} public
                            component
                            {data.summary.visibleComponentCount === 1
                                ? ""
                                : "s"}
                        </span>
                        {isRefreshing ? (
                            <span className="inline-flex items-center gap-2 text-sm text-[#7d7d7d]">
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                Refreshing
                            </span>
                        ) : null}
                    </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={copyPublicUrl}
                        disabled={!primaryPublicUrl}
                        className="inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-[#242424] bg-[#111] px-3 text-sm text-white transition hover:border-[#363636] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Copy className="h-4 w-4" />
                        {primaryPublicUrl ? "Copy URL" : "Publish to copy"}
                    </button>
                    <Link
                        href={primaryPublicUrl ?? "#"}
                        target="_blank"
                        className={`inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-md border px-3 text-sm font-medium transition ${
                            primaryPublicUrl
                                ? "border-[color:var(--dash-blue)] bg-[color:var(--dash-blue)] text-[color:var(--dash-text-on-accent)] shadow-[var(--dash-button-shadow)] hover:bg-[color:var(--dash-blue-hover)] hover:border-[color:var(--dash-blue-hover)]"
                                : "pointer-events-none border-[color:var(--dash-blue)] bg-[color:var(--dash-blue)] text-[color:var(--dash-text-on-accent)] opacity-70"
                        }`}
                    >
                        <ExternalLink className="h-4 w-4" />
                        {primaryPublicUrl ? "Open Public Page" : "Publish first"}
                    </Link>
                </div>
            </div>

            <div className="space-y-10 border-t border-[#181818] pt-8">
                <section className="space-y-6">
                    <SectionHeader
                        title="Overview"
                        description={data.summary.message}
                        action={
                            <button
                                type="button"
                                onClick={saveSettings}
                                disabled={isSavingSettings || !settingsDirty}
                                className={dashboardButtonClassName}
                            >
                                {isSavingSettings ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                Save Details
                            </button>
                        }
                    />

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        <StatCard
                            label="Requests"
                            value={formatNumber(data.metrics.requests24h)}
                            hint={data.metrics.windowLabel}
                        />
                        <StatCard
                            label="P95 TTFB"
                            value={formatMs(data.metrics.p95TtfbMs)}
                            hint="First-party network response over the last 24h"
                        />
                        <StatCard
                            label="Error Rate"
                            value={formatPercent(data.metrics.errorRate24h)}
                            hint="HTTP errors over the last 24h"
                        />
                        <StatCard
                            label="JS Errors"
                            value={formatNumber(data.metrics.jsErrors24h)}
                            hint="Captured in the same window"
                        />
                        <StatCard
                            label="Good Vitals"
                            value={goodVitalsLabel}
                            hint={`${formatNumber(data.metrics.goodVitalsSamples24h)} good samples · ${formatNumber(data.metrics.vitalsSamples24h)} total`}
                        />
                        <StatCard
                            label="Success Rate"
                            value={
                                data.metrics.errorRate24h === null
                                    ? "No data"
                                    : `${(100 - data.metrics.errorRate24h).toFixed(2)}%`
                            }
                            hint="Successful requests in the last 24h"
                        />
                        <StatCard
                            label="Uptime"
                            value={formatPercent(uptimePercent24h)}
                            hint={`${formatNumber(uptimeChecks24h)} checks across ${data.uptimeMonitors.length} monitor${data.uptimeMonitors.length === 1 ? "" : "s"}`}
                        />
                    </div>

                    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                        <div className="dashboard-panel border border-[color:var(--dash-divider)] p-5">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="text-sm font-medium text-[color:var(--dash-text)]">
                                        Hosted page details
                                    </div>
                                    <div className="mt-1 text-sm text-[color:var(--dash-text-soft)]">
                                        Configure the Route-hosted page customers
                                        will see under your chosen slug.
                                    </div>
                                </div>
                                <div
                                    className="h-11 w-11 rounded-md border border-[color:var(--dash-divider)]"
                                    style={{
                                        backgroundColor:
                                            settingsForm.accentColor,
                                    }}
                                />
                            </div>

                            <div className="mt-5 grid gap-4 md:grid-cols-2">
                                <Field label="Page Name">
                                    <TextInput
                                        value={settingsForm.name}
                                        onChange={(event) =>
                                            handleSettingsChange(
                                                "name",
                                                event.target.value
                                            )
                                        }
                                        placeholder={data.project.name}
                                    />
                                </Field>
                                <Field label="Slug">
                                    <TextInput
                                        value={settingsForm.slug}
                                        onChange={(event) =>
                                            handleSettingsChange(
                                                "slug",
                                                event.target.value
                                            )
                                        }
                                        placeholder={normalizeStatusPageSlug(
                                            data.project.name
                                        )}
                                    />
                                </Field>
                                <div className="md:col-span-2">
                                    <Field label="Public URL">
                                        <div className="rounded-md border border-[color:var(--dash-divider)] bg-[color:var(--dash-input-bg)] px-3 py-2.5 text-sm text-[color:var(--dash-text-soft)]">
                                            {publicUrl ??
                                                "Add a slug to generate the hosted URL."}
                                        </div>
                                    </Field>
                                </div>
                                <div className="md:col-span-2">
                                    <Field label="Short Description">
                                        <TextArea
                                            rows={3}
                                            value={settingsForm.description}
                                            placeholder="Keep customers informed with a calm, reliable view of current service health."
                                            onChange={(event) =>
                                                handleSettingsChange(
                                                    "description",
                                                    event.target.value
                                                )
                                            }
                                        />
                                    </Field>
                                </div>
                                <Field
                                    label="Logo URL"
                                    hint="Optional https URL to your logo asset."
                                >
                                    <TextInput
                                        value={settingsForm.logoUrl}
                                        onChange={(event) =>
                                            handleSettingsChange(
                                                "logoUrl",
                                                event.target.value
                                            )
                                        }
                                        placeholder="https://route.dev/logo.svg"
                                    />
                                </Field>
                                <Field label="Accent Color">
                                    <div className="flex gap-3">
                                        <TextInput
                                            value={settingsForm.accentColor}
                                            onChange={(event) =>
                                                handleSettingsChange(
                                                    "accentColor",
                                                    event.target.value
                                                )
                                            }
                                            placeholder={
                                                STATUS_PAGE_DEFAULT_ACCENT_COLOR
                                            }
                                        />
                                        <input
                                            type="color"
                                            value={settingsForm.accentColor}
                                            onChange={(event) =>
                                                handleSettingsChange(
                                                    "accentColor",
                                                    event.target.value
                                                )
                                            }
                                            className="h-11 w-14 rounded-md border border-[color:var(--dash-divider)] bg-[color:var(--dash-input-bg)]"
                                        />
                                    </div>
                                </Field>
                                <div
                                    className="md:col-span-2 rounded-lg border p-4"
                                    style={accentPreviewStyle(
                                        settingsForm.accentColor
                                    )}
                                >
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span
                                            className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium"
                                            style={accentChipStyle(
                                                settingsForm.accentColor
                                            )}
                                        >
                                            Accent preview
                                        </span>
                                        <span className="text-sm text-[#7a7a7a]">
                                            The public page uses this color for
                                            subtle highlights, labels, and
                                            utility links instead of loud card
                                            chrome.
                                        </span>
                                    </div>
                                    <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                                        <span
                                            className="rounded-full border px-3 py-1"
                                            style={accentChipStyle(
                                                settingsForm.accentColor
                                            )}
                                        >
                                            Operational
                                        </span>
                                        <span
                                            className="rounded-full border px-3 py-1"
                                            style={accentChipStyle(
                                                settingsForm.accentColor
                                            )}
                                        >
                                            {publicUrl
                                                ? (() => {
                                                      try {
                                                          return new URL(
                                                              publicUrl
                                                          ).host;
                                                      } catch {
                                                          return "status.route.dev";
                                                      }
                                                  })()
                                                : "status.route.dev"}
                                        </span>
                                        <span
                                            style={{
                                                color: settingsForm.accentColor,
                                            }}
                                        >
                                            Support link
                                        </span>
                                    </div>
                                </div>
                                <Field label="Support Link">
                                    <TextInput
                                        value={settingsForm.supportUrl}
                                        onChange={(event) =>
                                            handleSettingsChange(
                                                "supportUrl",
                                                event.target.value
                                            )
                                        }
                                        placeholder="https://route.dev/support"
                                    />
                                </Field>
                                <Field label="Docs Link">
                                    <TextInput
                                        value={settingsForm.docsUrl}
                                        onChange={(event) =>
                                            handleSettingsChange(
                                                "docsUrl",
                                                event.target.value
                                            )
                                        }
                                        placeholder="https://docs.route.dev"
                                    />
                                </Field>
                                <Field label="Homepage Link">
                                    <TextInput
                                        value={settingsForm.homepageUrl}
                                        onChange={(event) =>
                                            handleSettingsChange(
                                                "homepageUrl",
                                                event.target.value
                                            )
                                        }
                                        placeholder="https://route.dev"
                                    />
                                </Field>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Toggle
                                checked={settingsForm.isPublished}
                                onChange={(value) =>
                                    handleSettingsChange("isPublished", value)
                                }
                                label={
                                    settingsForm.isPublished
                                        ? "Public page is live"
                                        : "Public page is unpublished"
                                }
                                description={
                                    settingsForm.isPublished
                                        ? "Visitors can access the hosted status page right now."
                                        : "Save and publish whenever you are ready to share the page."
                                }
                            />

                            <Toggle
                                checked={settingsForm.showRouteBranding}
                                onChange={(value) =>
                                    handleSettingsChange(
                                        "showRouteBranding",
                                        value
                                    )
                                }
                                disabled={!data.plan.canHideRouteBranding}
                                label={
                                    settingsForm.showRouteBranding
                                        ? "Show “Powered by Route” branding"
                                        : "Hide Route branding"
                                }
                                description={
                                    data.plan.canHideRouteBranding
                                        ? "Premium projects can remove the Route wordmark from the hosted page footer."
                                        : "Free projects always show the Route wordmark. Upgrade to Premium to hide it."
                                }
                            />

                            <StatusPageDisplayModulePicker
                                options={displayModuleOptions}
                                value={settingsForm.displayOptions}
                                onChange={handleDisplayOptionChange}
                            />

                            <div className="rounded-lg border border-[#222] bg-[#090909] p-5">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="h-4 w-4 text-[color:var(--dash-blue)]" />
                                    <div className="text-sm font-medium text-white">
                                        Accuracy model
                                    </div>
                                </div>
                                <div className="mt-4 space-y-3 text-sm leading-6 text-[#787878]">
                                    <p>
                                        Component health is derived from linked
                                        alert evaluations. New components stay
                                        in an awaiting-data state until those
                                        alerts have actually evaluated.
                                    </p>
                                    <p>
                                        Incidents and timeline messages are
                                        always explicitly authored by you.
                                    </p>
                                    <p>
                                        Public refresh uses polling every{" "}
                                        {Math.floor(
                                            STATUS_PAGE_PUBLIC_POLL_INTERVAL_MS /
                                                1000
                                        )}{" "}
                                        seconds to keep infrastructure costs
                                        modest.
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-lg border border-[#222] bg-[#090909] p-5">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <Globe className="h-4 w-4 text-white" />
                                        <div className="text-sm font-medium text-white">
                                            Domains
                                        </div>
                                    </div>
                                    <span className="rounded-full border border-[#242424] px-3 py-1 text-xs text-white">
                                        {data.plan.canUseCustomDomain
                                            ? "Premium"
                                            : "Hosted only"}
                                    </span>
                                </div>

                                <div className="mt-4 rounded-lg border border-[#1f1f1f] bg-[#0e0e0e] p-4">
                                    <div className="text-[11px] uppercase tracking-[0.16em] text-[#5f5f5f]">
                                        {activeCustomDomainUrl
                                            ? "Hosted fallback URL"
                                            : "Hosted URL"}
                                    </div>
                                    {publicUrl ? (
                                        <DomainDisplay
                                            value={publicUrl}
                                            className="mt-2 text-sm text-white"
                                        />
                                    ) : (
                                        <div className="mt-2 break-all text-sm text-white">
                                            Save a slug to generate the hosted URL.
                                        </div>
                                    )}
                                    {previewUrl && previewUrl !== publicUrl ? (
                                        <div className="mt-2 text-xs text-[#777]">
                                            Local preview: {previewUrl}
                                        </div>
                                    ) : null}
                                    {activeCustomDomainUrl ? (
                                        <div className="mt-2 text-xs text-[#777]">
                                            The Route-hosted URL still works, but
                                            customers should use your custom
                                            domain.
                                        </div>
                                    ) : null}
                                </div>

                                {customDomain ? (
                                    <div className="mt-4 rounded-lg border border-[#1f1f1f] bg-[#0e0e0e] p-4">
                                        <div className="text-[11px] uppercase tracking-[0.16em] text-[#5f5f5f]">
                                            {customDomain.status === "active"
                                                ? "Primary public URL"
                                                : "Custom domain URL"}
                                        </div>
                                        <DomainDisplay
                                            value={`https://${customDomain.hostname}`}
                                            className="mt-2 text-sm text-white"
                                        />
                                        <div className="mt-2 text-xs text-[#777]">
                                            {customDomain.status === "active"
                                                ? "Customers visiting this hostname will see your public status page."
                                                : "This hostname becomes the primary public URL once both hostname and SSL are active."}
                                        </div>
                                    </div>
                                ) : null}

                                {!data.plan.canUseCustomDomain ? (
                                    <div className="mt-4 rounded-lg border border-[#2f2417] bg-[#14100b] p-4 text-sm text-[#c8a671]">
                                        Premium projects can connect a custom
                                        hostname like{" "}
                                        <span className="font-mono text-[#f2d5a1]">
                                            status.route.dev
                                        </span>
                                        . Free projects stay on the hosted Route
                                        URL.
                                    </div>
                                ) : (
                                    <div className="mt-4 space-y-4">
                                        {isPremiumCustomDomainDisabled ? (
                                            <div className="rounded-lg border border-[#3a2424] bg-[#160f0f] p-4 text-sm text-[#e0b0b0]">
                                                <div className="flex items-center gap-2 font-medium text-[#ffcfcc]">
                                                    <AlertTriangle className="h-4 w-4" />
                                                    Custom domains are
                                                    temporarily unavailable
                                                </div>
                                                <div className="mt-2">
                                                    {
                                                        STATUS_PAGE_CUSTOM_DOMAIN_DISABLED_REASON
                                                    }
                                                </div>
                                            </div>
                                        ) : !data.domainSetup.isConfigured ? (
                                            <div className="rounded-lg border border-[#3a2d18] bg-[#151109] p-4 text-sm text-[#d2b27b]">
                                                Route-side custom domain setup is
                                                not complete yet. Add the
                                                Cloudflare SaaS env vars before
                                                connecting customer hostnames.
                                            </div>
                                        ) : null}

                                        <div
                                            className={
                                                isPremiumCustomDomainDisabled
                                                    ? "pointer-events-none select-none space-y-4 rounded-lg border border-[#1f1f1f] bg-[#0e0e0e] p-4 opacity-45"
                                                    : "space-y-4"
                                            }
                                            aria-disabled={
                                                isPremiumCustomDomainDisabled
                                            }
                                        >
                                            <div className="space-y-2">
                                                <div className="text-[11px] uppercase tracking-[0.16em] text-[#5f5f5f]">
                                                    Custom hostname
                                                </div>
                                                <TextInput
                                                    value={customDomainInput}
                                                    onChange={(event) =>
                                                        setCustomDomainInput(
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="status.route.dev"
                                                    disabled={
                                                        isPremiumCustomDomainDisabled
                                                    }
                                                />
                                                <div className="text-xs text-[#6d6d6d]">
                                                    Recommended: a dedicated
                                                    subdomain like{" "}
                                                    <span className="font-mono text-[#9f9f9f]">
                                                        status.route.dev
                                                    </span>
                                                    . Point its CNAME to{" "}
                                                    <span className="font-mono text-[#9f9f9f]">
                                                        {data.domainSetup
                                                            .customDomainTarget ??
                                                            "configure in env first"}
                                                    </span>
                                                    .
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        void saveCustomDomain()
                                                    }
                                                    disabled={
                                                        isSavingDomain ||
                                                        !normalizedCustomDomain ||
                                                        !customDomainDirty ||
                                                        !data.domainSetup
                                                            .isConfigured ||
                                                        isPremiumCustomDomainDisabled
                                                    }
                                                    className={
                                                        dashboardButtonClassName
                                                    }
                                                >
                                                    {isSavingDomain ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Save className="h-4 w-4" />
                                                    )}
                                                    {customDomain
                                                        ? "Update domain"
                                                        : "Connect domain"}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        void refreshCustomDomain()
                                                    }
                                                    disabled={
                                                        isRefreshingDomain ||
                                                        !customDomain ||
                                                        isPremiumCustomDomainDisabled
                                                    }
                                                    className="inline-flex items-center gap-2 rounded-md border border-[#242424] bg-[#111] px-4 py-2.5 text-sm text-white transition hover:border-[#363636] disabled:cursor-not-allowed disabled:opacity-55"
                                                >
                                                    {isRefreshingDomain ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <RefreshCw className="h-4 w-4" />
                                                    )}
                                                    Refresh verification
                                                </button>
                                                {customDomain ? (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            void deleteCustomDomain()
                                                        }
                                                        disabled={
                                                            isSavingDomain ||
                                                            isPremiumCustomDomainDisabled
                                                        }
                                                        className="inline-flex items-center gap-2 rounded-md border border-[#3a2424] bg-transparent px-4 py-2.5 text-sm text-[#ffb4b4] transition hover:border-[#553232] disabled:cursor-not-allowed disabled:opacity-55"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Remove domain
                                                    </button>
                                                ) : null}
                                            </div>

                                            {customDomain ? (
                                                <div className="space-y-4 rounded-lg border border-[#1f1f1f] bg-[#0e0e0e] p-4">
                                                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                                        <div>
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <DomainDisplay
                                                                    value={customDomain.hostname}
                                                                    className="text-sm font-medium text-white"
                                                                />
                                                                <span
                                                                    className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium"
                                                                    style={domainBadgeStyle(
                                                                        customDomain.status
                                                                    )}
                                                                >
                                                                    {
                                                                        customDomainState?.label
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div className="mt-2 text-sm text-[#727272]">
                                                                Hostname:{" "}
                                                                {humanizeCloudflareState(
                                                                    customDomain.hostnameStatus,
                                                                    "Pending"
                                                                )}{" "}
                                                                · SSL:{" "}
                                                                {humanizeCloudflareState(
                                                                    customDomain.sslStatus,
                                                                    "Pending"
                                                                )}
                                                            </div>
                                                            <div className="mt-1 text-xs text-[#5f5f5f]">
                                                                Last checked{" "}
                                                                {formatDateTime(
                                                                    customDomain.lastCheckedAt
                                                                )}
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                void copyText(
                                                                    customDomain.hostname,
                                                                    "Custom domain"
                                                                )
                                                            }
                                                            className="inline-flex items-center gap-2 rounded-md border border-[#242424] bg-[#111] px-3 py-2 text-sm text-white transition hover:border-[#363636]"
                                                        >
                                                            <Copy className="h-4 w-4" />
                                                            Copy hostname
                                                        </button>
                                                    </div>

                                                    {customDomain
                                                        .verificationErrors
                                                        .length > 0 ? (
                                                        <div className="rounded-lg border border-[#3a2424] bg-[#160f0f] p-4 text-sm text-[#e0b0b0]">
                                                            <div className="flex items-center gap-2 font-medium text-[#ffcfcc]">
                                                                <AlertTriangle className="h-4 w-4" />
                                                                Verification
                                                                notes
                                                            </div>
                                                            <div className="mt-2 space-y-1">
                                                                {customDomain.verificationErrors.map(
                                                                    (
                                                                        error,
                                                                        index
                                                                    ) => (
                                                                        <div
                                                                            key={`${error}-${index}`}
                                                                        >
                                                                            {
                                                                                error
                                                                            }
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    ) : customDomain.status ===
                                                      "active" ? (
                                                        <div className="rounded-lg border border-[color:var(--status-accent-border)] bg-[color:var(--status-accent-soft)] p-4 text-sm text-[color:var(--status-accent)]">
                                                            <div className="flex items-center gap-2 font-medium text-white">
                                                                <CheckCircle2 className="h-4 w-4" />
                                                                Domain is active
                                                                and serving the
                                                                status page.
                                                            </div>
                                                        </div>
                                                    ) : customDomain.status ===
                                                          "pending" &&
                                                      customDomain.verificationMethod ===
                                                          "txt" &&
                                                      !customDomain.ownershipRecord &&
                                                      customDomain
                                                          .validationRecords
                                                          .length === 0 ? (
                                                        <div className="rounded-lg border border-[#2f2417] bg-[#14100b] p-4 text-sm text-[#d2b27b]">
                                                            Cloudflare has not
                                                            returned any TXT
                                                            verification records
                                                            yet. Start with the
                                                            CNAME below, wait a
                                                            few seconds, then
                                                            click refresh
                                                            verification again.
                                                        </div>
                                                    ) : null}

                                                    <div className="space-y-3">
                                                        <div className="text-[11px] uppercase tracking-[0.16em] text-[#5f5f5f]">
                                                            DNS records to add
                                                        </div>

                                                        <div className="rounded-md border border-[#1d1d1d] bg-[#0a0a0a] p-3">
                                                            <div className="flex items-center justify-between gap-3">
                                                                <div>
                                                                    <div className="text-sm font-medium text-white">
                                                                        CNAME
                                                                    </div>
                                                                    <div className="mt-1 font-mono text-xs text-[#9a9a9a]">
                                                                        {
                                                                            customDomain.hostname
                                                                        }{" "}
                                                                        →{" "}
                                                                        {
                                                                            customDomain.cnameTarget
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        void copyText(
                                                                            `${customDomain.hostname} ${customDomain.cnameTarget}`,
                                                                            "CNAME record"
                                                                        )
                                                                    }
                                                                    className="rounded-md border border-[#242424] px-3 py-2 text-xs text-white transition hover:border-[#363636]"
                                                                >
                                                                    Copy
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {customDomain.ownershipRecord ? (
                                                            <div className="rounded-md border border-[#1d1d1d] bg-[#0a0a0a] p-3">
                                                                <div className="flex items-center justify-between gap-3">
                                                                    <div>
                                                                        <div className="text-sm font-medium text-white">
                                                                            {
                                                                                customDomain
                                                                                    .ownershipRecord
                                                                                    .type
                                                                            }
                                                                        </div>
                                                                        <div className="mt-1 font-mono text-xs text-[#9a9a9a]">
                                                                            {
                                                                                customDomain
                                                                                    .ownershipRecord
                                                                                    .name
                                                                            }{" "}
                                                                            →{" "}
                                                                            {
                                                                                customDomain
                                                                                    .ownershipRecord
                                                                                    .value
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            void copyText(
                                                                                `${customDomain.ownershipRecord!.name} ${customDomain.ownershipRecord!.value}`,
                                                                                "Ownership record"
                                                                            )
                                                                        }
                                                                        className="rounded-md border border-[#242424] px-3 py-2 text-xs text-white transition hover:border-[#363636]"
                                                                    >
                                                                        Copy
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : null}

                                                        {customDomain.validationRecords.map(
                                                            (record, index) => (
                                                                <div
                                                                    key={`${record.name}-${index}`}
                                                                    className="rounded-md border border-[#1d1d1d] bg-[#0a0a0a] p-3"
                                                                >
                                                                    <div className="flex items-center justify-between gap-3">
                                                                        <div>
                                                                            <div className="text-sm font-medium text-white">
                                                                                {
                                                                                    record.type
                                                                                }
                                                                            </div>
                                                                            <div className="mt-1 font-mono text-xs text-[#9a9a9a]">
                                                                                {
                                                                                    record.name
                                                                                }{" "}
                                                                                →{" "}
                                                                                {
                                                                                    record.value
                                                                                }
                                                                            </div>
                                                                            {record.status ? (
                                                                                <div className="mt-1 text-xs text-[#666]">
                                                                                    Status:{" "}
                                                                                    {humanizeCloudflareState(
                                                                                        record.status,
                                                                                        "Pending"
                                                                                    )}
                                                                                </div>
                                                                            ) : null}
                                                                        </div>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                void copyText(
                                                                                    `${record.name} ${record.value}`,
                                                                                    `${record.type} record`
                                                                                )
                                                                            }
                                                                            className="rounded-md border border-[#242424] px-3 py-2 text-xs text-white transition hover:border-[#363636]"
                                                                        >
                                                                            Copy
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <SectionHeader
                        title="Network Snapshot"
                        description="These metrics come directly from the data Route already collects. Nothing synthetic is inferred here."
                    />
                    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                        <div className="rounded-lg border border-[#222] bg-[#090909] p-5">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <div className="text-sm font-medium text-white">
                                        Top ISPs by traffic
                                    </div>
                                    <div className="mt-1 text-sm text-[#777]">
                                        Uses first-party p95 TTFB, which is a
                                        better network signal than full request
                                        duration.
                                    </div>
                                </div>
                                <div className="text-xs uppercase tracking-[0.16em] text-[#5f5f5f]">
                                    {data.metrics.windowLabel}
                                </div>
                            </div>
                            <div className="mt-5 space-y-3">
                                {data.metrics.topIsps.length === 0 ? (
                                    <div className="rounded-lg border border-dashed border-[#2b2b2b] px-4 py-6 text-sm text-[#6f6f6f]">
                                        No recent request data yet.
                                    </div>
                                ) : (
                                    data.metrics.topIsps.map((isp) => (
                                        <div
                                            key={isp.isp}
                                            className="flex items-center justify-between rounded-lg border border-[#1f1f1f] bg-[#0e0e0e] px-4 py-3"
                                        >
                                            <div>
                                                <div className="text-sm font-medium text-white">
                                                    {isp.isp}
                                                </div>
                                                <div className="mt-1 text-xs text-[#747474]">
                                                    {formatNumber(isp.requests)}{" "}
                                                    requests
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 text-right text-sm">
                                                <div>
                                                    <div className="text-[#6f6f6f]">
                                                        P95 TTFB
                                                    </div>
                                                    <div className="text-white">
                                                        {formatMs(
                                                            isp.p95TtfbMs
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-[#6f6f6f]">
                                                        Errors
                                                    </div>
                                                    <div className="text-white">
                                                        {formatPercent(
                                                            isp.errorRate
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="rounded-lg border border-[#222] bg-[#090909] p-5">
                            <div className="text-sm font-medium text-white">
                                Traffic Context
                            </div>
                            <div className="mt-1 text-sm text-[#777]">
                                Helpful facts you can lean on in incident
                                messaging.
                            </div>
                            <div className="mt-5 space-y-4">
                                <div className="rounded-lg border border-[#1f1f1f] bg-[#0e0e0e] p-4">
                                    <div className="text-[11px] uppercase tracking-[0.16em] text-[#5f5f5f]">
                                        Top countries
                                    </div>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {data.metrics.topCountries.length ===
                                        0 ? (
                                            <span className="text-sm text-[#6f6f6f]">
                                                No recent geography data yet.
                                            </span>
                                        ) : (
                                            data.metrics.topCountries.map(
                                                (country) => (
                                                    <span
                                                        key={country.country}
                                                        title={normalizeCountryDisplayName(
                                                            country.country
                                                        )}
                                                        aria-label={normalizeCountryDisplayName(
                                                            country.country
                                                        )}
                                                        className="inline-flex items-center gap-2 rounded-full border border-[#242424] px-3 py-1.5 text-sm text-white"
                                                    >
                                                        {getCountryFlagSrc(
                                                            country.country
                                                        ) ? (
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
                                                            <span className="text-[10px] text-[#8d8d8d]">
                                                                --
                                                            </span>
                                                        )}
                                                        <span>
                                                            ·{" "}
                                                            {formatNumber(
                                                                country.requests
                                                            )}
                                                        </span>
                                                    </span>
                                                )
                                            )
                                        )}
                                    </div>
                                </div>
                                <div className="rounded-lg border border-[#1f1f1f] bg-[#0e0e0e] p-4">
                                    <div className="text-[11px] uppercase tracking-[0.16em] text-[#5f5f5f]">
                                        Core Web Vitals samples
                                    </div>
                                    <div className="mt-3 text-2xl font-semibold tracking-tight text-white">
                                        {formatNumber(
                                            data.metrics.vitalsSamples24h
                                        )}
                                    </div>
                                    <div className="mt-1 text-sm text-[#727272]">
                                        {formatNumber(
                                            data.metrics.goodVitalsSamples24h
                                        )}{" "}
                                        good samples in the same window.
                                    </div>
                                </div>
                                <div className="rounded-lg border border-[#1f1f1f] bg-[#0e0e0e] p-4">
                                    <div className="text-[11px] uppercase tracking-[0.16em] text-[#5f5f5f]">
                                        Latest data seen
                                    </div>
                                    <div className="mt-3 text-sm text-white">
                                        {formatDateTime(
                                            data.metrics.latestDataAt
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <SectionHeader
                        title="Uptime Monitors"
                        description={
                            data.plan.canUseUptimeMonitoring
                                ? `Scheduled URL checks run every ${data.plan.uptimeCheckIntervalSeconds} seconds. ${data.plan.name} includes ${data.plan.maxUptimeMonitors} monitored URL${data.plan.maxUptimeMonitors === 1 ? "" : "s"}.`
                                : "Uptime monitoring is available on paid plans."
                        }
                        action={
                            <button
                                type="button"
                                onClick={() =>
                                    setUptimeMonitorDraft(
                                        emptyUptimeMonitorDraft(
                                            data.plan.uptimeCheckTimeoutMs
                                        )
                                    )
                                }
                                disabled={!canAddUptimeMonitor}
                                className={dashboardButtonClassName}
                            >
                                <Plus className="h-4 w-4" />
                                Add monitor
                            </button>
                        }
                    />

                    {!data.plan.canUseUptimeMonitoring ? (
                        <div className="rounded-lg border border-[#2f2718] bg-[#121009] p-5">
                            <div className="flex items-start gap-3">
                                <ShieldCheck className="mt-0.5 h-5 w-5 text-[#d2b27b]" />
                                <div>
                                    <div className="text-sm font-medium text-white">
                                        Upgrade to monitor URLs
                                    </div>
                                    <div className="mt-1 text-sm leading-6 text-[#9f8f72]">
                                        Pro includes 3 monitored URLs and Premium includes
                                        10. These limits come from billing config and are
                                        enforced by the API.
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : data.uptimeMonitors.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-[#2b2b2b] bg-[#090909] px-6 py-12 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg border border-[#242424] bg-[#0f0f0f]">
                                <Zap className="h-5 w-5 text-white" />
                            </div>
                            <div className="mt-4 text-lg font-medium text-white">
                                No uptime monitors yet
                            </div>
                            <p className="mt-2 text-sm text-[#727272]">
                                Add health endpoints for your website, API, auth,
                                checkout, or other public services.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 xl:grid-cols-2">
                            {data.uptimeMonitors.map((monitor) => {
                                const latestStatus = monitor.latestCheck?.status ?? null;
                                return (
                                    <div
                                        key={monitor.id}
                                        className="min-w-0 rounded-lg border border-[#222] bg-[#090909] p-5"
                                    >
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <div className="break-words text-base font-semibold text-white">
                                                        {monitor.name}
                                                    </div>
                                                    <Pill
                                                        label={uptimeStatusLabel(latestStatus)}
                                                        tone={uptimeStatusTone(latestStatus)}
                                                    />
                                                    {!monitor.isEnabled ? (
                                                        <span className="rounded-full border border-[#252525] px-2.5 py-1 text-xs text-[#8d8d8d]">
                                                            Paused
                                                        </span>
                                                    ) : null}
                                                    {!monitor.isVisible ? (
                                                        <span className="rounded-full border border-[#252525] px-2.5 py-1 text-xs text-[#8d8d8d]">
                                                            Hidden
                                                        </span>
                                                    ) : null}
                                                </div>
                                                <div className="mt-3 break-all font-mono text-xs text-[#8a8a8a]">
                                                    {monitor.method} {monitor.url}
                                                </div>
                                                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                                                    {monitor.emailEnabled ? (
                                                        <span className="inline-flex items-center gap-1 rounded border border-[#252525] bg-[#0f0f0f] px-2 py-1 text-xs text-[#b8b8b8]">
                                                            <Mail className="h-3 w-3" />
                                                            Email
                                                        </span>
                                                    ) : null}
                                                    {data.plan.canUseWebhooks && monitor.webhookEnabled ? (
                                                        <span className="inline-flex items-center gap-1 rounded border border-[#252525] bg-[#0f0f0f] px-2 py-1 text-xs text-[#b8b8b8]">
                                                            <Globe className="h-3 w-3" />
                                                            Webhook
                                                        </span>
                                                    ) : null}
                                                    {data.plan.canUseSlackAlerts && monitor.slackEnabled ? (
                                                        <span className="inline-flex items-center gap-1 rounded border border-[#252525] bg-[#0f0f0f] px-2 py-1 text-xs text-[#b8b8b8]">
                                                            <BellRing className="h-3 w-3" />
                                                            Slack
                                                        </span>
                                                    ) : null}
                                                    {!monitor.emailEnabled &&
                                                    (!data.plan.canUseWebhooks || !monitor.webhookEnabled) &&
                                                    (!data.plan.canUseSlackAlerts || !monitor.slackEnabled) ? (
                                                        <span className="text-xs text-[#666]">
                                                            No alert channels
                                                        </span>
                                                    ) : null}
                                                </div>
                                                <div className="mt-3 text-sm text-[#646464]">
                                                    Last checked {formatDateTime(monitor.latestCheck?.checkedAt)}
                                                    {monitor.latestCheck?.statusCode
                                                        ? ` · HTTP ${monitor.latestCheck.statusCode}`
                                                        : ""}
                                                    {monitor.latestCheck?.errorMessage
                                                        ? ` · ${monitor.latestCheck.errorMessage}`
                                                        : ""}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setUptimeMonitorDraft(
                                                            monitorToDraft(monitor)
                                                        )
                                                    }
                                                    className="rounded-md border border-[#242424] p-2 text-[#b0b0b0] transition hover:border-[#363636] hover:text-white"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        void deleteUptimeMonitor(
                                                            monitor
                                                        )
                                                    }
                                                    className="rounded-md border border-[#2d1b1b] p-2 text-[#ffb4b4] transition hover:border-[#553232]"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <UptimeBarStrip history30d={monitor.history30d ?? []} />

                                        <div className="mt-5 grid gap-3 sm:grid-cols-3">
                                            <div className="rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-3">
                                                <div className="text-[11px] uppercase tracking-[0.14em] text-[#626262]">
                                                    24h uptime
                                                </div>
                                                <div className="mt-2 text-sm font-medium text-white">
                                                    {formatPercent(monitor.stats24h.uptimePercent)}
                                                </div>
                                            </div>
                                            <div className="rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-3">
                                                <div className="text-[11px] uppercase tracking-[0.14em] text-[#626262]">
                                                    Avg latency
                                                </div>
                                                <div className="mt-2 text-sm font-medium text-white">
                                                    {formatMs(monitor.stats24h.avgResponseTimeMs)}
                                                </div>
                                            </div>
                                            <div className="rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-3">
                                                <div className="text-[11px] uppercase tracking-[0.14em] text-[#626262]">
                                                    P95 latency
                                                </div>
                                                <div className="mt-2 text-sm font-medium text-white">
                                                    {formatMs(monitor.stats24h.p95ResponseTimeMs)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {data.plan.canUseUptimeMonitoring ? (
                        <div className="text-sm text-[#727272]">
                            Monitor usage: {uptimeLimitLabel}. Timeout cap:{" "}
                            {formatMs(data.plan.uptimeCheckTimeoutMs)}.
                        </div>
                    ) : null}
                </section>

                <section className="space-y-6">
                    <SectionHeader
                        title="Components"
                        description="These are the services customers will see on the public page. Their public health is derived from alert history."
                        action={
                            <button
                                type="button"
                                onClick={() =>
                                    setComponentDraft(emptyComponentDraft())
                                }
                                className={dashboardButtonClassName}
                            >
                                <Plus className="h-4 w-4" />
                                Add component
                            </button>
                        }
                    />
                    {data.components.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-[#2b2b2b] bg-[#090909] px-6 py-12 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg border border-[#242424] bg-[#0f0f0f]">
                                <Globe className="h-5 w-5 text-white" />
                            </div>
                            <div className="mt-4 text-lg font-medium text-white">
                                No components yet
                            </div>
                            <p className="mt-2 text-sm text-[#727272]">
                                Start with public-facing services like Website,
                                API, Checkout, Auth, or Search.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 xl:grid-cols-2">
                            {data.components.map((component) => (
                                <div
                                    key={component.id}
                                    className="rounded-lg border border-[#222] bg-[#090909] p-5"
                                >
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <div className="text-base font-semibold text-white">
                                                    {component.name}
                                                </div>
                                                <Pill
                                                    label={
                                                        STATUS_PAGE_STATUS_META[
                                                            component
                                                                .derivedStatus
                                                        ].shortLabel
                                                    }
                                                    tone={
                                                        component.derivedStatus
                                                    }
                                                />
                                                <span className="rounded-full border border-[#252525] px-2.5 py-1 text-xs text-[#8d8d8d]">
                                                    {component.sourceType ===
                                                    "manual"
                                                        ? "Legacy manual"
                                                        : "Alert driven"}
                                                </span>
                                                {!component.isVisible ? (
                                                    <span className="rounded-full border border-[#252525] px-2.5 py-1 text-xs text-[#8d8d8d]">
                                                        Hidden
                                                    </span>
                                                ) : null}
                                            </div>
                                            <div className="mt-3 text-sm leading-6 text-[#7d7d7d]">
                                                {component.description ||
                                                    "No description yet."}
                                            </div>
                                            <div className="mt-3 text-sm text-[#646464]">
                                                {component.statusReason}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setComponentDraft(
                                                        componentToDraft(
                                                            component
                                                        )
                                                    )
                                                }
                                                className="rounded-md border border-[#242424] p-2 text-[#b0b0b0] transition hover:border-[#363636] hover:text-white"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    void deleteComponent(
                                                        component
                                                    )
                                                }
                                                className="rounded-md border border-[#2d1b1b] p-2 text-[#ffb4b4] transition hover:border-[#553232]"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {component.linkedAlertRules.length > 0 ? (
                                        <div className="mt-5 space-y-2">
                                            {component.linkedAlertRules.map(
                                                (
                                                    rule: StatusPageLinkedAlertRule
                                                ) => (
                                                    <div
                                                        key={rule.id}
                                                        className="rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] px-4 py-3"
                                                    >
                                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                            <div>
                                                                <div className="text-sm font-medium text-white">
                                                                    {rule.name}
                                                                </div>
                                                                <div className="mt-1 text-xs text-[#747474]">
                                                                    Latest
                                                                    evaluation:{" "}
                                                                    {rule.latestStatus
                                                                        ? rule.latestStatus.replace(
                                                                              /_/g,
                                                                              " "
                                                                          )
                                                                        : "No data yet"}
                                                                    {rule.latestStatusAt
                                                                        ? ` · ${formatDateTime(rule.latestStatusAt)}`
                                                                        : ""}
                                                                </div>
                                                            </div>
                                                            <Pill
                                                                label={
                                                                    STATUS_PAGE_STATUS_META[
                                                                        rule
                                                                            .publicStatus
                                                                    ].shortLabel
                                                                }
                                                                tone={
                                                                    rule.publicStatus
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section className="space-y-6">
                    <SectionHeader
                        title="Incidents"
                        description="Incidents stay manual on purpose so the public narrative is precise, calm, and customer-safe."
                        action={
                            <button
                                type="button"
                                onClick={() =>
                                    setIncidentDraft(emptyIncidentDraft())
                                }
                                className={dashboardButtonClassName}
                            >
                                <Plus className="h-4 w-4" />
                                Create incident
                            </button>
                        }
                    />

                    {data.incidents.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-[#2b2b2b] bg-[#090909] px-6 py-12 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg border border-[#242424] bg-[#0f0f0f]">
                                <BellRing className="h-5 w-5 text-white" />
                            </div>
                            <div className="mt-4 text-lg font-medium text-white">
                                No incidents yet
                            </div>
                            <p className="mt-2 text-sm text-[#727272]">
                                When a real issue needs public communication,
                                create an incident and keep the timeline updated
                                here.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {data.incidents.map((incident) => (
                                <div
                                    key={incident.id}
                                    className="rounded-lg border border-[#222] bg-[#090909] p-5"
                                >
                                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <div className="text-lg font-semibold tracking-tight text-white">
                                                    {incident.title}
                                                </div>
                                                <Pill
                                                    label={incident.status.replace(
                                                        /^\w/,
                                                        (value) =>
                                                            value.toUpperCase()
                                                    )}
                                                    tone={
                                                        incident.isActive
                                                            ? "degraded_performance"
                                                            : "operational"
                                                    }
                                                />
                                                <span className="rounded-full border border-[#252525] px-2.5 py-1 text-xs text-[#8d8d8d]">
                                                    {incident.impact
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        incident.impact.slice(
                                                            1
                                                        )}{" "}
                                                    impact
                                                </span>
                                            </div>
                                            <div className="mt-3 max-w-3xl text-sm leading-6 text-[#7c7c7c]">
                                                {incident.summary}
                                            </div>
                                            <div className="mt-4 flex flex-wrap gap-2 text-xs text-[#707070]">
                                                <span>
                                                    Started{" "}
                                                    {formatDateTime(
                                                        incident.startedAt
                                                    )}
                                                </span>
                                                {incident.resolvedAt ? (
                                                    <span>
                                                        Resolved{" "}
                                                        {formatDateTime(
                                                            incident.resolvedAt
                                                        )}
                                                    </span>
                                                ) : null}
                                                {incident.affectedRegions
                                                    .length > 0 ? (
                                                    <span>
                                                        Regions:{" "}
                                                        {incident.affectedRegions.join(
                                                            ", "
                                                        )}
                                                    </span>
                                                ) : null}
                                                {incident.affectedIsps.length >
                                                0 ? (
                                                    <span>
                                                        ISPs:{" "}
                                                        {incident.affectedIsps.join(
                                                            ", "
                                                        )}
                                                    </span>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setIncidentUpdateDraft({
                                                        incidentId: incident.id,
                                                        title: incident.title,
                                                        status: incident.status,
                                                        message: "",
                                                    })
                                                }
                                                className="inline-flex items-center gap-2 rounded-md border border-[#242424] px-3 py-2 text-sm text-white transition hover:border-[#363636]"
                                            >
                                                <Zap className="h-4 w-4" />
                                                Post update
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setIncidentDraft(
                                                        incidentToDraft(
                                                            incident
                                                        )
                                                    )
                                                }
                                                className="rounded-md border border-[#242424] p-2 text-[#b0b0b0] transition hover:border-[#363636] hover:text-white"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    void deleteIncident(
                                                        incident
                                                    )
                                                }
                                                className="rounded-md border border-[#2d1b1b] p-2 text-[#ffb4b4] transition hover:border-[#553232]"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {incident.affectedComponents.length > 0 ? (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {incident.affectedComponents.map(
                                                (component) => (
                                                    <span
                                                        key={component.id}
                                                        className="rounded-full border border-[#242424] px-3 py-1.5 text-xs text-white"
                                                    >
                                                        {component.name}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    ) : null}

                                    <div className="mt-5 space-y-3 border-t border-[#171717] pt-5">
                                        {incident.updates.map((update) => (
                                            <div
                                                key={update.id}
                                                className="rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4"
                                            >
                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                    <div>
                                                        <div className="text-sm font-medium text-white">
                                                            {update.status.replace(
                                                                /^\w/,
                                                                (value) =>
                                                                    value.toUpperCase()
                                                            )}
                                                        </div>
                                                        <div className="mt-2 text-sm leading-6 text-[#7a7a7a]">
                                                            {update.message}
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-[#666]">
                                                        {formatDateTime(
                                                            update.createdAt
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {componentDraft ? (
                <ComponentModal
                    draft={componentDraft}
                    availableAlertRules={data.availableAlertRules}
                    isSubmitting={isSubmittingModal}
                    onClose={() => setComponentDraft(null)}
                    onChange={setComponentDraft}
                    onSubmit={() => void saveComponent()}
                />
            ) : null}

            {uptimeMonitorDraft ? (
                <UptimeMonitorModal
                    draft={uptimeMonitorDraft}
                    maxTimeoutMs={data.plan.uptimeCheckTimeoutMs}
                    canUseWebhooks={data.plan.canUseWebhooks}
                    canUseSlackAlerts={data.plan.canUseSlackAlerts}
                    slackStatus={slackStatus}
                    isSubmitting={isSubmittingModal}
                    onClose={() => setUptimeMonitorDraft(null)}
                    onChange={setUptimeMonitorDraft}
                    onSubmit={() => void saveUptimeMonitor()}
                />
            ) : null}

            {incidentDraft ? (
                <IncidentModal
                    draft={incidentDraft}
                    components={data.components}
                    isSubmitting={isSubmittingModal}
                    onClose={() => setIncidentDraft(null)}
                    onChange={setIncidentDraft}
                    onSubmit={() => void saveIncident()}
                />
            ) : null}

            {incidentUpdateDraft ? (
                <IncidentUpdateModal
                    draft={incidentUpdateDraft}
                    isSubmitting={isSubmittingModal}
                    onClose={() => setIncidentUpdateDraft(null)}
                    onChange={setIncidentUpdateDraft}
                    onSubmit={() => void postIncidentUpdate()}
                />
            ) : null}

            <ConfirmModal
                title={confirmModal.title}
                description={confirmModal.description}
                itemName={confirmModal.itemName}
                isOpen={confirmModal.isOpen}
                isLoading={confirmModal.isLoading}
                onClose={() =>
                    setConfirmModal((prev) => ({ ...prev, isOpen: false }))
                }
                onConfirm={confirmModal.onConfirm}
            />
        </div>
    );
}
