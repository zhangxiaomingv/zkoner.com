/**
 * 《遇见·可能》— 纪录片栏目内容
 * 走进真实企业，遇见创业者和行业实践者，记录 AI 时代人与企业的新可能。
 *
 * episodes: 已发布 / 在制作中的节目，可动态增加。
 * categories: 栏目内容形态。
 */

export type EpisodeStatus = "已发布" | "制作中" | "策划中";

export interface Episode {
  id: string;
  /** 期数，如 "第 01 期" */
  number: string;
  title: string;
  /** 探访对象 / 嘉宾 / 主题 */
  subject: string;
  category: string;     // 对应 categories 的 id
  status: EpisodeStatus;
  excerpt: string;      // 一句话简介
  date?: string;        // 发布日期，如 "2026-08"
  href?: string;        // 未来指向具体节目页
}

export interface EpisodeCategory {
  id: string;
  title: string;
  description: string;
}

export const episodeStatement =
  "每一次相遇，都是一次新的可能。";

export const episodeCategories: EpisodeCategory[] = [
  {
    id: "visit",
    title: "企业探访",
    description: "走进真实企业，看 AI 如何落地",
  },
  {
    id: "interview",
    title: "创业者访谈",
    description: "和创业者聊他们的探索与挣扎",
  },
  {
    id: "case",
    title: "AI 转型案例",
    description: "记录传统企业的升级故事",
  },
  {
    id: "insight",
    title: "商业观察",
    description: "观察 AI 时代的商业新规则",
  },
];

export const episodes: Episode[] = [
  {
    id: "ep-001",
    number: "第 01 期",
    title: "一家成都制造企业，怎么用 AI 重做老流程",
    subject: "制造业 · 企业探访",
    category: "visit",
    status: "制作中",
    excerpt: "传统工厂的第一个 AI 工作流，从最不起眼的环节开始。",
    date: "2026-08",
  },
  {
    id: "ep-002",
    number: "第 02 期",
    title: "一个 00 后，把一家店做成了 AI 公司",
    subject: "个体创业 · 创业者访谈",
    category: "interview",
    status: "制作中",
    excerpt: "小团队、小预算，一个人怎么撬动整个生意。",
  },
  {
    id: "ep-003",
    number: "第 03 期",
    title: "餐饮老板的 AI 私域实验：从 0 到 1 的获客路径",
    subject: "餐饮 · AI 转型案例",
    category: "case",
    status: "策划中",
    excerpt: "一个客户怎么运营，比一百个客户怎么拉新更重要。",
  },
];
