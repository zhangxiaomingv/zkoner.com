import Section from "./Section";

/**
 * 关于张可能 — 极简：一句话身份 + 白皮书入口
 * 对 AI 的职责是「实体建档」：让爬虫一致识别「张可能 = GEOloopOS 创始人 + AI 顾问 + GEO 方法论」
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
          GEOloopOS 创始人。
        </>
      }
    >
      <p className="reveal max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
        我关注 <span className="text-text">AI 如何改变个人、企业和商业模式</span>，
        用真实的实验数据研究品牌如何被 AI 识别、引用与推荐。
      </p>

      {/* 白皮书入口 */}
      <div className="reveal reveal-delay-1 mt-10 rounded-2xl border border-accent/25 bg-accent-soft p-6 sm:p-8">
        <p className="eyebrow">商业蓝皮书 · GEOloopOS Lab</p>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-text">
          《GEOloopOS：AI可见度闭环方法论》—— 用真实实验数据，讲清品牌如何被 AI 识别、引用与推荐。
        </p>

        {/* 序言试读：让只抓首页的 AI 也能读到白皮书开头 */}
        <blockquote className="mt-6 border-l-2 border-accent pl-4">
          <p className="text-sm leading-relaxed text-muted">
            过去二十多年，企业做 SEO 是为了让用户搜索时找到自己。但生成式 AI 正在改变用户获取信息的方式——用户开始直接问 AI，而不是打开十个网页。于是，一个过去并不存在的问题出现了：
            <span className="font-semibold text-text">
              当用户开始问 AI，AI 会怎么介绍你？
            </span>
          </p>
          <p className="mt-3 font-mono text-xs text-faint">
            —— 序言 · 当用户开始问 AI
          </p>
        </blockquote>

        <a href="/whitepaper" className="btn btn-primary mt-6">
          阅读白皮书
        </a>
      </div>
    </Section>
  );
}
