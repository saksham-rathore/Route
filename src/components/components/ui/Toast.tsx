'use client';

import { useRef, useState, useCallback } from 'react';
import { Check, AlertCircle, Info, X } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

// ── ToastContainer ────────────────────────────────────────────────────────────

export function ToastContainer({
  toasts,
  remove,
}: {
  toasts: Toast[];
  remove: (id: number) => void;
}) {
  return (
    <div
      className="fixed bottom-6 right-6 z-[10020] flex flex-col gap-2 pointer-events-none"
      aria-live="polite"
    >
      {toasts.map(t => {
        const shell =
          t.type === 'success'
            ? 'border-[color:color-mix(in_srgb,var(--dash-success)_30%,var(--dash-divider))] bg-[color:color-mix(in_srgb,var(--dash-success)_12%,var(--dash-surface))]'
            : t.type === 'error'
              ? 'border-[color:color-mix(in_srgb,var(--dash-danger)_28%,transparent)] bg-[color:color-mix(in_srgb,var(--dash-danger)_10%,var(--dash-surface))]'
              : t.type === 'warning'
                ? 'border-[color:color-mix(in_srgb,var(--dash-warning)_28%,transparent)] bg-[color:color-mix(in_srgb,var(--dash-warning)_12%,var(--dash-surface))]'
                : 'border-[color:var(--dash-divider)] bg-[color:var(--dash-surface)]';
        const iconClass =
          t.type === 'success'
            ? 'text-[color:var(--dash-success)]'
            : t.type === 'error'
              ? 'text-[color:var(--dash-danger)]'
              : t.type === 'warning'
                ? 'text-[color:var(--dash-warning)]'
                : 'text-[color:var(--dash-blue)]';
        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex min-w-[300px] max-w-[420px] items-start gap-3 rounded-lg border px-4 py-3 text-sm text-[color:var(--dash-text)] shadow-[var(--dash-menu-shadow)] ${shell}`}
          >
            <span className={`mt-0.5 shrink-0 ${iconClass}`}>
              {t.type === 'success' && <Check className="h-4 w-4" />}
              {t.type === 'error' && <AlertCircle className="h-4 w-4" />}
              {(t.type === 'warning' || t.type === 'info') && <Info className="h-4 w-4" />}
            </span>
            <span className="flex-1 leading-snug">{t.message}</span>
            <button
              type="button"
              onClick={() => remove(t.id)}
              className="ml-1 shrink-0 text-[color:var(--dash-text-muted)] transition-opacity hover:opacity-100 hover:text-[color:var(--dash-text)]"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ── useToast hook ─────────────────────────────────────────────────────────────

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const addToast = useCallback(
    (type: ToastType, message: string, duration = 5000) => {
      const id = ++counter.current;
      setToasts(prev => [...prev, { id, type, message }]);
      setTimeout(
        () => setToasts(prev => prev.filter(t => t.id !== id)),
        duration
      );
    },
    []
  );

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}
