import type { Metadata } from "next";
import {
  site,
  brand,
  services,
  sortedPosts,
  scorecards,
  geoHub,
  type Post,
  type Service,
  type BrandFaq,
} from "@/content";

export const metadata: Metadata = {
  title: "GEO 生成式引擎优化",
  description:
    "张可能专注 GEO（生成式引擎优化），帮品牌与企业信息被 ChatGPT、DeepSeek、Kimi、文心一言等 AI 大模型识别与引用。检测、内容、复测的一轮循环。",
  alternates: { canonical: "/geo" },
};

/** GEO 直接相关的顾问服务（geoHub.serviceIds → services.ts 数据） */
const hubServices = geoHub.serviceIds
  .map((id) => services.find((s) => s.id === id))
  .filter((s): s is Service => Boolean(s));

/** 相关内容聚簇（文章 + 成绩单 + 产品），与文章正文的「→ /geo」互链 */
const relatedPosts = geoHub.related.postIds
  .map((id) => sortedPosts().find((p) => p.id === id))
  .filter((p): p is Post => Boolean(p));

const relatedItems = [
  ...relatedPosts.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: p.title,
    url: `${site.url}${p.slug ? `/blog/${p.slug}` : "/blog"}`,
  })),
  {
    "@type": "ListItem",
    position: relatedPosts.length + 1,
    name: scorecards[0].title,
    url: `${site.url}/scorecard`,
  },
  {
    "@type": "ListItem",
    position: relatedPosts.length + 2,
    name: "GEOloopOS — AI 可见度检测引擎",
    url: "https://github.com/zhangxiaomingv/geoloopos",
  },
];

/** GEO 常见问题（brand.faq 子集） */
const geoFaqs = brand.faq.filter((f) =>
  geoHub.faqQuestions.includes(f.q as (typeof geoHub.faqQuestions)[number])
);

