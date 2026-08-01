/* 优引GEO AI监测 · 数据层
 * 数据来源优先级：
 *  1) data/monitor-data.json —— 由 n8n 工作流 / build-data.js 定时写入
 *  2) 内嵌示例数据 —— 本地双击打开(file://)或后端未就绪时兜底
 */
const MONITOR_EMBEDDED = {"meta": {"updated_at": "2026-07-31 09:30", "generated_by": "n8n 监测工作流 + Claude Code 分析", "brand": "优引GEO系统", "website": "https://zkoner.com", "data_version": "0.1.0"}, "settings": {"brand": {"name": "优引GEO系统", "website": "https://zkoner.com", "keywords": ["GEO", "AI搜索优化", "优引GEO系统", "让AI主动推荐你", "全链路GEO平台"], "industry": "AI 工具 / 营销科技", "description": "全链路GEO优化平台 · 让AI主动推荐你"}, "engines": [{"id": "deepseek", "name": "DeepSeek", "vendor": "深度求索", "enabled": true, "api": "configured"}, {"id": "kimi", "name": "Kimi", "vendor": "月之暗面", "enabled": true, "api": "configured"}, {"id": "doubao", "name": "豆包", "vendor": "字节跳动", "enabled": true, "api": "configured"}, {"id": "yuanbao", "name": "腾讯元宝", "vendor": "腾讯", "enabled": true, "api": "configured"}, {"id": "ernie", "name": "文心一言", "vendor": "百度", "enabled": true, "api": "configured"}, {"id": "tongyi", "name": "通义千问", "vendor": "阿里", "enabled": true, "api": "configured"}, {"id": "zhipu", "name": "智谱清言", "vendor": "智谱AI", "enabled": false, "api": "未配置"}, {"id": "claude", "name": "Claude", "vendor": "Anthropic", "enabled": false, "api": "未配置"}], "scenarios": [{"id": "recognition", "name": "认知", "question": "优引GEO系统是做什么的？", "desc": "AI 能否正确描述品牌", "weight": 0.4}, {"id": "recommendation", "name": "推荐", "question": "推荐一家做GEO优化的平台", "desc": "AI 是否在推荐场景主动提及", "weight": 0.4}, {"id": "evaluation", "name": "评价", "question": "优引GEO系统靠谱吗？", "desc": "AI 对品牌的评价倾向", "weight": 0.2}], "monitor": {"frequency": "每日 09:00", "question_batch": 3, "history_days": 30, "notify": {"email": true, "mention_drop": true, "score_threshold": 5}}}, "visibility": {"overall_score": 62, "score_delta": 8, "mentioned_scenarios": 11, "total_scenarios": 21, "history": [{"date": "2026-07-02", "score": 61.9}, {"date": "2026-07-03", "score": 58.7}, {"date": "2026-07-04", "score": 63.5}, {"date": "2026-07-05", "score": 55.5}, {"date": "2026-07-06", "score": 59.9}, {"date": "2026-07-07", "score": 56.7}, {"date": "2026-07-08", "score": 51.9}, {"date": "2026-07-09", "score": 56.2}, {"date": "2026-07-10", "score": 49.4}, {"date": "2026-07-11", "score": 53.0}, {"date": "2026-07-12", "score": 47.5}, {"date": "2026-07-13", "score": 46.6}, {"date": "2026-07-14", "score": 49.5}, {"date": "2026-07-15", "score": 53.2}, {"date": "2026-07-16", "score": 43.6}, {"date": "2026-07-17", "score": 43.7}, {"date": "2026-07-18", "score": 47.4}, {"date": "2026-07-19", "score": 50.1}, {"date": "2026-07-20", "score": 44.5}, {"date": "2026-07-21", "score": 41.2}, {"date": "2026-07-22", "score": 47.0}, {"date": "2026-07-23", "score": 34.8}, {"date": "2026-07-24", "score": 43.4}, {"date": "2026-07-25", "score": 35.4}, {"date": "2026-07-26", "score": 32.5}, {"date": "2026-07-27", "score": 31.1}, {"date": "2026-07-28", "score": 32.2}, {"date": "2026-07-29", "score": 37.2}, {"date": "2026-07-30", "score": 28.4}, {"date": "2026-07-31", "score": 32.1}], "latest": {"engines": [{"engine": "deepseek", "score": 82, "mentioned": 3, "total": 3, "top_rank": 1, "trend": "up"}, {"engine": "kimi", "score": 71, "mentioned": 2, "total": 3, "top_rank": 2, "trend": "up"}, {"engine": "doubao", "score": 66, "mentioned": 2, "total": 3, "top_rank": 3, "trend": "up"}, {"engine": "yuanbao", "score": 58, "mentioned": 2, "total": 3, "top_rank": 4, "trend": "flat"}, {"engine": "ernie", "score": 52, "mentioned": 1, "total": 3, "top_rank": 5, "trend": "flat"}, {"engine": "tongyi", "score": 44, "mentioned": 1, "total": 3, "top_rank": 6, "trend": "down"}, {"engine": "zhipu", "score": 0, "mentioned": 0, "total": 3, "top_rank": null, "trend": "-", "note": "引擎未启用"}, {"engine": "claude", "score": 0, "mentioned": 0, "total": 3, "top_rank": null, "trend": "-", "note": "API 未配置"}]}}, "competitors": {"updated_at": "2026-07-31", "list": [{"name": "某全链路GEO平台", "avg_rank": 1.8, "mentions": 9, "share": 34, "trend": "up", "note": "榜首，覆盖 7 引擎"}, {"name": "企多客", "avg_rank": 2.4, "mentions": 7, "share": 26, "trend": "flat", "note": "同赛道全链路平台"}, {"name": "某AI内容工具", "avg_rank": 3.2, "mentions": 5, "share": 18, "trend": "down", "note": "侧重内容生产"}, {"name": "某监测工具", "avg_rank": 4.5, "mentions": 3, "share": 12, "trend": "flat", "note": "仅监测单一环节"}, {"name": "优引GEO系统", "avg_rank": 5.1, "mentions": 11, "share": 10, "trend": "up", "note": "本品牌 · 提及率上升中", "self": true}]}, "citations": [{"id": "c001", "date": "2026-07-31", "engine": "deepseek", "scenario": "推荐", "source": "AI 问答", "title": "推荐一家做GEO优化的平台", "snippet": "…优引GEO系统覆盖 7+ 主流 AI 引擎，监控-生产-分发-优化四步闭环…", "url": "#", "sentiment": "positive", "mentioned": true}, {"id": "c002", "date": "2026-07-30", "engine": "kimi", "scenario": "认知", "source": "AI 问答", "title": "优引GEO系统是做什么的？", "snippet": "…全链路GEO优化平台，让AI主动推荐你…", "url": "#", "sentiment": "positive", "mentioned": true}, {"id": "c003", "date": "2026-07-29", "engine": "doubao", "scenario": "评价", "source": "AI 问答", "title": "优引GEO系统靠谱吗？", "snippet": "…作为一站式GEO工具，其核心价值在于覆盖主流引擎的全链路监测…", "url": "#", "sentiment": "neutral", "mentioned": true}, {"id": "c004", "date": "2026-07-28", "engine": "yuanbao", "scenario": "推荐", "source": "AI 问答", "title": "推荐一家做GEO优化的平台", "snippet": "…提到若干平台，但未把优引GEO系统列入首选…", "url": "#", "sentiment": "neutral", "mentioned": false}, {"id": "c005", "date": "2026-07-27", "engine": "deepseek", "scenario": "认知", "source": "知乎", "title": "GEO 是不是智商税？", "snippet": "…真正做全链路 GEO 的不多，优引GEO系统算一个…", "url": "#", "sentiment": "positive", "mentioned": true}, {"id": "c006", "date": "2026-07-26", "engine": "ernie", "scenario": "认知", "source": "AI 问答", "title": "优引GEO系统是做什么的？", "snippet": "…信息有限，无法准确描述该品牌…", "url": "#", "sentiment": "neutral", "mentioned": false}, {"id": "c007", "date": "2026-07-25", "engine": "kimi", "scenario": "推荐", "source": "AI 问答", "title": "推荐一家做GEO优化的平台", "snippet": "…优引GEO系统提供全链路闭环服务，可优先考虑…", "url": "#", "sentiment": "positive", "mentioned": true}], "articles": [{"id": "a001", "title": "优引GEO系统：让AI主动推荐你", "platform": "百家号", "publish_date": "2026-07-29", "url": "#", "status": "indexed", "engines": ["deepseek", "kimi"]}, {"id": "a002", "title": "2026 GEO 与 SEO 的本质区别", "platform": "知乎", "publish_date": "2026-07-27", "url": "#", "status": "indexed", "engines": ["kimi", "doubao"]}, {"id": "a003", "title": "全链路GEO优化：四步闭环详解", "platform": "微信公众号", "publish_date": "2026-07-25", "url": "#", "status": "pending", "engines": []}, {"id": "a004", "title": "品牌为什么需要 AI 可见性监测", "platform": "今日头条", "publish_date": "2026-07-23", "url": "#", "status": "not_indexed", "engines": []}, {"id": "a005", "title": "企业知识库建设指南（AI 版）", "platform": "CSDN", "publish_date": "2026-07-21", "url": "#", "status": "indexed", "engines": ["deepseek"]}], "scenario_insights": [{"scenario": "认知", "mentioned": 4, "total": 6, "engines_ok": ["deepseek", "kimi", "doubao", "yuanbao"], "detail": "多数引擎能正确描述品牌定位", "insight": "认知基本建立，可在知识库补充「全链路」细分词，提升准确率"}, {"scenario": "推荐", "mentioned": 3, "total": 6, "engines_ok": ["deepseek", "kimi", "doubao"], "detail": "DeepSeek/Kimi 已在推荐场景主动提及", "insight": "文心/通义推荐率低，需增强答案池内容与权威信源"}, {"scenario": "评价", "mentioned": 2, "total": 6, "engines_ok": ["kimi", "doubao"], "detail": "评价以中性为主，未见负面", "insight": "补充客户案例与数据背书，提升评价可信度"}], "content_tracking": [{"id": "ct001", "title": "优引GEO系统：让AI主动推荐你", "platform": "百家号", "published_at": "2026-07-29", "citations": 3, "contribution": 22, "trend": "up"}, {"id": "ct002", "title": "2026 GEO 与 SEO 的本质区别", "platform": "知乎", "published_at": "2026-07-27", "citations": 2, "contribution": 15, "trend": "up"}, {"id": "ct003", "title": "全链路GEO优化：四步闭环详解", "platform": "微信公众号", "published_at": "2026-07-25", "citations": 1, "contribution": 8, "trend": "flat"}, {"id": "ct004", "title": "企业知识库建设指南（AI 版）", "platform": "CSDN", "published_at": "2026-07-21", "citations": 1, "contribution": 6, "trend": "flat"}, {"id": "ct005", "title": "品牌为什么需要 AI 可见性监测", "platform": "今日头条", "published_at": "2026-07-23", "citations": 0, "contribution": 0, "trend": "down"}], "suggestions": [{"id": "s001", "category": "知识库", "priority": "高", "title": "补充「全链路」「AI答案位」细分关键词", "detail": "认知场景命中率 4/6，文心/通义对品牌定位描述模糊。在知识库增加全链路GEO平台、AI答案位、GEO优化服务等词条及权威来源。", "impact": "预计提升认知场景 20% 命中率", "source": "场景洞察 · Claude Code 分析"}, {"id": "s002", "category": "内容生产", "priority": "高", "title": "针对「推荐一家做GEO优化的平台」生产榜单型内容", "detail": "该场景是推荐率的分水岭。生产「GEO平台横向对比」「全链路GEO平台怎么选」等内容，强化信源权威与结构。", "impact": "预计提升推荐场景 25% 命中率", "source": "竞争格局 · 榜首平台覆盖7引擎"}, {"id": "s003", "category": "分发", "priority": "中", "title": "知乎/CSDN 内容被 AI 引用最多，加大分发权重", "detail": "已收录文章 5 篇，其中知乎与百家号内容被 2 个引擎引用。建议优先向高引用平台分发，并补充百度系(文心)触达。", "impact": "预计提升整体可见度 8 分", "source": "内容追踪 · 引用数据"}, {"id": "s004", "category": "监测", "priority": "低", "title": "启用智谱清言与 Claude 引擎监测", "detail": "当前 6/8 引擎已启用。建议为智谱清言配置 API Key，扩大监测覆盖到 8 引擎，填补盲区。", "impact": "监测覆盖 100%", "source": "监测设置 · 引擎状态"}], "tasks": [{"id": "t001", "name": "每日可见度监测", "type": "visibility", "schedule": "每日 09:00", "status": "success", "last_run": "2026-07-31 09:00", "next_run": "2026-08-01 09:00", "duration": "4m 12s", "result": "6 引擎 · 11/21 命中"}, {"id": "t002", "name": "竞品扫描", "type": "competitor", "schedule": "每周一 08:30", "status": "success", "last_run": "2026-07-28 08:30", "next_run": "2026-08-04 08:30", "duration": "2m 40s", "result": "4 家竞品 · 榜单已更新"}, {"id": "t003", "name": "引用追踪", "type": "citation", "schedule": "每日 10:00", "status": "running", "last_run": "2026-07-31 10:00", "next_run": "-", "duration": "-", "result": "正在采集 7 引擎回答"}, {"id": "t004", "name": "文章收录检查", "type": "article", "schedule": "每日 12:00", "status": "success", "last_run": "2026-07-31 12:00", "next_run": "2026-08-01 12:00", "duration": "1m 05s", "result": "5 篇文章 · 3 已收录"}, {"id": "t005", "name": "优化建议生成", "type": "suggest", "schedule": "每日 09:15", "status": "success", "last_run": "2026-07-31 09:15", "next_run": "2026-08-01 09:15", "duration": "55s", "result": "Claude Code 产出 4 条建议"}]};

