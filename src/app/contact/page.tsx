import type { Metadata } from "next";
import { ArrowUpRight, Clock, Download, Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { PageIntro } from "@/components/layout/page-intro";
import { ContactForm } from "@/components/contact/contact-form";
import { getSiteSettings } from "@/lib/portfolio-repository";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Tharuka Bandara — Full-Stack Software Engineer available for international and remote software engineering opportunities.",
};

export default async function ContactPage() {
  const site = await getSiteSettings();
  const contacts = [
    {
      label: "Email",
      value: site.email,
      href: `mailto:${site.email}`,
      icon: Mail,
    },
    {
      label: "Phone / WhatsApp",
      value: site.phone,
      href: `tel:${site.phone.replace(/\s+/g, "")}`,
      icon: Phone,
    },
    {
      label: "LinkedIn",
      value: "linkedin.com/in/tharuka-bandara",
      href: site.linkedin,
      icon: Linkedin,
    },
    {
      label: "GitHub",
      value: "github.com/Tharukabandara",
      href: site.github,
      icon: Github,
    },
  ];

  return (
    <div className="container section-space">
      <PageIntro
        eyebrow="Get In Touch"
        title="Let's start a conversation."
        description="Interested in hiring for a full-stack or backend software engineering role, discussing an opportunity, or collaborating on a product? Send a message below or connect directly."
      />

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <ContactForm />

        <div className="space-y-6">
          <div className="panel p-7 sm:p-8">
            <span className="eyebrow-lime">
              <span className="status-dot" /> Direct Channels
            </span>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
              Connect with me directly.
            </h2>
            <div className="mt-6 space-y-3.5">
              {contacts.map(({ label, value, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                  className="flex items-center gap-4 rounded-xl border border-white/[0.07] bg-white/[0.015] p-4 transition hover:border-[#20cfff]/40 hover:bg-white/[0.03]"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-[#20cfff]/25 bg-[#20cfff]/[0.08] text-[#20cfff]">
                    <Icon size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono-code text-[10px] uppercase tracking-wider text-[#8492a2]">
                      {label}
                    </span>
                    <span className="mt-0.5 block truncate text-sm font-medium text-white">
                      {value}
                    </span>
                  </span>
                  <ArrowUpRight size={15} className="shrink-0 text-[#20cfff]" />
                </a>
              ))}
            </div>
          </div>

          <div className="panel bg-[radial-gradient(ellipse_at_90%_10%,rgba(32,207,255,0.12),transparent_60%),#0f141c] p-7 sm:p-8">
            <div className="space-y-3 text-xs text-[#9aa8b8]">
              <p className="flex items-center gap-2 text-white">
                <MapPin size={15} className="text-[#c8ff00]" />
                <span className="font-semibold">{site.locationDetail}</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock size={15} className="text-[#20cfff]" />
                <span>Flexible overlap with UK, European, Australian & US timezones</span>
              </p>
            </div>

            <div className="mt-6 border-t border-white/[0.07] pt-6">
              <p className="text-xs leading-6 text-[#9aa8b8]">
                Need a formal copy of my resume for your hiring team?
              </p>
              <a href={site.cvPath} download className="button-secondary mt-4 w-full text-xs">
                Download CV (PDF) <Download size={14} className="text-[#c8ff00]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
