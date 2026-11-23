import { ChartColumn, TrendingUp, Users, type LucideIcon } from "lucide-react";
import { ButtonLink } from "@/components/button";
import { Reveal } from "@/components/reveal";

const REASONS: { icon: LucideIcon; color: string; title: string; body: string; href: string; cta: string }[] = [
  {
    icon: TrendingUp,
    color: "text-violet-700",
    title: "A decade of AI data",
    body: "We started in 2016 labeling sensor data for self-driving cars. Today the same discipline produces data for language, vision, and robotics models.",
    href: "/#data-engine",
    cta: "Explore Data Engine",
  },
  {
    icon: ChartColumn,
    color: "text-sand-ink",
    title: "Benchmarks that can't leak",
    body: "Private, expert-written evaluations measure real capability, because the test questions never end up in anyone's training set.",
    href: "/#evaluation",
    cta: "See Evaluation",
  },
  {
    icon: Users,
    color: "text-sky-700",
    title: "Experts in the loop",
    body: "Physicians, engineers, analysts, and linguists review the work, so quality is judged by people qualified to judge it.",
    href: "/demo",
    cta: "Talk to an expert",
  },
];

export function WhySection() {
  return (
    <section id="why" aria-labelledby="why-title" className="site-container pb-24 md:pb-32">
      <Reveal>
        <h2
          id="why-title"
          className="max-w-3xl text-balance text-[clamp(2rem,4.4vw,3.5rem)] leading-[1.04] tracking-[-0.03em]"
        >
          Why teams choose Scale
        </h2>
      </Reveal>
      <div className="mt-12 grid grid-cols-1 gap-3 md:grid-cols-3">
        {REASONS.map((reason, i) => (
          <Reveal key={reason.title} delay={i * 80}>
            <article className="flex h-full flex-col rounded-2xl bg-mist p-7 md:p-9">
              <span className="grid size-14 place-items-center rounded-xl bg-white">
                <reason.icon className={`size-6 ${reason.color}`} aria-hidden />
              </span>
              <h3 className="mt-14 text-2xl leading-snug tracking-[-0.015em]">{reason.title}</h3>
              <p className="mt-4 flex-1 text-[15px] leading-relaxed text-ink/65">{reason.body}</p>
              <ButtonLink href={reason.href} variant="soft" size="sm" className="mt-8 w-fit">
                {reason.cta}
              </ButtonLink>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
