import { LandingSectionIntro } from '@/components/landing/LandingSectionIntro';

type Pillar = {
  label: string;
  title: string;
  description: string;
};

type LandingPillarGridProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  pillars: readonly Pillar[];
};

export function LandingPillarGrid({ eyebrow, title, description, pillars }: LandingPillarGridProps) {
  return (
    <section className="w-full border-b border-[color:var(--landing-border)] py-16 md:py-20">
      <div className="mx-auto w-full min-w-0 max-w-7xl px-6 md:px-16">
        <LandingSectionIntro eyebrow={eyebrow} title={title} description={description} className="mb-10" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="landing-card-solid px-5 py-6 md:px-6"
            >
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--landing-text-muted)]">
                {pillar.label}
              </p>
              <h3 className="mb-3 text-base font-semibold tracking-tight text-[color:var(--landing-text)]">
                {pillar.title}
              </h3>
              <p className="text-sm leading-7 text-[color:var(--landing-text-soft)]">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
