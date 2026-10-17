import Link from "next/link";
import { requireAdminRole } from "@/lib/admin-auth";
import { enrichThailandBusinesses, getBusinesses } from "@/lib/cms-store";
import { finishCmsEdit } from "@/lib/cms-actions";
import { AdminEditorForm } from "@/components/AdminEditorForm";
import { AdminSubmitButton } from "@/components/AdminSubmitButton";

async function applyBatch() {
  "use server";
  await requireAdminRole();
  return finishCmsEdit(async () => {
    const result = await enrichThailandBusinesses();
    const query = new URLSearchParams({ updated: String(result.updated), added: String(result.added), images: String(result.images), conflicts: result.conflicts.join(",") });
    return `/admin/thailand-update?${query}`;
  });
}

export default async function ThailandUpdate({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  await requireAdminRole();
  const result = await searchParams;
  const pendingPhotos = (await getBusinesses()).filter(business => business.country === "thailand" && (!business.image || business.image.includes("/brand-assets/")));
  return <section className="panel">
    <h1>泰國商家內容更新</h1>
    <p>補齊 45 家既有商家的介紹與照片，新增 20 個曼谷捷運沿線地點。僅修改泰國商家及必要的曼谷分區；不修改越南、文章或網站設定。</p>
    <p>已有人工作業的欄位會保留並列為衝突；重複執行不會新增重複商家。每次寫入均保存原始資料版本。</p>
    {result.updated !== undefined ? <div role="status"><h2>更新已完成</h2><p>既有商家更新 {result.updated} 家；新增 {result.added} 家；替換／新增照片 {result.images} 張。</p><p>未處理項目：{result.conflicts || "無"}</p></div> : null}
    <AdminEditorForm action={applyBatch}><AdminSubmitButton idleLabel="套用泰國內容更新" pendingLabel="備份並更新泰國資料中" /></AdminEditorForm>
    <h2>尚待取得授權照片：{pendingPhotos.length} 家</h2>
    <p>介紹已備妥，照片尚未確認再利用授權。前台不以網站示意圖冒充商家實景。</p>
    <ul>{pendingPhotos.map(business => <li key={business.slug}><Link href={`/admin/businesses?edit=${encodeURIComponent(business.slug)}`}>{business.name}</Link></li>)}</ul>
    <p><Link href="/admin/businesses">返回商家管理</Link> · <Link href="/cities/bangkok">查看曼谷指南</Link></p>
  </section>;
}
