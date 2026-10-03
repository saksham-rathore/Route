'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  ArrowRight,
  Clock,
  Copy,
  CreditCard,
  ExternalLink,
  FileText,
  Globe,
  Hash,
  HelpCircle,
  Loader2,
  Link2,
  LogOut,
  Menu,
  PieChart,
  Settings,
  Sticker,
  User,
  Users,
  X,
  Zap,
} from './icons';
import { getProjectHref, useDashboardShell } from './DashboardShellContext';
import { getUserAnalyticsHref } from '@/lib/user-analytics/tabs';
import { trackEvent, RouteEvents } from '@/lib/analytics/route-analytics';
import { DEFAULT_BEACON_SCRIPT_URL, getBeaconInstallSnippet } from '@/lib/analytics/beacon-snippet';
import { InstallSnippetHighlight } from '@/components/landing/InstallSnippetHighlight';
import { DashboardThemeIconButton } from './DashboardThemeToggle';
import { DomainFavicon } from './DomainFavicon';
import { useAuth } from '@/components/providers/auth-provider';
import { useGetUserProfileQuery } from '@/lib/redux';

interface DashboardRightRailProps {
  projectId: string;
  projectName: string;
  projectDomain?: string | null;
  projectTechStack?: string | null;
  projectCreatedAt?: string | Date | null;
  isOpen: boolean;
  disableTransition?: boolean;
  onToggle: () => void;
}

