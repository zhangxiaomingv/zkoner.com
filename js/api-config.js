/* 优引GEO · API 地址配置
 * 默认连本机 diag-server；部署 Cloudflare Worker 后，在浏览器控制台执行：
 * localStorage.setItem('youyin-api', 'https://youyin-api.xxx.workers.dev')
 */
window.YOUYIN_API = (function () {
  try { return localStorage.getItem('youyin-api') || 'http://localhost:8788'; }
  catch (e) { return 'http://localhost:8788'; }
})();
