'use client';

import { LandingInstallSection } from '@/components/landing/LandingInstallSection';
import { useSectionView } from '@/lib/analytics/use-section-view';

const BENEFITS = [
  {
    title: 'Zero performance overhead',
    description: 'Non-blocking script that loads after your page',
  },
  {
    title: 'Privacy-first',
    description: 'No cookies, no user tracking, no PII by design',
  },
  {
    title: 'Auto-instrumentation',
    description: 'Captures fetch/XHR without code changes',
  },
  {
    title: 'Framework agnostic',
    description: 'Works with React, Vue, Svelte, or vanilla JS',
  },
];

export function DropInReliability() {
  const sectionRef = useSectionView('drop_in_reliability');

  return (
    <LandingInstallSection
      sectionRef={sectionRef}
      copySource="drop_in_reliability_section"
      title={
        <>
          Drop-in <span className="text-[color:var(--landing-accent)]">reliability</span>.
        </>
      }
      description="Just add a script tag. ~2kb gzipped, non-blocking, and works with any frontend."
      benefits={BENEFITS}
    />
  );
}
