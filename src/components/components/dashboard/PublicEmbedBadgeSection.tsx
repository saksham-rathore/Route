'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Copy, Loader2 } from '@/components/dashboard/icons';
import {
  type PublicBadgeMode,
  type PublicBadgeMetric,
  type PublicBadgePeriodDays,
  type PublicBadgePosition,
  type PublicBadgeTheme,
  useGetProjectSettingsQuery,
  useUpdateProjectSettingsMutation,
  isQueryPending,
  shouldShowQueryError,
} from '@/lib/redux';
import { useToast, ToastContainer } from '@/components/ui/Toast';
import { DashboardSection } from '@/components/dashboard/DashboardSection';
import { trackEvent, RouteEvents } from '@/lib/analytics/route-analytics';
import { DashboardQueryError, DashboardQueryLoading } from '@/components/dashboard/DashboardQueryStatus';

const BEACON_SCRIPT_BASE = process.env.NEXT_PUBLIC_BEACON_SCRIPT_URL || 'https://t.route.dev';
const BADGE_SCRIPT_SRC = `${BEACON_SCRIPT_BASE}/badge.js`;
const BADGE_LOGO_URL = 'https://cdn.route.dev/images/favicon.png';
const BADGE_PREVIEW_LIVE_COUNT = 12;
const BADGE_PREVIEW_STAT_VALUE_BY_METRIC: Record<PublicBadgeMetric, number> = {
  views: 1248,
  visitors: 342,
  visits: 611,
};
const MAX_BADGE_EXCLUDED_PAGE_PATTERNS = 50;
const MAX_BADGE_EXCLUDED_PAGE_PATTERN_LENGTH = 500;
const BADGE_PREVIEW_CSS = `
.route-badge-preview-root{display:inline-flex;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#0f172a}
.route-badge-preview-root .route-live-widget,.route-badge-preview-root .route-live-widget:visited,.route-badge-preview-root .route-live-widget:hover,.route-badge-preview-root .route-live-widget:active{color:var(--route-badge-text);text-decoration:none!important}
@keyframes route-live-pulse{0%{box-shadow:0 0 0 0 var(--route-badge-pulse),0 0 0 1px var(--route-badge-dot-ring)}70%{box-shadow:0 0 0 7px rgba(22,163,97,0),0 0 0 1px var(--route-badge-dot-ring)}100%{box-shadow:0 0 0 0 rgba(22,163,97,0),0 0 0 1px var(--route-badge-dot-ring)}}
.route-badge-preview-root .route-live-widget{--route-badge-surface:#fff;--route-badge-surface-hover:#f8fafc;--route-badge-surface-soft:#f8fafc;--route-badge-border:rgba(15,23,42,.08);--route-badge-text:#0f172a;--route-badge-soft:#4b5565;--route-badge-muted:#738094;--route-badge-shadow:inset 0 0 0 1px rgba(15,23,42,.04),0 1px 0 rgba(15,23,42,.02),0 10px 24px rgba(15,23,42,.06);--route-badge-logo-bg:#f8fafc;--route-badge-logo-border:rgba(15,23,42,.06);--route-badge-accent:#14b8a6;--route-badge-blue:#275fc8;--route-badge-blue-soft:rgba(39,95,200,.12);--route-badge-dot-ring:rgba(15,23,42,.08);--route-badge-pulse:rgba(20,184,166,.3);position:relative;box-sizing:border-box;display:inline-flex;align-items:center;gap:10px;min-width:0;padding:8px 12px 8px 8px;border:1px solid var(--route-badge-border);border-radius:8px;background:var(--route-badge-surface);box-shadow:var(--route-badge-shadow);white-space:nowrap;-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision;transition:background .16s ease,box-shadow .16s ease}
.route-badge-preview-root .route-live-widget[data-theme="dark"]{--route-badge-surface:#171717;--route-badge-surface-hover:#202020;--route-badge-surface-soft:#1c1c1c;--route-badge-border:rgba(255,255,255,.08);--route-badge-text:#f3f5f6;--route-badge-soft:#b3bac3;--route-badge-muted:#858f9c;--route-badge-shadow:inset 0 1px 0 rgba(255,255,255,.025),0 1px 1px rgba(0,0,0,.12),0 10px 24px rgba(0,0,0,.18);--route-badge-logo-bg:#1c1c1c;--route-badge-logo-border:rgba(255,255,255,.08);--route-badge-accent:#36c4b7;--route-badge-blue:#5b8def;--route-badge-blue-soft:rgba(91,141,239,.16);--route-badge-dot-ring:rgba(255,255,255,.1);--route-badge-pulse:rgba(54,196,183,.3)}
.route-badge-preview-root .route-live-widget:hover{background:var(--route-badge-surface-hover)}
.route-badge-preview-root .route-live-widget:focus-visible{outline:3px solid var(--route-badge-blue-soft);outline-offset:3px}
.route-badge-preview-root .route-live-logo{position:relative;width:26px;height:26px;border-radius:7px;display:grid;place-items:center;background:var(--route-badge-surface-soft);border:1px solid var(--route-badge-logo-border);box-shadow:inset 0 1px 0 rgba(255,255,255,.04);flex:0 0 auto}
.route-badge-preview-root .route-live-logo img{width:15px;height:15px;display:block;border-radius:4px}
.route-badge-preview-root .route-live-dot{position:absolute;right:-3px;bottom:-3px;width:8px;height:8px;border-radius:50%;background:var(--route-badge-muted);border:2px solid var(--route-badge-surface);box-sizing:content-box;box-shadow:0 0 0 1px var(--route-badge-dot-ring)}
.route-badge-preview-root .route-live-widget[data-status="live"] .route-live-dot{background:var(--route-badge-accent);animation:route-live-pulse 1.8s ease-out infinite}
.route-badge-preview-root .route-live-widget[data-mode="stats"] .route-live-dot{background:var(--route-badge-blue);animation:none;box-shadow:0 0 0 1px var(--route-badge-dot-ring),0 0 0 4px var(--route-badge-blue-soft)}
.route-badge-preview-root .route-live-body{display:inline-flex;align-items:center;gap:8px;min-width:0}
.route-badge-preview-root .route-live-metric{display:inline-flex;align-items:baseline;gap:5px;min-width:0}
.route-badge-preview-root .route-live-count,.route-badge-preview-root .route-stat-count{font-size:14px;line-height:18px;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-.01em;color:var(--route-badge-text);min-width:10px}
.route-badge-preview-root .route-live-label,.route-badge-preview-root .route-stat-label{font-size:12px;line-height:16px;font-weight:600;color:var(--route-badge-soft)}
.route-badge-preview-root .route-stat-period{font-size:10px;line-height:14px;font-weight:700;color:var(--route-badge-blue);background:var(--route-badge-blue-soft);border:1px solid var(--route-badge-border);border-radius:6px;padding:1px 5px}
.route-badge-preview-root .route-live-separator{width:1px;height:18px;background:var(--route-badge-border);display:none}
.route-badge-preview-root .route-live-brand{font-size:10.5px;line-height:15px;font-weight:600;color:var(--route-badge-muted)}
.route-badge-preview-root .route-live-widget[data-mode="live"] .route-stat-metric,.route-badge-preview-root .route-live-widget[data-mode="live"] .route-live-separator{display:none}
.route-badge-preview-root .route-live-widget[data-mode="stats"] .route-presence-metric,.route-badge-preview-root .route-live-widget[data-mode="stats"] .route-live-separator{display:none}
.route-badge-preview-root .route-live-widget[data-mode="both"] .route-live-separator{display:inline-block}
@media (max-width:360px){.route-badge-preview-root .route-live-widget{padding:7px 9px 7px 7px;gap:7px}.route-badge-preview-root .route-live-brand{display:none}.route-badge-preview-root .route-stat-period{display:none}}
`;

