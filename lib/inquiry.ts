export const INQUIRY_RECIPIENT = "goodviet.service@gmail.com";
export const INQUIRY_SERVICES = ["商家介紹頁", "SEO 專題文章", "在地採訪內容", "社群導流企劃", "整合曝光方案"];

export function parseInquiry(data: FormData) {
  function field(key: string, max: number, required = false) {
    const raw = data.get(key);
    if (raw !== null && typeof raw !== "string") throw new Error("表單資料格式錯誤。");
    const value = (raw || "").trim();
    if ((required && !value) || value.length > max) throw new Error("請完整填寫必填欄位，並確認內容未超過長度限制。");
    return value;
  }
  const inquiry = {
    name: field("name", 100, true), company: field("company", 200, true),
    location: field("location", 100, true), email: field("email", 254, true),
    line: field("line", 100), industry: field("industry", 100),
    service: field("service", 100, true), message: field("message", 5000)
  };
  if (!/^[^\s<>@,;]+@[^\s<>@,;]+\.[^\s<>@,;]+$/.test(inquiry.email)) throw new Error("請填寫有效的 Email。");
  if (!INQUIRY_SERVICES.includes(inquiry.service)) throw new Error("請選擇有效的合作服務。");
  return inquiry;
}

export function inquiryText(inquiry: ReturnType<typeof parseInquiry>) {
  return ["越泰指南收到新的合作詢問", "", `姓名：${inquiry.name}`, `公司 / 商家：${inquiry.company}`,
    `國家或城市：${inquiry.location}`, `Email：${inquiry.email}`, `LINE：${inquiry.line || "未填寫"}`,
    `產業：${inquiry.industry || "未填寫"}`, `服務：${inquiry.service}`, "", "補充說明：", inquiry.message || "未填寫"].join("\n");
}
