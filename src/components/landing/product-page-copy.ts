import { BarChart3, Gauge, GitBranch, HeartPulse, Shield, Wifi } from 'lucide-react';
import type { VideoHighlightChip } from '@/components/landing/VideoHighlightChips';
import { getDemoMarketingHref } from '@/lib/demo/config';

const chipTone = {
  metrics: 'text-[color:var(--dash-series-soft)]',
  network: 'text-[color:var(--dash-success)]',
  vitals: 'text-[color:var(--dash-series-strong)]',
} as const;

export const productPageCtas = {
  primaryLabel: 'Start for free',
  primaryHref: '/auth/sign-up',
  secondaryLabel: 'Open live demo',
} as const;

export const userAnalyticsMarqueeStats = [
  { label: 'Pageviews (30d)', value: '124.5K' },
  { label: 'Unique visitors', value: '18.2K' },
  { label: 'Avg session', value: '3:42' },
  { label: 'Bounce rate', value: '41.2%', valueColor: 'text-[#f5a623]' },
  { label: 'Top entry', value: '/' },
  { label: 'Avg journey steps', value: '3.2' },
  { label: 'Organic share', value: '38%' },
  { label: 'Mobile share', value: '52%' },
] as const;

export const userAnalyticsPillars = [
  {
    label: 'Overview',
    title: 'Executive snapshot',
    description: 'Pageviews, visitors, visits, duration, and bounce with period-over-period trends.',
  },
  {
    label: 'Journeys',
    title: 'Paths that convert',
    description: 'See entry routes, interest steps, and drop-off before signup or checkout.',
  },
  {
    label: 'Privacy',
    title: 'No cookie banner required',
    description: 'Designed to minimize PII. Query strings stripped and no cross-site user tracking.',
  },
] as const;

export const observabilityMarqueeStats = [
  { label: 'Requests (60s)', value: '142,841' },
  { label: 'Global p95', value: '456ms', valueColor: 'text-[#f5a623]' },
  { label: 'Regions', value: '194' },
  { label: 'Error rate', value: '0.12%' },
  { label: 'Slowest ISP', value: 'BSNL' },
  { label: 'LCP p75', value: '1.8s', valueColor: 'text-[color:var(--landing-accent)]' },
  { label: '4G traffic', value: '67%' },
  { label: 'DNS avg', value: '24ms' },
] as const;

export const observabilityPillars = [
  {
    label: 'Edge map',
    title: 'See the world as users do',
    description: 'Latency and volume by city. Spot regional regressions without synthetic probes.',
  },
  {
    label: 'ISP view',
    title: 'Carrier-level truth',
    description: 'Jio vs Airtel vs Comcast, not just "India is slow."',
  },
  {
    label: 'Vitals',
    title: 'Core Web Vitals from browsers',
    description: 'LCP, INP, and CLS distributions from real sessions, not lab tests.',
  },
] as const;

export const userAnalyticsDepthLinks = [
  { label: 'Overview', description: 'KPIs, trends, and top breakdowns', href: getDemoMarketingHref('/user') },
  { label: 'Pageviews', description: 'Routes, duration, and scroll depth', href: getDemoMarketingHref('/user/pageviews') },
  { label: 'Visits', description: 'Sessions, bounce rate, and paths', href: getDemoMarketingHref('/user/visits') },
  { label: 'Journeys', description: 'Multi-step paths and drop-off', href: getDemoMarketingHref('/user/journeys') },
  { label: 'Geography', description: 'Countries, regions, and heatmap', href: getDemoMarketingHref('/user/geography') },
  { label: 'Referrers', description: 'Channels, UTMs, and campaigns', href: getDemoMarketingHref('/user/referrers') },
] as const;

export const observabilityDepthLinks = [
  { label: 'Global map', description: 'Latency and volume by city', href: getDemoMarketingHref('/map') },
  { label: 'Endpoints', description: 'p95 and errors per route', href: getDemoMarketingHref('/endpoints') },
  { label: 'ISPs', description: 'Carrier-level performance', href: getDemoMarketingHref('/isps') },
  { label: 'Errors', description: 'Client and network failures', href: getDemoMarketingHref('/errors') },
  { label: 'Web Vitals', description: 'LCP, INP, CLS from browsers', href: getDemoMarketingHref('/web-vitals') },
  { label: 'Network', description: 'DNS, TCP, TLS, and connection type', href: getDemoMarketingHref('/network') },
] as const;

export const userAnalyticsFeatureBullets = [
  {
    eyebrow: 'Acquisition',
    title: 'Know where traffic comes from',
    description:
      'See channels, referrer domains, and UTM campaigns in one place without stitching spreadsheets.',
    bullets: ['Direct vs attributed visits', 'Referrer domains and landing pages', 'UTM source / medium / campaign'],
  },
] as const;

export const userAnalyticsVideoChips: VideoHighlightChip[] = [
  { label: 'Pageviews & sessions', icon: BarChart3, itemClassName: 'landing-chip', iconClassName: chipTone.metrics },
  { label: 'Journey paths', icon: GitBranch, itemClassName: 'landing-chip', iconClassName: chipTone.network },
  { label: 'Privacy-first', icon: Shield, itemClassName: 'landing-chip', iconClassName: chipTone.vitals },
];

export const observabilityVideoChips: VideoHighlightChip[] = [
  { label: 'Endpoint p95', icon: Gauge, itemClassName: 'landing-chip', iconClassName: chipTone.metrics },
  { label: 'ISP diagnostics', icon: Wifi, itemClassName: 'landing-chip', iconClassName: chipTone.network },
  { label: 'Core Web Vitals', icon: HeartPulse, itemClassName: 'landing-chip', iconClassName: chipTone.vitals },
];

/** Homepage demo section: two user analytics chips + one observability. */
export const homeVideoChips: VideoHighlightChip[] = [
  userAnalyticsVideoChips[0],
  userAnalyticsVideoChips[1],
  observabilityVideoChips[2],
];

export const userAnalyticsVideoCaption =
  'See how teams explore traffic, journeys, and acquisition in the Route analytics dashboard.';

export const observabilityVideoCaption =
  'Follow a real investigation: latency spikes, carrier context, and failing routes in one surface.';

export const userAnalyticsCrossSellHighlights = [
  'Overview KPIs',
  'Journey paths',
  'Channels & UTMs',
  'Page engagement',
] as const;

export const observabilityCrossSellHighlights = [
  'Global map',
  'ISP breakdown',
  'Core Web Vitals',
  'Endpoint p95',
] as const;

export const seoFooterHighlights = [
  'Cookie-free analytics',
  'API endpoint timing',
  'Core Web Vitals',
  'ISP diagnostics',
  'Browser errors',
  'Status pages',
] as const;

export const observabilityHowItWorksSteps = [
  {
    step: '01',
    title: 'Drop in one script',
    description: 'A lightweight tag instruments fetch and XHR from real browsers. No agents or synthetic runners.',
  },
  {
    step: '02',
    title: 'Enrich at the edge',
    description: 'Route attaches ISP, city, and connection context before data hits your dashboard.',
  },
  {
    step: '03',
    title: 'Investigate in minutes',
    description: 'Map slow regions, failing endpoints, and vitals regressions without reproducing user networks.',
  },
] as const;
