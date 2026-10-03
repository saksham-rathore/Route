import Link from 'next/link';
import { observabilityHowItWorksSteps } from '@/components/landing/product-page-copy';

export function ObservabilityHowItWorksCompact() {
  return (
    <section className="w-full border-b border-[color:var(--landing-border)] bg-[color:var(--landing-page-bg)] py-16 md:py-20">
      <div className="mx-auto w-full min-w-0 max-w-7xl px-6 md:px-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--landing-text-muted)]">
          How it works
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-[color:var(--landing-text)] md:text-4xl">
          From script tag to edge context in minutes
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--landing-text-soft)] md:text-base">
          No agents, no synthetic runners. Just real browser traffic enriched before it lands in your dashboard.{' '}
          <Link href="/#how" className="text-[color:var(--dash-blue)] hover:underline">
            See the full pipeline on the homepage
          </Link>
          .
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {observabilityHowItWorksSteps.map((step) => (
            <div
              key={step.step}
              className="landing-card-solid p-5"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--landing-text-muted)]">
                {step.step}
              </p>
              <h3 className="mt-2 text-base font-semibold text-[color:var(--landing-text)]">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[color:var(--landing-text-soft)]">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
