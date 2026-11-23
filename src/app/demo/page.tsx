import type { Metadata } from "next";
import { Check } from "lucide-react";
import { DemoForm } from "./demo-form";

export const metadata: Metadata = {
  title: "Book a demo",
  description: "Tell us what you're building and see how Scale's data, evaluation, and agent tools fit.",
};

const EXPECTATIONS = [
  "A conversation about your goals and constraints",
  "A walkthrough of the products that fit your use case",
  "A clear plan for next steps",
];

export default function DemoPage() {
  return (
    <div className="site-container grid grid-cols-1 gap-12 pb-24 pt-12 md:pt-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink/60">Book a demo</p>
        <h1 className="mt-4 text-balance text-[clamp(2.5rem,5vw,4rem)] leading-[1.02] tracking-[-0.035em]">
          See what reliable AI looks like for your team.
        </h1>
        <p className="mt-6 max-w-md text-lg text-ink/65">
          Tell us what you&apos;re building. We&apos;ll walk you through the data, evaluation, and
          deployment options that fit.
        </p>
        <ul className="mt-10 space-y-4">
          {EXPECTATIONS.map((item) => (
            <li key={item} className="flex gap-3 text-[15px]">
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-ink text-white">
                <Check className="size-3" strokeWidth={3} aria-hidden />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-3xl bg-mist p-6 md:p-10">
        <DemoForm />
      </div>
    </div>
  );
}
