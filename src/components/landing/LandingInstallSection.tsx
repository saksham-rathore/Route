'use client';

import type { ReactNode, RefObject } from 'react';
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { RouteEvents, trackEvent } from '@/lib/analytics/route-analytics';
import { getBeaconInstallSnippet, getBeaconScriptSrc } from '@/lib/analytics/beacon-snippet';

const SCRIPT_SRC = getBeaconScriptSrc('https://cdn.route.dev', 'YOUR_PROJECT_ID', 'YOUR_DOMAIN');
const SCRIPT_CODE = getBeaconInstallSnippet('https://cdn.route.dev', 'YOUR_PROJECT_ID', 'YOUR_DOMAIN');

export type InstallBenefit = {
  title: string;
  description: string;
};

type LandingInstallSectionProps = {
  title: ReactNode;
  description: string;
  benefits: InstallBenefit[];
  copySource: string;
  sectionRef?: RefObject<HTMLElement | null>;
};

function InstallBenefitList({ benefits }: { benefits: InstallBenefit[] }) {
  return (
    <ul className="mx-auto max-w-md space-y-6 text-center lg:mx-0 lg:max-w-none lg:text-left">
      {benefits.map((benefit) => (
        <li
          key={benefit.title}
          className="flex flex-col items-center gap-2 lg:flex-row lg:items-start lg:gap-4 lg:text-left"
        >
          <div className="flex items-center gap-3 lg:mt-0.5 lg:self-start">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            </div>
            <span className="font-medium text-[color:var(--landing-text)] lg:hidden">{benefit.title}</span>
          </div>
          <div className="text-center lg:text-left">
            <span className="hidden font-medium text-[color:var(--landing-text)] lg:block">
              {benefit.title}
            </span>
            <p className="mt-0 text-sm text-[color:var(--landing-text-soft)] lg:mt-1">
              {benefit.description}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function InstallCodeSnippet({ copySource }: { copySource: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SCRIPT_CODE);
    setCopied(true);
    trackEvent(RouteEvents.CODE_COPY, {
      code_type: 'installation_script',
      source: copySource,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="landing-demo-panel mx-auto w-full max-w-lg overflow-hidden">
      <div className="flex items-center justify-between border-b border-[color:var(--dash-divider)] px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-[color:color-mix(in_srgb,var(--dash-danger)_38%,transparent)]" />
          <div className="h-2.5 w-2.5 rounded-full bg-[color:color-mix(in_srgb,var(--dash-warning)_38%,transparent)]" />
          <div className="h-2.5 w-2.5 rounded-full bg-[color:color-mix(in_srgb,var(--dash-success)_38%,transparent)]" />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--landing-text-muted)]">
          script.js
        </span>
      </div>

      <div className="p-4 sm:p-6 md:p-8">
        <div className="landing-code-block relative overflow-hidden rounded-[8px] border border-[color:var(--dash-border)] bg-[color:var(--dash-bg-subtle)] p-4 text-xs sm:p-5 sm:text-sm md:p-6">
          <pre className="overflow-x-auto pr-8 text-[color:var(--dash-code-text)]">
            <code>
              <span className="text-[#94a3b8]">&lt;</span>
              <span className="text-[color:var(--dash-code-tag)]">script</span>
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
              <span className="text-[color:var(--dash-code-tag)]">script</span>
              <span className="text-[#94a3b8]">&gt;</span>
            </code>
          </pre>
          <button
            type="button"
            onClick={handleCopy}
            data-umami-event={RouteEvents.CODE_COPY}
            data-umami-event-code-type="installation_script"
            data-umami-event-source={copySource}
            className="absolute right-3 top-3 rounded-lg border border-transparent p-2 text-[color:var(--landing-text-muted)] transition-colors hover:border-[color:var(--dash-border)] hover:bg-[color:var(--dash-surface)] hover:text-[color:var(--landing-text)] sm:right-4 sm:top-4"
            aria-label="Copy code"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-500 sm:h-5 sm:w-5" />
            ) : (
              <Copy className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function LandingInstallSection({
  title,
  description,
  benefits,
  copySource,
  sectionRef,
}: LandingInstallSectionProps) {
  return (
    <section
      ref={sectionRef}
      className="w-full border-y border-[color:var(--landing-border)] bg-[color:var(--landing-page-bg)] py-24 md:py-36"
    >
      <div className="mx-auto w-full max-w-7xl px-6 md:px-16">
        <div className="mb-16 text-center md:mb-20">
          <h2 className="text-3xl font-bold tracking-tight text-[color:var(--landing-text)] md:text-4xl">{title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[color:var(--landing-text-soft)] md:text-lg">
            {description}
          </p>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 w-full lg:order-1 lg:max-w-none">
            <InstallCodeSnippet copySource={copySource} />
          </div>
          <div className="order-1 lg:order-2">
            <InstallBenefitList benefits={benefits} />
          </div>
        </div>
      </div>
    </section>
  );
}
