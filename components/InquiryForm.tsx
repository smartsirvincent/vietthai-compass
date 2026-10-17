"use client";

import { useState, type ReactNode, type FormEvent } from "react";
import { Send } from "lucide-react";
import { submitInquiry } from "@/app/business/actions";

export function InquiryForm({ children, enabled }: { children: ReactNode; enabled: boolean }) {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string }>();
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || result?.ok) return;
    const data = new FormData(event.currentTarget);
    setPending(true);
    setResult(undefined);
    try { setResult(await submitInquiry(data)); }
    catch { setResult({ ok: false, message: "連線中斷，無法確認寄送結果。填寫內容已保留，請稍後再試。" }); }
    finally { setPending(false); }
  }
  return <form className="panel inquiry-form" onSubmit={submit}>
    <fieldset disabled={pending || result?.ok} style={{ border: 0, padding: 0, margin: 0, minWidth: 0, display: "contents" }}>
      {children}
      <label hidden aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <p className="form-note">送出即表示同意將上述資料用於回覆本次合作詢問。</p>
      <button type="submit" className={`primary-button admin-submit-button${pending ? " is-pending" : ""}`} disabled={!enabled || pending || result?.ok}>
        <Send size={18} />{pending ? "寄送中…" : result?.ok ? "已送出" : "送出合作詢問"}
      </button>
    </fieldset>
    {!enabled ? <p role="status">表單暫時無法寄送，請直接 Email 聯絡。</p> : null}
    {result ? <p role={result.ok ? "status" : "alert"}>{result.message}</p> : null}
    <a href="mailto:goodviet.service@gmail.com">goodviet.service@gmail.com</a>
  </form>;
}
