"use client";

import React from "react";

export const HowItWorks = () => {
  return (
    <section id="how" className="py-20 border-t border-zinc-200/80 bg-zinc-50/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-blue-600 font-bold mb-2">
            Workflow
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-950 tracking-tight">
            How Route Works
          </h2>
          <p className="mt-3 text-zinc-600 text-sm sm:text-base">
            From script tag to full network and user telemetry in under a minute.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 flex flex-col justify-between shadow-2xs hover:border-blue-400/60 hover:shadow-md transition-all">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-blue-600 font-bold">
                Step 01
              </span>
              <h3 className="text-xl font-bold text-zinc-950 mt-2">
                Embed the Beacon
              </h3>
              <p className="text-zinc-600 text-sm mt-3 leading-relaxed">
                Create your project, specify your domain, and add one lightweight
                tag to your layout. No build dependencies, no npm packages,
                and no maintenance.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-100 font-mono text-xs text-zinc-500">
              ⚡ &lt; 1.2 KB async load
            </div>
          </div>

          {/* Step 2 */}
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 flex flex-col justify-between shadow-2xs hover:border-blue-400/60 hover:shadow-md transition-all">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-sky-600 font-bold">
                Step 02
              </span>
              <h3 className="text-xl font-bold text-zinc-950 mt-2">
                Edge Enrichment
              </h3>
              <p className="text-zinc-600 text-sm mt-3 leading-relaxed">
                Beacons are ingested across globally distributed edge nodes.
                Every event is instantly enriched with ISP, ASN, city, region,
                and connection speed.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-100 font-mono text-xs text-zinc-500">
              🌐 &lt; 2ms ingestion latency
            </div>
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 flex flex-col justify-between shadow-2xs hover:border-blue-400/60 hover:shadow-md transition-all">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-indigo-600 font-bold">
                Step 03
              </span>
              <h3 className="text-xl font-bold text-zinc-950 mt-2">
                Real-Time Intelligence
              </h3>
              <p className="text-zinc-600 text-sm mt-3 leading-relaxed">
                Open your dashboard to inspect where API latency originates,
                which telecom carriers hurt real user performance, and
                exactly how users traverse your site.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-100 font-mono text-xs text-zinc-500">
              📊 Zero data lag or batch delay
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
