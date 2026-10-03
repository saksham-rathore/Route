'use client';

import { useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/core/utils';

const tooltipClassName =
  'pointer-events-none absolute z-[250] max-w-xs rounded-md border border-[color:var(--dash-divider)] bg-[color:var(--dash-surface)] px-2.5 py-1.5 text-xs leading-5 text-[color:var(--dash-text)] shadow-[0_8px_24px_rgba(0,0,0,0.35)] whitespace-pre-line';

type Side = 'top' | 'bottom' | 'left' | 'right';

const POSITION_BY_SIDE: Record<Side, string> = {
  top: 'bottom-full left-1/2 mb-2 -translate-x-1/2',
  bottom: 'top-full left-1/2 mt-2 -translate-x-1/2',
  left: 'right-full top-1/2 mr-2 -translate-y-1/2',
  right: 'left-full top-1/2 ml-2 -translate-y-1/2',
};

type DashboardTooltipProps = {
  content: ReactNode;
  children: ReactNode;
  side?: Side;
  disabled?: boolean;
  className?: string;
  popupClassName?: string;
};

export function DashboardTooltip({
  content,
  children,
  side = 'top',
  disabled,
  className,
  popupClassName,
}: DashboardTooltipProps) {
  const [open, setOpen] = useState(false);

  if (disabled || content === undefined || content === null || content === '') {
    return <>{children}</>;
  }

  const positionClass = POSITION_BY_SIDE[side];

  return (
    <span
      className={cn('relative inline-flex min-w-0 max-w-full', className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open ? (
        <span role="tooltip" className={cn(tooltipClassName, positionClass, popupClassName)}>
          {content}
        </span>
      ) : null}
    </span>
  );
}

type TruncateWithTooltipProps = {
  text: string;
  className?: string;
  children?: ReactNode;
  side?: Side;
};

export function TruncateWithTooltip({ text, className, children, side = 'top' }: TruncateWithTooltipProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);

  if (!text) {
    return <span className={className}>{children}</span>;
  }

  const positionClass = side === 'top' ? 'bottom-full left-0 mb-2' : 'top-full left-0 mt-2';

  const handleEnter = () => {
    const el = ref.current;
    if (!el) return;
    if (el.scrollWidth > el.clientWidth + 1) {
      setOpen(true);
    }
  };

  return (
    <span className="relative block min-w-0 max-w-full">
      <span
        ref={ref}
        className={cn('block min-w-0 truncate', className)}
        onMouseEnter={handleEnter}
        onMouseLeave={() => setOpen(false)}
        onFocus={handleEnter}
        onBlur={() => setOpen(false)}
      >
        {children ?? text}
      </span>
      {open ? (
        <span role="tooltip" className={cn(tooltipClassName, positionClass)}>
          {text}
        </span>
      ) : null}
    </span>
  );
}
