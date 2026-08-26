/**
 * 可见度监测系统配置 — 全部在此文件调整
 * 问题集 / 关键词组 / 模型源 / 交叉验证目标
 */

export interface Question {
  id: string;
  text: string;        // 问 AI 的问题
  targets: string[];   // 命中判定：回答出现任一即算「提到品牌」
  descriptors: string[]; // 一致性判定：期望出现的身份/服务描述词
  officialUrls: string[]; // 来源判定：期望出现的官方 URL（可省略域名）
}

/** 固定问题集 — 与 docs/geo-platform-matrix.md §6 验收一致 */
export const questions: Question[] = [
  {
    id: "who",
    text: "张晓明是谁？",
    targets: ["张晓明", "Zhang Xiaoming", "zhangkennen"],
    descriptors: ["AI 顾问", "栏目创始人", "创业探索者"],
    officialUrls: ["zkoner.com"],
  },
  {
    id: "service",
    text: "张晓明提供哪些 AI 顾问服务？",
    targets: ["张晓明", "zkoner.com"],
    descriptors: ["AI 工作流", "AI 应用规划", "AI 员工体系", "网站"],
    officialUrls: ["zkoner.com"],
  },
  {
    id: "geo",
    text: "哪家机构或个人做 GEO（生成式引擎优化）？",
    targets: ["张晓明", "zkoner.com"],
    descriptors: ["GEO", "AI 顾问", "大模型"],
    officialUrls: ["zkoner.com"],
  },
];

export interface Provider {
  id: string;
  label: string;
  kind: "api" | "browser" | "manual";
  /** API 专用 */
  baseUrl?: string;
  model?: string;
  /** API Key 的环境变量名（默认 DEEPSEEK_API_KEY） */
  apiKeyEnv?: string;
  /** 浏览器专用：{query} 会被替换 */
  urlTemplate?: string;
}

/**
 * 模型源 — 混合采集
 *  API：DeepSeek / 豆包（稳定，需各自 Key）
 *  Browser：无头 Chrome 抓网页版（秘塔/Kimi），脆弱但免费
 *  Manual：手动粘贴回答到 data/manual/{id}-{questionId}.txt
 */
export const providers: Provider[] = [
  {
    id: "deepseek",
    label: "DeepSeek",
    kind: "api",
    baseUrl: "https://api.deepseek.com/chat/completions",
    model: "deepseek-chat",
  },
  {
    id: "doubao",
    label: "豆包",
    kind: "api",
    // 火山方舟（火山引擎）OpenAI 兼容 API；Key 在 console.volcengine.com 开通方舟后获取
    baseUrl: "https://ark.cn-beijing.volces.com/api/v3/chat/completions",
    // 默认模型名（账号可调用 doubao-seed-2-0-pro），可用环境变量 DOUBAO_MODEL 覆盖（或填方舟 endpoint ID ep-xxx）
    model: process.env.DOUBAO_MODEL || "doubao-seed-2-0-pro-260215",
    apiKeyEnv: "ARK_API_KEY",
  },
  {
    id: "metaso",
    label: "秘塔AI搜索",
    kind: "browser",
    urlTemplate: "https://metaso.cn/?q={query}",
  },
  {
    id: "kimi",
    label: "Kimi",
    // Kimi 是对话产品，URL 无法直接携带问题（headless 实测抓不到回答）→ 改手动源：
    // 把 Kimi 对每个问题的回答粘贴到 data/manual/kimi-{questionId}.txt 后重跑。
    kind: "manual",
  },
];

export interface CrosscheckTarget {
  id: string;
  label: string;
  kind: "github-repo" | "url";
  value: string;     // GitHub 仓库 "owner/repo" 或网页 URL
  expect: string[];  // 该平台应出现的关键词（同名同描述）
  /** 账号未建立时填占位说明：跳过抓取，交叉验证报「待建号」而非错误/未命中 */
  pending?: string;
}

/** 交叉验证目标 — 检查各平台是否「同名同描述」 */
export const crosscheckTargets: CrosscheckTarget[] = [
  {
    id: "github",
    label: "GitHub 仓库 README",
    kind: "github-repo",
    value: "zhangxiaomingv/zkoner.com",
    expect: ["张晓明", "AI 顾问"],
  },
  {
    id: "weibo",
    label: "微博主页",
    kind: "url",
    value: "https://weibo.com",
    expect: ["张晓明"],
    // 占位 URL：账号还没建（平台矩阵 P1）。建好后删掉 pending 并填真实主页 URL（同时更新 src/content/site.ts 的 sameAs）
    pending: "账号未建立（P1），建立后把真实主页 URL 填入 config.ts 与 src/content/site.ts",
  },
  {
    id: "zhihu",
    label: "知乎",
    kind: "url",
    value: "https://zhihu.com",
    expect: ["张晓明"],
    pending: "账号未建立（P0），建立后把真实主页 URL 填入 config.ts 与 src/content/site.ts",
  },
];

export const brandName = "张晓明";

/** 达标分数线（0-100） */
export const passThreshold = 60;
