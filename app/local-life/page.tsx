import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard, CategoryVisualCard, SectionHeader } from "@/components/Cards";
import { SiteShell } from "@/components/SiteShell";
import { sectionCategoryAssets } from "@/data/category-assets";
import { getArticles, getCities } from "@/lib/cms-store";

export const metadata: Metadata = {
  title: "越南泰國在地生活",
  description: "依城市與分區整理越南、泰國在地生活資訊，包含租屋、交通、飲食、生活成本、長住與台灣人常見需求。",
  alternates: { canonical: "/local-life" }
};

export default async function LocalLifePage() {
  const [articles, cities] = await Promise.all([getArticles(), getCities()]);
  const lifeArticles = articles.filter((article) => article.category === "在地生活");
  const category = sectionCategoryAssets.find((item) => item.href === "/local-life");
  return (
    <SiteShell>
      <section className="page-hero">
        <p className="eyebrow">Local Life</p>
        <h1>越南泰國在地生活</h1>
        <p>在地生活內容依城市與分區整理，適合發展租屋、交通、生活成本、長住與中文服務等長尾搜尋文章。</p>
      </section>
      {category ? (
        <section className="band">
          <div className="grid three">
            <CategoryVisualCard {...category} />
          </div>
        </section>
      ) : null}
      {cities.map((city, index) => {
        const cityArticles = lifeArticles.filter((article) => article.citySlug === city.slug || !article.citySlug);
        return (
          <section className={`band ${index % 2 ? "" : "light"}`} key={city.slug}>
            <SectionHeader title={`${city.name}在地生活`} intro={`整理${city.name}租屋、交通、飲食、生活成本與長住資訊。`} href={`/cities/${city.slug}`} />
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
