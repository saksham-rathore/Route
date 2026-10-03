'use client';

import { getDemoUserAnalyticsOverview } from '@/lib/demo/data';

function formatNumber(value: number | null | undefined) {
  if (value == null) return '-';
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

function formatPercent(value: number | null | undefined) {
  if (value == null) return '-';
  return `${value.toFixed(1)}%`;
}

function formatDuration(value: number | null | undefined) {
  if (value == null) return '-';
  const totalSeconds = Math.max(0, Math.round(value / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function UserAnalyticsOverviewStrip() {
  const overview = getDemoUserAnalyticsOverview('30d');

  const metrics = [
    { label: 'Pageviews', value: formatNumber(overview.summary.pageviews.current) },
    { label: 'Unique visitors', value: formatNumber(overview.summary.uniqueVisitors.current) },
    { label: 'Total visits', value: formatNumber(overview.summary.totalVisits.current) },
    { label: 'Avg duration', value: formatDuration(overview.summary.avgDurationMs.current) },
    { label: 'Bounce rate', value: formatPercent(overview.summary.bounceRate.current) },
  ];

  return (
    <section className="border-b border-[color:var(--landing-border)] py-10 md:py-12">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-6 sm:grid-cols-3 lg:grid-cols-5 md:gap-4 md:px-16">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="landing-card-solid px-4 py-4 text-center"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--landing-text-muted)]">
              {metric.label}
            </p>
            <p className="mt-2 text-xl font-semibold tabular-nums text-[color:var(--landing-text)] md:text-2xl">
              {metric.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
