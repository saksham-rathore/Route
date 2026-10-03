"use client";

import React, { useState } from "react";
import Link from "next/link";
import { pixelperfect as PixelLogo } from "@/components/routepixel/text";

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-zinc-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-8 lg:gap-10">
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* Logo Mark (Umami-style circular / sleek emblem) */}
            <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <svg
                viewBox="0 0 24 24"
                className="w-3.5 h-3.5 fill-current"
                aria-hidden="true"
              >
                <path d="M12 3a9 9 0 0 0-9 9c0 4.97 4.03 9 9 9s9-4.03 9-9a9 9 0 0 0-9-9zm0 15a6 6 0 0 1-6-6h12a6 6 0 0 1-6 6z" />
              </svg>
            </div>
            {/* Wordmark */}
            <span className="text-xl font-bold tracking-tight text-black group-hover:text-zinc-800 transition-colors">
              route
            </span>
          </Link>

          {/* Center: Desktop Navigation Links with Dropdowns */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-7">
            {/* Product Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("product")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                className="flex items-center gap-1 text-sm font-medium text-zinc-600 hover:text-zinc-950 py-2 transition-colors cursor-pointer"
              >
                <span>Product</span>
                <svg
                  className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${
                    activeDropdown === "product" ? "rotate-180 text-zinc-700" : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {activeDropdown === "product" && (
                <div className="absolute top-full left-0 w-80 pt-2 z-50 animate-in fade-in-50 slide-in-from-top-1 duration-150">
                  <div className="bg-white rounded-xl border border-zinc-200 shadow-xl p-2 space-y-1">
                    <a
                      href="#features"
                      className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-zinc-50 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-zinc-900">User Analytics</div>
                        <div className="text-xs text-zinc-500">Cookie-free session tracking &amp; journey funnels.</div>
                      </div>
                    </a>

                    <a
                      href="#observability"
                      className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-zinc-50 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-md bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-zinc-900">Network Observability</div>
                        <div className="text-xs text-zinc-500">Real browser API latency &amp; error tracking.</div>
                      </div>
                    </a>

                    <a
                      href="#features"
                      className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-zinc-50 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-zinc-900">ISP Diagnostics</div>
                        <div className="text-xs text-zinc-500">Carrier ASN telemetry &amp; peering visibility.</div>
                      </div>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Use Cases Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("use-cases")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                className="flex items-center gap-1 text-sm font-medium text-zinc-600 hover:text-zinc-950 py-2 transition-colors cursor-pointer"
              >
                <span>Use Cases</span>
                <svg
                  className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${
                    activeDropdown === "use-cases" ? "rotate-180 text-zinc-700" : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {activeDropdown === "use-cases" && (
                <div className="absolute top-full left-0 w-72 pt-2 z-50 animate-in fade-in-50 slide-in-from-top-1 duration-150">
                  <div className="bg-white rounded-xl border border-zinc-200 shadow-xl p-2 space-y-1">
                    <a
                      href="#features"
                      className="block p-2.5 rounded-lg hover:bg-zinc-50 transition-colors"
                    >
                      <div className="text-sm font-semibold text-zinc-900">SaaS &amp; Web Apps</div>
                      <div className="text-xs text-zinc-500">Track user churn and API performance.</div>
                    </a>
                    <a
                      href="#features"
                      className="block p-2.5 rounded-lg hover:bg-zinc-50 transition-colors"
                    >
                      <div className="text-sm font-semibold text-zinc-900">E-Commerce &amp; Checkout</div>
                      <div className="text-xs text-zinc-500">Catch checkout latency and drop-offs.</div>
                    </a>
                    <a
                      href="#features"
                      className="block p-2.5 rounded-lg hover:bg-zinc-50 transition-colors"
                    >
                      <div className="text-sm font-semibold text-zinc-900">DevOps &amp; Infra</div>
                      <div className="text-xs text-zinc-500">Real User Monitoring (RUM) without heavy SDKs.</div>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("resources")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                className="flex items-center gap-1 text-sm font-medium text-zinc-600 hover:text-zinc-950 py-2 transition-colors cursor-pointer"
              >
                <span>Resources</span>
                <svg
                  className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${
                    activeDropdown === "resources" ? "rotate-180 text-zinc-700" : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {activeDropdown === "resources" && (
                <div className="absolute top-full left-0 w-64 pt-2 z-50 animate-in fade-in-50 slide-in-from-top-1 duration-150">
                  <div className="bg-white rounded-xl border border-zinc-200 shadow-xl p-2 space-y-1">
                    <a
                      href="#how"
                      className="block p-2.5 rounded-lg hover:bg-zinc-50 transition-colors"
                    >
                      <div className="text-sm font-semibold text-zinc-900">Documentation</div>
                      <div className="text-xs text-zinc-500">Setup guides and edge API specs.</div>
                    </a>
                    <a
                      href="#testimonials"
                      className="block p-2.5 rounded-lg hover:bg-zinc-50 transition-colors"
                    >
                      <div className="text-sm font-semibold text-zinc-900">Customer Stories</div>
                      <div className="text-xs text-zinc-500">How teams scale with Route.</div>
                    </a>
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noreferrer"
                      className="block p-2.5 rounded-lg hover:bg-zinc-50 transition-colors"
                    >
                      <div className="text-sm font-semibold text-zinc-900">GitHub Community</div>
                      <div className="text-xs text-zinc-500">Open source scripts and discussions.</div>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Docs Link */}
            <a
              href="#how"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-950 transition-colors"
            >
              Docs
            </a>

          </nav>
        </div>

        {/* Right: GitHub Stars, Log in, Sign up Button */}
        <div className="hidden sm:flex items-center gap-5">
          {/* GitHub Star Badge (matching the screenshot: [Github Icon] 38K) */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-zinc-800 hover:text-black transition-colors group"
            title="Star on GitHub"
          >
            <svg
              className="w-5 h-5 fill-current text-zinc-800 group-hover:text-black transition-colors"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
            <span className="text-sm font-semibold text-zinc-900 group-hover:text-black">
              38K
            </span>
          </a>

          {/* Log in */}
          <a
            href="#demo"
            className="text-sm font-medium text-zinc-700 hover:text-zinc-950 transition-colors"
          >
            Log in
          </a>

          {/* Sign up Button (Matching the bright blue button from the screenshot) */}
          <a
            href="#pricing"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-[#2563eb] hover:bg-[#1d4ed8] shadow-xs transition-colors"
          >
            Sign up
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center gap-3">
          <a
            href="#pricing"
            className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-[#2563eb]"
          >
            Sign up
          </a>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-zinc-700 hover:text-black hover:bg-zinc-100 rounded-md"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-zinc-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-zinc-700 hover:text-black py-1.5"
          >
            Product
          </a>
          <a
            href="#observability"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-zinc-700 hover:text-black py-1.5"
          >
            Use Cases
          </a>
          <a
            href="#testimonials"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-zinc-700 hover:text-black py-1.5"
          >
            Resources
          </a>
          <a
            href="#how"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-zinc-700 hover:text-black py-1.5"
          >
            Docs
          </a>

          <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold text-zinc-800"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>38K Stars</span>
            </a>
            <a href="#demo" className="text-xs font-medium text-zinc-700">
              Log in
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;