/** Same shell as `DashboardRightRail` installation snippet (neutral input surface, no blue tint). */
const SNIPPET_SHELL =
  'rounded-md bg-[color:var(--dash-input-bg)] px-3 py-2.5 shadow-[var(--dash-control-shadow)]';
const SNIPPET_PRE =
  'overflow-x-auto text-[11px] leading-[1.55] text-[color:var(--dash-code-text)] sm:text-xs sm:leading-relaxed';

const BADGE_MODE_OPTIONS: { value: PublicBadgeMode; label: string }[] = [
  { value: 'live', label: 'Live visitors only' },
  { value: 'stats', label: 'Rolling stats only' },
  { value: 'both', label: 'Live visitors + stats' },
];

const BADGE_METRIC_OPTIONS: { value: PublicBadgeMetric; label: string }[] = [
  { value: 'views', label: 'Page views' },
  { value: 'visitors', label: 'Unique visitors' },
  { value: 'visits', label: 'Visits' },
];

const BADGE_PERIOD_OPTIONS: { value: PublicBadgePeriodDays; label: string }[] = [
  { value: 7, label: 'Last 7 days' },
  { value: 30, label: 'Last 30 days' },
];

const BADGE_THEME_OPTIONS: { value: PublicBadgeTheme; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

const BADGE_POSITION_OPTIONS: { value: PublicBadgePosition; label: string }[] = [
  { value: 'top-left', label: 'Top left' },
  { value: 'top-right', label: 'Top right' },
  { value: 'bottom-left', label: 'Bottom left' },
  { value: 'bottom-right', label: 'Bottom right' },
];

function normalizeBadgeTheme(theme: unknown): PublicBadgeTheme {
  return theme === 'dark' ? 'dark' : 'light';
}

function normalizeBadgePosition(position: unknown): PublicBadgePosition {
  return BADGE_POSITION_OPTIONS.some((option) => option.value === position)
    ? (position as PublicBadgePosition)
    : 'bottom-right';
}

function normalizeBadgeExcludedPages(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const item of value) {
    if (typeof item !== 'string') continue;

    const pattern = item.trim();
    if (!pattern || seen.has(pattern)) continue;

    seen.add(pattern);
    normalized.push(pattern);
  }

  return normalized;
}

