'use client';

import Link from 'next/link';
import { getProjectHref, useDashboardShell } from './DashboardShellContext';
import { getUserAnalyticsHref } from '@/lib/user-analytics/tabs';

interface AnalyticsModeToggleProps {
  projectId: string;
  mode: 'network' | 'user';
}

export function AnalyticsModeToggle({
  projectId,
  mode,
}: AnalyticsModeToggleProps) {
  const { basePath } = useDashboardShell();

  const items = [
    {
      key: 'network' as const,
      label: 'Network',
      href: getProjectHref(basePath, projectId),
    },
    {
      key: 'user' as const,
      label: 'User',
      href: getUserAnalyticsHref(basePath, projectId),
    },
  ];

  return (
    <div className="inline-flex items-center gap-1 rounded-xl border border-[#1d1d1d] bg-[#0d0d0d] p-1 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      {items.map((item) => {
        const active = item.key === mode;

        return (
          <Link
            key={item.key}
            href={item.href}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              active
                ? 'bg-[color:color-mix(in_srgb,var(--dash-success)_18%,transparent)] text-[color:var(--dash-success)] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--dash-success)_18%,transparent)]'
                : 'text-[#7b7b7b] hover:text-white'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
