/* 优引GEO · 客户账号模块（登录/注册/客户数据空间） */
const Account = (() => {
  'use strict';
  const API = 'http://localhost:8788';
  const TOKEN_KEY = 'youyin-token';
  let token = localStorage.getItem(TOKEN_KEY) || '';
  let user = null;

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  async function api(path, opts = {}) {
    const headers = { ...(opts.headers || {}) };
    if (token) headers.Authorization = 'Bearer ' + token;
    if (opts.body) headers['Content-Type'] = 'application/json';
    try {
      const res = await fetch(API + path, { ...opts, headers });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401 && token) {
        token = '';
        user = null;
        localStorage.removeItem(TOKEN_KEY);
        render();
      }
      return data;
    } catch (e) {
      return { error: '无法连接本地账号服务（node scripts/diag-server.js）', offline: true };
    }
  }

  function setSession(data) {
    if (!data || !data.token) return;
    token = data.token;
    user = data.user;
    localStorage.setItem(TOKEN_KEY, token);
  }

  async function init() {
    if (!token) { render(); return; }
    const r = await api('/api/auth/me');
    if (r.ok && r.user) {
      user = r.user;
      const m = await api('/api/me/monitor-data');
      if (m.ok && m.data && window.DataStore) {
        DataStore.loadAccount(m.data, user.email);
      }
    }
    render();
    if (window.__renderApp) window.__renderApp();
  }

  async function login(email, password) {
    const r = await api('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    if (r.ok) { setSession(r); await afterLogin(); }
    return r;
  }

  async function register(payload) {
    const r = await api('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) });
    if (r.ok) { setSession(r); await afterLogin(); }
    return r;
  }

  async function afterLogin() {
    const m = await api('/api/me/monitor-data');
    if (m.ok && m.data && window.DataStore) {
      DataStore.loadAccount(m.data, user.email);
    }
    closeModal();
    render();
    if (window.__renderApp) window.__renderApp();
  }

  async function logout() {
    await api('/api/auth/logout', { method: 'POST' });
    token = '';
    user = null;
    localStorage.removeItem(TOKEN_KEY);
    render();
    if (window.__renderApp) window.__renderApp();
  }

  async function saveBrand(brand) {
    if (!token) return { error: '未登录' };
    const r = await api('/api/me/brand', { method: 'PUT', body: JSON.stringify({ brand }) });
    if (r.ok && r.user) user = r.user;
    return r;
  }

  function render() {
    const host = document.getElementById('accountArea');
    if (!host) return;
    host.innerHTML = user
      ? `<span style="font-size:.78rem;color:var(--text-2)">${esc(user.name)}</span><button class="btn btn-sm btn-ghost" id="acct-logout">退出</button>`
      : `<button class="btn btn-sm btn-ghost" id="acct-login">登录 / 注册</button>`;
    const loginBtn = document.getElementById('acct-login');
    const logoutBtn = document.getElementById('acct-logout');
    if (loginBtn) loginBtn.addEventListener('click', showModal);
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
  }

  function showModal() {
    closeModal();
    const wrap = document.createElement('div');
    wrap.id = 'acct-modal';
    wrap.style.cssText = 'position:fixed;inset:0;z-index:99;background:rgba(5,6,15,.7);display:grid;place-items:center;padding:20px';
    wrap.innerHTML = `
      <div style="width:min(420px,100%);background:#131324;border:1px solid #24243c;border-radius:14px;padding:24px;color:#e4e4ef">
        <div style="display:flex;align-items:center;justify-content:space-between">
          <h3 style="margin:0">客户账号</h3>
          <button id="acct-close" style="background:none;border:0;color:#9a9ab4;font-size:1.2rem;cursor:pointer">×</button>
        </div>
        <div style="display:flex;gap:8px;margin:16px 0">
          <button class="acct-tab btn btn-sm" data-mode="login" style="flex:1">登录</button>
          <button class="acct-tab btn btn-sm" data-mode="register" style="flex:1">注册</button>
        </div>
        <div id="acct-form"></div>
        <p id="acct-err" style="color:#f87171;font-size:.8rem;min-height:1em;margin:8px 0 0"></p>
      </div>`;
    document.body.appendChild(wrap);
    wrap.addEventListener('click', e => { if (e.target === wrap) closeModal(); });
    document.getElementById('acct-close').addEventListener('click', closeModal);
    wrap.querySelectorAll('.acct-tab').forEach(b => b.addEventListener('click', () => showForm(b.dataset.mode)));
    showForm('login');
  }

  function showForm(mode) {
    const form = document.getElementById('acct-form');
    document.getElementById('acct-err').textContent = '';
    const regFields = mode === 'register' ? `
      <label style="display:block;font-size:.78rem;color:#9a9ab4;margin:10px 0 4px">姓名 / 公司</label>
      <input id="acct-name" style="width:100%;background:#0d0d1c;border:1px solid #24243c;color:#e4e4ef;border-radius:9px;padding:9px 12px">
      <label style="display:block;font-size:.78rem;color:#9a9ab4;margin:10px 0 4px">品牌名（可选）</label>
      <input id="acct-brand" style="width:100%;background:#0d0d1c;border:1px solid #24243c;color:#e4e4ef;border-radius:9px;padding:9px 12px">` : '';
    form.innerHTML = `
      ${regFields}
      <label style="display:block;font-size:.78rem;color:#9a9ab4;margin:10px 0 4px">邮箱</label>
      <input id="acct-email" type="email" style="width:100%;background:#0d0d1c;border:1px solid #24243c;color:#e4e4ef;border-radius:9px;padding:9px 12px">
      <label style="display:block;font-size:.78rem;color:#9a9ab4;margin:10px 0 4px">密码（至少 6 位）</label>
      <input id="acct-pass" type="password" style="width:100%;background:#0d0d1c;border:1px solid #24243c;color:#e4e4ef;border-radius:9px;padding:9px 12px">
      <button id="acct-submit" class="btn btn-primary" style="width:100%;margin-top:16px;padding:10px">${mode === 'login' ? '登录' : '创建账号'}</button>
      <div style="font-size:.74rem;color:#636380;margin-top:10px">账号数据按邮箱隔离，只存在本地服务。未启动服务时仍可游客体验。</div>`;
    document.getElementById('acct-submit').addEventListener('click', async () => {
      const email = document.getElementById('acct-email').value.trim();
      const password = document.getElementById('acct-pass').value;
      const err = document.getElementById('acct-err');
      let r;
      if (mode === 'login') r = await login(email, password);
      else r = await register({ name: document.getElementById('acct-name').value.trim(), email, password, brand: { name: document.getElementById('acct-brand').value.trim() || undefined } });
      if (r.error) { err.textContent = r.error; if (r.offline) document.getElementById('acct-submit').disabled = true; }
    });
  }

  function closeModal() {
    const m = document.getElementById('acct-modal');
    if (m) m.remove();
  }

  return { init, login, register, logout, saveBrand, api, get token() { return token; }, get user() { return user; } };
})();
