import Link from "next/link";
import { ArrowRight, Building2, Database, FileText, Globe2, MapPinned, SearchCheck, Settings, Sparkles } from "lucide-react";
import { researchBriefs } from "@/data/site";
import { requireAdminRole } from "@/lib/admin-auth";
import { getArticles, getBusinesses, getCities, getCmsStorageMode } from "@/lib/cms-store";

function formatDate(value?: string) {
  if (!value) return "尚未記錄";
  return new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(value));
}

export default async function AdminDashboardPage() {
  await requireAdminRole();
  const [articles, businesses, cities] = await Promise.all([getArticles(), getBusinesses(), getCities()]);
  const storageMode = getCmsStorageMode();
  const isCloudStorage = storageMode === "cloud-database";
  const storageLabel =
    isCloudStorage
      ? "雲端資料庫保存：後台編輯會長期保存。"
      : storageMode === "readonly-seed"
        ? "尚未設定雲端資料庫：正式環境禁止後台寫入，避免資料遺失。"
        : "本機 JSON 開發模式：只適合本機測試。";
  const latestArticles = [...articles]
    .sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""))
    .slice(0, 4);
  const latestBusinesses = [...businesses]
    .sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""))
    .slice(0, 4);
  const cityDistrictCount = cities.reduce((total, city) => total + city.districts.length, 0);
  const taiwanBusinessCount = businesses.filter((business) => business.isTaiwanBusiness).length;
  const quickActions = [
    { href: "/admin/articles", label: "新增 SEO 文章", icon: FileText, note: "文章、照片、H1/H2/H3 與商家關聯" },
    { href: "/admin/businesses", label: "新增商家", icon: Building2, note: "分類、城市分區、聯絡方式與地圖" },
    { href: "/admin/cities", label: "管理城市分區", icon: MapPinned, note: "國家、城市、大城市分區架構" },
    { href: "/admin/settings", label: "網站與追蹤碼", icon: Settings, note: "首頁文字、Logo、GA4、GTM" }
  ];
  const metrics = [
    { label: "城市", value: cities.length, helper: `${cityDistrictCount} 個分區`, href: "/admin/cities", icon: MapPinned },
    { label: "文章", value: articles.length, helper: "SEO 內容庫", href: "/admin/articles", icon: FileText },
    { label: "商家", value: businesses.length, helper: `${taiwanBusinessCount} 個台商專區`, href: "/admin/businesses", icon: Building2 },
    { label: "任務", value: researchBriefs.length, helper: "內容研究清單", href: "/admin/content-engine", icon: SearchCheck }
  ];

  return (
    <div className="admin-dashboard">
      <section className="admin-dashboard-hero">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>今日工作台</h1>
          <p>管理越南、泰國的城市、文章與商家資料，讓 SEO 內容和商家曝光可以一起成長。</p>
        </div>
        <div className={`storage-card ${isCloudStorage ? "is-ok" : "is-warning"}`}>
          <Database size={22} />
          <span>資料保存狀態</span>
          <strong>{isCloudStorage ? "雲端保存中" : "需要確認"}</strong>
          <p>{storageLabel}</p>
        </div>
      </section>

      <section className="admin-metric-grid" aria-label="後台內容總覽">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Link className="admin-metric-card" href={metric.href} key={metric.label}>
              <Icon size={20} />
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <small>{metric.helper}</small>
            </Link>
          );
        })}
      </section>

      <section className="admin-dashboard-grid">
        <div className="panel admin-work-panel">
          <div className="admin-panel-heading">
            <div>
              <p className="eyebrow">Quick Actions</p>
              <h2>常用管理</h2>
            </div>
            <Sparkles size={22} />
          </div>
          <div className="quick-action-list">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link href={action.href} className="quick-action" key={action.href}>
                  <Icon size={20} />
                  <span>
                    <strong>{action.label}</strong>
                    <small>{action.note}</small>
                  </span>
                  <ArrowRight size={16} />
                </Link>
              );
            })}
          </div>
        </div>

        <div className="panel admin-work-panel">
          <div className="admin-panel-heading">
            <div>
              <p className="eyebrow">Recent Articles</p>
              <h2>最近文章</h2>
            </div>
            <Link className="text-link" href="/admin/articles">全部文章</Link>
          </div>
          <div className="admin-compact-list">
            {latestArticles.map((article) => (
              <Link href={`/admin/articles?edit=${article.slug}`} key={article.slug}>
                <strong>{article.title}</strong>
                <span>{article.category} / {formatDate(article.updatedAt)}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="panel admin-work-panel">
          <div className="admin-panel-heading">
            <div>
              <p className="eyebrow">Recent Businesses</p>
              <h2>最近商家</h2>
            </div>
            <Link className="text-link" href="/admin/businesses">全部商家</Link>
          </div>
          <div className="admin-compact-list">
            {latestBusinesses.map((business) => (
              <Link href={`/admin/businesses?edit=${business.slug}`} key={business.slug}>
                <strong>{business.name}</strong>
                <span>{business.category} / {business.country === "vietnam" ? "越南" : "泰國"} / {formatDate(business.updatedAt)}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="panel admin-work-panel">
          <div className="admin-panel-heading">
            <div>
              <p className="eyebrow">Public Site</p>
              <h2>前台檢查</h2>
            </div>
            <Globe2 size={22} />
          </div>
          <div className="front-check-list">
            <Link href="/">首頁</Link>
            <Link href="/directory">商家名錄</Link>
            <Link href="/search">站內搜尋</Link>
            <Link href="/business">商務合作頁</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
