'use client';

import dynamic from 'next/dynamic';

const Spinner = () => null;

export const HeroMap = dynamic(
  () => import('./HeroMap').then(m => m.HeroMap),
  { ssr: false, loading: Spinner }
);

export const LiveFeed = dynamic(
  () => import('./LiveFeed').then(m => m.LiveFeed),
  { ssr: false, loading: Spinner }
);

export const Ticker = dynamic(
  () => import('./Ticker').then(m => m.Ticker),
  { ssr: false, loading: Spinner }
);

export const Pricing = dynamic(
  () => import('./Pricing').then(m => m.Pricing),
  { ssr: false, loading: Spinner }
);

export const HowItWorks = dynamic(
  () => import('./HowItWorks').then(m => m.HowItWorks),
  { loading: Spinner }
);

export const FeatureSlider = dynamic(
  () => import('./FeatureSlider').then(m => m.FeatureSlider),
  { loading: Spinner }
);

export const Testimonials = dynamic(
  () => import('./Testimonials').then(m => m.Testimonials),
  { loading: Spinner }
);
