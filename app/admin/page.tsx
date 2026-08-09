import Link from "next/link";
import { researchBriefs } from "@/data/site";
import { requireAdminRole } from "@/lib/admin-auth";
import { getArticles, getBusinesses, getCities, getCmsStorageMode } from "@/lib/cms-store";

export default async function AdminDashboardPage() {
  await requireAdminRole();
  const [articles, businesses, cities] = await Promise.all([getArticles(), getBusinesses(), getCities()]);
  const storageMode = getCmsStorageMode();
  const storageLabel =
    storageMode === "cloud-database"
      ? "雲端資料庫保存：後台編輯會長期保存。"
      : storageMode === "readonly-seed"
        ? "尚未設定雲端資料庫：正式環境禁止後台寫入，避免資料遺失。"
        : "本機 JSON 開發模式：只適合本機測試。";

  return (
    <>
      <p className="eyebrow">Dashboard</p>
      <h1>後台儀表板</h1>
      <p>管理文章、城市、商家與 SEO 內容任務。正式營運時，後台資料應連接雲端資料庫保存。</p>
      <section className="grid four">
        <div className="panel"><h3>城市</h3><p>{cities.length} 個城市頁</p><Link className="text-link" href="/admin/cities">管理城市</Link></div>
        <div className="panel"><h3>文章</h3><p>{articles.length} 篇文章</p><Link className="text-link" href="/admin/articles">管理文章</Link></div>
        <div className="panel"><h3>商家</h3><p>{businesses.length} 個商家</p><Link className="text-link" href="/admin/businesses">管理商家</Link></div>
        <div className="panel"><h3>內容任務</h3><p>{researchBriefs.length} 個研究任務</p><Link className="text-link" href="/admin/content-engine">查看任務</Link></div>
      </section>
      <section className="panel" style={{ marginTop: 24 }}>
        <h2>追蹤碼設定</h2>
        <p>可在後台填入 GA4 或 GTM 代碼，系統會自動埋設到前台頁面。</p>
        <Link className="text-link" href="/admin/settings">管理網站設定</Link>
      </section>
      <section className="panel" style={{ marginTop: 24 }}>
        <h2>資料保存狀態</h2>
        <p>{storageLabel}</p>
      </section>
      <section className="panel" style={{ marginTop: 24 }}>
        <h2>正式部署建議</h2>
        <p>請在 Vercel 設定 `DATABASE_URL` 或 `POSTGRES_URL`。第一次連線時系統會自動建立資料表並匯入目前的文章、城市與商家資料。</p>
      </section>
    </>
  );
}
