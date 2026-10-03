'use client';

const regionRows = [
  { label: 'New York', country: 'US', requests: '45.2K', p95: '89ms', tone: 'good' as const },
  { label: 'Delhi', country: 'IN', requests: '34.6K', p95: '267ms', tone: 'warn' as const },
  { label: 'London', country: 'GB', requests: '42.1K', p95: '67ms', tone: 'good' as const },
  { label: 'Tokyo', country: 'JP', requests: '38.9K', p95: '45ms', tone: 'good' as const },
  { label: 'Cairo', country: 'EG', requests: '11.2K', p95: '234ms', tone: 'warn' as const },
  { label: 'Sydney', country: 'AU', requests: '21.3K', p95: '102ms', tone: 'good' as const },
];

const toneStyles = {
  good: 'text-[color:var(--dash-success)]',
  warn: 'text-[color:var(--dash-warning)]',
};

export function HeroMapMobilePreview() {
  return (
    <div className="landing-demo-panel mx-auto w-full max-w-lg overflow-hidden md:hidden">
      <div className="border-b border-[color:var(--dash-divider)] px-5 py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--dash-text-muted)]">
          Global edge map
        </p>
        <h3 className="mt-1 text-sm font-semibold text-[color:var(--dash-text)]">
          Active regions snapshot
        </h3>
      </div>
      <div className="divide-y divide-[color:var(--dash-divider)]">
        {regionRows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-3 px-5 py-3.5"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[color:var(--dash-text)]">
                {row.label}
              </p>
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--dash-text-muted)]">
                {row.country}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-mono text-xs tabular-nums text-[color:var(--dash-text-soft)]">
                {row.requests}
              </p>
              <p className={`mt-0.5 text-sm font-semibold tabular-nums ${toneStyles[row.tone]}`}>
                {row.p95}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
