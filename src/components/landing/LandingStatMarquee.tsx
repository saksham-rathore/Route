'use client';

import { motion } from 'framer-motion';

type StatItem = {
  label: string;
  value: string;
  valueColor?: string;
};

type LandingStatMarqueeProps = {
  stats: readonly StatItem[];
};

export function LandingStatMarquee({ stats }: LandingStatMarqueeProps) {
  const tickerItems = [...stats, ...stats, ...stats];

  return (
    <div className="relative w-full overflow-hidden border-y border-[color:var(--landing-border)] bg-[color:var(--landing-page-bg)] py-3">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ repeat: Infinity, ease: 'linear', duration: 36 }}
      >
        {tickerItems.map((item, idx) => (
          <span
            key={`${item.label}-${idx}`}
            className="mr-12 inline-flex min-w-max items-center font-mono text-xs uppercase tracking-wider text-[color:var(--landing-text-soft)]"
          >
            {item.label}:{' '}
            <span
              className={`ml-2 font-semibold ${item.valueColor || 'text-[color:var(--landing-text)]'}`}
            >
              {item.value}
            </span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
