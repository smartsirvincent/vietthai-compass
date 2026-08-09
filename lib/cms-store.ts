import "server-only";
import { promises as fs } from "fs";
import path from "path";
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
      ssl: databaseUrl.includes("localhost") ? undefined : { rejectUnauthorized: false }
    });
  }
  return globalThis.vietThaiCmsPool;
}

async function ensureDatabase() {
  const pool = getPool();
  if (!pool) return;
  await pool.query(`
    create table if not exists cms_documents (
      key text primary key,
      value jsonb not null,
      updated_at timestamptz not null default now()
    )
  `);
}

async function readDatabaseContent() {
  const pool = getPool();
  if (!pool) return null;
  await ensureDatabase();
  const result = await pool.query<{ value: CmsContent }>("select value from cms_documents where key = $1", [documentKey]);
  if (result.rows[0]?.value) return result.rows[0].value;
  await writeDatabaseContent(seedContent);
  return seedContent;
}

async function writeDatabaseContent(content: CmsContent) {
  const pool = getPool();
  if (!pool) return false;
  await ensureDatabase();
  await pool.query(
    `
      insert into cms_documents (key, value, updated_at)
      values ($1, $2::jsonb, now())
      on conflict (key)
      do update set value = excluded.value, updated_at = now()
    `,
    [documentKey, JSON.stringify(content)]
  );
  return true;
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

async function writeFileContent(content: CmsContent) {
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    throw new Error("正式環境尚未設定雲端資料庫，後台寫入已被阻擋，避免資料只暫存在 Vercel 檔案系統。請設定 DATABASE_URL 或 POSTGRES_URL。");
  }
  await fs.writeFile(contentPath, JSON.stringify(content, null, 2), "utf8");
}

function normalizeContent(content: CmsContent): CmsContent {
  return {
    settings: {
      siteName: content.settings?.siteName || defaultSiteSettings.siteName,
      siteNameEn: content.settings?.siteNameEn || defaultSiteSettings.siteNameEn,
      siteDescription: content.settings?.siteDescription || defaultSiteSettings.siteDescription,
      homeEyebrow: content.settings?.homeEyebrow || defaultSiteSettings.homeEyebrow,
      homeTitle: content.settings?.homeTitle || defaultSiteSettings.homeTitle,
      homeIntro: content.settings?.homeIntro || defaultSiteSettings.homeIntro,
      homePrimaryCtaLabel: content.settings?.homePrimaryCtaLabel || defaultSiteSettings.homePrimaryCtaLabel,
      homeSecondaryCtaLabel: content.settings?.homeSecondaryCtaLabel || defaultSiteSettings.homeSecondaryCtaLabel,
      ga4Id: content.settings?.ga4Id || "",
      gtmId: content.settings?.gtmId || "",
      heroImage: content.settings?.heroImage || "/brand-assets/home-hero-vietthai-commerce.png",
      logoImage: content.settings?.logoImage || ""
    },
    articles: content.articles.map((article) => ({
      ...article,
      content:
        article.content ||
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
      districts: city.districts?.length ? city.districts : seedCityBySlug.get(city.slug)?.districts || []
    })),
    businesses: content.businesses.map((business) => ({
      ...business,
      image: business.image || "/brand-assets/home-business-local-life.png",
      districtSlug: business.districtSlug || "",
      googleMapUrl: business.googleMapUrl || "",
      badges: business.badges || [],
      socials: {
        ...(business.socials || {}),
        tiktok: business.socials?.tiktok || "",
        telegram: business.socials?.telegram || ""
      }
    }))
  };
}

export function getCmsStorageMode() {
  if (hasDatabase()) return "cloud-database";
  if (process.env.VERCEL || process.env.NODE_ENV === "production") return "readonly-seed";
  return "local-json";
}

export async function readCmsContent(): Promise<CmsContent> {
  const content = hasDatabase() ? await readDatabaseContent() : await readFileContent();
  return normalizeContent(content || seedContent);
}

export async function writeCmsContent(content: CmsContent) {
  if (hasDatabase()) {
    await writeDatabaseContent(content);
    return;
  }
  await writeFileContent(content);
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

export async function saveSiteSettings(settings: SiteSettings) {
  const content = await readCmsContent();
  content.settings = settings;
  await writeCmsContent(content);
}

export async function saveArticle(article: Article, originalSlug?: string) {
  const content = await readCmsContent();
  const key = originalSlug || article.slug;
  const index = content.articles.findIndex((item) => item.slug === key);
  if (index >= 0) content.articles[index] = article;
  else content.articles.unshift(article);
  await writeCmsContent(content);
}

export async function saveCity(city: City, originalSlug?: string) {
  const content = await readCmsContent();
  const key = originalSlug || city.slug;
  const index = content.cities.findIndex((item) => item.slug === key);
  if (index >= 0) content.cities[index] = city;
  else content.cities.unshift(city);
  await writeCmsContent(content);
}

export async function saveBusiness(business: DirectoryBusiness, originalSlug?: string) {
  const content = await readCmsContent();
  const key = originalSlug || business.slug;
  const index = content.businesses.findIndex((item) => item.slug === key);
  if (index >= 0) content.businesses[index] = business;
  else content.businesses.unshift(business);
  await writeCmsContent(content);
}

export async function deleteArticle(slug: string) {
  const content = await readCmsContent();
  content.articles = content.articles.filter((item) => item.slug !== slug);
  await writeCmsContent(content);
}

export async function deleteCity(slug: string) {
  const content = await readCmsContent();
  content.cities = content.cities.filter((item) => item.slug !== slug);
  await writeCmsContent(content);
}

export async function deleteBusiness(slug: string) {
  const content = await readCmsContent();
  content.businesses = content.businesses.filter((item) => item.slug !== slug);
  await writeCmsContent(content);
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
