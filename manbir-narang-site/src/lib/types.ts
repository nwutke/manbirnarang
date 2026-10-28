export type Listing = {
  id: string;
  title: string;
  location: string;
  price: number;
  status: string; // e.g. "New listing", "Open house Sat", "Price improved", "Just listed", "Sold"
  category: string; // Lakefront | Waterfront | Acreage | Estates | Condos
  beds: number;
  baths: number;
  sqft: number;
  description: string;
  photos: string[];
  photoCount?: number | null;
  featured: boolean;
  published: boolean;
  sort: number;
};

export const CATEGORIES = ["Lakefront", "Waterfront", "Acreage", "Estates", "Condos"] as const;
export const STATUSES = ["New listing", "Just listed", "Open house Sat", "Price improved", "For sale", "Sold"] as const;

export const money = (n: number) => "$" + Math.round(n).toLocaleString("en-CA");
