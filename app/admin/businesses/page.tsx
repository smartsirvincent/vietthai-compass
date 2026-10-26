import Link from "next/link";
import { AdminSubmitButton } from "@/components/AdminSubmitButton";
import { AdminEditorForm } from "@/components/AdminEditorForm";
import { finishCmsEdit } from "@/lib/cms-actions";
import { contentRevision, setBusinessActive } from "@/lib/cms-store";
import { CityDistrictFields } from "@/components/CityDistrictFields";
import { BusinessCategoryFields } from "@/components/BusinessCategoryFields";
import { BangkokTransitStationFields } from "@/components/BangkokTransitStationFields";
import { ImageUploadField } from "@/components/ImageUploadField";
import { TagInputField } from "@/components/TagInputField";
import { requireAdminRole } from "@/lib/admin-auth";
import { backfillBusinessSubcategories, deleteBusiness, getArticles, getBusinesses, getCities, listFromTextarea, saveBusiness, textValue } from "@/lib/cms-store";
import { DirectoryBusiness } from "@/lib/types";
import { BUSINESS_CATEGORIES, BUSINESS_SUBCATEGORIES, isBusinessCategory } from "@/lib/business-taxonomy";
import { isBangkokTransitStationId } from "@/lib/bangkok-transit";
import { bangkokBusinessAdditions } from "@/data/bangkok-businesses";

