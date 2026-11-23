"use client";

import { useAnimatedCanvas, type SceneFactory } from "@/lib/use-animated-canvas";

type ObjectClass = "car" | "pedestrian" | "cyclist";

interface GroundPoint {
  x: number;
  z: number;
  angle: number;
  falloff: number;
}

interface SceneObject {
  cls: ObjectClass;
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
  speed: number;
  score: number;
  points: [number, number, number][];
}

interface Projected {
  sx: number;
  sy: number;
  depth: number;
}

const CLASS_STYLE: Record<ObjectClass, { rgb: string; label: string }> = {
  car: { rgb: "94, 234, 212", label: "car" },
  pedestrian: { rgb: "251, 191, 36", label: "pedestrian" },
  cyclist: { rgb: "196, 181, 253", label: "cyclist" },
};

const DIMENSIONS: Record<ObjectClass, { w: number; d: number; h: number }> = {
  car: { w: 1.9, d: 4.4, h: 1.5 },
  pedestrian: { w: 0.7, d: 0.7, h: 1.75 },
  cyclist: { w: 0.7, d: 1.8, h: 1.7 },
};

/** 14 objects across 3 classes. Keep in sync with the hero HUD text. */
const OBJECTS: [ObjectClass, number, number, number, number][] = [
  // class, lane x, start z, relative speed (m/s), confidence
  ["car", 0, 14, 0, 0.98],
  ["car", 0, -13, 0, 0.96],
  ["car", -3.5, 6, 1.6, 0.97],
  ["car", -3.5, -20, 1.6, 0.93],
  ["car", 3.5, 22, -1.2, 0.95],
  ["car", 3.5, -4, -1.2, 0.99],
  ["car", -7, 28, -9, 0.91],
  ["car", -7, -6, -9, 0.94],
  ["pedestrian", 11, 4, 0.6, 0.92],
  ["pedestrian", 11.6, 9, 0.6, 0.88],
  ["pedestrian", -11, -3, -0.5, 0.9],
  ["pedestrian", -11.4, 16, -0.5, 0.87],
  ["cyclist", 8, 10, 2.4, 0.9],
  ["cyclist", 8, -18, 2.4, 0.86],
];

const RANGE = 46;
const TAU = Math.PI * 2;
const CAMERA_HEIGHT = 9;
const CAMERA_DISTANCE = 22;
const PITCH = 0.42;
const COS_P = Math.cos(PITCH);
const SIN_P = Math.sin(PITCH);

function createRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

