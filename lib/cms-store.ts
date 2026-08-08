import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { articles as seedArticles, businesses as seedBusinesses, cities as seedCities } from "@/data/site";
import { Article, City, DirectoryBusiness } from "@/lib/types";

export type CmsContent = {
  articles: Article[];
  cities: City[];
  businesses: DirectoryBusiness[];
};

const contentPath = path.join(process.cwd(), "data", "cms-content.json");

const seedContent: CmsContent = {
  articles: seedArticles,
  cities: seedCities,
  businesses: seedBusinesses
};

const seedCityBySlug = new Map(seedCities.map((city) => [city.slug, city]));

async function ensureContentFile() {
  try {
    await fs.access(contentPath);
  } catch {
    await fs.mkdir(path.dirname(contentPath), { recursive: true });
    await fs.writeFile(contentPath, JSON.stringify(seedContent, null, 2), "utf8");
  }
}

export async function readCmsContent(): Promise<CmsContent> {
  await ensureContentFile();
  const raw = await fs.readFile(contentPath, "utf8");
  const content = JSON.parse(raw) as CmsContent;

  return {
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

export async function writeCmsContent(content: CmsContent) {
  await fs.writeFile(contentPath, JSON.stringify(content, null, 2), "utf8");
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
