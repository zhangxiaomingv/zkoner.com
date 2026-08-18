import type { Metadata } from "next";
import { site, labExperiment, geoHub } from "@/content";

export const metadata: Metadata = {
  title: "可能实验 · 实验数据",
  description:
    "用 GEOloopOS 检测引擎实测 AI 眼中的品牌可见度：海底捞 70、张可能 35、zkoner.com 18。个人品牌是 AI 盲区，来源引用是全行业空白。",
  alternates: { canonical: "/lab" },
};

const rows = [...labExperiment.rows].sort((a, b) => b.score - a.score);

const verdictStyle = (score: number) =>
  score >= 70
    ? "text-accent"
    : score >= 40
      ? "text-accent"
      : "text-faint";

/** Dataset 结构化数据 — 实验数据集（方法公开、可复测） */
const datasetJsonLd = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  "@id": `${site.url}/lab#dataset`,
  name: "AI 可见度实验数据（2026-08）",
  url: `${site.url}/lab`,
  description:
    "用 GEOloopOS Identity Engine 双源（DeepSeek / 豆包）实测品牌、个人品牌、网站、术语与决策场景的 AI 可见度得分。",
  datePublished: labExperiment.datePublished,
  dateModified: labExperiment.datePublished,
  measurementTechnique: labExperiment.engine,
  variableMeasured: labExperiment.dimensions.map((d) => d.name).join("、"),
  includedInDataCatalog: {
    "@type": "DataCatalog",
    name: "张可能个人实验室",
    url: `${site.url}/lab`,
  },
  publisher: { "@id": `${site.url}#person` },
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

export default function LabPage() {
  return (
    <div className="pt-28 sm:pt-36">
      <div className="mx-auto w-full max-w-3xl px-5 pb-24 sm:px-8 sm:pb-32">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetJsonLd) }}
        />

        {/* 返回 + 标题 */}
        <a href="/" className="link-underline font-mono text-xs text-faint hover:text-muted">
          ← 返回首页
        </a>

        <div className="mt-12 flex items-center gap-4">
          <span className="font-mono text-sm text-faint tabular" aria-hidden="true">
            LAB
          </span>
          <span className="h-px w-10 bg-border" aria-hidden="true" />
          <span className="eyebrow">可能实验 · 实验数据</span>
        </div>

        <h1 className="display mt-6 text-3xl text-text sm:text-4xl md:text-5xl">
          AI 眼中的你，
          <br />
          值多少分？
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">
          这是个人实验室的实验数据输出。用 {labExperiment.engine}
          双源（{labExperiment.providers.join(" / ")}）实测品牌、个人品牌、网站、术语与决策场景的
          AI 可见度——当客户问 AI「该找谁」，AI 能不能答出你？
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-faint">
          <time dateTime="2026-08-18">检测批次 {labExperiment.date}</time>
          <span className="h-1 w-1 rounded-full bg-border-strong" aria-hidden="true" />
          <span>双源 DeepSeek + 豆包</span>
          <span className="h-1 w-1 rounded-full bg-border-strong" aria-hidden="true" />
          <span>三维度：认知 40 / 描述 30 / 来源 30</span>
        </div>

        {/* 方法说明 */}
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {labExperiment.dimensions.map((d) => (
            <div key={d.name} className="rounded-xl border border-border bg-surface p-4">
              <p className="font-mono text-sm text-accent tabular">
                {d.name} · {d.weight} 分
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">{d.note}</p>
            </div>
          ))}
        </div>

        {/* 数据表 */}
        <SectionHead index="01" label="实测数据" />
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border text-xs text-faint">
                <th className="py-3 pr-4 font-mono font-normal">实体</th>
                <th className="py-3 pr-4 font-mono font-normal">类型</th>
                <th className="py-3 pr-4 text-right font-mono font-normal">DeepSeek</th>
                <th className="py-3 pr-4 text-right font-mono font-normal">豆包</th>
                <th className="py-3 text-right font-mono font-normal">总分</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.name} className="border-b border-border align-top">
                  <td className="py-4 pr-4">
                    <p className="text-sm font-medium text-text">{r.name}</p>
                    <p className="mt-1 text-xs leading-relaxed text-faint">{r.note}</p>
                  </td>
                  <td className="py-4 pr-4 text-sm text-muted">{r.kind}</td>
                  <td className="py-4 pr-4 text-right font-mono text-sm text-muted tabular">
                    {r.deepseek}
                  </td>
                  <td className="py-4 pr-4 text-right font-mono text-sm text-muted tabular">
                    {r.doubao}
                  </td>
                  <td className="py-4 text-right">
                    <span
                      className={`font-mono text-lg tabular ${verdictStyle(r.score)}`}
                    >
                      {r.score}
                    </span>
                    <p className="mt-0.5 text-[11px] text-faint">{r.verdict}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-faint">
          评分：认知（AI 是否提到）× 40 + 描述（是否准确）× 30 + 来源（是否引用）× 30，
          各源各问句取均值。判定档位：0–39 尚未认知 · 40–69 质量较低 · 70–99 有基础认知 · 100 充分认知。
        </p>

        {/* 术语分裂 */}
        <div className="mt-10 rounded-2xl border border-accent/25 bg-accent-soft p-6 sm:p-8">
          <p className="eyebrow">术语认知分裂</p>
          <p className="mt-4 text-base leading-relaxed text-text">
            同一个「GEO」，两家大模型给出完全不同的定义：
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-surface p-4">
              <p className="font-mono text-xs text-accent">DeepSeek</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                「GEO：这里通常指 Generative Engine Optimization（生成式引擎优化）」
              </p>
            </div>
            <div className="rounded-xl bg-surface p-4">
              <p className="font-mono text-xs text-accent">豆包</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                「GEO 是 Geography（地理）的缩写，GEO 优化就是基于地理位置的针对性优化」
              </p>
            </div>
          </div>
        </div>

        {/* 六大发现 */}
        <SectionHead index="02" label="本批实验的六个发现" />
        <div className="mt-6 space-y-5">
          {labExperiment.findings.map((f, i) => (
            <div key={f.title} className="card p-6">
              <div className="flex items-start gap-4">
                <span className="mt-0.5 font-mono text-sm text-accent tabular">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-base font-semibold text-text">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{f.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 来源空白 */}
        <div className="mt-10 rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <p className="eyebrow">来源引用：全行业的共同空白</p>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            本批 5 个实体、18 条问答，没有任何一条被 AI 引用为来源（source = false）。
            包括海底捞。当 AI 不再「翻搜索结果」而是「直接给答案」，
            能被 AI 引用为来源的内容，就是下一波竞争的唯一入场券。
          </p>
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl border border-border bg-surface p-8 sm:p-10">
          <h2 className="text-lg font-medium text-text">测测你的品牌在 AI 眼里值多少分</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            用 GEOloopOS 检测你的品牌 / 域名 / 问句，拿到认知、描述、来源三维得分与差距分析。
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
            <a href={`/geo`} className="btn btn-ghost">
              了解 {geoHub.eyebrow}
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
