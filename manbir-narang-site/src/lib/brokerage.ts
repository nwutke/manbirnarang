import FILE from "../../content/brokerage-listings.json";
import { slugify, type Listing } from "./types";

/** One brokerage listing as written by the update bot. Checked by scripts/check-brokerage.mjs before every build. */
type BotListing = {
  mls: string; address: string; slug?: string; area: string; price: number; status?: string; category?: string;
  beds?: number; baths?: number; sqft?: number; lotSize?: string; yearBuilt?: number; taxes?: number;
  description?: string; features?: string[]; photos: string[]; listingAgent: string; listingUrl: string; listedOn?: string;
};

const data = FILE as { enabled: boolean; updated?: string; listings: BotListing[] };

export const brokerageEnabled = data.enabled === true;

/**
 * Other RE/MAX Mid-Island Realty listings, excluding any that are already Manbir's own.
 * Empty while "enabled" is false in content/brokerage-listings.json.
 */
export function getBrokerageListings(own: Listing[] = []): Listing[] {
  if (!brokerageEnabled) return [];
  const ownMls = new Set(own.map((l) => l.mls).filter(Boolean));
  const ownSlugs = new Set(own.map((l) => l.slug));
  return data.listings
    .filter((b) => !ownMls.has(b.mls) && !/manbir\s+narang/i.test(b.listingAgent))
    .map((b, i): Listing => ({
      id: "brk-" + b.mls,
      title: b.address,
      location: b.area,
      price: b.price,
      status: b.status || "For sale",
      category: b.category || "Homes",
      beds: b.beds ?? 0,
      baths: b.baths ?? 0,
      sqft: b.sqft ?? 0,
      description: b.description ?? "",
      photos: b.photos,
      photoCount: b.photos.length,
      featured: false,
      published: true,
      sort: 1000 + i,
      slug: slugify(b.slug || b.address),
      mls: b.mls,
      yearBuilt: b.yearBuilt ?? null,
      lotSize: b.lotSize ?? null,
      taxes: b.taxes ?? null,
      features: b.features ?? [],
      listedBy: b.listingAgent,
      sourceUrl: b.listingUrl,
      listedOn: b.listedOn ?? null,
    }))
    .filter((l) => !ownSlugs.has(l.slug));
}
