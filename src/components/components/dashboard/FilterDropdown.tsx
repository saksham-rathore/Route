'use client';

import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ChevronDown, X } from '@/components/dashboard/icons';

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
  renderLabel?: ReactNode;
}

interface FilterDropdownProps {
  label: string;
  icon?: React.ReactNode;
  value: string | null;
  options: FilterOption[];
  onChange: (value: string | null) => void;
}

export function FilterDropdown({
  label,
  icon,
  value,
  options,
  onChange,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-md border transition-colors ${
          value
            ? 'bg-[#3b82f6]/10 border-[#3b82f6]/30 text-[#3b82f6]'
            : 'bg-[#111] border-[#222] text-[#888] hover:border-[#333] hover:text-white'
        }`}
      >
        {icon}
        <span className="flex min-w-0 items-center gap-1.5 truncate">
          {selected?.renderLabel ?? (selected ? selected.label : label)}
        </span>
        {value ? (
          <X
            className="w-3 h-3 ml-0.5 hover:text-white"
            onClick={(e) => { e.stopPropagation(); onChange(null); }}
          />
        ) : (
          <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
        )}
      </button>

      {open && options.length > 0 && (
        <div className="absolute top-full left-0 mt-1 min-w-[180px] bg-[#111] border border-[#222] rounded-lg shadow-xl z-50 py-1 max-h-[240px] overflow-y-auto">
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value === value ? null : opt.value); setOpen(false); }}
              className={`w-full px-3 py-2 flex items-center justify-between text-xs transition-colors ${
                opt.value === value
                  ? 'bg-[#3b82f6]/10 text-[#3b82f6]'
                  : 'text-[#ccc] hover:bg-[#1a1a1a] hover:text-white'
              }`}
            >
              <span className="flex min-w-0 items-center gap-1.5 truncate">
                {opt.renderLabel ?? opt.label}
              </span>
              {opt.count !== undefined && (
                <span className="text-[10px] text-[#555] ml-2 shrink-0">{opt.count}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
