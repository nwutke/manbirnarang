import type { NextConfig } from "next";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

/** Photo hosts actually used in brokerage-listings.json, limited to the shared path prefix. */
function brokeragePhotoHosts(): { hostname: string; pathname: string }[] {
  const candidates = [
    join(process.cwd(), "content/brokerage-listings.json"),
    join(process.cwd(), "manbir-narang-site/content/brokerage-listings.json"),
  ];
  const path = candidates.find((p) => existsSync(p));
  if (!path) return [];
  try {
    const data = JSON.parse(readFileSync(path, "utf8")) as
      | { photo?: unknown; photoUrl?: unknown; photos?: unknown }[]
      | { listings?: { photo?: unknown; photoUrl?: unknown; photos?: unknown }[] };
    const rows = Array.isArray(data) ? data : (data.listings ?? []);
    const byHost = new Map<string, string[]>();
    for (const listing of rows) {
      const urls = [listing.photo, listing.photoUrl, ...(Array.isArray(listing.photos) ? listing.photos : [])];
      for (const url of urls) {
        if (typeof url !== "string") continue;
        try {
          const parsed = new URL(url);
          if (parsed.protocol !== "https:") continue;
          const paths = byHost.get(parsed.hostname) ?? [];
          paths.push(parsed.pathname);
          byHost.set(parsed.hostname, paths);
        } catch {
          /* invalid URL; check-brokerage rejects it before a production build */
        }
      }
    }
    return [...byHost.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([hostname, paths]) => {
        const top = paths[0]?.split("/").filter(Boolean)[0];
        const narrow = Boolean(top) && paths.every((p) => p === `/${top}` || p.startsWith(`/${top}/`));
        return { hostname, pathname: narrow ? `/${top}/**` : "/**" };
      });
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: brokeragePhotoHosts().map(({ hostname, pathname }) => ({
      protocol: "https",
      hostname,
      pathname,
    })),
  },
};

export default nextConfig;
