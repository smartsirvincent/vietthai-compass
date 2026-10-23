import photoCatalog from "./thailand-20-photo-catalog.json";
import type { DirectoryBusiness } from "@/lib/types";

type Entry = Pick<DirectoryBusiness, "slug" | "name" | "citySlug" | "districtSlug" | "category" | "subcategory" | "description" | "review" | "badges" | "transitStationIds"> & {
  mapQuery: string;
  researchSource: string;
  website?: string;
  phone?: string;
};

const entries: Entry[] = [
  {
    slug: "nai-sow-bangkok", name: "Nai Sow นายโซว", citySlug: "bangkok", districtSlug: "yaowarat",
    category: "餐廳美食", subcategory: "中式料理", transitStationIds: ["mrt-wat-mangkon"],
    mapQuery: "Nai Sow 3/1 Maitri Chit Road Bangkok", researchSource: "https://www.wongnai.com/restaurants/2334Lb",
    badges: ["華人家常菜", "海鮮料理", "老城用餐"],
    description: `Nai Sow 位在曼谷老城 Maitri Chit 路、靠近 Phlap Phla Chai 一帶，是帶著泰國華人餐館氣息的用餐選擇。這裡不是一人拿著餐點邊走邊吃的夜市攤，而是適合坐下來點幾道菜共享的店。公開菜單與餐飲平台資料可見海鮮、豬肉及炒菜等方向；想認識曼谷華人家庭式餐桌，不一定要只往耀華力最熱鬧的霓虹街道走，這類位於街區邊緣的餐館也值得安排。

兩人用餐可先從一道蛋或蔬菜、一道海鮮或肉類搭配白飯開始，再依食量加點湯品。菜色可能依當日食材與廚房供應調整，店名相同的照片也未必是最新菜單；對蝦蟹、蠔類或魚露過敏的人，應在點餐前請店員逐道確認。華人菜名常讓台灣旅人感到熟悉，但調味可能更偏泰國口味，辣度、鹹度與份量不要憑中文名稱猜測。

這家店的位置適合接在龍蓮寺、唐人街或老城散步之後。搭 MRT 到 Wat Mangkon 仍需步行一段，午後曼谷路面曝曬明顯，建議先確認步行路線和同行者體力；若以餐廳為主要目的，直接叫車到 Maitri Chit 路會更省力。周邊街道有寺廟及日常商家，並非只服務觀光客的街區，拍照時留意門口與通行空間。

用餐前最好查當天開門與最後點餐時間，尤其老城餐館可能有午晚餐之間的休息時段。若要安排多人聚餐，可以事先詢問是否接受訂位、哪些菜需預訂，以及結帳方式。本文根據店家公開資訊與地圖位置整理，提供選店和規劃路線的線索；不宣稱親自試吃，也不把舊照片中的菜色當作現場一定能點到的承諾。`,
    review: "適合想吃合菜、又想避開只看夜市小吃的人。菜色和份量宜先向店員確認；用餐評估以店家公開資訊與地點條件為基礎。"
  },
  {
    slug: "rongros-bangkok", name: "Rongros 曼谷河畔泰菜", citySlug: "bangkok", districtSlug: "old-city",
    category: "餐廳美食", subcategory: "泰式餐廳", transitStationIds: ["mrt-sanam-chai"],
    mapQuery: "Rongros 392/16 Maha Rat Road Bangkok", researchSource: "https://guide.michelin.com/us/en/bangkok-region/bangkok/restaurant/rongros",
    phone: "+66 96 946 1785", badges: ["昭披耶河景", "泰式料理", "夕陽晚餐"],
    description: `Rongros 坐落於曼谷老城 Maha Rat 路的河岸一側，視線越過昭披耶河可望向黎明寺。這是把河景和泰國菜放在同一餐裡的店：餐飲指南介紹它的傳統泰式路線，以及綠咖哩、涼拌粉絲等菜色。室內的老家具與裝飾讓空間帶有舊城氣氛，河邊座位則適合把一段時間留給天色轉暗，而非只為了拍一張寺廟照片匆匆離開。

若想在夕陽時段坐戶外，訂位時應明確詢問河景席、是否有最低消費及雨天安排；有河景不代表每張桌子視角都相同。泰式菜可採共享方式點餐，讓一份咖哩、一盤蔬菜或涼拌菜配飯，較能同時照顧不同食量。綠咖哩含香料與可能的乳製或海鮮調味，對辛辣或過敏敏感者請先和店員確認，不要只以菜名判斷。

從 MRT Sanam Chai 出站後可以把暹羅博物館、臥佛寺與河岸安排成同一段路線，但老城有狹窄人行道與單行車道，實際步行距離應依當天導航確認。若白天參觀寺廟，別把午間曝曬與晚餐之間排得太滿；可以先回住宿處休息，再出來看夜景。觀賞黎明寺不需購買渡船票，但若另要跨河遊覽，請核對碼頭末班時間。

這家店更適合願意花時間吃一頓完整晚餐的旅人；若只想快速補充體力，老城周圍有更輕便的選項。菜單、價格、開放時段和座位政策都可能更動，出發前應直接向店家確認。介紹依餐飲指南與地點資訊整理，沒有把指南的推薦轉述成每位顧客的評價，也沒有冒充實際到訪經驗。`,
    review: "河景與泰式合菜是主要理由，夕陽時段宜事先詢問座位與預約。適合安排老城寺廟行程後的晚餐。"
  },
  {
    slug: "singapore-pochana-yaowarat", name: "Singapore Pochana 耀華力椰奶冰", citySlug: "bangkok", districtSlug: "yaowarat",
    category: "餐廳美食", subcategory: "甜點烘焙", transitStationIds: ["mrt-wat-mangkon"],
    mapQuery: "Singapore Pochana 658 Charoen Krung Road Bangkok", researchSource: "https://www.wongnai.com/restaurants/singapore-potchana",
    badges: ["泰式椰奶冰", "唐人街甜點", "步行小歇"],
    description: `Singapore Pochana 是曼谷唐人街一帶與「ลอดช่องสิงคโปร์」甜品相連的老店。這道甜品名稱有 Singapore，端上桌卻是泰國華人街區發展出的冰涼點心：綠色粉條、椰奶與碎冰形成不同的口感，適合在耀華力吃過鹹食後分一杯。照片與公開店家頁顯示的是實際門市和甜品，不過招牌、裝潢與出杯方式都可能隨時間改變，找店時仍要看即時地圖。

這家店在 Charoen Krung 路靠近摩米路口，與主幹道的霓虹小吃攤不在完全相同的位置。搭 MRT Wat Mangkon 後步行，可把龍蓮寺、耀華力街上的小吃和這杯甜品串成短行程；但唐人街晚間人車混雜，過街與拍照要特別留意。若安排在晚餐前，可先點一杯分享，避免甜品影響後續想吃的主菜。

甜品看起來簡單，對食材有限制的人仍需詢問椰奶、糖漿及其他配料，不能只看照片推斷是無乳、無麩質或純素。碎冰融化速度快，外帶與內用的口感可能不同；如果要帶回飯店，不妨詢問是否適合打包及如何保持冰度。附近餐館的營業時間並不一致，想一次走完數家店，應把各店開門日分開查。

店面可能比觀光廣告呈現得更樸實，這正是街區甜品店的日常尺度。旅行時可把它當作散步中途的休息點，而不是專門排一整晚的用餐地點。公開平台上有同名或搬遷後位置的資料，搜尋時務必以店名加上地址核對；本文依現有店家資料整理，不聲稱親訪，也不引用未核實的星等作為推薦理由。`,
    review: "一杯椰奶冰適合搭配唐人街小吃散步，重點是位置與當日營業確認；口味偏好仍需由旅人自行判斷。"
  },
  {
    slug: "blue-by-alain-ducasse-bangkok", name: "Blue by Alain Ducasse", citySlug: "bangkok", districtSlug: "khlong-san",
    category: "餐廳美食", subcategory: "創意／現代料理", transitStationIds: ["gold-charoen-nakhon"],
    mapQuery: "Blue by Alain Ducasse ICONSIAM Bangkok", researchSource: "https://www.ducasse-paris.com/nos-adresses/blue-by-alain-ducasse/",
    website: "https://www.blue-alainducasse.com/blue-restaurant-2/", phone: "+66 65 731 2346",
    badges: ["法式精緻餐飲", "ICONSIAM", "河景餐廳"],
    description: `Blue by Alain Ducasse 位於 ICONSIAM 的 ICONLUXE 區域，是想在曼谷安排法式精緻餐飲時可研究的選擇。品牌官網介紹餐廳以法式料理為主軸，同時關注泰國在地供應者與河岸環境；窗邊能看到城市與昭披耶河，空間設計也被視為整體用餐體驗的一部分。這與在購物中心隨意選一間餐廳吃晚飯不同，較適合把整個晚上留給一餐。

規劃前應先辨認餐廳本體與同一品牌的 Café of Blue：兩者都在 ICONSIAM，但菜單、定位和預約方式不同。若要主餐廳的正式套餐，不要只搜尋到咖啡館頁面就前往；訂位時可確認用餐時長、菜單版本、服裝要求，以及預算是否含服務費與稅金。飲食禁忌、過敏或不吃生食，應在預約時說明，不要等菜一道道送上後才詢問替代選項。

交通上可搭金線至 Charoen Nakhon，再按商場指標進入 ICONLUXE。ICONSIAM 面積大，找到商場入口不等於找到餐廳，建議預留找樓層和報到的時間。若想搭河上接駁船或把河景散步放在餐前，應另外核對當日碼頭及船班，不把船班當作一定存在的固定接駁。對住在曼谷東側的人，也要把尖峰交通時間算進訂位安排。

這家店適合有紀念日或想細看當代料理表現的旅人；對預算敏感、只需快速補給的人，可以先在同一商場比較其他餐飲。米其林等指南的收錄會隨年度調整，本文不把過往頭銜寫成永久保證。菜單、價格及窗景席安排都以餐廳當下公告為準；介紹依品牌及店家公開資料整理，不冒充個人試吃。`,
    review: "重點是完整的法式餐飲體驗與河景環境；訂位前請辨認正式餐廳與同品牌咖啡館，並核對當期菜單和費用。"
  },
  {
    slug: "hanaya-1976-bangkok", name: "Hanaya 1976 花屋日本料理", citySlug: "bangkok", districtSlug: "silom-sathorn",
    category: "餐廳美食", subcategory: "日本料理", transitStationIds: [],
    mapQuery: "Hanaya 1976 683 Si Phraya Bangkok", researchSource: "https://www.womjapan.com/shop/hanaya1976/",
    phone: "+66 2 233 3080", badges: ["日式料理", "是隆老店", "多人聚餐"],
    description: `Hanaya 1976 位於曼谷是隆與四丕耶一帶，從店名就能看出它與長年經營的日式餐飲脈絡相連。公開店家資訊把壽司、刺身、炸物及熟食列為可見的料理方向；對已連吃幾天泰菜、想換成日式套餐的旅人，這類店的優點是能用相對熟悉的菜式安排一餐。照片可看到店面招牌，但照片拍攝時間與現場招牌可能不同，出發前仍需核對地圖位置。

若同行者口味差異大，可以先確認有沒有定食、熟食與生食並行的選項，再決定是否適合全員用餐。照片裡的刺身不代表每天都有相同魚種；海產供應和價格可能受進貨影響。過敏、孕期或完全不吃生食者，請在點餐時逐道告知，尤其醬汁與高湯可能含魚類或甲殼類成分。想吃特定品項，訂位時先確認會比到店後碰運氣可靠。

四丕耶路與 Charoen Krung 周邊有老城商務街景，不是每條巷子都適合拖著行李散步。從 MRT 或 BTS 下車後仍可能要走一段，炎熱或下雨時可改搭車到餐廳門口，並把晚間回程安排好。若打算把午餐與曼谷河岸景點連起來，不要把碼頭、展館與餐廳全部視為緊貼在一起，地圖上的直線距離往往低估路口等待時間。

這家店較適合坐下來好好吃日式料理，而不是尋找泰國街頭風味的人。不同平台對休息日與最後點餐時間可能有差異，訂位前以店家目前公告為準；多人用餐也可先詢問包廂或座位條件。本文依公開店家資料整理，沒有把歷史店名、舊菜單或單一食客意見當成現場永遠不變的事實。`,
    review: "適合想在曼谷安排日式正餐的旅人；菜色與生食選擇請看當日供應，交通時間則要按實際路線估算。"
  },
  {
    slug: "octave-rooftop-lounge-bangkok", name: "Octave Rooftop Lounge & Bar", citySlug: "bangkok", districtSlug: "sukhumvit",
    category: "餐廳美食", subcategory: "酒吧餐酒館", transitStationIds: ["bts-thong-lo"],
    mapQuery: "Octave Rooftop Lounge Bar Bangkok Marriott Sukhumvit", researchSource: "https://www.marriott.com/en-us/hotels/bkkms-bangkok-marriott-hotel-sukhumvit/dining/",
    website: "https://www.marriott.com/en-us/hotels/bkkms-bangkok-marriott-hotel-sukhumvit/dining/", phone: "+66 2 797 0000",
    badges: ["通羅高空酒吧", "城市夜景", "需留意服裝"],
    description: `Octave Rooftop Lounge & Bar 位於 Bangkok Marriott Hotel Sukhumvit 的高處，是通羅一帶想看曼谷天際線時可考慮的酒吧。飯店官方將它列為屋頂餐飲與調酒空間，主打開闊的城市視野；對初次到曼谷的旅人，這裡的吸引力在於從高處重新辨認素坤逸與通羅的夜景，而不是追求「打卡」後立刻換下一站。Commons 的實景照片呈現的是戶外吧台與景色，非電腦合成示意圖。

想看夕陽，需要留意季節與當天天氣：曼谷午後常有短雨，雲層和能見度不保證讓每天都看到日落。若希望坐到外側位置，應在預約時詢問戶外席、最低消費與雨天改席規則，不要把某張網路照片視為預定席的保證。飯店餐飲可能另計服務費與稅，飲品和餐點的實際價格請以當期菜單為準；不飲酒的人也可先確認無酒精飲品選項。

從 BTS Thong Lo 下車後仍要步行至 Sukhumvit 57 路的飯店入口，晚間路口與車流繁忙，結束時最好預留叫車時間。若同行者有兒童、行動不便或不喜歡高處，先查入場政策與室內外座位選擇；部分屋頂區域可能需經過不同樓層轉乘電梯。飯店官方有服裝要求，穿著安排可比一般夜市更正式一些，以免到門口才需要改變行程。

這裡更像一段放慢節奏的夜景行程，可以安排在通羅晚餐之後，或以此作為今晚主要停留點。戶外區可能因天候、活動或維修暫停使用，先向飯店確認最可靠。本文依飯店目前公開資訊及實景照片整理，不聲稱親訪、也不保證任何時段都有同樣的光線、音樂或座位。`,
    review: "適合把曼谷夜景列為旅程重點的人；座位、消費、服裝和雨天安排都應在預約時確認。"
  },
  {
    slug: "red-sky-bangkok", name: "Red Sky Restaurant 曼谷高空餐廳", citySlug: "bangkok", districtSlug: "siam-ratchaprasong",
    category: "餐廳美食", subcategory: "酒吧餐酒館", transitStationIds: ["bts-chit-lom"],
    mapQuery: "Red Sky Restaurant Centara Grand CentralWorld Bangkok", researchSource: "https://www.centarahotelsresorts.com/centaragrand/cgcw/restaurants-and-bars/",
    website: "https://www.bangkokredsky.com/", phone: "+66 2 100 6255",
    badges: ["拉差巴頌高空餐飲", "城市景觀", "訂位晚餐"],
    description: `Red Sky Restaurant 位於 Centara Grand at CentralWorld，高樓層的戶外與室內空間能把拉差巴頌的購物區變成夜間景觀。飯店官方介紹的是偏西式的正式餐飲、酒品與城市全景，和樓上的 CRU Champagne Bar 雖同屬飯店高空餐飲，卻不是同一個預約項目。安排前先確定自己要的是坐下來吃晚餐，還是以飲品和景色為主，避免到了現場才發現訂錯區域。

這一帶的 CentralWorld、四面佛與百貨商場非常密集，若白天已在商圈購物，晚上到 Red Sky 可以減少跨城移動。BTS Chit Lom 與商場之間有步道，但仍須找到飯店入口與專用電梯；碰上週末或節慶活動，商場人潮會拉長移動時間。若打算從 Siam 站步行過來，也要把體力與天氣算進去，不要只看地圖上的直線距離。

高空餐廳的座位景觀並不平均，拍到城市全景的照片不能等同每張桌子都正對同一方向。生日、紀念日或商務餐敘可在訂位時提出座位需求，同時確認服裝規範、餐點形式及預算是否另加服務費和稅。日落時段會受季節影響；戶外區也可能因雨勢暫停，對座位特別在意的人要先問候補與更換方案。

餐點內容可能隨主廚、季節與促銷活動變更，因此本頁不列固定價格或保證菜單。若同行者有食物過敏、吃素或完全不喝酒，應在預約時說明。與其把它當作「曼谷最美」這類無法查證的排名，更實用的判斷是：是否願意為正式晚餐、便利的市中心位置及高空景觀留出時間和預算。本文根據飯店公開資訊整理，沒有冒稱到訪。`,
    review: "適合在 CentralWorld 一帶購物後安排正式晚餐；要區分 Red Sky 餐廳與飯店其他高空酒吧，並預留找電梯的時間。"
  },
  {
    slug: "baan-ya-hom-zantiis", name: "Baan Ya Hom Zantiis", citySlug: "bangkok", districtSlug: "old-city",
    category: "餐廳美食", subcategory: "泰式餐廳", transitStationIds: ["mrt-sam-yot"],
    mapQuery: "Baan Ya Hom Zantiis Phra Nakhon Bangkok", researchSource: "https://www.tagthai.com/shop/baan-ya-hom-zantiis?pass=chao-phraya-river-pass",
    badges: ["老城庭院", "泰式餐點", "複合空間"],
    description: `Baan Ya Hom Zantiis 位於曼谷老城，是把餐飲、咖啡與其他服務放在同一個空間裡的店。公開旅遊合作平台資料可見店家在 Phra Nakhon 區提供預約服務；Commons 上的實景照片呈現的是店址的房屋外觀，而非示意圖。對想在老城行程中找地方坐下的人，這家店的價值不只是吃一頓飯，也在於可以把寺廟、街巷與一段較安靜的停留時間連起來。

因為店家具有複合型態，查資料時應明確區分餐飲、飲品與按摩等不同服務：同一品牌有不同的價目、可預約時段與適用條件，不能把平台上某項套票當作所有服務都包含的價格。若目的是用餐，最好先確認當日是否供餐、有無需要預訂的菜色；若目的是休息或其他服務，也要問清楚空間是否共用、是否可以臨時入內及取消政策。

從 MRT Sam Yot 往老城街區步行時會經過車流及狹窄人行道，午後陽光強，適合把參觀與用餐安排在同一片區域。若先去了大皇宮或臥佛寺，仍要依實際導航估步行時間，老城交通轉向和巷弄多，不能把每個景點想成一條直線。古城許多建築的入口不顯眼，地圖上最好使用完整英文店名核對。

同一店名的社群照片可能拍攝於不同年份，菜單及空間佈置亦會變。對台灣旅人較實用的做法，是出發前先看店家最新公告，再決定要以正餐、咖啡停留或其他服務為主。對飲食禁忌和服務時間有特殊要求，請直接和店家確認。本文依公開資料整理選店重點，不宣稱實際品嘗，也不把第三方平台的舊價格當成現場報價。`,
    review: "老城中的複合型空間；最需要確認的是打算預約哪一項服務，以及當天餐飲是否供應。"
  },
  {
    slug: "baannai-the-reminiscence", name: "Baannai The Reminiscence", citySlug: "bangkok", districtSlug: "phaya-thai",
    category: "餐廳美食", subcategory: "泰式餐廳", transitStationIds: [],
    mapQuery: "Baannai The Reminiscence 102/13 Kamphaeng Phet 5 Bangkok", researchSource: "https://www.baannaihotel.com/",
    website: "https://www.baannaihotel.com/", badges: ["老宅泰菜", "家庭食譜", "預約聚餐"],
    description: `Baannai The Reminiscence 位在曼谷 Phaya Thai 區、Samsen 鐵路站附近，由老宅記憶延伸為住宿、活動與家庭式泰國料理的複合空間。店家官網說明建築以家族舊居為基礎重新打造，餐飲端希望保留家常食譜，而不是走大賣場式餐廳的快速用餐路線。Commons 照片拍到的是實際建築；若你想要的是一個有住宅尺度、適合慢慢談話的午餐地點，這裡比大型商場餐飲區更有個性。

這家店也承接私人活動，因此預約前最好直接問當天是否對一般散客供餐、有沒有包場或菜單限制。若同行者很多，請先說明人數、是否有長者與孩子，以及飲食需求；傳統料理名稱未必能直接看出是否含蝦醬、魚露或堅果，過敏者要逐項詢問。若是商務會面，也可先確認室內外座位和用餐時間，不把安靜程度當成任何一天都相同。

交通方面，官網指出店址在 Samsen 車站對面，並說距 Ari BTS 與 Bang Sue MRT 仍有一段車程；因此不要把它標成「捷運一出站就到」。從市中心前往，依當時路況叫車或結合火車站周邊散步會比較實際。附近屬住宅與交通混合的街區，行李、輪椅或嬰兒車的進出條件可先向店家詢問。

若白天在恰圖恰或 Ari 一帶安排活動，這裡可以成為回程吃飯與休息的停靠點；若住宿在遠處，則要評估為一餐特地跨區是否符合時間。店家官方網站對餐飲、住宿和活動的介紹應分別閱讀，避免誤把房價當餐價。本文根據店家公開內容與照片整理，沒有以個人試吃口吻描述味道；開放日、菜單和訂位條件均請以店家當下回覆為準。`,
    review: "適合想在住宅感空間吃泰菜或安排小型聚餐的人；餐飲是否對散客開放、是否有包場，應先聯絡店家。"
  },
  {
    slug: "shake-shack-one-bangkok", name: "Shake Shack One Bangkok", citySlug: "bangkok", districtSlug: "lumphini",
    category: "餐廳美食", subcategory: "燒烤／美式料理", transitStationIds: ["mrt-lumphini"],
    mapQuery: "Shake Shack One Bangkok Parade Rama IV", researchSource: "https://shakeshack.com/locations/bangkok-one-bangkok",
    website: "https://shakeshack.com/locations/bangkok-one-bangkok", badges: ["美式漢堡", "One Bangkok", "親子用餐"],
    description: `Shake Shack 的 One Bangkok 分店位於 Parade 區的二樓，是在倫披尼附近逛大型複合商場時，想以漢堡和薯條完成一餐的選項。品牌官網列出這個分店的獨立地址與樓層，Commons 照片也確實拍攝於 One Bangkok 門市。對帶孩子、趕展覽或需要在商場內快速用餐的旅人，明確的店址比泛稱「曼谷某間 Shake Shack」更重要，因為品牌在曼谷另有不同分店。

菜單可從漢堡、雞肉、熱狗或冷凍甜點等品牌常見品項尋找，但季節限定與當地供應不應以其他國家的菜單為準。若對牛肉、乳製品、花生或麩質有疑慮，請在點餐前看現場過敏原資訊；素食者也要確認特定分店提供的選項，而非預設品牌全線相同。尖峰用餐時段可能需要等候，外帶與內用的動線也不同，可先判斷要帶走還是坐下。

One Bangkok 規模很大，MRT Lumphini 出站後進入園區，仍須依現場指標找到 Parade 區及二樓。若前後安排班嘉奇蒂公園或詩麗吉王后會議中心，也要看實際出入口與步行路線；不要把整個園區視為單一門口。商場冷氣與多元設施讓它成為午後避熱的落腳點，但若旅程重點是泰國地方風味，這家更適合作為調整口味的一餐。

這個分店的價值在於地址好辨認、用餐形式直接、可與商場行程結合，而非聲稱它是曼谷最佳漢堡。價格、套餐與外送服務會調整，請看品牌的該分店頁或店內看板。本文根據品牌官方頁及分店實景整理，沒有把其他分店的餐點照片當成這間店的現場供應證明。`,
    review: "適合 One Bangkok 逛街或展覽途中快速用餐；先確認 Parade 區樓層，別把其他曼谷分店當成同一地址。"
  },
  {
    slug: "cafe-amazon-hua-lamphong", name: "Café Amazon 華喃峰店", citySlug: "bangkok", districtSlug: "talat-noi",
    category: "餐廳美食", subcategory: "咖啡廳", transitStationIds: ["mrt-hua-lamphong"],
    mapQuery: "Cafe Amazon Hua Lamphong Bangkok", researchSource: "https://commons.wikimedia.org/wiki/Category:Caf%C3%A9_Amazon",
    badges: ["華喃峰咖啡", "車站周邊", "短暫休息"],
    description: `Café Amazon 華喃峰店適合放在曼谷火車站與 MRT Hua Lamphong 周邊的移動路線裡。Commons 照片拍到的是標示為 Hua Lamphong Branch 的實際門市外觀，不是拿連鎖品牌通用的宣傳照替代這個地址。對剛到站、準備走進唐人街，或需要在前往 Talat Noi 前先喝水、整理路線的人，這是一個容易理解的咖啡停靠點。

連鎖咖啡館的優點是品項形式相對熟悉，但每間門市座位、插座、洗手間和營業時間不一定一樣。如果打算在此工作、充電或等同伴，不要只憑品牌名稱推定有長時間停留的空間；先看現場人潮再決定是否內用。冰咖啡、茶飲和甜點可按自己的咖啡因及糖度需求選擇，對乳製品或堅果過敏者則應向店員查成分，而非把飲品照片當成配方表。

華喃峰站一帶正好是火車、捷運、老街與寺廟的交界。走到 Talat Noi 的距離在地圖上不長，實際卻可能因路口、曝曬與車流變得費力；把咖啡館當成行程起點，可以先決定要沿 Charoen Krung 走，還是直接叫車去下一站。若攜帶大件行李，也要先核對店內是否有安全且不妨礙其他客人的放置位置。

照片可能反映拍攝當年的立面，分店在連鎖體系內亦可能調整營業與搬遷，出發當日務必用完整分店名核對地圖。若發現門市已更動，附近還有其他候車與飲品選擇，不宜把整個交通轉乘計畫押在單一咖啡店上。本文只整理可核對的門市影像及區位用途，不虛構此分店的顧客星等、價格或親訪口感。`,
    review: "適合作為華喃峰車站附近的短暫休息點；座位與設施要依分店現場確認，勿用其他 Café Amazon 分店資訊代替。"
  },
  {
    slug: "cafe-amazon-iconsiam", name: "Café Amazon ICONSIAM", citySlug: "bangkok", districtSlug: "khlong-san",
    category: "餐廳美食", subcategory: "咖啡廳", transitStationIds: ["gold-charoen-nakhon"],
    mapQuery: "Cafe Amazon ICONSIAM Bangkok", researchSource: "https://www.waze.com/live-map/directions/th/krung-thep-maha-nakhon/cafe-amazon-%28iconsiam%29?to=place.ChIJy1DMaN-Z4jARjHiaiZpZfK4",
    badges: ["ICONSIAM 咖啡", "河岸商場", "購物中場休息"],
    description: `Café Amazon ICONSIAM 分店位於昭披耶河西岸的大型商場，是在購物、看展或等待同行者時可尋找的咖啡落腳點。Commons 上有拍攝於 ICONSIAM 的門市實景，能辨認這是特定分店而不是隨便一張品牌示意圖。ICONSIAM 內餐飲選項非常多，選這家店的理由通常不是為了安排一頓正式餐，而是需要一杯飲品與較短的停留時間。

商場樓層與專櫃調整可能影響實際位置，出發時最好看現場電子導覽，再以 Café Amazon 店名確認，避免把樓上或鄰近百貨區的另一家咖啡館看錯。若你打算先逛 SookSiam、再去河邊看夜景，可以把這裡放在兩段行程之間；但商場人流在週末與節慶特別集中，內用座位不一定可預訂，也未必適合長時間工作。

從金線 Charoen Nakhon 站進入 ICONSIAM 不難，難的是進到商場後還需穿越不同區域。與長輩、幼兒或攜帶行李同行時，約定會合點最好具體到樓層和入口；若僅說「咖啡店見」可能會被商場規模耽誤時間。需要無糖、無乳或低咖啡因飲品時，請看本店當日看板並直接詢問，連鎖品牌的其他國家或城市菜單不能直接套用。

購物與渡船班次安排也值得分開看：喝咖啡後若要搭河上交通，先核對當晚碼頭的營運，不把商場營業時間當成船班時間。照片保留的是這間店曾經的實景，門面與位置變更仍以現場為準。本頁重點是幫旅人判斷何時順路停靠，不把一般連鎖咖啡說成 ICONSIAM 必訪的獨家體驗。`,
    review: "適合 ICONSIAM 購物途中喝飲品或會合；請使用商場當日導覽找門市，尤其不要與其他 Café Amazon 分店混淆。"
  },
  {
    slug: "praya-dining-bangkok", name: "Praya Dining 河畔泰式餐廳", citySlug: "bangkok", districtSlug: "bang-phlat",
    category: "餐廳美食", subcategory: "泰式餐廳", transitStationIds: [],
    mapQuery: "Praya Dining Praya Palazzo Bangkok", researchSource: "https://prayapalazzo.com/praya-dining/",
    website: "https://prayapalazzo.com/praya-dining/", phone: "+66 81 402 8118",
    badges: ["河畔老宅", "泰式料理", "需確認船接駁"],
    description: `Praya Dining 位於昭披耶河畔的 Praya Palazzo 老宅內，店家把餐飲主題放在泰國不同時期的傳統食譜與餐桌文化。飯店官網和餐飲指南都將它描述為在歷史建築中用餐的體驗，照片呈現的也是真正的河畔建築。這家店不適合只想臨時找個最近餐館的人；若願意為環境、搭船抵達與一頓較完整的泰式餐飲留時間，才更能理解它的定位。

最重要的實用資訊是抵達方式。餐飲指南指出前往餐廳需走水路，不能看到地圖上的河對岸位置就假設叫車能直接停到門口；訂位時應一併確認上船地點、接駁時間、回程船班與遇雨處理。若同行者容易暈船、攜帶嬰兒車或行動不便，先向飯店詢問上落船及座位的安排。曼谷尖峰交通和河上天候都可能影響行程，預約時間不要卡得太緊。

官方介紹涵蓋午餐、下午茶與晚餐，這些是不同形式的餐飲服務；選定時段後再看對應菜單與價格，不要把網路上的促銷套餐當成全年適用。若要吃泰式宮廷風味或偏傳統的料理，可以詢問當季菜色、辣度及是否含蝦醬、魚露或堅果。對素食或其他飲食限制，提前告知廚房通常比到場後要求全部更換更有彈性。

河畔老宅也適合紀念日或小型聚會，但所謂「浪漫」會受座位、天氣和其他活動影響。想拍建築外觀，記得尊重住宿客及私人活動區域。本文以店家與餐飲指南資料為基礎，不描述未曾親身品嘗的味道；搭船方式、餐價和營業狀態仍以最新預約回覆為準。`,
    review: "特色是搭船到河畔老宅吃泰式料理；訂位時應把碼頭、接駁與回程時刻一併問清楚。"
  },
  {
    slug: "anchan-vegetarian-chiang-mai", name: "Anchan Vegetarian Restaurant", citySlug: "chiang-mai", districtSlug: "nimman",
    category: "餐廳美食", subcategory: "泰式餐廳", transitStationIds: [],
    mapQuery: "Anchan Vegetarian Restaurant Nimmanhaemin Chiang Mai", researchSource: "https://anchanvegetarian.com/",
    website: "https://anchanvegetarian.com/", phone: "+66 83 581 1689",
    badges: ["清邁蔬食", "尼曼路", "泰式素食"],
    description: `Anchan Vegetarian Restaurant 位於清邁尼曼路附近，以泰式風味的蔬食料理作為主軸。店家官網提供地址、營業日與聯絡電話，對住在尼曼區、希望在泰國旅程中安排一餐不以肉類為中心的旅人尤其實用。Wikimedia Commons 的照片是店家菜色的實拍，可作為料理形式的參考；但照片拍攝日期較早，現場菜單、擺盤與食材必須以現在供應為準。

蔬食餐廳也有不同的飲食定義：不吃肉不一定等於完全無乳、無蛋或無魚露。如果你是嚴格純素、宗教飲食或有堅果過敏，訂位或點餐時應清楚說明可接受的食材，特別是泰式醬汁與高湯。兩人同行可以各點不同類型的料理共享，看看香料、豆製品與蔬菜如何組合；不吃辣的人則不要只憑菜名有沒有辣椒字樣判斷辣度。

尼曼區道路與小巷咖啡館集中，適合把 Anchan 放在午後逛設計小店之後，或當作去 One Nimman 一帶的正餐選項。從古城叫車過來比在炎熱中徒步跨區更舒適；若住在尼曼路，則可以先查地圖確認巷口與店門方向。店家網站列出每週休息日，但旅遊旺季、假期和臨時活動可能另有公告，打算專程造訪時應再確認。

餐廳的適合族群不只素食者，也包括想在連續幾餐重口味或大量肉類之後換個用餐節奏的人。不過如果同桌有人只接受肉類主餐，出發前先共同看菜單會比較實際。價格、份量及可預約性以店家當日資訊為準；本文依官方資料與實拍照片整理，不把舊顧客評論當成自己吃過的心得。`,
    review: "適合尼曼區的蔬食晚餐或多人分享泰式菜；嚴格純素與過敏需求應逐項問清楚，營業日也要再核對。"
  },
  {
    slug: "the-larder-cafe-chiang-mai", name: "The Larder Cafe & Bar", citySlug: "chiang-mai", districtSlug: "nimman",
    category: "餐廳美食", subcategory: "早午餐", transitStationIds: [],
    mapQuery: "The Larder Cafe Bar Suk Kasame Road Chiang Mai", researchSource: "https://www.wongnai.com/restaurants/357027bC-%E0%B8%A5%E0%B8%B2%E0%B9%80%E0%B8%94%E0%B8%AD%E0%B8%A3%E0%B9%8C-%E0%B8%84%E0%B8%B2%E0%B9%80%E0%B8%9F%E0%B9%88-%E0%B9%81%E0%B8%AD%E0%B8%99-%E0%B8%9A%E0%B8%B2%E0%B8%A3%E0%B9%8C-%E0%B8%99%E0%B8%B4%E0%B8%A1%E0%B8%A1%E0%B8%B2%E0%B8%99",
    badges: ["清邁早午餐", "尼曼巷弄", "開放式三明治"],
    description: `The Larder Cafe & Bar 位於清邁尼曼一帶的 Suk Kasame 路，適合把早餐延後、想坐下來吃一份較完整早午餐的旅人。公開餐飲頁和實拍照片呈現吐司、開放式三明治與咖啡等方向；它的節奏與夜市邊走邊吃不同，更適合安排在上午或中午，留時間把餐點吃完再進入下午行程。照片是店家過往的實際餐點，不能保證同款配料今天還在菜單。

若已經連續幾天吃泰北咖哩麵或市場小吃，這裡提供另一種早餐選擇：麵包、蔬菜和蛋類餐點讓想吃得清爽一些的人有不同組合。點餐前可先看份量，因為開放式三明治看似輕食，實際可能是一整份正餐；兩人同行也可一份鹹食配一份甜食分享。麩質、蛋、乳製品或堅果過敏者應詢問每份餐點的組成，不要單看照片選菜。

尼曼區的咖啡店分散在巷弄，與 One Nimman、MAYA 商場或設計小店可串成半日散步路線，但午後日照強，最好只選幾個真正想停留的點。若住宿不在尼曼，早上叫車前來可先查餐廳是否正在營業，避免大老遠抵達卻遇到休息或候位。想在店內處理工作的人，也要先看現場座位與尖峰人潮，不把早午餐店當作保證有插座的共作空間。

實用的安排方式是先用餐，再慢慢走尼曼附近的選物店；若下午接機場或跨城交通，則要把候位與結帳時間保留得寬一些。季節菜單、飲品與營業時間會變動，價格也以店內公告為準。本文依可查的店家頁與實拍影像整理用餐情境，不宣稱親訪，更不把單一評論中的口味形容詞當成所有人的共識。`,
    review: "適合尼曼區慢節奏的早午餐；份量與候位時間先確認，照片中的餐點是過往實景，不代表現場固定供應。"
  },
  {
    slug: "pak-khlong-talat-bangkok", name: "Pak Khlong Talat 曼谷花市", citySlug: "bangkok", districtSlug: "old-city",
    category: "景點行程", subcategory: "市集／步行街", transitStationIds: ["mrt-sanam-chai"],
    mapQuery: "Pak Khlong Talat Flower Market Bangkok", researchSource: "https://www.thailandtravel.or.jp/pak-khlong-talat/",
    badges: ["鮮花市場", "老城散步", "沙南猜站"],
    description: `Pak Khlong Talat 是曼谷老城靠近昭披耶河的鮮花市場，泰國政府觀光局介紹這裡有花店、花環、蘭花與其他鮮切花，也混合蔬果攤。對台灣旅人而言，這裡值得看的不只是漂亮花束，而是供應寺廟、節慶和城市日常的花卉如何進出市場。Commons 實拍呈現市場內一束束鮮花與攤位，不是把別座城市的花店照片拿來替代。

從 MRT Sanam Chai 出發可與暹羅博物館、臥佛寺和河岸安排在同一趟老城散步；實際市場範圍並非單一入口，先在地圖上確認想走的那一側更有效率。花卉攤商以交易與補貨為主，旅人拍照時要留出推車和搬運動線；若想近拍攤主或商品，先詢問對方是否同意。走進市場的目的可以是看花與生活節奏，不必每到一攤都要求拍攝。

若要買花，先想清楚是要帶回住宿、送人，還是打算隨身拿著走完整天；曼谷高溫會讓鮮花較難保存，搭船、進餐廳與寺廟也未必方便攜帶大束花。價格可能依花材、數量、節慶與議價方式變動，零售和批發的報價不一定相同。小額購物可備現金，交易前先問清楚數量與是否已包裝，避免只看標示就推定含所有花材。

早晚不同時段的攤位、光線和物流情形會變，網路照片只能說明市場曾經的樣貌。若同一天要接著參觀寺廟，留意寺院的穿著規範；如果行程重點是花市，則不要把最熱的午間步行安排太長。本文依泰國觀光局與實景照片整理，不虛構個別花商的評價，也不承諾特定花款每天都能買到。`,
    review: "適合觀察曼谷鮮花交易與老城街景；攝影要尊重攤商和搬運動線，買花前想好後續如何攜帶。"
  },
  {
    slug: "khlong-toei-market-bangkok", name: "Khlong Toei Market 孔堤市場", citySlug: "bangkok", districtSlug: "khlong-toei",
    category: "景點行程", subcategory: "市集／步行街", transitStationIds: ["mrt-khlong-toei"],
    mapQuery: "Khlong Toei Market Bangkok", researchSource: "https://commons.wikimedia.org/wiki/Category:Khlong_Toei_Market",
    badges: ["生鮮市場", "在地採買", "孔堤站周邊"],
    description: `Khlong Toei Market 是曼谷孔堤區的生鮮市場，攤位、批發搬運與日常採買交錯，不是以紀念品和拍照佈景為主要目的的觀光市集。Commons 有市場本身的影像，可看到通道與攤商的真實尺度。對住在曼谷較長時間、對泰國食材或城市供應鏈感興趣的人，這裡能提供與百貨美食街完全不同的觀察角度；短程旅行者則應先判斷自己是否真的想看生鮮交易。

市場裡可能有濕滑地面、搬運車和氣味較重的區域，穿防滑鞋比漂亮但不好走的鞋更實用。生鮮攤位在工作，請不要阻擋通道、隨意觸碰食材，或未經同意拍攝攤主特寫。看到活體或肉類販售也可能與一般台灣傳統市場不同；帶小孩或對這類環境敏感的旅人，可以先在外圍走一小段，再決定是否深入。

附近有 MRT Khlong Toei 與 Queen Sirikit National Convention Centre 等藍線車站，但市場出入口分散，哪一站步行最方便取決於你要去的攤區。若從會議中心或班嘉奇蒂公園過來，請用即時地圖確認路口與步行距離，勿僅看站名想像市場就在出口旁。曼谷白天炎熱，早一點到訪通常比較適合觀察採買，雨天則要留心積水及拖車行進。

如果要買水果、乾貨或食材，先問清楚單位、價格及是否方便帶回飯店；需要冷藏的東西不適合長時間暴露在室外。市場不是統一管理的一家店，各攤收款方式和營業時間都不同，無法用一個時間代表所有攤位。本文依市場實景與交通位置整理，沒有捏造評論分數或推薦某個未查核的攤商；造訪前請依自身對傳統市場的接受度安排。`,
    review: "這是運作中的生鮮市場，適合想看城市日常與食材的人；鞋子、衛生及攝影禮貌比打卡角度重要。"
  },
  {
    slug: "sampeng-lane-market-bangkok", name: "Sampeng Lane Market 三聘巷市場", citySlug: "bangkok", districtSlug: "yaowarat",
    category: "景點行程", subcategory: "市集／步行街", transitStationIds: ["mrt-wat-mangkon"],
    mapQuery: "Sampeng Lane Market Bangkok", researchSource: "https://www.thailandtravel.or.jp/sampeng-lane-market/",
    badges: ["唐人街採買", "窄巷市場", "小物布料"],
    description: `Sampeng Lane Market 位於曼谷唐人街的巷道網絡裡，與耀華力大道上以夜間餐飲為主的印象不同，這裡更像一段接一段的批零採買街。泰國政府觀光局將它列為三聘市場，Commons 實景則能看到狹窄通道、布料與雜貨的街區尺度。對想買小物、布料或觀察曼谷華人商業街的人，這裡的趣味來自慢慢看攤、比較商品，而非單一地標。

巷子窄，行人、推車與店家出貨常共享路面。背包和相機不要撞到貨架，看到想拍的布料或店面先確認是否可以拍攝；若只是拍完就走，也要避免站在門口阻擋買家。不同攤位有零售與批發的價格區別，詢價時先問最少購買數量，別把較低的批發價當成一件就能買的價格。現金、找零和收據規則因店而異，可備小額鈔票。

從 MRT Wat Mangkon 往市場步行，沿途會經過耀華力、寺廟與小吃攤。市場不是方正的一棟建築，建議先決定從哪個方向進、要在哪個路口離開，避免在熱天拖著行李來回折返。想接龍蓮寺或晚餐行程時，可把採買放在白天、吃飯留到晚上；各店的開關門時間不一致，夜間的三聘巷也未必和白天同樣熱鬧。

物品若要帶回台灣，請留意航空公司重量與海關限制；液體、食品與仿冒品的規定不能只聽攤位說法。若對商品材質、尺寸或退換貨有要求，付款前先檢查並確認條件。本文依觀光局與市場實拍資料整理，沒有把整條巷子的體驗硬套給每一位攤商；實際價格、供貨和人流仍會改變。`,
    review: "適合在唐人街白天逛布料與小物；巷道窄，先規劃進出方向，詢價時確認零售與批發條件。"
  },
  {
    slug: "chiang-mai-night-bazaar", name: "Chiang Mai Night Bazaar 清邁夜市", citySlug: "chiang-mai", districtSlug: "night-bazaar",
    category: "景點行程", subcategory: "市集／步行街", transitStationIds: [],
    mapQuery: "Chiang Mai Night Bazaar Chang Klan Road", researchSource: "https://www.thailandtravel.or.jp/chiang-mai-night-bazaar/",
    badges: ["長康路夜市", "晚間散步", "伴手禮採買"],
    description: `Chiang Mai Night Bazaar 沿著清邁長康路及周邊街區展開，是傍晚以後找餐食、手工品與伴手禮的常見落腳點。泰國政府觀光局把它列為清邁代表性夜市之一，Commons 的夜間實景也顯示它屬街道型市集，而非一個統一入口的百貨商場。對第一次到清邁的人，這裡容易與飯店、晚餐行程結合；但也因範圍分散，先選一段路線會比漫無目的地繞圈更舒服。

攤商賣的東西從服飾、工藝品到食物各不相同，價格與品質沒有一個全市場通用標準。看到喜歡的手作物，可以先確認材質、尺寸和是否真由攤主製作；購買前想清楚行李空間，尤其竹木或易碎品不一定適合帶上飛機。食物攤的烹調及保存條件也各自不同，對腸胃敏感的人可選現做熱食，並向攤商詢問辣度與過敏原。

如果白天在古城或尼曼區活動，晚間到長康路可能需要搭車；不要把整個清邁市中心看作幾分鐘就能走完。夜市附近還有其他市場與商場，搜尋地址時請使用完整名稱和長康路，避免被帶到不同的週末市集。帶長輩或孩子時，可先約好集合點與回程叫車位置；人多時用訊息分享定位，比口頭說某個攤位名更清楚。

夜市的營業密度、表演與攤位排列會隨平日、週末、季節與天氣變動。照片只能代表拍攝當時的樣貌，不保證某個攤位一直在同一位置。這裡適合留一至兩小時吃晚餐和看市集，但若怕擁擠，可早一點去或縮短路線。本文依觀光局資料與實景照片整理，不聲稱走訪過每個攤位，也不對未核查的個別商家做排名。`,
    review: "適合晚上把晚餐與伴手禮採買一起完成；市場範圍長，先約定集合點與回程位置較實用。"
  },
  {
    slug: "warorot-market-chiang-mai", name: "Warorot Market 瓦洛洛市場", citySlug: "chiang-mai", districtSlug: "tha-pae",
    category: "景點行程", subcategory: "市集／步行街", transitStationIds: [],
    mapQuery: "Warorot Market 90 Wichayanon Road Chiang Mai", researchSource: "https://www.thailandtravel.or.jp/warorot-market/",
    badges: ["清邁在地市場", "泰北乾貨", "河畔採買"],
    description: `Warorot Market 又常被當地人稱為 Kad Luang，是清邁河西岸日常採買的重要市場。泰國政府觀光局介紹其歷史與多樓層格局，商品包括生鮮、衣物、北部食品與工藝品。Commons 照片拍到市場內的真實攤位與人流，呈現出與週末文創市集不同的密度；若想了解清邁居民平時買什麼、帶什麼回家，這裡比只逛觀光商店更有線索。

市場區域較大，初次造訪不需要急著看完每一層。可以先從乾貨和當地食品開始，沿路比較包裝、保存方式與是否能帶上飛機，再決定購買。若想買香腸、辣醬或含肉製品，務必先查台灣入境食品限制，不要以攤商說「很多旅客買」當作合法帶入的依據。散裝食品沒有完整標示時，過敏者要特別確認成分和保存條件。

瓦洛洛市場靠近 Ping River 與 Chang Moi 街區，從塔佩門一帶可規劃一段步行或短程搭車。若同一天想接清邁夜市，兩處是不同類型的市場，不必把行程硬排在同一時段；瓦洛洛偏向白天的採買節奏，長康路夜市則較適合晚間。清邁上午也會熱，進市場前可先決定回程交通，避免買了大包商品後才發現還要走很遠。

攤位之間可能有推車、摩托與進貨通道，拿相機時請勿站在狹窄出入口。市場裡的個別店家各有營業日與報價，官網所列市場時間只是整體參考。若要帶伴手禮，先比較包裝完整度、效期與重量。本文依泰國觀光局及市場實景整理，沒有把單一攤位的商品、價格或顧客評價說成整個市場的固定特色。`,
    review: "適合白天找泰北食品與觀察在地採買；買乾貨或伴手禮時，先確認效期、成分和入境台灣規定。"
  },
];

