import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Award,
  Code2,
  Database,
  Download,
  Globe2,
  Layers,
  MapPin,
  Terminal,
} from "lucide-react";
import { PageIntro } from "@/components/layout/page-intro";
import { Reveal } from "@/components/animations/reveal";
import { TiltCard } from "@/components/animations/tilt-card";
import { SpotlightCard } from "@/components/animations/spotlight-card";
import { Magnetic } from "@/components/animations/magnetic";
import { getSiteSettings } from "@/lib/portfolio-repository";
import { education } from "@/data/experience";
import { skillGroups } from "@/data/skills";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Tharuka Bandara — Full-Stack Software Engineer with a BSc (Hons) Software Engineering (2:1) from the University of Plymouth and experience in Spring Boot, ASP.NET Core, and MERN.",
};

const principles = [
  {
    icon: Layers,
    title: "Structured Architecture & Clean DTOs",
    description:
      "From Spring Boot multi-tenant services to ASP.NET Core modules, I prioritize clear separation between controllers, service logic, DTO validation, and persistence.",
  },
  {
    icon: Database,
    title: "Domain-Driven Data Modeling",
    description:
      "Designing schemas that accurately reflect real operational workflows—covering users, inventory, orders, job scheduling, seat reservations, and document storage.",
  },
  {
    icon: Code2,
    title: "End-to-End Verification",
    description:
      "Writing software isn't complete until API contracts, edge cases, authentication boundaries, and document handling flows are thoroughly tested.",
  },
];

