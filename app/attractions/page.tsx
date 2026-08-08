import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard, CategoryVisualCard, SectionHeader } from "@/components/Cards";
import { SiteShell } from "@/components/SiteShell";
import { sectionCategoryAssets } from "@/data/category-assets";
import { getArticles, getCities } from "@/lib/cms-store";

export const metadata: Metadata = {
  title: "越南泰國景點行程",
  description: "依城市與分區整理越南、泰國景點行程，包含峴港海灘、曼谷商圈、清邁古城與胡志明市市中心路線。",
  alternates: { canonical: "/attractions" }
};

export default async function AttractionsPage() {
  const [articles, cities] = await Promise.all([getArticles(), getCities()]);
  const itineraryArticles = articles.filter((article) => article.category === "景點行程" || article.title.includes("行程"));
  const category = sectionCategoryAssets.find((item) => item.href === "/attractions");
  return (
    <SiteShell>
      <section className="page-hero">
        <p className="eyebrow">Attractions</p>
        <h1>越南泰國景點行程</h1>
        <p>景點行程依城市與分區整理，讓讀者能從目的地、商圈或生活圈切入，快速規劃路線。</p>
      </section>
      {category ? (
        <section className="band">
          <div className="grid three">
            <CategoryVisualCard {...category} />
          </div>
        </section>
      ) : null}
      {cities.map((city, index) => {
        const cityArticles = itineraryArticles.filter((article) => article.citySlug === city.slug || !article.citySlug);
        return (
          <section className={`band ${index % 2 ? "" : "light"}`} key={city.slug}>
            <SectionHeader title={`${city.name}景點行程`} intro={`整理${city.name}景點、散步路線、交通安排與建議天數。`} href={`/cities/${city.slug}`} />
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
