import { ArticleCategory } from "@/lib/types";

export const articleCategoryAssets: Record<ArticleCategory, { image: string; alt: string; intro: string }> = {
  旅遊攻略: {
    image: "/brand-assets/home-hero-vietthai-commerce.png",
    alt: "越南與泰國城市旅遊攻略圖片",
    intro: "整理交通、住宿、季節與路線，幫讀者快速規劃可執行的行程。"
  },
  旅遊須知: {
    image: "/cities/da-nang.webp",
    alt: "越南與泰國旅遊須知擬真示意圖",
    intro: "整理簽證、入境、天氣、用電與出發前需要確認的資訊。"
  },
  餐廳美食: {
    image: "/brand-assets/home-business-local-life.png",
    alt: "越南與泰國餐廳美食圖片",
    intro: "從商圈、評價、餐點特色與用餐情境切入，提供實用的選店參考。"
  },
  景點行程: {
    image: "/brand-assets/vietthai-compass-article-cover-hero.png",
    alt: "越南與泰國景點行程圖片",
    intro: "把景點順路性、停留時間與交通方式整理成可直接使用的行程。"
  },
  在地生活: {
    image: "/brand-assets/home-seo-engine-visual.png",
    alt: "越南與泰國在地生活圖片",
    intro: "用生活圈、消費、租屋、工作與社群角度，理解城市日常。"
  },
  台商專區: {
    image: "/brand-assets/home-business-local-life.png",
    alt: "越南與泰國台商專區圖片",
    intro: "聚焦台商曝光、品牌行銷、在地合作與商家導流需求。"
  },
  節慶活動: {
    image: "/cities/chiang-mai.webp",
    alt: "越南與泰國節慶活動街景",
    intro: "整理各地節慶日期、活動亮點、參與方式與行前提醒。"
  },
  新聞快訊: {
    image: "/cities/ho-chi-minh.webp",
    alt: "越南城市新聞快訊",
    intro: "追蹤影響旅遊與在地生活的重要公告、政策與即時消息。"
  },
  交通航線: {
    image: "/cities/bangkok.webp",
    alt: "泰國城市交通與航線資訊",
    intro: "整理國際航班、城市交通、轉乘方式與實用票務資訊。"
  }
};

export const sectionCategoryAssets = [
  {
    title: "城市指南",
    href: "/cities",
    image: "/brand-assets/home-hero-vietthai-commerce.png",
    alt: "越南與泰國城市指南圖片",
    intro: "依城市、區域與生活圈整理旅遊與商務資訊。"
  },
  {
    title: "餐廳美食",
    href: "/restaurants",
    image: "/brand-assets/home-business-local-life.png",
    alt: "越南與泰國餐廳美食圖片",
    intro: "依城市與分區收錄餐廳、咖啡廳與在地美食。"
  },
  {
    title: "景點行程",
    href: "/attractions",
    image: "/brand-assets/vietthai-compass-article-cover-hero.png",
    alt: "越南與泰國景點行程圖片",
    intro: "把景點與路線拆成半日、一日與多日行程。"
  },
  {
    title: "在地生活",
    href: "/local-life",
    image: "/brand-assets/home-seo-engine-visual.png",
    alt: "越南與泰國在地生活圖片",
    intro: "整理租屋、生活圈、交通、社群與長住資訊。"
  },
  {
    title: "台商專區",
    href: "/taiwan-business",
    image: "/brand-assets/home-business-local-life.png",
    alt: "越南與泰國台商專區圖片",
    intro: "提供商家曝光、內容行銷與在地合作入口。"
  },
  {
    title: "商家目錄",
    href: "/directory",
    image: "/brand-assets/home-hero-vietthai-commerce.png",
    alt: "越南與泰國商家目錄圖片",
    intro: "整理可查詢的在地商家、餐廳與服務名單。"
  }
];
