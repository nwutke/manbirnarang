import { getSupabase } from "./supabase";
import { slugify } from "./types";
import STARTER from "./starter-posts.json";

export type Post = {
  id: string;
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  summary: string;
  body: string;
  cover: string | null;
  published: boolean;
};

type Row = {
  id: string; slug: string | null; title: string; published_on: string; summary: string | null;
  body: string | null; cover: string | null; published: boolean;
};

export const rowToPost = (r: Row): Post => ({
  id: r.id, slug: r.slug?.trim() || slugify(r.title), title: r.title, date: r.published_on,
  summary: r.summary ?? "", body: r.body ?? "", cover: r.cover, published: r.published,
});

/** Built-in starter articles, shown only until the blog table exists in Supabase. */
const STARTER_POSTS: Post[] = (STARTER as Omit<Post, "id" | "published">[]).map((p) => ({ ...p, id: "starter-" + p.slug, published: true }));

/** Published posts, newest first. */
export async function getPosts(): Promise<Post[]> {
  const sb = getSupabase();
  if (!sb) return STARTER_POSTS;
  const { data, error } = await sb
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("published_on", { ascending: false })
    .order("created_at", { ascending: false });
  if (error || !data) return STARTER_POSTS; // table not created yet
  return (data as Row[]).map(rowToPost);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const key = slugify(decodeURIComponent(slug));
  return (await getPosts()).find((p) => p.slug === key) ?? null;
}

/** "2026-10-20" -> "October 20, 2026" (no time-zone shifting). */
export function formatDate(d: string) {
  const [y, m, day] = d.split("-").map(Number);
  if (!y || !m || !day) return d;
  return new Date(Date.UTC(y, m - 1, day)).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

export function readingMinutes(body: string) {
  return Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 220));
}
