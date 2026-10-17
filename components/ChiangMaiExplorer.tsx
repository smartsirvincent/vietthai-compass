import Link from "next/link";
import { BusinessCard } from "@/components/Cards";
import { ChiangMaiMap } from "@/components/ChiangMaiMap";
import { chiangMaiAreas, chiangMaiHref, filterChiangMaiBusinesses } from "@/lib/chiang-mai-areas";
import type { DirectoryBusiness } from "@/lib/types";

export function ChiangMaiExplorer({ businesses, area = "", merchantType = "" }: { businesses: DirectoryBusiness[]; area?: string; merchantType?: string }) {
  const all = filterChiangMaiBusinesses(businesses);
  const selected = chiangMaiAreas.some(a => a.slug === area) || area === "other" ? area : "";
  const types = [...new Set(all.map(b => b.subcategory).filter((s): s is NonNullable<typeof s> => !!s))].sort();
  const type = types.includes(merchantType as typeof types[number]) ? merchantType : "";
  const counts = Object.fromEntries(chiangMaiAreas.map(a => [a.slug, filterChiangMaiBusinesses(all, a.slug, type).length]));
  const visible = filterChiangMaiBusinesses(all, selected, type);
  const otherCount = filterChiangMaiBusinesses(all, "other", type).length;
  const areaName = chiangMaiAreas.find(a => a.slug === selected)?.name || (selected === "other" ? "其他清邁地區" : "清邁全區");
  return <section className="band cm-explorer" id="chiang-mai-neighborhoods">
    <div className="cm-heading"><div><p className="eyebrow">CHIANG MAI NEIGHBORHOODS</p><h2>清邁街區地圖</h2></div><Link href="/directory?country=thailand&city=chiang-mai">全部清邁商家</Link></div>
    <p>從古城小巷、尼曼咖啡館到濱河老屋，找一個喜歡的街區慢慢逛。</p>
    <ChiangMaiMap selected={selected} type={type} counts={counts} />
    <p className="image-credit">色塊為旅遊街區的概略範圍，非行政界線或店家精確位置；導航請以商家頁的 Google Maps 為準。</p>
    <nav className="cm-filters" aria-label="清邁街區">
      <Link scroll={false} href={chiangMaiHref("", type)} aria-current={!selected ? "true" : undefined}>全區 ({filterChiangMaiBusinesses(all, "", type).length})</Link>
      {chiangMaiAreas.map((a, i) => <Link scroll={false} key={a.slug} href={chiangMaiHref(a.slug, type)} aria-current={selected === a.slug ? "true" : undefined}><span aria-hidden="true" style={{ background: a.color }}>{i + 1}</span>{a.name} ({counts[a.slug]})</Link>)}
      {otherCount ? <Link scroll={false} href={chiangMaiHref("other", type)} aria-current={selected === "other" ? "true" : undefined}>其他地區 ({otherCount})</Link> : null}
    </nav>
    <nav className="cm-filters cm-types" aria-label="清邁商家類型">
      <Link scroll={false} href={chiangMaiHref(selected)} aria-current={!type ? "true" : undefined}>全部類型</Link>
      {types.map(t => <Link scroll={false} key={t} href={chiangMaiHref(selected, t)} aria-current={type === t ? "true" : undefined}>{t}</Link>)}
    </nav>
    <h3 aria-live="polite">{areaName}{type ? ` · ${type}` : ""} <span className="cm-result-count">{visible.length} 家</span></h3>
    {visible.length ? <div className="grid three">{visible.map(b => <BusinessCard key={b.slug} business={b} />)}</div>
      : <p className="empty-state">這個篩選條件下還沒有商家。<Link scroll={false} href={chiangMaiHref(selected)}>查看本區全部類型</Link>，或<Link scroll={false} href={chiangMaiHref()}>返回清邁全區</Link>。</p>}
  </section>;
}
