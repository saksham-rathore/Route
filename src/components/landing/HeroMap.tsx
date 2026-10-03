'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { motion, AnimatePresence } from 'framer-motion';
import { RouteEvents } from '@/lib/analytics/route-analytics';

const geoUrl = '/world.geojson';

interface PingLocation {
  coordinates: [number, number];
  color: string;
  delay: number;
  label: string;
  country: string;
  requests: number;
  p95: number;
}

// Reduced to 12 strategically placed markers around the world
const mockPings: PingLocation[] = [
  // North America
  { coordinates: [-74.006, 40.7128], color: 'var(--landing-accent)', delay: 0, label: 'NYC', country: 'US', requests: 45231, p95: 89 },
  { coordinates: [-118.2437, 34.0522], color: 'var(--landing-accent)', delay: 0.5, label: 'LAX', country: 'US', requests: 38421, p95: 112 },
  { coordinates: [-43.1729, -22.9068], color: 'var(--landing-accent)', delay: 1.0, label: 'RIO', country: 'BR', requests: 9876, p95: 156 },
  
  // Europe
  { coordinates: [-0.1276, 51.5074], color: 'var(--landing-accent)', delay: 0.3, label: 'LON', country: 'GB', requests: 42123, p95: 67 },
  { coordinates: [13.405, 52.52], color: 'var(--landing-accent)', delay: 0.8, label: 'BER', country: 'DE', requests: 38234, p95: 64 },
  
  // Asia Pacific
  { coordinates: [139.6917, 35.6895], color: 'var(--landing-accent)', delay: 0.2, label: 'TYO', country: 'JP', requests: 38921, p95: 45 },
  { coordinates: [77.209, 28.6139], color: '#f5a623', delay: 0.7, label: 'DEL', country: 'IN', requests: 34567, p95: 267 },
  { coordinates: [103.8198, 1.3521], color: 'var(--landing-accent)', delay: 1.2, label: 'SIN', country: 'SG', requests: 32145, p95: 38 },
  { coordinates: [151.2093, -33.8688], color: 'var(--landing-accent)', delay: 0.4, label: 'SYD', country: 'AU', requests: 21342, p95: 102 },
  
  // Middle East & Africa
  { coordinates: [55.2708, 25.2048], color: 'var(--landing-accent)', delay: 0.9, label: 'DXB', country: 'AE', requests: 18765, p95: 87 },
  { coordinates: [31.2357, 30.0444], color: '#f5a623', delay: 0.6, label: 'CAI', country: 'EG', requests: 11234, p95: 234 },
  { coordinates: [18.4241, -33.9249], color: 'var(--landing-accent)', delay: 1.1, label: 'CPT', country: 'ZA', requests: 7654, p95: 156 },
];

// Desktop stats overlays are temporarily disabled; keep the dataset nearby
// so it can be restored quickly when requested.
// const metricsData = {
//   totalRequests: '2.4M',
//   activeRegions: 194,
//   avgLatency: '112ms',
//   p95Latency: '456ms',
//   thirdPartyImpact: '1.8s',
//   jsErrors: 142,
//   connectionTypes: {
//     '4g': '67%',
//     '5g': '18%',
//     'wifi': '12%',
//     '3g': '3%',
//   },
//   topSlowIsps: [
//     { name: 'BSNL India', p95: '1840ms' },
//     { name: 'China Mobile', p95: '1567ms' },
//     { name: 'Telecom Egypt', p95: '1240ms' },
//   ],
// };

const mapCardClassName =
  'landing-card rounded-[8px] backdrop-blur-xl';

interface TooltipData {
  x: number;
  y: number;
  data: PingLocation | null;
}

