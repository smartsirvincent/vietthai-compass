import type { Metadata } from "next";
import Link from "next/link";
import { BusinessCard, CategoryVisualCard, SectionHeader } from "@/components/Cards";
import { SiteShell } from "@/components/SiteShell";
import { sectionCategoryAssets } from "@/data/category-assets";
import { getBusinesses, getCities } from "@/lib/cms-store";

export const metadata: Metadata = {
  title: "越南泰國商家名錄",
  description: "依城市與分區瀏覽越南、泰國台商友善商家與在地服務，包含餐廳、行銷服務、生活服務與商務合作資訊。",
  alternates: { canonical: "/directory" }
};

export default async function DirectoryPage() {
  const [businesses, cities] = await Promise.all([getBusinesses(), getCities()]);
  const category = sectionCategoryAssets.find((item) => item.href === "/directory");
  return (
    <SiteShell>
      <section className="page-hero">
        <p className="eyebrow">Directory</p>
        <h1>越南泰國商家名錄</h1>
        <p>商家依城市與分區整理，讓讀者能從目的地或生活圈找到餐廳、服務商與合作對象。</p>
      </section>
      {category ? (
        <section className="band">
          <div className="grid three">
            <CategoryVisualCard {...category} />
          </div>
        </section>
      ) : null}
      {cities.map((city, index) => {
        const cityBusinesses = businesses.filter((business) => business.citySlug === city.slug);
        if (!cityBusinesses.length) return null;
        return (
          <section className={`band ${index % 2 ? "" : "light"}`} key={city.slug}>
            <SectionHeader title={`${city.name}商家`} intro={`瀏覽${city.name}在地商家、餐廳與商務服務。`} href={`/cities/${city.slug}`} />
            {city.districts.length ? (
              <div className="keyword-row district-row">
                {city.districts.map((district) => (
                  <Link key={district.slug} href={`/cities/${city.slug}/districts/${district.slug}`}>{district.name}</Link>
                ))}
              </div>
            ) : null}
            <div className="grid three">
              {cityBusinesses.map((business) => (
                <BusinessCard business={business} key={business.slug} />
              ))}
            </div>
          </section>
        );
      })}
    </SiteShell>
  );
}
