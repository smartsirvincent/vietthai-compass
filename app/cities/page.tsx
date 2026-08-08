import type { Metadata } from "next";
import { CategoryVisualCard, CityCard, SectionHeader } from "@/components/Cards";
import { SiteShell } from "@/components/SiteShell";
import { sectionCategoryAssets } from "@/data/category-assets";
import { getCities } from "@/lib/cms-store";

export const metadata: Metadata = {
  title: "城市指南",
  description: "查看越南與泰國城市指南，包含胡志明市、峴港、曼谷、清邁的旅遊季節、建議天數、分區、在地生活與相關文章。",
  alternates: { canonical: "/cities" }
};

export default async function CitiesPage() {
  const cities = await getCities();
  const category = sectionCategoryAssets.find((item) => item.href === "/cities");
  return (
    <SiteShell>
      <section className="page-hero">
        <p className="eyebrow">City Hubs</p>
        <h1>越南與泰國城市指南</h1>
        <p>用城市頁整合旅遊攻略、餐廳景點、在地生活文章與商家資訊，大城市再依分區建立長尾 SEO 頁。</p>
      </section>
      {category ? (
        <section className="band">
          <div className="grid three">
            <CategoryVisualCard {...category} />
          </div>
        </section>
      ) : null}
      <section className="band light">
        <SectionHeader title="精選城市" intro="每個城市頁都能成為 SEO Hub，向下串接分區頁、文章、商家名錄與合作內容。" />
        <div className="grid four">
          {cities.map((city) => (
            <CityCard city={city} key={city.slug} />
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