function normalizeBadgeExcludedPagesText(value: string): string[] {
  return normalizeBadgeExcludedPages(value.split(/\r?\n/));
}

function badgeExcludedPagesText(value: unknown): string {
  return normalizeBadgeExcludedPages(value).join('\n');
}

function arraysEqual(a: readonly string[], b: readonly string[]) {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function getBadgeExcludedPagesError(patterns: readonly string[]): string | null {
  if (patterns.length > MAX_BADGE_EXCLUDED_PAGE_PATTERNS) {
    return `Add ${MAX_BADGE_EXCLUDED_PAGE_PATTERNS} exclusion patterns or fewer.`;
  }

  for (const pattern of patterns) {
    if (pattern.length > MAX_BADGE_EXCLUDED_PAGE_PATTERN_LENGTH) {
      return `Keep each exclusion pattern under ${MAX_BADGE_EXCLUDED_PAGE_PATTERN_LENGTH} characters.`;
    }

    if (pattern.startsWith('regex:')) {
      try {
        new RegExp(pattern.slice('regex:'.length));
      } catch {
        return `Invalid regex pattern: ${pattern}`;
      }
    }
  }

  return null;
}

function formatBadgePreviewNumber(value: number, compact = false) {
  return new Intl.NumberFormat(undefined, compact ? { notation: 'compact', maximumFractionDigits: 1 } : undefined).format(
    Math.max(0, Math.round(value)),
  );
}

function badgeMetricLabel(metric: PublicBadgeMetric, value: number) {
  const rounded = Math.round(value);
  if (metric === 'visitors') return rounded === 1 ? 'visitor' : 'visitors';
  if (metric === 'visits') return rounded === 1 ? 'visit' : 'visits';
  return rounded === 1 ? 'view' : 'views';
}

function badgeReferralHref(domain: string, path = '/') {
  const params = new URLSearchParams({
    utm_source: domain || 'route.dev',
    utm_medium: 'referral',
    utm_campaign: 'public_badge',
    utm_content: path,
  });

  return `https://route.dev/?${params.toString()}`;
}

/** Same shell as `DashboardSelectMenu` in `DashboardClient.tsx` (dashboard-control + dashboard-menu). */
function EmbedSelect<V extends string | number>({
  id,
  label,
  value,
  onChange,
  options,
  className = '',
}: {
  id: string;
  label: string;
  value: V;
  onChange: (next: V) => void;
  options: readonly { value: V; label: string }[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`relative w-full ${className}`}>
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="dashboard-control flex w-full min-w-0 items-center justify-between gap-3 px-3 py-2.5 text-left text-sm transition-colors"
      >
        <span className="min-w-0 truncate font-medium text-[color:var(--dash-text)]">
          {label}: {current?.label ?? '-'}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[color:var(--dash-text-muted)] transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open ? (
        <div
          role="listbox"
          aria-labelledby={id}
          className="dashboard-menu absolute left-0 top-full z-[400] mt-2 min-w-full overflow-hidden py-1 sm:min-w-[180px]"
        >
            {options.map((opt) => {
              const selected = opt.value === value;
              return (
                <button
                  key={String(opt.value)}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={`flex w-full items-center px-3 py-2 text-left text-sm transition-colors ${
                    selected
                      ? 'bg-[color:color-mix(in_srgb,var(--dash-blue)_14%,transparent)] text-[color:var(--dash-blue)]'
                      : 'text-[color:var(--dash-text-soft)] hover:bg-[color:var(--dash-surface-hover)] hover:text-[color:var(--dash-text)]'
                  }`}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                >
                  {label}: {opt.label}
                </button>
              );
            })}
        </div>
      ) : null}
    </div>
  );
}

