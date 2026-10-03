'use client';

import { getDemoUserAnalyticsOverview } from '@/lib/demo/data';
import { LandingSectionIntro } from '@/components/landing/LandingSectionIntro';
import { BreakdownLabel, BrowserBrandGlyph, ChannelGlyph } from '@/components/landing/breakdown-glyphs';

function formatPct(value: number) {
  return `${value.toFixed(1)}%`;
}

export function UserAnalyticsChannelGrid() {
  const overview = getDemoUserAnalyticsOverview('30d');
  const channels = overview.channels.slice(0, 4);
  const browsers = overview.browsers.slice(0, 4);

  return (
    <section className="border-b border-[color:var(--landing-border)] py-16 md:py-20">
      <div className="mx-auto w-full min-w-0 max-w-7xl px-6 md:px-16">
        <LandingSectionIntro
          eyebrow="Acquisition"
          title="Channels and browsers at a glance"
          description="See how traffic arrives and what clients people use before you open referrers or devices in the demo."
          className="mb-10"
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          <div className="landing-demo-panel p-4 sm:p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--dash-text-muted)]">
              Channels
            </p>
            <ul className="mt-4 space-y-3">
              {channels.map((row) => (
                <li key={row.label} className="flex items-center justify-between gap-3 text-sm">
                  <BreakdownLabel glyph={<ChannelGlyph channel={row.label} />}>
                    {row.label}
                  </BreakdownLabel>
                  <span className="font-mono tabular-nums text-[color:var(--dash-text)]">{formatPct(row.pct)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="landing-demo-panel p-4 sm:p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--dash-text-muted)]">
              Browsers
            </p>
            <ul className="mt-4 space-y-3">
              {browsers.map((row) => (
                <li key={row.label} className="flex items-center justify-between gap-3 text-sm">
                  <BreakdownLabel glyph={<BrowserBrandGlyph browser={row.label} />}>
                    {row.label}
                  </BreakdownLabel>
                  <span className="font-mono tabular-nums text-[color:var(--dash-text)]">{formatPct(row.pct)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
