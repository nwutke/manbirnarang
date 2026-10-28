import { getSupabase } from "./supabase";
import { SEED_LISTINGS } from "./data";
import type { Listing } from "./types";

type Row = {
  id: string; title: string; location: string; price: number | string; status: string; category: string;
  beds: number; baths: number | string; sqft: number; description: string | null; photos: string[] | null;
  photo_count: number | null; featured: boolean; published: boolean; sort: number | null;
};

export function rowToListing(r: Row): Listing {
  return {
    id: r.id, title: r.title, location: r.location, price: Number(r.price), status: r.status, category: r.category,
    beds: r.beds, baths: Number(r.baths), sqft: r.sqft, description: r.description ?? "", photos: r.photos ?? [],
    photoCount: r.photo_count, featured: r.featured, published: r.published, sort: r.sort ?? 0,
  };
}

/** Published listings from Supabase. Falls back to sample listings until the database has data. */
export async function getListings(): Promise<Listing[]> {
  const sb = getSupabase();
  if (!sb) return SEED_LISTINGS;
  const { data, error } = await sb
    .from("listings")
    .select("*")
    .eq("published", true)
    .order("sort", { ascending: true })
    .order("created_at", { ascending: false });
  if (error || !data || data.length === 0) return SEED_LISTINGS;
  return (data as Row[]).map(rowToListing);
}
