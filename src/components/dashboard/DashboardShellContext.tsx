'use client';

import { createContext, useContext } from 'react';

export interface DashboardShellConfig {
  basePath: string;
  homePath: string;
  billingPath: string | null;
  profilePath: string | null;
  connectionsPath: string | null;
  isDemo: boolean;
  projectId: string | null;
  projectName: string | null;
}

const DEFAULT_DASHBOARD_SHELL: DashboardShellConfig = {
  basePath: '/dashboard',
  homePath: '/',
  billingPath: '/dashboard/billing',
  profilePath: '/dashboard/profile',
  connectionsPath: '/dashboard/connections',
  isDemo: false,
  projectId: null,
  projectName: null,
};

const DashboardShellContext = createContext<DashboardShellConfig>(DEFAULT_DASHBOARD_SHELL);

export function DashboardShellProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: DashboardShellConfig;
}) {
  return (
    <DashboardShellContext.Provider value={value}>
      {children}
    </DashboardShellContext.Provider>
  );
}

export function useDashboardShell() {
  return useContext(DashboardShellContext);
}

export function getProjectHref(basePath: string, projectId: string, segment?: string) {
  if (!basePath) {
    return segment ? `/${segment}` : '/';
  }

  if (!segment) return `${basePath}/${projectId}`;
  return `${basePath}/${projectId}/${segment}`;
}

export function getShellRootHref(basePath: string) {
  return basePath || '/';
}

/** Path segment relative to the project shell (empty at observability overview). */
export function getDashboardRelativePath(
  basePath: string,
  projectId: string,
  pathname: string,
): string | null {
  if (!basePath) {
    if (pathname === '/') return '';
    if (!pathname.startsWith('/')) return null;
    return pathname.slice(1);
  }

  const shellRoot = `${basePath}/${projectId}`;
  if (pathname === shellRoot) return '';
  if (!pathname.startsWith(`${shellRoot}/`)) return null;
  return pathname.slice(shellRoot.length + 1);
}
