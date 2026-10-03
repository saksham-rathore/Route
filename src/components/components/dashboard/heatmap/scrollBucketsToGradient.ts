export interface ScrollBucket {
  label: string;
  value: number;
  pct: number;
}

const BUCKET_LABELS = ['0-24%', '25-49%', '50-74%', '75-100%'] as const;

const BUCKET_ZONES: Array<{ label: (typeof BUCKET_LABELS)[number]; start: number; end: number }> = [
  { label: '0-24%', start: 0, end: 25 },
  { label: '25-49%', start: 25, end: 50 },
  { label: '50-74%', start: 50, end: 75 },
  { label: '75-100%', start: 75, end: 100 },
];

function getBucketPct(buckets: ScrollBucket[], label: string): number {
  return buckets.find((b) => b.label === label)?.pct ?? 0;
}

function getBucketValue(buckets: ScrollBucket[], label: string): number {
  return buckets.find((b) => b.label === label)?.value ?? 0;
}

/** Same denominator as bar-chart pct (all pageviews incl. Unknown). */
function getTotalPageviews(buckets: ScrollBucket[]): number {
  return buckets.reduce((sum, b) => sum + b.value, 0);
}

/**
 * % of all pageviews whose max scroll reached at least depthPct.
 * Matches bar data: at 75%+ depth, reach equals the 75-100% bucket pct.
 */
export function cumulativeReach(buckets: ScrollBucket[], depthPct: number): number {
  const total = getTotalPageviews(buckets);
  if (total === 0) return 0;
  if (depthPct <= 0) return 100;

  const midLow = getBucketValue(buckets, '25-49%');
  const midHigh = getBucketValue(buckets, '50-74%');
  const deep = getBucketValue(buckets, '75-100%');

  let count: number;
  if (depthPct > 75) {
    count = deep;
  } else if (depthPct > 50) {
    count = midHigh + deep;
  } else if (depthPct > 25) {
    count = midLow + midHigh + deep;
  } else {
    return 100;
  }

  return (count / total) * 100;
}

const SCROLL_HEAT_GREEN = '#22c55e';
const SCROLL_HEAT_YELLOW = '#eab308';
const SCROLL_HEAT_RED = '#ef4444';
/** Subtle tint — same hues, low opacity to match dashboard theme. */
const SCROLL_HEAT_ALPHA = 0.2;

/** High intensity → red, low → green (full-strength base hue). */
function intensityToColor(intensity: number): string {
  const clamped = Math.max(0, Math.min(100, intensity));
  if (clamped >= 50) {
    const t = (clamped - 50) / 50;
    const yellowPct = (1 - t) * 100;
    const redPct = t * 100;
    return `color-mix(in srgb, ${SCROLL_HEAT_YELLOW} ${yellowPct}%, ${SCROLL_HEAT_RED} ${redPct}%)`;
  }
  const t = clamped / 50;
  const greenPct = (1 - t) * 100;
  const yellowPct = t * 100;
  return `color-mix(in srgb, ${SCROLL_HEAT_GREEN} ${greenPct}%, ${SCROLL_HEAT_YELLOW} ${yellowPct}%)`;
}

function mutedHeatColor(intensity: number, alpha = SCROLL_HEAT_ALPHA): string {
  const alphaPct = Math.round(Math.max(0, Math.min(1, alpha)) * 100);
  return `color-mix(in srgb, ${intensityToColor(intensity)} ${alphaPct}%, transparent)`;
}

function mutedSolidColor(hex: string, alpha = SCROLL_HEAT_ALPHA): string {
  const alphaPct = Math.round(Math.max(0, Math.min(1, alpha)) * 100);
  return `color-mix(in srgb, ${hex} ${alphaPct}%, transparent)`;
}

function bucketPctToIntensity(pct: number, minPct: number, maxPct: number): number {
  if (maxPct === minPct) return 100;
  return ((pct - minPct) / (maxPct - minPct)) * 100;
}

export interface ScrollGradientStop {
  depthPct: number;
  reach: number;
  color: string;
  opacity: number;
}

/**
 * Each page zone is colored by how many users scrolled that far (bucket pct).
 * Highest bucket pct = red — even at the bottom if that's where most scroll stops.
 * Opacity scales with bucket pct (heavier where more users scrolled).
 */
export function scrollBucketsToGradientStops(buckets: ScrollBucket[]): ScrollGradientStop[] {
  const zonePcts = BUCKET_ZONES.map((z) => getBucketPct(buckets, z.label));
  const minPct = Math.min(...zonePcts);
  const maxPct = Math.max(...zonePcts);

  const stops: ScrollGradientStop[] = [];
  for (const zone of BUCKET_ZONES) {
    const pct = getBucketPct(buckets, zone.label);
    const intensity = bucketPctToIntensity(pct, minPct, maxPct);
    const color = mutedHeatColor(intensity);
    stops.push({ depthPct: zone.start, reach: pct, color, opacity: SCROLL_HEAT_ALPHA });
    if (zone.end < 100) {
      stops.push({ depthPct: zone.end - 0.1, reach: pct, color, opacity: SCROLL_HEAT_ALPHA });
    }
  }
  const bottomPct = getBucketPct(buckets, '75-100%');
  stops.push({
    depthPct: 100,
    reach: bottomPct,
    color: mutedHeatColor(bucketPctToIntensity(bottomPct, minPct, maxPct)),
    opacity: SCROLL_HEAT_ALPHA,
  });
  return stops;
}

export function scrollBucketsToGradient(buckets: ScrollBucket[]): string {
  const stops = scrollBucketsToGradientStops(buckets);
  const parts = stops.map((s) => `${s.color} ${s.depthPct}%`);
  return `linear-gradient(to bottom, ${parts.join(', ')})`;
}

/** Bar color by scroll depth zone (matches overlay palette). */
export function scrollBucketBarColor(label: string): string {
  if (label === 'Unknown') return mutedSolidColor('#94a3b8');
  const depthIntensity: Record<string, number> = {
    '0-24%': 0,
    '25-49%': 35,
    '50-74%': 65,
    '75-100%': 100,
  };
  return mutedHeatColor(depthIntensity[label] ?? 50);
}

/** Horizontal legend swatch (red → yellow → green). */
export function scrollReachLegendGradient(): string {
  return `linear-gradient(to right, ${mutedSolidColor(SCROLL_HEAT_RED)}, ${mutedSolidColor(SCROLL_HEAT_YELLOW)}, ${mutedSolidColor(SCROLL_HEAT_GREEN)})`;
}

/** For tests / debugging: bucket pct at each zone midpoint. */
export function bucketMidpointReach(buckets: ScrollBucket[]): Array<{ label: string; reach: number }> {
  return BUCKET_LABELS.map((label) => ({
    label,
    reach: getBucketPct(buckets, label),
  }));
}
