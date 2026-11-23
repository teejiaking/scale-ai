import type { ReactNode } from "react";
import { CircleCheck, FileText, ShieldCheck, UserCheck, Users, Wrench } from "lucide-react";
import { cn } from "@/lib/cn";

function MockWindow({
  title,
  badge,
  children,
}: {
  title: string;
  badge?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl bg-[#0d0e12] text-white shadow-[0_30px_80px_-30px_rgba(0,0,0,0.55)] ring-1 ring-black/5">
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
        </div>
        <p className="min-w-0 flex-1 truncate font-mono text-[11px] text-white/50">{title}</p>
        {badge}
      </div>
      {children}
    </div>
  );
}

function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "green" | "amber" }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-md px-2 py-1 font-mono text-[10px] uppercase tracking-[0.08em]",
        tone === "neutral" && "bg-white/10 text-white/70",
        tone === "green" && "bg-emerald-400/15 text-emerald-300",
        tone === "amber" && "bg-amber-400/15 text-amber-300",
      )}
    >
      {children}
    </span>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">{children}</p>;
}

/** Wraps a mock so assistive tech gets one sentence instead of the fake UI text. */
function MockFigure({ description, children }: { description: string; children: ReactNode }) {
  return (
    <figure>
      <figcaption className="sr-only">{description}</figcaption>
      <div aria-hidden="true">{children}</div>
    </figure>
  );
}

function Dots({ value }: { value: number }) {
  return (
    <span className="flex gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={cn("size-1.5 rounded-full", i < value ? "bg-white/80" : "bg-white/15")} />
      ))}
    </span>
  );
}

function ResponseCard({
  label,
  text,
  accuracy,
  clarity,
  preferred,
  flag,
}: {
  label: string;
  text: string;
  accuracy: number;
  clarity: number;
  preferred?: boolean;
  flag?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-lg border p-3.5",
        preferred ? "border-emerald-400/50 bg-emerald-400/[0.06]" : "border-white/10 bg-white/[0.03]",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <Label>{label}</Label>
        {preferred && <Badge tone="green">Preferred</Badge>}
        {flag && <Badge tone="amber">{flag}</Badge>}
      </div>
      <p className="text-[13px] leading-relaxed text-white/85">{text}</p>
      <div className="mt-auto space-y-1.5 border-t border-white/10 pt-3 text-[11px] text-white/55">
        <div className="flex items-center justify-between">
          Accuracy <Dots value={accuracy} />
        </div>
        <div className="flex items-center justify-between">
          Clarity <Dots value={clarity} />
        </div>
      </div>
    </div>
  );
}

export function DataEngineMock() {
  return (
    <MockFigure description="Illustration of a Data Engine preference task: an expert compares two model responses and marks the accurate one as preferred.">
      <MockWindow title="data-engine / preference-task-18204" badge={<Badge>Expert review</Badge>}>
        <div className="space-y-4 p-4 sm:p-5">
          <div>
            <Label>Prompt</Label>
            <p className="mt-1.5 text-sm text-white/90">
              Explain why the sky looks blue to a ten-year-old.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ResponseCard
              label="Response A"
              preferred
              accuracy={5}
              clarity={5}
              text="Sunlight holds every color of the rainbow. When it hits the air, tiny gas molecules scatter blue light much more than red, so blue reaches your eyes from all over the sky."
            />
            <ResponseCard
              label="Response B"
              flag="Factual error"
              accuracy={1}
              clarity={4}
              text="The sky is blue because it reflects the color of the ocean back down to us."
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs text-white/60">
            <span className="flex items-center gap-2">
              <Users className="size-3.5" />3 of 3 reviewers prefer A
            </span>
            <span className="font-mono text-[11px] text-white/40">Rubric v12 · STEM</span>
          </div>
        </div>
      </MockWindow>
    </MockFigure>
  );
}

