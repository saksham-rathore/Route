'use client';

import Link from 'next/link';
import { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SendHorizontal, X, CircleAlert } from 'lucide-react';
import { ROUTE_FAVICON_URL } from '@/lib/seo/config';
import { trackEvent, RouteEvents } from '@/lib/analytics/route-analytics';
import { useDashboardShell } from './DashboardShellContext';

const AI_MARKDOWN_COMPONENTS: Components = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  h1: ({ children }) => <h1 className="mb-2 mt-3 text-[15px] font-semibold first:mt-0">{children}</h1>,
  h2: ({ children }) => <h2 className="mb-1.5 mt-3 text-[14px] font-semibold first:mt-0">{children}</h2>,
  h3: ({ children }) => <h3 className="mb-1.5 mt-2.5 text-[13px] font-semibold first:mt-0">{children}</h3>,
  h4: ({ children }) => <h4 className="mb-1 mt-2 text-[13px] font-semibold first:mt-0">{children}</h4>,
  ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-4 last:mb-0">{children}</ul>,
  ol: ({ children }) => <ol className="mb-2 list-decimal space-y-1 pl-4 last:mb-0">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[color:var(--dash-blue)] underline underline-offset-2 hover:opacity-90"
    >
      {children}
    </a>
  ),
  code: ({ className, children }) => {
    if (className) {
      return <code className={`${className} font-mono text-[11px] leading-relaxed text-[color:var(--dash-text-soft)]`}>{children}</code>;
    }
    return (
      <code className="rounded bg-[color:var(--dash-input-bg)] px-1 py-0.5 font-mono text-[11px] text-[color:var(--dash-text-soft)]">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="mb-2 overflow-x-auto whitespace-pre rounded-md border border-[color:var(--dash-border)] bg-[color:var(--dash-input-bg)] px-2.5 py-2 last:mb-0">
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mb-2 border-l-2 border-[color:var(--dash-border-strong)] pl-3 text-[color:var(--dash-text-soft)] last:mb-0">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-3 border-[color:var(--dash-divider)]" />,
  table: ({ children }) => (
    <div className="mb-2 overflow-x-auto last:mb-0">
      <table className="w-full border-collapse text-left text-[12px]">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="border-b border-[color:var(--dash-border)]">{children}</thead>,
  th: ({ children }) => <th className="px-2 py-1 font-semibold">{children}</th>,
  td: ({ children }) => <td className="border-t border-[color:var(--dash-divider)] px-2 py-1">{children}</td>,
};

interface Message {
  id: string;
  role: 'ai' | 'user';
  content: string;
}

interface AIInsightsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  activeTab?: string;
  range?: string;
  /** Dynamic prompt suggestions based on data - if not provided, uses defaults */
  prompts?: string[];
}

const DEFAULT_CHIPS: Record<string, string[]> = {
  overview: ['Summarize performance', 'What needs attention?'],
  endpoints: ['Which endpoints are slowest?', 'Identify regressions'],
  isps: ['Which ISPs are bottlenecks?', 'Compare mobile vs fiber'],
  timeseries: ['Explain this spike', 'Is latency trending up?'],
  vitals: ['Which vitals need improvement?', 'CLS diagnosis'],
  errors: ['What\'s causing the most errors?', 'Correlate errors with latency'],
  map: ['Which regions are underperforming?', 'Suggest CDN placement'],
  network: ['Analyze connection types', 'DNS/TLS bottlenecks?'],
  pages: ['Which pages are slowest?', 'Pages with worst vitals?'],
  'third-parties': ['Which third parties are slowest?', 'Impact on page performance?'],
  'alert-history': ['How often are alerts firing?', 'Which rules trigger most?'],
  sessions: ['Analyze slowest sessions', 'Sessions with errors?'],
  breakdowns: ['Summarize performance', 'What needs attention?'],
};

export function AIInsightsPanel({ isOpen, onClose, projectId, activeTab = 'overview', range = '24h', prompts }: AIInsightsPanelProps) {
  const { billingPath, isDemo } = useDashboardShell();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [creditsUsed, setCreditsUsed] = useState<number | null>(null);
  const [creditsLimit, setCreditsLimit] = useState<number | null>(null);
  const [creditsExhausted, setCreditsExhausted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const chips = prompts ?? DEFAULT_CHIPS[activeTab] ?? DEFAULT_CHIPS.overview;
  const creditsSummary =
    creditsUsed != null && creditsLimit != null
      ? `${creditsUsed}/${creditsLimit} messages this month`
      : 'Ask about this tab and range.';

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle escape key to close panel
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const sendMessage = useCallback(async (text: string, source: 'input' | 'chip' = 'input') => {
    if (!text.trim() || isLoading) return;

    const prompt = text.trim();

    trackEvent(RouteEvents.AI_MESSAGE_SEND, {
      project_id: projectId,
      tab: activeTab,
      range,
      source,
      prompt_length: prompt.length,
      demo_mode: isDemo,
    });

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: prompt };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const aiMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: aiMsgId, role: 'ai', content: '' }]);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const history = messages.slice(-6).map(m => ({ role: m.role, content: m.content }));

      const res = await fetch(`/api/projects/${projectId}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          tab: activeTab,
          range,
          history,
        }),
        signal: controller.signal,
      });

      const used = res.headers.get('X-AI-Credits-Used');
      const limit = res.headers.get('X-AI-Credits-Limit');
      if (used) setCreditsUsed(parseInt(used, 10));
      if (limit) setCreditsLimit(parseInt(limit, 10));

      if (res.status === 429) {
        const err = (await res.json().catch(() => ({}))) as Record<string, number>;
        setCreditsExhausted(true);
        setCreditsUsed(err.used ?? null);
        setCreditsLimit(err.limit ?? null);
        trackEvent(RouteEvents.AI_LIMIT_EXHAUSTED, {
          project_id: projectId,
          tab: activeTab,
          range,
          used: err.used,
          limit: err.limit,
          demo_mode: isDemo,
        });
        setMessages(prev => prev.map(m =>
          m.id === aiMsgId
            ? { ...m, content: `You've used all ${err.limit ?? ''} ${isDemo ? 'demo AI messages' : 'AI messages'} for this month.${isDemo ? ' Try again next month from this IP.' : ' Upgrade your plan for more.'}` }
            : m
        ));
        return;
      }

      if (!res.ok || !res.body) {
        setMessages(prev => prev.map(m =>
          m.id === aiMsgId ? { ...m, content: 'Sorry, something went wrong. Please try again.' } : m
        ));
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data: ')) continue;
          const data = trimmed.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              setMessages(prev => prev.map(m =>
                m.id === aiMsgId ? { ...m, content: m.content + parsed.content } : m
              ));
            }
          } catch { /* skip */ }
        }
      }
    } catch (err: unknown) {
      if (!(err instanceof Error) || err.name !== 'AbortError') {
        setMessages(prev => prev.map(m =>
          m.id === aiMsgId ? { ...m, content: 'Connection error. Please try again.' } : m
        ));
      }
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  }, [isLoading, messages, projectId, activeTab, range, isDemo]);

  const handleSend = () => sendMessage(inputValue, 'input');
  const handleChipClick = (chip: string) => sendMessage(chip, 'chip');

  if (!isOpen) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideIn {
          from { transform: translate3d(100%, 0, 0); opacity: 0.98; }
          to { transform: translate3d(0, 0, 0); opacity: 1; }
        }
      `}} />
      <div className="pointer-events-none fixed inset-0 z-[9999] flex justify-end overflow-hidden xl:pointer-events-auto xl:static xl:inset-auto xl:z-auto xl:h-full xl:w-[var(--dash-right-rail-width)] xl:flex-shrink-0">
        <div
          className="pointer-events-auto relative z-[1] flex h-full w-full flex-col overflow-hidden border-l border-[color:var(--dash-border-strong)] bg-[color:var(--dash-sidebar)] shadow-[-12px_0_30px_rgba(15,23,42,0.16)] sm:w-[var(--dash-right-rail-width)] xl:w-full"
          style={{
            animation: 'slideIn 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div className="relative z-[1] flex flex-shrink-0 items-center justify-between gap-4 px-4 py-4" style={{ boxShadow: 'inset 0 -1px 0 var(--dash-divider)' }}>
            <div className="flex min-w-0 flex-1 items-center gap-1.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center">
                <img src={ROUTE_FAVICON_URL} alt="" aria-hidden className="h-7 w-7" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold leading-none text-[color:var(--dash-text)]">AI Insights</p>
                <p
                  className="mt-1 truncate text-[11px] leading-4 text-[color:var(--dash-text-muted)]"
                  title={creditsSummary}
                >
                  {creditsSummary}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-md bg-[color:var(--dash-surface)] text-[color:var(--dash-text-soft)] shadow-[var(--dash-control-shadow)] transition hover:bg-[color:var(--dash-surface-hover)] hover:text-[color:var(--dash-text)]"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          </div>

          <div className="relative z-[1] flex-1 overflow-y-auto px-4 py-4">
            {messages.length === 0 && !isLoading && (
              <div className="rounded-md border border-[color:var(--dash-border)] bg-[color:var(--dash-surface)] px-4 py-4 shadow-[var(--dash-control-shadow)]">
                <p className="text-sm font-semibold text-[color:var(--dash-text)]">Ask about this project&apos;s performance</p>
                <p className="mt-1 text-xs leading-5 text-[color:var(--dash-text-soft)]">
                  Start with a suggestion below or type a question about latency, errors, traffic, or regional trends.
                </p>
              </div>
            )}

            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                  {message.role === 'ai' && (
                    <div className="mb-2 flex items-center gap-1.5 px-1">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center">
                        <img src={ROUTE_FAVICON_URL} alt="" aria-hidden className="h-6 w-6" />
                      </div>
                      <span className="text-[11px] font-medium uppercase tracking-[0.12em] leading-none text-[color:var(--dash-text-muted)]">Route AI</span>
                    </div>
                  )}
                  <div
                    className={`rounded-md px-4 py-3 text-[13px] leading-relaxed ${
                      message.role === 'ai'
                        ? 'w-full border border-[color:var(--dash-border)] bg-[color:var(--dash-surface)] text-[color:var(--dash-text)] shadow-[var(--dash-control-shadow)]'
                        : 'max-w-[88%] whitespace-pre-wrap bg-[color:var(--dash-blue)] text-[color:var(--dash-text-on-accent)] shadow-[var(--dash-button-shadow)]'
                    }`}
                  >
                    {message.role === 'ai' && message.content === '' && isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[color:var(--dash-blue)]" style={{ animationDelay: '0ms' }} />
                        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[color:var(--dash-blue)]" style={{ animationDelay: '150ms' }} />
                        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[color:var(--dash-blue)]" style={{ animationDelay: '300ms' }} />
                      </div>
                    ) : message.role === 'ai' ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={AI_MARKDOWN_COMPONENTS}>
                        {message.content}
                      </ReactMarkdown>
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div ref={messagesEndRef} />
          </div>

          <div className="relative z-[1] flex-shrink-0 px-4 py-4" style={{ boxShadow: 'inset 0 1px 0 var(--dash-divider)' }}>
            <div className="mb-3 flex flex-wrap gap-2">
              {chips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleChipClick(chip)}
                  disabled={isLoading || creditsExhausted}
                  className="rounded-md border border-[color:var(--dash-border)] bg-[color:var(--dash-surface)] px-3 py-1.5 text-[11px] font-medium text-[color:var(--dash-text-soft)] shadow-[var(--dash-control-shadow)] transition-colors hover:bg-[color:var(--dash-surface-hover)] hover:text-[color:var(--dash-text)] disabled:opacity-50"
                >
                  <span className="mr-1 text-[color:var(--dash-blue)]">/</span>
                  {chip}
                </button>
              ))}
            </div>

            {creditsExhausted ? (
              <div className="flex items-center gap-3 rounded-md border border-[color:color-mix(in_srgb,var(--dash-warning)_28%,transparent)] bg-[color:color-mix(in_srgb,var(--dash-warning)_12%,var(--dash-surface))] px-4 py-3">
                <CircleAlert className="h-4 w-4 flex-shrink-0 text-[color:var(--dash-warning)]" strokeWidth={2} />
                <span className="text-xs text-[color:var(--dash-text-soft)]">
                  {isDemo ? (
                    'Demo AI messages exhausted for this IP until next month.'
                  ) : billingPath ? (
                    <>
                      AI messages exhausted. <Link href={billingPath} className="text-[color:var(--dash-blue)] hover:underline">Upgrade your plan</Link> for more.
                    </>
                  ) : (
                    'AI messages exhausted.'
                  )}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-md border border-[color:var(--dash-border)] bg-[color:var(--dash-input-bg)] px-3 py-2 shadow-[var(--dash-control-shadow)]">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about your performance data..."
                  disabled={isLoading}
                  className="flex-1 bg-transparent px-1 text-[14px] text-[color:var(--dash-text)] placeholder-[color:var(--dash-text-muted)] outline-none disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading}
                  className="flex h-9 w-9 items-center justify-center rounded-md bg-[color:var(--dash-blue)] text-[color:var(--dash-text-on-accent)] shadow-[var(--dash-button-shadow)] transition-colors hover:bg-[color:var(--dash-blue-hover)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <SendHorizontal className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
