'use client';

import { ProductLandingHero } from '@/components/landing/ProductLandingHero';
import { ProductLandingShell } from '@/components/landing/ProductLandingShell';
import { ProductLandingVideoSection } from '@/components/landing/ProductLandingVideoSection';
import { LandingStatMarquee } from '@/components/landing/LandingStatMarquee';
import { LandingPillarGrid } from '@/components/landing/LandingPillarGrid';
import { LandingSectionIntro } from '@/components/landing/LandingSectionIntro';
import { ProductCrossSellSection } from '@/components/landing/ProductCrossSellSection';
import { DashboardDepthGrid } from '@/components/landing/DashboardDepthGrid';
import { ObservabilitySignalsGrid } from '@/components/landing/observability/ObservabilitySignalsGrid';
import { ObservabilityInstallSection } from '@/components/landing/observability/ObservabilityInstallSection';
import { ObservabilityLatencyWaterfall } from '@/components/landing/observability/ObservabilityLatencyWaterfall';
import { ObservabilityIspCompare } from '@/components/landing/observability/ObservabilityIspCompare';
import { ObservabilityEndpointLeaderboard } from '@/components/landing/observability/ObservabilityEndpointLeaderboard';
import {
  observabilityDepthLinks,
  observabilityMarqueeStats,
  observabilityPillars,
  userAnalyticsCrossSellHighlights,
  observabilityVideoCaption,
  observabilityVideoChips,
} from '@/components/landing/product-page-copy';
import { getDemoMarketingHref } from '@/lib/demo/config';

const demoHref = getDemoMarketingHref('/map');

export function ObservabilityLandingPage() {
  return (
    <ProductLandingShell
      hero={
        <ProductLandingHero
          eyebrow="Observability"
          title={
            <>
              See how your app performs at the edge with network{' '}
              <span className="hero-wavy-word text-[color:var(--landing-accent)]">
                observability
                <svg aria-hidden viewBox="0 0 120 18" preserveAspectRatio="none" className="hero-wavy-underline-svg">
                  <path
                    d="M4 10 C 16 7, 28 13, 40 10 S 64 7, 76 10 S 100 13, 116 10"
                    className="hero-wavy-underline-path"
                  />
                </svg>
              </span>
            </>
          }
          subtitle="Fetch and XHR telemetry from real browsers. Latency, errors, and ISP context in one view so you investigate with evidence, not guesswork."
          subtitleClassName="relative mx-auto mt-3 max-w-xl text-balance text-xs leading-5 text-[color:var(--landing-text-soft)] sm:text-sm sm:leading-6 md:mt-4"
          demoHref={demoHref}
          analyticsLocation="observability_page"
        />
      }
      video={
        <ProductLandingVideoSection
          analyticsSection="observability_video"
          chips={observabilityVideoChips}
          caption={observabilityVideoCaption}
          videoSrc="https://cdn.route.dev/videos/route-demo-observability.mp4"
        />
      }
    >
      <LandingStatMarquee stats={observabilityMarqueeStats} />

      <section className="border-b border-[color:var(--landing-border)] py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-16">
          <LandingSectionIntro
            eyebrow="Network timing"
            title="See where the seconds actually go"
            description="Route breaks each visit into DNS, TCP, TLS, TTFB, and download so you know if the bottleneck is your API or the last mile."
            className="mb-10"
          />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
            <ObservabilityLatencyWaterfall />
            <ObservabilityIspCompare />
          </div>
        </div>
      </section>

      <section className="border-b border-[color:var(--landing-border)] py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-16">
          <LandingSectionIntro
            eyebrow="Endpoints"
            title="Routes ranked by real-user pain"
            description="p95, error rate, and period-over-period change, pulled from actual browser fetches, not lab runners."
            className="mb-10"
          />
          <ObservabilityEndpointLeaderboard />
        </div>
      </section>

      <section className="border-b border-[color:var(--landing-border)] py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-16">
          <LandingSectionIntro
            eyebrow="Signals"
            title="Four lenses on real-user performance"
            description="Carriers, vitals, routes, and connection timing. Each with filters, alerts, and exports in the demo."
            className="mb-10"
          />
          <ObservabilitySignalsGrid />
        </div>
      </section>

      <LandingPillarGrid
        eyebrow="Built for RUM"
        title="What observability covers"
        description="Every pillar maps to a dashboard view when you connect a project."
        pillars={observabilityPillars}
      />

      <ObservabilityInstallSection />

      <DashboardDepthGrid
        title="Open observability in the live demo"
        description="Jump into endpoints, ISPs, errors, vitals, or network timing with sample data."
        links={observabilityDepthLinks}
        analyticsLocation="observability_page"
      />

      <ProductCrossSellSection
        eyebrow="Also on Route"
        title={
          <>
            Pair observability with{' '}
            <span className="text-[color:var(--landing-accent)]">product analytics</span>
          </>
        }
        description="Observability shows why it felt slow on their network. User analytics shows what people did before they left."
        highlights={userAnalyticsCrossSellHighlights}
        href="/user-analytics"
        ctaLabel="Explore user analytics"
      />
    </ProductLandingShell>
  );
}
