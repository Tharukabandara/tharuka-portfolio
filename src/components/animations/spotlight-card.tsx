"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import type { MouseEvent, ReactNode } from "react";

export function SpotlightCard({
  children,
  className = "",
  accent = "cyan",
}: {
  children: ReactNode;
  className?: string;
  accent?: "cyan" | "lime";
}) {
  const reduceMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const opacity = useMotionValue(0);
  const smoothOpacity = useSpring(opacity, { stiffness: 220, damping: 26 });

  const surfaceColor =
    accent === "lime"
      ? "rgba(200, 255, 0, 0.14)"
      : "rgba(32, 207, 255, 0.16)";

  const borderColor =
    accent === "lime"
      ? "rgba(200, 255, 0, 0.55)"
      : "rgba(32, 207, 255, 0.55)";

  const surfaceGlow = useMotionTemplate`radial-gradient(420px circle at ${mouseX}px ${mouseY}px, ${surfaceColor}, transparent 75%)`;
  const borderGlow = useMotionTemplate`radial-gradient(260px circle at ${mouseX}px ${mouseY}px, ${borderColor}, transparent 75%)`;

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
    opacity.set(1);
  };

  const handleMouseLeave = () => {
    opacity.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={`panel group relative overflow-hidden ${className}`}
    >
      {!reduceMotion && (
        <>
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 transition-opacity"
            style={{
              background: surfaceGlow,
              opacity: smoothOpacity,
            }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 rounded-[18px]"
            style={{
              padding: "1px",
              background: borderGlow,
              opacity: smoothOpacity,
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />
        </>
      )}
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}
