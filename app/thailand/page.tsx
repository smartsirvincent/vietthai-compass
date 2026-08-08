import type { Metadata } from "next";
import { ArticleCard, CityCard, SectionHeader } from "@/components/Cards";
import { SiteShell } from "@/components/SiteShell";
import { getArticles, getCities } from "@/lib/cms-store";

export const metadata: Metadata = {
  title: "泰國旅遊、生活與台商商務指南",
  description: "整理泰國自由行、曼谷、清邁、餐廳景點、在地生活與台商商務資訊，協助讀者規劃旅程與合作。",
  alternates: { canonical: "/thailand" }
};

export default async function ThailandPage() {
  const [articles, cities] = await Promise.all([getArticles(), getCities()]);
  const cityList = cities.filter((city) => city.country === "thailand");
  const articleList = articles.filter((article) => article.country === "thailand" || !article.country);
  return (
    <SiteShell>
      <section className="page-hero">
        <p className="eyebrow">Thailand</p>
        <h1>泰國旅遊、生活與台商商務指南</h1>
        <p>從曼谷到清邁，整理泰國自由行、餐廳景點、在地生活與台商合作資訊，服務旅客與在地商家。</p>
      </section>
      <section className="band">
        <SectionHeader title="泰國城市" intro="用城市頁聚合熱門文章、商家資訊與旅遊決策內容。" />
        <div className="grid four">{cityList.map((city) => <CityCard city={city} key={city.slug} />)}</div>
      </section>
      <section className="band light">
        <SectionHeader title="泰國精選文章" intro="聚焦曼谷、清邁、餐廳、商務聚餐與在地生活主題。" />
        <div className="grid three">{articleList.map((article) => <ArticleCard article={article} key={article.slug} />)}</div>
      </section>
    </SiteShell>
  );
}
