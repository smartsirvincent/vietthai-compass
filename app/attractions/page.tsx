import { exploreMetadata } from "@/lib/explore-metadata";
import { ExplorePage } from "@/components/ExplorePage";
import type { ExploreQuery } from "@/lib/explore";
export function generateMetadata({ searchParams }: { searchParams: Promise<ExploreQuery> }) {
  return exploreMetadata(searchParams, "/attractions", "越南泰國景點行程", "留一點時間散步、看風景，找到這趟旅行想去的地方。");
}
export default function Page({ searchParams }: { searchParams: Promise<ExploreQuery> }) {
  return <ExplorePage title="景點行程" intro="留一點時間散步、看風景，找到這趟旅行想去的地方。" path="/attractions" category="景點行程" searchParams={searchParams} />;
}
