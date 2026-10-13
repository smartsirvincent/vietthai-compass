import Link from "next/link";
import { ArticleCard, BusinessCard } from "@/components/Cards";
import { DestinationFilters } from "@/components/DestinationFilters";
import { ContentImage } from "@/components/ContentImage";
import { SiteShell } from "@/components/SiteShell";
import { getArticles, getBusinesses, getCities } from "@/lib/cms-store";
import { cleanExploreQuery, inDestination, resolveDestination, type ExploreQuery } from "@/lib/explore";
import { sectionCategoryAssets } from "@/data/category-assets";
import { locationTerms, matchesSearch, resultPage } from "@/lib/search";
export async function ExplorePage({ title, intro, path, category, searchParams, directory = false }: { title: string; intro: string; path: string; category?: string; searchParams: Promise<ExploreQuery>; directory?: boolean }) {
  const [rawQuery, cities, articles, businesses] = await Promise.all([searchParams, getCities(), getArticles(), getBusinesses()]);
  const query = cleanExploreQuery(rawQuery);
  const destination = resolveDestination(query, cities);
  const keyword = (query.q || "").trim().toLocaleLowerCase();
  const articleList = articles.filter(item => (!category || item.category === category) && inDestination(item, destination, cities) && matchesSearch([item.title, item.excerpt, ...item.keywords, ...locationTerms(item, cities)], keyword));
  const businessList = businesses.filter(item => inDestination(item, destination, cities) && (!directory || !query.category || item.category === query.category) && (!directory || !query.subcategory || item.subcategory === query.subcategory) && matchesSearch([item.name, item.category, item.subcategory || "", item.description, ...item.badges, ...locationTerms(item, cities)], keyword));
  const total = directory ? businessList.length : articleList.length;
  const pagination = resultPage(query.page, total);
  function pageHref(page: number) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries({ country: destination.country, city: destination.city?.slug, district: destination.district?.slug, q: query.q, category: query.category, subcategory: query.subcategory })) if (value) params.set(key, value);
    params.set("page", String(page));
    return `${path}?${params}#results`;
  }
  const asset = sectionCategoryAssets.find(item => item.href === path);
  return <SiteShell>
    <section className="explore-heading"><div><p className="eyebrow">越南・泰國</p><h1>{title}</h1><p>{intro}</p></div>{asset ? <ContentImage src={asset.image} alt={asset.alt} width={560} height={360} sizes="(max-width: 720px) 100vw, 320px" priority /> : null}</section>
    <section className="band explore-results">
      <DestinationFilters key={`${destination.country}:${destination.city?.slug}:${destination.district?.slug}:${keyword}:${query.category}:${query.subcategory}`} action={path} cities={cities.map(({ slug, name, country, districts }) => ({ slug, name, country, districts }))} country={destination.country} city={destination.city?.slug} district={destination.district?.slug} query={query.q} directory={directory} category={query.category} subcategory={query.subcategory} />
      <div className="results-summary"><h2>{destination.city?.name || (destination.country === "vietnam" ? "越南" : destination.country === "thailand" ? "泰國" : "所有目的地")}{destination.district ? `・${destination.district.name}` : ""}{query.subcategory ? `・${query.subcategory}` : query.category ? `・${query.category}` : ""}</h2><span>{total} {directory ? "間商家" : "篇文章"}</span><Link href={path}>清除篩選</Link></div>
      <div id="results">{total ? <div className="grid three">{directory ? businessList.slice(pagination.start, pagination.end).map(item => <BusinessCard key={item.slug} business={item} />) : articleList.slice(pagination.start, pagination.end).map(item => <ArticleCard key={item.slug} article={item} />)}</div> : <div className="empty-state"><h2>{keyword ? "沒有找到符合的結果" : "這裡的內容還在整理中"}</h2><p>試試其他關鍵字或分區，也可以先看看同一座城市的旅遊資訊。</p><Link className="text-link" href={destination.city ? `/cities/${destination.city.slug}` : "/cities"}>探索城市指南</Link></div>}</div>
      {pagination.pages > 1 ? <nav className="travel-pagination" aria-label="結果分頁">{pagination.page > 1 ? <Link href={pageHref(pagination.page - 1)}>上一頁</Link> : <span />}<span>第 {pagination.page} / {pagination.pages} 頁</span>{pagination.page < pagination.pages ? <Link href={pageHref(pagination.page + 1)}>下一頁</Link> : <span />}</nav> : null}
    </section>
  </SiteShell>;
}
