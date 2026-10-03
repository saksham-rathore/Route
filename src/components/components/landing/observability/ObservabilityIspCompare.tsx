import { LandingDemoImagePanel } from '@/components/landing/LandingDemoImagePanel';

const CARRIER_COMPARE_IMAGE = {
  light: 'https://cdn.route.dev/images/landing-component/carrier-light.png',
  dark: 'https://cdn.route.dev/images/landing-component/carrier-dark.png',
  alt: 'Route carrier P95 comparison for India showing Jio, Airtel, BSNL, and Vi latency by session share.',
} as const;

export function ObservabilityIspCompare() {
  return (
    <LandingDemoImagePanel
      lightSrc={CARRIER_COMPARE_IMAGE.light}
      darkSrc={CARRIER_COMPARE_IMAGE.dark}
      alt={CARRIER_COMPARE_IMAGE.alt}
    />
  );
}
