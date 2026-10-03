import type { LucideIcon } from 'lucide-react';

type LandingNavIconProps = {
  icon: LucideIcon;
  iconClassName?: string;
  size?: 'sm' | 'md';
};

const defaultIconClassName = 'text-[color:var(--dash-blue)]';

export function LandingNavIcon({ icon: Icon, iconClassName, size = 'md' }: LandingNavIconProps) {
  const tone = iconClassName ?? defaultIconClassName;
  const boxSize = size === 'md' ? 'h-10 w-10' : 'h-9 w-9';
  const iconSize = size === 'md' ? 'h-5 w-5' : 'h-4 w-4';

  return (
    <span
      className={`landing-nav-icon flex shrink-0 items-center justify-center rounded-lg ${tone} ${boxSize}`}
    >
      <Icon className={iconSize} strokeWidth={2.25} aria-hidden />
    </span>
  );
}
