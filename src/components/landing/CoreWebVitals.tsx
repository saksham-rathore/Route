'use client';

import React from 'react';
import { useSectionView } from '@/lib/analytics/use-section-view';
import { RouteEvents } from '@/lib/analytics/route-analytics';

interface VitalCardProps {
  code: string;
  name: string;
  value: string;
  status: 'good' | 'needs-improvement' | 'poor';
  statusLabel: string;
  description: string;
  distribution: {
    good: number;
    poor: number;
  };
}

const statusColors = {
  good: {
    text: 'text-[color:var(--landing-accent)]',
    bg: 'bg-[color:var(--landing-accent)]',
    dot: 'bg-[color:var(--landing-accent)]',
    pill: 'bg-[color:var(--landing-accent-soft)] text-[color:var(--landing-accent)]',
  },
  'needs-improvement': {
    text: 'text-[#f5a623]',
    bg: 'bg-[#f5a623]',
    dot: 'bg-[#f5a623]',
    pill: 'bg-[#f5a623]/12 text-[#f5a623]',
  },
  poor: {
    text: 'text-[#ff5370]',
    bg: 'bg-[#ff5370]',
    dot: 'bg-[#ff5370]',
    pill: 'bg-[#ff5370]/12 text-[#ff5370]',
  },
};

function VitalCard({
  code,
  name,
  value,
  status,
  statusLabel,
  description,
  distribution,
}: VitalCardProps) {
  const colors = statusColors[status];
  const needsImprovementWidth = 100 - distribution.good - distribution.poor;

  const handleMouseEnter = () => {
    if (typeof window !== 'undefined' && window.umami) {
      window.umami.track(RouteEvents.VITAL_CARD_HOVER, { metric: code, status, value });
    }
  };

  return (
    <div
      className="landing-demo-panel flex h-full flex-col p-5 transition-colors hover:border-[color:var(--landing-border-strong)] md:p-6"
      onMouseEnter={handleMouseEnter}
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <span className="inline-flex items-center rounded-full bg-[color:var(--dash-bg-subtle)] px-2.5 py-1 text-[11px] font-medium tracking-[0.01em] text-[color:var(--landing-text-muted)]">
          {code}
        </span>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${colors.pill}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
          {statusLabel}
        </span>
      </div>

      <div>
        <h3 className="text-base font-semibold tracking-tight text-[color:var(--landing-text)] md:text-[1.0625rem]">
          {name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[color:var(--landing-text-soft)]">
          {description}
        </p>
      </div>

      <div className="mt-5">
        <span className={`text-[2rem] font-semibold tracking-tight ${colors.text} md:text-[2.2rem]`}>
          {value}
        </span>
      </div>

      <div className="mt-auto pt-6">
        <div className="mb-2 flex items-center justify-between text-[11px]">
          <span className="text-[color:var(--landing-text-soft)]">Good experience</span>
          <span className="font-medium text-[color:var(--landing-text)]">{distribution.good}%</span>
        </div>
        <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-[color:var(--landing-border-strong)]">
          <div
            className={`h-full ${colors.bg}`}
            style={{ width: `${distribution.good}%` }}
          />
          <div
            className="h-full bg-[#f5a623]/80"
            style={{ width: `${needsImprovementWidth}%` }}
          />
          <div
            className="h-full bg-[#ff5370]/85"
            style={{ width: `${distribution.poor}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-[color:var(--landing-text-muted)]">
          <span>Poor {distribution.poor}%</span>
          <span>Needs improvement {needsImprovementWidth}%</span>
        </div>
      </div>
    </div>
  );
}

const vitalsData: VitalCardProps[] = [
  {
    code: 'LCP',
    name: 'Largest Contentful Paint',
    value: '1.8s',
    status: 'good',
    statusLabel: 'Good',
    description: 'How fast the main content appears',
    distribution: { good: 78, poor: 7 },
  },
  {
    code: 'CLS',
    name: 'Cumulative Layout Shift',
    value: '0.12',
    status: 'needs-improvement',
    statusLabel: 'Needs Improvement',
    description: 'How much the page jumps around while loading',
    distribution: { good: 62, poor: 10 },
  },
  {
    code: 'INP',
    name: 'Interaction to Next Paint',
    value: '210ms',
    status: 'good',
    statusLabel: 'Good',
    description: 'How responsive clicks/taps feel',
    distribution: { good: 89, poor: 3 },
  },
  {
    code: 'FCP',
    name: 'First Contentful Paint',
    value: '0.9s',
    status: 'good',
    statusLabel: 'Good',
    description: 'When something first appears on screen',
    distribution: { good: 92, poor: 3 },
  },
];

export function CoreWebVitals() {
  const sectionRef = useSectionView('core_web_vitals');
  return (
    <section ref={sectionRef} className="w-full border-y border-[color:var(--landing-border)] bg-[color:var(--landing-page-bg)]">
      <div className="max-w-7xl mx-auto w-full px-6 md:px-16 py-16 md:py-24">
        {/* Header */}
        <div className="mb-10 md:mb-14 text-center">
          <h2 className="mb-2 text-3xl font-bold tracking-tight text-[color:var(--landing-text)] md:text-4xl">
            Core Web Vitals
          </h2>
          <p className="text-sm text-[color:var(--landing-text-soft)] md:text-base">
            Real user scores, not lab simulations. Captured from actual browsers.
          </p>
        </div>

        {/* Grid */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6">
          {vitalsData.map((vital) => (
            <VitalCard key={vital.code} {...vital} />
          ))}
        </div>
      </div>
    </section>
  );
}
