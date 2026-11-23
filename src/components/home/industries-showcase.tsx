"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  Bot,
  Building2,
  Car,
  Factory,
  HeartPulse,
  Landmark,
  Microscope,
  Pause,
  Play,
  Satellite,
  Shield,
  Truck,
  Umbrella,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { ButtonLink } from "@/components/button";
import { INDUSTRY_WORDS } from "@/content/site";
import { cn } from "@/lib/cn";
import { RotatingWord } from "./rotating-word";

interface Tile {
  icon: LucideIcon;
  label: string;
  left: number;
  top: number;
  size: number;
  tone: string;
  duration: number;
  delay: number;
}

// Positions are percentages of the showcase box; the centre is kept clear for the headline.
const TILES: Tile[] = [
  { icon: Shield, label: "Defense", left: 17, top: 14, size: 118, tone: "from-[#14202b] to-[#2c5364]", duration: 9, delay: 0 },
  { icon: HeartPulse, label: "Healthcare", left: 33, top: 3, size: 92, tone: "from-[#0e2b2b] to-[#1f6f6a]", duration: 10, delay: -3 },
  { icon: Microscope, label: "Life sciences", left: 50, top: 6, size: 80, tone: "from-[#102a2d] to-[#2a7f87]", duration: 8, delay: -1 },
  { icon: Car, label: "Autonomy", left: 65, top: 4, size: 70, tone: "from-[#20262e] to-[#56606e]", duration: 11, delay: -5 },
  { icon: Satellite, label: "Space", left: 79, top: 15, size: 58, tone: "from-[#0d0f1a] to-[#3a3f6b]", duration: 9, delay: -2 },
  { icon: Zap, label: "Energy", left: 86, top: 42, size: 64, tone: "from-[#1f2a12] to-[#5c6b1f]", duration: 10, delay: -6 },
  { icon: Bot, label: "Robotics", left: 75, top: 63, size: 96, tone: "from-[#3a2c1f] to-[#8a6a46]", duration: 8, delay: -4 },
  { icon: Landmark, label: "Finance", left: 58, top: 76, size: 88, tone: "from-[#1d1b3a] to-[#4b3f8f]", duration: 12, delay: -7 },
  { icon: Building2, label: "Public sector", left: 38, top: 75, size: 108, tone: "from-[#13263f] to-[#2f5d8a]", duration: 9, delay: -2 },
  { icon: Truck, label: "Logistics", left: 20, top: 66, size: 96, tone: "from-[#2e2416] to-[#9a7a45]", duration: 11, delay: -8 },
  { icon: Umbrella, label: "Insurance", left: 5, top: 41, size: 112, tone: "from-[#2b1d2f] to-[#7a4a6e]", duration: 10, delay: -1 },
  { icon: Factory, label: "Manufacturing", left: 6, top: 9, size: 66, tone: "from-[#262626] to-[#6b6b6b]", duration: 9, delay: -5 },
];

const MOBILE_TILES = ["Defense", "Healthcare", "Robotics", "Energy", "Finance", "Autonomy", "Insurance", "Space"].map(
  (label) => TILES.find((tile) => tile.label === label)!,
);

// Approximate width of the 9px mono label (≈6.5px per character plus its 10px inset).
const labelFits = (label: string, size: number) => 10 + label.length * 6.5 <= size;

function TileArt({ tile, size }: { tile: Tile; size?: number }) {
  const Icon = tile.icon;
  // Fluid mobile tiles are about 78px wide.
  const showLabel = size === undefined ? labelFits(tile.label, 78) : size >= 80 && labelFits(tile.label, size);
  return (
    <div
      className={cn(
        "relative grid place-items-center overflow-hidden rounded-2xl bg-linear-to-br shadow-[0_22px_40px_-22px_rgba(0,0,0,0.5)]",
        tile.tone,
        size === undefined && "aspect-square w-full",
      )}
      style={size === undefined ? undefined : { width: size, height: size }}
    >
      <div className="pattern-dots absolute inset-0 opacity-50" />
      <Icon className="relative size-[34%] text-white/85" strokeWidth={1.4} />
      {showLabel && (
        <span
          className={cn(
            "absolute bottom-2 left-2.5 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.12em] text-white/70",
            // Fluid tiles drop below ~78px on very narrow phones; show icons only there.
            size === undefined && "max-[379px]:hidden",
          )}
        >
          {tile.label}
        </span>
      )}
    </div>
  );
}

export function IndustriesShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const [userPaused, setUserPaused] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const paused = userPaused || !inView;
  const spoken = `${INDUSTRY_WORDS.slice(0, -1).join(", ")}, and ${INDUSTRY_WORDS.at(-1)}`;

  return (
    <div ref={ref} data-paused={paused ? "" : undefined} className="relative">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
        {TILES.map((tile) => (
          <div
            key={tile.label}
            className="absolute animate-float"
            style={
              {
                left: `${tile.left}%`,
                top: `${tile.top}%`,
                animationDuration: `${tile.duration}s`,
                animationDelay: `${tile.delay}s`,
              } as CSSProperties
            }
          >
            <TileArt tile={tile} size={tile.size} />
          </div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center px-[var(--gutter)] pb-10 pt-24 text-center md:min-h-[46rem] md:py-24">
        <h2
          id="industries-title"
          className="text-[clamp(2.75rem,6.4vw,5.25rem)] leading-[1.02] tracking-[-0.035em]"
        >
          <span className="sr-only">Built for {spoken}</span>
          <span aria-hidden="true">Built for</span>
          <br />
          <RotatingWord words={INDUSTRY_WORDS} paused={paused} className="text-sand-ink" />
        </h2>
        <p className="mt-6 max-w-md text-balance text-lg text-ink/60">
          The same discipline in data and evaluation, applied wherever AI has to be right.
        </p>
        <ButtonLink href="/demo" variant="inverse" size="sm" className="mt-8 shadow-sm">
          Book a demo
        </ButtonLink>
      </div>

      <div aria-hidden="true" className="grid grid-cols-4 gap-3 px-[var(--gutter)] pb-16 md:hidden">
        {MOBILE_TILES.map((tile) => (
          <TileArt key={tile.label} tile={tile} />
        ))}
      </div>

      <button
        type="button"
        onClick={() => setUserPaused((value) => !value)}
        aria-label={userPaused ? "Play animation" : "Pause animation"}
        className="absolute bottom-4 right-[var(--gutter)] z-10 grid size-9 place-items-center rounded-full bg-white/80 text-ink/70 shadow-sm transition-colors hover:bg-white hover:text-ink md:bottom-6"
      >
        {userPaused ? <Play className="size-4" aria-hidden /> : <Pause className="size-4" aria-hidden />}
      </button>
    </div>
  );
}
