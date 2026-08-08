import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionHeader } from "@/components/Cards";
import { SiteShell } from "@/components/SiteShell";
import { getArticles, getBusinesses, getCities } from "@/lib/cms-store";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo";

function renderInlineLinks(text: string) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, index) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (!match) return part;
    return <a key={index} href={match[2]}>{match[1]}</a>;
  });
}

function renderArticleContent(content: string) {
  return content
    .split(/\n+/)
    .map((line, index) => {
      const image = line.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (image) return <img className="article-inline-image" key={index} src={image[2]} alt={image[1]} />;
      if (line.startsWith("# ")) return <h1 key={index}>{line.replace("# ", "")}</h1>;
      if (line.startsWith("## ")) return <h2 key={index}>{line.replace("## ", "")}</h2>;
      if (line.startsWith("### ")) return <h3 key={index}>{line.replace("### ", "")}</h3>;
      if (!line.trim()) return null;
      return <p key={index}>{renderInlineLinks(line)}</p>;
    });
}

function googleMapEmbedUrl(query: string) {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const articles = await getArticles();
  const article = articles.find((item) => item.slug === slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: `/articles/${article.slug}`
    },
    openGraph: {
      type: "article",
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
  const [articles, cities, businesses] = await Promise.all([getArticles(), getCities(), getBusinesses()]);
  const article = articles.find((item) => item.slug === slug);
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
  const mapBusiness = relatedBusinesses[0];
  const businessIntro = article.businessIntro || mapBusiness?.description;
  const businessFeatures = article.businessFeatures?.length ? article.businessFeatures : mapBusiness?.badges || [];
  const intentLabel = article.intent === "commercial" ? "商務轉換" : article.intent === "traffic" ? "搜尋流量" : "權威建立";

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(article)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "首頁", url: "/" }, { name: "文章", url: "/articles" }, { name: article.title, url: `/articles/${article.slug}` }])) }} />
      <section className="page-hero">
        <p className="eyebrow">{article.category}</p>
        <h1>{article.title}</h1>
        <p>{article.excerpt}</p>
      </section>
      <section className="article-layout">
        <article className="panel article-main">
          <img className="article-cover" src={article.coverImage} alt={article.photoAlt || article.title} />
          <div className="article-body">{renderArticleContent(article.content)}</div>

          {mapBusiness ? (
            <section className="business-summary-block">
              <h2>商家介紹</h2>
              <p>{businessIntro}</p>
              {businessFeatures.length ? (
                <>
                  <h2>商家特色</h2>
                  <div className="feature-list">
                    {businessFeatures.map((feature) => <span key={feature}>{feature}</span>)}
                  </div>
                </>
              ) : null}
              <div className="map-preview map-preview-wide">
                <h2>Google Map 預覽</h2>
                <iframe
                  title={`${mapBusiness.name} Google Map`}
                  src={googleMapEmbedUrl(`${mapBusiness.name} ${district?.name || ""} ${city?.name || ""}`)}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
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
          <p>目的：{intentLabel}</p>

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
      </section>
    </SiteShell>
  );
}
