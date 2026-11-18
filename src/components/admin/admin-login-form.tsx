"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Loader2,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { SystemDiagnostics } from "@/lib/supabase/server";

export function AdminLoginForm({ diagnostics }: { diagnostics: SystemDiagnostics }) {
  const router = useRouter();
  const [email, setEmail] = useState(diagnostics.adminEmail);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabaseReady =
    diagnostics.supabaseUrlConfigured && diagnostics.supabaseAnonKeyConfigured;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      setError(
        "Supabase URL and Anon Key are not configured in .env.local yet. Follow the setup checklist on the right."
      );
      return;
    }

    setLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError(signInError.message);
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Unexpected authentication error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <form onSubmit={handleSignIn} className="panel p-7 sm:p-9">
        <div className="mb-6">
          <span className="eyebrow">
            <Lock size={13} /> Restricted Access
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">
            Portfolio Admin Sign In
          </h1>
          <p className="mt-2 text-xs leading-6 text-[#9aa8b8]">
            Authenticate with your Supabase Admin account ({diagnostics.adminEmail}) to manage
            projects, experience, CV/portrait uploads, and contact messages.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="admin-email"
              className="block font-mono-code text-[11px] uppercase tracking-wider text-[#b8c7d6]"
            >
              Admin Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#090c10]/90 px-4 py-3 text-sm text-white focus:border-[#20cfff] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block font-mono-code text-[11px] uppercase tracking-wider text-[#b8c7d6]"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#090c10]/90 px-4 py-3 text-sm text-white focus:border-[#20cfff] focus:outline-none"
            />
          </div>
        </div>

        {error && (
          <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-rose-500/35 bg-rose-500/10 p-4 text-xs text-rose-200">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <button
            type="submit"
            disabled={loading || !supabaseReady}
            className="button-primary disabled:opacity-50"
          >
            {loading ? (
              <>
                Signing in <Loader2 size={15} className="animate-spin" />
              </>
            ) : (
              <>
                Sign in to Admin <KeyRound size={15} />
              </>
            )}
          </button>

          <Link
            href="/admin"
            className="font-mono-code text-xs text-[#20cfff] hover:underline"
          >
            Open Setup & Diagnostics Preview →
          </Link>
        </div>
      </form>

      <div className="panel p-7 sm:p-9">
        <span className="eyebrow-lime">
          <ShieldCheck size={14} /> Environment Readiness Checklist
        </span>
        <h2 className="mt-3 text-xl font-semibold text-white">
          Supabase & Resend Connection Status
        </h2>
        <p className="mt-2 text-xs leading-6 text-[#9aa8b8]">
          Copy <code className="text-[#20cfff]">.env.example</code> to{" "}
          <code className="text-[#c8ff00]">.env.local</code> and add your keys to enable live
          database persistence and email notifications.
        </p>

        <div className="mt-5 space-y-2.5 text-xs">
          {[
            {
              key: "NEXT_PUBLIC_SUPABASE_URL",
              ok: diagnostics.supabaseUrlConfigured,
              desc: "Supabase Project URL",
            },
            {
              key: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
              ok: diagnostics.supabaseAnonKeyConfigured,
              desc: "Supabase Public Anon Key",
            },
            {
              key: "SUPABASE_SERVICE_ROLE_KEY",
              ok: diagnostics.supabaseServiceKeyConfigured,
              desc: "Server-only Service Role Key (for Inbox & Seeding)",
            },
            {
              key: "RESEND_API_KEY",
              ok: diagnostics.resendApiKeyConfigured && diagnostics.resendKeyValidFormat,
              warn: diagnostics.resendApiKeyConfigured && !diagnostics.resendKeyValidFormat,
              desc:
                diagnostics.resendApiKeyConfigured && !diagnostics.resendKeyValidFormat
                  ? "Found UUID instead of 're_...' secret token — create a new key in Resend and copy the 're_' value"
                  : "Resend API Key (for Contact Email Alerts)",
            },
            {
              key: "POSTGRESQL_SCHEMA",
              ok: Boolean(diagnostics.schemaTablesReady),
              desc:
                diagnostics.schemaNote ||
                "Run supabase/migrations/001_init_portfolio_schema.sql in Supabase SQL Editor",
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3"
            >
              <div>
                <p className="font-mono-code text-[11px] font-semibold text-white">{item.key}</p>
                <p className="text-[11px] text-[#8492a2]">{item.desc}</p>
              </div>
              {item.ok ? (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#c8ff00]/30 bg-[#c8ff00]/10 px-2.5 py-0.5 font-mono-code text-[10px] text-[#c8ff00]">
                  <CheckCircle2 size={12} /> Configured
                </span>
              ) : "warn" in item && item.warn ? (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-400/40 bg-amber-400/15 px-2.5 py-0.5 font-mono-code text-[10px] text-amber-200">
                  Needs &apos;re_...&apos; token
                </span>
              ) : (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 font-mono-code text-[10px] text-amber-300">
                  Pending in .env.local
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-white/[0.07] pt-5">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono-code text-xs text-[#9aa8b8] hover:text-white"
          >
            <ArrowLeft size={14} /> Return to public portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
