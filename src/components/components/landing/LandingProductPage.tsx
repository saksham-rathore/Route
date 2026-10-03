import type { ReactNode } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { productPageCtas } from '@/components/landing/product-page-copy';
import { RouteEvents } from '@/lib/analytics/route-analytics';

type LandingProductPageProps = {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  demoHref: string;
  trustBullets?: readonly string[];
  analyticsLocation: string;
  children: ReactNode;
};

export function LandingProductPage({
  eyebrow,
  title,
  description,
  demoHref,
  trustBullets,
  analyticsLocation,
  children,
}: LandingProductPageProps) {
  return (
    <div className="landing-theme min-h-screen flex flex-col overflow-x-hidden bg-[color:var(--landing-page-bg)] text-[color:var(--landing-text)]">
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-[color:var(--landing-border)] pt-24 md:pt-28">
          <div className="mx-auto max-w-7xl px-6 pb-14 md:px-16 md:pb-16">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--landing-accent)]">
              {eyebrow}
            </p>
            <h1 className="mt-4 max-w-3xl text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl md:leading-[1.08]">
              {title}
            </h1>
            <div className="mt-4 max-w-2xl text-balance text-sm leading-7 text-[color:var(--landing-text-soft)] md:text-base md:leading-8">
              {description}
            </div>

            {trustBullets && trustBullets.length > 0 ? (
              <ul className="mt-6 flex flex-col gap-2 text-sm text-[color:var(--landing-text-soft)] sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
                {trustBullets.map((bullet) => (
                  <li key={bullet} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--dash-blue)]" />
                    {bullet}
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="mt-8 flex flex-row flex-wrap items-center justify-start gap-3">
              <Link
                href={productPageCtas.primaryHref}
                className="dashboard-button-primary h-11 px-6 text-sm font-semibold"
                data-umami-event={RouteEvents.HERO_CTA_CLICK}
                data-umami-event-button="get_started"
                data-umami-event-location={analyticsLocation}
              >
                {productPageCtas.primaryLabel}
              </Link>
              <Link
                href={demoHref}
                className="dashboard-button-secondary landing-secondary-button h-11 px-5 text-sm font-medium"
                data-umami-event={RouteEvents.HERO_CTA_CLICK}
                data-umami-event-button="open_demo"
                data-umami-event-location={analyticsLocation}
              >
                {productPageCtas.secondaryLabel}
              </Link>
            </div>
          </div>
        </section>

        {children}

        <section className="border-t border-[color:var(--landing-border)] bg-[color:var(--landing-surface-muted)]/40 py-14 md:py-16">
          <div className="mx-auto flex max-w-7xl flex-col items-center px-6 text-center md:px-16">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">See the full picture in Route</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-[color:var(--landing-text-soft)] md:text-base">
              Explore the live demo with sample data, or start a project and point the script at your site.
            </p>
            <div className="mt-6 flex flex-row flex-wrap items-center justify-center gap-3">
              <Link
                href={productPageCtas.primaryHref}
                className="dashboard-button-primary h-11 px-6 text-sm font-semibold"
                data-umami-event={RouteEvents.HERO_CTA_CLICK}
                data-umami-event-button="get_started_footer"
                data-umami-event-location={`${analyticsLocation}_footer`}
              >
                {productPageCtas.primaryLabel}
              </Link>
              <Link
                href={demoHref}
                className="dashboard-button-secondary landing-secondary-button h-11 px-5 text-sm font-medium"
                data-umami-event={RouteEvents.HERO_CTA_CLICK}
                data-umami-event-button="open_demo_footer"
                data-umami-event-location={`${analyticsLocation}_footer`}
              >
                {productPageCtas.secondaryLabel}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter showThemeToggle />
    </div>
  );
}
