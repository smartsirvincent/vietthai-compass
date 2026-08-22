import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, Compass, MapPinned, Newspaper, Search, Sparkles, Store, Utensils } from "lucide-react";
import { ArticleCard, BusinessCard, CategoryVisualCard, CityCard, SectionHeader } from "@/components/Cards";
import { SiteShell } from "@/components/SiteShell";
import { sectionCategoryAssets } from "@/data/category-assets";
import { getArticles, getBusinesses, getCities, getSiteSettings } from "@/lib/cms-store";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: { canonical: "/" }
};

export default async function HomePage() {
  const [articles, businesses, cities, settings] = await Promise.all([getArticles(), getBusinesses(), getCities(), getSiteSettings()]);
  const blogArticles = articles.slice(0, 3);
  const heroImage = settings.heroImage || "/brand-assets/home-hero-vietthai-commerce.png";
  const cityCount = cities.length;
  const businessCount = businesses.length;
  const articleCount = articles.length;

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd(settings)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd(settings)) }} />

      <section className="home-hero">
        <div className="home-hero-media" style={{ "--home-hero-image": `url("${heroImage}")` } as CSSProperties} />
        <div className="home-hero-content">
          <p className="eyebrow">{settings.homeEyebrow}</p>
          <h1>{settings.homeTitle}</h1>
          <p>{settings.homeIntro}</p>
          <form className="hero-search-card" action="/search">
            <Search size={21} />
            <input name="q" type="search" placeholder="搜尋胡志明市餐廳、曼谷景點、Thao Dien 商家" aria-label="站內搜尋" />
            <button type="submit">搜尋</button>
          </form>
          <div className="hero-actions">
            <Link className="primary-button" href="/cities">
              {settings.homePrimaryCtaLabel} <ArrowRight size={18} />
            </Link>
            <Link className="secondary-button" href="/business">{settings.homeSecondaryCtaLabel}</Link>
          </div>
        </div>
        <div className="hero-proof">
          <div>
            <strong>{cityCount} 城市</strong>
            <span>用城市與分區進入越南、泰國內容</span>
          </div>
          <div>
            <strong>{articleCount} 篇文章</strong>
            <span>餐廳、景點、在地生活持續擴充</span>
          </div>
          <div>
            <strong>{businessCount} 商家</strong>
            <span>連到地圖、社群與相關專題</span>
          </div>
        </div>
      </section>

      <section className="route-board-section">
        <div className="route-board-copy">
          <p className="eyebrow">Compass Routes</p>
          <h2>從目的地找到能行動的資訊</h2>
          <p>
            越泰指南不是只把文章排成清單，而是把城市、分區、商家與內容串成路徑。
            讀者可以先選城市，再看餐廳景點與在地生活；商家也能自然出現在相關搜尋情境裡。
          </p>
          <Link className="text-link" href="/search">
            用關鍵字探索 <ArrowRight size={16} />
          </Link>
        </div>
        <div className="route-board" aria-label="越泰指南內容路徑">
          <Link href="/cities" className="route-node route-primary">
            <Compass size={24} />
            <span>第一步</span>
            <strong>城市與分區</strong>
            <small>胡志明市、曼谷、峴港、清邁</small>
          </Link>
          <Link href="/restaurants" className="route-node">
            <Utensils size={22} />
            <span>吃什麼</span>
            <strong>餐廳美食</strong>
            <small>依城市、分區與情境整理</small>
          </Link>
          <Link href="/attractions" className="route-node">
            <MapPinned size={22} />
            <span>去哪裡</span>
            <strong>景點行程</strong>
            <small>半日、一日與順遊安排</small>
          </Link>
          <Link href="/local-life" className="route-node">
            <Newspaper size={22} />
            <span>怎麼生活</span>
            <strong>在地生活</strong>
            <small>交通、社群、長住與日常</small>
          </Link>
          <Link href="/directory" className="route-node route-commerce">
            <Store size={22} />
            <span>可以聯絡</span>
            <strong>精選商家</strong>
            <small>地圖、社群、文章曝光入口</small>
          </Link>
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
