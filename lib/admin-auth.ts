import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

export type AdminRole = "admin" | "user";

const cookieName = "vt_admin_session";
const maxAgeSeconds = 60 * 60 * 12;

function authSecret() {
  return process.env.AUTH_SECRET || "local-development-secret";
}

function sign(value: string) {
  return createHmac("sha256", authSecret()).update(value).digest("hex");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function makeSession(username: string, role: AdminRole) {
  const payload = Buffer.from(JSON.stringify({ username, role, exp: Date.now() + maxAgeSeconds * 1000 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminSession(raw?: string) {
  if (!raw) return null;
  const [payload, signature] = raw.split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload))) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      username: string;
      role: AdminRole;
      exp: number;
    };
    if (!session.username || !session.role || Date.now() > session.exp) return null;
    return session;
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  return verifyAdminSession(cookieStore.get(cookieName)?.value);
}

export async function setAdminSession(username: string, role: AdminRole) {
  const cookieStore = await cookies();
  cookieStore.set(cookieName, makeSession(username, role), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: maxAgeSeconds,
    path: "/admin"
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(cookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/admin"
  });
}

export function validateAdminLogin(username: string, password: string): AdminRole | null {
  const accounts: Array<{ username?: string; password?: string; role: AdminRole }> = [
    { username: process.env.ADMIN_USERNAME, password: process.env.ADMIN_PASSWORD, role: "admin" },
    { username: process.env.USER_USERNAME, password: process.env.USER_PASSWORD, role: "user" }
  ];
  const matched = accounts.find((account) => account.username === username && account.password === password);
  return matched?.role || null;
}

export { cookieName };
