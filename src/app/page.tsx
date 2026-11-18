import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Download,
  Github,
  Layers,
  Linkedin,
  Mail,
  Server,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { BlurText } from "@/components/animations/blur-text";
import { Magnetic } from "@/components/animations/magnetic";
import { HeroPortrait } from "@/components/animations/hero-portrait";
import { TechMarquee } from "@/components/animations/tech-marquee";
import { SpotlightCard } from "@/components/animations/spotlight-card";
import { ProjectCard } from "@/components/projects/project-card";
import {
  getExperiences,
  getProjects,
  getSiteSettings,
} from "@/lib/portfolio-repository";
import { education } from "@/data/experience";
import { skillGroups, domainExperience } from "@/data/skills";

export default async function HomePage() {
  const [site, projects, experience] = await Promise.all([
    getSiteSettings(),
    getProjects(),
    getExperiences(),
  ]);

  const featuredProjects = projects.filter((project) => project.featured);

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div className="grid-glow pointer-events-none absolute inset-0 -z-10" />
        <div className="pointer-events-none absolute right-[-10rem] top-8 -z-10 h-[34rem] w-[34rem] rounded-full bg-[#20cfff]/[0.08] blur-[120px]" />
        <div className="pointer-events-none absolute left-[-10rem] top-44 -z-10 h-[24rem] w-[24rem] rounded-full bg-[#c8ff00]/[0.04] blur-[110px]" />

        <div className="container grid min-h-[700px] items-center gap-14 py-20 lg:grid-cols-[1.18fr_0.82fr] lg:py-24">
          <Reveal>
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#c8ff00]/25 bg-[#c8ff00]/[0.07] px-3.5 py-1.5 font-mono-code text-[11px] font-semibold text-[#c8ff00]">
              <span className="status-dot" />
              <span>{site.availability}</span>
            </div>

            <p className="mt-7 font-mono-code text-xs uppercase tracking-[0.18em] text-[#9aa8b8]">
              {site.location} · Full-Stack & Backend Systems
            </p>

            <h1 className="mt-3 max-w-3xl text-5xl font-bold leading-[1.05] tracking-[-0.055em] sm:text-6xl lg:text-[70px]">
              <BlurText text="Tharuka" highlightText="Bandara." />
            </h1>

            <h2 className="mt-5 text-lg font-medium text-[#e2ebf3] sm:text-xl">
              {site.role} —{" "}
              <span className="text-[#9aa8b8]">
                Java Spring Boot, ASP.NET Core, React, Next.js & MERN Stack
              </span>
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-8 text-[#9aa8b8] sm:text-base">
              I engineer scalable backend microservices, enterprise web applications, and end-to-end
              e-commerce platforms. Experienced in multi-tenant architectures, legacy system
              modernization, and mission-critical{" "}
              <span className="text-[#dce5ed]">
                user, inventory, order, and job management systems
              </span>
              .
            </p>

            <div className="mt-8 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
              {site.metrics.map((metric, idx) => (
                <SpotlightCard
                  key={metric.label}
                  accent={idx === 2 ? "lime" : "cyan"}
                  className="!rounded-xl px-4 py-3"
                >
                  <p className="font-mono-code text-[10px] uppercase tracking-wider text-[#20cfff]">
                    {metric.label}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-[#eef4fa]">{metric.value}</p>
                </SpotlightCard>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Magnetic strength={0.32}>
                <Link href="/projects" className="button-primary">
                  Explore case studies <ArrowUpRight size={16} />
                </Link>
              </Magnetic>
              <Magnetic strength={0.28}>
                <a href={site.cvPath} className="button-secondary" download>
                  Download CV <Download size={15} className="text-[#c8ff00]" />
                </a>
              </Magnetic>
              <Magnetic strength={0.25}>
                <Link href="/contact" className="button-secondary">
                  Contact me
                </Link>
              </Magnetic>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-5 text-[#8291a2]">
              <Magnetic strength={0.35}>
                <a
                  href={site.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="inline-flex items-center gap-2 text-xs transition hover:text-[#20cfff]"
                >
                  <Github size={18} />
                  <span className="font-mono-code">GitHub</span>
                </a>
              </Magnetic>
              <Magnetic strength={0.35}>
                <a
                  href={site.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="inline-flex items-center gap-2 text-xs transition hover:text-[#20cfff]"
                >
                  <Linkedin size={18} />
                  <span className="font-mono-code">LinkedIn</span>
                </a>
              </Magnetic>
              <Magnetic strength={0.2}>
                <a
                  href={`mailto:${site.email}`}
                  aria-label="Email"
                  className="inline-flex items-center gap-2 text-xs transition hover:text-[#20cfff]"
                >
                  <Mail size={18} />
                  <span className="font-mono-code">{site.email}</span>
                </a>
              </Magnetic>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <HeroPortrait portraitPath={site.portraitPath} />
          </Reveal>
        </div>

        <div className="container pb-8">
          <a
            href="#domains"
            className="inline-flex items-center gap-2 font-mono-code text-[11px] uppercase tracking-[0.16em] text-[#718194] transition hover:text-[#20cfff]"
          >
            Scroll to explore architecture & work <ArrowDown size={13} />
          </a>
        </div>
      </section>

      <TechMarquee />

      <section id="domains" className="section-space">
        <div className="container">
          <Reveal>
            <div className="section-heading">
              <span className="eyebrow">
                <Layers size={14} /> Engineering Capabilities
              </span>
              <h2>
                Built for real-world <span className="gradient-text">business logic.</span>
              </h2>
              <p>
                Beyond UI templates, my work centers on multi-tenant backend services, transactional
                data integrity, role-based security, and maintainable full-stack architectures.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {domainExperience.map((domain, index) => (
              <Reveal key={domain.title} delay={index * 0.06}>
                <SpotlightCard
                  accent={index % 2 === 0 ? "cyan" : "lime"}
                  className="h-full p-6"
                >
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#20cfff]/25 bg-[#20cfff]/10 text-[#20cfff]">
                    {index % 2 === 0 ? <Server size={18} /> : <ShieldCheck size={18} />}
                  </div>
                  <h3 className="text-base font-semibold text-white">{domain.title}</h3>
                  <p className="mt-2.5 text-xs leading-6 text-[#9aa8b8]">{domain.description}</p>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="featured" className="section-space border-t border-white/[0.06]">
        <div className="container">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="section-heading !mb-0">
                <span className="eyebrow">Selected Work</span>
                <h2>
                  Projects engineered with <span className="gradient-text">purpose.</span>
                </h2>
                <p>
                  Full-stack applications featuring authentication, payment integration, conflict-free
                  booking logic, and e-commerce administration.
                </p>
              </div>
              <Magnetic strength={0.28}>
                <Link href="/projects" className="button-secondary">
                  All projects & concepts ({projects.length}) <ArrowRight size={15} />
                </Link>
              </Magnetic>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project, index) => (
              <Reveal key={project.slug} delay={index * 0.08}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space border-t border-white/[0.06]">
        <div className="container grid gap-12 lg:grid-cols-[0.82fr_1.18fr]">
          <Reveal>
            <div className="section-heading">
              <span className="eyebrow">Technical Toolkit</span>
              <h2>
                Stack across <span className="gradient-text">frontend & backend.</span>
              </h2>
              <p>
                Languages, frameworks, databases, and engineering tools I use to design, build, test,
                and ship full-stack software.
              </p>
            </div>
            <Magnetic strength={0.28}>
              <Link href="/about" className="button-secondary">
                More about my approach <ArrowUpRight size={15} />
              </Link>
            </Magnetic>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {skillGroups.map((group, index) => (
              <Reveal key={group.id} delay={index * 0.07}>
                <SpotlightCard
                  accent={index % 2 === 0 ? "cyan" : "lime"}
                  className="h-full p-6"
                >
                  <div className="mb-2 flex items-center gap-2.5 text-[#20cfff]">
                    <Terminal size={17} />
                    <h3 className="text-sm font-semibold text-white">{group.title}</h3>
                  </div>
                  <p className="mb-4 text-xs text-[#8492a2]">{group.subtitle}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <span key={item} className="badge-tech">
                        {item}
                      </span>
                    ))}
                  </div>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space border-t border-white/[0.06]">
        <div className="container grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <div className="section-heading">
              <span className="eyebrow">Industry & Academic Journey</span>
              <h2>
                Enterprise systems & <span className="gradient-text">honours foundation.</span>
              </h2>
              <p>
                Hands-on industry experience modernizing enterprise systems at Sri Lanka Telecom and
                supporting multi-tenant microservices at AlgoBrave Technologies.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Magnetic strength={0.3}>
                <Link href="/experience" className="button-primary">
                  Full experience timeline <ArrowUpRight size={15} />
                </Link>
              </Magnetic>
            </div>
          </Reveal>

          <div className="space-y-4">
            {experience.map((item) => (
              <Reveal key={item.id}>
                <SpotlightCard accent={item.current ? "lime" : "cyan"} className="p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono-code text-xs text-[#20cfff]">{item.period}</span>
                    {item.current ? (
                      <span className="badge-lime">Current Role</span>
                    ) : (
                      <span className="rounded-full border border-white/10 px-2.5 py-0.5 font-mono-code text-[10px] text-[#9aa8b8]">
                        Completed
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 text-lg font-semibold text-white">
                    {item.role} · <span className="text-[#dce5ed]">{item.company}</span>
                  </h3>
                  <p className="mt-1 font-mono-code text-xs text-[#c8ff00]">
                    {item.projectHighlight}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[#9aa8b8]">{item.summary}</p>
                  <ul className="mt-4 space-y-2 text-xs leading-6 text-[#b8c7d6]">
                    {item.responsibilities.slice(0, 2).map((resp) => (
                      <li key={resp} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="mt-1 shrink-0 text-[#20cfff]" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </SpotlightCard>
              </Reveal>
            ))}

            <Reveal>
              <SpotlightCard accent="lime" className="border-[#c8ff00]/20 p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono-code text-xs text-[#c8ff00]">
                    Education · {education.period}
                  </span>
                  <span className="rounded-full border border-[#c8ff00]/30 bg-[#c8ff00]/10 px-2.5 py-0.5 font-mono-code text-[10px] text-[#c8ff00]">
                    {education.result}
                  </span>
                </div>
                <h3 className="mt-2 text-lg font-semibold text-white">{education.qualification}</h3>
                <p className="mt-1 text-xs text-[#9aa8b8]">
                  {education.partnerInstitution} — {education.institution}
                </p>
              </SpotlightCard>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="pb-28">
        <div className="container">
          <Reveal className="relative overflow-hidden rounded-2xl border border-[#20cfff]/25 bg-[radial-gradient(ellipse_at_88%_18%,rgba(32,207,255,0.16),rgba(200,255,0,0.06)_42%,transparent_65%),#0f141c] p-8 sm:p-12">
            <span className="eyebrow-lime">
              <span className="status-dot" /> Available for Software Engineering Roles
            </span>
            <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-[-0.045em] sm:text-5xl">
              Looking for an engineer who builds{" "}
              <span className="gradient-text">clean, reliable software?</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#9aa8b8]">
              Whether you&apos;re hiring for a full-stack or backend role, or collaborating on a web
              product, I&apos;d love to connect.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Magnetic strength={0.32}>
                <Link href="/contact" className="button-primary">
                  Start a conversation <ArrowUpRight size={16} />
                </Link>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
