import { Reveal } from "@/components/reveal";
import { PRODUCTS } from "@/content/site";
import { DataEngineMock, DonovanMock, EvaluationMock, GenAIPlatformMock } from "./product-mocks";
import { ProductTabs } from "./product-tabs";

export function ProductsSection() {
  return (
    <section
      id="products"
      aria-labelledby="products-title"
      className="site-container relative py-24 md:py-32"
    >
      {/* Deep-link targets for /#data-engine, /#evaluation, etc. ProductTabs reads the hash. */}
      {PRODUCTS.map((product) => (
        <span key={product.id} id={product.id} aria-hidden className="absolute top-0" />
      ))}

      <Reveal>
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink/60">Products</p>
        <h2
          id="products-title"
          className="mt-4 max-w-3xl text-balance text-[clamp(2rem,4.4vw,3.5rem)] leading-[1.04] tracking-[-0.03em]"
        >
          The platform behind production AI
        </h2>
      </Reveal>

      <Reveal delay={80} className="mt-12">
        <ProductTabs
          mocks={{
            "data-engine": <DataEngineMock />,
            "genai-platform": <GenAIPlatformMock />,
            donovan: <DonovanMock />,
            evaluation: <EvaluationMock />,
          }}
        />
      </Reveal>
    </section>
  );
}
