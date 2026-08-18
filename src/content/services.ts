/**
 * AI 顾问服务 — 企业 AI 升级咨询
 * 每条服务：编号 / 标题 / 说明 / 交付点（可动态增减）
 */

export interface Service {
  id: string;
  index: string;      // 服务编号，如 "01"
  title: string;
  description: string;
  deliverables: string[]; // 服务包含的具体内容
}

export const services: Service[] = [
  {
    id: "workflow",
    index: "01",
    title: "AI 工作流设计",
    description:
      "拆解业务真实流程，找出 AI 可替换、可增强、可倍增的环节，设计能落地的自动化工作流，而不是空谈大模型。",
    deliverables: ["现有流程 AI 化诊断", "自动化工作流搭建", "多工具串联方案"],
  },
  {
    id: "planning",
    index: "02",
    title: "企业 AI 应用规划",
    description:
      "面向中小企业的 AI 转型路线图：从「能做什么」到「先做什么」，用最小成本验证，避免跟风与试错浪费。",
    deliverables: ["AI 转型路线图", "场景优先级评估", "成本与 ROI 测算"],
  },
  {
    id: "digital",
    index: "03",
    title: "网站与数字化建设",
    description:
      "让企业具备 AI 时代的数字基础设施：可被 AI 搜索理解的企业官网、内容体系与数据链路。",
    deliverables: ["AI 友好官网建设", "内容数字化梳理", "数据链路搭建"],
  },
  {
    id: "ai-staff",
    index: "04",
    title: "AI 员工体系搭建",
    description:
      "把 AI 变成企业的新员工：训练专属知识库、配置智能客服与内容助手，打造一支 24 小时在线的数字团队。",
    deliverables: ["企业知识库训练", "智能客服部署", "数字员工 SOP"],
  },
];
