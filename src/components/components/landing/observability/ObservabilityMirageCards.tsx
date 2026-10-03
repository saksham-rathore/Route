import { AlertTriangle, CheckCircle2 } from 'lucide-react';

function MetricRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'good' | 'warn' | 'bad';
}) {
  const toneClass =
    tone === 'good'
      ? 'text-[color:var(--landing-metric-good)]'
      : tone === 'warn'
        ? 'text-[color:var(--landing-metric-warn)]'
        : 'text-[color:var(--landing-metric-bad)]';

  return (
    <div className="flex items-center justify-between border-b border-[color:var(--landing-border)] py-2.5 last:border-b-0">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--landing-text-soft)]">
        {label}
      </span>
      <span className={`font-mono text-[10px] font-semibold ${toneClass}`}>{value}</span>
    </div>
  );
}

export function ObservabilityMirageCards() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
      <div className="landing-demo-panel p-5 md:p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--landing-text-muted)]">
          What your server sees
        </p>
        <div className="mt-4 flex items-end gap-2">
          <span className="text-4xl font-semibold tracking-tight text-[color:var(--landing-accent)]">24ms</span>
          <span className="pb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--landing-accent)]/60">
            avg
          </span>
        </div>
        <div className="mt-4">
          <MetricRow label="Processing" value="12ms" tone="good" />
          <MetricRow label="Database" value="8ms" tone="good" />
          <MetricRow label="External API" value="4ms" tone="good" />
        </div>
        <div className="landing-demo-inset mt-4 inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[color:var(--landing-accent)]">
          <CheckCircle2 className="h-3.5 w-3.5" />
          All systems operational
        </div>
      </div>

      <div className="landing-demo-panel relative p-5 md:p-6">
        <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-md border border-[#ff5370]/20 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-[#ff5370]">
          <AlertTriangle className="h-3 w-3" />
          Blind spot
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#ff5370]">What users see</p>
        <div className="mt-4 flex items-end gap-2">
          <span className="text-4xl font-semibold tracking-tight text-[#ff5370]">4.2s</span>
          <span className="pb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#ff5370]/55">p95</span>
        </div>
        <div className="mt-4">
          <MetricRow label="DNS resolution" value="800ms" tone="bad" />
          <MetricRow label="TCP handshake" value="1.2s" tone="bad" />
          <MetricRow label="TLS negotiation" value="600ms" tone="warn" />
        </div>
        <div className="landing-demo-inset mt-4 inline-flex items-center gap-2 border border-[#ff5370]/15 px-3 py-1.5 text-xs font-medium text-[#ff5370]">
          <AlertTriangle className="h-3.5 w-3.5" />
          Churn risk on slow networks
        </div>
      </div>
    </div>
  );
}
