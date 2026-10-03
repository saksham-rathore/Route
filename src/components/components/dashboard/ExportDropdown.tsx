'use client';

import { useState, useRef, useEffect } from 'react';
import { Download } from '@/components/dashboard/icons';

interface ExportDropdownProps {
  onExportCSV: () => void;
  onExportJSON: () => void;
  disabled?: boolean;
  iconOnly?: boolean;
}

export function ExportDropdown({ onExportCSV, onExportJSON, disabled, iconOnly = false }: ExportDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        disabled={disabled}
        className={`dashboard-button-secondary disabled:cursor-not-allowed disabled:opacity-40 ${
          iconOnly ? 'p-2' : 'px-3 py-1.5 text-xs'
        }`}
        aria-label="Export"
        title="Export"
      >
        <Download className="w-3.5 h-3.5" />
        {!iconOnly && 'Export'}
      </button>
      {open && (
        <div className="dashboard-menu absolute right-0 top-full z-50 mt-1 w-32 overflow-hidden">
          <button
            onClick={() => { onExportCSV(); setOpen(false); }}
            className="w-full px-3 py-2 text-left text-xs text-[color:var(--dash-text-soft)] transition-colors hover:bg-[color:var(--dash-surface-hover)] hover:text-[color:var(--dash-text)]"
          >
            Export CSV
          </button>
          <button
            onClick={() => { onExportJSON(); setOpen(false); }}
            className="w-full px-3 py-2 text-left text-xs text-[color:var(--dash-text-soft)] transition-colors hover:bg-[color:var(--dash-surface-hover)] hover:text-[color:var(--dash-text)]"
          >
            Export JSON
          </button>
        </div>
      )}
    </div>
  );
}
