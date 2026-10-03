import type { ReactNode } from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { BreadcrumbJsonLd, ContactPageJsonLd, WebPageJsonLd } from '@/lib/seo/json-ld';

interface LegalPageShellProps {
  title: string;
  description: string;
  lastUpdated?: string;
  path: string;
  badge: string;
  breadcrumbName: string;
  children: ReactNode;
  contactJsonLd?: boolean;
  datePublished?: string;
  dateModified?: string;
}

export function LegalPageShell({
  title,
  description,
  lastUpdated,
  path,
  badge,
  breadcrumbName,
  children,
  contactJsonLd = false,
  datePublished = '2026-03-10',
  dateModified,
}: LegalPageShellProps) {
  return (
    <div className="landing-theme flex min-h-screen flex-col overflow-x-hidden bg-[color:var(--landing-page-bg)] text-[color:var(--landing-text)]">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: breadcrumbName, path },
        ]}
      />
      {contactJsonLd ? (
        <ContactPageJsonLd title={title} description={description} path={path} />
      ) : null}
      <WebPageJsonLd
        title={title}
        description={description}
        path={path}
        datePublished={datePublished}
        dateModified={dateModified ?? datePublished}
      />
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-7xl px-6 pb-20 pt-24 md:px-16 md:pb-24 md:pt-28">
          <header className="border-b border-[color:var(--landing-border)] pb-8 md:pb-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--landing-accent)]">
              {badge}
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-[color:var(--landing-text)] md:text-4xl">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[color:var(--landing-text-soft)]">
              {description}
            </p>
            {lastUpdated ? (
              <p className="mt-4 text-sm leading-6 text-[color:var(--landing-text-muted)]">
                Last updated: {lastUpdated}
              </p>
            ) : null}
          </header>

          <div className="legal-prose mt-10 md:mt-12">{children}</div>
        </div>
      </main>
      <SiteFooter showThemeToggle />
    </div>
  );
}
