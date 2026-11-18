import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export async function createServerSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component where setting cookies is a no-op
        }
      },
    },
  });
}

export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
    },
  });
}

export function createPublicReadClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
    },
  });
}

export type SystemDiagnostics = {
  supabaseUrlConfigured: boolean;
  supabaseAnonKeyConfigured: boolean;
  supabaseServiceKeyConfigured: boolean;
  resendApiKeyConfigured: boolean;
  resendKeyValidFormat: boolean;
  schemaTablesReady?: boolean;
  schemaNote?: string;
  adminEmail: string;
  contactToEmail: string;
};

export function getSystemDiagnostics(): SystemDiagnostics {
  const resendKey = (process.env.RESEND_API_KEY || "").trim();
  return {
    supabaseUrlConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    supabaseAnonKeyConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    supabaseServiceKeyConfigured: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    resendApiKeyConfigured: Boolean(resendKey),
    resendKeyValidFormat: resendKey.startsWith("re_"),
    adminEmail: process.env.ADMIN_EMAIL || "tharukabandara821@gmail.com",
    contactToEmail: process.env.CONTACT_TO_EMAIL || "tharukabandara821@gmail.com",
  };
}

export async function getSystemDiagnosticsWithSchema(): Promise<SystemDiagnostics> {
  const base = getSystemDiagnostics();
  const supabase = createServiceRoleClient();
  if (!supabase) {
    return {
      ...base,
      schemaTablesReady: false,
      schemaNote: "Supabase keys not configured yet",
    };
  }

  try {
    const { count, error } = await supabase
      .from("projects")
      .select("slug", { count: "exact", head: true });

    if (error) {
      return {
        ...base,
        schemaTablesReady: false,
        schemaNote: `Run 001_init_portfolio_schema.sql in Supabase SQL Editor (${error.message})`,
      };
    }

    return {
      ...base,
      schemaTablesReady: true,
      schemaNote: `Schema ready (${count ?? 0} projects in DB)`,
    };
  } catch {
    return {
      ...base,
      schemaTablesReady: false,
      schemaNote: "Could not reach Supabase database",
    };
  }
}
