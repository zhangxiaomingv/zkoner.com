/** 404 页 — 根布局直接渲染（无 main/footer），补一个兜底 */
export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-5 pt-16">
      <div className="text-center">
        <p className="font-mono text-sm text-faint tabular">404</p>
        <h1 className="display mt-4 text-2xl text-text sm:text-3xl">
          这一页不存在
        </h1>
        <p className="mt-3 text-sm text-muted">
          可能是链接写错了，或是内容搬了家。
        </p>
        <a href="/" className="btn btn-ghost btn-sm mt-8">
          回到首页
        </a>
      </div>
    </main>
  );
}
