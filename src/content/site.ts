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
  name: "张可能",
  /** 英文标识（域名 / 结构化数据用） */
  nameEn: "Zhang Keneng",
  /** 域名 */
  url: "https://zkoner.com",
  /** 核心使命 */
  mission: "让每一次相遇，都产生新的可能。",
  /** 个人定位（Hero 主标签） */
  role: "AI 顾问",
  /** 定位扩展 */
  roles: ["AI 顾问", "AI 时代个人创业探索者", "企业 AI 转型观察者"],
  /** Hero 副标题 */
  heroSubtitle: "用 AI 探索个人与企业的新可能。",
  /** 一句话简介（SEO description 基础） */
  description:
    "张可能，AI 顾问，AI 时代个人创业探索者。关注 AI 如何改变个人、企业与商业模式，记录企业与创业者在 AI 时代的转型新可能。",

  /** 栏目品牌 */
  columns: {
    documentary: "遇见·可能",
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
      {
        label: "公众号",
        value: "遇见·可能",
        hint: "企业探访 / 创业者访谈更新",
      },
      { label: "微博", value: "@张可能", href: "https://weibo.com" },
      {
        label: "知乎",
        value: "张可能",
        href: "https://zhihu.com",
      },
    ],
  },
} as const;
