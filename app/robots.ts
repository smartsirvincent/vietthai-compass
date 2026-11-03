import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const publicContentRules = {
    allow: "/",
    disallow: ["/admin", "/api"]
  };

  return {
    rules: [
      {
        userAgent: "*",
        ...publicContentRules
      },
      {
        userAgent: "OAI-SearchBot",
        ...publicContentRules
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
