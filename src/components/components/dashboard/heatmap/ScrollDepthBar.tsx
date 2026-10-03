import { scrollBucketBarColor } from '@/components/dashboard/heatmap/scrollBucketsToGradient';

interface ScrollBucket {
  label: string;
  value: number;
  pct: number;
}

interface ScrollDepthBarProps {
  scrollBuckets: ScrollBucket[];
  avgScrollPercentage: number;
}

const BUCKET_ORDER = ['75-100%', '50-74%', '25-49%', '0-24%', 'Unknown'];

export function ScrollDepthBar({ scrollBuckets, avgScrollPercentage }: ScrollDepthBarProps) {
  const sorted = [...scrollBuckets].sort(
    (a, b) => BUCKET_ORDER.indexOf(a.label) - BUCKET_ORDER.indexOf(b.label),
  );

  return (
    <div className="space-y-3">
      <p className="text-sm text-[color:var(--dash-text-soft)]">
        Avg scroll depth:{' '}
        <span className="font-medium text-[color:var(--dash-text)]">{avgScrollPercentage}%</span>
      </p>
      {sorted.map((bucket) => (
        <div key={bucket.label} className="flex items-center gap-3">
          <span className="w-16 text-right text-xs text-[color:var(--dash-text-muted)]">
            {bucket.label}
          </span>
          <div className="h-6 flex-1 overflow-hidden rounded bg-[color:var(--dash-bg-subtle)]">
            <div
              className="h-full rounded transition-all duration-300"
              style={{
                width: `${Math.max(bucket.pct, 1)}%`,
                backgroundColor: scrollBucketBarColor(bucket.label),
              }}
            />
          </div>
          <span className="w-24 text-xs text-[color:var(--dash-text-soft)]">
            {bucket.value.toLocaleString()} ({bucket.pct}%)
          </span>
        </div>
      ))}
    </div>
  );
}
