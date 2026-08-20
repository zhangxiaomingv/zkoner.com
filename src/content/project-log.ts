/**
 * 项目日志 — 实验站迭代时间线
 * 每个里程碑对应真实 git commit（点击 hash 可回 GitHub 看当时 diff），
 * 保证「一步步迭代过来」有迹可循。
 */

export interface LogCommitRef {
  /** 完整 commit hash */
  hash: string;
  /** 简短说明（commit message 主题） */
  label: string;
  /** 所属仓库 */
  repo: "zkoner" | "geoloop";
}

export interface ProjectMilestone {
  /** 日期 YYYY-MM-DD */
  date: string;
  /** 阶段编号（01 起，作为页内锚点） */
  index: string;
  title: string;
  /** 做了什么 */
  what: string;
  /** 为什么 */
  why: string;
  /** 结果 / 数据 */
  result: string;
  commits: LogCommitRef[];
}

/** GitHub commit 链接基址 */
const ZKONER_COMMITS = "https://github.com/zhangxiaomingv/zkoner.com/commit";
const GEOLOOPOS_COMMITS = "https://github.com/zhangxiaomingv/geoloop/commit";

export function commitUrl(c: LogCommitRef): string {
  return c.repo === "geoloop"
    ? `${GEOLOOPOS_COMMITS}/${c.hash}`
    : `${ZKONER_COMMITS}/${c.hash}`;
}

/** 更早阶段归档注记（一行，保留实验站叙事完整性，不暴露任何旧产品/隐私） */
export const archiveNote =
  "2026-07~08：更早的个人站与多轮产品探索，已归档清理（2026-08-18 git 历史重建）——日志仅保留当前主线，完整迭代轨迹以 git commit 为准。";

interface ProjectLogData {
  title: string;
  eyebrow: string;
  description: string;
  intro: string;
  updated: string;
  milestones: ProjectMilestone[];
}

