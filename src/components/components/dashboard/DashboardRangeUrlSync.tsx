'use client';

/**
 * Keeps the dashboard time range and the URL in sync:
 * - On mount, hydrates Redux from a `?range=` query param so links are shareable.
 * - After the user picks a range, mirrors it back into the URL on every page
 *   so the address bar always describes the view being looked at.
 *
 * Uses history.replaceState (not router.replace) to avoid re-running the
 * force-dynamic server render just to update a query param.
 */

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector, setFilter, selectFilters } from '@/lib/redux';
import { normalizeTimeRange, RANGE_DAYS, type TimeRange } from '@/lib/core/time-range';

function isValidRange(value: string): value is TimeRange {
  return value in RANGE_DAYS;
}

export function DashboardRangeUrlSync() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const { range } = useAppSelector(selectFilters('overview')) as { range: string };
  // Skip mirroring until the user (or the URL) has explicitly chosen a range,
  // so default views keep clean URLs.
  const shouldMirrorRef = useRef(false);

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('range');
    if (!param) return;
    const normalized = normalizeTimeRange(param);
    if (typeof normalized === 'string' && isValidRange(normalized)) {
      shouldMirrorRef.current = true;
      dispatch(setFilter({ page: 'overview', key: 'range', value: normalized }));
    }
  }, [dispatch]);

  const lastRangeRef = useRef(range);
  const didMountRef = useRef(false);
  useEffect(() => {
    // Skip the mount run: it sees pre-hydration state and must not overwrite
    // an incoming ?range= param with the default.
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    if (range !== lastRangeRef.current) {
      lastRangeRef.current = range;
      shouldMirrorRef.current = true;
    }
    if (!shouldMirrorRef.current) return;
    const url = new URL(window.location.href);
    if (url.searchParams.get('range') === range) return;
    url.searchParams.set('range', range);
    window.history.replaceState(window.history.state, '', url);
  }, [range, pathname]);

  return null;
}
