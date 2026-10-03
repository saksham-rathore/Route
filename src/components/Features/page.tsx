"use client";

import React, { useState } from "react";

export const Features = () => {
  const [activeTab, setActiveTab] = useState<
    "analytics" | "observability" | "isp" | "vitals" | "install"
  >("analytics");
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const snippetCode = `<script
  defer
  src="https://cdn.route.dev/script.js"
  data-pid="proj_route_live"
  data-domain="yourdomain.com"
></script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(snippetCode);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2200);
  };

  return (
    <section id="features" className="py-20 border-t border-zinc-200/80 bg-zinc-50/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-blue-600 font-bold mb-2">
            Platform
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-950 tracking-tight">
            Everything you need to understand{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-600">
              real user experience
            </span>
            .
          </h2>
          <p className="mt-4 text-zinc-600 text-sm sm:text-base">
            Five pillars of visibility, from user journeys and API telemetry
            to instant one-line installation.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 rounded-xl bg-zinc-200/80 border border-zinc-300/80 overflow-x-auto max-w-full shadow-2xs">
            {[
              { id: "analytics", label: "User Analytics" },
              { id: "observability", label: "Network Observability" },
              { id: "isp", label: "ISP Diagnostics" },
              { id: "vitals", label: "Web Vitals" },
              { id: "install", label: "Installation" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-white text-zinc-950 font-semibold shadow-xs"
                    : "text-zinc-600 hover:text-zinc-950 hover:bg-white/40"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          {activeTab === "analytics" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-blue-600 font-bold">
                  Pillar 01
                </span>
                <h3 className="text-2xl font-bold text-zinc-950 mt-1">
                  Privacy-First User Analytics
                </h3>
                <p className="text-zinc-600 text-sm mt-3 leading-relaxed">
                  Understand session retention, referral funnels, and user
                  behavior without invasive third-party cookies or intrusive
                  GDPR cookie banners. Every metric is anonymized and stored
                  under high-performance encryption.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-zinc-700">
                  <li className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Multi-step journey funnels &amp; drop-off detection
                  </li>
                  <li className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Clean referrer attribution &amp; campaign tracking
                  </li>
                  <li className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Zero fingerprinting — safe for global compliance
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 space-y-4">
                <div className="text-xs font-mono text-zinc-500 flex justify-between">
                  <span>Top Referrers</span>
                  <span>Sessions</span>
                </div>
                {[
                  { source: "news.ycombinator.com", count: "34,120", pct: "64%" },
                  { source: "x.com / twitter", count: "18,450", pct: "42%" },
                  { source: "github.com/trending", count: "12,890", pct: "30%" },
                  { source: "google.com (organic)", count: "9,210", pct: "22%" },
                ].map((row, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs text-zinc-700">
                      <span className="font-mono font-medium">{row.source}</span>
                      <span className="font-mono font-bold text-zinc-950">{row.count}</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: row.pct }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "observability" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-blue-600 font-bold">
                  Pillar 02
                </span>
                <h3 className="text-2xl font-bold text-zinc-950 mt-1">
                  Real-User API &amp; Endpoint Observability
                </h3>
                <p className="text-zinc-600 text-sm mt-3 leading-relaxed">
                  Synthetic ping tests only test your servers from data centers.
                  Route captures real API latency, HTTP failure codes, and
                  network anomalies directly from actual customer browsers.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-zinc-700">
                  <li className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    p50, p90, and p95 latency quantiles
                  </li>
                  <li className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Automated 4xx / 5xx burst anomaly alerts
                  </li>
                  <li className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Full browser network waterfall inspection
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 space-y-3 font-mono text-xs">
                <div className="text-zinc-500 flex justify-between border-b border-zinc-200 pb-2">
                  <span>Endpoint</span>
                  <span>p95 Latency</span>
                </div>
                {[
                  { ep: "POST /api/auth/session", p95: "28ms", status: "200" },
                  { ep: "GET /api/user/analytics", p95: "44ms", status: "200" },
                  { ep: "POST /api/telemetry/beacon", p95: "12ms", status: "204" },
                  { ep: "GET /api/projects/export", p95: "180ms", status: "200" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-1.5 border-b border-zinc-200/50"
                  >
                    <span className="text-zinc-800 font-medium">{item.ep}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600 font-bold">{item.p95}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-semibold">
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "isp" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-indigo-600 font-bold">
                  Pillar 03
                </span>
                <h3 className="text-2xl font-bold text-zinc-950 mt-1">
                  ISP &amp; Regional Carrier Diagnostics
                </h3>
                <p className="text-zinc-600 text-sm mt-3 leading-relaxed">
                  When users complain your app is slow, stop guessing. Route
                  isolates whether the slowdown is caused by your application
                  backend or a specific internet service provider's peering
                  bottleneck.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-zinc-700">
                  <li className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Carrier-by-carrier latency breakdown
                  </li>
                  <li className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Autonomous System Number (ASN) mapping
                  </li>
                  <li className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Pinpoint regional CDN edge outages
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 space-y-3">
                <span className="text-xs font-mono text-zinc-500 block mb-2">
                  ISP Telemetry Distribution
                </span>
                <div className="p-3 rounded-lg bg-white border border-zinc-200 flex items-center justify-between text-xs shadow-2xs">
                  <div>
                    <div className="font-semibold text-zinc-900">AS13335 (Cloudflare)</div>
                    <div className="text-[11px] text-zinc-500">North America &amp; EU</div>
                  </div>
                  <span className="font-mono text-emerald-600 font-bold">12ms avg</span>
                </div>
                <div className="p-3 rounded-lg bg-white border border-zinc-200 flex items-center justify-between text-xs shadow-2xs">
                  <div>
                    <div className="font-semibold text-zinc-900">AS55836 (Reliance Jio)</div>
                    <div className="text-[11px] text-zinc-500">Asia / India Mobile &amp; Fiber</div>
                  </div>
                  <span className="font-mono text-blue-600 font-bold">24ms avg</span>
                </div>
                <div className="p-3 rounded-lg bg-white border border-zinc-200 flex items-center justify-between text-xs shadow-2xs">
                  <div>
                    <div className="font-semibold text-zinc-900">AS7922 (Comcast Cable)</div>
                    <div className="text-[11px] text-zinc-500">US East Broadband</div>
                  </div>
                  <span className="font-mono text-amber-600 font-bold">48ms avg</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "vitals" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-emerald-600 font-bold">
                  Pillar 04
                </span>
                <h3 className="text-2xl font-bold text-zinc-950 mt-1">
                  Field-Tested Core Web Vitals
                </h3>
                <p className="text-zinc-600 text-sm mt-3 leading-relaxed">
                  Track the exact performance signals Google uses for SEO
                  rankings: Interaction to Next Paint (INP), Largest
                  Contentful Paint (LCP), and Cumulative Layout Shift (CLS).
                </p>
                <ul className="mt-6 space-y-3 text-sm text-zinc-700">
                  <li className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    INP, LCP, CLS, FCP, TTFB real-user scores
                  </li>
                  <li className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Device &amp; mobile CPU throttling detection
                  </li>
                  <li className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Target 75th percentile Google thresholds
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="text-xs text-zinc-500 font-mono">LCP</span>
                  <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">
                    1.08s
                  </div>
                  <span className="text-[11px] text-emerald-700 font-medium">
                    ✓ Optimal (&lt; 2.5s)
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="text-xs text-zinc-500 font-mono">INP</span>
                  <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">
                    36ms
                  </div>
                  <span className="text-[11px] text-emerald-700 font-medium">
                    ✓ Optimal (&lt; 200ms)
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="text-xs text-zinc-500 font-mono">CLS</span>
                  <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">
                    0.002
                  </div>
                  <span className="text-[11px] text-emerald-700 font-medium">
                    ✓ Optimal (&lt; 0.1)
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="text-xs text-zinc-500 font-mono">TTFB</span>
                  <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">
                    48ms
                  </div>
                  <span className="text-[11px] text-emerald-700 font-medium">
                    ✓ Optimal (&lt; 800ms)
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "install" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-blue-600 font-bold">
                  Pillar 05
                </span>
                <h3 className="text-2xl font-bold text-zinc-950 mt-1">
                  Ready in 60 Seconds
                </h3>
                <p className="text-zinc-600 text-sm mt-3 leading-relaxed">
                  No heavy npm packages, zero bundle bloat, and no custom
                  build steps required. Paste this single script tag into your
                  HTML or Next.js layout, and your live telemetry dashboard
                  lights up immediately.
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={copyToClipboard}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {copiedSnippet ? "Copied to clipboard!" : "Copy Snippet"}
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-[#090d16] p-4 relative font-mono text-xs shadow-md">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800 text-[11px] text-zinc-400">
                  <span>HTML Header Snippet</span>
                  <span>script.js (~1.1KB)</span>
                </div>
                <pre className="text-zinc-200 overflow-x-auto leading-relaxed">
                  <code>
                    <span className="text-zinc-500">&lt;</span>
                    <span className="text-blue-400">script</span>
                    {"\n"}
                    <span className="text-zinc-400">  defer</span>
                    {"\n"}
                    <span className="text-zinc-400">  src</span>=
                    <span className="text-emerald-400">"https://cdn.route.dev/script.js"</span>
                    {"\n"}
                    <span className="text-zinc-400">  data-pid</span>=
                    <span className="text-emerald-400">"proj_route_live"</span>
                    {"\n"}
                    <span className="text-zinc-400">  data-domain</span>=
                    <span className="text-emerald-400">"yourdomain.com"</span>
                    {"\n"}
                    <span className="text-zinc-500">&gt;&lt;/</span>
                    <span className="text-blue-400">script</span>
                    <span className="text-zinc-500">&gt;</span>
                  </code>
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Features;
