import type { Metadata } from "next";
import { getSystemDiagnosticsWithSchema } from "@/lib/supabase/server";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export const metadata: Metadata = {
  title: "Admin Sign In",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const diagnostics = await getSystemDiagnosticsWithSchema();

  return (
    <div className="container section-space">
      <AdminLoginForm diagnostics={diagnostics} />
    </div>
  );
}
