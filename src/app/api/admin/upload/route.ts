import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAuthenticatedAdmin } from "@/lib/supabase/auth";
import { createServiceRoleClient } from "@/lib/supabase/server";

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

    // Update site_settings row with the new asset URL
    const fieldToUpdate =
      assetType === "cv"
        ? { cv_path: publicUrl, updated_at: new Date().toISOString() }
        : { portrait_path: publicUrl, updated_at: new Date().toISOString() };

    await supabase.from("site_settings").update(fieldToUpdate).eq("id", "default");

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