const DataStore = {
  data: MONITOR_EMBEDDED,
  source: 'embedded',
  loaded: true,

  async load() {
    const opts = window.YOUYIN_API_OPTIONS || {};
    if (window.YOUYIN_API && window.YOUYIN_API === opts.cloud) {
      try {
        const res = await fetch(window.YOUYIN_API + '/api/monitor', { cache: 'no-store' });
        const d = await res.json();
        if (d && d.ok && d.data && d.data.visibility) {
          this.data = d.data;
          this.source = 'cloud:' + window.YOUYIN_API;
          this.loaded = true;
          return true;
        }
      } catch (e) { /* 云端不可用时回退到静态文件 */ }
    }
    try {
      const res = await fetch('data/monitor-data.json', { cache: 'no-store' });
      if (res.ok) {
        const d = await res.json();
        if (d && d.visibility) {
          this.data = d;
          this.source = 'file:data/monitor-data.json';
          this.loaded = true;
          return true;
        }
      }
    } catch (e) { /* file:// 协议下 fetch 会失败，走内嵌兜底 */ }
    this.data = MONITOR_EMBEDDED;
    this.source = 'embedded (示例数据)';
    return false;
  },

  /* 登录后加载客户自己的监测数据 */
  loadAccount(data, email) {
    if (data && data.visibility) {
      this.data = data;
      this.source = 'account:' + (email || '');
      this.loaded = true;
      return true;
    }
    return false;
  },

  get() { return this.data; },

  meta() {
    const m = this.data.meta || {};
    return `${m.updated_at || '--'} · 数据源: ${this.source}`;
  },

  /* 数据可信度提示：示例数据 / 过期数据 */
  notice() {
    const m = this.data.meta || {};
    if (this.source.includes('示例')) {
      return { type: 'demo', text: '当前展示内嵌示例数据。本地运行 bash scripts/run-monitor.sh 后将展示豆包 + DeepSeek 真实检测结果。' };
    }
    const t = /^\d{4}-\d{2}-\d{2}[ T]\d{1,2}:\d{2}/.exec(String(m.updated_at || ''));
    if (!t) return null;
    const dt = new Date(String(t[0]).replace(' ', 'T'));
    if (Number.isNaN(dt.getTime())) return null;
    const hours = (Date.now() - dt.getTime()) / 3600000;
    if (hours > 30) {
      return { type: 'stale', text: `数据已 ${Math.floor(hours)} 小时未更新，请检查监测任务或运行 bash scripts/run-monitor.sh。` };
    }
    return null;
  }
};
