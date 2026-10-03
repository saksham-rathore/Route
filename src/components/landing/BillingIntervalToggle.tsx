'use client';

import type { BillingInterval } from '@/lib/billing/config';

type BillingIntervalToggleProps = {
  value: BillingInterval;
  onChange: (interval: BillingInterval) => void;
};

export function BillingIntervalToggle({ value, onChange }: BillingIntervalToggleProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="inline-flex items-center rounded-full border border-[color:var(--landing-border-strong)] bg-[color:var(--landing-surface)] p-1 shadow-[var(--landing-card-shadow)]"
        role="group"
        aria-label="Billing period"
      >
        {(['monthly', 'yearly'] as const).map((interval) => {
          const active = value === interval;
          return (
            <button
              key={interval}
              type="button"
              onClick={() => onChange(interval)}
              className={[
                'rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors',
                active
                  ? 'bg-[color:var(--dash-blue)] text-[color:var(--dash-text-on-accent)] shadow-[var(--dash-control-shadow)]'
                  : 'text-[color:var(--landing-text-soft)] hover:text-[color:var(--landing-text)]',
              ].join(' ')}
              aria-pressed={active}
            >
              {interval === 'monthly' ? 'Monthly' : 'Yearly'}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-[color:var(--landing-text-muted)]">
        {value === 'yearly' ? 'Billed annually on paid plans' : 'Billed monthly on paid plans'}
      </p>
    </div>
  );
}
