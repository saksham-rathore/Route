import React from "react";
import Svg1 from "./svg1";
import Svg2 from "./svg2";
import Svg3 from "./svg3";
import Svg4 from "./svg4";
import Svg5 from "./svg5";
import Svg6 from "./svg6";

const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`relative isolate h-full overflow-hidden rounded-[20px] border border-black/[0.045] p-4 text-[#121212] sm:rounded-[26px] sm:p-6 ${className}`}
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
    <div className="flex h-full w-full items-center justify-center">
      <Svg4 className="h-auto w-full" />
    </div>
  );
};

/* -------------------------------------------------
   TOP RIGHT
------------------------------------------------- */

const UserActivity = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Svg5 className="h-auto w-full" />
    </div>
  );
};

/* -------------------------------------------------
   MIDDLE LEFT
------------------------------------------------- */

const TrackEvents = () => {
  return (
    <Card className="bg-[#fff2df]">
      <div className="flex h-full flex-col items-center text-center">
        <h3 className="font-instrument-sans text-[20px] font-medium leading-[1.1] tracking-[-0.04em] text-[#C64E27] sm:text-[24px]">
          Track every
          <br />
          interaction.
        </h3>

        <p className="mt-3 max-w-[380px] text-[13px] font-medium leading-[1.42] text-[#373737]/70 sm:text-[14px]">
          From page views to custom events, Route gives you the building blocks
          to understand how people use your website.
        </p>

        <div className="mt-4 flex flex-1 items-center justify-center w-full">
          <Svg1 className="h-auto max-h-[200px] w-full max-w-[340px]" />
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
        <h3 className="font-instrument-sans text-[20px] font-medium leading-[1.1] tracking-[-0.04em] text-[#5e2ac4] sm:text-[24px]">
          Everything you need
          <br />
          in one place.
        </h3>

        <p className="mt-3 max-w-[380px] text-[13px] font-medium leading-[1.42] text-[#373737]/70 sm:text-[14px]">
          Connect your website to Route and start collecting the signals that
          matter to your product.
        </p>

        <div className="mt-4 flex flex-1 items-center justify-center w-full">
          <Svg2 className="h-auto max-h-[200px] w-full max-w-[340px]" />
        </div>
      </div>
    </Card>
  );
};

/* -------------------------------------------------
   MIDDLE MIDDLE
------------------------------------------------- */

export const Insights = () => {
  return (
    <Card className="bg-[#eeffe8]">
      <Svg6 />
    </Card>
  );
};

/* -------------------------------------------------
   BOTTOM LEFT
------------------------------------------------- */

const LiveActivity = () => {
  return (
    <Card className="bg-[#eaf8ff]">
      <div className="grid h-full gap-4 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <div>
          <h3 className="font-instrument-sans text-[20px] font-medium leading-[1.1] tracking-[-0.04em] sm:text-[24px]">
            <span className="block text-[#0E7CFF]">Share, export,</span>
            <span className="block text-[#17152A]">and keep moving.</span>
          </h3>

          <p className="mt-3 max-w-[320px] text-[13px] font-medium leading-[1.42] text-[#373737]/70 sm:text-[14px]">
            Send a live preview, export clean assets, or keep iterating with
            your team.
          </p>
        </div>

        <img
          src="/export.png"
          alt=""
          className="max-h-[190px] w-auto object-contain"
        />
      </div>
    </Card>
  );
};

/* -------------------------------------------------
   BOTTOM RIGHT
------------------------------------------------- */

const Lightweight = () => {
  return (
    <Card className="bg-[#effedb]">
      <div className="flex h-full flex-col justify-start">
        <Svg3 className="h-auto w-full" />
      </div>
    </Card>
  );
};

/* -------------------------------------------------
   MAIN ROUTE BENTO
------------------------------------------------- */

const RouteBento = () => {
  return (
    <section className="mx-auto w-full max-w-[1140px] p-2 sm:p-3">
      <div className="grid auto-rows-[minmax(170px,auto)] grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-12">
        {/* Top row */}
        <div className="lg:col-span-5">
          <RouteOverview />
        </div>

        <div className="lg:col-span-7">
          <UserActivity />
        </div>

        {/* Middle row */}
        <div className="lg:col-span-4">
          <TrackEvents />
        </div>

        <div className="lg:col-span-4">
          <Insights />
        </div>

        <div className="lg:col-span-4">
          <Everything />
        </div>

        {/* Bottom row */}
        <div className="lg:col-span-8">
          <LiveActivity />
        </div>

        <div className="lg:col-span-4">
          <Lightweight />
        </div>
      </div>
    </section>
  );
};

export default RouteBento;
