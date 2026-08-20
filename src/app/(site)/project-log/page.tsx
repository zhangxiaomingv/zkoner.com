import type { Metadata } from "next";
import {
  projectLog,
  archiveNote,
  commitUrl,
  type LogCommitRef,
  type ProjectMilestone,
} from "@/content";

export const metadata: Metadata = {
  title: projectLog.title,
  description: projectLog.description,
  alternates: { canonical: "/project-log" },
};

/** 结构化数据：WebPage + 里程碑 ItemList，让 AI 能直接抽取迭代时间线 */
const logJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://zkoner.com/project-log#page",
  name: projectLog.title,
  description: projectLog.description,
  dateModified: projectLog.updated,
  isPartOf: { "@id": "https://zkoner.com/#website" },
  mainEntity: {
    "@type": "ItemList",
    name: "迭代时间线",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: projectLog.milestones.length,
    itemListElement: projectLog.milestones.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: m.title,
      url: `https://zkoner.com/project-log#m${m.index}`,
    })),
  },
};

function CommitPill({ c }: { c: LogCommitRef }) {
  return (
    <a
      href={commitUrl(c)}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-2.5 py-1 font-mono text-xs text-accent transition-colors hover:border-accent/40 hover:bg-accent-soft"
    >
      <span>{c.repo === "geoloop" ? "GEOloop" : "zkoner"}</span>
      <span className="text-faint">·</span>
      <span className="tabular">{c.hash.slice(0, 7)}</span>
      <span className="hidden text-faint sm:inline">· {c.label}</span>
    </a>
  );
}

function MilestoneRow({ m }: { m: ProjectMilestone }) {
  return (
    <li id={`m${m.index}`} className="relative pl-8 sm:pl-10">
      {/* 时间线圆点 */}
      <span
        className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-accent bg-bg"
        aria-hidden="true"
      />
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-mono text-xs text-faint tabular">{m.date}</span>
        <span className="font-mono text-xs text-accent tabular">{m.index}</span>
        <h2 className="text-lg font-semibold leading-snug text-text sm:text-xl">
          {m.title}
        </h2>
      </div>

      <dl className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
        <div className="grid gap-1 sm:grid-cols-[4.5rem_1fr] sm:items-baseline sm:gap-x-6">
          <dt className="font-mono text-xs text-faint">做了什么</dt>
          <dd>{m.what}</dd>
        </div>
        <div className="grid gap-1 sm:grid-cols-[4.5rem_1fr] sm:items-baseline sm:gap-x-6">
          <dt className="font-mono text-xs text-faint">为什么</dt>
          <dd>{m.why}</dd>
        </div>
        <div className="grid gap-1 sm:grid-cols-[4.5rem_1fr] sm:items-baseline sm:gap-x-6">
          <dt className="font-mono text-xs text-accent">结果</dt>
          <dd>{m.result}</dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap gap-2">
        {m.commits.map((c) => (
          <CommitPill key={`${c.repo}-${c.hash}`} c={c} />
        ))}
      </div>
    </li>
  );
}

export default function ProjectLogPage() {
  return (
    <div className="pt-28 sm:pt-36">
      <div className="mx-auto w-full max-w-3xl px-5 pb-24 sm:px-8 sm:pb-32">
        {/* 返回 + 眉标 */}
        <a
          href="/"
          className="link-underline font-mono text-xs text-faint hover:text-muted"
        >
          ← 返回首页
        </a>

        <div className="mt-12 flex items-center gap-4">
          <span className="eyebrow">{projectLog.eyebrow}</span>
        </div>

        <h1 className="display mt-6 text-3xl text-text sm:text-4xl md:text-5xl">
          {projectLog.title}
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">
          {projectLog.intro}
        </p>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-faint">
          {archiveNote}
        </p>

        {/* 与成绩单的因果联动 */}
        <div className="mt-8 rounded-2xl border border-accent/25 bg-accent-soft p-5 sm:p-6">
          <p className="text-sm leading-relaxed text-text">
            <span className="mr-2 font-mono text-xs text-accent">
              过程 → 结果
            </span>
            日志记录「做了什么」（成因），
            <a href="/scorecard" className="link-underline text-accent">
              AI 认知成绩单
            </a>
            记录「分数怎么变」（结果）。每一份成绩单的前因，都能在这条时间线里找到——本月的三大动作挂在
            <a href="/scorecard" className="link-underline text-accent">
              成绩单「这个月我做了什么」
            </a>
            。
          </p>
        </div>

        {/* 迭代时间线 */}
        <ol className="mt-16 space-y-14 border-l border-border">
          {projectLog.milestones.map((m) => (
            <MilestoneRow key={m.index} m={m} />
          ))}
        </ol>

        {/* 结尾：完整记录入口 */}
        <div className="mt-16 flex flex-wrap gap-3">
          <a
            href="https://github.com/zhangxiaomingv/zkoner.com"
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
          >
            查看完整 commit 记录
          </a>
          <a
            href="https://github.com/zhangxiaomingv/geoloop"
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost"
          >
            GEOloop 源码
          </a>
          <a href="/scorecard" className="btn btn-ghost">
            AI 成绩单
          </a>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(logJsonLd) }}
      />
    </div>
  );
}
