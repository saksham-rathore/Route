'use client';

import { Monitor, Smartphone, Tablet } from 'lucide-react';
import { useSectionView } from '@/lib/analytics/use-section-view';
import { LandingFeatureSection } from '@/components/landing/LandingFeatureSection';

const deviceRows = [
  { label: 'Desktop', value: '1.6K', icon: Monitor },
  { label: 'Mobile', value: '1.2K', icon: Smartphone },
  { label: 'Tablet', value: '983', icon: Tablet },
] as const;

const countryRows = [
  { code: 'US', label: 'United States', value: '1.8K' },
  { code: 'CA', label: 'Canada', value: '1.2K' },
  { code: 'GB', label: 'United Kingdom', value: '983' },
  { code: 'IN', label: 'India', value: '632' },
  { code: 'IE', label: 'Ireland', value: '411' },
] as const;

function AnalyticsPreviewPanel() {
  return (
    <div className="landing-demo-panel min-w-0 overflow-hidden">
      <div className="border-b border-[color:var(--dash-divider)] px-5 py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--dash-text-muted)]">
          Live breakdown
        </p>
        <h3 className="mt-1 text-sm font-semibold text-[color:var(--dash-text)]">
          Devices and countries
        </h3>
      </div>
      <div className="grid gap-0 md:grid-cols-2">
        <div className="border-b border-[color:var(--dash-divider)] p-4 sm:p-5 md:border-b-0 md:border-r">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--dash-text-muted)]">
            Devices
          </p>
          <div className="space-y-2">
            {deviceRows.map((row) => (
              <div
                key={row.label}
                className="landing-demo-inset flex items-center justify-between gap-3 px-3 py-2.5"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <row.icon className="h-4 w-4 shrink-0 text-[color:var(--dash-text-muted)]" />
                  <span className="truncate text-sm text-[color:var(--dash-text-soft)]">
                    {row.label}
                  </span>
                </div>
                <span className="shrink-0 font-mono text-sm tabular-nums text-[color:var(--dash-text)]">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 sm:p-5">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--dash-text-muted)]">
            Countries
          </p>
          <div className="space-y-2">
            {countryRows.map((row) => (
              <div
                key={row.code}
                className="landing-demo-inset flex items-center justify-between gap-3 px-3 py-2.5"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <img
                    alt=""
                    aria-hidden
                    className="h-3 w-4 shrink-0 rounded-sm"
                    src={`https://flag.vercel.app/m/${row.code}.svg`}
                  />
                  <span className="truncate text-sm text-[color:var(--dash-text-soft)]">
                    {row.label}
                  </span>
                </div>
                <span className="shrink-0 font-mono text-sm tabular-nums text-[color:var(--dash-text)]">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function LandingAnalyticsShowcase() {
  const sectionRef = useSectionView('analytics_showcase');

  return (
    <LandingFeatureSection
      sectionRef={sectionRef}
      id="analytics"
      eyebrow="Web analytics"
      title={
        <>
          Traffic and context,{' '}
          <span className="text-[color:var(--landing-accent)]">without the bloat</span>.
        </>
      }
      description={
        <p>
          See where users come from, which devices they use, and how network quality
          shifts by region, all from real browser sessions, not synthetic probes.
        </p>
      }
      media={<AnalyticsPreviewPanel />}
    />
  );
}
