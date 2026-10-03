import Link from 'next/link';
import { getDemoMarketingHref, isExternalDemoHref } from '@/lib/demo/config';

const demoMarketingHref = getDemoMarketingHref();
const openDemoInNewTab = isExternalDemoHref(demoMarketingHref);
import {
  Activity,
  ArrowRight,
  BarChart3,
  Code2,
  Cpu,
  Eye,
  Gauge,
  GitBranch,
  Globe2,
  HeartPulse,
  LayoutDashboard,
  LockKeyhole,
  Map,
  Monitor,
  Network,
  RadioTower,
  RefreshCw,
  Route,
  ShieldCheck,
  Signal,
  Smartphone,
  Squircle,
  Timer,
  Unplug,
  Users,
  Waypoints,
  Wifi,
  Zap,
} from 'lucide-react';

type FeatureItem = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
};

type FeatureGroup = {
  eyebrow: string;
  heading: string;
  description: string;
  href?: string;
  ctaLabel?: string;
  items: FeatureItem[];
};

const groups: FeatureGroup[] = [
  {
    eyebrow: 'User analytics',
    heading: 'Know what your users are actually doing.',
    description:
      'Traffic, sessions, journeys, acquisition, and engagement in one view. No cookies, no cross-site tracking.',
    href: '/user-analytics',
    ctaLabel: 'Explore user analytics',
    items: [
      {
        icon: BarChart3,
        title: 'Pageviews and sessions',
        description: 'Visitors, visits, duration, and bounce with period-over-period trends.',
      },
      {
        icon: GitBranch,
        title: 'Journey paths',
        description: 'Entry routes, key steps, and drop-off before conversion.',
      },
      {
        icon: Waypoints,
        title: 'Journey paths',
        description: 'See common entry routes, page-level drop-offs, and exit paths.',
      },
      {
        icon: Globe2,
        title: 'Geography',
        description: 'Country, region, and city breakdowns for every metric.',
      },
      {
        icon: Smartphone,
        title: 'Devices and browsers',
        description: 'Device type, OS, browser, and screen resolution split.',
      },
      {
        icon: Route,
        title: 'Referrers and UTMs',
        description: 'Channels, domains, campaigns, and acquisition source attribution.',
      },
    ],
  },
  {
    eyebrow: 'Network observability',
    heading: 'See where the latency actually comes from.',
    description:
      'Real browser telemetry from fetch and XHR. Not synthetic probes, actual timing from your users.',
    href: '/observability',
    ctaLabel: 'Explore observability',
    items: [
      {
        icon: Activity,
        title: 'Endpoint timing',
        description: 'p50, p95, and p99 latency plus error rate per route.',
      },
      {
        icon: Timer,
        title: 'Network phases',
        description: 'DNS, TCP, TLS, TTFB, and download broken out per request.',
      },
      {
        icon: Unplug,
        title: 'Client-side errors',
        description: 'Network failures, timeouts, and non-2xx responses from real sessions.',
      },
      {
        icon: Map,
        title: 'Global latency map',
        description: 'Latency and request volume plotted by city across 194 regions.',
      },
      {
        icon: RefreshCw,
        title: 'Period-over-period',
        description: 'Compare endpoint health across any two time windows.',
      },
      {
        icon: Network,
        title: 'Third-party context',
        description: 'CORS and cross-origin timing so you know if it is you or them.',
      },
    ],
  },
  {
    eyebrow: 'ISP and carrier diagnostics',
    heading: 'Jio vs Airtel, not just India is slow.',
    description:
      'Carrier-level performance data from real users. Identify last-mile regressions before your support queue fills up.',
    items: [
      {
        icon: RadioTower,
        title: 'ISP breakdown',
        description: 'Latency, error rate, and request volume grouped by carrier.',
      },
      {
        icon: Wifi,
        title: 'Connection type',
        description: '4G, 3G, 2G, and WiFi split across regions and endpoints.',
      },
      {
        icon: Signal,
        title: 'ASN-level detail',
        description: 'Drill down from country to ISP to ASN to find the source.',
      },
      {
        icon: Cpu,
        title: 'Mobile vs desktop',
        description: 'Network performance segmented by device class.',
      },
    ],
  },
  {
    eyebrow: 'Core Web Vitals',
    heading: 'Real experience scores from real browsers.',
    description:
      'LCP, INP, CLS, and TTFB distributions from actual sessions, not lab runners. Tied back to users and pages.',
    items: [
      {
        icon: Gauge,
        title: 'LCP, INP, CLS, TTFB',
        description: 'All four core vitals measured from real page loads.',
      },
      {
        icon: HeartPulse,
        title: 'P75 / P95 distribution',
        description: 'Statistical distributions so outliers do not hide in averages.',
      },
      {
        icon: LayoutDashboard,
        title: 'Per-page scorecards',
        description: 'Vitals broken out by route so you know which page to fix first.',
      },
      {
        icon: Monitor,
        title: 'Device and location split',
        description: 'Vitals segmented by device type, browser, and region.',
      },
    ],
  },
  {
    eyebrow: 'Platform and privacy',
    heading: 'One script. Clear controls. Less complexity.',
    description:
      'Drop in a single deferred script tag. Route captures analytics and performance signals automatically with no PII.',
    items: [
      {
        icon: Code2,
        title: 'One-line install',
        description: 'Add a script tag. Route captures fetch and XHR automatically.',
      },
      {
        icon: Zap,
        title: 'Non-blocking, ~2kb',
        description: 'Lightweight, deferred, and designed to stay outside the critical rendering path.',
      },
      {
        icon: LockKeyhole,
        title: 'Cookie-free analytics',
        description: 'Cookie-free visitor analytics designed to reduce consent complexity. Your team remains responsible for the privacy rules that apply to your site.',
      },
      {
        icon: ShieldCheck,
        title: 'no PII by design',
        description: 'Query strings stripped. No cross-site user tracking.',
      },
      {
        icon: Eye,
        title: 'Framework agnostic',
        description: 'Works with React, Vue, Svelte, Next.js, or plain HTML.',
      },
      {
        icon: Users,
        title: 'Team collaboration',
        description: 'Invite teammates, assign roles, and share dashboards.',
      },
    ],
  },
  {
    eyebrow: 'Status pages',
    heading: 'Tell your users before they tell you.',
    description:
      'Public-facing status pages to communicate component health, incidents, and maintenance windows.',
    items: [
      {
        icon: Squircle,
        title: 'Component status',
        description: 'Mark individual services as operational, degraded, or down.',
      },
      {
        icon: Activity,
        title: 'Incident history',
        description: 'A public log of every incident and resolution.',
      },
      {
        icon: Globe2,
        title: 'Custom domain',
        description: 'Serve your status page from status.yourdomain.com.',
      },
    ],
  },
];

