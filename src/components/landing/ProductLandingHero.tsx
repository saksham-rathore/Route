import type { ReactNode } from 'react';
import Link from 'next/link';
import { productPageCtas } from '@/components/landing/product-page-copy';
import { RouteEvents } from '@/lib/analytics/route-analytics';
import { isExternalDemoHref } from '@/lib/demo/config';

type ProductLandingHeroProps = {
  eyebrow: string;
  title: ReactNode;
  subtitle: ReactNode;
  demoHref: string;
  analyticsLocation: string;
  chips?: readonly string[];
  subtitleClassName?: string;
};

const defaultSubtitleClassName =
  'relative mx-auto mt-4 max-w-2xl text-balance text-sm leading-6 text-[color:var(--landing-text-soft)] sm:text-base sm:leading-7 md:mt-6 md:text-lg';

export function ProductLandingHero({
  eyebrow,
  title,
  subtitle,
  demoHref,
  analyticsLocation,
  chips,
  subtitleClassName = defaultSubtitleClassName,
}: ProductLandingHeroProps) {
  const openDemoInNewTab = isExternalDemoHref(demoHref);

  return (
    <section className="relative z-10 overflow-hidden pt-16">
      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6 pb-14 pt-10 text-center md:px-16 md:pb-16 md:pt-14">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--landing-accent)]">
          {eyebrow}
        </p>
        <h1 className="relative mt-4 max-w-4xl text-balance text-[1.75rem] font-bold leading-[1.12] tracking-[-0.04em] text-[color:var(--landing-text)] sm:text-4xl sm:leading-[1.08] md:text-6xl md:leading-[1.02]">
          {title}
        </h1>
        <p className={subtitleClassName}>{subtitle}</p>

        {chips && chips.length > 0 ? (
          <ul className="mt-6 flex flex-row flex-wrap items-center justify-center gap-2">
            {chips.map((chip) => (
              <li
                key={chip}
                className="rounded-full border border-[color:var(--landing-border)] bg-[color:var(--landing-surface)]/80 px-3 py-1 text-xs font-medium text-[color:var(--landing-text-soft)] backdrop-blur-sm"
              >
                {chip}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-8 flex flex-row flex-wrap items-center justify-center gap-3">
          <Link
            href={productPageCtas.primaryHref}
            className="dashboard-button-primary h-11 px-6 text-sm font-semibold md:h-12 md:px-7"
            data-umami-event={RouteEvents.HERO_CTA_CLICK}
            data-umami-event-button="get_started"
            data-umami-event-location={analyticsLocation}
          >
            {productPageCtas.primaryLabel}
          </Link>
          <Link
            href={demoHref}
            target={openDemoInNewTab ? '_blank' : undefined}
            rel={openDemoInNewTab ? 'noreferrer' : undefined}
            className="dashboard-button-secondary landing-secondary-button h-11 px-5 text-sm font-medium md:h-12 md:px-6"
            data-umami-event={RouteEvents.HERO_CTA_CLICK}
            data-umami-event-button="open_demo"
            data-umami-event-location={analyticsLocation}
          >
            {productPageCtas.secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
