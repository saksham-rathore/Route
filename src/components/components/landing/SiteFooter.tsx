import type { ReactNode } from 'react';
import Link from 'next/link';
import { RouteIcon } from '@/components/brand/RouteIcon';
import { Studio1HQIcon } from '@/components/brand/Studio1HQIcon';
import { FooterAskRouteAi } from '@/components/landing/AIProviderIcons';
import { LandingThemeToggle } from '@/components/landing/LandingThemeToggle';
import { RouteEvents } from '@/lib/analytics/route-analytics';
import { getDemoMarketingHref } from '@/lib/demo/config';
import { siteConfig } from '@/lib/seo/config';

const footerColumns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/features', id: 'features' },
      { label: 'Pricing', href: '/pricing', id: 'pricing' },
      { label: 'Use cases', href: '/use-cases', id: 'use_cases' },
      { label: 'Demo', href: getDemoMarketingHref(), id: 'demo' },
      { label: 'How it works', href: '/#how', id: 'how' },
    ],
  },
  {
    title: 'Platform',
    links: [
      { label: 'User analytics', href: '/user-analytics', id: 'user_analytics' },
      { label: 'Observability', href: '/observability', id: 'observability' },
    ],
  },
  {
    title: 'Compare',
    links: [
      { label: 'Route vs Plausible', href: '/route-vs-plausible', id: 'vs_plausible' },
      { label: 'Route vs Umami', href: '/route-vs-umami', id: 'vs_umami' },
      { label: 'Route vs Vercel', href: '/route-vs-vercel-analytics', id: 'vs_vercel' },
      { label: 'Route vs Netlify', href: '/route-vs-netlify-analytics', id: 'vs_netlify' },
    ],
  },
  {
    title: 'Tools',
    links: [
      { label: 'Open Graph Checker', href: '/tools/og-checker', id: 'tool_og_checker' },
      { label: 'DNS lookup', href: '/tools/dns-lookup', id: 'tool_dns_lookup' },
      { label: 'SSL', href: '/tools/ssl-checker', id: 'tool_ssl_checker' },
      { label: 'IP lookup', href: '/tools/ip-lookup', id: 'tool_ip_lookup' },
      { label: 'Domain rating', href: '/tools/domain-rating', id: 'tool_domain_rating' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '/blog', id: 'blog' },
      { label: 'Docs', href: 'https://route.dev/docs', id: 'docs' },
      { label: 'Feedback', href: 'https://feedback.route.dev', id: 'feedback' },
      { label: 'Support', href: '/support', id: 'support' },
      { label: 'Contact', href: `mailto:${siteConfig.email}`, id: 'contact' },
    ],
  },
] as const;

function FooterLink({
  href,
  children,
  linkId,
  external = false,
}: {
  href: string;
  children: ReactNode;
  linkId: string;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      className="text-sm text-[color:var(--landing-text-soft)] transition-colors hover:text-[color:var(--landing-text)]"
      data-umami-event={RouteEvents.FOOTER_LINK_CLICK}
      data-umami-event-link={linkId}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
    >
      {children}
    </Link>
  );
}

function SocialLink({
  href,
  label,
  linkId,
  children,
  external = false,
}: {
  href: string;
  label: string;
  linkId: string;
  children: ReactNode;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[color:var(--landing-border)] bg-[color:var(--landing-surface)] text-[color:var(--landing-text-soft)] transition-colors hover:border-[color:var(--landing-border-strong)] hover:text-[color:var(--landing-text)]"
      data-umami-event={RouteEvents.FOOTER_LINK_CLICK}
      data-umami-event-link={linkId}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
    >
      {children}
    </Link>
  );
}

function XIcon({ className = 'h-3.5 w-3.5 hover:text-[color:var(--landing-text)]' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function SiteFooter({
  showThemeToggle = false,
  variant = 'plain',
}: {
  showThemeToggle?: boolean;
  variant?: 'plain' | 'gradient' | 'inherit';
}) {
  const year = new Date().getFullYear();
  const xHandle = siteConfig.twitter.handle.replace('@', '');
  const footerClassName =
    variant === 'gradient'
      ? 'border-t border-[color:var(--landing-border)] [background:linear-gradient(180deg,color-mix(in_srgb,var(--dash-blue)_12%,var(--landing-page-bg))_0%,var(--landing-page-bg)_100%)]'
      : variant === 'inherit'
        ? 'border-t border-[color:var(--landing-border)] bg-transparent'
        : 'border-t border-[color:var(--landing-border)] bg-[color:var(--landing-page-bg)]';

  return (
      <footer className={footerClassName}>
          <div className="mx-auto w-full max-w-7xl px-6 py-14 md:px-16 md:py-16">
              <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12 xl:gap-16">
                  <div className="min-w-0 pl-3 sm:pl-5 lg:max-w-[17rem] lg:pl-8">
                      <Link
                          href="/"
                          className="inline-flex min-w-0 items-center gap-2.5"
                          data-umami-event={RouteEvents.FOOTER_LINK_CLICK}
                          data-umami-event-link="logo"
                      >
                          <RouteIcon className="h-6 w-auto shrink-0" />
                      </Link>

                      <p className="mt-4 flex items-center gap-1.5 text-xs text-[color:var(--landing-text-muted)]">
                          <span>A</span>
                          <Link
                              href="https://studio1hq.com"
                              className="inline-flex items-center gap-1 font-bold text-[color:var(--landing-text-soft)]"
                          >
                              <Studio1HQIcon
                                  size={14}
                                  className="h-3.5 w-3.5 shrink-0"
                              />
                              Studio1HQ
                          </Link>
                          <span>product</span>
                      </p>
                      <FooterAskRouteAi />
                  </div>

                  <div className="grid min-w-0 flex-1 grid-cols-2 gap-x-6 gap-y-8 pl-3 sm:grid-cols-3 sm:gap-x-8 sm:pl-5 lg:grid-cols-5 lg:gap-x-6">
                      {footerColumns.map((column) => (
                          <div key={column.title} className="min-w-0">
                              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--landing-text-muted)]">
                                  {column.title}
                              </p>
                              <ul className="mt-3 space-y-2">
                                  {column.links.map((link) => (
                                      <li key={link.href}>
                                          <FooterLink
                                              href={link.href}
                                              linkId={link.id}
                                          >
                                              {link.label}
                                          </FooterLink>
                                      </li>
                                  ))}
                              </ul>
                          </div>
                      ))}
                  </div>
              </div>

              <div className="mt-10 flex flex-col gap-3 border-t border-[color:var(--landing-border)] pt-6 text-xs text-[color:var(--landing-text-muted)] sm:flex-row sm:items-center sm:justify-between">
                  <p>
                      &copy; {year} {siteConfig.domain}. All rights reserved.
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <Link
                          href={`https://x.com/${xHandle}`}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Follow ${siteConfig.twitter.handle} on X`}
                      >
                          <XIcon />
                      </Link>
                      <FooterLink
                          href="/legal/privacy-policy"
                          linkId="privacy-bottom"
                      >
                          Privacy
                      </FooterLink>
                      <FooterLink href="/legal/terms" linkId="terms-bottom">
                          Terms
                      </FooterLink>
                  </div>
              </div>
          </div>
      </footer>
  );
}
