'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'dashboard-theme';

type DocumentWithViewTransition = Document & {
  startViewTransition?: (cb: () => void) => { finished: Promise<void> };
};

function applyTheme(theme: ThemeMode) {
  document.documentElement.setAttribute('data-dashboard-theme', theme);
}

function commitTheme(next: ThemeMode) {
  const doc = document as DocumentWithViewTransition;
  if (typeof doc.startViewTransition === 'function' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    doc.startViewTransition(() => applyTheme(next));
  } else {
    applyTheme(next);
  }
  window.localStorage.setItem(STORAGE_KEY, next);
}

function readInitialTheme(): ThemeMode {
  const current = document.documentElement.getAttribute('data-dashboard-theme');
  if (current === 'light' || current === 'dark') return current;

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    applyTheme(stored);
    return stored;
  }

  const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  applyTheme(preferred);
  return preferred;
}

export function DashboardThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>('dark');

  useEffect(() => {
    setTheme(readInitialTheme());
  }, []);

  const updateTheme = (nextTheme: ThemeMode) => {
    if (nextTheme === theme) return;
    setTheme(nextTheme);
    commitTheme(nextTheme);
  };

  return (
    <div className="rounded-[12px]">
      <div className="grid grid-cols-2 gap-1">
      {(['light', 'dark'] as const).map((mode) => {
        const active = theme === mode;
        const Icon = mode === 'light' ? Sun : Moon;
        return (
          <button
            key={mode}
            type="button"
            onClick={() => updateTheme(mode)}
            className={`flex items-center justify-center gap-2 rounded-[8px] px-2 py-1.5 text-[11px] font-medium capitalize transition ${
              active
                ? 'bg-[color:var(--dash-blue)] text-[color:var(--dash-text-on-accent)] shadow-[var(--dash-button-shadow)]'
                : 'text-[color:var(--dash-text-soft)] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] hover:bg-[color:var(--dash-surface-hover)] hover:text-[color:var(--dash-text)]'
            }`}
            aria-pressed={active}
          >
            <Icon className="h-3.5 w-3.5" />
            {mode}
          </button>
        );
      })}
      </div>
    </div>
  );
}

export function DashboardThemeIconButton() {
  const [theme, setTheme] = useState<ThemeMode>('dark');

  useEffect(() => {
    setTheme(readInitialTheme());
  }, []);

  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  const Icon = theme === 'dark' ? Sun : Moon;

  const toggleTheme = () => {
    setTheme(nextTheme);
    commitTheme(nextTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex h-8 w-8 items-center justify-center rounded-md bg-[color:var(--dash-surface)] text-[color:var(--dash-text-soft)] shadow-[var(--dash-control-shadow)] transition hover:bg-[color:var(--dash-surface-hover)] hover:text-[color:var(--dash-text)]"
      aria-label={`Switch to ${nextTheme} theme`}
      title={`Switch to ${nextTheme} theme`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
