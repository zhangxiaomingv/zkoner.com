"use client";

import { useEffect, useState } from "react";
import { site } from "@/content";

const NAV = [
  { href: "#about", label: "关于" },
  { href: "#services", label: "AI 顾问服务" },
  { href: "/geo", label: "GEO 优化" },
  { href: "/lab", label: "自我实验" },
  { href: "/blog", label: "AI 时代观察" },
  { href: "/scorecard", label: "AI 成绩单" },
  { href: "/project-log", label: "项目日志" },
  { href: "#connect", label: "连接" },
] as const;

/** hash 链接在非首页会失效，统一补首页前缀（首页行为不变） */
const navHref = (href: string) => (href.startsWith("#") ? `/${href}` : href);

/**
 * 顶部导航 — Linear 式：吸顶 + 毛玻璃 + 极简
 * 移动端折叠为菜单按钮。
 */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "border-b border-border bg-bg/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8"
        aria-label="主导航"
      >
        {/* Logo */}
        <a href="/#top" className="flex items-center gap-2.5">
          <span
            className="h-2 w-2 rounded-full bg-accent"
            aria-hidden="true"
          />
          <span className="text-[15px] font-semibold tracking-wide text-text">
            {site.name}
          </span>
        </a>

        {/* 桌面端导航 */}
        <ul className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <li key={item.href}>
              <a
                href={navHref(item.href)}
                className="link-underline text-sm text-muted transition-colors hover:text-text"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* 移动端菜单按钮 */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center text-text md:hidden"
          aria-expanded={open}
          aria-label={open ? "关闭菜单" : "打开菜单"}
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            {open ? (
              <>
                <path d="M5 5l10 10" />
                <path d="M15 5L5 15" />
              </>
            ) : (
              <>
                <path d="M3 6h14" />
                <path d="M3 10h14" />
                <path d="M3 14h14" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* 移动端展开菜单 */}
      {open && (
        <ul className="border-t border-border bg-bg/95 backdrop-blur-xl md:hidden">
          {NAV.map((item) => (
            <li key={item.href}>
              <a
                href={navHref(item.href)}
                className="block px-6 py-4 text-[15px] text-muted transition-colors hover:text-text"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
