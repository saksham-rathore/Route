'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedEvent {
  id: string;
  status: string;
  statusCode: number;
  color: string;
  path: string;
  latency: string;
  region: string;
  method: string;
}

const allEvents: FeedEvent[] = [
  { id: '1', status: '200 OK', statusCode: 200, color: 'text-[#00ffbd]', path: '/api/v1/auth', latency: '42ms', region: 'US-East', method: 'POST' },
  { id: '2', status: '200 OK', statusCode: 200, color: 'text-[#00ffbd]', path: '/api/v1/user', latency: '118ms', region: 'EU-West', method: 'GET' },
  { id: '3', status: '200 OK', statusCode: 200, color: 'text-[#f5a623]', path: '/api/v1/search', latency: '840ms', region: 'AP-South', method: 'GET' },
  { id: '4', status: '201 CRE', statusCode: 201, color: 'text-[#00ffbd]', path: '/api/v1/cart', latency: '210ms', region: 'US-West', method: 'POST' },
  { id: '5', status: '200 OK', statusCode: 200, color: 'text-[#00ffbd]', path: '/api/v1/ping', latency: '12ms', region: 'EU-Central', method: 'GET' },
  { id: '6', status: '200 OK', statusCode: 200, color: 'text-[#00ffbd]', path: '/api/v1/cdn', latency: '5ms', region: 'Global', method: 'GET' },
  { id: '7', status: '500 ERR', statusCode: 500, color: 'text-[#ff5370]', path: '/api/v1/checkout', latency: '2.4s', region: 'AP-Northeast', method: 'POST' },
  { id: '8', status: '200 OK', statusCode: 200, color: 'text-[#00ffbd]', path: '/api/v1/products', latency: '89ms', region: 'US-East', method: 'GET' },
  { id: '9', status: '404 NF', statusCode: 404, color: 'text-[#f5a623]', path: '/api/v1/legacy', latency: '156ms', region: 'SA-East', method: 'GET' },
  { id: '10', status: '200 OK', statusCode: 200, color: 'text-[#00ffbd]', path: '/api/v1/analytics', latency: '67ms', region: 'EU-North', method: 'POST' },
  { id: '11', status: '429 RAT', statusCode: 429, color: 'text-[#f5a623]', path: '/api/v1/ratelimit', latency: '23ms', region: 'US-West', method: 'GET' },
  { id: '12', status: '200 OK', statusCode: 200, color: 'text-[#00ffbd]', path: '/api/v1/webhook', latency: '45ms', region: 'AP-Southeast', method: 'POST' },
  { id: '13', status: '503 UN', statusCode: 503, color: 'text-[#ff5370]', path: '/api/v1/health', latency: '5.1s', region: 'AF-South', method: 'GET' },
  { id: '14', status: '200 OK', statusCode: 200, color: 'text-[#00ffbd]', path: '/api/v1/orders', latency: '134ms', region: 'EU-West', method: 'GET' },
  { id: '15', status: '200 OK', statusCode: 200, color: 'text-[#00ffbd]', path: '/api/v1/inventory', latency: '78ms', region: 'US-East', method: 'GET' },
];

const MAX_VISIBLE = 6;

export function LiveFeed() {
  const [visibleEvents, setVisibleEvents] = useState<FeedEvent[]>(allEvents.slice(0, MAX_VISIBLE));
  const [counter, setCounter] = useState(0);

  const cycleEvent = useCallback(() => {
    setVisibleEvents(prev => {
      const newEvents = [...prev];
      newEvents.pop();
      const nextIndex = (allEvents.findIndex(e => e.id === prev[0].id) + MAX_VISIBLE + counter) % allEvents.length;
      const nextEvent = allEvents[nextIndex];
      newEvents.unshift({ ...nextEvent, id: `${nextEvent.id}-${Date.now()}` });
      return newEvents;
    });
    setCounter(c => c + 1);
  }, [counter]);

  useEffect(() => {
    const interval = setInterval(cycleEvent, 1800);
    return () => clearInterval(interval);
  }, [cycleEvent]);

  const getStatusBg = (statusCode: number) => {
    if (statusCode >= 500) return 'bg-[#ff5370]/10';
    if (statusCode >= 400) return 'bg-[#f5a623]/10';
    if (statusCode === 201) return 'bg-[#00ffbd]/10';
    return 'bg-[#00ffbd]/5';
  };

  const getLatencyColor = (latency: string) => {
    if (latency.includes('s')) return 'text-[#ff5370]';
    const ms = parseInt(latency);
    if (ms > 500) return 'text-[#f5a623]';
    if (ms > 200) return 'text-[#f5a623]/70';
    return 'text-[#00ffbd]';
  };

  return (
    <div className="bg-[color:var(--landing-bg)] border border-[#1f1f1f] rounded-xl p-5 font-mono text-[0.75rem] shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative overflow-hidden backdrop-blur-md w-full max-w-lg mx-auto lg:mx-0">
      {/* Ambient glow effect */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#00ffbd]/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex justify-between items-center text-[#e0e0e0] border-b border-[#1f1f1f] mb-4 pb-3">
        <div className="flex items-center gap-3">
          <span className="text-[#444] uppercase tracking-wider text-[10px] md:text-xs">LIVE_INGESTION_FEED</span>
          <span className="text-[10px] text-[#333] font-mono uppercase tracking-wider">simulated</span>
        </div>
        <span className="text-[#00ffbd] flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full bg-[#00ffbd] animate-pulse shadow-[0_0_8px_#00ffbd]" />
          ACTIVE
        </span>
      </div>
      
      <div className="flex flex-col relative min-h-[240px]">
        <AnimatePresence mode="popLayout">
          {visibleEvents.map((evt, idx) => (
            <motion.div
              key={evt.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ 
                opacity: idx === 0 ? 1 : Math.max(0.25, 1 - (idx * 0.12)),
                y: 0,
                scale: 1,
              }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ 
                duration: 0.35, 
                ease: [0.25, 0.46, 0.45, 0.94],
                layout: { duration: 0.3 }
              }}
              className={`grid grid-cols-[70px_1fr_50px_50px] py-2.5 px-2 -mx-2 border-b border-white/5 items-center ${
                idx === 0 ? getStatusBg(evt.statusCode) : ''
              } rounded-lg`}
            >
              <span className={`${evt.color} font-semibold text-[11px]`}>{evt.status}</span>
              <div className="flex flex-col gap-0.5 overflow-hidden">
                <span className="text-[#aaa] truncate">{evt.path}</span>
                <span className="text-[#555] text-[9px] uppercase tracking-wider">{evt.region}</span>
              </div>
              <span className="text-[#666] text-[10px] text-center">{evt.method}</span>
              <span className={`text-right font-semibold text-[11px] ${getLatencyColor(evt.latency)}`}>
                {evt.latency}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[color:var(--landing-bg)] to-transparent pointer-events-none" />
    </div>
  );
}
