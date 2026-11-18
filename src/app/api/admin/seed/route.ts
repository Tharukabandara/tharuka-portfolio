import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAuthenticatedAdmin } from "@/lib/supabase/auth";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { resolveLatestStorageAssets } from "@/lib/portfolio-repository";
import { site } from "@/data/site";
import { projects } from "@/data/projects";
import { experience } from "@/data/experience";

export async function POST() {
  const auth = await getAuthenticatedAdmin();
  if (!auth.isAdmin) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized: Admin authentication required." },
      { status: 401 }
    );
  }

  const supabase = createServiceRoleClient();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, message: "Supabase client is not configured." },
      { status: 500 }
    );
  }

  try {
    // Preserve uploaded portrait & CV URLs (or recover from Supabase Storage if present)
    const [{ data: existingSite }, storageAssets] = await Promise.all([
      supabase.from("site_settings").select("*").eq("id", "default").maybeSingle(),
      resolveLatestStorageAssets(supabase),
    ]);

    const resolvedCvPath =
      existingSite?.cv_path && existingSite.cv_path !== site.cvPath
        ? existingSite.cv_path
        : storageAssets.cvUrl || site.cvPath;

    const resolvedPortraitPath =
      existingSite?.portrait_path && existingSite.portrait_path !== site.portraitPath
        ? existingSite.portrait_path
        : storageAssets.portraitUrl || site.portraitPath;

    // Mirror cloud storage assets to local public/ fallback files in dev mode
    try {
      if (storageAssets.portraitStoragePath) {
        const { data: portraitBlob } = await supabase.storage
          .from("portfolio-assets")
          .download(storageAssets.portraitStoragePath);
        if (portraitBlob) {
          const buf = Buffer.from(await portraitBlob.arrayBuffer());
          const localPortrait = path.join(
            process.cwd(),
            "public/images/profile/tharuka-bandara.jpg"
          );
          await fs.mkdir(path.dirname(localPortrait), { recursive: true });
          await fs.writeFile(localPortrait, buf);
        }
      }
      if (storageAssets.cvStoragePath) {
        const { data: cvBlob } = await supabase.storage
          .from("portfolio-assets")
          .download(storageAssets.cvStoragePath);
        if (cvBlob) {
          const buf = Buffer.from(await cvBlob.arrayBuffer());
          const localCv = path.join(process.cwd(), "public/resume/tharuka-bandara-cv.pdf");
          await fs.mkdir(path.dirname(localCv), { recursive: true });
          await fs.writeFile(localCv, buf);
        }
      }
    } catch {
      // Ignore read-only filesystem errors in serverless environments
    }

    // 1. Seed site_settings while preserving uploaded portrait_path and cv_path
    const { error: siteErr } = await supabase.from("site_settings").upsert({
      id: "default",
      name: site.name,
      short_name: site.shortName,
      role: site.role,
      tagline: site.tagline,
      location: site.location,
      location_detail: site.locationDetail,
      email: site.email,
      phone: site.phone,
      github: site.github,
      linkedin: site.linkedin,
      cv_path: resolvedCvPath,
      portrait_path: resolvedPortraitPath,
      availability: site.availability,
      description: site.description,
      metrics: site.metrics,
      updated_at: new Date().toISOString(),
    });

    if (siteErr) {
      return NextResponse.json(
        {
          ok: false,
          message: `Failed to seed site_settings: ${siteErr.message}. Did you run supabase/migrations/001_init_portfolio_schema.sql in the Supabase SQL Editor?`,
        },
        { status: 500 }
      );
    }

    // 2. Seed projects
    const projectRows = projects.map((p, index) => ({
      slug: p.slug,
      title: p.title,
      subtitle: p.subtitle,
      category: p.category,
      context: p.context,
      summary: p.summary,
      description: p.description,
      problem: p.problem,
      role: p.role,
      architecture: p.architecture,
      features: p.features,
      challenges: p.challenges,
      outcomes: p.outcomes,
      stack: p.stack,
      status: p.status,
      featured: p.featured,
      accent_color: p.accentColor,
      links: p.links || {},
      sort_order: index,
      updated_at: new Date().toISOString(),
    }));

    const { error: projErr } = await supabase.from("projects").upsert(projectRows);
    if (projErr) {
      return NextResponse.json(
        { ok: false, message: `Failed to seed projects: ${projErr.message}` },
        { status: 500 }
      );
    }

    // 3. Seed experiences
    const expRows = experience.map((e, index) => ({
      id: e.id,
      company: e.company,
      company_location: e.companyLocation,
      role: e.role,
      employment_type: e.employmentType,
      period: e.period,
      start_date: e.startDate,
      end_date: e.endDate,
      current: e.current,
      project_highlight: e.projectHighlight,
      summary: e.summary,
      responsibilities: e.responsibilities,
      domains: e.domains,
      technologies: e.technologies,
      sort_order: index,
      updated_at: new Date().toISOString(),
    }));

    const { error: expErr } = await supabase.from("experiences").upsert(expRows);
    if (expErr) {
      return NextResponse.json(
        { ok: false, message: `Failed to seed experiences: ${expErr.message}` },
        { status: 500 }
      );
    }

    revalidatePath("/", "layout");

    return NextResponse.json({
      ok: true,
      cvPath: resolvedCvPath,
      portraitPath: resolvedPortraitPath,
      message: `Seeded 1 site profile (preserving uploaded Portrait & CV), ${projectRows.length} projects, and ${expRows.length} experience records into Supabase PostgreSQL.`,
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        message: err instanceof Error ? err.message : "Unexpected error during database seed.",
      },
      { status: 500 }
    );
  }
}
