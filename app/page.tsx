import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { ArticleCard, BusinessCard, CategoryVisualCard, CityCard, SectionHeader } from "@/components/Cards";
import { SiteShell } from "@/components/SiteShell";
import { sectionCategoryAssets } from "@/data/category-assets";
import { getArticles, getBusinesses, getCities } from "@/lib/cms-store";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: { canonical: "/" }
};

export default async function HomePage() {
  const [articles, businesses, cities] = await Promise.all([getArticles(), getBusinesses(), getCities()]);
  const blogArticles = articles.slice(0, 3);

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }} />

      <section className="home-hero">
        <div className="home-hero-media" />
        <div className="home-hero-content">
          <p className="eyebrow">VietThai Compass</p>
          <h1>越南、泰國中文旅遊與在地生活指南</h1>
          <p>
            整理越南與泰國城市指南、餐廳美食、景點行程、在地生活與商家資訊，幫讀者快速找到可前往、
            可收藏、可比較的實用內容。
          </p>
          <form className="hero-search-card" action="/search">
            <Search size={21} />
            <input name="q" type="search" placeholder="搜尋胡志明市餐廳、曼谷景點、Thao Dien 商家" aria-label="站內搜尋" />
            <button type="submit">搜尋</button>
          </form>
          <div className="hero-actions">
            <Link className="primary-button" href="/cities">
              探索城市 <ArrowRight size={18} />
            </Link>
            <Link className="secondary-button" href="/business">商務合作</Link>
          </div>
        </div>
      </section>

      <section className="band">
        <SectionHeader
          eyebrow="Content Categories"
          title="內容分類"
          intro="依照讀者會搜尋的主題整理內容，從城市、餐廳、景點到在地生活，快速找到下一步。"
        />
        <div className="grid three">
          {sectionCategoryAssets.map((category) => (
            <CategoryVisualCard key={category.href} {...category} />
          ))}
        </div>
      </section>

      <section className="band light">
        <SectionHeader
          eyebrow="Destination Hubs"
          title="城市指南"
          intro="用城市與分區建立入口，讀者可以依照目的地找到餐廳、景點、生活資訊與商家。"
          href="/cities"
        />
        <div className="grid four">
          {cities.slice(0, 4).map((city) => (
            <CityCard city={city} key={city.slug} />
          ))}
        </div>
      </section>

      <section className="band">
        <SectionHeader
          eyebrow="Editorial"
          title="精選文章"
          intro="用搜尋需求規劃文章，涵蓋自由行、餐廳、景點、在地生活與台商商務主題。"
          href="/articles"
        />
        <div className="grid three">
          {articles.slice(0, 3).map((article) => (
            <ArticleCard article={article} key={article.slug} />
          ))}
        </div>
      </section>

      <section className="business-showcase">
        <div className="business-showcase-copy">
          <p className="eyebrow">Selected Directory</p>
          <h2>精選商家</h2>
          <p>
            從讀者角度整理值得收藏的餐廳、咖啡廳與在地服務，提供位置、特色、社群連結與相關文章，
            讓訪客更容易判斷是否適合前往或進一步了解。
          </p>
          <Link className="secondary-button" href="/directory">查看商家目錄</Link>
        </div>
        <div className="business-card-stack">
          {businesses.slice(0, 2).map((business) => (
            <BusinessCard business={business} key={business.slug} />
          ))}
        </div>
      </section>

      {blogArticles.length ? (
        <section className="band light">
          <SectionHeader
            eyebrow="Blog"
            title="部落格文章"
            intro="持續更新越南與泰國的餐廳、城市、景點與生活文章，幫讀者用中文快速掌握重點。"
            href="/articles"
          />
          <div className="grid three">
            {blogArticles.map((article) => (
              <ArticleCard article={article} key={article.slug} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="cta-band">
        <Sparkles size={28} />
        <h2>想獲得更多曝光?</h2>
        <p>越泰指南可協助商家規劃文章、商家頁、社群導流與合作內容，讓在地服務更容易被中文讀者找到。</p>
        <Link className="secondary-button" href="/business">查看合作方式</Link>
      </section>
    </SiteShell>
  );
}
