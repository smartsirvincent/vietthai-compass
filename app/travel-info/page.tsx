import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/Cards";
import { DestinationFilters } from "@/components/DestinationFilters";
import { SiteShell } from "@/components/SiteShell";
import { getArticles, getCities } from "@/lib/cms-store";
import { cleanExploreQuery, inDestination, resolveDestination, type ExploreQuery } from "@/lib/explore";
import { locationTerms, matchesSearch } from "@/lib/search";

export const metadata: Metadata = {
  title: "旅遊須知｜越南泰國天氣、簽證與入境準備",
  description: "整理越南、泰國每月天氣、台灣護照簽證、入境申報、電壓插座與旅行準備，附官方來源與查核日期。",
  alternates: { canonical: "/travel-info" }
};

const topics = [
  ["visa", "簽證與入境", "#visa"],
  ["weather", "天氣與旅行季節", "#weather"],
  ["power", "電壓插座與通訊", "#power"]
] as const;

export default async function TravelInfoPage({ searchParams }: { searchParams: Promise<ExploreQuery> }) {
  const [rawQuery, articles, cities] = await Promise.all([searchParams, getArticles(), getCities()]);
  const query = cleanExploreQuery(rawQuery);
  const destination = resolveDestination(query, cities);
  const guides = articles.filter(article => article.category === "旅遊須知" &&
    (inDestination(article, destination, cities) || article.slug === "vietnam-thailand-power-plug-adapter-guide") &&
    matchesSearch([article.title, article.excerpt, ...article.keywords, ...locationTerms(article, cities)], query.q || ""));
  const topicById: Record<string, string> = { visa: "簽證與入境", weather: "天氣與旅行季節", power: "電壓插座與通訊" };

  return <SiteShell>
    <section className="explore-heading"><div><p className="eyebrow">TRAVEL ESSENTIALS</p><h1>旅遊須知</h1><p>出發前先把天氣、簽證、入境和用電準備好。政策文章附官方來源與查核日期。</p></div></section>
    <section className="band explore-results">
      <DestinationFilters key={`${destination.country}:${destination.city?.slug}:${destination.district?.slug}:${query.q}`} action="/travel-info" cities={cities.map(({ slug, name, country, districts }) => ({ slug, name, country, districts }))} country={destination.country} city={destination.city?.slug} district={destination.district?.slug} query={query.q || ""} />
      <nav className="result-jumps travel-topic-links" aria-label="旅遊須知主題">{topics.map(([id, label, href]) => <a href={href} key={id}>{label}</a>)}<Link href="/articles">瀏覽所有完整指南</Link></nav>
      {!guides.length ? <div className="empty-state"><h2>這個目的地的旅遊須知還在整理中</h2><p>先看看越南與泰國的通用準備資訊，或瀏覽所有完整指南。</p><Link className="text-link" href="/articles">前往完整指南</Link></div> : topics.map(([id, label]) => {
        const group = guides.filter(article => article.keywords.includes(topicById[id]));
        return group.length ? <section className="travel-topic-section" id={id} key={id}><div className="results-summary"><h2>{label}</h2><span>{group.length} 篇</span></div><div className="grid three">{group.map(article => <ArticleCard key={article.slug} article={article} />)}</div></section> : null;
      })}
    </section>
  </SiteShell>;
}
