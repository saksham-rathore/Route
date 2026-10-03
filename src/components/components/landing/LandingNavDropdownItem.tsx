import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { LandingNavIcon } from '@/components/landing/LandingNavIcon';
import { RouteEvents } from '@/lib/analytics/route-analytics';

export type LandingNavDropdownLink = {
  label: string;
  description: string;
  href: string;
  id: string;
  icon: LucideIcon;
  iconClassName?: string;
};

type LandingNavDropdownItemProps = {
  link: LandingNavDropdownLink;
  umamiLocation: string;
  variant?: 'desktop' | 'mobile';
  onNavigate?: () => void;
};

export function LandingNavDropdownItem({
  link,
  umamiLocation,
  variant = 'desktop',
  onNavigate,
}: LandingNavDropdownItemProps) {
  const iconBox = (
    <LandingNavIcon
      icon={link.icon}
      iconClassName={link.iconClassName}
      size={variant === 'desktop' ? 'md' : 'sm'}
    />
  );

  if (variant === 'mobile') {
    return (
      <Link
        href={link.href}
        onClick={onNavigate}
        className="flex items-center gap-3 rounded-md py-2.5 pr-2 transition-colors hover:bg-[color:var(--dash-surface-hover)]"
        data-umami-event={RouteEvents.NAV_CLICK}
        data-umami-event-section="home"
        data-umami-event-location={umamiLocation}
      >
        {iconBox}
        <span className="text-base font-medium text-[color:var(--landing-text)]">{link.label}</span>
      </Link>
    );
  }

  return (
    <Link
      href={link.href}
      className="flex gap-3 rounded-md px-3 py-3 transition-colors hover:bg-[color:var(--dash-surface-hover)]"
      data-umami-event={RouteEvents.NAV_CLICK}
      data-umami-event-section="home"
      data-umami-event-location={umamiLocation}
    >
      {iconBox}
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-[color:var(--landing-text)]">{link.label}</span>
        <span className="mt-1 block truncate text-xs leading-5 text-[color:var(--landing-text-muted)]">
          {link.description}
        </span>
      </span>
    </Link>
  );
}

type LandingNavDropdownMoreLinkProps = {
  href: string;
  label: string;
  umamiLocation: string;
  variant?: 'desktop' | 'mobile';
  onNavigate?: () => void;
};

export function LandingNavDropdownMoreLink({
  href,
  label,
  umamiLocation,
  variant = 'desktop',
  onNavigate,
}: LandingNavDropdownMoreLinkProps) {
  if (variant === 'mobile') {
    return (
      <Link
        href={href}
        onClick={onNavigate}
        className="flex items-center justify-between rounded-md py-2.5 pr-2 transition-colors hover:bg-[color:var(--dash-surface-hover)]"
        data-umami-event={RouteEvents.NAV_CLICK}
        data-umami-event-section="home"
        data-umami-event-location={umamiLocation}
      >
        <span className="text-base font-medium text-[color:var(--landing-text)]">{label}</span>
        <ArrowRight className="h-4 w-4 text-[color:var(--landing-text-muted)]" aria-hidden="true" />
      </Link>
    );
  }

  return (
    <div className="border-t border-[color:var(--landing-border)] p-2">
      <Link
        href={href}
        className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-semibold text-[color:var(--landing-text)] transition-colors hover:bg-[color:var(--dash-surface-hover)]"
        data-umami-event={RouteEvents.NAV_CLICK}
        data-umami-event-section="home"
        data-umami-event-location={umamiLocation}
      >
        {label}
        <ArrowRight className="h-4 w-4 text-[color:var(--landing-text-muted)]" aria-hidden="true" />
      </Link>
    </div>
  );
}
