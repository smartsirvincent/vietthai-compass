import { Article, City, DirectoryBusiness, SiteSettings } from "@/lib/types";

export const siteUrl = "https://vietthaicompass.com";
export const siteName = "越泰指南";
export const siteAlternateName = "VietThai Compass";

export function absoluteUrl(path = "") {
  if (path.startsWith("http")) return path;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function organizationJsonLd(settings: SiteSettings = {}) {
  const currentSiteName = settings.siteName || siteName;
  const currentAlternateName = settings.siteNameEn || siteAlternateName;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: currentSiteName,
    alternateName: currentAlternateName,
    url: siteUrl,
    logo: absoluteUrl(settings.logoImage || "/brand-assets/vietthai-compass-square-icon.png"),
    sameAs: [
      "https://facebook.com/vietthaicompass",
      "https://instagram.com/vietthaicompass",
      "https://www.threads.net/@vietthaicompass",
      "https://www.tiktok.com/@vietthaicompass",
      "https://t.me/vietthaicompass",
      "https://line.me/R/ti/p/@vietthaicompass"
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "business inquiries",
      email: "hello@vietthaicompass.com",
      availableLanguage: ["zh-Hant", "en"]
    }
  };
}

export function websiteJsonLd(settings: SiteSettings = {}) {
  const currentSiteName = settings.siteName || siteName;
  const currentAlternateName = settings.siteNameEn || siteAlternateName;
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: currentSiteName,
    alternateName: currentAlternateName,
    url: siteUrl,
    publisher: organizationJsonLd(settings),
    inLanguage: "zh-Hant-TW",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

export function articleJsonLd(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: absoluteUrl(`/articles/${article.slug}`),
    headline: article.title,
    description: article.excerpt,
    image: absoluteUrl(article.coverImage),
    datePublished: article.updatedAt,
    dateModified: article.updatedAt,
    author: {
      "@type": "Organization",
      name: `${siteName}編輯部`,
      url: siteUrl
    },
    publisher: organizationJsonLd(),
    keywords: article.keywords.join(", "),
    inLanguage: "zh-Hant-TW"
  };
}

export function cityJsonLd(city: City) {
  return {
    "@context": "https://schema.org",
    "@type": "City",
    name: city.name,
    alternateName: city.nameEn,
    description: city.summary,
    url: absoluteUrl(`/cities/${city.slug}`),
    image: absoluteUrl(city.image),
    containedInPlace: {
      "@type": "Country",
      name: city.country === "vietnam" ? "Vietnam" : "Thailand"
    },
    inLanguage: "zh-Hant-TW"
  };
}

export function businessJsonLd(business: DirectoryBusiness) {
  const sameAs = [
    business.googleMapUrl,
    business.socials.facebook,
    business.socials.instagram,
    business.socials.threads,
    business.socials.tiktok,
    business.socials.telegram,
    business.socials.line,
    business.socials.zalo
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    description: business.description,
    url: absoluteUrl(`/directory/${business.slug}`),
    sameAs,
    areaServed: business.country === "vietnam" ? "Vietnam" : "Thailand",
    telephone: business.socials.phone,
    email: business.socials.email,
    image: absoluteUrl(business.image || "/brand-assets/home-business-local-life.png")
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url)
    }))
  };
}
