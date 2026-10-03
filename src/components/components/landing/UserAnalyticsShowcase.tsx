'use client';

import { useSectionView } from '@/lib/analytics/use-section-view';
import { LandingDemoImagePanel } from '@/components/landing/LandingDemoImagePanel';

const ANALYTICS_OVERVIEW_IMAGE = {
  light: 'https://cdn.route.dev/images/landing-component/analytics-light.png',
  dark: 'https://cdn.route.dev/images/landing-component/analytics-dark.png',
  alt: 'Route user analytics overview with pageviews, visitors, trend chart, top pages, devices, and countries.',
} as const;

export function UserAnalyticsShowcase() {
  const sectionRef = useSectionView('user_analytics_showcase');

  return (
    <section
      ref={sectionRef}
      id="analytics"
      className="w-full border-b border-[color:var(--landing-border)] bg-[color:var(--landing-page-bg)] py-16 md:py-20"
    >
      <div className="mx-auto w-full min-w-0 max-w-7xl px-3 sm:px-6 md:px-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--landing-text-muted)]">
            User Analytics
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-[color:var(--landing-text)] md:text-4xl">
            See how users actually use your product.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[color:var(--landing-text-soft)] md:text-base">
            Pageviews, visitors, journeys, and geography: the same overview you get
            in the Route dashboard, without synthetic probes.
          </p>
        </div>

        <div className="mx-auto mt-8 w-full min-w-0">
          <LandingDemoImagePanel
            lightSrc={ANALYTICS_OVERVIEW_IMAGE.light}
            darkSrc={ANALYTICS_OVERVIEW_IMAGE.dark}
            alt={ANALYTICS_OVERVIEW_IMAGE.alt}
          />
        </div>
      </div>
    </section>
  );
}
