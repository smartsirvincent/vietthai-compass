import { notFound } from "next/navigation";
import { ContentImage } from "@/components/ContentImage";
import { ArticleCard, InfoStrip, SectionHeader } from "@/components/Cards";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ShareButton } from "@/components/ShareButton";
import { MapPin, Phone } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { getArticles, getBusinesses, getCities } from "@/lib/cms-store";
import { breadcrumbJsonLd, businessJsonLd } from "@/lib/seo";
import { findByRouteSlug } from "@/lib/routes";
import thailandAdditions from "@/data/thailand-transit-additions.json";
import { BANGKOK_TRANSIT_STATIONS } from "@/lib/bangkok-transit";
import Link from "next/link";

function googleMapEmbedUrl(query: string) {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

function externalUrl(value: string) {
  return value.startsWith("http://") || value.startsWith("https://") ? value : `https://${value}`;
}

function phoneDigits(value: string) {
  return value.replace(/[^\d+]/g, "");
}

function contactHref(label: string, value: string) {
  if (label === "電話") return `tel:${phoneDigits(value)}`;
  if (label === "Email") return `mailto:${value}`;
  if (label === "WhatsApp") {
    if (value.startsWith("http://") || value.startsWith("https://")) return value;
    return `https://wa.me/${phoneDigits(value).replace(/^\+/, "")}`;
  }
  if (label === "Zalo") {
    if (value.startsWith("http://") || value.startsWith("https://")) return value;
    return `https://zalo.me/${phoneDigits(value).replace(/^\+/, "")}`;
  }
  return externalUrl(value);
}

function contactRows(business: Awaited<ReturnType<typeof getBusinesses>>[number]): Array<[string, string]> {
  return [
    ["電話", business.socials.phone],
    ["WhatsApp", business.socials.whatsapp],
    ["Zalo", business.socials.zalo],
    ["LINE", business.socials.line],
    ["Facebook", business.socials.facebook],
    ["Instagram", business.socials.instagram],
    ["Threads", business.socials.threads],
    ["TikTok", business.socials.tiktok],
    ["Telegram", business.socials.telegram],
    ["官方網站", business.socials.website],
    ["Email", business.socials.email]
  ].filter((entry): entry is [string, string] => Boolean(entry[1]));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const businesses = await getBusinesses();
  const business = findByRouteSlug(businesses, slug);
  if (!business) return {};
  return {
    title: business.name,
    description: business.country === "thailand" ? business.description.slice(0, 155) : business.description,
    alternates: {
      canonical: `/directory/${business.slug}`
    },
    openGraph: {
      url: `/directory/${encodeURIComponent(business.slug)}`,
      title: business.name,
      description: business.country === "thailand" ? business.description.slice(0, 155) : business.description,
      images: [business.image || "/brand-assets/home-business-local-life.png"]
    }
  };
}

export default async function BusinessDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [businesses, cities, articles] = await Promise.all([getBusinesses(), getCities(), getArticles()]);
  const business = findByRouteSlug(businesses, slug);
  if (!business) notFound();
  const city = cities.find((item) => item.slug === business.citySlug);
  const district = city?.districts.find((item) => item.slug === business.districtSlug);
  const contacts = contactRows(business);
  const informationSource = business.country === "thailand" ? thailandAdditions.find(item => item.slug === business.slug)?.source : undefined;
  const stations = business.country === "thailand" && business.citySlug === "bangkok" ? BANGKOK_TRANSIT_STATIONS.filter(s => business.transitStationIds?.includes(s.id)) : [];
  const relatedArticles = articles.filter(article => article.relatedBusinessSlug === business.slug);

  return (
    <SiteShell>
      <Breadcrumbs items={[{ label: "精選商家", href: "/directory" }, ...(city ? [{ label: city.name, href: `/cities/${city.slug}` }] : []), { label: business.name }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd(business)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "首頁", url: "/" }, { name: "商家名錄", url: "/directory" }, { name: business.name, url: `/directory/${business.slug}` }])) }} />
      <section className="page-hero">
        <p className="eyebrow">{business.category}・{business.subcategory}</p>
        <h1>{business.name}</h1>
        {business.updatedAt ? <p>內容更新：<time dateTime={business.updatedAt}>{business.updatedAt.slice(0, 10)}</time></p> : null}
        <p>{business.country === "thailand" ? business.description.split(/\n\s*\n/)[0] : business.description}</p>
        <div className="detail-actions">
          {business.googleMapUrl ? <a className="primary-button" href={business.googleMapUrl} target="_blank" rel="noopener noreferrer"><MapPin size={18} />在 Google 地圖查看</a> : null}
          {business.socials.phone ? <a className="secondary-button" href={`tel:${phoneDigits(business.socials.phone)}`}><Phone size={18} />致電商家</a> : null}
          <ShareButton title={business.name} />
        </div>
        <p className="travel-note">營業時間、價格與店況可能變動，出發前請查看地圖最新資訊或聯絡商家。</p>
      </section>
      <section className="band light">
        <InfoStrip items={[["分類", business.category || "待補"], ["細分類", business.subcategory || "待補"], ["城市", city?.name || business.citySlug], ["分區", district?.name || "不限分區"], ["特色", business.badges.join(" / ") || "待補"]]} />
      </section>
      <section className="content-layout">
        <article className="panel">
          {business.image && !(business.country === "thailand" && business.image.includes("/brand-assets/")) ? <ContentImage className={`article-cover${business.imageCredit?.includes("CC BY-ND") ? " business-photo-uncropped" : ""}`} src={business.image} alt={`${business.name}商家照片`} priority sizes="(max-width: 900px) 100vw, 800px" /> : business.country === "thailand" ? <p className="muted-text">實景照片待補。</p> : null}
          {business.imageCredit && business.imageSource ? <p className="image-credit">照片：{business.imageCredit} · <a href={business.imageSource} target="_blank" rel="noreferrer">查看來源與授權</a></p> : null}
          <h2>商家介紹</h2>
          <p className="preserve-lines">{business.description}</p>
          {informationSource ? <p className="muted-text">資料查核：2026 年 10 月 17 日 · <a href={informationSource} target="_blank" rel="noreferrer">查看官方／觀光機構資料來源</a></p> : null}
          <h2>商家評價</h2>
          <p className="preserve-lines">{business.review || "目前尚未整理完整評價。建議出發前先查看 Google Map 最新評論、營業時間與實際交通狀況，再依自己的用餐或拜訪情境安排。"}</p>
          {business.googleMapUrl ? (
            <div className="map-preview map-preview-wide">
              <h2>Google Map 預覽</h2>
              <iframe
                title={`${business.name} Google Map`}
                src={googleMapEmbedUrl(`${business.name} ${district?.name || ""} ${city?.name || ""}`)}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          ) : null}
        </article>
        <aside className="panel">
          {stations.length ? <><h3>捷運站</h3><ul>{stations.map(s => <li key={s.id}><Link href={`/cities/bangkok?station=${s.id}#bangkok-transit`}>{s.nameZh}站 · {s.name}</Link></li>)}</ul></> : null}
          <h3>聯絡方式</h3>
          <div className="contact-list">
            {business.googleMapUrl ? <a href={business.googleMapUrl} target="_blank" rel="noreferrer">Google Map</a> : null}
            {contacts.map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <a
                  className="contact-value-link"
                  href={contactHref(label, value)}
                  target={label === "電話" ? undefined : "_blank"}
                  rel={label === "電話" ? undefined : "noreferrer"}
                >
                  {value}
                </a>
              </div>
            ))}
            {!business.googleMapUrl && !contacts.length ? <p className="muted-text">尚未提供聯絡方式。</p> : null}
          </div>
        </aside>
      </section>
      {relatedArticles.length ? <section className="band light"><SectionHeader title="關於這間店的文章" /><div className="grid three">{relatedArticles.map(article => <ArticleCard key={article.slug} article={article} />)}</div></section> : null}
    </SiteShell>
  );
}
