'use client';

import { ProductLandingHero } from '@/components/landing/ProductLandingHero';
import { ProductLandingShell } from '@/components/landing/ProductLandingShell';
import { ProductLandingVideoSection } from '@/components/landing/ProductLandingVideoSection';
import { LandingPillarGrid } from '@/components/landing/LandingPillarGrid';
import { LandingSectionIntro } from '@/components/landing/LandingSectionIntro';
import { ProductCrossSellSection } from '@/components/landing/ProductCrossSellSection';
import { DashboardDepthGrid } from '@/components/landing/DashboardDepthGrid';
import { UserAnalyticsShowcase } from '@/components/landing/UserAnalyticsShowcase';
import { UserTopJourneyPathsShowcase } from '@/components/landing/user-analytics/UserTopJourneyPathsShowcase';
import { UserAnalyticsBreakdownPanels } from '@/components/landing/user-analytics/UserAnalyticsBreakdownPanels';
import { UserAnalyticsTrendChart } from '@/components/landing/user-analytics/UserAnalyticsTrendChart';
import { UserAnalyticsChannelGrid } from '@/components/landing/user-analytics/UserAnalyticsChannelGrid';
import { ProductFeatureBullets } from '@/components/landing/ProductFeatureBullets';
import {
  userAnalyticsDepthLinks,
  userAnalyticsFeatureBullets,
  userAnalyticsPillars,
  observabilityCrossSellHighlights,
  userAnalyticsVideoCaption,
  userAnalyticsVideoChips,
} from '@/components/landing/product-page-copy';
import { getDemoMarketingHref } from '@/lib/demo/config';

const demoHref = getDemoMarketingHref('/user');

export function UserAnalyticsLandingPage() {
  return (
    <ProductLandingShell
      hero={
        <ProductLandingHero
          eyebrow="User analytics"
          title={
            <>
              See how people use your product with{' '}
              <span className="hero-wavy-word text-[color:var(--landing-accent)]">
                analytics
                <svg aria-hidden viewBox="0 0 120 18" preserveAspectRatio="none" className="hero-wavy-underline-svg">
                  <path
                    d="M4 10 C 16 7, 28 13, 40 10 S 64 7, 76 10 S 100 13, 116 10"
                    className="hero-wavy-underline-path"
                  />
                </svg>
              </span>{' '}
              you can trust
            </>
          }
          subtitle="Traffic, sessions, journeys, and channels in one dashboard. Privacy first, no PII. Preview below or open the live demo."
          subtitleClassName="relative mx-auto mt-3 max-w-xl text-balance text-xs leading-5 text-[color:var(--landing-text-soft)] sm:text-sm sm:leading-6 md:mt-4"
          demoHref={demoHref}
          analyticsLocation="user_analytics_page"
        />
      }
      video={
        <ProductLandingVideoSection
          analyticsSection="user_analytics_video"
          chips={userAnalyticsVideoChips}
          caption={userAnalyticsVideoCaption}
          videoSrc="https://cdn.route.dev/videos/route-demo-user-analytics.mp4"
        />
      }
    >
      <UserAnalyticsTrendChart />
      <UserAnalyticsShowcase />
      <UserTopJourneyPathsShowcase />
      <LandingPillarGrid
        eyebrow="Why teams switch"
        title="Analytics built for product decisions"
        description="Everything you need to understand usage without cookie banners, synthetic scripts, or a separate BI stack."
        pillars={userAnalyticsPillars}
      />
      <UserAnalyticsBreakdownPanels />
      <UserAnalyticsChannelGrid />
      <ProductFeatureBullets features={userAnalyticsFeatureBullets} />
      <DashboardDepthGrid
        title="Open any view in the live demo"
        description="Each card jumps to the same dashboard UI with sample data. Filters, date ranges, and exports included."
        links={userAnalyticsDepthLinks}
        analyticsLocation="user_analytics_page"
      />
      <ProductCrossSellSection
        eyebrow="Also on Route"
        title={
          <>
            Pair analytics with{' '}
            <span className="text-[color:var(--landing-accent)]">network observability</span>
          </>
        }
        description="User analytics shows what people do. Observability shows why it felt slow on their network."
        highlights={observabilityCrossSellHighlights}
        href="/observability"
        ctaLabel="Explore observability"
      />
    </ProductLandingShell>
  );
}
