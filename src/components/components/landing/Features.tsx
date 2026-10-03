'use client';

import React from 'react';
import { useSectionView } from '@/lib/analytics/use-section-view';

const featureItems = [
  {
    label: 'Real user data',
    title: 'Real users, not probes',
    description: 'Capture fetch() and XHR activity from actual browsers in real time. No agents, no extra infrastructure.',
  },
  {
    label: 'Carrier visibility',
    title: 'ISP-level breakdown',
    description: 'Find out which carriers are slow, not just which countries. Airtel vs Jio, not just India.',
  },
  {
    label: 'Privacy',
    title: 'Privacy-first by design',
    description: 'No cookies, no user tracking, query strings stripped. Designed to minimize PII collection from the ground up.',
  },
] as const;

export function Features() {
  const sectionRef = useSectionView('features');
  return (
    <section ref={sectionRef} className="mx-auto w-full max-w-7xl border-t border-[color:var(--landing-border)] px-6 py-16 md:px-16 md:py-20">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        {featureItems.map((feature) => (
          <div key={feature.title} className="rounded-[8px] border border-[color:var(--landing-border)] bg-[color:var(--landing-surface)] px-5 py-6 md:px-6">
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--landing-text-muted)]">
              {feature.label}
            </div>
            <h3 className="mb-3 text-base font-semibold tracking-tight text-[color:var(--landing-text)]">
              {feature.title}
            </h3>
            <p className="text-sm leading-7 text-[color:var(--landing-text-soft)]">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
