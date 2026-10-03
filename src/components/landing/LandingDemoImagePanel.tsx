'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { LandingDemoMediaFrame } from '@/components/landing/LandingDemoMediaFrame';
import { readTheme, type ThemeMode } from '@/lib/core/theme';

type ImageLoadState = 'loading' | 'loaded' | 'error';

type LandingDemoImagePanelProps = {
  lightSrc: string;
  darkSrc: string;
  alt: string;
  /** Above-the-fold panels can opt into eager/high-priority loading. */
  priority?: boolean;
};

function resolveLoadState(img: HTMLImageElement | null): ImageLoadState {
  if (!img) return 'loading';
  if (img.dataset.loadState === 'error') return 'error';
  if (img.complete && img.naturalWidth > 0) return 'loaded';
  return 'loading';
}

export function LandingDemoImagePanel({
  lightSrc,
  darkSrc,
  alt,
  priority = false,
}: LandingDemoImagePanelProps) {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [loadState, setLoadState] = useState<ImageLoadState>('loading');

  useEffect(() => {
    const sync = () => setTheme(readTheme());
    sync();

    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-dashboard-theme'],
    });

    return () => observer.disconnect();
  }, []);

  const src = theme === 'light' ? lightSrc : darkSrc;

  useEffect(() => {
    setLoadState('loading');
  }, [src]);

  return (
    <LandingDemoMediaFrame>
      <div
        className="landing-demo-image-panel relative w-full overflow-hidden rounded-[6px]"
        data-load-state={loadState}
      >
        <div className="landing-demo-image-panel__placeholder" aria-hidden />

        {/* next/image serves a resized WebP/AVIF variant (the source PNGs are
            ~3000px wide but render at ≤1200px) and lazy-loads by default. */}
        <Image
          key={src}
          src={src}
          alt={alt}
          width={1200}
          height={720}
          priority={priority}
          sizes="100vw"
          className="landing-demo-image-panel__img"
          draggable={false}
          ref={(img) => {
            if (resolveLoadState(img) === 'loaded') setLoadState('loaded');
          }}
          onError={(event) => {
            event.currentTarget.dataset.loadState = 'error';
            setLoadState('error');
          }}
          onLoad={(event) => {
            event.currentTarget.dataset.loadState = 'loaded';
            setLoadState('loaded');
          }}
        />
      </div>
    </LandingDemoMediaFrame>
  );
}
