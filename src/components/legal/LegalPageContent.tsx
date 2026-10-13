"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Shield, 
  FileText, 
  Activity, 
  Cookie, 
  Check, 
  Copy, 
  Search, 
  ArrowLeft, 
  Lock, 
  Database, 
  ExternalLink,
  ChevronRight,
  Info,
  Server
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export type LegalTab = "terms" | "privacy" | "telemetry" | "dpa";

interface LegalPageContentProps {
  initialTab?: LegalTab;
}

export default function LegalPageContent({ initialTab = "terms" }: LegalPageContentProps) {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] text-[#0f172a] font-instrument-sans antialiased selection:bg-[#0284c7]/15 selection:text-[#0284c7]">
      {/* Ambient background glows matching Route aesthetic */}
      <div className="pointer-events-none fixed -left-36 top-10 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(224,236,255,0.85)_0%,transparent_70%)] blur-3xl opacity-60" />
      <div className="pointer-events-none fixed -right-36 top-32 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(224,242,254,0.75)_0%,transparent_70%)] blur-3xl opacity-60" />

      {/* Global Navigation */}
      <div className="relative z-20">
        <Navbar />
      </div>

      {/* Hero Header */}
      <header className="relative z-10 mx-auto max-w-[1240px] px-6 pt-12 pb-10 sm:px-10 lg:px-16">
        <div className="flex flex-col items-start gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#64748b] hover:text-[#0f172a] transition-colors"
          >
            <ArrowLeft size={15} />
            <span>Back to Home</span>
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200/80 bg-sky-50/80 px-3 py-1 text-[11px] font-bold tracking-[0.14em] uppercase text-sky-700">
            <Shield size={12} className="text-sky-600" />
            LEGAL, PRIVACY & COMPLIANCE
          </div>

          <h1 className="font-lastik text-[36px] sm:text-[46px] md:text-[52px] font-normal tracking-[-0.03em] text-[#0f172a] leading-[1.1]">
            Terms of Service & Privacy Policies
          </h1>

          <p className="max-w-[760px] text-[15px] sm:text-[17px] leading-relaxed text-[#64748b]">
            Transparent, privacy-first principles engineered for modern software products. Route collects only actionable frontend observability and web analytics without intrusive user profiling or selling your data.
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-4 text-[12.5px] text-[#8c9ba8]">
            <span>Last Updated: October 13, 2026</span>
            <span>•</span>
            <span>Effective Date: Version 2.4</span>
            <span>•</span>
            <button
              onClick={handleCopyLink}
              type="button"
              className="inline-flex items-center gap-1.5 font-medium text-[#0284c7] hover:underline cursor-pointer"
            >
              {copiedLink ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
              {copiedLink ? "Link Copied!" : "Copy Link"}
            </button>
          </div>
        </div>

        {/* TL;DR Highlight Cards */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            className="rounded-[16px] border border-slate-200/90 bg-white p-5 inside-shadow"
            style={{
              boxShadow:
                "inset 0 1.5px 3px 0 rgba(0, 0, 0, 0.05), inset 0 0 0 1px rgba(226, 232, 240, 0.8), 0 4px 20px -4px rgba(15, 23, 42, 0.04)",
            }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-sky-50 text-sky-600 mb-3 border border-sky-100">
              <Shield size={18} />
            </div>
            <h3 className="font-semibold text-[15px] text-[#0f172a] tracking-tight">Cookieless Analytics</h3>
            <p className="mt-1 text-[13px] leading-snug text-[#64748b]">
              No intrusive third-party cookies or cross-site tracking profiles. GDPR & CCPA compliant out of the box.
            </p>
          </div>

          <div
            className="rounded-[16px] border border-slate-200/90 bg-white p-5 inside-shadow"
            style={{
              boxShadow:
                "inset 0 1.5px 3px 0 rgba(0, 0, 0, 0.05), inset 0 0 0 1px rgba(226, 232, 240, 0.8), 0 4px 20px -4px rgba(15, 23, 42, 0.04)",
            }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-emerald-50 text-emerald-600 mb-3 border border-emerald-100">
              <Database size={18} />
            </div>
            <h3 className="font-semibold text-[15px] text-[#0f172a] tracking-tight">You Own Your Data</h3>
            <p className="mt-1 text-[13px] leading-snug text-[#64748b]">
              Your website telemetry is yours. Configure retention windows, export datasets, or purge records at any time.
            </p>
          </div>

          <div
            className="rounded-[16px] border border-slate-200/90 bg-white p-5 inside-shadow"
            style={{
              boxShadow:
                "inset 0 1.5px 3px 0 rgba(0, 0, 0, 0.05), inset 0 0 0 1px rgba(226, 232, 240, 0.8), 0 4px 20px -4px rgba(15, 23, 42, 0.04)",
            }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-indigo-50 text-indigo-600 mb-3 border border-indigo-100">
              <Activity size={18} />
            </div>
            <h3 className="font-semibold text-[15px] text-[#0f172a] tracking-tight">Observability First</h3>
            <p className="mt-1 text-[13px] leading-snug text-[#64748b]">
              Monitor Core Web Vitals (LCP, CLS, INP) and client-side JavaScript errors without slowing down user devices.
            </p>
          </div>

          <div
            className="rounded-[16px] border border-slate-200/90 bg-white p-5 inside-shadow"
            style={{
              boxShadow:
                "inset 0 1.5px 3px 0 rgba(0, 0, 0, 0.05), inset 0 0 0 1px rgba(226, 232, 240, 0.8), 0 4px 20px -4px rgba(15, 23, 42, 0.04)",
            }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-amber-50 text-amber-600 mb-3 border border-amber-100">
              <Lock size={18} />
            </div>
            <h3 className="font-semibold text-[15px] text-[#0f172a] tracking-tight">Zero Ad-Tech Monopolies</h3>
            <p className="mt-1 text-[13px] leading-snug text-[#64748b]">
              We never sell or broker behavioral data to advertising brokers. Route is purely a subscription SaaS platform.
            </p>
          </div>
        </div>
      </header>

      {/* Main Interactive Container */}
      <main className="relative z-10 mx-auto max-w-[1240px] px-6 pb-24 sm:px-10 lg:px-16">
        {/* Navigation Tabs Bar */}
        <div className="mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab("terms")}
              type="button"
              className={`flex items-center gap-2 rounded-[10px] px-4 py-2.5 text-[14px] font-semibold transition-all cursor-pointer ${
                activeTab === "terms"
                  ? "bg-[#0284c7] text-white shadow-[0_2px_8px_rgba(2,132,199,0.35)]"
                  : "bg-white text-[#64748b] hover:bg-slate-100 hover:text-[#0f172a] border border-slate-200/80"
              }`}
            >
              <FileText size={16} />
              <span>Terms of Service</span>
            </button>

            <button
              onClick={() => setActiveTab("privacy")}
              type="button"
              className={`flex items-center gap-2 rounded-[10px] px-4 py-2.5 text-[14px] font-semibold transition-all cursor-pointer ${
                activeTab === "privacy"
                  ? "bg-[#0284c7] text-white shadow-[0_2px_8px_rgba(2,132,199,0.35)]"
                  : "bg-white text-[#64748b] hover:bg-slate-100 hover:text-[#0f172a] border border-slate-200/80"
              }`}
            >
              <Shield size={16} />
              <span>Privacy Policy</span>
            </button>

            <button
              onClick={() => setActiveTab("telemetry")}
              type="button"
              className={`flex items-center gap-2 rounded-[10px] px-4 py-2.5 text-[14px] font-semibold transition-all cursor-pointer ${
                activeTab === "telemetry"
                  ? "bg-[#0284c7] text-white shadow-[0_2px_8px_rgba(2,132,199,0.35)]"
                  : "bg-white text-[#64748b] hover:bg-slate-100 hover:text-[#0f172a] border border-slate-200/80"
              }`}
            >
              <Activity size={16} />
              <span>Beacon & Telemetry</span>
            </button>

            <button
              onClick={() => setActiveTab("dpa")}
              type="button"
              className={`flex items-center gap-2 rounded-[10px] px-4 py-2.5 text-[14px] font-semibold transition-all cursor-pointer ${
                activeTab === "dpa"
                  ? "bg-[#0284c7] text-white shadow-[0_2px_8px_rgba(2,132,199,0.35)]"
                  : "bg-white text-[#64748b] hover:bg-slate-100 hover:text-[#0f172a] border border-slate-200/80"
              }`}
            >
              <Cookie size={16} />
              <span>Cookies & DPA</span>
            </button>
          </div>

          {/* Quick Search inside document */}
          <div className="relative min-w-[220px]">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search legal clauses..."
              className="w-full rounded-[10px] border border-slate-200 bg-white py-2 pl-9 pr-3.5 text-[13px] text-[#0f172a] placeholder-[#94a3b8] outline-none transition-all focus:border-[#0284c7] focus:ring-2 focus:ring-[#0284c7]/10"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-[#94a3b8] hover:text-[#0f172a]"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Content Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area (Col 1-8) */}
          <div className="lg:col-span-8">
            <div
              className="rounded-[20px] border border-slate-200/90 bg-white p-7 sm:p-10 inside-shadow space-y-8"
              style={{
                boxShadow:
                  "inset 0 1.5px 3px 0 rgba(0, 0, 0, 0.05), inset 0 0 0 1px rgba(226, 232, 240, 0.9), 0 10px 30px -8px rgba(15, 23, 42, 0.04)",
              }}
            >
              {activeTab === "terms" && <TermsOfServiceSection searchQuery={searchQuery} />}
              {activeTab === "privacy" && <PrivacyPolicySection searchQuery={searchQuery} />}
              {activeTab === "telemetry" && <TelemetrySection searchQuery={searchQuery} />}
              {activeTab === "dpa" && <DpaSection searchQuery={searchQuery} />}
            </div>
          </div>

          {/* Sticky Sidebar (Col 9-12) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Summary Card */}
            <div
              className="rounded-[18px] border border-slate-200/90 bg-white p-6 inside-shadow sticky top-8"
              style={{
                boxShadow:
                  "inset 0 1.5px 3px 0 rgba(0, 0, 0, 0.05), inset 0 0 0 1px rgba(226, 232, 240, 0.9), 0 8px 24px -6px rgba(15, 23, 42, 0.03)",
              }}
            >
              <h3 className="font-semibold text-[15px] text-[#0f172a] tracking-tight flex items-center gap-2">
                <Info size={16} className="text-[#0284c7]" />
                Key Route Highlights
              </h3>

              <div className="mt-4 space-y-3.5 text-[13px] leading-relaxed text-[#64748b]">
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <Check size={10} />
                  </div>
                  <span><strong>Open Collector Architecture:</strong> Data is ingested via the lightweight <code className="text-[#0284c7] bg-slate-100 px-1 py-0.5 rounded text-[12px]">beacon.js</code> script directly into encrypted PostgreSQL.</span>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <Check size={10} />
                  </div>
                  <span><strong>No IP Retention:</strong> Visitor IP addresses are used only for momentary city/country lookup and are never stored in customer event tables.</span>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <Check size={10} />
                  </div>
                  <span><strong>Realtime & Audited:</strong> Telemetry is broadcast securely through Ably pub/sub channels scoped strictly to your project ID.</span>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <Check size={10} />
                  </div>
                  <span><strong>Configurable Retention:</strong> Projects default to 30 days of raw session history with persistent daily rollups.</span>
                </div>
              </div>

              <hr className="my-5 border-slate-100" />

              <div className="space-y-2">
                <span className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#8c9ba8] block">
                  NEED COMPLIANCE ASSISTANCE?
                </span>
                <p className="text-[12.5px] text-[#64748b]">
                  Have enterprise GDPR, DPA, or custom security questions?
                </p>
                <a
                  href="mailto:support@route.dev"
                  className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0284c7] hover:underline"
                >
                  Contact Security Team <ExternalLink size={13} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

// -------------------------------------------------------------
// TAB 1: TERMS OF SERVICE
// -------------------------------------------------------------
function TermsOfServiceSection({ searchQuery }: { searchQuery: string }) {
  return (
    <div className="space-y-8 text-[14.5px] leading-[1.7] text-[#334155]">
      <div>
        <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#0284c7]">
          LEGAL AGREEMENT
        </span>
        <h2 className="font-lastik mt-1 text-[28px] sm:text-[32px] font-normal tracking-[-0.03em] text-[#0f172a]">
          Terms of Service
        </h2>
        <p className="mt-2 text-[#64748b]">
          Please read these Terms of Service (&ldquo;Terms&rdquo;) carefully before creating an account or deploying Route analytics beacons on your digital properties.
        </p>
      </div>

      <section className="space-y-3">
        <h3 className="font-semibold text-[18px] text-[#0f172a] tracking-tight">1. Acceptance of Terms</h3>
        <p>
          By creating an account on Route, connecting a domain, installing the Route beacon script (<code className="text-[#0284c7] bg-slate-100 px-1.5 py-0.5 rounded text-[12.5px]">beacon.js</code>), or accessing any of Route&apos;s REST or WebSocket endpoints, you agree to be legally bound by these Terms of Service. If you are entering into this agreement on behalf of a company or other legal entity, you represent that you possess the authority to bind such entity.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="font-semibold text-[18px] text-[#0f172a] tracking-tight">2. Description of Service</h3>
        <p>
          Route provides privacy-preserving website analytics, Core Web Vitals telemetry, real-time visitor observability, and frontend error reporting. Features include:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-[#475569]">
          <li>Real-time telemetry ingestion through the <code className="text-[#0284c7] bg-slate-100 px-1 py-0.5 rounded text-[12.5px]">/api/collect</code> endpoint.</li>
          <li>Streaming live metrics using Ably WebSockets into customer dashboards.</li>
          <li>Performance metrics aggregation (LCP, CLS, INP, FCP, TTFB).</li>
          <li>Client-side JavaScript and unhandled promise error tracking.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="font-semibold text-[18px] text-[#0f172a] tracking-tight">3. User Accounts & Security</h3>
        <p>
          You may register for Route using credential authentication (email and password) or OAuth third-party sign-in (GitHub, Google). You are responsible for safeguarding your credentials and session tokens. If you suspect any unauthorized access to your account, you must notify Route immediately. Route incorporates session revocation upon password resets to guarantee that active sessions across all devices are immediately invalidated.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="font-semibold text-[18px] text-[#0f172a] tracking-tight">4. Beacon Deployment & Customer Responsibilities</h3>
        <p>
          You agree to only install the Route beacon on websites, applications, and domains that you own, operate, or have express permission to monitor. Furthermore:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-[#475569]">
          <li><strong>No Prohibited Sensitive PII:</strong> You shall not transmit personally identifiable information such as government-issued IDs, credit card numbers, passwords, or personal health records in custom event metadata payloads.</li>
          <li><strong>Site Notice:</strong> You agree to provide adequate notice on your site regarding the usage of analytics tools in compliance with local regulations.</li>
          <li><strong>No Tampering:</strong> You shall not attempt to overwhelm, inject malicious payloads into, or compromise the stability of Route&apos;s ingestion pipelines or Neon database servers.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="font-semibold text-[18px] text-[#0f172a] tracking-tight">5. Data Ownership & Licensing</h3>
        <p>
          <strong>You own your data.</strong> Route claims no ownership rights over the telemetry, custom events, or metrics captured from your websites. You grant Route a limited, non-exclusive license solely to process, aggregate, and display this data for the purpose of delivering the service to you.
        </p>
        <p>
          Route retains all intellectual property rights in and to the Route platform, including the user interface, tracking algorithms, SDK scripts, documentation, and brand assets.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="font-semibold text-[18px] text-[#0f172a] tracking-tight">6. Data Retention & Project Quotas</h3>
        <p>
          Raw session and event records are stored for <strong>30 days by default</strong>, after which they are subject to automated data pruning. Summarized daily rollups (<code className="text-[#0284c7] bg-slate-100 px-1 py-0.5 rounded text-[12.5px]">DailyMetric</code>) are maintained for historical reporting. You may configure or request customized retention windows based on your plan specifications.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="font-semibold text-[18px] text-[#0f172a] tracking-tight">7. Service Availability & Limitations</h3>
        <p>
          While we strive for 99.9% uptime, Route is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. We do not warrant that the service will be entirely error-free, uninterrupted, or immune from network latencies between edge collectors and regional database instances.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="font-semibold text-[18px] text-[#0f172a] tracking-tight">8. Termination</h3>
        <p>
          You may terminate your account at any time via your account settings. Upon termination, all active sessions are revoked, your projects are marked inactive, and your telemetry records will be queued for permanent database deletion in accordance with our retention policy. Route reserves the right to suspend accounts that engage in abuse, spamming, or attacks against the platform.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="font-semibold text-[18px] text-[#0f172a] tracking-tight">9. Contact Information</h3>
        <p>
          For inquiries regarding these Terms of Service, please reach out to our team at <a href="mailto:terms@route.dev" className="text-[#0284c7] underline font-medium">terms@route.dev</a>.
        </p>
      </section>
    </div>
  );
}

// -------------------------------------------------------------
// TAB 2: PRIVACY POLICY
// -------------------------------------------------------------
function PrivacyPolicySection({ searchQuery }: { searchQuery: string }) {
  return (
    <div className="space-y-8 text-[14.5px] leading-[1.7] text-[#334155]">
      <div>
        <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#0284c7]">
          TRANSPARENCY & DATA PROTECTION
        </span>
        <h2 className="font-lastik mt-1 text-[28px] sm:text-[32px] font-normal tracking-[-0.03em] text-[#0f172a]">
          Privacy Policy
        </h2>
        <p className="mt-2 text-[#64748b]">
          How Route collects, processes, and protects information for both Route account holders and visitors of sites monitored by Route.
        </p>
      </div>

      <div className="rounded-[14px] border border-emerald-200 bg-emerald-50/70 p-4.5 text-[13.5px] text-emerald-800 space-y-1">
        <div className="font-semibold flex items-center gap-1.5 text-emerald-900">
          <Shield size={16} /> Privacy-First Architecture by Design
        </div>
        <p>
          Unlike legacy trackers, Route does not utilize cross-site cookies, does not store raw visitor IP addresses in analytics tables, and never sells data to third-party ad brokers.
        </p>
      </div>

      <section className="space-y-3">
        <h3 className="font-semibold text-[18px] text-[#0f172a] tracking-tight">1. Information We Collect</h3>
        <p className="font-medium text-[#0f172a]">A. Information from Route Account Holders:</p>
        <ul className="list-disc pl-5 space-y-1 text-[#475569]">
          <li><strong>Account Details:</strong> Name, email address, password hash, and avatar (if authenticated via GitHub or Google).</li>
          <li><strong>Project Metadata:</strong> Project domains, framework identifiers, and timezone configurations.</li>
          <li><strong>Authentication Credentials:</strong> Secure session tokens managed by Better Auth.</li>
        </ul>

        <p className="font-medium text-[#0f172a] pt-2">B. Telemetry Collected via the Beacon Script (<code className="text-[#0284c7] bg-slate-100 px-1 py-0.5 rounded text-[12.5px]">beacon.js</code>):</p>
        <ul className="list-disc pl-5 space-y-1 text-[#475569]">
          <li><strong>Page Events:</strong> Page paths, document titles, referring URLs, and session duration.</li>
          <li><strong>Device & Client Context:</strong> Browser name/version, device type (mobile, tablet, desktop), screen dimensions, and operating system language.</li>
          <li><strong>Coarse Location:</strong> Country and city inferred from network routing headers. Raw IP addresses are discarded immediately and never stored.</li>
          <li><strong>Performance Telemetry:</strong> Core Web Vitals measurements (LCP, CLS, INP, FCP, TTFB) and API response duration in milliseconds.</li>
          <li><strong>Error Logs:</strong> Runtime JavaScript error messages, filenames, and stack line/column indices to aid debugging.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="font-semibold text-[18px] text-[#0f172a] tracking-tight">2. How We Use Information</h3>
        <p>We process collected data exclusively to:</p>
        <ul className="list-disc pl-5 space-y-1.5 text-[#475569]">
          <li>Render real-time traffic statistics and charts on the customer dashboard.</li>
          <li>Alert developers to critical client-side JavaScript bugs and performance regressions.</li>
          <li>Generate aggregate daily rollups for trend analysis.</li>
          <li>Deliver critical account lifecycle emails (e.g. password resets, security notifications) via Resend.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="font-semibold text-[18px] text-[#0f172a] tracking-tight">3. Sub-processors & Service Providers</h3>
        <p>
          Route partners with select, enterprise-grade cloud infrastructure providers to run our platform:
        </p>

        <div className="rounded-[12px] border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-[#475569]">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Sub-processor</th>
                <th className="py-2.5 px-4 font-semibold">Role</th>
                <th className="py-2.5 px-4 font-semibold">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[#334155]">
              <tr>
                <td className="py-2.5 px-4 font-medium">Neon Inc.</td>
                <td className="py-2.5 px-4">Serverless PostgreSQL Database Storage</td>
                <td className="py-2.5 px-4">USA (AWS East)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium">Ably Real-Time</td>
                <td className="py-2.5 px-4">WebSocket pub/sub telemetry distribution</td>
                <td className="py-2.5 px-4">Global Edge</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium">Resend Inc.</td>
                <td className="py-2.5 px-4">Transactional password reset & verification email delivery</td>
                <td className="py-2.5 px-4">USA</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium">Google / GitHub</td>
                <td className="py-2.5 px-4">Optional Single Sign-On (OAuth authentication)</td>
                <td className="py-2.5 px-4">Global</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="font-semibold text-[18px] text-[#0f172a] tracking-tight">4. GDPR & CCPA Compliance Rights</h3>
        <p>
          Under the General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA), you possess specific rights:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-[#475569]">
          <li><strong>Right to Access:</strong> You can export all your project data at any time.</li>
          <li><strong>Right to Rectification:</strong> You can update personal and project details directly in your settings.</li>
          <li><strong>Right to Erasure:</strong> You can delete projects or your entire user account, triggering complete database purging.</li>
          <li><strong>No Sale of Data:</strong> Route does not sell, rent, or trade your personal or telemetry data under any circumstances.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="font-semibold text-[18px] text-[#0f172a] tracking-tight">5. Security Measures</h3>
        <p>
          All data in transit is protected via TLS 1.3 encryption. At rest, database records are encrypted in Neon PostgreSQL. Session tokens and password hashes are safeguarded using industry standard hashing and secure Better Auth session handlers.
        </p>
      </section>
    </div>
  );
}

// -------------------------------------------------------------
// TAB 3: TELEMETRY & BEACON DETAILS
// -------------------------------------------------------------
function TelemetrySection({ searchQuery }: { searchQuery: string }) {
  return (
    <div className="space-y-8 text-[14.5px] leading-[1.7] text-[#334155]">
      <div>
        <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#0284c7]">
          TECHNICAL TRANSPARENCY
        </span>
        <h2 className="font-lastik mt-1 text-[28px] sm:text-[32px] font-normal tracking-[-0.03em] text-[#0f172a]">
          Beacon & Telemetry Protocol
        </h2>
        <p className="mt-2 text-[#64748b]">
          A comprehensive breakdown of how Route&apos;s lightweight beacon operates, what payloads are dispatched, and how we safeguard user privacy.
        </p>
      </div>

      <section className="space-y-3">
        <h3 className="font-semibold text-[18px] text-[#0f172a] tracking-tight">1. The Beacon Script (<code className="text-[#0284c7] bg-slate-100 px-1 py-0.5 rounded text-[13px]">/beacon.js</code>)</h3>
        <p>
          Route ships an ultra-lightweight client script (&lt; 3KB gzipped) loaded with the <code className="text-[#0284c7] bg-slate-100 px-1 py-0.5 rounded text-[12.5px]">defer</code> attribute. It does not block DOM construction or delay First Contentful Paint.
        </p>
        <div className="rounded-[12px] bg-[#0f172a] p-4 text-[13px] text-slate-200 font-mono overflow-x-auto">
          <code>
            &lt;script defer src=&quot;https://route.dev/beacon.js&quot; data-project-id=&quot;your_project_id&quot;&gt;&lt;/script&gt;
          </code>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="font-semibold text-[18px] text-[#0f172a] tracking-tight">2. Anonymized Session Tracking</h3>
        <p>
          Route generates an ephemeral <code className="text-[#0284c7] bg-slate-100 px-1 py-0.5 rounded text-[12.5px]">beaconSessionId</code> and pseudorandom <code className="text-[#0284c7] bg-slate-100 px-1 py-0.5 rounded text-[12.5px]">beaconVisitorId</code> stored in the visitor&apos;s local browser storage.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-[#475569]">
          <li><strong>No cross-origin persistence:</strong> The visitor ID is scoped strictly to the host domain and cannot be used to trace the visitor to other sites.</li>
          <li><strong>No fingerprinting:</strong> We do not perform canvas fingerprinting, audio API fingerprinting, or hardware profiling.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="font-semibold text-[18px] text-[#0f172a] tracking-tight">3. Web Vitals Telemetry</h3>
        <p>
          Route observes standard W3C performance metrics via the PerformanceObserver API:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
          <div className="p-3 rounded-[10px] border border-slate-200 bg-slate-50/70">
            <strong>LCP (Largest Contentful Paint):</strong> Render time of largest content element.
          </div>
          <div className="p-3 rounded-[10px] border border-slate-200 bg-slate-50/70">
            <strong>CLS (Cumulative Layout Shift):</strong> Visual stability during load.
          </div>
          <div className="p-3 rounded-[10px] border border-slate-200 bg-slate-50/70">
            <strong>INP (Interaction to Next Paint):</strong> User input responsiveness.
          </div>
          <div className="p-3 rounded-[10px] border border-slate-200 bg-slate-50/70">
            <strong>FCP & TTFB:</strong> Initial byte arrival & paint latency.
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="font-semibold text-[18px] text-[#0f172a] tracking-tight">4. Client-side Error Capture</h3>
        <p>
          When an unhandled exception occurs in your frontend, Route captures the error message, source script, line, and column. Route automatically truncates and sanitizes paths to prevent local file paths or environment variables from leaking into telemetry records.
        </p>
      </section>
    </div>
  );
}

// -------------------------------------------------------------
// TAB 4: COOKIE POLICY & DPA
// -------------------------------------------------------------
function DpaSection({ searchQuery }: { searchQuery: string }) {
  return (
    <div className="space-y-8 text-[14.5px] leading-[1.7] text-[#334155]">
      <div>
        <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#0284c7]">
          COMPLIANCE & DATA PROCESSING
        </span>
        <h2 className="font-lastik mt-1 text-[28px] sm:text-[32px] font-normal tracking-[-0.03em] text-[#0f172a]">
          Cookie Policy & Data Processing Addendum (DPA)
        </h2>
        <p className="mt-2 text-[#64748b]">
          Standards governing our role as a Data Processor under European and global data protection regimes.
        </p>
      </div>

      <section className="space-y-3">
        <h3 className="font-semibold text-[18px] text-[#0f172a] tracking-tight">1. Cookie Policy</h3>
        <p>
          <strong>For Visitors of Monitored Websites:</strong> Route does <strong>not</strong> set tracking cookies on the browsers of your website visitors. Because Route is cookieless, websites running Route generally do not require a cookie banner for analytics purposes under ePrivacy directives, provided no other trackers are active.
        </p>
        <p>
          <strong>For Route App Users:</strong> When you log in to Route to access your dashboard, we set strictly necessary, HTTP-only authentication session cookies to keep your account authenticated. These cookies are essential for service functionality.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="font-semibold text-[18px] text-[#0f172a] tracking-tight">2. Data Controller vs. Data Processor</h3>
        <p>
          In respect of website telemetry processed through Route:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-[#475569]">
          <li><strong>Customer is the Data Controller:</strong> You dictate what domains are monitored, what events are submitted, and what retention settings apply.</li>
          <li><strong>Route is the Data Processor:</strong> Route processes telemetry strictly on your documented instructions and solely to fulfill the services defined in the Terms of Service.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="font-semibold text-[18px] text-[#0f172a] tracking-tight">3. Data Subject Requests (DSR)</h3>
        <p>
          Should any end-user contact you exercising their rights under GDPR or CCPA to access or delete telemetry records, Route provides tools directly within your dashboard and API to purge session records associated with any visitor identifier.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="font-semibold text-[18px] text-[#0f172a] tracking-tight">4. Security Certifications & Inquiries</h3>
        <p>
          For enterprise customers requiring a formally executed Standard Contractual Clauses (SCC) or customized Data Processing Agreement, please email our legal counsel at <a href="mailto:dpa@route.dev" className="text-[#0284c7] underline font-medium">dpa@route.dev</a>.
        </p>
      </section>
    </div>
  );
}
