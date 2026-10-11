import type { Metadata } from "next";
import { cleanExploreQuery, type ExploreQuery } from "@/lib/explore";
export async function exploreMetadata(searchParams: Promise<ExploreQuery>, path: string, title: string, description: string): Promise<Metadata> {
  const query = cleanExploreQuery(await searchParams);
  const page = Number(query.page);
  const paginated = Number.isSafeInteger(page) && page > 1;
  const filtered = Boolean(query.country || query.city || query.district || query.q);
  return {
    title: paginated ? `${title}・第 ${page} 頁` : title,
    description,
    alternates: { canonical: paginated && !filtered ? `${path}?page=${page}` : path },
    ...(filtered ? { robots: { index: false, follow: true } } : {})
  };
}
