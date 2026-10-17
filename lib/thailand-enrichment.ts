import copy from "@/data/thailand-business-copy.json";
import additions from "@/data/thailand-transit-additions.json";
import baseline from "@/data/thailand-business-baseline.json";
import pictures from "@/data/thailand-business-images.json";
import type { CmsContent } from "./cms-store";
import type { DirectoryBusiness, District } from "./types";
import { isBangkokTransitStationId } from "./bangkok-transit";
import { isBusinessSubcategory } from "./business-taxonomy";

export const THAILAND_BATCH_ID = "thailand-transit-2026-10-17";
const sameText = (a: string, b: string) => a.replace(/\s/g, "") === b.replace(/\s/g, "");
const imagePath = (s?: string) => (s || "").replace(/^https:\/\/vietthai-compass\.vercel\.app/, "");
const districts: District[] = [
  { slug: "samyan", name: "三養", nameEn: "Sam Yan", summary: "朱拉隆功大學周邊的商場、街區與 MRT 三養站生活圈。" },
  { slug: "lumphini", name: "倫披尼", nameEn: "Lumphini", summary: "倫披尼公園、One Bangkok 與市中心休閒商圈。" },
  { slug: "khlong-san", name: "空訕", nameEn: "Khlong San", summary: "昭披耶河西岸的 ICONSIAM 與金線沿線街區。" },
  { slug: "chatuchak", name: "洽圖洽", nameEn: "Chatuchak", summary: "週末市集、Or Tor Kor 市場與叻拋商圈。" },
  { slug: "ratchathewi", name: "拉差貼威", nameEn: "Ratchathewi", summary: "披耶泰站、機場快線與市中心博物館街區。" },
  { slug: "old-city", name: "曼谷老城", nameEn: "Old City", summary: "臥佛寺、暹羅博物館與沙南猜站周邊。" },
  { slug: "silom-sathorn", name: "是隆／沙吞", nameEn: "Silom / Sathorn", summary: "是隆與沙吞的商業街區、餐飲及城市觀景地點。" }
];

export function applyThailandEnrichment(content: CmsContent) {
  const result = { updated: 0, added: 0, images: 0, conflicts: [] as string[] };
  const city = content.cities.find(c => c.slug === "bangkok" && c.country === "thailand");
  if (!city) throw new Error("找不到泰國曼谷城市資料，未寫入任何變更。");
  const imageRecords = pictures as Record<string, { image: string; imageSource: string; imageCredit: string }>;
  for (const [slug, before] of Object.entries(baseline)) {
    const business = content.businesses.find(b => b.slug === slug);
    if (!business || business.country !== "thailand") { result.conflicts.push(slug); continue; }
    const description = copy[slug as keyof typeof copy];
    let changed = false;
    if (!sameText(business.description, description)) {
      if (sameText(business.description, before.description)) { business.description = description; changed = true; }
      else result.conflicts.push(slug + ":description");
    }
    const photo = imageRecords[slug];
    if (photo && business.image !== photo.image) {
      if (imagePath(business.image) === imagePath(before.image)) {
        business.image = photo.image; business.imageSource = photo.imageSource; business.imageCredit = photo.imageCredit;
        result.images++; changed = true;
      } else result.conflicts.push(slug + ":image");
    }
    if (changed) { business.updatedAt = new Date().toISOString(); result.updated++; }
  }
  for (const entry of additions) {
    if (content.businesses.some(b => b.slug === entry.slug)) continue;
    const description = copy[entry.slug as keyof typeof copy];
    const photo = imageRecords[entry.slug];
    if (!photo) { result.conflicts.push(entry.slug + ":missing-photo"); continue; }
    if (Array.from(description.replace(/\s/g, "")).length < 500 ||
      !isBusinessSubcategory("景點行程", entry.subcategory) || !entry.transitStationIds.every(isBangkokTransitStationId)) {
      throw new Error("泰國匯入資料驗證失敗：" + entry.slug);
    }
    if (!city.districts.some(d => d.slug === entry.districtSlug)) {
      const district = districts.find(d => d.slug === entry.districtSlug);
      if (!district) throw new Error("缺少曼谷分區：" + entry.districtSlug);
      city.districts.push({ ...district });
    }
    const notice = entry.slug === "suan-pakkad-palace-museum"
      ? "造訪提醒（2026 年 10 月 17 日查核）：博物館官網目前公告整修閉館，尚未確認重新開放日期。請先向館方確認，勿直接安排入館；以下保留常態介紹與交通資訊，並非目前開放承諾。\n\n" : "";
    const business: DirectoryBusiness = {
      slug: entry.slug, name: entry.name, country: "thailand", citySlug: "bangkok", districtSlug: entry.districtSlug,
      category: "景點行程", subcategory: entry.subcategory as DirectoryBusiness["subcategory"],
      transitStationIds: [...entry.transitStationIds], description: notice + description,
      image: photo.image, imageSource: photo.imageSource, imageCredit: photo.imageCredit,
      badges: [entry.subcategory, "捷運沿線", ...(notice ? ["暫停開放・整修中"] : [])],
      socials: { website: entry.website.includes("thailandtravel.or.jp") ? undefined : entry.website },
      googleMapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(entry.query + " Bangkok Thailand")}`,
      plan: "free", updatedAt: new Date().toISOString()
    };
    content.businesses.push(business); result.added++; result.images++;
  }
  return result;
}
