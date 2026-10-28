export type Listing = {
  id: string;
  title: string;
  location: string;
  price: number;
  status: string; // e.g. "New listing", "Open house Sat", "Price improved", "Just listed", "Sold"
  category: string; // Homes | Lakefront | Waterfront | Acreage | Estates | Condos | Commercial
  beds: number;
  baths: number;
  sqft: number;
  description: string;
  photos: string[];
  photoCount?: number | null;
  featured: boolean;
  published: boolean;
  sort: number;
  slug: string; // web address, e.g. "2684-12th-avenue" -> manbirnarang.ca/2684-12th-avenue
  mls?: string | null;
  yearBuilt?: number | null;
  lotSize?: string | null;
  taxes?: number | null;
  features: string[];
  listedBy?: string | null; // set for other agents' brokerage listings
  sourceUrl?: string | null;
};

/** Turns a title or address into a web address: "2684 12th Avenue" -> "2684-12th-avenue". */
export const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export const CATEGORIES = ["Homes", "Lakefront", "Waterfront", "Acreage", "Estates", "Condos", "Commercial"] as const;
export const STATUSES = ["New listing", "Just listed", "Open house Sat", "Price improved", "For sale", "Sold"] as const;

export const money = (n: number) => "$" + Math.round(n).toLocaleString("en-CA");
