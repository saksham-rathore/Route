'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Check, Copy, Layers, Loader2 } from '@/components/dashboard/icons';
import { InstallSnippetHighlight } from '@/components/landing/InstallSnippetHighlight';
import { DEFAULT_BEACON_SCRIPT_URL, getBeaconInstallSnippet } from '@/lib/analytics/beacon-snippet';
import { duplicateProject } from '@/app/dashboard/actions';

type DuplicateProjectModalProps = {
  open: boolean;
  projectId: string;
  projectName: string;
  projectDomain: string | null;
  projectTechStack: string | null;
  onClose: () => void;
};

export function DuplicateProjectModal({
  open,
  projectId,
  projectName,
  projectDomain,
  projectTechStack,
  onClose,
}: DuplicateProjectModalProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState(`${projectName} copy`);
  const [domain, setDomain] = useState(projectDomain ?? '');
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [newProjectId, setNewProjectId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const scriptBaseUrl = process.env.NEXT_PUBLIC_BEACON_SCRIPT_URL || DEFAULT_BEACON_SCRIPT_URL;
  const techStack = projectTechStack ?? '';

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open) return;
    setName(`${projectName} copy`);
    setDomain(projectDomain ?? '');
    setNewProjectId(null);
    setError(null);
    setCopied(false);
  }, [open, projectDomain, projectName]);
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isDuplicating) onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDuplicating, onClose, open]);

  const snippetDomain = useMemo(() => domain.trim(), [domain]);
  const snippet = useMemo(() => {
    if (!newProjectId) return '';
    return getBeaconInstallSnippet(scriptBaseUrl, newProjectId, snippetDomain, techStack);
  }, [newProjectId, scriptBaseUrl, snippetDomain, techStack]);

  if (!mounted || !open) return null;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsDuplicating(true);
    setError(null);
    const result = await duplicateProject(projectId, name, domain);
    setIsDuplicating(false);
    if (!result.success || !result.projectId) {
      setError(result.error || 'Could not duplicate the project.');
      return;
    }
    setDomain(result.domain || domain.trim());
    setNewProjectId(result.projectId);
    router.refresh();
  };

  const copySnippet = async () => {
    if (!snippet) return;
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return createPortal(
    <div
      className="dashboard-modal-overlay fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="presentation"
      onClick={(event) => event.target === event.currentTarget && !isDuplicating && onClose()}
    >
      <div
        className="dashboard-modal w-full max-w-lg overflow-hidden p-0"
        role="dialog"
        aria-modal="true"
        aria-labelledby="duplicate-project-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="space-y-5 px-6 py-5 sm:px-7 sm:py-6">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--dash-blue-soft)] text-[color:var(--dash-blue)] shadow-[var(--dash-control-shadow)]">
              {newProjectId ? <Check className="h-5 w-5" /> : <Layers className="h-5 w-5" />}
            </span>
            <div>
              <h2 id="duplicate-project-title" className="text-lg font-semibold text-[color:var(--dash-text)]">
                {newProjectId ? 'Duplicate ready' : 'Duplicate project'}
              </h2>
              <p className="mt-1 text-sm leading-6 text-[color:var(--dash-text-soft)]">
                {newProjectId
                  ? 'Install the snippet below on the new domain. The duplicate unlocks after its first ping. Your original project is unchanged.'
                  : 'Copy the analytics history and settings, then continue collecting under a new project ID.'}
              </p>
            </div>
          </div>

          {newProjectId ? (
            <>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-xl border border-[color:var(--dash-border)] bg-[color:var(--dash-bg-subtle)] px-4 py-3 text-xs">
                <div className="min-w-0">
                  <div className="dashboard-muted mb-1 uppercase tracking-wider">Source</div>
                  <div className="truncate font-mono text-[color:var(--dash-text-soft)]">{projectId}</div>
                </div>
                <span className="text-[color:var(--dash-blue)]">→</span>
                <div className="min-w-0 text-right">
                  <div className="dashboard-muted mb-1 uppercase tracking-wider">New project</div>
                  <div className="truncate font-mono text-[color:var(--dash-text)]">{newProjectId}</div>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-[color:var(--dash-border)] bg-[color:var(--dash-code-block-bg)] shadow-[var(--dash-control-shadow)]">
                <div className="flex items-center justify-between border-b border-[color:var(--dash-border)] px-4 py-2.5">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--dash-text-muted)]">New tracking snippet</span>
                  <button type="button" onClick={() => void copySnippet()} className="dashboard-muted rounded-md p-1.5 transition-colors hover:bg-[color:var(--dash-surface-hover)] hover:text-[color:var(--dash-text)]" aria-label="Copy new tracking snippet">
                    {copied ? <Check className="h-4 w-4 text-[color:var(--dash-success)]" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <div className="max-h-36 overflow-auto p-4">
                  <InstallSnippetHighlight
                    scriptBaseUrl={scriptBaseUrl}
                    projectId={newProjectId}
                    domain={snippetDomain}
                    techStack={techStack}
                    codeClassName="text-[11px] leading-5 whitespace-pre-wrap break-all"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button type="button" onClick={onClose} className="dashboard-button-primary px-4 text-sm">Done</button>
              </div>
            </>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-[color:var(--dash-text)]">
                  <span>Project name</span>
                  <input autoFocus required maxLength={120} value={name} onChange={(event) => setName(event.target.value)} className="dashboard-control w-full px-3 text-sm" />
                </label>
                <label className="space-y-2 text-sm font-medium text-[color:var(--dash-text)]">
                  <span>Domain</span>
                  <input required inputMode="url" value={domain} onChange={(event) => setDomain(event.target.value)} placeholder="example.com" className="dashboard-control w-full px-3 font-mono text-sm" />
                </label>
              </div>

              <div className="rounded-xl border border-[color:var(--dash-border)] bg-[color:var(--dash-bg-subtle)] px-4 py-3 text-xs leading-5 text-[color:var(--dash-text-soft)]">
                Requests, visits, pageviews, errors, web vitals, thresholds, exclusions, and notification settings will be copied. Future data stays separate.
              </div>

              {error ? <p role="alert" className="rounded-lg border border-[color:color-mix(in_srgb,var(--dash-danger)_35%,transparent)] bg-[color:color-mix(in_srgb,var(--dash-danger)_10%,var(--dash-surface))] px-3 py-2 text-sm text-[color:var(--dash-danger)]">{error}</p> : null}

              <div className="flex justify-end gap-3">
                <button type="button" onClick={onClose} disabled={isDuplicating} className="dashboard-button-secondary px-4 text-sm disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={isDuplicating || !name.trim() || !domain.trim()} className="dashboard-button-primary inline-flex items-center gap-2 px-4 text-sm disabled:cursor-not-allowed disabled:opacity-50">
                  {isDuplicating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Layers className="h-4 w-4" />}
                  {isDuplicating ? 'Duplicating…' : 'Duplicate project'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
