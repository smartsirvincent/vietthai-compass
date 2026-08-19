import { notFound } from "next/navigation";
import { InfoStrip } from "@/components/Cards";
import { SiteShell } from "@/components/SiteShell";
import { getBusinesses, getCities } from "@/lib/cms-store";
import { breadcrumbJsonLd, businessJsonLd } from "@/lib/seo";

function googleMapEmbedUrl(query: string) {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

function contactRows(business: Awaited<ReturnType<typeof getBusinesses>>[number]) {
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
  ].filter(([, value]) => Boolean(value));
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
        <InfoStrip items={[["城市", city?.name || business.citySlug], ["分區", district?.name || "不限分區"], ["特色", business.badges.join(" / ") || "待補"]]} />
      </section>
      <section className="content-layout">
        <article className="panel">
          {business.image ? <img className="article-cover" src={business.image} alt={`${business.name}商家照片`} /> : null}
          <h2>商家介紹</h2>
          <p>{business.description}</p>
          <h2>適合情境</h2>
          <p>這個商家頁可作為讀者查找地點、評估是否前往，以及未來導入合作曝光的入口。若搭配文章介紹、城市頁與分區頁，能讓搜尋流量更自然地連到商家資訊。</p>
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
            {business.googleMapUrl ? <a href={business.googleMapUrl}>Google Map</a> : null}
            {contacts.map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
            {!business.googleMapUrl && !contacts.length ? <p className="muted-text">尚未提供聯絡方式。</p> : null}
          </div>
        </aside>
      </section>
    </SiteShell>
  );
}
