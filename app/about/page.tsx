import { SiteShell } from "@/components/SiteShell";
import { getSiteSettings } from "@/lib/cms-store";

export const metadata = { title: "關於我們與編輯原則", description: "了解越泰指南的內容範圍、資料來源、更新方式與更正聯絡管道。", alternates: { canonical: "/about" } };

export default async function AboutPage() {
  const settings = await getSiteSettings();
  return <SiteShell>
    <section className="page-hero"><p className="eyebrow">{settings.siteNameEn}</p><h1>關於{settings.siteName}</h1><p>為繁體中文讀者整理越南與泰國的城市、餐廳、景點、交通及在地生活資訊。</p></section>
    <section className="band light"><div className="article-body">
      <h2 id="editorial">編輯與資料來源</h2>
      <p>{settings.siteName}編輯部整理公開資訊與商家提供的資料。文章列出的資料來源可供讀者核對；沒有註明親訪的內容，不代表編輯曾實際到訪或使用該服務。商家評論整理也不等於本站的親身評分。</p>
      <h2>更新日期與資訊限制</h2>
      <p>內容更新日期表示本站紀錄的編修時間，不代表當日已重新查核每一項資訊。營業時間、票價、交通及入境規定可能變動，出發前請再次確認官方公告。舊文章的首次發布時間不確定時，不補填推測日期。</p>
      <h2>圖片與合作資訊</h2>
      <p>商家與城市照片請依頁面標示查看來源和授權。照片署名不代表可任意轉載。商業合作內容應明確標示合作關係，不應與獨立的旅遊資訊混淆。</p>
      <h2>更正與聯絡</h2>
      <p>若你發現店家資訊、交通說明或圖片來源有誤，請提供頁面網址與可供核對的資料。</p>
      {settings.contactEmail ? <p><a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a></p> : null}
    </div></section>
  </SiteShell>;
}