/** Service + ItemList + FAQPage — 枢纽页的三层结构化数据 */
const graphJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${site.url}/geo#service`,
      name: "GEO 生成式引擎优化",
      serviceType: "GEO 咨询 / 生成式引擎优化",
      url: `${site.url}/geo`,
      description: brand.geoLine,
      provider: { "@id": `${site.url}#person` },
      areaServed: "中国",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "GEO 相关服务",
        itemListElement: hubServices.map((s, i) => ({
          "@type": "Offer",
          position: i + 1,
          name: s.title,
          description: s.description,
          itemOffered: {
            "@type": "Service",
            name: s.title,
            description: s.description,
          },
        })),
      },
      mainEntityOfPage: `${site.url}/geo`,
    },
    {
      "@type": "ItemList",
      name: "GEO 相关内容",
      numberOfItems: relatedItems.length,
      itemListElement: relatedItems,
    },
    {
      "@type": "FAQPage",
      mainEntity: geoFaqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

function SectionHead({ index, label }: { index: string; label: string }) {
  return (
    <div className="mt-16 flex items-center gap-4">
      <span className="font-mono text-sm text-faint tabular" aria-hidden="true">
        {index}
      </span>
      <span className="h-px w-10 bg-border" aria-hidden="true" />
      <h2 className="eyebrow">{label}</h2>
    </div>
  );
}

const relatedKind = (kind: string) => (
  <span className="font-mono text-[11px] text-faint">{kind}</span>
);

export default function GeoPage() {
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
            01
          </span>
          <span className="h-px w-10 bg-border" aria-hidden="true" />
          <span className="eyebrow">{geoHub.eyebrow}</span>
        </div>

        <h1 className="display mt-6 text-3xl text-text sm:text-4xl md:text-5xl">
          {geoHub.title}
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">
          {geoHub.intro}
        </p>

        {/* 什么是 GEO */}
        <SectionHead index="01" label="什么是 GEO" />
        <div className="mt-6 space-y-6">
          {geoHub.definition.map((d) => (
            <div key={d.heading}>
              <h3 className="text-lg font-medium text-text">{d.heading}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{d.text}</p>
            </div>
          ))}
        </div>

        {/* 张可能做 GEO 的三种方式 */}
        <SectionHead index="02" label="张可能做 GEO 的三种方式" />
        <div className="mt-6 space-y-4">
          {hubServices.map((s) => (
            <div key={s.id} className="card p-6 sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-semibold text-text">{s.title}</h3>
                <span className="font-mono text-sm text-faint tabular" aria-hidden="true">
                  {s.index}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">{s.description}</p>
              <ul className="mt-5 space-y-2">
                {s.deliverables.map((d) => (
                  <li key={d} className="flex items-center gap-2.5 text-sm text-muted">
                    <span className="h-1 w-1 rounded-full bg-accent/70" aria-hidden="true" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">
          还有{" "}
          <a href="/#services" className="link-underline text-accent">
            AI 员工体系搭建
          </a>{" "}
          等完整服务，见{" "}
          <a href="/#services" className="link-underline text-accent">
            首页服务区
          </a>
          。
        </p>

        {/* GEO 相关内容（双向互链） */}
        <SectionHead index="03" label="GEO 相关内容" />
        <div className="mt-6 border-t border-border">
          {relatedPosts.map((p) => (
            <a
              key={p.id}
              href={p.slug ? `/blog/${p.slug}` : "/blog"}
              className="group flex items-start justify-between gap-6 border-b border-border py-5"
            >
              <div>
                {relatedKind("文章")}
                <p className="mt-1 text-base font-medium text-text transition-colors group-hover:text-accent">
                  {p.title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{p.excerpt}</p>
              </div>
              <span className="mt-0.5 shrink-0 font-mono text-sm text-faint transition-colors group-hover:text-accent">
                →
              </span>
            </a>
          ))}

          <a
            href="/scorecard"
            className="group flex items-start justify-between gap-6 border-b border-border py-5"
          >
            <div>
              {relatedKind("成绩单")}
              <p className="mt-1 text-base font-medium text-text transition-colors group-hover:text-accent">
                {scorecards[0].title}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                用 GEOloopOS 实测大模型眼中的张可能：总分 {scorecards[0].total}，
                {scorecards[0].verdict}。
              </p>
            </div>
            <span className="mt-0.5 shrink-0 font-mono text-sm text-faint transition-colors group-hover:text-accent">
              →
            </span>
          </a>

          <a
            href="https://github.com/zhangxiaomingv/geoloopos"
            target="_blank"
            rel="noreferrer"
            className="group flex items-start justify-between gap-6 border-b border-border py-5"
          >
            <div>
              {relatedKind("产品")}
              <p className="mt-1 text-base font-medium text-text transition-colors group-hover:text-accent">
                GEOloopOS — AI 可见度检测引擎
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                张可能自研的 GEO 检测工具：认知 / 描述 / 来源三维打分，检测 AI 眼中的品牌可见度。
              </p>
            </div>
            <span className="mt-0.5 shrink-0 font-mono text-sm text-faint transition-colors group-hover:text-accent">
              ↗
            </span>
          </a>
        </div>

        {/* 一轮 GEO 优化怎么跑 */}
        <SectionHead index="04" label="一轮 GEO 优化怎么跑" />
        <div className="mt-6">
          {geoHub.steps.map((s) => (
            <div
              key={s.no}
              className="grid grid-cols-[3rem_1fr] gap-x-4 gap-y-1 border-b border-border py-5 last:border-b-0 sm:grid-cols-[3rem_5rem_1fr] sm:items-baseline sm:gap-x-6"
            >
              <span className="font-mono text-sm text-faint tabular">{s.no}</span>
              <span className="text-sm text-accent">{s.title}</span>
              <p className="text-sm leading-relaxed text-muted col-span-2 sm:col-span-1">
                {s.text}
              </p>
            </div>
          ))}
        </div>

        {/* 常见问题 */}
        <SectionHead index="05" label="常见问题" />
        <div className="mt-6 space-y-6">
          {geoFaqs.map((f: BrandFaq) => (
            <div key={f.q}>
              <h3 className="text-base font-medium text-text">{f.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.a}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl border border-border bg-surface p-8 sm:p-10">
          <h2 className="text-lg font-medium text-text">想测测 AI 现在怎么看你？</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            用 GEOloopOS 检测一次你的品牌可见度，从「检测」开始一轮 GEO 循环。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="https://github.com/zhangxiaomingv/geoloopos"
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
            >
              用 GEOloopOS 检测可见度
            </a>
            <a href="/whitepaper" className="btn btn-ghost">
              阅读白皮书
            </a>
            <a href="/#connect" className="btn btn-ghost">
              预约交流
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
