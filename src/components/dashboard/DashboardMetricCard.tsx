import type { ReactNode } from 'react';

type DashboardMetricCardProps = {
  label: string;
  value: ReactNode;
  /** Extra class names for the value line (e.g. status colors). */
  tone?: string;
  /** Secondary line under the value (comparison text, sample count, etc.). */
  hint?: ReactNode;
};

/** Shared summary metric tile — compact sizing via parent `.dashboard-metric-grid-*` in globals.css. */
export function DashboardMetricCard({ label, value, tone, hint }: DashboardMetricCardProps) {
  return (
    <div className="dashboard-panel dashboard-metric-card min-w-0 px-[1.125rem] py-4">
      <p className="dashboard-metric-label truncate text-[10px] uppercase tracking-[0.12em] text-[color:var(--dash-text-muted)]">
        {label}
      </p>
      <div className="dashboard-metric-body mt-2 min-w-0">
        <div
          className={`dashboard-metric-value min-w-0 max-w-full truncate text-2xl font-semibold leading-none tracking-tight tabular-nums ${tone ?? 'text-[color:var(--dash-text)]'}`}
        >
          {value}
        </div>
        {hint != null && hint !== '' ? (
          <p className="dashboard-metric-hint mt-1.5 text-[10px] text-[color:var(--dash-text-soft)]">{hint}</p>
        ) : null}
      </div>
    </div>
  );
}
