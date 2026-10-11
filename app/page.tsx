import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { ArticleCard, BusinessCard, CityCard, SectionHeader } from "@/components/Cards";
import { ContentImage } from "@/components/ContentImage";
import { SiteShell } from "@/components/SiteShell";
import { getArticles, getBusinesses, getCities, getSiteSettings } from "@/lib/cms-store";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
export const metadata: Metadata = { alternates: { canonical: "/" } };
export default async function HomePage() {
  const [articles, businesses, cities, settings] = await Promise.all([getArticles(), getBusinesses(), getCities(), getSiteSettings()]);
  const newest = [...articles].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 6);
  return <SiteShell>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd(settings)).replace(/</g, "\\u003c") }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd(settings)).replace(/</g, "\\u003c") }} />
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
    <section className="band destination-band"><SectionHeader title="這次，想去哪座城市？" intro="先選目的地，再慢慢安排吃什麼、去哪裡。" href="/cities" /><div className="grid four">{cities.map(city => <CityCard key={city.slug} city={city} />)}</div></section>
    <section className="band"><SectionHeader title="完整指南" intro="最近更新的城市、美食、旅遊須知與在地生活資訊。" href="/articles" /><div className="grid three">{newest.map(article => <ArticleCard key={article.slug} article={article} />)}</div></section>
    <section className="band light"><SectionHeader title="精選商家" intro="看看店內特色、聯絡方式與地圖，把想去的地方排進旅程。" href="/directory" /><div className="grid three">{businesses.slice(0, 3).map(business => <BusinessCard key={business.slug} business={business} />)}</div></section>
    <section className="traveler-partnership"><div><h2>想獲得更多曝光?</h2><p>讓來到越南、泰國的中文旅客認識你的店。</p></div><Link className="text-link" href="/business">商家合作<ArrowRight size={18} /></Link></section>
  </SiteShell>;
}
