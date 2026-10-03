"use client";

import React from "react";

export const Testimonials = () => {
  const testimonials = [
    {
      name: "Shivaay Lamba",
      handle: "@howdevelop",
      role: "DevRel & Open Source Contributor",
      avatarBg: "bg-blue-600",
      initials: "SL",
      content:
        "Route packs analytics and observability into one lightweight script, with Web Vitals, endpoints, and journeys without juggling three tools. The free tier is genuinely usable, and paid plans stay affordable when you scale.",
    },
    {
      name: "Manav Sutar",
      handle: "@manavsutar",
      role: "Founder & CEO, Single Core Labs",
      avatarBg: "bg-indigo-600",
      initials: "MS",
      content:
        "Route is hands down the cleanest analytics + observability combo I've come across. We replaced both Google Analytics and an expensive RUM tool with a single 1KB script.",
    },
    {
      name: "Shivam Katare",
      handle: "@Shivamkatare_27",
      role: "Full Stack Engineer",
      avatarBg: "bg-sky-600",
      initials: "SK",
      content:
        "Tried Route on my high-traffic app and honestly, it's solid. Gave me way more useful data than I expected from just one script, especially endpoints, Web Vitals, and user-journey telemetry. Feels like an actual observability platform.",
    },
    {
      name: "Ashutosh Singh",
      handle: "@ashutosh_ui",
      role: "Founder, Vengeance UI",
      avatarBg: "bg-emerald-600",
      initials: "AS",
      content:
        "Route feels really intuitive for understanding how users actually interact with a product. The network observability makes it effortless to spot slow carrier routes before customers complain.",
    },
    {
      name: "Debajyati Dey",
      handle: "@ddebajyati",
      role: "Software Engineer",
      avatarBg: "bg-amber-600",
      initials: "DD",
      content:
        "Very useful product and gives very detailed analytics! The ISP latency breakdown saved us hours of debugging a mysterious customer drop-off in APAC.",
    },
    {
      name: "Devarshi Shimpi",
      handle: "@devarishi",
      role: "Software Engineer, Ex-CTO",
      avatarBg: "bg-rose-600",
      initials: "DS",
      content:
        "I build performance-sensitive tooling, so real-user observability actually matters to me. Route gives you Web Vitals, API latency, and network context without stitching three tools together. One script tag and you're done.",
    },
  ];

  return (
    <section id="testimonials" className="py-24 border-t border-zinc-200/80 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-blue-600 font-bold mb-2">
          Testimonials
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-zinc-950 tracking-tight">
          What engineering teams say about Route.
        </h2>
        <p className="mt-3 text-zinc-600 text-sm sm:text-base max-w-xl mx-auto">
          Real feedback from founders, engineers, and product leaders who rely
          on Route for unified web analytics and network observability.
        </p>
      </div>

      {/* Testimonial Marquee Row 1 */}
      <div className="relative w-full overflow-hidden mask-fade-x py-3">
        <div className="animate-marquee flex gap-6">
          {[...testimonials, ...testimonials].map((item, index) => (
            <div
              key={index}
              className="w-[360px] sm:w-[420px] shrink-0 p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-blue-400 hover:shadow-[0_10px_30px_rgba(37,99,235,0.08)] transition-all flex flex-col justify-between"
            >
              <p className="text-sm text-zinc-700 leading-relaxed font-normal">
                "{item.content}"
              </p>

              <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full ${item.avatarBg} text-white font-bold flex items-center justify-center text-xs shadow-xs`}
                  >
                    {item.initials}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-zinc-950">
                      {item.name}
                    </div>
                    <div className="text-xs text-zinc-500">{item.role}</div>
                  </div>
                </div>

                <span className="font-mono text-[11px] text-blue-600 font-semibold">
                  {item.handle}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonial Marquee Row 2 (Reverse) */}
      <div className="relative w-full overflow-hidden mask-fade-x py-3 mt-4">
        <div className="animate-marquee-reverse flex gap-6">
          {[...testimonials.slice().reverse(), ...testimonials.slice().reverse()].map(
            (item, index) => (
              <div
                key={index}
                className="w-[360px] sm:w-[420px] shrink-0 p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-blue-400 hover:shadow-[0_10px_30px_rgba(37,99,235,0.08)] transition-all flex flex-col justify-between"
              >
                <p className="text-sm text-zinc-700 leading-relaxed font-normal">
                  "{item.content}"
                </p>

                <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full ${item.avatarBg} text-white font-bold flex items-center justify-center text-xs shadow-xs`}
                    >
                      {item.initials}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-semibold text-zinc-950">
                        {item.name}
                      </div>
                      <div className="text-xs text-zinc-500">{item.role}</div>
                    </div>
                  </div>

                  <span className="font-mono text-[11px] text-blue-600 font-semibold">
                    {item.handle}
                  </span>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
