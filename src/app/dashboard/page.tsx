"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  MoreVertical,
  Plus,
  Loader2,
  Copy,
  Check,
  Globe,
  Trash2,
  Pencil,
  Code2,
  LayoutDashboard,
  AlertTriangle,
  X,
} from "lucide-react";
import DashboardSidebar, {
  type DashboardTab,
} from "@/components/dashboard/DashboardSidebar";
import DashboardRightPanel from "@/components/dashboard/DashboardPanels";
import OverviewView from "@/components/dashboard/OverviewView";
import GlobalMapView from "@/components/dashboard/GlobalMapView";
import SessionsView from "@/components/dashboard/SessionsView";
import ErrorsView from "@/components/dashboard/ErrorsView";
import EndpointsView from "@/components/dashboard/EndpointsView";
import InstallationGuideView from "@/components/dashboard/InstallationGuideView";
import WebVitalsDashboardView from "@/components/dashboard/WebVitalsDashboardView";
import PagePerformanceDashboardView from "@/components/dashboard/PagePerformanceDashboardView";
import type { RangeKey } from "@/components/dashboard/shared";
import { useProjectRealtime } from "@/hooks/use-project-realtime";
import { authClient } from "../../../lib/auth-client";

interface ProjectData {
  id: string;
  projectId?: string;
  name: string;
  domain: string;
  framework?: string;
  _count?: { events?: number; analyticsSessions?: number; visitors?: number };
  createdAt?: string;
}

const VALID_TABS: DashboardTab[] = [
  "overview",
  "map",
  "endpoints",
  "errors",
  "pages",
  "vitals",
  "sessions",
  "installation",
];

