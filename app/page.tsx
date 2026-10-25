import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { ArticleCard, CityCard, SectionHeader } from "@/components/Cards";
import { ContentImage } from "@/components/ContentImage";
import { SiteShell } from "@/components/SiteShell";
import { getArticles, getCities, getSiteSettings } from "@/lib/cms-store";
import { articleViewCounts } from "@/lib/engagement-store";
import { homeEditorPicks, homePopularGuides } from "@/lib/home-guides";
export const metadata: Metadata = { alternates: { canonical: "/" } };
export default async function HomePage() {
  const [articles, cities, settings, views] = await Promise.all([getArticles(), getCities(), getSiteSettings(), articleViewCounts()]);
  const editorPicks = homeEditorPicks(articles);
  const popularGuides = homePopularGuides(articles, views);
  return <SiteShell>
    <section className="home-hero traveler-hero">
      <div className="home-hero-media"><ContentImage src={settings.heroImage || "/brand-assets/home-hero-vietthai-commerce.png"} alt="" fill priority sizes="100vw" /></div>
      <div className="home-hero-content">
        <p className="eyebrow">{settings.homeEyebrow}</p><h1>{settings.homeTitle}</h1><p>{settings.homeIntro}</p>
        <form className="trip-search" action="/search">
          <label>去哪裡？<select name="city" defaultValue=""><option value="">所有目的地</option>{(["vietnam", "thailand"] as const).map(country => <optgroup key={country} label={country === "vietnam" ? "越南" : "泰國"}>{cities.filter(city => city.country === country).map(city => <option key={city.slug} value={city.slug}>{city.name}</option>)}</optgroup>)}</select></label>
          <label>想找什麼？<input name="q" type="search" placeholder="餐廳、景點、咖啡廳…" /></label>
          <button className="primary-button" type="submit"><Search size={18} />搜尋</button>
        </form>
        <div className="hero-city-links">{cities.slice(0, 4).map(city => <Link key={city.slug} href={`/cities/${city.slug}`}>{city.name}<ArrowRight size={14} /></Link>)}</div>
      </div>
    </section>
    <section className="band"><SectionHeader title="編輯精選" intro="從完整指南挑選的近期文章。" href="/articles" /><div className="grid three">{editorPicks.map(article => <ArticleCard key={article.slug} article={article} />)}</div></section>
    <section className="band light"><SectionHeader title="熱門指南" intro="讀者最常閱讀的旅遊資訊。" href="/articles" /><div className="grid three">{popularGuides.map(article => <ArticleCard key={article.slug} article={article} />)}</div></section>
    <section className="band destination-band"><SectionHeader title="這次，想去哪座城市？" intro="先選目的地，再慢慢安排吃什麼、去哪裡。" href="/cities" /><div className="grid four">{cities.map(city => <CityCard key={city.slug} city={city} />)}</div></section>
    <section className="traveler-partnership"><div><h2>想獲得更多曝光?</h2><p>讓來到越南、泰國的中文旅客認識你的店。</p></div><Link className="text-link" href="/business">商家合作<ArrowRight size={18} /></Link></section>
  </SiteShell>;
}
