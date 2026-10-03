'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import { ChatGptIcon, ClaudeIcon, PerplexityAiIcon } from '@hugeicons/core-free-icons';
import { trackEvent, RouteEvents } from '@/lib/analytics/route-analytics';
import { buildRouteAiProviderUrl } from '@/lib/landing/route-ai-prompt';

type IconSvgObject = Parameters<typeof HugeiconsIcon>[0]['icon'];

function GrokIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={22}
      height={22}
      fill="currentColor"
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
    >
      <path d="m19.25 5.08-9.52 9.67 6.64-4.96c.33-.24.79-.15.95.23.82 1.99.45 4.39-1.17 6.03-1.63 1.64-3.89 2.01-5.96 1.18l-2.26 1.06c3.24 2.24 7.18 1.69 9.64-.8 1.95-1.97 2.56-4.66 1.99-7.09-.82-3.56.2-4.98 2.29-7.89L22 2.3zM9.72 14.75h.01zM8.35 15.96c-2.33-2.25-1.92-5.72.06-7.73 1.47-1.48 3.87-2.09 5.97-1.2l2.25-1.05c-.41-.3-.93-.62-1.52-.84a7.45 7.45 0 0 0-8.13 1.65c-2.11 2.14-2.78 5.42-1.63 8.22.85 2.09-.54 3.57-1.95 5.07-.5.53-1 1.06-1.4 1.62z" />
    </svg>
  );
}

type HugeiconProvider = {
  name: string;
  url: string;
  kind: 'hugeicon';
  icon: IconSvgObject;
  iconClassName: string;
};

type SvgProvider = {
  name: string;
  url: string;
  kind: 'svg';
  iconClassName: string;
};

type AIProvider = HugeiconProvider | SvgProvider;

const AI_PROVIDERS: AIProvider[] = [
  {
    name: 'ChatGPT',
    url: buildRouteAiProviderUrl('chatgpt'),
    kind: 'hugeicon',
    icon: ChatGptIcon,
    iconClassName: 'text-[color:var(--landing-text)]',
  },
  {
    name: 'Claude',
    url: buildRouteAiProviderUrl('claude'),
    kind: 'hugeicon',
    icon: ClaudeIcon,
    iconClassName: 'text-[#D97757]',
  },
  {
    name: 'Perplexity',
    url: buildRouteAiProviderUrl('perplexity'),
    kind: 'hugeicon',
    icon: PerplexityAiIcon,
    iconClassName: 'text-[#20B8CD]',
  },
  {
    name: 'Grok',
    url: buildRouteAiProviderUrl('grok'),
    kind: 'svg',
    iconClassName: 'text-[color:var(--landing-text)]',
  },
];

type AskRouteAiIconsProps = {
  analyticsLocation: string;
  className?: string;
};

export function AskRouteAiIcons({ analyticsLocation, className = 'flex items-center gap-1' }: AskRouteAiIconsProps) {
  const handleProviderClick = (provider: AIProvider) => {
    trackEvent(RouteEvents.HERO_CTA_CLICK, {
      button: 'ask_ai_icon',
      location: analyticsLocation,
      provider: provider.name.toLowerCase(),
    });
    window.open(provider.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={className}>
      {AI_PROVIDERS.map((provider) => (
        <button
          key={provider.name}
          type="button"
          onClick={() => handleProviderClick(provider)}
          className="group cursor-pointer rounded-lg p-2 transition-colors duration-200 hover:bg-[color:var(--landing-surface-muted)]"
          title={`Ask ${provider.name} about Route`}
          data-umami-event={RouteEvents.HERO_CTA_CLICK}
          data-umami-event-button="ask_ai_icon"
          data-umami-event-location={analyticsLocation}
          data-umami-event-provider={provider.name.toLowerCase()}
        >
          {provider.kind === 'hugeicon' ? (
            <HugeiconsIcon
              icon={provider.icon}
              size={22}
              strokeWidth={1.1}
              className={`opacity-100 transition-opacity duration-200 group-hover:opacity-100 ${provider.iconClassName}`}
            />
          ) : (
            <GrokIcon
              className={`opacity-100 transition-opacity duration-200 group-hover:opacity-100 ${provider.iconClassName}`}
            />
          )}
        </button>
      ))}
    </div>
  );
}

/** Hero: icon row only, centered */
export function AIProviderIcons() {
  return <AskRouteAiIcons analyticsLocation="hero_section" className="flex items-center justify-center gap-1" />;
}

/** Footer: “Ask AI about Route” label + provider icons */
export function FooterAskRouteAi() {
  return (
    <div className="mt-4">
      <p className="font-mono text-sm text-[color:var(--landing-text-muted)]">Ask AI about Route</p>
      <AskRouteAiIcons analyticsLocation="footer" className="-ml-2 mt-1 flex items-center justify-start gap-0" />
    </div>
  );
}
