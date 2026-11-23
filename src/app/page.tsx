import { CtaSection } from "@/components/cta-section";
import { CustomersSection } from "@/components/home/customers-section";
import { Hero } from "@/components/home/hero";
import { IndustriesSection } from "@/components/home/industries-section";
import { ProductsSection } from "@/components/home/products-section";
import { ResearchSection } from "@/components/home/research-section";
import { StackSection } from "@/components/home/stack-section";
import { WhySection } from "@/components/home/why-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StackSection />
      <ProductsSection />
      <IndustriesSection />
      <CustomersSection />
      <WhySection />
      <ResearchSection />
      <CtaSection />
    </>
  );
}
