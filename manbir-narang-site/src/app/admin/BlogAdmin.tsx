"use client";

import { useCallback, useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { formatDate, rowToPost, type Post } from "@/lib/posts";
import { slugify } from "@/lib/types";

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

type Form = { id: string; title: string; slug: string; date: string; summary: string; body: string; cover: string; published: boolean };
const blank = (): Form => ({ id: "", title: "", slug: "", date: today(), summary: "", body: "", cover: "", published: true });

export default function BlogAdmin({ sb, onCount }: { sb: SupabaseClient; onCount?: (n: number) => void }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [form, setForm] = useState<Form | null>(null);
  const [msg, setMsg] = useState("");
  const [missing, setMissing] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await sb.from("posts").select("*").order("published_on", { ascending: false }).order("created_at", { ascending: false });
    if (error) { setMissing(true); return; }
    setMissing(false);
    const list = (data ?? []).map(rowToPost);
    setPosts(list);
    onCount?.(list.length);
  }, [sb, onCount]);

  useEffect(() => { load(); }, [load]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => (f ? { ...f, [k]: v } : f));

  async function uploadCover(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setBusy(true); setMsg("");
    const path = `blog/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const { error } = await sb.storage.from("listing-photos").upload(path, file, { cacheControl: "31536000", upsert: false });
    setBusy(false);
    if (error) { setMsg("Upload failed: " + error.message); return; }
    set("cover", sb.storage.from("listing-photos").getPublicUrl(path).data.publicUrl);
  }

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form) return;
    const slug = slugify(form.slug.trim() || form.title);
    if (!slug) { setMsg("Please add a title."); return; }
    if (posts.some((p) => p.slug === slug && p.id !== form.id)) { setMsg(`Could not save: another article already uses the web address "${slug}".`); return; }
    setBusy(true); setMsg("");
    const row = {
      title: form.title.trim(), slug, published_on: form.date || today(), summary: form.summary.trim() || null,
      body: form.body.trim(), cover: form.cover || null, published: form.published,
    };
    const { error } = form.id ? await sb.from("posts").update(row).eq("id", form.id) : await sb.from("posts").insert(row);
    setBusy(false);
    if (error) { setMsg("Could not save: " + error.message); return; }
    setForm(null); setMsg("Saved. The blog updates within a minute."); load();
  }

  async function remove(p: Post) {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    const { error } = await sb.from("posts").delete().eq("id", p.id);
    if (error) setMsg("Could not delete: " + error.message); else load();
  }

  if (missing) {
    return (
      <div className="admlist">
        <p className="aerr">The blog isn’t set up in the database yet. In Supabase, open SQL Editor, paste in everything from <code>supabase/blog.sql</code>, and click Run. Then reload this page.</p>
      </div>
    );
  }

  return (
    <>
      {msg ? <p className={msg.startsWith("Saved") ? "aok" : "aerr"}>{msg}</p> : null}

      {!form && (
        <>
          <button className="abtn" onClick={() => { setMsg(""); setForm(blank()); }}>+ New article</button>
          <div className="admlist">
            {posts.length === 0 && <p>No articles yet.</p>}
            {posts.map((p) => (
              <div className="admrow" key={p.id}>
                <div className="admthumb" style={p.cover ? { backgroundImage: `url("${p.cover}")` } : undefined} />
                <div className="admmain">
                  <b>{p.title}</b>
                  <span>{formatDate(p.date)} · /blog/{p.slug}{p.published ? "" : " · DRAFT"}</span>
                </div>
                <div className="admact">
                  <a className="alink" href={`/blog/${p.slug}`} target="_blank" rel="noreferrer">View</a>
                  <button className="alink" onClick={() => { setMsg(""); setForm({ id: p.id, title: p.title, slug: p.slug, date: p.date, summary: p.summary, body: p.body, cover: p.cover ?? "", published: p.published }); }}>Edit</button>
                  <button className="alink danger" onClick={() => remove(p)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {form && (
        <form className="admform" onSubmit={save}>
          <h2>{form.id ? "Edit article" : "New article"}</h2>
          <label>Title<input value={form.title} onChange={(e) => set("title", e.target.value)} required placeholder="What to know before buying acreage" /></label>
          <div className="g2a">
            <label>Date<input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} required /></label>
            <label>Web address<input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder={slugify(form.title) || "buying-acreage"} />
              <small className="admhint">manbirnarang.ca/blog/{slugify(form.slug || form.title) || "…"}</small></label>
          </div>
          <label>Summary (shown on the blog cards)<textarea rows={2} value={form.summary} onChange={(e) => set("summary", e.target.value)} placeholder="One or two sentences about the article." /></label>
          <label>Cover photo<input type="file" accept="image/*" onChange={(e) => uploadCover(e.target.files)} /></label>
          {form.cover ? (
            <div className="admphotos">
              <div className="admph" style={{ backgroundImage: `url("${form.cover}")` }}>
                <em>Cover</em>
                <button type="button" onClick={() => set("cover", "")} aria-label="Remove photo">×</button>
              </div>
            </div>
          ) : null}
          <label>Article
            <textarea rows={18} value={form.body} onChange={(e) => set("body", e.target.value)} required className="admbody"
              placeholder={"Write your article here.\n\nLeave a blank line between paragraphs.\n\n## A heading\n\n- A bullet point\n- Another bullet point\n\nPut **two stars** around words to make them bold."} />
            <small className="admhint">Blank line = new paragraph · start a line with ## for a heading · start lines with - for bullet points · **bold**</small>
          </label>
          <div className="admchk">
            <label><input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} /> Published (untick to save as a draft)</label>
          </div>
          <div>
            <button className="abtn" type="submit" disabled={busy}>{busy ? "Working…" : "Save article"}</button>
            <button className="alink" type="button" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </form>
      )}
    </>
  );
}
