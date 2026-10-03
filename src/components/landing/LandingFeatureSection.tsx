import type { ReactNode, RefObject } from 'react';

type LandingFeatureSectionProps = {
  id?: string;
  sectionRef?: RefObject<HTMLElement | null>;
  eyebrow?: string;
  title: ReactNode;
  description: ReactNode;
  media: ReactNode;
  mediaPosition?: 'left' | 'right';
  className?: string;
  children?: ReactNode;
};

export function LandingFeatureSection({
  id,
  eyebrow,
  title,
  description,
  media,
  mediaPosition = 'right',
  className = '',
  children,
  sectionRef,
}: LandingFeatureSectionProps) {
  const copy = (
    <div className="min-w-0">
      {eyebrow ? (
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--landing-text-muted)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-bold tracking-tight text-[color:var(--landing-text)] md:text-4xl">
        {title}
      </h2>
      <div className="mt-4 text-sm leading-7 text-[color:var(--landing-text-soft)] md:text-base">
        {description}
      </div>
      {children}
    </div>
  );

  const mediaBlock = <div className="min-w-0 w-full">{media}</div>;

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`scroll-mt-20 w-full border-b border-[color:var(--landing-border)] bg-[color:var(--landing-page-bg)] py-16 md:py-20 ${className}`}
    >
      <div className="mx-auto w-full min-w-0 max-w-7xl px-6 md:px-16">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {mediaPosition === 'left' ? (
            <>
              {mediaBlock}
              {copy}
            </>
          ) : (
            <>
              {copy}
              {mediaBlock}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
