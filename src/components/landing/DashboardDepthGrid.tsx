import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { RouteEvents } from '@/lib/analytics/route-analytics';

type DepthLink = {
  label: string;
  description: string;
  href: string;
};

type DashboardDepthGridProps = {
  eyebrow?: string;
  title: string;
  description: string;
  footerNote?: string;
  links: readonly DepthLink[];
  analyticsLocation: string;
};

export function DashboardDepthGrid({
  eyebrow = 'In the dashboard',
  title,
  description,
  footerNote = 'Full detail lives in the dashboard. Filters, exports, and date ranges included.',
  links,
  analyticsLocation,
}: DashboardDepthGridProps) {
  return (
    <section className="w-full border-b border-[color:var(--landing-border)] bg-[color:var(--landing-page-bg)] py-16 md:py-20">
      <div className="mx-auto w-full min-w-0 max-w-7xl px-6 md:px-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--landing-text-muted)]">
          {eyebrow}
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-[color:var(--landing-text)] md:text-4xl">
          {title}
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--landing-text-soft)] md:text-base">
          {description}
        </p>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group landing-card-solid flex min-w-0 flex-col p-4 transition-colors hover:bg-[color:var(--landing-surface-muted)]"
              data-umami-event={RouteEvents.HERO_CTA_CLICK}
              data-umami-event-button="depth_grid"
              data-umami-event-location={analyticsLocation}
              data-umami-event-target={link.label}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-[color:var(--landing-text)]">{link.label}</span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-[color:var(--landing-text-muted)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[color:var(--dash-blue)]" />
              </span>
              <span className="mt-1.5 text-sm leading-6 text-[color:var(--landing-text-soft)]">
                {link.description}
              </span>
            </Link>
          ))}
        </div>

        {footerNote ? (
          <p className="mt-8 text-center text-sm text-[color:var(--landing-text-muted)]">{footerNote}</p>
        ) : null}
      </div>
    </section>
  );
}
