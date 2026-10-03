'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, Smartphone, Tablet } from 'lucide-react';
import { useSectionView } from '@/lib/analytics/use-section-view';

const deviceRows = [
  { label: 'Desktop', value: '1.6K', icon: Monitor },
  { label: 'Mobile', value: '1.2K', icon: Smartphone },
  { label: 'Tablet', value: '983', icon: Tablet },
];

const countryRows = [
  { code: 'US', label: 'United States', value: '1.8K' },
  { code: 'CA', label: 'Canada', value: '1.2K' },
  { code: 'GB', label: 'United Kingdom', value: '983' },
  { code: 'IN', label: 'India', value: '632' },
  { code: 'IE', label: 'Ireland', value: '411' },
];

function DeviceHeaderIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4 text-neutral-800"
      fill="none"
      viewBox="0 0 18 18"
    >
      <rect
        x="3.75"
        y="1.75"
        width="10.5"
        height="14.5"
        rx="2"
        ry="2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <polyline
        points="7.75 1.75 7.75 2.75 10.25 2.75 10.25 1.75"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <circle cx="9" cy="13" r="1" fill="currentColor" />
    </svg>
  );
}

function CountriesHeaderIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4 text-neutral-800"
      fill="none"
      viewBox="0 0 18 18"
    >
      <path
        d="M2.75 4.25A1.5 1.5 0 0 1 4.25 2.75H13a2.25 2.25 0 0 1 2.25 2.25v8.75"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M2.75 4.5h8.5a1.75 1.75 0 0 1 0 3.5h-6A2.5 2.5 0 0 0 2.75 10.5v1.25A2.5 2.5 0 0 0 5.25 14.25H15.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function DeviceRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="relative flex items-center justify-between gap-2 p-1.5">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-neutral-800" />
        <span className="truncate text-sm text-neutral-600">{label}</span>
      </div>
      <span className="text-sm text-neutral-500">{value}</span>
    </div>
  );
}

function CountryRow({
  code,
  label,
  value,
}: {
  code: string;
  label: string;
  value: string;
}) {
  return (
    <div className="relative flex items-center justify-between gap-2 p-1.5">
      <div className="flex items-center gap-2">
        <img
          alt=""
          aria-hidden="true"
          className="h-3 w-4 rounded-sm"
          src={`https://flag.vercel.app/m/${code}.svg`}
        />
        <span className="truncate text-sm text-neutral-600">{label}</span>
      </div>
      <span className="text-sm text-neutral-500">{value}</span>
    </div>
  );
}

function AnalyticsPreviewCard({ tx, ty, opacity }: { tx: number; ty: number; opacity: number }) {
  return (
    <motion.div
      className="min-h-[500px]"
      initial={{ opacity: 0, x: tx - 18, y: ty + 30, scale: 0.96 }}
      whileInView={{ opacity, x: tx, y: ty, scale: 1 }}
      viewport={{ once: true, amount: 0.45 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: ty - 15 }}
    >
      <div className="min-h-[1000px] rounded-2xl border border-neutral-200 bg-white p-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center rounded-lg border border-neutral-200 p-1.5">
            <DeviceHeaderIcon />
          </div>
          <span className="text-sm font-medium text-neutral-600">Devices</span>
        </div>

        <div className="mt-3 flex flex-col gap-2">
          {deviceRows.map((row) => (
            <DeviceRow key={row.label} icon={row.icon} label={row.label} value={row.value} />
          ))}
        </div>

        <div className="mt-6 flex items-center gap-2">
          <div className="flex items-center justify-center rounded-lg border border-neutral-200 p-1.5">
            <CountriesHeaderIcon />
          </div>
          <span className="text-sm font-medium text-neutral-600">Countries</span>
        </div>

        <div className="mt-3 flex flex-col gap-2">
          {countryRows.map((row) => (
            <CountryRow key={row.code} code={row.code} label={row.label} value={row.value} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function AnalyticsComponent() {
  const sectionRef = useSectionView('analytics_component');

  return (
    <section
      id="analytics"
      ref={sectionRef}
      className="scroll-mt-20 bg-[color:var(--landing-page-bg)] py-14 md:py-20"
    >
      <div className="mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-[760px]">
          <div className="landing-card-solid rounded-[28px] bg-[color:var(--landing-surface-elevated)] px-4 py-6 backdrop-blur-sm sm:px-6 lg:px-8 lg:py-8">
            <div className="flex w-full flex-col justify-between border-l border-[color:var(--landing-border)] py-6 lg:py-14">
          <div className="h-72 overflow-clip px-4 sm:h-[320px] lg:px-10">
            <div
              aria-hidden="true"
              className="size-full cursor-default select-none [mask-image:radial-gradient(120%_100%_at_0%_0%,black_80%,transparent_100%)]"
            >
              <div className="relative w-[70%] min-w-[280px] [perspective:1400px] [transform:rotateX(-18deg)_rotateY(23deg)] [transform-style:preserve-3d] sm:min-w-[360px]">
                <AnalyticsPreviewCard tx={0} ty={0} opacity={0.3} />
                <div className="absolute inset-0">
                  <AnalyticsPreviewCard tx={36} ty={18} opacity={0.55} />
                </div>
                <div className="absolute inset-0">
                  <AnalyticsPreviewCard tx={72} ty={36} opacity={1} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-6 px-4 lg:px-10">
            <div className="group relative flex flex-col text-base">
              <h3 className="font-medium text-[color:var(--landing-text)]">
                Detailed geo and device-specific data
              </h3>
              <div className="mt-2 text-[color:var(--landing-text-soft)] transition-colors">
                <p>
                  Analyze performance of your short links based on cities, countries,
                  browsers, devices, and more.
                </p>
              </div>
              <a
                className="mt-6 w-fit whitespace-nowrap rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium leading-none text-neutral-900 transition-colors duration-75 outline-none hover:bg-neutral-50 focus-visible:border-neutral-900 focus-visible:ring-1 focus-visible:ring-neutral-900 active:bg-neutral-100"
                href="https://dub.co/help/article/dub-analytics#2-aggregated-data-for-different-facets-top-views"
                target="_blank"
                rel="noreferrer"
              >
                Learn more
              </a>
            </div>
          </div>
        </div>
          </div>
        </div>
      </div>
    </section>
  );
}
