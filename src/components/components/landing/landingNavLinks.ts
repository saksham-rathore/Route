import {
  Activity,
  BarChart3,
  BellRing,
  Code2,
  CreditCard,
  Gauge,
  HeartPulse,
  LayoutDashboard,
  ShieldAlert,
  Wifi,
} from 'lucide-react';
import type { LandingNavDropdownLink } from '@/components/landing/LandingNavDropdownItem';

export type LandingNavIconMeta = Pick<LandingNavDropdownLink, 'icon' | 'iconClassName'>;

export const landingNavLinks = [
  { label: 'Features', href: '/features', id: 'features' },
  { label: 'Pricing', href: '/pricing', id: 'pricing' },
  { label: 'Docs', href: 'https://route.dev/docs', id: 'docs' },
  { label: 'Blog', href: '/blog', id: 'blog' },
] as const;

export const productNavLinks = [
  {
    label: 'User Analytics',
    description: 'Sessions, referrers, funnels, and user behavior signals.',
    href: '/user-analytics',
    id: 'user_analytics',
    icon: BarChart3,
    iconClassName: 'text-[color:var(--dash-series-soft)]',
  },
  {
    label: 'Network Observability',
    description: 'Real-user API timing by region, ISP, and browser phase.',
    href: '/observability',
    id: 'observability',
    icon: Activity,
    iconClassName: 'text-[color:var(--dash-chart-secondary)]',
  },
] as const satisfies readonly LandingNavDropdownLink[];

export const useCaseNavLinks = [
  {
    label: 'API Performance Monitoring',
    description: 'p95 latency, errors, and network phases from real browsers.',
    href: '/use-cases/api-performance-monitoring',
    id: 'uc_api',
    icon: Gauge,
    iconClassName: 'text-[color:var(--dash-series-soft)]',
  },
  {
    label: 'Core Web Vitals',
    description: 'LCP, INP, CLS, FCP, and TTFB from real user sessions.',
    href: '/use-cases/core-web-vitals-monitoring',
    id: 'uc_vitals',
    icon: HeartPulse,
    iconClassName: 'text-[color:var(--dash-series-strong)]',
  },
  {
    label: 'Third-Party Scripts',
    description: 'Measure external script and CDN impact on performance.',
    href: '/use-cases/third-party-script-monitoring',
    id: 'uc_third_party',
    icon: Code2,
    iconClassName: 'text-[color:var(--dash-chart-primary)]',
  },
  {
    label: 'RUM for SaaS',
    description: 'Analytics and observability for web applications.',
    href: '/use-cases/real-user-monitoring-saas',
    id: 'uc_saas',
    icon: LayoutDashboard,
    iconClassName: 'text-[color:var(--dash-chart-secondary)]',
  },
  {
    label: 'ISP Monitoring',
    description: 'Carrier-level latency, errors, and mobile network diagnostics.',
    href: '/use-cases/isp-performance-monitoring',
    id: 'uc_isp',
    icon: Wifi,
    iconClassName: 'text-[color:var(--dash-success)]',
  },
  {
    label: 'Referrers & Alerts',
    description: 'Referrer domains, direct traffic, and acquisition alerts.',
    href: '/use-cases/referrers-and-alerts',
    id: 'uc_referrers_alerts',
    icon: BellRing,
    iconClassName: 'text-[color:var(--dash-warning)]',
  },
] as const satisfies readonly LandingNavDropdownLink[];

/** First N use cases shown in navbar dropdowns; remainder live on /use-cases. */
export const USE_CASE_NAV_PREVIEW_COUNT = 4;

export const useCaseNavPreviewLinks = useCaseNavLinks.slice(0, USE_CASE_NAV_PREVIEW_COUNT);

export const useCasesHubNavLink = {
  label: 'More',
  href: '/use-cases',
  id: 'use_cases_more',
} as const;

/** Icons for use-case pages not listed in the navbar dropdown. */
export const extraUseCaseNavIcons: Record<string, LandingNavIconMeta> = {
  '/use-cases/status-page-incident-monitoring': {
    icon: ShieldAlert,
    iconClassName: 'text-[color:var(--dash-danger)]',
  },
  '/use-cases/checkout-api-performance': {
    icon: CreditCard,
    iconClassName: 'text-[color:var(--dash-series-soft)]',
  },
};

const navIconByHref = new Map<string, LandingNavIconMeta>(
  [
    ...productNavLinks.map((link) => [link.href, { icon: link.icon, iconClassName: link.iconClassName }] as const),
    ...useCaseNavLinks.map((link) => [link.href, { icon: link.icon, iconClassName: link.iconClassName }] as const),
    ...Object.entries(extraUseCaseNavIcons),
  ],
);

export function getLandingNavIconForHref(href: string): LandingNavIconMeta | undefined {
  return navIconByHref.get(href);
}
