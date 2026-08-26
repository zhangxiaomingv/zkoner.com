/**
 * 自我实验 — 项目实验室
 * 记录正在探索的 AI 项目、一人公司实验与商业验证。
 * 项目可动态增加：在数组头部追加新项目即可。
 */

export type ProjectStatus = "探索中" | "孵化中" | "已上线";

export interface Project {
  id: string;
  title: string;
  status: ProjectStatus;
  description: string;
  /** 探索方向标签 */
  tags: string[];
  /** 一句话进展（供未来动态更新） */
  progress?: string;
  href?: string; // 未来指向项目详情页 / 外部链接
}

export const projects: Project[] = [
  {
    id: "geo-lab",
    title: "AI 搜索可见度实验室",
    status: "孵化中",
    description:
      "研究 AI 搜索（ChatGPT / 秘塔 / 豆包）如何理解并推荐品牌与企业，搭建一套可见度监测体系。",
    tags: ["AI 搜索", "GEO", "监测"],
    progress: "已完成 tools/visibility 监测系统：检测/监控/交叉验证",
  },
  {
    id: "one-person",
    title: "一人公司实验",
    status: "探索中",
    description:
      "以最少人力运转 AI 工具链，验证一个人 + AI 能撑起多大业务边界。所有过程公开记录。",
    tags: ["一人公司", "工具链", "长期主义"],
    progress: "梳理 AI 工具矩阵中",
  },
  {
    id: "ai-voice",
    title: "AI 语音获客实验",
    status: "探索中",
    description:
      "语音对话式获客与客服：让 AI 接电话、聊客户、做初筛，把人的时间留给成交。",
    tags: ["语音 AI", "获客", "客服"],
  },
  {
    id: "content-pipe",
    title: "AI 内容生产线",
    status: "孵化中",
    description:
      "把选题、脚本、口播、剪辑拆成流水线，用 AI 持续生产可沉淀的内容资产。",
    tags: ["内容生产", "自动化", "个人品牌"],
  },
];
