import { notFound } from "next/navigation";
import { ArticleCard, BusinessCard, InfoStrip, SectionHeader } from "@/components/Cards";
import { SiteShell } from "@/components/SiteShell";
import { getArticles, getBusinesses, getCities } from "@/lib/cms-store";
import { breadcrumbJsonLd, cityJsonLd } from "@/lib/seo";

export async function generateStaticParams() {
  const cities = await getCities();
  return cities.map((city) => ({ slug: city.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cities = await getCities();
  const city = cities.find((item) => item.slug === slug);
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

export default async function CityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [cities, articles, businesses] = await Promise.all([getCities(), getArticles(), getBusinesses()]);
  const city = cities.find((item) => item.slug === slug);
  if (!city) notFound();

  const cityArticles = articles.filter((article) => article.citySlug === city.slug || !article.citySlug);
  const cityBusinesses = businesses.filter((business) => business.citySlug === city.slug);

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(cityJsonLd(city)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "首頁", url: "/" }, { name: "城市指南", url: "/cities" }, { name: city.name, url: `/cities/${city.slug}` }])) }} />
      <section className="page-hero">
        <p className="eyebrow">{city.country === "vietnam" ? "Vietnam" : "Thailand"}</p>
        <h1>{city.name}指南</h1>
        <p>{city.summary}</p>
      </section>
      <section className="band light">
        <InfoStrip items={[["英文名稱", city.nameEn], ["推薦季節", city.bestSeason], ["建議天數", city.recommendedDays], ["適合族群", city.audience.join(" / ")]]} />
      </section>
      <section className="band">
        <SectionHeader title={`${city.name}精選內容`} intro="整理旅遊攻略、餐廳景點與在地生活資訊，讓讀者可以從搜尋進入後快速找到可行的下一步。" />
        <div className="grid three">
          {cityArticles.map((article) => <ArticleCard article={article} key={article.slug} />)}
        </div>
      </section>
      {city.districts.length ? (
        <section className="band light">
          <SectionHeader title={`${city.name}分區指南`} intro="大城市可再依商圈、生活圈或景點區域切分，承接更精準的餐廳、景點、在地生活與商家搜尋需求。" />
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
      {cityBusinesses.length ? (
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
