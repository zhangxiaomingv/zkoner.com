import Section from "./Section";

const PILLARS = [
  {
    title: "个人",
    text: "普通人如何用 AI 撬动新的职业与商业可能。",
  },
  {
    title: "企业",
    text: "传统企业如何借助 AI 完成数字化转型与升级。",
  },
  {
    title: "商业模式",
    text: "AI 如何重构成本结构，重塑行业竞争规则。",
  },
] as const;

/**
 * 关于张可能 — 个人思想空间的入口
 * 左：信念陈述；右：关注维度
 */
export default function About() {
  return (
    <Section
      id="about"
      index="01"
      eyebrow="关于"
      title={
        <>
          我是张可能，
          <br />
          一名 AI 顾问。
        </>
      }
    >
      <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        {/* 左：信念陈述 */}
        <div className="reveal space-y-6">
          <p className="text-lg leading-relaxed text-muted sm:text-xl">
            我关注 <span className="text-text">AI 如何改变个人、企业和商业模式</span>。
            我相信：
          </p>
          <p className="text-2xl font-medium leading-snug text-text sm:text-3xl">
            未来属于能够利用 AI 创造可能的人。
          </p>
        </div>

        {/* 右：关注维度 */}
        <div className="reveal reveal-delay-1 space-y-4">
          {PILLARS.map((p, i) => (
            <div
              key={p.title}
              className="card group flex items-start gap-5 p-6"
            >
              <span
                className="font-mono text-sm text-faint tabular transition-colors group-hover:text-accent"
                aria-hidden="true"
              >
                0{i + 1}
              </span>
              <div>
                <h3 className="text-base font-semibold text-text">
                  {p.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  {p.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
