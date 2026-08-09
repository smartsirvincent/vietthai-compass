import { NextRequest, NextResponse } from "next/server";

const cookieName = "vt_admin_session";

function bytesToHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(value: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(process.env.AUTH_SECRET || "local-development-secret"),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return bytesToHex(await crypto.subtle.sign("HMAC", key, encoder.encode(value)));
}

async function verifyAdminSession(raw?: string) {
  if (!raw) return null;
  const [payload, signature] = raw.split(".");
  if (!payload || !signature || signature.toLowerCase() !== (await sign(payload)).toLowerCase()) return null;

  try {
    const session = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))) as { exp?: number; role?: string };
    if (!session.exp || !session.role || Date.now() > session.exp) return null;
    return session;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin") || pathname === "/admin/login") {
    return NextResponse.next();
  }

  const session = await verifyAdminSession(request.cookies.get(cookieName)?.value);
  if (session) {
    if (session.role === "user" && !pathname.startsWith("/admin/articles")) {
      const articlesUrl = request.nextUrl.clone();
      articlesUrl.pathname = "/admin/articles";
      articlesUrl.search = "";
      return NextResponse.redirect(articlesUrl);
    }
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"]
};
