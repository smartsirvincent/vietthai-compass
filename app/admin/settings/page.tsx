import { AdminEditorForm } from "@/components/AdminEditorForm";
import { AdminSubmitButton } from "@/components/AdminSubmitButton";
import { finishCmsEdit } from "@/lib/cms-actions";
import { contentRevision } from "@/lib/cms-store";
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
  return finishCmsEdit(async () => {

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
      officialProfiles: textValue(formData, "officialProfiles").split(/\r?\n/).map(value => value.trim()).filter(Boolean).filter(value => { try { return new URL(value).protocol === "https:"; } catch { return false; } }),
      contactEmail: textValue(formData, "contactEmail"),
      googleSiteVerification: textValue(formData, "googleSiteVerification"),
      heroImage: textValue(formData, "heroImage", "/brand-assets/home-hero-vietthai-commerce.png"),
      logoImage: textValue(formData, "logoImage")
    }, textValue(formData, "revision"));
    return `/admin/settings?saved=${Date.now()}`;
  });
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
        <AdminEditorForm key={params.saved || "edit"} action={saveSettingsAction} className="panel admin-form">
          <input type="hidden" name="revision" value={contentRevision(settings)} />
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
          <label>官方社群連結（每行一個，僅填屬於本站的帳號）<textarea name="officialProfiles" rows={4} defaultValue={(settings.officialProfiles || []).join("\n")} /></label>
          <label>公開聯絡 Email<input type="email" name="contactEmail" defaultValue={settings.contactEmail || ""} /></label>
          <label>
            GA4 Measurement ID
            <input name="ga4Id" defaultValue={settings.ga4Id || ""} placeholder="G-XXXXXXXXXX，或貼上 GA4 官方安裝碼" />
          </label>
          <label>
            Google Tag Manager ID
            <input name="gtmId" defaultValue={settings.gtmId || ""} placeholder="GTM-XXXXXXX，或貼上 GTM 官方安裝碼" />
          </label>
          <label>Google Search Console HTML 驗證碼<input name="googleSiteVerification" defaultValue={settings.googleSiteVerification || ""} placeholder="只貼上 google-site-verification 的 content 值" /></label>
          <p>GA4 請在 Google Analytics 建立本站的網站資料串流後，填入 G- 開頭的評估 ID。Search Console 的網域資源請用 Cloudflare DNS TXT 驗證；這個欄位僅用於網址前置字元資源的 HTML 標記驗證。</p>
          <a href="https://analytics.google.com/" target="_blank" rel="noopener noreferrer">開啟 Google Analytics</a>
          <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer">開啟 Google Search Console</a>
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
          <AdminSubmitButton idleLabel="儲存設定" />
        </AdminEditorForm>

        <div className="panel">
          <h2>內容備份</h2>
          <p>每次成功更新前，系統會在雲端資料庫保留上一版內容。您也可以下載目前的文章、商家、城市及網站設定。</p>
          <a href="/admin/api/backup">下載目前內容備份</a>
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
