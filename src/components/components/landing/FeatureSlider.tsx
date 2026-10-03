'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { LandingDemoImagePanel } from '@/components/landing/LandingDemoImagePanel';
import { useSectionView } from '@/lib/analytics/use-section-view';
import { RouteEvents, trackEvent } from '@/lib/analytics/route-analytics';
import { getBeaconInstallSnippet, getBeaconScriptSrc } from '@/lib/analytics/beacon-snippet';

const FEATURE_IMAGE_BASE_URL = 'https://cdn.route.dev/images';

const TABS = [
  {
    id: 'user-analytics',
    label: 'User Analytics',
    panelLabel: 'User Analytics',
    panelTitle: 'See how users actually use your product.',
    image: {
      light: '/landing-features/user-analytics-light.png',
      dark: '/landing-features/user-analytics-dark.png',
    },
    imageAlt: 'Route user analytics dashboard with traffic, visitors, device, and geography insights.',
  },
  {
    id: 'observability',
    label: 'Observability',
    panelLabel: 'Real User Monitoring',
    panelTitle: 'The server-side mirage.',
    image: {
      light: '/landing-features/observability-light.png',
      dark: '/landing-features/observability-dark.png',
    },
    imageAlt: 'Route observability dashboard showing real user latency and performance breakdowns.',
  },
  {
    id: 'isp-diagnostics',
    label: 'ISP Diagnostics',
    panelLabel: 'Carrier Breakdown',
    panelTitle: 'See which ISPs are killing your user experience.',
    image: {
      light: '/landing-features/isp-diagnostics-light.png',
      dark: '/landing-features/isp-diagnostics-dark.png',
    },
    imageAlt: 'Route ISP diagnostics view comparing carrier latency and request health.',
  },
  {
    id: 'web-vitals',
    label: 'Web Vitals',
    panelLabel: 'Core Web Vitals',
    panelTitle: 'Real user scores, not lab simulations.',
    image: {
      light: '/landing-features/web-vitals-light.png',
      dark: '/landing-features/web-vitals-dark.png',
    },
    imageAlt: 'Route Core Web Vitals dashboard with real user performance scores.',
  },
  {
    id: 'installation',
    label: 'Installation',
    panelLabel: 'Drop-in setup',
    panelTitle: 'One script tag. Full visibility.',
  },
] as const;

type Tab = (typeof TABS)[number];
type TabId = Tab['id'];

type ImageTab = Extract<Tab, { image: { light: string; dark: string } }>;

