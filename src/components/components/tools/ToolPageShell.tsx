import type { ReactNode } from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { BreadcrumbJsonLd, WebPageJsonLd } from '@/lib/seo/json-ld';

interface ToolPageShellProps {
  title: string;
  description: string;
  eyebrow?: string;
  path: string;
  breadcrumbName: string;
  children: ReactNode;
}

/**
 * Standard wrapper for /tools/* pages: landing theme, Navbar, hero with
 * gradient + eyebrow + title + sub, content section, SiteFooter, and the
 * SEO JSON-LD pair. Each tool's page only has to render its client
 * component inside this.
 */
export function ToolPageShell({
  title,
  description,
  eyebrow = 'Free tool',
  path,
  breadcrumbName,
  children,
}: ToolPageShellProps) {
  return (
    <div className="landing-theme flex min-h-screen flex-col overflow-x-hidden bg-[color:var(--landing-page-bg)] text-[color:var(--landing-text)]">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Tools', path: '/tools' },
          { name: breadcrumbName, path },
        ]}
      />
      <WebPageJsonLd title={title} description={description} path={path} />
      <Navbar />
      <main className="flex-1">
        <div className="relative overflow-hidden [background:radial-gradient(125%_125%_at_50%_0%,transparent_40%,var(--color-blue-600),var(--landing-page-bg)_100%)]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-24 bg-[linear-gradient(180deg,transparent_0%,color-mix(in_srgb,var(--landing-page-bg)_58%,transparent)_55%,var(--landing-page-bg)_100%)]"
          />
          <section className="relative z-10 overflow-hidden pt-16">
            <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 pb-10 pt-14 text-center md:px-8 md:pb-14 md:pt-20">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--landing-accent)]">
                {eyebrow}
              </p>
              <h1 className="relative mt-4 max-w-3xl text-balance text-[2rem] font-bold leading-[1.08] tracking-[-0.04em] text-[color:var(--landing-text)] sm:text-5xl md:text-6xl">
                {title}
              </h1>
              <p className="relative mt-5 max-w-2xl text-balance text-sm leading-7 text-[color:var(--landing-text-soft)] sm:text-base md:mt-6 md:text-lg md:leading-8">
                {description}
              </p>
            </div>
          </section>
        </div>

        <section className="relative -mt-4 pb-20 md:-mt-6 md:pb-28">{children}</section>
      </main>
      <SiteFooter showThemeToggle />
    </div>
  );
}
