'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Info,
  Link as LinkIcon,
  Loader2,
  Search,
  XCircle,
} from 'lucide-react';

// Shared class strings: kept here so every tool gets the same rounded-lg /
// rounded-md surfaces and we don't drift over time.
export const toolCardClass =
  'rounded-lg border border-[color:var(--landing-border)] bg-[color:var(--landing-surface)]';

export const toolMutedCardClass =
  'rounded-lg border border-[color:var(--landing-border)] bg-[color:var(--landing-surface-muted)]';

export type ToolSeverity = 'good' | 'warn' | 'bad' | 'info';

export function ToolInputForm({
  value,
  onChange,
  onSubmit,
  placeholder,
  ariaLabel,
  disabled,
  buttonLabel = 'Check',
  loading,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  placeholder: string;
  ariaLabel: string;
  disabled?: boolean;
  buttonLabel?: string;
  loading?: boolean;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!value.trim() || disabled || loading) return;
        onSubmit();
      }}
      className={`${toolCardClass} flex flex-col gap-2 p-2 md:flex-row md:items-center`}
    >
      <div className="flex flex-1 items-center gap-2 rounded-md bg-[color:var(--landing-surface-muted)] px-3 py-2">
        <LinkIcon className="h-4 w-4 shrink-0 text-[color:var(--landing-text-muted)]" aria-hidden="true" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label={ariaLabel}
          disabled={disabled || loading}
          className="flex-1 bg-transparent text-sm text-[color:var(--landing-text)] placeholder:text-[color:var(--landing-text-muted)] focus:outline-none disabled:opacity-60"
        />
      </div>
      <button
        type="submit"
        disabled={disabled || loading || !value.trim()}
        className="inline-flex items-center justify-center gap-2 rounded-md bg-[color:var(--dash-blue)] px-5 py-2.5 text-sm font-semibold text-[color:var(--dash-text-on-accent)] transition-colors hover:bg-[color:var(--dash-blue-hover)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Checking
          </>
        ) : (
          <>
            <Search className="h-4 w-4" aria-hidden="true" />
            {buttonLabel}
          </>
        )}
      </button>
    </form>
  );
}

export function ToolErrorBanner({ message }: { message: string }) {
  return (
    <div className="mt-6 rounded-lg border border-[color:var(--dash-warning)]/40 bg-[color:var(--dash-warning)]/10 px-4 py-3 text-sm text-[color:var(--dash-warning)]">
      {message}
    </div>
  );
}

export function ToolHelperLine({ children }: { children: ReactNode }) {
  return (
    <p className="mt-3 text-center text-xs text-[color:var(--landing-text-muted)]">{children}</p>
  );
}

export function VerdictChip({ severity, label }: { severity: ToolSeverity; label: string }) {
  const cfg = {
    good: {
      cls: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
      Icon: CheckCircle2,
    },
    warn: {
      cls: 'border-[color:var(--dash-warning)]/40 bg-[color:var(--dash-warning)]/10 text-[color:var(--dash-warning)]',
      Icon: AlertTriangle,
    },
    bad: {
      cls: 'border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-300',
      Icon: XCircle,
    },
    info: {
      cls: 'border-[color:var(--dash-blue)]/30 bg-[color:var(--dash-blue-soft)] text-[color:var(--dash-blue)]',
      Icon: Info,
    },
  }[severity];
  const Icon = cfg.Icon;
  return (
    <div className={`inline-flex items-center gap-1.5 self-start rounded-md border px-2.5 py-1 text-xs font-medium ${cfg.cls}`}>
      <Icon className="h-3.5 w-3.5" />
      <span>{label}</span>
    </div>
  );
}

export function ResultsSummaryCard({
  label,
  value,
  subValue,
  verdict,
}: {
  label: string;
  value: string;
  subValue?: string;
  verdict?: { severity: ToolSeverity; label: string };
}) {
  return (
    <div className={`${toolCardClass} flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between md:p-5`}>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--landing-text-muted)]">
          {label}
        </p>
        <p className="mt-1 truncate font-mono text-sm text-[color:var(--landing-text)]">{value}</p>
        {subValue && (
          <p className="mt-1 text-xs text-[color:var(--landing-text-muted)]">{subValue}</p>
        )}
      </div>
      {verdict && <VerdictChip severity={verdict.severity} label={verdict.label} />}
    </div>
  );
}

export function CardSection({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className={`${toolCardClass} overflow-hidden`}>
      <div className="flex flex-col gap-3 border-b border-[color:var(--landing-border)] px-5 py-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-[color:var(--landing-text)]">{title}</h2>
          {description && (
            <p className="text-xs text-[color:var(--landing-text-muted)]">{description}</p>
          )}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function KeyValueRows({
  rows,
}: {
  rows: { key: string; value: ReactNode }[];
}) {
  if (rows.length === 0) {
    return <p className="text-xs text-[color:var(--landing-text-muted)]">No data.</p>;
  }
  return (
    <dl className="divide-y divide-[color:var(--landing-border)] overflow-hidden rounded-md border border-[color:var(--landing-border)]">
      {rows.map((row, i) => (
        <div
          key={`${row.key}-${i}`}
          className="grid grid-cols-1 gap-1 px-3 py-2 sm:grid-cols-[200px_1fr] sm:gap-4"
        >
          <dt className="truncate font-mono text-xs text-[color:var(--landing-text-muted)]">{row.key}</dt>
          <dd className="break-words font-mono text-xs text-[color:var(--landing-text)]">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ToolCtaCard({
  pitch = "og:image, headers, redirects all break silently. Route's RUM script catches those (and the page perf regressions you didn't ship for) on every real visit.",
}: {
  pitch?: string;
}) {
  return (
    <section className={`${toolCardClass} relative overflow-hidden p-6 md:p-8`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background:radial-gradient(120%_100%_at_0%_0%,var(--dash-blue-soft),transparent_55%)]"
      />
      <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--dash-blue)]">
            Why this matters
          </p>
          <h3 className="mt-2 text-lg font-semibold text-[color:var(--landing-text)] md:text-xl">
            One-time check, then forget. Or monitor it forever.
          </h3>
          <p className="mt-2 text-sm leading-6 text-[color:var(--landing-text-soft)]">{pitch}</p>
        </div>
        <Link
          href="/"
          className="inline-flex shrink-0 items-center gap-2 self-start rounded-md bg-[color:var(--dash-blue)] px-4 py-2 text-sm font-semibold text-[color:var(--dash-text-on-accent)] transition-colors hover:bg-[color:var(--dash-blue-hover)]"
        >
          See how Route works
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
