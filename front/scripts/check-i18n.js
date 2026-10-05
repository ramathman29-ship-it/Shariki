// Fails if en.json and ar.json don't have the same keys.
// Plural suffixes (_zero, _one, _two, _few, _many, _other) are compared by base key,
// because Arabic needs more plural forms than English.
import { readFileSync } from "node:fs";

const load = (lng) => JSON.parse(readFileSync(new URL(`../src/i18n/locales/${lng}.json`, import.meta.url)));
const PLURAL = /_(zero|one|two|few|many|other)$/;

function keys(obj, prefix = "", out = new Set()) {
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) keys(v, path, out);
    else out.add(path.replace(PLURAL, ""));
  }
  return out;
}

const en = keys(load("en"));
const ar = keys(load("ar"));
// data.* holds translations of database values; English shows them as-is
const missingInAr = [...en].filter((k) => !ar.has(k));
const missingInEn = [...ar].filter((k) => !en.has(k) && !k.startsWith("data."));

if (missingInAr.length) console.error("Missing in ar.json:\n  " + missingInAr.join("\n  "));
if (missingInEn.length) console.error("Missing in en.json:\n  " + missingInEn.join("\n  "));
if (missingInAr.length || missingInEn.length) process.exit(1);
console.log(`i18n OK: ${en.size} keys in both languages.`);