function formatBusinessDate(value?: string) {
  if (!value) return "尚未記錄";
  return new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

async function saveBusinessAction(formData: FormData) {
  "use server";
  await requireAdminRole();
  return finishCmsEdit(async () => {
    const originalSlug = textValue(formData, "originalSlug");
    const country = textValue(formData, "country", "vietnam") as DirectoryBusiness["country"];
    const citySlug = textValue(formData, "citySlug");
    const districtSlug = textValue(formData, "districtSlug");
    const [cities, businesses] = await Promise.all([getCities(), getBusinesses(true)]);
    const existingBusiness = businesses.find((business) => business.slug === (originalSlug || textValue(formData, "slug")));
    const selectedCity = cities.find((city) => city.slug === citySlug && city.country === country);
    const business: DirectoryBusiness = {
      isActive: existingBusiness?.isActive ?? true,
      slug: textValue(formData, "slug"),
      name: textValue(formData, "name"),
      category: textValue(formData, "category"),
      subcategory: textValue(formData, "subcategory") as DirectoryBusiness["subcategory"],
      image: textValue(formData, "image", "/brand-assets/home-business-local-life.png"),
      imageSource: textValue(formData, "imageSource") || undefined,
      imageCredit: textValue(formData, "imageCredit") || undefined,
      citySlug: selectedCity?.slug || citySlug,
      districtSlug: districtSlug || undefined,
      transitStationIds: country === "thailand" && citySlug === "bangkok"
        ? formData.getAll("transitStationIds").map(String).filter(isBangkokTransitStationId)
        : [],
      country,
      description: textValue(formData, "description"),
      review: textValue(formData, "review"),
      googleMapUrl: textValue(formData, "googleMapUrl"),
      badges: listFromTextarea(formData.get("badges")),
      socials: {
        phone: textValue(formData, "phone"),
        whatsapp: textValue(formData, "whatsapp"),
        line: textValue(formData, "line"),
        zalo: textValue(formData, "zalo"),
        facebook: textValue(formData, "facebook"),
        instagram: textValue(formData, "instagram"),
        threads: textValue(formData, "threads"),
        tiktok: textValue(formData, "tiktok"),
        telegram: textValue(formData, "telegram"),
        website: textValue(formData, "website"),
        email: textValue(formData, "email")
      },
      isTaiwanBusiness: formData.get("isTaiwanBusiness") === "on",
      updatedAt: new Date().toISOString(),
      plan: existingBusiness?.plan || "free"
    };

    await saveBusiness(business, originalSlug || undefined, textValue(formData, "revision"));
    return `/admin/businesses?edit=${encodeURIComponent(business.slug)}&saved=business&savedAt=${Date.now()}`;
  });
}

async function deleteBusinessAction(formData: FormData) {
  "use server";
  await requireAdminRole();
  return finishCmsEdit(async () => {
    await deleteBusiness(textValue(formData, "slug"), textValue(formData, "revision"));
    return "/admin/businesses";
  });
}

async function toggleBusinessAction(formData: FormData) {
  "use server";
  await requireAdminRole();
  return finishCmsEdit(async () => {
    await setBusinessActive(textValue(formData, "slug"), textValue(formData, "active") === "true", textValue(formData, "revision"));
    return "/admin/businesses?saved=business";
  });
}

async function backfillBusinessSubcategoriesAction() {
  "use server";
  await requireAdminRole();
  return finishCmsEdit(async () => {
    const count = await backfillBusinessSubcategories();
    return `/admin/businesses?classified=${count}`;
  });
}

async function importBangkokBusinessesAction() {
  "use server";
  await requireAdminRole();
  return finishCmsEdit(async () => {
    const existing = new Set((await getBusinesses(true)).map((business) => business.slug));
    let added = 0;
    let skipped = 0;
    for (const business of bangkokBusinessAdditions) {
      if (existing.has(business.slug)) {
        skipped += 1;
        continue;
      }
      await saveBusiness(business, undefined, "new");
      existing.add(business.slug);
      added += 1;
    }
    return `/admin/businesses?imported=${added}&skipped=${skipped}`;
  });
}

export default async function AdminBusinessesPage({ searchParams }: { searchParams: Promise<{ edit?: string; error?: string; country?: string; city?: string; category?: string; subcategory?: string; saved?: string; savedAt?: string; classified?: string; imported?: string; skipped?: string }> }) {
  await requireAdminRole();
  const { edit, error, country, city, category, subcategory, saved, savedAt, classified, imported, skipped } = await searchParams;
  const [businesses, cities, articles] = await Promise.all([getBusinesses(true), getCities(), getArticles()]);
  const editing = businesses.find((item) => item.slug === edit);
  const relatedArticles = editing ? articles.filter((article) => article.relatedBusinessSlug === editing.slug) : [];
  const selectedFilterCountry = country === "vietnam" || country === "thailand" ? country : "";
  const selectedFilterCity = city || "";
  const selectedFilterCategory = isBusinessCategory(category || "") ? category || "" : "";
  const categorySubcategories = selectedFilterCategory ? BUSINESS_SUBCATEGORIES[selectedFilterCategory as keyof typeof BUSINESS_SUBCATEGORIES] : [];
  const selectedFilterSubcategory = categorySubcategories.includes(subcategory || "") ? subcategory || "" : "";
  const filterCities = selectedFilterCountry ? cities.filter((item) => item.country === selectedFilterCountry) : cities;
  const filteredBusinesses = businesses
    .filter((business) => !selectedFilterCountry || business.country === selectedFilterCountry)
    .filter((business) => !selectedFilterCity || business.citySlug === selectedFilterCity)
    .filter((business) => !selectedFilterCategory || business.category === selectedFilterCategory)
    .filter((business) => !selectedFilterSubcategory || business.subcategory === selectedFilterSubcategory)
    .sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA;
    });

  return (
    <>
      <p className="eyebrow">Directory</p>
      <h1>商家管理</h1>
      <p>商家可指定城市與分區，適合建立「曼谷 Sukhumvit 餐廳」或「胡志明市第一郡服務商」等分區 SEO 頁。</p>
      <p className="form-note">新增商家規則：商家介紹至少 500 字；照片須為店家提供或已獲授權的真實照片，並填寫可核對的來源網址、攝影者與授權資訊。</p>
      <AdminEditorForm action={backfillBusinessSubcategoriesAction} className="business-classification-action">
        <AdminSubmitButton idleLabel="補齊現有商家細分類" />
      </AdminEditorForm>
      <AdminEditorForm action={importBangkokBusinessesAction} className="business-classification-action">
        <AdminSubmitButton idleLabel="新增曼谷捷運沿線 30 家" pendingLabel="新增商家中" />
      </AdminEditorForm>
        <p><Link href="/admin/thailand-update">泰國介紹、實景照片與 20 個沿線地點更新</Link></p>
      {error === "database" ? (
        <div className="admin-error">
          商家資料無法儲存：目前雲端資料庫連線異常，請先修正 Vercel 的 DATABASE_URL 後再新增或更新商家。
        </div>
      ) : null}
      {saved === "business" ? <div className="settings-saved">已完成</div> : null}
      {classified !== undefined ? <div className="settings-saved">分類完成：已補上 {Number(classified) || 0} 筆商家細分類，其他資料未變更。</div> : null}
      {imported !== undefined ? <div className="settings-saved">曼谷商家匯入完成：新增 {Number(imported) || 0} 家，略過既有 {Number(skipped) || 0} 家；既有商家內容未更動。</div> : null}
      <section className="admin-editor-grid">
        <AdminEditorForm key={`${edit || "new"}:${savedAt || ""}`} action={saveBusinessAction} className="panel admin-form">
          <input type="hidden" name="revision" value={contentRevision(editing)} />
          <h2>{editing ? "編輯商家" : "新增商家"}</h2>
          {editing ? <p role="status">目前狀態：{editing.isActive === false ? "停用（前台不顯示，資料保留）" : "啟用"}</p> : null}
          <input type="hidden" name="originalSlug" defaultValue={editing?.slug || ""} />
          <div className="grid two">
            <label>商家名稱<input name="name" required defaultValue={editing?.name || ""} /></label>
            <label>網址 Slug<input name="slug" required defaultValue={editing?.slug || ""} /></label>
            <BusinessCategoryFields category={editing?.category} subcategory={editing?.subcategory} />
            <label className="checkbox-field">
              <input name="isTaiwanBusiness" type="checkbox" defaultChecked={Boolean(editing?.isTaiwanBusiness)} />
              <span>同時列入台商專區</span>
            </label>
            <CityDistrictFields
              cities={cities}
              showCountry
              requiredCountry
              defaultCitySlug={editing?.citySlug || ""}
              defaultDistrictSlug={editing?.districtSlug || ""}
              defaultCountry={editing?.country || "vietnam"}
              cityPlaceholder="請選擇城市"
              requiredCity
            />
            <BangkokTransitStationFields defaultValue={editing?.transitStationIds || []} />
          </div>
          <label>Google Map 網址<input name="googleMapUrl" defaultValue={editing?.googleMapUrl || ""} placeholder="https://maps.google.com/..." /></label>
          <ImageUploadField
            label="商家照片"
            name="image"
            defaultValue={editing?.image || "/brand-assets/home-business-local-life.png"}
            folder="vietthai-compass/businesses"
            recommendedWidth={1200}
          />
          <div className="grid two">
            <label>照片來源網址<input name="imageSource" type="url" required={!editing} defaultValue={editing?.imageSource || ""} placeholder="官方提供頁、授權圖庫或原始照片頁" /></label>
            <label>攝影者與授權<input name="imageCredit" required={!editing} defaultValue={editing?.imageCredit || ""} placeholder="攝影者 / 授權方式" /></label>
          </div>
          <label>商家介紹（至少 500 字）<textarea name="description" required minLength={!editing || editing.description.replace(/\s/g, "").length < 500 ? 0 : 500} rows={8} defaultValue={editing?.description || ""} /></label>
          <label>商家評價<textarea name="review" rows={4} defaultValue={editing?.review || ""} placeholder="整理讀者會在意的評價重點、適合族群、注意事項。" /></label>
          <TagInputField label="特色標籤" name="badges" defaultTags={editing?.badges || []} />
          <div className="grid two">
            <label>電話<input name="phone" defaultValue={editing?.socials.phone || ""} placeholder="+84..." /></label>
            <label>WhatsApp<input name="whatsapp" defaultValue={editing?.socials.whatsapp || ""} placeholder="WhatsApp 電話或網址" /></label>
            <label>Zalo<input name="zalo" defaultValue={editing?.socials.zalo || ""} placeholder="Zalo 網址或電話" /></label>
            <label>LINE<input name="line" defaultValue={editing?.socials.line || ""} /></label>
            <label>Facebook<input name="facebook" defaultValue={editing?.socials.facebook || ""} /></label>
            <label>Instagram<input name="instagram" defaultValue={editing?.socials.instagram || ""} /></label>
            <label>Threads<input name="threads" defaultValue={editing?.socials.threads || ""} /></label>
            <label>TikTok<input name="tiktok" defaultValue={editing?.socials.tiktok || ""} /></label>
            <label>Telegram<input name="telegram" defaultValue={editing?.socials.telegram || ""} /></label>
            <label>網站<input name="website" defaultValue={editing?.socials.website || ""} /></label>
            <label>Email<input name="email" defaultValue={editing?.socials.email || ""} /></label>
          </div>
          <AdminSubmitButton idleLabel={editing ? "更新商家" : "新增商家"} />
        </AdminEditorForm>
        {editing ? (
          <div className="panel related-admin-panel">
            <h2>相關文章</h2>
            {relatedArticles.length ? (
              <div className="admin-list">
                {relatedArticles.map((article) => (
                  <div key={article.slug}>
                    <strong>{article.title}</strong>
                    <span>{article.category} / {article.citySlug || "不限城市"} / {article.updatedAt}</span>
                    <div className="admin-row-actions">
                      <Link href={`/admin/articles?edit=${article.slug}`}>編輯文章</Link>
                      <Link href={`/articles/${article.slug}`} target="_blank">查看前台</Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted-text">目前沒有文章關聯到這個商家。可在文章管理的「關聯商家」欄位選擇此商家。</p>
            )}
          </div>
        ) : null}
        <div className="panel">
          <h2>近期編輯商家</h2>
          <form className="admin-filter-form" action="/admin/businesses">
            <label>
              國家
              <select name="country" defaultValue={selectedFilterCountry}>
                <option value="">全部國家</option>
                <option value="vietnam">越南</option>
                <option value="thailand">泰國</option>
              </select>
            </label>
            <label>
              城市
              <select name="city" defaultValue={selectedFilterCity}>
                <option value="">全部城市</option>
                {filterCities.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
              </select>
            </label>
            <label>
              商家分類
              <select name="category" defaultValue={selectedFilterCategory}>
                <option value="">全部分類</option>
                {BUSINESS_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label>
              細分類
              <select name="subcategory" defaultValue={selectedFilterSubcategory} disabled={!categorySubcategories.length}>
                <option value="">全部細分類</option>
                {categorySubcategories.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <button type="submit">篩選</button>
            <Link href="/admin/businesses">清除</Link>
          </form>
          <div className="admin-list">
            {filteredBusinesses.map((business) => (
              <div key={business.slug}>
                <strong>{business.name}</strong>
                <span>{business.isActive === false ? "停用（前台不顯示）" : "啟用"}</span>
                <span>
                  {business.category}・{business.subcategory}{business.isTaiwanBusiness ? " + 台商專區" : ""} / {business.country === "vietnam" ? "越南" : "泰國"} / {business.citySlug} / {business.districtSlug || "不限分區"}
                </span>
                <span>最近編輯：{formatBusinessDate(business.updatedAt)}</span>
                <div className="admin-row-actions">
                  <AdminEditorForm action={toggleBusinessAction}>
                    <input type="hidden" name="slug" value={business.slug} />
                    <input type="hidden" name="revision" value={contentRevision(business)} />
                    <input type="hidden" name="active" value={String(business.isActive === false)} />
                    <AdminSubmitButton idleLabel={business.isActive === false ? "重新啟用" : "暫時停用"} pendingLabel="更新狀態中" />
                  </AdminEditorForm>
                  <Link href={`/admin/businesses?edit=${business.slug}`}>編輯</Link>
                  <AdminEditorForm action={deleteBusinessAction}><input type="hidden" name="slug" value={business.slug} /><input type="hidden" name="revision" value={contentRevision(business)} /><AdminSubmitButton idleLabel="刪除" /></AdminEditorForm>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
