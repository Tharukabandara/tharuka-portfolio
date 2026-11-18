import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { site as staticSite } from "@/data/site";
import type { SiteSettings } from "@/lib/portfolio-repository";

export function Footer({ site = staticSite }: { site?: SiteSettings }) {
  return (
    <footer className="border-t border-white/[0.08] bg-[#070a0e]">
      <div className="container grid gap-10 py-14 md:grid-cols-[1.3fr_0.8fr_0.9fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5 text-lg font-black tracking-[-.06em]">
            <Image
              src="/logo.svg"
              alt="Tharuka Bandara Logo"
              width={30}
              height={30}
              className="rounded-md"
            />
            <span>
              {site.shortName}
              <span className="text-[#c8ff00]">.</span>
            </span>
          </Link>
          <p className="mt-3 max-w-sm text-xs leading-6 text-[#8492a2]">
            {site.description}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-[11px] text-[#b8c7d6]">
            <span className="status-dot" />
            <span>{site.availability}</span>
          </div>
        </div>

        <div>
          <p className="font-mono-code text-[11px] font-semibold uppercase tracking-wider text-[#20cfff]">
            Navigation
          </p>
          <ul className="mt-3 space-y-2.5 text-xs text-[#9aa8b8]">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/projects" className="hover:text-white">Projects & Case Studies</Link></li>
            <li><Link href="/experience" className="hover:text-white">Experience & Education</Link></li>
            <li><Link href="/about" className="hover:text-white">About & Engineering Approach</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-mono-code text-[11px] font-semibold uppercase tracking-wider text-[#20cfff]">
            Direct Channels
          </p>
          <div className="mt-3 space-y-2.5 text-xs text-[#9aa8b8]">
            <p className="flex items-center gap-2">
              <MapPin size={14} className="text-[#c8ff00]" />
              <span>{site.locationDetail}</span>
            </p>
            <p>
              <a href={`mailto:${site.email}`} className="hover:text-[#20cfff]">
                {site.email}
              </a>
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                aria-label="GitHub"
                href={site.github}
                target="_blank"
                rel="noreferrer"
                className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.02] text-[#9aa8b8] transition hover:border-[#20cfff]/40 hover:text-[#20cfff]"
              >
                <Github size={16} />
              </a>
              <a
                aria-label="LinkedIn"
                href={site.linkedin}
                target="_blank"
                rel="noreferrer"
                className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.02] text-[#9aa8b8] transition hover:border-[#20cfff]/40 hover:text-[#20cfff]"
              >
                <Linkedin size={16} />
              </a>
              <a
                aria-label="Email"
                href={`mailto:${site.email}`}
                className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.02] text-[#9aa8b8] transition hover:border-[#20cfff]/40 hover:text-[#20cfff]"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container flex flex-col justify-between gap-3 border-t border-white/[0.06] py-5 text-[11px] text-[#647386] sm:flex-row sm:items-center">
        <span>© {new Date().getFullYear()} {site.name}. Engineered with Next.js, TypeScript & Tailwind CSS.</span>
        <a href="#top" className="inline-flex items-center gap-1 text-[#9aa8b8] hover:text-[#20cfff]">
          Back to top <ArrowUpRight size={13} />
        </a>
      </div>
    </footer>
  );
}
