'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, ChevronDown, ExternalLink } from 'lucide-react';
import { HugeiconsIcon } from '@hugeicons/react';
import { PerplexityAiIcon } from '@hugeicons/core-free-icons';
import { trackEvent, RouteEvents } from '@/lib/analytics/route-analytics';
import { buildRouteAiProviderUrl } from '@/lib/landing/route-ai-prompt';

function fmtNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

interface UsageInfo {
  used: number;
  limit: number; // Infinity for unlimited
}

interface AIProvider {
  name: string;
  url: string;
  icon?: string;
  color: string;
  useHugeicon?: boolean;
}

const AI_PROVIDERS: AIProvider[] = [
  {
    name: 'ChatGPT',
    url: buildRouteAiProviderUrl('chatgpt'),
    icon: 'https://cdn.route.dev/images/logos/chatgpt.png',
    color: 'from-emerald-500/20 to-teal-500/20',
  },
  {
    name: 'Claude',
    url: buildRouteAiProviderUrl('claude'),
    icon: 'https://cdn.route.dev/images/logos/claude.svg',
    color: 'from-orange-500/20 to-amber-500/20',
  },
  {
    name: 'Perplexity',
    url: buildRouteAiProviderUrl('perplexity'),
    color: 'from-cyan-500/20 to-teal-500/20',
    useHugeicon: true,
  },
  {
    name: 'Grok',
    url: buildRouteAiProviderUrl('grok'),
    icon: 'https://cdn.route.dev/images/logos/grok.png',
    color: 'from-zinc-500/20 to-neutral-500/20',
  },
];

export function AskAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch usage on mount so it's always ready
  useEffect(() => {
    fetch('/api/billing/usage')
      .then(r => (r.ok ? r.json() : null))
      .then((data: any) => {
        if (!data) return;
        const raw = data.plan?.monthlyRequests;
        setUsage({
          used: data.usage?.measurementCount ?? 0,
          limit: raw === -1 ? Infinity : (raw ?? Infinity),
        });
      })
      .catch(() => {});
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProviderClick = (provider: AIProvider) => {
    trackEvent(RouteEvents.HERO_CTA_CLICK, {
      button: 'ask_ai',
      location: 'landing_page',
      provider: provider.name.toLowerCase(),
    });
    window.open(provider.url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 px-4 py-2.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.15] rounded-xl text-sm text-white/70 hover:text-white transition-all duration-300 backdrop-blur-sm"
        data-umami-event={RouteEvents.HERO_CTA_CLICK}
        data-umami-event-button="ask_ai_toggle"
      >
        <div className="relative">
          <Sparkles className="w-4 h-4 text-emerald-400/80 group-hover:text-emerald-400 transition-colors" />
          <div className="absolute inset-0 blur-sm bg-emerald-400/30 group-hover:bg-emerald-400/50 transition-colors" />
        </div>
        <span className="font-medium">Ask AI</span>
        <ChevronDown 
          className={`w-3.5 h-3.5 text-white/30 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-3 w-56 bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          {usage !== null && (
            <div className="px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-medium">Requests left</span>
                <span className="text-[11px] text-white/60 font-mono tabular-nums">
                  {usage.limit === Infinity
                    ? `${fmtNum(usage.used)} used`
                    : `${fmtNum(Math.max(0, usage.limit - usage.used))} / ${fmtNum(usage.limit)}`}
                </span>
              </div>
              {usage.limit !== Infinity && (
                <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min((usage.used / usage.limit) * 100, 100)}%`,
                      backgroundColor:
                        usage.used / usage.limit > 0.9
                          ? 'var(--dash-danger)'
                          : usage.used / usage.limit > 0.75
                          ? '#f59e0b'
                          : '#10b981',
                    }}
                  />
                </div>
              )}
            </div>
          )}
          <div className="px-4 py-3 border-b border-white/[0.04] bg-white/[0.02]">
            <p className="text-[11px] text-white/40 uppercase tracking-[0.15em] font-medium">
              Get a summary
            </p>
          </div>
          <div className="p-2">
            {AI_PROVIDERS.map((provider) => (
              <button
                key={provider.name}
                onClick={() => handleProviderClick(provider)}
                className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl hover:bg-gradient-to-r hover:bg-white/[0.05] transition-all duration-200 group"
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${provider.color} flex items-center justify-center border border-white/5 group-hover:scale-105 transition-transform duration-200`}>
                  {provider.useHugeicon ? (
                    <HugeiconsIcon
                      icon={PerplexityAiIcon}
                      size={20}
                      strokeWidth={1.1}
                      className="text-[#20B8CD]"
                    />
                  ) : (
                    <img
                      src={provider.icon}
                      alt={provider.name}
                      className="w-5 h-5 object-contain filter brightness-90 group-hover:brightness-100 transition-all duration-200"
                    />
                  )}
                </div>
                <span className="text-sm text-white/70 group-hover:text-white font-medium">
                  {provider.name}
                </span>
                <ExternalLink className="w-3 h-3 text-white/10 group-hover:text-white/30 ml-auto opacity-0 group-hover:opacity-100 transition-all duration-200" />
              </button>
            ))}
          </div>
          <div className="px-4 py-2.5 border-t border-white/[0.04] bg-white/[0.01]">
            <p className="text-[10px] text-white/25">
              Opens in new tab with pre-filled prompt
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
