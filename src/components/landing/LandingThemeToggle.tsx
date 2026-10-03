'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { persistTheme, readTheme, type ThemeMode } from '@/lib/core/theme';

type LandingThemeToggleProps = {
  /** Icon-only control sized for the navbar (h-9). */
  compact?: boolean;
};

export function LandingThemeToggle({ compact = false }: LandingThemeToggleProps) {
  const [theme, setTheme] = useState<ThemeMode>('dark');

  useEffect(() => {
    const sync = () => setTheme(readTheme());
    sync();

    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-dashboard-theme'],
    });

    return () => observer.disconnect();
  }, []);

  const updateTheme = (nextTheme: ThemeMode) => {
    setTheme(nextTheme);
    persistTheme(nextTheme);
  };

  const shellClassName = compact
    ? 'inline-flex h-9 items-center rounded-[8px] border border-[color:var(--landing-border-strong)] bg-[color:var(--landing-surface)] p-0.5 shadow-[var(--landing-card-shadow)]'
    : 'inline-flex rounded-[8px] border border-[color:var(--landing-border)] bg-[color:var(--landing-surface)] p-0.5';

  return (
    <div className={shellClassName} role="group" aria-label="Color theme">
      {(['light', 'dark'] as const).map((mode) => {
        const active = theme === mode;
        const Icon = mode === 'light' ? Sun : Moon;
        return (
          <button
            key={mode}
            type="button"
            onClick={() => updateTheme(mode)}
            className={
              compact
                ? `inline-flex h-7 w-7 items-center justify-center rounded-[6px] transition-colors ${
                    active
                      ? 'bg-[color:var(--dash-blue)] text-[color:var(--dash-text-on-accent)] shadow-[var(--dash-button-shadow)]'
                      : 'text-[color:var(--landing-text-soft)] hover:bg-[color:var(--landing-surface-muted)] hover:text-[color:var(--landing-text)]'
                  }`
                : `inline-flex items-center gap-1.5 rounded-[6px] px-2.5 py-1.5 text-xs font-medium capitalize transition-colors ${
                    active
                      ? 'bg-[color:var(--dash-blue)] text-[color:var(--dash-text-on-accent)] shadow-[var(--dash-button-shadow)]'
                      : 'text-[color:var(--landing-text-soft)] hover:text-[color:var(--landing-text)]'
                  }`
            }
            aria-pressed={active}
            aria-label={mode === 'light' ? 'Light theme' : 'Dark theme'}
            title={mode === 'light' ? 'Light theme' : 'Dark theme'}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden />
            {!compact ? mode : null}
          </button>
        );
      })}
    </div>
  );
}
