import type { Metadata } from "next";
import { getSystemDiagnostics } from "@/lib/supabase/server";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export const metadata: Metadata = {
  title: "Admin Sign In",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  const diagnostics = getSystemDiagnostics();

  return (
    <div className="container section-space">
      <AdminLoginForm diagnostics={diagnostics} />
    </div>
  );
}