/* ---------------- Projects list ---------------- */
function OnboardingProjectsView({
  projects,
  loading,
  onSelectProject,
  onRefreshProjects,
}: {
  projects: ProjectData[];
  loading: boolean;
  onSelectProject: (p: ProjectData) => void;
  onRefreshProjects?: () => void;
}) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [localProjects, setLocalProjects] = useState<ProjectData[]>(projects);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "name" | "requests">(
    "latest",
  );
  const [statusFilter, setStatusFilter] = useState<
    "all" | "connected" | "pending"
  >("all");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  useEffect(() => {
    setLocalProjects(projects);
  }, [projects]);

  // 3-dots Menu & Modals state
  const [menuOpenProjectId, setMenuOpenProjectId] = useState<string | null>(null);
  const [snippetModalProject, setSnippetModalProject] = useState<ProjectData | null>(null);
  const [renameProject, setRenameProject] = useState<ProjectData | null>(null);
  const [renameName, setRenameName] = useState("");
  const [isSubmittingRename, setIsSubmittingRename] = useState(false);
  const [deleteConfirmProject, setDeleteConfirmProject] = useState<ProjectData | null>(null);
  const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2500);
  };

  useEffect(() => {
    const handleGlobalClick = () => setMenuOpenProjectId(null);
    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  const handleRenameSubmit = async () => {
    if (!renameProject || !renameName.trim()) return;
    const trimmed = renameName.trim();
    if (trimmed.length < 2) {
      showToast("Project name must have at least 2 characters");
      return;
    }
    try {
      setIsSubmittingRename(true);
      const res = await fetch(`/api/projects/${renameProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      if (res.ok) {
        showToast(`Project renamed to "${trimmed}"`);
        setLocalProjects((prev) =>
          prev.map((p) =>
            p.id === renameProject.id ? { ...p, name: trimmed } : p
          )
        );
        setRenameProject(null);
        if (onRefreshProjects) onRefreshProjects();
      } else {
        const data = await res.json().catch(() => null);
        showToast(data?.error || "Failed to rename project");
      }
    } catch {
      showToast("Network error renaming project");
    } finally {
      setIsSubmittingRename(false);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!deleteConfirmProject) return;
    const targetId = deleteConfirmProject.id;
    const targetName = deleteConfirmProject.name;
    try {
      setIsSubmittingDelete(true);
      const res = await fetch(`/api/projects/${targetId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast(`Project "${targetName}" deleted`);
        setLocalProjects((prev) => prev.filter((p) => p.id !== targetId));
        setDeleteConfirmProject(null);
        if (onRefreshProjects) onRefreshProjects();
      } else {
        const data = await res.json().catch(() => null);
        showToast(data?.error || "Failed to delete project");
      }
    } catch {
      showToast("Network error deleting project");
    } finally {
      setIsSubmittingDelete(false);
    }
  };

  const initials =
    session?.user?.name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || " ";
  const getProjectInitial = (name?: string) =>
    name
      ?.trim()
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .slice(0, 1)
      .toUpperCase() || "P";
  const signatureButtonStyle = {
    background:
      "radial-gradient(circle, color(srgb 0.00784314 0.517647 0.780392 / 0.68) 0%, rgb(2, 132, 199) 64%)",
    boxShadow:
      "0 2px 10px rgba(2, 132, 199, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
  };

  const filteredProjects = useMemo(() => {
    let list = [...localProjects];
    const q = search.trim().toLowerCase();
    if (q)
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.domain.toLowerCase().includes(q),
      );
    if (statusFilter === "connected")
      list = list.filter((p) => (p._count?.events ?? 0) > 0);
    else if (statusFilter === "pending")
      list = list.filter((p) => (p._count?.events ?? 0) === 0);
    if (sortBy === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "requests")
      list.sort((a, b) => (b._count?.events ?? 0) - (a._count?.events ?? 0));
    else
      list.sort(
        (a, b) =>
          (b.createdAt ? new Date(b.createdAt).getTime() : 0) -
          (a.createdAt ? new Date(a.createdAt).getTime() : 0),
      );
    return list;
  }, [localProjects, search, sortBy, statusFilter]);

  const connectedCount = localProjects.filter(
    (p) => (p._count?.events ?? 0) > 0,
  ).length;
  const totalRequests = localProjects.reduce(
    (acc, p) => acc + (p._count?.events || 0),
    0,
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#eef2f6] font-sans text-[#0b1220] antialiased dark:bg-[#0c111b] dark:text-[#f1f4fa]">
      <header className="w-full">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 pt-6 pb-2">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/logo.svg"
              alt="Route logo"
              className="h-7 w-7 object-contain"
            />
            <span className="text-[22px] font-bold tracking-tight">Route</span>
          </Link>
          <div className="flex items-center gap-3">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt="Avatar"
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

      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-6 pt-6 pb-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[26px] sm:text-[28px] font-bold tracking-tight">
              Projects
            </h1>
            <p className="mt-1 text-[13.5px] text-[#64748b]">
              Monitoring performance across active projects
            </p>
          </div>
          <button
            onClick={() => router.push("/Onboarding")}
            type="button"
            style={signatureButtonStyle}
            className="flex h-[38px] cursor-pointer items-center justify-center gap-1.5 rounded-lg px-4 text-[13.5px] font-semibold text-white transition hover:brightness-105 active:scale-[0.99]"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Add Project</span>
          </button>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[#dfe4ec] bg-white p-4.5 dark:border-[#1e2738] dark:bg-[#121927]">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
              PROJECTS
            </div>
            <div className="mt-1.5 text-[26px] font-bold">
              {localProjects.length}
            </div>
          </div>
          <div className="rounded-xl border border-[#dfe4ec] bg-white p-4.5 dark:border-[#1e2738] dark:bg-[#121927]">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
              24H REQUESTS
            </div>
            <div className="mt-1.5 text-[26px] font-bold">
              {totalRequests.toLocaleString()}
            </div>
          </div>
          <div className="rounded-xl border border-[#dfe4ec] bg-white p-4.5 dark:border-[#1e2738] dark:bg-[#121927]">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">
              HEALTH
            </div>
            <div className="mt-2 flex items-center gap-2">
              {localProjects.length > 0 ? (
                <>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-[14px] font-medium">Healthy</span>
                  <span className="ml-1 text-[12px] text-slate-400">
                    ({connectedCount} of {localProjects.length} active)
                  </span>
                </>
              ) : (
                <>
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  <span className="text-[14px] font-medium">
                    No active projects
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px] flex-1 sm:max-w-[270px]">
            <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-[36px] w-full rounded-lg border border-[#dfe4ec] bg-white pr-3 pl-8.5 text-[13px] outline-none focus:border-sky-500 dark:border-[#1e2738] dark:bg-[#121927] dark:text-white"
            />
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsSortOpen((p) => !p);
                setIsStatusOpen(false);
              }}
              className="flex h-[36px] items-center gap-2 rounded-lg border border-[#dfe4ec] bg-white px-3 text-[13px] font-medium dark:border-[#1e2738] dark:bg-[#121927] dark:text-white cursor-pointer"
            >
              <span>
                Sort by:{" "}
                {sortBy === "latest"
                  ? "Latest"
                  : sortBy === "name"
                    ? "Name"
                    : "Requests"}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>
            {isSortOpen && (
              <div className="absolute right-0 z-20 mt-1 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-800 dark:bg-[#121927]">
                {(["latest", "name", "requests"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setSortBy(s);
                      setIsSortOpen(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-[12.5px] hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    {s === "latest" ? "Latest" : s === "name" ? "Name (A-Z)" : "Most Requests"}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsStatusOpen((p) => !p);
                setIsSortOpen(false);
              }}
              className="flex h-[36px] items-center gap-2 rounded-lg border border-[#dfe4ec] bg-white px-3 text-[13px] font-medium dark:border-[#1e2738] dark:bg-[#121927] dark:text-white cursor-pointer"
            >
              <span>Status: {statusFilter}</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>
            {isStatusOpen && (
              <div className="absolute right-0 z-20 mt-1 w-36 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-800 dark:bg-[#121927]">
                {(["all", "connected", "pending"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setStatusFilter(s);
                      setIsStatusOpen(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-[12.5px] hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer capitalize"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-16 text-slate-400">
              <Loader2 className="mr-2 h-5 w-5 animate-spin text-sky-500" />
              <span>Loading projects...</span>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="col-span-full rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500 dark:border-[#1e2738]">
              {localProjects.length === 0
                ? "No projects found. Click 'Add Project' to get started."
                : "No projects matching your search."}
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className={`group relative flex cursor-pointer flex-col justify-between rounded-xl border border-[#dfe4ec] bg-white p-5 shadow-[0_1px_2px_rgba(20,40,90,.03)] transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-[#1e2738] dark:bg-[#121927] dark:hover:border-slate-700 ${
                  menuOpenProjectId === project.id ? "z-30 ring-1 ring-slate-300 dark:ring-slate-700" : "z-0"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
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

                  {/* 3-dots Menu Button and Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenProjectId((prev) => (prev === project.id ? null : project.id));
                      }}
                      className={`flex h-7 w-7 items-center justify-center rounded-md transition cursor-pointer ${
                        menuOpenProjectId === project.id
                          ? "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-white"
                          : "text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-[#1b2538] dark:hover:text-white"
                      }`}
                      title="Project options"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>

                    {menuOpenProjectId === project.id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 top-8 z-40 w-52 rounded-xl border border-slate-200/90 bg-white py-1.5 shadow-xl inside-shadow dark:border-slate-800 dark:bg-[#121927]"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setMenuOpenProjectId(null);
                            onSelectProject(project);
                          }}
                          className="flex w-full items-center gap-2.5 px-3 py-2 text-[12px] font-medium text-slate-700 transition hover:bg-slate-50 cursor-pointer dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                          <LayoutDashboard className="h-3.5 w-3.5 text-slate-400" />
                          <span>Open Dashboard</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setMenuOpenProjectId(null);
                            setSnippetModalProject(project);
                          }}
                          className="flex w-full items-center gap-2.5 px-3 py-2 text-[12px] font-medium text-slate-700 transition hover:bg-slate-50 cursor-pointer dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                          <Code2 className="h-3.5 w-3.5 text-slate-400" />
                          <span>Tracking Snippet</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setMenuOpenProjectId(null);
                            navigator.clipboard.writeText(project.projectId || project.id);
                            showToast("Project ID copied to clipboard");
                          }}
                          className="flex w-full items-center gap-2.5 px-3 py-2 text-[12px] font-medium text-slate-700 transition hover:bg-slate-50 cursor-pointer dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                          <Copy className="h-3.5 w-3.5 text-slate-400" />
                          <span>Copy Project ID</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setMenuOpenProjectId(null);
                            navigator.clipboard.writeText(project.domain);
                            showToast("Domain copied to clipboard");
                          }}
                          className="flex w-full items-center gap-2.5 px-3 py-2 text-[12px] font-medium text-slate-700 transition hover:bg-slate-50 cursor-pointer dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                          <Globe className="h-3.5 w-3.5 text-slate-400" />
                          <span>Copy Domain</span>
                        </button>

                        <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                        <button
                          type="button"
                          onClick={() => {
                            setMenuOpenProjectId(null);
                            setRenameProject(project);
                            setRenameName(project.name);
                          }}
                          className="flex w-full items-center gap-2.5 px-3 py-2 text-[12px] font-medium text-slate-700 transition hover:bg-slate-50 cursor-pointer dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                          <Pencil className="h-3.5 w-3.5 text-slate-400" />
                          <span>Rename Project</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setMenuOpenProjectId(null);
                            setDeleteConfirmProject(project);
                          }}
                          className="flex w-full items-center gap-2.5 px-3 py-2 text-[12px] font-medium text-rose-600 transition hover:bg-rose-50 cursor-pointer dark:text-rose-400 dark:hover:bg-rose-950/30"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                          <span>Delete Project</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

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

      {/* Rename Modal */}
      {renameProject && (
        <div
          onClick={() => setRenameProject(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl inside-shadow dark:border-slate-800 dark:bg-[#121927]"
          >
            <div className="flex items-center justify-between pb-3">
              <h3 className="text-[17px] font-bold text-slate-900 dark:text-white">
                Rename Project
              </h3>
              <button
                type="button"
                onClick={() => setRenameProject(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-[12.5px] text-slate-500 pb-4 dark:text-slate-400">
              Change the display name of your project. The tracking project ID and domain will remain unchanged.
            </p>

            <div className="space-y-1.5 pb-5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Project Name
              </label>
              <input
                type="text"
                value={renameName}
                onChange={(e) => setRenameName(e.target.value)}
                placeholder="e.g. My Website"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRenameSubmit();
                }}
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-900 inside-shadow-inset outline-none focus:border-sky-500 dark:border-slate-800 dark:bg-[#0c111b] dark:text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setRenameProject(null)}
                className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 cursor-pointer dark:border-slate-800 dark:bg-[#121927] dark:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmittingRename || renameName.trim().length < 2}
                onClick={handleRenameSubmit}
                style={{
                  background:
                    "radial-gradient(circle, color(srgb 0.00784314 0.517647 0.780392 / 0.68) 0%, rgb(2, 132, 199) 64%)",
                }}
                className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-[12.5px] font-semibold text-white shadow-xs transition hover:brightness-105 disabled:opacity-50 cursor-pointer"
              >
                {isSubmittingRename && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmProject && (
        <div
          onClick={() => setDeleteConfirmProject(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl inside-shadow dark:border-slate-800 dark:bg-[#121927]"
          >
            <div className="flex items-start gap-3.5 pb-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-slate-900 dark:text-white">
                  Delete Project?
                </h3>
                <p className="mt-1 text-[12.5px] text-slate-500 leading-relaxed dark:text-slate-400">
                  Are you sure you want to delete <strong className="text-slate-800 dark:text-white font-semibold">{deleteConfirmProject.name}</strong> ({deleteConfirmProject.domain})? This will permanently delete all associated analytics, events, and metrics.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteConfirmProject(null)}
                className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 cursor-pointer dark:border-slate-800 dark:bg-[#121927] dark:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmittingDelete}
                onClick={handleDeleteSubmit}
                className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-[12.5px] font-semibold text-white shadow-xs transition hover:bg-rose-700 disabled:opacity-50 cursor-pointer"
              >
                {isSubmittingDelete && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>Delete Project</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Snippet Modal */}
      {snippetModalProject && (
        <div
          onClick={() => setSnippetModalProject(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl inside-shadow dark:border-slate-800 dark:bg-[#121927]"
          >
            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <Code2 className="h-5 w-5 text-sky-600" />
                <h3 className="text-[17px] font-bold text-slate-900 dark:text-white">
                  Tracking Snippet
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSnippetModalProject(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-[12.5px] text-slate-500 pb-3 dark:text-slate-400">
              Add this snippet inside your website&apos;s <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px] text-teal-600 dark:bg-slate-800">&lt;head&gt;</code> for <strong>{snippetModalProject.name}</strong> ({snippetModalProject.domain}).
            </p>

            <pre className="overflow-x-auto rounded-lg border border-slate-200/70 bg-[#fbfbfa] p-3.5 font-mono text-[11px] leading-[1.65] text-slate-700 inside-shadow-inset select-all dark:border-slate-800 dark:bg-[#0c111b] dark:text-slate-300">
              <code>
                {`<script\n  src="https://t.raah.dev/script.js"\n  data-pid="${snippetModalProject.projectId || snippetModalProject.id}"\n  data-domain="${snippetModalProject.domain}"\n  strategy="afterInteractive"\n/>`}
              </code>
            </pre>

            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `<script\n  src="https://t.raah.dev/script.js"\n  data-pid="${snippetModalProject.projectId || snippetModalProject.id}"\n  data-domain="${snippetModalProject.domain}"\n  strategy="afterInteractive"\n/>`
                  );
                  showToast("Snippet copied to clipboard");
                }}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 cursor-pointer dark:border-slate-800 dark:bg-[#121927] dark:text-slate-200"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Snippet</span>
              </button>
              <button
                type="button"
                onClick={() => setSnippetModalProject(null)}
                className="rounded-lg bg-slate-900 px-4 py-2 text-[12.5px] font-semibold text-white hover:bg-slate-800 cursor-pointer dark:bg-slate-100 dark:text-slate-900"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white/95 backdrop-blur-md px-4 py-2.5 text-[13px] font-medium text-slate-800 shadow-xl inside-shadow dark:border-slate-800 dark:bg-[#121927]/95 dark:text-white">
          <Check className="h-4 w-4 text-emerald-500" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

/* ---------------- Analytics shell ---------------- */
function DashboardAnalyticsView({
  project,
  onBackToProjects,
}: {
  project?: ProjectData | null;
  onBackToProjects: () => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryTab = searchParams.get("tab");
  const { data: session } = authClient.useSession();
  const [activeTab, setActiveTab] = useState<DashboardTab>(
    VALID_TABS.includes((queryTab as DashboardTab) || "")
      ? (queryTab as DashboardTab)
      : "overview",
  );
  const [range, setRange] = useState<RangeKey>("24h");

  useEffect(() => {
    if (queryTab && VALID_TABS.includes(queryTab as DashboardTab))
      setActiveTab(queryTab as DashboardTab);
  }, [queryTab]);

  const handleTabChange = useCallback((tab: string) => {
    const next = (
      VALID_TABS.includes(tab as DashboardTab) ? tab : "overview"
    ) as DashboardTab;
    setActiveTab(next);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", next);
    window.history.pushState(null, "", url.toString());
  }, []);

  const pid = project?.id || project?.projectId || null;
  const { connected, live, lastIngest } = useProjectRealtime(pid);

  return (
    <div className="h-screen w-full bg-[#eef2f7] font-sans antialiased flex overflow-hidden">
      <div className="shrink-0 h-full border-r border-slate-200/80 bg-white px-3 py-3">
        <DashboardSidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onBackToProjects={onBackToProjects}
          onAddProject={() => router.push("/Onboarding")}
        />
      </div>
      <main className="min-w-0 flex-1 h-full overflow-y-auto no-scrollbar px-4.5 py-3.5 sm:px-6 flex flex-col gap-3.5">
        <div className="flex items-center justify-between pb-0.5">
          <div className="flex items-center gap-3 text-[12px]">
            <button
              type="button"
              onClick={onBackToProjects}
              className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11.5px] font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer dark:border-slate-800 dark:bg-[#121927] dark:text-slate-300"
            >
              <ChevronLeft className="h-3 w-3" />
              <span>All Projects</span>
            </button>
            <span className="font-semibold text-slate-800 dark:text-white">
              {project?.name ?? "Select project"}
            </span>
            {live ? (
              <span className="flex items-center gap-1.5 font-medium text-emerald-600">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Live
              </span>
            ) : connected ? (
              <span className="flex items-center gap-1.5 font-medium text-amber-600">
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
                Connected · idle
              </span>
            ) : (
              <span className="flex items-center gap-1.5 font-medium text-slate-400">
                <span className="relative inline-flex h-2 w-2 rounded-full bg-slate-300" />
                Waiting for script
              </span>
            )}
            {lastIngest && live && (
              <span className="hidden text-slate-400 md:inline">
                +{lastIngest.counts.total} ev · {lastIngest.page ?? "/"}
              </span>
            )}
            <span className="text-slate-400">{range} range</span>
          </div>
          <button
            type="button"
            onClick={() => handleTabChange("installation")}
            style={{
              background:
                "radial-gradient(circle, color(srgb 0.00784314 0.517647 0.780392 / 0.68) 0%, rgb(2, 132, 199) 64%)",
            }}
            className="rounded-lg px-4 py-2 text-[12.5px] font-semibold text-white cursor-pointer"
          >
            Get Started
          </button>
        </div>

        {activeTab === "overview" && (
          <OverviewView
            projectId={pid}
            projectName={project?.name}
            range={range}
            onRangeChange={setRange}
          />
        )}
        {activeTab === "map" && (
          <GlobalMapView
            projectId={pid}
            range={range}
            onRangeChange={setRange}
          />
        )}
        {activeTab === "sessions" && (
          <SessionsView
            projectId={pid}
            range={range}
            onRangeChange={setRange}
          />
        )}
        {activeTab === "errors" && (
          <ErrorsView projectId={pid} range={range} onRangeChange={setRange} />
        )}
        {activeTab === "endpoints" && (
          <EndpointsView
            projectId={pid}
            range={range}
            onRangeChange={setRange}
          />
        )}
        {activeTab === "vitals" && <WebVitalsDashboardView project={project} />}
        {activeTab === "pages" && (
          <PagePerformanceDashboardView project={project} />
        )}
        {activeTab === "installation" && (
          <InstallationGuideView
            projectId={project?.projectId || project?.id || ""}
            domain={project?.domain || ""}
            initialFramework={project?.framework}
            realtime={{ connected, live }}
          />
        )}
      </main>
      <div className="shrink-0 h-full border-l border-slate-200/80 bg-[#f5f6f9]/50 px-3.5 py-3.5 overflow-y-auto no-scrollbar dark:border-[#1e2738] dark:bg-[#0c111b] hidden xl:block">
        <DashboardRightPanel
          project={project}
          user={session?.user}
          onNavigateTab={handleTabChange}
        />
      </div>
    </div>
  );
}

function DashboardCoordinator() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryProjectId = searchParams.get("projectId");
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    queryProjectId,
  );

  const fetchProjects = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.projects && Array.isArray(data.projects)) {
        setProjects(data.projects);
        if (data.projects.length === 0) router.push("/Onboarding");
      }
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchProjects(false);
  }, [fetchProjects]);

  useEffect(() => {
    if (queryProjectId) setSelectedProjectId(queryProjectId);
  }, [queryProjectId]);

  const handleSelectProject = (proj: ProjectData) => {
    setSelectedProjectId(proj.id);
    const url = new URL(window.location.href);
    url.searchParams.set("projectId", proj.id);
    window.history.pushState(null, "", url.toString());
  };

  const handleBackToProjects = () => {
    setSelectedProjectId(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("projectId");
    window.history.pushState(null, "", url.toString());
  };

  if (selectedProjectId) {
    const activeProject =
      projects.find(
        (p) => p.id === selectedProjectId || p.projectId === selectedProjectId,
      ) ||
      projects[0] ||
      null;
    return (
      <DashboardAnalyticsView
        project={activeProject}
        onBackToProjects={handleBackToProjects}
      />
    );
  }

  return (
    <OnboardingProjectsView
      projects={projects}
      loading={loading}
      onSelectProject={handleSelectProject}
      onRefreshProjects={() => fetchProjects(true)}
    />
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardCoordinator />
    </Suspense>
  );
}
