// Pure helpers for property objects coming from the API (or the demo data).
// They return keys/values, never UI text: components translate with t().

export const FALLBACK_IMAGE = "/images/tricoasthouse-1070x713.jpg";

/** @typedef {"sale" | "partial" | "rent"} Deal */

/** The backend stores "Rent" (auto-rent) and "rent" (sell form): normalise. @returns {Deal} */
export function dealOf(property) {
  const t = (property?.type_request || "").toLowerCase();
  if (t === "rent") return "rent";
  if (t === "partialsell") return "partial";
  return "sale";
}

/** Value sent to the API for each deal. */
export const DEAL_TO_API = { sale: "fullSell", partial: "partialSell", rent: "rent" };

/** condition codes used by the backend → translation key + badge tone */
export const CONDITIONS = {
  green: { key: "excellent", tone: "good" },
  yellow: { key: "good", tone: "ok" },
  red: { key: "renovation", tone: "bad" },
};

export const conditionOf = (property) => CONDITIONS[property?.condition] || { key: null, tone: "ok" };

/** Value of a feature (suffix) by its title, e.g. feature(p, "Bedrooms") → "3" */
export function feature(property, title) {
  return property?.suffixes?.find((s) => s.title?.toLowerCase() === title.toLowerCase())?.description;
}

export function photosOf(property) {
  const list = (property?.photos || []).filter(Boolean).map((p) => p.replace(/\\/g, ""));
  return list.length ? list : [FALLBACK_IMAGE];
}

export const ownedPercent = (property) => 100 - Number(property?.available_percentage ?? 100);

/** Swap a broken image for the fallback once. */
export function onImageError(e) {
  e.currentTarget.onerror = null;
  e.currentTarget.src = FALLBACK_IMAGE;
}
