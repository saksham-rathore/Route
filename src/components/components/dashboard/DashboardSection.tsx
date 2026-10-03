'use client';

import {
  createElement,
  forwardRef,
  type CSSProperties,
  type HTMLAttributes,
  useEffect,
} from 'react';
import { usePathname } from 'next/navigation';

type DashboardSectionProps = HTMLAttributes<HTMLElement> & {
  as?: 'div' | 'section';
  id: string;
};

export const DashboardSection = forwardRef<HTMLElement, DashboardSectionProps>(
  function DashboardSection({ as = 'section', id, style, ...props }, ref) {
    const nextStyle: CSSProperties = {
      scrollMarginTop: '96px',
      ...style,
    };

    return createElement(as, {
      ref,
      id,
      'data-dashboard-section': id,
      style: nextStyle,
      ...props,
    });
  },
);

function scrollToActiveHash() {
  if (typeof window === 'undefined') return;

  const hash = window.location.hash.replace(/^#/, '');
  if (!hash) return;

  const decodedHash = decodeURIComponent(hash);
  let attempts = 0;

  const tryScroll = () => {
    const element = document.getElementById(decodedHash);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    attempts += 1;
    if (attempts < 12) {
      window.setTimeout(tryScroll, 120);
    }
  };

  window.requestAnimationFrame(tryScroll);
}

export function DashboardHashNavigator() {
  const pathname = usePathname();

  useEffect(() => {
    scrollToActiveHash();

    window.addEventListener('hashchange', scrollToActiveHash);
    return () => window.removeEventListener('hashchange', scrollToActiveHash);
  }, [pathname]);

  return null;
}

export function scrollToDashboardSectionHash(hash: string | null | undefined) {
  if (!hash) return;

  scrollToActiveHash();
}
