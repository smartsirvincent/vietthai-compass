import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard, SectionHeader } from "@/components/Cards";
import { ContentImage } from "@/components/ContentImage";
import { ArticleHtml } from "@/components/ArticleHtml";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ShareButton } from "@/components/ShareButton";
import { articleOutline } from "@/lib/article-outline";
import { MapPin } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { getArticles, getBusinesses, getCities, getSiteSettings } from "@/lib/cms-store";
import { articleJsonLd, breadcrumbJsonLd, jsonLd } from "@/lib/seo";
import { findByRouteSlug } from "@/lib/routes";

function renderInlineLinks(text: string) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, index) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (!match) return part;
    return <a key={index} href={match[2]}>{match[1]}</a>;
  });
}

function renderArticleContent(content: string) {
  if (/<(h1|h2|h3|p|div|img|strong|em|span|figure|figcaption|ul|ol|li|br)\b/i.test(content)) {
    return <ArticleHtml content={content} />;
  }

  let section = 0;
  return content
    .split(/\n+/)
    .map((line, index) => {
      const image = line.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (image) return <ContentImage className="article-inline-image" key={index} src={image[2]} alt={image[1]} sizes="(max-width: 900px) 100vw, 800px" />;
      if (line.startsWith("# ")) return <h2 id={`article-section-${++section}`} key={index}>{line.replace("# ", "")}</h2>;
      if (line.startsWith("## ")) return <h2 id={`article-section-${++section}`} key={index}>{line.replace("## ", "")}</h2>;
      if (line.startsWith("### ")) return <h3 id={`article-section-${++section}`} key={index}>{line.replace("### ", "")}</h3>;
      if (!line.trim()) return null;
      return <p key={index}>{renderInlineLinks(line)}</p>;
    });
}

