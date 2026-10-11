import type { City, CountryCode } from "@/lib/types";
export function normalizeSearch(value: string) {
  return value.normalize("NFKD").replace(/\p{M}/gu, "").replace(/[đĐ]/g, "d").replace(/臺/g, "台").toLowerCase().replace(/[\p{P}\p{S}]+/gu, " ").replace(/\s+/g, " ").trim();
}
export function matchesSearch(values: Array<string | undefined>, query: string) {
  const haystack = normalizeSearch(values.filter(Boolean).join(" "));
  return normalizeSearch(query).split(" ").filter(Boolean).every(token => haystack.includes(token));
}
export function locationTerms(item: { country?: CountryCode; citySlug?: string; districtSlug?: string }, cities: City[]) {
  const city = cities.find(city => city.slug === item.citySlug);
  const district = city?.districts.find(district => district.slug === item.districtSlug);
  const country = city?.country || item.country;
  return [city?.name, city?.nameEn, district?.name, district?.nameEn, country === "vietnam" ? "越南 Vietnam" : country === "thailand" ? "泰國 Thailand" : ""];
}
export function resultPage(value: string | undefined, total: number, size = 12) {
  const pages = Math.max(1, Math.ceil(total / size));
  const requested = Number(value);
  const page = Number.isSafeInteger(requested) ? Math.min(pages, Math.max(1, requested)) : 1;
  return { page, pages, start: (page - 1) * size, end: page * size };
}
