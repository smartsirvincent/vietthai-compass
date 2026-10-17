export const BANGKOK_TRANSIT_LINES = [
  {
    id: "bts-sukhumvit",
    name: "BTS Sukhumvit Line",
    label: "BTS 素坤逸線",
    color: "#398341",
    mapUrl: "https://www.bts.co.th/eng/routemap.html?lang=en",
    stations: ["bts-ha-yaek-lat-phrao", "bts-mo-chit", "bts-phaya-thai", "bts-siam", "bts-chit-lom", "bts-phloen-chit", "bts-asok", "bts-phrom-phong", "bts-thong-lo", "bts-ekkamai"]
  },
  {
    id: "bts-silom",
    name: "BTS Silom Line",
    label: "BTS 是隆線",
    color: "#167b75",
    mapUrl: "https://www.bts.co.th/eng/routemap.html?lang=en",
    stations: ["bts-national-stadium", "bts-sala-daeng", "bts-chong-nonsi"]
  },
  {
    id: "mrt-blue",
    name: "MRT Blue Line",
    label: "MRT 藍線",
    color: "#2875c7",
    mapUrl: "https://metro.bemplc.co.th/MRT-System-Map?lang=en",
    stations: ["mrt-phahon-yothin", "mrt-kamphaeng-phet", "mrt-sukhumvit", "mrt-qsncc", "mrt-lumphini", "mrt-silom", "mrt-sam-yan", "mrt-hua-lamphong", "mrt-wat-mangkon", "mrt-sam-yot", "mrt-sanam-chai"]
  },
  {
    id: "gold-line", name: "Gold Line", label: "金線", color: "#9b7617",
    mapUrl: "https://www.bts.co.th/eng/routemap.html?lang=en",
    stations: ["gold-charoen-nakhon"]
  }
] as const;

export const BANGKOK_TRANSIT_STATIONS = [
  { id: "bts-ha-yaek-lat-phrao", lineId: "bts-sukhumvit", name: "Ha Yaek Lat Phrao", nameZh: "叻拋五岔路口", area: "Union Mall／Lat Phrao" },
  { id: "bts-mo-chit", lineId: "bts-sukhumvit", name: "Mo Chit", nameZh: "蒙奇", area: "Chatuchak" },
  { id: "bts-phaya-thai", lineId: "bts-sukhumvit", name: "Phaya Thai", nameZh: "披耶泰", area: "Suan Pakkad／機場快線" },
  { id: "bts-phloen-chit", lineId: "bts-sukhumvit", name: "Phloen Chit", nameZh: "奔集", area: "Central Embassy" },
  { id: "bts-ekkamai", lineId: "bts-sukhumvit", name: "Ekkamai", nameZh: "伊卡邁", area: "Gateway／Sukhumvit 42" },
  { id: "bts-chong-nonsi", lineId: "bts-silom", name: "Chong Nonsi", nameZh: "鐘那席", area: "Mahanakhon／Sathorn" },
  { id: "mrt-phahon-yothin", lineId: "mrt-blue", name: "Phahon Yothin", nameZh: "拍鳳裕庭", area: "Union Mall／Lat Phrao" },
  { id: "mrt-kamphaeng-phet", lineId: "mrt-blue", name: "Kamphaeng Phet", nameZh: "甘烹碧", area: "Chatuchak／Or Tor Kor" },
  { id: "mrt-sanam-chai", lineId: "mrt-blue", name: "Sanam Chai", nameZh: "沙南猜", area: "Museum Siam／Wat Pho" },
  { id: "mrt-sam-yan", lineId: "mrt-blue", name: "Sam Yan", nameZh: "三養", area: "Samyan Mitrtown／Chamchuri Square" },
  { id: "mrt-qsncc", lineId: "mrt-blue", name: "Queen Sirikit National Convention Centre", nameZh: "詩麗吉王后會議中心", area: "QSNCC／Benjakitti" },
  { id: "gold-charoen-nakhon", lineId: "gold-line", name: "Charoen Nakhon", nameZh: "恰倫那空", area: "ICONSIAM" },
  { id: "bts-asok", lineId: "bts-sukhumvit", name: "Asok", nameZh: "阿索克", area: "Sukhumvit／Asok" },
  { id: "bts-phrom-phong", lineId: "bts-sukhumvit", name: "Phrom Phong", nameZh: "澎蓬", area: "Sukhumvit 24–31" },
  { id: "bts-thong-lo", lineId: "bts-sukhumvit", name: "Thong Lo", nameZh: "通羅", area: "Thong Lo／Sukhumvit 55" },
  { id: "bts-siam", lineId: "bts-sukhumvit", name: "Siam", nameZh: "暹羅", area: "Siam 商圈" },
  { id: "bts-chit-lom", lineId: "bts-sukhumvit", name: "Chit Lom", nameZh: "奇隆", area: "Ratchaprasong／CentralWorld" },
  { id: "bts-national-stadium", lineId: "bts-silom", name: "National Stadium", nameZh: "國家體育館", area: "MBK／藝術文化中心" },
  { id: "bts-sala-daeng", lineId: "bts-silom", name: "Sala Daeng", nameZh: "沙拉當", area: "Silom／Surawong" },
  { id: "mrt-sukhumvit", lineId: "mrt-blue", name: "Sukhumvit", nameZh: "素坤逸", area: "Asok 轉乘站" },
  { id: "mrt-sam-yot", lineId: "mrt-blue", name: "Sam Yot", nameZh: "三耀", area: "Phra Nakhon／考山路一帶" },
  { id: "mrt-wat-mangkon", lineId: "mrt-blue", name: "Wat Mangkon", nameZh: "龍蓮寺", area: "Yaowarat／唐人街" },
  { id: "mrt-hua-lamphong", lineId: "mrt-blue", name: "Hua Lamphong", nameZh: "華喃峰", area: "Talat Noi／Charoen Krung" },
  { id: "mrt-silom", lineId: "mrt-blue", name: "Si Lom", nameZh: "席隆", area: "Sala Daeng／Silom" },
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
