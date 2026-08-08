import { ArticleCategory } from "@/lib/types";

export const articleCategoryAssets: Record<ArticleCategory, { image: string; alt: string; intro: string }> = {
  旅遊攻略: {
    image: "/brand-assets/home-hero-vietthai-commerce.png",
    alt: "越南與泰國城市旅遊攻略圖片",
    intro: "整理交通、住宿、季節與路線，幫讀者快速規劃可執行的行程。"
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
