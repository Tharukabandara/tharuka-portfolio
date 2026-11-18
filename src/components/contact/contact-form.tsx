"use client";

import { useState } from "react";
import { AlertCircle, ArrowUpRight, CheckCircle2, Loader2, Send } from "lucide-react";
import {
  validateContactPayload,
  type ContactFieldErrors,
  type ContactPayload,
} from "@/lib/validation/contact";

const initialValues: ContactPayload = {
  name: "",
  email: "",
  subject: "",
  message: "",
  website: "",
};

export function ContactForm() {
  const [values, setValues] = useState<ContactPayload>(initialValues);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverResult, setServerResult] = useState<{
    ok: boolean;
    mode?: string;
    message: string;
    mailtoUrl?: string;
  } | null>(null);

  const handleChange = (
    field: keyof ContactPayload,
    value: string
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerResult(null);

    const validation = validateContactPayload(values);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        if (data.errors) setErrors(data.errors);
        setServerResult({
          ok: false,
          message: data.message || "Something went wrong. Please try again.",
        });
      } else {
        setServerResult({
          ok: true,
          mode: data.mode,
          message: data.message,
          mailtoUrl: data.mailtoUrl,
        });
        if (data.mode === "sent") {
          setValues(initialValues);
        }
      }
    } catch {
      setServerResult({
        ok: false,
        message: "Network error while submitting form. Please use direct email instead.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="panel p-7 sm:p-9">
      <div className="mb-6">
        <span className="eyebrow">Direct Message</span>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
          Send a message.
        </h2>
        <p className="mt-1.5 text-xs leading-6 text-[#9aa8b8]">
          Fill out the form below to discuss a role, project, or engineering collaboration.
        </p>
      </div>

      {/* Honeypot anti-spam field (hidden from real users) */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(e) => handleChange("website", e.target.value)}
        />
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="contact-name"
              className="block font-mono-code text-[11px] uppercase tracking-wider text-[#b8c7d6]"
            >
              Your Name <span className="text-[#20cfff]">*</span>
            </label>
            <input
              id="contact-name"
              type="text"
              required
              placeholder="Jane Doe"
              value={values.name}
              onChange={(e) => handleChange("name", e.target.value)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "error-name" : undefined}
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#090c10]/90 px-4 py-3 text-sm text-white placeholder:text-[#58687a] focus:border-[#20cfff] focus:outline-none"
            />
            {errors.name && (
              <p id="error-name" className="mt-1.5 text-xs text-rose-400">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="contact-email"
              className="block font-mono-code text-[11px] uppercase tracking-wider text-[#b8c7d6]"
            >
              Your Email <span className="text-[#20cfff]">*</span>
            </label>
            <input
              id="contact-email"
              type="email"
              required
              placeholder="jane@company.com"
              value={values.email}
              onChange={(e) => handleChange("email", e.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "error-email" : undefined}
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#090c10]/90 px-4 py-3 text-sm text-white placeholder:text-[#58687a] focus:border-[#20cfff] focus:outline-none"
            />
            {errors.email && (
              <p id="error-email" className="mt-1.5 text-xs text-rose-400">
                {errors.email}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="contact-subject"
            className="block font-mono-code text-[11px] uppercase tracking-wider text-[#b8c7d6]"
          >
            Subject <span className="text-[#20cfff]">*</span>
          </label>
          <input
            id="contact-subject"
            type="text"
            required
            placeholder="Software Engineer Opportunity / Project Collaboration"
            value={values.subject}
            onChange={(e) => handleChange("subject", e.target.value)}
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={errors.subject ? "error-subject" : undefined}
            className="mt-2 w-full rounded-xl border border-white/10 bg-[#090c10]/90 px-4 py-3 text-sm text-white placeholder:text-[#58687a] focus:border-[#20cfff] focus:outline-none"
          />
          {errors.subject && (
            <p id="error-subject" className="mt-1.5 text-xs text-rose-400">
              {errors.subject}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="contact-message"
              className="block font-mono-code text-[11px] uppercase tracking-wider text-[#b8c7d6]"
            >
              Message <span className="text-[#20cfff]">*</span>
            </label>
            <span className="font-mono-code text-[10px] text-[#6e7f91]">
              {values.message.length}/3000
            </span>
          </div>
          <textarea
            id="contact-message"
            rows={5}
            required
            placeholder="Tell me about the role, team, or project..."
            value={values.message}
            onChange={(e) => handleChange("message", e.target.value)}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "error-message" : undefined}
            className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-[#090c10]/90 px-4 py-3 text-sm leading-6 text-white placeholder:text-[#58687a] focus:border-[#20cfff] focus:outline-none"
          />
          {errors.message && (
            <p id="error-message" className="mt-1.5 text-xs text-rose-400">
              {errors.message}
            </p>
          )}
        </div>
      </div>

      {serverResult && (
        <div
          role="status"
          className={`mt-5 rounded-xl border p-4 text-xs leading-6 ${
            serverResult.ok
              ? "border-[#c8ff00]/35 bg-[#c8ff00]/10 text-[#eef4fa]"
              : "border-rose-500/35 bg-rose-500/10 text-rose-200"
          }`}
        >
          <div className="flex items-start gap-2.5">
            {serverResult.ok ? (
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#c8ff00]" />
            ) : (
              <AlertCircle size={16} className="mt-0.5 shrink-0 text-rose-400" />
            )}
            <div>
              <p>{serverResult.message}</p>
              {serverResult.mailtoUrl && (
                <a
                  href={serverResult.mailtoUrl}
                  className="mt-2.5 inline-flex items-center gap-1.5 font-semibold text-[#c8ff00] underline"
                >
                  Open pre-filled email in your mail client <ArrowUpRight size={13} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="button-primary disabled:opacity-60"
        >
          {submitting ? (
            <>
              Sending <Loader2 size={15} className="animate-spin" />
            </>
          ) : (
            <>
              Send message <Send size={15} />
            </>
          )}
        </button>
        <span className="font-mono-code text-[11px] text-[#6e7f91]">
          Protected by server-side validation
        </span>
      </div>
    </form>
  );
}
