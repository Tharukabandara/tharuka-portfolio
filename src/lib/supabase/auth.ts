import { createServerSupabaseClient } from "@/lib/supabase/server";
import { site } from "@/data/site";

export async function getAuthenticatedAdmin() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { isAdmin: false, user: null, reason: "supabase-unconfigured" as const };
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user || !user.email) {
    return { isAdmin: false, user: null, reason: "unauthenticated" as const };
  }

  const allowedAdminEmail = (
    process.env.ADMIN_EMAIL || site.email
  ).toLowerCase();

  if (user.email.toLowerCase() !== allowedAdminEmail) {
    return { isAdmin: false, user, reason: "forbidden-email" as const };
  }

  return { isAdmin: true, user, reason: "ok" as const };
}
