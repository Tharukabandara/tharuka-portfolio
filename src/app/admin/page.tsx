import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAuthenticatedAdmin } from "@/lib/supabase/auth";
import {
  getSystemDiagnosticsWithSchema,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import {
  getContactSubmissions,
  getExperiences,
  getProjects,
  getSiteSettings,
} from "@/lib/portfolio-repository";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const metadata: Metadata = {
  title: "Admin Control Center",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [diagnostics, auth] = await Promise.all([
    getSystemDiagnosticsWithSchema(),
    getAuthenticatedAdmin(),
  ]);
  const supabaseReady = isSupabaseConfigured();

  // When Supabase keys are configured in .env.local, enforce strict Admin login
  if (supabaseReady && !auth.isAdmin) {
    redirect("/admin/login");
  }

  const [siteSettings, projects, experiences, submissions] = await Promise.all([
    getSiteSettings(),
    getProjects(),
    getExperiences(),
    auth.isAdmin ? getContactSubmissions() : Promise.resolve([]),
  ]);

  return (
    <div className="container section-space">
      <AdminDashboard
        diagnostics={diagnostics}
        isAuthenticatedAdmin={auth.isAdmin}
        initialSite={siteSettings}
        initialProjects={projects}
        initialExperiences={experiences}
        initialSubmissions={submissions}
      />
    </div>
  );
}
