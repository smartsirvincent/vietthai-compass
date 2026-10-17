import Link from "next/link";
import { requireAdminRole } from "@/lib/admin-auth";
import { enrichThailandBusinesses, getBusinesses, disableThailandBusinessesWithoutPhotos, repairCityPhotos, importChiangMaiBusinesses } from "@/lib/cms-store";
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

async function addChiangMai() {
  "use server";
  await requireAdminRole();
  return finishCmsEdit(async () => {
    const result = await importChiangMaiBusinesses();
    return `/admin/thailand-update?chiangMaiAdded=${result.added.length}&chiangMaiSkipped=${result.skipped.length}&districts=${result.districts}`;
  });
}

async function disableMissingPhotos() {
  "use server";
  await requireAdminRole();
  return finishCmsEdit(async () => {
    const count = await disableThailandBusinessesWithoutPhotos();
    return `/admin/thailand-update?disabled=${count}`;
  });
}

async function updateCityPhotos() {
  "use server";
  await requireAdminRole();
  return finishCmsEdit(async () => `/admin/thailand-update?cityPhotos=${await repairCityPhotos()}`);
}

export default async function ThailandUpdate({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  await requireAdminRole();
  const result = await searchParams;
  const pendingPhotos = (await getBusinesses(true)).filter(business => business.country === "thailand" && (!business.image || business.image.includes("/brand-assets/")));
  return <section className="panel">
    <h1>泰國商家內容更新</h1>
    <h2>清邁街區地圖與 30 家餐飲店</h2>
    <p>新增 25 家餐廳與小吃、5 家咖啡廳，介紹均至少 500 個中文字，附真實圖片來源與 Google Maps。只補清邁分區與新商家；保留既有商家、停用狀態及所有越南資料。</p>
    {result.chiangMaiAdded !== undefined ? <p role="status">清邁匯入完成：新增 {result.chiangMaiAdded} 家，已存在略過 {result.chiangMaiSkipped} 家，新增 {result.districts} 個分區。</p> : null}
    <AdminEditorForm action={addChiangMai}><AdminSubmitButton idleLabel="匯入清邁 30 家商家" pendingLabel="備份並匯入清邁商家中" /></AdminEditorForm>
    <p><Link href="/cities/chiang-mai#chiang-mai-neighborhoods">查看清邁街區地圖</Link></p>
    <p>補齊 45 家既有商家的介紹與照片，新增 20 個曼谷捷運沿線地點。僅修改泰國商家及必要的曼谷分區；不修改越南、文章或網站設定。</p>
    <p>已有人工作業的欄位會保留並列為衝突；重複執行不會新增重複商家。每次寫入均保存原始資料版本。</p>
    {result.updated !== undefined ? <div role="status"><h2>更新已完成</h2><p>既有商家更新 {result.updated} 家；新增 {result.added} 家；替換／新增照片 {result.images} 張。</p><p>未處理項目：{result.conflicts || "無"}</p></div> : null}
    <AdminEditorForm action={applyBatch}><AdminSubmitButton idleLabel="套用泰國內容更新" pendingLabel="備份並更新泰國資料中" /></AdminEditorForm>
    {result.disabled !== undefined ? <p role="status">已停用 {result.disabled} 家缺照片的泰國商家，資料保留於後台，越南商家未變更。</p> : null}
    <AdminEditorForm action={disableMissingPhotos}><AdminSubmitButton idleLabel="停用缺照片的泰國商家" pendingLabel="備份並停用中" /></AdminEditorForm>
    <h2>尚待取得授權照片：{pendingPhotos.length} 家</h2>
    <p>介紹已備妥，照片尚未確認再利用授權。前台不以網站示意圖冒充商家實景。</p>
    <ul>{pendingPhotos.map(business => <li key={business.slug}><Link href={`/admin/businesses?edit=${encodeURIComponent(business.slug)}`}>{business.name}</Link> · {business.isActive === false ? "已停用" : "啟用中"}</li>)}</ul>
    <h2>城市照片修正</h2>
    <p>僅替換清萊、甲米、芽莊、順化、會安仍沿用其他城市的照片；保留已手動更換的圖片與所有文字。</p>
    {result.cityPhotos !== undefined ? <p role="status">已替換 {result.cityPhotos} 座城市照片。</p> : null}
    <AdminEditorForm action={updateCityPhotos}><AdminSubmitButton idleLabel="替換五座城市實景照片" pendingLabel="備份並更新照片中" /></AdminEditorForm>
    <p><Link href="/admin/businesses">返回商家管理</Link> · <Link href="/cities/bangkok">查看曼谷指南</Link></p>
  </section>;
}
