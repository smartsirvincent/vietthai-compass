import type { Metadata } from "next";
import { PublicTracking } from "@/components/PublicTracking";
import { siteUrl } from "@/lib/seo";
import { defaultSiteSettings, getSiteSettings } from "@/lib/cms-store";
import "./globals.css";
import "./travel.css";
import "./brand-theme.css";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings().catch(() => defaultSiteSettings);
  const siteName = settings.siteName || "越泰指南";
  const siteDescription = settings.siteDescription || settings.homeIntro || "";
  const ogImage = settings.heroImage || "/brand-assets/vietthai-compass-article-cover-hero.png";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${siteName}｜越南泰國旅遊、在地生活與台商商務指南`,
      template: `%s｜${siteName}`
    },
    description: siteDescription,
    applicationName: siteName,
    authors: [{ name: settings.siteNameEn || "VietThai Compass Editorial" }],
    creator: siteName,
    publisher: siteName,
    category: "travel",
    keywords: [
      "越南旅遊",
      "泰國旅遊",
      "越南自由行",
      "泰國自由行",
      "越南餐廳",
      "泰國餐廳",
      "台商",
      "在地生活",
      "越南 SEO",
      "泰國 SEO"
    ],
    alternates: {
      canonical: "/",
      types: { "application/rss+xml": "/feed.xml" }
    },
    verification: { google: settings.googleSiteVerification || undefined },
    openGraph: {
      type: "website",
      locale: "zh_TW",
      siteName,
      title: `${siteName}｜越南泰國旅遊、在地生活與台商商務指南`,
      description: siteDescription,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${siteName} ${settings.siteNameEn || ""}`.trim()
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteName}｜越南泰國旅遊、在地生活與台商商務指南`,
      description: siteDescription,
      images: [ogImage]
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1
      }
    },
    icons: {
      icon: "/brand-assets/logo-02/vietthai-logo-symbol.png",
      apple: "/brand-assets/logo-02/vietthai-logo-symbol.png"
    }
  };
}

function cleanTrackingId(value = "", prefix: "G-" | "GTM-") {
  const pattern = prefix === "G-" ? /^G-[A-Z0-9_-]+$/ : /^GTM-[A-Z0-9_-]+$/;
  const normalized = value.trim().toUpperCase();
  return pattern.test(normalized) ? normalized : "";
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  const ga4Id = cleanTrackingId(settings.ga4Id, "G-");
  const gtmId = cleanTrackingId(settings.gtmId, "GTM-");

  return (
    <html lang="zh-Hant-TW">
      <body>
        {children}
        <PublicTracking ga4Id={ga4Id} gtmId={gtmId} />
      </body>
    </html>
  );
}
