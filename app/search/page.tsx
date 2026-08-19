import type { Metadata } from "next";
import { Search } from "lucide-react";
import { ArticleCard, BusinessCard, CityCard, SectionHeader } from "@/components/Cards";
import { SiteShell } from "@/components/SiteShell";
import { getArticles, getBusinesses, getCities } from "@/lib/cms-store";

export const metadata: Metadata = {
  title: "站內搜尋",
  description: "搜尋越泰指南的城市、文章與商家資訊。",
  alternates: { canonical: "/search" },
  robots: {
    index: false,
    follow: true
  }
};

function includesQuery(values: Array<string | undefined>, query: string) {
  if (!query) return true;
  const normalizedQuery = query.toLowerCase();
  return values.some((value) => value?.toLowerCase().includes(normalizedQuery));
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const [{ q }, articles, businesses, cities] = await Promise.all([
    searchParams,
    getArticles(),
    getBusinesses(),
    getCities()
  ]);
  const query = String(q || "").trim();

  const filteredCities = cities.filter((city) =>
    includesQuery(
      [
        city.name,
        city.nameEn,
        city.summary,
        city.country,
        ...city.audience,
        ...city.districts.flatMap((district) => [district.name, district.nameEn, district.summary])
      ],
      query
    )
  );

  const filteredArticles = articles.filter((article) =>
    includesQuery(
      [
        article.title,
        article.excerpt,
        article.content,
        article.category,
        article.country,
        article.citySlug,
        article.districtSlug,
        article.businessIntro,
        ...article.keywords,
        ...(article.businessFeatures || [])
      ],
      query
    )
  );

  const filteredBusinesses = businesses.filter((business) =>
    includesQuery(
      [
        business.name,
        business.category,
        business.description,
        business.review,
        business.isTaiwanBusiness ? "台商專區" : "",
        business.citySlug,
        business.districtSlug,
        business.country,
        ...business.badges,
        business.socials.website,
        business.socials.phone,
        business.socials.whatsapp,
        business.socials.zalo,
        business.socials.facebook,
        business.socials.instagram,
        business.socials.tiktok,
        business.socials.telegram
      ],
      query
    )
  );

  const total = filteredCities.length + filteredArticles.length + filteredBusinesses.length;

  return (
    <SiteShell>
      <section className="page-hero">
        <p className="eyebrow">Search</p>
        <h1>搜尋越泰指南</h1>
        <p>輸入城市、分區、餐廳、景點、生活主題或商家名稱，快速找到相關內容。</p>
        <form className="search-panel" action="/search">
          <Search size={20} />
          <input name="q" type="search" defaultValue={query} placeholder="例如：Thao Dien、胡志明市、親子餐廳" aria-label="搜尋關鍵字" />
          <button type="submit">搜尋</button>
        </form>
        {query ? <p className="search-summary">「{query}」共有 {total} 筆相關結果</p> : null}
      </section>

      {total === 0 ? (
        <section className="band">
          <div className="empty-state">
            <h2>目前沒有符合的結果</h2>
            <p>可以改用城市、分區、餐廳類型或商家名稱搜尋，例如「第二郡」、「Thao Dien」、「親子餐廳」。</p>
          </div>
        </section>
      ) : (
        <>
          {filteredCities.length ? (
            <section className="band">
              <SectionHeader title="城市與分區" intro="符合搜尋條件的城市與生活圈。" />
              <div className="grid four">
                {filteredCities.map((city) => (
                  <CityCard city={city} key={city.slug} />
                ))}
              </div>
            </section>
          ) : null}

          {filteredArticles.length ? (
            <section className="band light">
              <SectionHeader title="文章" intro="符合搜尋條件的旅遊、餐廳、景點與生活文章。" />
              <div className="grid three">
                {filteredArticles.map((article) => (
                  <ArticleCard article={article} key={article.slug} />
                ))}
              </div>
            </section>
          ) : null}

          {filteredBusinesses.length ? (
            <section className="band">
              <SectionHeader title="商家" intro="符合搜尋條件的精選商家與在地服務。" />
              <div className="grid three">
                {filteredBusinesses.map((business) => (
                  <BusinessCard business={business} key={business.slug} />
                ))}
              </div>
            </section>
          ) : null}
        </>
      )}
    </SiteShell>
  );
}
