'use client';

import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useSectionView } from '@/lib/analytics/use-section-view';

interface MetricRowProps {
  label: string;
  value: string;
  color: 'emerald' | 'rose' | 'amber';
}

const colorMap = {
  emerald: {
    text: 'text-[color:var(--landing-metric-good)]',
  },
  rose: {
    text: 'text-[color:var(--landing-metric-bad)]',
  },
  amber: {
    text: 'text-[color:var(--landing-metric-warn)]',
  },
};

function MetricRow({ label, value, color }: MetricRowProps) {
  const colors = colorMap[color];
  return (
    <div className="flex items-center justify-between border-b border-[color:var(--landing-border)] py-3 last:border-b-0">
      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[color:var(--landing-text-soft)] md:text-xs">
        {label}
      </span>
      <span className={`font-mono text-[11px] font-semibold md:text-xs ${colors.text}`}>{value}</span>
    </div>
  );
}

function ServerCard() {
  return (
    <div className="landing-demo-panel h-full p-6 md:p-8">
      <div>
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--landing-text-muted)] md:text-xs">
          What Your Server Sees
        </p>
        <div className="mb-8 flex items-end gap-2">
          <span className="text-4xl font-semibold tracking-[-0.05em] text-[color:var(--landing-accent)] md:text-5xl">24ms</span>
          <span className="pb-1 font-mono text-xs uppercase tracking-[0.18em] text-[color:color-mix(in_srgb,var(--landing-accent)_56%,transparent)]">
            avg
          </span>
        </div>

        <div>
          <MetricRow label="Processing" value="12ms" color="emerald" />
          <MetricRow label="Database" value="8ms" color="emerald" />
          <MetricRow label="External API" value="4ms" color="emerald" />
        </div>

        <div className="landing-demo-inset mt-6 flex w-fit items-center gap-2 px-3 py-1.5 text-xs font-medium text-[color:var(--landing-accent)]">
          <CheckCircle2 className="w-3.5 h-3.5" />
          All Systems Operational
        </div>
      </div>
    </div>
  );
}

function UserCard() {
  return (
    <div className="landing-demo-panel relative h-full p-6 md:p-8">
      {/* Blind Spot Badge */}
      <div
        className="absolute right-6 top-6 flex items-center gap-1.5 rounded-md border border-[#ff5370]/20 px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.16em] text-[#ff5370]"
        style={{ backgroundColor: 'color-mix(in srgb, #ff5370 10%, var(--dash-bg-subtle))' }}
      >
        <AlertTriangle className="w-3 h-3" />
        Blind Spot
      </div>

      {/* Icon */}
      <div className="absolute bottom-5 right-5 text-[#ff5370] opacity-[0.08]">
        <AlertTriangle className="h-16 w-16 md:h-20 md:w-20" strokeWidth={1} />
      </div>
      
      <div className="relative z-10">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[#ff5370] md:text-xs">
          What The User Sees
        </p>
        <div className="mb-8 flex items-end gap-2">
          <span className="text-4xl font-semibold tracking-[-0.05em] text-[#ff5370] md:text-5xl">4.2s</span>
          <span className="pb-1 font-mono text-xs uppercase tracking-[0.18em] text-[#ff5370]/55">
            p95
          </span>
        </div>

        <div>
          <MetricRow label="DNS Resolution" value="800ms" color="rose" />
          <MetricRow label="TCP Handshake (3G)" value="1.2s" color="rose" />
          <MetricRow label="TLS Negotiation" value="600ms" color="amber" />
        </div>

        <div className="landing-demo-inset mt-6 flex w-fit items-center gap-2 border border-[#ff5370]/15 bg-[color:color-mix(in_srgb,#ff5370_8%,var(--dash-bg-subtle))] px-3 py-1.5 text-xs font-medium text-[#ff5370]">
          <AlertTriangle className="w-3.5 h-3.5" />
          User Frustrated / Churn Risk
        </div>
      </div>
    </div>
  );
}

// Mobile gap indicator (horizontal, between cards)
function MobileGapIndicator() {
  return (
    <div className="flex items-center justify-center md:hidden">
      <div className="flex items-center gap-3">
        <div className="h-px w-8 bg-gradient-to-r from-transparent to-[color:var(--landing-border-strong)]" />
        <div className="landing-demo-panel rounded-[8px] px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--landing-text-muted)]">
          The &quot;Last Mile&quot; Gap
        </div>
        <div className="h-px w-8 bg-gradient-to-l from-transparent to-[color:var(--landing-border-strong)]" />
      </div>
    </div>
  );
}

export function ServerSideMirage() {
  const sectionRef = useSectionView('server_side_mirage');
  return (
    <section ref={sectionRef} className="w-full bg-[color:var(--landing-page-bg)] py-20 md:py-28">
      <div className="max-w-7xl mx-auto w-full px-6 md:px-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2
            className="mb-4 text-3xl font-bold tracking-tight text-[color:var(--landing-text)] md:text-4xl"
            style={{ textShadow: '0 8px 26px rgba(2,6,23,0.18)' }}
          >
            The Server-Side <span className="text-[#ff5370]">Mirage</span>
          </h2>
          <p className="text-sm leading-relaxed text-[color:var(--landing-text-soft)] md:text-base">
            Your server logs say everything is fine. But your users on the other side of the world are staring at a loading spinner. 
            Traditional APM tools stop at your data center&apos;s exit door.
          </p>
        </div>

        {/* Mobile Layout: Cards stacked with gap indicator between */}
        <div className="flex flex-col md:hidden gap-4">
          <ServerCard />
          <MobileGapIndicator />
          <UserCard />
        </div>

        {/* Desktop Layout: Side by side with gap indicator below */}
        <div className="hidden md:block">
          <div className="grid grid-cols-2 gap-6">
            <ServerCard />
            <UserCard />
          </div>
        </div>
      </div>
    </section>
  );
}
