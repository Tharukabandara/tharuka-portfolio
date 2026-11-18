"use client";

import { motion, useReducedMotion } from "motion/react";

export function BlurText({
  text,
  highlightText,
  className = "",
  delay = 0,
}: {
  text: string;
  highlightText?: string;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");
  const highlightWords = highlightText ? highlightText.split(" ") : [];

  if (reduceMotion) {
    return (
      <span className={className}>
        {text}{" "}
        {highlightText && <span className="gradient-text">{highlightText}</span>}
      </span>
    );
  }

  return (
    <span className={`inline-flex flex-wrap gap-x-[0.28em] ${className}`}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.55,
            delay: delay + index * 0.065,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
      {highlightWords.map((word, index) => (
        <motion.span
          key={`hl-${word}-${index}`}
          initial={{ opacity: 0, y: 22, filter: "blur(12px)", scale: 0.95 }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
          transition={{
            duration: 0.6,
            delay: delay + (words.length + index) * 0.065,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="gradient-text inline-block"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}
