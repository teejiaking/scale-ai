import type { Post } from "@/content/posts";
import { cn } from "@/lib/cn";

/** Generated cover art for a post: gradient, dot texture, and index number. */
export function PostCover({
  post,
  index,
  wide = false,
  className,
}: {
  post: Post;
  index: number;
  wide?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden rounded-xl",
        wide ? "aspect-[16/9] md:aspect-[21/9]" : "aspect-[4/3]",
        post.cover,
        className,
      )}
    >
      <div className="pattern-dots absolute inset-0 opacity-60 [mask-image:radial-gradient(circle_at_70%_30%,black,transparent_70%)]" />
      <div className="absolute -bottom-1/3 -right-1/4 aspect-square w-3/4 rounded-full border border-white/15" />
      <div className="absolute -bottom-1/4 -right-[12%] aspect-square w-1/2 rounded-full border border-white/20" />
      <span className="absolute left-4 top-4 font-mono text-xs text-white/70">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="absolute bottom-4 left-4 font-mono text-[11px] uppercase tracking-[0.12em] text-white/70">
        {post.category}
      </span>
    </div>
  );
}
