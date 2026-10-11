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
  const query = new URLSearchParams({ added: String(result.addedArticles), updated: String(result.updatedArticles), articleImages: String(result.updatedArticleImages), images: String(result.updatedCityImages) });
  redirect(`/admin/travel-guides?${query}`);
}

export default async function AdminTravelGuidesPage({ searchParams }: { searchParams: Promise<{ added?: string; updated?: string; articleImages?: string; images?: string }> }) {
  await requireAdminRole();
  const [params, articles, cities] = await Promise.all([searchParams, getArticles(), getCities()]);
  const existing = new Set(articles.map((article) => article.slug));
  const alreadyAdded = travelGuideArticles.filter((article) => existing.has(article.slug)).length;
  const pending = travelGuideArticles.length - alreadyAdded;
  const imported = params.added !== undefined;

  return <>
    <p className="eyebrow">Travel essentials</p>
    <h1>旅遊須知指南</h1>
    <p>管理簽證入境、每月天氣、電壓插座等出發準備內容。內容套件只會更新這七篇指南；其他文章與商家資料不受影響，更新前會保留 CMS 修訂版本。</p>
    {imported ? <div className="settings-saved">已完成：新增 {Number(params.added) || 0} 篇、更新 {Number(params.updated) || 0} 篇指南；替換 {Number(params.articleImages) || 0} 張文章圖，更新 {Number(params.images) || 0} 張城市封面。</div> : null}

    <section className="panel" style={{ marginTop: 24 }}>
      <div className="admin-panel-heading">
        <div><p className="eyebrow">內容套件</p><h2>越泰行前指南</h2></div>
        <span className="status">{alreadyAdded} / {travelGuideArticles.length} 已加入</span>
      </div>
      <p>包含越南與泰國簽證及入境、泰國 TDAC、越泰插座電壓比較，以及胡志明市、峴港、曼谷、清邁 12 個月天氣指南。</p>
        <p>目前站內有 {articles.length} 篇文章、{cities.length} 座城市；七篇指南各有獨立主題封面，不共用城市封面。</p>
      <form action={importGuidesAction}>
        <AdminSubmitButton idleLabel={pending ? `新增 ${pending} 篇並更新指南內容` : "更新七篇指南與專屬圖片"} pendingLabel="正在安全更新並建立修訂備份…" />
      </form>
    </section>

    <section className="panel" style={{ marginTop: 24 }}>
      <h2>本批指南</h2>
      <div className="admin-list">
        {travelGuideArticles.map((article) => <div key={article.slug}>
          <div><strong>{article.title}</strong><span>{article.keywords[0]}{article.citySlug ? ` · ${cities.find((city) => city.slug === article.citySlug)?.name || ""}` : ""}</span></div>
          <Link href={existing.has(article.slug) ? `/admin/articles?edit=${encodeURIComponent(article.slug)}` : "/admin/articles"}>{existing.has(article.slug) ? "編輯" : "待新增"}</Link>
        </div>)}
      </div>
    </section>
  </>;
}
