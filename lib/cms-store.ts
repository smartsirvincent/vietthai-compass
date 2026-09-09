import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { cache } from "react";
import { createHash, randomUUID } from "crypto";
import { Pool } from "pg";
import { articles as seedArticles, businesses as seedBusinesses, cities as seedCities } from "@/data/site";
import { Article, City, DirectoryBusiness, SiteSettings } from "@/lib/types";

export type CmsContent = {
  articles: Article[];
  cities: City[];
  businesses: DirectoryBusiness[];
  settings: SiteSettings;
};

const contentPath = path.join(process.cwd(), "data", "cms-content.json");
const documentKey = "default";

export const defaultSiteSettings: Required<SiteSettings> = {
  siteName: "越泰指南",
  siteNameEn: "VietThai Compass",
  siteDescription:
    "越泰指南整理越南、泰國旅遊攻略、餐廳景點、在地生活與台商商務資訊，協助讀者快速規劃行程，也協助當地商家取得中文 SEO 曝光。",
  homeEyebrow: "VietThai Compass",
  homeTitle: "越南、泰國中文旅遊與在地生活指南",
  homeIntro: "整理越南與泰國城市指南、餐廳美食、景點行程、在地生活與商家資訊，幫讀者快速找到可前往、可收藏、可比較的實用內容。",
  homePrimaryCtaLabel: "探索城市",
  homeSecondaryCtaLabel: "商務合作",
  ga4Id: "",
  gtmId: "",
  heroImage: "/brand-assets/home-hero-vietthai-commerce.png",
  logoImage: ""
};

const seedContent: CmsContent = {
  articles: seedArticles,
  cities: seedCities,
  businesses: seedBusinesses,
  settings: defaultSiteSettings
};

const seedCityBySlug = new Map(seedCities.map((city) => [city.slug, city]));

export class CmsEditError extends Error {}

export function cmsErrorMessage(error: unknown) {
  if (error instanceof CmsEditError) return error.message;
  console.error("CMS operation failed", error instanceof Error ? error.name : "Unknown error");
  return "資料尚未儲存，請稍後再試。您填寫的內容仍保留在表單中；若持續失敗，請檢查雲端資料庫連線。";
}

// JSONB can change object key order, so revision hashes use canonical keys.
export function contentRevision(value: unknown): string {
  if (value === undefined) return "new";
  const canonical = (item: unknown): unknown => {
    if (Array.isArray(item)) return item.map(canonical);
    if (item && typeof item === "object") {
      return Object.fromEntries(Object.entries(item).filter(([, entry]) => entry !== undefined)
        .sort(([a], [b]) => a.localeCompare(b)).map(([key, entry]) => [key, canonical(entry)]));
    }
    return item;
  };
  return createHash("sha256").update(JSON.stringify(canonical(value))).digest("hex");
}

function assertRevision(current: unknown, expectedRevision?: string) {
  if (!expectedRevision || contentRevision(current) !== expectedRevision) {
    throw new CmsEditError("這筆資料已變更，或表單版本過舊。請先保留您的修改，再重新開啟編輯頁確認最新內容，避免覆蓋其他更新。");
  }
}

const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || "";

declare global {
  var vietThaiCmsPool: Pool | undefined;
}

function hasDatabase() {
  return Boolean(databaseUrl);
}

function getPool() {
  if (!databaseUrl) return null;
  if (!globalThis.vietThaiCmsPool) {
    globalThis.vietThaiCmsPool = new Pool({
      connectionString: databaseUrl,
      max: 3,
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000,
      statement_timeout: 15000,
      ssl: databaseUrl.includes("localhost") ? undefined : { rejectUnauthorized: false }
    });
  }
  return globalThis.vietThaiCmsPool;
}

let databaseReady: Promise<void> | undefined;

