import { exploreMetadata } from "@/lib/explore-metadata";
import { ExplorePage } from "@/components/ExplorePage";
import type { ExploreQuery } from "@/lib/explore";
export function generateMetadata({ searchParams }: { searchParams: Promise<ExploreQuery> }) {
  return exploreMetadata(searchParams, "/restaurants", "越南泰國餐廳美食", "下一餐想吃什麼？從在地小吃到咖啡廳，找找目的地附近的好味道。");
}
export default function Page({ searchParams }: { searchParams: Promise<ExploreQuery> }) {
  return <ExplorePage title="餐廳美食" intro="下一餐想吃什麼？從在地小吃到咖啡廳，找找目的地附近的好味道。" path="/restaurants" category="餐廳美食" searchParams={searchParams} />;
}
