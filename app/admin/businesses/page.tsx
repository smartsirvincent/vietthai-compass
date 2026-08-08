import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import { deleteBusiness, getBusinesses, getCities, listFromTextarea, saveBusiness, textValue } from "@/lib/cms-store";
import { siteSocials } from "@/data/site";
import { DirectoryBusiness } from "@/lib/types";

async function saveBusinessAction(formData: FormData) {
  "use server";
  const originalSlug = textValue(formData, "originalSlug");
  const business: DirectoryBusiness = {
    slug: textValue(formData, "slug"),
    name: textValue(formData, "name"),
    category: textValue(formData, "category"),
    citySlug: textValue(formData, "citySlug"),
    districtSlug: textValue(formData, "districtSlug") || undefined,
    country: textValue(formData, "country", "vietnam") as DirectoryBusiness["country"],
    description: textValue(formData, "description"),
    googleMapUrl: textValue(formData, "googleMapUrl"),
    badges: listFromTextarea(formData.get("badges")),
    socials: {
      line: textValue(formData, "line") || siteSocials.line,
      facebook: textValue(formData, "facebook"),
      instagram: textValue(formData, "instagram"),
      threads: textValue(formData, "threads"),
      tiktok: textValue(formData, "tiktok"),
      telegram: textValue(formData, "telegram"),
      website: textValue(formData, "website"),
      email: textValue(formData, "email")
    },
    plan: textValue(formData, "plan", "free") as DirectoryBusiness["plan"]
  };

  await saveBusiness(business, originalSlug || undefined);
  revalidatePath("/");
  revalidatePath("/directory");
  revalidatePath(`/directory/${business.slug}`);
  revalidatePath(`/cities/${business.citySlug}`);
  if (business.districtSlug) revalidatePath(`/cities/${business.citySlug}/districts/${business.districtSlug}`);
  redirect("/admin/businesses");
}

async function deleteBusinessAction(formData: FormData) {
  "use server";
  await deleteBusiness(textValue(formData, "slug"));
  revalidatePath("/");
  revalidatePath("/directory");
  redirect("/admin/businesses");
}

export default async function AdminBusinessesPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const { edit } = await searchParams;
  const [businesses, cities] = await Promise.all([getBusinesses(), getCities()]);
  const editing = businesses.find((item) => item.slug === edit);
  const districtOptions = cities.flatMap((city) => city.districts.map((district) => ({ city, district })));

  return (
    <>
      <p className="eyebrow">Directory</p>
      <h1>商家管理</h1>
      <p>商家可指定城市與分區，適合建立「曼谷 Sukhumvit 餐廳」或「胡志明市第一郡服務商」等分區 SEO 頁。</p>
      <section className="admin-editor-grid">
        <form action={saveBusinessAction} className="panel admin-form">
          <h2>{editing ? "編輯商家" : "新增商家"}</h2>
          <input type="hidden" name="originalSlug" defaultValue={editing?.slug || ""} />
          <div className="grid two">
            <label>商家名稱<input name="name" required defaultValue={editing?.name || ""} /></label>
            <label>網址 Slug<input name="slug" required defaultValue={editing?.slug || ""} /></label>
            <label>分類<input name="category" required defaultValue={editing?.category || ""} /></label>
            <label>城市<select name="citySlug" required defaultValue={editing?.citySlug || ""}><option value="">請選擇城市</option>{cities.map((city) => <option key={city.slug} value={city.slug}>{city.name} ({city.slug})</option>)}</select></label>
            <label>分區<select name="districtSlug" defaultValue={editing?.districtSlug || ""}><option value="">不限分區</option>{districtOptions.map(({ city, district }) => <option key={`${city.slug}-${district.slug}`} value={district.slug}>{city.name} / {district.name} ({district.slug})</option>)}</select></label>
            <label>國家<select name="country" defaultValue={editing?.country || "vietnam"}><option value="vietnam">越南</option><option value="thailand">泰國</option></select></label>
            <label>方案<select name="plan" defaultValue={editing?.plan || "free"}><option value="free">free</option><option value="basic">basic</option><option value="featured">featured</option><option value="premium">premium</option></select></label>
          </div>
          <label>Google Map 網址<input name="googleMapUrl" defaultValue={editing?.googleMapUrl || ""} placeholder="https://maps.google.com/..." /></label>
          <label>商家描述<textarea name="description" required rows={3} defaultValue={editing?.description || ""} /></label>
          <label>特色標籤<textarea name="badges" rows={3} defaultValue={editing?.badges.join("\n") || ""} /></label>
          <div className="grid two">
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
                <span>{business.category} / {business.citySlug} / {business.districtSlug || "不限分區"} / {business.plan}</span>
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
