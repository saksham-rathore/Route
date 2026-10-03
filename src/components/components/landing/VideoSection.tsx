import { RouteEvents } from '@/lib/analytics/route-analytics';
import { homeVideoChips } from '@/components/landing/product-page-copy';
import { VideoHighlightChips } from '@/components/landing/VideoHighlightChips';
import { VideoPlayer } from '@/components/landing/VideoPlayer';

export function VideoSection() {
  return (
    <section
      className="relative w-full overflow-hidden bg-transparent pb-20 pt-14 md:pb-28 md:pt-16"
      data-umami-event={RouteEvents.SECTION_VIEW}
      data-umami-event-section="video_demo"
    >
      <div className="relative z-10 mx-auto w-full min-w-0 max-w-6xl px-3 sm:px-6 md:px-16">
        <VideoHighlightChips chips={homeVideoChips} />

        <VideoPlayer />

        <p className="landing-video-caption mt-6 text-center text-sm">
          A guided product walkthrough showing latency, error context, and ISP
          evidence in one investigation surface.
        </p>
      </div>
    </section>
  );
}
