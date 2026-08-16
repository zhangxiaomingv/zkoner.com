# 检测系统（AI 可见度监测）

检测 / 监控 / 交叉验证「张可能」在 AI 大模型与各平台中的可见度。对应《可能实验》项目 **「AI 搜索可见度实验室」**。

## 它能做什么

| 能力 | 说明 |
|---|---|
| **检测** | 固定问题集（张可能是谁 / 提供什么服务 /《遇见·可能》是什么 / 哪家做 GEO）× 多个 AI 源 → 判定是否命中品牌、描述是否一致、是否出现官方来源 |
| **监控** | 每次运行落盘 `data/runs/YYYY-MM-DD.jsonl` + 汇总 `data/index.json`（逐日达标率趋势）+ Markdown 周报 |
| **交叉验证** | 检查 GitHub 仓库 / 微博 / 知乎 等平台是否「同名同描述」，判定实体一致性 |

## 快速开始

```bash
cd tools/visibility
npm install                          # 安装依赖
cp .env.example .env                 # 填入 DEEPSEEK_API_KEY
npm run run                          # 运行一次完整监测
npm run report                       # 重新渲染最近一次周报
```

输出：
- 终端打印 Markdown 周报
- `data/reports/YYYY-MM-DD.md` 周报文件
- `data/runs/YYYY-MM-DD.jsonl` 逐条原始观测
- `data/crosschecks/YYYY-MM-DD.json` 交叉验证结果
- `data/index.json` 趋势数据

## 打开系统页面（本地 IP / 手机）

```bash
npm run serve
```

服务监听 `0.0.0.0:8788`，启动后会打印两个地址：
- 本机：`http://localhost:8788`
- **局域网**：`http://<本机IP>:8788` —— 手机连同一 Wi-Fi 直接浏览器打开

页面上可查看趋势、明细、AI 原始回答，点「立即检测」远程触发一次完整检测（需在防火墙/路由器放行 8788 端口）。端口可用环境变量 `PORT` 修改。

## 模型源（混合采集）

| 源 | 方式 | 需要什么 |
|---|---|---|
| `deepseek` | API（稳定） | `DEEPSEEK_API_KEY`（platform.deepseek.com） |
| `doubao`（豆包） | 火山方舟 API（稳定） | `ARK_API_KEY`（console.volcengine.com/ark 开通方舟后创建） |
| `metaso` / `kimi` | 无头 Chrome 抓网页版（免费但脆弱） | 系统装有 Chrome/Chromium |
| `manual` | 手动粘贴回答 | 把回答存到 `data/manual/{providerId}-{questionId}.txt` |

> 浏览器自动化对网页版 AI 产品较脆弱（改版/风控会失败），失败会记为「⚠️」，不影响整次运行。稳定优先建议用 DeepSeek / 豆包 API；网页产品先用 `manual` 过渡。豆包模型名默认 `doubao-seed-2-0-pro-260215`（当前账号已开通，`/api/v3/models` 可查），可用环境变量 `DOUBAO_MODEL` 改为其它已开通模型名或方舟接入点 ID（ep-xxx）。

## 打分规则

`命中品牌 40 + 描述一致性 30 + 官方来源 30 = 0-100`，≥ 60 达标（`config.ts` 可调）。

## 定时运行（GitHub Actions）

仓库根目录 `.github/workflows/visibility.yml`：
- 每周一 02:00 UTC 自动运行，也可 `Actions` 页手动触发
- 需要仓库 **Secret `DEEPSEEK_API_KEY`**（Settings → Secrets and variables → Actions）
- 运行结果自动提交到仓库 `tools/visibility/data/`

## 修改配置

全部在 `tools/visibility/config.ts`：
- **问题集**：`questions`（增删问题、改关键词组、期望描述、官方 URL）
- **模型源**：`providers`（增删 API/浏览器/手动源）
- **交叉验证目标**：`crosscheckTargets`（平台 + 期望关键词）

## 达标判定（对应 docs/geo-platform-matrix.md §6）

回答出现「张可能 /《遇见·可能》/ GEO / zkoner.com」任意 2 项且描述一致、来源正确 = 达标。达标率周环比即可看 GEO 效果曲线。
