'use client';

import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { label: 'Requests analysed (60s)', value: '142,841' },
  { label: 'Global Avg Latency', value: '112ms' },
  { label: 'Active Regions', value: '194' },
  { label: 'Error Rate', value: '0.12%', valueColor: 'text-[#f5a623]' },
  { label: 'p50 Latency', value: '67ms', valueColor: 'text-[color:var(--landing-accent)]' },
  { label: 'p95 Latency', value: '456ms', valueColor: 'text-[#f5a623]' },
  { label: 'p99 Latency', value: '892ms', valueColor: 'text-[#ff5370]' },
  { label: 'Third-Party Calls', value: '18.3k' },
  { label: 'JS Errors (1h)', value: '142', valueColor: 'text-[#ff5370]' },
  { label: '4G Connections', value: '67%' },
  { label: '5G Connections', value: '18%' },
  { label: 'Slowest Region', value: 'AP-South' },
  { label: 'Fastest Region', value: 'US-East', valueColor: 'text-[color:var(--landing-accent)]' },
  { label: 'Mobile Traffic', value: '58%' },
  { label: 'Avg DNS', value: '24ms' },
  { label: 'Avg TLS', value: '48ms', valueColor: 'text-[#f5a623]' },
];

export function Ticker() {
  // We duplicate the items to create a seamless infinite scroll loop
  const tickerItems = [...stats, ...stats, ...stats, ...stats, ...stats];

  return (
    <div className="relative mt-10 w-full overflow-hidden border-y border-[color:var(--landing-border)] bg-[color:var(--landing-page-bg)] py-3 md:mt-20">
      <div className="absolute right-4 top-1 z-10 text-[9px] font-mono uppercase tracking-wider text-[color:var(--landing-text-muted)]">simulated data</div>
      <motion.div 
        className="flex whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: 40,
        }}
      >
        {tickerItems.map((item, idx) => (
          <div 
            key={idx} 
            className="mr-12 inline-flex min-w-max items-center font-mono text-xs uppercase tracking-wider text-[color:var(--landing-text-soft)]"
          >
            {item.label}:{' '}
            <span className={`ml-2 font-semibold ${item.valueColor || 'text-[color:var(--landing-text)]'}`}>
              {item.value}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
