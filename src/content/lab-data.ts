/**
 * 自我实验 · 实验数据（AI 可见度实测）
 * GEOloop 检测引擎的双源（DeepSeek + 豆包）实测快照。
 * 数据来自 ~/geoloop/data/checks.jsonl，本文件是发布到 zkoner.com 的快照，
 * 复测后更新这里即重新部署。完整白皮书数据包见 docs/whitepaper-data.md。
 */

export interface LabDimension {
  name: string;
  weight: number;
  note: string;
}

export interface LabRow {
  name: string;
  kind: "企业品牌" | "个人品牌" | "网站" | "行业术语" | "决策场景";
  deepseek: number;
  doubao: number;
  score: number;
  verdict: string;
  note: string;
}

export interface LabFinding {
  title: string;
  text: string;
}

export const labExperiment = {
  engine: "GEOloop Identity Engine",
  providers: ["DeepSeek", "豆包"],
  date: "2026-08-16 ~ 2026-08-18",
  datePublished: "2026-08-18",

  /** 三维度评分 */
  dimensions: [
    { name: "认知", weight: 40, note: "AI 是否提到了被检测实体" },
    { name: "描述", weight: 30, note: "AI 的描述是否准确（与官方口径一致性）" },
    { name: "来源", weight: 30, note: "AI 是否引用了具体来源（官网 / 公开内容）" },
  ] as LabDimension[],

  /** 判定档位 */
  bands: [
    { range: "0–39", label: "AI 尚未认知" },
    { range: "40–69", label: "AI 回答质量较低" },
    { range: "70–99", label: "AI 有基础认知" },
    { range: "100", label: "AI 充分认知" },
  ],

  /** 实测数据（按总分降序） */
  rows: [
    {
      name: "海底捞",
      kind: "企业品牌",
      deepseek: 70,
      doubao: 70,
      score: 70,
      verdict: "AI 有基础认知",
      note: "4 次复测稳定 70，但从不引用来源",
    },
    {
      name: "张晓明",
      kind: "个人品牌",
      deepseek: 0,
      doubao: 70,
      score: 35,
      verdict: "AI 尚未认知",
      note: "DeepSeek 拒答；豆包仅当作「中文人名」",
    },
    {
      name: "什么是GEO？",
      kind: "行业术语",
      deepseek: 30,
      doubao: 30,
      score: 30,
      verdict: "AI 回答质量较低",
      note: "术语分裂：DeepSeek=生成式引擎优化，豆包=地理定位优化",
    },
    {
      name: "推荐一位做GEO优化的顾问",
      kind: "决策场景",
      deepseek: 30,
      doubao: 30,
      score: 30,
      verdict: "AI 回答质量较低",
      note: "无任何顾问被推荐，张晓明曝光 0%",
    },
    {
      name: "zkoner.com",
      kind: "网站",
      deepseek: 0,
      doubao: 35,
      score: 18,
      verdict: "AI 尚未认知",
      note: "引用追踪 cited=false，从未被引用为来源",
    },
  ] as LabRow[],

  /** 六大发现 */
  findings: [
    {
      title: "大牌只有「基础认知」，满分遥不可及",
      text: "海底捞稳定 70/100，卡在「来源不引用」。被 AI 知道 ≠ 被 AI 引用。",
    },
    {
      title: "个人品牌是 AI 盲区",
      text: "张晓明 35、zkoner.com 18。DeepSeek 对不知名实体直接拒答，豆包只当「中文人名」。有官网有内容，AI 也未必认识你。",
    },
    {
      title: "名字被提到 ≠ 实体被绑定",
      text: "豆包把 zkoner.com 认成「疑似钓鱼网站」、把张晓明认成「普通中文人名」。Entity Misbinding：名字存在，实体错位。",
    },
    {
      title: "GEO 术语在 AI 眼里是分裂的",
      text: "同一个词：DeepSeek = 生成式引擎优化，豆包 = 地理定位优化。行业没有共识，教育 AI 是 GEO 服务商的第一步。",
    },
    {
      title: "高价值决策场景 0 曝光",
      text: "「推荐一位做GEO优化的顾问」——模型能描述场景，却不推荐任何顾问，张晓明曝光 0%。",
    },
    {
      title: "来源引用是全行业的共同空白",
      text: "本批 5 个实体、18 条问答，0 个来源引用。成为「AI 的引用来源」是下一波竞争的唯一入场券。",
    },
  ] as LabFinding[],
} as const;
