import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/Cards";
import { SiteShell } from "@/components/SiteShell";
import { siteSocials } from "@/data/site";

export const metadata: Metadata = {
  title: "商務合作與在地行銷服務",
  description: "越泰指南協助越南、泰國在地商家與台商建立中文 SEO 文章、商家頁、社群導流與合作曝光。",
  alternates: { canonical: "/business" }
};

const services = ["商家介紹頁", "SEO 專題文章", "在地採訪內容", "社群導流企劃", "Google 商家曝光", "合作活動頁"];

export default function BusinessPage() {
  return (
    <SiteShell>
      <section className="page-hero business-hero">
        <p className="eyebrow">Business Partnership</p>
        <h1>協助越南泰國在地商家取得中文市場曝光</h1>
        <p>如果你服務台灣旅客、台商、外派族群或中文客群，越泰指南可協助建立可搜尋、可轉換、可長期累積的內容資產。</p>
        <div className="hero-actions">
          <a className="secondary-button" href={siteSocials.line}>LINE 詢問</a>
          <a className="primary-button" href={`mailto:${siteSocials.email}`}>Email 合作 <ArrowRight size={18} /></a>
        </div>
      </section>

      <section className="band">
        <SectionHeader title="合作服務" intro="以 SEO 文章、商家名錄與社群連結建立曝光入口，讓搜尋流量更容易轉成合作詢問。" />
        <div className="grid three">
          {services.map((item) => (
            <div className="card" key={item}>
              <span className="pill">服務</span>
              <h3>{item}</h3>
              <p>依照商家類型、城市、目標客群與搜尋需求規劃內容，讓品牌被更精準的讀者找到。</p>
            </div>
          ))}
        </div>
      </section>

      <section className="band light">
        <SectionHeader title="合作詢問表單" intro="請留下必要資料，方便初步判斷你的市場、服務與曝光需求。" />
        <form className="panel inquiry-form">
          <div className="grid two">
            <label>
              <span>姓名 <b>必填</b></span>
              <input required name="name" placeholder="請輸入聯絡人姓名" />
            </label>
            <label>
              <span>公司 / 商家名稱 <b>必填</b></span>
              <input required name="company" placeholder="例如：曼谷餐廳、胡志明市服務商" />
            </label>
            <label>
              <span>所在國家或城市 <b>必填</b></span>
              <input required name="location" placeholder="例如：曼谷、胡志明市、峴港" />
            </label>
            <label>
              <span>Email <b>必填</b></span>
              <input required type="email" name="email" placeholder="name@example.com" />
            </label>
            <label>
              <span>LINE ID <em>選填</em></span>
              <input name="line" placeholder="方便快速聯絡" />
            </label>
            <label>
              <span>產業類型 <em>選填</em></span>
              <input name="industry" placeholder="餐廳、旅宿、行銷服務、生活服務" />
            </label>
          </div>
          <label>
            <span>想了解的服務 <b>必填</b></span>
            <select required name="service">
              <option value="">請選擇服務</option>
              <option>商家介紹頁</option>
              <option>SEO 專題文章</option>
              <option>在地採訪內容</option>
              <option>社群導流企劃</option>
              <option>整合曝光方案</option>
            </select>
          </label>
          <label>
            <span>補充說明 <em>選填</em></span>
            <textarea name="message" placeholder="可以描述你的商家、目標客群、希望曝光的城市或預算範圍" rows={5} />
          </label>
          <p className="form-note">送出前可先用 LINE 或 Email 聯繫；正式部署後可串接資料庫與通知信。</p>
          <Link className="primary-button" href={`mailto:${siteSocials.email}`}>使用 Email 聯絡</Link>
        </form>
      </section>
    </SiteShell>
  );
}
