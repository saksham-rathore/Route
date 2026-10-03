import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { getPublicDemoUrl } from '@/lib/demo/config';

const QUICK_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Live demo', href: getPublicDemoUrl(), external: true },
  { label: 'User analytics', href: '/user-analytics' },
  { label: 'Observability', href: '/observability' },
] as const;

export function NotFoundPage() {
  const demoUrl = getPublicDemoUrl();

  return (
    <div className="landing-theme flex min-h-screen flex-col overflow-x-hidden bg-[color:var(--landing-page-bg)] text-[color:var(--landing-text)]">
      <div className="relative flex min-h-screen flex-col overflow-hidden [background:radial-gradient(125%_125%_at_50%_0%,transparent_40%,var(--color-blue-600),var(--landing-page-bg)_100%)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(var(--landing-grid-line)_1px,transparent_1px),linear-gradient(90deg,var(--landing-grid-line)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_20%,black_20%,transparent_75%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-32 h-72 w-72 rounded-full bg-[color:var(--dash-blue)]/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 bottom-40 h-64 w-64 rounded-full bg-[color:var(--dash-blue-soft)] blur-3xl"
        />

        <Navbar />

        <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-20 pt-28 md:px-16 md:pb-28 md:pt-32">
          <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--landing-text-muted)]">
              Page not found
            </p>

            <h1
              className="mt-4 text-[clamp(4.5rem,18vw,8.5rem)] font-bold leading-none tracking-[-0.06em] text-[color:var(--landing-text)]"
              aria-label="404"
            >
              4<span className="text-[color:var(--landing-accent)]">0</span>4
            </h1>

            <p className="mt-5 max-w-lg text-balance text-sm leading-7 text-[color:var(--landing-text-soft)] sm:text-base">
              This route does not exist or may have moved.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/" className="dashboard-button-primary h-11 px-7 text-sm font-semibold md:h-12 md:px-8">
                Back to home
              </Link>
              <Link
                href={demoUrl}
                className="dashboard-button-secondary landing-secondary-button h-11 px-6 text-sm font-medium md:h-12 md:px-7"
              >
                View demo
              </Link>
            </div>

            <nav
              aria-label="Helpful links"
              className="mt-10 hidden flex-wrap items-center justify-center gap-x-5 gap-y-2 md:flex"
            >
              {QUICK_LINKS.map((link, index) => (
                <span key={link.href} className="inline-flex items-center gap-5">
                  {index > 0 ? (
                    <span className="text-[color:var(--landing-text-muted)]" aria-hidden>
                      ·
                    </span>
                  ) : null}
                  <Link
                    href={link.href}
                    {...('external' in link && link.external
                      ? { target: '_blank', rel: 'noreferrer' }
                      : {})}
                    className="text-sm text-[color:var(--landing-text-soft)] transition-colors hover:text-[color:var(--landing-text)]"
                  >
                    {link.label}
                  </Link>
                </span>
              ))}
            </nav>
          </div>
        </main>

        <SiteFooter showThemeToggle />
      </div>
    </div>
  );
}
