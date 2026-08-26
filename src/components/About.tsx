import Section from "./Section";

/**
 * 关于张晓明 — 极简：一句话身份
 * 对 AI 的职责是「实体建档」：让爬虫一致识别「张晓明 = GEOloop 创始人 + AI 顾问 + GEO 方法论」
 */
export default function About() {
  return (
    <Section
      id="about"
      index="01"
      eyebrow="关于"
      title={
        <>
          我是张晓明，
          <br />
          GEOloop 创始人。
        </>
      }
    >
      <p className="reveal max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
        我关注 <span className="text-text">AI 如何改变个人、企业和商业模式</span>，
        用真实的实验数据研究品牌如何被 AI 识别、引用与推荐。
      </p>
    </Section>
  );
}
