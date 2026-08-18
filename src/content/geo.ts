import { brand } from "./brand";

/**
 * GEO 枢纽页（/geo）— 主题聚簇中心
 * 「网页链接 + 结构化数据 + 内容关系」三层双向绑定的内容侧中枢：
 * - 页面本身提供权威的「张可能 = GEO」实体描述（Service / FAQ / ItemList schema）
 * - 反向列出全部 GEO 相关内容（文章 / 成绩单 / 产品），与文章正文互相链接
 */

export interface GeoDefinition {
  heading: string;
  text: string;
}

export interface GeoStep {
  no: string;
  title: string;
  text: string;
}

export const geoHub = {
  eyebrow: "GEO 优化",
  /** 页面主标题（与 brand.geoLine 呼应，固定口径） */
  title: "让 AI 认识你、理解你、推荐你",
  /** 身份句（复用品牌固定结构） */
  intro: brand.geoLine,

  /** 什么是 GEO — 两段式定义 */
  definition: [
    {
      heading: "客户先问 AI，再搜索",
      text: "越来越多的人不打开搜索引擎，直接问 DeepSeek、豆包、ChatGPT。AI 的答案，正在变成客户决策的第一站——谁能被 AI 读到、读懂、推荐，谁就出现在答案里。",
    },
    {
      heading: "AI 读的，是你能被读到的内容",
      text: "AI 不会「看」你的品牌，它只「读」公网上能检索到的公开内容。这套让品牌与企业信息被大模型准确识别、描述与引用的方法，就是 GEO（生成式引擎优化）。",
    },
  ] as GeoDefinition[],

  /** 一轮 GEO 优化怎么跑 — 与成绩单口径一致（认知 / 描述 / 来源） */
  steps: [
    {
      no: "01",
      title: "检测",
      text: "用 GEOloopOS 查 AI 现在怎么描述你：认知、描述、来源三维打分。先知道起点，才知道往哪补。",
    },
    {
      no: "02",
      title: "内容",
      text: "补齐 AI 能读的证据：权威主页、结构化数据、稳定的品牌口径、可被引用的文章与页面。",
    },
    {
      no: "03",
      title: "复测",
      text: "隔一段时间再测一次，看变化。GEO 是循环，不是一次性动作。",
    },
  ] as GeoStep[],

  /** 枢纽页关联的顾问服务（services.ts 子集，GEO 直接相关） */
  serviceIds: ["workflow", "planning", "digital"] as const,

  /** 相关内容聚簇 — 双向互链的反向侧（正向：文章正文 → /geo） */
  related: {
    /** 相关文章（posts.ts 的 id，按 GEO 相关度排序） */
    postIds: ["post-002", "post-001", "post-004"],
    /** 成绩单 */
    scorecard: true,
    /** GEOloopOS 产品 */
    product: true,
  },

  /** 常见问题（brand.faq 子集，GEO 相关） */
  faqQuestions: ["什么是 GEO？", "张可能提供哪些 AI 顾问服务？"] as const,
} as const;
