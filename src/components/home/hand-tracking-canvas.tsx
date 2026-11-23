"use client";

import { useAnimatedCanvas, type SceneFactory } from "@/lib/use-animated-canvas";

interface Finger {
  base: [number, number];
  angle: number;
  lengths: [number, number, number];
  bend: [number, number, number];
  lean: number;
  color: string;
  phase: number;
}

// Hand-space units: 1 = hand size, wrist at the origin, negative y points up.
const FINGERS: Finger[] = [
  { base: [-0.17, -0.1], angle: -2.35, lengths: [0.17, 0.14, 0.11], bend: [0.4, 0.5, 0.4], lean: 1, color: "#f87171", phase: 0 },
  { base: [-0.12, -0.42], angle: -1.72, lengths: [0.2, 0.12, 0.09], bend: [0.35, 0.55, 0.45], lean: 0.3, color: "#fb923c", phase: 0.9 },
  { base: [-0.01, -0.45], angle: -1.57, lengths: [0.22, 0.135, 0.095], bend: [0.35, 0.55, 0.45], lean: 0, color: "#facc15", phase: 1.8 },
  { base: [0.1, -0.42], angle: -1.42, lengths: [0.2, 0.125, 0.09], bend: [0.35, 0.55, 0.45], lean: -0.3, color: "#4ade80", phase: 2.7 },
  { base: [0.19, -0.35], angle: -1.25, lengths: [0.15, 0.095, 0.075], bend: [0.35, 0.55, 0.45], lean: -0.5, color: "#60a5fa", phase: 3.6 },
];

const SHRINK: [number, number, number] = [0.35, 0.55, 0.6];
const TRAIL_LENGTH = 48;

const createHandScene: SceneFactory = (canvas) => {
  const mono = getComputedStyle(canvas).fontFamily || "monospace";
  const trail: [number, number][] = [];

  return (ctx, { width, height, time, reducedMotion }) => {
    const t = reducedMotion ? 2 : time;
    const size = Math.min(width * 0.95, height * 0.72);
    const sway = Math.sin(t * 0.5) * 0.06;
    const originX = width / 2 + Math.sin(t * 0.35) * size * 0.02;
    const originY = height * 0.78 + Math.cos(t * 0.45) * size * 0.015;
    const cos = Math.cos(sway);
    const sin = Math.sin(sway);
    const toScreen = (x: number, y: number): [number, number] => [
      originX + (x * cos - y * sin) * size,
      originY + (x * sin + y * cos) * size,
    ];

    // Background dot grid.
    ctx.fillStyle = "rgba(255, 255, 255, 0.07)";
    for (let x = 12; x < width; x += 22) {
      for (let y = 12; y < height; y += 22) ctx.fillRect(x, y, 1.2, 1.2);
    }

    const wrist = toScreen(0, 0);
    const chains = FINGERS.map((finger) => {
      const curl = Math.max(0, Math.sin(t * 1.2 + finger.phase)) ** 2 * 0.9;
      const joints: [number, number][] = [toScreen(finger.base[0], finger.base[1])];
      let [x, y] = finger.base;
      let angle = finger.angle;
      for (let i = 0; i < 3; i++) {
        angle += finger.lean * curl * finger.bend[i];
        const length = finger.lengths[i] * (1 - curl * SHRINK[i]);
        x += Math.cos(angle) * length;
        y += Math.sin(angle) * length;
        joints.push(toScreen(x, y));
      }
      return { finger, joints };
    });

    const all = [wrist, ...chains.flatMap((chain) => chain.joints)];
    const minX = Math.min(...all.map((p) => p[0])) - 18;
    const maxX = Math.max(...all.map((p) => p[0])) + 18;
    const minY = Math.min(...all.map((p) => p[1])) - 18;
    const maxY = Math.max(...all.map((p) => p[1])) + 18;

    // Index fingertip trail.
    if (!reducedMotion) {
      trail.push(chains[1].joints[3]);
      if (trail.length > TRAIL_LENGTH) trail.shift();
      ctx.lineWidth = 1.5;
      for (let i = 1; i < trail.length; i++) {
        ctx.strokeStyle = `rgba(251, 146, 60, ${(i / trail.length) * 0.5})`;
        ctx.beginPath();
        ctx.moveTo(trail[i - 1][0], trail[i - 1][1]);
        ctx.lineTo(trail[i][0], trail[i][1]);
        ctx.stroke();
      }
    }

    // Bounding box and label.
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
    ctx.lineWidth = 1;
    ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
    ctx.setLineDash([]);
    ctx.font = `500 10px ${mono}`;
    ctx.textBaseline = "middle";
    const label = "hand 0.98";
    const labelWidth = ctx.measureText(label).width + 10;
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fillRect(minX, minY - 16, labelWidth, 16);
    ctx.fillStyle = "#0c0d10";
    ctx.fillText(label, minX + 5, minY - 8);

    // Bones.
    ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    const palm = [chains[0].joints[0], chains[1].joints[0], chains[2].joints[0], chains[3].joints[0], chains[4].joints[0]];
    ctx.moveTo(wrist[0], wrist[1]);
    ctx.lineTo(palm[0][0], palm[0][1]);
    ctx.moveTo(wrist[0], wrist[1]);
    ctx.lineTo(palm[1][0], palm[1][1]);
    for (let i = 2; i < palm.length; i++) ctx.lineTo(palm[i][0], palm[i][1]);
    ctx.lineTo(wrist[0], wrist[1]);
    for (const { joints } of chains) {
      ctx.moveTo(joints[0][0], joints[0][1]);
      for (let i = 1; i < joints.length; i++) ctx.lineTo(joints[i][0], joints[i][1]);
    }
    ctx.stroke();

    // Keypoints.
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(wrist[0], wrist[1], 4, 0, Math.PI * 2);
    ctx.fill();
    for (const { finger, joints } of chains) {
      ctx.fillStyle = finger.color;
      joints.forEach(([x, y], i) => {
        ctx.beginPath();
        ctx.arc(x, y, i === 3 ? 4 : 3.2, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  };
};

export function HandTrackingCanvas({ className }: { className?: string }) {
  const ref = useAnimatedCanvas(createHandScene);
  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
