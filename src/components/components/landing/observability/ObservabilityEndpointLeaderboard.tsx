const endpoints = [
  { path: '/api/checkout', p95: '892ms', errors: '0.4%' },
  { path: '/api/auth/session', p95: '312ms', errors: '0.1%' },
  { path: '/api/search', p95: '1.2s', errors: '1.8%' },
  { path: '/api/billing/invoice', p95: '456ms', errors: '0.0%' },
  { path: '/graphql', p95: '678ms', errors: '0.6%' },
] as const;

export function ObservabilityEndpointLeaderboard() {
  return (
    <div className="landing-demo-panel overflow-hidden">
      <div className="border-b border-[color:var(--landing-border)] px-4 py-3 sm:px-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--dash-text-muted)]">
          Slowest endpoints · last 60m
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[400px] text-left text-sm">
          <thead>
            <tr className="border-b border-[color:var(--landing-border)] text-[10px] uppercase tracking-[0.14em] text-[color:var(--dash-text-muted)]">
              <th className="px-4 py-2.5 font-medium sm:px-5">Route</th>
              <th className="px-4 py-2.5 font-medium sm:px-5">p95</th>
              <th className="px-4 py-2.5 font-medium sm:px-5">Errors</th>
            </tr>
          </thead>
          <tbody>
            {endpoints.map((row) => (
              <tr key={row.path} className="border-b border-[color:var(--landing-border)] last:border-b-0">
                <td className="px-4 py-3 font-mono text-xs text-[color:var(--dash-text-soft)] sm:px-5">{row.path}</td>
                <td className="px-4 py-3 font-mono tabular-nums text-[color:var(--dash-text)] sm:px-5">{row.p95}</td>
                <td className="px-4 py-3 font-mono tabular-nums sm:px-5">{row.errors}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