async function initializeDatabase() {
  const pool = getPool();
  if (!pool) return;
  await pool.query(`
    create table if not exists cms_documents (
      key text primary key,
      value jsonb not null,
      updated_at timestamptz not null default now()
    )
  `);
  await pool.query(`
    create table if not exists cms_document_revisions (
      id uuid primary key,
      document_key text not null,
      value jsonb not null,
      created_at timestamptz not null default now()
    )
  `);
  await pool.query("alter table cms_document_revisions enable row level security");
}

function ensureDatabase() {
  databaseReady ??= initializeDatabase().catch((error) => {
    databaseReady = undefined;
    throw error;
  });
  return databaseReady;
}

async function readDatabaseContent() {
  const pool = getPool();
  if (!pool) return null;
  const result = await pool.query<{ value: CmsContent }>("select value from cms_documents where key = $1", [documentKey]);
  if (result.rows[0]?.value) return result.rows[0].value;
  throw new Error("CMS document is missing; refusing to replace cloud content with seed data.");
}

async function ensureContentFile() {
  try {
    await fs.access(contentPath);
  } catch {
    await fs.mkdir(path.dirname(contentPath), { recursive: true });
    await fs.writeFile(contentPath, JSON.stringify(seedContent, null, 2), "utf8");
  }
}

async function readFileContent(): Promise<CmsContent> {
  await ensureContentFile();
  const raw = await fs.readFile(contentPath, "utf8");
  return JSON.parse(raw) as CmsContent;
}

function normalizeContent(content: CmsContent): CmsContent {
  return {
    ...content,
    settings: {
      ...content.settings,
      siteName: content.settings?.siteName || defaultSiteSettings.siteName,
      siteNameEn: content.settings?.siteNameEn || defaultSiteSettings.siteNameEn,
      siteDescription: content.settings?.siteDescription || defaultSiteSettings.siteDescription,
      homeEyebrow: content.settings?.homeEyebrow ?? defaultSiteSettings.homeEyebrow,
      homeTitle: content.settings?.homeTitle || defaultSiteSettings.homeTitle,
      homeIntro: content.settings?.homeIntro || defaultSiteSettings.homeIntro,
      homePrimaryCtaLabel: content.settings?.homePrimaryCtaLabel ?? defaultSiteSettings.homePrimaryCtaLabel,
      homeSecondaryCtaLabel: content.settings?.homeSecondaryCtaLabel ?? defaultSiteSettings.homeSecondaryCtaLabel,
      ga4Id: content.settings?.ga4Id || "",
      gtmId: content.settings?.gtmId || "",
      heroImage: content.settings?.heroImage || "/brand-assets/home-hero-vietthai-commerce.png",
      logoImage: content.settings?.logoImage || ""
    },
    articles: content.articles.map((article) => ({
      ...article,
      content:
        article.content ??
        `# ${article.title}\n\n${article.excerpt}\n\n## 重點資訊\n\n請在後台補上完整內容。\n`,
      keywords: article.keywords || [],
      businessFeatures: article.businessFeatures || [],
      relatedBusinessSlug: article.relatedBusinessSlug || "",
      businessIntro: article.businessIntro || "",
      coverImage: article.coverImage || "/brand-assets/home-hero-vietthai-commerce.png",
      photoAlt: article.photoAlt || article.title
    })),
    cities: content.cities.map((city) => ({
      ...city,
      audience: city.audience || [],
      businessAngle: city.businessAngle || "",
      image: city.image || "/brand-assets/home-hero-vietthai-commerce.png",
      districts: city.districts ?? seedCityBySlug.get(city.slug)?.districts ?? []
    })),
    businesses: content.businesses.map((business) => ({
      ...business,
      image: business.image || "/brand-assets/home-business-local-life.png",
      category: business.category || "在地生活",
      review: business.review || "",
      districtSlug: business.districtSlug || "",
      googleMapUrl: business.googleMapUrl || "",
      badges: business.badges || [],
      socials: {
        ...(business.socials || {}),
        phone: business.socials?.phone || "",
        whatsapp: business.socials?.whatsapp || "",
        zalo: business.socials?.zalo || "",
        tiktok: business.socials?.tiktok || "",
        telegram: business.socials?.telegram || ""
      },
      isTaiwanBusiness: Boolean(business.isTaiwanBusiness),
      updatedAt: business.updatedAt || ""
    }))
  };
}

