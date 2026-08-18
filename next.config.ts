import type { NextConfig } from "next";

/**
 * 张可能个人品牌官网 — Next.js 配置
 *
 * 静态导出（GitHub Pages / Cloudflare Pages 均可托管）：
 * - output: "export" → npm run build 生成 /out 纯静态站点
 * - images.unoptimized → 不依赖 Next 图片优化服务（静态托管无 Node 运行时）
 * - trailingSlash 关闭，保持 URL 简洁
 */
const nextConfig: NextConfig = {
  output: "export",
  outputFileTracingRoot: __dirname,
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
  reactStrictMode: true,
};

export default nextConfig;
