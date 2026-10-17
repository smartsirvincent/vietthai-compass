import Link from "next/link";
import { articleDates, taipeiToday } from "@/lib/article-dates";
import { CmsEditError, backfillArticleDates } from "@/lib/cms-store";
import { AdminSubmitButton } from "@/components/AdminSubmitButton";
import { AdminEditorForm } from "@/components/AdminEditorForm";
import { finishCmsEdit } from "@/lib/cms-actions";
import { contentRevision } from "@/lib/cms-store";
import { ArticleEditor } from "@/components/ArticleEditor";
import { CityDistrictFields } from "@/components/CityDistrictFields";
import { ImageUploadField } from "@/components/ImageUploadField";
import { TagInputField } from "@/components/TagInputField";
import { requireAdminSession, requireAdminRole } from "@/lib/admin-auth";
import { deleteArticle, getArticles, getBusinesses, getCities, listFromTextarea, saveArticle, textValue } from "@/lib/cms-store";
import { ARTICLE_CATEGORIES, Article, ArticleCategory } from "@/lib/types";

const categories: ArticleCategory[] = [...ARTICLE_CATEGORIES];

async function backfillDatesAction() {
  "use server";
  await requireAdminRole();
  return finishCmsEdit(async () => {
    const count = await backfillArticleDates();
    return `/admin/articles?datesAdded=${count}`;
  });
}

async function saveArticleAction(formData: FormData) {
  "use server";
  await requireAdminSession();
  return finishCmsEdit(async () => {
    const originalSlug = textValue(formData, "originalSlug");
    const citySlug = textValue(formData, "citySlug");
    const districtSlug = textValue(formData, "districtSlug");
    const cities = await getCities();
    const selectedCity = cities.find((city) => city.slug === citySlug);
    let dates;
    const requestedDate = textValue(formData, "publishedAt");
    try { dates = articleDates(requestedDate === textValue(formData, "defaultPublishedAt") ? "" : requestedDate); }
    catch (error) { throw new CmsEditError((error as Error).message); }
    const article: Article = {
      slug: textValue(formData, "slug"),
      title: textValue(formData, "title"),
      excerpt: textValue(formData, "excerpt"),
      content: textValue(formData, "content"),
      category: textValue(formData, "category") as ArticleCategory,
      country: (textValue(formData, "country") || selectedCity?.country || undefined) as Article["country"],
      citySlug: citySlug || undefined,
      districtSlug: districtSlug || undefined,
      relatedBusinessSlug: textValue(formData, "relatedBusinessSlug") || undefined,
      businessIntro: textValue(formData, "businessIntro"),
      businessFeatures: listFromTextarea(formData.get("businessFeatures")),
      intent: textValue(formData, "intent", "traffic") as Article["intent"],
      keywords: listFromTextarea(formData.get("keywords")),
      ...dates,
      sources: textValue(formData, "sources").split(/\r?\n/).map(value => value.trim()).filter(Boolean),
      coverImage: textValue(formData, "coverImage", "/brand-assets/home-hero-vietthai-commerce.png"),
      photoAlt: textValue(formData, "photoAlt")
    };

    await saveArticle(article, originalSlug || undefined, textValue(formData, "revision"));
    return `/admin/articles?edit=${encodeURIComponent(article.slug)}&saved=article&savedAt=${Date.now()}`;
  });
}

async function deleteArticleAction(formData: FormData) {
  "use server";
  await requireAdminSession();
  return finishCmsEdit(async () => {
    await deleteArticle(textValue(formData, "slug"), textValue(formData, "revision"));
    return "/admin/articles";
  });
}

