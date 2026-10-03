type LandingSectionIntroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'center' | 'left';
  className?: string;
};

export function LandingSectionIntro({
  eyebrow,
  title,
  description,
  align = 'center',
  className = '',
}: LandingSectionIntroProps) {
  const alignClass = align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl text-left';

  return (
    <div className={`${alignClass} ${className}`}>
      {eyebrow ? (
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--landing-text-muted)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-bold tracking-tight text-[color:var(--landing-text)] md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-sm leading-7 text-[color:var(--landing-text-soft)] md:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
