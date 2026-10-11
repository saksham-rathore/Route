"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { Search, ChevronDown, ChevronLeft, MoreVertical, Plus, Loader2 } from "lucide-react";
import DashboardSidebar, { type DashboardTab } from "@/components/dashboard/DashboardSidebar";
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

const VALID_TABS: DashboardTab[] = ["overview", "map", "endpoints", "errors", "pages", "vitals", "sessions", "installation"];

/* ---------------- Projects list ---------------- */
function OnboardingProjectsView({ projects, loading, onSelectProject }: { projects: ProjectData[]; loading: boolean; onSelectProject: (p: ProjectData) => void }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "name" | "requests">("latest");
  const [statusFilter, setStatusFilter] = useState<"all" | "connected" | "pending">("all");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const initials = session?.user?.name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || " ";
  const getProjectInitial = (name?: string) => name?.trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 1).toUpperCase() || "P";
  const signatureButtonStyle = {
    background: "radial-gradient(circle, color(srgb 0.00784314 0.517647 0.780392 / 0.68) 0%, rgb(2, 132, 199) 64%)",
    boxShadow: "0 2px 10px rgba(2, 132, 199, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
  };

  const filteredProjects = useMemo(() => {
    let list = [...projects];
    const q = search.trim().toLowerCase();
    if (q) list = list.filter((p) => p.name.toLowerCase().includes(q) || p.domain.toLowerCase().includes(q));
    if (statusFilter === "connected") list = list.filter((p) => (p._count?.events ?? 0) > 0);
    else if (statusFilter === "pending") list = list.filter((p) => (p._count?.events ?? 0) === 0);
    if (sortBy === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "requests") list.sort((a, b) => (b._count?.events ?? 0) - (a._count?.events ?? 0));
    else list.sort((a, b) => (b.createdAt ? new Date(b.createdAt).getTime() : 0) - (a.createdAt ? new Date(a.createdAt).getTime() : 0));
    return list;
  }, [projects, search, sortBy, statusFilter]);

  const connectedCount = projects.filter((p) => (p._count?.events ?? 0) > 0).length;
  const totalRequests = projects.reduce((acc, p) => acc + (p._count?.events || 0), 0);

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#eef2f6] font-sans text-[#0b1220] antialiased dark:bg-[#0c111b] dark:text-[#f1f4fa]">
      <header className="w-full">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 pt-6 pb-2">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="Route logo" className="h-7 w-7 object-contain" />
            <span className="text-[22px] font-bold tracking-tight">Route</span>
          </Link>
          <div className="flex items-center gap-3">
            {session?.user?.image ? <img src={session.user.image} alt="Avatar" className="h-9 w-9 rounded-full object-cover" /> : <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 font-medium text-white">{initials}</div>}
          </div>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-6 pt-6 pb-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[26px] sm:text-[28px] font-bold tracking-tight">Projects</h1>
            <p className="mt-1 text-[13.5px] text-[#64748b]">Monitoring performance across active projects</p>
          </div>
          <button onClick={() => router.push("/Onboarding")} type="button" style={signatureButtonStyle} className="flex h-[38px] cursor-pointer items-center justify-center gap-1.5 rounded-lg px-4 text-[13.5px] font-semibold text-white">
            <Plus className="h-4 w-4 stroke-[2.5]" /><span>Add Project</span>
          </button>
        </div>
        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[#dfe4ec] bg-white p-4.5 dark:border-[#1e2738] dark:bg-[#121927]"><div className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">PROJECTS</div><div className="mt-1.5 text-[26px] font-bold">{projects.length}</div></div>
          <div className="rounded-xl border border-[#dfe4ec] bg-white p-4.5 dark:border-[#1e2738] dark:bg-[#121927]"><div className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">24H REQUESTS</div><div className="mt-1.5 text-[26px] font-bold">{totalRequests.toLocaleString()}</div></div>
          <div className="rounded-xl border border-[#dfe4ec] bg-white p-4.5 dark:border-[#1e2738] dark:bg-[#121927]">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">HEALTH</div>
            <div className="mt-2 flex items-center gap-2">
              {projects.length > 0 ? (<><span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" /></span><span className="text-[14px] font-medium">Healthy</span><span className="ml-1 text-[12px] text-slate-400">({connectedCount} of {projects.length} active)</span></>) : (<><span className="h-2.5 w-2.5 rounded-full bg-slate-300" /><span className="text-[14px] font-medium">No active projects</span></>)}
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px] flex-1 sm:max-w-[270px]">
            <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-[36px] w-full rounded-lg border border-[#dfe4ec] bg-white pr-3 pl-8.5 text-[13px] outline-none focus:border-sky-500 dark:border-[#1e2738] dark:bg-[#121927] dark:text-white" />
          </div>
          <div className="relative">
            <button type="button" onClick={() => { setIsSortOpen((p) => !p); setIsStatusOpen(false); }} className="flex h-[36px] items-center gap-2 rounded-lg border border-[#dfe4ec] bg-white px-3 text-[13px] font-medium dark:border-[#1e2738] dark:bg-[#121927] dark:text-white">
              <span>Sort by: {sortBy === "latest" ? "Latest" : sortBy === "name" ? "Name" : "Requests"}</span><ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>
            {isSortOpen && (<div className="absolute right-0 z-20 mt-1 w-40 rounded-lg border bg-white py-1 shadow-lg dark:bg-[#121927]">{(["latest", "name", "requests"] as const).map((s) => (<button key={s} type="button" onClick={() => { setSortBy(s); setIsSortOpen(false); }} className="w-full px-3 py-1.5 text-left text-[12.5px] hover:bg-slate-100">{s}</button>))}</div>)}
          </div>
          <div className="relative">
            <button type="button" onClick={() => { setIsStatusOpen((p) => !p); setIsSortOpen(false); }} className="flex h-[36px] items-center gap-2 rounded-lg border border-[#dfe4ec] bg-white px-3 text-[13px] font-medium dark:border-[#1e2738] dark:bg-[#121927] dark:text-white">
              <span>Status: {statusFilter}</span><ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>
            {isStatusOpen && (<div className="absolute right-0 z-20 mt-1 w-36 rounded-lg border bg-white py-1 shadow-lg dark:bg-[#121927]">{(["all", "connected", "pending"] as const).map((s) => (<button key={s} type="button" onClick={() => { setStatusFilter(s); setIsStatusOpen(false); }} className="w-full px-3 py-1.5 text-left text-[12.5px] hover:bg-slate-100">{s}</button>))}</div>)}
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (<div className="col-span-full flex items-center justify-center py-16 text-slate-400"><Loader2 className="mr-2 h-5 w-5 animate-spin text-sky-500" /><span>Loading projects...</span></div>)
          : filteredProjects.length === 0 ? (<div className="col-span-full rounded-xl border border-dashed p-10 text-center text-slate-500">{projects.length === 0 ? "No projects found. Click 'Add Project' to get started." : "No projects matching your search."}</div>)
          : (filteredProjects.map((project) => (
            <div key={project.id} onClick={() => onSelectProject(project)} className="group relative flex cursor-pointer flex-col justify-between rounded-xl border border-[#dfe4ec] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md dark:border-[#1e2738] dark:bg-[#121927]">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-slate-50 font-semibold uppercase">{getProjectInitial(project.name)}</div>
                  <div><h3 className="font-semibold text-[15px] group-hover:text-sky-600">{project.name}</h3><div className="mt-0.5 font-mono text-[11.5px] text-[#64748b]">{project.domain}</div></div>
                </div>
                <button type="button" onClick={(e) => e.stopPropagation()} className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100"><MoreVertical className="h-4 w-4" /></button>
              </div>
              <div className="mt-8 flex items-end justify-between border-t border-slate-100 pt-3 dark:border-[#1a2334]">
                <div><div className="text-[10px] font-semibold uppercase tracking-wider text-[#64748b]">24H TRAFFIC</div><div className="mt-1 text-[13px] font-medium">{(project._count?.events ?? 0).toLocaleString()} reqs</div></div>
                <div className="text-right"><div className="text-[10px] font-semibold uppercase tracking-wider text-[#64748b]">CONNECTION</div><div className="mt-1">{(project._count?.events ?? 0) > 0 ? (<span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11.5px] font-medium text-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Connected</span>) : (<span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11.5px] font-medium text-amber-700"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" />Pending</span>)}</div></div>
              </div>
            </div>
          )))}
        </div>
      </main>
    </div>
  );
}

