import type { Metadata } from "next";
import { CityCard, SectionHeader } from "@/components/Cards";
import { SiteShell } from "@/components/SiteShell";
import { getCities } from "@/lib/cms-store";

export const metadata: Metadata = {
  title: "城市指南",
  description: "探索越南與泰國城市指南，查看當地季節天氣、建議天數、城市分區、景點美食與行前提醒。",
  alternates: { canonical: "/cities" }
};

export default async function CitiesPage() {
  const cities = await getCities();
  return (
    <SiteShell>
      <section className="page-hero">
        <p className="eyebrow">City Hubs</p>
        <h1>越南與泰國城市指南</h1>
        <p>從想去的城市開始，看看旅遊季節、建議天數與值得探索的分區。</p>
      </section>
      <section className="band light">
        <SectionHeader title="精選城市" intro="越南與泰國，各有值得慢慢探索的風景與日常。" />
        <div className="grid four">
          {cities.map((city) => (
            <CityCard city={city} key={city.slug} />
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
