import Section from "./Section";
import { services } from "@/content";

/**
 * AI 顾问服务 — 企业 AI 升级咨询
 * 服务卡片 + 交付点 + 底部 CTA
 */
export default function Services() {
  return (
    <Section
      id="services"
      index="02"
      eyebrow="AI 顾问服务"
      title={
        <>
          企业 AI 升级咨询，
          <br />
          让技术落到业务里。
        </>
      }
    >
      {/* GEO 枢纽入口（服务页 → 枢纽页 /geo） */}
      <a
        href="/geo"
        className="group mb-12 flex items-center justify-between gap-6 rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent/40 sm:p-7"
      >
        <div>
          <p className="font-mono text-xs text-faint">
            GEO · 生成式引擎优化
          </p>
          <p className="mt-2 text-base font-medium text-text">
            让品牌与企业信息被 AI 识别、引用和推荐
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            检测 → 内容 → 复测的一轮循环，相关文章与成绩单都在这。
          </p>
        </div>
        <span className="shrink-0 font-mono text-sm text-accent">
          了解 GEO →
        </span>
      </a>

      <div className="grid gap-4 sm:grid-cols-2">
        {services.map((s) => (
          <article key={s.id} className="card group flex flex-col p-8">
            <div className="flex items-center justify-between">
              <span
                className="font-mono text-sm text-faint tabular transition-colors group-hover:text-accent"
                aria-hidden="true"
              >
                {s.index}
              </span>
              <span
                className="h-1.5 w-1.5 rounded-full bg-accent opacity-60"
                aria-hidden="true"
              />
            </div>

            <h3 className="mt-6 text-xl font-semibold text-text">
              {s.title}
            </h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
              {s.description}
            </p>

            <ul className="mt-6 space-y-2 border-t border-border pt-6">
              {s.deliverables.map((d) => (
                <li key={d} className="flex items-center gap-2.5 text-sm text-muted">
                  <span
                    className="h-1 w-1 rounded-full bg-accent/70"
                    aria-hidden="true"
                  />
                  {d}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 flex flex-col items-start gap-4 rounded-2xl border border-border bg-surface p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
        <div>
          <h3 className="text-lg font-medium text-text">
            不确定从哪里开始？
          </h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
            先聊 30 分钟，我们一起找到第一个能落地的 AI 切入点。
          </p>
        </div>
        <a href="#connect" className="btn btn-accent shrink-0">
          预约交流
        </a>
      </div>
    </Section>
  );
}
