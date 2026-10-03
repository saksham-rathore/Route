'use client';

import { LandingInstallSection } from '@/components/landing/LandingInstallSection';

const BENEFITS = [
  {
    title: 'Auto fetch/XHR capture',
    description: 'Network requests instrumented without changing application code',
  },
  {
    title: 'ISP and timing at the edge',
    description: 'See carrier, region, and latency breakdowns from real browsers',
  },
  {
    title: 'Core Web Vitals from users',
    description: 'LCP, INP, and CLS measured in the field, not just lab tests',
  },
  {
    title: 'Privacy-first defaults',
    description: 'No cookies, no PII, and controls for sensitive endpoints',
  },
];

export function ObservabilityInstallSection() {
  return (
    <LandingInstallSection
      copySource="observability_install_section"
      title={
        <>
          Drop-in <span className="text-[color:var(--landing-accent)]">observability</span>.
        </>
      }
      description="Just add a script tag. ~2kb gzipped, non-blocking, and Route begins capturing real user network telemetry within minutes."
      benefits={BENEFITS}
    />
  );
}
