import { Reveal } from "@/components/reveal";
import { HandTrackingCanvas } from "./hand-tracking-canvas";
import { ScrollRevealText } from "./scroll-reveal-text";
import { StackIllustration } from "./stack-illustration";

const FACTS = [
  { term: "Since 2016", detail: "Building the data behind AI" },
  { term: "Experts in the loop", detail: "Qualified review at every stage" },
  { term: "Text to robotics", detail: "Language, vision, sensor, and physical data" },
];

export function StackSection() {
  return (
    <div data-header-theme="dark" className="bg-black text-white">
      <section aria-labelledby="stack-title" className="site-container py-24 text-center md:py-32">
        <Reveal>
          <StackIllustration className="mx-auto w-full max-w-[40rem]" />
        </Reveal>
        <Reveal delay={100}>
          <h2
            id="stack-title"
            className="mx-auto mt-12 max-w-3xl text-balance text-[clamp(2rem,4.4vw,3.5rem)] leading-[1.05] tracking-[-0.03em]"
          >
            One partner for every layer of the AI stack.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-lg text-white/65">
            Training data, model evaluation, and production agents, built and reviewed by expert
            humans. When every layer is accountable, the whole system earns trust.
          </p>
        </Reveal>
      </section>

      <section aria-labelledby="approach-title" className="site-container pb-24 md:pb-32">
        <h2 id="approach-title" className="sr-only">
          Our approach
        </h2>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
          <Reveal className="order-2 lg:order-1 lg:mt-64">
            <figure className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#0c0d10] sm:aspect-[16/10] lg:aspect-auto lg:h-[26rem]">
              <HandTrackingCanvas className="absolute inset-0 size-full font-mono" />
              <figcaption className="absolute inset-x-0 bottom-0 flex justify-between p-4 font-mono text-[11px] uppercase tracking-[0.14em] text-white/60">
                <span>Physical AI · hand pose</span>
                <span aria-hidden>21 keypoints</span>
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delay={80} className="order-1 lg:order-2">
            <div className="flex min-h-[30rem] flex-col justify-between gap-16 rounded-2xl bg-forest p-7 md:p-12 lg:min-h-[44rem]">
              <ScrollRevealText
                className="max-w-4xl text-[clamp(1.75rem,3.4vw,3.25rem)] leading-[1.1] tracking-[-0.025em]"
                text="A model is only as good as the data that shaped it and the tests that challenged it. We build both, with people who know the work."
              />
              <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {FACTS.map((fact) => (
                  <div key={fact.term} className="border-t border-white/15 pt-4">
                    <dt className="text-lg">{fact.term}</dt>
                    <dd className="mt-1 text-sm text-white/60">{fact.detail}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
