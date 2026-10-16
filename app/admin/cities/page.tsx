import Link from "next/link";
import { AdminEditorForm } from "@/components/AdminEditorForm";
import { AdminSubmitButton } from "@/components/AdminSubmitButton";
import { finishCmsEdit } from "@/lib/cms-actions";
import { contentRevision } from "@/lib/cms-store";
import { ImageUploadField } from "@/components/ImageUploadField";
import { requireAdminRole } from "@/lib/admin-auth";
import { deleteCity, getCities, listFromTextarea, saveCity, textValue } from "@/lib/cms-store";
import { City, District } from "@/lib/types";
import { fillMissingCityClimate } from "@/lib/city-climate";
import { cities as featuredCities } from "@/data/site";
import { additionalCityGuides } from "@/data/city-enrichment";

function districtsFromTextarea(value: FormDataEntryValue | null): District[] {
  return String(value || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [slug, name, nameEn, summary] = line.split("|").map((item) => item.trim());
      return {
        slug,
        name: name || slug,
        nameEn,
        summary: summary || `${name || slug} 分區內容，可用於餐廳、景點、在地生活與商家 SEO。`
      };
    })
    .filter((district) => district.slug);
}

function districtsToTextarea(districts: District[] = []) {
  return districts.map((district) => [district.slug, district.name, district.nameEn || "", district.summary].join(" | ")).join("\n");
}

async function saveCityAction(formData: FormData) {
  "use server";
  await requireAdminRole();
  return finishCmsEdit(async () => {
    const originalSlug = textValue(formData, "originalSlug");
    const city: City = {
      slug: textValue(formData, "slug"),
      country: textValue(formData, "country", "vietnam") as City["country"],
      name: textValue(formData, "name"),
      nameEn: textValue(formData, "nameEn"),
      summary: textValue(formData, "summary"),
      bestSeason: textValue(formData, "bestSeason"),
      weather: textValue(formData, "weather"),
      recommendedDays: textValue(formData, "recommendedDays"),
      audience: listFromTextarea(formData.get("audience")),
      businessAngle: textValue(formData, "businessAngle"),
      image: textValue(formData, "image", "/brand-assets/home-hero-vietthai-commerce.png"),
      imageSource: textValue(formData, "imageSource") || undefined,
      imageCredit: textValue(formData, "imageCredit") || undefined,
      districts: districtsFromTextarea(formData.get("districts"))
    };
    await saveCity(city, originalSlug || undefined, textValue(formData, "revision"));
    return `/admin/cities?edit=${encodeURIComponent(city.slug)}&saved=city&savedAt=${Date.now()}`;
  });
}

async function deleteCityAction(formData: FormData) {
  "use server";
  await requireAdminRole();
  return finishCmsEdit(async () => {
    await deleteCity(textValue(formData, "slug"), textValue(formData, "revision"));
    return "/admin/cities";
  });
}

async function importCityGuidesAction() {
  "use server";
  await requireAdminRole();
  return finishCmsEdit(async () => {
    const existingCities = await getCities();
    const bySlug = new Map(existingCities.map((city) => [city.slug, city]));
    const guides = [...featuredCities, ...additionalCityGuides];
    let added = 0;
    let enriched = 0;

    for (const guide of guides) {
      const existing = bySlug.get(guide.slug);
      if (!existing) {
        await saveCity(guide, undefined, "new");
        added += 1;
        continue;
      }

      const updated = fillMissingCityClimate(existing, guide);
      if (updated.bestSeason !== existing.bestSeason || updated.weather !== existing.weather || updated.recommendedDays !== existing.recommendedDays || existing.image !== guide.image || (guide.imageSource && existing.imageSource !== guide.imageSource) || (guide.imageCredit && existing.imageCredit !== guide.imageCredit)) {
        updated.image = guide.image;
        updated.imageSource = guide.imageSource || existing.imageSource;
        updated.imageCredit = guide.imageCredit || existing.imageCredit;
        await saveCity(updated, existing.slug, contentRevision(existing));
        enriched += 1;
      }
    }

    return `/admin/cities?added=${added}&enriched=${enriched}`;
  });
}

