#!/usr/bin/env bash
# 部署后一键通知搜索引擎「网站内容已更新」
# 用法：
#   bash docs/push-all.sh                    # Bing ping + IndexNow（百度跳过）
#   BAIDU_TOKEN=xxx bash docs/push-all.sh    # 再加百度主动推送
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"

echo "① Bing sitemap ping"
curl -fsS "https://www.bing.com/ping?sitemap=https://zkoner.com/sitemap.xml" >/dev/null 2>&1 \
  && echo "   ok" || echo "   ping 非 200（Bing 偶发，可重跑忽略）"

echo "② IndexNow（Bing / Yandex / Seznam / Naver）"
bash "${DIR}/indexnow-push.sh"

echo "③ 百度主动推送"
if [[ -n "${BAIDU_TOKEN:-}" ]]; then
  BAIDU_TOKEN="${BAIDU_TOKEN}" bash "${DIR}/baidu-push.sh"
else
  echo "   未设置 BAIDU_TOKEN，跳过。拿到 token 后：BAIDU_TOKEN=xxx bash docs/push-all.sh"
fi

echo "✔ 全部完成"
