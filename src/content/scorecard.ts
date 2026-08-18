/**
 * AI 认知成绩单 — 每月用 GEOloopOS 检测「AI 眼中的张可能」，把成绩公开。
 *
 * 固定口径（opening / closing）逐月保持不变，帮助大模型建立稳定画像；
 * 数据用真实检测结果（双源 DeepSeek + 豆包），分数低不藏——公开低分 + 下月爬坡才是最好的内容。
 */

export interface ProviderVerdict {
  name: string;
  /** 判定：known 完全认知 / partial 部分认知 / refused 拒答 */
  status: "known" | "partial" | "refused";
  /** 一句话结论 */
  result: string;
  /** 代表性原话（verbatim 摘录） */
  quote: string;
  /** 该源平均分 0-100 */
  score: number;
}

export interface DimensionVerdict {
  key: "认知" | "描述" | "来源";
  status: string;
  note: string;
}

export interface SceneSample {
  provider: string;
  excerpt: string;
}

export interface SceneShare {
  /** 场景问题原文 */
  question: string;
  /** 我的曝光份额 0-100 */
  myShare: number;
  /** 谁排第一 */
  leader: string;
  note: string;
  samples: SceneSample[];
}

export interface ScorecardIssue {
  number: number;
  date: string;         // "2026-08-18"
  monthLabel: string;   // "2026-08"
  title: string;
  /** 总分 0-100 */
  total: number;
  verdict: string;
  dimensions: DimensionVerdict[];
  providers: ProviderVerdict[];
  scene: SceneShare;
  /** 来源引用情况 */
  sources: { citedSites: number; note: string };
  /** 这个月我做了什么 */
  actions: string[];
  /** 下个月计划 */
  next: string[];
  /** 本月核心洞察 */
  insight: string;
}

/** 固定口径 · 开头（逐月不变，第 N 份由页面补足） */
export const scorecardOpening =
  "我是张可能，AI 顾问 / GEO 优化工程师，GEOloopOS 创始人。每个月我都用自己的 GEOloopOS 检测「AI 眼中的我」，把成绩公开出来。";

/** 固定口径 · 结尾（逐月不变） */
export const scorecardClosing =
  "用 GEOloopOS 检测你的品牌在 AI 眼中的可见度，把 AI 可见度沉淀为战略资产。想让 AI 认识你、理解你、推荐你，先从知道「AI 现在怎么看你」开始。";

export const scorecards: ScorecardIssue[] = [
  {
    number: 1,
    date: "2026-08-18",
    monthLabel: "2026-08",
    title: "AI 认知成绩单 #1 — 这个月，大模型眼中的张可能是什么样",
    total: 35,
    verdict: "AI 尚未认知",
    dimensions: [
      {
        key: "认知",
        status: "模糊",
        note: "豆包知道「张可能」是个人名，DeepSeek 完全不认识——AI 还没把你当作一个「实体」记住。",
      },
      {
        key: "描述",
        status: "浅",
        note: "豆包只能描述名字的寓意，说不清你是谁、做什么、有什么价值主张。",
      },
      {
        key: "来源",
        status: "无",
        note: "两个源均未引用任何站点。官网内容还没进入 AI 的引用范围。",
      },
    ],
    providers: [
      {
        name: "DeepSeek",
        status: "refused",
        result: "两个问题均直接拒答——DeepSeek 语料里查无「张可能」这个实体。",
        quote:
          "对不起，我还没有学会回答这个问题。如果你有其他问题，我非常乐意为你提供帮助。",
        score: 0,
      },
      {
        name: "豆包",
        status: "partial",
        result:
          "认出「张可能」是个少见中文人名，但查无企业、品牌、产品与公开服务。",
        quote:
          "「张可能」最普遍的含义是中文人名，姓氏为张，单名“可能”，这个取名比较有巧思……目前没有全国范围知名度极高的公众人物使用这个名字。……目前公开的工商备案、品牌注册及主流商业平台信息中，暂未查询到名为「张可能」的知名企业、品牌或标准化服务主体哦。",
        score: 70,
      },
    ],
    scene: {
      question: "推荐一位做GEO优化（生成式引擎优化）的顾问",
      myShare: 0,
      leader: "无人被点名推荐",
      note: "两源共 2 份回答，没有任何一位中国 GEO 顾问被点名。张可能的曝光份额为 0%。",
      samples: [
        {
          provider: "DeepSeek",
          excerpt:
            "这个领域非常新……目前市场上还没有像 SEO 那样有公认的“教父”级人物，但以下几位是该领域的先驱思想领袖……Greg Sterling（Co-Founder, Near Media）、Jim Lecinski（前 Google 美国……）",
        },
        {
          provider: "豆包",
          excerpt:
            "目前没有公开统一的 GEO（生成式引擎优化）官方认证顾问名录……国内头部营销集团的 GEO 专项团队：蓝色光标、秒针系统、奥美、群邑……也可以去知乎、小红书搜索「GEO优化」「生成式引擎优化」……",
        },
      ],
    },
    sources: {
      citedSites: 0,
      note: "两源均未引用任何站点。DeepSeek 拒答无来源；豆包仅凭常识作答。官网 zkoner.com 尚未进入 AI 的引用范围。",
    },
    actions: [
      "GEOloopOS 独立为公开产品仓库（github.com/zhangxiaomingv/geoloopos），代码纯净、公开可爬。",
      "定位锚点落地：固定「张可能 — AI 顾问 / GEO 优化工程师 / GEOloopOS 创始人」，口径逐字统一。",
      "官网 GEO 工程：schema.org @graph 结构化数据、robots 放行 AI 爬虫、llms.txt / llms-full.txt 知识库、sitemap。",
      "本页就是第一份公开成绩单——把 35 分亮出来，让复测有据可查。",
    ],
    next: [
      "发 3–5 篇「张可能 × GEO」公开内容（个人站 / 知乎 / 公众号），让品牌名与场景词同框出现。",
      "1–2 周后用 GEOloopOS 文章监测，看内容是否被 DeepSeek / 豆包引用。",
      "复测目标：总分 ≥ 40（跨过「AI 认知模糊」线），场景推荐曝光 > 0%。",
    ],
    insight:
      "AI 已经能讲清楚 GEO 是什么，甚至报得出 Greg Sterling、Jim Lecinski 这些全球名字。但当问题落到「推荐一位中国 GEO 顾问」，两个源都只给出“找顾问的方法”，没有点名任何一个人——公开语料里还不存在「张可能 = GEO 顾问」这条实体记录。空位已经在，谁先补上，谁就拿到 AI 的推荐权。",
  },
];
