"use client";

import { useState, useEffect, useMemo } from "react";
import { authClient } from "../../../lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronDown,
  MoreVertical,
  Plus,
  Sun,
  Moon,
  Loader2,
} from "lucide-react";

interface ProjectData {
  id: string;
  projectId?: string;
  name: string;
  domain: string;
  framework?: string;
  _count?: {
    events?: number;
    analyticsSessions?: number;
    visitors?: number;
  };
  createdAt?: string;
}

export default function OnboardingProjectsPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "name" | "requests">("latest");
  const [statusFilter, setStatusFilter] = useState<"all" | "connected" | "pending">("all");

  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const handleClick = () => {
    router.push("/Onboarding");
  };

  const initials =
    session?.user?.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || " ";

  const getProjectInitial = (name?: string) => {
    if (!name) return "P";
    return (
      name
        .trim()
        .split(/\s+/)
        .map((word) => word[0])
        .join("")
        .slice(0, 1)
        .toUpperCase() || "P"
    );
  };

  const signatureButtonStyle = {
    background:
      "radial-gradient(circle, color(srgb 0.00784314 0.517647 0.780392 / 0.68) 0%, rgb(2, 132, 199) 64%)",
    boxShadow:
      "0 2px 10px rgba(2, 132, 199, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
  };

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const response = await fetch("/api/projects");
        const data = await response.json();
        if (data.projects && Array.isArray(data.projects)) {
          setProjects(data.projects);
        }
      } catch (error) {
        console.error("Failed to load projects:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const totalRequests = useMemo(() => {
    return projects.reduce((acc, p) => acc + (p._count?.events || 0), 0);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    let list = [...projects];

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) || p.domain.toLowerCase().includes(q),
      );
    }

    if (statusFilter === "connected") {
      list = list.filter((p) => (p._count?.events ?? 0) > 0);
    } else if (statusFilter === "pending") {
      list = list.filter((p) => (p._count?.events ?? 0) === 0);
    }

    if (sortBy === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "requests") {
      list.sort((a, b) => (b._count?.events ?? 0) - (a._count?.events ?? 0));
    } else {
      list.sort((a, b) => {
        const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return db - da;
      });
    }

    return list;
  }, [projects, search, sortBy, statusFilter]);

  const connectedCount = projects.filter(
    (p) => (p._count?.events ?? 0) > 0,
  ).length;

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#eef2f6] font-sans text-[#0b1220] antialiased transition-colors duration-200 dark:bg-[#0c111b] dark:text-[#f1f4fa]">
      {/* Top Navbar */}
      <header className="w-full">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 pt-6 pb-2">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/logo.svg"
              alt="Route logo"
              className="h-7 w-7 object-contain transition-transform duration-200 hover:scale-105"
            />
            <span className="font-sans text-[22px] font-bold leading-none tracking-tight text-[#0b1220] dark:text-white">
              Route
            </span>
          </Link>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            {/* User Avatar */}
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name ?? "Avatar"}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 font-medium text-white">
                {initials}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-6 pt-6 pb-12">
        {/* Title & Add Project Action */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[26px] sm:text-[28px] font-bold tracking-tight text-[#0b1220] dark:text-white">
              Projects
            </h1>
            <p className="mt-1 text-[13.5px] text-[#64748b] dark:text-[#8b97ab]">
              Monitoring performance across active projects
            </p>
          </div>

          {/* Add Project Button */}
          <button
            onClick={handleClick}
            type="button"
            style={signatureButtonStyle}
            className="flex h-[38px] cursor-pointer items-center justify-center gap-1.5 rounded-lg px-4 text-[13.5px] font-semibold text-white transition hover:brightness-105 active:scale-[0.99]"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Add Project</span>
          </button>
        </div>

        {/* 3 Metric Stat Cards */}
        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Card 1: PROJECTS */}
          <div className="rounded-xl border border-[#dfe4ec] bg-white p-4.5 shadow-[0_1px_2px_rgba(20,40,90,.03)] dark:border-[#1e2738] dark:bg-[#121927]">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b] dark:text-[#8b97ab]">
              PROJECTS
            </div>
            <div className="mt-1.5 text-[26px] font-bold leading-tight text-[#0b1220] dark:text-white">
              {projects.length}
            </div>
          </div>

          {/* Card 2: 24H REQUESTS */}
          <div className="rounded-xl border border-[#dfe4ec] bg-white p-4.5 shadow-[0_1px_2px_rgba(20,40,90,.03)] dark:border-[#1e2738] dark:bg-[#121927]">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b] dark:text-[#8b97ab]">
              24H REQUESTS
            </div>
            <div className="mt-1.5 text-[26px] font-bold leading-tight text-[#0b1220] dark:text-white">
              {totalRequests.toLocaleString()}
            </div>
          </div>

          {/* Card 3: HEALTH */}
          <div className="rounded-xl border border-[#dfe4ec] bg-white p-4.5 shadow-[0_1px_2px_rgba(20,40,90,.03)] dark:border-[#1e2738] dark:bg-[#121927]">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b] dark:text-[#8b97ab]">
              HEALTH
            </div>
            <div className="mt-2 flex items-center gap-2">
              {projects.length > 0 ? (
                <>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-[14px] font-medium text-[#0b1220] dark:text-white">
                    Healthy
                  </span>
                  <span className="ml-1 text-[12px] text-slate-400">
                    ({connectedCount} of {projects.length} active)
                  </span>
                </>
              ) : (
                <>
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                  <span className="text-[14px] font-medium text-[#0b1220] dark:text-white">
                    No active projects
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative min-w-[240px] flex-1 sm:max-w-[270px]">
            <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-[36px] w-full rounded-lg border border-[#dfe4ec] bg-white pr-3 pl-8.5 text-[13px] text-[#0b1220] placeholder-slate-400 outline-none transition focus:border-sky-500 dark:border-[#1e2738] dark:bg-[#121927] dark:text-white"
            />
          </div>

          {/* Sort By Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsSortOpen((prev) => !prev);
                setIsStatusOpen(false);
              }}
              className="flex h-[36px] cursor-pointer items-center gap-2 rounded-lg border border-[#dfe4ec] bg-white px-3 text-[13px] font-medium text-[#0b1220] transition hover:bg-slate-50 dark:border-[#1e2738] dark:bg-[#121927] dark:text-white dark:hover:bg-[#172134]"
            >
              <span>
                Sort by: {sortBy === "latest" ? "Latest" : sortBy === "name" ? "Name" : "Requests"}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {isSortOpen && (
              <div className="absolute right-0 z-20 mt-1 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-800 dark:bg-[#121927]">
                <button
                  type="button"
                  onClick={() => {
                    setSortBy("latest");
                    setIsSortOpen(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-[12.5px] hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Latest
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSortBy("name");
                    setIsSortOpen(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-[12.5px] hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Name (A-Z)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSortBy("requests");
                    setIsSortOpen(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-[12.5px] hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Most Requests
                </button>
              </div>
            )}
          </div>

          {/* Status Filter Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsStatusOpen((prev) => !prev);
                setIsSortOpen(false);
              }}
              className="flex h-[36px] cursor-pointer items-center gap-2 rounded-lg border border-[#dfe4ec] bg-white px-3 text-[13px] font-medium text-[#0b1220] transition hover:bg-slate-50 dark:border-[#1e2738] dark:bg-[#121927] dark:text-white dark:hover:bg-[#172134]"
            >
              <span>
                Status: {statusFilter === "all" ? "All" : statusFilter === "connected" ? "Connected" : "Pending"}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {isStatusOpen && (
              <div className="absolute right-0 z-20 mt-1 w-36 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-800 dark:bg-[#121927]">
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter("all");
                    setIsStatusOpen(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-[12.5px] hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter("connected");
                    setIsStatusOpen(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-[12.5px] hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Connected
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter("pending");
                    setIsStatusOpen(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-[12.5px] hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Pending
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-16 text-slate-400">
              <Loader2 className="mr-2 h-5 w-5 animate-spin text-sky-500" />
              <span>Loading projects...</span>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="col-span-full rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500 dark:border-[#1e2738]">
              {projects.length === 0
                ? "No projects found. Click 'Add Project' to get started."
                : "No projects matching your search."}
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => router.push("/dashboard")}
                className="group relative flex cursor-pointer flex-col justify-between rounded-xl border border-[#dfe4ec] bg-white p-5 shadow-[0_1px_2px_rgba(20,40,90,.03)] transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-[#1e2738] dark:bg-[#121927] dark:hover:border-slate-700"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {/* Square initial badge */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#e2e8f0] bg-[#f8fafc] font-semibold text-slate-700 uppercase dark:border-[#263148] dark:bg-[#161f30] dark:text-slate-200">
                      {getProjectInitial(project.name)}
                    </div>

                    <div>
                      <h3 className="font-semibold text-[15px] leading-tight text-[#0b1220] transition-colors group-hover:text-sky-600 dark:text-white dark:group-hover:text-sky-400">
                        {project.name}
                      </h3>
                      <div className="mt-0.5 font-mono text-[11.5px] text-[#64748b] dark:text-[#8b97ab]">
                        {project.domain}
                      </div>
                    </div>
                  </div>

                  {/* More Options Menu */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => e.stopPropagation()}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-[#1b2538] dark:hover:text-white"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-8 flex items-end justify-between border-t border-slate-100 pt-3 dark:border-[#1a2334]">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-[#64748b] dark:text-[#8b97ab]">
                      24H TRAFFIC
                    </div>
                    <div className="mt-1 text-[13px] font-medium text-[#475569] dark:text-[#cbd5e1]">
                      {(project._count?.events ?? 0).toLocaleString()} reqs
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-[#64748b] dark:text-[#8b97ab]">
                      CONNECTION
                    </div>
                    <div className="mt-1">
                      {(project._count?.events ?? 0) > 0 ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-0.5 text-[11.5px] font-medium text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Connected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/80 bg-amber-50 px-2.5 py-0.5 text-[11.5px] font-medium text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#dfe4ec]/60 dark:border-[#1a2334]">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row text-[12px] text-[#64748b] dark:text-[#8b97ab]">
          <div>Copyright 2026 Route.dev</div>
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="hover:text-[#0b1220] dark:hover:text-white transition"
            >
              Support
            </Link>
            <Link
              href="#"
              className="hover:text-[#0b1220] dark:hover:text-white transition"
            >
              Contact
            </Link>
            <Link
              href="#"
              className="hover:text-[#0b1220] dark:hover:text-white transition"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="hover:text-[#0b1220] dark:hover:text-white transition"
            >
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
