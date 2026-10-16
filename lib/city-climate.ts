import type { City } from "./types";

export function fillMissingCityClimate(existing: City, reference: City): City {
  return {
    ...existing,
    bestSeason: existing.bestSeason?.trim() || reference.bestSeason,
    weather: existing.weather?.trim() || reference.weather,
    recommendedDays: existing.recommendedDays?.trim() || reference.recommendedDays
  };
}
