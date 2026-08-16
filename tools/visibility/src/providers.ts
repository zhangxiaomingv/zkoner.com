import { execFile, execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
import type { Provider, Question } from "../config.js";

const execFileAsync = promisify(execFile);

export interface QueryResult {
  raw: string;
  error?: string;
}

/** 按 provider.kind 分发查询 */
export async function query(provider: Provider, question: Question): Promise<QueryResult> {
  switch (provider.kind) {
    case "api":
      return queryApi(provider, question.text);
    case "browser":
      return queryBrowser(provider, question.text);
    case "manual":
      return queryManual(provider, question.id);
  }
}

/* ---------- API（DeepSeek / 豆包，OpenAI 兼容） ---------- */

async function queryApi(provider: Provider, text: string): Promise<QueryResult> {
  const keyEnv = provider.apiKeyEnv ?? "DEEPSEEK_API_KEY";
  const key = process.env[keyEnv];
  if (!key) return { raw: "", error: `缺少 ${keyEnv}（在 tools/visibility/.env 或环境变量设置，开通渠道见 README）` };

  try {
    const res = await fetch(provider.baseUrl!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: provider.model,
        messages: [{ role: "user", content: text }],
        temperature: 0.2,
      }),
      signal: AbortSignal.timeout(60000),
    });
    if (!res.ok) return { raw: "", error: `API ${res.status}: ${(await res.text()).slice(0, 200)}` };
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    return { raw: data.choices?.[0]?.message?.content?.trim() ?? "" };
  } catch (e) {
    return { raw: "", error: `API 异常: ${(e as Error).message}` };
  }
}

/* ---------- 浏览器自动化（系统无头 Chrome） ---------- */

function findChrome(): string | null {
  const candidates = [
    "google-chrome",
    "google-chrome-stable",
    "chromium",
    "chromium-browser",
    "chrome",
    "brave-browser",
    "microsoft-edge",
  ];
  for (const c of candidates) {
    try {
      execFileSyncCheck(c);
      return c;
    } catch {
      /* try next */
    }
  }
  return null;
}

function execFileSyncCheck(name: string): void {
  execFileSync("which", [name], { stdio: "ignore" });
}

async function queryBrowser(provider: Provider, text: string): Promise<QueryResult> {
  const chrome = findChrome();
  if (!chrome) return { raw: "", error: "未找到系统 Chrome，浏览器自动化不可用（可改用 manual 源）" };

  const url = provider.urlTemplate!.replace("{query}", encodeURIComponent(text));
  try {
    // 异步 execFile：不阻塞事件循环，可并行多个源；stderr 丢弃，静默 GPU 噪音
    // 注：Node 运行时 execFile 透传 spawn 的 stdio 选项，但 @types 定义滞后 → 交叉类型补上
    const execOpts = {
      encoding: "utf-8" as const,
      timeout: 25000,
      maxBuffer: 32 * 1024 * 1024,
      stdio: ["ignore", "pipe", "ignore"] as const,
    } as import("node:child_process").ExecFileOptions & { stdio: ["ignore", "pipe", "ignore"] };
    const { stdout: dom } = await (execFileAsync(
      chrome,
      [
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--disable-software-rasterizer",
        "--virtual-time-budget=6000",
        "--dump-dom",
        url,
      ],
      execOpts
    ) as Promise<{ stdout: string; stderr: string }>);
    const cleaned = dom
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (!cleaned) return { raw: "", error: "浏览器抓取为空（可能需登录/页面动态渲染）" };
    return { raw: cleaned.slice(0, 8000) };
  } catch (e) {
    return { raw: "", error: `浏览器自动化失败: ${(e as Error).message.slice(0, 200)}` };
  }
}

/* ---------- 手动（粘贴 AI 回答到 data/manual/{providerId}-{questionId}.txt） ---------- */

function queryManual(provider: Provider, questionId: string): QueryResult {
  const file = path.resolve(process.cwd(), "data/manual", `${provider.id}-${questionId}.txt`);
  if (!existsSync(file)) {
    return { raw: "", error: `手动回答文件不存在，请粘贴到 ${file}` };
  }
  return { raw: readFileSync(file, "utf-8").trim() };
}
