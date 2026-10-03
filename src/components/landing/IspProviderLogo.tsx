'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';
import { SiAirtel, SiDeutschetelekom, SiJio } from 'react-icons/si';

export type IspProviderId =
  | 'jio'
  | 'airtel'
  | 'bsnl'
  | 'comcast'
  | 'deutsche-telekom'
  | 'china-mobile';

const iconProviders: Record<
  'jio' | 'airtel' | 'deutsche-telekom',
  { label: string; color: string; render: (className: string) => ReactNode }
> = {
  jio: {
    label: 'Reliance Jio',
    color: '#0A2885',
    render: (className) => <SiJio className={className} aria-hidden />,
  },
  airtel: {
    label: 'Airtel',
    color: '#E40000',
    render: (className) => <SiAirtel className={className} aria-hidden />,
  },
  'deutsche-telekom': {
    label: 'Deutsche Telekom',
    color: '#E20074',
    render: (className) => <SiDeutschetelekom className={className} aria-hidden />,
  },
};

const imageProviders: Record<
  'bsnl' | 'comcast' | 'china-mobile',
  { label: string; src: string; width: number; height: number }
> = {
  bsnl: { label: 'BSNL', src: '/isps/bsnl.png', width: 1011, height: 398 },
  comcast: { label: 'Comcast', src: '/isps/comcast.svg', width: 512, height: 206 },
  'china-mobile': { label: 'China Mobile', src: '/isps/china-mobile.svg', width: 337, height: 77 },
};

interface IspProviderLogoProps {
  provider: IspProviderId;
  label?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export function IspProviderLogo({ provider, label, className = '', size = 'md' }: IspProviderLogoProps) {
  const iconConfig = iconProviders[provider as keyof typeof iconProviders];
  const imageConfig = imageProviders[provider as keyof typeof imageProviders];
  const displayLabel = label ?? iconConfig?.label ?? imageConfig?.label ?? provider;
  const sizeClass = size === 'sm' ? 'h-6 w-6' : 'h-7 w-7';
  const tileClass = `flex ${sizeClass} shrink-0 items-center justify-center overflow-hidden rounded-md bg-white p-1 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.06)] dark:bg-white/95 ${className}`;

  const content =
    iconConfig != null ? (
      <span className="flex h-full w-full items-center justify-center" style={{ color: iconConfig.color }}>
        {iconConfig.render('h-full w-full')}
      </span>
    ) : imageConfig != null ? (
      <Image
        src={imageConfig.src}
        alt=""
        width={imageConfig.width}
        height={imageConfig.height}
        className="h-full w-full object-contain"
        unoptimized
      />
    ) : null;

  return (
    <span
      className={`group/logo relative inline-flex cursor-default ${tileClass}`}
      title={displayLabel}
      aria-label={displayLabel}
      tabIndex={0}
      role="img"
    >
      {content}
      <span className="pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 z-20 block -translate-x-1/2 whitespace-nowrap rounded-md border border-[color:var(--landing-border)] bg-[color:var(--landing-surface-elevated)] px-2 py-1 text-[11px] font-medium text-[color:var(--landing-text)] opacity-0 shadow-[var(--landing-card-shadow)] transition-opacity duration-150 group-hover/logo:opacity-100 group-focus-visible/logo:opacity-100 group-active/logo:opacity-100 md:hidden">
        {displayLabel}
      </span>
    </span>
  );
}
