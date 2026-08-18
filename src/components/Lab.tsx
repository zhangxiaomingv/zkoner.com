import Section from "./Section";
import { site, projects } from "@/content";

const STATUS_STYLE: Record<string, string> = {
  探索中: "text-faint border-border",
  孵化中: "text-accent border-accent/30",
  已上线: "text-text border-border-strong",
};

/**
 * 可能实验 — 项目实验室
 * 记录正在探索的 AI 项目、一人公司实验与商业验证。
 * 数据由 content/projects.ts 驱动，可动态增加。
 */
export default function Lab() {
  return (
    <Section
      id="lab"
      index="04"
      eyebrow={site.columns.lab}
      title={
        <>
          正在做的实验，
          <br />
          都记录在这里。
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((p) => (
          <article
            key={p.id}
            className="card group flex flex-col p-8"
          >
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-text">{p.title}</h3>
              <span
                className={`shrink-0 rounded-full border px-2.5 py-1 text-xs ${STATUS_STYLE[p.status]}`}
              >
                {p.status}
              </span>
            </div>

            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
              {p.description}
            </p>

            {p.progress && (
              <p className="mt-4 border-l-2 border-accent/50 pl-3 text-xs leading-relaxed text-faint">
                {p.progress}
              </p>
            )}

            <div className="mt-6 flex flex-wrap gap-2">
              {p.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-surface-2 px-2.5 py-1 text-xs text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
