"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { CustomerStory } from "@/content/site";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

export function CustomerCarousel({ stories }: { stories: CustomerStory[] }) {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = el.scrollWidth - el.clientWidth;
      setCanPrev(el.scrollLeft > 4);
      setCanNext(el.scrollLeft < max - 4);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    schedule();
    el.addEventListener("scroll", schedule, { passive: true });
    const observer = new ResizeObserver(schedule);
    observer.observe(el);
    return () => {
      window.cancelAnimationFrame(frame);
      el.removeEventListener("scroll", schedule);
      observer.disconnect();
    };
  }, []);

  const scrollByCard = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector("li");
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const step = card ? card.getBoundingClientRect().width + gap : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * step, behavior: reducedMotion ? "auto" : "smooth" });
  };

  const arrowClasses =
    "grid size-11 place-items-center rounded-full border border-ink/15 transition-colors hover:bg-ink/5 disabled:cursor-default disabled:opacity-35 disabled:hover:bg-transparent";

  return (
    <div>
      <div className="site-container flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <h2
          id="customers-title"
          className="max-w-2xl text-balance text-[clamp(2rem,4.4vw,3.5rem)] leading-[1.04] tracking-[-0.03em]"
        >
          Trusted where the stakes are highest.
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
            aria-label="Previous stories"
            aria-controls="customer-stories"
            className={arrowClasses}
          >
            <ArrowLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={!canNext}
            aria-label="Next stories"
            aria-controls="customer-stories"
            className={arrowClasses}
          >
            <ArrowRight className="size-5" aria-hidden />
          </button>
        </div>
      </div>

      <ul
        ref={scrollerRef}
        id="customer-stories"
        aria-label="Customer stories"
        tabIndex={0}
        className="no-scrollbar bleed-x mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2"
      >
        {stories.map((story) => (
          <li key={story.id} className="shrink-0 snap-start">
            <article
              className={cn(
                "relative flex h-[26rem] w-[18.5rem] flex-col justify-between overflow-hidden rounded-2xl p-6 text-white sm:w-[22rem]",
                story.tone,
              )}
            >
              <div
                aria-hidden
                className="pattern-grid pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]"
              />
              <span className="relative w-fit rounded-full bg-white/12 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.08em] text-white/85">
                {story.sector}
              </span>
              <p className="relative text-[1.375rem] leading-[1.25] tracking-[-0.01em]">{story.outcome}</p>
              <p className="relative text-sm text-white/65">{story.org}</p>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
