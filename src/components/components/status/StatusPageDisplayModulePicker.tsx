'use client';

import { Check } from '@/components/dashboard/icons';
import type { StatusPageDisplayOptions } from '@/lib/status-pages';

const moduleCheckClassName = (checked: boolean) =>
  `flex h-4 w-4 shrink-0 items-center justify-center rounded transition-colors ${
    checked
      ? 'border border-[color:var(--dash-blue)] bg-[color:var(--dash-blue)] text-[color:var(--dash-text-on-accent)]'
      : 'border border-[color:var(--dash-border-strong)] bg-[color:var(--dash-surface)]'
  }`;

export interface StatusPageDisplayModuleOption {
  key: keyof StatusPageDisplayOptions;
  label: string;
  description: string;
  meta: string;
  isRecommended?: boolean;
}

interface StatusPageDisplayModulePickerProps {
  options: StatusPageDisplayModuleOption[];
  value: StatusPageDisplayOptions;
  onChange: (key: keyof StatusPageDisplayOptions, value: boolean) => void;
}

export function StatusPageDisplayModulePicker({
  options,
  value,
  onChange,
}: StatusPageDisplayModulePickerProps) {
  return (
    <div className="md:col-span-2 rounded-lg border border-[color:var(--dash-border)] bg-[color:var(--dash-bg-elevated)] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-sm font-medium text-[color:var(--dash-text)]">Public data modules</div>
          <div className="mt-1 max-w-2xl text-sm leading-6 text-[color:var(--dash-text-soft)]">
            Pick the live data blocks that should appear on the public status page.
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        {options.map((option) => {
          const checked = value[option.key];

          return (
            <button
              key={option.key}
              type="button"
              onClick={() => onChange(option.key, !checked)}
              className={`grid grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-md border px-3 py-2.5 text-left transition sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center ${
                checked
                  ? 'border-[color:color-mix(in_srgb,var(--dash-blue)_35%,var(--dash-divider))] bg-[color:color-mix(in_srgb,var(--dash-blue)_6%,var(--dash-surface))]'
                  : 'border-[color:var(--dash-border)] bg-[color:var(--dash-surface)] hover:border-[color:var(--dash-border-strong)] hover:bg-[color:var(--dash-surface-hover)]'
              }`}
              aria-pressed={checked}
            >
              <span className={`mt-0.5 sm:mt-0 ${moduleCheckClassName(checked)}`}>
                {checked ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : null}
              </span>
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-[13px] font-medium text-[color:var(--dash-text)]">{option.label}</span>
                  {option.isRecommended ? (
                    <span className="rounded-full border border-[color:color-mix(in_srgb,var(--dash-blue)_30%,var(--dash-divider))] bg-[color:color-mix(in_srgb,var(--dash-blue)_10%,var(--dash-surface))] px-1.5 py-0.5 text-[10px] font-medium text-[color:var(--dash-blue)]">
                      Recommended
                    </span>
                  ) : null}
                </span>
                <span className="mt-0.5 block text-xs leading-5 text-[color:var(--dash-text-soft)]">{option.description}</span>
              </span>
              <span className="col-start-2 inline-flex w-fit rounded-full border border-[color:var(--dash-border)] bg-[color:var(--dash-bg-subtle)] px-2 py-0.5 text-[11px] text-[color:var(--dash-text-muted)] sm:col-start-auto sm:justify-self-end">
                {option.meta}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
