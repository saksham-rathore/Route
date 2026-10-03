import type { LucideIcon } from 'lucide-react';

export type VideoHighlightChip = {
  label: string;
  icon: LucideIcon;
  itemClassName?: string;
  iconClassName?: string;
};

type VideoHighlightChipsProps = {
  chips: readonly VideoHighlightChip[];
  className?: string;
};

const defaultChipClass = 'landing-chip';
const defaultIconClass = 'text-[#166534]';

export function VideoHighlightChips({ chips, className = '' }: VideoHighlightChipsProps) {
  return (
    <div
      className={`mb-5 flex flex-row flex-wrap items-center justify-center gap-2 md:mb-6 ${className}`.trim()}
    >
      {chips.map((item) => {
        const Icon = item.icon;
        return (
          <span
            key={item.label}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-md border border-[color:var(--landing-border)] px-2.5 py-1 text-xs font-medium shadow-[var(--landing-card-shadow),0_2px_10px_rgba(15,23,42,0.08)] ${item.itemClassName ?? defaultChipClass}`}
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] bg-[color:color-mix(in_srgb,currentColor_16%,transparent)] ring-1 ring-[color:color-mix(in_srgb,currentColor_28%,transparent)] ${item.iconClassName ?? defaultIconClass}`}
            >
              <Icon
                className="h-3.5 w-3.5 drop-shadow-[0_0_8px_color-mix(in_srgb,currentColor_55%,transparent)]"
                strokeWidth={2.5}
                aria-hidden
              />
            </span>
            {item.label}
          </span>
        );
      })}
    </div>
  );
}
