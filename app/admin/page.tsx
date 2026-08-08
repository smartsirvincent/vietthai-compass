import Link from "next/link";
import { researchBriefs } from "@/data/site";
import { getArticles, getBusinesses, getCities } from "@/lib/cms-store";

export default async function AdminDashboardPage() {
  const [articles, businesses, cities] = await Promise.all([getArticles(), getBusinesses(), getCities()]);

  return (
    <>
      <p className="eyebrow">Dashboard</p>
      <h1>後台儀表板</h1>
      <p>管理文章、城市與商家內容。這些資料目前儲存在本機內容檔，之後部署雲端時可切換成雲端資料庫。</p>
      <section className="grid four">
        <div className="panel"><h3>城市</h3><p>{cities.length} 個城市頁</p><Link className="text-link" href="/admin/cities">管理城市</Link></div>
        <div className="panel"><h3>文章</h3><p>{articles.length} 篇文章</p><Link className="text-link" href="/admin/articles">管理文章</Link></div>
        <div className="panel"><h3>商家</h3><p>{businesses.length} 個商家</p><Link className="text-link" href="/admin/businesses">管理商家</Link></div>
        <div className="panel"><h3>內容任務</h3><p>{researchBriefs.length} 個研究任務</p><Link className="text-link" href="/admin/content-engine">查看任務</Link></div>
      </section>
      <section className="panel" style={{ marginTop: 24 }}>
        <h2>雲端部署建議</h2>
        <p>正式上線時建議使用 Vercel + Supabase 或 Neon Postgres，讓後台編輯內容能安全持久保存，也方便多人管理。</p>
      </section>
    </>
  );
}
