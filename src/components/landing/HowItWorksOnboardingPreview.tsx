'use client';

import { Copy } from 'lucide-react';
import { LandingDemoMediaFrame } from '@/components/landing/LandingDemoMediaFrame';
import { InstallSnippetHighlight } from '@/components/landing/InstallSnippetHighlight';
import { DEFAULT_BEACON_SCRIPT_URL } from '@/lib/analytics/beacon-snippet';

const DEMO_PROJECT_ID = 'YOUR_PROJECT_ID';
const DEMO_DOMAIN = 'route.dev';

const cardClassName =
  'landing-card-solid flex h-full min-w-0 flex-col rounded-[6px] p-4';

const fieldClassName =
  'rounded-lg border border-[color:var(--landing-border-strong)] bg-[color:var(--landing-surface-muted)] px-3 py-2 text-sm text-[color:var(--landing-text)]';

const ctaClassName =
  'dashboard-button-primary flex w-full items-center justify-center gap-2 py-2.5 text-sm font-semibold';

const ctaWrapClassName = 'mt-auto pt-3 sm:pt-4';

function StepOne() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--landing-text-muted)]">
        Step 1 of 2
      </p>
      <h3 className="mt-1.5 text-lg font-semibold text-[color:var(--dash-blue)]">Create project</h3>

      <div className="mt-5 space-y-4">
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-[color:var(--landing-text-muted)]">
            Name
          </p>
          <div className={fieldClassName} aria-hidden>
            my-app
          </div>
        </div>
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-[color:var(--landing-text-muted)]">
            Domain
          </p>
          <div className={fieldClassName} aria-hidden>
            {DEMO_DOMAIN}
          </div>
        </div>
      </div>

      <div className={ctaWrapClassName}>
        <div className={ctaClassName} aria-hidden>
          Create project
        </div>
      </div>
    </div>
  );
}

function StepTwo() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--landing-text-muted)]">
        Step 2 of 2
      </p>
      <h3 className="mt-1.5 text-lg font-semibold text-[color:var(--dash-blue)]">Install snippet</h3>
      <p className="mt-1 text-xs leading-5 text-[color:var(--landing-text-soft)]">
        Paste in <span className="font-mono text-[color:var(--landing-text)]">&lt;head&gt;</span>. Live in
        minutes.
      </p>

      <div className="landing-demo-panel mt-5 min-h-0 overflow-hidden">
        <div className="flex items-center justify-between border-b border-[color:var(--dash-divider)] px-3 py-1.5">
          <div className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[color:color-mix(in_srgb,var(--dash-danger)_38%,transparent)]" />
            <span className="h-2 w-2 rounded-full bg-[color:color-mix(in_srgb,var(--dash-warning)_38%,transparent)]" />
            <span className="h-2 w-2 rounded-full bg-[color:color-mix(in_srgb,var(--dash-success)_38%,transparent)]" />
          </div>
          <span className="font-mono text-[9px] uppercase tracking-wider text-[color:var(--landing-text-muted)]">
            script.js
          </span>
        </div>
        <div className="p-2.5 sm:p-3">
          <div className="landing-code-block rounded-md border border-[color:var(--dash-border)] bg-[color:var(--dash-bg-subtle)] p-2.5">
            <InstallSnippetHighlight
              scriptBaseUrl={DEFAULT_BEACON_SCRIPT_URL}
              projectId={DEMO_PROJECT_ID}
              domain={DEMO_DOMAIN}
              techStack="vanilla"
              codeClassName="text-[10px] leading-snug"
            />
          </div>
        </div>
      </div>

      <div className={ctaWrapClassName}>
        <div className={ctaClassName} aria-hidden>
          <Copy className="h-3.5 w-3.5" aria-hidden />
          Copy snippet
        </div>
      </div>
    </div>
  );
}

export function HowItWorksOnboardingPreview() {
  return (
    <LandingDemoMediaFrame>
      <div className="grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 sm:gap-4">
        <div className={cardClassName}>
          <StepOne />
        </div>
        <div className={cardClassName}>
          <StepTwo />
        </div>
      </div>
    </LandingDemoMediaFrame>
  );
}
