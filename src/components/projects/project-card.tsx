import Link from "next/link";
import { ArrowUpRight, CalendarClock, Coffee, Github, HeartHandshake, ShoppingBag } from "lucide-react";
import { TiltCard } from "@/components/animations/tilt-card";
import type { Project } from "@/data/projects";

function ProjectGlyph({ slug }: { slug: string }) {
  switch (slug) {
    case "pet-adoption-platform":
      return <HeartHandshake size={26} strokeWidth={1.5} />;
    case "seat-reservation-system":
      return <CalendarClock size={26} strokeWidth={1.5} />;
    case "pastamore-ecommerce":
      return <ShoppingBag size={26} strokeWidth={1.5} />;
    default:
      return <Coffee size={26} strokeWidth={1.5} />;
  }
}

export function ProjectCard({ project }: { project: Project }) {
  const isCompleted = project.status === "Completed";

  return (
    <TiltCard maxTilt={9} accent={project.accentColor} className="h-full">
      <article className="panel-interactive group relative flex h-full flex-col overflow-hidden">
        <div
          className={`relative flex aspect-[16/9] items-center justify-center overflow-hidden border-b border-white/[0.07] ${
            project.accentColor === "lime"
              ? "bg-[radial-gradient(ellipse_at_50%_25%,rgba(200,255,0,0.13),rgba(32,207,255,0.08)_48%,transparent_72%),#0e151f]"
              : "bg-[radial-gradient(ellipse_at_50%_25%,rgba(32,207,255,0.16),transparent_65%),#0e151f]"
          }`}
        >
          <div className="grid-glow absolute inset-0 opacity-75" />

          <div className="relative z-10 flex flex-col items-center gap-3 px-6 text-center">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl border transition-transform duration-300 group-hover:scale-110 ${
                project.accentColor === "lime"
                  ? "border-[#c8ff00]/30 bg-[#c8ff00]/10 text-[#c8ff00] shadow-[0_0_40px_rgba(200,255,0,0.16)]"
                  : "border-[#20cfff]/30 bg-[#20cfff]/10 text-[#20cfff] shadow-[0_0_40px_rgba(32,207,255,0.16)]"
              }`}
            >
              <ProjectGlyph slug={project.slug} />
            </div>
            <span className="font-mono-code text-[10px] uppercase tracking-widest text-[#8fa1b3]">
              {project.context}
            </span>
          </div>

          <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-[#090c10]/75 px-3 py-1 font-mono-code text-[10px] text-[#c7d3df] backdrop-blur">
            {project.category}
          </span>

          <span
            className={`absolute right-4 top-4 rounded-full border px-2.5 py-0.5 font-mono-code text-[10px] font-medium backdrop-blur ${
              isCompleted
                ? "border-[#c8ff00]/30 bg-[#c8ff00]/10 text-[#c8ff00]"
                : "border-[#20cfff]/30 bg-[#20cfff]/10 text-[#20cfff]"
            }`}
          >
            {project.status}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="mb-2.5 flex items-start justify-between gap-3">
            <h3 className="text-xl font-semibold tracking-tight text-white transition-colors group-hover:text-[#20cfff]">
              <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0">
                {project.title}
              </Link>
            </h3>
            <ArrowUpRight
              className="mt-1 shrink-0 text-[#20cfff] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              size={18}
            />
          </div>

          <p className="mb-5 text-sm leading-7 text-[#9aa8b8]">{project.summary}</p>

          <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {project.stack.slice(0, 6).map((item) => (
              <span key={item} className="badge-tech">
                {item}
              </span>
            ))}
          </div>

          <div className="relative z-10 mt-6 flex items-center justify-between border-t border-white/[0.06] pt-4">
            <Link
              href={`/projects/${project.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#20cfff] hover:text-[#68dfff]"
            >
              Read engineering case study <ArrowUpRight size={14} />
            </Link>
            {project.links?.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.title} GitHub repository`}
                className="inline-flex items-center gap-1 text-xs text-[#8fa1b3] hover:text-white"
              >
                <Github size={14} /> Code
              </a>
            )}
          </div>
        </div>
      </article>
    </TiltCard>
  );
}
