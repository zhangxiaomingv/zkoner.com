/**
 * zkoner FAQ Knowledge Base
 * Used by the chat widget for client-side FAQ matching
 */
const ZKONER_FAQ = [
  {
    id: "geo-definition",
    category: "GEO",
    question: "什么是 GEO（Generative Engine Optimization）？",
    keywords: ["GEO", "什么是GEO", "Generative Engine", "生成引擎优化", "定义", "是什么"],
    answer: "GEO 是帮助企业在大模型（如 ChatGPT、Claude、DeepSeek 等）的搜索结果中获得更高可见度和推荐率的优化体系。包括结构化数据建设、AI 友好内容策略和知识图谱构建。与 SEO 优化传统搜索引擎不同，GEO 优化的是大语言模型的语义理解和推荐逻辑。"
  },
  {
    id: "geo-vs-seo",
    category: "GEO",
    question: "GEO 和 SEO 有什么区别？",
    keywords: ["GEO vs SEO", "区别", "SEO", "不同", "比较"],
    answer: "SEO 优化的是搜索引擎（如 Google、Bing）的排名算法，核心是关键词、外链、页面技术指标。GEO 优化的是大语言模型的语义理解和推荐逻辑，核心是结构化知识、实体关系、信息可信度和权威性。两者互补，但目标和技术路径不同。SEO 侧重于让页面被搜到，GEO 侧重于让品牌被 AI 理解和推荐。"
  },
  {
    id: "geo-timeline",
    category: "GEO",
    question: "GEO 需要多长时间才能看到效果？",
    keywords: ["多久", "时间", "效果", "周期", "见效", "什么时候"],
    answer: "基础结构化数据部署后，AI 搜索可见度的改善通常在 2-4 周内开始显现。但完整的知识体系构建和 AI 品牌认知建立需要持续投入，一般 3-6 个月可以达到显著效果。GEO 是持续优化的过程，而非一次性项目。"
  },
  {
    id: "geo-suitable",
    category: "GEO",
    question: "GEO 适合哪些类型的网站或企业？",
    keywords: ["适合", "类型", "企业", "网站", "适用", "哪些"],
    answer: "任何希望在 AI 搜索结果中被发现和被推荐的网站都能从 GEO 受益。尤其适合：内容型网站（博客、媒体、文档站点）、知识密集型企业（咨询、教育、SaaS）、本地服务商（需要被 AI 推荐为可信来源）、电商平台（产品信息结构化）。B2B 企业受益尤为明显。"
  },
  {
    id: "geo-monitor",
    category: "GEO",
    question: "如何监测我的 AI 可见度？",
    keywords: ["监测", "可见度", "检测", "追踪", "查看效果"],
    answer: "监测 AI 可见度需要多维度方法：AI 对话测试（在 ChatGPT、Claude、DeepSeek 等平台测试品牌相关查询）、结构化数据验证（使用 Google Rich Results Test、Schema.org Validator）、引用跟踪（监测 AI 输出中品牌名称和链接的出现频率）、竞争对比（与同行业品牌的 AI 可见度横向对比）。优引GEO系统 提供 AI 可见度监测服务。"
  },
  {
    id: "ai-ready-definition",
    category: "AI Ready Website",
    question: "一个 'AI Ready' 的网站应该具备什么？",
    keywords: ["AI Ready", "网站准备", "AI友好", "需要什么", "具备", "结构"],
    answer: "清晰的语义化 HTML 结构、完整的 Schema.org 结构化数据（如 Organization、Article、FAQPage 等）、标准化的 FAQ 体系、开放的机器可读接口（如 API、llms.txt、robots.txt 优化）、持续更新的内容管线，以及定期的 AI 可见度监测。AI Ready 的网站应该让 AI 爬虫像读数据库一样理解网站内容。"
  },
  {
    id: "schema-importance",
    category: "AI Ready Website",
    question: "Schema.org 结构化数据对 GEO 有多重要？",
    keywords: ["Schema.org", "结构化数据", "Schema", "重要性", "JSON-LD"],
    answer: "Schema.org 结构化数据是 GEO 的基石。它为 AI 提供了理解网站内容的明确框架，包括实体类型、属性、关系等。没有结构化数据，AI 只能通过自然语言推测你的内容含义。Google、Bing 等搜索引擎以及主流大模型都明确支持 Schema.org 数据。完整且准确的 Schema 标记是获得 AI 推荐的必要条件。"
  },
  {
    id: "technical-requirement",
    category: "AI Ready Website",
    question: "我需要技术背景才能开始 GEO 吗？",
    keywords: ["技术", "门槛", "难吗", "不会代码", "非技术", "入门"],
    answer: "基础层面的 GEO 优化（如内容结构调整、FAQ 建设）不需要深入技术背景。但完整的 GEO 体系建设涉及结构化数据、知识图谱、自动化管线等技术组件，建议与技术团队协作或委托专业服务。优引GEO系统的内容和工具旨在降低技术门槛，让非技术人员也能理解并参与。"
  },
  {
    id: "automation-geo",
    category: "AI Automation",
    question: "AI Automation 如何与 GEO 协同工作？",
    keywords: ["自动化", "AI Automation", "协同", "配合", "工作流"],
    answer: "AI Automation 为 GEO 提供持续维护的能力。通过 n8n 等自动化平台，可以定时生成 AI 友好内容、自动更新结构化数据、监测 AI 对话中品牌的提及率和情感倾向、自动提交站点更新通知。自动化让 GEO 从一个静态项目变成一个持续运转的系统。"
  },
  {
    id: "n8n-role",
    category: "AI Automation",
    question: "n8n 在 AI 自动化生态中扮演什么角色？",
    keywords: ["n8n", "角色", "功能", "用途", "自动化平台", "工作流"],
    answer: "n8n 是一个开源的工作流自动化平台，在 AI 自动化生态中充当连接器角色。它可以连接 400+ 应用和服务，编排 AI Agent 的行为，构建内容管线、数据同步、监测告警等自动化流程。优引GEO系统使用 n8n 构建了多个 GEO 自动化工流，包括每日内容生成、AI 可见度监测、多渠道分发等。"
  },
  {
    id: "ai-growth",
    category: "AI Growth",
    question: "AI Growth 包含哪些具体内容？",
    keywords: ["AI Growth", "增长", "服务内容", "包含", "具体"],
    answer: "AI Growth 是指在 AI 主导的信息分发环境中实现持续增长的系统方法。内容包括：AI 可见度监测与优化、AI 友好内容策略与常态化产出、知识图谱建设与维护、多渠道 AI 引用策略、用户 AI 交互行为分析、基于 AI 反馈的迭代优化机制。核心是构建一个能被 AI 持续发现、理解和推荐的品牌知识体系。"
  },
  {
    id: "knowledge-base",
    category: "Knowledge Base",
    question: "什么是 Knowledge Base？优引GEO系统的知识库有什么特点？",
    keywords: ["知识库", "Knowledge Base", "特点", "内容"],
    answer: "Knowledge Base（知识库）是结构化的、机器可读的知识集合。优引GEO系统的知识库以 AI 可见性为核心，涵盖 GEO 概念、Schema.org 类型参考、n8n 工作流模式、AI 爬虫行为分析等内容。特点包括：持续更新、附带实战案例、有直接的代码和配置示例、与 zkoner-workflows 开源项目关联，确保内容可验证、可复用。"
  },
  {
    id: "resources",
    category: "Resources",
    question: "优引GEO系统的资源包含哪些类型？",
    keywords: ["资源", "Resources", "模板", "工具", "免费"],
    answer: "Resources 板块提供可直接使用的工具和模板，包括：GEO 自检清单（AI 可见度审计模板）、结构化数据 Schema 生成器与代码片段、n8n 工作流模板（可导入直接使用）、AI 内容策略画布、llms.txt 配置参考、AI 可见度监测模板等。全部资源免费开放，持续更新。"
  },
  {
    id: "pricing",
    category: "Pricing & Contact",
    question: "优引GEO系统提供哪些服务？如何定价？",
    keywords: ["价格", "收费", "服务", "多少钱", "定价", "报价", "咨询"],
    answer: "优引GEO系统提供三类服务：AI 可见度诊断与咨询（包含 GEO 审计、结构化数据分析、优化方案）、AI 自动化系统建设（基于 n8n 的内容管线与监测系统）、AI 增长体系设计与实施。定价按项目范围和工作量定制，初次咨询免费。详细需求请通过 /contact/ 页面联系。"
  }
];

/**
 * Match a user question against FAQ knowledge base
 * Uses keyword matching + scoring
 */
function matchFAQ(userQuestion) {
  const q = userQuestion.toLowerCase().trim();

  // Score each FAQ item
  const scored = ZKONER_FAQ.map(item => {
    let score = 0;

    // Check keywords
    item.keywords.forEach(kw => {
      if (q.includes(kw.toLowerCase())) {
        score += 10;
      }
    });

    // Check question text for word overlap
    const qWords = q.split(/[\s，。！？、,.\s!?]+/).filter(w => w.length > 1);
    const faqWords = item.question.toLowerCase().split(/[\s，。！？、,.\s!?]+/);

    qWords.forEach(w => {
      if (faqWords.some(fw => fw.includes(w) || w.includes(fw))) {
        score += 3;
      }
      // Check answer text too
      if (item.answer.toLowerCase().includes(w)) {
        score += 1;
      }
    });

    return { ...item, score };
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Return best match if score > threshold
  if (scored[0].score >= 8) {
    return scored[0];
  }

  return null;
}