export default async function AdminArticlesPage({ searchParams }: { searchParams: Promise<{ edit?: string; saved?: string; savedAt?: string; datesAdded?: string }> }) {
  await requireAdminSession();
  const { edit, saved, savedAt, datesAdded } = await searchParams;
  const [articles, cities, businesses] = await Promise.all([getArticles(), getCities(), getBusinesses(true)]);
  const editing = articles.find((item) => item.slug === edit);

  return (
    <>
      <p className="eyebrow">Content</p>
      <h1>文章管理</h1>
      <p>文章可用填表方式設定商家介紹、商家特色與關聯商家。只要選了關聯商家，前台會預設顯示 Google Map 預覽。</p>
      {saved === "article" ? <div className="settings-saved">已完成</div> : null}
      {datesAdded !== undefined ? <p role="status">已補齊 {Number(datesAdded) || 0} 篇文章的發布日期。</p> : null}
      {articles.some(article => !article.publishedAt) ? <AdminEditorForm action={backfillDatesAction}>
        <p>尚有 {articles.filter(article => !article.publishedAt).length} 篇文章沒有發布日期。將以當日作為補登發布日期，保留已有日期及所有內文。</p>
        <AdminSubmitButton idleLabel="補齊缺少的發布日期" />
      </AdminEditorForm> : null}

      <section className="admin-editor-grid">
        <AdminEditorForm key={`${edit || "new"}:${savedAt || ""}`} action={saveArticleAction} className="panel admin-form">
          <input type="hidden" name="revision" value={contentRevision(editing)} />
          <h2>{editing ? "編輯文章" : "新增文章"}</h2>
          <input type="hidden" name="originalSlug" defaultValue={editing?.slug || ""} />
          <label>標題<input name="title" required defaultValue={editing?.title || ""} /></label>
          <label>網址 Slug<input name="slug" required defaultValue={editing?.slug || ""} /></label>
          <label>摘要<textarea name="excerpt" required rows={3} defaultValue={editing?.excerpt || ""} /></label>

          <div className="grid two">
            <label>分類<select name="category" defaultValue={editing?.category || "旅遊攻略"}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label>內容目的<select name="intent" defaultValue={editing?.intent || "traffic"}><option value="traffic">搜尋流量</option><option value="commercial">商務轉換</option><option value="authority">權威建立</option></select></label>
            <CityDistrictFields
              cities={cities}
              showCountry
              defaultCountry={editing?.country || ""}
              defaultCitySlug={editing?.citySlug || ""}
              defaultDistrictSlug={editing?.districtSlug || ""}
            />
            <label>關聯商家<select name="relatedBusinessSlug" defaultValue={editing?.relatedBusinessSlug || ""}><option value="">不指定商家</option>{businesses.map((business) => <option key={business.slug} value={business.slug}>{business.name} ({business.slug})</option>)}</select></label>
          </div>

          <label>商家介紹<textarea name="businessIntro" rows={4} defaultValue={editing?.businessIntro || ""} placeholder="用讀者角度介紹這間店，例如適合什麼情境、位在哪個生活圈、為什麼值得放入口袋名單。" /></label>
          <TagInputField
            label="商家特色"
            name="businessFeatures"
            defaultTags={editing?.businessFeatures || []}
            placeholder="輸入特色後按 Enter，例如：適合早午餐"
          />

          <TagInputField
            label="關鍵字標籤"
            name="keywords"
            defaultTags={editing?.keywords || []}
            placeholder="輸入關鍵字後按 Enter"
          />
          <ImageUploadField
            label="封面圖片"
            name="coverImage"
            defaultValue={editing?.coverImage || "/brand-assets/home-hero-vietthai-commerce.png"}
            folder="vietthai-compass/articles"
          />
          <label>封面圖片替代文字<input name="photoAlt" defaultValue={editing?.photoAlt || ""} /></label>
          <label>發布日期<input type="date" name="publishedAt" max={taipeiToday()} defaultValue={taipeiToday()} /></label>
          <input type="hidden" name="defaultPublishedAt" value={taipeiToday()} />
          <p>新增或更新文章時，發布日期預設為當日（台灣時間），亦可自行指定過去日期。最後更新日期會在儲存時自動記錄。此日期不代表所有資訊皆已重新查核。</p>
          {editing?.publishedAt ? <p>目前發布日期：{editing.publishedAt.slice(0, 10)}</p> : null}
          <label>資料來源網址（每行一個）<textarea name="sources" rows={4} defaultValue={(editing?.sources || []).join("\n")} placeholder="請填入支持內文事實的官方或第一手來源" /></label>
          <label>文章內容<ArticleEditor defaultValue={editing?.content || ""} /></label>
          <AdminSubmitButton idleLabel={editing ? "更新文章" : "新增文章"} />
        </AdminEditorForm>

        <div className="panel">
          <h2>文章列表</h2>
          <div className="admin-list">
            {articles.map((article) => (
              <div key={article.slug}>
                <strong>{article.title}</strong>
                <span>{article.category} / {article.citySlug || "不限城市"} / {article.districtSlug || "不限分區"} / {article.relatedBusinessSlug || "未關聯商家"}</span>
                <div className="admin-row-actions">
                  <Link href={`/admin/articles?edit=${article.slug}`}>編輯</Link>
                  <AdminEditorForm action={deleteArticleAction}><input type="hidden" name="slug" value={article.slug} /><input type="hidden" name="revision" value={contentRevision(article)} /><AdminSubmitButton idleLabel="刪除" /></AdminEditorForm>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
