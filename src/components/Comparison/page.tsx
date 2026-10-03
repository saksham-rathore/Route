"use client";

import React from "react";

export const Comparison = () => {
  return (
    <section className="py-20 border-t border-zinc-200/80 bg-zinc-50/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-blue-600 font-bold mb-2">
            Comparison
          </p>
          <h2 className="text-3xl font-bold text-zinc-950 tracking-tight">
            Why Developers Choose Route
          </h2>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-xs">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-xs font-mono text-zinc-600 bg-zinc-50/75">
                <th className="p-4 font-semibold">Feature</th>
                <th className="p-4 text-blue-700 font-bold bg-blue-50/70 border-x border-blue-100">
                  Route
                </th>
                <th className="p-4 font-normal">Google Analytics 4</th>
                <th className="p-4 font-normal">Plausible</th>
                <th className="p-4 font-normal">Datadog RUM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 text-zinc-700">
              <tr>
                <td className="p-4 font-semibold text-zinc-950">Script Size</td>
                <td className="p-4 font-mono text-emerald-700 font-bold bg-blue-50/40 border-x border-blue-100">
                  &lt; 1.2 KB
                </td>
                <td className="p-4 text-zinc-600">~45 KB</td>
                <td className="p-4 text-zinc-600">&lt; 1.5 KB</td>
                <td className="p-4 text-zinc-600">~60 KB</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-zinc-950">Cookie-Free / No Banner</td>
                <td className="p-4 text-emerald-700 font-bold bg-blue-50/40 border-x border-blue-100">
                  ✓ 100% Compliant
                </td>
                <td className="p-4 text-red-600">✗ Requires Banner</td>
                <td className="p-4 text-emerald-700">✓ Yes</td>
                <td className="p-4 text-zinc-600">Depends</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-zinc-950">API Latency Telemetry</td>
                <td className="p-4 text-emerald-700 font-bold bg-blue-50/40 border-x border-blue-100">
                  ✓ Real User p95
                </td>
                <td className="p-4 text-red-600">✗ No</td>
                <td className="p-4 text-red-600">✗ No</td>
                <td className="p-4 text-emerald-700">✓ Yes</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-zinc-950">ISP &amp; Carrier Diagnostics</td>
                <td className="p-4 text-emerald-700 font-bold bg-blue-50/40 border-x border-blue-100">
                  ✓ Built-in
                </td>
                <td className="p-4 text-red-600">✗ No</td>
                <td className="p-4 text-red-600">✗ No</td>
                <td className="p-4 text-amber-700">Complex Setup</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-zinc-950">Free Tier Usability</td>
                <td className="p-4 text-emerald-700 font-bold bg-blue-50/40 border-x border-blue-100">
                  Generous (25k events)
                </td>
                <td className="p-4 text-zinc-600">Free (Sells Data)</td>
                <td className="p-4 text-red-600">No Free Tier</td>
                <td className="p-4 text-red-600">$$$ Expensive</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Comparison;
