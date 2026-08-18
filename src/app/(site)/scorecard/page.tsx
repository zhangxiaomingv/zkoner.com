import type { Metadata } from "next";
import {
  scorecards,
  scorecardOpening,
  scorecardClosing,
  type ProviderVerdict,
} from "@/content";

export const metadata: Metadata = {
  title: "AI 认知成绩单 #1",
  description:
    "张可能用 GEOloopOS 实测 DeepSeek 与豆包眼中的自己：总分 35，AI 尚未认知。检测明细、场景推荐份额与下月计划全部公开。",
  alternates: { canonical: "/scorecard" },
};

const issue = scorecards[0];

const statusLabel: Record<ProviderVerdict["status"], string> = {
  refused: "拒答",
  partial: "部分认知",
  known: "已认知",
};

const statusStyle: Record<ProviderVerdict["status"], string> = {
  refused: "border-border bg-surface-2 text-muted",
  partial: "border-accent/30 bg-accent-soft text-accent",
  known: "border-accent/30 bg-accent-soft text-accent",
};

function StatusPill({ status }: { status: ProviderVerdict["status"] }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs ${statusStyle[status]}`}
    >
      {statusLabel[status]}
    </span>
  );
}

function SectionHead({
  index,
  label,
}: {
  index: string;
  label: string;
}) {
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

export default function ScorecardPage() {
  return (
    <div className="pt-28 sm:pt-36">
      <div className="mx-auto w-full max-w-3xl px-5 pb-24 sm:px-8 sm:pb-32">
        {/* 返回 + 标题 */}
        <a href="/" className="link-underline font-mono text-xs text-faint hover:text-muted">
          ← 返回首页
        </a>

        <div className="mt-12 flex items-center gap-4">
          <span className="font-mono text-sm text-faint tabular" aria-hidden="true">
            #{String(issue.number).padStart(2, "0")}
          </span>
          <span className="h-px w-10 bg-border" aria-hidden="true" />
          <span className="eyebrow">AI 认知成绩单</span>
        </div>

        <h1 className="display mt-6 text-3xl text-text sm:text-4xl md:text-5xl">
          {issue.title}
        </h1>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-faint">
          <time dateTime={issue.date}>检测日期 {issue.date}</time>
          <span className="h-1 w-1 rounded-full bg-border-strong" aria-hidden="true" />
          <span>检测源 DeepSeek + 豆包</span>
          <span className="h-1 w-1 rounded-full bg-border-strong" aria-hidden="true" />
          <span>GEOloopOS Identity Engine</span>
        </div>

        {/* 固定口径 · 开头 */}
        <p className="mt-10 max-w-2xl text-base leading-relaxed text-muted">
          {scorecardOpening} 这是第 {issue.number} 份。
        </p>

        {/* 本月总分 */}
        <div className="card mt-12 p-8 sm:p-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs text-faint">本月总分</p>
              <div className="mt-2 flex items-end gap-2">
                <span className="display text-7xl tabular text-text">{issue.total}</span>
                <span className="mb-2 font-mono text-base text-faint">/ 100</span>
              </div>
            </div>
            <span className="inline-flex items-center rounded-full border border-border bg-surface-2 px-3 py-1 text-xs text-muted">
              {issue.verdict}
            </span>
          </div>
          <div className="mt-9 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-accent"
              style={{ width: `${issue.total}%` }}
            />
          </div>
          <p className="mt-4 font-mono text-xs text-faint tabular">
            认知 · 描述 · 来源 三维度综合 —— AI 尚未把你的信息读进认知。
          </p>
        </div>

        {/* 检测明细 · 双源原话 */}
        <SectionHead index="01" label="检测明细 · 双源原话" />
        <div className="mt-6 space-y-5">
          {issue.providers.map((p) => (
            <div key={p.name} className="card p-6 sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-text">{p.name}</span>
                  <StatusPill status={p.status} />
                </div>
                <span className="font-mono text-2xl tabular text-text">
                  {p.score}
                  <span className="text-base text-faint">/100</span>
                </span>
              </div>
              <p className="mt-4 text-sm text-muted">{p.result}</p>
              <blockquote className="mt-4 border-l-2 border-accent pl-4 text-[13px] leading-relaxed text-faint">
                “{p.quote}”
              </blockquote>
            </div>
          ))}
        </div>

        {/* 三维度判断 */}
        <SectionHead index="02" label="三维度判断" />
        <div className="mt-6">
          {issue.dimensions.map((d) => (
            <div
              key={d.key}
              className="grid grid-cols-[4.5rem_1fr] gap-x-4 gap-y-1 border-b border-border py-5 last:border-b-0 sm:grid-cols-[6rem_4rem_1fr] sm:items-baseline sm:gap-x-6"
            >
              <span className="font-mono text-sm text-faint tabular">{d.key}</span>
              <span className="text-sm text-accent">{d.status}</span>
              <p className="text-sm leading-relaxed text-muted sm:col-span-1 col-span-2">
                {d.note}
              </p>
            </div>
          ))}
        </div>

        {/* 场景推荐份额 */}
        <SectionHead index="03" label="场景推荐份额 · 竞品智能" />
        <div className="card mt-6 p-6 sm:p-8">
          <p className="font-mono text-xs text-faint">场景问题</p>
          <p className="mt-2 text-base text-text">「{issue.scene.question}」</p>

          <div className="mt-8 flex items-end gap-3">
            <span className="display text-6xl tabular text-text">
              {issue.scene.myShare}%
            </span>
            <span className="mb-1.5 text-sm text-muted">我的曝光份额 · /2 源</span>
          </div>
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-accent"
              style={{ width: `${issue.scene.myShare}%` }}
            />
          </div>
          <p className="mt-4 text-sm text-muted">
            谁排第一：<span className="text-faint">{issue.scene.leader}</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">{issue.scene.note}</p>

          <div className="mt-7 space-y-3">
            {issue.scene.samples.map((s) => (
              <div key={s.provider} className="rounded-xl bg-surface p-4">
                <span className="font-mono text-xs text-accent">{s.provider}</span>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">
                  “{s.excerpt}”
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 来源引用 */}
        <SectionHead index="04" label="来源引用情况" />
        <p className="mt-6 text-sm leading-relaxed text-muted">{issue.sources.note}</p>

        {/* 这个月我做了什么 / 下个月计划 */}
        <SectionHead index="05" label="这个月我做了什么" />
        <ul className="mt-6 space-y-4">
          {issue.actions.map((a, i) => (
            <li key={i} className="flex gap-4 text-sm leading-relaxed text-muted">
              <span className="mt-0.5 font-mono text-xs text-accent tabular">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{a}</span>
            </li>
          ))}
        </ul>

        <SectionHead index="06" label="下个月计划" />
        <ul className="mt-6 space-y-4">
          {issue.next.map((a, i) => (
            <li key={i} className="flex gap-4 text-sm leading-relaxed text-muted">
              <span className="mt-0.5 font-mono text-xs text-accent tabular">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{a}</span>
            </li>
          ))}
        </ul>

        {/* 核心洞察 */}
        <div className="mt-16 rounded-2xl border border-accent/25 bg-accent-soft p-6 sm:p-8">
          <p className="eyebrow">本月核心洞察</p>
          <p className="mt-5 text-base leading-relaxed text-text sm:text-lg">
            {issue.insight}
          </p>
        </div>

        {/* 固定口径 · 结尾 + CTA */}
        <p className="mt-14 text-base leading-relaxed text-muted">{scorecardClosing}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="https://github.com/zhangxiaomingv/geoloopos"
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
          >
            用 GEOloopOS 检测你的可见度
          </a>
          <a href="/geo" className="btn btn-ghost">
            什么是 GEO
          </a>
          <a href="/whitepaper" className="btn btn-ghost">
            阅读白皮书
          </a>
          <a href="/#insights" className="btn btn-ghost">
            回到 AI 时代观察
          </a>
        </div>
      </div>
    </div>
  );
}
