'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle } from '@/components/dashboard/icons';
import { RouteEvents } from '@/lib/analytics/route-analytics';

type DeleteProjectConfirmModalProps = {
  open: boolean;
  projectName: string;
  confirmText: string;
  onConfirmTextChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
  error?: string | null;
  /** When set, attaches analytics attributes to the confirm button (settings flow). */
  trackingProjectId?: string;
};

export function DeleteProjectConfirmModal({
  open,
  projectName,
  confirmText,
  onConfirmTextChange,
  onConfirm,
  onCancel,
  isDeleting,
  error = null,
  trackingProjectId,
}: DeleteProjectConfirmModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isDeleting) onCancel();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, isDeleting, onCancel]);

  if (!mounted || !open) return null;

  const canDelete = confirmText === projectName && !isDeleting;

  return createPortal(
    <div
      className="dashboard-modal-overlay fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget && !isDeleting) onCancel();
      }}
      role="presentation"
    >
      <div
        className="dashboard-modal dashboard-modal--danger w-full max-w-md space-y-5 p-6 sm:p-7"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-project-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div className="dashboard-modal__icon-wrap">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="min-w-0 pt-0.5">
            <h3
              id="delete-project-title"
              className="text-lg font-semibold text-[color:var(--dash-danger)]"
            >
              Delete project
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-[color:var(--dash-text-soft)]">
              This cannot be undone. All data for{' '}
              <span className="font-medium text-[color:var(--dash-text)]">{projectName}</span> will be
              permanently removed.
            </p>
          </div>
        </div>

        <p className="text-sm text-[color:var(--dash-text-soft)]">
          Type{' '}
          <span className="rounded-md bg-[color:var(--dash-bg-subtle)] px-1.5 py-0.5 font-mono text-xs font-medium text-[color:var(--dash-text)]">
            {projectName}
          </span>{' '}
          to confirm.
        </p>

        {error ? (
          <p
            className="rounded-lg border border-[color:color-mix(in_srgb,var(--dash-danger)_35%,transparent)] bg-[color:color-mix(in_srgb,var(--dash-danger)_10%,var(--dash-surface))] px-3 py-2 text-sm text-[color:var(--dash-danger)]"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <input
          type="text"
          value={confirmText}
          onChange={(event) => onConfirmTextChange(event.target.value)}
          className="dashboard-control dashboard-control--danger w-full rounded-xl px-4 py-2.5 text-sm placeholder:text-[color:var(--dash-text-muted)]"
          placeholder="Type project name to confirm"
          autoFocus
          aria-label={`Type ${projectName} to confirm deletion`}
        />

        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="dashboard-button-secondary px-4 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!canDelete}
            className="dashboard-button-danger px-4 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            {...(trackingProjectId
              ? {
                  'data-umami-event': RouteEvents.DASHBOARD_PROJECT_CREATE,
                  'data-umami-event-action': 'confirm_delete',
                  'data-umami-event-project-id': trackingProjectId,
                }
              : {})}
          >
            {isDeleting ? 'Deleting…' : 'Delete project'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
