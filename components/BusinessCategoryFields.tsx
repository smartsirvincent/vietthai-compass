"use client";

import { useState } from "react";
import { BUSINESS_CATEGORIES, BUSINESS_SUBCATEGORIES, isBusinessCategory } from "@/lib/business-taxonomy";

export function BusinessCategoryFields({ category = "", subcategory = "" }: { category?: string; subcategory?: string }) {
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [selectedSubcategory, setSelectedSubcategory] = useState(subcategory);
  const options = isBusinessCategory(selectedCategory) ? BUSINESS_SUBCATEGORIES[selectedCategory] : [];

  return <>
    <label>
      商家分類
      <select name="category" required value={selectedCategory} onChange={(event) => { setSelectedCategory(event.target.value); setSelectedSubcategory(""); }}>
        <option value="">請選擇分類</option>
        {BUSINESS_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
    </label>
    <label>
      細分類
      <select name="subcategory" required value={selectedSubcategory} onChange={(event) => setSelectedSubcategory(event.target.value)} disabled={!options.length}>
        <option value="">請先選擇細分類</option>
        {options.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
    </label>
  </>;
}
