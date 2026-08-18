import type { Metadata } from "next";
import { site, whitepaper } from "@/content";
import PostBody from "@/components/PostBody";

export const metadata: Metadata = {
  title: "GEOloopOS：AI可见度闭环方法论 · 商业蓝皮书 V2.0",
  description: whitepaper.description,
  alternates: { canonical: "/whitepaper" },
};

/** Report 结构化数据 — 实验报告 / 白皮书 */
const reportJsonLd = {
  "@context": "https://schema.org",
  "@type": "Report",
  "@id": `${site.url}/whitepaper#report`,
  headline: whitepaper.title,
  alternativeHeadline: whitepaper.subtitle,
  description: whitepaper.description,
  url: `${site.url}/whitepaper`,
  datePublished: whitepaper.datePublished,
  dateModified: whitepaper.datePublished,
  inLanguage: "zh-CN",
  author: { "@id": `${site.url}#person` },
  publisher: { "@id": `${site.url}#person` },
  about: ["GEO", "AI可见度", "生成式引擎优化", "AI Entity", "AI Perception Gap"],
  mentions: [
    { "@type": "Thing", name: "GEOloopOS" },
    { "@type": "Thing", name: "AI Visibility Score" },
  ],
};

export default function WhitepaperPage() {
  return (
    <div className="pt-28 sm:pt-36">
      <div className="mx-auto w-full max-w-3xl px-5 pb-24 sm:px-8 sm:pb-32">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reportJsonLd) }}
        />

        {/* 返回 + 标题 */}
        <a href="/" className="link-underline font-mono text-xs text-faint hover:text-muted">
          ← 返回首页
        </a>

        <div className="mt-12 flex items-center gap-4">
          <span className="font-mono text-sm text-faint tabular" aria-hidden="true">
            WHITEPAPER
          </span>
          <span className="h-px w-10 bg-border" aria-hidden="true" />
          <span className="eyebrow">商业蓝皮书 · Experiment #001</span>
        </div>

        <h1 className="display mt-6 text-3xl leading-snug text-text sm:text-4xl md:text-[2.75rem]">
          {whitepaper.title}
        </h1>

        <p className="mt-4 text-base leading-relaxed text-muted">
          {whitepaper.subtitle}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-faint">
          <span>{whitepaper.edition}</span>
          <span className="h-1 w-1 rounded-full bg-border-strong" aria-hidden="true" />
          <span>
            作者 {whitepaper.author} · {whitepaper.authorRole}
          </span>
          <span className="h-1 w-1 rounded-full bg-border-strong" aria-hidden="true" />
          <time dateTime="2026-08-18">数据基准 {whitepaper.date}</time>
        </div>

        <div className="mt-14">
          <PostBody source={whitepaper.body} />
        </div>
      </div>
    </div>
  );
}
