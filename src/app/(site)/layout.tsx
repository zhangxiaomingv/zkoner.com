import type { ReactNode } from "react";
import Footer from "@/components/Footer";

/** 站点主区（首页 / 成绩单等）：完整页脚（含使命句） */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <main>{children}</main>
      <Footer />
    </>
  );
}