/* ---------------- Analytics shell ---------------- */
function DashboardAnalyticsView({ project, onBackToProjects }: { project?: ProjectData | null; onBackToProjects: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryTab = searchParams.get("tab");
  const { data: session } = authClient.useSession();
  const [activeTab, setActiveTab] = useState<DashboardTab>(VALID_TABS.includes((queryTab as DashboardTab) || "") ? (queryTab as DashboardTab) : "overview");
  const [range, setRange] = useState<RangeKey>("24h");

  useEffect(() => {
    if (queryTab && VALID_TABS.includes(queryTab as DashboardTab)) setActiveTab(queryTab as DashboardTab);
  }, [queryTab]);

  const handleTabChange = useCallback((tab: string) => {
    const next = (VALID_TABS.includes(tab as DashboardTab) ? tab : "overview") as DashboardTab;
    setActiveTab(next);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", next);
    window.history.pushState(null, "", url.toString());
  }, []);

  const pid = project?.id || project?.projectId || null;

  return (
    <div className="h-screen w-full bg-[#eef2f7] font-sans antialiased flex overflow-hidden">
      <div className="shrink-0 h-full border-r border-slate-200/80 bg-white px-3 py-3">
        <DashboardSidebar activeTab={activeTab} onTabChange={handleTabChange} onBackToProjects={onBackToProjects} onAddProject={() => router.push("/Onboarding")} />
      </div>
      <main className="min-w-0 flex-1 h-full overflow-y-auto no-scrollbar px-4.5 py-3.5 sm:px-6 flex flex-col gap-3.5">
        <div className="flex items-center justify-between pb-0.5">
          <div className="flex items-center gap-3 text-[12px]">
            <button type="button" onClick={onBackToProjects} className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11.5px] font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer dark:border-slate-800 dark:bg-[#121927] dark:text-slate-300">
              <ChevronLeft className="h-3 w-3" /><span>All Projects</span>
            </button>
            <span className="font-semibold text-slate-800 dark:text-white">{project?.name ?? "Select project"}</span>
            <span className="flex items-center gap-1.5 font-medium text-emerald-600"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" /></span>Live</span>
            <span className="text-slate-400">{range} range</span>
          </div>
          <button type="button" onClick={() => handleTabChange("installation")} style={{ background: "radial-gradient(circle, color(srgb 0.00784314 0.517647 0.780392 / 0.68) 0%, rgb(2, 132, 199) 64%)" }} className="rounded-lg px-4 py-2 text-[12.5px] font-semibold text-white cursor-pointer">Get Started</button>
        </div>

        {activeTab === "overview" && <OverviewView projectId={pid} projectName={project?.name} range={range} onRangeChange={setRange} />}
        {activeTab === "map" && <GlobalMapView projectId={pid} range={range} onRangeChange={setRange} />}
        {activeTab === "sessions" && <SessionsView projectId={pid} range={range} onRangeChange={setRange} />}
        {activeTab === "errors" && <ErrorsView projectId={pid} range={range} onRangeChange={setRange} />}
        {activeTab === "endpoints" && <EndpointsView projectId={pid} range={range} onRangeChange={setRange} />}
        {activeTab === "vitals" && <WebVitalsDashboardView project={project} />}
        {activeTab === "pages" && <PagePerformanceDashboardView project={project} />}
        {activeTab === "installation" && <InstallationGuideView projectId={project?.projectId || project?.id || ""} domain={project?.domain || ""} />}
      </main>
      <div className="shrink-0 h-full border-l border-slate-200/80 bg-[#f5f6f9]/50 px-3.5 py-3.5 overflow-y-auto no-scrollbar dark:border-[#1e2738] dark:bg-[#0c111b] hidden xl:block">
        <DashboardRightPanel project={project} user={session?.user} onNavigateTab={handleTabChange} />
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
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(queryProjectId);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const res = await fetch("/api/projects");
        const data = await res.json();
        if (data.projects && Array.isArray(data.projects)) {
          setProjects(data.projects);
          if (data.projects.length === 0) router.push("/Onboarding");
        }
      } catch (err) {
        console.error("Failed to load projects:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, [router]);

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
    const activeProject = projects.find((p) => p.id === selectedProjectId || p.projectId === selectedProjectId) || projects[0] || null;
    return <DashboardAnalyticsView project={activeProject} onBackToProjects={handleBackToProjects} />;
  }

  return <OnboardingProjectsView projects={projects} loading={loading} onSelectProject={handleSelectProject} />;
}

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardCoordinator />
    </Suspense>
  );
}
