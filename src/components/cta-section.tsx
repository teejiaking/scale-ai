import { ArrowRight } from "lucide-react";
import { ButtonLink } from "./button";
import { Reveal } from "./reveal";

export function CtaSection() {
  return (
    <section aria-labelledby="cta-title" className="site-container pb-16 md:pb-24">
      <Reveal>
        <div className="relative isolate overflow-hidden rounded-3xl bg-sand px-6 py-16 text-ink sm:px-10 md:px-16 md:py-24">
          <svg
            aria-hidden="true"
            viewBox="0 0 400 400"
            className="pointer-events-none absolute -right-28 -top-28 -z-10 hidden h-[34rem] w-[34rem] md:block"
          >
            {[60, 100, 140, 180].map((r) => (
              <circle key={r} cx="200" cy="200" r={r} fill="none" stroke="rgba(10,10,10,0.14)" />
            ))}
            <circle cx="200" cy="200" r="20" fill="rgba(10,10,10,0.12)" />
          </svg>
          <div className="max-w-2xl">
            <h2
              id="cta-title"
              className="text-balance text-[clamp(2.25rem,5vw,4rem)] leading-[1.02] tracking-[-0.035em]"
            >
              Ready to put reliable AI to work?
            </h2>
            <p className="mt-5 max-w-lg text-lg text-ink/75">
              Tell us about your data, your models, and what you need them to do. We&apos;ll show
              you where Scale fits.
            </p>
            <ButtonLink href="/demo" className="mt-8">
              Book a demo
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
