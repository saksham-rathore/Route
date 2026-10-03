import { LandingFeatureSection } from '@/components/landing/LandingFeatureSection';

type FeatureBullet = {
  eyebrow: string;
  title: string;
  description: string;
  bullets: readonly string[];
};

type ProductFeatureBulletsProps = {
  features: readonly FeatureBullet[];
};

function BulletCard({ bullets }: { bullets: readonly string[] }) {
  return (
    <div className="landing-demo-panel p-5 md:p-6">
      <ul className="space-y-3">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-2.5 text-sm leading-6 text-[color:var(--landing-text-soft)]">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--dash-blue)]" />
            {bullet}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProductFeatureBullets({ features }: ProductFeatureBulletsProps) {
  return (
    <>
      {features.map((feature, index) => (
        <LandingFeatureSection
          key={feature.eyebrow}
          eyebrow={feature.eyebrow}
          title={feature.title}
          description={feature.description}
          media={<BulletCard bullets={feature.bullets} />}
          mediaPosition={index % 2 === 0 ? 'right' : 'left'}
        />
      ))}
    </>
  );
}
