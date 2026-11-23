"use client";

import { useEffect, useRef, type CSSProperties } from "react";

/**
 * Brightens a statement word by word as it scrolls through the viewport.
 * Renders fully visible on the server and for reduced-motion users.
 */
export function ScrollRevealText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const viewport = window.innerHeight;
      // 0 when the top enters the lower 15% of the screen; 1 when the bottom passes 45%.
      const progress = (viewport * 0.85 - rect.top) / (viewport * 0.4 + rect.height);
      el.style.setProperty("--p", String(Math.min(1, Math.max(0, progress))));
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        window.addEventListener("scroll", schedule, { passive: true });
        schedule();
      } else {
        window.removeEventListener("scroll", schedule);
        schedule();
      }
    });

    observer.observe(el);
    window.addEventListener("resize", schedule);
    schedule();

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <p ref={ref} className={className} style={{ "--n": words.length } as CSSProperties}>
      {words.map((word, i) => (
        <span key={i} className="reveal-word" style={{ "--i": i } as CSSProperties}>
          {word}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
