type TestimonialBase = {
  quote: string;
  name: string;
  avatarUrl?: string;
};

export type SocialPlatform = 'x' | 'linkedin' | 'producthunt' | 'hackernews';

export type QuoteTestimonial = TestimonialBase & {
  variant: 'quote';
  role: string;
};

export type SocialTestimonial = TestimonialBase & {
  variant: 'social';
  platform: SocialPlatform;
  handle: string;
  sourceUrl?: string;
};

/** @deprecated Use SocialTestimonial */
export type TweetTestimonial = SocialTestimonial;

export type Testimonial = QuoteTestimonial | SocialTestimonial;

export const testimonials: readonly Testimonial[] = [
  {
    variant: 'quote',
    quote:
      'Route.dev is the cleanest analytics + observability combo I\'ve come across. Generous free tier with lots of useful features.',
    name: 'Manav Sutar',
    role: 'Founder & CEO, Single Core Labs',
    avatarUrl: 'https://cdn.route.dev/images/testimonials/manav-sutar.png',
  },
  {
    variant: 'social',
    platform: 'x',
    quote:
      'Route packs analytics and observability into one lightweight script, with Web Vitals, endpoints, and journeys without juggling three tools. The free tier is genuinely usable, and paid plans stay affordable when you scale.',
    name: 'Shivaay Lamba',
    handle: 'howdevelop',
    avatarUrl: 'https://cdn.route.dev/images/testimonials/shivaay-lamba.png',
    sourceUrl: 'https://x.com/howdevelop',
  },
  {
    variant: 'social',
    platform: 'x',
    quote:
      "Tried Route on my portfolio and honestly, it's solid. Gave me way more useful data than I expected from just one script, especially endpoints, Web Vitals, and user-journey stuff. Feels like an actual observability & analytics tool.",
    name: 'Shivam Katare',
    handle: 'Shivamkatare_27',
    avatarUrl: 'https://cdn.route.dev/images/testimonials/shivam-katare.png',
    sourceUrl: 'https://x.com/Shivamkatare_27/status/2063972876034965584',
  },
  {
    variant: 'social',
    platform: 'x',
    quote:
      'Very useful product and gives very detailed analytics! Definitely recommend it!',
    name: 'Debajyati Dey',
    handle: 'ddebajyati',
    avatarUrl:
      'https://cdn.route.dev/images/testimonials/Debajyati-dey.jpg',
    sourceUrl: 'https://x.com/ddebajyati',
  },
  {
    variant: 'quote',
    quote:
      'Route feels really useful for understanding how users interact with a product. The analytics and observability make it easier to spot what is working, what needs improvement, and how to build a better user experience.',
    name: 'Ashutosh Singh',
    role: 'Software Engineer & Founder, Vengeance UI',
    avatarUrl: 'https://cdn.route.dev/images/testimonials/ashutosh-singh.png',
  },
  {
    variant: 'quote',
    quote:
      "I build performance-sensitive tooling, so real-user observability actually matters to me. Route gives you Web Vitals, API latency, and network context without stitching three tools together. One script tag and you're done. Should've been the default.",
    name: 'Devarshi Shimpi',
    role: 'Software Engineer, Ex-Cofounder/CTO',
    avatarUrl: 'https://cdn.route.dev/images/testimonials/devarishi-shimpi.jpg'
  },
];

export function formatSocialHandle(platform: SocialPlatform, handle: string): string {
  if (platform === 'linkedin' || platform === 'hackernews') return handle;
  return `@${handle}`;
}

/** Social, quote, social, quote — for marquee display. */
export function getAlternatingTestimonials(items: readonly Testimonial[]): Testimonial[] {
  const social = items.filter((item): item is SocialTestimonial => item.variant === 'social');
  const quote = items.filter((item): item is QuoteTestimonial => item.variant === 'quote');
  const alternating: Testimonial[] = [];
  const count = Math.max(social.length, quote.length);

  for (let i = 0; i < count; i += 1) {
    if (social[i]) alternating.push(social[i]);
    if (quote[i]) alternating.push(quote[i]);
  }

  return alternating;
}
