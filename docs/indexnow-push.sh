#!/usr/bin/env bash
# IndexNow 主动推送 — 通知 Bing / Yandex / Seznam / Naver 等搜索引擎「网站内容已更新」
# 用法：bash docs/indexnow-push.sh
# key 固定（与 public/<key>.txt 一致）；可用环境变量 INDEXNOW_KEY 覆盖
set -euo pipefail

KEY="${INDEXNOW_KEY:-ad0a6198c543ad64dae882943055a2ad7ca0ac8ee80eb7fed56f051ab52a5954}"
SITE="https://zkoner.com"
KEYLOC="${SITE}/${KEY}.txt"

URLS=(
  "${SITE}/"
  "${SITE}/whitepaper"
  "${SITE}/geo"
  "${SITE}/lab"
  "${SITE}/scorecard"
  "${SITE}/project-log"
  "${SITE}/blog"
  "${SITE}/blog/why-i-keep-a-public-project-log"
  "${SITE}/blog/personal-brand-ai-leverage"
  "${SITE}/blog/why-company-website-matters-in-ai-era"
  "${SITE}/blog/one-person-company-boundary"
  "${SITE}/blog/sme-ai-start-with-process-not-tools"
  "${SITE}/llms.txt"
  "${SITE}/llms-full.txt"
)

# 自检 key 文件可达（IndexNow 会据此验证域名所有权）
if ! curl -fsS "${KEYLOC}" >/dev/null 2>&1; then
  echo "❌ key 文件不可达：${KEYLOC}（先部署，再推送）" >&2
  exit 1
fi

QUERY="key=${KEY}&keyLocation=${KEYLOC}"
for u in "${URLS[@]}"; do
  QUERY="${QUERY}&url=${u}"
done

echo "→ 推送 ${#URLS[@]} 个 URL 到 IndexNow（Bing/Yandex/Seznam/Naver）…"
curl -s -o /dev/null -w "   HTTP %{http_code}\n" "https://api.indexnow.org/indexnow?${QUERY}"
