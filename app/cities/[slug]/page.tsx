import { notFound } from "next/navigation";
import { DestinationLinks } from "@/components/DestinationLinks";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArticleCard, BusinessCard, InfoStrip, SectionHeader } from "@/components/Cards";
import { ContentImage } from "@/components/ContentImage";
import { SiteShell } from "@/components/SiteShell";
import { getArticles, getBusinesses, getCities } from "@/lib/cms-store";
import { breadcrumbJsonLd, cityJsonLd } from "@/lib/seo";
import { findByRouteSlug } from "@/lib/routes";
import { BangkokTransitExplorer } from "@/components/BangkokTransitExplorer";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cities = await getCities();
  const city = findByRouteSlug(cities, slug);
  if (!city) return {};
  return {
    title: `${city.name}旅遊與生活指南`,
    description: city.summary,
    alternates: {
      canonical: `/cities/${city.slug}`
    },
    openGraph: {
      title: `${city.name}旅遊與生活指南`,
      description: city.summary,
      images: [city.image]
    }
  };
}

export default async function CityDetailPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ station?: string | string[]; merchantType?: string | string[] }> }) {
  const [{ slug }, query, cities, articles, businesses] = await Promise.all([params, searchParams, getCities(), getArticles(), getBusinesses()]);
  const city = findByRouteSlug(cities, slug);
  if (!city) notFound();

  const cityArticles = articles.filter((article) => article.citySlug === city.slug);
  const cityBusinesses = businesses.filter((business) => business.citySlug === city.slug);
  const station = Array.isArray(query.station) ? query.station[0] : query.station;
  const merchantType = Array.isArray(query.merchantType) ? query.merchantType[0] : query.merchantType;

  return (
    <SiteShell>
      <Breadcrumbs items={[{ label: "城市指南", href: "/cities" }, { label: city.name }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(cityJsonLd(city)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "首頁", url: "/" }, { name: "城市指南", url: "/cities" }, { name: city.name, url: `/cities/${city.slug}` }])) }} />
      <section className="page-hero">
        <p className="eyebrow">{city.country === "vietnam" ? "Vietnam" : "Thailand"}</p>
        <h1>{city.name}指南</h1>
        <p>{city.summary}</p>
        <DestinationLinks city={city} />
        <ContentImage className="city-page-cover" src={city.image} alt={`${city.name} AI 生成擬真風格城市示意圖`} priority sizes="(max-width: 900px) 100vw, 90vw" />
      </section>
      <section className="band light">
        <InfoStrip items={[["英文名稱", city.nameEn], ["推薦季節", city.bestSeason], ["建議天數", city.recommendedDays], ["適合族群", city.audience.join(" / ")]]} />
      </section>
      {city.slug === "bangkok" ? <BangkokTransitExplorer businesses={cityBusinesses} stationId={station} merchantType={merchantType} /> : null}
      <section className="band">
        <SectionHeader title={`${city.name}完整指南`} intro="從逐月天氣、行前準備到餐廳與景點，按城市整理實用資訊。" href={`/articles?country=${city.country}&city=${city.slug}`} />
        <div className="grid three">
          {cityArticles.map((article) => <ArticleCard article={article} key={article.slug} />)}
        </div>
        {!cityArticles.length ? <p className="empty-state">這座城市的指南正在整理中，先查看<a href="/travel-info">旅遊須知</a>。</p> : null}
      </section>
      {city.districts.length ? (
        <section className="band light">
          <SectionHeader title={`${city.name}分區指南`} intro="住哪一區，就從附近開始探索。" />
          <div className="grid four">
            {city.districts.map((district) => (
              <a className="card city-card" href={`/cities/${city.slug}/districts/${district.slug}`} key={district.slug}>
                <span className="pill">分區</span>
                <h3>{district.name}</h3>
                <p>{district.summary}</p>
              </a>
            ))}
          </div>
        </section>
      ) : null}
      {cityBusinesses.length && city.slug !== "bangkok" ? (
        <section className="band">
          <SectionHeader title="相關商家" href="/directory" />
          <div className="grid three">
            {cityBusinesses.map((business) => <BusinessCard business={business} key={business.slug} />)}
          </div>
        </section>
      ) : null}
    </SiteShell>
  );
}
