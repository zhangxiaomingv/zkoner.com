import Section from "@/components/Section";
import { brand } from "@/content";

/**
 * 常见问题 — 品牌固定结构的问答落地
 * 内容与 FAQPage schema 完全一致（同源 brand.faq），
 * 全部问答保持可见纯文本，方便 AI 大模型直接抽取引用。
 */
export default function Faq() {
  return (
    <Section
      id="faq"
      index="07"
      eyebrow="FAQ"
      title="关于张可能，你可能想问"
    >
      <div className="divide-y divide-border border-y border-border">
        {brand.faq.map((item) => (
          <div key={item.q} className="py-6 first:pt-0 last:pb-0">
            <h3 className="text-base font-medium text-text sm:text-lg">
              {item.q}
            </h3>
            <p className="mt-2 max-w-3xl leading-relaxed text-muted">
              {item.a}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