export function HeroMap() {
  const [mounted, setMounted] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipData>({ x: 0, y: 0, data: null });
  const [hoveredMarker, setHoveredMarker] = useState<number | null>(null);
  const [clickedMarker, setClickedMarker] = useState<PingLocation | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Desktop hover handlers
  const handleMouseEnter = useCallback((ping: PingLocation, idx: number, event: React.MouseEvent) => {
    setHoveredMarker(idx);
    setTooltip({
      x: event.clientX,
      y: event.clientY - 80,
      data: ping,
    });
    if (typeof window !== 'undefined' && window.umami) {
      window.umami.track(RouteEvents.MAP_MARKER_HOVER, {
        country: ping.country,
        label: ping.label,
        p95_ms: ping.p95,
      });
    }
  }, []);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    setTooltip(prev => ({
      ...prev,
      x: event.clientX,
      y: event.clientY - 80,
    }));
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredMarker(null);
    setTooltip(prev => ({ ...prev, data: null }));
  }, []);

  // Mobile click handler
  const handleClick = useCallback((ping: PingLocation) => {
    setClickedMarker(prev => prev?.label === ping.label ? null : ping);
    if (typeof window !== 'undefined' && window.umami) {
      window.umami.track(RouteEvents.MAP_MARKER_CLICK, {
        country: ping.country,
        label: ping.label,
        p95_ms: ping.p95,
      });
    }
  }, []);

  const handleCloseMobileTooltip = useCallback(() => {
    setClickedMarker(null);
  }, []);

  if (!mounted) {
    return (
      <div className="h-[380px] w-full animate-pulse bg-[color:var(--landing-surface-muted)] md:h-[720px]" />
    );
  }

  return (
    <div ref={containerRef} className="relative h-[380px] w-full overflow-hidden md:h-[720px]">
      {/* Full-width map */}
      <ComposableMap
        projectionConfig={{ 
          scale: 200,
          center: [15, 20],
        }}
        style={{ 
          width: '100%', 
          height: '100%', 
          background: 'transparent',
        }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="var(--landing-map-fill)"
                stroke="var(--landing-map-stroke)"
                strokeWidth={0.72}
                style={{
                  default: { outline: 'none' },
                  hover: { fill: 'var(--landing-map-hover)', outline: 'none' },
                  pressed: { outline: 'none' },
                }}
              />
            ))
          }
        </Geographies>

        {mockPings.map((ping, idx) => (
          <Marker 
            key={idx} 
            coordinates={ping.coordinates}
            onMouseEnter={(e) => handleMouseEnter(ping, idx, e)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(ping)}
          >
            <g style={{ cursor: 'pointer' }}>
              {/* Single expanding ring - reduced for performance */}
              <motion.circle
                r={8}
                fill="transparent"
                stroke={ping.color}
                strokeWidth={0.8}
                initial={{ scale: 0.5, opacity: 0.6 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeOut',
                  delay: ping.delay,
                }}
              />
              <motion.circle
                r={8}
                fill="transparent"
                stroke={ping.color}
                strokeWidth={0.5}
                initial={{ scale: 0.5, opacity: 0.4 }}
                animate={{ scale: 3.5, opacity: 0 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeOut',
                  delay: ping.delay + 0.5,
                }}
              />
              {/* Core dot */}
              <circle 
                r={(hoveredMarker === idx || clickedMarker?.label === ping.label) ? 4 : 3} 
                fill={ping.color} 
                opacity={0.95}
              />
            </g>
          </Marker>
        ))}
      </ComposableMap>

      {/* Gradient overlays for seamless blending */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 md:h-32"
        style={{
          background: 'var(--landing-map-edge-fade-top)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 md:h-32"
        style={{
          background: 'var(--landing-map-edge-fade-bottom)',
        }}
      />

      {/*
      Desktop overlays - simplified cards
      <div className="absolute left-6 top-6 z-20 hidden md:block">
        <div className={`${mapCardClassName} w-[220px] p-4`}>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--landing-text-muted)]">
            Total requests (60s)
          </div>
          <div className="mt-2 font-mono text-[2rem] font-bold leading-none text-[color:var(--landing-text)]">
            {metricsData.totalRequests}
          </div>
          <div className="mt-2 text-[11px] text-[color:var(--landing-accent)]">+12.4% from last hour</div>
        </div>
      </div>

      <div className="absolute right-6 top-8 z-20 hidden md:block">
        <div className={`${mapCardClassName} w-[210px] p-4`}>
          <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--landing-text-muted)]">
            Latency breakdown
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[color:var(--landing-text-soft)]">p50</span>
              <span className="font-mono text-xs font-semibold text-[color:var(--landing-accent)]">67ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[color:var(--landing-text-soft)]">p95</span>
              <span className="font-mono text-xs font-semibold text-[#f5a623]">{metricsData.p95Latency}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[color:var(--landing-text-soft)]">p99</span>
              <span className="font-mono text-xs font-semibold text-[#ff5370]">892ms</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-20 hidden md:block">
        <div className={`${mapCardClassName} w-[220px] p-4`}>
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--landing-text-muted)]">
              Slowest ISPs
            </div>
            <span className="text-[10px] font-semibold text-[#ff5370]">{metricsData.jsErrors} JS errors</span>
          </div>
          <div className="space-y-2">
            {metricsData.topSlowIsps.map((isp, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="max-w-[120px] truncate text-[11px] text-[color:var(--landing-text-soft)]">
                  {isp.name}
                </span>
                <span className="font-mono text-[11px] font-semibold text-[#ff5370]">{isp.p95}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      */}

      {/* Desktop Tooltip - Follows cursor on hover */}
      <AnimatePresence>
        {tooltip.data && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="landing-card pointer-events-none fixed z-50 hidden min-w-[168px] rounded-[8px] px-3 py-2.5 backdrop-blur-xl md:block"
            style={{
              left: tooltip.x,
              top: tooltip.y,
              transform: 'translateX(-50%)',
              boxShadow: 'var(--landing-card-shadow-strong)',
              backgroundColor:
                'color-mix(in srgb, var(--landing-surface) 84%, var(--landing-surface-muted))',
            }}
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: tooltip.data.color }}
              />
              <div className="text-sm font-medium text-[color:var(--landing-text)]">
                {tooltip.data.label}, {tooltip.data.country}
              </div>
            </div>
            <div className="mt-1.5 text-[11px] text-[color:var(--landing-text-soft)]">
              <span className="font-mono text-[color:var(--landing-text)]">
                {tooltip.data.p95}ms
              </span>{' '}
              p95
              <span className="mx-1.5 text-[color:var(--landing-text-muted)]">•</span>
              {tooltip.data.requests.toLocaleString()} requests
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Tooltip - Click to show centered */}
      <AnimatePresence>
        {clickedMarker && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="landing-card absolute left-1/2 top-1/2 z-50 min-w-[210px] -translate-x-1/2 -translate-y-1/2 rounded-[8px] p-4 backdrop-blur-xl md:hidden"
            style={{
              boxShadow: 'var(--landing-card-shadow-strong)',
              backgroundColor:
                'color-mix(in srgb, var(--landing-surface) 84%, var(--landing-surface-muted))',
            }}
          >
            {/* Close button */}
            <button 
              onClick={handleCloseMobileTooltip}
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center text-[color:var(--landing-text-muted)] hover:text-[color:var(--landing-text)]"
            >
              ×
            </button>
            
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: clickedMarker.color }}
              />
              <div className="text-sm font-medium text-[color:var(--landing-text)]">
                {clickedMarker.label}, {clickedMarker.country}
              </div>
            </div>
            <div className="mt-2 text-xs text-[color:var(--landing-text-soft)]">
              <span className="font-mono text-[color:var(--landing-text)]">
                {clickedMarker.p95}ms
              </span>{' '}
              p95
              <span className="mx-1.5 text-[color:var(--landing-text-muted)]">•</span>
              {clickedMarker.requests.toLocaleString()} requests
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
