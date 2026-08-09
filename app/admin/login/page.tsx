import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession, setAdminSession, validateAdminLogin } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "後台登入｜越泰指南",
  robots: {
    index: false,
    follow: false
  }
};

async function loginAction(formData: FormData) {
  "use server";
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");
  const nextPath = String(formData.get("next") || "/admin");
  const role = validateAdminLogin(username, password);

  if (!role) {
    redirect(`/admin/login?error=1&next=${encodeURIComponent(nextPath)}`);
  }

  await setAdminSession(username, role);
  redirect(nextPath.startsWith("/admin") ? nextPath : "/admin");
}

export default async function AdminLoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  const session = await getAdminSession();
  if (session) redirect(params.next || "/admin");

  return (
    <main className="login-page">
      <section className="login-card">
        <span className="brand-mark admin-brand-mark" aria-hidden="true">VT</span>
        <p className="eyebrow">VietThai Compass</p>
        <h1>後台登入</h1>
        <p>請使用管理員或編輯者帳號登入後台。</p>
        {params.error ? <div className="login-error">帳號或密碼不正確，請重新輸入。</div> : null}
        <form action={loginAction} className="admin-form">
          <input type="hidden" name="next" value={params.next || "/admin"} />
          <label>帳號<input name="username" required autoComplete="username" /></label>
          <label>密碼<input name="password" required type="password" autoComplete="current-password" /></label>
          <button className="primary-button" type="submit">登入</button>
        </form>
      </section>
    </main>
  );
}
