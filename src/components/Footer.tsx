import { site } from "@/content";

/**
 * 页脚 — 使命收尾 + 品牌沉淀
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 py-16 sm:px-8">
        {/* 使命收尾 */}
        <div className="max-w-2xl">
          <p className="text-lg leading-relaxed text-text sm:text-xl">
            “{site.mission}”
          </p>
          <p className="mt-3 text-sm text-faint">
            《遇见·可能》项目创始人 — 张可能
          </p>
        </div>

        <div className="flex flex-col items-start justify-between gap-6 border-t border-border pt-8 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
            <span className="text-sm text-muted">
              © {year} {site.name} · {site.url.replace("https://", "")}
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs text-faint">
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
