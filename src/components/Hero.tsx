import { site } from "@/content";

/**
 * 第一屏 Hero — 张可能
 * 深色电影感：近黑背景 + 顶部科技蓝微光 + 极淡网格
 */
export default function Hero() {
  return (
    <section id="top" className="hero-glow relative overflow-hidden">
      {/* 极淡网格纹理（未来感） */}
      <div className="grid-texture absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto flex min-h-svh w-full max-w-6xl flex-col justify-center px-5 py-32 sm:px-8">
        {/* 定位标签 */}
        <p className="eyebrow reveal">AI 时代个人创业探索者</p>

        {/* 品牌名 */}
        <h1 className="display reveal reveal-delay-1 mt-8 text-6xl sm:text-7xl md:text-8xl">
          <span className="fade-text">{site.name}</span>
        </h1>

        {/* 定位与副标题 */}
        <p className="reveal reveal-delay-2 mt-6 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
          {site.role} · {site.roles.join(" · ")}
        </p>
        <p className="reveal reveal-delay-2 mt-3 max-w-xl text-lg leading-relaxed text-text sm:text-xl">
          {site.heroSubtitle}
        </p>

        {/* 行动按钮 */}
        <div className="reveal reveal-delay-3 mt-12 flex flex-wrap items-center gap-4">
          <a href="#about" className="btn btn-primary">
            了解我
          </a>
          <a href="#documentary" className="btn btn-ghost">
            观看《{site.columns.documentary}》
          </a>
          <a href="#services" className="btn btn-accent">
            AI 顾问服务
          </a>
        </div>

        {/* 滚动提示 */}
        <a
          href="#about"
          className="reveal reveal-delay-4 mt-24 inline-flex items-center gap-2 text-xs tracking-widest text-faint transition-colors hover:text-muted"
          aria-label="向下滚动了解张可能"
        >
          <span className="font-mono">SCROLL</span>
          <span className="inline-block h-4 w-px bg-faint" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
