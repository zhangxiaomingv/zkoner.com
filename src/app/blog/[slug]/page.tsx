import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { site, blogPosts, getPostBySlug } from "@/content";
import PostBody from "@/components/PostBody";

/** 静态导出：未在 generateStaticParams 中的 slug 由宿主 404，dev 下也直接 404 */
export const dynamicParams = false;

export function generateStaticParams() {
  return blogPosts().map((p) => ({ slug: p.slug }));
}

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const url = `${site.url}/blog/${post.slug}`;

  /** BlogPosting 结构化数据：author/publisher 引用根布局 @graph 中的 Person @id */
  const graphJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#post`,
    mainEntityOfPage: url,
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: "zh-CN",
    url,
    image: `${site.url}/og-cover.png`,
    keywords: [post.category, "GEO", "AI 顾问"],
    author: { "@id": `${site.url}#person` },
    publisher: { "@id": `${site.url}#person` },
  };

  return (
    <div className="pt-28 sm:pt-36">
      <div className="mx-auto w-full max-w-3xl px-5 pb-24 sm:px-8 sm:pb-32">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(graphJsonLd) }}
        />

        {/* 返回列表 */}
        <a href="/blog" className="link-underline font-mono text-xs text-faint hover:text-muted">
          ← 返回文章列表
        </a>

        {/* 文章头 */}
        <div className="mt-12 flex items-center gap-4">
          <span className="font-mono text-sm text-faint tabular" aria-hidden="true">
            {post.category}
          </span>
          <span className="h-px w-10 bg-border" aria-hidden="true" />
          <time dateTime={post.date} className="eyebrow">
            {post.date}
          </time>
        </div>

        <h1 className="display mt-6 text-3xl text-text sm:text-4xl md:text-5xl">
          {post.title}
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">
          {post.excerpt}
        </p>

        {/* 正文 */}
        <div className="mt-10 border-t border-border pt-10">
          <PostBody source={post.body} />
        </div>

        {/* 固定作者签名（口径与锚点一致） */}
        <div className="mt-14 rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <p className="font-mono text-xs text-faint">作者</p>
          <p className="mt-3 text-base leading-relaxed text-text">
            张可能，GEOloopOS 创始人 / AI 顾问 / GEO 优化工程师。
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            关注 AI 如何改变个人品牌与中小企业的获客方式，把 AI 可见度沉淀为战略资产。
            <a href={site.url} className="link-underline text-accent">
              {" "}
              {site.url.replace("https://", "")}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
