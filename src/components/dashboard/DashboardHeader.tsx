'use client';

import Link from 'next/link';
import { Menu, X } from '@/components/dashboard/icons';
import { RouteEvents } from '@/lib/analytics/route-analytics';
import { siteConfig } from '@/lib/seo/config';
import { useDashboardShell } from './DashboardShellContext';
import { useDashboardMobileNav } from './DashboardMobileNavContext';
import { useDashboardRightRail } from './DashboardRightRailContext';
import { DashboardLiveIndicator } from './DashboardLiveIndicator';

export function DashboardHeader() {
  const { isDemo } = useDashboardShell();
  const { isOpen: isMobileNavOpen, toggle: toggleMobileNav } = useDashboardMobileNav();
  const { isOpen: isRightRailOpen, toggle: toggleRightRail, isRailHidden } = useDashboardRightRail();

  return (
    <header
      className={`sticky top-0 z-30 bg-[color:var(--dash-bg)]${isDemo ? ' border-b border-[color:var(--dash-divider)]' : ''}`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="lg:hidden">
            <button
              type="button"
              onClick={toggleMobileNav}
              className="dashboard-button-secondary p-2"
              aria-label={isMobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileNavOpen}
            >
              {isMobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
          {isDemo ? (
            <span className="hidden text-xs uppercase tracking-[0.18em] text-[color:var(--dash-text-muted)] sm:inline">
              Demo Data
            </span>
          ) : null}
          <DashboardLiveIndicator />
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {isDemo ? (
            <Link
              href={`${siteConfig.url}/auth/sign-up`}
              data-umami-event={RouteEvents.DEMO_GET_STARTED_CLICK}
              data-umami-event-location="demo_header"
              className="dashboard-button-primary px-3 text-xs"
            >
              Get Started
            </Link>
          ) : null}

          {!isRailHidden ? (
            <div className="hidden lg:max-xl:block">
              <button
                type="button"
                onClick={toggleRightRail}
                className="dashboard-button-secondary p-2"
                aria-label={isRightRailOpen ? 'Close project panel' : 'Open project panel'}
                aria-expanded={isRightRailOpen}
                title={isRightRailOpen ? 'Close project panel' : 'Open project panel'}
              >
                {isRightRailOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
