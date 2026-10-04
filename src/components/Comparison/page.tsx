"use client";

import {
  ArrowRight,
  BarChart3,
  ChevronDown,
  Globe2,
  MousePointer2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import Navbar from "../Navbar";
import RouteBento from "../RouteBento";
import Svg1 from "../svg1";

const trafficSources = [
  { name: "Google", value: 48, visitors: "12,842" },
  { name: "Direct", value: 27, visitors: "7,231" },
  { name: "Twitter / X", value: 14, visitors: "3,749" },
  { name: "LinkedIn", value: 8, visitors: "2,143" },
  { name: "Other", value: 3, visitors: "804" },
];

const events = [
  ["Page view", "/pricing", "2s ago"],
  ["Button click", "Start free", "8s ago"],
  ["Page view", "/features", "14s ago"],
  ["Signup", "New account", "21s ago"],
];

function Logo() {
  return (
    <a
      className="font-lastik text-[22px] leading-none tracking-[-0.02em] snip-4f4f-0"
      style={{
        color: "rgb(8, 8, 8)",
        outlineOffset: "2px",
        background:
          "rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box",
        fontSize: "22px",
        fontWeight: 400,
        fontFamily:
          '"Lastik Regular", Caslon, "EB Garamond", "Times New Roman", Times, serif',
        lineHeight: "22px",
        letterSpacing: "-0.44px",
        textAlign: "start",
        border: "0px solid rgb(8, 8, 8)",
        borderTop: "0px solid rgb(8, 8, 8)",
        borderRight: "0px solid rgb(8, 8, 8)",
        borderBottom: "0px solid rgb(8, 8, 8)",
        borderLeft: "0px solid rgb(8, 8, 8)",
        borderColor: "rgb(8, 8, 8)",
        opacity: 1,
        zIndex: "auto",
      }}
      href=""
    >
      Route
    </a>
  );
}

function BrowserWindow() {
  return (
    <div className="overflow-hidden rounded-[18px] border border-[#d5d0c5] bg-[#fbfaf7] shadow-[0_30px_80px_rgba(45,43,37,0.12)]">
      {/* Browser bar */}
      <div className="flex h-11 items-center gap-2 border-b border-[#ded9cf] px-4">
        <div className="h-2.5 w-2.5 rounded-full bg-[#d2cec4]" />
        <div className="h-2.5 w-2.5 rounded-full bg-[#d2cec4]" />
        <div className="h-2.5 w-2.5 rounded-full bg-[#d2cec4]" />

        <div className="mx-auto flex h-6 w-[42%] items-center justify-center rounded-md bg-[#f0ede6] text-[9px] text-[#969188]">
          app.route.dev/overview
        </div>
      </div>

      <div className="flex min-h-[520px]">
        {/* Sidebar */}
        <aside className="hidden w-[175px] border-r border-[#ded9cf] p-4 md:block">
          <a
            className="font-lastik text-[22px] leading-none tracking-[-0.02em] snip-4f4f-0"
            style={{
              color: "rgb(8, 8, 8)",
              outlineOffset: "2px",
              background:
                "rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box",
              fontSize: "22px",
              fontWeight: 400,
              fontFamily:
                '"Lastik Regular", Caslon, "EB Garamond", "Times New Roman", Times, serif',
              lineHeight: "22px",
              letterSpacing: "-0.44px",
              textAlign: "start",
              border: "0px solid rgb(8, 8, 8)",
              borderTop: "0px solid rgb(8, 8, 8)",
              borderRight: "0px solid rgb(8, 8, 8)",
              borderBottom: "0px solid rgb(8, 8, 8)",
              borderLeft: "0px solid rgb(8, 8, 8)",
              borderColor: "rgb(8, 8, 8)",
              opacity: 1,
              zIndex: "auto",
            }}
            href=""
          >
            Route
          </a>

          <div className="space-y-1 text-[10px]">
            {[
              "Overview",
              "Realtime",
              "Acquisition",
              "Behavior",
              "Conversion",
            ].map((item, i) => (
              <div
                key={item}
                className={`rounded-md px-3 py-2 ${
                  i === 0
                    ? "bg-[#ebe7de] font-semibold text-[#24231f]"
                    : "text-[#8c887f]"
                }`}
              >
                {item}
              </div>
            ))}
          </div>

          <div className="mt-10 border-t border-[#ded9cf] pt-4">
            <p className="mb-3 px-3 text-[8px] uppercase tracking-[0.18em] text-[#aaa49a]">
              Workspace
            </p>

            <div className="space-y-1 text-[10px] text-[#8c887f]">
              <div className="px-3 py-2">Settings</div>
              <div className="px-3 py-2">Tracking</div>
            </div>
          </div>
        </aside>

        {/* Dashboard */}
        <div className="min-w-0 flex-1 p-5 md:p-7">
          <div className="mb-7 flex items-end justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-[0.18em] text-[#99948a]">
                Website overview
              </p>
              <h3 className="mt-1 text-[22px] font-semibold tracking-[-0.04em]">
                Good morning.
              </h3>
            </div>

            <div className="rounded-md border border-[#dcd7cd] px-3 py-1.5 text-[9px] text-[#77736c]">
              Last 30 days
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              ["Visitors", "26,769", "+18.4%"],
              ["Sessions", "34,218", "+12.7%"],
              ["Bounce rate", "31.2%", "-4.2%"],
              ["Conversions", "2,841", "+24.8%"],
            ].map(([label, value, change]) => (
              <div
                key={label}
                className="rounded-xl border border-[#ded9cf] bg-white/50 p-4"
              >
                <p className="text-[9px] text-[#99948a]">{label}</p>
                <p className="mt-2 text-[18px] font-semibold tracking-[-0.04em]">
                  {value}
                </p>
                <p className="mt-1 text-[8px] text-[#77736c]">{change}</p>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="mt-4 rounded-xl border border-[#ded9cf] p-4">
            <div className="mb-5 flex justify-between">
              <div>
                <p className="text-[9px] text-[#99948a]">Visitors</p>
                <p className="mt-1 text-[16px] font-semibold">26,769</p>
              </div>

              <div className="text-[9px] text-[#99948a]">May 01 — May 30</div>
            </div>

            <div className="relative h-[175px]">
              {[0, 1, 2, 3, 4].map((line) => (
                <div
                  key={line}
                  className="absolute left-0 right-0 border-t border-[#e9e5dc]"
                  style={{ top: `${line * 25}%` }}
                />
              ))}

              <svg
                viewBox="0 0 700 170"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full"
              >
                <path
                  d="M0 135 C45 128 60 105 105 112 S170 128 210 88 S275 94 315 73 S380 82 420 55 S485 74 525 48 S590 65 630 32 S670 38 700 20"
                  fill="none"
                  stroke="#24231f"
                  strokeWidth="2.5"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

<div className="relative isolate h-full min-h-[190px] overflow-hidden rounded-[24px] border border-black/[0.045] bg-[#f0f9ff] p-5 text-[#121212] sm:min-h-[220px] sm:rounded-[32px] sm:p-8">
  <div className="relative z-10 h-full">
    <picture>
      <img
        className="pointer-events-none absolute hidden h-64 w-64 object-contain object-left-top lg:-top-1 lg:left-2 lg:block"
        alt=""
        src="https://make.design/graphics/second_card/top.png"
      />
    </picture>
    <div className="relative grid h-full gap-5 py-2 sm:gap-6 sm:py-0 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
      <div>
        <div className="[&_h3]:leading-[1.18]">
          <h3 className="font-instrument text-[22px] font-medium leading-[1.08] tracking-[-0.04em] text-[#151515] sm:text-[28px] sm:leading-[1.05] sm:tracking-[-0.045em]">
            <span className="block text-sky-600">Edit your design</span>
            <span className="block text-[#17152A]">through chat.</span>
          </h3>
        </div>
        <p className="mt-3 max-w-[360px] text-[13.5px] font-medium leading-[1.42] tracking-[-0.02em] text-[#373737]/70 sm:text-[15px] sm:leading-[1.45] sm:tracking-[-0.025em]">
          Ask to write a headline, change a layout, update a button, or turn the
          same idea into marketing assets.
        </p>
      </div>

      <div className="flex w-full max-w-[560px] min-w-0 flex-col gap-3 justify-self-center lg:max-w-none lg:justify-self-auto">
        <div className="flex w-full min-w-0 items-start justify-end gap-1.5 sm:gap-2">
          <span className="shrink-0">
            <svg
              viewBox="0 0 36 36"
              className="h-8 w-8 sm:h-9 sm:w-9"
              aria-hidden="true"
            >
              <defs>
                <clipPath id="user-avatar-clip">
                  <circle cx="18" cy="18" r="17" />
                </clipPath>
              </defs>
              <circle cx="18" cy="18" r="17" fill="#FDE8D3" />
              <g clipPath="url(#user-avatar-clip)">
                <circle
                  cx="18"
                  cy="14.4"
                  r="6.6"
                  fill="#FBD3B3"
                  stroke="#111111"
                  strokeWidth="1.5"
                />
                <path
                  d="M11.4 12.4 Q11.4 7 18 7 Q24.6 7 24.6 12.4 Q22.4 10.2 18 10.2 Q13.6 10.2 11.4 12.4 Z"
                  fill="#3A2A1F"
                />
                <circle cx="15.9" cy="14.3" r="0.95" fill="#111111" />
                <circle cx="20.1" cy="14.3" r="0.95" fill="#111111" />
                <path
                  d="M15.9 16.7 Q18 18.1 20.1 16.7"
                  stroke="#111111"
                  strokeWidth="1.1"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M1.5 36 C1.5 27.8 9 20 18 20 C27 20 34.5 27.8 34.5 36 Z"
                  fill="#A8C8F0"
                />
                <path
                  d="M1.5 36 C1.5 27.8 9 20 18 20 C27 20 34.5 27.8 34.5 36"
                  fill="none"
                  stroke="#111111"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </g>
              <circle
                cx="18"
                cy="18"
                r="17"
                fill="none"
                stroke="#111111"
                strokeWidth="2"
              />
            </svg>
          </span>
        </div>

        <div className="flex w-full min-w-0 items-start gap-1.5 sm:gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white sm:h-9 sm:w-9">
            <img
              className="h-6 w-6 object-contain sm:h-7 sm:w-7"
              alt=""
              src="https://make.design/icon.png"
            />
          </div>
        </div>

        <div className="flex min-w-0 items-end gap-2 sm:gap-3">
          <picture className="shrink-0">
            <img
              className="h-16 w-16 object-contain sm:h-24 sm:w-24"
              alt=""
              src="https://make.design/graphics/second_card/character.png"
            />
          </picture>
          <picture className="min-w-0 flex-1">
            <img
              className="w-full rounded-xl object-contain"
              alt=""
              src="https://make.design/graphics/second_card/dashboard.png"
            />
          </picture>
        </div>
      </div>
    </div>
  </div>
</div>;

function EventPanel() {
  return (
    <div className="rounded-[20px] border border-[#d8d3c8] bg-[#fbfaf7] p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[11px] text-[#8b877e]">Live activity</p>
          <p className="mt-1 text-[20px] font-semibold tracking-[-0.04em]">
            What&apos;s happening now
          </p>
        </div>

        <div className="flex items-center gap-2 text-[9px] text-[#77736c]">
          <span className="h-2 w-2 rounded-full bg-[#24231f]" />
          Live
        </div>
      </div>

      <div className="divide-y divide-[#e5e1d8]">
        {events.map(([event, detail, time]) => (
          <div
            key={`${event}-${detail}`}
            className="flex items-center justify-between py-4"
          >
            <div>
              <p className="text-[11px] font-semibold">{event}</p>
              <p className="mt-1 text-[10px] text-[#8b877e]">{detail}</p>
            </div>

            <span className="text-[9px] text-[#aaa49a]">{time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FunnelPanel() {
  return (
    <div className="rounded-[20px] border border-[#d8d3c8] bg-[#fbfaf7] p-6">
      <div className="mb-7">
        <p className="text-[11px] text-[#8b877e]">Signup funnel</p>
        <p className="mt-1 text-[20px] font-semibold tracking-[-0.04em]">
          From visit to customer
        </p>
      </div>

      <div className="space-y-3">
        {[
          ["Visitors", "26,769", "100%"],
          ["Viewed pricing", "8,421", "31.5%"],
          ["Started signup", "4,281", "16.0%"],
          ["Created account", "2,841", "10.6%"],
        ].map(([name, value, percentage], index) => (
          <div key={name}>
            <div className="mb-2 flex justify-between text-[10px]">
              <span>{name}</span>
              <span className="text-[#8b877e]">
                {value} · {percentage}
              </span>
            </div>

            <div className="h-9 overflow-hidden rounded-lg bg-[#e8e4db]">
              <div
                className="flex h-full items-center bg-[#24231f] px-3 text-[9px] text-white"
                style={{ width: `${100 - index * 18}%` }}
              >
                {percentage}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RevenuePanel() {
  return (
    <div className="rounded-[20px] border border-[#d8d3c8] bg-[#fbfaf7] p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] text-[#8b877e]">Revenue</p>
          <p className="mt-1 text-[28px] font-semibold tracking-[-0.05em]">
            $84,420
          </p>
          <p className="mt-1 text-[10px] text-[#77736c]">
            +18.8% compared to last month
          </p>
        </div>

        <TrendingUp size={19} strokeWidth={1.5} />
      </div>

      <div className="mt-8 h-36">
        <svg
          viewBox="0 0 600 140"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <path
            d="M0 115 C60 108 70 95 120 98 S180 110 225 78 S280 88 325 62 S390 75 425 55 S490 68 530 30 S570 36 600 18"
            fill="none"
            stroke="#24231f"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  );
}

function Feature({
  number,
  eyebrow,
  title,
  description,
  children,
}: {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-[#d8d3c8] py-24">
      <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <div className="mb-8 flex items-center gap-4">
            <span className="text-[12px] font-medium text-[#8c887f]">
              {number}
            </span>

            <span className="h-px w-10 bg-[#cfc9be]" />

            <span className="text-[11px] uppercase tracking-[0.16em] text-[#8c887f]">
              {eyebrow}
            </span>
          </div>

          <h2 className="font-lastik text-[42px] leading-[1.05] tracking-[-0.035em] md:text-[54px]">
            {title}
          </h2>

          <p className="mt-6 max-w-[470px] text-[16px] font-medium leading-7 text-[#77736c]">
            {description}
          </p>

          <a
            href="#"
            className="mt-8 inline-flex items-center gap-2 text-[13px] font-semibold"
          >
            Explore {eyebrow.toLowerCase()}
            <ArrowRight size={15} />
          </a>
        </div>

        <div>{children}</div>
      </div>
    </section>
  );
}

function Nav() {
  return (
    <header>
      <Navbar />
    </header>
  );
}

export default function Home() {
  return (
    <main className="overflow-hidden bg-[#f7f4ed] text-[#24231f]">
      <Nav />

      {/* HERO */}
      <section className="mx-auto max-w-[1180px] px-5 pb-24 pt-24 text-center md:pb-32 md:pt-32 lg:px-8">
        <div className="mx-auto font-instrument-sans relative flex flex w-fit items-center gap-2 rounded-full border border-[#d8d3c8] bg-[#fbfaf7] px-4 py-2 text-[11px] font-medium text-[#77736c]">
          <Sparkles size={13} />
          <span
            className="font-instrument-sans snip-c36c-0"
            style={{
              color: "rgb(80, 80, 80)",
              outlineOffset: "2px",
              background:
                "rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box",
              fontSize: "13px",
              fontWeight: 400,
              fontFamily:
                '"Instrument Sans", "Instrument Sans Fallback", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              lineHeight: "19.5px",
              letterSpacing: "normal",
              textAlign: "center",
              border: "0px solid rgb(80, 80, 80)",
              borderTop: "0px solid rgb(80, 80, 80)",
              borderRight: "0px solid rgb(80, 80, 80)",
              borderBottom: "0px solid rgb(80, 80, 80)",
              borderLeft: "0px solid rgb(80, 80, 80)",
              borderColor: "rgb(80, 80, 80)",
              opacity: 1,
              zIndex: "auto",
            }}
          >
            Privacy-first website analytics
          </span>
        </div>

        <h1
          className="font-lastik mx-auto mt-8 max-w-[980px] text-center text-[#24231f]"
          style={{
            fontSize: "clamp(44px, 8vw, 70px)",
            lineHeight: 1.05,
            letterSpacing: "-0.07em",
          }}
        >
          Understand what your website is <br />
          <span className="text-[#918d84]">really doing.</span>
        </h1>

        <p className="mx-auto mb-3 mt-8 max-w-[720px] px-1 text-center text-[16px] font-medium leading-[1.42] tracking-[-0.02em] text-[#77736c] sm:mb-6 sm:px-5 sm:text-[20px]">
          Route turns traffic, behavior, conversion, and revenue into one clear
          picture — without invasive tracking or complicated dashboards.
        </p>

        <RouteBento />

        <div className="mt-20 text-left">
          <BrowserWindow />
        </div>
      </section>

      {/* INTRO */}
      <section id="product" className="border-y border-[#d8d3c8] bg-[#fbfaf7]">
        <div className="mx-auto max-w-[1180px] px-5 py-28 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2 md:items-end">
            <h2 className="font-lastik text-[46px] leading-[1.03] tracking-[-0.04em] md:text-[64px]">
              Less dashboard.
              <br />
              More understanding.
            </h2>

            <div>
              <p className="max-w-[480px] text-[17px] font-medium leading-7 text-[#77736c]">
                Analytics should help you make decisions, not make you stare at
                charts. Route gives you the context behind every number.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-[1180px] px-5 lg:px-8">
        {/* <Feature
          number="01"
          eyebrow="Acquisition"
          title="Know exactly where your visitors come from."
          description="See which channels, campaigns, search terms, and referrers are bringing people to your website."
        >
          <SourcePanel />
        </Feature> */}

        <Feature
          number="02"
          eyebrow="Behavior"
          title="See what people actually do after they arrive."
          description="Understand pages, clicks, sessions, and events without building a complicated analytics setup."
        >
          <EventPanel />
        </Feature>

        <Feature
          number="03"
          eyebrow="Conversion"
          title="Find the point where interest becomes action."
          description="Follow the journey from the first page view to signup and discover where visitors drop off."
        >
          <FunnelPanel />
        </Feature>

        <Feature
          number="04"
          eyebrow="Revenue"
          title="Connect attention to the value it creates."
          description="Bring revenue into the same picture so you can understand which traffic and behaviors actually matter."
        >
          <RevenuePanel />
        </Feature>
      </section>

      {/* PRIVACY */}
      <section id="privacy" className="bg-[#24231f] text-[#f7f4ed]">
        <div className="mx-auto max-w-[1180px] px-5 py-28 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#aaa59b]">
                Privacy by default
              </p>

              <h2 className="font-lastik mt-7 max-w-[720px] text-[48px] leading-[1.02] tracking-[-0.04em] md:text-[70px]">
                Useful data shouldn&apos;t require knowing everything about a
                person.
              </h2>
            </div>

            <div className="grid content-end">
              {[
                [
                  ShieldCheck,
                  "No invasive tracking",
                  "Collect the information you need without building profiles around people.",
                ],
                [
                  Users,
                  "Anonymized visitors",
                  "Understand behavior without turning analytics into surveillance.",
                ],
                [
                  Globe2,
                  "Open source",
                  "Keep your analytics transparent, inspectable, and under your control.",
                ],
                [
                  MousePointer2,
                  "Own your data",
                  "Your website data should belong to your product, not an ad network.",
                ],
              ].map(([Icon, title, description]) => {
                const IconComponent = Icon as typeof ShieldCheck;

                return (
                  <div
                    key={title as string}
                    className="border-t border-[#4b4943] py-6"
                  >
                    <div className="flex gap-4">
                      <IconComponent
                        size={18}
                        strokeWidth={1.5}
                        className="mt-1 shrink-0 text-[#c4bfb5]"
                      />

                      <div>
                        <h3 className="text-[14px] font-semibold">
                          {title as string}
                        </h3>

                        <p className="mt-2 text-[13px] leading-6 text-[#aaa59b]">
                          {description as string}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* OPEN SOURCE */}
      <section className="bg-[#fbfaf7]">
        <div className="mx-auto max-w-[1180px] px-5 py-28 lg:px-8">
          <div className="rounded-[28px] border border-[#d8d3c8] bg-[#f1eee6] p-8 md:p-14">
            <div className="grid gap-12 md:grid-cols-2 md:items-end">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#8c887f]">
                  Built in the open
                </p>

                <h2 className="font-lastik mt-6 text-[45px] leading-[1.03] tracking-[-0.04em] md:text-[60px]">
                  Your analytics shouldn&apos;t be a black box.
                </h2>
              </div>

              <div>
                <p className="text-[16px] font-medium leading-7 text-[#77736c]">
                  Route is designed around transparency. Understand how your
                  analytics work, inspect the system, and keep control of your
                  data.
                </p>

                <a
                  href="#"
                  className="mt-7 inline-flex items-center gap-2 text-[13px] font-semibold"
                >
                  Explore the project
                  <ArrowRight size={15} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="border-t border-[#d8d3c8]">
        <div className="mx-auto max-w-[1180px] px-5 py-28 lg:px-8">
          <div className="mb-16 max-w-[600px]">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#8c887f]">
              Pricing
            </p>

            <h2 className="font-lastik mt-5 text-[48px] leading-[1.02] tracking-[-0.04em] md:text-[64px]">
              Simple enough to understand.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                name: "Starter",
                price: "$0",
                description:
                  "For small websites getting started with analytics.",
                featured: false,
              },
              {
                name: "Growth",
                price: "$19",
                description:
                  "For teams that want deeper insight into their growth.",
                featured: true,
              },
              {
                name: "Scale",
                price: "$49",
                description: "For businesses connecting analytics to revenue.",
                featured: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-[22px] border p-7 ${
                  plan.featured
                    ? "border-[#24231f] bg-[#24231f] text-[#f7f4ed]"
                    : "border-[#d8d3c8] bg-[#fbfaf7]"
                }`}
              >
                <p
                  className={`text-[12px] font-semibold ${
                    plan.featured ? "text-[#aaa59b]" : "text-[#77736c]"
                  }`}
                >
                  {plan.name}
                </p>

                <div className="mt-7 flex items-end gap-1">
                  <span className="text-[42px] font-semibold tracking-[-0.06em]">
                    {plan.price}
                  </span>

                  <span
                    className={`mb-2 text-[11px] ${
                      plan.featured ? "text-[#aaa59b]" : "text-[#8c887f]"
                    }`}
                  >
                    / month
                  </span>
                </div>

                <p
                  className={`mt-4 min-h-[52px] text-[13px] leading-6 ${
                    plan.featured ? "text-[#aaa59b]" : "text-[#77736c]"
                  }`}
                >
                  {plan.description}
                </p>

                <a
                  href="#"
                  className={`mt-8 flex items-center justify-center rounded-full py-3 text-[12px] font-semibold ${
                    plan.featured
                      ? "bg-[#f7f4ed] text-[#24231f]"
                      : "border border-[#cbc5ba]"
                  }`}
                >
                  Get started
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#24231f] px-5 py-32 text-center text-[#f7f4ed]">
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#aaa59b]">
          Start with Route
        </p>

        <h2 className="font-lastik mx-auto mt-7 max-w-[850px] text-[52px] leading-[0.98] tracking-[-0.045em] md:text-[80px]">
          Make your analytics feel human again.
        </h2>

        <p className="mx-auto mt-7 max-w-[520px] text-[16px] leading-7 text-[#aaa59b]">
          Know where people come from, what they do, and what actually moves
          your business.
        </p>

        <a
          href="#"
          className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#f7f4ed] px-7 py-3.5 text-[13px] font-semibold text-[#24231f]"
        >
          Start for free
          <ArrowRight size={15} />
        </a>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#24231f] px-5 pb-10 text-[#f7f4ed]">
        <div className="mx-auto max-w-[1180px] border-t border-[#4b4943] pt-8 lg:px-3">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <Logo />

            <div className="flex flex-wrap gap-6 text-[12px] text-[#aaa59b]">
              <a href="#">Documentation</a>
              <a href="#">GitHub</a>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
            </div>

            <p className="text-[11px] text-[#77736c]">© 2026 Route</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
