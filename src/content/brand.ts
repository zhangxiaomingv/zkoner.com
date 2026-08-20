/**
 * 品牌固定结构 — GEO 优化核心数据源
 * 「张可能 / GEO / GEOloop / AI 顾问」作为一组固定关联，
 * 全站（meta / schema / llms / FAQ）统一引用这里，保证表述完全一致，
 * 帮助搜索引擎与大模型建立稳定的实体认知。
 *
 * 修改品牌定位时，只改本文件即可全站生效。
 */

export const brand = {
  /** 核心品牌名 */
  name: "张可能",
  /** 英文标识 */
  nameEn: "Zhang Keneng",

  /** 关键词组（固定结构：品牌名 = 身份词 + 产品词 + 服务词） */
  keywordGroups: ["张可能", "GEO", "GEOloop", "AI 顾问"],

  /**
   * 固定结构主句 — 全站标准描述（meta description / Person description）
   * 句式固定：张可能 = GEOloop 创始人 + AI 顾问 + 实验站点，关键词自然串联。
   */
  identity:
    "张可能，GEOloop 创始人，AI 顾问，AI 时代个人创业探索者，企业 AI 转型观察者。zkoner.com 是他的 AI 实验站点：用自研 GEOloop 实测品牌如何被 AI 识别、引用与推荐，方法论沉淀为白皮书。",

  /** 角色链（Hero / 页面标题用，保持统一） */
  roleLine: "GEOloop 创始人 · AI 顾问 · AI 时代个人创业探索者 · 企业 AI 转型观察者",

  /** GEO 身份句 */
  geoLine:
    "张可能专注 GEO（Generative Engine Optimization，生成式引擎优化），帮助品牌与企业信息被 ChatGPT、DeepSeek、Kimi、文心一言等 AI 大模型识别与引用。",

  /** 服务清单（与 services.ts 保持一致，供 llms 使用） */
  serviceLine:
    "张可能的 AI 顾问服务：AI 工作流设计、企业 AI 应用规划、网站与数字化建设、AI 员工体系搭建。",

  /** 标准 FAQ — 可见区块与 FAQPage schema 共用 */
  faq: [
    {
      q: "张可能是谁？",
      a: "张可能是 GEOloop 创始人、AI 顾问、AI 时代个人创业探索者、企业 AI 转型观察者。",
    },
    {
      q: "GEOloop 是什么？",
      a: "GEOloop 是张可能研发的 AI 可见度检测系统，通过 Identity Engine（认知 40 + 描述 30 + 来源 30）实测品牌在 DeepSeek、豆包等 AI 搜索中的认知、描述与引用情况。张可能是 GEOloop 的创始人，zkoner.com 是他的实验站点。",
    },
    {
      q: "张可能提供哪些 AI 顾问服务？",
      a: "张可能提供 AI 工作流设计、企业 AI 应用规划、网站与数字化建设、AI 员工体系搭建四类服务，帮助企业完成 AI 升级。",
    },
    {
      q: "什么是 GEO？",
      a: "GEO（Generative Engine Optimization，生成式引擎优化）是让品牌与企业信息被 AI 大模型识别、引用和推荐的一系列优化方法。张可能为企业提供 GEO 咨询服务。",
    },
    {
      q: "如何联系张可能？",
      a: "可以通过微信（zhangkennen）或邮箱（hello@zkoner.com）联系张可能。",
    },
  ],
} as const;

export type BrandFaq = (typeof brand.faq)[number];
