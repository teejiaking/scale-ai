import { ButtonLink } from "@/components/button";
import { LidarCanvas } from "./lidar-canvas";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      data-header-theme="dark"
      className="px-3 pb-3 md:px-4 md:pb-4"
    >
      <div className="relative isolate flex h-[calc(100svh_-_var(--header-h)_-_0.75rem)] min-h-[36rem] items-center justify-center overflow-hidden rounded-2xl text-white md:h-[calc(100svh_-_var(--header-h)_-_1rem)]">
        <div aria-hidden className="hero-backdrop absolute inset-0 -z-20" />
        <LidarCanvas className="hero-canvas-mask absolute inset-0 -z-10 size-full font-mono" />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_45%_at_50%_50%,rgba(7,7,12,0.72)_0%,rgba(7,7,12,0.35)_55%,transparent_100%)]"
        />

        <div className="site-container text-center">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/60">
            Data · Evaluation · Agents
          </p>
          <h1
            id="hero-title"
            className="mx-auto mt-5 max-w-4xl text-balance text-[clamp(2.6rem,6.4vw,5.25rem)] leading-[1.02] tracking-[-0.035em]"
          >
            AI that holds up when the stakes are real.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-white/70 md:text-xl">
            Scale gives frontier labs, enterprises, and governments the training data,
            evaluations, and deployment tools to put trustworthy AI into production.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/demo" variant="inverse">
              Book a demo
            </ButtonLink>
            <ButtonLink href="/#products" variant="outline-inverse">
              Explore products
            </ButtonLink>
          </div>
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between p-5 font-mono text-[11px] uppercase tracking-[0.14em] text-white/55 md:p-6"
        >
          <span>Lidar · 64 beams · 10 Hz</span>
          <span className="hidden sm:inline">Objects 14 · Classes 3</span>
        </div>
      </div>
    </section>
  );
}
