import Link from "next/link";
import { PostCover } from "@/components/post-cover";
import { Reveal } from "@/components/reveal";
import { POSTS } from "@/content/posts";

export function ResearchSection() {
  return (
    <section id="research" aria-labelledby="research-title" className="site-container pb-24 md:pb-32">
      <Reveal className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <h2
          id="research-title"
          className="text-[clamp(2rem,4.4vw,3.5rem)] leading-[1.04] tracking-[-0.03em]"
        >
          From the lab
        </h2>
        <p className="max-w-sm text-[17px] text-ink/60">
          Notes on data, evaluation, and putting AI into production.
        </p>
      </Reveal>
      <ul className="mt-12 grid grid-cols-1 gap-x-3 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {POSTS.map((post, i) => (
          <li key={post.slug}>
            <Reveal delay={i * 60}>
              <Link href={`/blog/${post.slug}`} className="group block rounded-xl">
                <div className="overflow-hidden rounded-xl">
                  <PostCover
                    post={post}
                    index={i}
                    className="transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <p className="mt-4 font-mono text-xs uppercase tracking-[0.12em] text-ink/60">
                  {post.category} · {post.readingTime}
                </p>
                <h3 className="mt-2 text-lg leading-snug tracking-[-0.01em] decoration-ink/30 underline-offset-4 group-hover:underline">
                  {post.title}
                </h3>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
