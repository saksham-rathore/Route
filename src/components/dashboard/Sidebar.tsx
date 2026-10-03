'use client';

import Link from 'next/link';
import { RouteIcon } from '@/components/brand/RouteIcon';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Globe,
  PieChart,
  Activity,
  Bell,
  Settings,
  Plus,
  AlertTriangle,
  ArrowLeft,
  ChevronDown,
  LayoutDashboard,
  Clock,
  Gauge,
  Wifi,
  Blocks,
  FileText,
  History,
  Waves,
  RefreshCw,
  Users,
  Monitor,
  Link2,
  ScrollText,
  User,
  Sticker,
  MessageSquare,
  Layers,
  Search,
} from '@/components/dashboard/icons';
import { useState, useEffect } from 'react';
import {
  useAppDispatch,
  setProjects,
} from '@/lib/redux';
import { trackEvent, RouteEvents } from '@/lib/analytics/route-analytics';
import { getProjectHref, getShellRootHref, useDashboardShell } from './DashboardShellContext';
import { getUserAnalyticsHref } from '@/lib/user-analytics/tabs';
import { DashboardGlobalSearch } from './DashboardGlobalSearch';
import { useDashboardMobileNav } from './DashboardMobileNavContext';

interface SidebarProps {
  projectId: string;
  projectName: string;
  projects?: Array<{ id: string; name: string }>;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

export function Sidebar({ projectId, projectName, projects: propProjects }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { basePath } = useDashboardShell();
  const shellRootHref = getShellRootHref(basePath);
  const { isOpen: mobileMenuOpen, close: closeMobileMenu } = useDashboardMobileNav();
  const [modePickerOpen, setModePickerOpen] = useState(false);
  const [navVisible, setNavVisible] = useState(true);

  const dispatch = useAppDispatch();
  const userRootHref = getUserAnalyticsHref(basePath, projectId);
  const networkRootHref = getProjectHref(basePath, projectId);
  const [preferredMode, setPreferredMode] = useState<'network' | 'user'>('network');
  const sharedConfigurationHrefs = [
    getProjectHref(basePath, projectId, 'alerts'),
    getProjectHref(basePath, projectId, 'alert-history'),
    getProjectHref(basePath, projectId, 'status-page'),
    getProjectHref(basePath, projectId, 'settings'),
  ];
  const isSharedConfigurationRoute = sharedConfigurationHrefs.some((href) => pathname === href || pathname.startsWith(`${href}/`));
  // Search Console lives under User Analytics but uses a project-level path (not /user/...).
  const searchConsoleHref = getProjectHref(basePath, projectId, 'search-console');
  const isSearchConsoleRoute =
    pathname === searchConsoleHref || pathname.startsWith(`${searchConsoleHref}/`);
  const isUserMode =
    pathname === userRootHref ||
    pathname.startsWith(`${userRootHref}/`) ||
    isSearchConsoleRoute ||
    (isSharedConfigurationRoute && preferredMode === 'user');
  const currentModeLabel = isUserMode ? 'User Analytics' : 'Observability';
  const CurrentModeIcon = isUserMode ? User : Activity;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('dash:sidebar-mode');
    if (stored === 'user' || stored === 'network') {
      setPreferredMode(stored);
    }
  }, []);

  useEffect(() => {
    const nextMode: 'user' | 'network' | null =
      pathname === userRootHref ||
      pathname.startsWith(`${userRootHref}/`) ||
      isSearchConsoleRoute
        ? 'user'
        : isSharedConfigurationRoute
          ? null
          : 'network';

    if (!nextMode || nextMode === preferredMode) return;
    setPreferredMode(nextMode);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('dash:sidebar-mode', nextMode);
    }
  }, [isSearchConsoleRoute, isSharedConfigurationRoute, pathname, preferredMode, userRootHref]);

  // Initialize projects in Redux if passed as props
  useEffect(() => {
    if (propProjects && propProjects.length > 0) {
      dispatch(setProjects(propProjects.map(p => ({
        id: p.id,
        name: p.name,
        domain: null,
        techStack: null,
        createdAt: new Date().toISOString(),
      }))));
    }
  }, [propProjects, dispatch]);

  useEffect(() => {
    setNavVisible(false);
    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setNavVisible(true);
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isUserMode]);

  const commonConfigurationItems: NavItem[] = [
    {
      label: 'Alerts',
      href: getProjectHref(basePath, projectId, 'alerts'),
      icon: <Bell className="w-4 h-4" />,
    },
    {
      label: 'Alert History',
      href: getProjectHref(basePath, projectId, 'alert-history'),
      icon: <History className="w-4 h-4" />,
    },
    {
      label: 'Status Page',
      href: getProjectHref(basePath, projectId, 'status-page'),
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      label: 'Settings',
      href: getProjectHref(basePath, projectId, 'settings'),
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  const navGroups: NavGroup[] = isUserMode
    ? [
        {
          label: 'Portfolio',
          items: [
            {
              label: 'Overview',
              href: getUserAnalyticsHref(basePath, projectId, 'overview'),
              icon: <Home className="w-4 h-4" />,
            },
            {
              label: 'Pageviews',
              href: getUserAnalyticsHref(basePath, projectId, 'pageviews'),
              icon: <FileText className="w-4 h-4" />,
            },
            {
              label: 'Visits & Sessions',
              href: getUserAnalyticsHref(basePath, projectId, 'visits'),
              icon: <Users className="w-4 h-4" />,
            },
            {
              label: 'Journeys',
              href: getUserAnalyticsHref(basePath, projectId, 'journeys'),
              icon: <Waves className="w-4 h-4" />,
            },
            {
              label: 'Retention',
              href: getUserAnalyticsHref(basePath, projectId, 'retention'),
              icon: <RefreshCw className="w-4 h-4" />,
            },
            {
              label: 'Geography',
              href: getUserAnalyticsHref(basePath, projectId, 'geography'),
              icon: <Globe className="w-4 h-4" />,
            },
            {
              label: 'Devices & Browsers',
              href: getUserAnalyticsHref(basePath, projectId, 'devices'),
              icon: <Monitor className="w-4 h-4" />,
            },
            {
              label: 'Referrers & UTM',
              href: getUserAnalyticsHref(basePath, projectId, 'referrers'),
              icon: <Link2 className="w-4 h-4" />,
            },
            {
              label: 'Search Console',
              href: getProjectHref(basePath, projectId, 'search-console'),
              icon: <Search className="w-4 h-4" />,
            },
            {
              label: 'Heatmap',
              href: getUserAnalyticsHref(basePath, projectId, 'heatmap'),
              icon: <Layers className="w-4 h-4" />,
            },
            {
              label: 'Scroll & Engagement',
              href: getUserAnalyticsHref(basePath, projectId, 'engagement'),
              icon: <ScrollText className="w-4 h-4" />,
            },
            {
              label: 'Public badge',
              href: getUserAnalyticsHref(basePath, projectId, 'embed'),
              icon: <Sticker className="w-4 h-4" />,
            },
          ],
        },
        {
          label: 'Configuration',
          items: commonConfigurationItems,
        },
      ]
    : [
        {
          label: 'Portfolio',
          items: [
            {
              label: 'Overview',
              href: getProjectHref(basePath, projectId),
              icon: <Home className="w-4 h-4" />
            },
          ]
        },
        {
          label: 'Analytics',
          items: [
            {
              label: 'Global Map',
              href: getProjectHref(basePath, projectId, 'map'),
              icon: <Globe className="w-4 h-4" />
            },
            {
              label: 'Endpoints',
              href: getProjectHref(basePath, projectId, 'endpoints'),
              icon: <Activity className="w-4 h-4" />
            },
            {
              label: 'ISPs',
              href: getProjectHref(basePath, projectId, 'isps'),
              icon: <PieChart className="w-4 h-4" />
            },
            {
              label: 'Errors',
              href: getProjectHref(basePath, projectId, 'errors'),
              icon: <AlertTriangle className="w-4 h-4" />
            },
            {
              label: 'Pages',
              href: getProjectHref(basePath, projectId, 'pages'),
              icon: <FileText className="w-4 h-4" />
            },
            {
              label: 'Web Vitals',
              href: getProjectHref(basePath, projectId, 'web-vitals'),
              icon: <Gauge className="w-4 h-4" />
            },
            {
              label: 'Network',
              href: getProjectHref(basePath, projectId, 'network'),
              icon: <Wifi className="w-4 h-4" />
            },
            {
              label: 'Third Parties',
              href: getProjectHref(basePath, projectId, 'third-parties'),
              icon: <Blocks className="w-4 h-4" />
            },
            {
              label: 'Sessions',
              href: getProjectHref(basePath, projectId, 'sessions'),
              icon: <Waves className="w-4 h-4" />
            },
            {
              label: 'Time Series',
              href: getProjectHref(basePath, projectId, 'timeseries'),
              icon: <Clock className="w-4 h-4" />
            },
          ]
        },
        {
          label: 'Configuration',
          items: commonConfigurationItems,
        }
      ];

  const isActive = (href: string) => {
    if (href === getProjectHref(basePath, projectId) || href === userRootHref) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const modePicker = document.getElementById('mode-picker');
      if (modePicker && !modePicker.contains(event.target as Node)) {
        setModePickerOpen(false);
      }
    };

    if (modePickerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modePickerOpen]);

  const handleModeChange = (nextMode: 'network' | 'user') => {
    const targetHref = nextMode === 'user' ? userRootHref : networkRootHref;
    if (
      (nextMode === 'user' && isUserMode) ||
      (nextMode === 'network' && !isUserMode)
    ) {
      setModePickerOpen(false);
      return;
    }

    setModePickerOpen(false);
    setNavVisible(false);
    setPreferredMode(nextMode);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('dash:sidebar-mode', nextMode);
    }
    window.setTimeout(() => {
      router.push(targetHref);
    }, 120);
  };

  return (
    <>
      {mobileMenuOpen ? (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-[999] bg-black/40 lg:hidden"
          onClick={closeMobileMenu}
        />
      ) : null}

      <aside
        className={`
          fixed inset-y-0 left-0 z-[1000] flex w-[min(85vw,280px)] flex-col
          bg-[color:var(--dash-sidebar)] [box-shadow:inset_-1px_0_0_var(--dash-divider)]
          transition-transform duration-200 ease-out
          lg:sticky lg:top-0 lg:z-40 lg:h-screen lg:w-[224px] lg:translate-x-0 lg:transition-none
          ${mobileMenuOpen
            ? 'translate-x-0'
            : '-translate-x-full pointer-events-none lg:pointer-events-auto'}
        `}
      >
        {/* Logo */}
        <div className="px-4 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-[color:var(--dash-text)]"
          >
            <RouteIcon className="h-5 w-auto max-w-full" />
          </Link>
        </div>

        <div className="px-3 pb-3">
          <Link
            href="/onboarding?new=true"
            className="dashboard-button-primary flex w-full items-center justify-center gap-2 px-2.5 py-2 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Project
          </Link>
        </div>

        <div className="px-3 pb-1">
          <div id="mode-picker" className="relative">
            <button
              type="button"
              onClick={() => setModePickerOpen((open) => !open)}
              className="flex w-full items-center justify-between rounded-lg bg-[color:var(--dash-input-bg)] px-2.5 py-2.5 text-left shadow-[var(--dash-control-shadow)] transition-colors hover:bg-[color:var(--dash-surface-hover)]"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center text-[color:var(--dash-blue)]">
                  <CurrentModeIcon className="h-4 w-4" />
                </span>
                <span className="truncate text-xs font-semibold leading-none text-[color:var(--dash-text)]">
                  {currentModeLabel}
                </span>
              </div>
              <ChevronDown
                className={`h-3.5 w-3.5 flex-shrink-0 text-[color:var(--dash-text-muted)] transition-transform ${modePickerOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {modePickerOpen && (
              <div className="dashboard-menu absolute left-0 right-0 top-full z-50 mt-1.5 overflow-hidden rounded-xl p-1">
                <div className="space-y-0.5">
                  {[
                    {
                      key: 'network' as const,
                      label: 'Observability',
                      icon: <Activity className="h-4 w-4" />,
                    },
                    {
                      key: 'user' as const,
                      label: 'User Analytics',
                      icon: <User className="h-4 w-4" />,
                    },
                  ].map((item) => {
                    const active = (item.key === 'user') === isUserMode;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => handleModeChange(item.key)}
                        className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left transition-colors ${
                          active
                            ? 'bg-[color:var(--dash-blue-soft)] text-[color:var(--dash-blue)]'
                            : 'text-[color:var(--dash-text-soft)] hover:bg-[color:var(--dash-surface-hover)] hover:text-[color:var(--dash-text)]'
                        }`}
                      >
                        <span className={`flex h-4 w-4 flex-shrink-0 items-center justify-center ${active ? 'text-[color:var(--dash-blue)]' : 'text-[color:var(--dash-text-muted)]'}`}>
                          {item.icon}
                        </span>
                        <span className="min-w-0 truncate text-xs font-medium leading-none">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="px-3 pb-1">
          <DashboardGlobalSearch />
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          <div
            key={isUserMode ? 'user-nav' : 'network-nav'}
            className={`space-y-5 transition-opacity duration-200 ${navVisible ? 'opacity-100' : 'opacity-0'}`}
          >
            {navGroups.map((group) => (
              <div key={group.label}>
                <div className="mb-1.5 px-2.5 text-[10px] font-medium uppercase tracking-wider text-[color:var(--dash-text-muted)]">
                  {group.label}
                </div>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const active = isActive(item.href);
                    const blueActive = active && item.label === 'Dashboard';
                    const nudgedItem = item.label === 'Dashboard' || item.label === 'Overview';
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => {
                          closeMobileMenu();
                          trackEvent(RouteEvents.SIDEBAR_NAV_CLICK, {
                            item: 'all_projects',
                            location: 'sidebar_footer',
                          });
                        }}
                        className={`
                          flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs
                          transition-colors duration-150
                          ${nudgedItem ? 'mt-px' : ''}
                          ${blueActive
                            ? 'bg-[color:var(--dash-blue)] text-[color:var(--dash-text-on-accent)] shadow-[var(--dash-button-shadow)]'
                            : active
                              ? 'bg-[color:var(--dash-bg-subtle)] text-[color:var(--dash-text)] shadow-[var(--dash-control-shadow)]'
                              : 'text-[color:var(--dash-text-soft)] hover:bg-[color:var(--dash-surface-hover)] hover:text-[color:var(--dash-text)]'
                          }
                        `}
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="space-y-3 p-3">
          <a
            href="https://feedback.route.dev/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMobileMenu}
            className="dashboard-button-primary flex w-full items-center justify-center gap-2 px-2.5 py-2 text-xs"
          >
            <MessageSquare className="h-3.5 w-3.5 shrink-0" />
            Share feedback
          </a>
          <Link
            href={shellRootHref}
            className="flex items-center gap-2 rounded-md border border-[color:var(--dash-border)] bg-[color:var(--dash-bg-subtle)] px-2.5 py-1.5 text-xs text-[color:var(--dash-text)] shadow-[var(--dash-control-shadow)] transition-colors hover:border-[color:var(--dash-border-strong)] hover:bg-[color:var(--dash-surface-hover)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Link>
        </div>
      </aside>
    </>
  );
}
