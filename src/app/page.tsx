import Hero from "@/components/Hero";
import About from "@/components/About";
import Documentary from "@/components/Documentary";
import Services from "@/components/Services";
import Lab from "@/components/Lab";
import Insights from "@/components/Insights";
import Connect from "@/components/Connect";

/**
 * 首页 — 张可能个人品牌官网
 * 结构：Hero → 关于 → 遇见·可能 → AI顾问服务 → 可能实验 → AI时代观察 → 连接
 */
export default function Home() {
  return (
    <div className="space-y-section">
      <Hero />
      <About />
      <Documentary />
      <Services />
      <Lab />
      <Insights />
      <Connect />
    </div>
  );
}
