"use client";

import React, { useState } from "react";

export const FAQ = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "Does Route require a cookie consent banner?",
      a: "No. Route is 100% cookie-free and does not store persistent identifiers or device fingerprints. It is fully compliant with GDPR, CCPA, and PECR by design, so you can remove frustrating cookie consent banners completely.",
    },
    {
      q: "Will Route slow down my site?",
      a: "Not at all. The Route beacon is ultra-lightweight (<1.2KB) and executes asynchronously with 'defer'. It runs outside the browser's critical rendering path and reports beacons using navigator.sendBeacon when idle.",
    },
    {
      q: "How does the ISP diagnostics feature work?",
      a: "When a beacon reaches our global edge nodes, we resolve the client's Autonomous System Number (ASN) and network routing path. This lets us measure real latency by internet provider (e.g. Jio, Comcast, Deutsche Telekom) so you can separate cloud infra latency from carrier throttling.",
    },
    {
      q: "Can I use Route with Next.js, React, or Astro?",
      a: "Yes! Route works with any framework. You can paste the script tag into your root layout or import it via standard Next.js Script components.",
    },
  ];

  return (
    <section className="py-20 border-t border-zinc-200/80 bg-zinc-50/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-blue-600 font-bold mb-2">
            FAQ
          </p>
          <h2 className="text-3xl font-bold text-zinc-950 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-xl border border-zinc-200/90 bg-white overflow-hidden shadow-2xs"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full p-5 text-left flex items-center justify-between text-sm sm:text-base font-semibold text-zinc-900 hover:text-blue-600 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <span className="text-zinc-400 ml-4 font-mono text-lg font-bold">
                  {openFaq === index ? "−" : "+"}
                </span>
              </button>
              {openFaq === index && (
                <div className="px-5 pb-5 text-sm text-zinc-600 leading-relaxed border-t border-zinc-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
