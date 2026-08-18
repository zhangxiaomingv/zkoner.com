import type { Post } from "@/content";

/** 文章行 — 首页预览与 /blog 列表共用。href 优先（如成绩单→/scorecard），否则进详情页 */
export default function PostRow({ post }: { post: Post }) {
  const href = post.href ?? (post.slug ? `/blog/${post.slug}` : "/blog");

  return (
    <a
      href={href}
      className="group grid gap-2 border-b border-border py-6 transition-colors sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8"
    >
      <div className="min-w-0">
        <h3 className="text-base font-medium text-text transition-colors group-hover:text-accent sm:text-lg">
          {post.title}
        </h3>
        <p className="mt-1.5 max-w-2xl text-sm text-muted">{post.excerpt}</p>
      </div>
      <div className="flex items-center gap-3 text-xs text-faint sm:shrink-0 sm:flex-col sm:items-end sm:gap-1">
        {post.href ? (
          <span className="rounded-full border border-accent/30 bg-accent-soft px-2.5 py-0.5 text-accent">
            成绩单
          </span>
        ) : (
          <span>{post.category}</span>
        )}
        <time dateTime={post.date}>{post.date}</time>
      </div>
    </a>
  );
}
