/* 优引GEO · API 地址配置
 * 默认连本机 diag-server；可在「监测设置 → API 服务」切换云端 Worker。
 */
window.YOUYIN_API_OPTIONS = {
  local: 'http://localhost:8788',
  cloud: 'https://youyin-api.243922774.workers.dev',
};
window.YOUYIN_API = (function () {
  try { return localStorage.getItem('youyin-api') || window.YOUYIN_API_OPTIONS.cloud; }
  catch (e) { return window.YOUYIN_API_OPTIONS.cloud; }
})();
