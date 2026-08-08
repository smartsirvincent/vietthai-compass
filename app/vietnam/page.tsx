import type { Metadata } from "next";
import { ArticleCard, CityCard, SectionHeader } from "@/components/Cards";
import { SiteShell } from "@/components/SiteShell";
import { getArticles, getCities } from "@/lib/cms-store";

export const metadata: Metadata = {
  title: "越南旅遊、生活與商務指南",
  description: "整理越南自由行、胡志明市、峴港、餐廳景點、在地生活與台商商務資訊，適合旅遊規劃與市場考察。",
  alternates: { canonical: "/vietnam" }
};

export default async function VietnamPage() {
  const [articles, cities] = await Promise.all([getArticles(), getCities()]);
  const cityList = cities.filter((city) => city.country === "vietnam");
  const articleList = articles.filter((article) => article.country === "vietnam" || !article.country);
  return (
    <SiteShell>
      <section className="page-hero">
        <p className="eyebrow">Vietnam</p>
        <h1>越南旅遊、生活與商務指南</h1>
        <p>從胡志明市到峴港，整理自由行、景點、餐廳、生活資訊與台商商務主題，建立越南中文搜尋入口。</p>
      </section>
      <section className="band">
        <SectionHeader title="越南城市" intro="以城市為核心整理旅遊與生活資訊，方便讀者依目的地深入閱讀。" />
        <div className="grid four">{cityList.map((city) => <CityCard city={city} key={city.slug} />)}</div>
      </section>
      <section className="band light">
        <SectionHeader title="越南精選文章" intro="涵蓋自由行、行程、餐廳、在地生活與商務合作需求。" />
        <div className="grid three">{articleList.map((article) => <ArticleCard article={article} key={article.slug} />)}</div>
      </section>
    </SiteShell>
  );
}
