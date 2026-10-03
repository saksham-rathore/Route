import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type ProductCrossSellSectionProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
  highlights: readonly string[];
  href: string;
  ctaLabel: string;
  variant?: 'gradient' | 'plain';
};

export function ProductCrossSellSection({
  eyebrow,
  title,
  description,
  highlights,
  href,
  ctaLabel,
  variant = 'gradient',
}: ProductCrossSellSectionProps) {
  const sectionClassName =
    variant === 'gradient'
      ? 'relative overflow-hidden border-t border-[color:var(--landing-border)] py-16 md:py-20 [background:linear-gradient(180deg,color-mix(in_srgb,var(--dash-blue)_32%,var(--landing-page-bg))_0%,var(--landing-page-bg)_100%)]'
      : 'relative overflow-hidden border-t border-[color:var(--landing-border)] bg-[color:var(--landing-page-bg)] py-16 md:py-20';

  return (
    <section className={sectionClassName}>
      <div className="relative z-10 mx-auto max-w-7xl px-6 text-center md:px-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--landing-text-muted)]">
          {eyebrow}
        </p>
        <h2 className="mt-3 max-w-2xl mx-auto text-balance text-2xl font-bold tracking-tight text-[color:var(--landing-text)] md:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[color:var(--landing-text-soft)] md:text-base">
          {description}
        </p>
        {highlights.length > 0 ? (
          <p className="mt-6 text-sm text-[color:var(--landing-text-muted)]">{highlights.join(' · ')}</p>
        ) : null}
        <div className="mt-8 flex justify-center">
          <Link
            href={href}
            className="dashboard-button-primary inline-flex h-11 items-center gap-2 px-6 text-sm font-semibold"
          >
            {ctaLabel}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
