import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Lab from "@/components/Lab";
import Insights from "@/components/Insights";
import Connect from "@/components/Connect";
import Faq from "@/components/Faq";

/**
 * 首页 — GEOloopOS 创始人的 AI 实验站点
 * 结构：Hero → 关于 → AI顾问服务 → 可能实验 → AI时代观察 → 连接 → 常见问题
 */
export default function Home() {
  return (
    <div className="space-y-section">
      <Hero />
      <About />
      <Services />
      <Lab />
      <Insights />
      <Connect />
      <Faq />
    </div>
  );
}
