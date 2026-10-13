export const BUSINESS_CATEGORIES = ["在地生活", "餐廳美食", "景點行程"] as const;

export type BusinessCategory = (typeof BUSINESS_CATEGORIES)[number];

export const BUSINESS_SUBCATEGORIES: Record<BusinessCategory, readonly string[]> = {
  "餐廳美食": [
    "咖啡廳",
    "泰式餐廳",
    "越南料理",
    "日本料理",
    "義式料理",
    "中式料理",
    "韓式料理",
    "海鮮料理",
    "燒烤／美式料理",
    "地中海料理",
    "創意／現代料理",
    "甜點烘焙",
    "酒吧餐酒館",
    "早午餐",
    "其他餐廳"
  ],
  "在地生活": [
    "SPA／按摩",
    "洗衣服務",
    "美容美甲",
    "醫療診所",
    "交通租車",
    "購物採買",
    "共享工作空間",
    "其他生活服務"
  ],
  "景點行程": [
    "古蹟／宗教建築",
    "博物館／藝文展館",
    "百貨商場／購物中心",
    "自然景觀／公園",
    "市集／步行街",
    "表演娛樂",
    "親子景點",
    "特色街區／建築",
    "其他景點"
  ]
};

export type BusinessSubcategory = (typeof BUSINESS_SUBCATEGORIES)[BusinessCategory][number];

export function isBusinessCategory(value: string): value is BusinessCategory {
  return BUSINESS_CATEGORIES.includes(value as BusinessCategory);
}

export function isBusinessSubcategory(category: string, value: string) {
  return isBusinessCategory(category) && BUSINESS_SUBCATEGORIES[category].includes(value);
}

export function inferBusinessSubcategory(business: {
  category: string;
  name: string;
  slug?: string;
  description?: string;
  badges?: string[];
}): BusinessSubcategory {
  const text = [business.name, business.slug, business.description, ...(business.badges || [])]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase();

  if (business.category === "在地生活") {
    if (/\bspa\b|massage|按摩|芳香療法/.test(text)) return "SPA／按摩";
    if (/laundry|laundromat|洗衣|乾洗/.test(text)) return "洗衣服務";
    if (/beauty|nail|salon|美甲|美容|美髮/.test(text)) return "美容美甲";
    if (/clinic|hospital|medical|診所|醫院|醫療/.test(text)) return "醫療診所";
    if (/car rental|租車|包車|機車出租/.test(text)) return "交通租車";
    if (/shopping|supermarket|購物|超市|便利商店/.test(text)) return "購物採買";
    if (/cowork|co-working|共享工作/.test(text)) return "共享工作空間";
    return "其他生活服務";
  }

  if (business.category === "景點行程") {
    if (/mall|department store|百貨|購物中心|landmark 81|vincom center/.test(text)) return "百貨商場／購物中心";
    if (/museum|gallery|art exhibition|博物館|美術館|展覽/.test(text)) return "博物館／藝文展館";
    if (/church|cathedral|temple|pagoda|寺|廟|教堂|古蹟|palace|tunnel|post office/.test(text)) return "古蹟／宗教建築";
    if (/zoo|สวนสัตว์|park|garden|公園|動物園|花園|自然景觀/.test(text)) return "自然景觀／公園";
    if (/market|walking street|夜市|市集|步行街|美食街/.test(text)) return "市集／步行街";
    if (/theatre|theater|puppet|show|concert|劇場|劇院|表演|水上木偶/.test(text)) return "表演娛樂";
    if (/family|kids|children|親子|兒童遊樂/.test(text)) return "親子景點";
    if (/apartment|landmark|building|街區|歷史建築|特色建築/.test(text)) return "特色街區／建築";
    return "其他景點";
  }

  if (/cafe|coffee|咖啡|cà phê|càphê/.test(text)) return "咖啡廳";
  if (/japanese|sushi|ramen|izakaya|日本料理|壽司|拉麵/.test(text)) return "日本料理";
  if (/thai cuisine|thai restaurant|泰式|泰國料理|tom yum|pad thai/.test(text)) return "泰式餐廳";
  if (/vietnamese|vietnam cuisine|越南料理|越式|bánh|pho|phở|cơm|bún|mặn mòi|mekong merchant/.test(text)) return "越南料理";
  if (/roast & smoke|bbq|barbecue|smokehouse|燒烤|烤肉/.test(text)) return "燒烤／美式料理";
  if (/italian|pizza|pasta|義式|義大利|brio/.test(text)) return "義式料理";
  if (/chinese|dim sum|中式|粵菜|港式|小籠包/.test(text)) return "中式料理";
  if (/korean|韓式|韓國料理/.test(text)) return "韓式料理";
  if (/seafood|海鮮|螃蟹|龍蝦/.test(text)) return "海鮮料理";
  if (/mediterranean|地中海/.test(text)) return "地中海料理";
  if (/creative cuisine|modern cuisine|創意料理|現代料理/.test(text)) return "創意／現代料理";
  if (/dessert|bakery|cake|pastry|甜點|烘焙|蛋糕/.test(text)) return "甜點烘焙";
  if (/bar|cocktail|wine|酒吧|餐酒館|調酒/.test(text)) return "酒吧餐酒館";
  if (/brunch|breakfast|早午餐|早餐/.test(text)) return "早午餐";
  return "其他餐廳";
}