export default async function AboutPage() {
  const site = await getSiteSettings();

  return (
    <div className="container section-space">
      <PageIntro
        eyebrow="About Me"
        title="Curious by nature. Engineer by practice."
        description="I'm Tharuka Bandara, a Full-Stack Software Engineer based in Sri Lanka with hands-on experience across enterprise backend microservices and modern web applications."
      />

      <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
        <Reveal className="space-y-5">
          <TiltCard maxTilt={10} accent="cyan">
            <div className="panel overflow-hidden p-3">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-white/[0.08] bg-[#0d131c]">
                <Image
                  src={site.portraitPath}
                  alt="Tharuka Bandara"
                  fill
                  sizes="(max-width: 1024px) 90vw, 420px"
                  className="object-cover object-top"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#090c10] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/10 bg-[#090c10]/85 p-4 backdrop-blur-md">
                  <p className="text-sm font-semibold text-white">{site.name}</p>
                  <p className="mt-0.5 text-xs text-[#20cfff]">{site.role}</p>
                  <p className="mt-2 flex items-center gap-1.5 text-[11px] text-[#9aa8b8]">
                    <MapPin size={13} className="text-[#c8ff00]" />
                    {site.locationDetail}
                  </p>
                </div>
              </div>
            </div>
          </TiltCard>

          <SpotlightCard accent="cyan" className="p-6">
            <p className="font-mono-code text-xs uppercase tracking-wider text-[#20cfff]">
              Quick Profile
            </p>
            <dl className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between border-b border-white/[0.06] pb-2.5">
                <dt className="text-[#8492a2]">Degree</dt>
                <dd className="font-medium text-white">BSc (Hons) Software Engineering</dd>
              </div>
              <div className="flex justify-between border-b border-white/[0.06] pb-2.5">
                <dt className="text-[#8492a2]">Honours Class</dt>
                <dd className="font-medium text-[#c8ff00]">Upper Second-Class (2:1)</dd>
              </div>
              <div className="flex justify-between border-b border-white/[0.06] pb-2.5">
                <dt className="text-[#8492a2]">University</dt>
                <dd className="font-medium text-white">University of Plymouth (UK)</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#8492a2]">Primary Stacks</dt>
                <dd className="font-medium text-white">Spring Boot · .NET Core · MERN</dd>
              </div>
            </dl>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <Magnetic strength={0.28} className="flex-1">
                <a href={site.cvPath} download className="button-primary w-full text-xs">
                  Download CV <Download size={14} />
                </a>
              </Magnetic>
              <Magnetic strength={0.25} className="flex-1">
                <Link href="/contact" className="button-secondary w-full text-xs">
                  Contact <ArrowUpRight size={14} />
                </Link>
              </Magnetic>
            </div>
          </SpotlightCard>
        </Reveal>

        <Reveal delay={0.1} className="space-y-8">
          <SpotlightCard accent="cyan" className="p-7 sm:p-8">
            <span className="eyebrow">Engineering Story</span>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
              Bridging enterprise backend rigor with modern web interfaces.
            </h2>
            <div className="mt-4 space-y-4 text-sm leading-8 text-[#9aa8b8]">
              <p>
                I graduated with a{" "}
                <strong className="font-medium text-white">
                  BSc (Hons) in Software Engineering (Second Class Honours, Upper Division)
                </strong>{" "}
                from NSBM Green University in affiliation with the{" "}
                <strong className="font-medium text-white">University of Plymouth (UK)</strong>.
                Throughout my degree and industry internships, I have focused on understanding how
                real-world software systems are structured from the database schema all the way to
                the user interface.
              </p>
              <p>
                At{" "}
                <strong className="font-medium text-white">
                  Sri Lanka Telecom PLC (SLT)
                </strong>
                , I worked with the C# and ASP.NET Core team to build{" "}
                <strong className="font-medium text-white">ProHub</strong>, an upgraded enterprise
                platform replacing a legacy internal system—handling user, client, and internal
                project workflows alongside document management and system testing.
              </p>
              <p>
                Currently, as a Software Engineer Intern at{" "}
                <strong className="font-medium text-white">
                  AlgoBrave Technologies Pty Ltd (Australia)
                </strong>
                , I support backend development for{" "}
                <strong className="font-medium text-white">StayCleanly</strong>, a multi-tenant
                microservice platform built with{" "}
                <strong className="font-medium text-white">
                  Java Spring Boot, PostgreSQL, and AWS S3
                </strong>
                —contributing across user, inventory, order, and job management services as well as
                whole-system and document-handling verification.
              </p>
            </div>
          </SpotlightCard>

          <section className="grid gap-4 sm:grid-cols-3">
            {principles.map(({ icon: Icon, title, description }, index) => (
              <SpotlightCard
                key={title}
                accent={index === 1 ? "lime" : "cyan"}
                className="p-5"
              >
                <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#20cfff]/30 bg-[#20cfff]/10 text-[#20cfff]">
                  <Icon size={17} />
                </div>
                <h3 className="text-sm font-semibold text-white">{title}</h3>
                <p className="mt-2 text-xs leading-6 text-[#9aa8b8]">{description}</p>
              </SpotlightCard>
            ))}
          </section>

          <SpotlightCard accent="lime" className="p-7 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="eyebrow">
                <Award size={14} /> Academic Qualification
              </span>
              <span className="badge-lime">{education.period}</span>
            </div>
            <h2 className="mt-3 text-xl font-semibold text-white">{education.qualification}</h2>
            <p className="mt-1 text-sm text-[#dce5ed]">
              {education.partnerInstitution} · {education.institution}
            </p>
            <p className="mt-1 font-mono-code text-xs text-[#20cfff]">{education.result}</p>
            <ul className="mt-4 space-y-2 text-xs leading-6 text-[#9aa8b8]">
              {education.highlights.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c8ff00]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </SpotlightCard>

          <SpotlightCard accent="cyan" className="p-7 sm:p-8">
            <span className="eyebrow">
              <Globe2 size={14} /> Career Goals
            </span>
            <h2 className="mt-3 text-xl font-semibold text-white">
              Ready for international & collaborative engineering teams.
            </h2>
            <p className="mt-3 text-sm leading-8 text-[#9aa8b8]">
              I am actively seeking Full-Stack or Backend Software Engineering opportunities where I
              can contribute to scalable web products, microservices, and enterprise platforms while
              continuing to grow alongside experienced engineers.
            </p>
          </SpotlightCard>
        </Reveal>
      </div>

      <section className="mt-20 border-t border-white/[0.06] pt-16">
        <Reveal>
          <div className="section-heading">
            <span className="eyebrow">
              <Terminal size={14} /> Technical Matrix
            </span>
            <h2>
              Core technologies & <span className="gradient-text">tools.</span>
            </h2>
            <p>
              Grouped by architectural layer across backend services, frontend interfaces, databases,
              and engineering workflow tools.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-2">
          {skillGroups.map((group, idx) => (
            <Reveal key={group.id} delay={idx * 0.06}>
              <SpotlightCard
                accent={idx % 2 === 0 ? "cyan" : "lime"}
                className="h-full p-6"
              >
                <h3 className="text-base font-semibold text-white">{group.title}</h3>
                <p className="mt-1 text-xs text-[#8492a2]">{group.subtitle}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((skill) => (
                    <span key={skill} className="badge-tech">
                      {skill}
                    </span>
                  ))}
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
