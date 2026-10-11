import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DestinationLinks } from "@/components/DestinationLinks";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArticleCard, BusinessCard, InfoStrip, SectionHeader } from "@/components/Cards";
import { SiteShell } from "@/components/SiteShell";
import { getArticles, getBusinesses, getCities } from "@/lib/cms-store";
import { breadcrumbJsonLd } from "@/lib/seo";
import { findByRouteSlug } from "@/lib/routes";

export async function generateMetadata({ params }: { params: Promise<{ slug: string; districtSlug: string }> }): Promise<Metadata> {
  const { slug, districtSlug } = await params;
  const cities = await getCities();
  const city = findByRouteSlug(cities, slug);
  const district = findByRouteSlug(city?.districts || [], districtSlug);
  if (!city || !district) return {};
  return {
    title: `${city.name}${district.name}分區指南`,
    description: `${district.summary} 整理${city.name}${district.name}餐廳美食、景點行程、在地生活與商家資訊。`,
    alternates: {
      canonical: `/cities/${city.slug}/districts/${district.slug}`
    },
    openGraph: {
      title: `${city.name}${district.name}分區指南`,
      description: district.summary,
      images: [city.image]
    }
  };
}

export default async function DistrictPage({ params }: { params: Promise<{ slug: string; districtSlug: string }> }) {
  const { slug, districtSlug } = await params;
  const [cities, articles, businesses] = await Promise.all([getCities(), getArticles(), getBusinesses()]);
  const city = findByRouteSlug(cities, slug);
  const district = findByRouteSlug(city?.districts || [], districtSlug);
  if (!city || !district) notFound();

  const districtArticles = articles.filter((article) => article.citySlug === city.slug && article.districtSlug === district.slug);
  const cityFallbackArticles = articles.filter((article) => article.citySlug === city.slug && !article.districtSlug).slice(0, 3);
  const districtBusinesses = businesses.filter((business) => business.citySlug === city.slug && business.districtSlug === district.slug);

  return (
    <SiteShell>
      <Breadcrumbs items={[{ label: "城市指南", href: "/cities" }, { label: city.name, href: `/cities/${city.slug}` }, { label: district.name }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "首頁", url: "/" }, { name: "城市指南", url: "/cities" }, { name: city.name, url: `/cities/${city.slug}` }, { name: district.name, url: `/cities/${city.slug}/districts/${district.slug}` }])) }} />
      <section className="page-hero">
        <p className="eyebrow">{city.name} District Guide</p>
        <h1>{city.name}{district.name}分區指南</h1>
        <p>{district.summary}</p>
        <DestinationLinks city={city} district={district.slug} />
      </section>
      <section className="band light">
        <InfoStrip items={[["城市", city.name], ["分區", district.name], ["英文", district.nameEn || district.slug], ["內容方向", "餐廳 / 景點 / 在地生活 / 商家"]]} />
      </section>
      <section className="band">
        <SectionHeader title={`${district.name}相關文章`} intro="探索這一區，再搭配城市旅遊指南安排路線。" />
        <div className="grid three">
          {[...districtArticles, ...cityFallbackArticles].map((article) => <ArticleCard article={article} key={article.slug} />)}
        </div>
      </section>
      {districtBusinesses.length ? (
        <section className="band light">
          <SectionHeader title={`${district.name}相關商家`} href="/directory" />
          <div className="grid three">
            {districtBusinesses.map((business) => <BusinessCard business={business} key={business.slug} />)}
          </div>
        </section>
      ) : null}
    </SiteShell>
  );
}