function googleMapEmbedUrl(query: string) {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const articles = await getArticles();
  const article = findByRouteSlug(articles, slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: `/articles/${article.slug}`
    },
    openGraph: {
      type: "article",
      url: `/articles/${encodeURIComponent(article.slug)}`,
      modifiedTime: article.updatedAt,
      publishedTime: article.publishedAt || undefined,
      title: article.title,
      description: article.excerpt,
      images: [article.coverImage]
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.coverImage]
    }
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [articles, cities, businesses, settings] = await Promise.all([getArticles(), getCities(), getBusinesses(), getSiteSettings()]);
  const article = findByRouteSlug(articles, slug);
  if (!article) notFound();

  const city = cities.find((item) => item.slug === article.citySlug);
  const district = city?.districts.find((item) => item.slug === article.districtSlug);
  const selectedBusiness = article.relatedBusinessSlug
    ? businesses.find((business) => business.slug === article.relatedBusinessSlug)
    : undefined;
  const relatedBusinesses = selectedBusiness
    ? [selectedBusiness]
    : businesses.filter((business) => (
        business.citySlug === article.citySlug &&
        (!article.districtSlug || business.districtSlug === article.districtSlug)
      ));
  const mapBusiness = selectedBusiness;
  const outline = articleOutline(article.content);
  const businessIntro = article.businessIntro || mapBusiness?.description;
  const businessFeatures = article.businessFeatures?.length ? article.businessFeatures : mapBusiness?.badges || [];
  const relatedArticles = articles.filter((item) => item.slug !== article.slug &&
    (item.citySlug === article.citySlug || item.category === article.category)).slice(0, 3);

  return (
    <SiteShell>
      <Breadcrumbs items={[{ label: "完整指南", href: "/articles" }, ...(city ? [{ label: city.name, href: `/cities/${city.slug}` }] : []), { label: article.category }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(articleJsonLd(article, settings)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "首頁", url: "/" }, { name: "文章", url: "/articles" }, { name: article.title, url: `/articles/${article.slug}` }])) }} />
      <section className="page-hero">
        <p className="eyebrow">{article.category}</p>
        <h1>{article.title}</h1>
        <p>{article.excerpt}</p>
        <div className="detail-actions">
          <Link href="/about">{settings.siteName || "越泰指南"}編輯部</Link>
          {article.publishedAt ? <span>發布日期 <time dateTime={article.publishedAt}>{article.publishedAt.slice(0, 10)}</time></span> : null}
          <span className="article-date">更新日期 <time dateTime={article.updatedAt}>{article.updatedAt.slice(0, 10)}</time></span>
          {mapBusiness?.googleMapUrl ? <a className="primary-button" href={mapBusiness.googleMapUrl} target="_blank" rel="noopener noreferrer"><MapPin size={18} />在 Google 地圖查看</a> : null}
          <ShareButton title={article.title} />
        </div>
      </section>
      <section className="article-layout">
        <article className="panel article-main">
          <ContentImage className="article-cover" src={article.coverImage} alt={article.photoAlt || article.title} priority sizes="(max-width: 900px) 100vw, 800px" />
          {outline.length > 1 ? <details className="article-toc" open><summary>文章目錄</summary><nav aria-label="文章目錄"><ol>{outline.map(item => <li key={item.id} className={item.level === 3 ? "toc-subheading" : ""}><a href={`#${item.id}`}>{item.text}</a></li>)}</ol></nav></details> : null}
          <div className="article-body">{renderArticleContent(article.content)}</div>
          {article.sources?.length ? <section aria-label="資料來源"><h2>資料來源</h2><ul>{article.sources.map(url => <li key={url}><a href={url} target="_blank" rel="noopener noreferrer">{url}</a></li>)}</ul></section> : null}

          {businessIntro || businessFeatures.length || mapBusiness ? (
            <section className="business-summary-block">
              <h2>商家介紹</h2>
              <p className="preserve-lines">{businessIntro}</p>
              {businessFeatures.length ? (
                <>
                  <h2>商家特色</h2>
                  <div className="feature-list">
                    {businessFeatures.map((feature) => <span key={feature}>{feature}</span>)}
                  </div>
                </>
              ) : null}
              {mapBusiness ? <div className="map-preview map-preview-wide">
                <h2>Google Map 預覽</h2>
                <iframe
                  title={`${mapBusiness.name} Google Map`}
                  src={googleMapEmbedUrl(`${mapBusiness.name} ${district?.name || ""} ${city?.name || ""}`)}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div> : null}
            </section>
          ) : null}

          <h2>相關關鍵字</h2>
          <div className="keyword-row">{article.keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}</div>
        </article>
        <aside className="panel article-side">
          <h3>文章資訊</h3>
          <p>分類：{article.category}</p>
          <p>城市：{city?.name || "不限城市"}</p>
          <p>分區：{district?.name || "不限分區"}</p>
          <p>最後更新：{article.updatedAt}</p>

          <h3>相關連結</h3>
          <div className="link-list">
            {city ? <Link href={`/cities/${city.slug}`}>{city.name}城市指南</Link> : null}
            {city && district ? <Link href={`/cities/${city.slug}/districts/${district.slug}`}>{city.name}{district.name}分區指南</Link> : null}
            {relatedBusinesses.map((business) => (
              <Link href={`/directory/${business.slug}`} key={business.slug}>{business.name}</Link>
            ))}
            {mapBusiness?.googleMapUrl ? <a href={mapBusiness.googleMapUrl}>Google Map</a> : null}
            {mapBusiness?.socials.website ? <a href={mapBusiness.socials.website}>官方網站</a> : null}
          </div>
        </aside>
      </section>
      <section className="band light">
        <SectionHeader title="延伸閱讀" intro="繼續查看城市指南、分區內容、餐廳名單與在地生活文章，從單篇介紹延伸到完整行程與生活決策。" />
        <div className="grid three">{relatedArticles.map((item) => <ArticleCard article={item} key={item.slug} />)}</div>
      </section>
    </SiteShell>
  );
}
