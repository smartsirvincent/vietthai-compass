import Link from "next/link";
import { MapPin, Store, Utensils, Bus } from "lucide-react";
import { destinationHref } from "@/lib/explore";
import type { City } from "@/lib/types";
export function DestinationLinks({ city, district }: { city: City; district?: string }) {
  return <nav className="destination-links" aria-label="探索這個目的地">
    <Link href={destinationHref("/restaurants", city, district)}><Utensils size={18} />餐廳美食</Link>
    <Link href={destinationHref("/attractions", city, district)}><MapPin size={18} />景點行程</Link>
    <Link href={destinationHref("/local-life", city, district)}><Bus size={18} />在地生活</Link>
    <Link href={destinationHref("/directory", city, district)}><Store size={18} />精選商家</Link>
  </nav>;
}
