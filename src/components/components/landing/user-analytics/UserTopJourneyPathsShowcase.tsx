'use client';

import { useSectionView } from '@/lib/analytics/use-section-view';
import { LandingDemoImagePanel } from '@/components/landing/LandingDemoImagePanel';

const JOURNEY_PATHS_IMAGE = {
  light: 'https://cdn.route.dev/images/landing-component/journey-light.png',
  dark: 'https://cdn.route.dev/images/landing-component/journey-dark.png',
  alt: 'Route top journey paths table with path, visits, share, and change for ranked user flows.',
} as const;

export function UserTopJourneyPathsShowcase() {
  const sectionRef = useSectionView('user_journey_paths_showcase');

  return (
    <section
      ref={sectionRef}
      className="w-full border-b border-[color:var(--landing-border)] bg-[color:var(--landing-page-bg)] py-16 md:py-20"
    >
      <div className="mx-auto w-full min-w-0 max-w-7xl px-3 sm:px-6 md:px-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--landing-text-muted)]">
            User Journeys
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-[color:var(--landing-text)] md:text-4xl">
            See the path users actually take.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[color:var(--landing-text-soft)] md:text-base">
            Ranked journey paths with visits, share, and change. Click any row in the dashboard to highlight
            flows on the map.
          </p>
        </div>

        <div className="mx-auto mt-8 w-full min-w-0 max-w-5xl">
          <LandingDemoImagePanel
            lightSrc={JOURNEY_PATHS_IMAGE.light}
            darkSrc={JOURNEY_PATHS_IMAGE.dark}
            alt={JOURNEY_PATHS_IMAGE.alt}
          />
        </div>
      </div>
    </section>
  );
}
