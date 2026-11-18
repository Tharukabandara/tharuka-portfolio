"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Braces } from "lucide-react";
import { TiltCard } from "@/components/animations/tilt-card";
import { site } from "@/data/site";

export function HeroPortrait({ portraitPath = site.portraitPath }: { portraitPath?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative mx-auto w-full max-w-[410px]">
      <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-tr from-[#20cfff]/20 via-transparent to-[#c8ff00]/15 blur-2xl" />

      <TiltCard maxTilt={12} accent="cyan">
        <div className="panel relative overflow-hidden p-3">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-white/[0.08] bg-[#0d131c]">
            <Image
              src={portraitPath}
              alt="Tharuka Bandara — Full-Stack Software Engineer"
              fill
              priority
              sizes="(max-width: 768px) 90vw, 410px"
              className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#090c10] via-[#090c10]/20 to-transparent" />

            <motion.div
              animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-3.5 top-3.5 flex items-center gap-2 rounded-full border border-white/15 bg-[#090c10]/80 px-3 py-1 shadow-[0_8px_24px_rgba(0,0,0,0.45)] backdrop-blur-md"
            >
              <span className="status-dot" />
              <span className="font-mono-code text-[10px] font-semibold text-[#eef4fa]">
                BSc (Hons) SE · 2:1
              </span>
            </motion.div>

            <motion.div
              animate={reduceMotion ? undefined : { y: [0, 5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              className="absolute bottom-3.5 left-3.5 right-3.5 rounded-xl border border-white/15 bg-[#090c10]/88 p-3.5 shadow-[0_12px_30px_rgba(0,0,0,0.55)] backdrop-blur-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono-code text-[10px] uppercase tracking-wider text-[#c8ff00]">
                    Current Focus
                  </p>
                  <p className="mt-0.5 text-xs font-semibold text-white">
                    Spring Boot Microservices & Full-Stack Web
                  </p>
                </div>
                <span className="grid h-8 w-8 place-items-center rounded-lg border border-[#20cfff]/30 bg-[#20cfff]/10 text-[#20cfff]">
                  <Braces size={16} />
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </TiltCard>
    </div>
  );
}
