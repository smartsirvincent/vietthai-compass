export const BANGKOK_TRANSIT_LINES = [
  {
    id: "bts-sukhumvit",
    name: "BTS Sukhumvit Line",
    label: "BTS 素坤逸線",
    color: "#398341",
    mapUrl: "https://www.bts.co.th/eng/routemap.html?lang=en",
    stations: ["bts-phrom-phong"]
  },
  {
    id: "bts-silom",
    name: "BTS Silom Line",
    label: "BTS 是隆線",
    color: "#167b75",
    mapUrl: "https://www.bts.co.th/eng/routemap.html?lang=en",
    stations: ["bts-sala-daeng"]
  },
  {
    id: "mrt-blue",
    name: "MRT Blue Line",
    label: "MRT 藍線",
    color: "#2875c7",
    mapUrl: "https://metro.bemplc.co.th/MRT-System-Map?lang=en",
    stations: ["mrt-sam-yot", "mrt-wat-mangkon", "mrt-hua-lamphong", "mrt-lumphini"]
  }
] as const;

export const BANGKOK_TRANSIT_STATIONS = [
  { id: "bts-phrom-phong", lineId: "bts-sukhumvit", name: "Phrom Phong", nameZh: "澎蓬", area: "Sukhumvit 24–31" },
  { id: "bts-sala-daeng", lineId: "bts-silom", name: "Sala Daeng", nameZh: "沙拉當", area: "Silom／Surawong" },
  { id: "mrt-sam-yot", lineId: "mrt-blue", name: "Sam Yot", nameZh: "三耀", area: "Phra Nakhon／考山路一帶" },
  { id: "mrt-wat-mangkon", lineId: "mrt-blue", name: "Wat Mangkon", nameZh: "龍蓮寺", area: "Yaowarat／唐人街" },
  { id: "mrt-hua-lamphong", lineId: "mrt-blue", name: "Hua Lamphong", nameZh: "華喃峰", area: "Talat Noi／Charoen Krung" },
  { id: "mrt-lumphini", lineId: "mrt-blue", name: "Lumphini", nameZh: "倫披尼", area: "Suan Phlu／Sathorn" }
] as const;

const LEGACY_BUSINESS_STATIONS: Record<string, string[]> = {
  "once-upon-a-thai-spa-phrom-phong": ["bts-phrom-phong"],
  "treehouse-cafe-bar-sukhumvit-31": ["bts-phrom-phong"],
  "so-thai-spa-surawong-bang-rak": ["bts-sala-daeng"],
  "little-prince-cafe-sathon": ["mrt-lumphini"],
  "the-island-bangkok-phra-nakhon": ["mrt-sam-yot"],
  "wallflowers-cafe-nana": ["mrt-wat-mangkon"],
  "chata-specialty-coffee-yaowarat": ["mrt-wat-mangkon"],
  "hong-sieng-kong-talat-noi": ["mrt-hua-lamphong"],
  "la-cabra-talat-noi": ["mrt-hua-lamphong"],
  "mother-roaster-talat-noi": ["mrt-hua-lamphong"]
};

const validStationIds = new Set<string>(BANGKOK_TRANSIT_STATIONS.map((station) => station.id));

export function isBangkokTransitStationId(value: string): boolean {
  return validStationIds.has(value);
}

export function suggestedBangkokTransitStations(business: { slug: string; citySlug: string; country: string }): string[] {
  if (business.country !== "thailand" || business.citySlug !== "bangkok") return [];
  return LEGACY_BUSINESS_STATIONS[business.slug] || [];
}
