import Image from "next/image";
import { Download } from "lucide-react";
import { requireAdminRole } from "@/lib/admin-auth";
import styles from "./page.module.css";

export const metadata = { title: "品牌素材" };

const assets = [
  { name: "完整直式 Logo", file: "vietthai-logo-stacked.png", width: 1254, height: 1254 },
  { name: "純圖形 Logo", file: "vietthai-logo-symbol.png", width: 1254, height: 1254 },
  { name: "左圖右字橫式 Logo", file: "vietthai-logo-horizontal.png", width: 2172, height: 724 }
];

export default async function BrandAssetsPage() {
  await requireAdminRole();
  return <div>
    <header className={styles.heading}><h1>品牌素材</h1><p>越泰指南 · 02 藍黃款</p></header>
    <div className={styles.grid}>
      {assets.map(asset => {
        const src = `/brand-assets/logo-02/${asset.file}`;
        return <article className={styles.asset} key={asset.file}>
          <div className={styles.preview}>
            <Image src={src} alt={asset.name} width={asset.width} height={asset.height}
              sizes="(max-width: 720px) 100vw, 400px" />
          </div>
          <div className={styles.details}>
            <h2>{asset.name}</h2>
            <p>PNG · 透明背景 · {asset.width} × {asset.height} px</p>
            <a href={src} download={asset.file} className={styles.download}>
              <Download size={18} aria-hidden="true" />下載 PNG<span className={styles.srOnly}>：{asset.name}</span>
            </a>
          </div>
        </article>;
      })}
    </div>
  </div>;
}
