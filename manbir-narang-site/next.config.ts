import type { NextConfig } from "next";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

/** Photo hostnames actually used in brokerage-listings.json. Nothing broader. */
function brokeragePhotoHosts(): string[] {
  const candidates = [
    join(process.cwd(), "content/brokerage-listings.json"),
    join(process.cwd(), "manbir-narang-site/content/brokerage-listings.json"),
  ];
  const path = candidates.find((p) => existsSync(p));
  if (!path) return [];
  try {
    const data = JSON.parse(readFileSync(path, "utf8")) as {
      listings?: { photo?: unknown; photoUrl?: unknown; photos?: unknown }[];
    };
    const hosts = new Set<string>();
    for (const listing of data.listings ?? []) {
      const urls = [listing.photo, listing.photoUrl, ...(Array.isArray(listing.photos) ? listing.photos : [])];
      for (const url of urls) {
        if (typeof url !== "string") continue;
        try {
          const parsed = new URL(url);
          if (parsed.protocol === "https:") hosts.add(parsed.hostname);
        } catch {
          /* invalid URL; check-brokerage rejects it before a production build */
        }
      }
    }
    return [...hosts].sort();
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: brokeragePhotoHosts().map((hostname) => ({
      protocol: "https",
      hostname,
    })),
  },
};

export default nextConfig;
