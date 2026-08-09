import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ImageUploadField } from "@/components/ImageUploadField";
import { requireAdminRole } from "@/lib/admin-auth";
import { deleteCity, getCities, listFromTextarea, saveCity, textValue } from "@/lib/cms-store";
import { City, District } from "@/lib/types";

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
  const originalSlug = textValue(formData, "originalSlug");
  const city: City = {
    slug: textValue(formData, "slug"),
    country: textValue(formData, "country", "vietnam") as City["country"],
    name: textValue(formData, "name"),
    nameEn: textValue(formData, "nameEn"),
    summary: textValue(formData, "summary"),
    bestSeason: textValue(formData, "bestSeason"),
    recommendedDays: textValue(formData, "recommendedDays"),
    audience: listFromTextarea(formData.get("audience")),
    businessAngle: textValue(formData, "businessAngle"),
    image: textValue(formData, "image", "/brand-assets/home-hero-vietthai-commerce.png"),
    districts: districtsFromTextarea(formData.get("districts"))
  };
  await saveCity(city, originalSlug || undefined);
  revalidatePath("/");
  revalidatePath("/cities");
  revalidatePath(`/cities/${city.slug}`);
  redirect("/admin/cities");
}

async function deleteCityAction(formData: FormData) {
  "use server";
  await requireAdminRole();
  await deleteCity(textValue(formData, "slug"));
  revalidatePath("/");
  revalidatePath("/cities");
  redirect("/admin/cities");
}

export default async function AdminCitiesPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  await requireAdminRole();
  const { edit } = await searchParams;
  const cities = await getCities();
  const editing = cities.find((item) => item.slug === edit);

  return (
    <>
      <p className="eyebrow">Places</p>
      <h1>城市管理</h1>
      <p>城市可設定分區，讓餐廳美食、景點行程、在地生活與商家內容能依城市與大城市分區做 SEO。</p>
      <section className="admin-editor-grid">
        <form action={saveCityAction} className="panel admin-form">
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
          <label>城市摘要<textarea name="summary" required rows={3} defaultValue={editing?.summary || ""} /></label>
          <label>適合族群<textarea name="audience" rows={3} defaultValue={editing?.audience.join("\n") || ""} /></label>
          <label>商務備註<textarea name="businessAngle" rows={3} defaultValue={editing?.businessAngle || ""} /></label>
          <ImageUploadField
            label="城市圖片"
            name="image"
            defaultValue={editing?.image || "/brand-assets/home-hero-vietthai-commerce.png"}
            folder="vietthai-compass/cities"
          />
          <label>
            分區清單
            <textarea name="districts" rows={6} defaultValue={districtsToTextarea(editing?.districts)} placeholder="sukhumvit | Sukhumvit | Sukhumvit | 商務、餐廳與外籍生活集中區" />
          </label>
          <p className="form-note">每行一個分區，格式：slug | 中文名稱 | 英文名稱 | 摘要。大城市建議 3-6 個分區，小城市可留空。</p>
          <button className="primary-button" type="submit">{editing ? "更新城市" : "新增城市"}</button>
        </form>
        <div className="panel">
          <h2>城市列表</h2>
          <div className="admin-list">
            {cities.map((city) => (
              <div key={city.slug}>
                <strong>{city.name}</strong>
                <span>{city.country === "vietnam" ? "越南" : "泰國"} / {city.slug} / {city.districts.length} 個分區</span>
                <div className="admin-row-actions">
                  <Link href={`/admin/cities?edit=${city.slug}`}>編輯</Link>
                  <form action={deleteCityAction}><input type="hidden" name="slug" value={city.slug} /><button type="submit">刪除</button></form>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
