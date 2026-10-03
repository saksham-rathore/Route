'use client';

import { createContext, useContext, type ReactNode } from 'react';

type DashboardRightRailContextValue = {
  isOpen: boolean;
  toggle: () => void;
  /** When true the inline/overlay rail is replaced by AI — hide the header trigger. */
  isRailHidden: boolean;
};

const DashboardRightRailContext = createContext<DashboardRightRailContextValue | null>(null);

export function DashboardRightRailProvider({
  children,
  isOpen,
  toggle,
  isRailHidden,
}: {
  children: ReactNode;
  isOpen: boolean;
  toggle: () => void;
  isRailHidden: boolean;
}) {
  return (
    <DashboardRightRailContext.Provider value={{ isOpen, toggle, isRailHidden }}>
      {children}
    </DashboardRightRailContext.Provider>
  );
}

export function useDashboardRightRail() {
  const context = useContext(DashboardRightRailContext);
  if (!context) {
    throw new Error('useDashboardRightRail must be used within DashboardRightRailProvider');
  }
  return context;
}

export function useOptionalDashboardRightRail() {
  return useContext(DashboardRightRailContext);
}
