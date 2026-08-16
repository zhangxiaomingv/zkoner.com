import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { passThreshold } from "../config.js";
import type { Observation, RunSummary } from "./types.js";

function row(o: Observation): string {
  if (o.error) return `| ${o.questionText} | ${o.providerLabel} | ⚠️ ${o.error} | — | — | — |`;
  return `| ${o.questionText} | ${o.providerLabel} | ${o.mentionHit ? "✅" : "❌"} | ${Math.round(
    o.consistency * 100
  )}% | ${o.sourceHit ? "✅" : "❌"} | **${o.score}** ${o.pass ? "✅" : "❌"} |`;
}

/** 渲染一次运行的 Markdown 周报 */
export function renderMarkdown(s: RunSummary): string {
  const real = s.observations.filter((o) => o.raw);
  const passed = real.filter((o) => o.pass);
  const passRate = real.length ? Math.round((passed.length / real.length) * 100) : 0;

  let md = `# AI 可见度周报 — ${s.date}\n\n`;
  md += `> 生成时间：${s.generatedAt}\n\n`;

  md += `## 总体\n\n`;
  md += `- 观测 ${s.observations.length} 次（${new Set(s.observations.map((o) => o.questionId)).size} 问 × ${new Set(
    s.observations.map((o) => o.provider)
  ).size} 源）\n`;
  md += `- 实际获得回答 ${real.length} 次，达标 ${passed.length} 次\n`;
  md += `- **达标率 ${passRate}%**（达标线 ${passThreshold} 分）\n\n`;

  md += `## 明细\n\n`;
  md += `| 问题 | 来源 | 命中品牌 | 描述一致 | 官方来源 | 得分 |\n|---|---|---|---|---|---|\n`;
  md += s.observations.map(row).join("\n") + "\n\n";

  md += `## 实体交叉验证\n\n`;
  md += `| 平台 | 状态 | 命中关键词 | 说明 |\n|---|---|---|---|\n`;
  md +=
    s.crosschecks
      .map(
        (c) =>
          `| ${c.label} | ${c.status === "ok" ? "✅ 一致" : c.status === "partial" ? "🟡 部分" : c.status === "miss" ? "❌ 未命中" : "⚠️ " + c.status} | ${
            c.hitKeywords.join("、") || "—"
          } | ${c.note ?? "—"} |`
      )
      .join("\n") + "\n\n";

  md += `## 判定标准\n\n`;
  md += `回答出现「张可能 /《遇见·可能》/ GEO / zkoner.com」任意 2 项且描述一致、来源正确 = 达标。\n`;
  md += `达标率 = 达标观测数 ÷ 实际获得回答的观测数。\n`;

  return md;
}

/** CLI 入口：`npm run report` — 重新渲染最近一次运行的周报 */
async function main(): Promise<void> {
  const runDir = path.resolve(process.cwd(), "data/runs");
  const files = readdirSync(runDir)
    .filter((f) => f.endsWith(".jsonl"))
    .sort((a, b) => statSync(path.join(runDir, b)).mtimeMs - statSync(path.join(runDir, a)).mtimeMs);
  if (!files.length) {
    console.error("暂无运行记录，先执行 npm run run");
    process.exit(1);
  }
  const latest = files[0];
  const observations = readFileSync(path.join(runDir, latest), "utf-8")
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((l) => JSON.parse(l) as Observation);
  const date = latest.replace(".jsonl", "");
  const summary: RunSummary = {
    date,
    generatedAt: "",
    observations,
    crosschecks: [],
  };
  console.log(renderMarkdown(summary));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
