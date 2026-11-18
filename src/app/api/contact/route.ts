import { NextResponse } from "next/server";
import { escapeHtml, validateContactPayload, type ContactPayload } from "@/lib/validation/contact";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { site } from "@/data/site";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (record.count >= MAX_REQUESTS) {
    return false;
  }
  record.count += 1;
  return true;
}

export async function POST(request: Request) {
  try {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "local";

    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Too many messages sent recently. Please wait a few minutes or email directly.",
        },
        { status: 429 }
      );
    }

    const body = (await request.json()) as Partial<ContactPayload>;
    const validation = validateContactPayload(body);

    if (validation.data.website) {
      return NextResponse.json({
        ok: true,
        mode: "honeypot",
        message: "Thank you! Your message has been received.",
      });
    }

    if (!validation.valid) {
      return NextResponse.json(
        {
          ok: false,
          message: "Please check the highlighted form fields.",
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = validation.data;
    const resendApiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL || site.email;
    const fromEmail =
      process.env.CONTACT_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";

    // Step 1: Persist to Supabase PostgreSQL if configured
    let savedToDb = false;
    let submissionId: string | null = null;
    const supabase = createServiceRoleClient();

    if (supabase) {
      const { data: inserted, error: dbError } = await supabase
        .from("contact_submissions")
        .insert({
          name,
          email,
          subject,
          message,
          status: "unread",
          email_sent: false,
        })
        .select("id")
        .maybeSingle();

      if (!dbError && inserted) {
        savedToDb = true;
        submissionId = inserted.id;
      }
    }

    // Step 2: Send email notification via Resend if configured
    let emailSent = false;
    if (resendApiKey) {
      const htmlBody = `
        <div style="font-family: system-ui, -apple-system, sans-serif; color: #0f141c; max-width: 600px;">
          <h2 style="margin-bottom: 4px;">New Portfolio Inquiry</h2>
          <p style="color: #556575; font-size: 13px; margin-top: 0;">Received from tharuka-portfolio contact form</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
          <p><strong>Message:</strong></p>
          <pre style="white-space: pre-wrap; background: #f8fafc; padding: 14px; border-radius: 8px; border: 1px solid #e2e8f0; font-family: inherit;">${escapeHtml(
            message
          )}</pre>
        </div>
      `;

      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [toEmail],
          reply_to: email,
          subject: `[Portfolio] ${subject} — from ${name}`,
          html: htmlBody,
        }),
      });

      if (resendResponse.ok) {
        emailSent = true;
        if (supabase && submissionId) {
          await supabase
            .from("contact_submissions")
            .update({ email_sent: true })
            .eq("id", submissionId);
        }
      }
    }

    if (savedToDb && emailSent) {
      return NextResponse.json({
        ok: true,
        mode: "sent",
        message: "Thank you! Your message has been saved and emailed directly to Tharuka.",
      });
    }

    if (savedToDb && !emailSent) {
      return NextResponse.json({
        ok: true,
        mode: "saved",
        message:
          "Thank you! Your message has been securely saved to Tharuka's inbox.",
      });
    }

    if (!savedToDb && emailSent) {
      return NextResponse.json({
        ok: true,
        mode: "sent",
        message: "Thank you! Your message has been emailed directly to Tharuka.",
      });
    }

    return NextResponse.json({
      ok: true,
      mode: "mailto-fallback",
      message:
        "Message validated! Email service (RESEND_API_KEY) and Supabase DB are not configured in this environment yet — click below to open your pre-filled email client.",
      mailtoUrl: `mailto:${toEmail}?subject=${encodeURIComponent(
        `[Portfolio] ${subject}`
      )}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid request payload. Please try again or email directly.",
      },
      { status: 400 }
    );
  }
}
