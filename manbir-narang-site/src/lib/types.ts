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
};

export const CATEGORIES = ["Homes", "Lakefront", "Waterfront", "Acreage", "Estates", "Condos", "Commercial"] as const;
export const STATUSES = ["New listing", "Just listed", "Open house Sat", "Price improved", "For sale", "Sold"] as const;

export const money = (n: number) => "$" + Math.round(n).toLocaleString("en-CA");
