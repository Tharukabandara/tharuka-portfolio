"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import type { MouseEvent, ReactNode } from "react";

export function TiltCard({
  children,
  className = "",
  maxTilt = 11,
  accent = "cyan",
}: {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  accent?: "cyan" | "lime";
}) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useMotionValue(200);
  const mouseY = useMotionValue(200);
  const glareOpacity = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 240, damping: 20, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 240, damping: 20, mass: 0.6 });
  const smoothGlare = useSpring(glareOpacity, { stiffness: 200, damping: 25 });

  const rotateX = useTransform(springY, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-maxTilt, maxTilt]);

  const glowColor =
    accent === "lime"
      ? "rgba(200, 255, 0, 0.24)"
      : "rgba(32, 207, 255, 0.26)";

  const spotlight = useMotionTemplate`radial-gradient(380px circle at ${mouseX}px ${mouseY}px, ${glowColor}, transparent 75%)`;

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;
    mouseX.set(localX);
    mouseY.set(localY);
    x.set(localX / rect.width - 0.5);
    y.set(localY / rect.height - 0.5);
    glareOpacity.set(1);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    glareOpacity.set(0);
  };

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      style={{ perspective: "1100px" }}
      className={className.includes("h-full") ? "h-full" : undefined}
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ scale: 1.015 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className={`relative ${className}`}
      >
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px z-20 rounded-[18px]"
          style={{
            background: spotlight,
            opacity: smoothGlare,
          }}
        />
        {children}
      </motion.div>
    </div>
  );
}
