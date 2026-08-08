import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "越泰指南後台",
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <span className="brand-mark admin-brand-mark" aria-hidden="true">VT</span>
        <h2>越泰指南後台</h2>
        <Link href="/admin">儀表板</Link>
        <Link href="/admin/articles">文章管理</Link>
        <Link href="/admin/cities">城市管理</Link>
        <Link href="/admin/businesses">商家管理</Link>
        <Link href="/admin/content-engine">SEO 內容引擎</Link>
        <Link href="/">回到網站</Link>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
