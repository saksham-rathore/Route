'use client';

import React from 'react';
import { useSectionView } from '@/lib/analytics/use-section-view';
import { RouteEvents } from '@/lib/analytics/route-analytics';
import { IspProviderLogo, type IspProviderId } from '@/components/landing/IspProviderLogo';

const ispData: Array<{
  provider: IspProviderId;
  name: string;
  region: string;
  p95: string;
  requests: string;
  status: 'good' | 'needs-improvement' | 'poor';
}> = [
  { provider: 'jio', name: 'Reliance Jio', region: 'India', p95: '124ms', requests: '41.2k', status: 'good' },
  { provider: 'airtel', name: 'Airtel', region: 'India', p95: '267ms', requests: '38.1k', status: 'needs-improvement' },
  { provider: 'bsnl', name: 'BSNL', region: 'India', p95: '1,840ms', requests: '12.4k', status: 'poor' },
  { provider: 'comcast', name: 'Comcast', region: 'United States', p95: '89ms', requests: '45.2k', status: 'good' },
  {
    provider: 'deutsche-telekom',
    name: 'Deutsche Telekom',
    region: 'Germany',
    p95: '64ms',
    requests: '38.2k',
    status: 'good',
  },
  { provider: 'china-mobile', name: 'China Mobile', region: 'China', p95: '1,567ms', requests: '28.9k', status: 'poor' },
];

const statusStyles = {
  good: { text: 'text-[color:var(--landing-accent)]' },
  'needs-improvement': { text: 'text-[#f5a623]' },
  poor: { text: 'text-[#ff5370]' },
};

const regionCodes: Record<string, string> = {
  India: 'IN',
  'United States': 'US',
  Germany: 'DE',
  China: 'CN',
};

const mobileIspGridClass =
  'grid grid-cols-[40px_24px_48px_1fr_64px] items-center gap-x-2.5 border-[color:var(--dash-divider)] px-3';

export function ISPBreakdown() {
  const sectionRef = useSectionView('isp_breakdown');
  return (
    <section ref={sectionRef} className="w-full border-y border-[color:var(--landing-border)] bg-[color:var(--landing-page-bg)] py-20 md:py-28">
      <div className="max-w-7xl mx-auto w-full px-6 md:px-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-[color:var(--landing-text)] md:text-4xl">
            See which <span className="text-[color:var(--landing-accent)]">ISPs</span> are killing your user experience.
          </h2>
          <p className="text-sm leading-relaxed text-[color:var(--landing-text-soft)] md:text-base">
            Not just which countries are slow. Route breaks down performance by carrier, so you can pinpoint exactly which ISP is the bottleneck. No other RUM tool gives you this natively.
          </p>
        </div>

        {/* ISP Table */}
        <div className="mx-auto w-full max-w-5xl">
          <div className="landing-demo-panel overflow-hidden">
            <div className="md:hidden">
              <div
                className={`${mobileIspGridClass} border-b py-2.5 text-[10px] font-mono uppercase tracking-[0.16em] text-[color:var(--landing-text-muted)]`}
              >
                <span className="text-[9px] leading-tight tracking-[0.12em]">ISP / Carrier</span>
                <span aria-hidden />
                <span className="text-right pl-3">Region</span>
                <span className="text-right pr-2">p95</span>
                <span className="text-right">Req</span>
              </div>

              {ispData.map((isp, idx) => {
                const styles = statusStyles[isp.status];
                return (
                  <div
                    key={idx}
                    className={`${mobileIspGridClass} border-b py-2.5 last:border-b-0`}
                    onMouseEnter={() => {
                      if (typeof window !== 'undefined' && window.umami) {
                        window.umami.track(RouteEvents.ISP_ROW_HOVER, {
                          isp: isp.name,
                          region: isp.region,
                          status: isp.status,
                          p95: isp.p95,
                        });
                      }
                    }}
                  >
                    <IspProviderLogo provider={isp.provider} label={isp.name} size="sm" />
                    <span aria-hidden />
                    <span className="text-right text-[11px] font-mono uppercase tracking-[0.14em] text-[color:var(--landing-text-soft)]">
                      {regionCodes[isp.region] ?? isp.region}
                    </span>
                    <span className={`text-right text-[13px] font-semibold tabular-nums ${styles.text}`}>{isp.p95}</span>
                    <span className="text-right text-[11px] tabular-nums text-[color:var(--landing-text-muted)]">{isp.requests}</span>
                  </div>
                );
              })}

              <div className="px-3 py-2 text-right text-[9px] font-mono uppercase tracking-wider text-[color:var(--landing-text-muted)]">
                simulated data
              </div>
            </div>

            <div className="hidden overflow-x-auto md:block">
              {/* Table Header */}
              <div className="landing-demo-inset m-3 grid min-w-[736px] grid-cols-[minmax(240px,1.4fr)_minmax(170px,0.95fr)_minmax(140px,0.75fr)_minmax(110px,0.6fr)] whitespace-nowrap px-6 py-4 text-[10px] font-mono uppercase tracking-[0.18em] text-[color:var(--landing-text-muted)] md:px-7">
                <span>ISP / Carrier</span>
                <span className="text-left">Country</span>
                <span className="text-right">p95 Latency</span>
                <span className="text-right">Requests</span>
              </div>

              {ispData.map((isp, idx) => {
                const styles = statusStyles[isp.status];
                return (
                  <div
                    key={idx}
                    className="mx-3 grid min-w-[736px] grid-cols-[minmax(240px,1.4fr)_minmax(170px,0.95fr)_minmax(140px,0.75fr)_minmax(110px,0.6fr)] items-center whitespace-nowrap border-b border-[color:var(--dash-divider)] px-6 py-4 transition-colors hover:bg-[color:var(--dash-bg-subtle)] md:px-7"
                    onMouseEnter={() => {
                      if (typeof window !== 'undefined' && window.umami) {
                        window.umami.track(RouteEvents.ISP_ROW_HOVER, {
                          isp: isp.name,
                          region: isp.region,
                          status: isp.status,
                          p95: isp.p95,
                        });
                      }
                    }}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <IspProviderLogo provider={isp.provider} label={isp.name} />
                      <span className="truncate text-sm font-semibold tracking-[-0.01em] text-[color:var(--landing-text)] md:text-[15px]">
                        {isp.name}
                      </span>
                    </div>
                    <span className="pr-5 text-sm text-[color:var(--landing-text-soft)] md:text-[15px]">{isp.region}</span>
                    <span className={`text-right text-sm font-semibold ${styles.text} md:text-[15px]`}>{isp.p95}</span>
                    <span className="text-right text-xs text-[color:var(--landing-text-muted)] md:text-sm">{isp.requests}</span>
                  </div>
                );
              })}

              <div className="px-5 py-3 text-right text-[9px] font-mono uppercase tracking-wider text-[color:var(--landing-text-muted)]">
                simulated data
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
