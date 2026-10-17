import batch from "@/data/chiang-mai-businesses.json";
import { chiangMaiAreas } from "./chiang-mai-areas";
import type { CmsContent } from "./cms-store";
import type { DirectoryBusiness } from "./types";

function identity(value: string) {
  return value.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
}

export function applyChiangMaiImport(content: CmsContent) {
  const city = content.cities.find(c => c.slug === "chiang-mai" && c.country === "thailand");
  if (!city) throw new Error("找不到清邁城市資料，未寫入商家。");
  let districts = 0;
  for (const area of chiangMaiAreas) {
    if (!city.districts.some(d => d.slug === area.slug)) {
      city.districts.push({ slug: area.slug, name: area.name, nameEn: area.nameEn, summary: area.summary });
      districts++;
    }
  }
  const skipped: string[] = [];
  const added: string[] = [];
  for (const entry of batch) {
    const duplicate = content.businesses.some(b => b.slug === entry.slug || (b.citySlug === "chiang-mai" && identity(b.name) === identity(entry.name)));
    if (duplicate) { skipped.push(entry.name); continue; }
    const item = structuredClone(entry) as DirectoryBusiness;
    if ((item.description.match(/\p{Script=Han}/gu) || []).length < 500) throw new Error(`${item.name} 介紹不足 500 字。`);
    if (!item.image || !item.imageSource || !item.imageCredit) item.isActive = false;
    content.businesses.push(item);
    added.push(item.name);
  }
  return { added, skipped, districts };
}