export function getCmsStorageMode() {
  if (hasDatabase()) return "cloud-database";
  if (process.env.VERCEL || process.env.NODE_ENV === "production") return "readonly-seed";
  return "local-json";
}

export const readCmsContent = cache(async (): Promise<CmsContent> => {
  if (!hasDatabase() && process.env.VERCEL) throw new Error("Cloud database is not configured.");
  const content = hasDatabase() ? await readDatabaseContent() : await readFileContent();
  if (!content) throw new Error("CMS content unavailable.");
  return normalizeContent(content);
});

let fileMutationQueue: Promise<void> = Promise.resolve();

async function mutateCmsContent(mutate: (content: CmsContent) => void) {
  if (hasDatabase()) {
    await ensureDatabase();
    const client = await getPool()!.connect();
    try {
      await client.query("begin");
      // Lock before reading: concurrent saves must merge into the latest document.
      const result = await client.query<{ value: CmsContent }>(
        "select value from cms_documents where key = $1 for update", [documentKey]
      );
      const previous = result.rows[0]?.value;
      if (!previous) throw new Error("CMS document is missing.");
      const content = normalizeContent(previous);
      mutate(content);
      await client.query(
        "insert into cms_document_revisions (id, document_key, value) values ($1, $2, $3::jsonb)",
        [randomUUID(), documentKey, JSON.stringify(previous)]
      );
      await client.query("update cms_documents set value = $2::jsonb, updated_at = now() where key = $1", [documentKey, JSON.stringify(content)]);
      await client.query("commit");
    } catch (error) {
      await client.query("rollback");
      throw error;
    } finally {
      client.release();
    }
    return;
  }
  const operation = fileMutationQueue.then(async () => {
    const previous = await readFileContent();
    const content = normalizeContent(previous);
    mutate(content);
    if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
      throw new Error("Cloud database is required for production writes.");
    }
    await fs.writeFile(path.join(path.dirname(contentPath), `cms-content.backup-${randomUUID()}.json`), JSON.stringify(previous), "utf8");
    const temporaryPath = `${contentPath}.${randomUUID()}.tmp`;
    await fs.writeFile(temporaryPath, JSON.stringify(content, null, 2), "utf8");
    await fs.rename(temporaryPath, contentPath);
  });
  fileMutationQueue = operation.catch(() => undefined);
  await operation;
}

export async function getArticles() {
  return (await readCmsContent()).articles;
}

export async function getCities() {
  return (await readCmsContent()).cities;
}

export async function getBusinesses() {
  return (await readCmsContent()).businesses;
}

export async function getSiteSettings() {
  return (await readCmsContent()).settings;
}

export async function saveSiteSettings(settings: SiteSettings, expectedRevision?: string) {
  await mutateCmsContent((content) => {
    assertRevision(content.settings, expectedRevision);
    content.settings = { ...content.settings, ...settings };
  });
}

function upsert<T extends { slug: string }>(items: T[], value: T, originalSlug?: string, expectedRevision?: string) {
  if (value.slug !== originalSlug && !/^[\p{L}\p{N}]+(?:[-_][\p{L}\p{N}]+)*$/u.test(value.slug)) throw new CmsEditError("新的網址 Slug 請使用文字、數字與連字號，不要包含空白或網址符號。");
  const index = originalSlug ? items.findIndex((item) => item.slug === originalSlug) : -1;
  if (originalSlug && index < 0) throw new CmsEditError("這筆資料已刪除或更改網址，請重新開啟列表確認。");
  assertRevision(index >= 0 ? items[index] : undefined, expectedRevision);
  if (items.some((item, position) => item.slug === value.slug && position !== index)) throw new CmsEditError("此網址 Slug 已被使用，請換一個網址，以免覆蓋現有資料。");
  if (index >= 0) items[index] = { ...items[index], ...value };
  else items.unshift(value);
}

