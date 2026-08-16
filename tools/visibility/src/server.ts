import "dotenv/config";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import type { IndexData, Observation, CrosscheckResult } from "./types.js";

/**
 * 检测系统 — 网页看板
 * 零依赖：Node 内置 http，监听 0.0.0.0，局域网/手机可访问。
 *  `GET /`             看板页面
 *  `GET /api/overview` 最新一次检测 + 趋势 + 交叉验证
 *  `POST /api/run`     触发一次完整检测（完成后看板自动刷新）
 */

const PORT = Number(process.env.PORT || 8788);
const here = process.cwd();
const runDir = path.join(here, "data/runs");
const crossDir = path.join(here, "data/crosschecks");
const indexFile = path.join(here, "data/index.json");

let running = false;

interface Overview {
  running: boolean;
  date: string | null;
  observations: Observation[];
  crosschecks: CrosscheckResult[];
  index: IndexData;
}

function readIndex(): IndexData {
  if (!existsSync(indexFile)) return { runs: [] };
  return JSON.parse(readFileSync(indexFile, "utf-8")) as IndexData;
}

function latestFile(dir: string, ext: string): string | null {
  if (!existsSync(dir)) return null;
  const files = readdirSync(dir)
    .filter((f) => f.endsWith(ext))
    .sort((a, b) => statSync(path.join(dir, b)).mtimeMs - statSync(path.join(dir, a)).mtimeMs);
  return files[0] ?? null;
}

function getOverview(): Overview {
  const run = latestFile(runDir, ".jsonl");
  const observations = run
    ? readFileSync(path.join(runDir, run), "utf-8")
        .trim()
        .split("\n")
        .filter(Boolean)
        .map((l) => JSON.parse(l) as Observation)
    : [];

  const crossFile = latestFile(crossDir, ".json");
  const crosschecks = crossFile
    ? (JSON.parse(readFileSync(path.join(crossDir, crossFile), "utf-8")) as CrosscheckResult[])
    : [];

  return {
    running,
    date: run ? run.replace(".jsonl", "") : null,
    observations,
    crosschecks,
    index: readIndex(),
  };
}

function runDetection(): Promise<void> {
  return new Promise((resolve) => {
    const p = spawn("npm", ["run", "run"], { cwd: here, stdio: "inherit" });
    p.on("close", (code) => {
      console.log(`[检测系统] 本次检测结束，退出码 ${code}`);
      resolve();
    });
    p.on("error", (e) => {
      console.error("[检测系统] 启动检测失败：", e);
      resolve();
    });
  });
}

function lanIP(): string {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] ?? []) {
      if (net.family === "IPv4" && !net.internal) return net.address;
    }
  }
  return "127.0.0.1";
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

  if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/index.html")) {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(page());
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/overview") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(getOverview()));
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/run") {
    if (running) {
      res.writeHead(409, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ ok: false, message: "检测已在进行中" }));
      return;
    }
    running = true;
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ ok: true, message: "检测已开始，完成后看板自动刷新" }));
    void runDetection().finally(() => {
      running = false;
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Not Found");
});

server.listen(PORT, "0.0.0.0", () => {
  const ip = lanIP();
  console.log("\n========== 检测系统 ==========");
  console.log(`  本机访问:   http://localhost:${PORT}`);
  console.log(`  局域网访问: http://${ip}:${PORT}`);
  console.log("  （手机连同一 Wi-Fi 直接打开上面的局域网地址）");
  console.log("================================\n");
});

/* ---------- 看板页面 ---------- */

