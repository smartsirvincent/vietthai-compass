import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArticleEditor } from "@/components/ArticleEditor";
import { CityDistrictFields } from "@/components/CityDistrictFields";
import { ImageUploadField } from "@/components/ImageUploadField";
import { requireAdminSession } from "@/lib/admin-auth";
import { deleteArticle, getArticles, getBusinesses, getCities, listFromTextarea, saveArticle, textValue } from "@/lib/cms-store";
import { Article, ArticleCategory } from "@/lib/types";

const categories: ArticleCategory[] = ["旅遊攻略", "餐廳美食", "景點行程", "在地生活", "台商專區"];

async function saveArticleAction(formData: FormData) {
  "use server";
  await requireAdminSession();
  const originalSlug = textValue(formData, "originalSlug");
  const citySlug = textValue(formData, "citySlug");
  const districtSlug = textValue(formData, "districtSlug");
  const cities = await getCities();
  const selectedCity = cities.find((city) => city.slug === citySlug);
  const validDistrictSlug = selectedCity?.districts.some((district) => district.slug === districtSlug) ? districtSlug : "";
  const article: Article = {
    slug: textValue(formData, "slug"),
    title: textValue(formData, "title"),
    excerpt: textValue(formData, "excerpt"),
    content: textValue(formData, "content"),
    category: textValue(formData, "category") as ArticleCategory,
    country: (textValue(formData, "country") || undefined) as Article["country"],
    citySlug: citySlug || undefined,
    districtSlug: validDistrictSlug || undefined,
    relatedBusinessSlug: textValue(formData, "relatedBusinessSlug") || undefined,
    businessIntro: textValue(formData, "businessIntro"),
    businessFeatures: listFromTextarea(formData.get("businessFeatures")),
    intent: textValue(formData, "intent", "traffic") as Article["intent"],
    keywords: listFromTextarea(formData.get("keywords")),
    updatedAt: textValue(formData, "updatedAt", new Date().toISOString().slice(0, 10)),
    coverImage: textValue(formData, "coverImage", "/brand-assets/home-hero-vietthai-commerce.png"),
    photoAlt: textValue(formData, "photoAlt")
  };

  await saveArticle(article, originalSlug || undefined);
  revalidatePath("/");
  revalidatePath("/articles");
  revalidatePath(`/articles/${article.slug}`);
  if (article.citySlug) revalidatePath(`/cities/${article.citySlug}`);
  if (article.citySlug && article.districtSlug) revalidatePath(`/cities/${article.citySlug}/districts/${article.districtSlug}`);
  redirect("/admin/articles");
}

async function deleteArticleAction(formData: FormData) {
  "use server";
  await requireAdminSession();
  await deleteArticle(textValue(formData, "slug"));
  revalidatePath("/");
  revalidatePath("/articles");
  redirect("/admin/articles");
}

export default async function AdminArticlesPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  await requireAdminSession();
  const { edit } = await searchParams;
  const [articles, cities, businesses] = await Promise.all([getArticles(), getCities(), getBusinesses()]);
  const editing = articles.find((item) => item.slug === edit);

  return (
    <>
      <p className="eyebrow">Content</p>
      <h1>文章管理</h1>
      <p>文章可用填表方式設定商家介紹、商家特色與關聯商家。只要選了關聯商家，前台會預設顯示 Google Map 預覽。</p>

      <section className="admin-editor-grid">
        <form action={saveArticleAction} className="panel admin-form">
          <h2>{editing ? "編輯文章" : "新增文章"}</h2>
          <input type="hidden" name="originalSlug" defaultValue={editing?.slug || ""} />
          <label>標題<input name="title" required defaultValue={editing?.title || ""} /></label>
          <label>網址 Slug<input name="slug" required defaultValue={editing?.slug || ""} /></label>
          <label>摘要<textarea name="excerpt" required rows={3} defaultValue={editing?.excerpt || ""} /></label>

          <div className="grid two">
            <label>分類<select name="category" defaultValue={editing?.category || "旅遊攻略"}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label>內容目的<select name="intent" defaultValue={editing?.intent || "traffic"}><option value="traffic">搜尋流量</option><option value="commercial">商務轉換</option><option value="authority">權威建立</option></select></label>
            <label>國家<select name="country" defaultValue={editing?.country || ""}><option value="">不限國家</option><option value="vietnam">越南</option><option value="thailand">泰國</option></select></label>
            <CityDistrictFields
              cities={cities}
              defaultCitySlug={editing?.citySlug || ""}
              defaultDistrictSlug={editing?.districtSlug || ""}
            />
            <label>關聯商家<select name="relatedBusinessSlug" defaultValue={editing?.relatedBusinessSlug || ""}><option value="">不指定商家</option>{businesses.map((business) => <option key={business.slug} value={business.slug}>{business.name} ({business.slug})</option>)}</select></label>
          </div>

          <label>商家介紹<textarea name="businessIntro" rows={4} defaultValue={editing?.businessIntro || ""} placeholder="用讀者角度介紹這間店，例如適合什麼情境、位在哪個生活圈、為什麼值得放入口袋名單。" /></label>
          <label>商家特色<textarea name="businessFeatures" rows={5} defaultValue={editing?.businessFeatures?.join("\n") || ""} placeholder="一行一個特色，例如：室內外座位彈性、適合早午餐、英文溝通方便。" /></label>

          <label>關鍵字<textarea name="keywords" rows={3} defaultValue={editing?.keywords.join("\n") || ""} placeholder="一行一個關鍵字" /></label>
          <ImageUploadField
            label="封面圖片"
            name="coverImage"
            defaultValue={editing?.coverImage || "/brand-assets/home-hero-vietthai-commerce.png"}
            folder="vietthai-compass/articles"
          />
          <label>封面圖片替代文字<input name="photoAlt" defaultValue={editing?.photoAlt || ""} /></label>
          <label>最後更新日期<input type="date" name="updatedAt" defaultValue={editing?.updatedAt || new Date().toISOString().slice(0, 10)} /></label>
          <label>文章內容<ArticleEditor defaultValue={editing?.content || ""} /></label>
          <button className="primary-button" type="submit">{editing ? "更新文章" : "新增文章"}</button>
        </form>

        <div className="panel">
          <h2>文章列表</h2>
          <div className="admin-list">
            {articles.map((article) => (
              <div key={article.slug}>
                <strong>{article.title}</strong>
                <span>{article.category} / {article.citySlug || "不限城市"} / {article.districtSlug || "不限分區"} / {article.relatedBusinessSlug || "未關聯商家"}</span>
                <div className="admin-row-actions">
                  <Link href={`/admin/articles?edit=${article.slug}`}>編輯</Link>
                  <form action={deleteArticleAction}><input type="hidden" name="slug" value={article.slug} /><button type="submit">刪除</button></form>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
