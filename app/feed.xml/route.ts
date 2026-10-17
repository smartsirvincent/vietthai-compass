import { getArticles, getSiteSettings } from "@/lib/cms-store";
import { articleFeed } from "@/lib/feed";

export const dynamic = "force-dynamic";
export async function GET() {
  const [articles, settings] = await Promise.all([getArticles(), getSiteSettings()]);
  return new Response(articleFeed(articles, settings), { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
