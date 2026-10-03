'use client';

import { LandingSectionIntro } from '@/components/landing/LandingSectionIntro';
import { LandingDemoImagePanel } from '@/components/landing/LandingDemoImagePanel';

const PAGEVIEW_TREND_IMAGE = {
  light: 'https://cdn.route.dev/images/landing-component/pageview-light.png',
  dark: 'https://cdn.route.dev/images/landing-component/pageview-dark.png',
  alt: 'Route pageviews over time chart comparing current period vs previous period.',
} as const;

export function UserAnalyticsTrendChart() {
  return (
    <section className="border-t border-b border-[color:var(--landing-border)] py-16 md:py-20">
      <div className="mx-auto w-full min-w-0 max-w-7xl px-6 md:px-16">
        <LandingSectionIntro
          eyebrow="Trends"
          title="Pageviews over the last 30 days"
          description="Current period vs previous, the same comparison chart on your overview tab."
          className="mb-10"
        />
        <LandingDemoImagePanel
          lightSrc={PAGEVIEW_TREND_IMAGE.light}
          darkSrc={PAGEVIEW_TREND_IMAGE.dark}
          alt={PAGEVIEW_TREND_IMAGE.alt}
        />
      </div>
    </section>
  );
}
