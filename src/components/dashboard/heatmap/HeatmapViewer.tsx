'use client';

import { useCallback, useEffect, useRef, useState, type SyntheticEvent } from 'react';
import { ToastContainer, useToast } from '@/components/ui/Toast';
import { getSafariFrameMaxWidth, Safari } from '@/components/ui/safari';
import { parseHeatmapEmbedSize } from '@/lib/heatmap/embed-protocol';
import {
  HEATMAP_EMBED_ZOOM,
  HEATMAP_VIEWER_HEIGHT,
  getHeatmapEmbedDisplaySize,
  getHeatmapEmbedLayoutWidth,
} from '@/components/dashboard/heatmap/heatmapEmbedConfig';
import { drawHeatmapOverlay } from './drawHeatmapOverlay';
import { normalizePoints, type HeatmapClick } from './normalizePoints';

const IFRAME_LOAD_TIMEOUT_MS = 12000;
const MIN_CONTENT_HEIGHT = 400;

/** Opaque origin; target scripts are stripped and only the fixed resize script runs. */
const EMBED_IFRAME_SANDBOX = 'allow-scripts';

interface HeatmapViewerProps {
  clicks: HeatmapClick[];
  /** Browser-rendered full-page image. */
  screenshotUrl: string;
  /** Same-origin sanitized HTML fallback. */
  embedUrl: string;
  /** URL shown in the Safari address bar */
  pageUrl?: string;
  height?: number;
  className?: string;
  onIframeBlocked?: () => void;
}

function StaticSkeleton({ className = '' }: { className?: string }) {
  return <div aria-hidden className={`rounded-md bg-[color:var(--dash-bg-subtle)] ${className}`} />;
}

function IframeCardSkeleton() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[4] bg-[color:var(--dash-bg-subtle)]/55 p-3">
      <StaticSkeleton className="h-full w-full" />
    </div>
  );
}

