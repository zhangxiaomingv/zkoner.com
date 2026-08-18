import Section from "./Section";
import { site, episodeStatement, episodeCategories, episodes } from "@/content";

const CATEGORY_ICONS: Record<string, string> = {
  visit: "探",
  interview: "访",
  case: "案",
  insight: "观",
};

/**
 * 《遇见·可能》— 纪录片栏目（核心内容模块）
 * 顶部使命句 + 内容形态 + 节目列表
 */
export default function Documentary() {
  return (
    <Section
      id="documentary"
      index="02"
      eyebrow={site.columns.documentary}
      title={
        <>
          走进真实企业，
          <br />
          记录 AI 时代的新可能。
        </>
      }
    >
      {/* 核心陈述 */}
      <div className="card reveal relative overflow-hidden p-8 sm:p-12">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent-soft blur-3xl"
          aria-hidden="true"
        />
        <p className="relative text-2xl font-medium leading-snug text-text sm:text-3xl md:text-4xl">
          “{episodeStatement}”
        </p>
        <p className="relative mt-5 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
          走进真实企业，遇见创业者和行业实践者，记录 AI 时代人与企业的新可能。
        </p>
      </div>

      {/* 内容形态 */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {episodeCategories.map((cat, i) => (
          <div
            key={cat.id}
            className="card group p-6"
          >
            <div className="flex items-center justify-between">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft font-mono text-sm text-accent"
                aria-hidden="true"
              >
                {CATEGORY_ICONS[cat.id]}
              </span>
              <span className="font-mono text-xs text-faint tabular" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="mt-5 text-base font-semibold text-text">
              {cat.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {cat.description}
            </p>
          </div>
        ))}
      </div>

      {/* 节目列表 */}
      <div className="mt-8 border-t border-border">
        {episodes.map((ep) => (
          <a
            key={ep.id}
            href={ep.href ?? "#documentary"}
            className="group flex flex-col gap-2 border-b border-border py-6 transition-colors sm:flex-row sm:items-center sm:gap-8"
          >
            <span className="font-mono text-sm text-faint tabular w-20 shrink-0">
              {ep.number}
            </span>
            <div className="min-w-0 flex-1">
              <h4 className="text-base font-medium text-text transition-colors group-hover:text-accent sm:text-lg">
                {ep.title}
              </h4>
              <p className="mt-1 text-sm text-muted">{ep.excerpt}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="text-xs text-faint">{ep.subject}</span>
              <span className="rounded-full border border-border px-2.5 py-1 text-xs text-faint">
                {ep.status}
              </span>
            </div>
          </a>
        ))}
      </div>
    </Section>
  );
}
