import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { clearAdminSession, getAdminSession } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "越泰指南後台",
  robots: {
    index: false,
    follow: false
  }
};

async function logoutAction() {
  "use server";
  await clearAdminSession();
  redirect("/admin/login");
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();

  if (!session) return <>{children}</>;

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <span className="brand-mark admin-brand-mark" aria-hidden="true">VT</span>
        <h2>越泰指南後台</h2>
        <p className="admin-user">登入：{session.username} / {session.role}</p>
        <Link href="/admin">儀表板</Link>
        <Link href="/admin/articles">文章管理</Link>
        <Link href="/admin/cities">城市管理</Link>
        <Link href="/admin/businesses">商家管理</Link>
        <Link href="/admin/content-engine">SEO 內容引擎</Link>
        <Link href="/">返回前台</Link>
        <form action={logoutAction} className="admin-logout-form">
          <button type="submit">登出</button>
        </form>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
