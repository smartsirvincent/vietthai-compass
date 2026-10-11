import type { City, CountryCode } from "@/lib/types";
export type ExploreQuery = { country?: string; city?: string; district?: string; q?: string; page?: string };
export function cleanExploreQuery(query: ExploreQuery): ExploreQuery {
  const clean: ExploreQuery = {};
  for (const key of ["country", "city", "district", "q", "page"] as const) {
    const value = query[key];
    const first = Array.isArray(value) ? value[0] : value;
    if (typeof first === "string") clean[key] = first.trim().slice(0, 200);
  }
  return clean;
}
export function resolveDestination(query: ExploreQuery, cities: City[]) {
  let country: CountryCode | undefined = query.country === "vietnam" || query.country === "thailand" ? query.country : undefined;
  const city = cities.find(item => item.slug === query.city && (!country || item.country === country));
  if (city) country = city.country;
  const district = city?.districts.find(item => item.slug === query.district);
  return { country, city, district };
}
export function inDestination(item: { country?: CountryCode; citySlug?: string; districtSlug?: string }, destination: ReturnType<typeof resolveDestination>, cities: City[]) {
  const country = cities.find(city => city.slug === item.citySlug)?.country || item.country;
  return (!destination.country || country === destination.country) && (!destination.city || item.citySlug === destination.city.slug) && (!destination.district || item.districtSlug === destination.district.slug);
}
export function destinationHref(path: string, city: City, district?: string) {
  const query = new URLSearchParams({ country: city.country, city: city.slug });
  if (district) query.set("district", district);
  return `${path}?${query}`;
}
