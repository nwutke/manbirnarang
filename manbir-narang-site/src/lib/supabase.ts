import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Keep only the project origin, so a pasted URL like ".../rest/v1/" still works. */
function cleanUrl(raw: string | undefined): string | undefined {
  const v = raw?.trim().replace(/^["']|["']$/g, "");
  if (!v) return undefined;
  try { return new URL(v).origin; } catch { return undefined; }
}

const url = cleanUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim().replace(/^["']|["']$/g, "");

export const supabaseConfigured = Boolean(url && key);

let browser: SupabaseClient | null = null;

/** Returns a Supabase client, or null when the env variables are not set yet. */
export function getSupabase(): SupabaseClient | null {
  if (!url || !key) return null;
  if (typeof window === "undefined") {
    return createClient(url, key, { auth: { persistSession: false } });
  }
  if (!browser) browser = createClient(url, key);
  return browser;
}
