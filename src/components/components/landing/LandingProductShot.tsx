'use client';

import Image from 'next/image';
import { useState, type ReactNode } from 'react';

type LandingProductShotProps = {
  src?: string;
  alt: string;
  fallback?: ReactNode;
  className?: string;
  priority?: boolean;
};

export function LandingProductShot({
  src,
  alt,
  fallback,
  className = '',
  priority = false,
}: LandingProductShotProps) {
  const [failed, setFailed] = useState(!src);

  if (!src || failed) {
    return (
      <div className={`landing-demo-panel min-w-0 overflow-hidden ${className}`}>
        {fallback}
      </div>
    );
  }

  return (
    <div className={`landing-demo-panel min-w-0 overflow-hidden p-2 sm:p-3 ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={720}
        priority={priority}
        onError={() => setFailed(true)}
        className="w-full rounded-[6px] border border-[color:var(--dash-border)]"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1100px"
      />
    </div>
  );
}
