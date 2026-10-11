import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard, BusinessCard, CityCard, SectionHeader } from "@/components/Cards";
import { DestinationFilters } from "@/components/DestinationFilters";
import { SiteShell } from "@/components/SiteShell";
import { getArticles, getBusinesses, getCities } from "@/lib/cms-store";
import { cleanExploreQuery, inDestination, resolveDestination, type ExploreQuery } from "@/lib/explore";
import { locationTerms, matchesSearch } from "@/lib/search";
export const metadata: Metadata = { title: "站內搜尋", description: "搜尋越南泰國城市、餐廳、景點與生活資訊。", alternates: { canonical: "/search" }, robots: { index: false, follow: true } };
export default async function SearchPage({ searchParams }: { searchParams: Promise<ExploreQuery> }) {
  const [rawParams, articles, businesses, cities] = await Promise.all([searchParams, getArticles(), getBusinesses(), getCities()]);
  const params = cleanExploreQuery(rawParams);
  const query = (params.q || "").trim();
  const destination = resolveDestination(params, cities);
  const cityResults = cities.filter(city => (!destination.country || city.country === destination.country) && (!destination.city || city.slug === destination.city.slug) && matchesSearch([city.name, city.nameEn, city.summary, ...locationTerms({ citySlug: city.slug }, cities), ...city.districts.flatMap(d => [d.name, d.nameEn])], query));
  const articleResults = articles.filter(item => inDestination(item, destination, cities) && matchesSearch([item.title, item.excerpt, item.category, item.businessIntro, ...item.keywords, ...locationTerms(item, cities)], query));
  const businessResults = businesses.filter(item => inDestination(item, destination, cities) && matchesSearch([item.name, item.category, item.description, ...item.badges, ...locationTerms(item, cities)], query));
  const total = cityResults.length + articleResults.length + businessResults.length;
  const active = Boolean(query || destination.country || destination.city);
  function moreHref(path: string) {
    const values = new URLSearchParams();
    for (const [key, value] of Object.entries({ q: query, country: destination.country, city: destination.city?.slug, district: destination.district?.slug })) if (value) values.set(key, value);
    return `${path}?${values}`;
  }
  return <SiteShell>
    <section className="explore-heading"><div><p className="eyebrow">旅途中的好幫手</p><h1>搜尋越泰指南</h1><p>找一座城市、一間店，或下一站想去的地方。</p></div></section>
    <section className="band explore-results">
      <DestinationFilters key={`${destination.country}:${destination.city?.slug}:${destination.district?.slug}:${query}`} action="/search" cities={cities.map(({ slug, name, country, districts }) => ({ slug, name, country, districts }))} country={destination.country} city={destination.city?.slug} district={destination.district?.slug} query={query} />
      <div className="results-summary"><h2>{active ? `${query ? `「${query}」` : destination.city?.name || "目的地"}的搜尋結果` : "探索目的地"}</h2><span>{total} 筆結果</span><Link href="/search">清除篩選</Link></div>
      {total ? <nav className="result-jumps" aria-label="搜尋結果分類">{cityResults.length ? <a href="#search-cities">城市 {cityResults.length}</a> : null}{articleResults.length ? <a href="#search-articles">文章 {articleResults.length}</a> : null}{businessResults.length ? <a href="#search-businesses">商家 {businessResults.length}</a> : null}</nav> : <div className="empty-state"><h2>沒有找到符合的結果</h2><p>試試較短的店名，或取消分區篩選。</p><Link className="text-link" href={destination.city ? `/cities/${destination.city.slug}` : "/cities"}>先看看城市指南</Link></div>}
    </section>
    {cityResults.length ? <section className="band light" id="search-cities"><SectionHeader title="城市指南" /><div className="grid four">{cityResults.map(city => <CityCard key={city.slug} city={city} />)}</div></section> : null}
    {articleResults.length ? <section className="band" id="search-articles"><SectionHeader title={`文章（${articleResults.length}）`} href={moreHref("/articles")} /><div className="grid three">{articleResults.slice(0, active ? 12 : 6).map(article => <ArticleCard key={article.slug} article={article} />)}</div></section> : null}
    {businessResults.length ? <section className="band light" id="search-businesses"><SectionHeader title={`商家（${businessResults.length}）`} href={moreHref("/directory")} /><div className="grid three">{businessResults.slice(0, active ? 12 : 6).map(business => <BusinessCard key={business.slug} business={business} />)}</div></section> : null}
  </SiteShell>;
}
