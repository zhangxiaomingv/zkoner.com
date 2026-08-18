#!/usr/bin/env bash
# 百度主动推送（链接提交 API）— 通知百度「网站内容已更新」
# 用法：BAIDU_TOKEN="你的token" bash docs/baidu-push.sh
# token 获取：ziyuan.baidu.com → 用户中心 → 站点管理 → 链接提交 → 主动推送（需先验证站点）
set -euo pipefail

TOKEN="${BAIDU_TOKEN:?请设置 BAIDU_TOKEN：先在 ziyuan.baidu.com 验证站点后，到「链接提交 → 主动推送」复制 token，再 BAIDU_TOKEN=xxx bash docs/baidu-push.sh}"
SITE="https://zkoner.com"

URLS=$(cat <<'EOF'
https://zkoner.com/
https://zkoner.com/whitepaper
https://zkoner.com/geo
https://zkoner.com/lab
https://zkoner.com/scorecard
https://zkoner.com/blog
https://zkoner.com/blog/personal-brand-ai-leverage
https://zkoner.com/blog/why-company-website-matters-in-ai-era
https://zkoner.com/blog/one-person-company-boundary
https://zkoner.com/blog/sme-ai-start-with-process-not-tools
EOF
)

echo "→ 推送 URL 到百度…"
curl -s -H 'Content-Type:text/plain' --data-binary "$URLS" \
  "http://data.zz.baidu.com/urls?site=${SITE}&token=${TOKEN}"
echo
