import { crosscheckTargets, type CrosscheckTarget } from "../config.js";
import type { CrosscheckResult } from "./types.js";

const UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

/** 读取 GitHub 仓库 README 原文 */
async function githubReadme(repo: string): Promise<string> {
  const res = await fetch(`https://api.github.com/repos/${repo}/readme`, {
    headers: { Accept: "application/vnd.github.raw+json", "User-Agent": "zkoner-visibility" },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  return await res.text();
}

/** 抓取普通网页正文（反爬时抛 blocked 语义错误） */
async function fetchPage(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, "Accept-Language": "zh-CN,zh;q=0.9" },
    signal: AbortSignal.timeout(20000),
  });
  if (res.status === 403 || res.status === 429) throw new Error("被反爬拦截，需浏览器自动化");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.text();
}

/** 对单个目标执行交叉验证 */
async function checkOne(t: CrosscheckTarget): Promise<CrosscheckResult> {
  let content: string;
  try {
    content = t.kind === "github-repo" ? await githubReadme(t.value) : await fetchPage(t.value);
  } catch (e) {
    const msg = (e as Error).message;
    const status = msg.includes("反爬") ? "blocked" : "error";
    return { id: t.id, label: t.label, status, hitKeywords: [], note: msg.slice(0, 120) };
  }

  const hit = t.expect.filter((k) => content.includes(k));
  if (hit.length === t.expect.length) {
    return {
      id: t.id,
      label: t.label,
      status: "ok",
      hitKeywords: hit,
      note: "全部关键词一致，实体信号统一",
    };
  }
  return {
    id: t.id,
    label: t.label,
    status: hit.length ? "partial" : "miss",
    hitKeywords: hit,
    note: hit.length ? `部分命中：${hit.join("、")}` : "未命中任何关键词",
  };
}

/** 交叉验证全部目标平台 */
export async function crosscheck(): Promise<CrosscheckResult[]> {
  const results: CrosscheckResult[] = [];
  for (const t of crosscheckTargets) {
    results.push(await checkOne(t));
  }
  return results;
}
