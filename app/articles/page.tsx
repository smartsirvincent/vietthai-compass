import type { Metadata } from "next";
import { ArticleCard, CategoryVisualCard, SectionHeader } from "@/components/Cards";
import { SiteShell } from "@/components/SiteShell";
import { articleCategoryAssets } from "@/data/category-assets";
import { getArticles } from "@/lib/cms-store";
import { ArticleCategory } from "@/lib/types";

export const metadata: Metadata = {
  title: "旅遊與在地生活文章",
  description: "閱讀越南、泰國自由行、餐廳美食、景點行程、在地生活與台商商務文章，快速取得可執行的旅遊與生活資訊。",
  alternates: { canonical: "/articles" },
  openGraph: {
    title: "越泰指南文章｜越南泰國旅遊與在地生活",
    description: "越南、泰國自由行、餐廳美食、景點行程、在地生活與台商商務文章。"
  }
};

const categories: ArticleCategory[] = ["旅遊攻略", "餐廳美食", "景點行程", "在地生活", "台商專區"];

export default async function ArticlesPage() {
  const articles = await getArticles();
  return (
    <SiteShell>
      <section className="page-hero">
        <p className="eyebrow">Editorial</p>
        <h1>旅遊與在地生活文章</h1>
        <p>依照搜尋需求整理越南與泰國旅遊、餐廳、景點、生活與商務內容，讓讀者能快速找到下一步。</p>
      </section>
      <section className="band">
        <SectionHeader title="文章分類" intro="每個分類都有獨立圖片與內容方向，方便讀者瀏覽，也利於 SEO 主題聚合。" />
        <div className="grid three">
          {categories.map((category) => (
            <CategoryVisualCard
              key={category}
              title={category}
              intro={articleCategoryAssets[category].intro}
              image={articleCategoryAssets[category].image}
              alt={articleCategoryAssets[category].alt}
              href={`/articles#${category}`}
            />
          ))}
        </div>
      </section>
      {categories.map((category, index) => {
        const categoryArticles = articles.filter((article) => article.category === category);
        if (!categoryArticles.length) return null;
        return (
          <section className={`band ${index % 2 ? "light" : ""}`} key={category} id={category}>
            <SectionHeader title={category} intro="每篇文章都保留關鍵字、更新日期、圖片替代文字與清楚段落，方便後續持續擴充 SEO 內容。" />
            <div className="grid three">
              {categoryArticles.map((article) => (
                <ArticleCard article={article} key={article.slug} />
              ))}
            </div>
          </section>
        );
      })}
    </SiteShell>
  );
}
