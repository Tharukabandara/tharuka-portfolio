import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAuthenticatedAdmin } from "@/lib/supabase/auth";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { site } from "@/data/site";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_PDF_BYTES = 10 * 1024 * 1024; // 10 MB

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
      { ok: false, message: "Supabase Storage is not configured." },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const assetType = formData.get("assetType") as "portrait" | "cv" | null;
    const file = formData.get("file") as File | null;

    if (!file || (assetType !== "portrait" && assetType !== "cv")) {
      return NextResponse.json(
        { ok: false, message: "Please provide a valid file and assetType ('portrait' or 'cv')." },
        { status: 400 }
      );
    }

    if (assetType === "portrait") {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return NextResponse.json(
          { ok: false, message: "Portrait must be a JPG, PNG, or WebP image." },
          { status: 400 }
        );
      }
      if (file.size > MAX_IMAGE_BYTES) {
        return NextResponse.json(
          { ok: false, message: "Portrait image must be 5 MB or smaller." },
          { status: 400 }
        );
      }
    } else {
      if (file.type !== "application/pdf") {
        return NextResponse.json(
          { ok: false, message: "CV file must be a PDF document (application/pdf)." },
          { status: 400 }
        );
      }
      if (file.size > MAX_PDF_BYTES) {
        return NextResponse.json(
          { ok: false, message: "CV PDF must be 10 MB or smaller." },
          { status: 400 }
        );
      }
    }

    const ext =
      assetType === "cv"
        ? "pdf"
        : file.type === "image/png"
        ? "png"
        : file.type === "image/webp"
        ? "webp"
        : "jpg";

    const storagePath =
      assetType === "cv"
        ? `resume/tharuka-bandara-cv-${Date.now()}.${ext}`
        : `profile/tharuka-bandara-${Date.now()}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from("portfolio-assets")
      .upload(storagePath, arrayBuffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json(
        { ok: false, message: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("portfolio-assets").getPublicUrl(storagePath);

    // Mirror uploaded asset to local public/ fallback in dev environments
    try {
      const localRelativePath =
        assetType === "cv"
          ? "public/resume/tharuka-bandara-cv.pdf"
          : "public/images/profile/tharuka-bandara.jpg";
      const localFullPath = path.join(process.cwd(), localRelativePath);
      await fs.mkdir(path.dirname(localFullPath), { recursive: true });
      await fs.writeFile(localFullPath, Buffer.from(arrayBuffer));
    } catch {
      // Ignore read-only filesystem errors in serverless production environments
    }

    // Read existing site_settings row and upsert with the new asset URL
    const { data: existing } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", "default")
      .maybeSingle();

    const upsertPayload = {
      id: "default",
      name: existing?.name || site.name,
      short_name: existing?.short_name || site.shortName,
      role: existing?.role || site.role,
      tagline: existing?.tagline || site.tagline,
      location: existing?.location || site.location,
      location_detail: existing?.location_detail || site.locationDetail,
      email: existing?.email || site.email,
      phone: existing?.phone || site.phone,
      github: existing?.github || site.github,
      linkedin: existing?.linkedin || site.linkedin,
      cv_path: assetType === "cv" ? publicUrl : existing?.cv_path || site.cvPath,
      portrait_path:
        assetType === "portrait" ? publicUrl : existing?.portrait_path || site.portraitPath,
      availability: existing?.availability || site.availability,
      description: existing?.description || site.description,
      metrics:
        Array.isArray(existing?.metrics) && existing.metrics.length > 0
          ? existing.metrics
          : site.metrics,
      updated_at: new Date().toISOString(),
    };

    const { error: dbError } = await supabase.from("site_settings").upsert(upsertPayload);
    if (dbError) {
      return NextResponse.json(
        { ok: false, message: `Saved to storage, but DB update failed: ${dbError.message}` },
        { status: 500 }
      );
    }

    revalidatePath("/", "layout");

    return NextResponse.json({
      ok: true,
      url: publicUrl,
      message:
        assetType === "cv"
          ? "New CV PDF uploaded and live across the site!"
          : "New Profile Picture uploaded and live across the site!",
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, message: err instanceof Error ? err.message : "Upload failed." },
      { status: 500 }
    );
  }
}
