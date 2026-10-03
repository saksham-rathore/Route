'use client';

/**
 * Headless auto-refresh engine for the dashboard.
 *
 * While live mode is enabled (default on) and the tab is visible, periodically
 * invalidates every dashboard cache tag so all mounted queries refetch. Server
 * responses are cached (CACHE_TTL.SHORT), so the refresh cost stays bounded.
 */

import { useEffect, useRef } from 'react';
import {
  CacheTag,
  selectRealtimeState,
  useAppDispatch,
  useAppSelector,
} from '@/lib/redux';
import { dashboardApi } from '@/lib/redux/services/dashboardApi';

export const LIVE_REFRESH_INTERVAL_MS = 60_000;

const ALL_TAGS = Object.values(CacheTag);

export function DashboardLiveRefresh() {
  const dispatch = useAppDispatch();
  const { isEnabled } = useAppSelector(selectRealtimeState);
  const lastRefreshRef = useRef(Date.now());

  useEffect(() => {
    if (!isEnabled) return;

    const refresh = () => {
      if (document.visibilityState !== 'visible') return;
      lastRefreshRef.current = Date.now();
      dispatch(dashboardApi.util.invalidateTags(ALL_TAGS));
    };

    // Returning to a stale tab refreshes once. refetchOnFocus stays off
    // globally (per the note in dashboardApi) — this is the single
    // coordinated alternative to the per-query thundering herd.
    const handleVisibility = () => {
      if (document.visibilityState !== 'visible') return;
      if (Date.now() - lastRefreshRef.current >= LIVE_REFRESH_INTERVAL_MS) {
        refresh();
      }
    };

    const interval = window.setInterval(refresh, LIVE_REFRESH_INTERVAL_MS);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [dispatch, isEnabled]);

  return null;
}
