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

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = createPublicReadClient();
  if (!supabase) return staticSite;

  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", "default")
      .maybeSingle();

    if (error || !data) return staticSite;

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
      cvPath: data.cv_path || staticSite.cvPath,
      portraitPath: data.portrait_path || staticSite.portraitPath,
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
