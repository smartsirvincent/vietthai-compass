"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminRole } from "@/lib/admin-auth";
import { EngagementError, parseResource } from "@/lib/engagement-policy";
import { engagementDatabase, turnstileConfigured } from "@/lib/engagement-store";
import { requireResource } from "@/lib/engagement-http";

export async function updateEngagement(form: FormData) {
  const session = await requireAdminRole();
  try {
    const pool = await engagementDatabase();
    const action = form.get("operation");
    if (action === "global") {
      const enabled = form.get("enabled") === "on";
      if (enabled && !turnstileConfigured()) throw new EngagementError("請先在 Vercel 設定 TURNSTILE_SITE_KEY、TURNSTILE_SECRET_KEY 與 AUTH_SECRET，再重新部署。");
      await pool.query("update vt_engagement.settings set enabled=$1 where id=true", [enabled]);
    } else if (action === "page") {
      const ref = parseResource({ kind: form.get("kind"), slug: form.get("slug") });
      await requireResource(ref);
      await pool.query(`insert into vt_engagement.pages(kind,slug,comments_enabled) values($1,$2,$3)
        on conflict(kind,slug) do update set comments_enabled=excluded.comments_enabled`, [ref.kind,ref.slug,form.get("enabled") === "on"]);
    } else if (action === "moderate") {
      const status = String(form.get("status"));
      const id = String(form.get("id"));
      const previous = String(form.get("previous"));
      if (!/^[0-9a-f-]{36}$/.test(id) || !["approved","hidden","spam","pending"].includes(status)) throw new EngagementError("操作不正確。");
      const result = await pool.query(`update vt_engagement.comments set status=$1,moderated_at=now(),moderated_by=$2
        where id=$3 and status=$4 returning id`, [status,session.username,id,previous]);
      if (!result.rowCount) throw new EngagementError("留言狀態已被更新，請重新載入後再試。");
    } else throw new EngagementError("操作不正確。");
  } catch (error) {
    return { error: error instanceof EngagementError ? error.message : "尚未儲存，請檢查雲端資料庫連線後再試。" };
  }
  revalidatePath("/admin/engagement");
  const params = new URLSearchParams({ saved: "1" });
  for (const key of ["q", "kind", "status"]) {
    const value = form.get(`filter_${key}`);
    if (typeof value === "string" && value.length <= 200) params.set(key, value);
  }
  redirect(`/admin/engagement?${params}`);
}
