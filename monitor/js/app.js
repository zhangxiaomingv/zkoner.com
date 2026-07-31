/* 优引GEO AI监测控制台 · 主应用 */
(() => {
  'use strict';

  /* ═══ 菜单结构（仅监测与监控系统）═══ */
  const MENU = [
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
    { group: '设置', items: [
      { id: 'brand',          label: '品牌设置',    icon: '♛' },
      { id: 'scenario-cfg',   label: '场景管理',    icon: '❏' },
      { id: 'monitor-cfg',    label: '监测设置',    icon: '⚙' },
    ]},
  ];

  const NAV_TITLES = {};
  MENU.forEach(g => g.items.forEach(i => { NAV_TITLES[i.id] = { label: i.label, group: g.group }; }));

  const D = () => DataStore.get();
  const { esc, toast, badge, statusBadge, pbar, lineChart, hbarChart, donutChart, empty, loading, SERIES } = UI;

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
    const h = location.hash.replace(/^#\/?/, '');
    return NAV_TITLES[h] ? h : 'overview';
  }
  function go(id) {
    location.hash = '#/' + id;
  }
  function render() {
    const id = parseHash();
    renderSidebar(id);
    const t = NAV_TITLES[id];
    document.getElementById('crumb').innerHTML = `${esc(t.group)} <span style="color:#636380">/</span> <b>${esc(t.label)}</b>`;
    const content = document.getElementById('content');
    const views = { overview, visibility, competitors, citations, articles, scenarios, contentView, suggestions, tasks, brand, scenarioCfg, monitorCfg };
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
    c.innerHTML = `
      ${pageHead('竞争格局', '品牌与同赛道竞品在 AI 引擎中的可见度对比 · ' + D().competitors.updated_at)}
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
      </div>`;
  }

  /* ═══ 视图：引用追踪 ═══ */
  function citations(c) {
    const list = D().citations || [];
    const pos = list.filter(x => x.sentiment === 'positive').length;
    const engines = effSettings().engines;
    const engName = id => (engines.find(e => e.id === id) || {}).name || id;
    const rows = list.map(x => `
      <div class="mention-item">
        <div class="mi-head">
          <span class="mi-src">${esc(x.title)}</span>
          ${badge(engName(x.engine), x.mentioned ? 'green' : 'amber')}
          ${badge(x.scenario, 'violet')}
          ${badge('来源 · ' + x.source, '')}
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
    saveOverlay();
    toast('品牌设置已保存（本地）', 'good');
  }

  function saveMonitor() {
    const g = id => document.getElementById(id);
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

  /* ═══ 全局事件 ═══ */
  function bindEvents() {
    document.getElementById('content').addEventListener('click', e => {
      const run = e.target.closest('[data-action="runmon"]');
      if (run) return runMonitor();
      if (e.target.closest('[data-action="save-brand"]')) return saveSettings();
      if (e.target.closest('[data-action="save-monitor"]')) return saveMonitor();
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
    if (!location.hash) location.hash = '#/overview';
    render();
    document.getElementById('sysMeta').textContent = DataStore.meta();
  }

  boot();
})();
