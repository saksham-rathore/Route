'use client';

/**
 * Live-mode toggle + freshness indicator for the dashboard header.
 * Pairs with DashboardLiveRefresh, which does the actual periodic refetching.
 */

import { useEffect, useState } from 'react';
import {
  selectRealtimeState,
  setRealtimeEnabled,
  useAppDispatch,
  useAppSelector,
} from '@/lib/redux';
import { trackEvent, RouteEvents } from '@/lib/analytics/route-analytics';

function formatAge(lastUpdate: string | null, now: number): string | null {
  if (!lastUpdate) return null;
  const ageSeconds = Math.max(0, Math.round((now - new Date(lastUpdate).getTime()) / 1000));
  if (ageSeconds < 10) return 'Updated just now';
  if (ageSeconds < 60) return `Updated ${ageSeconds}s ago`;
  const ageMinutes = Math.round(ageSeconds / 60);
  if (ageMinutes < 60) return `Updated ${ageMinutes}m ago`;
  return `Updated ${Math.round(ageMinutes / 60)}h ago`;
}

export function DashboardLiveIndicator() {
  const dispatch = useAppDispatch();
  const { isEnabled, lastUpdate } = useAppSelector(selectRealtimeState);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 10_000);
    return () => window.clearInterval(interval);
  }, []);

  const age = formatAge(lastUpdate, now);

  const handleToggle = () => {
    const next = !isEnabled;
    dispatch(setRealtimeEnabled(next));
    trackEvent(RouteEvents.DASHBOARD_LIVE_MODE_TOGGLE, {
      live_mode: next ? 'enabled' : 'paused',
    });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleToggle}
        aria-pressed={isEnabled}
        title={isEnabled ? 'Auto-refresh is on. Click to pause.' : 'Auto-refresh is paused. Click to resume.'}
        className={`flex items-center gap-1.5 rounded-sm px-1 py-0.5 text-[11px] font-medium transition-colors hover:opacity-90 ${
          isEnabled
            ? 'text-[color:var(--dash-success)]'
            : 'text-[color:var(--dash-text-muted)]'
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            isEnabled
              ? 'animate-pulse bg-[color:var(--dash-success)] shadow-[0_0_6px_2px_color-mix(in_srgb,var(--dash-success)_55%,transparent)]'
              : 'bg-[color:var(--dash-text-muted)]'
          }`}
        />
        {isEnabled ? 'Live' : 'Paused'}
      </button>
      {age ? (
        <span className="hidden text-[11px] text-[color:var(--dash-text-muted)] sm:inline">
          {age}
        </span>
      ) : null}
    </div>
  );
}
