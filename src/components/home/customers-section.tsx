import { Reveal } from "@/components/reveal";
import { CUSTOMER_STORIES } from "@/content/site";
import { CustomerCarousel } from "./customer-carousel";

export function CustomersSection() {
  return (
    <section id="customers" aria-labelledby="customers-title" className="py-24 md:py-32">
      <Reveal>
        <CustomerCarousel stories={CUSTOMER_STORIES} />
      </Reveal>
      <p className="site-container mt-6 text-sm text-ink/60">
        Stories are anonymized, illustrative examples written for this concept build.
      </p>
    </section>
  );
}
