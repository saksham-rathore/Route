import type { ReactNode } from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { SiteFooter } from '@/components/landing/SiteFooter';

type ProductLandingShellProps = {
  hero: ReactNode;
  video?: ReactNode;
  children: ReactNode;
};

export function ProductLandingShell({ hero, video, children }: ProductLandingShellProps) {
  return (
    <div className="landing-theme min-h-screen flex flex-col overflow-x-hidden bg-[color:var(--landing-page-bg)] text-[color:var(--landing-text)]">
      <main className="flex-1">
        <div className="relative overflow-hidden [background:radial-gradient(125%_125%_at_50%_0%,transparent_40%,var(--color-blue-600),var(--landing-page-bg)_100%)]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-24 bg-[linear-gradient(180deg,transparent_0%,color-mix(in_srgb,var(--landing-page-bg)_58%,transparent)_55%,var(--landing-page-bg)_100%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-8 -bottom-10 z-0 h-20 rounded-full bg-[color:var(--landing-page-bg)]/80 blur-3xl"
          />
          <Navbar />
          {hero}
          {video ? <div className="relative z-10 scroll-mt-20">{video}</div> : null}
        </div>

        <div className="landing-theme bg-[color:var(--landing-page-bg)]">{children}</div>
      </main>
      <SiteFooter showThemeToggle />
    </div>
  );
}
