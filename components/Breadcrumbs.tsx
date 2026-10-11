import Link from "next/link";
export function Breadcrumbs({ items }: { items: Array<{ label: string; href?: string }> }) {
  return <nav className="travel-breadcrumbs" aria-label="目前位置"><ol><li><Link href="/">首頁</Link></li>{items.map((item, index) => <li key={index}>{item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}</li>)}</ol></nav>;
}
