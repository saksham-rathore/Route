"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronDown, Check, ArrowRight, Loader2, Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "../../../lib/auth-client";
import { FRAMEWORKS, getFramework, getSnippet, isFrameworkId, type FrameworkId } from "@/lib/stacks";

export default function OnboardingPage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [FormData, setFormData] = useState<{
    Project: string;
    Domain: string;
  }>({
    Project: "",
    Domain: "",
  });
  const [framework, setFramework] = useState<FrameworkId>("nextjs");
  const [platformOpen, setPlatformOpen] = useState(false);
  const platformRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (platformRef.current && !platformRef.current.contains(e.target as Node)) {
        setPlatformOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setPlatformOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const selectedFw = getFramework(framework);

  const [Loading, setLoading] = useState(false);
  const [Message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: FormData.Project,
          domain: FormData.Domain,
          framework,
        }),
      });

      if (response.ok) {
        const data = await response.json().catch(() => null);
        const pid = data?.project?.projectId as string | undefined;
        const domain =
          (data?.project?.domain as string | undefined) ?? FormData.Domain;
        const fw = (data?.project?.framework as string | undefined) ?? framework;
        const qs = new URLSearchParams();
        if (pid) qs.set("pid", pid);
        if (domain) qs.set("domain", domain);
        if (fw) qs.set("framework", fw);
        const suffix = qs.toString();
        router.push(`/Onboarding-Script${suffix ? `?${suffix}` : ""}`);
      } else {
        const data = await response.json().catch(() => null);
        setMessage(data?.error || "Failed to create project");
      }
    } catch (error) {
      setMessage("Project creating failed !!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#eef1f6] font-sans text-[#0b1220] antialiased transition-colors duration-200 dark:bg-[#0c111b] dark:text-[#f1f4fa]">
      {/* Header */}
      <header className="h-[65px] shrink-0 border-b border-[#dfe4ec] bg-[#eef1f6] dark:border-[#1c2433] dark:bg-[#0c111b] transition-colors duration-200">
        <div className="mx-auto flex h-full max-w-[1104px] items-center justify-between px-4 sm:px-6">
          {/* Logo & Brand */}
          <Link href="/" className="group flex items-center gap-2.5">
            <img
              src="/logo.svg"
              alt="Route logo"
              className="h-7 w-7 object-contain transition-transform duration-200 group-hover:scale-105"
            />
            <span className="font-sans text-[24px] font-semibold leading-none tracking-[-0.04em] text-[#0b1220] dark:text-white">
              Route
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:py-20">
        <section className="h-fit w-full max-w-[516px] rounded-2xl border border-[#d9e0ee] bg-white p-[22px] sm:p-[28px] shadow-[0_1px_2px_rgba(20,40,90,.04),0_8px_24px_rgba(20,40,90,.05)] dark:border-[#222c40] dark:bg-[#121927] dark:shadow-[0_8px_28px_rgba(0,0,0,.4)] inside-shadow transition-colors">
          {/* Step Badge */}
          <div className="mb-[14px] text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5b6577] dark:text-[#8b97ab]">
            Step 1 of 2
          </div>

          {/* Title & Description */}
          <h1 className="mb-2 text-[26px] font-semibold leading-[1.2] tracking-[-0.025em] text-[#0b1220] dark:text-white">
            Create your first project
          </h1>

          <p className="mb-[26px] text-[14.5px] leading-relaxed text-[#4b5565] dark:text-[#a3adbf]">
            One script tag unlocks user analytics and real-user observability
            for your app.
          </p>

          {Message && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-[13px] text-red-600 border border-red-200 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400">
              {Message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Project Name */}
            <div className="mb-[22px]">
              <label
                htmlFor="projectName"
                className="mb-[8px] block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5b6577] dark:text-[#8b97ab]"
              >
                Project name
              </label>
              <input
                name="Project"
                onChange={handleChange}
                value={FormData.Project}
                id="projectName"
                type="text"
                placeholder="my-app"
                required
                autoComplete="off"
                className="h-[42px] w-full rounded-lg border border-[#dde2ea] bg-white px-4 text-[14.5px] text-[#0b1220] outline-none transition-all placeholder:text-[#8a93a3] hover:border-[#c4ccda] focus:border-[#0284c7] focus:ring-2 focus:ring-[#0284c7]/20 inside-shadow-inset dark:border-[#263148] dark:bg-[#0e1522] dark:text-white dark:placeholder:text-[#5f6b80]"
              />
            </div>

            {/* Domain */}
            <div className="mb-[22px]">
              <label
                htmlFor="domain"
                className="mb-[8px] block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5b6577] dark:text-[#8b97ab]"
              >
                Domain
              </label>
              <input
                id="domain"
                type="text"
                name="Domain"
                onChange={handleChange}
                value={FormData.Domain}
                placeholder="route.dev"
                required
                autoComplete="off"
                className="h-[42px] w-full rounded-lg border border-[#dde2ea] bg-white px-4 text-[14.5px] text-[#0b1220] outline-none transition-all placeholder:text-[#8a93a3] hover:border-[#c4ccda] focus:border-[#0284c7] focus:ring-2 focus:ring-[#0284c7]/20 inside-shadow-inset dark:border-[#263148] dark:bg-[#0e1522] dark:text-white dark:placeholder:text-[#5f6b80]"
              />
              <p className="mt-2 text-xs text-[#6b7585] dark:text-[#8590a3]">
                Public production domain only — no localhost or private IPs.
              </p>
            </div>

            {/* Platform Dropdown */}
            <div className="mb-[26px]">
              <label className="mb-[8px] block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5b6577] dark:text-[#8b97ab]">
                Platform
              </label>

              <div className="relative" ref={platformRef}>
                <button
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={platformOpen}
                  onClick={() => setPlatformOpen((v) => !v)}
                  className={`flex h-[42px] w-full cursor-pointer items-center justify-between rounded-lg border bg-white px-3.5 text-[14.5px] transition inside-shadow-inset dark:bg-[#0e1522] ${platformOpen ? "border-[#0284c7] ring-2 ring-[#0284c7]/20" : "border-[#dde2ea] hover:border-[#c4ccda] dark:border-[#263148]"}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white ${selectedFw.badgeBg}`}>
                      {selectedFw.letter}
                    </span>
                    <span className="font-medium text-[#0b1220] dark:text-white">
                      {selectedFw.name}
                    </span>
                    <span className="hidden text-[11px] text-[#8a93a3] sm:inline">
                      · {selectedFw.hint}
                    </span>
                  </div>

                  <ChevronDown className={`h-4 w-4 text-[#5b6577] transition-transform duration-200 dark:text-[#8b97ab] ${platformOpen ? "rotate-180" : ""}`} />
                </button>

                {platformOpen && (
                  <div role="listbox" className="absolute z-20 mt-2 max-h-[264px] w-full overflow-y-auto rounded-xl border border-[#dde2ea] bg-white p-1.5 shadow-[0_12px_32px_rgba(20,40,90,.14)] dark:border-[#263148] dark:bg-[#0e1522]">
                    {FRAMEWORKS.map((p) => {
                      const active = p.id === framework;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          role="option"
                          aria-selected={active}
                          onClick={() => {
                            setFramework(p.id);
                            setPlatformOpen(false);
                          }}
                          className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13.5px] transition ${active ? "bg-[#eff6ff] text-[#0b1220] dark:bg-[#142137] dark:text-white" : "text-[#334155] hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-[#151d2e]"}`}
                        >
                          <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${p.badgeBg}`}>
                            {p.letter}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-medium leading-tight">{p.name}</span>
                            <span className="block truncate text-[11px] text-[#8a93a3]">{p.hint}</span>
                          </span>
                          {active && <Check className="h-4 w-4 shrink-0 text-[#0284c7]" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <p className="mt-2 text-xs text-[#6b7585] dark:text-[#8590a3]">
                Your install snippet on the next step adapts to this stack.
              </p>
            </div>

            {/* Submit Button with Previous Signature Radial Gradient */}
            <button
              type="submit"
              disabled={Loading}
              style={{
                background:
                  "radial-gradient(circle, color(srgb 0.00784314 0.517647 0.780392 / 0.68) 0%, rgb(2, 132, 199) 64%)",
                boxShadow:
                  "0 2px 10px rgba(2, 132, 199, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
              }}
              className="flex h-[42px] w-full cursor-pointer items-center justify-center gap-2 rounded-lg text-[14.5px] font-semibold text-white transition hover:brightness-105 active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {Loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating project...</span>
                </>
              ) : (
                <>
                  <span>Create project</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

function OnboardingScriptContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pid = searchParams.get("pid") ?? "your-project-id";
  const domain = searchParams.get("domain") ?? "your-domain.com";
  const fwParam = searchParams.get("framework");
  const [fw, setFw] = useState<FrameworkId>(isFrameworkId(fwParam) ? fwParam : "nextjs");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isFrameworkId(fwParam)) setFw(fwParam);
  }, [fwParam]);

  const HandleClick = async () => {
    router.push("/dashboard");
  };

  const beaconSrc = typeof window !== "undefined" ? `${window.location.origin}/beacon.js` : "/beacon.js";
  const snippet = useMemo(() => getSnippet(fw, { beaconSrc, projectId: pid, domain }), [fw, beaconSrc, pid, domain]);
  const activeFw = getFramework(fw);

  const copySnippet = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = snippet.code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#eef2f6] font-sans text-[#0b1220] antialiased transition-colors duration-200 dark:bg-[#0c111b] dark:text-[#f1f4fa]">
      {/* Header */}
      <header className="h-[65px] shrink-0 border-b border-[#dfe4ec] bg-[#eef2f6] dark:border-[#1c2433] dark:bg-[#0c111b] transition-colors duration-200">
        <div className="mx-auto flex h-full max-w-[1104px] items-center justify-between px-4 sm:px-6">
          {/* Logo & Brand */}
          <Link href="/" className="group flex items-center gap-2.5">
            <img
              src="/logo.svg"
              alt="Route logo"
              className="h-7 w-7 object-contain transition-transform duration-200 group-hover:scale-105"
            />
            <span className="font-sans text-[24px] font-semibold leading-none tracking-[-0.04em] text-[#0b1220] dark:text-white">
              Route
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:py-16">
        <section className="w-full max-w-[500px] rounded-2xl border border-[#d9e0ee] bg-white p-[26px] sm:p-[32px] shadow-[0_1px_2px_rgba(20,40,90,.04),0_8px_24px_rgba(20,40,90,.05)] dark:border-[#222c40] dark:bg-[#121927] dark:shadow-[0_8px_28px_rgba(0,0,0,.4)] inside-shadow transition-colors">
          {/* Step Badge */}
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#627084] dark:text-[#8b97ab]">
            STEP 2 OF 2
          </div>

          {/* Title & Description */}
          <h1 className="mb-2 text-[26px] sm:text-[28px] font-bold tracking-[-0.025em] text-[#0b1220] dark:text-white leading-[1.2]">
            Install the snippet
          </h1>

          <p className="mb-6 text-[14px] leading-relaxed text-[#4b5565] dark:text-[#a3adbf]">
            Paste this into your app. Traffic, journeys, latency, and vitals
            show up in the dashboard within minutes.
          </p>

          {/* Snippet Panel */}
          <div className="overflow-hidden rounded-[14px] border border-[#cfdaea] bg-[#edf2f9] p-3.5 sm:p-4 dark:border-[#26334a] dark:bg-[#0e1624]">
            {/* Framework tabs — user can switch stack here too */}
            <div className="mb-3 flex flex-wrap gap-1.5">
              {FRAMEWORKS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFw(f.id)}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11.5px] font-semibold transition ${fw === f.id ? "border-[#0284c7] bg-white text-[#0284c7] shadow-2xs dark:bg-[#142137]" : "border-transparent text-[#64748b] hover:border-[#c5d5e8] hover:bg-white/60 dark:text-[#8b97ab]"}`}
                >
                  <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold text-white ${f.badgeBg}`}>{f.letter}</span>
                  {f.name}
                </button>
              ))}
            </div>

            {/* Header with filename and Copy Icon */}
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-[#64748b] dark:text-[#8b97ab]">
                {snippet.filename} · {activeFw.name}
              </span>

              <button
                type="button"
                aria-label="Copy snippet"
                title="Copy snippet"
                onClick={copySnippet}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-[#d0dbe9] bg-white text-[#5b6577] shadow-2xs transition hover:bg-slate-50 hover:text-[#0b1220] dark:border-[#26334a] dark:bg-[#151f30] dark:text-[#cbd5e1]"
              >
                {copied ? (
                  <Check className="h-3 w-3 text-emerald-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            </div>

            {/* Code Box — framework-specific */}
            <div className="rounded-[10px] border border-[#d5dfea] bg-[#e6ecf4] p-3.5 sm:p-4 font-mono text-[12px] sm:text-[12.5px] leading-[1.65] select-text whitespace-pre-wrap break-all dark:border-[#222e42] dark:bg-[#0a111c] dark:text-slate-200">
              {snippet.code}
            </div>

            {/* Install with Agent */}
            <div className="mt-3.5 flex items-center justify-between gap-3 rounded-[10px] border border-[#c5d5e8] bg-[#dbe6f6]/85 px-3.5 py-2.5 dark:border-[#2d3d59] dark:bg-[#142137]">
              <div>
                <p className="text-[12px] font-semibold leading-tight text-[#0b1220] dark:text-white">
                  Install with agent
                </p>
                <p className="mt-0.5 text-[11px] leading-tight text-[#4b5565] dark:text-[#a3adbf]">
                  Paste into Cursor, Copilot, or Claude Code.
                </p>
              </div>

              <button
                type="button"
                onClick={copySnippet}
                className="flex cursor-pointer items-center gap-1.5 rounded-[7px] border border-[#c7d6e8] bg-white px-2.5 py-1 text-[11.5px] font-semibold text-[#0b1220] shadow-2xs transition hover:bg-slate-50 dark:border-[#2e3e5c] dark:bg-[#182338] dark:text-white"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-600" />
                    <span className="text-emerald-600">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 text-[#4b5565] dark:text-[#a3adbf]" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Checklist */}
          <ul className="my-5 space-y-2">
            <li className="flex items-center gap-2.5 text-[12.5px] text-[#526071] dark:text-[#94a3b8]">
              <Check className="h-4 w-4 shrink-0 stroke-[2.5] text-[#0d9488]" />
              <span>Pageviews, sessions, and journey paths</span>
            </li>
            <li className="flex items-center gap-2.5 text-[12.5px] text-[#526071] dark:text-[#94a3b8]">
              <Check className="h-4 w-4 shrink-0 stroke-[2.5] text-[#0d9488]" />
              <span>Endpoint latency, Core Web Vitals, and ISP context</span>
            </li>
          </ul>

          {/* Actions */}
          <div className="space-y-3">
            {/* Go to dashboard */}
            <div
              onClick={HandleClick}
              className="flex h-[42px] w-full cursor-pointer items-center justify-center rounded-lg border border-[#dde2ea] bg-[#f7f8fb] text-[14.5px] font-medium text-[#0b1220] inside-shadow transition hover:bg-[#f0f2f7] dark:border-[#263148] dark:bg-[#0e1522] dark:text-[#f1f4fa] dark:hover:bg-[#151d2e]"
            >
              <span>Go to dashboard</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export function OnboardingScriptPage() {
  return (
    <Suspense fallback={null}>
      <OnboardingScriptContent />
    </Suspense>
  );
}
