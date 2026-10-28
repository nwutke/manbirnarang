import FILE from "../../content/brokerage-listings.json";
import { CATEGORIES, slugify, type Listing } from "./types";

/**
 * One row in content/brokerage-listings.json.
 * Written by hand from midislandrealty.com/all-listings/ (Cloudflare blocks this environment).
 * Every field except the listing link is optional: never invent a value the page did not show.
 */
type BotListing = {
  mls?: string;
  mlsNumber?: string;
  address?: string;
  slug?: string;
  area?: string;
  city?: string;
  price?: number | string | null;
  priceText?: string;
  status?: string;
  category?: string;
  propertyType?: string;
  beds?: number | string | null;
  baths?: number | string | null;
  sqft?: number | string | null;
  lotSize?: string | null;
  yearBuilt?: number | null;
  taxes?: number | null;
  description?: string;
  features?: string[];
  photos?: string[];
  photo?: string;
  photoUrl?: string;
  listingAgent?: string;
  listingUrl?: string;
  url?: string;
  listedOn?: string | null;
};

type FileShape = { enabled?: boolean; updated?: string; listings?: BotListing[] };

const file = FILE as FileShape | BotListing[];
const listings: BotListing[] = Array.isArray(file) ? file : (file.listings ?? []);

/** A bare array (the scraper output) is shown. A wrapper can set "enabled": false to hide the cards. */
export const brokerageEnabled = Array.isArray(file) ? listings.length > 0 : file.enabled === true;

const HTTPS = /^https:\/\/\S+$/;

function text(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

/** A count the source page actually gave. Missing or unreadable becomes 0, which the card hides. */
function count(v: unknown): number {
  if (typeof v === "number" && Number.isFinite(v) && v >= 0) return v;
  if (typeof v === "string" && v.trim()) {
    const match = v.replace(/,/g, "").match(/\d+(?:\.\d+)?/);
    if (match) {
      const n = Number(match[0]);
      if (Number.isFinite(n) && n >= 0) return n;
    }
  }
  return 0;
}

/** Plain dollar amounts become a number. Anything else ("$2,500 Monthly") is kept as written. */
function priceOf(v: unknown): { price: number; priceLabel: string | null } {
  if (typeof v === "number" && Number.isFinite(v) && v > 0) return { price: v, priceLabel: null };
  const raw = text(v);
  if (!raw) return { price: 0, priceLabel: null };
  const compact = raw.replace(/\s/g, "");
  if (/^\$?\d{1,3}(?:,\d{3})*(?:\.\d+)?$/.test(compact) || /^\$?\d+(?:\.\d+)?$/.test(compact)) {
    const n = Number(compact.replace(/[$,]/g, ""));
    if (Number.isFinite(n) && n > 0) return { price: n, priceLabel: null };
  }
  const match = raw.replace(/,/g, "").match(/\d+(?:\.\d+)?/);
  const n = match ? Number(match[0]) : 0;
  return { price: Number.isFinite(n) && n > 0 ? n : 0, priceLabel: raw };
}

function photosOf(b: BotListing): string[] {
  const found: string[] = [];
  const push = (u: unknown) => {
    if (typeof u === "string" && HTTPS.test(u) && !found.includes(u)) found.push(u);
  };
  push(b.photo);
  push(b.photoUrl);
  if (Array.isArray(b.photos)) b.photos.forEach(push);
  return found.slice(0, 1);
}

function categoryOf(b: BotListing): string {
  const fromSource = text(b.propertyType);
  if (fromSource) return fromSource;
  const c = text(b.category);
  return (CATEGORIES as readonly string[]).includes(c) ? c : "";
}

/**
 * Other RE/MAX Mid-Island Realty listings, excluding any that are already Manbir's own
 * (same MLS number, same address slug, or his name as the listing agent).
 * Empty while "enabled" is false in content/brokerage-listings.json.
 */
export function getBrokerageListings(own: Listing[] = []): Listing[] {
  if (!brokerageEnabled) return [];
  const ownMls = new Set(own.map((l) => l.mls).filter(Boolean));
  const ownSlugs = new Set(own.map((l) => l.slug));
  const seenUrl = new Set<string>();
  const seenMls = new Set<string>();
  const out: Listing[] = [];

  listings.forEach((b, i) => {
    if (!b || typeof b !== "object") return;
    const listingUrl = text(b.listingUrl) || text(b.url);
    if (!HTTPS.test(listingUrl) || seenUrl.has(listingUrl)) return;
    const agent = text(b.listingAgent);
    if (agent && /manbir\s+narang/i.test(agent)) return;
    const mls = text(b.mlsNumber) || text(b.mls);
    if (mls && (ownMls.has(mls) || seenMls.has(mls))) return;
    if (mls) seenMls.add(mls);
    const address = text(b.address);
    const slug = slugify(text(b.slug) || address || mls || listingUrl);
    if (slug && ownSlugs.has(slug)) return;
    seenUrl.add(listingUrl);

    const parsed = priceOf(b.price);
    const price = parsed.price;
    const priceText = text(b.priceText);
    const photos = photosOf(b);
    const propertyType = text(b.propertyType);

    out.push({
      id: "brk-" + (mls || slugify(listingUrl) || String(i)),
      title: address,
      location: text(b.city) || text(b.area),
      price,
      priceLabel: priceText || parsed.priceLabel,
      status: text(b.status) || propertyType,
      category: categoryOf(b),
      beds: count(b.beds),
      baths: count(b.baths),
      sqft: count(b.sqft),
      description: text(b.description),
      photos,
      photoCount: photos.length,
      featured: false,
      published: true,
      sort: 1000 + i,
      slug: slug || "listing-" + i,
      mls: mls || null,
      yearBuilt: typeof b.yearBuilt === "number" && Number.isFinite(b.yearBuilt) ? b.yearBuilt : null,
      lotSize: text(b.lotSize) || null,
      taxes: typeof b.taxes === "number" && Number.isFinite(b.taxes) ? b.taxes : null,
      features: Array.isArray(b.features) ? b.features.filter((f): f is string => typeof f === "string" && f.trim() !== "") : [],
      listedBy: agent || null,
      sourceUrl: listingUrl,
      listedOn: /^\d{4}-\d{2}-\d{2}$/.test(text(b.listedOn)) ? text(b.listedOn) : null,
    });
  });

  return out;
}
