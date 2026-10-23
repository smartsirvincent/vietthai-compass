import { thailandTwentyBusinesses } from "@/data/thailand-20-businesses";
import { isBangkokTransitStationId } from "./bangkok-transit";
import { isBusinessSubcategory } from "./business-taxonomy";
import type { CmsContent } from "./cms-store";
import type { District } from "./types";

const bangkokDistricts: District[] = [
  { slug: "yaowarat", name: "耀華力／唐人街", summary: "唐人街、龍蓮寺與周邊傳統市場。" },
  { slug: "old-city", name: "曼谷老城", summary: "臥佛寺、沙南猜與歷史街區。" },
  { slug: "khlong-san", name: "空訕河岸", summary: "昭披耶河西岸的餐飲與購物生活圈。" },
  { slug: "silom-sathorn", name: "是隆／沙吞", summary: "是隆與沙吞的辦公、餐飲及生活街區。" },
  { slug: "sukhumvit", name: "素坤逸", summary: "素坤逸路沿線的餐飲、購物與住宿區域。" },
  { slug: "siam-ratchaprasong", name: "暹羅／拉差巴頌", summary: "暹羅、奇隆與百貨商圈。" },
  { slug: "lumphini", name: "倫披尼", summary: "倫披尼公園與 One Bangkok 一帶。" },
  { slug: "talat-noi", name: "噠叻諾伊／華喃峰", summary: "華喃峰車站、老街與河岸咖啡館。" },
  { slug: "phaya-thai", name: "披耶泰", summary: "Samsen 車站與周邊住宅、餐飲街區。" },
  { slug: "bang-phlat", name: "邦帕拉河岸", summary: "昭披耶河西岸北段的老宅與河景餐飲。" },
  { slug: "khlong-toei", name: "孔堤", summary: "孔堤生鮮市場與 Rama IV 路生活圈。" }
];

const chiangMaiDistricts: District[] = [
  { slug: "nimman", name: "尼曼區", summary: "咖啡館、餐廳與設計小店集中的街區。" },
  { slug: "night-bazaar", name: "夜市／長康路", summary: "長康路夜市及周邊晚間餐飲。" },
  { slug: "tha-pae", name: "塔佩／昌莫伊", summary: "塔佩門至河岸的老街與市場。" }
];

function identity(value: string) {
  return value.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
}

export function applyThailandTwentyImport(content: CmsContent) {
  const cities = new Map(content.cities.filter(city => city.country === "thailand").map(city => [city.slug, city]));
  const added: string[] = [];
  const skipped: string[] = [];
  let districts = 0;

  for (const entry of thailandTwentyBusinesses) {
    const city = cities.get(entry.citySlug);
    if (!city) throw new Error(`找不到泰國城市：${entry.citySlug}`);
    const duplicate = content.businesses.some(business => business.slug === entry.slug
      || (business.country === "thailand" && business.citySlug === entry.citySlug && identity(business.name) === identity(entry.name)));
    if (duplicate) { skipped.push(entry.slug); continue; }
    if ((entry.description.match(/\p{Script=Han}/gu) || []).length < 500
      || !entry.image || !entry.imageSource || !entry.imageCredit
      || !isBusinessSubcategory(entry.category, entry.subcategory || "")
      || (entry.citySlug === "bangkok" && !(entry.transitStationIds || []).every(isBangkokTransitStationId))) {
      throw new Error(`泰國商家資料驗證失敗：${entry.slug}`);
    }

    if (entry.districtSlug && !city.districts.some(district => district.slug === entry.districtSlug)) {
      const district = (entry.citySlug === "bangkok" ? bangkokDistricts : chiangMaiDistricts)
        .find(item => item.slug === entry.districtSlug);
      if (!district) throw new Error(`找不到泰國分區：${entry.districtSlug}`);
      city.districts.push({ ...district });
      districts++;
    }
    content.businesses.push(structuredClone(entry));
    added.push(entry.slug);
  }
  return { added, skipped, districts };
}
