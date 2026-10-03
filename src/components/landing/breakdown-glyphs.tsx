'use client';

import type { ReactNode } from 'react';
import {
  FileText,
  Laptop,
  Link2,
  Mail,
  Monitor,
  MousePointerClick,
  Search,
  Share2,
  Smartphone,
  Tablet,
} from 'lucide-react';
import { getCountryFlagSrc } from '@/components/dashboard/country-flags';

function normalizeLabel(value: string) {
  return value.trim().toLowerCase();
}

function getBrowserIconSrc(value: string) {
  const normalized = normalizeLabel(value);

  if (normalized.includes('brave')) {
    return 'https://img.icons8.com/color/48/brave-web-browser.png';
  }
  if (normalized.includes('chrome') || normalized.includes('chromium')) {
    return 'https://img.icons8.com/color/48/chrome--v1.png';
  }
  if (normalized.includes('safari') || normalized.includes('webkit')) {
    return 'https://img.icons8.com/color/48/safari--v1.png';
  }
  if (normalized.includes('firefox') || normalized.includes('mozilla')) {
    return 'https://img.icons8.com/color/48/firefox.png';
  }
  if (normalized.includes('edge')) {
    return 'https://img.icons8.com/color/48/ms-edge-new.png';
  }
  if (normalized.includes('opera')) {
    return 'https://img.icons8.com/color/48/opera.png';
  }
  if (normalized.includes('arc')) {
    return 'https://www.google.com/s2/favicons?domain=arc.net&sz=32';
  }

  return null;
}

export function CountryFlagGlyph({ country }: { country: string }) {
  const flagSrc = getCountryFlagSrc(country);

  if (!flagSrc) {
    return (
      <span
        aria-hidden
        className="inline-flex h-3.5 w-5 shrink-0 items-center justify-center rounded-[2px] bg-[color:var(--landing-surface-muted)] text-[9px] font-medium text-[color:var(--landing-text-muted)]"
      >
        -
      </span>
    );
  }

  return (
    <img
      src={flagSrc}
      alt=""
      aria-hidden
      className="h-3.5 w-5 shrink-0 rounded-[2px] object-cover shadow-[var(--landing-card-shadow)]"
      loading="lazy"
      decoding="async"
    />
  );
}

export function DeviceTypeGlyph({ device }: { device: string }) {
  const normalized = normalizeLabel(device);
  let Icon = Monitor;

  if (normalized.includes('mobile') || normalized.includes('phone')) {
    Icon = Smartphone;
  } else if (normalized.includes('tablet') || normalized.includes('ipad')) {
    Icon = Tablet;
  } else if (normalized.includes('laptop') || normalized.includes('notebook') || normalized.includes('macbook')) {
    Icon = Laptop;
  }

  return (
    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center text-[color:var(--landing-accent)]">
      <Icon className="h-4 w-4" aria-hidden />
    </span>
  );
}

export function BrowserBrandGlyph({ browser }: { browser: string }) {
  const iconSrc = getBrowserIconSrc(browser);

  if (iconSrc) {
    return (
      <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden rounded-[4px]">
        <img
          src={iconSrc}
          alt=""
          aria-hidden
          className="h-4 w-4 object-contain"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />
      </span>
    );
  }

  return (
    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center text-[color:var(--landing-text-muted)]">
      <Monitor className="h-4 w-4" aria-hidden />
    </span>
  );
}

export function ChannelGlyph({ channel }: { channel: string }) {
  const normalized = normalizeLabel(channel);
  let Icon = MousePointerClick;

  if (normalized.includes('organic') || normalized.includes('search')) {
    Icon = Search;
  } else if (normalized.includes('referral')) {
    Icon = Link2;
  } else if (normalized.includes('social')) {
    Icon = Share2;
  } else if (normalized.includes('email')) {
    Icon = Mail;
  }

  return (
    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center text-[color:var(--landing-accent)]">
      <Icon className="h-4 w-4" aria-hidden />
    </span>
  );
}

export function PagePathGlyph() {
  return (
    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center text-[color:var(--landing-text-muted)]">
      <FileText className="h-4 w-4" aria-hidden />
    </span>
  );
}

export function BreakdownLabel({
  glyph,
  children,
  mono = false,
}: {
  glyph: ReactNode;
  children: ReactNode;
  mono?: boolean;
}) {
  return (
    <span className="inline-flex min-w-0 items-center gap-2 text-[color:var(--dash-text-soft)]">
      {glyph}
      <span className={`min-w-0 truncate ${mono ? 'font-mono text-[13px]' : ''}`}>{children}</span>
    </span>
  );
}
