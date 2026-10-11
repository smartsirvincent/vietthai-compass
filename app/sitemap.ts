import type { MetadataRoute } from "next";
import { getArticles, getBusinesses, getCities } from "@/lib/cms-store";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, businesses, cities] = await Promise.all([getArticles(), getBusinesses(), getCities()]);
  const staticRoutes: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
    { path: "", priority: 1, changeFrequency: "daily" },
    { path: "/vietnam", priority: 0.9, changeFrequency: "weekly" },
    { path: "/thailand", priority: 0.9, changeFrequency: "weekly" },
    { path: "/cities", priority: 0.85, changeFrequency: "weekly" },
    { path: "/articles", priority: 0.85, changeFrequency: "daily" },
    { path: "/restaurants", priority: 0.8, changeFrequency: "weekly" },
    { path: "/attractions", priority: 0.8, changeFrequency: "weekly" },
    { path: "/local-life", priority: 0.8, changeFrequency: "weekly" },
    { path: "/taiwan-business", priority: 0.8, changeFrequency: "weekly" },
    { path: "/directory", priority: 0.75, changeFrequency: "weekly" },
    { path: "/business", priority: 0.7, changeFrequency: "monthly" }
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route.path),
      changeFrequency: route.changeFrequency,
      priority: route.priority
    })),
    ...cities.map((city) => ({
      url: absoluteUrl(`/cities/${encodeURIComponent(city.slug)}`),
      changeFrequency: "weekly" as const,
      priority: 0.75
    })),
    ...cities.flatMap((city) => city.districts.map((district) => ({
      url: absoluteUrl(`/cities/${encodeURIComponent(city.slug)}/districts/${encodeURIComponent(district.slug)}`),
      changeFrequency: "weekly" as const,
      priority: 0.68
    }))),
    ...articles.map((article) => ({
      url: absoluteUrl(`/articles/${encodeURIComponent(article.slug)}`),
      lastModified: new Date(article.updatedAt),
      changeFrequency: "monthly" as const,
      priority: article.intent === "commercial" ? 0.8 : 0.7
    })),
    ...businesses.map((business) => ({
      url: absoluteUrl(`/directory/${encodeURIComponent(business.slug)}`),
      ...(business.updatedAt ? { lastModified: new Date(business.updatedAt) } : {}),
      changeFrequency: "weekly" as const,
      priority: business.plan === "premium" ? 0.8 : 0.65
    }))
  ];
}
