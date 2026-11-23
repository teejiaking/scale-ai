import type { ReactNode } from "react";

// Each plane maps a 100x100 square onto an isometric diamond:
// top (300, y), right (540, y + 70), bottom (300, y + 140), left (60, y + 70).
const planeMatrix = (y: number) => `matrix(2.4 0.7 -2.4 0.7 300 ${y})`;

const HEAT = [
  [0.9, 0.7, 0.5, 0.35, 0.25, 0.15],
  [0.75, 0.85, 0.6, 0.45, 0.3, 0.2],
  [0.55, 0.65, 0.9, 0.55, 0.4, 0.25],
  [0.4, 0.5, 0.6, 0.8, 0.5, 0.35],
  [0.3, 0.35, 0.45, 0.6, 0.85, 0.45],
  [0.2, 0.25, 0.35, 0.45, 0.6, 0.9],
];

const NODES: [number, number][] = [
  [18, 24],
  [50, 14],
  [82, 28],
  [34, 58],
  [66, 66],
  [86, 84],
  [16, 84],
];

const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [0, 3],
  [1, 3],
  [3, 4],
  [2, 4],
  [4, 5],
  [3, 6],
];

function Plane({
  y,
  index,
  label,
  delay,
  children,
}: {
  y: number;
  index: string;
  label: string;
  delay: string;
  children: ReactNode;
}) {
  return (
    <g className="animate-plane" style={{ animationDelay: delay }}>
      <polygon
        points={`300,${y} 540,${y + 70} 300,${y + 140} 60,${y + 70}`}
        fill="url(#plane-fill)"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="1"
      />
      <g transform={planeMatrix(y)}>{children}</g>
      <line
        x1="540"
        y1={y + 70}
        x2="578"
        y2={y + 70}
        stroke="rgba(255,255,255,0.35)"
        strokeDasharray="2 3"
      />
      <text x="588" y={y + 62} className="font-mono" fontSize="11" fill="rgba(255,255,255,0.45)">
        {index}
      </text>
      <text x="588" y={y + 82} fontSize="17" fill="rgba(255,255,255,0.9)">
        {label}
      </text>
    </g>
  );
}

export function StackIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 720 430"
      role="img"
      aria-labelledby="stack-illustration-title"
      className={className}
    >
      <title id="stack-illustration-title">
        Three stacked layers labeled Data, Evaluation, and Agents
      </title>
      <defs>
        <linearGradient id="plane-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="rgba(255,255,255,0.10)" />
          <stop offset="1" stopColor="rgba(255,255,255,0.02)" />
        </linearGradient>
      </defs>

      <line
        x1="300"
        y1="100"
        x2="300"
        y2="380"
        stroke="rgba(255,255,255,0.4)"
        strokeDasharray="4 8"
        className="animate-dash"
      />

      <Plane y={240} index="01" label="Data" delay="-4s">
        {Array.from({ length: 10 }, (_, i) =>
          Array.from({ length: 10 }, (_, j) => (
            <circle
              key={`${i}-${j}`}
              cx={5 + i * 10}
              cy={5 + j * 10}
              r="1.3"
              fill="#ffffff"
              opacity={0.2 + 0.6 * (((i * 7 + j * 3) % 5) / 4)}
            />
          )),
        )}
      </Plane>

      <Plane y={135} index="02" label="Evaluation" delay="-2s">
        {HEAT.map((row, i) =>
          row.map((value, j) => (
            <rect
              key={`${i}-${j}`}
              x={8 + j * 14.5}
              y={8 + i * 14.5}
              width="12"
              height="12"
              rx="1.5"
              fill="#a78bfa"
              opacity={value}
            />
          )),
        )}
      </Plane>

      <Plane y={30} index="03" label="Agents" delay="0s">
        {EDGES.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            x1={NODES[a][0]}
            y1={NODES[a][1]}
            x2={NODES[b][0]}
            y2={NODES[b][1]}
            stroke="rgba(94,234,212,0.7)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {NODES.map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.6" fill="#5eead4" />
        ))}
      </Plane>
    </svg>
  );
}
