import type { ReactNode } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { RouteIcon } from '@/components/brand/RouteIcon';
import { NavbarAuthCta } from '@/components/landing/AuthButtons';
import { LandingMobileNav } from '@/components/landing/LandingMobileNav';
import { DashboardThemeIconButton } from '@/components/dashboard/DashboardThemeToggle';
import { LandingNavDropdownItem, LandingNavDropdownMoreLink } from '@/components/landing/LandingNavDropdownItem';
import {
  landingNavLinks,
  productNavLinks,
  useCaseNavPreviewLinks,
  useCasesHubNavLink,
} from '@/components/landing/landingNavLinks';
import { RouteEvents } from '@/lib/analytics/route-analytics';

const navClassName =
  'fixed left-0 right-0 top-0 z-50 bg-transparent backdrop-blur-md transition-all duration-300';
const secondaryLinkClassName =
  'text-sm font-medium text-[color:var(--landing-text-soft)] transition-colors hover:text-[color:var(--landing-text)]';
const navDropdownPanelClassName =
  'invisible absolute left-1/2 top-full z-50 w-[452px] -translate-x-1/2 pt-4 opacity-0 transition duration-150 group-hover:visible group-hover:opacity-100';


function NavbarLogo() {
  return (
    <Link
      href="/"
      className="flex min-w-0 items-center gap-2"
      data-umami-event={RouteEvents.NAV_CLICK}
      data-umami-event-section="home"
      data-umami-event-location="logo"
    >
      <RouteIcon className="h-6 w-auto sm:h-7" />
    </Link>
  );
}

function NavbarDesktopLinks() {
  return (
    <div className="ml-auto hidden items-center gap-5 lg:flex">
      <div className="group relative">
        <button
          type="button"
          className={`${secondaryLinkClassName} inline-flex items-center gap-1.5`}
          aria-haspopup="true"
        >
          Products
          <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" aria-hidden="true" />
        </button>
        <div className={navDropdownPanelClassName}>
          <div className="overflow-hidden rounded-lg bg-[color:var(--landing-surface)] shadow-[var(--dash-menu-shadow)] ring-1 ring-[color:var(--landing-border)]">
            <div className="grid gap-1 p-2">
              {productNavLinks.map((link) => (
                <LandingNavDropdownItem
                  key={link.href}
                  link={link}
                  umamiLocation={`products_${link.id}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="group relative">
        <button
          type="button"
          className={`${secondaryLinkClassName} inline-flex items-center gap-1.5`}
          aria-haspopup="true"
        >
          Use Cases
          <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" aria-hidden="true" />
        </button>
        <div className={navDropdownPanelClassName}>
          <div className="overflow-hidden rounded-lg bg-[color:var(--landing-surface)] shadow-[var(--dash-menu-shadow)] ring-1 ring-[color:var(--landing-border)]">
            <div className="grid gap-1 p-2">
              {useCaseNavPreviewLinks.map((link) => (
                <LandingNavDropdownItem
                  key={link.href}
                  link={link}
                  umamiLocation={`usecases_${link.id}`}
                />
              ))}
            </div>
            <LandingNavDropdownMoreLink
              href={useCasesHubNavLink.href}
              label={useCasesHubNavLink.label}
              umamiLocation={`usecases_${useCasesHubNavLink.id}`}
            />
          </div>
        </div>
      </div>
      {landingNavLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={secondaryLinkClassName}
          data-umami-event={RouteEvents.NAV_CLICK}
          data-umami-event-section="home"
          data-umami-event-location={link.id}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}

function NavbarShell({ children }: { children: ReactNode }) {
  return (
    <header className={navClassName}>
      <nav className="relative z-40">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center gap-3 px-4 py-2 md:gap-4 md:px-16">
          <NavbarLogo />
          <NavbarDesktopLinks />
          {children}
        </div>
      </nav>
    </header>
  );
}

export function Navbar() {
  return (
    <NavbarShell>
      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <DashboardThemeIconButton />
        <NavbarAuthCta />
        <LandingMobileNav />
      </div>
    </NavbarShell>
  );
}
