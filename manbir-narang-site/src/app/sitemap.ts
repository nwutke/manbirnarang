import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return ["", "/properties", "/buy", "/sell", "/communities", "/about", "/contact"].map((p) => ({
    url: site + p,
    lastModified: new Date(),
    changeFrequency: p === "/properties" || p === "" ? "weekly" : "monthly",
    priority: p === "" ? 1 : 0.7,
  }));
}
