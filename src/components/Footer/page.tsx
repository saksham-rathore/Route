"use client";

import React from "react";
import { pixelperfect as PixelLogo } from "@/components/routepixel/text";

export const Footer = () => {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 py-12 text-xs text-zinc-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <div className="w-28 text-blue-600">
              <PixelLogo className="w-full h-auto text-blue-600" />
            </div>
            <p className="mt-3 text-zinc-600 max-w-xs text-xs leading-relaxed">
              Web analytics and network observability platform built for humans
              and AI agents. Fast, lightweight, and cookie-free.
            </p>
            <div className="mt-4 flex items-center gap-2 text-[11px] text-zinc-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All telemetry edge nodes operational</span>
            </div>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-900 font-bold mb-3">
              Product
            </p>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-zinc-950 transition">User Analytics</a></li>
              <li><a href="#observability" className="hover:text-zinc-950 transition">Observability</a></li>
              <li><a href="#features" className="hover:text-zinc-950 transition">Core Web Vitals</a></li>
              <li><a href="#features" className="hover:text-zinc-950 transition">ISP Diagnostics</a></li>
              <li><a href="#how" className="hover:text-zinc-950 transition">How It Works</a></li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-900 font-bold mb-3">
              Compare
            </p>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-zinc-950 transition">Route vs GA4</a></li>
              <li><a href="#" className="hover:text-zinc-950 transition">Route vs Plausible</a></li>
              <li><a href="#" className="hover:text-zinc-950 transition">Route vs Datadog</a></li>
              <li><a href="#" className="hover:text-zinc-950 transition">Route vs Vercel</a></li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-900 font-bold mb-3">
              Legal &amp; Privacy
            </p>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-zinc-950 transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-zinc-950 transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-zinc-950 transition">Cookie-Free Notice</a></li>
              <li><a href="#" className="hover:text-zinc-950 transition">Security</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Route Inc. All rights reserved.</p>
          <div className="flex items-center gap-6 text-zinc-600">
            <a href="https://x.com" target="_blank" rel="noreferrer" className="hover:text-zinc-950 transition">
              Twitter / X
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-zinc-950 transition">
              GitHub
            </a>
            <a href="https://discord.com" target="_blank" rel="noreferrer" className="hover:text-zinc-950 transition">
              Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
