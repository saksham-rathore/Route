const signals = [
  {
    label: 'ISPs',
    title: 'Carrier-level latency',
    metric: 'BSNL p95',
    value: '1.84s',
    detail: 'Spot slow carriers, not just slow countries.',
    tone: 'text-[#ff5370]',
  },
  {
    label: 'Web Vitals',
    title: 'Real Core Web Vitals',
    metric: 'LCP p75',
    value: '1.8s',
    detail: 'Good / needs improvement / poor distributions.',
    tone: 'text-[color:var(--landing-accent)]',
  },
  {
    label: 'Endpoints',
    title: 'Route-level p95',
    metric: '/api/checkout',
    value: '892ms',
    detail: 'See which paths regressed for real users.',
    tone: 'text-[#f5a623]',
  },
  {
    label: 'Network',
    title: 'Last-mile timing',
    metric: 'DNS + TLS',
    value: '1.4s',
    detail: 'DNS, TCP, and TLS broken out per visit.',
    tone: 'text-[color:var(--landing-text)]',
  },
] as const;

export function ObservabilitySignalsGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {signals.map((signal) => (
        <div
          key={signal.label}
          className="landing-card-solid p-5"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--landing-text-muted)]">
            {signal.label}
          </p>
          <h3 className="mt-2 text-sm font-semibold text-[color:var(--landing-text)]">{signal.title}</h3>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--landing-text-muted)]">
            {signal.metric}
          </p>
          <p className={`mt-1 text-2xl font-semibold tabular-nums ${signal.tone}`}>{signal.value}</p>
          <p className="mt-3 text-sm leading-6 text-[color:var(--landing-text-soft)]">{signal.detail}</p>
        </div>
      ))}
    </div>
  );
}
