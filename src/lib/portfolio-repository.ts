import type { SupabaseClient } from "@supabase/supabase-js";
import { createPublicReadClient, createServiceRoleClient } from "@/lib/supabase/server";
import { site as staticSite } from "@/data/site";
import { projects as staticProjects, type Project, type ProjectCategory } from "@/data/projects";
import { experience as staticExperience, type ExperienceItem } from "@/data/experience";

export type SiteSettings = typeof staticSite;

export type ContactSubmissionRecord = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied" | "archived";
  email_sent: boolean;
  created_at: string;
};

export async function resolveLatestStorageAssets(supabase: SupabaseClient): Promise<{
  portraitUrl: string | null;
  cvUrl: string | null;
  portraitStoragePath: string | null;
  cvStoragePath: string | null;
}> {
  let portraitUrl: string | null = null;
  let cvUrl: string | null = null;
  let portraitStoragePath: string | null = null;
  let cvStoragePath: string | null = null;

  try {
    const [profileRes, resumeRes] = await Promise.all([
      supabase.storage.from("portfolio-assets").list("profile", {
        limit: 50,
        sortBy: { column: "created_at", order: "desc" },
      }),
      supabase.storage.from("portfolio-assets").list("resume", {
        limit: 50,
        sortBy: { column: "created_at", order: "desc" },
      }),
    ]);

    const validProfiles = (profileRes.data || [])
      .filter((f) => f.name && !f.name.startsWith("."))
      .sort((a, b) => b.name.localeCompare(a.name));

    if (validProfiles.length > 0) {
      portraitStoragePath = `profile/${validProfiles[0].name}`;
      portraitUrl = supabase.storage
        .from("portfolio-assets")
        .getPublicUrl(portraitStoragePath).data.publicUrl;
    }

    const validResumes = (resumeRes.data || [])
      .filter((f) => f.name && !f.name.startsWith("."))
      .sort((a, b) => b.name.localeCompare(a.name));

    if (validResumes.length > 0) {
      cvStoragePath = `resume/${validResumes[0].name}`;
      cvUrl = supabase.storage
        .from("portfolio-assets")
        .getPublicUrl(cvStoragePath).data.publicUrl;
    }
  } catch {
    // Ignore storage listing errors and fall back to existing paths
  }

  return { portraitUrl, cvUrl, portraitStoragePath, cvStoragePath };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = createPublicReadClient();
  if (!supabase) return staticSite;

  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", "default")
      .maybeSingle();

    if (error || !data) {
      const storageAssets = await resolveLatestStorageAssets(supabase);
      return {
        ...staticSite,
        cvPath: storageAssets.cvUrl || staticSite.cvPath,
        portraitPath: storageAssets.portraitUrl || staticSite.portraitPath,
      };
    }

    let cvPath = data.cv_path || staticSite.cvPath;
    let portraitPath = data.portrait_path || staticSite.portraitPath;

    // If DB still points to default static paths, check if newer uploaded files exist in Storage
    if (cvPath === staticSite.cvPath || portraitPath === staticSite.portraitPath) {
      const storageAssets = await resolveLatestStorageAssets(supabase);
      if (cvPath === staticSite.cvPath && storageAssets.cvUrl) {
        cvPath = storageAssets.cvUrl;
      }
      if (portraitPath === staticSite.portraitPath && storageAssets.portraitUrl) {
        portraitPath = storageAssets.portraitUrl;
      }
    }

    return {
      name: data.name || staticSite.name,
      shortName: data.short_name || staticSite.shortName,
      role: data.role || staticSite.role,
      tagline: data.tagline || staticSite.tagline,
      location: data.location || staticSite.location,
      locationDetail: data.location_detail || staticSite.locationDetail,
      email: data.email || staticSite.email,
      phone: data.phone || staticSite.phone,
      github: data.github || staticSite.github,
      linkedin: data.linkedin || staticSite.linkedin,
      url: staticSite.url,
      cvPath,
      portraitPath,
      availability: data.availability || staticSite.availability,
      description: data.description || staticSite.description,
      metrics:
        Array.isArray(data.metrics) && data.metrics.length > 0
          ? data.metrics
          : staticSite.metrics,
    };
  } catch {
    return staticSite;
  }
}

export async function getProjects(): Promise<Project[]> {
  const supabase = createPublicReadClient();
  if (!supabase) return staticProjects;

  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) return staticProjects;

    return data.map((row) => ({
      slug: row.slug,
      title: row.title,
      subtitle: row.subtitle,
      category: row.category as ProjectCategory,
      context: row.context,
      summary: row.summary,
      description: row.description,
      problem: row.problem,
      role: row.role,
      architecture: row.architecture || { overview: "", layers: [] },
      features: Array.isArray(row.features) ? row.features : [],
      challenges: Array.isArray(row.challenges) ? row.challenges : [],
      outcomes: Array.isArray(row.outcomes) ? row.outcomes : [],
      stack: Array.isArray(row.stack) ? row.stack : [],
      status: row.status as Project["status"],
      featured: Boolean(row.featured),
      accentColor: row.accent_color === "lime" ? "lime" : "cyan",
      links: row.links || {},
    }));
  } catch {
    return staticProjects;
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const all = await getProjects();
  return all.find((p) => p.slug === slug);
}

export async function getExperiences(): Promise<ExperienceItem[]> {
  const supabase = createPublicReadClient();
  if (!supabase) return staticExperience;

  try {
    const { data, error } = await supabase
      .from("experiences")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) return staticExperience;

    return data.map((row) => ({
      id: row.id,
      company: row.company,
      companyLocation: row.company_location,
      role: row.role,
      employmentType: row.employment_type,
      period: row.period,
      startDate: row.start_date,
      endDate: row.end_date,
      current: Boolean(row.current),
      projectHighlight: row.project_highlight,
      summary: row.summary,
      responsibilities: Array.isArray(row.responsibilities) ? row.responsibilities : [],
      domains: Array.isArray(row.domains) ? row.domains : [],
      technologies: Array.isArray(row.technologies) ? row.technologies : [],
    }));
  } catch {
    return staticExperience;
  }
}

export async function getContactSubmissions(): Promise<ContactSubmissionRecord[]> {
  const supabase = createServiceRoleClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data as ContactSubmissionRecord[];
  } catch {
    return [];
  }
}
