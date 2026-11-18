"use client";

import { Cpu, Sparkles } from "lucide-react";

const primaryStack = [
  "Java",
  "Spring Boot",
  "Multi-Tenant Microservices",
  "C#",
  "ASP.NET Core",
  "PostgreSQL",
  "React 19",
  "Next.js 16",
  "TypeScript",
  "Redux",
  "MongoDB",
  "Express.js",
  "Node.js",
  "AWS S3",
  "Stripe Sandbox",
  "JWT & RBAC",
  "RESTful APIs",
  "Tailwind CSS",
];

export function TechMarquee() {
  const repeated = [...primaryStack, ...primaryStack];

  return (
    <div className="relative overflow-hidden border-y border-white/[0.07] bg-[#0b1017]/80 py-4 backdrop-blur-md">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#090c10] to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#090c10] to-transparent"
      />

      <div className="marquee-track flex w-max items-center gap-4">
        {repeated.map((item, idx) => {
          const isHighlight = idx % 3 === 0;
          return (
            <div
              key={`${item}-${idx}`}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono-code text-xs transition ${
                isHighlight
                  ? "border-[#c8ff00]/30 bg-[#c8ff00]/[0.06] text-[#eef4fa]"
                  : "border-[#20cfff]/20 bg-white/[0.02] text-[#b8c7d6]"
              }`}
            >
              {isHighlight ? (
                <Sparkles size={12} className="text-[#c8ff00]" />
              ) : (
                <Cpu size={12} className="text-[#20cfff]" />
              )}
              <span>{item}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