const TRACE = [
  { icon: FileText, label: "Retrieve", detail: "3 passages · policy-ho3.pdf, claims-guide.md", state: "done" },
  { icon: Wrench, label: "Tool call", detail: 'coverage_lookup(form="HO-3", peril="sudden_discharge")', state: "done" },
  { icon: ShieldCheck, label: "Guardrail", detail: "No personal data in response", state: "done" },
  { icon: UserCheck, label: "Human review", detail: "Routed to adjuster · confidence 0.82", state: "pending" },
] as const;

export function GenAIPlatformMock() {
  return (
    <MockFigure description="Illustration of a GenAI Platform agent run: the agent retrieves policy documents, calls a coverage tool, passes a guardrail check, and routes the answer to a human adjuster.">
      <MockWindow title="genai-platform / claims-assistant / run-7f3a" badge={<Badge tone="green">Live</Badge>}>
        <div className="space-y-4 p-4 sm:p-5">
          <div className="ml-auto w-fit max-w-[85%] rounded-lg rounded-br-sm bg-white/10 px-3.5 py-2.5 text-[13px] text-white/90">
            Is water damage from a burst pipe covered under a standard HO-3 policy?
          </div>
          <ol className="space-y-2">
            {TRACE.map((step) => (
              <li
                key={step.label}
                className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5"
              >
                <step.icon
                  className={cn("mt-0.5 size-4 shrink-0", step.state === "done" ? "text-emerald-300" : "text-amber-300")}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] text-white/90">{step.label}</p>
                  <p className="truncate font-mono text-[11px] text-white/45">{step.detail}</p>
                </div>
                {step.state === "done" ? (
                  <CircleCheck className="size-4 shrink-0 text-emerald-300/80" />
                ) : (
                  <span className="mt-1 size-2 shrink-0 animate-pulse rounded-full bg-amber-300" />
                )}
              </li>
            ))}
          </ol>
          <div className="rounded-lg bg-white/[0.06] p-3.5 text-[13px] leading-relaxed text-white/85">
            Sudden, accidental discharge from plumbing is typically covered under HO-3. Damage from a
            slow leak over time usually isn&apos;t.{" "}
            <span className="font-mono text-[11px] text-sky-300">[1] [2]</span>
          </div>
        </div>
      </MockWindow>
    </MockFigure>
  );
}

const BRIEF = [
  { text: "Two bridge segments report temporary weight limits.", source: "R-112" },
  { text: "Heavy rain expected along the northern stretch after 18:00.", source: "WX-07" },
  { text: "Route Amber avoids both segments and adds about 14 km.", source: "LOG-31" },
];

