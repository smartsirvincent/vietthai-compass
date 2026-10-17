import type { DirectoryBusiness } from "@/lib/types";

export type ChiangMaiArea = {
  slug: string; name: string; nameEn: string; summary: string; color: string;
  bounds: [[number, number], [number, number]];
};

// Editorial travel areas, not cadastral or administrative boundaries.
export const chiangMaiAreas: ChiangMaiArea[] = [
  { slug: "old-city", name: "古城區", nameEn: "Old City", summary: "護城河內的寺廟、小巷與咖啡館。", color: "#3265ba", bounds: [[18.781, 98.978], [18.796, 98.994]] },
  { slug: "nimman", name: "尼曼區", nameEn: "Nimman", summary: "尼曼路、設計小店與精品咖啡。", color: "#b44b36", bounds: [[18.789, 98.962], [18.803, 98.976]] },
  { slug: "santitham", name: "山提潭／北門", nameEn: "Santitham", summary: "古城西北側的住宅街區與在地餐館。", color: "#247c61", bounds: [[18.796, 98.976], [18.811, 98.990]] },
  { slug: "jing-jai", name: "真心市集周邊", nameEn: "Jing Jai", summary: "真心市集與 Rattanakosin 路一帶。", color: "#8b548c", bounds: [[18.796, 98.990], [18.811, 99.002]] },
  { slug: "tha-pae", name: "塔佩／昌莫伊", nameEn: "Tha Phae / Chang Moi", summary: "塔佩門東側至河岸間的老街與小吃。", color: "#9b651a", bounds: [[18.786, 98.994], [18.796, 99.002]] },
  { slug: "night-bazaar", name: "夜市／長康路", nameEn: "Night Bazaar", summary: "長康路夜市、飯店與晚餐聚會區。", color: "#b04367", bounds: [[18.774, 98.994], [18.786, 99.005]] },
  { slug: "wat-ket", name: "瓦洛洛河畔／瓦結", nameEn: "Wat Ket / Riverside", summary: "濱河兩岸、老屋與 Sanpakoi 市場。", color: "#247889", bounds: [[18.779, 99.005], [18.802, 99.014]] },
  { slug: "wua-lai", name: "清邁門／瓦萊", nameEn: "Wua Lai", summary: "古城南側的銀器街與泰北料理。", color: "#666130", bounds: [[18.769, 98.976], [18.781, 98.994]] },
  { slug: "suthep", name: "素帖路周邊", nameEn: "Suthep Road", summary: "古城西側、素帖路與校園生活街區。", color: "#536688", bounds: [[18.778, 98.952], [18.789, 98.978]] },
];

export function chiangMaiHref(area = "", type = "") {
  const params = new URLSearchParams();
  if (area) params.set("area", area);
  if (type) params.set("merchantType", type);
  return `/cities/chiang-mai${params.size ? `?${params}` : ""}#chiang-mai-neighborhoods`;
}

export function filterChiangMaiBusinesses(businesses: DirectoryBusiness[], area = "", type = "") {
  return businesses.filter(b => b.country === "thailand" && b.citySlug === "chiang-mai" && b.isActive !== false
    && (!area || (area === "other" ? !chiangMaiAreas.some(a => a.slug === b.districtSlug) : b.districtSlug === area))
    && (!type || b.subcategory === type));
}
