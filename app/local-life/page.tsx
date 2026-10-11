import { exploreMetadata } from "@/lib/explore-metadata";
import { ExplorePage } from "@/components/ExplorePage";
import type { ExploreQuery } from "@/lib/explore";
export function generateMetadata({ searchParams }: { searchParams: Promise<ExploreQuery> }) {
  return exploreMetadata(searchParams, "/local-life", "越南泰國在地生活", "從旅遊到長住，看看交通、日常採買與當地生活的實用資訊。");
}
export default function Page({ searchParams }: { searchParams: Promise<ExploreQuery> }) {
  return <ExplorePage title="在地生活" intro="從旅遊到長住，看看交通、日常採買與當地生活的實用資訊。" path="/local-life" category="在地生活" searchParams={searchParams} />;
}
