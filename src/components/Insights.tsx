import Section from "./Section";
import { site, posts } from "@/content";

/**
 * AI 时代观察 — 文章与思考
 * 数据由 content/posts.ts 驱动，未来对接博客系统。
 */
export default function Insights() {
  return (
    <Section
      id="insights"
      index="05"
      eyebrow={site.columns.insights}
      title={
        <>
          关于 AI 时代的
          <br />
          观察与思考。
        </>
      }
    >
      {/* 文章列表 */}
      <div className="border-t border-border">
        {posts.map((post) => (
          <a
            key={post.id}
            href={post.href ?? "#insights"}
            className="group grid gap-2 border-b border-border py-6 transition-colors sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8"
          >
            <div className="min-w-0">
              <h3 className="text-base font-medium text-text transition-colors group-hover:text-accent sm:text-lg">
                {post.title}
              </h3>
              <p className="mt-1.5 max-w-2xl text-sm text-muted">
                {post.excerpt}
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-faint sm:shrink-0 sm:flex-col sm:items-end sm:gap-1">
              <span>{post.category}</span>
              <time dateTime={post.date}>{post.date}</time>
            </div>
          </a>
        ))}
      </div>

      {/* 全部文章入口 */}
      <div className="mt-10">
        <a
          href="#insights"
          className="btn btn-ghost btn-sm"
        >
          更多思考
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 8h10" />
            <path d="M9 4l4 4-4 4" />
          </svg>
        </a>
      </div>
    </Section>
  );
}
