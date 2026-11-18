"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

export function AmbientBackground() {
  const reduceMotion = useReducedMotion();
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const smoothX = useSpring(mouseX, { stiffness: 110, damping: 26, mass: 0.5 });
  const smoothY = useSpring(mouseY, { stiffness: 110, damping: 26, mass: 0.5 });

  useEffect(() => {
    if (reduceMotion) return;
    const mediaQuery = window.matchMedia("(pointer: fine)");
    if (!mediaQuery.matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, reduceMotion]);

  const cursorBackground = useMotionTemplate`radial-gradient(620px circle at ${smoothX}px ${smoothY}px, rgba(32, 207, 255, 0.085), rgba(200, 255, 0, 0.03) 45%, transparent 80%)`;

  if (reduceMotion) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Desktop pointer-tracking ambient aura */}
      <motion.div
        className="hidden h-full w-full md:block"
        style={{ background: cursorBackground }}
      />

      {/* Autonomous floating neon cyan orb */}
      <motion.div
        className="absolute -right-32 top-16 h-[28rem] w-[28rem] rounded-full bg-[#20cfff]/[0.07] blur-[130px]"
        animate={{
          x: [0, -60, 20, 0],
          y: [0, 50, -30, 0],
          scale: [1, 1.12, 0.94, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Autonomous floating electric lime orb */}
      <motion.div
        className="absolute -left-32 bottom-20 h-[24rem] w-[24rem] rounded-full bg-[#c8ff00]/[0.05] blur-[130px]"
        animate={{
          x: [0, 70, -25, 0],
          y: [0, -55, 35, 0],
          scale: [1, 1.15, 0.92, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
