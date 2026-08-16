# 张可能 — 个人品牌官网

> 让每一次相遇，都产生新的可能。

AI 顾问、AI 时代个人创业探索者、企业 AI 转型观察者。本仓库是张可能的**长期数字身份节点（Personal Brand Hub）**——不是介绍页，而是可随内容、项目、思考持续生长的平台。

## 技术栈

| 层 | 选型 | 说明 |
|---|---|---|
| 框架 | Next.js 15 (App Router) + React 19 | `output: "export"` 纯静态导出 |
| 样式 | Tailwind CSS v4 | 设计 token 集中在 `globals.css` 的 `@theme` |
| 语言 | TypeScript | 严格模式 |
| 托管 | Cloudflare Pages（项目 `youyin-console`） | `/out` 静态部署 + `wrangler` |

## 快速开始

```bash
npm install
npm run dev        # 本地开发 http://localhost:3000
npm run build      # 静态导出到 /out
```

## 目录结构

```
src/
├── app/
│   ├── layout.tsx       # 全局布局 + SEO/OG/schema.org Person
│   ├── page.tsx         # 首页七个区块组装
│   └── globals.css      # 设计系统：色彩/字体/动效 token
├── components/          # 区块组件（Header/Hero/About/…/Footer）
└── content/             # ★ 内容数据层（站点信息/服务/节目/项目/文章）
public/
├── robots.txt / sitemap.xml / llms.txt
├── _headers / .nojekyll / favicon.svg / og-cover.png
scripts/
└── og-cover.html        # OG 图源文件（用无头 Chrome 生成 PNG）
```

## 内容管理（未来 10 年升级路径）

所有内容集中在 `src/content/`，**改数据即可增删内容，无需动组件**：

| 内容 | 文件 | 说明 |
|---|---|---|
| 个人连接 / 品牌信息 | `site.ts` | 改一处全局生效 |
| AI 顾问服务 | `services.ts` | 服务卡片动态增减 |
| 《遇见·可能》节目 | `episodes.ts` | 记录企业探访/访谈/案例 |
| 可能实验项目 | `projects.ts` | 项目动态增加，头部追加即可 |
| AI 时代观察文章 | `posts.ts` | 静态首期，未来接 CMS |

**未来接入规划**（均基于现有数据层，零重构）：
- 博客系统 / CMS → 替换 `posts.ts` 为 CMS API 调用
- AI 知识库 → 每个内容文件生成 llms.txt 片段 / 结构化 Markdown
- 项目数据库 → `projects.ts` 扩展字段或接数据库

## 设计系统

- **风格**：深色电影感 · Apple 级简洁 · Linear 科技感 · Notion 知识感 · 纪录片品牌感
- **主色**：近黑 `#0a0a0b` / 银白 `#f5f5f6` / 次级 `#a1a1aa` / 弱 `#82828c`
- **点缀**：科技蓝 `#4c8dff`（文字/线条/微光）、`#2563eb`（按钮实底）
- **字体**：系统字体栈（PingFang SC / Noto Sans SC）+ 等宽字体做区块编号
- **原则**：黑白灰为主，科技蓝克制点缀，杜绝廉价渐变与过度科技元素

### 可访问性（已达标）
- 全部文字对比度 ≥ 4.5:1（AA）
- `prefers-reduced-motion` 适配
- 焦点可见、跳过链接、语义化标题层级、键盘导航

## 部署

真实托管是 **Cloudflare Pages**（项目 `youyin-console`，持有 zkoner.com 域名），使用 wrangler 直接上传：

```bash
npm run build                                          # 生成 /out
npx wrangler pages deploy out --project-name youyin-console --branch main
```

> 唯一部署入口就是 `youyin-console`。GitHub Actions 工作流（`deploy.yml`）和 `public/CNAME` 已移除——GitHub Pages 不承载 zkoner.com，Cloudflare 项目 `zkoner-com`（Git 自动构建）也未绑定自定义域名，均不生效。

## 联系

- 邮箱：hello@zkoner.com
- 微信公众号：遇见·可能
