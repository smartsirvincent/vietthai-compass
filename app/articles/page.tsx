import { exploreMetadata } from "@/lib/explore-metadata";
import { ExplorePage } from "@/components/ExplorePage";
import type { ExploreQuery } from "@/lib/explore";
export function generateMetadata({ searchParams }: { searchParams: Promise<ExploreQuery> }) {
  return exploreMetadata(searchParams, "/articles", "越南泰國完整指南", "從城市、美食、行程到出發前準備，越泰旅行資訊都在這裡。");
}
export default function Page({ searchParams }: { searchParams: Promise<ExploreQuery> }) {
  return <ExplorePage title="完整指南" intro="越南與泰國的城市、美食、行程、生活及行前資訊，從這裡開始找。" path="/articles"  searchParams={searchParams} />;
}
