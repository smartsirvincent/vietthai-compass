import Link from "next/link";
import { Facebook, Hash, Instagram, Mail, MessageCircle, Search } from "lucide-react";
import { siteSocials } from "@/data/site";
import { getSiteSettings } from "@/lib/cms-store";

const navItems = [
  ["越南", "/vietnam"],
  ["泰國", "/thailand"],
  ["城市指南", "/cities"],
  ["餐廳美食", "/restaurants"],
  ["景點行程", "/attractions"],
  ["在地生活", "/local-life"],
  ["台商專區", "/taiwan-business"],
  ["商家名錄", "/directory"],
  ["商務合作", "/business"]
];

export async function SiteHeader() {
  const settings = await getSiteSettings();

  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="越泰指南首頁">
        {settings.logoImage ? (
          <img className="brand-logo-image" src={settings.logoImage} alt={`${settings.siteName} Logo`} />
        ) : (
          <span className="brand-mark" aria-hidden="true">VT</span>
        )}
        <span>
          <strong>{settings.siteName}</strong>
          <small>{settings.siteNameEn}</small>
        </span>
      </Link>
      <nav className="main-nav" aria-label="主要導覽">
        {navItems.map(([label, href]) => (
          <Link key={href} href={href}>
            {label}
          </Link>
        ))}
      </nav>
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
