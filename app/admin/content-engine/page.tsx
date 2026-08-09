import { CheckCircle2 } from "lucide-react";
import { researchBriefs } from "@/data/site";
import { requireAdminRole } from "@/lib/admin-auth";

export const metadata = {
  title: "SEO 內容工作台"
};

const seoChecklist = [
  "SEO 標題是否包含主要城市與目標關鍵字",
  "Meta 描述是否清楚說明頁面價值",
  "是否有最後更新日期與人工審核狀態",
  "是否包含 FAQ 與可轉成結構化資料的內容",
  "是否連到相關城市、餐廳、景點、商家或商務合作頁",
  "圖片是否有可讀的 alt 文字",
  "價格、營業時間、地址、政策等易變資訊是否標記需要複查",
  "是否保留來源清單，方便日後更新"
];

export default async function ContentEnginePage() {
  await requireAdminRole();

  return (
    <>
      <p className="eyebrow">Codex SEO Engine</p>
      <h1>SEO 內容工作台</h1>
      <p>
        SEO 檢查、來源清單與審稿狀態應該放在後台。前台文章負責服務讀者，後台則負責讓內容可以被搜尋、
        被維護，並且適合由 Codex 協助研究與產生草稿。
      </p>

      <section className="panel">
        <h2>內容任務流程</h2>
        <div className="grid four">
          <div><span className="pill">1</span><h3>建立主題</h3><p>指定城市、關鍵字、搜尋意圖與受眾。</p></div>
          <div><span className="pill">2</span><h3>蒐集來源</h3><p>優先使用官方網站、公開商家頁、地圖與商會資訊。</p></div>
          <div><span className="pill">3</span><h3>產生草稿</h3><p>輸出標題、摘要、內文、FAQ、圖片需求與內部連結。</p></div>
          <div><span className="pill">4</span><h3>人工審核</h3><p>確認資訊正確性、商務表述與發布狀態。</p></div>
        </div>
      </section>

      <section className="panel" style={{ marginTop: 24 }}>
        <h2>後台 SEO 檢查清單</h2>
        <div className="checklist-grid">
          {seoChecklist.map((item) => (
            <div key={item}>
              <CheckCircle2 size={17} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel" style={{ marginTop: 24 }}>
        <h2>研究任務</h2>
        <div className="table-like">
          {researchBriefs.map((brief) => (
            <div className="research-card" key={brief.id}>
              <div>
                <strong>{brief.title}</strong>
                <p>{brief.audience}</p>
              </div>
              <div>
                <span className="muted-label">目標關鍵字</span>
                <p>{brief.targetKeyword}</p>
              </div>
              <div>
                <span className="muted-label">內容類型</span>
                <p>{brief.contentType}</p>
              </div>
              <span className="status">{brief.status}</span>
              <div className="research-checks">
                {brief.seoChecks.map((check) => (
                  <span key={check}>{check}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
