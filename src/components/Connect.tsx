import Section from "./Section";
import { site } from "@/content";

/**
 * 个人连接 — 联系方式
 * 欢迎企业家、创业者、创造者交流。
 */
export default function Connect() {
  return (
    <Section
      id="connect"
      index="06"
      eyebrow="连接"
      title={
        <>
          欢迎企业家、
          <br />
          创业者、创造者交流。
        </>
      }
    >
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        {/* 左：邀请语 */}
        <div className="reveal space-y-6">
          <p className="text-lg leading-relaxed text-muted sm:text-xl">
            {site.contact.note}
          </p>
          <p className="max-w-md text-sm leading-relaxed text-faint">
            如果你正在思考 AI 能为你或你的企业带来什么新可能，欢迎随时找到我。
            每一次相遇，都是一次新的可能。
          </p>
        </div>

        {/* 右：联系方式列表 */}
        <div className="reveal reveal-delay-1 divide-y divide-border border-t border-border">
          {site.contact.channels.map((c) => {
            const isLink = "href" in c && c.href;
            const Wrapper = isLink ? "a" : "div";
            return (
              <div
                key={c.label}
                className="group flex items-center justify-between gap-6 py-5"
              >
                <div className="flex items-baseline gap-5">
                  <span className="w-14 shrink-0 text-sm text-faint">
                    {c.label}
                  </span>
                  <Wrapper
                    {...(isLink ? { href: c.href } : {})}
                    className={`text-base text-text transition-colors ${
                      isLink ? "group-hover:text-accent" : ""
                    }`}
                  >
                    {c.value}
                  </Wrapper>
                </div>
                {"hint" in c && c.hint && (
                  <span className="hidden shrink-0 text-xs text-faint sm:block">
                    {c.hint}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
