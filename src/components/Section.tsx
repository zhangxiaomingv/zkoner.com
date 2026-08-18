import type { ReactNode } from "react";

interface SectionProps {
  id: string;
  /** 区块编号，如 "01" */
  index: string;
  /** 栏目标签，如 "遇见·可能" */
  eyebrow: string;
  title: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * 统一区块容器：等宽编号 + 栏目标签 + 大标题 + 内容
 * 全站六个区块共用同一骨架，保证节奏一致。
 */
export default function Section({
  id,
  index,
  eyebrow,
  title,
  children,
  className = "",
}: SectionProps) {
  return (
    <section id={id} className={`scroll-mt-24 ${className}`}>
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        {/* 区块头部 */}
        <header className="mb-12 sm:mb-16">
          <div className="flex items-center gap-4">
            <span className="font-mono text-sm text-faint tabular" aria-hidden="true">
              {index}
            </span>
            <span className="h-px w-10 bg-border" aria-hidden="true" />
            <span className="eyebrow">{eyebrow}</span>
          </div>
          <h2 className="display mt-6 max-w-2xl text-3xl text-text sm:text-4xl md:text-5xl">
            {title}
          </h2>
        </header>
        {children}
      </div>
    </section>
  );
}
