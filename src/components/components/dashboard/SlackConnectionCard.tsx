'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/ui/Toast';

type SlackStatus = {
  configured: boolean;
  installed: boolean;
  linked: boolean;
  needsInstall: boolean;
  needsLogin: boolean;
  installUrl: string | null;
  installations: Array<{
    slackTeamId: string;
    slackTeamName: string | null;
  }>;
};

const EMPTY_SLACK_STATUS: SlackStatus = {
  configured: false,
  installed: false,
  linked: false,
  needsInstall: false,
  needsLogin: false,
  installUrl: null,
  installations: [],
};

export function SlackConnectionCard() {
  const [slackStatus, setSlackStatus] = useState<SlackStatus>(EMPTY_SLACK_STATUS);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const { addToast } = useToast();

  const loadSlackStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/account/slack/status');
      const json = await res.json() as SlackStatus & { error?: string };
      if (!res.ok) throw new Error(json.error ?? 'Failed to load Slack status');
      setSlackStatus({
        configured: Boolean(json.configured),
        installed: Boolean(json.installed),
        linked: Boolean(json.linked),
        needsInstall: Boolean(json.needsInstall),
        needsLogin: Boolean(json.needsLogin),
        installUrl: json.installUrl ?? null,
        installations: Array.isArray(json.installations) ? json.installations : [],
      });
    } catch (err) {
      setSlackStatus(EMPTY_SLACK_STATUS);
      addToast('error', err instanceof Error ? err.message : 'Failed to load Slack status');
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    void loadSlackStatus();
  }, [loadSlackStatus]);

  const handleDisconnect = useCallback(async () => {
    setIsDisconnecting(true);
    try {
      const res = await fetch('/api/account/slack/status', { method: 'DELETE' });
      const json = await res.json().catch(() => ({})) as SlackStatus & { error?: string };
      if (!res.ok) throw new Error(json.error ?? 'Failed to disconnect Slack');

      setSlackStatus({
        configured: Boolean(json.configured),
        installed: Boolean(json.installed),
        linked: Boolean(json.linked),
        needsInstall: Boolean(json.needsInstall),
        needsLogin: Boolean(json.needsLogin),
        installUrl: json.installUrl ?? null,
        installations: Array.isArray(json.installations) ? json.installations : [],
      });
      addToast('success', 'Slack disconnected for your Route account.');
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Failed to disconnect Slack');
    } finally {
      setIsDisconnecting(false);
    }
  }, [addToast]);

  const linkLabel = slackStatus.installUrl
    ? slackStatus.configured
      ? 'Add app to workspace'
      : slackStatus.installed
        ? 'Reinstall app'
        : 'Install app'
    : 'Install app';

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-3">
        <img
          src="https://cdn.route.dev/images/favicon.png"
          alt=""
          className="mt-0.5 h-9 w-9 rounded-lg"
        />
        <div>
          <div className="text-sm font-medium text-[color:var(--dash-text)]">Slack</div>
          <p className="mt-1 text-xs text-[color:var(--dash-text-muted)]">
            {isLoading
              ? 'Checking Slack connection...'
              : slackStatus.configured
                ? 'Slack alerts are ready for your Route account.'
                : slackStatus.installed
                  ? 'Slack app installed. Run /route login in Slack to link your account and alert channel.'
                  : 'Install the Route Slack app to send alert notifications into Slack.'}
          </p>
          {slackStatus.installations.length > 0 && (
            <p className="mt-1 text-xs text-[color:var(--dash-text-muted)]">
              Workspace: {slackStatus.installations.map(installation => installation.slackTeamName ?? installation.slackTeamId).join(', ')}
            </p>
          )}
        </div>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        {slackStatus.installUrl && (
          <a
            href={slackStatus.installUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-md border border-[color:var(--dash-border)] bg-[color:var(--dash-surface)] px-3 py-2 text-sm font-medium text-[color:var(--dash-text)] shadow-[var(--dash-control-shadow)] transition-colors hover:border-[color:var(--dash-blue)]"
          >
            {linkLabel}
          </a>
        )}
        <button
          type="button"
          onClick={() => void loadSlackStatus()}
          disabled={isLoading}
          className="rounded-md border border-[color:var(--dash-border)] bg-[color:var(--dash-surface)] px-3 py-2 text-sm font-medium text-[color:var(--dash-text)] shadow-[var(--dash-control-shadow)] transition-colors hover:bg-[color:var(--dash-surface-hover)] disabled:opacity-50"
        >
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>
        {slackStatus.linked && (
          <button
            type="button"
            onClick={() => void handleDisconnect()}
            disabled={isDisconnecting}
            className="rounded-md border border-[color:color-mix(in_srgb,var(--dash-danger)_45%,var(--dash-border))] bg-transparent px-3 py-2 text-sm font-medium text-[color:var(--dash-danger)] transition-colors hover:bg-[color:color-mix(in_srgb,var(--dash-danger)_10%,transparent)] disabled:opacity-50"
          >
            {isDisconnecting ? 'Disconnecting...' : 'Unlink Slack'}
          </button>
        )}
      </div>
    </div>
  );
}