export const projectLog: ProjectLogData = {
  title: "项目日志",
  eyebrow: "实验站 · 迭代日志",
  description:
    "zkoner.com 作为 GEOloop 创始人的 AI 实验站点，是怎么一步步迭代过来的——每个里程碑都对应真实的 git commit，可点回查看当时的改动。",
  intro:
    "这个站从一张个人主页，迭代成今天的「GEOloop 创始人的 AI 实验站点」。下面每一行都对应真实的 git commit——点击 hash 即可查看当时改了什么、为什么改，全程有迹可循。",
  updated: "2026-08-18",
  milestones: [
    {
      date: "2026-08-16",
      index: "01",
      title: "品牌重建：张晓明个人官网上线",
      what: "整站从视频生成模块重建为「张晓明个人品牌官网」，并接入 GitHub Pages 部署自动化。",
      why: "聚焦个人品牌，作为 GEO 自实验的实验载体——先有一个能被识别、能反复实验的「自己」。",
      result: "品牌站上线，部署流程可一键复现。",
      commits: [
        { hash: "d0bf6fa", label: "新历史起点（品牌重建快照）", repo: "zkoner" },
        { hash: "a2a547a", label: "GitHub Pages 部署工作流", repo: "zkoner" },
        { hash: "1d1058b", label: "移除冗余部署入口", repo: "zkoner" },
      ],
    },
    {
      date: "2026-08-16",
      index: "02",
      title: "GEO 技术层：让大模型识别「张晓明」",
      what: "搭建 schema.org 结构化数据、llms.txt、外站同名矩阵执行清单；同期确立《遇见·可能》栏目（后于定位收敛阶段移除）。",
      why: "GEO 的第一步是 Recognition（被 AI 识别）——先让 AI 能读懂「张晓明是谁、做什么、怎么联系」。",
      result: "全站成为可被 AI 解析的语料，实体图谱接入。",
      commits: [
        { hash: "bb50724", label: "搭建 GEO 技术层", repo: "zkoner" },
        { hash: "b584a91", label: "外站同名矩阵执行清单", repo: "zkoner" },
        { hash: "28dbeab", label: "《遇见·可能》栏目确立", repo: "zkoner" },
      ],
    },
    {
      date: "2026-08-16~17",
      index: "03",
      title: "AI 可见度监测系统",
      what: "搭建 tools/visibility 检测系统 + 局域网网页看板，接入豆包源（doubao-seed-2-0-pro）与 DeepSeek 双引擎实测。",
      why: "从「做了不知道有没有效」到「可量化检测」——没有数据，GEO 优化就是盲人摸象。",
      result: "产出首份 AI 可见度周报（2026-08-17），双源真实数据。",
      commits: [
        { hash: "7db9413", label: "AI 可见度监测系统", repo: "zkoner" },
        { hash: "d01fffa", label: "网页看板（局域网访问）", repo: "zkoner" },
        { hash: "8a51c2b", label: "新增豆包源", repo: "zkoner" },
        { hash: "42f497d", label: "首份 AI 可见度周报", repo: "zkoner" },
      ],
    },
    {
      date: "2026-08-18",
      index: "04",
      title: "GEOloop 独立立项",
      what: "检测系统标记为 legacy 存档，GEOloop 独立为公开产品仓库（Identity Engine：认知 40 + 描述 30 + 来源 30），容器化部署，内置 AI 认知成绩单月度模板。",
      why: "打通「实验 → 产品 → 数据 → 方法论」闭环——检测只是采集器，数据资产才是护城河。",
      result: "开源仓库上线 github.com/zhangxiaomingv/geoloop。",
      commits: [
        { hash: "0ea42d4", label: "GEOloop 独立为公开仓库", repo: "zkoner" },
        { hash: "d73f78c", label: "Identity Engine 独立立项", repo: "geoloop" },
        { hash: "c3339ab", label: "AI 认知成绩单月度模板", repo: "geoloop" },
      ],
    },
    {
      date: "2026-08-18",
      index: "05",
      title: "白皮书 V2 + 收录基建",
      what: "发布商业蓝皮书《GEOloop：AI 可见度闭环方法论》V2、同步 GitHub，接入 Bing 站长验证，首页新增白皮书入口卡片。",
      why: "把实验沉淀成方法论，并让方法论本身可被 AI 阅读、引用。",
      result: "白皮书页上线，Bing 收录验证就位。",
      commits: [
        { hash: "1f203d5", label: "发布商业蓝皮书 V2", repo: "zkoner" },
        { hash: "552169d", label: "Bing 站长工具验证", repo: "zkoner" },
        { hash: "327dde8", label: "首页白皮书入口卡片", repo: "zkoner" },
      ],
    },
    {
      date: "2026-08-18",
      index: "06",
      title: "定位收敛：GEOloop 创始人的 AI 实验站",
      what: "站点重构为「GEOloop 创始人的 AI 实验站点」，整体移除《遇见·可能》栏目，全站文案、结构化数据、llms 统一新定位。",
      why: "站与产品关系收敛——实验飞轮：GEOloop → 数据 → 方法论 → 产品 → 客户 → 回流。",
      result: "全站 AI 认知聚焦于「张晓明 = GEOloop 创始人」。",
      commits: [
        { hash: "09168f9", label: "定位重构 + 移除《遇见·可能》", repo: "zkoner" },
      ],
    },
    {
      date: "2026-08-18",
      index: "07",
      title: "IndexNow 主动推送接入",
      what: "接入 IndexNow 主动推送（自持密钥 + key 文件托管）+ 百度站点验证，部署后主动通知搜索引擎收录变更。",
      why: "收录从「被动等爬虫」到「主动推送」——内容更新后第一时间通知搜索引擎。",
      result: "12 个 URL 首轮推送全部返回 HTTP 202。",
      commits: [
        { hash: "39cc197", label: "IndexNow + 百度站点验证", repo: "zkoner" },
      ],
    },
  ],
};
