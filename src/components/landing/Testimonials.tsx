'use client';

import { LandingSectionIntro } from '@/components/landing/LandingSectionIntro';
import {
  formatSocialHandle,
  getAlternatingTestimonials,
  testimonials,
  type QuoteTestimonial,
  type SocialPlatform,
  type SocialTestimonial,
  type Testimonial,
} from '@/components/landing/testimonail-data';
import { useSectionView } from '@/lib/analytics/use-section-view';

const CARD_SHELL_CLASS =
  'landing-glow-card mx-4 flex min-h-[185px] w-[22rem] shrink-0 flex-col rounded-xl bg-[color:var(--landing-surface-muted)] p-5 md:min-h-[210px] md:w-[28rem] md:p-6';

function getAvatarUrl(testimonial: Pick<Testimonial, 'name' | 'avatarUrl'>): string {
  if (testimonial.avatarUrl) return testimonial.avatarUrl;
  return `/api/avatar?name=${encodeURIComponent(testimonial.name)}`;
}

function TestimonialPlatformIcon({
  platform,
  className = 'h-4 w-4',
}: {
  platform: SocialPlatform;
  className?: string;
}) {
  const iconClass = `${className} shrink-0 text-[color:var(--landing-text-muted)]`;

  switch (platform) {
    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={iconClass}>
          <path
            fill="currentColor"
            d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a-1.998 1.998 0 1 1 0-3.996 1.998 1.998 0 0 1 0 3.996zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
          />
        </svg>
      );
    case 'producthunt':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={iconClass}>
          <path
            fill="currentColor"
            d="M13.604 8.4h-3.405V12h3.405c.995 0 1.801-.806 1.801-1.8 0-.994-.806-1.8-1.801-1.8zM12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm1.801 14.4h-3.405V18H8.4V6h5.401c2.485 0 4.5 2.015 4.5 4.5 0 2.485-2.015 4.5-4.5 4.5z"
          />
        </svg>
      );
    case 'hackernews':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={iconClass}>
          <path
            fill="currentColor"
            d="M0 24V0h24v24H0zM6.951 5.896l4.112 7.708v5.633h1.876v-5.633l4.115-7.708H17.73l-3.016 5.825-3.017-5.825H6.951z"
          />
        </svg>
      );
    case 'x':
    default:
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={iconClass}>
          <path
            fill="currentColor"
            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
          />
        </svg>
      );
  }
}

function QuoteCardContent({ testimonial }: { testimonial: QuoteTestimonial }) {
  return (
    <>
      <p className="flex-1 text-xs leading-5 text-[color:var(--landing-text-soft)] md:text-sm md:leading-6">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <div className="mt-3 flex shrink-0 items-center gap-3">
        {testimonial.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={getAvatarUrl(testimonial)}
            alt=""
            className="h-10 w-10 shrink-0 rounded-full border border-[color:var(--landing-border)] bg-[color:var(--landing-surface)] object-cover md:h-11 md:w-11"
          />
        ) : null}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[color:var(--landing-text)]">{testimonial.name}</p>
          <p className="mt-0.5 text-xs text-[color:var(--landing-text-muted)]">{testimonial.role}</p>
        </div>
      </div>
    </>
  );
}

function SocialCardContent({ testimonial }: { testimonial: SocialTestimonial }) {
  return (
    <>
      <div className="flex shrink-0 items-start gap-3.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getAvatarUrl(testimonial)}
          alt=""
          className="h-10 w-10 shrink-0 rounded-full border border-[color:var(--landing-border)] bg-[color:var(--landing-surface)] object-cover md:h-12 md:w-12"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[color:var(--landing-text)] md:text-base">
                {testimonial.name}
              </p>
              <p className="truncate text-xs text-[color:var(--landing-text-muted)] md:text-sm">
                {formatSocialHandle(testimonial.platform, testimonial.handle)}
              </p>
            </div>
            <TestimonialPlatformIcon
              platform={testimonial.platform}
              className="h-4 w-4 shrink-0 md:h-5 md:w-5"
            />
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs leading-5 text-[color:var(--landing-text-soft)] md:mt-4 md:text-sm md:leading-6">
        {testimonial.quote}
      </p>
    </>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className={CARD_SHELL_CLASS}>
      {testimonial.variant === 'social' ? (
        <SocialCardContent testimonial={testimonial} />
      ) : (
        <QuoteCardContent testimonial={testimonial} />
      )}
    </div>
  );
}

type TestimonialMarqueeRowProps = {
  items: readonly Testimonial[];
  duration?: number;
};

function TestimonialMarqueeRow({ items, duration = 60 }: TestimonialMarqueeRowProps) {
  return (
    <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,white_8%,white_92%,transparent_100%)]">
      <div
        className="landing-testimonial-marquee-track"
        style={{ animationDuration: `${duration}s` }}
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="landing-testimonial-marquee-group"
            aria-hidden={copy === 1 ? true : undefined}
          >
            {items.map((testimonial, index) => (
              <TestimonialCard
                key={`${testimonial.name}-${testimonial.variant}-${copy}-${index}`}
                testimonial={testimonial}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Testimonials() {
  const sectionRef = useSectionView('testimonials');

  return (
    <section
      ref={sectionRef}
      className="w-full border-y border-[color:var(--landing-border)] bg-[color:var(--landing-page-bg)] py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-16">
        <LandingSectionIntro
          eyebrow="Testimonials"
          title="What teams say about Route."
          description="Real feedback on user analytics and observability."
          className="mb-10 md:mb-14"
        />
      </div>

      <TestimonialMarqueeRow items={getAlternatingTestimonials(testimonials)} duration={60} />
    </section>
  );
}