function FeatureCard({ item }: { item: FeatureItem }) {
  const Icon = item.icon;
  return (
    <div className="landing-card-solid flex gap-4 p-5">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[color:var(--landing-accent-soft)] text-[color:var(--landing-accent)]">
        <Icon className="h-4 w-4" aria-hidden />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-[color:var(--landing-text)]">{item.title}</h3>
        <p className="mt-1 text-sm leading-6 text-[color:var(--landing-text-soft)]">{item.description}</p>
      </div>
    </div>
  );
}

export function AllFeatures() {
  return (
    <div className="bg-[color:var(--landing-page-bg)] text-[color:var(--landing-text)]">
      {groups.map((group) => (
        <section
          key={group.eyebrow}
          className="features-section features-section--muted relative isolate overflow-hidden border-t border-[color:var(--landing-border)] py-14 md:py-20"
        >
          <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-16">
            <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <span className="mb-3 inline-flex items-center rounded-full border border-[color:var(--landing-border-strong)] bg-[color:var(--landing-accent-soft)] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--landing-accent)]">
                  {group.eyebrow}
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-[color:var(--landing-text)] md:text-3xl">
                  {group.heading}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[color:var(--landing-text-soft)] md:text-base">
                  {group.description}
                </p>
              </div>
              {group.href && group.ctaLabel ? (
                <Link
                  href={group.href}
                  className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[color:var(--landing-accent)] transition-colors hover:text-[color:var(--landing-text)]"
                >
                  {group.ctaLabel}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              ) : null}
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => (
                <FeatureCard key={item.title} item={item} />
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="border-t border-[color:var(--landing-border)] py-14 md:py-20 [background:linear-gradient(180deg,color-mix(in_srgb,var(--dash-blue)_28%,var(--landing-page-bg))_0%,var(--landing-page-bg)_100%)]">
        <div className="mx-auto max-w-7xl px-6 text-center md:px-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--landing-text-muted)]">
            Get started
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl text-balance text-2xl font-bold tracking-tight text-[color:var(--landing-text)] md:text-4xl">
            All of this ships when you add one script tag.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[color:var(--landing-text-soft)] md:text-base">
            No agents, no SDKs, no config files. Drop in the script and every feature above starts collecting data from your real users immediately.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/auth/sign-up"
              className="dashboard-button-primary inline-flex h-11 items-center gap-2 px-6 text-sm font-semibold md:h-12"
            >
              Start for free
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href={demoMarketingHref}
              target={openDemoInNewTab ? '_blank' : undefined}
              rel={openDemoInNewTab ? 'noreferrer' : undefined}
              className="dashboard-button-secondary landing-secondary-button inline-flex h-11 items-center gap-2 px-5 text-sm font-medium md:h-12"
            >
              Open live demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
