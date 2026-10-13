"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import type { City } from "@/lib/types";
import { BUSINESS_CATEGORIES, BUSINESS_SUBCATEGORIES, isBusinessCategory } from "@/lib/business-taxonomy";
type Place = Pick<City, "slug" | "name" | "country" | "districts">;
export function DestinationFilters({ cities, action, country = "", city = "", district = "", query = "", directory = false, category = "", subcategory = "" }: { cities: Place[]; action: string; country?: string; city?: string; district?: string; query?: string; directory?: boolean; category?: string; subcategory?: string }) {
  const [selectedCountry, setCountry] = useState(country);
  const [selectedCity, setCity] = useState(city);
  const [selectedDistrict, setDistrict] = useState(district);
  const [selectedCategory, setCategory] = useState(category);
  const [selectedSubcategory, setSubcategory] = useState(subcategory);
  const availableCities = cities.filter(item => !selectedCountry || item.country === selectedCountry);
  const districts = availableCities.find(item => item.slug === selectedCity)?.districts || [];
  const subcategories = isBusinessCategory(selectedCategory) ? BUSINESS_SUBCATEGORIES[selectedCategory] : [];
  return <form action={action} className={`destination-filters${directory ? " directory-filters" : ""}`}>
    <label>國家<select name="country" value={selectedCountry} onChange={event => { setCountry(event.target.value); setCity(""); setDistrict(""); }}><option value="">全部國家</option><option value="vietnam">越南</option><option value="thailand">泰國</option></select></label>
    <label>城市<select name="city" value={selectedCity} onChange={event => { setCity(event.target.value); setDistrict(""); }}><option value="">全部城市</option>{availableCities.map(item => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select></label>
    <label>分區<select name="district" disabled={!districts.length} value={selectedDistrict} onChange={event => setDistrict(event.target.value)}><option value="">全部分區</option>{districts.map(item => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select></label>
    {directory ? <>
      <label>商家分類<select name="category" value={selectedCategory} onChange={event => { setCategory(event.target.value); setSubcategory(""); }}><option value="">全部類型</option>{BUSINESS_CATEGORIES.map(item => <option key={item} value={item}>{item}</option>)}</select></label>
      <label>細分類<select name="subcategory" value={selectedSubcategory} onChange={event => setSubcategory(event.target.value)} disabled={!subcategories.length}><option value="">全部細分類</option>{subcategories.map(item => <option key={item} value={item}>{item}</option>)}</select></label>
    </> : null}
    <label className="destination-keyword">關鍵字<input name="q" type="search" defaultValue={query} placeholder="店名、咖啡、親子…" /></label>
    <button className="primary-button" type="submit"><Search size={18} />查找</button>
  </form>;
}
