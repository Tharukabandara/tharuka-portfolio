"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  KeyRound,
  Loader2,
  Lock,
} from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { SystemDiagnostics } from "@/lib/supabase/server";

export function AdminLoginForm({ diagnostics }: { diagnostics: SystemDiagnostics }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
        "Supabase URL and Anon Key are not configured in .env.local yet."
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
    <div className="mx-auto max-w-lg">
      <form onSubmit={handleSignIn} className="panel p-7 sm:p-9">
        <div className="mb-6">
          <span className="eyebrow">
            <Lock size={13} /> Restricted Access
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">
            Portfolio Admin Sign In
          </h1>
          <p className="mt-2 text-xs leading-6 text-[#9aa8b8]">
            Authenticate with your Supabase Admin account to manage projects,
            experience, CV/portrait uploads, and contact messages.
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
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#090c10]/90 px-4 py-3 text-sm text-white placeholder:text-[#556476] focus:border-[#20cfff] focus:outline-none"
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
              type={showPassword ? "text" : "password"}
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#090c10]/90 px-4 py-3 text-sm text-white placeholder:text-[#556476] focus:border-[#20cfff] focus:outline-none"
            />
            <label className="mt-3 inline-flex cursor-pointer items-center gap-2 text-xs text-[#9aa8b8] select-none hover:text-white">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-white/20 bg-[#090c10] accent-[#20cfff]"
              />
              <span>Show password</span>
            </label>
          </div>
        </div>

        {error && (
          <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-rose-500/35 bg-rose-500/10 p-4 text-xs text-rose-200">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading || !supabaseReady}
            className="button-primary w-full justify-center disabled:opacity-50"
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
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.07] pt-5">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono-code text-xs text-[#9aa8b8] transition hover:text-white"
          >
            <ArrowLeft size={14} /> Return to public portfolio
          </Link>

          <Link
            href="/admin"
            className="font-mono-code text-xs text-[#20cfff] hover:underline"
          >
            Open Setup & Diagnostics Preview →
          </Link>
        </div>
      </form>
    </div>
  );
}
