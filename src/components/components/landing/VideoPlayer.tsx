'use client';

import { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useSectionView } from '@/lib/analytics/use-section-view';
import { RouteEvents, trackEvent } from '@/lib/analytics/route-analytics';

export function VideoPlayer() {
  const containerRef = useSectionView('video_demo');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    trackEvent(RouteEvents.SECTION_VIEW, { section: 'video_demo' });
  }, []);

  // Defer the demo video download/autoplay until it scrolls into view. On a
  // throttled mobile connection an eagerly-autoplaying mp4 saturates the link
  // and starves the real LCP element, so we only fetch + play once visible.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hasStarted = false;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          if (!hasStarted) {
            hasStarted = true;
            video.preload = 'auto';
          }
          video.play().then(
            () => setIsPlaying(true),
            () => {
              /* autoplay can be blocked; leave paused */
            },
          );
        } else if (hasStarted) {
          video.pause();
          setIsPlaying(false);
        }
      },
      // Start fetching ~300px before the frame enters the viewport so playback
      // feels instant on arrival, while staying clear of the initial paint.
      { threshold: 0.25, rootMargin: '300px 0px' },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        trackEvent(RouteEvents.VIDEO_PAUSE, {
          section: 'video_demo',
          trigger: hasInteracted ? 'user' : 'autoplay',
        });
      } else {
        videoRef.current.play();
        trackEvent(RouteEvents.VIDEO_PLAY, {
          section: 'video_demo',
          trigger: 'user',
        });
      }
      setIsPlaying(!isPlaying);
      setHasInteracted(true);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      trackEvent(RouteEvents.VIDEO_MUTE_TOGGLE, {
        section: 'video_demo',
        muted: String(!isMuted),
      });
      setIsMuted(!isMuted);
      setHasInteracted(true);
    }
  };

  const handleVideoEnded = () => {
    trackEvent(RouteEvents.VIDEO_COMPLETE, { section: 'video_demo' });
    setIsPlaying(false);
  };

  const handleVideoClick = () => {
    trackEvent(RouteEvents.VIDEO_CLICK, { section: 'video_demo' });
    togglePlay();
  };

  return (
    <div
      ref={containerRef as React.RefObject<HTMLDivElement>}
      className="landing-video-shell landing-media-full-bleed-sm group relative w-full cursor-pointer overflow-hidden rounded-[8px]"
      onClick={handleVideoClick}
      data-umami-event="video_container_click"
      data-umami-event-section="video_demo"
    >
      <div className="video-demo-frame p-1 sm:p-1.5 md:p-2">
        <div className="relative aspect-video w-full overflow-hidden rounded-[6px] bg-[color:var(--landing-video-frame-bg)]">
          <video
            ref={videoRef}
            src="https://cdn.route.dev/videos/route-hero.mp4"
            poster="https://cdn.route.dev/images/landing-component/route-demo-poster.avif"
            muted
            loop
            playsInline
            preload="none"
            className="block h-full w-full object-cover"
            onEnded={handleVideoEnded}
            data-umami-event="video_element"
            data-umami-event-section="video_demo"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="pointer-events-auto absolute bottom-0 left-0 right-0 px-4 py-4 md:px-6 md:py-5">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
                  data-umami-event="video_play_pause_click"
                  data-umami-event-section="video_demo"
                  data-umami-event-action={isPlaying ? 'pause' : 'play'}
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
                >
                  {isPlaying ? (
                    <Pause className="h-3.5 w-3.5" />
                  ) : (
                    <Play className="ml-0.5 h-3.5 w-3.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMute();
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
                  data-umami-event="video_mute_click"
                  data-umami-event-section="video_demo"
                  data-umami-event-muted={!isMuted}
                  aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                >
                  {isMuted ? (
                    <VolumeX className="h-3.5 w-3.5" />
                  ) : (
                    <Volume2 className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
