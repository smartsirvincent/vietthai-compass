"use client";

import { useMemo, useState } from "react";
import { City } from "@/lib/types";

type CityDistrictFieldsProps = {
  cities: City[];
  cityName?: string;
  districtName?: string;
  cityLabel?: string;
  districtLabel?: string;
  cityPlaceholder?: string;
  districtPlaceholder?: string;
  defaultCitySlug?: string;
  defaultDistrictSlug?: string;
  requiredCity?: boolean;
};

export function CityDistrictFields({
  cities,
  cityName = "citySlug",
  districtName = "districtSlug",
  cityLabel = "城市",
  districtLabel = "分區",
  cityPlaceholder = "不限城市",
  districtPlaceholder = "不限分區",
  defaultCitySlug = "",
  defaultDistrictSlug = "",
  requiredCity = false
}: CityDistrictFieldsProps) {
  const [selectedCitySlug, setSelectedCitySlug] = useState(defaultCitySlug);
  const [selectedDistrictSlug, setSelectedDistrictSlug] = useState(defaultDistrictSlug);
  const selectedCity = useMemo(
    () => cities.find((city) => city.slug === selectedCitySlug),
    [cities, selectedCitySlug]
  );
  const districtOptions = selectedCity?.districts || [];
  const districtStillValid = districtOptions.some((district) => district.slug === selectedDistrictSlug);

  return (
    <>
      <label>
        {cityLabel}
        <select
          name={cityName}
          required={requiredCity}
          value={selectedCitySlug}
          onChange={(event) => {
            setSelectedCitySlug(event.target.value);
            setSelectedDistrictSlug("");
          }}
        >
          <option value="">{cityPlaceholder}</option>
          {cities.map((city) => (
            <option key={city.slug} value={city.slug}>
              {city.name} ({city.slug})
            </option>
          ))}
        </select>
      </label>
      <label>
        {districtLabel}
        <select
          name={districtName}
          value={districtStillValid ? selectedDistrictSlug : ""}
          disabled={!selectedCitySlug}
          onChange={(event) => setSelectedDistrictSlug(event.target.value)}
        >
          <option value="">{selectedCitySlug ? districtPlaceholder : "請先選擇城市"}</option>
          {districtOptions.map((district) => (
            <option key={district.slug} value={district.slug}>
              {district.name} ({district.slug})
            </option>
          ))}
        </select>
      </label>
    </>
  );
}
