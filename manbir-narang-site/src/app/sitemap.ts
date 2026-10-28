import type { MetadataRoute } from "next";
import { getListings } from "@/lib/listings";
import { getPosts } from "@/lib/posts";
import { getBrokerageListings } from "@/lib/brokerage";
import { siteUrl } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = siteUrl();
  const pages: MetadataRoute.Sitemap = ["", "/properties", "/buy", "/sell", "/communities", "/blog", "/about", "/contact", "/privacy", "/terms"].map((p) => ({
    url: site + p,
    lastModified: new Date(),
    changeFrequency: p === "/properties" || p === "" ? "weekly" : "monthly",
    priority: p === "" ? 1 : p === "/privacy" || p === "/terms" ? 0.2 : 0.7,
  }));
  const own = await getListings();
  const listings = [...own, ...getBrokerageListings(own)].filter((l) => !l.id.startsWith("seed-"));
  const posts = await getPosts();
  return [
    ...pages,
    ...listings.map((l) => ({ url: `${site}/${l.slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 })),
    ...posts.map((p) => ({ url: `${site}/blog/${p.slug}`, lastModified: new Date(p.date), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
