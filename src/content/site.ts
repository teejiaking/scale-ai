import { POSTS } from "./posts";

export type ProductId = "data-engine" | "genai-platform" | "donovan" | "evaluation";

export interface Product {
  id: ProductId;
  shortName: string;
  name: string;
  tagline: string;
  headline: string;
  description: string;
  features: string[];
}

export const PRODUCTS: Product[] = [
  {
    id: "data-engine",
    shortName: "Data Engine",
    name: "Scale Data Engine",
    tagline: "Training data for frontier models",
    headline: "Expert data for every stage of training.",
    description:
      "Generate, annotate, and curate the data frontier models learn from. Expert contributors produce preference rankings, demonstrations, and multimodal labels, and every task passes through layered quality review.",
    features: [
      "Preference and fine-tuning data for language models",
      "Image, video, lidar, and sensor-fusion annotation",
      "Multi-stage review by qualified domain experts",
    ],
  },
  {
    id: "genai-platform",
    shortName: "GenAI Platform",
    name: "Scale GenAI Platform",
    tagline: "Build and govern enterprise agents",
    headline: "Agents that work on your data and answer to your rules.",
    description:
      "Connect models to your own documents and systems, test them against your own standards, and ship with guardrails your risk team can sign off on.",
    features: [
      "Retrieval over private documents, with citations",
      "Custom evaluations that run before every release",
      "Guardrails, audit logs, and human review queues",
    ],
  },
  {
    id: "donovan",
    shortName: "Donovan",
    name: "Scale Donovan",
    tagline: "Decision support for the public sector",
    headline: "From raw reporting to a sourced decision.",
    description:
      "AI decision support for defense and public-sector teams. Analysts ask questions in plain language and get answers tied to the source records, so every claim can be checked.",
    features: [
      "Answers grounded in cited source documents",
      "Built for secure and disconnected environments",
      "Drafts briefings and courses of action for review",
    ],
  },
  {
    id: "evaluation",
    shortName: "Evaluation",
    name: "Scale Evaluation",
    tagline: "Private benchmarks and red teaming",
    headline: "Know what a model can do before your users find out.",
    description:
      "Measure real capability with private test sets written by domain experts, adversarial red teaming, and leaderboards that public training data can't contaminate.",
    features: [
      "Held-out benchmarks written by domain experts",
      "Red teaming for safety and misuse risks",
      "Side-by-side comparisons with confidence intervals",
    ],
  },
];

export function isProductId(value: string): value is ProductId {
  return PRODUCTS.some((product) => product.id === value);
}

export type SolutionId = "enterprise" | "public-sector" | "healthcare" | "physical-ai";

export interface Solution {
  id: SolutionId;
  name: string;
  title: string;
  description: string;
}

export const SOLUTIONS: Solution[] = [
  {
    id: "enterprise",
    name: "Enterprise",
    title: "Agents for regulated work",
    description:
      "Put assistants and agents to work in underwriting, claims, research, and operations, tested against your own policies before launch.",
  },
  {
    id: "public-sector",
    name: "Public sector",
    title: "Mission-ready AI",
    description:
      "Help analysts and operators move from raw data to a sourced decision faster, inside secure environments.",
  },
  {
    id: "healthcare",
    name: "Healthcare",
    title: "Clinician-reviewed AI",
    description:
      "Summarize records, surface evidence, and cut documentation time, with clinicians reviewing what models produce.",
  },
  {
    id: "physical-ai",
    name: "Physical AI",
    title: "Data for robots and vehicles",
    description:
      "Collect and label real-world demonstrations, sensor streams, and rare edge cases that embodied models need.",
  },
];

export const INDUSTRY_WORDS = [
  "defense",
  "healthcare",
  "robotics",
  "energy",
  "finance",
  "autonomy",
  "insurance",
  "the public sector",
];

export interface CustomerStory {
  id: string;
  sector: string;
  outcome: string;
  org: string;
  tone: string;
}

/** Anonymized, illustrative stories written for this concept build. */
export const CUSTOMER_STORIES: CustomerStory[] = [
  {
    id: "defense",
    sector: "Defense",
    outcome:
      "Turned years of unstructured field reports into a searchable, cited knowledge base for analysts.",
    org: "National defense agency",
    tone: "bg-linear-to-br from-[#14202b] via-[#1c3442] to-[#24525e]",
  },
  {
    id: "frontier-lab",
    sector: "Generative AI",
    outcome:
      "Scaled expert preference data across dozens of languages ahead of a frontier model launch.",
    org: "Frontier AI lab",
    tone: "bg-linear-to-br from-[#1a1838] via-[#2c2763] to-[#4a3d8f]",
  },
  {
    id: "health",
    sector: "Healthcare",
    outcome:
      "Summarized complex patient histories so clinicians spend less time searching charts.",
    org: "Academic medical center",
    tone: "bg-linear-to-br from-[#0e2b2b] via-[#144242] to-[#1f6464]",
  },
  {
    id: "robotics",
    sector: "Robotics",
    outcome:
      "Built a steady pipeline of labeled, real-world manipulation demonstrations for a robot foundation model.",
    org: "Robotics startup",
    tone: "bg-linear-to-br from-[#2a2118] via-[#4a3826] to-[#6f5536]",
  },
  {
    id: "energy",
    sector: "Energy",
    outcome:
      "Brought AI copilots to field operations, with evaluations tied directly to safety procedures.",
    org: "Global energy company",
    tone: "bg-linear-to-br from-[#16220f] via-[#25391a] to-[#3b5526]",
  },
  {
    id: "education",
    sector: "Education",
    outcome:
      "Personalized practice and feedback for students, with every item reviewed by subject experts.",
    org: "Education publisher",
    tone: "bg-linear-to-br from-[#2b1520] via-[#4a2134] to-[#6e3550]",
  },
  {
    id: "insurance",
    sector: "Insurance",
    outcome:
      "Automated first-pass claims review, with a human sign-off on every exception.",
    org: "Commercial insurer",
    tone: "bg-linear-to-br from-[#101c33] via-[#18305a] to-[#25467d]",
  },
  {
    id: "safety",
    sector: "Evaluation",
    outcome:
      "Benchmarked frontier models on expert-level questions that have never appeared online.",
    org: "AI safety research group",
    tone: "bg-linear-to-br from-[#1b1b1d] via-[#2c2c30] to-[#45454b]",
  },
];

export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

export interface NavGroup {
  id: string;
  label: string;
  links: NavLink[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    id: "products",
    label: "Products",
    links: PRODUCTS.map((product) => ({
      label: product.shortName,
      href: `/#${product.id}`,
      description: product.tagline,
    })),
  },
  {
    id: "solutions",
    label: "Solutions",
    links: SOLUTIONS.map((solution) => ({
      label: solution.name,
      href: `/#${solution.id}`,
      description: solution.title,
    })),
  },
  {
    id: "research",
    label: "Research",
    links: [
      ...POSTS.map((post) => ({
        label: post.shortTitle,
        href: `/blog/${post.slug}`,
        description: post.category,
      })),
      { label: "All research", href: "/#research", description: "Notes from the lab" },
    ],
  },
  {
    id: "company",
    label: "Company",
    links: [
      { label: "Why Scale", href: "/#why", description: "How we work" },
      { label: "Customers", href: "/#customers", description: "Stories from the field" },
      { label: "Book a demo", href: "/demo", description: "Talk with our team" },
    ],
  },
];

export const FOOTER_COLUMNS: { title: string; links: NavLink[] }[] = NAV_GROUPS.map(
  (group) => ({ title: group.label, links: group.links }),
);
