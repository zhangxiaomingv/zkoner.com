/* 优引GEO AI监测控制台 · 主应用 */
(() => {
  'use strict';

  /* ═══ 菜单结构（仅监测与监控系统）═══ */
  const MENU = [
    { group: '诊断', items: [
      { id: 'diagnose', label: 'GEO 诊断', icon: '🔬' },
    ]},
    { group: 'AI监测', items: [
      { id: 'overview',       label: '总览',        icon: '◈' },
      { id: 'visibility',     label: '品牌可见度',  icon: '◎' },
      { id: 'competitors',    label: '竞争格局',    icon: '⚔' },
      { id: 'citations',      label: '引用追踪',    icon: '✎' },
      { id: 'articles',       label: '文章收录',    icon: '▤' },
      { id: 'scenarios',      label: '场景洞察',    icon: '❖' },
      { id: 'content',        label: '内容追踪',    icon: '≡' },
      { id: 'suggestions',    label: '优化建议',    icon: '✦' },
      { id: 'tasks',          label: '监测任务',    icon: '▶' },
    ]},
    { group: '内容生产', items: [
      { id: 'ai-create',      label: 'AI 创作',     icon: '✦' },
      { id: 'batch-generate', label: '批量生成',    icon: '▦' },
      { id: 'art-manage',     label: '文章管理',    icon: '☰' },
      { id: 'traffic-clone',  label: '流量复刻',    icon: '↻' },
      { id: 'keywords',       label: '关键词库',    icon: '⌕' },
      { id: 'titles',         label: '标题库',      icon: '❝' },
      { id: 'images',         label: '图片库',      icon: '▧' },
      { id: 'knowledge',      label: '知识库',      icon: '▣' },
      { id: 'url-import',     label: 'URL 导入',    icon: '⇣' },
      { id: 'dist-manage',    label: '分发管理',    icon: '⇶' },
      { id: 'media-accounts', label: '媒体账号',    icon: '✉' },
      { id: 'dist-nodes',     label: '分发节点',    icon: '⌬' },
      { id: 'dist-logs',      label: '分发日志',    icon: '≡' },
    ]},
    { group: '设置', items: [
      { id: 'brand',          label: '品牌设置',    icon: '♛' },
      { id: 'scenario-cfg',   label: '场景管理',    icon: '❏' },
      { id: 'monitor-cfg',    label: '监测设置',    icon: '⚙' },
    ]},
    { group: '优化闭环', items: [
      { id: 'flywheel',       label: '优化闭环',    icon: '◉' },
    ]},
  ];

  const NAV_TITLES = {};
  MENU.forEach(g => g.items.forEach(i => { NAV_TITLES[i.id] = { label: i.label, group: g.group }; }));

  const D = () => DataStore.get();
  const { esc, toast, badge, statusBadge, pbar, lineChart, hbarChart, donutChart, radarChart, empty, loading, SERIES } = UI;

  function dataNoticeHtml() {
    const n = DataStore.notice();
    if (!n) return '';
    const color = n.type === 'demo' ? 'var(--amber)' : 'var(--red)';
    return `<div style="margin:14px 0;font-size:.78rem;color:${color};border:1px solid ${color}33;background:${color}0d;padding:10px 14px;border-radius:8px">⚠ ${esc(n.text)}</div>`;
  }

  /* ═══ 持久化设置覆盖 ═══ */
  const LS_KEY = 'youyin-console-settings';
  let overlay = null;
  function loadOverlay() {
    try { overlay = JSON.parse(localStorage.getItem(LS_KEY) || 'null'); } catch (e) { overlay = null; }
  }
  function saveOverlay() {
    localStorage.setItem(LS_KEY, JSON.stringify(overlay || {}));
  }
  function effSettings() {
    const s = D().settings || {};
    if (!overlay) return s;
    return JSON.parse(JSON.stringify({ ...s, ...overlay, brand: { ...s.brand, ...(overlay.brand || {}) } }));
  }

  /* ═══ 侧边栏 ═══ */
  function renderSidebar(activeId) {
    const nav = document.getElementById('sideNav');
    nav.innerHTML = MENU.map(g => `
      <div class="nav-group">
        <div class="nav-group-title">${esc(g.group)}</div>
        ${g.items.map(i => `
          <div class="nav-item ${i.id === activeId ? 'active' : ''}" data-nav="${i.id}">
            <span class="nav-icon">${i.icon}</span><span>${esc(i.label)}</span>
          </div>`).join('')}
      </div>`).join('');
    nav.querySelectorAll('[data-nav]').forEach(n => n.addEventListener('click', () => {
      go(n.dataset.nav);
      document.getElementById('sidebar').classList.remove('open');
      document.getElementById('scrim').classList.remove('show');
    }));
  }

  /* ═══ 路由 ═══ */
  function parseHash() {
    const h = location.hash.replace(/^#\/?/, '').split('?')[0];
    return NAV_TITLES[h] ? h : 'overview';
  }
  function go(id) {
    location.hash = '#/' + id;
  }
  function render() {
    const id = parseHash();
    // #/diagnose?demo=1 → 直接展示内嵌示例报告（线上演示用）
    if (id === 'diagnose' && location.hash.includes('?demo') && window.DEMO_REPORT) {
      diagState.report = window.DEMO_REPORT;
      diagState.mode = 'result';
    }
    renderSidebar(id);
    const t = NAV_TITLES[id];
    document.getElementById('crumb').innerHTML = `${esc(t.group)} <span style="color:#636380">/</span> <b>${esc(t.label)}</b>`;
    const content = document.getElementById('content');
    const views = { diagnose, overview, visibility, competitors, citations, articles, scenarios, contentView, suggestions, tasks, brand, scenarioCfg, monitorCfg, aiCreate, batchGenerate, artManage, trafficClone, keywordsView, titlesView, imagesView, knowledgeView, urlImportView, distManage, mediaAccounts, distNodes, distLogs, flywheel };
    (views[id] || overview)(content);
    window.scrollTo(0, 0);
  }

  /* ═══ 页面头 ═══ */
  function pageHead(title, sub, actions = '') {
    return `<div class="page-head">
      <h1>${esc(title)}</h1>
      <p>${esc(sub)}</p>
      ${actions ? `<div class="sub-actions">${actions}</div>` : ''}
    </div>`;
  }

  /* ═══ 诊断：本地 API 客户端 ═══ */
  const DIAG_API = window.YOUYIN_API || 'http://localhost:8788';
  async function diagFetch(path, opts, timeout) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeout || 20000);
    const headers = { ...(opts.headers || {}) };
    if (window.Account && Account.token) headers.Authorization = 'Bearer ' + Account.token;
    try {
      const res = await fetch(DIAG_API + path, { ...opts, headers, signal: ctrl.signal });
      clearTimeout(t);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return await res.json();
    } catch (e) { clearTimeout(t); throw e; }
  }
  const diagState = { mode: 'input', report: null, engineOk: null };

  /* ═══ 视图：GEO 诊断 ═══ */
  function diagnose(c) {
    if (diagState.mode === 'result' && diagState.report) return renderDiagResult(c, diagState.report);
    if (diagState.mode === 'loading') { c.innerHTML = pageHead('GEO 诊断', '正在对目标网站进行深度诊断…') + loading(); return; }
    const note = diagState.engineOk === false
      ? '<div style="margin-top:14px;font-size:.78rem;color:var(--amber);border:1px solid rgba(245,158,11,.3);background:rgba(245,158,11,.06);padding:10px 14px;border-radius:8px">⚠ 本地诊断服务未启动，将展示示例报告。运行 <span class="mono">node scripts/diag-server.js</span> 后即可对任意网址真实诊断。</div>'
      : '<div style="margin-top:14px;font-size:.78rem;color:var(--text-3)">诊断引擎本地运行（豆包 + DeepSeek 实测收录 + Claude Code 评估）。输入任意网址/品牌名即可出报告。</div>';
    c.innerHTML = `
      ${pageHead('GEO 诊断', '输入网址 / 品牌名 → 7 维 GEO 诊断得分与图谱')}
      <div class="card">
        <div class="card-head"><h3>开始诊断</h3><span class="hint">基于 GEO 底层原理 · 豆包 + DeepSeek 收录实测</span></div>
        <div class="card-body">
          <div class="form-grid">
            <div class="form-group full"><label>网站地址 <span class="req">*</span></label><input id="dg-url" type="url" placeholder="https://你的网站.com" value="https://zkoner.com"></div>
            <div class="form-group full"><label>品牌名</label><input id="dg-brand" type="text" placeholder="留空则用域名" value="优引GEO系统"></div>
          </div>
          <div style="margin-top:16px"><button class="btn btn-primary" data-action="diag-start">🔬 立即诊断</button></div>
          ${note}
        </div>
      </div>
      <div class="card">
        <div class="card-head"><h3>诊断维度（7 项）</h3></div>
        <div class="card-body">
          <div class="grid-3">
            ${['可引用性（AI 是否容易摘取答案）','权威与信源（E-E-A-T / 外链背书）','结构化数据（Schema / JSON-LD）','内容深度覆盖（主题与质量）','技术基础（可爬取 / 性能）','实体一致性（品牌跨网一致）','AI 收录（豆包 + DeepSeek 实测）'].map((t, i) => `
              <div class="mention-item"><div class="mi-head"><span class="mi-src">${i + 1}. ${esc(t.split('（')[0])}</span></div><div class="mi-text" style="color:var(--text-3)">${esc(t.split('（')[1]?.replace('）', '') || '')}</div></div>`).join('')}
          </div>
        </div>
      </div>`;
  }

  function renderDiagResult(c, report) {
    const dims = report.dimensions || [];
    const radar = report.radar || dims.map(d => ({ axis: d.name, value: d.score }));
    const idx = report.indexing || {};
    const engNames = { doubao: '豆包', deepseek: 'DeepSeek' };
    const scNames = { recognition: '认知', recommendation: '推荐', evaluation: '评价' };
    const gradeColor = { A: 'green', B: 'green', C: 'amber', D: 'amber', E: 'red' }[report.overall.grade] || '';
    const dimRows = dims.map(d => `
      <div class="mention-item">
        <div class="mi-head">
          <span class="mi-src">${esc(d.name)}</span>
          <span style="margin-left:auto;font-family:monospace;color:var(--accent);font-weight:700">${d.score}</span>
        </div>
        <div style="margin:8px 0 6px">${pbar(d.score, d.score >= 70 ? 'green' : d.score >= 45 ? '' : 'pink')}</div>
        <div class="mi-text" style="color:var(--text-2)">${esc(d.summary || '')}</div>
        ${d.note ? `<div style="font-size:.72rem;color:var(--amber);margin-top:4px">${esc(d.note)}</div>` : ''}
        ${(d.evidence || []).length ? `<div style="font-size:.72rem;color:var(--text-3);margin-top:6px">依据：${d.evidence.slice(0, 2).map(e => esc(String(e).slice(0, 80))).join(' · ')}</div>` : ''}
      </div>`).join('');

    // 收录明细
    let idxCards = '<div class="empty">未获取收录数据</div>';
    if (idx && Object.keys(idx).length) {
      idxCards = Object.entries(idx).map(([eng, r]) => {
        const qs = Object.values(r.questions || {});
        const cells = qs.map(q => {
          if (q.apiError) return `<span class="badge amber">未配置</span>`;
          return q.mentioned ? badge('已收录', 'green') : badge('未收录', 'red');
        }).join(' ');
        return `<div class="mention-item">
          <div class="mi-head"><span class="mi-src">${esc(engNames[eng] || eng)}</span>${badge(r.collected + '/' + r.total + ' 场景收录', r.total && r.collected / r.total >= 0.5 ? 'green' : 'amber')}</div>
          <div class="mi-text">${Object.entries(r.questions || {}).map(([k, q]) => `<div style="margin:4px 0;display:flex;gap:8px;align-items:center"><span class="badge violet">${scNames[k] || k}</span><span style="color:var(--text-2);flex:1;font-size:.78rem">${esc(q.question)}</span>${q.apiError ? badge('未配置','amber') : q.limited ? badge('未收录 · 信息不足','amber') : q.mismatch ? badge('未收录 · 描述存疑','amber') : q.negated ? badge('负面提及','red') : q.hit_rate >= 1 ? badge('已收录','green') : q.hit_rate > 0 ? badge('部分收录','amber') : badge('未收录','red')}${!q.apiError && q.sentiment ? badge(q.sentiment === 'negative' ? '负面' : q.sentiment === 'positive' ? '正面' : '中性', q.sentiment === 'positive' ? 'green' : q.sentiment === 'negative' ? 'red' : '') : ''}${q.hit_rate != null && q.hit_rate < 1 ? badge((q.hit_rate * 100) + '%', '') : ''}${q.position ? badge('#' + q.position, '') : ''}${q.cited ? badge('引用官网','green') : ''}</div>`).join('')}</div>
        </div>`;
      }).join('');
    }

    const gapRows = (report.gaps || []).map(g => `
      <div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--border-soft)">
        ${badge(g.severity === '高' ? '高优' : '中优', g.severity === '高' ? 'red' : 'amber')}
        <span style="flex:1;font-size:.85rem">${esc(g.issue)}</span>
        <span class="mono" style="color:var(--text-3)">${g.score}</span>
      </div>`).join('') || '<div class="empty">无显著差距</div>';

    const sugRows = (report.suggestions || []).map(s => `
      <div class="mention-item">
        <div class="mi-head">
          <span class="mi-src">${esc(s.title)}</span>
          ${badge('优先级 ' + s.priority, s.priority === '高' ? 'red' : s.priority === '中' ? 'amber' : '')}
          ${badge(s.category || '', 'violet')}
        </div>
        <div class="mi-text">${esc(s.detail)}<br><span style="color:var(--green)">📈 ${esc(s.impact || '')}</span></div>
      </div>`).join('');

    c.innerHTML = `
      ${pageHead('GEO 诊断报告', `${esc(report.meta.brand)} · ${esc(report.meta.url)} · ${report.meta.date}`, '<button class="btn btn-ghost" data-action="diag-again">↺ 重新诊断</button>')}
      <div class="grid-2-1">
        <div class="card">
          <div class="card-head"><h3>综合 GEO 得分</h3></div>
          <div class="card-body" style="display:flex;align-items:center;gap:28px;flex-wrap:wrap;">
            <div style="text-align:center;">
              <div style="font-size:4rem;font-weight:800;line-height:1;background:linear-gradient(120deg,var(--indigo),var(--accent),var(--pink));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;">${report.overall.score}</div>
              <div style="margin-top:6px">${badge('等级 ' + report.overall.grade, gradeColor)}</div>
            </div>
            <div style="flex:1;min-width:200px">
              <div style="font-size:.8rem;color:var(--text-2);margin-bottom:8px">维度权重分布</div>
              <div class="mention-list">
                ${dims.map(d => `<div style="display:flex;align-items:center;gap:8px"><span style="width:52px;font-size:.74rem;color:var(--text-2)">${esc(d.name)}</span><div class="pbar" style="flex:1"><i style="width:${d.score}%;background:linear-gradient(90deg,var(--indigo),var(--accent))"></i></div><span class="mono" style="font-size:.72rem">${d.weight * 100}%</span></div>`).join('')}
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-head"><h3>七维雷达图</h3></div>
          <div class="card-body">${radarChart(radar)}</div>
        </div>
      </div>
      <div class="grid-2">
        <div class="card">
          <div class="card-head"><h3>豆包 + DeepSeek 收录检测</h3><span class="hint">实测 AI 回答是否收录品牌</span></div>
          <div class="card-body"><div class="mention-list">${idxCards}</div></div>
        </div>
        <div class="card">
          <div class="card-head"><h3>维度详情</h3></div>
          <div class="card-body"><div class="mention-list">${dimRows}</div></div>
        </div>
      </div>
      <div class="grid-2">
        <div class="card">
          <div class="card-head"><h3>差距清单</h3></div>
          <div class="card-body flush" style="padding:0 18px">${gapRows}</div>
        </div>
        <div class="card">
          <div class="card-head"><h3>优化建议</h3><span class="hint">Claude Code 生成</span></div>
          <div class="card-body"><div class="mention-list">${sugRows}</div></div>
        </div>
      </div>`;
  }

  /* ═══ 诊断动作 ═══ */
  async function startDiag() {
    const g = id => document.getElementById(id);
    const url = g('dg-url').value.trim();
    const brand = g('dg-brand').value.trim();
    if (!url) return toast('请填写网站地址', 'warn');
    diagState.mode = 'loading';
    render();
    toast('正在诊断：爬取审计 + 豆包/DeepSeek 收录实测 + AI 评估…');

    // 检查本地服务
    let serverUp = false;
    try { const h = await diagFetch('/health', {}, 2500); serverUp = !!h.ok; } catch { }
    diagState.engineOk = serverUp;

    let report = null;
    if (serverUp) {
      try {
        const apiPath = window.Account && Account.user ? '/api/me/diagnose' : '/diagnose';
        const r = await diagFetch(apiPath, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url, brand }) }, 240000);
        report = r.report || null;
        if (!report) throw new Error('诊断无返回');
      } catch (e) { report = null; }
    }
    if (!report) {
      // 兜底：内嵌示例报告（公开站/服务未启动时）
      report = window.DEMO_REPORT || null;
      if (!report) { diagState.mode = 'input'; render(); return toast('诊断服务未启动，且无示例报告', 'err'); }
      toast('使用示例报告展示（本地诊断服务未启动）', 'warn');
    } else {
      toast('诊断完成！', 'good');
    }
    diagState.report = report;
    diagState.mode = 'result';
    render();
  }

  /* ═══ 视图：总览 ═══ */
  function overview(c) {
    const v = D().visibility, eng = effSettings().engines;
    const enabled = eng.filter(e => e.enabled);
    const trendUp = v.score_delta > 0;
    const history = v.history.map(h => ({ label: h.date.slice(5), value: h.score }));
    const active = eng.filter(e => e.enabled);
    const engineOk = (v.latest.engines || []).filter(e => e.score > 0).length;

    c.innerHTML = `
      ${pageHead('总览', '品牌在主流 AI 引擎中的可见度一览 · ' + DataStore.meta())}
      ${dataNoticeHtml()}
      <div class="tile-grid">
        ${tile('综合可见度', v.overall_score, `${trendUp ? '↑' : '↓'} ${v.score_delta}`, trendUp ? 'up' : 'down', 'grad')}
        ${tile('命中场景', `${v.mentioned_scenarios}/${v.total_scenarios}`, '跨引擎累计命中', '')}
        ${tile('启用引擎', `${engineOk}/${active.length}`, `${active.length} 个引擎已接入`, '')}
        ${tile('近 7 日引用', '12', '↑ 3', 'up')}
      </div>
      <div class="grid-2-1">
        <div class="card">
          <div class="card-head"><h3>可见度趋势（近 30 天）</h3><span class="hint">overall_score</span></div>
          <div class="card-body">${lineChart(history)}</div>
        </div>
        <div class="card">
          <div class="card-head"><h3>场景命中分布</h3></div>
          <div class="card-body">
            ${donutChart((D().scenario_insights || []).map(s => ({ label: s.scenario, value: s.mentioned })), { size: 150 })}
          </div>
        </div>
      </div>
      <div class="grid-2">
        <div class="card">
          <div class="card-head"><h3>引擎实时状态</h3></div>
          <div class="card-body">
            <div class="engine-row">
              ${eng.map(e => `<span class="engine-chip ${e.enabled ? (e.api === 'configured' ? 'ok' : 'fail') : 'fail'}">${esc(e.name)} · ${e.api === 'configured' ? '已就绪' : e.api || '未启用'}</span>`).join('')}
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-head"><h3>最新引用</h3><span class="hint"><a href="#/citations" style="color:var(--accent)">全部 →</a></span></div>
          <div class="card-body flush">
            ${mentionList((D().citations || []).slice(0, 4))}
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-head"><h3>重点优化建议</h3><span class="hint"><a href="#/suggestions" style="color:var(--accent)">全部 →</a></span></div>
        <div class="card-body">
          <div class="mention-list">
            ${(D().suggestions || []).slice(0, 2).map(s => `
              <div class="mention-item">
                <div class="mi-head">
                  <span class="mi-src">${esc(s.title)}</span>
                  ${badge(s.category, 'violet')}${badge('优先级 ' + s.priority, s.priority === '高' ? 'red' : s.priority === '中' ? 'amber' : '')}
                </div>
                <div class="mi-text">${esc(s.detail)}<br><span style="color:var(--green)">${esc(s.impact)}</span></div>
              </div>`).join('')}
          </div>
        </div>
      </div>`;
  }

  function tile(label, value, delta, deltaCls, valueCls = '') {
    return `<div class="tile">
      <div class="tile-label">${esc(label)}</div>
      <div class="tile-value ${valueCls}">${esc(value)}</div>
      <div class="tile-delta ${deltaCls}">${esc(delta)}</div>
      <div class="tile-bar"></div>
    </div>`;
  }

  /* ═══ 视图：品牌可见度 ═══ */
  function visibility(c) {
    const v = D().visibility;
    const history = v.history.map(h => ({ label: h.date.slice(5), value: h.score }));
    const engines = effSettings().engines;
    const rows = v.latest.engines.map(e => {
      const eng = engines.find(x => x.id === e.engine) || {};
      const pct = e.score;
      return `<tr>
        <td><span style="font-weight:600">${esc(eng.name || e.engine)}</span><br><span class="mono" style="color:var(--text-3)">${esc(eng.vendor || '')}</span></td>
        <td><span class="mono" style="font-weight:700;font-size:1rem">${e.score || 0}</span></td>
        <td>${pbar(pct, e.score >= 60 ? 'green' : '')}</td>
        <td><span class="mono">${e.mentioned}/${e.total}</span></td>
        <td>${e.top_rank ? `<span class="mono">#${e.top_rank}</span>` : '<span style="color:var(--text-3)">—</span>'}</td>
        <td>${trendBadge(e.trend)}</td>
        <td>${e.note ? `<span style="color:var(--text-3);font-size:.78rem">${esc(e.note)}</span>` : ''}</td>
      </tr>`;
    }).join('');
    const hit = v.latest.engines.filter(e => e.mentioned > 0).length;
    const first3 = v.latest.engines.filter(e => e.top_rank && e.top_rank <= 3).length;

    c.innerHTML = `
      ${pageHead('品牌可见度', `品牌在 ${v.latest.engines.length} 个引擎中的命中与排名 · 数据源 ${DataStore.source}`)}
      ${dataNoticeHtml()}
      <div class="tile-grid">
        ${tile('综合得分', v.overall_score, `${v.score_delta > 0 ? '↑' : '↓'} ${v.score_delta}`, v.score_delta > 0 ? 'up' : 'down', 'grad')}
        ${tile('有命中引擎', `${hit}/${v.latest.engines.length}`, '被提及次数 > 0', '')}
        ${tile('前三占比', `${first3}`, 'Top3 引擎数', '')}
        ${tile('场景命中', `${v.mentioned_scenarios}/${v.total_scenarios}`, '跨引擎场景累计', '')}
      </div>
      <div class="card">
        <div class="card-head"><h3>可见度趋势</h3><span class="hint">近 30 天 · 综合得分</span></div>
        <div class="card-body">${lineChart(history)}</div>
      </div>
      <div class="card">
        <div class="card-head"><h3>分引擎表现</h3><span class="hint">得分 = 命中场景数 × 权重</span></div>
        <div class="card-body flush"><div class="table-wrap"><table class="tbl">
          <thead><tr><th>引擎</th><th>得分</th><th>分布</th><th>命中</th><th>最佳排名</th><th>趋势</th><th>备注</th></tr></thead>
          <tbody>${rows}</tbody>
        </table></div></div>
      </div>`;
  }

  function trendBadge(t) {
    const map = { up: ['green', '↑ 上升'], down: ['red', '↓ 下降'], flat: ['', '— 持平'] };
    const [cls, label] = map[t] || ['', esc(t)];
    return badge(label, cls);
  }

  /* ═══ 视图：竞争格局 ═══ */
  function competitors(c) {
    const list = D().competitors.list || [];
    const bars = list.map(x => ({ label: x.name + (x.self ? '（本品牌）' : ''), value: x.mentionShare != null ? x.mentionShare : x.share, color: x.self ? '#EC4899' : '#8B5CF6' }));
    const rows = list.map(x => `<tr${x.self ? ' style="background:rgba(236,72,153,0.05)"' : ''}>
      <td>${x.self ? badge('本品牌', 'pink') : ''} <span style="font-weight:600">${esc(x.name)}</span></td>
      <td class="mono">${x.avg_rank}</td>
      <td class="mono">${x.mentions}</td>
      <td class="mono">${x.share}%</td>
      <td>${trendBadge(x.trend)}</td>
      <td style="font-size:.78rem;color:var(--text-3)">${esc(x.note || '')}</td>
    </tr>`).join('');
    const emptyHint = list.length <= 1
      ? `<div class="card" style="margin-top:16px"><div class="card-body" style="font-size:.82rem;color:var(--text-2)">当前榜单仅含本品牌。在 <span class="mono">data/config.json</span> 的 <span class="mono">competitors</span> 中配置竞品名称/别名/官网后运行 <span class="mono">bash scripts/run-monitor.sh</span>，即可生成真实竞品对比。</div></div>`
      : '';
    c.innerHTML = `
      ${pageHead('竞争格局', '品牌与同赛道竞品在 AI 引擎中的可见度对比 · 今日实测 · ' + D().competitors.updated_at)}
      <div class="grid-2">
        <div class="card">
          <div class="card-head"><h3>AI 提及份额</h3></div>
          <div class="card-body">${hbarChart(bars)}</div>
        </div>
        <div class="card">
          <div class="card-head"><h3>榜单</h3><span class="hint">平均排名越低越靠前</span></div>
          <div class="card-body flush"><div class="table-wrap"><table class="tbl">
            <thead><tr><th>品牌</th><th>平均排名</th><th>提及</th><th>份额</th><th>趋势</th><th>备注</th></tr></thead>
            <tbody>${rows}</tbody>
          </table></div></div>
        </div>
      </div>${emptyHint}`;
  }

  /* ═══ 视图：引用追踪 ═══ */
  function citations(c) {
    const list = D().citations || [];
    const pos = list.filter(x => x.sentiment === 'positive').length;
    const engines = effSettings().engines;
    const engName = id => (engines.find(e => e.id === id) || {}).name || id;
    const attrLabel = { brand: '官网归因', competitor: '竞品来源', 'third-party': '第三方来源' };
    const rows = list.map(x => `
      <div class="mention-item">
        <div class="mi-head">
          <span class="mi-src">${esc(x.title)}</span>
          ${badge(engName(x.engine), x.mentioned ? 'green' : 'amber')}
          ${badge(x.scenario, 'violet')}
          ${badge('来源 · ' + x.source, '')}
          ${x.attribution ? badge('归因 · ' + (attrLabel[x.attribution] || '待定'), x.attribution === 'brand' ? 'green' : x.attribution === 'competitor' ? 'amber' : '') : ''}
          ${badge(x.sentiment === 'positive' ? '正面' : x.sentiment === 'negative' ? '负面' : '中性', x.sentiment === 'positive' ? 'green' : x.sentiment === 'negative' ? 'red' : '')}
          ${x.mentioned ? badge('已提及', 'green') : badge('未提及', 'amber')}
        </div>
        <div class="mi-text">${esc(x.snippet)}</div>
        <div style="font-size:.72rem;color:var(--text-3);margin-top:6px;font-family:monospace">${x.date}</div>
      </div>`).join('');
    c.innerHTML = `
      ${pageHead('引用追踪', '品牌在 AI 回答与内容源中的引用明细')}
      <div class="tile-grid">
        ${tile('引用总数', list.length, '含正面/中性', '')}
        ${tile('已提及', list.filter(x => x.mentioned).length, '被引用到', '')}
        ${tile('正面引用', pos, Math.round(pos / list.length * 100) + '% 正面率', '')}
        ${tile('涉及引擎', new Set(list.map(x => x.engine)).size, '个', '')}
      </div>
      <div class="card">
        <div class="card-head"><h3>引用明细</h3><span class="hint">最新在前</span></div>
        <div class="card-body flush"><div class="mention-list" style="padding:14px 16px;">${rows}</div></div>
      </div>`;
  }

  /* ═══ 视图：文章收录 ═══ */
  function articles(c) {
    const list = D().articles || [];
    const st = s => list.filter(x => x.status === s).length;
    const map = { indexed: '已收录', pending: '待收录', not_indexed: '未收录' };
    const cls = { indexed: 'green', pending: 'amber', not_indexed: 'red' };
    const rows = list.map(x => `<tr>
      <td style="font-weight:600">${esc(x.title)}</td>
      <td>${badge(x.platform, 'violet')}</td>
      <td class="mono">${x.publish_date}</td>
      <td>${badge(map[x.status] || x.status, cls[x.status] || '')}</td>
      <td>${(x.engines || []).map(e => badge(engName(e), 'green')).join(' ') || '<span style="color:var(--text-3)">—</span>'}</td>
    </tr>`).join('');
    c.innerHTML = `
      ${pageHead('文章收录', '已发布内容在 AI 引擎中的收录与引用状态')}
      <div class="tile-grid">
        ${tile('文章总数', list.length, '', '')}
        ${tile('已收录', st('indexed'), '', '')}
        ${tile('待收录', st('pending'), '', '')}
        ${tile('未收录', st('not_indexed'), '', '')}
      </div>
      <div class="card">
        <div class="card-head"><h3>收录明细</h3></div>
        <div class="card-body flush"><div class="table-wrap"><table class="tbl">
          <thead><tr><th>标题</th><th>平台</th><th>发布日期</th><th>状态</th><th>被引用引擎</th></tr></thead>
          <tbody>${rows}</tbody>
        </table></div></div>
      </div>`;
  }

  function engName(id) {
    return (effSettings().engines.find(e => e.id === id) || {}).name || id;
  }

  /* ═══ 视图：场景洞察 ═══ */
  function scenarios(c) {
    const list = D().scenario_insights || [];
    const cards = list.map(s => `
      <div class="scenario-card">
        <h4>${esc(s.scenario)} <span class="mono" style="color:var(--text-3);font-weight:400;font-size:.75rem">命中 ${s.mentioned}/${s.total}</span></h4>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">${pbar(s.mentioned / s.total * 100, s.mentioned / s.total >= 0.5 ? 'green' : '')}<span class="mono" style="font-size:.75rem;color:var(--text-2)">${Math.round(s.mentioned / s.total * 100)}%</span></div>
        <div style="font-size:.82rem;color:var(--text-2);margin-bottom:8px">${esc(s.detail)}</div>
        <div style="font-size:.82rem;color:var(--green);">💡 ${esc(s.insight)}</div>
      </div>`).join('');
    c.innerHTML = `
      ${pageHead('场景洞察', '按「认知 / 推荐 / 评价」场景拆解品牌在各引擎的命中表现')}
      <div class="grid-3">${cards}</div>
      <div class="card" style="margin-top:18px">
        <div class="card-head"><h3>说明</h3></div>
        <div class="card-body" style="font-size:.84rem;color:var(--text-2);line-height:1.7">
          场景命中率 = 该场景下品牌被 AI 正确提及的引擎数 ÷ 启用引擎数。洞察由 <span style="color:var(--accent)">Claude Code</span> 基于原始回答自动生成（分析脚本见 <span class="mono">scripts/analyze.js</span>）。
        </div>
      </div>`;
  }

  /* ═══ 视图：内容追踪 ═══ */
  function contentView(c) {
    const list = D().content_tracking || [];
    const rows = list.map(x => `<tr>
      <td style="font-weight:600">${esc(x.title)}</td>
      <td>${badge(x.platform, 'violet')}</td>
      <td class="mono">${x.published_at}</td>
      <td class="mono">${x.citations}</td>
      <td class="mono" style="color:var(--accent)">+${x.contribution}%</td>
      <td>${trendBadge(x.trend)}</td>
    </tr>`).join('');
    const bars = list.map(x => ({ label: x.title, value: x.contribution }));
    c.innerHTML = `
      ${pageHead('内容追踪', '单条内容对品牌 AI 可见度的贡献与引用表现')}
      <div class="grid-2">
        <div class="card">
          <div class="card-head"><h3>贡献度分布</h3><span class="hint">内容 → 可见度贡献 %</span></div>
          <div class="card-body">${hbarChart(bars, { color: '#EC4899' })}</div>
        </div>
        <div class="card">
          <div class="card-head"><h3>明细</h3></div>
          <div class="card-body flush"><div class="table-wrap"><table class="tbl">
            <thead><tr><th>内容</th><th>平台</th><th>发布</th><th>引用</th><th>贡献</th><th>趋势</th></tr></thead>
            <tbody>${rows}</tbody>
          </table></div></div>
        </div>
      </div>`;
  }

  /* ═══ 视图：优化建议 ═══ */
  function suggestions(c) {
    const list = D().suggestions || [];
    const order = { '高': 0, '中': 1, '低': 2 };
    const sorted = [...list].sort((a, b) => (order[a.priority] || 3) - (order[b.priority] || 3));
    const cards = sorted.map(s => `
      <div class="card">
        <div class="card-head">
          <h3>${badge('优先级 ' + s.priority, s.priority === '高' ? 'red' : s.priority === '中' ? 'amber' : '')} ${esc(s.title)}</h3>
          <span class="hint">${esc(s.category)}</span>
        </div>
        <div class="card-body">
          <div style="font-size:.86rem;color:var(--text-2);line-height:1.7;margin-bottom:8px">${esc(s.detail)}</div>
          <div style="font-size:.82rem;color:var(--green)">📈 ${esc(s.impact)}</div>
          <div style="font-size:.72rem;color:var(--text-3);margin-top:8px;font-family:monospace">来源：${esc(s.source)}</div>
        </div>
      </div>`).join('');
    c.innerHTML = `
      ${pageHead('优化建议', '由 Claude Code 基于监测数据自动产出的可执行优化方案')}
      ${cards}`;
  }

  /* ═══ 视图：监测任务 ═══ */
  function tasks(c) {
    const list = D().tasks || [];
    const rows = list.map(t => `
      <div class="task-item">
        <div style="flex:1">
          <div class="ti-name">${esc(t.name)}</div>
          <div class="ti-type">${esc(t.type)} · ${esc(t.schedule)}</div>
        </div>
        <div class="ti-meta">
          ${statusBadge(t.status)}
          <span class="ti-next">上次 ${t.last_run} · 耗时 ${t.duration}</span>
          <span class="ti-next">下次 ${t.next_run}</span>
        </div>
        <div class="ti-meta"><span class="mono" style="font-size:.78rem;color:var(--text-2)">${esc(t.result)}</span></div>
      </div>`).join('');
    c.innerHTML = `
      ${pageHead('监测任务', '由 n8n 定时执行的监测工作流 · 手动触发可点右上角「立即监测」', '<button class="btn btn-primary" data-action="runmon">▶ 立即执行监测</button>')}
      <div class="card">
        <div class="card-head"><h3>任务列表</h3><span class="hint">n8n 工作流驱动</span></div>
        <div class="card-body flush">${rows}</div>
      </div>`;
  }

  /* ═══ 视图：品牌设置 ═══ */
  function brand(c) {
    const s = effSettings();
    const b = s.brand || {};
    c.innerHTML = `
      ${pageHead('品牌设置', '监测对象与品牌信息 · 影响所有监测场景的提问与判断')}
      <div class="card">
        <div class="card-head"><h3>品牌信息</h3></div>
        <div class="card-body">
          <div class="form-grid">
            <div class="form-group"><label>品牌名称 <span class="req">*</span></label><input id="f-name" type="text" value="${esc(b.name || '')}"></div>
            <div class="form-group"><label>官网地址</label><input id="f-site" type="url" value="${esc(b.website || '')}"></div>
            <div class="form-group"><label>所属行业</label><input id="f-ind" type="text" value="${esc(b.industry || '')}"></div>
            <div class="form-group"><label>品牌一句话定位</label><input id="f-desc" type="text" value="${esc(b.description || '')}"></div>
            <div class="form-group full"><label>核心关键词（逗号分隔，用于认知判定）</label><textarea id="f-kw">${esc((b.keywords || []).join('，'))}</textarea></div>
          </div>
          <div style="margin-top:16px;display:flex;gap:10px"><button class="btn btn-primary" data-action="save-brand">保存设置</button></div>
        </div>
      </div>`;
  }

  /* ═══ 视图：场景管理 ═══ */
  function scenarioCfg(c) {
    const s = effSettings();
    const rows = (s.scenarios || []).map((sc, i) => `
      <div class="mention-item">
        <div class="mi-head">
          <span class="mi-src">${esc(sc.name)}</span>
          ${badge('权重 ' + Math.round(sc.weight * 100) + '%', 'violet')}
        </div>
        <div class="form-grid" style="margin-top:6px">
          <div class="form-group"><label>提问模板</label><input type="text" value="${esc(sc.question)}" data-sq="${sc.id}"></div>
          <div class="form-group"><label>说明</label><input type="text" value="${esc(sc.desc || '')}" data-sd="${sc.id}"></div>
        </div>
        <div style="margin-top:8px"><button class="btn btn-sm btn-ghost" data-del="${sc.id}">删除场景</button></div>
      </div>`).join('');
    c.innerHTML = `
      ${pageHead('场景管理', '定义监测提问场景，决定 AI 以哪些维度回答品牌问题')}
      <div class="card">
        <div class="card-head"><h3>场景列表</h3><span class="hint">命中判定由 Claude Code 完成</span></div>
        <div class="card-body"><div class="mention-list">${rows}</div></div>
      </div>
      <div class="card">
        <div class="card-head"><h3>新增场景</h3></div>
        <div class="card-body">
          <div class="form-grid">
            <div class="form-group"><label>场景名称</label><input id="sc-name" type="text" placeholder="如：竞品对比"></div>
            <div class="form-group"><label>权重</label><input id="sc-weight" type="number" min="0" max="1" step="0.1" value="0.2"></div>
            <div class="form-group full"><label>提问模板</label><input id="sc-q" type="text" placeholder="如：优引GEO系统和XX平台有什么区别？"></div>
          </div>
          <div style="margin-top:14px"><button class="btn btn-primary" data-action="add-scenario">添加场景</button></div>
        </div>
      </div>`;
  }

  /* ═══ 视图：监测设置 ═══ */
  function monitorCfg(c) {
    const s = effSettings();
    const m = s.monitor || {};
    const eng = s.engines || [];
    const apiMode = window.YOUYIN_API === (window.YOUYIN_API_OPTIONS || {}).cloud ? 'cloud' : 'local';
    const engRows = eng.map(e => `
      <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border-soft)">
        <span style="flex:1;font-size:.85rem">${esc(e.name)} <span style="color:var(--text-3)">· ${esc(e.vendor || '')}</span></span>
        <span style="font-size:.75rem;color:${e.api === 'configured' ? 'var(--green)' : 'var(--red)'};font-family:monospace">${e.api === 'configured' ? 'API 已配置' : e.api || '未配置'}</span>
        <label class="switch"><input type="checkbox" data-engine="${e.id}" ${e.enabled ? 'checked' : ''}><span class="sl"></span></label>
      </div>`).join('');
    c.innerHTML = `
      ${pageHead('监测设置', '监测节奏、引擎接入与 AI 分析配置')}
      <div class="grid-2">
        <div class="card">
          <div class="card-head"><h3>监测节奏</h3></div>
          <div class="card-body">
            <div class="form-grid">
              <div class="form-group"><label>监测频率</label><select id="m-freq">
                ${['每日 09:00', '每日 06:00', '每 6 小时', '每 12 小时', '每周一 08:00'].map(f => `<option ${m.frequency === f ? 'selected' : ''}>${f}</option>`).join('')}
              </select></div>
              <div class="form-group"><label>每批问题数</label><input id="m-batch" type="number" value="${m.question_batch || 3}"></div>
              <div class="form-group"><label>历史保留（天）</label><input id="m-days" type="number" value="${m.history_days || 30}"></div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-head"><h3>AI 配置</h3><span class="hint">客户自带密钥（BYOK）</span></div>
          <div class="card-body">
            <div class="form-grid">
              <div class="form-group"><label>默认引擎 API Key</label><input id="m-key" type="password" placeholder="sk-••••••••"></div>
              <div class="form-group"><label>分析模型</label><select id="m-model"><option>claude-sonnet-4-5</option><option>deepseek-chat</option><option>auto</option></select></div>
            </div>
            <div style="margin-top:12px;font-size:.76rem;color:var(--text-3)">密钥仅保存在本地 <span class="mono">scripts/../data/config.json</span>，用于调用 AI 引擎进行监测与分析。</div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-head"><h3>API 服务</h3><span class="hint">客户账号与数据存储位置</span></div>
        <div class="card-body">
          <div class="form-grid">
            <div class="form-group"><label>服务模式</label><select id="m-api">
              <option value="local" ${apiMode === 'local' ? 'selected' : ''}>本地服务（localhost:8788）</option>
              <option value="cloud" ${apiMode === 'cloud' ? 'selected' : ''}>云端 Worker（Cloudflare D1）</option>
            </select></div>
            <div class="form-group"><label>服务状态</label><span id="api-status" class="mono" style="font-size:.86rem">检查中…</span></div>
          </div>
          <div style="font-size:.74rem;color:var(--text-3);margin-top:8px">切换后会重新加载页面；本地与云端账号数据互相独立。</div>
        </div>
      </div>
      <div class="card">
        <div class="card-head"><h3>引擎接入</h3><span class="hint">勾选启用的监测引擎</span></div>
        <div class="card-body">${engRows}</div>
      </div>
      <div class="card">
        <div class="card-head"><h3>通知</h3></div>
        <div class="card-body">
          <div style="display:flex;align-items:center;gap:12px;padding:6px 0">
            <span style="flex:1">可见度下降提醒（触发阈值 ${m.notify && m.notify.score_threshold || 5} 分）</span>
            <label class="switch"><input type="checkbox" id="m-n-drop" ${m.notify && m.notify.mention_drop ? 'checked' : ''}><span class="sl"></span></label>
          </div>
          <div style="display:flex;align-items:center;gap:12px;padding:6px 0">
            <span style="flex:1">监测结果邮件通知</span>
            <label class="switch"><input type="checkbox" id="m-n-mail" ${m.notify && m.notify.email ? 'checked' : ''}><span class="sl"></span></label>
          </div>
        </div>
      </div>
      <div style="display:flex;gap:10px;margin-bottom:20px"><button class="btn btn-primary" data-action="save-monitor">保存监测设置</button></div>`;
    checkApiStatus();
  }

  async function checkApiStatus() {
    const el = document.getElementById('api-status');
    if (!el) return;
    try {
      const r = await fetch(window.YOUYIN_API + '/health', { signal: AbortSignal.timeout(5000) });
      const ok = r.ok;
      el.textContent = ok ? '✓ 服务正常' : 'HTTP ' + r.status;
      el.style.color = ok ? 'var(--green)' : 'var(--red)';
    } catch {
      el.textContent = '不可用';
      el.style.color = 'var(--red)';
    }
  }

  /* ═══ 内容生产模块 ═══ */
  const CONTENT_KEY = 'youyin-content';
  const CONTENT_SEED = {
    articles: [
      { id: 'a1', title: '2026 GEO 与 SEO 的本质区别', scene: '科普文章', status: '草稿', createdAt: '2026-07-30', content: 'GEO 衡量的是 AI 引用，而不是点击。本文直接给出答案：GEO 优化品牌在 AI 问答中的提及、引用与推荐。' },
      { id: 'a2', title: '全链路 GEO 平台怎么选？', scene: '榜单文章', status: '已发布', createdAt: '2026-07-28', content: '选择 GEO 平台看三件事：引擎实测覆盖、优化闭环、数据归属。' },
    ],
    keywords: [
      { id: 'k1', word: 'GEO 优化', group: '核心词' },
      { id: 'k2', word: 'AI 搜索优化', group: '核心词' },
      { id: 'k3', word: '品牌 AI 可见度', group: '长尾词' },
    ],
    titles: [
      { id: 't1', title: '为什么你的品牌没被 AI 推荐？', scene: '认知' },
      { id: 't2', title: 'GEO 平台横向对比：覆盖、闭环与成本', scene: '榜单' },
    ],
    images: [
      { id: 'i1', name: 'GEO 轨道示意图', url: '', tags: 'GEO,配图' },
    ],
    knowledge: [
      { id: 'n1', title: '品牌定位', type: '品牌资料', content: '全链路 GEO 优化平台，让 AI 主动推荐你。' },
    ],
    urlImports: [
      { id: 'u1', url: 'https://zkoner.com/geo.html', category: '官网内容', status: '已导入', createdAt: '2026-07-31' },
    ],
    clones: [],
    distTasks: [],
    accounts: [
      { id: 'ac1', platform: '微信公众号', name: '优引GEO', status: '已绑定' },
      { id: 'ac2', platform: '知乎', name: '优引GEO', status: '已绑定' },
    ],
    nodes: [
      { id: 'nd1', platform: '知乎', name: '科技·默认节点', weight: 60, status: '启用' },
      { id: 'nd2', platform: '百家号', name: 'AI 科技频道', weight: 40, status: '启用' },
    ],
    logs: [
      { id: 'l1', date: '2026-07-31 10:02', title: '全链路 GEO 平台怎么选？', platform: '知乎', status: '成功', note: '已发布' },
    ],
  };
  let contentStore = loadContent();
  let contentPreview = null;
  let contentState = { view: 'list', articleId: null };
  let contentPrefill = null;

  function loadContent() {
    try {
      const d = JSON.parse(localStorage.getItem(CONTENT_KEY));
      if (!d || typeof d !== 'object') return JSON.parse(JSON.stringify(CONTENT_SEED));
      return { ...JSON.parse(JSON.stringify(CONTENT_SEED)), ...d };
    } catch { return JSON.parse(JSON.stringify(CONTENT_SEED)); }
  }
  function saveContent() { localStorage.setItem(CONTENT_KEY, JSON.stringify(contentStore)); }
  function cInput(label, id, ph, val = '', type = 'text') {
    return `<div class="form-group"><label>${esc(label)}</label><input id="${id}" type="${type}" placeholder="${esc(ph)}" value="${esc(val)}"></div>`;
  }
  function cSelect(label, id, opts, val = '') {
    return `<div class="form-group"><label>${esc(label)}</label><select id="${id}">${opts.map(o => `<option value="${o}" ${o === val ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select></div>`;
  }
  function contentLog(title, platform, status, note) {
    contentStore.logs.unshift({ id: 'l' + Date.now(), date: new Date().toLocaleString('zh-CN', { hour12: false }), title, platform, status, note });
    saveContent();
  }

  function aiCreate(c) {
    const b = effSettings().brand || {};
    const titleVal = contentPrefill && contentPrefill.title ? contentPrefill.title : '';
    c.innerHTML = `
      ${pageHead('AI 创作', '单篇生成 GEO 友好内容，产出后进入文章管理')}
      <div class="grid-2">
        <div class="card">
          <div class="card-head"><h3>创作参数</h3></div>
          <div class="card-body">
            <div class="form-grid">
              ${cInput('文章标题', 'c-title', '例如：2026 GEO 优化完整指南', titleVal)}
              <div class="form-group"><label>标题模板</label><select id="c-title-tpl"><option value="">不使用模板</option>${contentStore.titles.map(t => `<option value="${esc(t.title)}">${esc(t.title)}</option>`).join('')}</select></div>
              ${cSelect('场景类型', 'c-scene', ['科普文章', '榜单文章', '问答 FAQ', '客户案例'])}
              ${cInput('品牌名', 'c-brand', '品牌名', b.name || '')}
              ${cInput('关键词（逗号分隔）', 'c-kw', 'GEO,AI搜索优化', (b.keywords || []).join('，'))}
              ${cInput('目标字数', 'c-words', '1200', '1200', 'number')}
              <div class="form-group full"><label>创作要求</label><textarea id="c-brief" rows="3" placeholder="例如：答案前置、含 FAQ、给出数据支撑"></textarea></div>
            </div>
            <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap">
              <button class="btn btn-primary" data-action="content-ai-gen">✦ 开始创作</button>
              <button class="btn btn-ghost" data-action="content-title-fill">填入标题模板</button>
              <button class="btn btn-ghost" data-action="content-kw-fill">填入关键词库</button>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-head"><h3>生成预览</h3><span class="hint">保存后进入文章管理</span></div>
          <div class="card-body" id="c-preview">${contentPreview ? esc(contentPreview.content.slice(0, 600)) : '<div class="empty">生成后会在这里显示文章预览</div>'}</div>
        </div>
      </div>`;
  }

  function batchGenerate(c) {
    const count = contentStore.articles.filter(x => x.status === '草稿').length;
    c.innerHTML = `
      ${pageHead('批量生成', '按主题方向批量产出文章，写入文章管理')}
      <div class="grid-2">
        <div class="card">
          <div class="card-head"><h3>批量配置</h3></div>
          <div class="card-body">
            <div class="form-grid">
              ${cInput('批量数量', 'c-batch-num', '10', '10', 'number')}
              ${cSelect('内容模式', 'c-batch-mode', ['科普文章', '榜单文章', '问答 FAQ', '混合'])}
              ${cInput('主题方向', 'c-batch-topic', '例如：GEO 优化、AI 搜索、品牌可见度', 'GEO 优化')}
              <div class="form-group full"><label>补充要求</label><textarea id="c-batch-brief" rows="3" placeholder="每个标题必须包含关键词，答案前置"></textarea></div>
            </div>
            <div style="margin-top:16px"><button class="btn btn-primary" data-action="content-batch">▦ 开始批量生成</button></div>
          </div>
        </div>
        <div class="card">
          <div class="card-head"><h3>当前状态</h3></div>
          <div class="card-body">
            <div class="tile-grid" style="grid-template-columns:repeat(2,1fr)">
              ${tile('草稿文章', contentStore.articles.filter(a => a.status === '草稿').length, '待完善', '')}
              ${tile('已发布', contentStore.articles.filter(a => a.status === '已发布').length, '待分发', 'up', 'grad')}
              ${tile('关键词', contentStore.keywords.length, '素材中心', '')}
              ${tile('标题模板', contentStore.titles.length, '素材中心', '')}
            </div>
            <div style="margin-top:16px" class="mention-list">
              ${contentStore.articles.slice(0, 3).map(a => `<div class="mention-item"><div class="mi-head"><span class="mi-src">${esc(a.title)}</span>${badge(a.status, a.status === '已发布' ? 'green' : 'amber')}</div></div>`).join('') || empty('暂无文章')}
            </div>
          </div>
        </div>
      </div>`;
  }

  function artManage(c) {
    if (contentState.view === 'edit') return artEdit(c, contentState.articleId);
    c.innerHTML = `
      ${pageHead('文章管理', '查看、编辑、分发与删除生成的文章')}
      <div class="card">
        <div class="card-head"><h3>文章列表</h3><span class="hint">数据保存在本地浏览器</span></div>
          <div class="card-body">
          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px">
            <input id="c-art-q" class="input" type="search" placeholder="搜索标题…" style="max-width:260px">
            <select id="c-art-status" class="input" style="max-width:140px"><option value="">全部状态</option><option>草稿</option><option>待审核</option><option>已发布</option></select>
            <button class="btn btn-sm btn-ghost" data-action="content-art-batch-del">批量删除选中</button>
          </div>
          <div class="table-wrap"><table class="tbl">
            <thead><tr><th><input type="checkbox" id="c-art-all"></th><th>标题</th><th>场景</th><th>状态</th><th>字数</th><th>创建日期</th><th></th></tr></thead>
            <tbody id="c-art-body">${contentArtRows('', '')}</tbody>
          </table></div>
        </div>
      </div>`;
  }
  function contentArtRows(q, status) {
    const query = (q || '').trim().toLowerCase();
    const rows = contentStore.articles.filter(a => (!query || a.title.toLowerCase().includes(query)) && (!status || a.status === status)).map(a => `
      <tr>
        <td><input type="checkbox" data-art-check="${a.id}"></td>
        <td><span style="font-weight:600">${esc(a.title)}</span></td>
        <td>${esc(a.scene)}</td>
        <td>${badge(a.status, a.status === '已发布' ? 'green' : a.status === '待审核' ? 'violet' : 'amber')}</td>
        <td class="mono">${(a.content || '').length}</td>
        <td class="mono" style="font-size:.8rem">${esc(a.createdAt)}</td>
        <td style="text-align:right">
          <button class="btn btn-sm btn-ghost" data-action="content-art-edit" data-id="${a.id}">编辑</button>
          <button class="btn btn-sm btn-ghost" data-action="content-art-dist" data-id="${a.id}">分发</button>
          <button class="btn btn-sm btn-ghost" data-action="content-art-del" data-id="${a.id}">删除</button>
        </td>
      </tr>`).join('');
    return rows || '<tr><td colspan="7"><div class="empty">没有匹配文章</div></td></tr>';
  }

  function artEdit(c, id) {
    const a = contentStore.articles.find(x => x.id === id);
    if (!a) { contentState = { view: 'list', articleId: null }; return artManage(c); }
    const kws = (a.content.match(/关键词[:：]([^\n]+)/) || [])[1] || '';
    c.innerHTML = `
      ${pageHead('编辑文章', esc(a.title), '<button class="btn btn-ghost" data-action="content-art-back">← 返回列表</button>')}
      <div class="card">
        <div class="card-body">
          <div class="form-grid">
            ${cInput('标题', 'e-title', '标题', a.title)}
            ${cSelect('场景', 'e-scene', ['科普文章', '榜单文章', '问答 FAQ', '客户案例'], a.scene)}
            ${cSelect('状态', 'e-status', ['草稿', '待审核', '已发布'], a.status)}
            ${cInput('关键词（逗号分隔）', 'e-kw', 'GEO,AI搜索优化', kws)}
            <div class="form-group full"><label>正文内容</label><textarea id="e-content" rows="16" style="font-family:var(--mono);font-size:.86rem">${esc(a.content)}</textarea></div>
          </div>
          <div style="display:flex;gap:10px;margin-top:16px">
            <button class="btn btn-primary" data-action="content-art-save" data-id="${a.id}">保存</button>
            <button class="btn btn-ghost" data-action="content-art-back">取消</button>
          </div>
        </div>
      </div>`;
  }

  function trafficClone(c) {
    c.innerHTML = `
      ${pageHead('流量复刻', '分析高流量内容/账号，生成同主题内容任务')}
      <div class="grid-2">
        <div class="card">
          <div class="card-head"><h3>复刻配置</h3></div>
          <div class="card-body">
            <div class="form-grid">
              ${cInput('对标链接 / 账号', 'c-clone-src', 'https://example.com/hot-article')}
              ${cSelect('对标平台', 'c-clone-platform', ['知乎', '微信公众号', '百家号', '小红书', '今日头条'])}
              ${cInput('复刻主题', 'c-clone-topic', '例如：GEO 平台怎么选')}
              ${cSelect('复刻范围', 'c-clone-scope', ['标题结构', '内容结构', '关键词覆盖', '全量复刻'])}
            </div>
            <div style="margin-top:16px"><button class="btn btn-primary" data-action="content-clone-add">↻ 创建复刻任务</button></div>
          </div>
        </div>
        <div class="card">
          <div class="card-head"><h3>复刻任务</h3></div>
          <div class="card-body">
            ${contentStore.clones.map(x => `<div class="mention-item"><div class="mi-head"><span class="mi-src">${esc(x.topic)}</span>${badge(x.status, 'violet')}</div><div class="mi-text">${esc(x.platform)} · ${esc(x.source)}</div></div>`).join('') || empty('暂无复刻任务')}
          </div>
        </div>
      </div>`;
  }

  function keywordsView(c) {
    const groups = ['核心词', '长尾词', '场景词', '竞品词'];
    c.innerHTML = `
      ${pageHead('关键词库', '收集与分组 GEO 关键词，供创作与监测使用')}
      <div class="card">
        <div class="card-head"><h3>添加关键词</h3></div>
        <div class="card-body"><div class="form-grid">
          ${cInput('关键词', 'c-kw-word', '例如：AI 搜索优化')}
          ${cSelect('分组', 'c-kw-group', groups)}
        </div><div style="margin-top:14px"><button class="btn btn-primary" data-action="content-kw-add">添加</button></div></div>
      </div>
      <div class="card">
        <div class="card-head"><h3>批量导入</h3><span class="hint">每行一个关键词，自动去重</span></div>
        <div class="card-body"><div class="form-grid">
          <div class="form-group full"><label>关键词列表</label><textarea id="c-kw-bulk" rows="5" placeholder="GEO 优化&#10;AI 搜索优化&#10;品牌可见度"></textarea></div>
          ${cSelect('导入分组', 'c-kw-bulk-group', groups)}
        </div><div style="margin-top:14px"><button class="btn btn-primary" data-action="content-kw-bulk">批量导入</button></div></div>
      </div>
      <div class="card">
        <div class="card-head"><h3>关键词列表</h3><span class="hint">${contentStore.keywords.length} 个 · ${groups.map(g => `${g} ${contentStore.keywords.filter(x => x.group === g).length}`).join(' / ')}</span></div>
        <div class="card-body flush"><div class="table-wrap"><table class="tbl"><thead><tr><th>关键词</th><th>分组</th><th></th></tr></thead>
          <tbody>${contentStore.keywords.map(x => `<tr><td>${esc(x.word)}</td><td>${badge(x.group, 'violet')}</td><td style="text-align:right"><button class="btn btn-sm btn-ghost" data-action="content-kw-del" data-id="${x.id}">删除</button></td></tr>`).join('')}</tbody>
        </table></div></div>
      </div>`;
  }

  function titlesView(c) {
    c.innerHTML = `
      ${pageHead('标题库', '沉淀高点击标题模板')}
      <div class="card">
        <div class="card-head"><h3>添加标题模板</h3></div>
        <div class="card-body"><div class="form-grid">
          ${cInput('标题模板', 'c-title-text', '例如：为什么你的品牌没被 AI 推荐？{kw}')}
          ${cSelect('场景', 'c-title-scene', ['认知', '榜单', '问答', '案例'])}
          <div class="form-group"><label>模板说明</label><input id="c-title-desc" type="text" placeholder="可选：{kw} 会被关键词替换"></div>
        </div><div style="margin-top:14px"><button class="btn btn-primary" data-action="content-title-add">添加</button></div></div>
      </div>
      <div class="card">
        <div class="card-head"><h3>标题列表</h3><span class="hint">${contentStore.titles.length} 条</span></div>
        <div class="card-body flush"><div class="table-wrap"><table class="tbl"><thead><tr><th>标题</th><th>场景</th><th>预览</th><th></th></tr></thead>
          <tbody>${contentStore.titles.map(x => `<tr><td>${esc(x.title)}</td><td>${badge(x.scene, '')}</td><td class="muted" style="font-size:.82rem">${esc(x.title.replace(/\{kw\}/g, contentStore.keywords[0]?.word || 'GEO'))}</td><td style="text-align:right"><button class="btn btn-sm btn-ghost" data-action="content-title-use" data-id="${x.id}">去创作</button> <button class="btn btn-sm btn-ghost" data-action="content-title-del" data-id="${x.id}">删除</button></td></tr>`).join('')}</tbody>
        </table></div></div>
      </div>`;
  }

  function imagesView(c) {
    c.innerHTML = `
      ${pageHead('图片库', '管理配图素材')}
      <div class="card">
        <div class="card-head"><h3>添加图片素材</h3></div>
        <div class="card-body"><div class="form-grid">
          ${cInput('素材名称', 'c-img-name', 'GEO 轨道示意图')}
          ${cInput('图片 URL', 'c-img-url', 'https://…')}
          ${cInput('标签', 'c-img-tags', 'GEO,配图')}
          <div class="form-group"><label>本地上传</label><input id="c-img-file" type="file" accept="image/*"></div>
        </div><div style="margin-top:14px"><button class="btn btn-primary" data-action="content-img-add">添加</button></div></div>
      </div>
      <div class="grid grid-3">${contentStore.images.map(x => `
        <div class="card" style="padding:14px">
          <div style="height:120px;border-radius:10px;background:var(--panel-strong);display:grid;place-items:center;color:var(--text-3);font-size:2rem;overflow:hidden">${x.url ? `<img src="${esc(x.url)}" alt="${esc(x.name)}" style="width:100%;height:100%;object-fit:cover">` : '▧'}</div>
          <div style="margin-top:10px;font-weight:600">${esc(x.name)}</div>
          <div class="faint" style="font-size:.76rem">${esc(x.tags || '')}</div>
          <div style="margin-top:8px"><button class="btn btn-sm btn-ghost" data-action="content-img-del" data-id="${x.id}">删除</button></div>
        </div>`).join('')}</div>`;
  }

  function knowledgeView(c) {
    c.innerHTML = `
      ${pageHead('知识库', '品牌资料与行业知识沉淀')}
      <div class="card">
        <div class="card-head"><h3>添加知识条目</h3></div>
        <div class="card-body"><div class="form-grid">
          ${cInput('标题', 'c-know-title', '品牌定位')}
          ${cSelect('类型', 'c-know-type', ['品牌资料', '行业知识', '产品能力', '案例数据'])}
          <div class="form-group full"><label>内容</label><textarea id="c-know-content" rows="3" placeholder="直接写出可被 AI 引用的表述"></textarea></div>
        </div><div style="margin-top:14px"><button class="btn btn-primary" data-action="content-know-add">添加</button></div></div>
      </div>
      <div class="card">
        <div class="card-head"><h3>知识条目</h3><span class="hint">${contentStore.knowledge.length} 条</span></div>
        <div class="card-body">${contentStore.knowledge.map(x => `<div class="mention-item"><div class="mi-head"><span class="mi-src">${esc(x.title)}</span>${badge(x.type, 'violet')}</div><div class="mi-text">${esc(x.content)}</div><div style="text-align:right;margin-top:6px"><button class="btn btn-sm btn-ghost" data-action="content-know-del" data-id="${x.id}">删除</button></div></div>`).join('') || empty('暂无知识条目')}</div>
      </div>`;
  }

  function urlImportView(c) {
    c.innerHTML = `
      ${pageHead('URL 导入', '从网址抓取内容与素材进入素材中心')}
      <div class="card">
        <div class="card-head"><h3>导入配置</h3></div>
        <div class="card-body"><div class="form-grid">
          <div class="form-group full"><label>目标 URL（每行一个）</label><textarea id="c-url-src" rows="4" placeholder="https://…/article-1&#10;https://…/article-2"></textarea></div>
          ${cSelect('导入分类', 'c-url-cat', ['官网内容', '竞品内容', '行业资讯', '品牌资料'])}
        </div><div style="margin-top:14px"><button class="btn btn-primary" data-action="content-url-add">⇣ 批量导入</button></div></div>
      </div>
      <div class="card">
        <div class="card-head"><h3>导入记录</h3></div>
        <div class="card-body flush"><div class="table-wrap"><table class="tbl"><thead><tr><th>URL</th><th>分类</th><th>状态</th><th>日期</th></tr></thead>
          <tbody>${contentStore.urlImports.map(x => `<tr><td class="mono" style="font-size:.8rem">${esc(x.url)}</td><td>${esc(x.category)}</td><td>${badge(x.status, x.status === '已导入' ? 'green' : 'amber')}</td><td class="mono" style="font-size:.8rem">${esc(x.createdAt)}</td></tr>`).join('')}</tbody>
        </table></div></div>
      </div>`;
  }

  function distManage(c) {
    const ok = contentStore.logs.filter(x => x.status === '成功').length;
    const fail = contentStore.logs.length - ok;
    c.innerHTML = `
      ${pageHead('分发管理', '把文章分发到已绑定媒体账号')}
      <div class="grid-2">
        <div class="card">
          <div class="card-head"><h3>新建分发</h3></div>
          <div class="card-body"><div class="form-grid">
            <div class="form-group full"><label>选择文章（可多选）</label><div style="max-height:180px;overflow:auto;border:1px solid var(--border-soft);border-radius:10px;padding:8px">${contentStore.articles.slice(0, 30).map(a => `<label style="display:flex;align-items:center;gap:8px;font-size:.84rem;padding:4px 2px"><input type="checkbox" data-art-pick="${a.id}">${esc(a.title)}</label>`).join('') || empty('暂无文章')}</div></div>
            <div class="form-group full"><label>目标平台</label><div style="display:flex;gap:12px;flex-wrap:wrap">${contentStore.accounts.map(a => `<label style="display:flex;align-items:center;gap:6px;font-size:.84rem"><input type="checkbox" data-dist-platform="${esc(a.platform)}" checked>${esc(a.platform)}</label>`).join('')}</div></div>
            ${cInput('定时分发（可选）', 'c-dist-time', '立即或选择时间', '', 'datetime-local')}
          </div><div style="margin-top:14px"><button class="btn btn-primary" data-action="content-dist-run">⇶ 开始分发</button></div></div>
        </div>
        <div class="card">
          <div class="card-head"><h3>分发任务</h3><span class="hint">${contentStore.distTasks.length} 个任务</span></div>
          <div class="card-body">${contentStore.distTasks.map(x => `<div class="mention-item"><div class="mi-head"><span class="mi-src">${esc(x.title)}</span>${badge(x.status, x.status === '完成' ? 'green' : 'violet')}</div><div class="mi-text">${esc(x.platform)} · ${esc(x.date)}</div></div>`).join('') || empty('暂无分发任务')}</div>
        </div>
      </div>`;
  }

  function mediaAccounts(c) {
    c.innerHTML = `
      ${pageHead('媒体账号', '管理已接入的分发账号')}
      <div class="card">
        <div class="card-head"><h3>添加账号</h3></div>
        <div class="card-body"><div class="form-grid">
          ${cSelect('平台', 'c-acc-platform', ['微信公众号', '知乎', '百家号', '小红书', '今日头条'])}
          ${cInput('账号名称', 'c-acc-name', '优引GEO')}
          ${cInput('Token / 密钥', 'c-acc-token', '用于分发鉴权', '', 'password')}
        </div><div style="margin-top:14px"><button class="btn btn-primary" data-action="content-acc-add">添加</button></div></div>
      </div>
      <div class="card">
        <div class="card-head"><h3>账号列表</h3></div>
        <div class="card-body flush"><div class="table-wrap"><table class="tbl"><thead><tr><th>平台</th><th>账号</th><th>状态</th><th></th></tr></thead>
          <tbody>${contentStore.accounts.map(x => `<tr><td>${esc(x.platform)}</td><td>${esc(x.name)}</td><td>${badge(x.status, 'green')}</td><td style="text-align:right"><button class="btn btn-sm btn-ghost" data-action="content-acc-del" data-id="${x.id}">删除</button></td></tr>`).join('')}</tbody>
        </table></div></div>
      </div>`;
  }

  function distNodes(c) {
    c.innerHTML = `
      ${pageHead('分发节点', '配置各平台分发权重与节点')}
      <div class="card">
        <div class="card-head"><h3>添加节点</h3></div>
        <div class="card-body"><div class="form-grid">
          ${cSelect('平台', 'c-node-platform', ['微信公众号', '知乎', '百家号', '小红书', '今日头条'])}
          ${cInput('节点名称', 'c-node-name', 'AI 科技频道')}
          ${cInput('权重（%）', 'c-node-weight', '50', '50', 'number')}
        </div><div style="margin-top:14px"><button class="btn btn-primary" data-action="content-node-add">添加</button></div></div>
      </div>
      <div class="card">
        <div class="card-head"><h3>节点列表</h3></div>
        <div class="card-body flush"><div class="table-wrap"><table class="tbl"><thead><tr><th>平台</th><th>节点</th><th>权重</th><th>状态</th><th></th></tr></thead>
          <tbody>${contentStore.nodes.map(x => `<tr><td>${esc(x.platform)}</td><td>${esc(x.name)}</td><td>${x.weight}%</td><td>${badge(x.status, x.status === '启用' ? 'green' : 'amber')}</td><td style="text-align:right"><button class="btn btn-sm btn-ghost" data-action="content-node-toggle" data-id="${x.id}">${x.status === '启用' ? '停用' : '启用'}</button> <button class="btn btn-sm btn-ghost" data-action="content-node-del" data-id="${x.id}">删除</button></td></tr>`).join('')}</tbody>
        </table></div></div>
      </div>`;
  }

  function distLogs(c) {
    const ok = contentStore.logs.filter(x => x.status === '成功').length;
    const fail = contentStore.logs.length - ok;
    const rate = contentStore.logs.length ? Math.round(ok / contentStore.logs.length * 100) : 0;
    c.innerHTML = `
      ${pageHead('分发日志', '每次分发的状态与结果')}
      <div class="tile-grid">
        ${tile('分发总数', contentStore.logs.length, '全部平台', '')}
        ${tile('成功', ok, '', 'up', 'grad')}
        ${tile('失败', fail, fail ? '需要重试' : '', fail ? 'down' : '')}
        ${tile('成功率', rate + '%', '近 30 天', rate >= 90 ? 'up' : '')}
      </div>
      <div class="card">
        <div class="card-head"><h3>日志</h3><span class="hint"><select id="c-log-filter" class="input" style="width:auto;display:inline-block"><option value="">全部平台</option>${[...new Set(contentStore.logs.map(x => x.platform))].map(p => `<option>${esc(p)}</option>`).join('')}</select></span><button class="btn btn-sm btn-ghost" data-action="content-log-clear">清空日志</button></div>
        <div class="card-body flush"><div class="table-wrap"><table class="tbl"><thead><tr><th>时间</th><th>内容</th><th>平台</th><th>状态</th><th>备注</th></tr></thead>
          <tbody id="c-log-body">${contentStore.logs.map(x => `<tr data-log-platform="${esc(x.platform)}"><td class="mono" style="font-size:.78rem">${esc(x.date)}</td><td>${esc(x.title)}</td><td>${esc(x.platform)}</td><td>${badge(x.status, x.status === '成功' ? 'green' : 'red')}</td><td>${esc(x.note)}</td></tr>`).join('') || '<tr><td colspan="5"><div class="empty">暂无日志</div></td></tr>'}</tbody>
        </table></div></div>
      </div>`;
  }

  function contentAction(btn) {
    const act = btn.dataset.action;
    const g = id => document.getElementById(id);
    if (act === 'content-title-fill') {
      const tpl = g('c-title-tpl') && g('c-title-tpl').value;
      if (!tpl) return toast('请先选择标题模板', 'warn');
      const kw = (g('c-kw') && g('c-kw').value.split(/[,，]/)[0]) || 'GEO';
      g('c-title').value = tpl.replace(/\{kw\}/g, kw.trim());
      return toast('标题模板已填入', 'good');
    }
    if (act === 'content-kw-fill') {
      const el = g('c-kw');
      if (!el) return;
      el.value = contentStore.keywords.map(x => x.word).join('，');
      return toast('已从关键词库填入 ' + contentStore.keywords.length + ' 个关键词', 'good');
    }
    if (act === 'content-ai-gen') {
      const title = g('c-title').value.trim() || 'AI 创作文章 ' + new Date().toLocaleDateString();
      const scene = g('c-scene').value;
      const outline = scene === '榜单文章'
        ? '1. 为什么选择标准很重要\n2. 覆盖引擎对比\n3. 平台横向对比表\n4. 选择建议'
        : scene === '问答 FAQ'
          ? 'Q1: 什么是 GEO？\nQ2: 为什么品牌需要监测 AI 可见度？\nQ3: 如何提升 AI 收录？'
          : scene === '客户案例'
            ? '1. 背景与目标\n2. 诊断发现\n3. 优化动作\n4. 结果与复盘'
            : '1. 直接给出答案\n2. 展开关键概念\n3. 数据与依据\n4. 行动建议';
      const article = {
        id: 'a' + Date.now(),
        title,
        scene,
        status: '草稿',
        createdAt: new Date().toISOString().slice(0, 10),
        content: `${title}\n\n关键词：${g('c-kw').value}\n\n${g('c-brand').value || '优引GEO系统'} 是品牌 AI 可见性诊断与监测平台。本文回答用户最关心的问题，并给出可直接引用的结论。\n\n目录：\n${outline}\n\n正文：\n- 答案前置：直接回答用户问题。\n- 数据支撑：用可验证的数字和案例说明。\n- 结构清晰：使用 H2/H3、列表与 FAQ，方便 AI 摘取。`,
      };
      contentStore.articles.unshift(article);
      contentPreview = article;
      saveContent();
      render();
      return toast('文章已生成并保存到文章管理', 'good');
    }
    if (act === 'content-batch') {
      const num = Math.max(1, +g('c-batch-num').value || 10);
      const topic = g('c-batch-topic').value.trim() || 'GEO 优化';
      for (let i = 0; i < num; i += 1) {
        contentStore.articles.unshift({ id: 'a' + Date.now() + i, title: `${topic}（批量 ${i + 1}）`, scene: g('c-batch-mode').value, status: '草稿', createdAt: new Date().toISOString().slice(0, 10), content: `${topic}（批量 ${i + 1}）\n\n答案前置。` });
      }
      saveContent();
      render();
      return toast(`已批量生成 ${num} 篇文章`, 'good');
    }
    if (act === 'content-art-del' || act === 'content-art-dist' || act === 'content-art-edit' || act === 'content-art-save' || act === 'content-art-back') {
      if (act === 'content-art-back') { contentState = { view: 'list', articleId: null }; render(); return; }
      if (act === 'content-art-edit') { contentState = { view: 'edit', articleId: btn.dataset.id }; render(); return; }
      if (act === 'content-art-save') {
        const a = contentStore.articles.find(x => x.id === btn.dataset.id);
        if (!a) return;
        a.title = g('e-title').value.trim() || a.title;
        a.scene = g('e-scene').value;
        a.status = g('e-status').value;
        const kw = g('e-kw').value.trim();
        a.content = (kw ? `关键词：${kw}\n\n` : '') + g('e-content').value;
        saveContent(); contentState = { view: 'list', articleId: null }; render();
        return toast('文章已保存', 'good');
      }
      const a = contentStore.articles.find(x => x.id === btn.dataset.id);
      if (!a) return;
      if (act === 'content-art-del') { contentStore.articles = contentStore.articles.filter(x => x.id !== a.id); saveContent(); render(); return toast('文章已删除', 'good'); }
      if (act === 'content-art-dist') {
        a.status = '已发布';
        const plats = contentStore.accounts.slice(0, 2).map(x => x.platform);
        contentStore.distTasks.unshift({ id: 'd' + Date.now(), title: a.title, platform: plats.join('、'), status: '完成', date: new Date().toLocaleDateString() });
        plats.forEach(p => contentLog(a.title, p, '成功', '已发布'));
        saveContent(); render();
        return toast('已加入分发并记录日志', 'good');
      }
      return;
    }
    if (act === 'content-art-batch-del') {
      const ids = [...document.querySelectorAll('[data-art-check]:checked')].map(x => x.dataset.artCheck);
      if (!ids.length) return toast('请先勾选文章', 'warn');
      contentStore.articles = contentStore.articles.filter(x => !ids.includes(x.id));
      saveContent(); render();
      return toast('已删除 ' + ids.length + ' 篇文章', 'good');
    }
    if (act === 'content-clone-add') {
      contentStore.clones.unshift({ id: 'c' + Date.now(), source: g('c-clone-src').value.trim() || '未填写', platform: g('c-clone-platform').value, topic: g('c-clone-topic').value.trim() || '未命名主题', scope: g('c-clone-scope').value, status: '分析中' });
      saveContent(); render();
      return toast('复刻任务已创建', 'good');
    }
    if (act === 'content-kw-add') {
      const w = g('c-kw-word').value.trim();
      if (!w) return toast('请填写关键词', 'warn');
      contentStore.keywords.push({ id: 'k' + Date.now(), word: w, group: g('c-kw-group').value });
      saveContent(); render(); return toast('关键词已添加', 'good');
    }
    if (act === 'content-kw-bulk') {
      const group = g('c-kw-bulk-group').value;
      const words = g('c-kw-bulk').value.split(/\n/).map(x => x.trim()).filter(Boolean);
      const exist = new Set(contentStore.keywords.map(x => x.word + '|' + x.group));
      let added = 0;
      words.forEach(w => {
        if (!exist.has(w + '|' + group)) {
          contentStore.keywords.push({ id: 'k' + Date.now() + added, word: w, group });
          exist.add(w + '|' + group);
          added += 1;
        }
      });
      saveContent(); render();
      return toast(`批量导入完成：新增 ${added} 个，跳过重复 ${words.length - added} 个`, 'good');
    }
    if (act === 'content-kw-del') { contentStore.keywords = contentStore.keywords.filter(x => x.id !== btn.dataset.id); saveContent(); render(); return; }
    if (act === 'content-title-add') {
      const t = g('c-title-text').value.trim();
      if (!t) return toast('请填写标题模板', 'warn');
      contentStore.titles.push({ id: 't' + Date.now(), title: t, scene: g('c-title-scene').value });
      saveContent(); render(); return toast('标题已添加', 'good');
    }
    if (act === 'content-title-del') { contentStore.titles = contentStore.titles.filter(x => x.id !== btn.dataset.id); saveContent(); render(); return; }
    if (act === 'content-title-use') {
      const t = contentStore.titles.find(x => x.id === btn.dataset.id);
      if (!t) return;
      const kw = contentStore.keywords[0]?.word || 'GEO';
      contentPrefill = { title: t.title.replace(/\{kw\}/g, kw) };
      go('ai-create');
      render();
      return toast('标题模板已带入 AI 创作', 'good');
    }
    if (act === 'content-img-add') {
      contentStore.images.push({ id: 'i' + Date.now(), name: g('c-img-name').value.trim() || '未命名素材', url: g('c-img-url').value.trim(), tags: g('c-img-tags').value.trim() });
      saveContent(); render(); return toast('图片素材已添加', 'good');
    }
    if (act === 'content-img-del') { contentStore.images = contentStore.images.filter(x => x.id !== btn.dataset.id); saveContent(); render(); return; }
    if (act === 'content-know-add') {
      contentStore.knowledge.push({ id: 'n' + Date.now(), title: g('c-know-title').value.trim() || '未命名', type: g('c-know-type').value, content: g('c-know-content').value.trim() });
      saveContent(); render(); return toast('知识条目已添加', 'good');
    }
    if (act === 'content-know-del') { contentStore.knowledge = contentStore.knowledge.filter(x => x.id !== btn.dataset.id); saveContent(); render(); return; }
    if (act === 'content-url-add') {
      const urls = g('c-url-src').value.split(/\n/).map(x => x.trim()).filter(Boolean);
      if (!urls.length) return toast('请填写至少一个 URL', 'warn');
      urls.forEach((u, i) => contentStore.urlImports.unshift({ id: 'u' + Date.now() + i, url: u, category: g('c-url-cat').value, status: '已导入', createdAt: new Date().toISOString().slice(0, 10) }));
      saveContent(); render(); return toast(`已导入 ${urls.length} 个 URL`, 'good');
    }
    if (act === 'content-dist-run') {
      const ids = [...document.querySelectorAll('[data-art-pick]:checked')].map(x => x.dataset.artPick);
      const arts = contentStore.articles.filter(x => ids.includes(x.id));
      if (!arts.length) return toast('请先勾选文章', 'warn');
      const plats = [...document.querySelectorAll('[data-dist-platform]:checked')].map(x => x.dataset.distPlatform);
      if (!plats.length) return toast('请选择分发平台', 'warn');
      const when = g('c-dist-time') ? g('c-dist-time').value : '';
      arts.forEach(a => {
        a.status = '已发布';
        contentStore.distTasks.unshift({ id: 'd' + Date.now() + a.id, title: a.title, platform: plats.join('、'), status: '完成', date: new Date().toLocaleDateString(), when: when || '立即' });
        plats.forEach(p => contentLog(a.title, p, '成功', when ? '定时分发 ' + when : '分发完成'));
      });
      saveContent(); render();
      return toast(`已分发 ${arts.length} 篇文章到 ${plats.length} 个平台`, 'good');
    }
    if (act === 'content-acc-add') {
      const tokenVal = g('c-acc-token') ? g('c-acc-token').value.trim() : '';
      contentStore.accounts.push({ id: 'ac' + Date.now(), platform: g('c-acc-platform').value, name: g('c-acc-name').value.trim() || '未命名', token: tokenVal ? '••••' + tokenVal.slice(-4) : '', status: tokenVal ? '已绑定' : '待授权' });
      saveContent(); render(); return toast('媒体账号已添加', 'good');
    }
    if (act === 'content-acc-del') { contentStore.accounts = contentStore.accounts.filter(x => x.id !== btn.dataset.id); saveContent(); render(); return; }
    if (act === 'content-node-add') {
      contentStore.nodes.push({ id: 'nd' + Date.now(), platform: g('c-node-platform').value, name: g('c-node-name').value.trim() || '默认节点', weight: +g('c-node-weight').value || 50, status: '启用' });
      saveContent(); render(); return toast('分发节点已添加', 'good');
    }
    if (act === 'content-node-del') { contentStore.nodes = contentStore.nodes.filter(x => x.id !== btn.dataset.id); saveContent(); render(); return; }
    if (act === 'content-node-toggle') {
      const n = contentStore.nodes.find(x => x.id === btn.dataset.id);
      if (n) { n.status = n.status === '启用' ? '停用' : '启用'; saveContent(); render(); }
      return;
    }
    if (act === 'content-log-clear') { contentStore.logs = []; saveContent(); render(); return toast('日志已清空', 'good'); }
  }

  /* ═══ 引用列表组件 ═══ */
  function mentionList(list) {
    if (!list.length) return empty();
    return list.map(x => `
      <div class="mention-item">
        <div class="mi-head">
          <span class="mi-src">${esc(x.title)}</span>
          ${badge(engName(x.engine), x.mentioned ? 'green' : 'amber')}
          ${badge(x.scenario, 'violet')}
          ${badge(x.sentiment === 'positive' ? '正面' : x.sentiment === 'negative' ? '负面' : '中性', x.sentiment === 'positive' ? 'green' : x.sentiment === 'negative' ? 'red' : '')}
        </div>
        <div class="mi-text">${esc(x.snippet)}</div>
        <div style="font-size:.72rem;color:var(--text-3);margin-top:6px;font-family:monospace">${x.date} · ${esc(x.source)}</div>
      </div>`).join('');
  }

  /* ═══ 保存设置 ═══ */
  function saveSettings() {
    const g = id => document.getElementById(id);
    const s = D().settings;
    overlay = overlay || {};
    const nb = overlay.brand = {};
    nb.name = g('f-name').value;
    nb.website = g('f-site').value;
    nb.industry = g('f-ind').value;
    nb.description = g('f-desc').value;
    nb.keywords = g('f-kw').value.split(/[,，]/).map(x => x.trim()).filter(Boolean);
    if (window.Account && Account.user) {
      Account.saveBrand(nb).then(r => toast(r.ok ? '品牌设置已保存到账号' : (r.error || '保存失败'), r.ok ? 'good' : 'err'));
      return;
    }
    saveOverlay();
    toast('品牌设置已保存（本地）', 'good');
  }

  function saveMonitor() {
    const g = id => document.getElementById(id);
    const apiSel = g('m-api');
    if (apiSel) {
      const opt = (window.YOUYIN_API_OPTIONS || {})[apiSel.value];
      if (opt) {
        localStorage.setItem('youyin-api', opt);
        toast('API 服务已切换，正在重新加载…', 'good');
        setTimeout(() => location.reload(), 600);
        return;
      }
    }
    overlay = overlay || {};
    const nm = overlay.monitor = {};
    nm.frequency = g('m-freq').value;
    nm.question_batch = +g('m-batch').value || 3;
    nm.history_days = +g('m-days').value || 30;
    const notify = nm.notify = { email: g('m-n-mail').checked, mention_drop: g('m-n-drop').checked, score_threshold: 5 };
    // engine toggles
    overlay.engines = (effSettings().engines || []).map(e => ({ ...e, enabled: document.querySelector(`[data-engine="${e.id}"]`) ? document.querySelector(`[data-engine="${e.id}"]`).checked : e.enabled }));
    saveOverlay();
    render();
    toast('监测设置已保存', 'good');
  }

  /* ═══ 模拟立即监测 ═══ */
  function runMonitor() {
    const btn = document.querySelector('[data-action="runmon"]');
    const topBtn = document.getElementById('btnRunMonitor');
    const disable = b => { if (b) { b.disabled = true; b.innerHTML = '⏳ 监测中…'; } };
    const restore = b => { if (b) { b.disabled = false; b.innerHTML = '立即监测'; } };
    disable(btn); disable(topBtn);
    toast('已触发监测：正在依次询问 6 个引擎…');
    // 模拟执行：1.5s 后完成并更新数据
    setTimeout(() => {
      const v = D().visibility;
      v.score_delta = Math.round((Math.random() * 4) + 1);
      v.overall_score = Math.min(98, v.overall_score + v.score_delta);
      const today = new Date();
      const iso = today.toISOString().slice(0, 10);
      v.history.push({ label: iso.slice(5), date: iso, score: v.overall_score });
      if (v.history.length > 40) v.history.shift();
      D().meta.updated_at = today.toTimeString().slice(0, 8) + '（手动触发）';
      // 引用新增一条
      if (D().citations) {
        D().citations.unshift({ id: 'c-new', date: iso, engine: 'deepseek', scenario: '推荐', source: 'AI 问答', title: '推荐一家做GEO优化的平台', snippet: '…优引GEO系统作为全链路GEO平台，被再次主动推荐…', url: '#', sentiment: 'positive', mentioned: true });
        D().citations = D().citations.slice(0, 12);
      }
      render();
      restore(btn); restore(topBtn);
      toast('监测完成：得分 ' + v.overall_score + '（+' + v.score_delta + '），数据已更新', 'good');
    }, 1500);
  }

  /* ═══ 优化闭环 MVP ═══ */
  function optimizeFlywheel(c) {
    if (!window.Account || !Account.user) {
      c.innerHTML = pageHead('优化闭环', '检测 → 建议 → 生成 → 分发 → 归因')
        + `<div class="card"><div class="card-body">${empty('请先登录客户账号后使用优化闭环')}</div></div>`;
      return;
    }
    c.innerHTML = pageHead('优化闭环', '检测 → 建议 → 生成 → 分发 → 归因') + loading();
    loadFlywheel(c);
  }

  async function loadFlywheel(c) {
    const r = await Account.api('/api/me/optimize/flywheel');
    if (!r.ok) {
      c.innerHTML = pageHead('优化闭环', '检测 → 建议 → 生成 → 分发 → 归因')
        + `<div class="card"><div class="card-body">${empty(esc(r.error || '加载失败'))}</div></div>`;
      return;
    }
    renderFlywheel(c, r);
  }

  function renderFlywheel(c, f) {
    const rep = f.report;
    const tasks = f.tasks || {};
    const contents = f.contents || {};
    const dist = f.distribution || {};
    const att = f.attribution || {};
    const steps = f.steps || {};
    const stepBadge = (ok, label) => badge(label, ok ? 'green' : 'amber');
    c.innerHTML = `
      ${pageHead('优化闭环', '检测 → 建议 → 生成 → 分发 → 归因', '<button class="btn btn-sm btn-ghost" data-action="flywheel-refresh">刷新</button>')}
      <div class="grid" style="grid-template-columns:repeat(4,1fr)">
        ${tile('当前得分', rep ? rep.score + ' ' + (rep.grade || '') : '--', rep ? (rep.date || '') : '未检测', rep ? '' : '')}
        ${tile('优化任务', tasks.total || 0, '待处理 ' + (tasks.pending || 0), '')}
        ${tile('内容', contents.total || 0, '草稿 ' + (contents.drafts || 0) + ' · 已发布 ' + (contents.published || 0), '')}
        ${tile('被 AI 引用', contents.citation_count || 0, '分发 ' + (dist.total || 0) + ' 次', 'up')}
      </div>
      <div class="grid grid-2" style="margin-top:16px">
        <div class="card">
          <div class="card-head"><h3>1. 检测</h3>${stepBadge(steps.detect, steps.detect ? '已检测' : '未检测')}</div>
          <div class="card-body">
            ${rep ? `<div>最近报告：<b>${esc(rep.slug || '')}</b> · 得分 ${rep.score}（${rep.grade || ''}）${rep.score_delta != null ? ' · 较上次 ' + (rep.score_delta > 0 ? '+' : '') + rep.score_delta : ''}</div>` : `<div class="muted">还没有报告，去「GEO 诊断」跑一次。</div>`}
            <div style="margin-top:12px"><button class="btn btn-primary" data-action="flywheel-plan">2. 从报告生成优化任务</button></div>
          </div>
        </div>
        <div class="card">
          <div class="card-head"><h3>2/3. 建议与生成</h3>${stepBadge(steps.plan, steps.plan ? '已有任务' : '未生成')}</div>
          <div class="card-body">
            <div class="form-group"><label>选择优化任务</label><select id="fw-task" class="input">${(f.tasksList || []).map(t => `<option value="${esc(t.id)}">${esc(t.title)}</option>`).join('') || '<option value="">暂无任务</option>'}</select></div>
            <div style="margin-top:8px"><button class="btn btn-primary" data-action="flywheel-gen">AI 生成内容草稿</button></div>
          </div>
        </div>
        <div class="card">
          <div class="card-head"><h3>4. 手动分发</h3>${stepBadge(steps.distribute, steps.distribute ? '已分发' : '未分发')}</div>
          <div class="card-body">
            <div class="form-grid">
              <div class="form-group"><label>选择内容</label><select id="fw-content" class="input">${(f.contentsList || []).map(x => `<option value="${esc(x.id)}">${esc(x.title)} · ${esc(x.status)}</option>`).join('') || '<option value="">暂无内容</option>'}</select></div>
              <div class="form-group"><label>平台</label><input id="fw-platform" class="input" placeholder="知乎 / 百家号 / 公众号"></div>
              <div class="form-group"><label>发布 URL</label><input id="fw-url" class="input" placeholder="https://..."></div>
            </div>
            <div style="margin-top:8px"><button class="btn btn-primary" data-action="flywheel-dist">标记已发布</button></div>
          </div>
        </div>
        <div class="card">
          <div class="card-head"><h3>5. 监测归因</h3>${stepBadge(steps.attribution, steps.attribution ? '已匹配引用' : '待归因')}</div>
          <div class="card-body">
            <div>已匹配 <b>${att.matched || 0}</b> 条 AI 引用</div>
            <div style="margin-top:12px"><button class="btn btn-primary" data-action="flywheel-attrib">运行引用归因</button></div>
            <div class="mention-list" style="margin-top:12px">${(att.citations || []).slice(0, 6).map(x => `<div class="mention-item"><div class="mi-head"><span class="mi-src">${esc(x.content_id || '')}</span>${badge(x.engine || '', 'violet')}</div><div class="mi-text">${esc(x.scenario || '')} · ${esc(x.url || '')}</div></div>`).join('') || empty('暂无匹配')}</div>
          </div>
        </div>
      </div>`;
  }

  async function flywheelAction(act) {
    if (!window.Account || !Account.user) return toast('请先登录', 'warn');
    if (act === 'flywheel-plan') {
      const r = await Account.api('/api/me/optimize/plan', { method: 'POST' });
      toast(r.ok ? '已生成 ' + (r.created || 0) + ' 个优化任务' : (r.error || '生成失败'), r.ok ? 'good' : 'err');
    } else if (act === 'flywheel-gen') {
      const taskId = document.getElementById('fw-task')?.value;
      if (!taskId) return toast('请先选择优化任务', 'warn');
      const r = await Account.api('/api/me/content/generate', { method: 'POST', body: JSON.stringify({ task_id: taskId }) });
      toast(r.ok ? '草稿已生成：' + (r.content?.title || '') : (r.error || '生成失败'), r.ok ? 'good' : 'err');
    } else if (act === 'flywheel-dist') {
      const contentId = document.getElementById('fw-content')?.value;
      const platform = document.getElementById('fw-platform')?.value.trim();
      const url = document.getElementById('fw-url')?.value.trim();
      if (!contentId || !platform || !url) return toast('请填写内容、平台和 URL', 'warn');
      const r = await Account.api('/api/me/distribute', { method: 'POST', body: JSON.stringify({ content_id: contentId, platform, url }) });
      toast(r.ok ? '已标记发布到 ' + platform : (r.error || '分发失败'), r.ok ? 'good' : 'err');
    } else if (act === 'flywheel-attrib') {
      const r = await Account.api('/api/me/optimize/attribution', { method: 'POST' });
      toast(r.ok ? '归因完成，匹配 ' + (r.matched || 0) + ' 条引用' : (r.error || '归因失败'), r.ok ? 'good' : 'err');
    }
    render();
  }

  /* ═══ 全局事件 ═══ */
  function bindEvents() {
    document.getElementById('content').addEventListener('click', e => {
      const run = e.target.closest('[data-action="runmon"]');
      if (run) return runMonitor();
      if (e.target.closest('[data-action="diag-start"]')) return startDiag();
      if (e.target.closest('[data-action="diag-again"]')) {
        diagState.mode = 'input'; diagState.report = null; render(); return;
      }
      const fwBtn = e.target.closest('[data-action^="flywheel-"]');
      if (fwBtn) return flywheelAction(fwBtn.dataset.action);
      if (e.target.closest('[data-action="save-brand"]')) return saveSettings();
      if (e.target.closest('[data-action="save-monitor"]')) return saveMonitor();
      const cBtn = e.target.closest('[data-action^="content-"]');
      if (cBtn) return contentAction(cBtn);
      if (e.target.closest('[data-action="add-scenario"]')) {
        const name = document.getElementById('sc-name').value.trim();
        const q = document.getElementById('sc-q').value.trim();
        if (!name || !q) return toast('请填写场景名称与提问模板', 'warn');
        overlay = overlay || {};
        const arr = overlay.scenarios = [...(effSettings().scenarios || [])];
        arr.push({ id: 's-' + Date.now(), name, question: q, desc: '', weight: +document.getElementById('sc-weight').value || 0.2 });
        saveOverlay(); render();
        toast('场景已添加', 'good');
      }
      const del = e.target.closest('[data-del]');
      if (del) {
        overlay = overlay || {};
        overlay.scenarios = (effSettings().scenarios || []).filter(s => s.id !== del.dataset.del);
        saveOverlay(); render();
        toast('场景已删除', 'good');
      }
    });
    document.getElementById('content').addEventListener('input', e => {
      if (e.target && e.target.id === 'c-art-q') {
        const body = document.getElementById('c-art-body');
        const status = document.getElementById('c-art-status') ? document.getElementById('c-art-status').value : '';
        if (body) body.innerHTML = contentArtRows(e.target.value, status);
      }
    });
    document.getElementById('content').addEventListener('change', e => {
      const t = e.target;
      if (t && t.id === 'c-art-all') {
        document.querySelectorAll('[data-art-check]').forEach(x => x.checked = t.checked);
        return;
      }
      if (t && t.id === 'c-art-status') {
        const body = document.getElementById('c-art-body');
        const q = document.getElementById('c-art-q') ? document.getElementById('c-art-q').value : '';
        if (body) body.innerHTML = contentArtRows(q, t.value);
        return;
      }
      if (t && t.id === 'c-img-file' && t.files && t.files[0]) {
        const file = t.files[0];
        if (file.size > 2 * 1024 * 1024) return toast('图片超过 2MB，请压缩后上传', 'warn');
        const reader = new FileReader();
        reader.onload = () => {
          contentStore.images.unshift({ id: 'i' + Date.now(), name: file.name.replace(/\.[^.]+$/, '') || '本地图片', url: reader.result, tags: '本地' });
          saveContent(); render();
          toast('图片已上传到图片库', 'good');
        };
        reader.readAsDataURL(file);
        return;
      }
      if (t && t.id === 'c-log-filter') {
        const f = t.value;
        document.querySelectorAll('#c-log-body tr').forEach(tr => {
          tr.style.display = (!f || tr.dataset.logPlatform === f) ? '' : 'none';
        });
      }
    });
    document.getElementById('btnRunMonitor').addEventListener('click', runMonitor);
    document.getElementById('menuToggle').addEventListener('click', () => {
      document.getElementById('sidebar').classList.add('open');
      document.getElementById('scrim').classList.add('show');
    });
    document.getElementById('scrim').addEventListener('click', () => {
      document.getElementById('sidebar').classList.remove('open');
      document.getElementById('scrim').classList.remove('show');
    });
    window.addEventListener('hashchange', render);
  }

  /* ═══ 启动 ═══ */
  async function boot() {
    loadOverlay();
    await DataStore.load();
    bindEvents();
    window.__renderApp = render;
    await Account.init();
    if (!location.hash) location.hash = '#/diagnose';
    render();
    document.getElementById('sysMeta').textContent = DataStore.meta();
  }

  boot();
})();
