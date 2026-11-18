import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  Briefcase,
  Building2,
  CheckCircle2,
  Download,
  GraduationCap,
  MapPin,
} from "lucide-react";
import { PageIntro } from "@/components/layout/page-intro";
import { Reveal } from "@/components/animations/reveal";
import { ExperienceTimeline } from "@/components/animations/experience-timeline";
import { SpotlightCard } from "@/components/animations/spotlight-card";
import { Magnetic } from "@/components/animations/magnetic";
import { education } from "@/data/experience";
import { getExperiences, getSiteSettings } from "@/lib/portfolio-repository";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Professional software engineering experience of Tharuka Bandara at AlgoBrave Technologies (Java Spring Boot, PostgreSQL, AWS S3) and Sri Lanka Telecom PLC (C#, ASP.NET Core).",
};

export default async function ExperiencePage() {
  const [experience, site] = await Promise.all([
    getExperiences(),
    getSiteSettings(),
  ]);

  return (
    <div className="container section-space">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <PageIntro
          eyebrow="Professional Journey"
          title="Experience & education."
          description="Verified industry experience building multi-tenant backend microservices and modernizing enterprise legacy systems, backed by an Upper Second-Class Honours Software Engineering degree."
        />
        <div className="mb-10 flex flex-wrap gap-3">
          <Magnetic strength={0.3}>
            <a href={site.cvPath} download className="button-primary text-xs">
              Download Full CV <Download size={14} />
            </a>
          </Magnetic>
          <Magnetic strength={0.25}>
            <Link href="/contact" className="button-secondary text-xs">
              Inquire about availability <ArrowUpRight size={14} />
            </Link>
          </Magnetic>
        </div>
      </div>

      <ExperienceTimeline>
        {experience.map((item, index) => (
          <Reveal key={item.id} delay={index * 0.08} className="relative">
            <span
              aria-hidden="true"
              className={`absolute -left-[22px] top-8 h-3.5 w-3.5 rounded-full border-2 border-[#090c10] sm:-left-[32px] ${
                item.current
                  ? "bg-[#c8ff00] shadow-[0_0_16px_rgba(200,255,0,0.9)]"
                  : "bg-[#20cfff] shadow-[0_0_14px_rgba(32,207,255,0.8)]"
              }`}
            />

            <SpotlightCard
              accent={item.current ? "lime" : "cyan"}
              className="p-7 sm:p-9"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/[0.07] pb-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono-code text-xs font-semibold text-[#20cfff]">
                      {item.period}
                    </span>
                    {item.current ? (
                      <span className="badge-lime">
                        <span className="status-dot" /> Active Role
                      </span>
                    ) : (
                      <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-0.5 font-mono-code text-[10px] text-[#9aa8b8]">
                        Completed Tenure
                      </span>
                    )}
                  </div>

                  <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    {item.role}
                  </h2>

                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-[#9aa8b8]">
                    <span className="inline-flex items-center gap-1.5 font-medium text-[#dce5ed]">
                      <Building2 size={14} className="text-[#20cfff]" />
                      {item.company}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={14} className="text-[#c8ff00]" />
                      {item.companyLocation}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-[#20cfff]/25 bg-[#20cfff]/[0.06] px-4 py-2.5">
                  <p className="font-mono-code text-[10px] uppercase tracking-wider text-[#20cfff]">
                    Key Platform / Initiative
                  </p>
                  <p className="mt-0.5 text-xs font-semibold text-white">{item.projectHighlight}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
                <div>
                  <p className="text-sm leading-7 text-[#b8c7d6]">{item.summary}</p>
                  <h3 className="mt-6 font-mono-code text-xs uppercase tracking-wider text-[#20cfff]">
                    Key Responsibilities & Engineering Contributions
                  </h3>
                  <ul className="mt-3.5 space-y-3 text-sm leading-7 text-[#9aa8b8]">
                    {item.responsibilities.map((resp) => (
                      <li key={resp} className="flex items-start gap-3">
                        <CheckCircle2 size={16} className="mt-1.5 shrink-0 text-[#c8ff00]" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-6 rounded-xl border border-white/[0.06] bg-white/[0.015] p-5">
                  <div>
                    <p className="font-mono-code text-[11px] uppercase tracking-wider text-[#c8ff00]">
                      Systems & Domains Handled
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {item.domains.map((domain) => (
                        <span
                          key={domain}
                          className="rounded-md border border-[#c8ff00]/20 bg-[#c8ff00]/[0.06] px-2.5 py-1 font-mono-code text-[10.5px] text-[#dce5ed]"
                        >
                          {domain}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-white/[0.06] pt-5">
                    <p className="font-mono-code text-[11px] uppercase tracking-wider text-[#20cfff]">
                      Technologies & Tools
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {item.technologies.map((tech) => (
                        <span key={tech} className="badge-tech">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </Reveal>
        ))}

        <Reveal className="relative">
          <span
            aria-hidden="true"
            className="absolute -left-[22px] top-8 h-3.5 w-3.5 rounded-full border-2 border-[#090c10] bg-[#c8ff00] shadow-[0_0_16px_rgba(200,255,0,0.9)] sm:-left-[32px]"
          />
          <SpotlightCard accent="lime" className="border-[#c8ff00]/25 p-7 sm:p-9">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="eyebrow-lime">
                  <GraduationCap size={15} /> Academic Foundation · {education.period}
                </span>
                <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                  {education.qualification}
                </h2>
                <p className="mt-1.5 text-sm text-[#dce5ed]">
                  {education.partnerInstitution} — Affiliated with{" "}
                  <span className="font-semibold text-white">{education.institution}</span>
                </p>
              </div>
              <span className="badge-lime">{education.result}</span>
            </div>

            <ul className="mt-6 space-y-2.5 text-sm leading-7 text-[#9aa8b8]">
              {education.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-3">
                  <Briefcase size={15} className="mt-1.5 shrink-0 text-[#20cfff]" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </SpotlightCard>
        </Reveal>
      </ExperienceTimeline>
    </div>
  );
}
