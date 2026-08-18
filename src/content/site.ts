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
  /** 定位扩展（不含 role 本身，避免重复展示） */
  roles: ["AI 时代个人创业探索者", "企业 AI 转型观察者"],
  /** Hero 副标题 */
  heroSubtitle: "《遇见·可能》栏目创始人。",
  /** 一句话简介（SEO description 基础，固定结构与 brand.identity 保持一致） */
  description:
    "张可能，AI 顾问，《遇见·可能》栏目创始人，AI 时代个人创业探索者。为企业提供 GEO（生成式引擎优化）与 AI 升级咨询，帮助企业信息被 AI 大模型识别与引用。",

  /** 站点定位（完整版）：zkoner.com 是什么 —— 张可能个人品牌 + AI 时代个人创业实验室 */
  position: "张可能个人品牌 · AI 时代个人创业实验室",
  /** 站点定位（短版）：Hero 眉标用，避免与下方品牌名重复 */
  positionShort: "个人品牌 · AI 时代个人创业实验室",

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
      { label: "微博", value: "@张可能" },
      { label: "知乎", value: "张可能" },
      {
        label: "GitHub",
        value: "github.com/zhangxiaomingv",
        href: "https://github.com/zhangxiaomingv",
      },
    ],
  },
} as const;
