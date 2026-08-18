/**
 * AI 时代观察 — 文章与思考
 * 内容方向：AI 趋势 / 个人品牌 / 一人公司 / 创业思考 / 商业模式
 * 未来可对接博客系统 / CMS，此处为静态首期内容。
 */

export type PostCategory =
  | "AI 趋势"
  | "个人品牌"
  | "一人公司"
  | "创业思考"
  | "商业模式";

export interface Post {
  id: string;
  title: string;
  category: PostCategory;
  date: string;         // ISO 日期，如 "2026-08-10"
  excerpt: string;
  href?: string;        // 未来指向文章详情页
}

export const postCategories: PostCategory[] = [
  "AI 趋势",
  "个人品牌",
  "一人公司",
  "创业思考",
  "商业模式",
];

export const posts: Post[] = [
  {
    id: "post-001",
    title: "普通人建立个人品牌的三个 AI 杠杆",
    category: "个人品牌",
    date: "2026-08-12",
    excerpt:
      "内容生产、知识管理、工作流外包——AI 让个人品牌第一次对小团队成为可能。",
  },
  {
    id: "post-002",
    title: "AI 时代，企业官网为什么反而更重要了",
    category: "AI 趋势",
    date: "2026-08-05",
    excerpt:
      "当客户先问 AI 再搜索，一个能被 AI 理解的企业数字身份，就是新的获客入口。",
  },
  {
    id: "post-003",
    title: "一人公司的边界到底在哪",
    category: "一人公司",
    date: "2026-07-28",
    excerpt:
      "一个真实的一人公司实验记录：什么值得自己做，什么应该交给 AI。",
  },
  {
    id: "post-004",
    title: "中小企业上 AI，先别买工具，先想流程",
    category: "创业思考",
    date: "2026-07-20",
    excerpt:
      "多数企业 AI 转型失败，不是因为工具不够好，而是流程没想清楚。",
  },
];
