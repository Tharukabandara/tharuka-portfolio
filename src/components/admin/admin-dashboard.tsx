"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  Database,
  ExternalLink,
  FileText,
  FolderGit2,
  Inbox,
  Loader2,
  LogOut,
  Mail,
  Plus,
  RefreshCw,
  Save,
  Settings,
  ShieldCheck,
  Trash2,
  Upload,
  UserCheck,
} from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { SystemDiagnostics } from "@/lib/supabase/server";
import type { SiteSettings, ContactSubmissionRecord } from "@/lib/portfolio-repository";
import type { Project, ProjectCategory } from "@/data/projects";
import type { ExperienceItem } from "@/data/experience";

type TabId = "overview" | "inbox" | "profile" | "projects" | "experience";

const emptyProject: Project = {
  slug: "",
  title: "",
  subtitle: "",
  category: "Full-Stack / E-Commerce",
  context: "Full-Stack Project",
  summary: "",
  description: "",
  problem: "",
  role: "Full-Stack Developer",
  architecture: {
    overview: "",
    layers: [],
  },
  features: [],
  challenges: [],
  outcomes: [],
  stack: [],
  status: "Completed",
  featured: true,
  accentColor: "cyan",
  links: { github: "", demo: "" },
};

const emptyExperience: ExperienceItem = {
  id: "",
  company: "",
  companyLocation: "",
  role: "",
  employmentType: "Internship",
  period: "",
  startDate: "",
  endDate: "",
  current: false,
  projectHighlight: "",
  summary: "",
  responsibilities: [],
  domains: [],
  technologies: [],
};

