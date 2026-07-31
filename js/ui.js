/* 优引GEO AI监测 · UI 工具库（无依赖 SVG 图表） */

const UI = (() => {

  // ── 基础工具 ──
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function el(html) {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstChild;
  }

  // ── Toast ──
  function toast(msg, type = 'info') {
    const wrap = document.getElementById('toastWrap');
    const t = el(`<div class="toast ${type === 'good' ? 'good' : type === 'warn' ? 'warn' : type === 'err' ? 'err' : ''}">${esc(msg)}</div>`);
    wrap.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; setTimeout(() => t.remove(), 320); }, 3200);
  }

  // ── 徽章 / 状态 ──
  function badge(text, type = '') {
    return `<span class="badge ${type}">${esc(text)}</span>`;
  }

  function statusBadge(status) {
    const map = { success: ['green', '成功'], running: ['violet', '运行中'], pending: ['amber', '待执行'], failed: ['red', '失败'], enabled: ['green', '已启用'], disabled: ['red', '已停用'] };
    const [cls, label] = map[status] || ['', status];
    return badge(label, cls);
  }

  function pbar(percent, cls = '') {
    const p = Math.max(0, Math.min(100, percent));
    return `<div class="pbar"><i class="${cls}" style="width:${p}%"></i></div>`;
  }

  // ── 徽章色系 ──
  const SERIES = ['#6366F1', '#8B5CF6', '#EC4899', '#22c55e', '#f59e0b', '#06b6d4', '#a78bfa', '#fb7185'];

  // ── 折线图（面积渐变）──
  function lineChart(data, opts = {}) {
    const { width = 560, height = 210, stroke = '#8B5CF6', fill = 'rgba(139,92,246,0.18)' } = opts;
    if (!data || data.length < 2) return '<div class="empty">暂无数据</div>';
    const pad = { l: 40, r: 12, t: 16, b: 28 };
    const iw = width - pad.l - pad.r, ih = height - pad.t - pad.b;
    const vals = data.map(d => d.value);
    const min = Math.min(...vals), max = Math.max(...vals);
    const span = (max - min) || 1;
    const x = i => pad.l + (i / (data.length - 1)) * iw;
    const y = v => pad.t + ih - ((v - min) / span) * ih;
    const pts = data.map((d, i) => `${x(i).toFixed(1)},${y(d.value).toFixed(1)}`);
    const area = `M${x(0)},${(pad.t + ih).toFixed(1)} L` + pts.join(' L') + ` L${x(data.length - 1)},${(pad.t + ih).toFixed(1)} Z`;
    const gridYs = [0.25, 0.5, 0.75, 1].map(f => pad.t + ih * f);
    return `
      <svg width="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" role="img">
        ${gridYs.map(gy => `<line x1="${pad.l}" y1="${gy.toFixed(1)}" x2="${width - pad.r}" y2="${gy.toFixed(1)}" stroke="#1c1c30" stroke-width="1"/>`).join('')}
        <path d="${area}" fill="${fill}" stroke="none"/>
        <polyline points="${pts.join(' ')}" fill="none" stroke="${stroke}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
        ${pts.map((p, i) => `<circle cx="${p.split(',')[0]}" cy="${p.split(',')[1]}" r="${i === data.length - 1 ? 4.5 : 2.5}" fill="${i === data.length - 1 ? '#fff' : stroke}" stroke="${i === data.length - 1 ? stroke : 'none'}" stroke-width="2"/>`).join('')}
        ${data.map((d, i) => {
          if (i % Math.ceil(data.length / 8) !== 0 && i !== data.length - 1) return '';
          return `<text x="${x(i)}" y="${height - 8}" text-anchor="middle" font-size="10" fill="#636380" font-family="monospace">${esc(d.label)}</text>`;
        }).join('')}
        ${vals.map((v, i) => i === data.length - 1 ? `<text x="${x(i) + 8}" y="${y(v) - 6}" font-size="11" fill="#e4e4ef" font-family="monospace" font-weight="600">${v}</text>` : '').join('')}
      </svg>`;
  }

  // ── 横向条形图 ──
  function hbarChart(items, opts = {}) {
    const { width = 520, color = '#8B5CF6' } = opts;
    const max = Math.max(...items.map(i => i.value), 1);
    return `<div style="display:flex;flex-direction:column;gap:12px;">
      ${items.map(it => `
        <div>
          <div style="display:flex;justify-content:space-between;font-size:.78rem;margin-bottom:5px;">
            <span style="color:#9a9ab4;">${esc(it.label)}</span>
            <span style="color:#e4e4ef;font-family:monospace;">${it.value}${it.suffix || ''}</span>
          </div>
          <div class="pbar" style="height:8px;"><i style="width:${(it.value / max * 100).toFixed(0)}%;background:${it.color || color}"></i></div>
        </div>`).join('')}
    </div>`;
  }

  // ── 环形图 ──
  function donutChart(items, opts = {}) {
    const { size = 160 } = opts;
    const total = items.reduce((s, i) => s + i.value, 0) || 1;
    const r = size / 2 - 12, cx = size / 2, cy = size / 2, stroke = 20;
    const circ = 2 * Math.PI * r;
    let offset = 0;
    const segs = items.map((it, idx) => {
      const frac = it.value / total;
      const seg = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${it.color || SERIES[idx % SERIES.length]}" stroke-width="${stroke}" stroke-dasharray="${(frac * circ).toFixed(1)} ${circ.toFixed(1)}" stroke-dashoffset="${(-offset).toFixed(1)}" stroke-linecap="butt"/>`;
      offset += frac * circ;
      return seg;
    });
    return `
      <div style="display:flex;align-items:center;gap:22px;flex-wrap:wrap;">
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img">
          <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#1c1c30" stroke-width="${stroke}"/>
          ${segs.join('')}
          <text x="${cx}" y="${cy - 2}" text-anchor="middle" font-size="20" font-weight="700" fill="#e4e4ef">${total}</text>
          <text x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="10" fill="#636380">总量</text>
        </svg>
        <div style="display:flex;flex-direction:column;gap:7px;font-size:.78rem;">
          ${items.map((it, i) => `<div style="display:flex;align-items:center;gap:8px;color:#9a9ab4;"><span style="width:10px;height:10px;border-radius:3px;background:${it.color || SERIES[i % SERIES.length]};display:inline-block;"></span>${esc(it.label)}<span style="color:#e4e4ef;font-family:monospace;margin-left:auto;">${it.value}</span></div>`).join('')}
        </div>
      </div>`;
  }

  // ── 雷达图（蜘蛛图）──
  function radarChart(items, opts = {}) {
    const { size = 340, max = 100, levels = 5, fill = 'rgba(139,92,246,0.25)', stroke = '#8B5CF6' } = opts;
    if (!items || items.length < 3) return '<div class="empty">暂无维度数据</div>';
    const cx = size / 2, cy = size / 2, r = size / 2 - 42;
    const n = items.length;
    const ang = i => -Math.PI / 2 + (2 * Math.PI * i) / n;
    const pt = (i, v) => {
      const a = ang(i), rad = r * v / max;
      return [cx + rad * Math.cos(a), cy + rad * Math.sin(a)];
    };
    const poly = items.map((it, i) => pt(i, it.value).map(v => v.toFixed(1)).join(',')).join(' ');
    // 网格多边形
    const grids = [];
    for (let lv = 1; lv <= levels; lv++) {
      const rad = r * lv / levels;
      const pts = items.map((it, i) => { const a = ang(i); return [cx + rad * Math.cos(a), cy + rad * Math.sin(a)].map(v => v.toFixed(1)).join(','); }).join(' ');
      grids.push(`<polygon points="${pts}" fill="none" stroke="#1c1c30" stroke-width="1"/>`);
    }
    // 轴与标签
    const axes = items.map((it, i) => {
      const a = ang(i);
      const x1 = cx, y1 = cy, x2 = cx + r * Math.cos(a), y2 = cy + r * Math.sin(a);
      const lx = cx + (r + 20) * Math.cos(a), ly = cy + (r + 20) * Math.sin(a);
      const anchor = Math.abs(Math.cos(a)) < 0.3 ? 'middle' : (Math.cos(a) > 0 ? 'start' : 'end');
      return `<line x1="${x1}" y1="${y1}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#1c1c30" stroke-width="1"/>
        <text x="${lx.toFixed(1)}" y="${(ly + 4).toFixed(1)}" text-anchor="${anchor}" font-size="11" fill="#9a9ab4">${esc(it.axis)}</text>
        <text x="${pt(i, it.value)[0].toFixed(1)}" y="${(pt(i, it.value)[1] - 6).toFixed(1)}" text-anchor="middle" font-size="10" fill="#e4e4ef" font-family="monospace">${it.value}</text>`;
    }).join('');
    return `
      <svg width="100%" viewBox="0 0 ${size} ${size}" preserveAspectRatio="xMidYMid meet" role="img">
        ${grids.join('')}
        <line x1="${cx}" y1="${cy - r}" x2="${cx}" y2="${cy + r}" stroke="#1c1c30" stroke-width="1"/>
        <line x1="${cx - r}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="#1c1c30" stroke-width="1"/>
        ${axes}
        <polygon points="${poly}" fill="${fill}" stroke="${stroke}" stroke-width="2.5" stroke-linejoin="round"/>
        ${items.map((it, i) => pt(i, it.value).map(v => v.toFixed(1)).join(',')).map((p, i) => `<circle cx="${p.split(',')[0]}" cy="${p.split(',')[1]}" r="3.5" fill="#fff" stroke="${stroke}" stroke-width="2"/>`).join('')}
      </svg>`;
  }

  // ── 空状态 ──
  function empty(text = '暂无数据') {
    return `<div class="empty">${esc(text)}</div>`;
  }

  function loading() {
    return `<div class="loading"><div class="spinner"></div>正在监测…</div>`;
  }

  return { esc, el, toast, badge, statusBadge, pbar, lineChart, hbarChart, donutChart, radarChart, empty, loading, SERIES };
})();
