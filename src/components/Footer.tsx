import { site } from "@/content";

/**
 * 页脚 — 使命收尾 + 品牌沉淀
 * minimal 模式（博客区用）：去掉使命句，只保留底部信息栏
 */
export default function Footer({ minimal = false }: { minimal?: boolean }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 py-16 sm:px-8">
        {!minimal && (
          /* 使命收尾 */
          <div className="max-w-2xl">
            <p className="text-lg leading-relaxed text-text sm:text-xl">
              “{site.mission}”
            </p>
            <p className="mt-3 text-sm text-faint">
              GEOloopOS 创始人 · AI 顾问 — 张可能
            </p>
          </div>
        )}

        <div className="flex flex-col items-start justify-between gap-6 border-t border-border pt-8 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
            <span className="text-sm text-muted">
              © {year} {site.name} · {site.url.replace("https://", "")}
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs text-faint">
            <a href="/blog" className="hover:text-muted">
              博客
            </a>
            <a href="/geo" className="hover:text-muted">
              GEO 优化
            </a>
            <a href="/whitepaper" className="hover:text-muted">
              白皮书
            </a>
            <a href="/scorecard" className="hover:text-muted">
              AI 成绩单
            </a>
            <a href="mailto:hello@zkoner.com" className="hover:text-muted">
              联系
            </a>
            <a href="/llms.txt" className="hover:text-muted">
              llms.txt
            </a>
            <a href="/sitemap.xml" className="hover:text-muted">
              sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
