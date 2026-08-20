import type { Metadata } from "next";
import { site, sortedPosts } from "@/content";
import PostRow from "@/components/PostRow";

export const metadata: Metadata = {
  title: "AI 时代观察",
  description:
    "张晓明关于 AI 趋势、个人品牌、一人公司、创业思考与商业模式的观察与思考。",
  alternates: { canonical: "/blog" },
};

const blogDescription =
  "关于 AI 时代，张晓明的观察与思考：AI 趋势、个人品牌、一人公司、创业思考、商业模式。";

/** Blog 结构化数据：blogPost 数组覆盖页面上可见的全部文章（含成绩单，指向 /scorecard） */
const graphJsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": `${site.url}/blog#blog`,
  name: site.columns.insights,
  url: `${site.url}/blog`,
  description: blogDescription,
  inLanguage: "zh-CN",
  publisher: { "@id": `${site.url}#person` },
  blogPost: sortedPosts().map((p) => {
    const url = `${site.url}${p.href ?? (p.slug ? `/blog/${p.slug}` : "/blog")}`;
    return {
      "@type": "BlogPosting",
      "@id": `${url}#post`,
      headline: p.title,
      url,
      datePublished: p.date,
      dateModified: p.date,
      author: { "@id": `${site.url}#person` },
    };
  }),
};

export default function BlogPage() {
  const posts = sortedPosts();

  return (
    <div className="pt-28 sm:pt-36">
      <div className="mx-auto w-full max-w-3xl px-5 pb-24 sm:px-8 sm:pb-32">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(graphJsonLd) }}
        />

        {/* 返回 + 标题 */}
        <a href="/" className="link-underline font-mono text-xs text-faint hover:text-muted">
          ← 返回首页
        </a>

        <div className="mt-12 flex items-center gap-4">
          <span className="font-mono text-sm text-faint tabular" aria-hidden="true">
            05
          </span>
          <span className="h-px w-10 bg-border" aria-hidden="true" />
          <span className="eyebrow">{site.columns.insights}</span>
        </div>

        <h1 className="display mt-6 text-3xl text-text sm:text-4xl md:text-5xl">
          关于 AI 时代的
          <br />
          观察与思考。
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">
          {blogDescription}
        </p>

        {/* 文章列表 */}
        <div className="mt-12 border-t border-border">
          {posts.map((post) => (
            <PostRow key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
