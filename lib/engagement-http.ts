import "server-only";
import { createHmac } from "crypto";
import { isIP } from "net";
import { getArticles, getBusinesses } from "./cms-store";
import { EngagementError, type ResourceRef } from "./engagement-policy";
import { siteUrl } from "./seo";

export function checkOrigin(request: Request) {
  const allowed = new Set([new URL(siteUrl).origin]);
  if (process.env.NODE_ENV !== "production") allowed.add(new URL(request.url).origin);
  if (!allowed.has(request.headers.get("origin") || "")) throw new EngagementError("請從本站送出。", 403);
}

export function visitorKey(request: Request, purpose: string) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new EngagementError("互動功能尚未完成安全設定。", 503);
  // Vercel overwrites this header; never trust arbitrary client-forwarded IPs.
  const ip = process.env.VERCEL
    ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0].trim()
    : process.env.NODE_ENV !== "production" ? "127.0.0.1" : undefined;
  if (!ip || !isIP(ip)) throw new EngagementError("無法驗證連線來源。", 503);
  return createHmac("sha256", secret).update(`${purpose}:${ip}`).digest("hex");
}

export async function requireResource(ref: ResourceRef) {
  const values = ref.kind === "article" ? await getArticles() : await getBusinesses();
  if (!values.some(item => item.slug === ref.slug)) throw new EngagementError("找不到這篇內容。", 404);
}

export async function boundedJson(request: Request) {
  if (!request.headers.get("content-type")?.startsWith("application/json")) throw new EngagementError("資料格式不正確。", 415);
  const reader = request.body?.getReader();
  if (!reader) throw new EngagementError("缺少資料。");
  let size = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const { done,value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 16000) { await reader.cancel(); throw new EngagementError("內容過長。", 413); }
      chunks.push(value);
    }
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch (error) { if (error instanceof EngagementError) throw error; throw new EngagementError("資料格式不正確。"); }
}

export async function verifyTurnstile(token: string) {
  if (!token || !process.env.TURNSTILE_SECRET_KEY) throw new EngagementError("請完成人機驗證。");
  let result;
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST", headers: { "Content-Type": "application/json" }, cache: "no-store",
      signal: AbortSignal.timeout(8000),
      body: JSON.stringify({ secret: process.env.TURNSTILE_SECRET_KEY, response: token })
    });
    if (!response.ok) throw new Error("verification unavailable");
    result = await response.json();
  } catch { throw new EngagementError("驗證服務暫時無法使用，請稍後再試。", 503); }
  if (!result.success || result.hostname !== new URL(siteUrl).hostname || result.action !== "comment") {
    throw new EngagementError("驗證已失效，請重新驗證後送出。");
  }
}

export function errorResponse(error: unknown) {
  const status = error instanceof EngagementError ? error.status : 503;
  return Response.json({ error: error instanceof EngagementError ? error.message : "服務暫時無法使用，請稍後再試。" }, {
    status, headers: { "Cache-Control": "no-store", ...(status === 429 ? { "Retry-After": "60" } : {}) }
  });
}
