/**
 * 站点全局信息 — 品牌、身份、连接方式
 * 所有个人信息集中在此文件，改一处全局生效。
 */

export interface ContactChannel {
  label: string;      // 展示名：微信 / 邮箱 / 微博 …
  value: string;      // 展示值
  href?: string;      // 可选链接（mailto / https）
  hint?: string;      // 补充说明（如"添加请备注来源"）
}

export const site = {
  /** 品牌名 */
  name: "张晓明",
  /** 英文标识（域名 / 结构化数据用） */
  nameEn: "Zhang Keneng",
  /** 域名 */
  url: "https://zkoner.com",
  /** 核心使命 */
  mission: "让每一次相遇，都产生新的可能。",
  /** 个人定位（Hero 主标签） */
  role: "GEOloop 创始人",
  /** 定位扩展（不含 role 本身，避免重复展示） */
  roles: ["AI 顾问", "AI 时代个人创业探索者", "企业 AI 转型观察者"],
  /** Hero 副标题 */
  heroSubtitle: "用真实实验数据，研究品牌如何被 AI 识别、引用与推荐。",
  /** 一句话简介（SEO description 基础，固定结构与 brand.identity 保持一致） */
  description:
    "张晓明，GEOloop 创始人，AI 顾问，AI 时代个人创业探索者，企业 AI 转型观察者。zkoner.com 是他的 AI 实验站点：用自研 GEOloop 实测品牌如何被 AI 识别、引用与推荐，方法论沉淀为白皮书。",

  /** 站点定位（完整版）：zkoner.com 是什么 —— GEOloop 创始人的 AI 实验站点 */
  position: "GEOloop 创始人的 AI 实验站点",
  /** 站点定位（短版）：Hero 眉标用，避免与下方品牌名重复 */
  positionShort: "GEOloop 创始人 · AI 实验站",

  /** 栏目品牌 */
  columns: {
    lab: "可能实验",
    insights: "AI 时代观察",
  },

  /** 个人连接 */
  contact: {
    note: "欢迎企业家、创业者、创造者交流。",
    channels: [
      { label: "微信", value: "zhangkennen", hint: "添加请备注「可能」" },
      {
        label: "邮箱",
        value: "hello@zkoner.com",
        href: "mailto:hello@zkoner.com",
      },
      { label: "微博", value: "@张晓明" },
      { label: "知乎", value: "张晓明" },
      {
        label: "GitHub",
        value: "github.com/zhangxiaomingv",
        href: "https://github.com/zhangxiaomingv",
      },
    ],
  },
} as const;
