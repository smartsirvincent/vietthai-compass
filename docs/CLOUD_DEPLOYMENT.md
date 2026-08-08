# 越泰指南雲端部署規劃

目前後台已具備文章、城市、商家管理頁，開發階段先使用 `data/cms-content.json` 儲存內容。

正式部署到雲端時，不建議長期使用 JSON 檔作為資料庫，因為多數雲端環境的檔案系統不適合保存後台編輯資料。

## 建議架構

- 前端與後台：Vercel 部署 Next.js
- 資料庫：Supabase Postgres、Neon Postgres 或 Vercel Postgres
- 圖片：Supabase Storage、Cloudflare R2 或 S3
- 表單通知：Email、LINE Notify 替代方案或 CRM webhook

## 需要搬到資料庫的內容

- articles
- cities
- businesses
- restaurants
- attractions
- inquiries
- media
- research_briefs
- content_drafts

## 下一階段開發

1. 加入正式登入權限
2. 把 `cms-store.ts` 從 JSON 儲存改成 Postgres 儲存
3. 加入圖片上傳
4. 合作詢問表單寫入資料庫
5. 新增餐廳與景點管理
6. 加入草稿、發布、下架狀態
7. 加入 Codex 研究任務與文章草稿管理
