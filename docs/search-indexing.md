# zkoner.com 搜索引擎与 AI 爬虫收录指南

> 2026-08-18 诊断 + 操作手册。目标：Google / 百度收录 + AI 大模型（ChatGPT / Claude / 豆包 / Perplexity）可爬。

---

## ✅ 0. Cloudflare robots.txt 冲突（已修复 2026-08-18）

> **状态：已解决。** 用户在 Cloudflare 后台 AI Crawl Control → 信号(Signals) 页关闭了「托管 robots.txt」开关。验证结果：
> - 线上 `robots.txt` 已无 `# BEGIN Cloudflare Managed` 段，本地放行规则全量生效
> - 7 种爬虫 UA（GPTBot / ClaudeBot / bytespider / Google-Extended / PerplexityBot / Googlebot / Baiduspider）访问 /whitepaper、/llms.txt、/sitemap.xml 全部 200
>
> 以下是当初的排查过程，供复现参考。

### 当时的问题：Cloudflare 注入的 robots.txt 正在屏蔽所有 AI 爬虫

**诊断结果（2026-08-18 实测 `https://zkoner.com/robots.txt`）**：

Cloudflare 在站点 robots.txt **前面**注入了一段「Cloudflare Managed Content」，内容为：

```
User-agent: GPTBot          → Disallow: /
User-agent: ClaudeBot       → Disallow: /
User-agent: Google-Extended → Disallow: /
User-agent: CCBot           → Disallow: /
User-agent: Applebot-Extended → Disallow: /
User-agent: Bytespider      → Disallow: /   ← 字节跳动（豆包训练）爬虫
User-agent: Amazonbot       → Disallow: /
User-agent: meta-externalagent → Disallow: /
User-agent: *               → Allow: /  （Content-Signal: search=yes, ai-train=no, use=reference）
```

robots.txt 规则**先匹配先生效**。因此本地文件里的 `GPTBot: Allow /` 等对 AI 爬虫**全部失效**。

**影响**：
- ❌ ChatGPT（GPTBot）、Claude（ClaudeBot）、豆包训练（Bytespider）、Gemini/Grounding（Google-Extended）、Common Crawl（CCBot，多数 LLM 训练数据源）**全部无法爬取 zkoner.com**
- ❌ 与你「AI 可见度/GEO」战略直接冲突：你正在做的实验对象（豆包）自己的爬虫都被挡了
- ✅ 传统搜索仍正常：googlebot / Baiduspider / bingbot 未在禁用名单，走 `User-agent: *` 的 Allow

**修复（Cloudflare 控制台，需要你操作）**：

找到入口（三选一，中文面板常保留英文名，别纠结翻译）：
- **直连地址**：`dash.cloudflare.com/?to=你的账号/zkoner.com/ai` → **AI Crawl Control**（旧名 AI Audit / 中文「AI 爬虫控制」）页
- 后台顶部**搜索框**搜 `robots` 或 `AI`
- **Security Settings** 页 → 筛选 **Bot traffic** → 「Set your preference to block training in robots.txt」开关

具体操作：
1. 进 **AI Crawl Control** 页（直连地址最稳）。
2. 找到 **「Managed robots.txt」卡片**（蓝色开关）→ **关闭**。这就是往 robots.txt 前面注入 AI 爬虫 Disallow 的元凶。
3. 顺手检查另外两个 AI 爬虫开关（Cloudflare 有三个独立开关，只关一个不够）：
   - **Block AI Bots**（安全 → Bots 的防火墙层拦截）→ 若开启则关闭
   - **AI Labyrinth**（蜜罐，喂 AI 爬虫假链接）→ 若开启则关闭（与 GEO 冲突）
4. 等待约 30 秒，刷新验证：`curl https://zkoner.com/robots.txt` 应只剩本地文件内容（带 `Sitemap:` 行），无 `# BEGIN Cloudflare Managed`。

> 注意：Cloudflare 自 2025 年中起对**新接入的域名默认屏蔽已知 AI 爬虫**，所以必须显式放行你想要的（本文件顶部 `public/robots.txt` 已写好放行规则，关掉 Managed robots 后即生效）。

> 关闭后，你本地 `public/robots.txt` 里对 GPTBot/ClaudeBot/Bytespider/CCBot 等显式 `Allow: /` 才会真正生效。

---

## 1. 已完成 / 已验证（2026-08-18）

- ✅ `robots.txt` 本地文件：放行所有爬虫 + 显式放行全部主流 AI 爬虫 + 声明 `Sitemap`（待 Cloudflare 修复后生效）
- ✅ `sitemap.xml` 线上 200，含首页 / /geo / /lab / /scorecard / /blog / 4 篇博文 / **/whitepaper**（共 10 个 URL）
- ✅ Googlebot UA 访问首页 200（传统 Google 搜索收录路径通畅）
- ✅ Bing sitemap ping 已提交（`https://www.bing.com/ping?sitemap=https://zkoner.com/sitemap.xml`）
- ✅ **IndexNow 已配置**（2026-08-18）：key 文件 `https://zkoner.com/<key>.txt` 已托管，见下文 §5
- ✅ **推送脚本已就绪**：`docs/indexnow-push.sh`（IndexNow）+ `docs/baidu-push.sh`（百度，需 token）+ `docs/push-all.sh`（部署后一键三推）
- ✅ 白皮书已上线 `https://zkoner.com/whitepaper`，含 `Report` JSON-LD，内部链接：Footer（全站）+ /geo + /lab + /scorecard 的 CTA

---

## 2. Google 收录（手动，约 10 分钟）

Google 没有公开的 sitemap ping 接口（已废弃），正确路径是 Search Console：

