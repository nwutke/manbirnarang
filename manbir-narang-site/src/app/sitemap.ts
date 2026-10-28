import type { MetadataRoute } from "next";
import { getListings } from "@/lib/listings";
import { siteUrl } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = siteUrl();
  const pages: MetadataRoute.Sitemap = ["", "/properties", "/buy", "/sell", "/communities", "/about", "/contact"].map((p) => ({
    url: site + p,
    lastModified: new Date(),
    changeFrequency: p === "/properties" || p === "" ? "weekly" : "monthly",
    priority: p === "" ? 1 : 0.7,
  }));
  const listings = (await getListings()).filter((l) => !l.id.startsWith("seed-"));
  return [...pages, ...listings.map((l) => ({ url: `${site}/${l.slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 }))];
}
