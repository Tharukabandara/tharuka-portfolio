"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight, Download } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { Magnetic } from "@/components/animations/magnetic";
import { site as staticSite } from "@/data/site";
import type { SiteSettings } from "@/lib/portfolio-repository";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar({ site = staticSite }: { site?: SiteSettings }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#090c10]/85 backdrop-blur-xl">
      <div className="container flex h-[76px] items-center justify-between">
        <Link href="/" className="group flex items-center gap-2.5 text-lg font-black tracking-[-.06em]">
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-[#20cfff]/30 bg-[#20cfff]/10 font-mono-code text-xs font-bold text-[#20cfff] transition group-hover:border-[#c8ff00]/50 group-hover:text-[#c8ff00]">
            TB
          </span>
          <span>
            {site.shortName}
            <span className="text-[#c8ff00]">.</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {links.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative rounded-lg px-3.5 py-2 text-[13px] font-medium transition-colors ${
                  active ? "text-[#20cfff]" : "text-[#9aa8b8] hover:text-white"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="navbar-active-pill"
                    className="absolute inset-0 -z-10 rounded-lg bg-white/[0.05]"
                    transition={{ type: "spring", stiffness: 360, damping: 28 }}
                  />
                )}
                {link.label}
                {active && (
                  <motion.span
                    layoutId="navbar-active-underline"
                    className="absolute inset-x-3.5 -bottom-[1px] h-[2px] rounded-full bg-gradient-to-r from-[#20cfff] to-[#c8ff00]"
                    transition={{ type: "spring", stiffness: 360, damping: 28 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2.5 md:flex">
          <Magnetic strength={0.22}>
            <a
              href={site.cvPath}
              download
              className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.02] px-3.5 text-xs font-semibold text-[#dce5ed] transition hover:border-[#20cfff]/45 hover:text-white"
            >
              CV <Download size={13} className="text-[#20cfff]" />
            </a>
          </Magnetic>
          <Magnetic strength={0.3}>
            <Link href="/contact" className="button-primary min-h-10 px-4 text-xs">
              Hire / Connect <ArrowUpRight size={14} />
            </Link>
          </Magnetic>
        </div>

        <button
          type="button"
          className="rounded-lg border border-white/10 p-2 text-[#dce5ed] md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <nav
          className="container flex flex-col gap-1 border-t border-white/10 py-4 md:hidden"
          aria-label="Mobile navigation"
        >
          {links.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between rounded-lg px-3.5 py-3 text-sm font-medium ${
                  active
                    ? "bg-[#20cfff]/10 text-[#20cfff]"
                    : "text-[#c4cfda] hover:bg-white/5"
                }`}
              >
                <span>{link.label}</span>
                {active && <span className="h-1.5 w-1.5 rounded-full bg-[#c8ff00]" />}
              </Link>
            );
          })}
          <div className="mt-3 flex gap-2 border-t border-white/10 pt-3">
            <a
              href={site.cvPath}
              download
              className="button-secondary flex-1 text-xs"
            >
              Download CV <Download size={14} />
            </a>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="button-primary flex-1 text-xs"
            >
              Get in touch <ArrowUpRight size={14} />
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
