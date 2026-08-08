import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard, CategoryVisualCard, SectionHeader } from "@/components/Cards";
import { SiteShell } from "@/components/SiteShell";
import { sectionCategoryAssets } from "@/data/category-assets";
import { getArticles, getCities } from "@/lib/cms-store";

export const metadata: Metadata = {
  title: "越南泰國餐廳美食",
  description: "依城市與分區整理越南、泰國餐廳美食資訊，包含曼谷、胡志明市、峴港、清邁的商務聚餐、在地小吃與餐廳推薦。",
  alternates: { canonical: "/restaurants" }
};

export default async function RestaurantsPage() {
  const [articles, cities] = await Promise.all([getArticles(), getCities()]);
  const restaurantArticles = articles.filter((article) => article.category === "餐廳美食" || article.title.includes("餐廳"));
  const category = sectionCategoryAssets.find((item) => item.href === "/restaurants");
  return (
    <SiteShell>
      <section className="page-hero">
        <p className="eyebrow">Food</p>
        <h1>越南泰國餐廳美食</h1>
        <p>餐廳內容依城市與分區整理，未來可延伸出「曼谷 Sukhumvit 餐廳」、「胡志明市第一郡餐廳」等精準 SEO 頁。</p>
      </section>
      {category ? (
        <section className="band">
          <div className="grid three">
            <CategoryVisualCard {...category} />
          </div>
        </section>
      ) : null}
      {cities.map((city, index) => {
        const cityArticles = restaurantArticles.filter((article) => article.citySlug === city.slug || !article.citySlug);
        return (
          <section className={`band ${index % 2 ? "" : "light"}`} key={city.slug}>
            <SectionHeader title={`${city.name}餐廳美食`} intro={`整理${city.name}餐廳、咖啡、商務聚餐與在地美食。`} href={`/cities/${city.slug}`} />
            {city.districts.length ? (
              <div className="keyword-row district-row">
                {city.districts.map((district) => (
                  <Link key={district.slug} href={`/cities/${city.slug}/districts/${district.slug}`}>{district.name}</Link>
                ))}
              </div>
            ) : null}
            <div className="grid three">{cityArticles.slice(0, 6).map((article) => <ArticleCard article={article} key={`${city.slug}-${article.slug}`} />)}</div>
          </section>
        );
      })}
    </SiteShell>
  );
}
