'use client'

import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/components/ui/Toast'
import { getSearchConsoleStatus, disconnectSearchConsole, type SearchConsoleStatus } from '@/lib/search-console/client'

export function SearchConsoleConnectionCard() {
  const [status, setStatus] = useState<SearchConsoleStatus>({ connected: false })
  const [isLoading, setIsLoading] = useState(false)
  const [isDisconnecting, setIsDisconnecting] = useState(false)
  const { addToast } = useToast()

  const loadStatus = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getSearchConsoleStatus()
      setStatus(data)
    } catch (err) {
      setStatus({ connected: false })
      addToast('error', err instanceof Error ? err.message : 'Failed to load Search Console status')
    } finally {
      setIsLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    void loadStatus()
  }, [loadStatus])

  const handleConnect = useCallback(() => {
    window.location.href = '/api/search-console/auth'
  }, [])

  const handleDisconnect = useCallback(async () => {
    setIsDisconnecting(true)
    try {
      await disconnectSearchConsole()
      setStatus({ connected: false })
      addToast('success', 'Google Search Console disconnected.')
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Failed to disconnect')
    } finally {
      setIsDisconnecting(false)
    }
  }, [addToast])

  const formatDate = (iso?: string) => {
    if (!iso) return ''
    return new Date(iso).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[color:var(--dash-surface)]">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
        <div>
          <div className="text-sm font-medium text-[color:var(--dash-text)]">Google Search Console</div>
          <p className="mt-1 text-xs text-[color:var(--dash-text-muted)]">
            {isLoading
              ? 'Checking connection...'
              : status.connected
                ? 'Connected — search performance data is available for your projects.'
                : 'Connect your Google Search Console account to see search performance data.'}
          </p>
          {status.connected && status.email && (
            <p className="mt-1 text-xs text-[color:var(--dash-text-muted)]">
              Connected as {status.email}
              {status.createdAt ? ` · Since ${formatDate(status.createdAt)}` : ''}
            </p>
          )}
        </div>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void loadStatus()}
          disabled={isLoading}
          className="rounded-md border border-[color:var(--dash-border)] bg-[color:var(--dash-surface)] px-3 py-2 text-sm font-medium text-[color:var(--dash-text)] shadow-[var(--dash-control-shadow)] transition-colors hover:bg-[color:var(--dash-surface-hover)] disabled:opacity-50"
        >
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>
        {status.connected ? (
          <button
            type="button"
            onClick={() => void handleDisconnect()}
            disabled={isDisconnecting}
            className="rounded-md border border-[color:color-mix(in_srgb,var(--dash-danger)_45%,var(--dash-border))] bg-transparent px-3 py-2 text-sm font-medium text-[color:var(--dash-danger)] transition-colors hover:bg-[color:color-mix(in_srgb,var(--dash-danger)_10%,transparent)] disabled:opacity-50"
          >
            {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleConnect}
            className="inline-flex items-center justify-center rounded-md border border-[color:var(--dash-border)] bg-[color:var(--dash-blue)] px-3 py-2 text-sm font-medium text-white shadow-[var(--dash-control-shadow)] transition-colors hover:bg-[color:var(--dash-blue-hover)]"
          >
            Connect
          </button>
        )}
      </div>
    </div>
  )
}
