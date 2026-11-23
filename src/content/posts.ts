export interface PostSection {
  heading?: string;
  paragraphs: string[];
}

export interface Post {
  slug: string;
  title: string;
  shortTitle: string;
  category: string;
  readingTime: string;
  excerpt: string;
  cover: string;
  sections: PostSection[];
}

export const POSTS: Post[] = [
  {
    slug: "why-private-benchmarks-matter",
    title: "Why private benchmarks matter for frontier models",
    shortTitle: "Private benchmarks",
    category: "Research",
    readingTime: "5 min read",
    excerpt:
      "When test questions leak into training data, a benchmark score measures memory instead of skill. Held-out, expert-written evaluations fix that.",
    cover: "bg-linear-to-br from-[#1a1838] via-[#2f2a6b] to-[#6b4fa8]",
    sections: [
      {
        paragraphs: [
          "Public benchmarks have driven a decade of progress in machine learning. They give researchers a shared yardstick and make results easy to compare. But as models train on ever larger slices of the web, the yardstick has started to bend.",
          "If a model has seen a test question during training, its score on that question tells you about its memory, not its ability. That makes it hard to know whether a new model is actually more capable or has simply read more of the answer key.",
        ],
      },
      {
        heading: "Contamination is hard to rule out",
        paragraphs: [
          "Even careful teams can't audit trillions of training tokens by hand. Benchmark items get copied into forums, paraphrased in tutorials, and echoed in synthetic data generated from benchmark-style prompts. Each path blurs the line between training and testing.",
          "Decontamination filters help, but they mostly catch exact or near-exact matches. A reworded question with the same answer can slip through and still inflate a score.",
        ],
      },
      {
        heading: "What a private benchmark changes",
        paragraphs: [
          "A held-out test set written by domain experts and never published gives a cleaner signal. The questions stay private, the evaluation runs on controlled infrastructure, and the model being tested never gets to train on the answers.",
          "Reporting matters as much as secrecy. Scores should come with confidence intervals so that a one-point gap between two models isn't read as a real difference when it falls inside the noise.",
        ],
      },
      {
        heading: "The trade-offs",
        paragraphs: [
          "Private evaluations ask the community for trust, so they need to earn it. That means publishing the methodology and sample questions, explaining the statistics, refreshing items before they go stale, and inviting independent review.",
          "Benchmarks are measurement tools. Keep the test separate from the training data and the measurement keeps its meaning.",
        ],
      },
    ],
  },
  {
    slug: "human-in-the-loop-evaluation",
    title: "A practical guide to human-in-the-loop evaluation",
    shortTitle: "Human-in-the-loop evaluation",
    category: "Guide",
    readingTime: "6 min read",
    excerpt:
      "Automated metrics are fast, but they miss what users care about. Here is how to design human review that produces signal instead of noise.",
    cover: "bg-linear-to-br from-[#0e2b2b] via-[#16504f] to-[#2f8a7f]",
    sections: [
      {
        paragraphs: [
          "Automated metrics are cheap and fast, and they are good at catching regressions in format or style. They are much worse at judging whether an answer is correct, useful, and safe in context. For that, you still need people.",
          "Human evaluation only pays off when it is designed with the same care as the model. The steps below are where most programs succeed or fail.",
        ],
      },
      {
        heading: "Start with a rubric",
        paragraphs: [
          "Define the dimensions you care about, such as accuracy, completeness, safety, and tone, and anchor every score level with a concrete example. A rubric that says \"rate helpfulness from 1 to 5\" with no anchors will produce ratings that mostly measure each reviewer's mood.",
        ],
      },
      {
        heading: "Match reviewers to the task",
        paragraphs: [
          "A summary of a medical record needs a clinician to judge it. A contract analysis needs a lawyer. Generalist reviewers are fine for fluency and formatting, but they can't reliably tell you whether a specialized answer is right.",
        ],
      },
      {
        heading: "Measure agreement",
        paragraphs: [
          "Have several reviewers rate the same subset of items and track how often they agree. Low agreement usually means the rubric is unclear or the task is ambiguous. Both are worth fixing before you trust the scores.",
        ],
      },
      {
        heading: "Close the loop",
        paragraphs: [
          "The most valuable output of an evaluation is a list of failures. Feed disagreements and failure cases back into training data and into the next version of the test set. Evaluation earns its cost when it changes what you build next.",
        ],
      },
    ],
  },
  {
    slug: "agents-in-regulated-industries",
    title: "What it takes to ship agents in regulated industries",
    shortTitle: "Agents in regulated industries",
    category: "Enterprise",
    readingTime: "5 min read",
    excerpt:
      "In insurance, banking, and healthcare, a good demo isn't the bar. An auditable process is. Four practices that get agents to production.",
    cover: "bg-linear-to-br from-[#101c33] via-[#1d3866] to-[#3b6aa8]",
    sections: [
      {
        paragraphs: [
          "Agents that read documents, call tools, and draft decisions can save hours of work in insurance, banking, and healthcare. In those industries, though, an impressive demo isn't enough to launch. Regulators, auditors, and customers expect a process they can inspect.",
        ],
      },
      {
        heading: "Ground every answer",
        paragraphs: [
          "Retrieval with citations lets a reviewer check each claim against the source document. If an agent can't point to where an answer came from, it shouldn't give that answer to a customer.",
        ],
      },
      {
        heading: "Evaluate against your own policies",
        paragraphs: [
          "Generic benchmarks don't know your underwriting guidelines or claims procedures. Build test sets from real, de-identified cases with known correct outcomes, and rerun them before every release.",
        ],
      },
      {
        heading: "Design the human handoff",
        paragraphs: [
          "Route low-confidence and high-impact cases to people, log every step the agent takes, and make overrides easy. The goal is a system where humans spend their time on the cases that need judgment.",
        ],
      },
      {
        heading: "Treat it as a system",
        paragraphs: [
          "The model, prompts, retrieval index, tools, and policies all change over time. Version them together, monitor them in production, and re-evaluate whenever any one of them changes.",
        ],
      },
    ],
  },
  {
    slug: "trustworthy-ai-public-sector",
    title: "Building AI the public sector can trust",
    shortTitle: "AI for the public sector",
    category: "Public sector",
    readingTime: "4 min read",
    excerpt:
      "Government teams face higher stakes and stricter rules than most. Trustworthy AI for them starts with security, sources, and accountability.",
    cover: "bg-linear-to-br from-[#14202b] via-[#20404f] to-[#3c6f72]",
    sections: [
      {
        paragraphs: [
          "Government teams feel the same pressure as everyone else to adopt AI, with higher stakes and stricter rules on data handling, transparency, and accountability. The systems that succeed are designed around those constraints from the start.",
        ],
      },
      {
        heading: "Security first",
        paragraphs: [
          "Models and data often need to run in accredited environments, sometimes with no connection to the internet. Architecture decisions made early determine what is possible later, so they deserve attention before the first prototype.",
        ],
      },
      {
        heading: "Sourced answers over fluent ones",
        paragraphs: [
          "Analysts need to know where an answer came from. Good systems show their sources, flag uncertainty, and make it easy to open the underlying record.",
        ],
      },
      {
        heading: "Test before deployment, and after",
        paragraphs: [
          "Mission-specific evaluations and red teaming should happen before a system is fielded. Monitoring should continue afterward, because data, threats, and missions change.",
        ],
      },
      {
        heading: "Keep people accountable",
        paragraphs: [
          "AI can draft, summarize, and recommend. Decisions with legal or human consequences stay with trained people who can explain and defend them.",
        ],
      },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((post) => post.slug === slug);
}
