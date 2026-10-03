'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import {
  DEFAULT_TECH_STACK_ID,
  getTechStackIconUrl,
  getTechStackOption,
  TECH_STACK_CATEGORY_LABELS,
  TECH_STACK_CATEGORY_ORDER,
  TECH_STACK_OPTIONS,
  type TechStackOption,
} from '@/lib/onboarding/tech-stack-options';

interface TechStackSelectProps {
  value: string;
  onChange: (id: string) => void;
}

function TechStackIcon({ option, className = 'h-3.5 w-3.5' }: { option: TechStackOption; className?: string }) {
  const iconUrl = getTechStackIconUrl(option);

  if (!iconUrl) {
    return (
      <span
        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] bg-white text-[10px] font-semibold text-[color:var(--dash-text-muted)] ring-1 ring-[color:var(--dash-border)]"
        aria-hidden
      >
        {option.name.slice(0, 1)}
      </span>
    );
  }

  return (
    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] bg-white ring-1 ring-[color:var(--dash-border)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={iconUrl}
        alt=""
        className={`object-contain ${className}`}
        loading="lazy"
      />
    </span>
  );
}

export function TechStackSelect({ value, onChange }: TechStackSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const selected = getTechStackOption(value) ?? getTechStackOption(DEFAULT_TECH_STACK_ID)!;
  const normalizedQuery = query.trim().toLowerCase();

  const groupedOptions = useMemo(
    () =>
      TECH_STACK_CATEGORY_ORDER.map((category) => ({
        category,
        label: TECH_STACK_CATEGORY_LABELS[category],
        options: TECH_STACK_OPTIONS.filter((option) => {
          if (option.category !== category) return false;
          if (!normalizedQuery) return true;

          const haystack = `${option.name} ${option.id} ${TECH_STACK_CATEGORY_LABELS[category]}`.toLowerCase();
          return haystack.includes(normalizedQuery);
        }),
      })).filter((group) => group.options.length > 0),
    [normalizedQuery],
  );

  useEffect(() => {
    if (!open) {
      setQuery('');
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      searchRef.current?.focus();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onPointerDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        id="onboarding-tech-stack"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="onboarding-tech-stack-listbox"
        onClick={() => setOpen((current) => !current)}
        className="dashboard-control flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm"
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <TechStackIcon option={selected} />
          <span className="truncate text-[color:var(--dash-text)]">{selected.name}</span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[color:var(--dash-text-muted)] transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      {open ? (
        <div
          id="onboarding-tech-stack-listbox"
          role="listbox"
          aria-labelledby="onboarding-tech-stack"
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 flex max-h-[min(320px,50vh)] flex-col overflow-hidden rounded-[10px] border border-[color:var(--dash-border)] bg-[color:var(--dash-surface)] shadow-[var(--dash-menu-shadow)]"
        >
          <div className="relative z-20 shrink-0 border-b border-[color:var(--dash-border)] bg-[color:var(--dash-surface)] px-2 pb-2 pt-1 shadow-[0_1px_0_color-mix(in_srgb,var(--dash-border)_65%,transparent)]">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[color:var(--dash-text-muted)]"
                aria-hidden
              />
              <input
                ref={searchRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search tech stack..."
                aria-label="Search tech stack"
                onKeyDown={(event) => {
                  if (event.key === 'Escape') {
                    event.stopPropagation();
                    setOpen(false);
                  }
                }}
                className="dashboard-control w-full py-2 pl-8 pr-3 text-sm placeholder:text-[color:var(--dash-text-muted)]"
              />
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto py-1.5">
            {groupedOptions.length === 0 ? (
              <p className="px-3 py-4 text-center text-sm text-[color:var(--dash-text-muted)]">No matches found</p>
            ) : (
              groupedOptions.map((group) => (
                <div key={group.category} className="px-1.5 py-1">
                  <p className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--dash-text-muted)]">
                    {group.label}
                  </p>
                  {group.options.map((option) => {
                    const isSelected = option.id === value;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          onChange(option.id);
                          setOpen(false);
                        }}
                        className={`flex w-full items-center gap-2.5 rounded-[8px] px-2.5 py-2 text-left text-sm transition-colors ${
                          isSelected
                            ? 'bg-[color:color-mix(in_srgb,var(--dash-blue)_12%,var(--dash-surface))] text-[color:var(--dash-text)]'
                            : 'text-[color:var(--dash-text-soft)] hover:bg-[color:var(--dash-surface-hover)] hover:text-[color:var(--dash-text)]'
                        }`}
                      >
                        <TechStackIcon option={option} />
                        <span className="min-w-0 flex-1 truncate">{option.name}</span>
                        {isSelected ? (
                          <Check className="h-3.5 w-3.5 shrink-0 text-[color:var(--dash-blue)]" aria-hidden />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
