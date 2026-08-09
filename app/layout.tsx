import type { Metadata } from "next";
import Script from "next/script";
import { getSiteSettings } from "@/lib/cms-store";
import "./globals.css";

const siteName = "越泰指南";
const siteDescription =
  "越泰指南整理越南、泰國旅遊攻略、餐廳景點、在地生活與台商商務資訊，協助讀者快速規劃行程，也協助當地商家取得中文 SEO 曝光。";

export const metadata: Metadata = {
  metadataBase: new URL("https://vietthaicompass.com"),
  title: {
    default: `${siteName}｜越南泰國旅遊、在地生活與台商商務指南`,
    template: `%s｜${siteName}`
  },
  description: siteDescription,
  applicationName: siteName,
  authors: [{ name: "VietThai Compass Editorial" }],
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
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    siteName,
    title: `${siteName}｜越南泰國旅遊、在地生活與台商商務指南`,
    description: siteDescription,
    url: "https://vietthaicompass.com",
    images: [
      {
        url: "/brand-assets/vietthai-compass-article-cover-hero.png",
        width: 1200,
        height: 630,
        alt: "越泰指南 VietThai Compass"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName}｜越南泰國旅遊、在地生活與台商商務指南`,
    description: siteDescription,
    images: ["/brand-assets/vietthai-compass-article-cover-hero.png"]
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
    icon: "/brand-assets/vietthai-compass-square-icon.png",
    apple: "/brand-assets/vietthai-compass-square-icon.png"
  }
};

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
        {gtmId ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        ) : null}
        {children}
        {ga4Id ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} strategy="afterInteractive" />
            <Script id="ga4-tracking" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${ga4Id}');
              `}
            </Script>
          </>
        ) : null}
        {gtmId ? (
          <Script id="gtm-tracking" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
            `}
          </Script>
        ) : null}
      </body>
    </html>
  );
}
