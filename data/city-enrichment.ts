import type { City } from "@/lib/types";

export const additionalCityGuides: City[] = [
  {
    slug: "hanoi",
    country: "vietnam",
    name: "河內",
    nameEn: "Hanoi",
    summary: "越南首都，以老城街巷、湖畔散步、法式建築與北越料理為主軸，也適合作為下龍灣與寧平行程的起點。",
    bestSeason: "9 月至 11 月；3 月至 4 月",
    weather: "北越四季分明；5–8 月炎熱潮濕、午後雨多，12–2 月偏涼，偶有濕冷。",
    recommendedDays: "3-5 天",
    audience: ["初訪越南旅客", "歷史文化旅人", "美食與街區散步族"],
    businessAngle: "河內可發展老城餐飲、咖啡、文化導覽、精品住宿與北越延伸行程合作。",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Hanoi%2C_Vietnam%2C_Sunset_at_Hoan_Kiem_Lake.jpg?width=1600",
    imageSource: "https://commons.wikimedia.org/wiki/File:Hanoi,_Vietnam,_Sunset_at_Hoan_Kiem_Lake.jpg",
    imageCredit: "Vyacheslav Argenberg / CC BY 4.0",
    districts: [
      { slug: "old-quarter", name: "還劍湖／老城區", nameEn: "Hoan Kiem / Old Quarter", summary: "老城街巷、湖畔景點、街頭小吃與旅宿最集中的初訪核心區。" },
      { slug: "ba-dinh", name: "巴亭廣場一帶", nameEn: "Ba Dinh", summary: "政治地標、博物館與綠蔭街道集中，適合歷史文化行程。" },
      { slug: "tay-ho", name: "西湖區", nameEn: "Tay Ho", summary: "湖畔咖啡、餐廳與長住社群較多，適合較悠閒的生活型旅程。" }
    ]
  },
  {
    slug: "phuket",
    country: "thailand",
    name: "普吉",
    nameEn: "Phuket",
    summary: "泰國安達曼海島度假入口，結合海灘、老城、出海活動與度假住宿，適合依海況安排慢旅行。",
    bestSeason: "11 月至 4 月",
    weather: "11–4 月較乾、海況通常較平穩；5–10 月西南季風帶來較多雨與浪，出海行程可能調整。",
    recommendedDays: "4-7 天",
    audience: ["海島度假旅客", "親子家庭", "潛水與出海活動愛好者"],
    businessAngle: "普吉適合度假住宿、餐飲、接送、船遊、潛水與婚禮服務等合作內容。",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Patong_Beach_in_Phuket.jpg?width=1600",
    imageSource: "https://commons.wikimedia.org/wiki/File:Patong_Beach_in_Phuket.jpg",
    imageCredit: "Ewong17 / CC BY-SA 4.0",
    districts: [
      { slug: "phuket-old-town", name: "普吉老城", nameEn: "Phuket Old Town", summary: "中葡式建築、咖啡館、夜市與在地餐館集中，適合安排半日步行。" },
      { slug: "patong", name: "芭東海灘", nameEn: "Patong", summary: "海灘、住宿、購物與夜生活選擇密集，旅遊機能最完整。" },
      { slug: "kata-karon", name: "卡塔／卡隆海灘", nameEn: "Kata / Karon", summary: "海灘度假氛圍較鮮明，適合親子、海景住宿與水上活動。" }
    ]
  },
  {
    slug: "hoi-an",
    country: "vietnam",
    name: "會安",
    nameEn: "Hoi An",
    summary: "以古城街區、河岸夜景、手作體驗與近郊海灘聞名，從峴港出發即可安排一至數晚的小旅行。",
    bestSeason: "2 月至 5 月",
    weather: "2–5 月較舒適；6–8 月炎熱晴朗，9–1 月雨勢與風暴風險增加，秋季留意河水上漲。",
    recommendedDays: "2-3 天",
    audience: ["文化散步旅客", "情侶與親子", "峴港自由行旅客"],
    businessAngle: "會安適合古城餐飲、手作體驗、旅宿、攝影服務與峴港往返交通內容。",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Hoi_An_Ancient_Town.jpg?width=1600",
    imageSource: "https://commons.wikimedia.org/wiki/File:Hoi_An_Ancient_Town.jpg",
    imageCredit: "Andre Hospers / CC BY 4.0",
    districts: [
      { slug: "ancient-town", name: "會安古城", nameEn: "Hoi An Ancient Town", summary: "歷史建築、河岸、餐廳與手作店集中，建議清晨或傍晚步行探索。" },
      { slug: "an-bang", name: "安邦海灘", nameEn: "An Bang Beach", summary: "海邊餐廳與度假住宿較多，可與古城行程分開安排半日。" },
      { slug: "cam-thanh", name: "錦清椰林", nameEn: "Cam Thanh", summary: "水鄉體驗與鄉間景色為主，出發前確認體驗內容、交通與天候。" }
    ]
  },
  {
    slug: "hue",
    country: "vietnam",
    name: "順化",
    nameEn: "Hue",
    summary: "越南阮朝古都，皇城、皇陵、香江與宮廷料理構成深度文化路線，適合搭配峴港或會安規劃中越行程。",
    bestSeason: "2 月至 4 月",
    weather: "2–8 月較乾熱；9–12 月常有強降雨，颱風季可能影響河岸與戶外古蹟參觀。",
    recommendedDays: "2-3 天",
    audience: ["歷史文化旅人", "古蹟建築愛好者", "中越深度旅行者"],
    businessAngle: "順化可發展古蹟導覽、文化旅宿、宮廷料理與峴港—順化包車路線合作。",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Hue_Vietnam_Citadel-of-Hu%E1%BA%BF-01.jpg?width=1600",
    imageSource: "https://commons.wikimedia.org/wiki/File:Hue_Vietnam_Citadel-of-Hu%E1%BA%BF-01.jpg",
    imageCredit: "CEphoto, Uwe Aranas / CC BY-SA 3.0",
    districts: [
      { slug: "imperial-city", name: "皇城／東巴市場", nameEn: "Imperial City / Dong Ba Market", summary: "皇城、香江與傳統市場步行可串接，是初訪順化的主要住宿與參觀範圍。" },
      { slug: "south-bank", name: "香江南岸", nameEn: "South Bank", summary: "餐廳、咖啡與城市旅宿較集中，適合作為晚餐和散步據點。" },
      { slug: "royal-tombs", name: "皇陵郊區", nameEn: "Royal Tombs", summary: "多座皇陵分散於市郊，適合安排半日包車並留意高溫與降雨。" }
    ]
  },
  {
    slug: "nha-trang",
    country: "vietnam",
    name: "芽莊",
    nameEn: "Nha Trang",
    summary: "越南南中部海濱城市，海灘、海島船遊、泥漿浴與海鮮餐飲選擇豐富，適合安排度假型行程。",
    bestSeason: "1 月至 8 月",
    weather: "1–8 月通常較晴熱；9–12 月雨量較多、海況轉差，出海活動需依當日公告確認。",
    recommendedDays: "3-5 天",
    audience: ["海灘度假旅客", "親子家庭", "水上活動與放鬆行程族"],
    businessAngle: "芽莊適合海景旅宿、海鮮餐廳、泥漿浴、接送及近海島嶼體驗等內容合作。",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Beach_in_Nha_Trang.jpg?width=1600",
    imageSource: "https://commons.wikimedia.org/wiki/File:Beach_in_Nha_Trang.jpg",
    imageCredit: "Christophe95 / CC BY-SA 4.0",
    districts: [
      { slug: "tran-phu-beach", name: "陳富海灘／市中心", nameEn: "Tran Phu Beach / City Center", summary: "海濱大道、飯店、餐廳與旅行服務集中，適合初次到訪和短住。" },
      { slug: "nha-trang-north", name: "北部海岸", nameEn: "Northern Coast", summary: "海景住宿與較安靜的海岸空間較多，前往市區需預留交通時間。" },
      { slug: "island-pier", name: "港口與出海區", nameEn: "Island Pier", summary: "船遊與海島行程的出發範圍，海況與碼頭資訊以營運方公告為準。" }
    ]
  },
  {
    slug: "krabi",
    country: "thailand",
    name: "甲米",
    nameEn: "Krabi",
    summary: "以石灰岩海岸、萊利海灘、喀斯特地景與跳島行程聞名，節奏比大型城市慢，適合安排海上與自然體驗。",
    bestSeason: "11 月至 4 月",
    weather: "11–4 月通常較乾、海面較平穩；5–10 月西南季風雨增加，浪況可能影響船班與跳島。",
    recommendedDays: "3-5 天",
    audience: ["海島與自然旅人", "攀岩愛好者", "慢旅行與度假旅客"],
    businessAngle: "甲米適合度假住宿、長尾船與跳島行程、攀岩體驗、接駁和海濱餐飲內容。",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Railay%2C_Krabi%2C_Thailand.jpg?width=1600",
    imageSource: "https://commons.wikimedia.org/wiki/File:Railay,_Krabi,_Thailand.jpg",
    imageCredit: "Vyacheslav Argenberg / CC BY 4.0",
    districts: [
      { slug: "ao-nang", name: "奧南海灘", nameEn: "Ao Nang", summary: "住宿、餐飲、交通與跳島訂購集中，是多數旅客安排甲米行程的基地。" },
      { slug: "railay", name: "萊利海灘", nameEn: "Railay", summary: "需搭船抵達的海岸區，以石灰岩景觀、海灘與攀岩聞名。" },
      { slug: "krabi-town", name: "甲米鎮", nameEn: "Krabi Town", summary: "在地市場、河岸與日常餐飲較多，適合認識非度假型的城市生活。" }
    ]
  },
  {
    slug: "chiang-rai",
    country: "thailand",
    name: "清萊",
    nameEn: "Chiang Rai",
    summary: "泰國最北部的文化與自然旅行據點，白廟、藍廟、山區茶園與金三角周邊可組成多日行程。",
    bestSeason: "11 月至 2 月",
    weather: "11–2 月較涼爽乾燥；3–4 月炎熱且北部可能有煙霾，5–10 月降雨增多、山區雲霧較多。",
    recommendedDays: "2-4 天",
    audience: ["寺廟建築愛好者", "自然與山區旅人", "清邁延伸行程旅客"],
    businessAngle: "清萊可發展文化導覽、山區住宿、茶園體驗、包車與清邁—清萊多日路線內容。",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Chiang_Rai_Thailand_Wat-Rong-Khun-01.jpg?width=1600",
    imageSource: "https://commons.wikimedia.org/wiki/File:Chiang_Rai_Thailand_Wat-Rong-Khun-01.jpg",
    imageCredit: "CEphoto, Uwe Aranas / CC BY-SA 3.0",
    districts: [
      { slug: "chiang-rai-city", name: "清萊市區", nameEn: "Chiang Rai City", summary: "夜市、鐘樓、餐飲和住宿較集中，適合作為市區停留與轉乘基地。" },
      { slug: "temple-route", name: "寺廟景點帶", nameEn: "Temple Route", summary: "白廟、藍廟等景點分散於市區周邊，包車或預約交通較容易串訪。" },
      { slug: "mae-salong", name: "美斯樂山區", nameEn: "Mae Salong", summary: "茶園與山景為主，路程較長且彎道多，建議預留完整一日並關注天候。" }
    ]
  }
];
