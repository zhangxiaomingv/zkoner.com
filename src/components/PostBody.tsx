/**
 * 极简 markdown 渲染器（零依赖）
 *
 * 支持子集：# / ## / ### 标题、空行分段、> 引用、- / 1. 列表、[text](url) 链接、
 * **粗体**、`code`、`|---|` 表格、``` 围栏代码块、`---` 分隔线。
 * 安全：内容先 HTML 转义再注入（dangerouslySetInnerHTML），正文为站内一手内容。
 *
 * 刻意不支持：*italic*（中文全文下易误伤）、图片、嵌套列表。
 * 约定：正文内勿在 `code` 中再用 ** 或 [ ]，勿用反引号嵌套。
 */

type Block =
  | { type: "h1"; html: string }
  | { type: "h2"; html: string }
  | { type: "h3"; html: string }
  | { type: "p"; html: string }
  | { type: "quote"; html: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "hr" }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "pre"; html: string };

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** 在已转义文本上做行内格式化（顺序：链接 → 粗体 → 行内代码） */
function inline(escaped: string): string {
  return escaped
    .replace(
      /\[([^\]]+)\]\(([^)\s]+)\)/g,
      '<a href="$2" class="link-underline text-accent">$1</a>'
    )
    .replace(
      /\*\*([^*]+)\*\*/g,
      '<strong class="font-semibold text-text">$1</strong>'
    )
    .replace(
      /`([^`]+)`/g,
      '<code class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[0.9em] text-accent">$1</code>'
    );
}

export function parseMarkdown(src: string): Block[] {
  const lines = src.replace(/\r/g, "").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  const flushParagraph = (buf: string[]) => {
    if (buf.length) {
      blocks.push({ type: "p", html: inline(esc(buf.join("\n"))) });
      buf.length = 0;
    }
  };

  const isMarker = (l: string) =>
    /^#{1,3}\s/.test(l) ||
    /^>\s?/.test(l) ||
    /^-\s+/.test(l) ||
    /^\d+\.\s+/.test(l) ||
    /^-{3,}\s*$/.test(l) ||
    l.trim().startsWith("|") ||
    l.trim().startsWith("```");

  const isSepRow = (cells: string[]) =>
    cells.length > 0 && cells.every((c) => /^:?-{3,}:?$/.test(c));

  while (i < lines.length) {
    const line = lines[i];

    if (/^\s*$/.test(line)) {
      i++;
      continue;
    }

    const h1 = line.match(/^#\s+(.*)$/);
    if (h1) {
      blocks.push({ type: "h1", html: inline(esc(h1[1])) });
      i++;
      continue;
    }

    const h2 = line.match(/^##\s+(.*)$/);
    if (h2) {
      blocks.push({ type: "h2", html: inline(esc(h2[1])) });
      i++;
      continue;
    }

    const h3 = line.match(/^###\s+(.*)$/);
    if (h3) {
      blocks.push({ type: "h3", html: inline(esc(h3[1])) });
      i++;
      continue;
    }

    if (/^-{3,}\s*$/.test(line)) {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    if (line.trim().startsWith("|")) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        buf.push(lines[i]);
        i++;
      }
      const parsed = buf.map((l) =>
        l
          .trim()
          .replace(/^\|/, "")
          .replace(/\|$/, "")
          .split("|")
          .map((c) => c.trim())
      );
      const firstData = parsed.findIndex((r) => !isSepRow(r));
      const headers = firstData >= 0 ? parsed[firstData] : [];
      const rows = parsed.slice(firstData + 1).filter((r) => !isSepRow(r));
      blocks.push({ type: "table", headers, rows });
      continue;
    }

    if (line.trim().startsWith("```")) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        buf.push(lines[i]);
        i++;
      }
      i++;
      blocks.push({ type: "pre", html: esc(buf.join("\n")) });
      continue;
    }

    if (/^>\s?/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      blocks.push({ type: "quote", html: inline(esc(buf.join("\n"))) });
      continue;
    }

    if (/^-\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^-\s+/.test(lines[i])) {
        items.push(inline(esc(lines[i].replace(/^-\s+/, ""))));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(inline(esc(lines[i].replace(/^\d+\.\s+/, ""))));
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    // 普通段落：收集到空行或下一个块标记为止
    const buf: string[] = [];
    while (i < lines.length && !/^\s*$/.test(lines[i]) && !isMarker(lines[i])) {
      buf.push(lines[i]);
      i++;
    }
    flushParagraph(buf);
  }

  return blocks;
}

export default function PostBody({ source }: { source: string }) {
  const blocks = parseMarkdown(source);

  return (
    <div className="space-y-5">
      {blocks.map((b, idx) => {
        switch (b.type) {
          case "h1":
            return (
              <h1
                key={idx}
                className="mt-16 border-t border-border pt-12 text-2xl font-semibold tracking-tight text-text sm:text-3xl"
                dangerouslySetInnerHTML={{ __html: b.html }}
              />
            );
          case "h2":
            return (
              <h2
                key={idx}
                className="pt-8 text-xl font-semibold tracking-tight text-text sm:text-2xl"
                dangerouslySetInnerHTML={{ __html: b.html }}
              />
            );
          case "h3":
            return (
              <h3
                key={idx}
                className="pt-4 text-lg font-medium text-text"
                dangerouslySetInnerHTML={{ __html: b.html }}
              />
            );
          case "p":
            return (
              <p
                key={idx}
                className="text-base leading-relaxed text-muted"
                dangerouslySetInnerHTML={{ __html: b.html }}
              />
            );
          case "quote":
            return (
              <blockquote
                key={idx}
                className="border-l-2 border-accent pl-4 text-[15px] leading-relaxed text-muted"
                dangerouslySetInnerHTML={{ __html: b.html }}
              />
            );
          case "ul":
            return (
              <ul key={idx} className="list-disc space-y-2 pl-5 marker:text-accent">
                {b.items.map((it, j) => (
                  <li
                    key={j}
                    className="text-base leading-relaxed text-muted"
                    dangerouslySetInnerHTML={{ __html: it }}
                  />
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol
                key={idx}
                className="list-decimal space-y-2 pl-5 marker:font-mono marker:text-faint"
              >
                {b.items.map((it, j) => (
                  <li
                    key={j}
                    className="text-base leading-relaxed text-muted"
                    dangerouslySetInnerHTML={{ __html: it }}
                  />
                ))}
              </ol>
            );
          case "hr":
            return <hr key={idx} className="my-12 border-border" />;
          case "table":
            return (
              <div key={idx} className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[560px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-border text-xs text-faint">
                      {b.headers.map((h, j) => (
                        <th key={j} className="px-4 py-3 font-mono font-normal">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, ri) => (
                      <tr key={ri} className="border-b border-border align-top">
                        {r.map((c, ci) => (
                          <td
                            key={ci}
                            className="px-4 py-3 text-sm leading-relaxed text-muted"
                          >
                            {c}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "pre":
            return (
              <div
                key={idx}
                className="overflow-x-auto rounded-xl border border-border bg-surface p-4"
              >
                <pre
                  className="whitespace-pre font-mono text-xs leading-relaxed text-muted"
                  dangerouslySetInnerHTML={{ __html: b.html }}
                />
              </div>
            );
        }
      })}
    </div>
  );
}
