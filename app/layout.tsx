import type { Metadata } from "next";
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant-TW">
      <body>{children}</body>
    </html>
  );
}