function BadgeLivePreview({
  mode,
  metric,
  periodDays,
  theme,
  sticky,
  position,
  domain,
  onThemeChange,
}: {
  mode: PublicBadgeMode;
  metric: PublicBadgeMetric;
  periodDays: PublicBadgePeriodDays;
  theme: PublicBadgeTheme;
  sticky: boolean;
  position: PublicBadgePosition;
  domain: string;
  onThemeChange: (theme: PublicBadgeTheme) => void;
}) {
  const showLive = mode === 'live' || mode === 'both';
  const showStats = mode === 'stats' || mode === 'both';
  const statValue = BADGE_PREVIEW_STAT_VALUE_BY_METRIC[metric];
  const statLabel = badgeMetricLabel(metric, statValue);
  const previewPosition = sticky ? position : 'bottom-left';
  const ariaLabel = [
    'Route badge preview',
    showLive ? `${formatBadgePreviewNumber(BADGE_PREVIEW_LIVE_COUNT)} live now` : null,
    showStats ? `${formatBadgePreviewNumber(statValue, true)} ${statLabel}` : null,
  ]
    .filter(Boolean)
    .join(', ');
  const previewHref = badgeReferralHref(domain);

  return (
    <div className="mt-5 rounded-xl border border-[color:var(--dash-divider)] bg-[color:var(--dash-input-bg)] p-5">
      <div className="space-y-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[color:var(--dash-text-muted)]">
            Live preview
          </p>
          <p className="mt-1 text-xs text-[color:var(--dash-text-soft)]">
            Preview both badge themes. The selected theme is used in the copied embed snippet.
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <style>{BADGE_PREVIEW_CSS}</style>
          {BADGE_THEME_OPTIONS.map((themeOption) => {
            const selected = themeOption.value === theme;

            return (
            <button
              type="button"
              key={themeOption.value}
              onClick={() => onThemeChange(themeOption.value)}
              aria-pressed={selected}
              className={`rounded-2xl border p-4 text-left shadow-[var(--dash-card-shadow)] transition-colors ${
                selected
                  ? 'border-[color:var(--dash-blue)] bg-[color:var(--dash-surface)]'
                  : 'border-[color:var(--dash-divider)] bg-[color:var(--dash-surface)] hover:border-[color:var(--dash-border-strong)] hover:bg-[color:var(--dash-surface-hover)]'
              }`}
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-[color:var(--dash-text)]">{themeOption.label}</span>
                <span
                  aria-label={selected ? 'Selected theme' : undefined}
                  className={`grid h-4 w-4 place-items-center rounded-full border ${
                    selected
                      ? 'border-[color:var(--dash-blue)] bg-[color:var(--dash-blue-soft)]'
                      : 'border-[color:var(--dash-divider)]'
                  }`}
                >
                  {selected ? <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--dash-blue)]" /> : null}
                </span>
              </div>
              <div className="route-badge-preview-root">
                <a
                  className="route-live-widget"
                  data-mode={mode}
                  data-theme={themeOption.value}
                  data-status={showLive ? 'live' : 'static'}
                  href={previewHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${themeOption.label} ${ariaLabel}`}
                  onClick={(event) => event.preventDefault()}
                  tabIndex={-1}
                >
                  <span className="route-live-logo">
                    <img alt="" src={BADGE_LOGO_URL} />
                    <span className="route-live-dot" />
                  </span>
                  <span className="route-live-body">
                    <span className="route-live-metric route-presence-metric">
                      <span className="route-live-count" aria-live="polite">
                        {formatBadgePreviewNumber(BADGE_PREVIEW_LIVE_COUNT)}
                      </span>
                      <span className="route-live-label">live now</span>
                    </span>
                    <span className="route-live-separator" />
                    <span className="route-live-metric route-stat-metric">
                      <span className="route-stat-count">{formatBadgePreviewNumber(statValue, true)}</span>
                      <span className="route-stat-label">{statLabel}</span>
                      <span className="route-stat-period" title={`last ${periodDays} days`}>
                        {periodDays}d
                      </span>
                    </span>
                    <span className="route-live-brand">by Route</span>
                  </span>
                </a>
              </div>
            </button>
          )})}
        </div>

        <div className="rounded-lg border border-[color:var(--dash-divider)] bg-[color:var(--dash-surface)] p-3">
          <div className="relative h-28 overflow-hidden rounded-md border border-[color:var(--dash-divider)] bg-[color:var(--dash-input-bg)]">
            <div className="absolute left-3 right-3 top-3 h-2 rounded-full bg-[color:var(--dash-divider)]" />
            <div className="absolute left-3 top-8 h-2 w-16 rounded-full bg-[color:var(--dash-divider)]" />
            <div
              className={`absolute ${previewPosition.includes('top') ? 'top-3' : 'bottom-3'} ${
                previewPosition.includes('left') ? 'left-3' : 'right-3'
              }`}
            >
              <div className="route-badge-preview-root scale-[0.74] origin-bottom-right">
                <a
                  className="route-live-widget"
                  data-mode={mode}
                  data-theme={theme}
                  data-status={showLive ? 'live' : 'static'}
                  href={previewHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={ariaLabel}
                  onClick={(event) => event.preventDefault()}
                  tabIndex={-1}
                >
                  <span className="route-live-logo">
                    <img alt="" src={BADGE_LOGO_URL} />
                    <span className="route-live-dot" />
                  </span>
                  <span className="route-live-body">
                    <span className="route-live-metric route-presence-metric">
                      <span className="route-live-count">{formatBadgePreviewNumber(BADGE_PREVIEW_LIVE_COUNT)}</span>
                      <span className="route-live-label">live now</span>
                    </span>
                    <span className="route-live-separator" />
                    <span className="route-live-metric route-stat-metric">
                      <span className="route-stat-count">{formatBadgePreviewNumber(statValue, true)}</span>
                      <span className="route-stat-label">{statLabel}</span>
                      <span className="route-stat-period">{periodDays}d</span>
                    </span>
                  </span>
                </a>
              </div>
            </div>
          </div>
          <p className="mt-2 text-xs text-[color:var(--dash-text-soft)]">
            {sticky ? 'Sticky badge previewed at the selected viewport corner.' : 'Inline badge keeps its position in your page layout.'}
          </p>
        </div>
      </div>
    </div>
  );
}

function BadgeStickyToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="dashboard-control flex min-h-[42px] w-full items-center justify-between gap-4 px-3 py-2.5 text-left transition-colors"
    >
      <span className="min-w-0">
        <span className="block text-sm font-medium text-[color:var(--dash-text)]">Sticky badge</span>
        <span className="block text-xs text-[color:var(--dash-text-muted)]">
          {checked ? 'Fixed to the viewport' : 'Rendered inline'}
        </span>
      </span>
      <span
        className={`relative h-5 w-9 shrink-0 rounded-full border transition-colors ${
          checked
            ? 'border-[color:var(--dash-blue)] bg-[color:var(--dash-blue)]'
            : 'border-[color:var(--dash-divider)] bg-[color:var(--dash-surface-hover)]'
        }`}
      >
        <span
          className={`absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-[18px]' : 'translate-x-[2px]'
          }`}
        />
      </span>
    </button>
  );
}

function BadgePositionPicker({
  value,
  onChange,
  disabled = false,
}: {
  value: PublicBadgePosition;
  onChange: (value: PublicBadgePosition) => void;
  disabled?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border border-[color:var(--dash-divider)] bg-[color:var(--dash-input-bg)] p-3 ${
        disabled ? 'opacity-60' : ''
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-[color:var(--dash-text)]">Sticky position</p>
        <p className="text-xs text-[color:var(--dash-text-muted)]">
          {BADGE_POSITION_OPTIONS.find((option) => option.value === value)?.label}
        </p>
      </div>
      <div className="grid h-28 grid-cols-2 gap-2 rounded-md border border-[color:var(--dash-divider)] bg-[color:var(--dash-surface)] p-2">
        {BADGE_POSITION_OPTIONS.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              aria-label={option.label}
              aria-pressed={selected}
              disabled={disabled}
              onClick={() => onChange(option.value)}
              className={`relative rounded-md border transition-colors disabled:cursor-not-allowed ${
                selected
                  ? 'border-[color:var(--dash-blue)] bg-[color:var(--dash-blue-soft)]'
                  : 'border-[color:var(--dash-divider)] bg-[color:var(--dash-input-bg)] hover:border-[color:var(--dash-border-strong)]'
              }`}
            >
              <span
                className={`absolute h-3 w-5 rounded-sm ${
                  selected ? 'bg-[color:var(--dash-blue)]' : 'bg-[color:var(--dash-text-muted)]'
                } ${option.value.includes('top') ? 'top-2' : 'bottom-2'} ${
                  option.value.includes('left') ? 'left-2' : 'right-2'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Two-line badge embed with the same `dash-code-*` theme as the right rail. */
function HighlightedBadgeEmbedSnippet({
  projectId,
  domain,
  theme,
  sticky,
  position,
  badgeSrc,
}: {
  projectId: string;
  domain: string;
  theme: PublicBadgeTheme;
  sticky: boolean;
  position: PublicBadgePosition;
  badgeSrc: string;
}) {
  return (
    <div className={SNIPPET_SHELL}>
      <pre className={SNIPPET_PRE}>
        <code className="block whitespace-pre">
          <span className="text-[color:var(--dash-code-symbol)]">&lt;</span>
          <span className="text-[color:var(--dash-code-tag)]">div</span>
          <span className="text-[color:var(--dash-code-attr)]"> data-route-live</span>
          <span className="text-[color:var(--dash-code-attr)]"> data-pid</span>
          <span className="text-[color:var(--dash-code-operator)]">=</span>
          <span className="break-all text-[color:var(--dash-code-string)]">&quot;{projectId}&quot;</span>
          <span className="text-[color:var(--dash-code-attr)]"> data-domain</span>
          <span className="text-[color:var(--dash-code-operator)]">=</span>
          <span className="break-all text-[color:var(--dash-code-string)]">&quot;{domain}&quot;</span>
          <span className="text-[color:var(--dash-code-attr)]"> data-theme</span>
          <span className="text-[color:var(--dash-code-operator)]">=</span>
          <span className="break-all text-[color:var(--dash-code-string)]">&quot;{theme}&quot;</span>
          <span className="text-[color:var(--dash-code-attr)]"> data-sticky</span>
          <span className="text-[color:var(--dash-code-operator)]">=</span>
          <span className="break-all text-[color:var(--dash-code-string)]">&quot;{String(sticky)}&quot;</span>
          <span className="text-[color:var(--dash-code-attr)]"> data-position</span>
          <span className="text-[color:var(--dash-code-operator)]">=</span>
          <span className="break-all text-[color:var(--dash-code-string)]">&quot;{position}&quot;</span>
          <span className="text-[color:var(--dash-code-symbol)]">&gt;&lt;/</span>
          <span className="text-[color:var(--dash-code-tag)]">div</span>
          <span className="text-[color:var(--dash-code-symbol)]">&gt;</span>
          {'\n'}
          <span className="text-[color:var(--dash-code-symbol)]">&lt;</span>
          <span className="text-[color:var(--dash-code-tag)]">script</span>
          <span className="text-[color:var(--dash-code-attr)]"> async src</span>
          <span className="text-[color:var(--dash-code-operator)]">=</span>
          <span className="break-all text-[color:var(--dash-code-string)]">&quot;{badgeSrc}&quot;</span>
          <span className="text-[color:var(--dash-code-symbol)]">&gt;&lt;/</span>
          <span className="text-[color:var(--dash-code-tag)]">script</span>
          <span className="text-[color:var(--dash-code-symbol)]">&gt;</span>
        </code>
      </pre>
    </div>
  );
}

/** Matches `Panel` in `UserAnalyticsView.tsx` (dashboard-panel + header strip). */
function EmbedPanel({
  title,
  eyebrow,
  children,
  className = '',
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`dashboard-panel overflow-visible ${className}`}>
      <div className="border-b border-[color:var(--dash-divider)] px-5 py-4">
        {eyebrow ? (
          <p className="mb-1 text-[10px] uppercase tracking-[0.22em] text-[color:var(--dash-text-muted)]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-sm font-semibold text-[color:var(--dash-text)]">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

interface PublicEmbedBadgeSectionProps {
  projectId: string;
}

export function PublicEmbedBadgeSection({ projectId }: PublicEmbedBadgeSectionProps) {
  const { data: settings, isLoading, isFetching, isUninitialized, error, refetch } = useGetProjectSettingsQuery({ projectId });
  const [updateSettings, { isLoading: isSaving }] = useUpdateProjectSettingsMutation();
  const { toasts, addToast, removeToast } = useToast();

  const [publicBadgeMode, setPublicBadgeMode] = useState<PublicBadgeMode>('live');
  const [publicBadgeMetric, setPublicBadgeMetric] = useState<PublicBadgeMetric>('views');
  const [publicBadgePeriodDays, setPublicBadgePeriodDays] = useState<PublicBadgePeriodDays>(7);
  const [publicBadgeTheme, setPublicBadgeTheme] = useState<PublicBadgeTheme>('light');
  const [publicBadgeSticky, setPublicBadgeSticky] = useState(false);
  const [publicBadgePosition, setPublicBadgePosition] = useState<PublicBadgePosition>('bottom-right');
  const [publicBadgeExcludedPagesText, setPublicBadgeExcludedPagesText] = useState('');
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!settings) return;
    setPublicBadgeMode((settings.publicBadgeMode ?? 'live') as PublicBadgeMode);
    setPublicBadgeMetric((settings.publicBadgeMetric ?? 'views') as PublicBadgeMetric);
    setPublicBadgePeriodDays((settings.publicBadgePeriodDays ?? 7) as PublicBadgePeriodDays);
    setPublicBadgeTheme(normalizeBadgeTheme(settings.publicBadgeTheme));
    setPublicBadgeSticky(settings.publicBadgeSticky ?? false);
    setPublicBadgePosition(normalizeBadgePosition(settings.publicBadgePosition));
    setPublicBadgeExcludedPagesText(badgeExcludedPagesText(settings.publicBadgeExcludedPages));
    setDirty(false);
  }, [settings]);

  useEffect(() => {
    if (!settings) return;
    const currentExcludedPages = normalizeBadgeExcludedPagesText(publicBadgeExcludedPagesText);
    const savedExcludedPages = normalizeBadgeExcludedPages(settings.publicBadgeExcludedPages);
    const changed =
      publicBadgeMode !== (settings.publicBadgeMode ?? 'live') ||
      publicBadgeMetric !== (settings.publicBadgeMetric ?? 'views') ||
      publicBadgePeriodDays !== (settings.publicBadgePeriodDays ?? 7) ||
      publicBadgeTheme !== normalizeBadgeTheme(settings.publicBadgeTheme) ||
      publicBadgeSticky !== (settings.publicBadgeSticky ?? false) ||
      publicBadgePosition !== normalizeBadgePosition(settings.publicBadgePosition) ||
      !arraysEqual(currentExcludedPages, savedExcludedPages);
    setDirty(changed);
  }, [
    settings,
    publicBadgeMode,
    publicBadgeMetric,
    publicBadgePeriodDays,
    publicBadgeTheme,
    publicBadgeSticky,
    publicBadgePosition,
    publicBadgeExcludedPagesText,
  ]);

  const embedHost = (settings?.domain || '').trim() || 'route.dev';
  const publicBadgeExcludedPages = useMemo(
    () => normalizeBadgeExcludedPagesText(publicBadgeExcludedPagesText),
    [publicBadgeExcludedPagesText],
  );
  const publicBadgeExcludedPagesError = useMemo(
    () => getBadgeExcludedPagesError(publicBadgeExcludedPages),
    [publicBadgeExcludedPages],
  );

  const badgeEmbedSnippet = useMemo(
    () =>
      `<div data-route-live data-pid="${projectId}" data-domain="${embedHost}" data-theme="${publicBadgeTheme}" data-sticky="${String(publicBadgeSticky)}" data-position="${publicBadgePosition}"></div>\n<script async src="${BADGE_SCRIPT_SRC}"></script>`,
    [projectId, embedHost, publicBadgeTheme, publicBadgeSticky, publicBadgePosition],
  );

  const copySnippet = useCallback(
    async (label: string, text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        addToast('success', `${label} copied`);
      } catch {
        addToast('error', 'Could not copy to clipboard');
      }
    },
    [addToast],
  );

  const handleSave = useCallback(async () => {
    if (publicBadgeExcludedPagesError) {
      addToast('error', publicBadgeExcludedPagesError);
      return;
    }

    try {
      await updateSettings({
        projectId,
        settings: {
          publicBadgeMode,
          publicBadgeMetric,
          publicBadgePeriodDays,
          publicBadgeTheme,
          publicBadgeSticky,
          publicBadgePosition,
          publicBadgeExcludedPages,
        },
      }).unwrap();
      addToast('success', 'Badge settings saved');
      setDirty(false);
      trackEvent(RouteEvents.SETTINGS_SAVE, {
        project_id: projectId,
        context: 'user_analytics_embed',
        public_badge_mode: publicBadgeMode,
        public_badge_theme: publicBadgeTheme,
        public_badge_sticky: publicBadgeSticky,
        public_badge_position: publicBadgePosition,
        public_badge_excluded_pages: publicBadgeExcludedPages.length,
      });
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Failed to save');
    }
  }, [
    addToast,
    projectId,
    publicBadgeMode,
    publicBadgeMetric,
    publicBadgePeriodDays,
    publicBadgeTheme,
    publicBadgeSticky,
    publicBadgePosition,
    publicBadgeExcludedPages,
    publicBadgeExcludedPagesError,
    updateSettings,
  ]);

  const handleCancel = useCallback(() => {
    if (!settings) return;
    setPublicBadgeMode((settings.publicBadgeMode ?? 'live') as PublicBadgeMode);
    setPublicBadgeMetric((settings.publicBadgeMetric ?? 'views') as PublicBadgeMetric);
    setPublicBadgePeriodDays((settings.publicBadgePeriodDays ?? 7) as PublicBadgePeriodDays);
    setPublicBadgeTheme(normalizeBadgeTheme(settings.publicBadgeTheme));
    setPublicBadgeSticky(settings.publicBadgeSticky ?? false);
    setPublicBadgePosition(normalizeBadgePosition(settings.publicBadgePosition));
    setPublicBadgeExcludedPagesText(badgeExcludedPagesText(settings.publicBadgeExcludedPages));
    setDirty(false);
  }, [settings]);

  const ghostButtonClassName =
    'inline-flex items-center gap-1 rounded-md border border-[color:var(--dash-divider)] bg-[color:var(--dash-surface)] px-3 py-1.5 text-[11px] font-semibold text-[color:var(--dash-text)] transition-colors hover:border-[color:var(--dash-border-strong)] hover:bg-[color:var(--dash-surface-hover)]';

  const settingsQueryState = { data: settings, error, isLoading, isFetching, isUninitialized };

  if (isQueryPending(settingsQueryState)) {
    return <DashboardQueryLoading variant="badge" />;
  }

  if (shouldShowQueryError(settingsQueryState)) {
    return (
      <div className="dashboard-panel p-10 text-center">
        <p className="text-base font-semibold text-[color:var(--dash-text)]">Could not load settings</p>
        <p className="mt-2 text-sm text-[color:var(--dash-text-soft)]">Try again or open Project Settings.</p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-4 text-sm text-[color:var(--dash-blue)] hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <DashboardSection id="ua-embed-config" as="div">
        <EmbedPanel title="Badge display" eyebrow="Public widget">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <EmbedSelect
              id="ua-embed-badge-mode"
              label="Badge mode"
              value={publicBadgeMode}
              onChange={setPublicBadgeMode}
              options={BADGE_MODE_OPTIONS}
            />
            <EmbedSelect
              id="ua-embed-badge-theme"
              label="Badge theme"
              value={publicBadgeTheme}
              onChange={setPublicBadgeTheme}
              options={BADGE_THEME_OPTIONS}
            />
            <BadgeStickyToggle checked={publicBadgeSticky} onChange={setPublicBadgeSticky} />
            <BadgePositionPicker
              value={publicBadgePosition}
              onChange={setPublicBadgePosition}
              disabled={!publicBadgeSticky}
            />

            {publicBadgeMode !== 'live' && (
              <>
                <EmbedSelect
                  id="ua-embed-badge-metric"
                  label="Stat metric"
                  value={publicBadgeMetric}
                  onChange={setPublicBadgeMetric}
                  options={BADGE_METRIC_OPTIONS}
                />
                <EmbedSelect
                  id="ua-embed-badge-period"
                  label="Stat window"
                  value={publicBadgePeriodDays}
                  onChange={(v) => setPublicBadgePeriodDays(v)}
                  options={BADGE_PERIOD_OPTIONS}
                />
              </>
            )}
          </div>

          {publicBadgeMode === 'live' ? (
            <p className="mt-4 text-[11px] leading-relaxed text-[color:var(--dash-text-muted)]">
              Stat metric and window only appear when badge mode includes rolling stats; saved values apply when you
              switch.
            </p>
          ) : null}

          <div className="mt-5 rounded-xl border border-[color:var(--dash-divider)] bg-[color:var(--dash-input-bg)] p-4">
            <label
              htmlFor="ua-embed-badge-excluded-pages"
              className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--dash-text-muted)]"
            >
              Excluded pages
            </label>
            <textarea
              id="ua-embed-badge-excluded-pages"
              value={publicBadgeExcludedPagesText}
              onChange={(event) => setPublicBadgeExcludedPagesText(event.target.value)}
              rows={5}
              placeholder={`/admin/*\n/private\nregex:^/docs/(drafts|internal)(/|$)`}
              className="mt-3 min-h-[132px] w-full resize-y rounded-md border border-[color:var(--dash-divider)] bg-[color:var(--dash-surface)] px-3 py-2.5 font-mono text-[12px] leading-relaxed text-[color:var(--dash-text)] outline-none transition-colors placeholder:text-[color:var(--dash-text-muted)] focus:border-[color:var(--dash-blue)]"
            />
            <div className="mt-2 flex flex-col gap-1 text-[11px] leading-relaxed text-[color:var(--dash-text-muted)] sm:flex-row sm:items-center sm:justify-between">
              <p>
                One per line. Use exact paths, wildcard <span className="font-mono">/slug/*</span>, or{' '}
                <span className="font-mono">regex:</span> patterns. SPA route changes are checked automatically.
              </p>
              <p className="font-medium">
                {publicBadgeExcludedPages.length}/{MAX_BADGE_EXCLUDED_PAGE_PATTERNS}
              </p>
            </div>
            {publicBadgeExcludedPagesError ? (
              <p className="mt-2 text-[11px] font-medium text-[color:var(--dash-danger)]">
                {publicBadgeExcludedPagesError}
              </p>
            ) : null}
          </div>

          <BadgeLivePreview
            mode={publicBadgeMode}
            metric={publicBadgeMetric}
            periodDays={publicBadgePeriodDays}
            theme={publicBadgeTheme}
            sticky={publicBadgeSticky}
            position={publicBadgePosition}
            domain={embedHost}
            onThemeChange={setPublicBadgeTheme}
          />

          {dirty ? (
            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[color:var(--dash-divider)] pt-5">
              <button type="button" onClick={handleCancel} disabled={isSaving} className={ghostButtonClassName}>
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || Boolean(publicBadgeExcludedPagesError)}
                className="inline-flex items-center gap-1.5 rounded-md bg-[color:var(--dash-blue)] px-3 py-1.5 text-[11px] font-semibold text-[color:var(--dash-text-on-accent)] shadow-[var(--dash-button-shadow)] transition-opacity hover:opacity-95 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Saving…
                  </>
                ) : (
                  'Save changes'
                )}
              </button>
            </div>
          ) : null}
        </EmbedPanel>
      </DashboardSection>

      <DashboardSection id="ua-embed-badge-snippet" as="div">
        <EmbedPanel title="Badge HTML" eyebrow="Where visitors should see it">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <p className="max-w-xl text-sm text-[color:var(--dash-text-soft)]">
              Paste where you want the badge. Uses{' '}
              <span className="font-mono text-[13px] font-semibold text-[color:var(--dash-text)]">{embedHost}</span>{' '}
              as <span className="font-mono text-[13px] font-semibold text-[color:var(--dash-text)]">data-domain</span>{' '}
              with the saved theme and placement options. Badge clicks link to Route with referral UTM parameters.
            </p>
            <button
              type="button"
              onClick={() => copySnippet('Badge embed snippet', badgeEmbedSnippet)}
              className={`${ghostButtonClassName} shrink-0`}
            >
              <Copy className="h-3.5 w-3.5" />
              Copy
            </button>
          </div>
          <div className="mt-4">
            <HighlightedBadgeEmbedSnippet
              projectId={projectId}
              domain={embedHost}
              theme={publicBadgeTheme}
              sticky={publicBadgeSticky}
              position={publicBadgePosition}
              badgeSrc={BADGE_SCRIPT_SRC}
            />
          </div>
        </EmbedPanel>
      </DashboardSection>

      <ToastContainer toasts={toasts} remove={removeToast} />
    </div>
  );
}
