import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

export interface FrameInfo {
  width: number;
  height: number;
  /** Seconds of animation elapsed. Stays at 0 when motion is reduced. */
  time: number;
  /** Seconds since the previous frame, capped to avoid jumps after tab switches. */
  delta: number;
  reducedMotion: boolean;
}

export type DrawFn = (ctx: CanvasRenderingContext2D, frame: FrameInfo) => void;

/** Builds a scene once per mount and returns the per-frame draw function. */
export type SceneFactory = (canvas: HTMLCanvasElement) => DrawFn;

/**
 * Runs a canvas animation that is DPR-aware, resizes with its element,
 * pauses while off screen, and renders a single still frame when the user
 * prefers reduced motion. `createScene` must be a stable (module-level) function.
 */
export function useAnimatedCanvas(createScene: SceneFactory) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const draw = createScene(canvas);
    let width = 0;
    let height = 0;
    let raf = 0;
    let last = 0;
    let time = 0;
    let visible = true;

    const render = (delta: number) => {
      ctx.clearRect(0, 0, width, height);
      draw(ctx, { width, height, time, delta, reducedMotion });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      render(0);
    };

    const loop = (now: number) => {
      const delta = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      time += delta;
      render(delta);
      raf = window.requestAnimationFrame(loop);
    };

    const start = () => {
      if (raf || reducedMotion || !visible) return;
      last = 0;
      raf = window.requestAnimationFrame(loop);
    };

    const stop = () => {
      window.cancelAnimationFrame(raf);
      raf = 0;
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    visibilityObserver.observe(canvas);

    resize();
    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, [createScene, reducedMotion]);

  return ref;
}
