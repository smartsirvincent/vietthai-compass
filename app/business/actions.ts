"use server";

import { createHmac } from "crypto";
import { headers } from "next/headers";
import { parseInquiry } from "@/lib/inquiry";
import { inquiryMailConfigured, sendInquiryMail } from "@/lib/inquiry-mail";
import { reserveInquiryAttempt } from "@/lib/cms-store";

export async function submitInquiry(data: FormData): Promise<{ ok: boolean; message: string }> {
  if (data.get("website")) return { ok: false, message: "無法送出，請重新整理後再試。" };
  let inquiry;
  try { inquiry = parseInquiry(data); }
  catch (error) { return { ok: false, message: (error as Error).message }; }
  if (!inquiryMailConfigured() || !process.env.AUTH_SECRET) return { ok: false, message: "表單暫時無法寄送，請直接寄信至 goodviet.service@gmail.com。" };
  try {
    const requestHeaders = await headers();
    const ip = (requestHeaders.get("x-vercel-forwarded-for") || requestHeaders.get("x-forwarded-for") || "unknown").split(",")[0].trim();
    const hash = createHmac("sha256", process.env.AUTH_SECRET).update(ip).digest("hex");
    if (!await reserveInquiryAttempt(hash)) return { ok: false, message: "送出次數過於頻繁，請稍後再試，或直接 Email 聯絡。" };
    await sendInquiryMail(inquiry);
    return { ok: true, message: "合作詢問已送出，謝謝你的聯繫！我們將透過你留下的聯絡方式回覆。" };
  } catch {
    // Do not log SMTP credentials or visitor contact details.
    return { ok: false, message: "無法確認寄送結果，請稍後再試或直接 Email 聯絡；你的填寫內容仍保留。" };
  }
}
