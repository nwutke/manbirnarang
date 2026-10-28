import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = siteUrl();
  return ["", "/properties", "/buy", "/sell", "/communities", "/about", "/contact"].map((p) => ({
    url: site + p,
    lastModified: new Date(),
    changeFrequency: p === "/properties" || p === "" ? "weekly" : "monthly",
    priority: p === "" ? 1 : 0.7,
  }));
}
