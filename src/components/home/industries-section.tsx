import { Bot, Building2, HeartPulse, Landmark, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SOLUTIONS, type SolutionId } from "@/content/site";
import { IndustriesShowcase } from "./industries-showcase";

const SOLUTION_ICONS: Record<SolutionId, LucideIcon> = {
  enterprise: Building2,
  "public-sector": Landmark,
  healthcare: HeartPulse,
  "physical-ai": Bot,
};

export function IndustriesSection() {
  return (
    <section
      id="solutions"
      aria-labelledby="industries-title"
      data-header-theme="light"
      className="bg-fog"
    >
      <div className="mx-auto max-w-[96rem]">
        <IndustriesShowcase />
      </div>

      <div className="site-container pb-24 md:pb-32">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SOLUTIONS.map((solution, i) => {
            const Icon = SOLUTION_ICONS[solution.id];
            return (
              <Reveal key={solution.id} delay={i * 60}>
                <article id={solution.id} className="flex h-full flex-col rounded-2xl bg-white p-6 md:p-7">
                  <span className="grid size-11 place-items-center rounded-xl bg-mist">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <p className="mt-8 font-mono text-xs uppercase tracking-[0.12em] text-ink/60">
                    {solution.name}
                  </p>
                  <h3 className="mt-2 text-xl tracking-[-0.01em]">{solution.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink/65">{solution.description}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