export function HeatmapViewer({
  clicks,
  screenshotUrl,
  embedUrl,
  pageUrl,
  height = HEATMAP_VIEWER_HEIGHT,
  className,
  onIframeBlocked,
}: HeatmapViewerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const iframeBlockedRef = useRef(false);
  const loadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [contentSize, setContentSize] = useState({ width: 0, height: 0 });
  const [viewportWidth, setViewportWidth] = useState(0);
  const [useScreenshot, setUseScreenshot] = useState(true);
  const [iframeLoading, setIframeLoading] = useState(true);

  const { toasts, addToast, removeToast } = useToast();

  const showIframeBlockedWarning = useCallback(
    (message = 'Failed to load the page embed. Check your domain in Settings.') => {
      if (iframeBlockedRef.current) return;
      iframeBlockedRef.current = true;
      addToast('warning', message, 8000);
      onIframeBlocked?.();
    },
    [addToast, onIframeBlocked],
  );

  const clearLoadTimeout = useCallback(() => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
      loadTimeoutRef.current = null;
    }
  }, []);

  const paintHeatmap = useCallback(
    (width: number, contentHeight: number) => {
      const canvas = canvasRef.current;
      if (!canvas || width <= 0 || contentHeight <= 0) return;

      const points = normalizePoints(clicks, width, contentHeight);
      drawHeatmapOverlay(canvas, points, width, contentHeight);
    },
    [clicks],
  );

  const syncIframeWidth = useCallback(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    setViewportWidth(scrollEl.clientWidth);
    if (useScreenshot) return;

    const layoutWidth = getHeatmapEmbedLayoutWidth(scrollEl.clientWidth);
    setContentSize((current) =>
      current.width === layoutWidth ? current : { ...current, width: layoutWidth },
    );
  }, [useScreenshot]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const iframe = iframeRef.current;
      if (!iframe || event.source !== iframe.contentWindow) return;

      const measured = parseHeatmapEmbedSize(event.data);
      if (!measured) return;

      const scrollWidth = getHeatmapEmbedLayoutWidth(scrollRef.current?.clientWidth ?? 0);
      setContentSize({
        width: Math.max(measured.width, scrollWidth),
        height: Math.max(measured.height, MIN_CONTENT_HEIGHT),
      });
      clearLoadTimeout();
      setIframeLoading(false);
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [clearLoadTimeout]);

  useEffect(() => {
    if (contentSize.width > 0 && contentSize.height > 0) {
      paintHeatmap(contentSize.width, contentSize.height);
    }
  }, [clicks, contentSize, paintHeatmap]);

  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    let raf = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(syncIframeWidth);
    });

    ro.observe(scrollEl);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [syncIframeWidth]);

  useEffect(() => {
    setUseScreenshot(true);
  }, [screenshotUrl]);

  useEffect(() => {
    setIframeLoading(true);
    setContentSize({ width: 0, height: 0 });
    iframeBlockedRef.current = false;
    clearLoadTimeout();
    if (!useScreenshot) {
      loadTimeoutRef.current = setTimeout(() => {
        setIframeLoading(false);
        showIframeBlockedWarning('Page embed is taking too long to load.');
      }, IFRAME_LOAD_TIMEOUT_MS);
    }

    return clearLoadTimeout;
  }, [embedUrl, screenshotUrl, useScreenshot, clearLoadTimeout, showIframeBlockedWarning]);

  const handleScreenshotLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget;
    setContentSize({
      width: image.naturalWidth,
      height: Math.max(image.naturalHeight, MIN_CONTENT_HEIGHT),
    });
    clearLoadTimeout();
    setIframeLoading(false);
  };

  const handleScreenshotError = () => {
    setUseScreenshot(false);
  };

  const handleIframeLoad = () => {
    setIframeLoading(false);
  };

  const handleIframeError = () => {
    clearLoadTimeout();
    setIframeLoading(false);
    showIframeBlockedWarning();
  };

  const viewerHeight = height;
  const frameMaxWidth = getSafariFrameMaxWidth(viewerHeight);
  const estimatedViewportWidth = frameMaxWidth * (1200 / 1203);
  const layoutWidth =
    contentSize.width > 0 ? contentSize.width : getHeatmapEmbedLayoutWidth(estimatedViewportWidth);
  const layoutHeight = contentSize.height > 0 ? contentSize.height : viewerHeight;
  const responsiveZoom = Math.min(
    HEATMAP_EMBED_ZOOM,
    viewportWidth > 0 ? viewportWidth / layoutWidth : HEATMAP_EMBED_ZOOM,
  );
  const { displayWidth, displayHeight } = getHeatmapEmbedDisplaySize(
    layoutWidth,
    layoutHeight,
    responsiveZoom,
  );

  return (
    <>
      <div
        className={`mx-auto w-full ${className ?? ''}`}
        style={{ maxWidth: frameMaxWidth }}
      >
        <Safari url={pageUrl} className="w-full">
          <div className="relative flex h-full min-h-0 w-full flex-col overflow-hidden">
            <div ref={scrollRef} className="min-h-0 flex-1 overflow-auto overscroll-contain">
              <div
                className="relative"
                style={{ width: displayWidth, height: displayHeight }}
              >
                <div
                  className="relative origin-top-left"
                  style={{
                    width: layoutWidth,
                    height: layoutHeight,
                    transform: `scale(${responsiveZoom})`,
                  }}
                >
                  {useScreenshot ? (
                    // Browser Run already returns the final optimized image bytes.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={screenshotUrl}
                      alt=""
                      aria-hidden
                      draggable={false}
                      className="pointer-events-none block"
                      style={{ width: layoutWidth, height: layoutHeight }}
                      onLoad={handleScreenshotLoad}
                      onError={handleScreenshotError}
                    />
                  ) : (
                    <iframe
                      ref={iframeRef}
                      src={embedUrl}
                      title="Heatmap page embed"
                      className="pointer-events-none block border-0"
                      style={{ width: layoutWidth, height: layoutHeight }}
                      sandbox={EMBED_IFRAME_SANDBOX}
                      referrerPolicy="no-referrer"
                      scrolling="no"
                      onLoad={handleIframeLoad}
                      onError={handleIframeError}
                    />
                  )}
                  <canvas
                    ref={canvasRef}
                    className="absolute left-0 top-0 z-[2] pointer-events-none"
                    style={{ width: layoutWidth, height: layoutHeight }}
                    aria-hidden
                  />
                </div>
              </div>
            </div>

            {iframeLoading && <IframeCardSkeleton />}

            {clicks.length === 0 && (
              <div className="pointer-events-none absolute inset-0 z-[3] flex items-center justify-center bg-[color:var(--dash-bg-subtle)]/40">
                <p className="rounded-md border border-[color:var(--dash-divider)] bg-[color:var(--dash-surface)] px-4 py-2.5 text-sm text-[color:var(--dash-text-soft)]">
                  No click data for this page and filter combination
                </p>
              </div>
            )}
          </div>
        </Safari>
      </div>

      <ToastContainer toasts={toasts} remove={removeToast} />
    </>
  );
}