1. 打开 [Google Search Console](https://search.google.com/search-console) → 添加资源。
2. 推荐用 **「网域」** 属性（输入 `zkoner.com`），验证方式选 **DNS 记录**：
   - 复制给出的 `TXT` 记录 → 在 Cloudflare 控制台该域名的 DNS 里加一条 TXT → 返回验证。
   - （因为域名 DNS 已在 Cloudflare，这是最快方式，不用改代码。）
3. 验证通过后：左侧 **站点地图** → 输入 `https://zkoner.com/sitemap.xml` → 提交。
4. 可选加速：左侧 **网址检查** → 粘贴 `https://zkoner.com/whitepaper` → 请求编入索引；重复处理 /geo、/lab、/scorecard。
5. 收录时效：新站通常数天到数周，sitemap + 站内链接越密越快。

> 若你更愿意用 meta 标签验证，把验证码给我，我加进 `src/app/layout.tsx` 的 `<head>` 后重新部署。

---

## 3. 百度收录（手动 + 一个脚本）

百度没有公开 sitemap ping，走「百度搜索资源平台」：

1. 注册/登录 [百度搜索资源平台](https://ziyuan.baidu.com) → 用户中心 → **站点管理 → 添加站点**，填 `https://zkoner.com/`。
2. **验证站点**（三选一，推荐 CNAME 或 TXT，DNS 在 Cloudflare 直接加）：
   - 文件验证：下载验证 HTML 文件 → 放到 `public/` 交给部署（我可以代放）。
   - CNAME / TXT 验证：在 Cloudflare DNS 里加一条。
3. 验证通过后：**普通收录 → sitemap** → 提交 `https://zkoner.com/sitemap.xml`。
4. （可选，需权限）**快速收录** 或 **主动推送（API）**：在资源平台拿 token 后，跑 `docs/baidu-push.sh`：

```bash
# 用法：先在资源平台 → 链接提交 → 主动推送 复制 token
BAIDU_TOKEN="你的token" bash docs/baidu-push.sh
```

脚本内容（一次性推送全部核心 URL）：

```bash
#!/usr/bin/env bash
# 百度主动推送（需要 ziyuan.baidu.com 的 token）
set -euo pipefail
TOKEN="${BAIDU_TOKEN:?请设置 BAIDU_TOKEN}"
SITE="https://zkoner.com"
URLS=$(
cat <<'EOF'
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
curl -s -H 'Content-Type:text/plain' --data-binary "$URLS" \
  "http://data.zz.baidu.com/urls?site=${SITE}&token=${TOKEN}"
```

**重要提醒（务必知悉）**：
- 百度对**未 ICP 备案、境外主机（Cloudflare）**的站点收录偏慢、可能收录不全。zkoner.com 当前无备案，若百度长期不收，主要瓶颈在备案/机房，而不是配置。
- 备案需要国内服务器 + 主体信息，属于商业决策，可另行评估。

---

## 4. AI 大模型可见度（GEO，你真正的战场）

Google/Baidu 只是传统收录。对 GEO 而言，真正要喂的是 AI 爬虫。Cloudflare 修复后：

- **DeepSeek**：官方无独立爬虫名，靠公开网络抓取 + 合作数据源，站内 llms.txt/llms-full.txt 已就位。
- **豆包（Bytespider）**：修复 robots 后，内容会被字节爬虫抓取；llms-full.txt 全量知识库是豆包理解你的主通道。
- **ChatGPT（GPTBot / OAI-SearchBot）**、**Claude（ClaudeBot）**、**Perplexity**、**Google AI Overviews（googlebot）**：均已显式放行。
- 复测闭环：修复 robots → 等 1-2 周 → 用 GEOloop 重测「张晓明」「什么是GEO」「推荐GEO顾问」，看 Delta（对应白皮书 Experiment #002-006）。

---

## 5. IndexNow 主动推送（Bing 一族，2026-08-18 已配置）

「网站内容更新了，主动告诉搜索引擎」的标准协议。IndexNow 不需要注册，key 自生成即可，一次提交自动广播给 **Bing / Yandex / Seznam / Naver** 等（Google 不参与）。

- **key**：`ad0a6198c543ad64dae882943055a2ad7ca0ac8ee80eb7fed56f051ab52a5954`
- **key 托管文件**：`public/<key>.txt`（内容 = key 本身），部署后 `https://zkoner.com/<key>.txt` 可达即生效
- **手动提交单个 URL**：
  ```bash
  curl "https://api.indexnow.org/indexnow?url=https://zkoner.com/whitepaper&key=<key>&keyLocation=https://zkoner.com/<key>.txt"
  ```
- **一键全量推送**（含全部核心 URL + llms）：
  ```bash
  bash docs/indexnow-push.sh
  ```

> 换新 key 的做法：重新生成 → 替换 `public/<key>.txt` + 更新 `docs/indexnow-push.sh` 顶部 KEY → 部署 → 推送。旧 key 作废（IndexNow 只认新 key 文件）。

---

## 6. 一键推送（部署后执行）

每次更新部署完成后，跑一次即可同时通知 Bing/百度：

```bash
bash docs/push-all.sh                 # Bing sitemap ping + IndexNow
BAIDU_TOKEN=xxx bash docs/push-all.sh # 再加百度主动推送
```

---

## 7. 一句话行动清单

1. **[必须]** Cloudflare 关掉 Content Signals 的 Managed robots.txt（否则 AI 爬虫全挡）。
2. **[必须]** Google Search Console 域名验证 + 提交 sitemap。
3. **[建议]** 百度资源平台验证 + 提交 sitemap（接受无备案可能慢的现实）。
4. **[建议]** 部署后跑 `bash docs/push-all.sh` 主动通知 Bing/百度。
5. **[建议]** 1-2 周后跑 GEOloop 复测，把结果写进成绩单 #2 与白皮书更新。