function page(): string {
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>检测系统 — AI 可见度监测</title>
<style>
  :root {
    --bg:#0a0a0b; --surface:#101013; --surface2:#16161a;
    --border:rgba(255,255,255,.08); --text:#f5f5f6;
    --muted:#a1a1aa; --faint:#82828c; --accent:#4c8dff; --green:#34d399; --red:#f87171;
  }
  * { box-sizing:border-box; margin:0; padding:0; }
  body { background:var(--bg); color:var(--text); font-family:"PingFang SC","Noto Sans CJK SC",system-ui,sans-serif; line-height:1.6; }
  .wrap { max-width:960px; margin:0 auto; padding:24px 16px 64px; }
  header { display:flex; align-items:flex-end; justify-content:space-between; flex-wrap:wrap; gap:12px; padding:16px 0 24px; border-bottom:1px solid var(--border); }
  h1 { font-size:22px; font-weight:600; letter-spacing:-.01em; }
  h1 small { color:var(--accent); font-size:13px; margin-left:10px; font-weight:400; }
  .meta { color:var(--faint); font-size:12px; margin-top:4px; font-family:ui-monospace,monospace; }
  .actions { display:flex; gap:8px; }
  button { background:var(--accent); color:#fff; border:0; border-radius:8px; padding:8px 14px; font-size:13px; cursor:pointer; }
  button.ghost { background:var(--surface2); color:var(--text); border:1px solid var(--border); }
  button:disabled { opacity:.5; cursor:not-allowed; }
  .cards { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:12px; margin:20px 0; }
  .card { background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:16px; }
  .card .num { font-size:34px; font-weight:650; letter-spacing:-.02em; }
  .card .lab { color:var(--faint); font-size:12px; margin-top:2px; }
  .ok { color:var(--green); } .bad { color:var(--red); }
  h2 { font-size:15px; color:var(--muted); margin:28px 0 10px; font-weight:600; }
  .chart { display:flex; align-items:flex-end; gap:8px; height:120px; padding:12px 0; }
  .bar { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:flex-end; gap:4px; height:100%; }
  .bar .col { width:100%; max-width:34px; background:var(--accent); border-radius:4px 4px 0 0; opacity:.85; }
  .bar .col:last-child { opacity:1; }
  .bar .v { font-size:11px; color:var(--faint); font-family:ui-monospace,monospace; }
  .bar .d { font-size:10px; color:var(--faint); }
  table { width:100%; border-collapse:collapse; font-size:13px; background:var(--surface); border:1px solid var(--border); border-radius:14px; overflow:hidden; }
  th,td { padding:9px 10px; text-align:left; border-bottom:1px solid var(--border); vertical-align:top; }
  th { color:var(--faint); font-weight:500; font-size:12px; background:var(--surface2); }
  tr:last-child td { border-bottom:0; }
  .tag { display:inline-block; padding:1px 8px; border-radius:999px; font-size:11px; }
  .tag.y { background:rgba(76,141,255,.15); color:var(--accent); }
  .tag.g { background:rgba(52,211,153,.12); color:var(--green); }
  .tag.r { background:rgba(248,113,113,.12); color:var(--red); }
  .tag.m { background:rgba(248,113,113,.12); color:var(--muted); }
  .err { color:var(--red); font-size:12px; }
  .raw { margin-top:8px; }
  details { background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:0 12px; margin-bottom:8px; }
  summary { cursor:pointer; padding:10px 0; font-size:13px; color:var(--muted); }
  summary b { color:var(--text); }
  .rawbody { color:var(--muted); font-size:13px; padding:0 0 12px; white-space:pre-wrap; max-height:220px; overflow:auto; }
  .statusline { color:var(--accent); font-size:12px; margin-top:10px; min-height:18px; }
  .footer { margin-top:40px; color:var(--faint); font-size:11px; border-top:1px solid var(--border); padding-top:14px; }
</style>
</head>
<body>
<div class="wrap">
  <header>
    <div>
      <h1>检测系统<small>AI 可见度监测 · 张可能</small></h1>
      <div class="meta" id="meta">加载中…</div>
    </div>
    <div class="actions">
      <button class="ghost" onclick="load()">刷新</button>
      <button id="runBtn" onclick="run()">立即检测</button>
    </div>
  </header>

  <div class="statusline" id="status"></div>

  <div class="cards">
    <div class="card"><div class="num" id="rate">—</div><div class="lab">最新达标率</div></div>
    <div class="card"><div class="num" id="pass">—</div><div class="lab">达标 / 有回答</div></div>
    <div class="card"><div class="num" id="checked">—</div><div class="lab">观测次数</div></div>
    <div class="card"><div class="num" id="runs">—</div><div class="lab">累计运行</div></div>
  </div>

  <h2>达标率趋势</h2>
  <div class="chart" id="chart">—</div>

  <h2>明细（最近一次）</h2>
  <div id="detail">—</div>

  <h2>实体交叉验证</h2>
  <div id="cross">—</div>

  <h2>AI 原始回答</h2>
  <div class="raw" id="raw">—</div>

  <div class="footer">检测系统 · tools/visibility · 达标线 60 分 · 数据源 DeepSeek / 豆包 API · 浏览器 · 手动</div>
</div>

<script>
function esc(s){return (s||"").replace(/[&<>]/g,function(c){return c==='&'?'&amp;':c==='<'?'&lt;':c==='>'?'&gt;':c;});}
function tag(s){return s==="ok"?'<span class="tag g">一致</span>':s==="partial"?'<span class="tag y">部分</span>':s==="miss"?'<span class="tag r">未命中</span>':s==="blocked"?'<span class="tag m">拦截</span>':'<span class="tag m">错误</span>';}

async function load(){
  try {
    const r = await fetch('/api/overview');
    const d = await r.json();
    render(d);
  } catch(e){ document.getElementById('status').textContent='加载失败：'+e; }
}

function render(d){
  const real = d.observations.filter(function(o){return o.raw;});
  const passed = real.filter(function(o){return o.pass;});
  const rate = real.length ? Math.round(passed.length/real.length*100) : 0;
  document.getElementById('meta').textContent = d.date ? '最近检测：' + d.date + ' · ' + d.observations.length + ' 次观测' : '尚无检测记录';
  document.getElementById('rate').textContent = d.date ? rate + '%' : '—';
  document.getElementById('rate').className = 'num ' + (rate>=60?'ok':rate>0?'':'bad');
  document.getElementById('pass').textContent = d.date ? passed.length + ' / ' + real.length : '—';
  document.getElementById('checked').textContent = d.date ? d.observations.length : '—';
  document.getElementById('runs').textContent = d.index.runs.length;
  renderChart(d.index.runs);
  renderDetail(d.observations);
  renderCross(d.crosschecks);
  renderRaw(d.observations);
  const status = d.running ? '检测进行中，完成后自动刷新…' : '';
  document.getElementById('status').textContent = status;
  document.getElementById('runBtn').disabled = d.running;
}

function renderChart(runs){
  const el = document.getElementById('chart');
  if(!runs.length){ el.textContent='尚无趋势数据'; return; }
  el.innerHTML = runs.map(function(r){
    return '<div class="bar"><div class="col" style="height:'+Math.max(r.passRate,2)+'%"></div><div class="v">'+r.passRate+'%</div><div class="d">'+r.date.slice(5)+'</div></div>';
  }).join('');
}

function renderDetail(obs){
  const el = document.getElementById('detail');
  if(!obs.length){ el.textContent='尚无数据'; return; }
  let h = '<table><tr><th>问题</th><th>来源</th><th>命中品牌</th><th>描述一致</th><th>官方来源</th><th>得分</th></tr>';
  obs.forEach(function(o){
    if(o.error){ h += '<tr><td>'+esc(o.questionText)+'</td><td>'+esc(o.providerLabel)+'</td><td class="err" colspan="4">⚠️ '+esc(o.error)+'</td></tr>'; return; }
    h += '<tr><td>'+esc(o.questionText)+'</td><td>'+esc(o.providerLabel)+'</td>'
      + '<td>'+(o.mentionHit?'<span class="tag g">命中</span>':'<span class="tag r">未命中</span>')+'</td>'
      + '<td>'+Math.round(o.consistency*100)+'%</td>'
      + '<td>'+(o.sourceHit?'<span class="tag g">命中</span>':'<span class="tag r">未命中</span>')+'</td>'
      + '<td><b>'+o.score+'</b> '+(o.pass?'<span class="tag g">达标</span>':'<span class="tag r">未达标</span>')+'</td></tr>';
  });
  h += '</table>';
  el.innerHTML = h;
}

function renderCross(list){
  const el = document.getElementById('cross');
  if(!list.length){ el.textContent='尚无交叉验证数据'; return; }
  el.innerHTML = '<table><tr><th>平台</th><th>状态</th><th>命中关键词</th><th>说明</th></tr>'
    + list.map(function(c){
        return '<tr><td>'+esc(c.label)+'</td><td>'+tag(c.status)+'</td><td>'+esc(c.hitKeywords.join('、')||'—')+'</td><td>'+esc(c.note||'—')+'</td></tr>';
      }).join('') + '</table>';
}

function renderRaw(obs){
  const el = document.getElementById('raw');
  const real = obs.filter(function(o){return o.raw;});
  if(!real.length){ el.textContent='尚无真实回答（可点「立即检测」）'; return; }
  el.innerHTML = real.map(function(o){
    return '<details><summary><b>'+esc(o.questionText)+'</b> · '+esc(o.providerLabel)+' · '+o.score+'分</summary><div class="rawbody">'+esc(o.raw)+'</div></details>';
  }).join('');
}

async function run(){
  const btn = document.getElementById('runBtn');
  btn.disabled = true;
  document.getElementById('status').textContent = '检测进行中（约 30–90 秒）…';
  try {
    const r = await fetch('/api/run',{method:'POST'});
    const d = await r.json();
    document.getElementById('status').textContent = d.message;
    if(d.ok){ poll(); }
  } catch(e){ document.getElementById('status').textContent='触发失败：'+e; btn.disabled=false; }
}

function poll(){
  setTimeout(async function(){
    const r = await fetch('/api/overview');
    const d = await r.json();
    if(d.running){ poll(); return; }
    render(d);
  }, 3000);
}

load();
</script>
</body>
</html>`;
}
