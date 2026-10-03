'use client';

import { useMemo } from 'react';
import {
  STATUS_PAGE_UPTIME_HISTORY_DAYS,
  type StatusPageUptimeDayBucket,
} from '@/lib/status-pages/shared';
import { buildUptimeHistory, uptimeDayBarColor } from '@/lib/status-pages/uptime-history';

type UptimeBarStripProps = {
  history30d: StatusPageUptimeDayBucket[];
  className?: string;
  trackClassName?: string;
  labelClassName?: string;
};

const defaultTrackClassName =
  'grid h-8 w-full min-w-0 grid-cols-[repeat(30,minmax(0,1fr))] gap-[2px] overflow-hidden rounded-md bg-[#0f0f0f] p-1';

export function UptimeBarStrip({
  history30d,
  className = 'mt-4 w-full min-w-0',
  trackClassName = defaultTrackClassName,
  labelClassName = 'mt-2 flex items-center justify-between text-[10px] uppercase tracking-[0.14em] text-[#626262]',
}: UptimeBarStripProps) {
  const bars = useMemo(() => {
    const days =
      history30d.length === STATUS_PAGE_UPTIME_HISTORY_DAYS
        ? history30d
        : buildUptimeHistory(history30d);
    return days.slice(-STATUS_PAGE_UPTIME_HISTORY_DAYS);
  }, [history30d]);

  return (
    <div className={className}>
      <div className={trackClassName}>
        {bars.map((bucket) => (
          <div
            key={bucket.day}
            className="min-w-0 h-full rounded-[1px]"
            title={
              bucket.checkCount > 0 && bucket.uptimePercent !== null
                ? `${bucket.day}: ${bucket.uptimePercent.toFixed(2)}% uptime`
                : `${bucket.day}: No checks`
            }
            style={{
              backgroundColor: uptimeDayBarColor(bucket.status),
              opacity: bucket.status === 'up' ? 0.9 : bucket.status === 'unknown' ? 0.55 : 1,
            }}
          />
        ))}
      </div>
      <div className={labelClassName}>
        <span>30 days ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}
