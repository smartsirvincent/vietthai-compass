import { exploreMetadata } from "@/lib/explore-metadata";
import { ExplorePage } from "@/components/ExplorePage";
import type { ExploreQuery } from "@/lib/explore";
export function generateMetadata({ searchParams }: { searchParams: Promise<ExploreQuery> }) {
  return exploreMetadata(searchParams, "/directory", "越南泰國精選商家", "找餐廳、咖啡廳或在地服務，先看介紹，再開啟地圖出發。");
}
export default function Page({ searchParams }: { searchParams: Promise<ExploreQuery> }) {
  return <ExplorePage title="精選商家" intro="找餐廳、咖啡廳或在地服務，先看介紹，再開啟地圖出發。" path="/directory" directory searchParams={searchParams} />;
}
