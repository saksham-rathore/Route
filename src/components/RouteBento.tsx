import React from "react";
import Svg1 from "./svg1";
import Svg2 from "./svg2";
import Svg3 from "./svg3";

const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`relative isolate h-full overflow-hidden rounded-[24px] border border-black/[0.045] p-5 text-[#121212] sm:rounded-[32px] sm:p-8 ${className}`}
    >
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};

/* -------------------------------------------------
   TOP LEFT
------------------------------------------------- */

const RouteOverview = () => {
  return (
    <Card className="bg-[#f7ecff]">
      <div className="flex h-full flex-col justify-between">
        {/* Mini dashboard */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-[390px] rounded-2xl bg-white p-3 shadow-[0_12px_40px_rgba(80,40,120,0.08)]">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#17152A] text-xs font-bold text-white">
                  R
                </div>
                <span className="text-[11px] font-semibold">
                  Route Analytics
                </span>
              </div>

              <span className="rounded-full bg-[#efe6ff] px-2 py-1 text-[9px] font-medium text-[#7B35F0]">
                Live
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                ["12.4k", "Visitors"],
                ["8.7k", "Sessions"],
                ["32.8k", "Events"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-xl bg-[#faf9fc] p-2.5">
                  <p className="text-[15px] font-semibold tracking-tight">
                    {value}
                  </p>
                  <p className="mt-0.5 text-[9px] text-black/45">{label}</p>
                </div>
              ))}
            </div>

            <div className="mt-3 h-[70px] rounded-xl bg-[#faf9fc] p-2">
              <svg viewBox="0 0 320 70" className="h-full w-full" fill="none">
                <path
                  d="M5 56 C40 51 42 42 70 45 C100 49 106 28 130 34 C160 41 164 23 190 29 C216 36 228 15 250 22 C273 28 280 10 315 14"
                  stroke="#7B35F0"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-instrument-sans text-[22px] font-medium leading-[1.08] tracking-[-0.04em] sm:text-[28px] sm:leading-[1.05] sm:tracking-[-0.045em]">
            <span className="block text-[#7B35F0]">From visitors</span>
            <span className="block text-[#17152A]">
              to meaningful insights.
            </span>
          </h3>

          <p className="mt-3 max-w-[390px] text-[13.5px] font-medium leading-[1.42] tracking-[-0.02em] text-[#373737]/70 sm:text-[15px]">
            Understand what is happening across your website with simple,
            focused analytics for visitors, sessions, events, and pages.
          </p>
        </div>
      </div>
    </Card>
  );
};

/* -------------------------------------------------
   TOP RIGHT
------------------------------------------------- */

