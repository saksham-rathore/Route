'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type SyntheticEvent,
} from 'react';
import { ToastContainer, useToast } from '@/components/ui/Toast';
import { getSafariFrameMaxWidth, Safari } from '@/components/ui/safari';
import { parseHeatmapEmbedSize } from '@/lib/heatmap/embed-protocol';
import {
  HEATMAP_EMBED_ZOOM,
  HEATMAP_VIEWER_HEIGHT,
  getHeatmapEmbedDisplaySize,
  getHeatmapEmbedLayoutWidth,
} from '@/components/dashboard/heatmap/heatmapEmbedConfig';
import {
  scrollBucketsToGradient,
  type ScrollBucket,
} from '@/components/dashboard/heatmap/scrollBucketsToGradient';

const IFRAME_LOAD_TIMEOUT_MS = 12000;
const MIN_CONTENT_HEIGHT = 400;
const GAUGE_WIDTH_PX = 14;

/** Opaque origin; target scripts are stripped and only the fixed resize script runs. */
const EMBED_IFRAME_SANDBOX = 'allow-scripts';

interface ScrollDepthOverlayProps {
  scrollBuckets: ScrollBucket[];
  /** Browser-rendered full-page image. */
  screenshotUrl: string;
  /** Same-origin sanitized HTML fallback. */
  embedUrl: string;
  /** URL shown in the Safari address bar */
  pageUrl?: string;
  height?: number;
  className?: string;
}

function StaticSkeleton({ className = '' }: { className?: string }) {
  return <div aria-hidden className={`rounded-md bg-[color:var(--dash-bg-subtle)] ${className}`} />;
}

function ScrollOverlaySkeleton() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[4] bg-[color:var(--dash-bg-subtle)]/55 p-3">
      <StaticSkeleton className="h-full w-full" />
    </div>
  );
}

export function ScrollDepthOverlay({
  scrollBuckets,
  screenshotUrl,
  embedUrl,
  pageUrl,
  height = HEATMAP_VIEWER_HEIGHT,
  className,
}: ScrollDepthOverlayProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const iframeBlockedRef = useRef(false);
  const loadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [contentHeight, setContentHeight] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [useScreenshot, setUseScreenshot] = useState(true);
  const [iframeLoading, setIframeLoading] = useState(true);

  const { toasts, addToast, removeToast } = useToast();

  const gradient = useMemo(() => scrollBucketsToGradient(scrollBuckets), [scrollBuckets]);

  const showIframeBlockedWarning = useCallback(
    (message = 'Failed to load the page embed. Check your domain in Settings.') => {
      if (iframeBlockedRef.current) return;
      iframeBlockedRef.current = true;
      addToast('warning', message, 8000);
    },
    [addToast],
  );

  const clearLoadTimeout = useCallback(() => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
      loadTimeoutRef.current = null;
    }
  }, []);

  const syncIframeWidth = useCallback(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const availableWidth = Math.max(scrollEl.clientWidth - GAUGE_WIDTH_PX, 0);
    setViewportWidth(availableWidth);
    if (useScreenshot) return;

    const layoutWidth = getHeatmapEmbedLayoutWidth(availableWidth);
    setContentWidth(layoutWidth);
  }, [useScreenshot]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const iframe = iframeRef.current;
      if (!iframe || event.source !== iframe.contentWindow) return;

      const measured = parseHeatmapEmbedSize(event.data);
      if (!measured) return;

      const scrollWidth = getHeatmapEmbedLayoutWidth(
        Math.max((scrollRef.current?.clientWidth ?? 0) - GAUGE_WIDTH_PX, 0),
      );
      setContentHeight(Math.max(measured.height, MIN_CONTENT_HEIGHT));
      setContentWidth(Math.max(measured.width, scrollWidth));
      clearLoadTimeout();
      setIframeLoading(false);
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [clearLoadTimeout]);

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
    setContentHeight(0);
    setContentWidth(0);
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
    setContentWidth(image.naturalWidth);
    setContentHeight(Math.max(image.naturalHeight, MIN_CONTENT_HEIGHT));
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
  const estimatedViewportWidth = frameMaxWidth * (1200 / 1203) - GAUGE_WIDTH_PX;
  const layoutWidth =
    contentWidth > 0 ? contentWidth : getHeatmapEmbedLayoutWidth(Math.max(estimatedViewportWidth, 1));
  const layoutHeight = contentHeight > 0 ? contentHeight : viewerHeight;
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
              <div className="flex" style={{ width: displayWidth + GAUGE_WIDTH_PX, height: displayHeight }}>
                <div
                  className="pointer-events-none shrink-0 rounded-l-sm"
                  style={{
                    width: GAUGE_WIDTH_PX,
                    height: displayHeight,
                    background: gradient,
                  }}
                  aria-hidden
                />
                <div className="relative" style={{ width: displayWidth, height: displayHeight }}>
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
                        title="Scroll depth page embed"
                        className="pointer-events-none block border-0"
                        style={{ width: layoutWidth, height: layoutHeight }}
                        sandbox={EMBED_IFRAME_SANDBOX}
                        referrerPolicy="no-referrer"
                        scrolling="no"
                        onLoad={handleIframeLoad}
                        onError={handleIframeError}
                      />
                    )}
                    <div
                      className="pointer-events-none absolute inset-0 z-[2]"
                      style={{ background: gradient }}
                      aria-hidden
                    />
                  </div>
                </div>
              </div>
            </div>

            {iframeLoading && <ScrollOverlaySkeleton />}
          </div>
        </Safari>
      </div>

      <ToastContainer toasts={toasts} remove={removeToast} />
    </>
  );
}
