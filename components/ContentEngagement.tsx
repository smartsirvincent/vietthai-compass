"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Script from "next/script";
import { Eye, MessageSquare } from "lucide-react";
import type { ResourceKind } from "@/lib/engagement-policy";
import styles from "./ContentEngagement.module.css";

type Comment = { id: string; name: string; body: string; created_at: string };
type Engagement = { views: number; enabled: boolean; siteKey?: string; comments: Comment[]; hasMore: boolean };
declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: Record<string, unknown>) => string;
      remove: (id: string) => void;
      reset: (id: string) => void;
    };
  }
}

export function ContentEngagement({ kind, slug }: { kind: ResourceKind; slug: string }) {
  const [data, setData] = useState<Engagement>();
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);
  const [morePending, setMorePending] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const [token, setToken] = useState("");
  const captcha = useRef<HTMLDivElement>(null);
  const widget = useRef<string | undefined>(undefined);
  const query = new URLSearchParams({ kind, slug }).toString();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch("/api/engagement", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind, slug }) });
        if (!response.ok) throw new Error();
        const value = await response.json();
        if (!cancelled) { setData(value); setError(""); }
      } catch { if (!cancelled) setError("瀏覽數與留言暫時無法載入。"); }
    }
    load();
    return () => { cancelled = true; };
  }, [kind, slug]);

  useEffect(() => {
    if (!scriptReady || !formOpen || !data?.siteKey || !captcha.current || !window.turnstile) return;
    widget.current = window.turnstile.render(captcha.current, {
      sitekey: data.siteKey, action: "comment", language: "zh-tw", size: "flexible",
      callback: (value: string) => setToken(value),
      "expired-callback": () => setToken(""),
      "error-callback": () => { setToken(""); setError("驗證暫時無法使用，請稍後再試。"); }
    });
    return () => { if (widget.current) window.turnstile?.remove(widget.current); widget.current = undefined; };
  }, [scriptReady, formOpen, data?.siteKey]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || !token) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    setPending(true); setError(""); setNotice("");
    try {
      const response = await fetch("/api/comments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        kind, slug, name: fields.get("name"), body: fields.get("body"), website: fields.get("website"), token
      }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setNotice(result.message); form.reset();
    } catch (err) { setError(err instanceof Error ? err.message : "送出失敗，請稍後再試。"); }
    finally { setPending(false); setToken(""); if (widget.current) window.turnstile?.reset(widget.current); }
  }

  async function loadMore() {
    if (!data || morePending) return;
    setMorePending(true); setError("");
    try {
      const response = await fetch(`/api/engagement?${query}&offset=${data.comments.length}`);
      if (!response.ok) throw new Error();
      const value: Engagement = await response.json();
      setData({ ...value, comments: [...data.comments, ...value.comments.filter(comment => !data.comments.some(existing => existing.id === comment.id))] });
    } catch { setError("無法載入更多留言，請稍後再試。"); }
    finally { setMorePending(false); }
  }

  return <section className={styles.section} aria-label="瀏覽數與讀者留言">
    <div className={styles.heading}><h2><MessageSquare size={22} aria-hidden="true" />讀者留言</h2>
      <span className={styles.views} title="功能啟用後累計；同一網路來源同日同頁僅計一次，非精確訪客人數。"><Eye size={18} aria-hidden="true" />瀏覽數 {data ? data.views.toLocaleString("zh-TW") : "—"}</span></div>
    {error ? <p role="alert" className={styles.error}>{error}</p> : null}
    {data?.comments.map(comment => <article key={comment.id} className={styles.comment}>
      <header><strong>{comment.name}</strong><time dateTime={comment.created_at}>{new Date(comment.created_at).toLocaleDateString("zh-TW", { timeZone: "Asia/Taipei" })}</time></header>
      <p>{comment.body}</p>
    </article>)}
    {data?.hasMore ? <button className="secondary-button" onClick={loadMore} disabled={morePending}>{morePending ? "載入中…" : "更多留言"}</button> : null}
    {data?.enabled ? <>
      {!data.comments.length ? <p>還沒有留言，分享你的經驗吧。</p> : null}
      {!formOpen ? <button className="secondary-button" onClick={() => setFormOpen(true)}>撰寫留言</button> : <>
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" onReady={() => setScriptReady(true)} onError={() => setError("驗證服務無法載入，請重新整理或稍後再試。")} />
        <form onSubmit={submit} className={styles.form}>
          <label>暱稱（必填）<input name="name" required minLength={1} maxLength={40} autoComplete="nickname" disabled={pending} /></label>
          <label>留言（必填）<textarea name="body" required minLength={10} maxLength={2000} rows={5} disabled={pending} /></label>
          <div className={styles.trap} aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
          <p className={styles.note}>留言限 10–2,000 字，審核後公開。請勿填寫電話、Email 或其他個人資料；不接受廣告、網址與 HTML。</p>
          <p className={styles.note}>使用 Cloudflare Turnstile 防止濫用，並以短期匿名來源識別碼限制重複投稿。</p>
          <div ref={captcha} />
          <button className="primary-button" disabled={pending || !token} type="submit">{pending ? "送出中…" : "送出留言"}</button>
        </form>
      </>}
    </> : data ? <p className={styles.note}>目前暫停接受新留言。</p> : null}
    <p role="status" className={styles.notice}>{notice}</p>
  </section>;
}
