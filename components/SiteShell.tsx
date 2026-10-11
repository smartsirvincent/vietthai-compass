import Link from "next/link";
import { ContentImage } from "@/components/ContentImage";
import { Facebook, Hash, Instagram, Mail, Menu, MessageCircle, Search } from "lucide-react";
import { siteSocials } from "@/data/site";
import { getSiteSettings } from "@/lib/cms-store";

const navItems = [
  ["目的地", "/cities"],
  ["旅遊須知", "/travel-info"],
  ["餐廳美食", "/restaurants"],
  ["景點行程", "/attractions"],
  ["在地生活", "/local-life"],
  ["完整指南", "/articles"],
  ["精選商家", "/directory"]
];

export async function SiteHeader() {
  const settings = await getSiteSettings();

  return (
    <header className="site-header">
      <Link className={`brand${settings.logoImage ? "" : " brand-horizontal"}`} href="/" aria-label={`${settings.siteName}首頁`}>
        {settings.logoImage ? (
          <ContentImage className="brand-logo-image" src={settings.logoImage} alt={`${settings.siteName} Logo`} width={72} height={72} sizes="72px" priority />
        ) : (
          <ContentImage src="/brand-assets/logo-02/vietthai-logo-horizontal.png" alt={`${settings.siteName} ${settings.siteNameEn}`} width={2172} height={724} sizes="(max-width: 720px) 190px, 240px" priority />
        )}
        {settings.logoImage ? <span>
          <strong>{settings.siteName}</strong>
          <small>{settings.siteNameEn}</small>
        </span> : null}
      </Link>
      <nav className="main-nav" aria-label="主要導覽">
        {navItems.map(([label, href]) => (
          <Link key={href} href={href}>
            {label}
          </Link>
        ))}
      </nav>
      <details className="mobile-nav">
        <summary aria-label="開啟導覽選單" title="導覽選單"><Menu size={22} /></summary>
        <nav aria-label="手機導覽">
          {navItems.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
      </details>
      <div className="header-actions" aria-label="搜尋與社群連結">
        <Link href="/search" aria-label="搜尋">
          <Search size={18} />
        </Link>
        <a href={siteSocials.line} aria-label="LINE">
          <MessageCircle size={18} />
        </a>
        <a href={siteSocials.facebook} aria-label="Facebook">
          <Facebook size={18} />
        </a>
        <a href={siteSocials.instagram} aria-label="Instagram">
          <Instagram size={18} />
        </a>
        <a href={siteSocials.threads} aria-label="Threads">
          <Hash size={18} />
        </a>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <strong>越泰指南 VietThai Compass</strong>
        <p>整理越南、泰國旅遊、餐廳、景點、在地生活與台商商務資訊。</p>
      </div>
      <div className="footer-grid">
        <Link href="/vietnam">越南</Link>
        <Link href="/thailand">泰國</Link>
        <Link href="/travel-info">旅遊須知</Link>
        <Link href="/articles">完整指南</Link>
        <Link href="/local-life">在地生活</Link>
        <Link href="/taiwan-business">台商專區</Link>
        <Link href="/directory">商家名錄</Link>
        <Link href="/business">商務合作</Link>
      </div>
      <div className="social-row">
        <a href={siteSocials.line}>LINE</a>
        <a href={siteSocials.facebook}>Facebook</a>
        <a href={siteSocials.instagram}>Instagram</a>
        <a href={siteSocials.threads}>Threads</a>
        <a href={siteSocials.tiktok}>TikTok</a>
        <a href={siteSocials.telegram}>Telegram</a>
        <a href={`mailto:${siteSocials.email}`}>
          <Mail size={16} /> Email
        </a>
      </div>
    </footer>
  );
}

export async function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
