'use client';

import type { ReactNode } from 'react';
import { getDemoUserAnalyticsOverview } from '@/lib/demo/data';
import { LandingSectionIntro } from '@/components/landing/LandingSectionIntro';
import {
  BreakdownLabel,
  CountryFlagGlyph,
  DeviceTypeGlyph,
} from '@/components/landing/breakdown-glyphs';

function formatNumber(value: number) {
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

function RankedPanel({
  title,
  rows,
}: {
  title: string;
  rows: Array<{ id: string; label: ReactNode; value: string; pct: number }>;
}) {
  return (
    <div className="landing-demo-panel min-w-0 p-4 sm:p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--dash-text-muted)]">
        {title}
      </p>
      <ul className="mt-4 space-y-3">
        {rows.map((row) => (
          <li key={row.id} className="min-w-0">
            <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
              <span className="min-w-0 text-[color:var(--dash-text-soft)]">{row.label}</span>
              <span className="shrink-0 font-mono tabular-nums text-[color:var(--dash-text)]">{row.value}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[color:color-mix(in_srgb,var(--dash-divider)_82%,transparent)]">
              <div
                className="h-full rounded-full bg-[color:var(--dash-blue)]"
                style={{ width: `${Math.max(row.pct, 6)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function UserAnalyticsBreakdownPanels() {
  const overview = getDemoUserAnalyticsOverview('30d');

  const maxPageViews = overview.topPages[0]?.views ?? 1;
  const pages = overview.topPages.slice(0, 4).map((row) => ({
    id: row.path,
    label: <span className="block min-w-0 truncate font-mono text-[13px]">{row.path}</span>,
    value: formatNumber(row.views),
    pct: Math.round((row.views / maxPageViews) * 100),
  }));

  const countries = overview.geography.slice(0, 4).map((row) => ({
    id: row.label,
    label: (
      <BreakdownLabel glyph={<CountryFlagGlyph country={row.label} />}>
        {row.label}
      </BreakdownLabel>
    ),
    value: formatNumber(row.value),
    pct: Math.round(row.pct),
  }));

  const devices = overview.devices.slice(0, 4).map((row) => ({
    id: row.label,
    label: (
      <BreakdownLabel glyph={<DeviceTypeGlyph device={row.label} />}>
        {row.label}
      </BreakdownLabel>
    ),
    value: formatNumber(row.value),
    pct: Math.round(row.pct),
  }));

  return (
    <section className="border-b border-[color:var(--landing-border)] py-16 md:py-20">
      <div className="mx-auto w-full min-w-0 max-w-7xl px-6 md:px-16">
        <LandingSectionIntro
          eyebrow="Breakdowns"
          title="Top pages, countries, and devices"
          description="The same ranked views you use in the dashboard, shown here as a quick read on what matters last month."
          className="mb-10"
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          <RankedPanel title="Top pages" rows={pages} />
          <RankedPanel title="Countries" rows={countries} />
          <RankedPanel title="Devices" rows={devices} />
        </div>
      </div>
    </section>
  );
}
