import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ImageUploadField } from "@/components/ImageUploadField";
import { requireAdminRole } from "@/lib/admin-auth";
import { getSiteSettings, saveSiteSettings, textValue } from "@/lib/cms-store";

export const metadata = {
  title: "網站設定"
};

function extractTrackingId(value: string, prefix: "G-" | "GTM-") {
  const pattern = prefix === "G-" ? /G-[A-Z0-9_-]+/i : /GTM-[A-Z0-9_-]+/i;
  return value.match(pattern)?.[0].toUpperCase() || "";
}

async function saveSettingsAction(formData: FormData) {
  "use server";
  await requireAdminRole();

  const ga4Id = extractTrackingId(textValue(formData, "ga4Id"), "G-");
  const gtmId = extractTrackingId(textValue(formData, "gtmId"), "GTM-");

  await saveSiteSettings({
    siteName: textValue(formData, "siteName", "越泰指南"),
    siteNameEn: textValue(formData, "siteNameEn", "VietThai Compass"),
    siteDescription: textValue(formData, "siteDescription"),
    homeEyebrow: textValue(formData, "homeEyebrow"),
    homeTitle: textValue(formData, "homeTitle"),
    homeIntro: textValue(formData, "homeIntro"),
    homePrimaryCtaLabel: textValue(formData, "homePrimaryCtaLabel"),
    homeSecondaryCtaLabel: textValue(formData, "homeSecondaryCtaLabel"),
    ga4Id,
    gtmId,
    heroImage: textValue(formData, "heroImage", "/brand-assets/home-hero-vietthai-commerce.png"),
    logoImage: textValue(formData, "logoImage")
  });
  revalidatePath("/", "layout");
  redirect("/admin/settings?saved=1");
}

export default async function AdminSettingsPage({
  searchParams
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireAdminRole();
  const [settings, params] = await Promise.all([getSiteSettings(), searchParams]);

  return (
    <>
      <p className="eyebrow">Tracking</p>
      <h1>網站設定</h1>
      <p>填入 GA4 或 GTM 代碼後，前台會自動完成埋設。若同時使用 GTM 與 GA4，請確認 GTM 內沒有重複安裝同一組 GA4。</p>

      <section className="admin-editor-grid">
        <form action={saveSettingsAction} className="panel admin-form">
          <h2>品牌與首頁文字</h2>
          {params.saved ? <div className="settings-saved">設定已儲存並套用到前台。</div> : null}
          <div className="grid two">
            <label>網站中文名稱<input name="siteName" required defaultValue={settings.siteName || "越泰指南"} /></label>
            <label>網站英文名稱<input name="siteNameEn" defaultValue={settings.siteNameEn || "VietThai Compass"} /></label>
          </div>
          <label>網站 SEO 描述<textarea name="siteDescription" rows={3} defaultValue={settings.siteDescription || ""} /></label>
          <label>首頁小標<input name="homeEyebrow" defaultValue={settings.homeEyebrow || ""} /></label>
          <label>首頁主標題<input name="homeTitle" required defaultValue={settings.homeTitle || ""} /></label>
          <label>首頁說明文字<textarea name="homeIntro" required rows={4} defaultValue={settings.homeIntro || ""} /></label>
          <div className="grid two">
            <label>首頁主要按鈕文字<input name="homePrimaryCtaLabel" defaultValue={settings.homePrimaryCtaLabel || ""} /></label>
            <label>首頁次要按鈕文字<input name="homeSecondaryCtaLabel" defaultValue={settings.homeSecondaryCtaLabel || ""} /></label>
          </div>

          <h2>流量追蹤設定</h2>
          <label>
            GA4 Measurement ID
            <input name="ga4Id" defaultValue={settings.ga4Id || ""} placeholder="G-XXXXXXXXXX，或貼上 GA4 官方安裝碼" />
          </label>
          <label>
            Google Tag Manager ID
            <input name="gtmId" defaultValue={settings.gtmId || ""} placeholder="GTM-XXXXXXX，或貼上 GTM 官方安裝碼" />
          </label>
          <ImageUploadField
            label="首頁大 Banner"
            name="heroImage"
            defaultValue={settings.heroImage || "/brand-assets/home-hero-vietthai-commerce.png"}
            folder="vietthai-compass/site"
            note="建議使用橫式照片，比例約 16:9 或更寬。"
          />
          <ImageUploadField
            label="網站 Logo"
            name="logoImage"
            defaultValue={settings.logoImage || ""}
            folder="vietthai-compass/site"
            note="可上傳透明 PNG 或正方形 Logo。未設定時會使用 VT 預設標誌。"
          />
          <button className="primary-button" type="submit">儲存設定</button>
        </form>

        <div className="panel">
          <h2>目前狀態</h2>
          <div className="settings-status">
            <div>
              <span>網站名稱</span>
              <strong>{settings.siteName || "越泰指南"}</strong>
            </div>
            <div>
              <span>首頁主標</span>
              <strong>{settings.homeTitle || "尚未設定"}</strong>
            </div>
            <div>
              <span>GA4</span>
              <strong>{settings.ga4Id || "尚未設定"}</strong>
            </div>
            <div>
              <span>GTM</span>
              <strong>{settings.gtmId || "尚未設定"}</strong>
            </div>
            <div>
              <span>首頁 Banner</span>
              <strong>{settings.heroImage || "使用預設圖片"}</strong>
            </div>
            <div>
              <span>Logo</span>
              <strong>{settings.logoImage || "使用預設 VT 標誌"}</strong>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
