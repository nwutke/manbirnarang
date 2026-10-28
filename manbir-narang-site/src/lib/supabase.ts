import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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
