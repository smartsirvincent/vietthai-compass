import Link from "next/link";
import { requireAdminRole } from "@/lib/admin-auth";
import { getArticles, getBusinesses } from "@/lib/cms-store";
import { cleanupEngagement, engagementDatabase, turnstileConfigured } from "@/lib/engagement-store";
import { resourcePath, type ResourceKind } from "@/lib/engagement-policy";
import { AdminEditorForm } from "@/components/AdminEditorForm";
import { AdminSubmitButton } from "@/components/AdminSubmitButton";
import { updateEngagement } from "./actions";
import styles from "./page.module.css";

export const metadata = { title: "瀏覽數與留言管理" };
export const dynamic = "force-dynamic";
const statuses: Record<string,string> = { pending: "待審核", approved: "已公開", hidden: "已隱藏", spam: "垃圾留言" };

export default async function EngagementAdmin({ searchParams }: { searchParams: Promise<{ q?: string; kind?: string; status?: string; page?: string; saved?: string }> }) {
  await requireAdminRole();
  const filters = await searchParams;
  const q = (filters.q || "").slice(0,200);
  const status = Object.hasOwn(statuses, filters.status || "") ? filters.status! : "pending";
  const kind = ["article","business"].includes(filters.kind || "") ? filters.kind! : "";
  const page = Math.max(1, Math.min(10000, Number.parseInt(filters.page || "1") || 1));
  let pool;
  try { pool = await engagementDatabase(); await cleanupEngagement(); }
  catch { return <><h1>瀏覽數與留言管理</h1><p role="alert">無法連接互動資料庫，尚未變更設定。請確認 DATABASE_URL。</p></>; }
  const [articles,businesses,settings,stats,queue,total] = await Promise.all([
    getArticles(),getBusinesses(),pool.query("select enabled from vt_engagement.settings where id=true"),
    pool.query("select kind,slug,views::text,comments_enabled from vt_engagement.pages"),
    pool.query(`select id,kind,slug,name,body,status,created_at from vt_engagement.comments
      where status=$1 and ($2='' or kind=$2) and ($3='' or strpos(lower(name||' '||body||' '||slug),lower($3))>0)
      order by created_at desc,id limit 30 offset $4`, [status,kind,q,(page-1)*30]),
    pool.query(`select count(*)::int as count from vt_engagement.comments
      where status=$1 and ($2='' or kind=$2) and ($3='' or strpos(lower(name||' '||body||' '||slug),lower($3))>0)`,[status,kind,q])
  ]);
  const statMap = new Map(stats.rows.map(row => [`${row.kind}:${row.slug}`,row]));
  const resources = [
    ...articles.map(item => ({ kind: "article" as ResourceKind, slug: item.slug, title: item.title })),
    ...businesses.map(item => ({ kind: "business" as ResourceKind, slug: item.slug, title: item.name }))
  ];
  const titles = new Map(resources.map(item => [`${item.kind}:${item.slug}`,item.title]));
  const filtered = resources.filter(item => (!kind || kind===item.kind) && `${item.title} ${item.slug}`.toLowerCase().includes(q.toLowerCase()));
  const keepFilters = <><input type="hidden" name="filter_q" value={q} /><input type="hidden" name="filter_kind" value={kind} /><input type="hidden" name="filter_status" value={status} /></>;
  const linkPage = (number: number) => `/admin/engagement?${new URLSearchParams({ q,kind,status,page:String(number) })}`;
  return <>
    <h1>瀏覽數與留言管理</h1>
    {filters.saved ? <p role="status" className="admin-success">已完成更新。</p> : null}
    <p>瀏覽數從啟用日起累計，同一網路來源同日同頁計一次，不回填歷史流量。留言全部先審核後公開，僅 admin 可管理。</p>
    <p>防機器人驗證：{turnstileConfigured() ? "已設定（開放前請實際測試）" : "尚未設定，投稿保持關閉"}。關閉投稿不刪除既有留言；要停止顯示某則留言，請設為「已隱藏」。</p>
    {!turnstileConfigured() ? <p>請在 Vercel 設定 TURNSTILE_SITE_KEY、TURNSTILE_SECRET_KEY 與 AUTH_SECRET，Turnstile 允許的網域設為 vietthaiguide.com，再重新部署。</p> : null}
    <AdminEditorForm key={`global-${settings.rows[0].enabled}`} action={updateEngagement} className={styles.controls}>
      {keepFilters}<input type="hidden" name="operation" value="global" />
      <label><input type="checkbox" name="enabled" defaultChecked={settings.rows[0].enabled} />全站接受新留言</label>
      <AdminSubmitButton idleLabel="儲存全站設定" />
    </AdminEditorForm>
    <form className={styles.controls} method="get">
      <label>搜尋<input name="q" defaultValue={q} placeholder="標題、商家、留言內容" /></label>
      <label>類型<select name="kind" defaultValue={kind}><option value="">全部</option><option value="article">文章</option><option value="business">商家</option></select></label>
      <label>留言狀態<select name="status" defaultValue={status}>{Object.entries(statuses).map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <button className="secondary-button" type="submit">篩選</button>
    </form>
    <h2>留言審核 · {total.rows[0].count} 則</h2>
    {!queue.rows.length ? <p>目前沒有符合條件的留言。</p> : null}
    {queue.rows.map(comment => <article key={comment.id} className={styles.comment}>
      <Link href={resourcePath(comment)} target="_blank" rel="noopener noreferrer">{titles.get(`${comment.kind}:${comment.slug}`) || comment.slug}</Link>
      <p><strong>{comment.name}</strong> · {new Date(comment.created_at).toLocaleString("zh-TW",{timeZone:"Asia/Taipei"})}</p>
      <p className={styles.body}>{comment.body}</p>
      <AdminEditorForm key={`${comment.id}-${comment.status}`} action={updateEngagement} className={styles.controls}>
        {keepFilters}<input type="hidden" name="operation" value="moderate" /><input type="hidden" name="id" value={comment.id} /><input type="hidden" name="previous" value={comment.status} />
        <label>審核結果<select name="status" defaultValue={comment.status}>{Object.entries(statuses).map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <AdminSubmitButton idleLabel="更新留言狀態" />
      </AdminEditorForm>
    </article>)}
    <nav className={styles.controls} aria-label="留言分頁">{page>1 ? <Link href={linkPage(page-1)}>上一頁</Link> : null}<span>第 {page} 頁</span>{page*30<total.rows[0].count ? <Link href={linkPage(page+1)}>下一頁</Link> : null}</nav>
    <h2>各頁瀏覽數與留言開關</h2>
    <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>內容</th><th>瀏覽數</th><th>單頁投稿設定</th></tr></thead><tbody>
      {filtered.map(item => { const state = statMap.get(`${item.kind}:${item.slug}`); return <tr key={`${item.kind}:${item.slug}`}>
        <td><small>{item.kind==="article" ? "文章" : "商家"}</small><br /><Link href={resourcePath(item)} target="_blank" rel="noopener noreferrer">{item.title}</Link></td>
        <td>{Number(state?.views || 0).toLocaleString("zh-TW")}</td>
        <td><AdminEditorForm key={`${item.kind}:${item.slug}:${state?.comments_enabled}`} action={updateEngagement} className={styles.controls}>
          {keepFilters}<input type="hidden" name="operation" value="page" /><input type="hidden" name="kind" value={item.kind} /><input type="hidden" name="slug" value={item.slug} />
          <label><input type="checkbox" name="enabled" defaultChecked={state?.comments_enabled ?? true} />允許投稿</label><AdminSubmitButton idleLabel="儲存" />
        </AdminEditorForm></td>
      </tr>; })}
    </tbody></table></div>
  </>;
}
