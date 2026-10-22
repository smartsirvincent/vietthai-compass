export type ResourceKind = "article" | "business";
export type ResourceRef = { kind: ResourceKind; slug: string };

export class EngagementError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}

export function parseResource(value: unknown): ResourceRef {
  const item = value as Partial<ResourceRef> | null;
  if (!item || !["article", "business"].includes(item.kind || "") || typeof item.slug !== "string" ||
      !item.slug.trim() || item.slug.length > 240 || /[\x00-\x1f/\\?#]/.test(item.slug)) {
    throw new EngagementError("內容網址不正確。");
  }
  return { kind: item.kind as ResourceKind, slug: item.slug };
}

export function parseComment(value: unknown) {
  const item = value as Record<string, unknown> | null;
  if (!item || typeof item.name !== "string" || typeof item.body !== "string" ||
      typeof item.token !== "string" || item.token.length > 2048 || item.website) {
    throw new EngagementError("留言資料不正確。");
  }
  const name = item.name.trim().normalize("NFKC");
  const body = item.body.trim().normalize("NFKC");
  if (name.length < 1 || name.length > 40 || body.length < 10 || body.length > 2000) {
    throw new EngagementError("暱稱限 1–40 字，留言限 10–2,000 字。");
  }
  if (/[<>\x00-\x08\x0b\x0c\x0e-\x1f]/.test(name + body) || /https?:|www\.|[\w-]+\.(com|net|org|io|tw)\b/i.test(name + body)) {
    throw new EngagementError("留言不接受 HTML 或網址，請以純文字分享。");
  }
  return { name, body, token: item.token };
}

export function resourcePath(ref: ResourceRef) {
  return `/${ref.kind === "article" ? "articles" : "directory"}/${encodeURIComponent(ref.slug)}`;
}

export function isAutomatedAgent(agent: string) {
  return !agent || /bot|crawler|spider|preview|headless|curl|wget|python/i.test(agent);
}
