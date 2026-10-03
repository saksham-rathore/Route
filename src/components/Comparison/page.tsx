"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Globe2,
  Lock,
  Menu,
  MousePointer2,
  Play,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

const features = [
  {
    title: "Understand your audience",
    description:
      "See where your visitors come from, what they do, and what keeps them coming back.",
    icon: Users,
    stat: "24,892",
    label: "Visitors",
  },
  {
    title: "Track every interaction",
    description:
      "Understand how people move through your website with simple, privacy-friendly analytics.",
    icon: MousePointer2,
    stat: "68.4%",
    label: "Engagement",
  },
  {
    title: "Measure conversions",
    description:
      "Turn website activity into measurable goals and understand what drives your business.",
    icon: TrendingUp,
    stat: "12.8%",
    label: "Conversion",
  },
];

const stats = [
  ["12.4K", "Visitors"],
  ["8.7K", "Sessions"],
  ["42.8%", "Bounce rate"],
  ["3m 24s", "Avg. session"],
];

function MiniChart() {
  return (
    <div className="relative h-44 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#111111] p-5">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <svg
        viewBox="0 0 600 180"
        className="relative z-10 h-full w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity=".2" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path
          d="M0 145 C45 135 55 120 90 130 C125 140 145 95 175 110 C210 128 225 80 260 92 C300 105 320 65 350 78 C390 92 400 45 440 61 C480 76 500 35 540 52 C565 61 585 28 600 38 V180 H0Z"
          fill="url(#chartFill)"
        />

        <path
          d="M0 145 C45 135 55 120 90 130 C125 140 145 95 175 110 C210 128 225 80 260 92 C300 105 320 65 350 78 C390 92 400 45 440 61 C480 76 500 35 540 52 C565 61 585 28 600 38"
          fill="none"
          stroke="white"
          strokeWidth="3"
        />
      </svg>

      <div className="absolute left-5 top-5 z-20">
        <p className="text-xs text-white/40">Visitors</p>
        <p className="mt-1 text-xl font-semibold">24,892</p>
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="relative mx-auto mt-16 max-w-6xl">
      <div className="absolute -inset-20 -z-10 rounded-full bg-white/[0.05] blur-3xl" />

      <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#0d0d0d] shadow-2xl">
        <div className="flex h-14 items-center border-b border-white/10 px-5">
          <div className="flex gap-2">
            <span className="h-3 w-3 rounded-full bg-white/20" />
            <span className="h-3 w-3 rounded-full bg-white/20" />
            <span className="h-3 w-3 rounded-full bg-white/20" />
          </div>

          <div className="mx-auto hidden rounded-lg border border-white/10 bg-white/[0.03] px-24 py-2 text-xs text-white/30 sm:block">
            app.route.dev/dashboard
          </div>
        </div>

        <div className="grid min-h-[470px] md:grid-cols-[210px_1fr]">
          <aside className="hidden border-r border-white/10 p-5 md:block">
            <div className="mb-10 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-black">
                <Sparkles size={14} />
              </div>
              <span className="font-semibold">route</span>
            </div>

            <div className="space-y-2 text-sm">
              {["Overview", "Visitors", "Pages", "Events", "Goals"].map(
                (item, i) => (
                  <div
                    key={item}
                    className={`rounded-lg px-3 py-2 ${
                      i === 0
                        ? "bg-white text-black"
                        : "text-white/40 hover:bg-white/5"
                    }`}
                  >
                    {item}
                  </div>
                )
              )}
            </div>
          </aside>

          <main className="p-5 md:p-8">
            <div className="mb-8">
              <p className="text-sm text-white/40">Overview</p>
              <h3 className="mt-1 text-2xl font-semibold">Website analytics</h3>
            </div>

            <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {stats.map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-xl border border-white/10 bg-white/[0.025] p-4"
                >
                  <p className="text-xs text-white/35">{label}</p>
                  <p className="mt-2 text-xl font-semibold">{value}</p>
                </div>
              ))}
            </div>

            <MiniChart />
          </main>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[number];
  index: number;
}) {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group rounded-[28px] border border-black/10 bg-[#f7f7f5] p-7 transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="mb-14 flex h-11 w-11 items-center justify-center rounded-xl bg-black text-white">
        <Icon size={19} />
      </div>

      <div className="mb-8">
        <p className="text-5xl font-semibold tracking-tight">
          {feature.stat}
        </p>
        <p className="mt-2 text-sm text-black/40">{feature.label}</p>
      </div>

      <h3 className="text-xl font-semibold">{feature.title}</h3>

      <p className="mt-3 max-w-sm text-sm leading-6 text-black/50">
        {feature.description}
      </p>

      <div className="mt-8 flex items-center gap-2 text-sm font-medium">
        Explore feature
        <ArrowRight
          size={16}
          className="transition-transform group-hover:translate-x-1"
        />
      </div>
    </motion.div>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50">
      <div className="mx-auto max-w-7xl px-5 pt-5">
        <nav className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/70 px-5 py-3 backdrop-blur-xl">
          <a href="#" className="flex items-center gap-2 font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black">
              <Sparkles size={15} />
            </span>
            route
          </a>

          <div className="hidden items-center gap-7 text-sm text-white/55 md:flex">
            <a href="#features" className="transition hover:text-white">
              Product
            </a>
            <a href="#privacy" className="transition hover:text-white">
              Privacy
            </a>
            <a href="#pricing" className="transition hover:text-white">
              Pricing
            </a>
            <a href="#resources" className="transition hover:text-white">
              Resources
            </a>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <button className="px-4 py-2 text-sm text-white/60">
              Sign in
            </button>
            <button className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/85">
              Get started
            </button>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </nav>

        {open && (
          <div className="mt-2 rounded-2xl border border-white/10 bg-[#111]/95 p-5 backdrop-blur-xl md:hidden">
            <div className="space-y-1">
              {["Product", "Privacy", "Pricing", "Resources"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 text-white/60 hover:bg-white/5 hover:text-white"
                >
                  {item}
                </a>
              ))}
            </div>

            <div className="mt-4 flex gap-2 border-t border-white/10 pt-4">
              <button className="flex-1 rounded-lg border border-white/10 py-3 text-sm">
                Sign in
              </button>
              <button className="flex-1 rounded-lg bg-white py-3 text-sm font-medium text-black">
                Get started
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export function Comparison() {
  return (
    <main className="min-h-screen bg-[#f5f5f2] text-[#111]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-black text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,.12),transparent_35%)]" />

        <Navbar />

        <div className="relative mx-auto max-w-7xl px-5 pb-0 pt-40 text-center sm:pt-48">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-white/60">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              Privacy-first website analytics
              <ArrowRight size={13} />
            </div>

            <h1 className="mx-auto max-w-5xl text-[52px] font-semibold leading-[.95] tracking-[-0.055em] sm:text-7xl md:text-8xl">
              Analytics that
              <br />
              <span className="text-white/35">actually make sense.</span>
            </h1>

            <p className="mx-auto mt-8 max-w-xl text-base leading-7 text-white/45 sm:text-lg">
              Understand your website, your visitors, and your business
              without drowning in complicated analytics.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <button className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-medium text-black transition hover:bg-white/85">
                Start for free
                <ArrowRight size={16} />
              </button>

              <button className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-6 py-3.5 text-sm text-white/70 transition hover:bg-white/5 hover:text-white">
                <Play size={15} />
                See how it works
              </button>
            </div>
          </motion.div>

          <Dashboard />
        </div>
      </section>

      {/* TRUST */}
      <section className="bg-black pb-28 pt-20 text-white">
        <div className="mx-auto max-w-7xl px-5">
          <p className="text-center text-xs uppercase tracking-[.25em] text-white/25">
            Built for modern teams
          </p>

          <div className="mt-10 grid grid-cols-2 border-y border-white/10 md:grid-cols-4">
            {["Developers", "Startups", "Agencies", "Businesses"].map(
              (item) => (
                <div
                  key={item}
                  className="border-white/10 px-5 py-8 text-center text-sm text-white/35 md:border-r last:md:border-r-0"
                >
                  {item}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="bg-[#f5f5f2] py-28">
        <div className="mx-auto max-w-7xl px-5">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-black/40">ONE PLATFORM</p>

            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
              See the complete picture of your website.
            </h2>

            <p className="mt-6 max-w-xl text-base leading-7 text-black/45">
              Everything you need to understand your visitors and make better
              decisions, presented in a simple and intuitive way.
            </p>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-3">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                feature={feature}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ACQUISITION */}
      <section className="overflow-hidden bg-white py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 md:grid-cols-2">
          <div>
            <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-xl bg-black text-white">
              <Globe2 size={20} />
            </div>

            <p className="text-sm font-medium text-black/35">
              UNDERSTAND ACQUISITION
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
              Know where your visitors come from.
            </h2>

            <p className="mt-6 max-w-lg leading-7 text-black/45">
              See your traffic sources, campaigns, countries, devices and
              referrals in one clean overview.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Traffic sources",
                "Campaign tracking",
                "Geographic data",
                "Device information",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-white">
                    <Check size={12} />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-black/10 bg-[#f6f6f3] p-4 shadow-xl sm:p-6">
            <div className="rounded-2xl bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-black/35">Top sources</p>
                  <p className="mt-1 text-2xl font-semibold">18,492</p>
                </div>
                <span className="rounded-full bg-black px-3 py-1 text-xs text-white">
                  +18.4%
                </span>
              </div>

              <div className="mt-8 space-y-5">
                {[
                  ["Google", 82],
                  ["Direct", 64],
                  ["Twitter", 47],
                  ["GitHub", 32],
                  ["Other", 21],
                ].map(([name, width]) => (
                  <div key={name}>
                    <div className="mb-2 flex justify-between text-xs">
                      <span>{name}</span>
                      <span className="text-black/35">{width}%</span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-black/5">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${width}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="h-full rounded-full bg-black"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BEHAVIOR */}
      <section className="bg-[#f5f5f2] py-28">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium text-black/35">
              UNDERSTAND BEHAVIOR
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
              Understand what people actually do.
            </h2>

            <p className="mt-6 leading-7 text-black/45">
              Go beyond page views. Understand the actions and journeys that
              matter.
            </p>
          </div>

          <div className="mt-14">
            <div className="rounded-[30px] border border-black/10 bg-black p-4 text-white shadow-2xl sm:p-7">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/35">Events</p>
                  <p className="mt-1 text-xl font-semibold">Live activity</p>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/45">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                  Live
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                {[
                  ["pageview", "/", "2 sec ago"],
                  ["signup", "/pricing", "8 sec ago"],
                  ["click", "/docs", "14 sec ago"],
                  ["download", "/resources", "21 sec ago"],
                ].map(([event, page, time]) => (
                  <div
                    key={`${event}-${page}`}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
                  >
                    <div className="mb-8 flex items-center justify-between">
                      <span className="rounded-md bg-white px-2 py-1 text-[10px] font-medium text-black">
                        {event}
                      </span>
                      <span className="text-[10px] text-white/25">
                        {time}
                      </span>
                    </div>

                    <p className="text-sm font-medium">{page}</p>
                    <p className="mt-1 text-xs text-white/30">
                      Visitor interaction
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRIVACY */}
      <section id="privacy" className="bg-black py-28 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 md:grid-cols-2">
          <div>
            <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-black">
              <Lock size={20} />
            </div>

            <p className="text-sm font-medium text-white/30">
              PRIVACY FIRST
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
              Analytics without compromising privacy.
            </h2>

            <p className="mt-6 max-w-lg leading-7 text-white/40">
              Collect the insights you need without building a detailed
              profile of every person visiting your website.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["No invasive tracking", ShieldCheck],
              ["No unnecessary cookies", Lock],
              ["Open source", Sparkles],
              ["Simple analytics", Zap],
            ].map(([title, Icon]) => {
              const I = Icon as typeof ShieldCheck;

              return (
                <div
                  key={title as string}
                  className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"
                >
                  <I size={20} />
                  <p className="mt-10 text-sm font-medium">
                    {title as string}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-white/30">
                    Designed to give you useful data without unnecessary
                    tracking.
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="pricing" className="bg-white py-32">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white">
            <Sparkles />
          </div>

          <h2 className="mt-8 text-5xl font-semibold tracking-[-0.05em] sm:text-7xl">
            Start understanding
            <br />
            your website today.
          </h2>

          <p className="mx-auto mt-6 max-w-lg leading-7 text-black/40">
            Simple analytics. Powerful insights. Privacy-first by design.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <button className="flex items-center justify-center gap-2 rounded-xl bg-black px-7 py-4 text-sm font-medium text-white transition hover:bg-black/80">
              Get started for free
              <ArrowRight size={16} />
            </button>

            <button className="rounded-xl border border-black/10 px-7 py-4 text-sm font-medium transition hover:bg-black/5">
              Explore documentation
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="resources" className="bg-black text-white">
        <div className="mx-auto max-w-7xl px-5 py-16">
          <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-2 font-semibold">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black">
                  <Sparkles size={15} />
                </span>
                route
              </div>

              <p className="mt-5 max-w-sm text-sm leading-6 text-white/35">
                Privacy-first analytics for people who want to understand
                their websites without unnecessary complexity.
              </p>
            </div>

            {[
              {
                title: "Product",
                links: ["Analytics", "Events", "Goals", "Pricing"],
              },
              {
                title: "Resources",
                links: ["Documentation", "Blog", "GitHub", "Community"],
              },
              {
                title: "Company",
                links: ["About", "Contact", "Privacy", "Terms"],
              },
            ].map((column) => (
              <div key={column.title}>
                <p className="text-sm font-medium">{column.title}</p>

                <div className="mt-5 space-y-3">
                  {column.links.map((link) => (
                    <a
                      href="#"
                      key={link}
                      className="block text-sm text-white/35 transition hover:text-white"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-col justify-between gap-4 border-t border-white/10 pt-7 text-xs text-white/25 sm:flex-row">
            <p>© 2026 Route. All rights reserved.</p>
            <p>Built for the web.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default Comparison;