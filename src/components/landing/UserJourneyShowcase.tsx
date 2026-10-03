'use client';

import { useSectionView } from '@/lib/analytics/use-section-view';
import { LandingProductShot } from '@/components/landing/LandingProductShot';

/** Drop your asset at `app/public/user-journey-showcase.png` (or update this path). */
const JOURNEY_IMAGE_SRC = '/user-journey-showcase.png';

export function UserJourneyShowcase() {
  const sectionRef = useSectionView('user_journey_showcase');

  return (
    <section
      ref={sectionRef}
      className="w-full border-b border-[color:var(--landing-border)] bg-[color:var(--landing-page-bg)] py-16 md:py-20"
    >
      <div className="mx-auto w-full min-w-0 max-w-7xl px-6 md:px-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--landing-text-muted)]">
            User Journeys
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-[color:var(--landing-text)] md:text-4xl">
            See the path users actually take.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[color:var(--landing-text-soft)] md:text-base">
            Follow the most common routes from first visit to sign up, then drill into every path in the
            dashboard.
          </p>
        </div>

        <LandingProductShot
          src={JOURNEY_IMAGE_SRC}
          alt="User journey visualization showing how visitors move through your site"
          className="mx-auto mt-8 w-full max-w-6xl"
          fallback={
            <div className="flex aspect-[16/10] w-full items-center justify-center rounded-[6px] border border-dashed border-[color:var(--landing-border)] bg-[color:var(--landing-surface-muted)] px-6 text-center">
              <p className="text-sm text-[color:var(--landing-text-muted)]">
                Add <span className="font-mono text-[color:var(--landing-text-soft)]">user-journey-showcase.png</span>{' '}
                to <span className="font-mono text-[color:var(--landing-text-soft)]">app/public/</span>
              </p>
            </div>
          }
        />
      </div>
    </section>
  );
}
