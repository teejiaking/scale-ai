"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { cn } from "@/lib/cn";

/** Cycles through words. Decorative: pair it with screen-reader text. */
export function RotatingWord({
  words,
  paused,
  interval = 2200,
  className,
}: {
  words: string[];
  paused: boolean;
  interval?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (paused || reducedMotion) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => window.clearInterval(id);
  }, [paused, reducedMotion, interval, words.length]);

  const word = words[index];

  return (
    <span aria-hidden="true" className={cn("inline-block", className)}>
      <span key={word} className="inline-block animate-word-in">
        {word}
      </span>
    </span>
  );
}
