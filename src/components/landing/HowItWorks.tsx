'use client';

import React from 'react';
import { useSectionView } from '@/lib/analytics/use-section-view';
import { HowItWorksOnboardingPreview } from '@/components/landing/HowItWorksOnboardingPreview';
import { LandingDemoImagePanel } from '@/components/landing/LandingDemoImagePanel';

const HOW_IT_WORKS_EDGE_IMAGE = {
  light: 'https://cdn.route.dev/images/landing-component/request-light.png',
  dark: 'https://cdn.route.dev/images/landing-component/request-dark.png',
  alt: 'Route edge enrichment dashboard showing enriched requests, ISP matches, cities, countries, and request trend chart.',
} as const;

const HOW_IT_WORKS_NETWORK_IMAGE = {
  light: 'https://cdn.route.dev/images/landing-component/network-light.png',
  dark: 'https://cdn.route.dev/images/landing-component/network-dark.png',
  alt: 'Route dashboard preview showing real user network telemetry with latency by region, carriers, and web vitals.',
} as const;

const steps = [
  {
    number: '01',
    title: 'Onboarding',
    description:
      'Create your project, set your domain, and paste the snippet. The guided setup takes under a minute. No SDK sprawl or extra build steps.',
  },
  {
    number: '02',
    title: 'Flow the data through the edge',
    description:
      'Requests are captured in the browser, enriched at the edge, and stitched together with network context like ISP, city, and country before they ever reach the dashboard.',
  },
  {
    number: '03',
    title: 'See the experience in the dashboard',
    description:
      'Open the dashboard and inspect where latency is coming from, which carriers are hurting real users, and how web vitals shift by geography and connection quality.',
  },
];

function StepCopy({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl">
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--dash-text-muted)]">
        Step {number}
      </div>
      <h3 className="text-2xl font-semibold tracking-tight text-[color:var(--dash-blue)] md:text-[1.85rem]">
        {title}
      </h3>
      <p className="mt-3 text-[15px] leading-8 text-[color:var(--dash-text-soft)] md:text-base">
        {description}
      </p>
    </div>
  );
}

export function HowItWorks() {
  const sectionRef = useSectionView('how_it_works');

  return (
    <section ref={sectionRef} className="w-full bg-[color:var(--landing-page-bg)] py-20 md:py-28">
      <div className="mx-auto w-full min-w-0 max-w-7xl px-3 sm:px-6 md:px-16">
        <div className="mx-auto mb-14 max-w-3xl text-center md:mb-20">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-[color:var(--landing-text)] md:text-4xl">
            How it works
          </h2>
          <p className="text-sm text-[color:var(--landing-text-soft)] md:text-base">
            From script tag to full network visibility in under a minute.
          </p>
        </div>

        <div className="mx-auto flex w-full min-w-0 max-w-5xl flex-col gap-12 md:gap-16">
          <div className="space-y-6">
            <StepCopy {...steps[0]} />
            <HowItWorksOnboardingPreview />
          </div>

          <div className="space-y-6">
            <StepCopy {...steps[1]} />
            <LandingDemoImagePanel
              lightSrc={HOW_IT_WORKS_EDGE_IMAGE.light}
              darkSrc={HOW_IT_WORKS_EDGE_IMAGE.dark}
              alt={HOW_IT_WORKS_EDGE_IMAGE.alt}
            />
          </div>

          <div className="space-y-6">
            <StepCopy {...steps[2]} />
            <LandingDemoImagePanel
              lightSrc={HOW_IT_WORKS_NETWORK_IMAGE.light}
              darkSrc={HOW_IT_WORKS_NETWORK_IMAGE.dark}
              alt={HOW_IT_WORKS_NETWORK_IMAGE.alt}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
