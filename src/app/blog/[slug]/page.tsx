import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CtaSection } from "@/components/cta-section";
import { PostCover } from "@/components/post-cover";
import { SmartLink } from "@/components/smart-link";
import { POSTS, getPost } from "@/content/posts";

// Unlisted slugs wait for the full render instead of streaming a fallback shell,
// so notFound() can still send a real 404 status.
export const ensureStatic = "navigation";

export function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const index = POSTS.indexOf(post);
  const others = POSTS.filter((other) => other.slug !== post.slug);

  return (
    <>
      <article className="site-container pb-20 pt-12 md:pt-20">
        <header className="mx-auto max-w-3xl">
          <SmartLink
            href="/#research"
            className="inline-flex items-center gap-2 rounded-md text-sm text-ink/60 transition-colors hover:text-ink"
          >
            <ArrowLeft className="size-4" aria-hidden />
            From the lab
          </SmartLink>
          <p className="mt-10 font-mono text-xs uppercase tracking-[0.12em] text-ink/60">
            {post.category} · {post.readingTime}
          </p>
          <h1 className="mt-4 text-balance text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.04] tracking-[-0.03em]">
            {post.title}
          </h1>
          <p className="mt-6 text-xl leading-relaxed text-ink/65">{post.excerpt}</p>
        </header>

        <PostCover post={post} index={index} wide className="mx-auto mt-12 max-w-5xl" />

        <div className="mx-auto mt-14 max-w-3xl space-y-12">
          {post.sections.map((section, i) => (
            <section key={section.heading ?? i}>
              {section.heading && <h2 className="text-2xl tracking-[-0.015em]">{section.heading}</h2>}
              <div className="mt-4 space-y-5 text-[17px] leading-[1.75] text-ink/80">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <aside aria-labelledby="more-posts-title" className="mx-auto mt-24 max-w-5xl border-t border-ink/10 pt-10">
          <h2 id="more-posts-title" className="text-2xl tracking-[-0.015em]">
            More from the lab
          </h2>
          <ul className="mt-8 grid grid-cols-1 gap-x-3 gap-y-8 sm:grid-cols-3">
            {others.map((other) => (
              <li key={other.slug}>
                <Link href={`/blog/${other.slug}`} className="group block rounded-xl">
                  <div className="overflow-hidden rounded-xl">
                    <PostCover
                      post={other}
                      index={POSTS.indexOf(other)}
                      className="transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <p className="mt-4 font-mono text-xs uppercase tracking-[0.12em] text-ink/60">
                    {other.category}
                  </p>
                  <h3 className="mt-2 text-lg leading-snug decoration-ink/30 underline-offset-4 group-hover:underline">
                    {other.title}
                  </h3>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </article>
      <CtaSection />
    </>
  );
}