const createLidarScene: SceneFactory = (canvas) => {
  const rand = createRandom(20160);
  const mono = getComputedStyle(canvas).fontFamily || "monospace";
  const ringCount = canvas.clientWidth < 640 ? 20 : 30;

  const ground: GroundPoint[] = [];
  let maxRadius = 0;
  for (let ring = 1; ring <= ringCount; ring++) {
    const radius = 2.2 + ring * 1.45 + ring * ring * 0.012;
    const count = Math.round(70 + ring * 10);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * TAU + (rand() - 0.5) * 0.01;
      const r = radius + (rand() - 0.5) * 0.35;
      maxRadius = Math.max(maxRadius, r);
      ground.push({ x: Math.cos(angle) * r, z: Math.sin(angle) * r, angle, falloff: r });
    }
  }
  for (const point of ground) point.falloff = 1 - point.falloff / maxRadius;

  const objects: SceneObject[] = OBJECTS.map(([cls, x, z, speed, score]) => {
    const dims = DIMENSIONS[cls];
    const count = cls === "car" ? 110 : 40;
    const points: [number, number, number][] = [];
    for (let i = 0; i < count; i++) {
      const face = rand();
      if (face < 0.3) {
        points.push([(rand() - 0.5) * dims.w, dims.h * (0.85 + rand() * 0.15), (rand() - 0.5) * dims.d]);
      } else if (face < 0.65) {
        points.push([(rand() < 0.5 ? -0.5 : 0.5) * dims.w, rand() * dims.h, (rand() - 0.5) * dims.d]);
      } else {
        points.push([(rand() - 0.5) * dims.w, rand() * dims.h, (rand() < 0.5 ? -0.5 : 0.5) * dims.d]);
      }
    }
    return { cls, x, z, speed, score, points, ...dims };
  });

  return (ctx, { width, height, time, delta, reducedMotion }) => {
    const t = reducedMotion ? 4 : time;
    const yaw = 0.6 + t * 0.045;
    const cosY = Math.cos(yaw);
    const sinY = Math.sin(yaw);
    const focal = Math.min(width, height) * 0.95;
    const cx = width / 2;
    const cy = height * 0.56;
    const sweep = (t * 2.2) % TAU;

    const project = (x: number, y: number, z: number): Projected | null => {
      const rx = x * cosY - z * sinY;
      const rz = x * sinY + z * cosY;
      const vy = y - CAMERA_HEIGHT;
      const vz = rz + CAMERA_DISTANCE;
      const yc = vy * COS_P + vz * SIN_P;
      const zc = -vy * SIN_P + vz * COS_P;
      if (zc < 1) return null;
      return { sx: cx + (focal * rx) / zc, sy: cy - (focal * yc) / zc, depth: zc };
    };

    const sweepGlow = (angle: number) => {
      const behind = (((sweep - angle) % TAU) + TAU) % TAU;
      return behind < 1.2 ? (1 - behind / 1.2) ** 2 : 0;
    };

    // Lane markings.
    ctx.strokeStyle = "rgba(255, 255, 255, 0.07)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (const laneX of [-8.75, -5.25, -1.75, 1.75, 5.25]) {
      for (let z = -RANGE; z < RANGE; z += 4) {
        const a = project(laneX, 0, z);
        const b = project(laneX, 0, z + 2);
        if (!a || !b) continue;
        ctx.moveTo(a.sx, a.sy);
        ctx.lineTo(b.sx, b.sy);
      }
    }
    ctx.stroke();

    // Ground returns.
    ctx.fillStyle = "rgb(190, 212, 255)";
    for (const point of ground) {
      const p = project(point.x, 0, point.z);
      if (!p || p.sx < -2 || p.sx > width + 2 || p.sy < -2 || p.sy > height + 2) continue;
      const depthFade = Math.min(1, Math.max(0.15, 1 - (p.depth - 12) / 70));
      const alpha = (0.1 + 0.2 * point.falloff + 0.7 * sweepGlow(point.angle)) * depthFade;
      const size = Math.min(2.2, Math.max(0.6, 46 / p.depth));
      ctx.globalAlpha = alpha;
      ctx.fillRect(p.sx, p.sy, size, size);
    }
    ctx.globalAlpha = 1;

    // Ego vehicle and sensor.
    const ego = boxCorners(0, 0, 1.9, 4.6, 1.5).map(([x, y, z]) => project(x, y, z));
    strokeBox(ctx, ego, "rgba(255, 255, 255, 0.35)");
    const sensor = project(0, 1.9, 0);
    if (sensor) {
      const glow = ctx.createRadialGradient(sensor.sx, sensor.sy, 0, sensor.sx, sensor.sy, 18);
      glow.addColorStop(0, "rgba(160, 200, 255, 0.9)");
      glow.addColorStop(1, "rgba(160, 200, 255, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(sensor.sx - 18, sensor.sy - 18, 36, 36);
    }

    ctx.font = `500 10px ${mono}`;
    ctx.textBaseline = "middle";

    for (const object of objects) {
      if (!reducedMotion) {
        object.z += object.speed * delta;
        if (object.z > RANGE) object.z -= RANGE * 2;
        if (object.z < -RANGE) object.z += RANGE * 2;
      }
      const style = CLASS_STYLE[object.cls];
      const glow = sweepGlow(Math.atan2(object.z, object.x));

      ctx.fillStyle = `rgb(${style.rgb})`;
      for (const [lx, ly, lz] of object.points) {
        const p = project(object.x + lx, ly, object.z + lz);
        if (!p) continue;
        const depthFade = Math.min(1, Math.max(0.2, 1 - (p.depth - 12) / 70));
        ctx.globalAlpha = (0.45 + 0.5 * glow) * depthFade;
        const size = Math.min(2.4, Math.max(0.8, 52 / p.depth));
        ctx.fillRect(p.sx, p.sy, size, size);
      }
      ctx.globalAlpha = 1;

      const corners = boxCorners(object.x, object.z, object.w, object.d, object.h).map(([x, y, z]) =>
        project(x, y, z),
      );
      if (corners.some((corner) => corner === null)) continue;
      const nearest = Math.min(...corners.map((corner) => corner!.depth));
      if (nearest > 70) continue;
      strokeBox(ctx, corners, `rgba(${style.rgb}, ${0.55 + 0.4 * glow})`);

      // Labels get cramped on narrow screens; boxes alone read fine there.
      if (nearest < 48 && width >= 640) {
        const top = corners.slice(4).reduce((a, b) => (b!.sy < a!.sy ? b : a))!;
        const text = `${style.label} ${object.score.toFixed(2)}`;
        const textWidth = ctx.measureText(text).width;
        const x = Math.round(top.sx - textWidth / 2 - 5);
        const y = Math.round(top.sy - 16);
        ctx.fillStyle = "rgba(8, 9, 18, 0.72)";
        ctx.fillRect(x, y - 8, textWidth + 10, 16);
        ctx.fillStyle = `rgb(${style.rgb})`;
        ctx.fillText(text, x + 5, y);
      }
    }
  };
};

/** Bottom four corners, then top four, for an axis-aligned box resting on the ground. */
function boxCorners(x: number, z: number, w: number, d: number, h: number): [number, number, number][] {
  const corners: [number, number, number][] = [];
  for (const y of [0, h]) {
    corners.push([x - w / 2, y, z - d / 2], [x + w / 2, y, z - d / 2], [x + w / 2, y, z + d / 2], [x - w / 2, y, z + d / 2]);
  }
  return corners;
}

const BOX_EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 0],
  [4, 5], [5, 6], [6, 7], [7, 4],
  [0, 4], [1, 5], [2, 6], [3, 7],
];

function strokeBox(ctx: CanvasRenderingContext2D, corners: (Projected | null)[], color: string) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (const [a, b] of BOX_EDGES) {
    const from = corners[a];
    const to = corners[b];
    if (!from || !to) continue;
    ctx.moveTo(from.sx, from.sy);
    ctx.lineTo(to.sx, to.sy);
  }
  ctx.stroke();
}

export function LidarCanvas({ className }: { className?: string }) {
  const ref = useAnimatedCanvas(createLidarScene);
  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
