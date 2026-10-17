import type { Article, SiteSettings } from "@/lib/types";
import { absoluteUrl } from "./seo";

export function escapeXml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

export function articleFeed(articles: Article[], settings: SiteSettings) {
  const recent = [...articles].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 50);
  const items = recent.map(article => {
    const url = escapeXml(absoluteUrl(`/articles/${encodeURIComponent(article.slug)}`));
    const published = article.publishedAt && Number.isFinite(Date.parse(article.publishedAt)) ? `<pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>` : "";
    return `<item><title>${escapeXml(article.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><description>${escapeXml(article.excerpt)}</description>${published}</item>`;
  }).join("");
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${escapeXml(settings.siteName || "越泰指南")}</title><link>${escapeXml(absoluteUrl("/"))}</link><description>${escapeXml(settings.siteDescription || "越南與泰國旅遊指南")}</description><language>zh-TW</language><atom:link href="${escapeXml(absoluteUrl("/feed.xml"))}" rel="self" type="application/rss+xml"/>${items}</channel></rss>`;
}
