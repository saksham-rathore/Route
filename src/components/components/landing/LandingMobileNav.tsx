'use client';

import Link from 'next/link';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { RouteEvents } from '@/lib/analytics/route-analytics';
import { LandingNavDropdownItem, LandingNavDropdownMoreLink } from '@/components/landing/LandingNavDropdownItem';
import {
  landingNavLinks,
  productNavLinks,
  useCaseNavPreviewLinks,
  useCasesHubNavLink,
} from '@/components/landing/landingNavLinks';

const mobileLinkClassName =
  'block w-full border-b border-[color:var(--landing-border)] py-3.5 text-left text-base font-medium text-[color:var(--landing-text)]';

export function LandingMobileNav() {
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [useCasesOpen, setUseCasesOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const close = () => setOpen(false);

  const menu =
    mounted
      ? createPortal(
          <>
            <button
              type="button"
              className={`fixed inset-0 top-16 z-[90] bg-black/30 transition-opacity duration-200 lg:hidden ${
                open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
              }`}
              aria-label="Close menu"
              onClick={close}
            />
            <div
              id="landing-mobile-nav"
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
              className={`fixed inset-x-0 top-16 z-[100] max-h-[calc(100dvh-4rem)] w-full overflow-y-auto border-b border-[color:var(--landing-border)] bg-[color:var(--landing-page-bg)] shadow-[var(--landing-card-shadow-strong)] transition duration-200 ease-out lg:hidden ${
                open ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-3 opacity-0'
              }`}
            >
              <nav className="px-4">
                <div className="border-b border-[color:var(--landing-border)]">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between py-3.5 text-left text-base font-medium text-[color:var(--landing-text)]"
                    aria-expanded={productsOpen}
                    onClick={() => setProductsOpen((value) => !value)}
                  >
                    Products
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${productsOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                  <div
                    className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-200 ${
                      productsOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="min-h-0 space-y-1 pb-3">
                    {productNavLinks.map((link) => (
                      <LandingNavDropdownItem
                        key={link.href}
                        link={link}
                        variant="mobile"
                        onNavigate={close}
                        umamiLocation={`mobile_products_${link.id}`}
                      />
                    ))}
                    </div>
                  </div>
                </div>
                <div className="border-b border-[color:var(--landing-border)]">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between py-3.5 text-left text-base font-medium text-[color:var(--landing-text)]"
                    aria-expanded={useCasesOpen}
                    onClick={() => setUseCasesOpen((value) => !value)}
                  >
                    Use Cases
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${useCasesOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                  <div
                    className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-200 ${
                      useCasesOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="min-h-0 space-y-1 pb-3">
                    {useCaseNavPreviewLinks.map((link) => (
                      <LandingNavDropdownItem
                        key={link.href}
                        link={link}
                        variant="mobile"
                        onNavigate={close}
                        umamiLocation={`mobile_usecases_${link.id}`}
                      />
                    ))}
                    <LandingNavDropdownMoreLink
                      href={useCasesHubNavLink.href}
                      label={useCasesHubNavLink.label}
                      variant="mobile"
                      onNavigate={close}
                      umamiLocation={`mobile_usecases_${useCasesHubNavLink.id}`}
                    />
                    </div>
                  </div>
                </div>
                {landingNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={close}
                    className={mobileLinkClassName}
                    data-umami-event={RouteEvents.NAV_CLICK}
                    data-umami-event-section="home"
                    data-umami-event-location={`mobile_${link.id}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </>,
          document.body,
        )
      : null;

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-9 w-9 items-center justify-center rounded-md bg-transparent text-[color:var(--landing-text)] transition-colors hover:bg-[color:var(--landing-surface-muted)]"
        aria-expanded={open}
        aria-controls="landing-mobile-nav"
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      {menu}
    </div>
  );
}
