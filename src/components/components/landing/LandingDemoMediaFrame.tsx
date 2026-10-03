import type { ReactNode } from 'react';

/** Outer demo frame: inset border, padding, and mobile full-bleed (matches How it works). */
export const landingDemoMediaFrameClassName =
  'video-demo-frame landing-media-full-bleed-sm w-full rounded-[12px] p-1.5 sm:p-2 md:p-2.5';

type LandingDemoMediaFrameProps = {
  children: ReactNode;
  className?: string;
};

export function LandingDemoMediaFrame({ children, className = '' }: LandingDemoMediaFrameProps) {
  return (
    <div className={[landingDemoMediaFrameClassName, className].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
}