export function DonovanMock() {
  return (
    <MockFigure description="Illustration of a Donovan mission workspace: a map with two routes next to a sourced summary of road conditions, using demo data.">
      <MockWindow title="donovan / mission-workspace" badge={<Badge>Demo data</Badge>}>
        <p className="bg-emerald-500/15 py-1 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-300">
          Unclassified // Demo data
        </p>
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5">
          <svg viewBox="0 0 300 220" className="h-auto w-full rounded-lg bg-[#0a1412]">
            <defs>
              <pattern id="map-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M20 0H0V20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="300" height="220" fill="url(#map-grid)" />
            {[0, 1, 2, 3].map((ring) => (
              <ellipse
                key={ring}
                cx="190"
                cy="120"
                rx={30 + ring * 26}
                ry={18 + ring * 17}
                fill="none"
                stroke="rgba(94,234,212,0.16)"
                strokeWidth="1"
              />
            ))}
            <path
              d="M24 196 C 80 170, 110 120, 160 108 S 250 60, 280 28"
              fill="none"
              stroke="#5eead4"
              strokeWidth="2"
              strokeDasharray="6 5"
            />
            <path
              d="M24 196 C 60 150, 70 90, 130 70 S 230 40, 280 28"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2"
              strokeDasharray="2 4"
            />
            {[
              { x: 142, y: 112, id: "R-112" },
              { x: 214, y: 76, id: "WX-07" },
              { x: 98, y: 86, id: "LOG-31" },
            ].map((marker) => (
              <g key={marker.id}>
                <circle cx={marker.x} cy={marker.y} r="9" fill="rgba(94,234,212,0.15)" />
                <circle cx={marker.x} cy={marker.y} r="3.5" fill="#5eead4" />
                <text
                  x={marker.x + 12}
                  y={marker.y + 4}
                  fontSize="10"
                  fill="rgba(255,255,255,0.7)"
                  className="font-mono"
                >
                  {marker.id}
                </text>
              </g>
            ))}
            <circle cx="24" cy="196" r="5" fill="#ffffff" />
            <circle cx="280" cy="28" r="5" fill="none" stroke="#ffffff" strokeWidth="2" />
          </svg>
          <div className="flex flex-col gap-3">
            <div>
              <Label>Query</Label>
              <p className="mt-1.5 text-[13px] text-white/90">
                Summarize road conditions on Route Blue for the next 48 hours.
              </p>
            </div>
            <ul className="space-y-2">
              {BRIEF.map((item) => (
                <li key={item.source} className="rounded-lg bg-white/[0.05] p-2.5 text-[12px] leading-relaxed text-white/80">
                  {item.text}{" "}
                  <span className="font-mono text-[10px] text-emerald-300">[{item.source}]</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </MockWindow>
    </MockFigure>
  );
}

const LEADERBOARD = [
  { model: "Model A", score: 71.4, ci: 1.8 },
  { model: "Model B", score: 69.9, ci: 2.0 },
  { model: "Model C", score: 66.2, ci: 2.1 },
  { model: "Model D", score: 61.7, ci: 2.4 },
  { model: "Model E", score: 54.3, ci: 2.6 },
];

export function EvaluationMock() {
  return (
    <MockFigure description="Illustration of an Evaluation leaderboard: five anonymized models ranked by score on a private expert benchmark, each with a 95% confidence interval.">
      <MockWindow title="evaluation / expert-reasoning-v4 / leaderboard" badge={<Badge tone="amber">Illustrative</Badge>}>
        <div className="p-4 sm:p-5">
          <div className="grid grid-cols-[2rem_minmax(0,1fr)_3.5rem_3.5rem] gap-x-3 border-b border-white/10 pb-2 font-mono text-[10px] uppercase tracking-[0.1em] text-white/40 sm:grid-cols-[2rem_7rem_minmax(0,1fr)_3.5rem_3.5rem]">
            <span>#</span>
            <span>Model</span>
            <span className="hidden sm:block" />
            <span className="text-right">Score</span>
            <span className="text-right">95% CI</span>
          </div>
          <ol>
            {LEADERBOARD.map((row, i) => (
              <li
                key={row.model}
                className="grid grid-cols-[2rem_minmax(0,1fr)_3.5rem_3.5rem] items-center gap-x-3 border-b border-white/5 py-3 text-[13px] sm:grid-cols-[2rem_7rem_minmax(0,1fr)_3.5rem_3.5rem]"
              >
                <span className="font-mono text-white/45">{i + 1}</span>
                <span className="text-white/90">{row.model}</span>
                <span className="hidden h-1.5 overflow-hidden rounded-full bg-white/10 sm:block">
                  <span
                    className={cn("block h-full rounded-full", i === 0 ? "bg-violet-300" : "bg-white/45")}
                    style={{ width: `${row.score}%` }}
                  />
                </span>
                <span className="text-right font-mono text-white/90">{row.score.toFixed(1)}</span>
                <span className="text-right font-mono text-white/45">±{row.ci.toFixed(1)}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 font-mono text-[11px] text-white/40">
            Held-out set · expert-written · never published
          </p>
        </div>
      </MockWindow>
    </MockFigure>
  );
}
