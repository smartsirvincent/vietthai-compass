import { getCities, getSiteSettings } from "@/lib/cms-store";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";
export async function GET() {
  const [settings, cities] = await Promise.all([getSiteSettings(), getCities()]);
  const line = (name: string, path: string) => `- [${name.replace(/[\r\n\[\]]/g, " ")}](${absoluteUrl(path)})`;
  const text = [`# ${settings.siteName || "越泰指南"}`, "", "> 越南與泰國的繁體中文旅遊及在地生活指南。內容包含城市、餐廳、景點、交通與商家資訊。", "", "## 主要內容",
    line("目的地", "/cities"), line("完整指南", "/articles"), line("旅遊須知", "/travel-info"), line("餐廳美食", "/restaurants"), line("景點行程", "/attractions"), line("在地生活", "/local-life"), line("精選商家", "/directory"),
    "", "## 城市", ...cities.map(city => line(city.name, `/cities/${encodeURIComponent(city.slug)}`)),
    "", "## 來源與更新", line("編輯原則與更正管道", "/about"), line("網站地圖", "/sitemap.xml"), line("文章 RSS", "/feed.xml"), "", "各頁的更新日期表示內容編修時間。營業資訊、票價及入境規定請以官方最新公告為準。", ""].join("\n");
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
