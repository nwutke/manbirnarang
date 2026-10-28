// Checks content/brokerage-listings.json before every build.
// If anything is wrong the build stops, and Vercel keeps the last working version of the site live.
// The file is refreshed from a machine that can open midislandrealty.com. This environment cannot:
// Cloudflare blocks it. Fields the source page does not show are left out, not invented.
import { readFileSync } from "node:fs";

const FILE = new URL("../content/brokerage-listings.json", import.meta.url);
const CATEGORIES = ["Homes", "Lakefront", "Waterfront", "Acreage", "Estates", "Condos", "Commercial"];
const isUrl = (u) => typeof u === "string" && /^https:\/\/\S+$/.test(u);
const num = (v) => typeof v === "number" && Number.isFinite(v) && v >= 0;

let data;
try { data = JSON.parse(readFileSync(FILE, "utf8")); }
catch (e) { console.error("brokerage-listings.json is not valid JSON:", e.message); process.exit(1); }

const errors = [];
if (!data || typeof data !== "object" || Array.isArray(data)) {
  console.error(`\nbrokerage-listings.json has 1 problem(s):\n - the file must be an object with "enabled" and "listings"\n`);
  process.exit(1);
}
if (typeof data.enabled !== "boolean") errors.push(`"enabled" must be true or false`);
if (data.updated !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(data.updated)) errors.push(`"updated" must be a date like 2026-10-28`);
if (!Array.isArray(data.listings)) errors.push(`"listings" must be a list`);

const seenMls = new Set();
const seenUrl = new Set();
const hosts = new Set();
(data.listings || []).forEach((l, i) => {
  const at = `listings[${i}]${l && l.address ? ` (${l.address})` : ""}`;
  if (!l || typeof l !== "object" || Array.isArray(l)) return errors.push(`${at}: must be an object`);

  const listingUrl = l.listingUrl || l.url;
  if (!isUrl(listingUrl)) errors.push(`${at}: "listingUrl" must be the listing's own https:// page on midislandrealty.com`);
  else if (seenUrl.has(listingUrl)) errors.push(`${at}: listing URL appears twice`);
  else seenUrl.add(listingUrl);

  if (l.mls != null && l.mls !== "") {
    if (typeof l.mls !== "string" || !/^[A-Za-z0-9-]+$/.test(l.mls)) errors.push(`${at}: "mls" must be the MLS number as text`);
    else if (seenMls.has(l.mls)) errors.push(`${at}: MLS ${l.mls} appears twice`);
    else seenMls.add(l.mls);
  }

  if (l.address != null && (typeof l.address !== "string" || !l.address.trim())) errors.push(`${at}: "address" must be text`);
  for (const key of ["city", "area"]) {
    if (l[key] != null && (typeof l[key] !== "string" || !l[key].trim())) errors.push(`${at}: "${key}" must be text`);
  }
  if (l.price != null && l.price !== "") {
    if (typeof l.price === "number") {
      if (!(num(l.price) && l.price > 0)) errors.push(`${at}: "price" must be a number greater than 0`);
    } else if (typeof l.price !== "string" || !l.price.trim()) errors.push(`${at}: "price" must be a number or the price text from the source page`);
  }
  if (l.category != null && l.category !== "" && !CATEGORIES.includes(l.category)) errors.push(`${at}: "category" must be one of ${CATEGORIES.join(", ")}`);
  if (l.status != null && typeof l.status !== "string") errors.push(`${at}: "status" must be text`);
  for (const k of ["beds", "baths", "sqft", "taxes", "yearBuilt"]) {
    if (l[k] == null || l[k] === "") continue;
    if (typeof l[k] === "number" && !num(l[k])) errors.push(`${at}: "${k}" must be a number`);
    else if (typeof l[k] !== "number" && typeof l[k] !== "string") errors.push(`${at}: "${k}" must be a number`);
  }
  if (l.listingAgent != null && (typeof l.listingAgent !== "string" || !l.listingAgent.trim())) errors.push(`${at}: "listingAgent" must be text`);

  const photoValues = [];
  if (typeof l.photo === "string" && l.photo.trim()) photoValues.push(l.photo);
  else if (l.photo != null && l.photo !== "") errors.push(`${at}: "photo" must be an https:// URL`);
  if (typeof l.photoUrl === "string" && l.photoUrl.trim()) photoValues.push(l.photoUrl);
  else if (l.photoUrl != null && l.photoUrl !== "") errors.push(`${at}: "photoUrl" must be an https:// URL`);
  if (l.photos != null) {
    if (!Array.isArray(l.photos)) errors.push(`${at}: "photos" must be a list of https:// URLs`);
    else l.photos.forEach((u, j) => {
      if (!isUrl(u)) errors.push(`${at}: photos[${j}] must be an https:// URL`);
      else photoValues.push(u);
    });
    if (l.photos.length > 80) errors.push(`${at}: too many photos (max 80)`);
  }
  photoValues.forEach((u) => { if (isUrl(u)) hosts.add(new URL(u).hostname); });

  if (l.features != null && !(Array.isArray(l.features) && l.features.every((f) => typeof f === "string"))) errors.push(`${at}: "features" must be a list of text`);
  if (l.listedOn != null && l.listedOn !== "" && !/^\d{4}-\d{2}-\d{2}$/.test(l.listedOn)) errors.push(`${at}: "listedOn" must be a date like 2026-10-28`);
  if (l.description != null && typeof l.description !== "string") errors.push(`${at}: "description" must be text`);
  if (l.lotSize != null && typeof l.lotSize !== "string") errors.push(`${at}: "lotSize" must be text`);
});

if (errors.length) {
  console.error(`\nbrokerage-listings.json has ${errors.length} problem(s):\n - ` + errors.join("\n - ") + "\n");
  process.exit(1);
}
const hostList = [...hosts].sort().join(", ") || "none";
console.log(`brokerage-listings.json OK: ${data.listings.length} listing(s), ${data.enabled ? "SHOWN on site" : "hidden (enabled: false)"}, photo hosts: ${hostList}`);
