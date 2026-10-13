import Link from "next/link";
import { BusinessCard } from "@/components/Cards";
import { BANGKOK_TRANSIT_LINES, BANGKOK_TRANSIT_STATIONS } from "@/lib/bangkok-transit";
import { BUSINESS_CATEGORIES } from "@/lib/business-taxonomy";
import type { DirectoryBusiness } from "@/lib/types";

const businessTypes = [
  { id: "all", label: "全部商家" },
  ...BUSINESS_CATEGORIES.map((category) => ({ id: category, label: category })),
  { id: "taiwan", label: "台商專區" }
];

function buildHref(stationId: string | undefined, businessType: string) {
  const params = new URLSearchParams();
  if (stationId) params.set("station", stationId);
  if (businessType !== "all") params.set("merchantType", businessType);
  return `/cities/bangkok${params.size ? `?${params}` : ""}#bangkok-transit`;
}

export function BangkokTransitExplorer({ businesses, stationId, merchantType }: { businesses: DirectoryBusiness[]; stationId?: string; merchantType?: string }) {
  const selectedStation = BANGKOK_TRANSIT_STATIONS.find((station) => station.id === stationId);
  const selectedType = businessTypes.some((item) => item.id === merchantType) ? merchantType! : "all";
  const stationBusinesses = selectedStation
    ? businesses.filter((business) => business.transitStationIds?.includes(selectedStation.id))
    : businesses;
  const visibleBusinesses = stationBusinesses
    .filter((business) => selectedType === "all" || (selectedType === "taiwan" ? business.isTaiwanBusiness : business.category === selectedType))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <section className="band bangkok-transit" id="bangkok-transit">
      <div className="bangkok-transit-heading">
        <div>
          <p className="eyebrow">BANGKOK BY RAIL</p>
          <h2>搭捷運，順路找商家</h2>
          <p>點選站名探索周邊已收錄商家，餐廳、景點、SPA 與在地服務都在這裡。</p>
        </div>
        <span className="transit-count"><strong>{businesses.length}</strong> 間曼谷商家</span>
      </div>

      <div className="transit-line-list" aria-label="曼谷捷運站">
        {BANGKOK_TRANSIT_LINES.map((line) => (
          <div className="transit-line" key={line.id} style={{ "--transit-line": line.color } as React.CSSProperties}>
            <div className="transit-line-name"><span aria-hidden="true" />{line.label}<small>{line.name}</small></div>
            <div className="transit-stations">
              {line.stations.map((id) => {
                const station = BANGKOK_TRANSIT_STATIONS.find((item) => item.id === id)!;
                const count = businesses.filter((business) => business.transitStationIds?.includes(id)).length;
                const active = selectedStation?.id === id;
                return (
                  <Link className={`transit-station${active ? " is-active" : ""}`} href={buildHref(id, selectedType)} key={id} aria-current={active ? "location" : undefined}>
                    <span className="transit-station-dot" aria-hidden="true" />
                    <span className="transit-station-text"><strong>{station.nameZh}站</strong><small>{station.name}</small></span>
                    <span className="transit-station-count">{count}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <p className="transit-note">站點依商家所在街區作為建議到達區域，實際路線與步行時間請以地圖及營運方公告為準。</p>

      <div className="transit-results" aria-live="polite">
        <div className="transit-results-heading">
          <div><p className="eyebrow">{selectedStation ? `${selectedStation.name} · ${selectedStation.area}` : "ALL BANGKOK"}</p><h3>{selectedStation ? `${selectedStation.nameZh}站附近` : "曼谷已收錄商家"}</h3></div>
          {selectedStation ? <Link className="text-link" href={buildHref(undefined, selectedType)}>查看全部站點</Link> : null}
        </div>
        <nav className="transit-type-filters" aria-label="商家類型">
          {businessTypes.map((type) => <Link className={selectedType === type.id ? "is-active" : ""} href={buildHref(selectedStation?.id, type.id)} key={type.id} aria-current={selectedType === type.id ? "page" : undefined}>{type.label}</Link>)}
        </nav>
        {visibleBusinesses.length ? (
          <div className="grid three transit-business-grid">{visibleBusinesses.map((business) => <BusinessCard business={business} key={business.slug} />)}</div>
        ) : (
          <div className="transit-empty"><h3>{selectedStation ? "這個站區還沒有此類商家" : "目前沒有符合的商家"}</h3><p>換一個商家類型，或查看其他曼谷站點。</p></div>
        )}
      </div>

      <div className="transit-source-links"><span>路線與站名</span><a href="https://www.bts.co.th/eng/routemap.html?lang=en" target="_blank" rel="noreferrer">BTS 官方路線圖</a><a href="https://metro.bemplc.co.th/MRT-System-Map?lang=en" target="_blank" rel="noreferrer">MRT 官方路線圖</a></div>
    </section>
  );
}