const venueDetails: Record<string, string> = {
  "nai-sow-bangkok": "若把這餐排在唐人街行程，建議先決定要吃合菜還是邊走邊吃。兩種方式各有樂趣，但合菜需要坐下、點菜和結帳的完整時間，別把它塞在轉車空檔。",
  "rongros-bangkok": "帶相機的人可先看看白天與傍晚各自想拍什麼：寺廟的建築輪廓在不同光線下差異很大；若主要目的是用餐，則應把取景需求排在同行者的用餐節奏之後。",
  "singapore-pochana-yaowarat": "泰文店名中的 ลอดช่อง 指的是粉條類甜品，若不熟悉發音，可以把完整英文店名與地圖頁顯示給司機或同行者看。不要只說 Singapore，否則很可能被理解成目的地或其他店名。",
  "blue-by-alain-ducasse-bangkok": "晚餐前若已在 ICONSIAM 逛了很久，記得保留更衣和休息時間；精緻餐飲通常不是帶著大包戰利品匆忙入座的行程。若有重要紀念安排，事先告知店家比臨場提出需求更有機會協調。",
  "hanaya-1976-bangkok": "對想比較曼谷不同日式餐館的人，可先看它的老派用餐氣氛與菜式組合，再決定是否符合旅伴口味；不是所有人都想在泰國吃日本料理，但對長住或商務行程，它有實際的換口味用途。",
  "octave-rooftop-lounge-bangkok": "高樓戶外音樂與風聲可能讓交談比較費力，若要談重要事情，可以問室內或較安靜的座位；若主要目的是拍夜景，則可先確認是否允許腳架與大型攝影器材。",
  "red-sky-bangkok": "若今晚還要參加附近百貨的活動，先看活動散場時間；CentralWorld 一帶在跨年與大型節慶可能有道路管制，從餐廳回飯店的車程會和平日差很多。",
  "shake-shack-one-bangkok": "從公園走進商場的旅人可能會想先補水，這時可把餐點份量和接下來行程一起考慮。若晚間有正式訂位，這家更適合午餐或下午的輕鬆用餐。",
  "cafe-amazon-hua-lamphong": "若是等火車或跨城交通，先以票面時間倒推離店時間，再考慮是否點需要現做較久的飲品。華喃峰周邊交通方式多，咖啡店應是緩衝點，不能代替確認月台或車站公告。",
  "cafe-amazon-iconsiam": "若同行者分頭逛街，可以在見面前傳送門市當下的樓層照片或商場定位。這比只傳一張數年前的網路門市照更可靠，因為櫃位可能調整。",
  "praya-dining-bangkok": "若有人不搭船，可在出發前與飯店討論替代路線是否可行；不宜到碼頭才臨時詢問。訂位者也應保留店家的電話或電子郵件，以便遇到雨勢或交通延誤時即時聯絡。",
  "anchan-vegetarian-chiang-mai": "若同行旅伴吃素的標準不同，先把可接受的蛋、奶與五辛範圍說清楚，點餐時才不會各自理解不同。對清邁北部料理有興趣的人，也可觀察蔬食如何運用在地香草。",
  "pak-khlong-talat-bangkok": "想看花材交易的人，可以先從市場外圍觀察攤位配置，再慢慢進入主要通道；大量花束的顏色很吸引鏡頭，但工作中的商販需要通行空間。若只是想買一小束，直接告知預算與用途較有效率。",
  "sampeng-lane-market-bangkok": "這條市場巷弄適合有明確採買目標的人，例如布料、包材或小配件；若只是想看街景，走到擁擠處便可折返，不必以走完整條巷子作為完成旅行的指標。",
  "warorot-market-chiang-mai": "想認識清邁的市場文化，可把生鮮、乾貨與周邊花市分開觀察，不用在同一攤買齊所有東西。找北部特產時也可請店家說明保存與食用方式，再決定是否適合送禮。"
};

const photos = photoCatalog as Record<string, { source: string; artist: string; license: string }>;

export const thailandTwentyResearchSources = Object.fromEntries(entries.map(entry => [entry.slug, entry.researchSource]));

export const thailandTwentyBusinesses: DirectoryBusiness[] = entries.map(entry => {
  const photo = photos[entry.slug];
  if (!photo) throw new Error(`Missing Thai business photo metadata: ${entry.slug}`);
  return {
    slug: entry.slug,
    name: entry.name,
    country: "thailand",
    citySlug: entry.citySlug,
    districtSlug: entry.districtSlug,
    category: entry.category,
    subcategory: entry.subcategory,
    description: [entry.description, venueDetails[entry.slug]].filter(Boolean).join("\n\n"),
    review: entry.review,
    badges: entry.badges,
    transitStationIds: entry.transitStationIds,
    googleMapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(entry.mapQuery)}`,
    image: `/media/thailand/new-20/${entry.slug}.webp`,
    imageSource: photo.source,
    imageCredit: `${photo.artist} / ${photo.license}；圖片已裁切、縮圖`,
    socials: { website: entry.website, phone: entry.phone },
    isActive: true,
    plan: "free",
    updatedAt: "2026-10-23"
  };
});
