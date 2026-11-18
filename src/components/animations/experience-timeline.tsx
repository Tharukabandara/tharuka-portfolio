"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

export function ExperienceTimeline({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 75%", "end 35%"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <div ref={containerRef} className="relative pl-6 sm:pl-10">
      {/* Static background track */}
      <div
        aria-hidden="true"
        className="absolute bottom-4 left-2 top-4 w-[2px] rounded-full bg-white/[0.08] sm:left-3.5"
      />

      {/* Animated scroll-linked neon laser beam */}
      {!reduceMotion && (
        <motion.div
          aria-hidden="true"
          style={{ scaleY }}
          className="absolute bottom-4 left-2 top-4 w-[2px] origin-top rounded-full bg-gradient-to-b from-[#20cfff] via-[#7ef3ff] to-[#c8ff00] shadow-[0_0_18px_rgba(32,207,255,0.9)] sm:left-3.5"
        />
      )}

      <div className="space-y-8">{children}</div>
    </div>
  );
}
