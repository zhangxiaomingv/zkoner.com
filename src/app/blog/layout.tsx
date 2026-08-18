import type { ReactNode } from "react";
import Footer from "@/components/Footer";

/** 博客区（列表 + 详情）：极简页脚（无使命句） */
export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <main>{children}</main>
      <Footer minimal />
    </>
  );
}