const UserActivity = () => {
  return (
    <Card className="bg-[#f0f9ff]">
      <div className="grid h-full gap-5 py-2 sm:gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <div>
          <h3 className="font-instrument-sans text-[22px] font-medium leading-[1.08] tracking-[-0.04em] sm:text-[28px] sm:leading-[1.05] sm:tracking-[-0.045em]">
            <span className="block text-sky-600">See what your users</span>
            <span className="block text-[#17152A]">are actually doing.</span>
          </h3>

          <p className="mt-3 max-w-[360px] text-[13.5px] font-medium leading-[1.42] tracking-[-0.02em] text-[#373737]/70 sm:text-[15px]">
            Track important interactions across your website and understand how
            visitors move through your product.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {/* Event message */}
          <div className="flex justify-end">
            <div className="rounded-xl bg-[#087fd1] px-4 py-3 text-[11px] font-medium text-white shadow-sm">
              Track clicks on the pricing button
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold shadow-sm">
              R
            </div>

            <div className="rounded-xl bg-white px-4 py-3 text-[11px] text-black/70 shadow-sm">
              Event{" "}
              <span className="font-semibold text-[#087fd1]">
                pricing_click
              </span>{" "}
              is now being tracked.
            </div>
          </div>

          {/* Metrics */}
          <div className="rounded-2xl bg-white p-4 shadow-[0_10px_30px_rgba(30,100,150,0.08)]">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[12px] font-semibold">
                Website activity
              </span>

              <span className="text-[9px] text-black/40">Last 7 days</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                ["12.4k", "Visitors", "+12%"],
                ["8.7k", "Sessions", "+18%"],
                ["32.8k", "Events", "+24%"],
              ].map(([value, label, change]) => (
                <div key={label}>
                  <p className="text-[16px] font-semibold">{value}</p>
                  <p className="text-[9px] text-black/40">{label}</p>
                  <p className="mt-1 text-[9px] font-semibold text-green-600">
                    ↑ {change}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

/* -------------------------------------------------
   MIDDLE LEFT
------------------------------------------------- */

const TrackEvents = () => {
  return (
    <Card className="bg-[#fff2df]">
      <div className="flex h-full flex-col items-center text-center">
        <h3 className="font-instrument-sans text-[22px] font-medium leading-[1.08] tracking-[-0.04em] text-[#C64E27] sm:text-[28px]">
          Track every
          <br />
          interaction.
        </h3>

        <p className="mt-4 max-w-[420px] text-[13.5px] font-medium leading-[1.42] text-[#373737]/70 sm:text-[15px]">
          From page views to custom events, Route gives you the building blocks
          to understand how people use your website.
        </p>

        <div className="mt-6 flex flex-1 items-center justify-center w-full">
          <Svg1 className="h-auto max-h-[220px] w-full max-w-[380px]" />
        </div>
      </div>
    </Card>
  );
};

const Metric = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg bg-[#f8faf7] p-2">
    <p className="text-[8px] text-black/40">{label}</p>
    <p className="text-[11px] font-semibold text-green-600">{value}</p>
  </div>
);

/* -------------------------------------------------
   MIDDLE RIGHT
------------------------------------------------- */

const Everything = () => {
  return (
    <Card className="bg-[#f2eeff]">
      <div className="flex h-full flex-col items-center text-center">
        <h3 className="font-instrument-sans text-[22px] font-medium leading-[1.08] tracking-[-0.04em] text-[#5e2ac4] sm:text-[28px]">
          Everything you need
          <br />
          in one place.
        </h3>

        <p className="mt-4 max-w-[420px] text-[13.5px] font-medium leading-[1.42] text-[#373737]/70 sm:text-[15px]">
          Connect your website to Route and start collecting the signals that
          matter to your product.
        </p>

        <div className="mt-6 flex flex-1 items-center justify-center w-full">
          <Svg2 className="h-auto max-h-[220px] w-full max-w-[380px]" />
        </div>
      </div>
    </Card>
  );
};

/* -------------------------------------------------
   BOTTOM LEFT
------------------------------------------------- */

const LiveActivity = () => {
  return (
    <Card className="bg-[#eaf8ff]">
      <div className="grid h-full gap-5 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <div>
          <h3 className="font-instrument-sans text-[22px] font-medium leading-[1.08] tracking-[-0.04em] sm:text-[28px]">
            <span className="block text-[#0E7CFF]">Understand your users,</span>
            <span className="block text-[#17152A]">without the noise.</span>
          </h3>

          <p className="mt-4 max-w-[320px] text-[13.5px] font-medium leading-[1.42] text-[#373737]/70 sm:text-[15px]">
            Get a clear view of website activity with lightweight analytics
            built around the events and metrics you actually care about.
          </p>
        </div>

        <img src="/export.png" alt="" />
      </div>
    </Card>
  );
};

/* -------------------------------------------------
   BOTTOM RIGHT
------------------------------------------------- */

const Lightweight = () => {
  return (
    <Card className="bg-[#f0ffd8]">
      <div className="flex h-full flex-col">
        <Svg3 />
      </div>
    </Card>
  );
};

/* -------------------------------------------------
   MAIN ROUTE BENTO
------------------------------------------------- */

const RouteBento = () => {
  return (
    <section className="mx-auto w-full max-w-[1200px] p-4 sm:p-6">
      <div className="grid auto-rows-[minmax(190px,auto)] grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-6">
        {/* Top row */}
        <div className="lg:col-span-3">
          <RouteOverview />
        </div>

        <div className="lg:col-span-3">
          <UserActivity />
        </div>

        {/* Middle row */}
        <div className="lg:col-span-3">
          <TrackEvents />
        </div>

        <div className="lg:col-span-3">
          <Everything />
        </div>

        {/* Bottom row */}
        <div className="lg:col-span-4">
          <LiveActivity />
        </div>

        <div className="lg:col-span-2">
          <Lightweight />
        </div>
      </div>
    </section>
  );
};

export default RouteBento;
