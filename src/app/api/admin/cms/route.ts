import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAuthenticatedAdmin } from "@/lib/supabase/auth";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
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
      { ok: false, message: "Supabase is not configured." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { entity, action, payload } = body;

    if (entity === "site_settings" && action === "upsert") {
      const { error } = await supabase.from("site_settings").upsert({
        id: "default",
        name: payload.name,
        short_name: payload.shortName || "THARUKA",
        role: payload.role,
        tagline: payload.tagline,
        location: payload.location,
        location_detail: payload.locationDetail,
        email: payload.email,
        phone: payload.phone,
        github: payload.github,
        linkedin: payload.linkedin,
        cv_path: payload.cvPath,
        portrait_path: payload.portraitPath,
        availability: payload.availability,
        description: payload.description,
        metrics: payload.metrics || [],
        updated_at: new Date().toISOString(),
      });
      if (error) throw new Error(error.message);
    } else if (entity === "project") {
      if (action === "upsert") {
        const { error } = await supabase.from("projects").upsert({
          slug: payload.slug,
          title: payload.title,
          subtitle: payload.subtitle,
          category: payload.category,
          context: payload.context,
          summary: payload.summary,
          description: payload.description,
          problem: payload.problem,
          role: payload.role,
          architecture: payload.architecture || { overview: "", layers: [] },
          features: payload.features || [],
          challenges: payload.challenges || [],
          outcomes: payload.outcomes || [],
          stack: payload.stack || [],
          status: payload.status || "Completed",
          featured: Boolean(payload.featured),
          accent_color: payload.accentColor || "cyan",
          links: payload.links || {},
          sort_order: Number(payload.sortOrder ?? 0),
          updated_at: new Date().toISOString(),
        });
        if (error) throw new Error(error.message);
      } else if (action === "delete") {
        const { error } = await supabase
          .from("projects")
          .delete()
          .eq("slug", payload.slug);
        if (error) throw new Error(error.message);
      }
    } else if (entity === "experience") {
      if (action === "upsert") {
        const { error } = await supabase.from("experiences").upsert({
          id: payload.id,
          company: payload.company,
          company_location: payload.companyLocation,
          role: payload.role,
          employment_type: payload.employmentType || "Internship",
          period: payload.period,
          start_date: payload.startDate || "",
          end_date: payload.endDate || "",
          current: Boolean(payload.current),
          project_highlight: payload.projectHighlight,
          summary: payload.summary,
          responsibilities: payload.responsibilities || [],
          domains: payload.domains || [],
          technologies: payload.technologies || [],
          sort_order: Number(payload.sortOrder ?? 0),
          updated_at: new Date().toISOString(),
        });
        if (error) throw new Error(error.message);
      } else if (action === "delete") {
        const { error } = await supabase
          .from("experiences")
          .delete()
          .eq("id", payload.id);
        if (error) throw new Error(error.message);
      }
    } else if (entity === "contact") {
      if (action === "status") {
        const { error } = await supabase
          .from("contact_submissions")
          .update({ status: payload.status })
          .eq("id", payload.id);
        if (error) throw new Error(error.message);
      } else if (action === "delete") {
        const { error } = await supabase
          .from("contact_submissions")
          .delete()
          .eq("id", payload.id);
        if (error) throw new Error(error.message);
      }
    } else {
      return NextResponse.json(
        { ok: false, message: "Invalid entity or action." },
        { status: 400 }
      );
    }

    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true, message: "Saved and revalidated public pages." });
  } catch (err) {
    return NextResponse.json(
      { ok: false, message: err instanceof Error ? err.message : "Mutation failed." },
      { status: 500 }
    );
  }
}
