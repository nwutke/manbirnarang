// Reads NEXT_PUBLIC_SITE_URL safely. A badly pasted value (for example a markdown link)
// falls back to the default instead of breaking the build.
export function siteUrl(): string {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL || "").trim();
  const m = raw.match(/https?:\/\/[^\s)\]]+/i);
  const candidate = m ? m[0] : raw ? "https://" + raw.replace(/^\/+/, "") : "";
  try {
    return new URL(candidate).origin;
  } catch {
    return "https://www.manbirnarang.ca";
  }
}
