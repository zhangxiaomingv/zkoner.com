import type { Metadata } from "next";
import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site } from "@/content";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role} · AI 时代个人创业探索者`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [
    "张可能",
    "AI 顾问",
    "企业 AI 转型",
    "AI 工作流",
    "个人品牌",
    "一人公司",
    "AI 时代",
    "创业探索",
    "企业探访",
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.role} · AI 时代个人创业探索者`,
    description: site.heroSubtitle,
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
    title: `${site.name} — ${site.role}`,
    description: site.heroSubtitle,
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

/**
 * schema.org Person 结构化数据 — AI 搜索可识别的个人知识节点
 */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  alternateName: site.nameEn,
  url: site.url,
  jobTitle: site.role,
  description: site.description,
  knowsAbout: [
    "AI 顾问",
    "企业 AI 转型",
    "AI 工作流设计",
    "个人品牌",
    "一人公司",
    "AI 搜索优化",
  ],
  brand: {
    "@type": "Brand",
    name: site.name,
    slogan: site.mission,
  },
  sameAs: [],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="bg-bg text-text">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
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
