import type { Metadata } from "next";
import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site, brand, services, episodes, episodeStatement } from "@/content";
import "./globals.css";

/** 页面标题固定结构：张可能 + AI 顾问 +《遇见·可能》+ 角色 */
const pageTitle = `${site.name} — AI 顾问 ·《遇见·可能》栏目创始人 · AI 时代个人创业探索者`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: pageTitle,
    template: `%s — ${site.name}`,
  },
  description: brand.identity,
  keywords: [
    ...brand.keywordGroups,
    "GEO",
    "生成式引擎优化",
    "AI 搜索优化",
    "企业 AI 转型",
    "AI 工作流",
    "个人品牌",
    "AI 时代",
    "创业探索",
    "企业探访",
    "创业者访谈",
    "纪录片栏目",
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  openGraph: {
    type: "website",
    url: site.url,
    siteName: `${site.name} · ${brand.keywordGroups.join(" · ")}`,
    title: pageTitle,
    description: brand.identity,
    locale: "zh_CN",
    images: [
      {
        url: "/og-cover.png",
        width: 1200,
        height: 630,
        alt: site.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — AI 顾问 ·《遇见·可能》栏目创始人`,
    description: brand.identity,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  alternates: {
    canonical: site.url,
  },
};

/** 个人可识别的社交主页（sameAs 用），仅取 http(s) 链接 */
const sameAs = site.contact.channels.flatMap((c) =>
  "href" in c && c.href?.startsWith("http") ? [c.href] : []
);

/**
 * schema.org 结构化数据图谱 — GEO 核心
 * 一个 @graph 内包含：Person（个人实体）/ WebSite / Service / FAQPage / 栏目 ItemList
 * 让 AI 大模型能直接抽取「张可能是谁、做什么、怎么联系」。
 */
const graphJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${site.url}#person`,
      name: site.name,
      alternateName: site.nameEn,
      url: site.url,
      image: `${site.url}/og-cover.png`,
      jobTitle: site.role,
      description: brand.identity,
      knowsAbout: [
        "AI 顾问",
        "GEO 生成式引擎优化",
        "AI 搜索优化",
        "企业 AI 转型",
        "AI 工作流设计",
        "个人品牌",
        "AI 时代个人创业",
      ],
      knowsLanguage: ["zh-CN"],
      brand: {
        "@type": "Brand",
        name: site.name,
        slogan: site.mission,
      },
      mainEntityOfPage: `${site.url}/`,
      sameAs: sameAs.length ? sameAs : undefined,
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}#website`,
      name: site.name,
      url: site.url,
      description: brand.identity,
      inLanguage: "zh-CN",
      publisher: { "@id": `${site.url}#person` },
    },
    {
      "@type": "Service",
      name: "AI 顾问服务",
      serviceType: "AI 咨询 / GEO 优化",
      description: brand.serviceLine,
      provider: { "@id": `${site.url}#person` },
      areaServed: "中国",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "AI 顾问服务",
        itemListElement: services.map((s, i) => ({
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
    },
    {
      "@type": "ItemList",
      name: "《遇见·可能》栏目节目",
      description: episodeStatement,
      numberOfItems: episodes.length,
      itemListElement: episodes.map((e, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: e.title,
        description: e.excerpt,
      })),
    },
    {
      "@type": "FAQPage",
      mainEntity: brand.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="bg-bg text-text">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(graphJsonLd) }}
        />
        <a
          href="#top"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-text focus:px-4 focus:py-2 focus:text-sm focus:text-bg"
        >
          跳到主要内容
        </a>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
