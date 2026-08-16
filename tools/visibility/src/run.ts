import "dotenv/config";
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { questions, providers, passThreshold } from "../config.js";
import { query } from "./providers.js";
import { extract } from "./extract.js";
import { score } from "./score.js";
import { crosscheck } from "./crosscheck.js";
import { renderMarkdown } from "./report.js";
import type { IndexData, Observation, RunSummary } from "./types.js";

const here = process.cwd();
const runDir = path.resolve(here, "data/runs");
const crossDir = path.resolve(here, "data/crosschecks");
const reportDir = path.resolve(here, "data/reports");
const indexFile = path.resolve(here, "data/index.json");
const today = new Date().toISOString().slice(0, 10);

/** 一次运行：问题集 × 模型源 → 观测；交叉验证 → 结果；落盘 → 报告 */
async function main(): Promise<void> {
  mkdirSync(runDir, { recursive: true });
  mkdirSync(reportDir, { recursive: true });

  // 1. 采集 + 分析（全量并行：4 问 × 多源一起发，耗时≈最慢单次）
  const tasks = questions.flatMap((q) =>
    providers.map(async (p) => {
      const r = await query(p, q);
      const { mentionHit, consistency, sourceHit } = extract(q, r.raw);
      const total = r.raw ? score(mentionHit, consistency, sourceHit) : 0;
      return {
        ts: new Date().toISOString(),
        date: today,
        questionId: q.id,
        questionText: q.text,
        provider: p.id,
        providerLabel: p.label,
        raw: r.raw,
        error: r.error,
        mentionHit,
        consistency,
        sourceHit,
        score: total,
        pass: total >= passThreshold,
      } satisfies Observation;
    })
  );
  const observations: Observation[] = await Promise.all(tasks);

  // 2. 交叉验证
  const crosschecks = await crosscheck();

  // 3. 落盘
  const summary: RunSummary = {
    date: today,
    generatedAt: new Date().toISOString(),
    observations,
    crosschecks,
  };

  writeFileSync(
    path.join(runDir, `${today}.jsonl`),
    observations.map((o) => JSON.stringify(o)).join("\n") + "\n"
  );
  // 交叉验证结果单独落盘（供网页看板读取）
  mkdirSync(crossDir, { recursive: true });
  writeFileSync(path.join(crossDir, `${today}.json`), JSON.stringify(crosschecks, null, 2) + "\n");

  const real = observations.filter((o) => o.raw);
  const passed = real.filter((o) => o.pass);
  const index: IndexData = existsSync(indexFile)
    ? (JSON.parse(readFileSync(indexFile, "utf-8")) as IndexData)
    : { runs: [] };
  const entry = {
    date: today,
    passRate: real.length ? Math.round((passed.length / real.length) * 100) : 0,
    checked: real.length,
  };
  // 同日多次运行只保留最新一条，避免趋势重复
  const last = index.runs[index.runs.length - 1];
  if (last && last.date === today) {
    index.runs[index.runs.length - 1] = entry;
  } else {
    index.runs.push(entry);
  }
  writeFileSync(indexFile, JSON.stringify(index, null, 2) + "\n");

  const md = renderMarkdown(summary);
  writeFileSync(path.join(reportDir, `${today}.md`), md);

  // 4. 打印
  console.log(md);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("运行失败：", e);
    process.exit(1);
  });