export function AdminDashboard({
  diagnostics,
  isAuthenticatedAdmin,
  initialSite,
  initialProjects,
  initialExperiences,
  initialSubmissions,
}: {
  diagnostics: SystemDiagnostics;
  isAuthenticatedAdmin: boolean;
  initialSite: SiteSettings;
  initialProjects: Project[];
  initialExperiences: ExperienceItem[];
  initialSubmissions: ContactSubmissionRecord[];
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [banner, setBanner] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  // State mirrors for live UI updates
  const [siteState, setSiteState] = useState<SiteSettings>(initialSite);
  const [projectsState, setProjectsState] = useState<Project[]>(initialProjects);
  const [experiencesState, setExperiencesState] =
    useState<ExperienceItem[]>(initialExperiences);
  const [submissions, setSubmissions] =
    useState<ContactSubmissionRecord[]>(initialSubmissions);

  // Project editor state
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [stackInput, setStackInput] = useState("");
  const [featuresInput, setFeaturesInput] = useState("");
  const [challengesInput, setChallengesInput] = useState("");
  const [outcomesInput, setOutcomesInput] = useState("");

  // Experience editor state
  const [editingExp, setEditingExp] = useState<ExperienceItem | null>(null);
  const [respInput, setRespInput] = useState("");
  const [domainsInput, setDomainsInput] = useState("");
  const [techInput, setTechInput] = useState("");

  const startEditProject = (proj: Project) => {
    setEditingProject({ ...proj, links: { ...proj.links } });
    setStackInput(proj.stack.join(", "));
    setFeaturesInput(proj.features.join("\n"));
    setChallengesInput(proj.challenges.join("\n"));
    setOutcomesInput(proj.outcomes.join("\n"));
  };

  const startEditExp = (exp: ExperienceItem) => {
    setEditingExp({ ...exp });
    setRespInput(exp.responsibilities.join("\n"));
    setDomainsInput(exp.domains.join(", "));
    setTechInput(exp.technologies.join(", "));
  };

  const handleSeedDatabase = async () => {
    setBusy(true);
    setBanner(null);
    try {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      const data = await res.json();
      setBanner({ ok: Boolean(data.ok), text: data.message });
      if (data.ok) {
        if (data.cvPath || data.portraitPath) {
          setSiteState((prev) => ({
            ...prev,
            cvPath: data.cvPath || prev.cvPath,
            portraitPath: data.portraitPath || prev.portraitPath,
          }));
        }
        router.refresh();
      }
    } catch {
      setBanner({ ok: false, text: "Network error while seeding database." });
    } finally {
      setBusy(false);
    }
  };

  const handleSaveSiteSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setBanner(null);
    try {
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity: "site_settings",
          action: "upsert",
          payload: siteState,
        }),
      });
      const data = await res.json();
      setBanner({ ok: Boolean(data.ok), text: data.message });
      if (data.ok) router.refresh();
    } catch {
      setBanner({ ok: false, text: "Failed to save site settings." });
    } finally {
      setBusy(false);
    }
  };

  const handleUploadAsset = async (assetType: "portrait" | "cv", file: File) => {
    setBusy(true);
    setBanner(null);
    try {
      const formData = new FormData();
      formData.append("assetType", assetType);
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setBanner({ ok: Boolean(data.ok), text: data.message });
      if (data.ok && data.url) {
        setSiteState((prev) =>
          assetType === "cv"
            ? { ...prev, cvPath: data.url }
            : { ...prev, portraitPath: data.url }
        );
        router.refresh();
      }
    } catch {
      setBanner({ ok: false, text: "Asset upload failed." });
    } finally {
      setBusy(false);
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.slug.trim()) return;
    setBusy(true);
    setBanner(null);

    const updatedProject: Project = {
      ...editingProject,
      slug: editingProject.slug.trim().toLowerCase().replace(/\s+/g, "-"),
      stack: stackInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      features: featuresInput
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      challenges: challengesInput
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      outcomes: outcomesInput
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity: "project",
          action: "upsert",
          payload: updatedProject,
        }),
      });
      const data = await res.json();
      setBanner({ ok: Boolean(data.ok), text: data.message });
      if (data.ok) {
        setProjectsState((prev) => {
          const exists = prev.some((p) => p.slug === updatedProject.slug);
          return exists
            ? prev.map((p) => (p.slug === updatedProject.slug ? updatedProject : p))
            : [...prev, updatedProject];
        });
        setEditingProject(null);
        router.refresh();
      }
    } catch {
      setBanner({ ok: false, text: "Failed to save project." });
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteProject = async (slug: string) => {
    setBusy(true);
    setBanner(null);
    try {
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity: "project",
          action: "delete",
          payload: { slug },
        }),
      });
      const data = await res.json();
      setBanner({ ok: Boolean(data.ok), text: data.message });
      if (data.ok) {
        setProjectsState((prev) => prev.filter((p) => p.slug !== slug));
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  };

  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp || !editingExp.id.trim()) return;
    setBusy(true);
    setBanner(null);

    const updatedExp: ExperienceItem = {
      ...editingExp,
      id: editingExp.id.trim().toLowerCase().replace(/\s+/g, "-"),
      responsibilities: respInput
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      domains: domainsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      technologies: techInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity: "experience",
          action: "upsert",
          payload: updatedExp,
        }),
      });
      const data = await res.json();
      setBanner({ ok: Boolean(data.ok), text: data.message });
      if (data.ok) {
        setExperiencesState((prev) => {
          const exists = prev.some((item) => item.id === updatedExp.id);
          return exists
            ? prev.map((item) => (item.id === updatedExp.id ? updatedExp : item))
            : [...prev, updatedExp];
        });
        setEditingExp(null);
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  };

  const handleContactStatus = async (
    id: string,
    status: ContactSubmissionRecord["status"]
  ) => {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity: "contact",
          action: "status",
          payload: { id, status },
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setSubmissions((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status } : item))
        );
      }
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteContact = async (id: string) => {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity: "contact",
          action: "delete",
          payload: { id },
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setSubmissions((prev) => prev.filter((item) => item.id !== id));
      }
    } finally {
      setBusy(false);
    }
  };

  const handleSignOut = async () => {
    const supabase = createBrowserSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push("/admin/login");
    router.refresh();
  };

  const tabs: { id: TabId; label: string; icon: typeof Database; count?: number }[] = [
    { id: "overview", label: "Overview & Setup", icon: Database },
    {
      id: "inbox",
      label: "Contact Inbox",
      icon: Inbox,
      count: submissions.filter((s) => s.status === "unread").length,
    },
    { id: "profile", label: "Photo, CV & Settings", icon: Settings },
    {
      id: "projects",
      label: "Projects CMS",
      icon: FolderGit2,
      count: projectsState.length,
    },
    {
      id: "experience",
      label: "Experience CMS",
      icon: Briefcase,
      count: experiencesState.length,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="panel flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="eyebrow">Portfolio Control Center</span>
            {isAuthenticatedAdmin ? (
              <span className="badge-lime">
                <UserCheck size={12} /> Authenticated ({diagnostics.adminEmail})
              </span>
            ) : (
              <span className="rounded-full border border-amber-400/35 bg-amber-400/10 px-3 py-0.5 font-mono-code text-[10.5px] text-amber-300">
                Setup & Diagnostics Mode
              </span>
            )}
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Admin CMS, Inbox & Database Configuration
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/" className="button-secondary text-xs">
            View Live Portfolio <ExternalLink size={14} />
          </Link>
          {isAuthenticatedAdmin ? (
            <button
              type="button"
              onClick={handleSignOut}
              className="button-secondary text-xs text-rose-300"
            >
              Sign out <LogOut size={14} />
            </button>
          ) : (
            <Link href="/admin/login" className="button-primary text-xs">
              Admin Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Status Notification Banner */}
      {banner && (
        <div
          role="status"
          className={`flex items-center gap-3 rounded-xl border p-4 text-xs ${
            banner.ok
              ? "border-[#c8ff00]/40 bg-[#c8ff00]/10 text-[#eef4fa]"
              : "border-rose-500/40 bg-rose-500/10 text-rose-200"
          }`}
        >
          {banner.ok ? (
            <CheckCircle2 size={16} className="shrink-0 text-[#c8ff00]" />
          ) : (
            <AlertCircle size={16} className="shrink-0 text-rose-400" />
          )}
          <span>{banner.text}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/[0.08] pb-4">
        {tabs.map(({ id, label, icon: Icon, count }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
                active
                  ? "bg-[#20cfff] text-[#051218] shadow-[0_0_24px_rgba(32,207,255,0.35)]"
                  : "border border-white/10 bg-white/[0.02] text-[#9aa8b8] hover:border-white/25 hover:text-white"
              }`}
            >
              <Icon size={15} />
              <span>{label}</span>
              {typeof count === "number" && (
                <span
                  className={`rounded-full px-2 py-0.5 font-mono-code text-[10px] ${
                    active
                      ? "bg-[#051218]/20 text-[#051218]"
                      : "bg-white/10 text-[#dce5ed]"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & SETUP GUIDE */}
      {activeTab === "overview" && (
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="panel p-7 sm:p-8">
            <span className="eyebrow">
              <ShieldCheck size={14} /> Step-by-Step Setup Guide
            </span>
            <h2 className="mt-3 text-xl font-bold text-white">
              How to Connect Supabase PostgreSQL & Resend
            </h2>
            <ol className="mt-5 space-y-4 text-xs leading-6 text-[#9aa8b8]">
              <li className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                <strong className="font-mono-code text-[#20cfff]">
                  Step 1 — Create Supabase Project & Run SQL Migration:
                </strong>
                <p className="mt-1">
                  Create a free project at{" "}
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noreferrer"
                    className="text-white underline"
                  >
                    supabase.com/dashboard
                  </a>
                  . Open the <strong>SQL Editor</strong>, paste the contents of{" "}
                  <code className="text-[#c8ff00]">
                    supabase/migrations/001_init_portfolio_schema.sql
                  </code>
                  , and click <strong>Run</strong>. This creates your tables, RLS policies, and the{" "}
                  <code>portfolio-assets</code> storage bucket.
                </p>
              </li>

              <li className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                <strong className="font-mono-code text-[#20cfff]">
                  Step 2 — Create Your Admin User in Supabase Auth:
                </strong>
                <p className="mt-1">
                  In Supabase Dashboard → <strong>Authentication → Users → Add User</strong>, create a
                  user with email{" "}
                  <code className="text-[#c8ff00]">{diagnostics.adminEmail}</code> and a strong
                  password (check &ldquo;Auto Confirm User&rdquo;).
                </p>
              </li>

              <li className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                <strong className="font-mono-code text-[#20cfff]">
                  Step 3 — Get Resend API Key for Contact Emails:
                </strong>
                <p className="mt-1">
                  Create a free account at{" "}
                  <a
                    href="https://resend.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-white underline"
                  >
                    resend.com
                  </a>
                  , generate an API key, and set <code>RESEND_API_KEY</code> in{" "}
                  <code className="text-[#c8ff00]">.env.local</code>.
                </p>
              </li>

              <li className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                <strong className="font-mono-code text-[#20cfff]">
                  Step 4 — Seed Your Database in 1 Click:
                </strong>
                <p className="mt-1">
                  Once signed in to <code>/admin</code>, click the{" "}
                  <strong>Sync / Seed Database from Code</strong> button on the right to populate
                  Supabase with your verified projects, experience, and profile settings.
                </p>
              </li>
            </ol>
          </div>

          <div className="space-y-6">
            <div className="panel p-7 sm:p-8">
              <span className="eyebrow-lime">One-Click Database Sync</span>
              <h2 className="mt-3 text-xl font-bold text-white">
                Sync / Seed Supabase from Code
              </h2>
              <p className="mt-2 text-xs leading-6 text-[#9aa8b8]">
                Upserts your verified static data (<code className="text-white">src/data/*.ts</code>)
                into Supabase PostgreSQL (<code>site_settings</code>, <code>projects</code>, and{" "}
                <code>experiences</code>).
              </p>
              <button
                type="button"
                disabled={busy || !isAuthenticatedAdmin}
                onClick={handleSeedDatabase}
                className="button-lime mt-5 text-xs disabled:opacity-50"
              >
                {busy ? (
                  <>
                    Seeding Database <Loader2 size={14} className="animate-spin" />
                  </>
                ) : (
                  <>
                    <RefreshCw size={14} /> Sync / Seed Database from Code
                  </>
                )}
              </button>
              {!isAuthenticatedAdmin && (
                <p className="mt-2.5 font-mono-code text-[11px] text-amber-300">
                  Sign in as Admin at /admin/login after adding .env.local keys to enable seeding.
                </p>
              )}
            </div>

            <div className="panel p-7 sm:p-8">
              <span className="eyebrow">Live Environment Health</span>
              <div className="mt-4 space-y-2.5 text-xs">
                {[
                  {
                    label: "Supabase Project URL",
                    ok: diagnostics.supabaseUrlConfigured,
                  },
                  {
                    label: "Supabase Anon Key",
                    ok: diagnostics.supabaseAnonKeyConfigured,
                  },
                  {
                    label: "Supabase Service Role Key",
                    ok: diagnostics.supabaseServiceKeyConfigured,
                  },
                  {
                    label: "Resend Email API Key",
                    ok: diagnostics.resendApiKeyConfigured && diagnostics.resendKeyValidFormat,
                    statusText: !diagnostics.resendApiKeyConfigured
                      ? "Pending (.env.local)"
                      : !diagnostics.resendKeyValidFormat
                      ? "Needs 're_...' token (found UUID)"
                      : "Connected (re_...)",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-lg border border-white/[0.07] bg-white/[0.02] px-4 py-2.5"
                  >
                    <span className="text-[#dce5ed]">{item.label}</span>
                    <span
                      className={`font-mono-code text-[11px] font-semibold ${
                        item.ok ? "text-[#c8ff00]" : "text-amber-300"
                      }`}
                    >
                      {"statusText" in item && item.statusText
                        ? item.statusText
                        : item.ok
                        ? "Connected"
                        : "Pending (.env.local)"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONTACT INBOX */}
      {activeTab === "inbox" && (
        <div className="panel p-7 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="eyebrow">
                <Inbox size={14} /> Contact Submissions
              </span>
              <h2 className="mt-2 text-xl font-bold text-white">
                Messages Received ({submissions.length})
              </h2>
            </div>
          </div>

          {submissions.length === 0 ? (
            <div className="mt-8 rounded-xl border border-white/[0.07] bg-white/[0.015] p-10 text-center">
              <Mail size={28} className="mx-auto text-[#20cfff]" />
              <p className="mt-3 text-sm font-semibold text-white">
                No contact submissions in database yet.
              </p>
              <p className="mt-1 text-xs text-[#9aa8b8]">
                Once Supabase is connected, every submission on <code>/contact</code> is stored here
                automatically alongside Resend email alerts.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {submissions.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-white/[0.08] bg-[#0b1017] p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-semibold text-white">{item.subject}</span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 font-mono-code text-[10px] uppercase ${
                            item.status === "unread"
                              ? "bg-[#c8ff00]/15 text-[#c8ff00]"
                              : "bg-white/10 text-[#9aa8b8]"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[#20cfff]">
                        From: {item.name} ({item.email}) ·{" "}
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={`mailto:${item.email}?subject=${encodeURIComponent(
                          `Re: ${item.subject}`
                        )}`}
                        onClick={() => handleContactStatus(item.id, "replied")}
                        className="button-secondary !min-h-8 !px-3 text-[11px]"
                      >
                        Reply via Email
                      </a>
                      <button
                        type="button"
                        onClick={() =>
                          handleContactStatus(
                            item.id,
                            item.status === "unread" ? "read" : "unread"
                          )
                        }
                        className="rounded-lg border border-white/10 px-2.5 py-1.5 text-[11px] text-[#9aa8b8] hover:text-white"
                      >
                        Mark {item.status === "unread" ? "Read" : "Unread"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteContact(item.id)}
                        className="rounded-lg border border-rose-500/30 p-1.5 text-rose-400 hover:bg-rose-500/10"
                        aria-label="Delete submission"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="mt-4 whitespace-pre-wrap rounded-lg border border-white/[0.05] bg-[#090c10] p-4 text-xs leading-6 text-[#dce5ed]">
                    {item.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PROFILE PHOTO, CV & SITE SETTINGS */}
      {activeTab === "profile" && (
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="panel p-7">
              <span className="eyebrow-lime">
                <Upload size={14} /> Update Profile Picture & CV
              </span>
              <h2 className="mt-2 text-xl font-bold text-white">
                Method 1: Upload to Supabase Cloud Storage
              </h2>
              <p className="mt-1.5 text-xs leading-6 text-[#9aa8b8]">
                When signed in as Admin, upload a new photo or CV PDF below to store it in the{" "}
                <code>portfolio-assets</code> bucket and update all pages immediately.
              </p>

              <div className="mt-5 space-y-4">
                <div className="rounded-xl border border-white/[0.08] bg-[#0b1017] p-4">
                  <p className="font-mono-code text-xs font-semibold text-[#20cfff]">
                    Profile Portrait (JPG / PNG / WebP, max 5MB)
                  </p>
                  <p className="mt-1 truncate font-mono-code text-[11px] text-[#8492a2]">
                    Current: {siteState.portraitPath}
                  </p>
                  <label className="button-secondary mt-3 inline-flex !min-h-9 cursor-pointer text-xs">
                    <Upload size={14} /> Choose New Portrait Photo
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      disabled={!isAuthenticatedAdmin || busy}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadAsset("portrait", file);
                      }}
                    />
                  </label>
                </div>

                <div className="rounded-xl border border-white/[0.08] bg-[#0b1017] p-4">
                  <p className="font-mono-code text-xs font-semibold text-[#c8ff00]">
                    Resume / CV PDF (application/pdf, max 10MB)
                  </p>
                  <p className="mt-1 truncate font-mono-code text-[11px] text-[#8492a2]">
                    Current: {siteState.cvPath}
                  </p>
                  <label className="button-secondary mt-3 inline-flex !min-h-9 cursor-pointer text-xs">
                    <FileText size={14} /> Choose New CV PDF
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      disabled={!isAuthenticatedAdmin || busy}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadAsset("cv", file);
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-[#20cfff]/20 bg-[#20cfff]/[0.05] p-4 text-xs leading-6 text-[#b8c7d6]">
                <p className="font-mono-code font-semibold text-[#20cfff]">
                  Method 2: Updating Local Files in Your Codebase (Zero-DB Option)
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-4">
                  <li>
                    <strong>Profile Photo:</strong> Replace{" "}
                    <code className="text-white">public/images/profile/tharuka-bandara.jpg</code>
                  </li>
                  <li>
                    <strong>CV PDF:</strong> Replace{" "}
                    <code className="text-white">public/resume/tharuka-bandara-cv.pdf</code>
                  </li>
                  <li>
                    Or change <code>portraitPath</code> / <code>cvPath</code> in{" "}
                    <code className="text-white">src/data/site.ts</code>.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <form onSubmit={handleSaveSiteSettings} className="panel space-y-4 p-7">
            <span className="eyebrow">Global Metadata</span>
            <h2 className="mt-2 text-xl font-bold text-white">
              Availability, Contact & Asset Paths
            </h2>

            <div>
              <label className="block font-mono-code text-[11px] uppercase text-[#9aa8b8]">
                Availability Badge Text
              </label>
              <input
                type="text"
                value={siteState.availability}
                onChange={(e) =>
                  setSiteState({ ...siteState, availability: e.target.value })
                }
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#090c10] px-3.5 py-2.5 text-xs text-white"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-mono-code text-[11px] uppercase text-[#9aa8b8]">
                  Email
                </label>
                <input
                  type="email"
                  value={siteState.email}
                  onChange={(e) => setSiteState({ ...siteState, email: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#090c10] px-3.5 py-2.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block font-mono-code text-[11px] uppercase text-[#9aa8b8]">
                  Phone
                </label>
                <input
                  type="text"
                  value={siteState.phone}
                  onChange={(e) => setSiteState({ ...siteState, phone: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#090c10] px-3.5 py-2.5 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono-code text-[11px] uppercase text-[#9aa8b8]">
                Portrait Path / URL
              </label>
              <input
                type="text"
                value={siteState.portraitPath}
                onChange={(e) =>
                  setSiteState({ ...siteState, portraitPath: e.target.value })
                }
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#090c10] px-3.5 py-2.5 font-mono-code text-xs text-white"
              />
            </div>

            <div>
              <label className="block font-mono-code text-[11px] uppercase text-[#9aa8b8]">
                CV PDF Path / URL
              </label>
              <input
                type="text"
                value={siteState.cvPath}
                onChange={(e) => setSiteState({ ...siteState, cvPath: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#090c10] px-3.5 py-2.5 font-mono-code text-xs text-white"
              />
            </div>

            <button
              type="submit"
              disabled={!isAuthenticatedAdmin || busy}
              className="button-primary text-xs disabled:opacity-50"
            >
              <Save size={14} /> Save Site Settings
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: PROJECTS CMS */}
      {activeTab === "projects" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-white">
              Manage Projects & Case Studies ({projectsState.length})
            </h2>
            <button
              type="button"
              onClick={() => startEditProject(emptyProject)}
              className="button-primary text-xs"
            >
              <Plus size={15} /> Add New Project
            </button>
          </div>

          {editingProject && (
            <form onSubmit={handleSaveProject} className="panel space-y-4 p-7">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">
                  {editingProject.title || "New Project Case Study"}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="text-xs text-[#9aa8b8] hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block font-mono-code text-[10px] uppercase text-[#9aa8b8]">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="flavory-cafe"
                    value={editingProject.slug}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, slug: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#090c10] px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block font-mono-code text-[10px] uppercase text-[#9aa8b8]">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.title}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, title: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#090c10] px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block font-mono-code text-[10px] uppercase text-[#9aa8b8]">
                    Category
                  </label>
                  <select
                    value={editingProject.category}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        category: e.target.value as ProjectCategory,
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#090c10] px-3 py-2 text-xs text-white"
                  >
                    <option value="Full-Stack / E-Commerce">Full-Stack / E-Commerce</option>
                    <option value="Full-Stack / Booking System">
                      Full-Stack / Booking System
                    </option>
                    <option value="Product Concept / Full-Stack">
                      Product Concept / Full-Stack
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-mono-code text-[10px] uppercase text-[#9aa8b8]">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={editingProject.subtitle}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, subtitle: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#090c10] px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block font-mono-code text-[10px] uppercase text-[#9aa8b8]">
                    Tech Stack (Comma-Separated)
                  </label>
                  <input
                    type="text"
                    value={stackInput}
                    onChange={(e) => setStackInput(e.target.value)}
                    placeholder="Next.js, TypeScript, Spring Boot, PostgreSQL"
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#090c10] px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono-code text-[10px] uppercase text-[#9aa8b8]">
                  Card Summary
                </label>
                <textarea
                  rows={2}
                  value={editingProject.summary}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, summary: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-white/10 bg-[#090c10] px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-mono-code text-[10px] uppercase text-[#9aa8b8]">
                    Overview Description
                  </label>
                  <textarea
                    rows={3}
                    value={editingProject.description}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        description: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#090c10] px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block font-mono-code text-[10px] uppercase text-[#9aa8b8]">
                    Problem Statement
                  </label>
                  <textarea
                    rows={3}
                    value={editingProject.problem}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, problem: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#090c10] px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block font-mono-code text-[10px] uppercase text-[#9aa8b8]">
                    Key Features (1 per line)
                  </label>
                  <textarea
                    rows={4}
                    value={featuresInput}
                    onChange={(e) => setFeaturesInput(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#090c10] px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block font-mono-code text-[10px] uppercase text-[#9aa8b8]">
                    Challenges (1 per line)
                  </label>
                  <textarea
                    rows={4}
                    value={challengesInput}
                    onChange={(e) => setChallengesInput(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#090c10] px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block font-mono-code text-[10px] uppercase text-[#9aa8b8]">
                    Outcomes (1 per line)
                  </label>
                  <textarea
                    rows={4}
                    value={outcomesInput}
                    onChange={(e) => setOutcomesInput(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#090c10] px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block font-mono-code text-[10px] uppercase text-[#9aa8b8]">
                    GitHub Repository URL
                  </label>
                  <input
                    type="url"
                    value={editingProject.links?.github || ""}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        links: { ...editingProject.links, github: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#090c10] px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block font-mono-code text-[10px] uppercase text-[#9aa8b8]">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={editingProject.links?.demo || ""}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        links: { ...editingProject.links, demo: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#090c10] px-3 py-2 text-xs text-white"
                  />
                </div>
                <div className="flex items-end gap-4 pb-1">
                  <label className="inline-flex items-center gap-2 text-xs text-white">
                    <input
                      type="checkbox"
                      checked={editingProject.featured}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          featured: e.target.checked,
                        })
                      }
                    />
                    Featured on Home Page
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={!isAuthenticatedAdmin || busy}
                className="button-primary text-xs disabled:opacity-50"
              >
                <Save size={14} /> Save Project to Database
              </button>
            </form>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {projectsState.map((proj) => (
              <div key={proj.slug} className="panel flex flex-col justify-between p-6">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono-code text-[11px] text-[#20cfff]">
                      /{proj.slug}
                    </span>
                    <span className="badge-lime">{proj.status}</span>
                  </div>
                  <h3 className="mt-2 text-lg font-bold text-white">{proj.title}</h3>
                  <p className="mt-2 text-xs leading-6 text-[#9aa8b8]">{proj.summary}</p>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
                  <button
                    type="button"
                    onClick={() => startEditProject(proj)}
                    className="button-secondary !min-h-8 !px-3.5 text-xs"
                  >
                    Edit Case Study
                  </button>
                  <button
                    type="button"
                    disabled={!isAuthenticatedAdmin || busy}
                    onClick={() => handleDeleteProject(proj.slug)}
                    className="rounded-lg border border-rose-500/30 p-2 text-rose-400 hover:bg-rose-500/10 disabled:opacity-40"
                    aria-label={`Delete ${proj.title}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: EXPERIENCE CMS */}
      {activeTab === "experience" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-white">
              Manage Experience Timeline ({experiencesState.length})
            </h2>
            <button
              type="button"
              onClick={() => startEditExp(emptyExperience)}
              className="button-primary text-xs"
            >
              <Plus size={15} /> Add Experience Entry
            </button>
          </div>

          {editingExp && (
            <form onSubmit={handleSaveExperience} className="panel space-y-4 p-7">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">
                  {editingExp.company || "New Experience Entry"}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingExp(null)}
                  className="text-xs text-[#9aa8b8] hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block font-mono-code text-[10px] uppercase text-[#9aa8b8]">
                    ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="algobrave"
                    value={editingExp.id}
                    onChange={(e) => setEditingExp({ ...editingExp, id: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#090c10] px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block font-mono-code text-[10px] uppercase text-[#9aa8b8]">
                    Company *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingExp.company}
                    onChange={(e) =>
                      setEditingExp({ ...editingExp, company: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#090c10] px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block font-mono-code text-[10px] uppercase text-[#9aa8b8]">
                    Role Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingExp.role}
                    onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#090c10] px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block font-mono-code text-[10px] uppercase text-[#9aa8b8]">
                    Period
                  </label>
                  <input
                    type="text"
                    value={editingExp.period}
                    onChange={(e) =>
                      setEditingExp({ ...editingExp, period: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#090c10] px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block font-mono-code text-[10px] uppercase text-[#9aa8b8]">
                    Project Highlight
                  </label>
                  <input
                    type="text"
                    value={editingExp.projectHighlight}
                    onChange={(e) =>
                      setEditingExp({
                        ...editingExp,
                        projectHighlight: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#090c10] px-3 py-2 text-xs text-white"
                  />
                </div>
                <div className="flex items-end pb-1">
                  <label className="inline-flex items-center gap-2 text-xs text-white">
                    <input
                      type="checkbox"
                      checked={editingExp.current}
                      onChange={(e) =>
                        setEditingExp({ ...editingExp, current: e.target.checked })
                      }
                    />
                    Current / Active Role
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-mono-code text-[10px] uppercase text-[#9aa8b8]">
                  Responsibilities (1 bullet per line)
                </label>
                <textarea
                  rows={4}
                  value={respInput}
                  onChange={(e) => setRespInput(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-[#090c10] px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-mono-code text-[10px] uppercase text-[#9aa8b8]">
                    Domains (Comma-Separated)
                  </label>
                  <input
                    type="text"
                    value={domainsInput}
                    onChange={(e) => setDomainsInput(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#090c10] px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block font-mono-code text-[10px] uppercase text-[#9aa8b8]">
                    Technologies (Comma-Separated)
                  </label>
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-[#090c10] px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!isAuthenticatedAdmin || busy}
                className="button-primary text-xs disabled:opacity-50"
              >
                <Save size={14} /> Save Experience Entry
              </button>
            </form>
          )}

          <div className="space-y-4">
            {experiencesState.map((exp) => (
              <div
                key={exp.id}
                className="panel flex flex-wrap items-center justify-between gap-4 p-6"
              >
                <div>
                  <span className="font-mono-code text-xs text-[#20cfff]">{exp.period}</span>
                  <h3 className="mt-1 text-lg font-bold text-white">
                    {exp.role} · {exp.company}
                  </h3>
                  <p className="mt-1 font-mono-code text-xs text-[#c8ff00]">
                    {exp.projectHighlight}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => startEditExp(exp)}
                  className="button-secondary !min-h-8 !px-3.5 text-xs"
                >
                  Edit Role
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
