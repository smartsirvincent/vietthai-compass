"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { chiangMaiAreas, chiangMaiHref } from "@/lib/chiang-mai-areas";
import "leaflet/dist/leaflet.css";

export function ChiangMaiMap({ selected, type, counts }: { selected: string; type: string; counts: Record<string, number> }) {
  const root = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let cancelled = false;
    let map: import("leaflet").Map | undefined;
    let observer: ResizeObserver | undefined;
    setFailed(false);
    import("leaflet").then(L => {
      if (cancelled || !root.current) return;
      map = L.map(root.current, { scrollWheelZoom: false, minZoom: 11, maxZoom: 18, zoomSnap: 0.25 });
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).on("tileerror", () => setFailed(true)).addTo(map);
      for (const [index, area] of chiangMaiAreas.entries()) {
        const active = selected === area.slug;
        const shape = L.rectangle(area.bounds, { color: area.color, weight: active ? 4 : 2, fillOpacity: active ? 0.32 : 0.13 }).addTo(map);
        const label = document.createElement("a");
        label.href = chiangMaiHref(area.slug, type);
        const number = document.createElement("span");
        number.className = "cm-map-number";
        number.textContent = String(index + 1);
        const title = document.createElement("span");
        title.className = "cm-map-title";
        const shortNames = ["古城", "尼曼", "山提潭", "真心市集", "塔佩", "夜市", "河畔", "瓦萊", "素帖"];
        title.textContent = ` ${shortNames[index]} (${counts[area.slug] || 0})`;
        label.append(number, title);
        label.setAttribute("aria-label", `${area.name}，${counts[area.slug] || 0} 家商家`);
        if (active) label.setAttribute("aria-current", "true");
        label.addEventListener("click", event => {
          if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          router.push(chiangMaiHref(area.slug, type), { scroll: false });
        });
        shape.bindTooltip(label, { permanent: true, direction: "center", className: "cm-area-label", interactive: true });
        shape.on("click", () => router.push(chiangMaiHref(area.slug, type), { scroll: false }));
      }
      map.fitBounds([[18.769, 98.952], [18.811, 99.014]], { padding: [16, 16] });
      observer = new ResizeObserver(() => {
        map?.invalidateSize();
        map?.fitBounds([[18.769, 98.952], [18.811, 99.014]], { padding: [16, 16], animate: false });
      });
      observer.observe(root.current);
    }).catch(() => setFailed(true));
    return () => { cancelled = true; observer?.disconnect(); map?.remove(); };
  }, [selected, type, counts, router]);
  return <div className="cm-map-wrap">
    <div ref={root} className="cm-map" role="region" aria-label="清邁旅遊街區地圖" />
    {failed ? <p role="status">部分地圖底圖暫時無法載入，仍可使用下方分區連結查看商家。</p> : null}
  </div>;
}
