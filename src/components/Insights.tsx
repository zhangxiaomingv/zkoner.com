import Section from "./Section";
import { site, sortedPosts } from "@/content";
import PostRow from "./PostRow";

/**
 * AI 时代观察 — 首页最新文章预览
 * 只展示最近 3 篇，「查看全部」进 /blog 列表页。数据由 content/posts.ts 驱动。
 */
export default function Insights() {
  const preview = sortedPosts().slice(0, 3);

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
      {/* 最新文章 */}
      <div className="border-t border-border">
        {preview.map((post) => (
          <PostRow key={post.id} post={post} />
        ))}
      </div>

      {/* 全部文章入口 */}
      <div className="mt-10">
        <a href="/blog" className="btn btn-ghost btn-sm">
          查看全部
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
