'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import {
  VideoHighlightChips,
  type VideoHighlightChip,
} from '@/components/landing/VideoHighlightChips';
import { useSectionView } from '@/lib/analytics/use-section-view';
import { RouteEvents, trackEvent } from '@/lib/analytics/route-analytics';

type ProductLandingVideoSectionProps = {
  analyticsSection: string;
  chips: readonly VideoHighlightChip[];
  caption: string;
  videoSrc?: string;
  className?: string;
};

export function ProductLandingVideoSection({
  analyticsSection,
  chips,
  caption,
  videoSrc = 'https://cdn.route.dev/videos/route.dev.mov',
  className = '',
}: ProductLandingVideoSectionProps) {
  const sectionRef = useSectionView(analyticsSection);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    trackEvent(RouteEvents.SECTION_VIEW, { section: analyticsSection });
  }, [analyticsSection]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      trackEvent(RouteEvents.VIDEO_PAUSE, { section: analyticsSection, trigger: 'user' });
    } else {
      videoRef.current.play();
      trackEvent(RouteEvents.VIDEO_PLAY, { section: analyticsSection, trigger: 'user' });
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    trackEvent(RouteEvents.VIDEO_MUTE_TOGGLE, { section: analyticsSection, muted: String(!isMuted) });
    setIsMuted(!isMuted);
  };

  return (
    <section
      ref={sectionRef}
      className={`relative w-full overflow-hidden bg-transparent pb-20 pt-14 md:pb-28 md:pt-16 ${className}`}
      data-umami-event={RouteEvents.SECTION_VIEW}
      data-umami-event-section={analyticsSection}
    >
      <div className="relative z-10 mx-auto w-full min-w-0 max-w-6xl px-3 sm:px-6 md:px-16">
        <VideoHighlightChips chips={chips} />

        <div
          className="landing-video-shell landing-media-full-bleed-sm group relative w-full cursor-pointer overflow-hidden rounded-[8px]"
          onClick={togglePlay}
          data-umami-event="video_container_click"
          data-umami-event-section={analyticsSection}
        >
          <div className="video-demo-frame p-1 sm:p-1.5 md:p-2">
            <div className="relative overflow-hidden rounded-[6px]">
              <video
                ref={videoRef}
                src={videoSrc}
                autoPlay
                muted
                loop
                playsInline
                className="block aspect-video w-full object-cover"
                onEnded={() => setIsPlaying(false)}
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
                      aria-label={isPlaying ? 'Pause video' : 'Play video'}
                    >
                      {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="ml-0.5 h-3.5 w-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMute();
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
                      aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                    >
                      {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="landing-video-caption mt-6 text-center text-sm">{caption}</p>
      </div>
    </section>
  );
}
