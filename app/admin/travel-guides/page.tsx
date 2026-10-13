import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminSubmitButton } from "@/components/AdminSubmitButton";
import { requireAdminRole } from "@/lib/admin-auth";
import { getArticles, getCities, mergeTravelGuideArticles } from "@/lib/cms-store";
import { travelGuideArticles } from "@/data/travel-guides";

export const metadata = { title: "旅遊須知指南管理" };

async function importGuidesAction() {
  "use server";
  await requireAdminRole();
  const result = await mergeTravelGuideArticles();
  revalidatePath("/", "layout");
  const query = new URLSearchParams({ added: String(result.addedArticles), images: String(result.updatedCityImages) });
  redirect(`/admin/travel-guides?${query}`);
}

export default async function AdminTravelGuidesPage({ searchParams }: { searchParams: Promise<{ added?: string; images?: string }> }) {
  await requireAdminRole();
  const [params, articles, cities] = await Promise.all([searchParams, getArticles(), getCities()]);
  const existing = new Set(articles.map((article) => article.slug));
  const alreadyAdded = travelGuideArticles.filter((article) => existing.has(article.slug)).length;
  const pending = travelGuideArticles.length - alreadyAdded;
  const guides = articles.filter((article) => article.category === "旅遊須知").sort((a, b) => a.title.localeCompare(b.title, "zh-TW"));
  const imported = params.added !== undefined;

  return <>
    <p className="eyebrow">Travel essentials</p>
    <h1>旅遊須知指南</h1>
    <p>管理簽證入境、每月天氣、電壓插座等行前資訊。選擇「編輯內容」會開啟文章編輯器；保存後即更新前台旅遊須知。</p>
    {imported ? <div className="settings-saved">已完成：新增 {Number(params.added) || 0} 篇尚未加入的指南，更新 {Number(params.images) || 0} 張城市封面；既有文章內容未覆寫。</div> : null}

    <section className="panel" style={{ marginTop: 24 }}>
      <div className="admin-panel-heading">
        <div><p className="eyebrow">CMS ARTICLES</p><h2>站內旅遊須知</h2></div>
        <span className="status">{guides.length} 篇文章</span>
      </div>
      {guides.length ? <div className="admin-list">
        {guides.map((article) => <div key={article.slug}>
          <div><strong>{article.title}</strong><span>{article.country === "vietnam" ? "越南" : article.country === "thailand" ? "泰國" : "越南・泰國通用"}{article.citySlug ? ` · ${cities.find((city) => city.slug === article.citySlug)?.name || article.citySlug}` : ""} · 更新：{article.updatedAt}</span></div>
          <div className="admin-row-actions">
            <Link href={`/admin/articles?edit=${encodeURIComponent(article.slug)}`}>編輯內容</Link>
            <Link href={`/articles/${encodeURIComponent(article.slug)}`} target="_blank">前台預覽</Link>
          </div>
        </div>)}
      </div> : <p className="muted-text">目前尚無旅遊須知文章。可從下方行前指南套件新增。</p>}
    </section>

    <section className="panel" style={{ marginTop: 24 }}>
      <div className="admin-panel-heading">
        <div><p className="eyebrow">內容套件</p><h2>越泰行前指南</h2></div>
        <span className="status">{alreadyAdded} / {travelGuideArticles.length} 已加入</span>
      </div>
      <p>包含越南與泰國簽證及入境、泰國 TDAC、越泰插座電壓比較，以及胡志明市、峴港、曼谷、清邁 12 個月天氣指南。匯入只會新增缺少的內容，不會覆蓋已編輯文章。</p>
      <p>目前站內有 {articles.length} 篇文章、{cities.length} 座城市；指南套件已加入 {alreadyAdded} / {travelGuideArticles.length} 篇。</p>
      {pending ? <form action={importGuidesAction}>
        <AdminSubmitButton idleLabel={`新增 ${pending} 篇尚未加入的指南`} pendingLabel="正在新增指南並建立修訂備份…" />
      </form> : <div className="settings-saved">指南套件已完整加入。現有內容可以在上方直接編輯。</div>}
    </section>

    <section className="panel" style={{ marginTop: 24 }}>
      <h2>指南套件預覽</h2>
      <div className="admin-list">
        {travelGuideArticles.map((article) => <div key={article.slug}>
          <div><strong>{article.title}</strong><span>{article.keywords[0]}{article.citySlug ? ` · ${cities.find((city) => city.slug === article.citySlug)?.name || ""}` : ""}</span></div>
          <Link href={existing.has(article.slug) ? `/admin/articles?edit=${encodeURIComponent(article.slug)}` : "/admin/articles"}>{existing.has(article.slug) ? "編輯" : "待新增"}</Link>
        </div>)}
      </div>
    </section>
  </>;
}
