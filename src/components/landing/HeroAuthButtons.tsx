'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { RouteEvents } from '@/lib/analytics/route-analytics';
import { getDemoMarketingHref, isExternalDemoHref } from '@/lib/demo/config';
export function HeroAuthButtons() {
  const { user, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const ctaHref = mounted && !isLoading && user ? '/dashboard' : '/auth/sign-up';
  const ctaEventButton = mounted && !isLoading && user ? 'go_to_dashboard' : 'sign_up';
  const primaryLabel = mounted && !isLoading && user ? 'Go to dashboard' : 'Start for free';
  const secondaryLabel = mounted && !isLoading && user ? 'Try Demo' : 'Get a demo';
  const demoHref = getDemoMarketingHref();
  const openDemoInNewTab = isExternalDemoHref(demoHref);

  const heroButtonClassName =
    'relative z-[1] inline-flex min-h-10 h-10 items-center justify-center px-5 text-sm sm:min-h-11 sm:h-11 sm:px-6 md:h-12 md:px-7 md:text-base lg:px-8';

  return (
    <div className="mx-auto flex max-w-full flex-row flex-wrap items-center justify-center gap-2.5 sm:gap-3">
      <Link
        href={ctaHref}
        data-umami-event={RouteEvents.HERO_CTA_CLICK}
        data-umami-event-button={ctaEventButton}
        data-umami-event-location="hero_section"
        className={`dashboard-button-primary font-semibold ${heroButtonClassName}`}
      >
        <span className="sm:hidden">{mounted && !isLoading && user ? 'Dashboard' : 'Start free'}</span>
        <span className="hidden sm:inline">{primaryLabel}</span>
      </Link>
      <Link
        href={demoHref}
        target={openDemoInNewTab ? '_blank' : undefined}
        rel={openDemoInNewTab ? 'noreferrer' : undefined}
        data-umami-event={RouteEvents.HERO_CTA_CLICK}
        data-umami-event-button="view_demo"
        data-umami-event-location="hero_section"
        data-umami-event-target="demo_path"
        className={`dashboard-button-secondary landing-secondary-button font-medium ${heroButtonClassName}`}
      >
        {secondaryLabel}
      </Link>
    </div>
  );
}
