import { notFound } from "next/navigation";
import { InfoStrip } from "@/components/Cards";
import { SiteShell } from "@/components/SiteShell";
import { getBusinesses, getCities } from "@/lib/cms-store";
import { breadcrumbJsonLd, businessJsonLd } from "@/lib/seo";

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

export async function generateStaticParams() {
  const businesses = await getBusinesses();
  return businesses.map((business) => ({ slug: business.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const businesses = await getBusinesses();
  const business = businesses.find((item) => item.slug === slug);
  if (!business) return {};
  return {
    title: business.name,
    description: business.description,
    alternates: {
      canonical: `/directory/${business.slug}`
    },
    openGraph: {
      title: business.name,
      description: business.description,
      images: [business.image || "/brand-assets/home-business-local-life.png"]
    }
  };
}

export default async function BusinessDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [businesses, cities] = await Promise.all([getBusinesses(), getCities()]);
  const business = businesses.find((item) => item.slug === slug);
  if (!business) notFound();
  const city = cities.find((item) => item.slug === business.citySlug);
  const district = city?.districts.find((item) => item.slug === business.districtSlug);
  const contacts = contactRows(business);

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd(business)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "首頁", url: "/" }, { name: "商家名錄", url: "/directory" }, { name: business.name, url: `/directory/${business.slug}` }])) }} />
      <section className="page-hero">
        <p className="eyebrow">{business.category}</p>
        <h1>{business.name}</h1>
        <p>{business.description}</p>
      </section>
      <section className="band light">
        <InfoStrip items={[["分類", business.category || "待補"], ["城市", city?.name || business.citySlug], ["分區", district?.name || "不限分區"], ["特色", business.badges.join(" / ") || "待補"]]} />
      </section>
      <section className="content-layout">
        <article className="panel">
          {business.image ? <img className="article-cover" src={business.image} alt={`${business.name}商家照片`} /> : null}
          <h2>商家介紹</h2>
          <p className="preserve-lines">{business.description}</p>
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
    </SiteShell>
  );
}
