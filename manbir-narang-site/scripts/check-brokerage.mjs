// Checks content/brokerage-listings.json before every build.
// If anything is wrong the build stops, and Vercel keeps the last working version of the site live.
import { readFileSync } from "node:fs";

const FILE = new URL("../content/brokerage-listings.json", import.meta.url);
const CATEGORIES = ["Homes", "Lakefront", "Waterfront", "Acreage", "Estates", "Condos", "Commercial"];
const RESERVED = ["properties", "buy", "sell", "communities", "blog", "about", "contact", "privacy", "terms", "admin"];
const slugify = (s) => s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const isUrl = (u) => typeof u === "string" && /^https:\/\/[^\s"']+$/.test(u);
const num = (v) => typeof v === "number" && Number.isFinite(v) && v >= 0;

let data;
try { data = JSON.parse(readFileSync(FILE, "utf8")); }
catch (e) { console.error("brokerage-listings.json is not valid JSON:", e.message); process.exit(1); }

const errors = [];
if (typeof data.enabled !== "boolean") errors.push(`"enabled" must be true or false`);
if (!Array.isArray(data.listings)) errors.push(`"listings" must be a list`);
const seenMls = new Set(), seenSlug = new Set();
(data.listings || []).forEach((l, i) => {
  const at = `listings[${i}]${l && l.address ? ` (${l.address})` : ""}`;
  if (!l || typeof l !== "object") return errors.push(`${at}: must be an object`);
  if (typeof l.mls !== "string" || !/^[A-Za-z0-9-]+$/.test(l.mls)) errors.push(`${at}: "mls" must be the MLS number as text`);
  else if (seenMls.has(l.mls)) errors.push(`${at}: MLS ${l.mls} appears twice`); else seenMls.add(l.mls);
  if (typeof l.address !== "string" || !l.address.trim()) errors.push(`${at}: "address" is required`);
  const slug = slugify(l.slug || l.address || "");
  if (!slug) errors.push(`${at}: could not make a web address`);
  else if (RESERVED.includes(slug)) errors.push(`${at}: web address "${slug}" is reserved`);
  else if (seenSlug.has(slug)) errors.push(`${at}: web address "${slug}" is used twice`); else seenSlug.add(slug);
  if (typeof l.area !== "string" || !l.area.trim()) errors.push(`${at}: "area" is required`);
  if (!num(l.price) || l.price === 0) errors.push(`${at}: "price" must be a number greater than 0`);
  if (l.category !== undefined && !CATEGORIES.includes(l.category)) errors.push(`${at}: "category" must be one of ${CATEGORIES.join(", ")}`);
  for (const k of ["beds", "baths", "sqft", "taxes", "yearBuilt"]) if (l[k] !== undefined && l[k] !== null && !num(l[k])) errors.push(`${at}: "${k}" must be a number`);
  if (typeof l.listingAgent !== "string" || !l.listingAgent.trim()) errors.push(`${at}: "listingAgent" is required`);
  if (!Array.isArray(l.photos) || l.photos.length === 0) errors.push(`${at}: "photos" needs at least one photo URL`);
  else if (l.photos.length > 80) errors.push(`${at}: too many photos (max 80)`);
  else l.photos.forEach((u, j) => { if (!isUrl(u)) errors.push(`${at}: photos[${j}] must be an https:// URL`); });
  if (l.features !== undefined && !(Array.isArray(l.features) && l.features.every((f) => typeof f === "string"))) errors.push(`${at}: "features" must be a list of text`);
  if (!isUrl(l.listingUrl)) errors.push(`${at}: "listingUrl" (the RE/MAX listing page, used by "Contact agent") must be an https:// URL`);
  if (l.listedOn !== undefined && l.listedOn !== null && !/^\d{4}-\d{2}-\d{2}$/.test(l.listedOn)) errors.push(`${at}: "listedOn" must be a date like 2026-10-28`);
  if (l.description !== undefined && typeof l.description !== "string") errors.push(`${at}: "description" must be text`);
});

if (errors.length) {
  console.error(`\nbrokerage-listings.json has ${errors.length} problem(s):\n - ` + errors.join("\n - ") + "\n");
  process.exit(1);
}
console.log(`brokerage-listings.json OK: ${data.listings.length} listing(s), ${data.enabled ? "SHOWN on site" : "hidden (enabled: false)"}`);
