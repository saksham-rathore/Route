import Link from 'next/link';

interface MinimalNotFoundProps {
  eyebrow?: string;
  title: string;
  description: string;
  href?: string;
  hrefLabel?: string;
}

export function MinimalNotFound({
  eyebrow = '404',
  title,
  description,
  href = '/',
  hrefLabel = 'Back to home',
}: MinimalNotFoundProps) {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-16">
        <div className="text-[11px] uppercase tracking-[0.28em] text-[#5f5f5f]">{eyebrow}</div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">{title}</h1>
        <p className="mt-3 max-w-md text-sm leading-7 text-[#7a7a7a]">{description}</p>
        <div className="mt-7">
          <Link
            href={href}
            className="text-sm text-[color:var(--route-accent)] transition-colors hover:text-white"
          >
            {hrefLabel}
          </Link>
        </div>
      </div>
    </main>
  );
}
