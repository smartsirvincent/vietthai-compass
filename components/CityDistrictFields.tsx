"use client";

import { useMemo, useState } from "react";
import { City, CountryCode } from "@/lib/types";

type CityDistrictFieldsProps = {
  cities: City[];
  countryName?: string;
  cityName?: string;
  districtName?: string;
  countryLabel?: string;
  cityLabel?: string;
  districtLabel?: string;
  countryPlaceholder?: string;
  cityPlaceholder?: string;
  districtPlaceholder?: string;
  defaultCountry?: CountryCode | "";
  defaultCitySlug?: string;
  defaultDistrictSlug?: string;
  showCountry?: boolean;
  requiredCountry?: boolean;
  requiredCity?: boolean;
};

export function CityDistrictFields({
  cities,
  countryName = "country",
  cityName = "citySlug",
  districtName = "districtSlug",
  countryLabel = "國家",
  cityLabel = "城市",
  districtLabel = "分區",
  countryPlaceholder = "不限國家",
  cityPlaceholder = "不限城市",
  districtPlaceholder = "不限分區",
  defaultCountry = "",
  defaultCitySlug = "",
  defaultDistrictSlug = "",
  showCountry = false,
  requiredCountry = false,
  requiredCity = false
}: CityDistrictFieldsProps) {
  const defaultCity = cities.find((city) => city.slug === defaultCitySlug);
  const [selectedCountry, setSelectedCountry] = useState<CountryCode | "">(
    showCountry ? defaultCountry || defaultCity?.country || "" : ""
  );
  const [selectedCitySlug, setSelectedCitySlug] = useState(defaultCitySlug);
  const [selectedDistrictSlug, setSelectedDistrictSlug] = useState(defaultDistrictSlug);
  const cityOptions = useMemo(
    () => (showCountry && selectedCountry ? cities.filter((city) => city.country === selectedCountry) : cities),
    [cities, selectedCountry, showCountry]
  );
  const selectedCity = useMemo(
    () => cityOptions.find((city) => city.slug === selectedCitySlug),
    [cityOptions, selectedCitySlug]
  );
  const districtOptions = selectedCity?.districts || [];
  const districtStillValid = districtOptions.some((district) => district.slug === selectedDistrictSlug);

  return (
    <>
      {showCountry ? (
        <label>
          {countryLabel}
          <select
            name={countryName}
            required={requiredCountry}
            value={selectedCountry}
            onChange={(event) => {
              setSelectedCountry(event.target.value as CountryCode | "");
              setSelectedCitySlug("");
              setSelectedDistrictSlug("");
            }}
          >
            <option value="">{countryPlaceholder}</option>
            <option value="vietnam">越南</option>
            <option value="thailand">泰國</option>
          </select>
        </label>
      ) : null}
      <label>
        {cityLabel}
        <select
          name={cityName}
          required={requiredCity}
          value={selectedCitySlug}
          disabled={showCountry && !selectedCountry}
          onChange={(event) => {
            setSelectedCitySlug(event.target.value);
            setSelectedDistrictSlug("");
          }}
        >
          <option value="">{showCountry && !selectedCountry ? "請先選擇國家" : cityPlaceholder}</option>
          {cityOptions.map((city) => (
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
