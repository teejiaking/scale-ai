import type { Metadata } from "next";
import { ButtonLink } from "@/components/button";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <section className="site-container flex min-h-[70svh] flex-col items-start justify-center py-24">
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink/60">404</p>
      <h1 className="mt-4 text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02] tracking-[-0.035em]">
        This page isn&apos;t here.
      </h1>
      <p className="mt-5 max-w-md text-lg text-ink/65">
        The link may be broken, or the page may have moved.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/">Back to home</ButtonLink>
        <ButtonLink href="/demo" variant="outline">
          Book a demo
        </ButtonLink>
      </div>
    </section>
  );
}