function getFeatureImageSrc(path: string) {
  return `${FEATURE_IMAGE_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

function FeatureImageStage({ tab }: { tab: ImageTab }) {
  return (
    <LandingDemoImagePanel
      key={tab.id}
      lightSrc={getFeatureImageSrc(tab.image.light)}
      darkSrc={getFeatureImageSrc(tab.image.dark)}
      alt={tab.imageAlt}
    />
  );
}

const SCRIPT_SRC = getBeaconScriptSrc('https://cdn.route.dev', 'YOUR_PROJECT_ID', 'YOUR_DOMAIN');
const SCRIPT_CODE = getBeaconInstallSnippet('https://cdn.route.dev', 'YOUR_PROJECT_ID', 'YOUR_DOMAIN');

const INSTALL_BENEFITS = [
  { title: 'Zero performance overhead', description: 'Non-blocking script that loads after your page' },
  { title: 'Privacy-first',             description: 'No cookies, no user tracking, no PII by design' },
  { title: 'Auto-instrumentation',      description: 'Captures fetch/XHR without code changes' },
  { title: 'Framework agnostic',        description: 'Works with React, Vue, Svelte, or vanilla JS' },
];

function InstallationPanel() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SCRIPT_CODE);
    setCopied(true);
    trackEvent(RouteEvents.CODE_COPY, { code_type: 'installation_script', source: 'feature_slider' });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid min-w-0 items-start gap-4 sm:gap-6 lg:grid-cols-2 lg:items-center lg:gap-16">
      <div className="order-2 min-w-0 lg:order-1">
        <div className="landing-card-solid w-full min-w-0 overflow-hidden bg-[color:var(--landing-surface-muted)]">
          <div className="flex items-center justify-between border-b border-[color:var(--dash-divider)] px-3 py-2.5 sm:px-5 sm:py-4">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-[color:color-mix(in_srgb,var(--dash-danger)_38%,transparent)]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[color:color-mix(in_srgb,var(--dash-warning)_38%,transparent)]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[color:color-mix(in_srgb,var(--dash-success)_38%,transparent)]" />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--landing-text-muted)]">
              script.js
            </span>
          </div>
          <div className="p-2 sm:p-5">
            <div className="landing-code-block relative overflow-hidden rounded-[8px] border border-[color:var(--dash-border)] bg-[color:var(--dash-surface)] p-2 text-[10px] leading-relaxed sm:p-4 sm:text-sm">
              <pre className="overflow-x-auto pr-7 break-all text-[color:var(--dash-code-text)] sm:pr-8 sm:break-normal">
                <code className="block whitespace-pre-wrap sm:whitespace-pre">
                  <span className="text-[#94a3b8]">&lt;</span>
                  <span className="font-bold text-[color:var(--dash-code-tag)]">script</span>
                  {'\n'}
                  <span className="text-amber-400">  defer</span>
                  {'\n'}
                  <span className="text-amber-400">  src</span>
                  <span className="text-[#94a3b8]">=</span>
                  <span className="break-all text-emerald-400">&quot;{SCRIPT_SRC}&quot;</span>
                  {'\n'}
                  <span className="text-amber-400">  data-pid</span>
                  <span className="text-[#94a3b8]">=</span>
                  <span className="text-emerald-400">&quot;YOUR_PROJECT_ID&quot;</span>
                  {'\n'}
                  <span className="text-amber-400">  data-domain</span>
                  <span className="text-[#94a3b8]">=</span>
                  <span className="text-emerald-400">&quot;YOUR_DOMAIN&quot;</span>
                  {'\n'}
                  <span className="text-[#94a3b8]">&gt;&lt;/</span>
                  <span className="font-bold text-[color:var(--dash-code-tag)]">script</span>
                  <span className="text-[#94a3b8]">&gt;</span>
                </code>
              </pre>
              <button
                type="button"
                onClick={handleCopy}
                data-umami-event={RouteEvents.CODE_COPY}
                data-umami-event-code-type="installation_script"
                data-umami-event-source="feature_slider"
                className="absolute right-3 top-3 rounded-lg border border-transparent p-2 text-[color:var(--landing-text-muted)] transition-colors hover:border-[color:var(--dash-border)] hover:bg-[color:var(--dash-surface)] hover:text-[color:var(--landing-text)] sm:right-4 sm:top-4"
                aria-label="Copy code"
              >
                {copied
                  ? <Check className="h-4 w-4 text-emerald-500 sm:h-5 sm:w-5" />
                  : <Copy className="h-4 w-4 sm:h-5 sm:w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="order-1 min-w-0 lg:order-2">
        <ul className="space-y-3 text-left sm:space-y-5">
          {INSTALL_BENEFITS.map((benefit) => (
            <li key={benefit.title} className="flex items-start gap-2.5 sm:gap-3">
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 sm:h-6 sm:w-6">
                <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="min-w-0">
                <span className="text-sm font-medium text-[color:var(--landing-text)] sm:text-base">{benefit.title}</span>
                <p className="mt-0.5 text-xs leading-relaxed text-[color:var(--landing-text-soft)] sm:mt-1 sm:text-sm">{benefit.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function FeatureSlider() {
  const sectionRef = useSectionView('feature_slider');
  const [activeTab, setActiveTab] = useState<TabId>('user-analytics');

  const active = TABS.find((t) => t.id === activeTab)!;

  function handleTabChange(id: TabId) {
    setActiveTab(id);
    trackEvent(RouteEvents.SECTION_VIEW, { section: `feature_slider_${id}` });
  }

  return (
    <section
      ref={sectionRef}
      id="features"
      className="landing-features-section relative w-full py-12 sm:py-16 md:py-28"
    >
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-16">
        <div className="relative z-10 mx-auto mb-6 max-w-3xl text-left sm:mb-8 md:mb-14 md:text-center">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--landing-text-muted)] sm:mb-3 sm:text-[11px] sm:tracking-[0.22em]">
            Platform
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-[color:var(--landing-text)] sm:text-3xl md:text-4xl">
            Everything you need to understand{' '}
            <span className="text-[color:var(--landing-accent)]">real user experience</span>.
          </h2>
          <p className="mt-3 max-w-2xl text-xs leading-6 text-[color:var(--landing-text-soft)] sm:mt-4 sm:text-sm sm:leading-7 md:mx-auto md:text-base">
            Five pillars of visibility, from user analytics and observability to one-line installation.
          </p>
        </div>

        <div className="relative z-10 mx-auto mb-5 w-full max-w-5xl sm:mb-8 md:mb-12">
          <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] md:flex md:justify-center [&::-webkit-scrollbar]:hidden">
            <div
              role="tablist"
              aria-label="Platform features"
              className="inline-flex w-max items-center gap-1 rounded-full border p-1"
            >
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => handleTabChange(tab.id)}
                    data-umami-event={RouteEvents.FEATURE_CLICK}
                    data-umami-event-feature={tab.id}
                    className={[
                      'shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:py-2 sm:text-sm',
                      isActive
                        ? 'bg-[color:var(--dash-blue)] text-[color:var(--dash-text-on-accent)] shadow-[var(--dash-control-shadow)]'
                        : '',
                    ].join(' ')}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="landing-demo-panel relative z-10 mx-auto w-full min-w-0 max-w-full overflow-hidden">
          <div className="flex min-w-0 flex-col gap-0.5 border-b border-[color:var(--dash-divider)] px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4 md:px-6">
            <div className="min-w-0">
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[color:var(--dash-text-muted)] sm:text-[10px] sm:tracking-[0.22em]">
                {active.panelLabel}
              </p>
              <h3 className="mt-0.5 text-xs font-semibold leading-snug text-[color:var(--dash-text)] sm:mt-1 sm:text-sm md:text-[15px]">
                {active.panelTitle}
              </h3>
            </div>
          </div>

          <div
            className={
              'image' in active
                ? 'flex w-full min-w-0 p-3 sm:p-6 md:p-8'
                : 'min-w-0 p-3 sm:p-5 md:p-8'
            }
          >
            {'image' in active ? <FeatureImageStage tab={active} /> : <InstallationPanel />}
          </div>
        </div>
      </div>
    </section>
  );
}
