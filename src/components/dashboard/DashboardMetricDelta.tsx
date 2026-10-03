/**
 * Period-over-period delta hint for a metric card, e.g. "↓ 12% vs prev 24h".
 * `mode: 'pp'` compares percentage-point change (for rates) instead of relative change.
 */
export function DashboardMetricDelta({
  current,
  previous,
  rangeLabel,
  goodWhenDown = false,
  mode = 'percent',
}: {
  current: number;
  previous: number | null | undefined;
  rangeLabel: string;
  goodWhenDown?: boolean;
  mode?: 'percent' | 'pp';
}) {
  if (previous === null || previous === undefined) return null;
  if (mode === 'percent' && previous === 0) return null;

  const change = mode === 'pp' ? current - previous : ((current - previous) / previous) * 100;
  const magnitude = Math.abs(change);
  const isFlat = mode === 'pp' ? magnitude < 0.05 : magnitude < 1;

  if (isFlat) {
    return (
      <span className="text-[color:var(--dash-text-muted)]">
        ≈ same as prev {rangeLabel}
      </span>
    );
  }

  const isImprovement = goodWhenDown ? change < 0 : change > 0;
  const arrow = change > 0 ? '↑' : '↓';
  const amount =
    mode === 'pp'
      ? `${magnitude.toFixed(2)}pp`
      : `${magnitude >= 100 ? Math.round(magnitude) : magnitude.toFixed(1)}%`;

  return (
    <span
      className={
        isImprovement
          ? 'text-[color:var(--dash-success)]'
          : 'text-[color:var(--dash-danger)]'
      }
    >
      {arrow} {amount}{' '}
      <span className="text-[color:var(--dash-text-muted)]">vs prev {rangeLabel}</span>
    </span>
  );
}