export default async function AdminCitiesPage({ searchParams }: { searchParams: Promise<{ edit?: string; saved?: string; savedAt?: string; added?: string; enriched?: string }> }) {
  await requireAdminRole();
  const { edit, saved, savedAt, added, enriched } = await searchParams;
  const cities = await getCities();
  const editing = cities.find((item) => item.slug === edit);

  return (
    <>
      <p className="eyebrow">Places</p>
      <h1>城市管理</h1>
      {saved === "city" ? <div className="settings-saved">已完成</div> : null}
      {added !== undefined ? <div className="settings-saved">城市資料完成：新增 {Number(added) || 0} 個城市，更新 {Number(enriched) || 0} 筆既有季節、天氣或照片資料；原有文字與分區未覆蓋。</div> : null}
      <p>城市可設定分區，讓餐廳美食、景點行程、在地生活與商家內容能依城市與大城市分區做 SEO。</p>
      <AdminEditorForm action={importCityGuidesAction} className="business-classification-action">
        <AdminSubmitButton idleLabel="補齊季節天氣並新增城市" pendingLabel="更新城市資料中" />
      </AdminEditorForm>
      <section className="admin-editor-grid">
        <AdminEditorForm key={`${edit || "new"}:${savedAt || ""}`} action={saveCityAction} className="panel admin-form">
          <input type="hidden" name="revision" value={contentRevision(editing)} />
          <h2>{editing ? "編輯城市" : "新增城市"}</h2>
          <input type="hidden" name="originalSlug" defaultValue={editing?.slug || ""} />
          <div className="grid two">
            <label>城市名稱<input name="name" required defaultValue={editing?.name || ""} /></label>
            <label>英文名稱<input name="nameEn" required defaultValue={editing?.nameEn || ""} /></label>
            <label>網址 Slug<input name="slug" required defaultValue={editing?.slug || ""} /></label>
            <label>國家<select name="country" defaultValue={editing?.country || "vietnam"}><option value="vietnam">越南</option><option value="thailand">泰國</option></select></label>
            <label>推薦季節<input name="bestSeason" defaultValue={editing?.bestSeason || ""} /></label>
            <label>建議天數<input name="recommendedDays" defaultValue={editing?.recommendedDays || ""} /></label>
          </div>
          <label>季節與天氣<textarea name="weather" rows={2} defaultValue={editing?.weather || ""} placeholder="例：11–2 月較乾爽；3–5 月炎熱，5–10 月午後陣雨較多。" /></label>
          <label>城市摘要<textarea name="summary" required rows={3} defaultValue={editing?.summary || ""} /></label>
          <label>適合族群<textarea name="audience" rows={3} defaultValue={editing?.audience.join("\n") || ""} /></label>
          <label>商務備註<textarea name="businessAngle" rows={3} defaultValue={editing?.businessAngle || ""} /></label>
          <ImageUploadField
            label="城市圖片"
            name="image"
            defaultValue={editing?.image || "/brand-assets/home-hero-vietthai-commerce.png"}
            folder="vietthai-compass/cities"
          />
          <div className="grid two">
            <label>照片來源網址<input name="imageSource" type="url" defaultValue={editing?.imageSource || ""} placeholder="授權來源頁或官方提供頁" /></label>
            <label>攝影者與授權<input name="imageCredit" defaultValue={editing?.imageCredit || ""} placeholder="攝影者 / 授權方式" /></label>
          </div>
          <label>
            分區清單
            <textarea name="districts" rows={6} defaultValue={districtsToTextarea(editing?.districts)} placeholder="sukhumvit | Sukhumvit | Sukhumvit | 商務、餐廳與外籍生活集中區" />
          </label>
          <p className="form-note">每行一個分區，格式：slug | 中文名稱 | 英文名稱 | 摘要。大城市建議 3-6 個分區，小城市可留空。</p>
          <AdminSubmitButton idleLabel={editing ? "更新城市" : "新增城市"} />
        </AdminEditorForm>
        <div className="panel">
          <h2>城市列表</h2>
          <div className="admin-list">
            {cities.map((city) => (
              <div key={city.slug}>
                <strong>{city.name}</strong>
                <span>{city.country === "vietnam" ? "越南" : "泰國"} / {city.slug} / {city.districts.length} 個分區</span>
                <div className="admin-row-actions">
                  <Link href={`/admin/cities?edit=${city.slug}`}>編輯</Link>
                  <AdminEditorForm action={deleteCityAction}><input type="hidden" name="slug" value={city.slug} /><input type="hidden" name="revision" value={contentRevision(city)} /><AdminSubmitButton idleLabel="刪除" /></AdminEditorForm>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
