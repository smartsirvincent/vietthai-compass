import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CityDistrictFields } from "@/components/CityDistrictFields";
import { ImageUploadField } from "@/components/ImageUploadField";
import { TagInputField } from "@/components/TagInputField";
import { requireAdminRole } from "@/lib/admin-auth";
import { deleteBusiness, getBusinesses, getCities, listFromTextarea, saveBusiness, textValue } from "@/lib/cms-store";
import { DirectoryBusiness } from "@/lib/types";

const businessCategories = ["餐廳美食", "咖啡甜點", "景點行程", "住宿飯店", "在地生活", "商務服務", "購物選品", "交通移動"];

async function saveBusinessAction(formData: FormData) {
  "use server";
  await requireAdminRole();
  const originalSlug = textValue(formData, "originalSlug");
  const country = textValue(formData, "country", "vietnam") as DirectoryBusiness["country"];
  const citySlug = textValue(formData, "citySlug");
  const districtSlug = textValue(formData, "districtSlug");
  const [cities, businesses] = await Promise.all([getCities(), getBusinesses()]);
  const existingBusiness = businesses.find((business) => business.slug === (originalSlug || textValue(formData, "slug")));
  const selectedCity = cities.find((city) => city.slug === citySlug && city.country === country);
  const validDistrictSlug = selectedCity?.districts.some((district) => district.slug === districtSlug) ? districtSlug : "";
  const business: DirectoryBusiness = {
    slug: textValue(formData, "slug"),
    name: textValue(formData, "name"),
    category: textValue(formData, "category"),
    image: textValue(formData, "image", "/brand-assets/home-business-local-life.png"),
    citySlug: selectedCity?.slug || citySlug,
    districtSlug: validDistrictSlug || undefined,
    country,
    description: textValue(formData, "description"),
    googleMapUrl: textValue(formData, "googleMapUrl"),
    badges: listFromTextarea(formData.get("badges")),
    socials: {
      phone: textValue(formData, "phone"),
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
    plan: existingBusiness?.plan || "free"
  };

  try {
    await saveBusiness(business, originalSlug || undefined);
  } catch {
    redirect("/admin/businesses?error=database");
  }
  revalidatePath("/");
  revalidatePath("/directory");
  revalidatePath(`/directory/${business.slug}`);
  revalidatePath(`/cities/${business.citySlug}`);
  if (business.districtSlug) revalidatePath(`/cities/${business.citySlug}/districts/${business.districtSlug}`);
  redirect("/admin/businesses");
}

async function deleteBusinessAction(formData: FormData) {
  "use server";
  await requireAdminRole();
  await deleteBusiness(textValue(formData, "slug"));
  revalidatePath("/");
  revalidatePath("/directory");
  redirect("/admin/businesses");
}

export default async function AdminBusinessesPage({ searchParams }: { searchParams: Promise<{ edit?: string; error?: string }> }) {
  await requireAdminRole();
  const { edit, error } = await searchParams;
  const [businesses, cities] = await Promise.all([getBusinesses(), getCities()]);
  const editing = businesses.find((item) => item.slug === edit);

  return (
    <>
      <p className="eyebrow">Directory</p>
      <h1>商家管理</h1>
      <p>商家可指定城市與分區，適合建立「曼谷 Sukhumvit 餐廳」或「胡志明市第一郡服務商」等分區 SEO 頁。</p>
      {error === "database" ? (
        <div className="admin-error">
          商家資料無法儲存：目前雲端資料庫連線異常，請先修正 Vercel 的 DATABASE_URL 後再新增或更新商家。
        </div>
      ) : null}
      <section className="admin-editor-grid">
        <form action={saveBusinessAction} className="panel admin-form">
          <h2>{editing ? "編輯商家" : "新增商家"}</h2>
          <input type="hidden" name="originalSlug" defaultValue={editing?.slug || ""} />
          <div className="grid two">
            <label>商家名稱<input name="name" required defaultValue={editing?.name || ""} /></label>
            <label>網址 Slug<input name="slug" required defaultValue={editing?.slug || ""} /></label>
            <label>
              商家分類
              <input
                name="category"
                required
                defaultValue={editing?.category || ""}
                list="business-category-options"
                placeholder="例：餐廳美食、商務服務"
              />
              <datalist id="business-category-options">
                {businessCategories.map((category) => <option key={category} value={category} />)}
              </datalist>
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
          </div>
          <label>Google Map 網址<input name="googleMapUrl" defaultValue={editing?.googleMapUrl || ""} placeholder="https://maps.google.com/..." /></label>
          <ImageUploadField
            label="商家照片"
            name="image"
            defaultValue={editing?.image || "/brand-assets/home-business-local-life.png"}
            folder="vietthai-compass/businesses"
          />
          <label>商家描述<textarea name="description" required rows={3} defaultValue={editing?.description || ""} /></label>
          <TagInputField label="特色標籤" name="badges" defaultTags={editing?.badges || []} />
          <div className="grid two">
            <label>電話<input name="phone" defaultValue={editing?.socials.phone || ""} placeholder="+84..." /></label>
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
          <button className="primary-button" type="submit">{editing ? "更新商家" : "新增商家"}</button>
        </form>
        <div className="panel">
          <h2>商家列表</h2>
          <div className="admin-list">
            {businesses.map((business) => (
              <div key={business.slug}>
                <strong>{business.name}</strong>
                <span>{business.category} / {business.country === "vietnam" ? "越南" : "泰國"} / {business.citySlug} / {business.districtSlug || "不限分區"}</span>
                <div className="admin-row-actions">
                  <Link href={`/admin/businesses?edit=${business.slug}`}>編輯</Link>
                  <form action={deleteBusinessAction}><input type="hidden" name="slug" value={business.slug} /><button type="submit">刪除</button></form>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
