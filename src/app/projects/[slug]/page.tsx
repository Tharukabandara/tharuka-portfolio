import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Cpu,
  Github,
  Layers,
  ShieldAlert,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { projects as staticProjects } from "@/data/projects";
import { getProjects, getProjectBySlug } from "@/lib/portfolio-repository";

export function generateStaticParams() {
  return staticProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project" };
  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const projects = await getProjects();
  const currentIndex = projects.findIndex((p) => p.slug === slug);
  if (currentIndex === -1) notFound();

  const project = projects[currentIndex];
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject =
    currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  const isCompleted = project.status === "Completed";

  return (
    <div className="container section-space">
      <Link
        href="/projects"
        className="mb-10 inline-flex items-center gap-2 font-mono-code text-xs text-[#9aa8b8] transition hover:text-[#20cfff]"
      >
        <ArrowLeft size={14} /> Back to all projects
      </Link>

      <div className="panel relative overflow-hidden p-7 sm:p-11">
        <div className="grid-glow pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="eyebrow">{project.category}</span>
            <span
              className={`rounded-full border px-3 py-0.5 font-mono-code text-[11px] font-medium ${
                isCompleted
                  ? "border-[#c8ff00]/35 bg-[#c8ff00]/10 text-[#c8ff00]"
                  : "border-[#20cfff]/35 bg-[#20cfff]/10 text-[#20cfff]"
              }`}
            >
              {project.status}
            </span>
          </div>

          <h1 className="mt-4 text-4xl font-bold tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
            {project.title}
          </h1>
          <p className="mt-3 text-base font-medium text-[#dce5ed] sm:text-lg">
            {project.subtitle}
          </p>
          <p className="mt-5 text-sm leading-8 text-[#9aa8b8] sm:text-base">
            {project.summary}
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <span key={item} className="badge-tech">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_320px]">
        <article className="space-y-10">
          <section className="panel p-7 sm:p-8">
            <h2 className="text-xl font-semibold text-white">1. Executive Overview & Problem</h2>
            <p className="mt-4 text-sm leading-8 text-[#9aa8b8]">{project.description}</p>
            <div className="mt-6 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
              <p className="font-mono-code text-xs uppercase tracking-wider text-[#c8ff00]">
                The Problem Addressed
              </p>
              <p className="mt-2 text-sm leading-7 text-[#dce5ed]">{project.problem}</p>
            </div>
          </section>

          <section className="panel p-7 sm:p-8">
            <div className="flex items-center gap-2.5 text-[#20cfff]">
              <Layers size={20} />
              <h2 className="text-xl font-semibold text-white">2. System Architecture</h2>
            </div>
            <p className="mt-4 text-sm leading-8 text-[#9aa8b8]">
              {project.architecture.overview}
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {project.architecture.layers.map((layer, index) => (
                <div
                  key={layer.name}
                  className="rounded-xl border border-white/[0.08] bg-[#0b1017] p-5"
                >
                  <span className="font-mono-code text-[10px] text-[#20cfff]">
                    LAYER 0{index + 1}
                  </span>
                  <h3 className="mt-1 text-sm font-semibold text-white">{layer.name}</h3>
                  <p className="mt-2 text-xs leading-6 text-[#9aa8b8]">{layer.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="panel p-7 sm:p-8">
            <div className="flex items-center gap-2.5 text-[#c8ff00]">
              <Cpu size={20} />
              <h2 className="text-xl font-semibold text-white">3. Key Features Engineered</h2>
            </div>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-[#9aa8b8]">
              {project.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="mt-1.5 shrink-0 text-[#c8ff00]" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="grid gap-6 sm:grid-cols-2">
            <section className="panel p-6 sm:p-7">
              <div className="flex items-center gap-2 text-[#20cfff]">
                <ShieldAlert size={18} />
                <h2 className="text-lg font-semibold text-white">Technical Challenges</h2>
              </div>
              <ul className="mt-4 space-y-3 text-xs leading-6 text-[#9aa8b8]">
                {project.challenges.map((challenge) => (
                  <li key={challenge} className="flex items-start gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#20cfff]" />
                    <span>{challenge}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="panel p-6 sm:p-7">
              <div className="flex items-center gap-2 text-[#c8ff00]">
                <Sparkles size={18} />
                <h2 className="text-lg font-semibold text-white">Outcomes & Impact</h2>
              </div>
              <ul className="mt-4 space-y-3 text-xs leading-6 text-[#9aa8b8]">
                {project.outcomes.map((outcome) => (
                  <li key={outcome} className="flex items-start gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c8ff00]" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </article>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:h-fit">
          <div className="panel p-6">
            <p className="font-mono-code text-[11px] uppercase tracking-wider text-[#20cfff]">
              Case Study Metadata
            </p>

            <div className="mt-4 space-y-4 text-xs">
              <div>
                <p className="text-[#8492a2]">My Role</p>
                <p className="mt-1 flex items-center gap-1.5 font-medium text-white">
                  <UserCheck size={14} className="text-[#c8ff00]" />
                  {project.role}
                </p>
              </div>

              <div className="border-t border-white/[0.06] pt-4">
                <p className="text-[#8492a2]">Context</p>
                <p className="mt-1 font-medium text-white">{project.context}</p>
              </div>

              <div className="border-t border-white/[0.06] pt-4">
                <p className="text-[#8492a2]">Status</p>
                <p className="mt-1 font-medium text-[#c8ff00]">{project.status}</p>
              </div>

              <div className="border-t border-white/[0.06] pt-4">
                <p className="text-[#8492a2]">Technology Stack</p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {project.stack.map((item) => (
                    <span key={item} className="badge-tech">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2.5 border-t border-white/[0.06] pt-5">
              {project.links?.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="button-secondary w-full text-xs"
                >
                  <Github size={15} /> View on GitHub <ArrowUpRight size={14} />
                </a>
              )}
              {project.links?.demo && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="button-primary w-full text-xs"
                >
                  Live Demo <ArrowUpRight size={14} />
                </a>
              )}
              <Link href="/contact" className="button-primary w-full text-xs">
                Discuss this architecture <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-16 grid gap-4 border-t border-white/[0.07] pt-10 sm:grid-cols-2">
        {prevProject ? (
          <Link
            href={`/projects/${prevProject.slug}`}
            className="panel-interactive flex items-center justify-between p-5"
          >
            <div>
              <p className="font-mono-code text-[10px] uppercase tracking-wider text-[#8492a2]">
                Previous Case Study
              </p>
              <p className="mt-1 text-sm font-semibold text-white">{prevProject.title}</p>
            </div>
            <ArrowLeft size={16} className="text-[#20cfff]" />
          </Link>
        ) : (
          <div />
        )}

        {nextProject ? (
          <Link
            href={`/projects/${nextProject.slug}`}
            className="panel-interactive flex items-center justify-between p-5 text-right"
          >
            <ArrowRight size={16} className="text-[#20cfff]" />
            <div>
              <p className="font-mono-code text-[10px] uppercase tracking-wider text-[#8492a2]">
                Next Case Study
              </p>
              <p className="mt-1 text-sm font-semibold text-white">{nextProject.title}</p>
            </div>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