function validateLocation(content: CmsContent, value: { country?: string; citySlug?: string; districtSlug?: string }) {
  if (!value.citySlug) {
    if (value.districtSlug) throw new CmsEditError("請先選擇城市，再選擇分區。");
    return;
  }
  const city = content.cities.find((item) => item.slug === value.citySlug);
  if (!city || city.country !== value.country) throw new CmsEditError("城市與國家不一致，請重新選擇。");
  if (value.districtSlug && !city.districts.some((item) => item.slug === value.districtSlug)) throw new CmsEditError("此分區不屬於選擇的城市，請重新選擇。");
}

export async function saveArticle(article: Article, originalSlug?: string, expectedRevision?: string) {
  await mutateCmsContent((content) => {
    validateLocation(content, article);
    if (article.relatedBusinessSlug && !content.businesses.some((item) => item.slug === article.relatedBusinessSlug)) throw new CmsEditError("關聯商家已變更，請重新選擇。");
    upsert(content.articles, article, originalSlug, expectedRevision);
  });
}

export async function saveCity(city: City, originalSlug?: string, expectedRevision?: string) {
  await mutateCmsContent((content) => {
    const key = originalSlug || city.slug;
    const related = [...content.articles, ...content.businesses].filter((item) => item.citySlug === key);
    if (related.some((item) => item.districtSlug && !city.districts.some((district) => district.slug === item.districtSlug))) {
      throw new CmsEditError("欲移除的分區仍有文章或商家使用，請先調整這些資料的分區。");
    }
    upsert(content.cities, city, originalSlug, expectedRevision);
    related.forEach((item) => { item.citySlug = city.slug; item.country = city.country; });
  });
}

export async function saveBusiness(business: DirectoryBusiness, originalSlug?: string, expectedRevision?: string) {
  await mutateCmsContent((content) => {
    validateLocation(content, business);
    upsert(content.businesses, business, originalSlug, expectedRevision);
    if (originalSlug && originalSlug !== business.slug) {
      content.articles.forEach((article) => {
        if (article.relatedBusinessSlug === originalSlug) article.relatedBusinessSlug = business.slug;
      });
    }
  });
}

export async function deleteArticle(slug: string, expectedRevision?: string) {
  await mutateCmsContent((content) => {
    assertRevision(content.articles.find((item) => item.slug === slug), expectedRevision);
    content.articles = content.articles.filter((item) => item.slug !== slug);
  });
}

export async function deleteCity(slug: string, expectedRevision?: string) {
  await mutateCmsContent((content) => {
    assertRevision(content.cities.find((item) => item.slug === slug), expectedRevision);
    if ([...content.articles, ...content.businesses].some((item) => item.citySlug === slug)) throw new CmsEditError("此城市仍有文章或商家，請先調整所屬城市後再刪除。");
    content.cities = content.cities.filter((item) => item.slug !== slug);
  });
}

export async function deleteBusiness(slug: string, expectedRevision?: string) {
  await mutateCmsContent((content) => {
    assertRevision(content.businesses.find((item) => item.slug === slug), expectedRevision);
    content.businesses = content.businesses.filter((item) => item.slug !== slug);
    content.articles.forEach((article) => {
      if (article.relatedBusinessSlug === slug) article.relatedBusinessSlug = "";
    });
  });
}

export function listFromTextarea(value: FormDataEntryValue | null) {
  return String(value || "")
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function textValue(formData: FormData, key: string, fallback = "") {
  return String(formData.get(key) || fallback).trim();
}