const formatDate = (value?: string | Date | null) => {
  if (!value) return 'Not available';

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not available';

  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export function DashboardRightRail({
  projectId,
  projectName,
  projectDomain,
  projectTechStack,
  projectCreatedAt,
  isOpen,
  disableTransition = false,
  onToggle,
}: DashboardRightRailProps) {
  const { basePath, billingPath, profilePath, connectionsPath, isDemo } = useDashboardShell();
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { data: profile, isLoading: loading } = useGetUserProfileQuery(undefined, { skip: isDemo });
  const { signOut, isLoading: isSigningOut } = useAuth();
  const projectSettingsPath = getProjectHref(basePath, projectId, 'settings');
  const accountLabel = profile?.email ? profile.email.split('@')[0] : 'Account';
  const accountSubtitle = profile?.email || 'Open account menu';

  const techStack = projectTechStack || 'vanilla';
  const scriptBaseUrl =
    process.env.NEXT_PUBLIC_BEACON_SCRIPT_URL || DEFAULT_BEACON_SCRIPT_URL;

  const snippet = useMemo(() => {
    const domain = projectDomain || '';
    return getBeaconInstallSnippet(scriptBaseUrl, projectId, domain, techStack);
  }, [projectDomain, projectId, scriptBaseUrl, techStack]);

  const userAnalyticsRootHref = getUserAnalyticsHref(basePath, projectId);
  const isUserAnalyticsMode = pathname === userAnalyticsRootHref || pathname.startsWith(`${userAnalyticsRootHref}/`);

  const quickLinks = isUserAnalyticsMode
    ? [
        {
          label: 'Overview',
          href: getUserAnalyticsHref(basePath, projectId, 'overview'),
          icon: <User className="h-3.5 w-3.5" />,
        },
        {
          label: 'Pageviews',
          href: getUserAnalyticsHref(basePath, projectId, 'pageviews'),
          icon: <FileText className="h-3.5 w-3.5" />,
        },
        {
          label: 'Visits & Sessions',
          href: getUserAnalyticsHref(basePath, projectId, 'visits'),
          icon: <Users className="h-3.5 w-3.5" />,
        },
        {
          label: 'Public Badge',
          href: getUserAnalyticsHref(basePath, projectId, 'embed'),
          icon: <Sticker className="h-3.5 w-3.5" />,
        },
      ]
    : [
        {
          label: 'View Endpoints',
          href: getProjectHref(basePath, projectId, 'endpoints'),
          icon: <Activity className="h-3.5 w-3.5" />,
        },
        {
          label: 'View ISPs',
          href: getProjectHref(basePath, projectId, 'isps'),
          icon: <PieChart className="h-3.5 w-3.5" />,
        },
        {
          label: 'Global Map',
          href: getProjectHref(basePath, projectId, 'map'),
          icon: <Globe className="h-3.5 w-3.5" />,
        },
        {
          label: 'Time Series',
          href: getProjectHref(basePath, projectId, 'timeseries'),
          icon: <Clock className="h-3.5 w-3.5" />,
        },
      ];

  const copySnippet = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
      trackEvent(RouteEvents.PROJECT_SNIPPET_COPY, {
        project_id: projectId,
        project_name: projectName,
        domain: projectDomain || 'none',
      });
    } catch {
      setCopied(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const media = window.matchMedia('(min-width: 1024px) and (max-width: 1279px)');
    if (!media.matches) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onToggle();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onToggle]);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px) and (max-width: 1279px)');
    if (!media.matches || !isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    if (prevPathnameRef.current === pathname) return;
    prevPathnameRef.current = pathname;

    const media = window.matchMedia('(min-width: 1024px) and (max-width: 1279px)');
    if (media.matches && isOpen) {
      onToggle();
    }
  }, [pathname, isOpen, onToggle]);

  const handleSignOut = async () => {
    await signOut();
    setMenuOpen(false);
  };

  const renderAccountMenu = () => {
    if (isDemo) return null;

    return (
      <div className="relative min-w-0" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          className="flex min-w-0 items-center gap-3 rounded-md px-2 py-1.5 transition hover:bg-[color:var(--dash-surface-hover)]"
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          aria-label="Open account menu"
        >
          <div className="relative h-8 w-8 overflow-hidden rounded-full bg-[color:var(--dash-bg-elevated)] shadow-[var(--dash-control-shadow)]">
            {profile?.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt="Avatar"
                className="h-full w-full object-cover"
                width={32}
                height={32}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs dashboard-muted">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  '?'
                )}
              </div>
            )}
          </div>
          <div className="min-w-0 text-left">
            <div className="truncate text-xs font-medium text-[color:var(--dash-text)]">
              {accountLabel}
            </div>
            <div className="truncate text-[11px] text-[color:var(--dash-text-muted)]">
              {accountSubtitle}
            </div>
          </div>
        </button>

        {menuOpen && (
          <div className="dashboard-menu absolute -right-5 top-full z-50 mt-2 w-52 overflow-hidden p-3">
            {profilePath && (
              <Link
                href={profilePath}
                onClick={() => setMenuOpen(false)}
                className="mb-1 flex w-full items-center gap-2 rounded-[8px] px-3 py-2 text-sm dashboard-soft shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition-colors hover:bg-[color:var(--dash-surface-hover)] hover:text-[color:var(--dash-text)]"
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
            )}
            {billingPath && (
              <Link
                href={billingPath}
                onClick={() => setMenuOpen(false)}
                className="mb-1 flex w-full items-center gap-2 rounded-[8px] px-3 py-2 text-sm dashboard-soft shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition-colors hover:bg-[color:var(--dash-surface-hover)] hover:text-[color:var(--dash-text)]"
              >
                <CreditCard className="h-4 w-4" />
                Billing
              </Link>
            )}
            {connectionsPath && (
              <Link
                href={connectionsPath}
                onClick={() => setMenuOpen(false)}
                className="mb-1 flex w-full items-center gap-2 rounded-[8px] px-3 py-2 text-sm dashboard-soft shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition-colors hover:bg-[color:var(--dash-surface-hover)] hover:text-[color:var(--dash-text)]"
              >
                <Link2 className="h-4 w-4" />
                Connections
              </Link>
            )}
            <Link
              href={projectSettingsPath}
              onClick={() => setMenuOpen(false)}
              className="mb-1 flex w-full items-center gap-2 rounded-[8px] px-3 py-2 text-sm dashboard-soft shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition-colors hover:bg-[color:var(--dash-surface-hover)] hover:text-[color:var(--dash-text)]"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="flex w-full items-center gap-2 rounded-[8px] px-3 py-2 text-sm dashboard-soft shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition-colors hover:bg-[color:var(--dash-surface-hover)] hover:text-[color:var(--dash-text)] disabled:opacity-50"
            >
              {isSigningOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              {isSigningOut ? 'Signing out...' : 'Log out'}
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderOpenHeader = () => (
    <>
      <div className="flex min-w-0 items-start gap-2">
        {renderAccountMenu()}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <DashboardThemeIconButton />
        <button
          type="button"
          onClick={onToggle}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[color:var(--dash-surface)] text-[color:var(--dash-text-soft)] shadow-[var(--dash-control-shadow)] transition hover:bg-[color:var(--dash-surface-hover)] hover:text-[color:var(--dash-text)]"
          aria-label="Close right sidebar"
          title="Close right sidebar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </>
  );

  const renderRailSections = () => (
    <>
      <section
        className="dashboard-panel mb-4 min-w-0 p-4"
        style={{ backgroundColor: 'var(--dash-rail-card)' }}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--dash-text)]">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[color:var(--dash-blue-soft)] text-[color:var(--dash-blue)]">
                <Zap className="h-3.5 w-3.5" />
              </span>
              Installation
            </div>
            <p className="mt-2 text-xs leading-relaxed text-[color:var(--dash-text-soft)]">
              Add this snippet inside your website&apos;s{' '}
              <span className="font-mono text-[color:var(--dash-success)]">
                &lt;head&gt;
              </span>
              .
            </p>
          </div>
          <button
            type="button"
            onClick={copySnippet}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[color:var(--dash-input-bg)] text-[color:var(--dash-text-soft)] shadow-[var(--dash-control-shadow)] transition hover:bg-[color:var(--dash-surface-hover)] hover:text-[color:var(--dash-text)]"
            aria-label="Copy installation snippet"
            title={copied ? 'Copied' : 'Copy snippet'}
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="min-w-0 rounded-md bg-[color:var(--dash-input-bg)] px-2 py-1.5 shadow-[var(--dash-control-shadow)]">
          <InstallSnippetHighlight
            scriptBaseUrl={scriptBaseUrl}
            projectId={projectId}
            domain={projectDomain || ''}
            techStack={techStack}
            className="min-w-0"
            codeClassName="text-[9px] leading-[1.35] whitespace-pre-wrap break-all"
          />
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 text-[11px]">
          <span className="text-[color:var(--dash-text-muted)]">
            {copied ? 'Copied to clipboard' : 'One script, no package install'}
          </span>
          <Link
            href={getProjectHref(basePath, projectId, 'settings')}
            className="inline-flex shrink-0 items-center gap-1 text-[color:var(--dash-blue)] hover:opacity-80"
          >
            Configure
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </section>

      <section
        className="dashboard-panel mb-4 p-2"
        style={{ backgroundColor: 'var(--dash-rail-card)' }}
      >
        <div className="flex items-center px-2 py-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--dash-text)]">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[color:var(--dash-blue-soft)] text-[color:var(--dash-blue)]">
              <Link2 className="h-3.5 w-3.5" />
            </span>
            Quick Links
          </div>
        </div>
        <div className="space-y-1">
          {quickLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="group flex items-center justify-between rounded-md px-2.5 py-2.5 text-xs text-[color:var(--dash-text-soft)] transition hover:bg-[color:var(--dash-surface-hover)] hover:text-[color:var(--dash-text)]"
            >
              <span className="flex items-center gap-2">
                <span className="text-[color:var(--dash-text-muted)] group-hover:text-[color:var(--dash-blue)]">
                  {link.icon}
                </span>
                {link.label}
              </span>
              <ExternalLink className="h-3 w-3 opacity-0 transition group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </section>

      <section
        className="dashboard-panel p-4"
        style={{ backgroundColor: 'var(--dash-rail-card)' }}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--dash-text)]">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[color:var(--dash-blue-soft)] text-[color:var(--dash-blue)]">
              <HelpCircle className="h-3.5 w-3.5" />
            </span>
            Project Info
          </div>
          <span
            className="relative flex h-2 w-2 rounded-full bg-emerald-400"
            aria-label="Live"
            title="Live"
          >
            <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-70 animate-ping" />
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-[color:var(--dash-text-muted)]">
              <Hash className="h-3 w-3" />
              Project ID
            </div>
            <div className="rounded-md bg-[color:var(--dash-code-chip-bg)] px-2.5 py-2 font-mono text-[11px] text-[color:var(--dash-text-soft)] shadow-[var(--dash-control-shadow)]">
              <span className="block truncate">
                {projectId}
              </span>
            </div>
          </div>

          <div>
            <div className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-[color:var(--dash-text-muted)]">
              Domain
            </div>
            {projectDomain ? (
              <div className="inline-flex min-w-0 items-center gap-2 truncate text-sm font-medium text-[color:var(--dash-text)]">
                <DomainFavicon domain={projectDomain} className="h-4 w-4 shrink-0 rounded-[4px]" />
                <span className="truncate">{projectDomain}</span>
              </div>
            ) : (
              <div className="truncate text-sm font-medium text-[color:var(--dash-text)]">
                No domain set
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-[color:var(--dash-text-muted)]">
                Created
              </div>
              <div className="text-xs font-medium text-[color:var(--dash-text)]">
                {formatDate(projectCreatedAt)}
              </div>
            </div>
            <div>
              <div className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-[color:var(--dash-text-muted)]">
                Stack
              </div>
              <div className="truncate text-xs font-medium text-[color:var(--dash-text)]">
                {projectTechStack || 'Not set'}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  return (
    <>
      {/* Tablet / narrow monitor: overlay drawer — no layout shift */}
      <div className="hidden lg:max-xl:block">
        {isOpen ? (
          <>
            <button
              type="button"
              aria-label="Close right sidebar"
              className="fixed inset-0 z-[999] bg-black/40"
              onClick={onToggle}
            />
            <aside
              suppressHydrationWarning
              className="fixed inset-y-0 right-0 z-[1000] flex w-[min(85vw,var(--dash-right-rail-width))] flex-col overflow-hidden border-l border-[color:var(--dash-border-strong)] bg-[color:var(--dash-sidebar)]"
            >
              <div className="px-6 py-5">
                <div className="flex w-full items-start justify-between gap-3">
                  {renderOpenHeader()}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-5">
                {renderRailSections()}
              </div>
            </aside>
          </>
        ) : null}
      </div>

      {/* Desktop: inline collapsible rail */}
      <aside
        suppressHydrationWarning
        className={`hidden h-screen shrink-0 overflow-hidden bg-[color:var(--dash-sidebar)] ${
          disableTransition ? 'transition-none' : 'transition-[width] duration-200 ease-out'
        } xl:flex xl:flex-col ${
          isOpen ? 'w-[var(--dash-right-rail-width)]' : 'w-[var(--dash-right-rail-collapsed-width)]'
        }`}
      >
        <div className={`${isOpen ? 'px-6' : 'px-4'} py-5 transition-[padding] duration-300 ease-out`}>
          <div className={`flex gap-3 ${isOpen ? 'items-start justify-between' : 'justify-center'}`}>
            {isOpen ? (
              renderOpenHeader()
            ) : (
              <button
                type="button"
                onClick={onToggle}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-[color:var(--dash-surface)] text-[color:var(--dash-text-soft)] shadow-[var(--dash-control-shadow)] transition hover:bg-[color:var(--dash-surface-hover)] hover:text-[color:var(--dash-text)]"
                aria-label="Open right sidebar"
                title="Open right sidebar"
              >
                <Menu className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div
          className={`flex-1 overflow-y-auto px-6 py-5 transition-opacity duration-200 ${
            isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          {renderRailSections()}
        </div>
      </aside>
    </>
  );
}
