import type { Metadata } from "next";
import { ArticleCard, CategoryVisualCard, SectionHeader } from "@/components/Cards";
import { SiteShell } from "@/components/SiteShell";
import { sectionCategoryAssets } from "@/data/category-assets";
import { getArticles } from "@/lib/cms-store";

export const metadata: Metadata = {
  title: "越南泰國台商專區",
  description: "整理越南與泰國台商商務資訊，包含商務聚餐、在地行銷、商家曝光、SEO 內容與合作詢問。",
  alternates: { canonical: "/taiwan-business" }
};

const businessTopics = ["商家曝光", "商務聚餐", "品牌行銷", "SEO 文章", "在地生活服務", "中文市場", "合作採訪", "商家名錄"];

export default async function TaiwanBusinessPage() {
  const articles = await getArticles();
  const category = sectionCategoryAssets.find((item) => item.href === "/taiwan-business");
  return (
    <SiteShell>
      <section className="page-hero">
        <p className="eyebrow">Taiwan Business</p>
        <h1>越南泰國台商專區</h1>
        <p>面向越南與泰國台商、在地商家與中文市場需求，整理商務合作、內容行銷與搜尋曝光資訊。</p>
      </section>
      {category ? (
        <section className="band">
          <div className="grid three">
            <CategoryVisualCard {...category} />
          </div>
        </section>
      ) : null}
      <section className="band light">
        <SectionHeader title="商務主題" intro="用內容與商家頁建立信任，讓在地商家能透過中文搜尋取得合作機會。" />
        <div className="grid four">
          {businessTopics.map((item) => (
            <div className="card" key={item}><span className="pill">Business</span><h3>{item}</h3><p>可延伸成案例文章、商家頁、合作方案與 SEO 導流內容。</p></div>
          ))}
        </div>
      </section>
      <section className="band">
        <SectionHeader title="台商與商務文章" />
        <div className="grid three">{articles.filter((article) => article.category === "台商專區").map((article) => <ArticleCard article={article} key={article.slug} />)}</div>
      </section>
    </SiteShell>
  );
}
