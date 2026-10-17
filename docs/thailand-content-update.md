# 泰國商家內容批次更新（2026-10-17）

## 範圍與保護

- 45 家既有泰國商家介紹補至至少 500 字（不計空白），另新增 20 個曼谷捷運沿線商場、市場、博物館、古蹟與公園。
- 越南商家、越南城市、文章及網站設定不修改。
- 更新前以資料庫交易鎖定最新文件，保存完整舊版本；只修改明確列入的泰國欄位，不執行全庫預設值回填。
- 若介紹或照片與查核時不同，保留人工修改並回報衝突；重複執行不新增重複記錄。
- 後台入口：`/admin/thailand-update`，僅 admin 可執行。

## 素材與來源

- 36 張真實照片已下載、縮圖為 WebP，存於 `public/media/thailand/`。
- 每張照片的原始頁面、作者、CC 授權及授權網址列於 `data/thailand-business-images.json`；不是 AI 示意圖。
- 20 個新地點的官方／觀光機構來源與站點列於 `data/thailand-transit-additions.json`。
- 萱柏宮官網於查核日公告整修閉館，已在介紹首段及標籤註明，不能視為目前可入館。
- 既有已刊載的 15 家照片保持不變；本次不推定其既有授權狀態。

## 尚待取得授權照片

下列 14 家介紹已補寫，但未找到可確認再利用授權的對應實景照片；前台不再以原本網站示意圖冒充商家實景。需店家提供授權照片，或取得攝影者同意後再上傳。

- Hua Seng Hong Yaowarat
- Nai Ek Roll Noodle
- T&K Seafood Yaowarat
- Nai Mong Hoi Thod
- theCOMMONS Saladaeng
- Al Saray Silom
- J Avenue Thonglor
- Roast theCOMMONS Thonglor
- theCOMMONS Thonglor
- Luk Kai Thong EmQuartier
- Roast EmQuartier
- Savoey Terminal 21 Asok
- Health Land Asoke
- Cabbages & Condoms Asok

## 驗證

自動測試涵蓋字數、照片檔案與授權記錄、有效站點、越南資料不變、重複執行及人工編輯衝突保護。部署後另核對前台商家數、介紹、圖片載入及站點篩選。
