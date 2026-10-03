import { LandingDemoImagePanel } from '@/components/landing/LandingDemoImagePanel';

const VISIT_WATERFALL_IMAGE = {
  light: 'https://cdn.route.dev/images/landing-component/visit-light.png',
  dark: 'https://cdn.route.dev/images/landing-component/visit-dark.png',
  alt: 'Route visit waterfall showing p95 latency on 4G in Mumbai with DNS, TCP, TLS, TTFB, and content download phases.',
} as const;

export function ObservabilityLatencyWaterfall() {
  return (
    <LandingDemoImagePanel
      lightSrc={VISIT_WATERFALL_IMAGE.light}
      darkSrc={VISIT_WATERFALL_IMAGE.dark}
      alt={VISIT_WATERFALL_IMAGE.alt}
    />
  );
}
