"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import BlogAdmin from "./BlogAdmin";
import { rowToListing } from "@/lib/listings";
import { CATEGORIES, STATUSES, money, slugify, type Listing } from "@/lib/types";

type Inquiry = { id: string; created_at: string; kind: string; name: string; email: string; phone: string | null; address: string | null; interest: string | null; message: string | null };

const empty = {
  id: "", title: "", location: "", price: "", status: "New listing", category: "Homes", beds: "3", baths: "2", sqft: "",
  description: "", photos: [] as string[], featured: true, published: true, sort: "0",
  slug: "", mls: "", yearBuilt: "", lotSize: "", taxes: "", features: "",
};
type Form = typeof empty;

export default function Admin() {
  const sb = getSupabase();
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [tab, setTab] = useState<"listings" | "blog" | "inquiries">("listings");
  const [postCount, setPostCount] = useState<number | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [form, setForm] = useState<Form | null>(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!sb) return;
    const l = await sb.from("listings").select("*").order("sort", { ascending: true }).order("created_at", { ascending: false });
    if (l.data) setListings(l.data.map(rowToListing));
    const q = await sb.from("inquiries").select("*").order("created_at", { ascending: false });
    if (q.data) setInquiries(q.data as Inquiry[]);
  }, [sb]);

  useEffect(() => {
    if (!sb) { setReady(true); return; }
    sb.auth.getSession().then(({ data }) => { setSignedIn(Boolean(data.session)); setReady(true); });
    const { data } = sb.auth.onAuthStateChange((_e, session) => setSignedIn(Boolean(session)));
    return () => data.subscription.unsubscribe();
  }, [sb]);

  useEffect(() => { if (signedIn) load(); }, [signedIn, load]);

  if (!ready) return <div className="admbox"><p>Loading…</p></div>;
  if (!sb) {
    return (
      <div className="admbox">
        <h1>Admin</h1>
        <p>Supabase is not connected yet. Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your environment, then reload.</p>
      </div>
    );
  }

  async function signIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setMsg("");
    const { error } = await sb!.auth.signInWithPassword({ email: String(f.get("email")), password: String(f.get("password")) });
    if (error) setMsg("Sign-in failed: " + error.message);
  }

  if (!signedIn) {
    return (
      <div className="admbox narrowbox">
        <h1>Manbir Narang · Admin</h1>
        <form onSubmit={signIn}>
          <label>Email<input name="email" type="email" required autoComplete="username" /></label>
          <label>Password<input name="password" type="password" required autoComplete="current-password" /></label>
          <button className="abtn" type="submit">Sign in</button>
          {msg ? <p className="aerr">{msg}</p> : null}
        </form>
      </div>
    );
  }

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => (f ? { ...f, [k]: v } : f));

  async function upload(files: FileList | null) {
    if (!files || !files.length || !form) return;
    setBusy(true); setMsg("");
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const { error } = await sb!.storage.from("listing-photos").upload(path, file, { cacheControl: "31536000", upsert: false });
      if (error) { setMsg("Upload failed: " + error.message); break; }
      urls.push(sb!.storage.from("listing-photos").getPublicUrl(path).data.publicUrl);
    }
    setForm((f) => (f ? { ...f, photos: [...f.photos, ...urls] } : f));
    setBusy(false);
  }

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form) return;
    setBusy(true); setMsg("");
    const row = {
      title: form.title.trim(), location: form.location.trim(), price: Number(form.price.replace(/[^0-9.]/g, "")) || 0,
      status: form.status, category: form.category, beds: Number(form.beds) || 0, baths: Number(form.baths) || 0,
      sqft: Number(form.sqft.replace(/[^0-9]/g, "")) || 0, description: form.description.trim(), photos: form.photos,
      featured: form.featured, published: form.published, sort: Number(form.sort) || 0,
      slug: slugify(form.slug.trim() || form.title), mls: form.mls.trim() || null,
      year_built: Number(form.yearBuilt.replace(/[^0-9]/g, "")) || null, lot_size: form.lotSize.trim() || null,
      taxes: Number(form.taxes.replace(/[^0-9.]/g, "")) || null,
      features: form.features.split("\n").map((x) => x.trim()).filter(Boolean),
    };
    const RESERVED = ["properties", "buy", "sell", "communities", "blog", "about", "contact", "privacy", "terms", "admin"];
    if (RESERVED.includes(row.slug)) {
      setBusy(false); setMsg(`Could not save: "${row.slug}" is already a page on the site. Choose a different web address.`); return;
    }
    if (listings.some((l) => l.slug === row.slug && l.id !== form.id)) {
      setBusy(false); setMsg(`Could not save: another listing already uses the web address "${row.slug}".`); return;
    }
    const { error } = form.id ? await sb!.from("listings").update(row).eq("id", form.id) : await sb!.from("listings").insert(row);
    setBusy(false);
    if (error) { setMsg("Could not save: " + error.message); return; }
    setForm(null); setMsg("Saved. The public site updates within a minute."); load();
  }

  async function remove(l: Listing) {
    if (!confirm(`Delete "${l.title}"? This cannot be undone.`)) return;
    const { error } = await sb!.from("listings").delete().eq("id", l.id);
    if (error) setMsg("Could not delete: " + error.message); else load();
  }

  async function removeInquiry(q: Inquiry) {
    if (!confirm(`Delete the enquiry from ${q.name}?`)) return;
    await sb!.from("inquiries").delete().eq("id", q.id);
    load();
  }

  const edit = (l: Listing) =>
    setForm({
      id: l.id, title: l.title, location: l.location, price: String(l.price), status: l.status, category: l.category, beds: String(l.beds),
      baths: String(l.baths), sqft: String(l.sqft), description: l.description, photos: l.photos, featured: l.featured, published: l.published, sort: String(l.sort),
      slug: l.slug, mls: l.mls ?? "", yearBuilt: l.yearBuilt ? String(l.yearBuilt) : "", lotSize: l.lotSize ?? "",
      taxes: l.taxes ? String(l.taxes) : "", features: l.features.join("\n"),
    });

  return (
    <div className="admbox">
      <div className="admtop">
        <h1>Manbir Narang · Admin</h1>
        <div>
          <a href="/" target="_blank" rel="noreferrer">View site</a>
          <button className="alink" onClick={() => sb.auth.signOut()}>Sign out</button>
        </div>
      </div>
      <div className="admtabs">
        <button className={tab === "listings" ? "on" : ""} onClick={() => setTab("listings")}>Listings ({listings.length})</button>
        <button className={tab === "blog" ? "on" : ""} onClick={() => setTab("blog")}>Blog{postCount === null ? "" : ` (${postCount})`}</button>
        <button className={tab === "inquiries" ? "on" : ""} onClick={() => setTab("inquiries")}>Enquiries ({inquiries.length})</button>
      </div>
      {msg && tab !== "blog" ? <p className={msg.startsWith("Saved") ? "aok" : "aerr"}>{msg}</p> : null}

      {tab === "listings" && !form && (
        <>
          <button className="abtn" onClick={() => setForm({ ...empty })}>+ Add listing</button>
          <div className="admlist">
            {listings.length === 0 && <p>No listings yet. Until you add one, the public site shows sample homes.</p>}
            {listings.map((l) => (
              <div className="admrow" key={l.id}>
                <div className="admthumb" style={l.photos[0] ? { backgroundImage: `url("${l.photos[0]}")` } : undefined} />
                <div className="admmain">
                  <b>{l.title}</b>
                  <span>{l.location} · {money(l.price)} · {l.status}{l.published ? "" : " · HIDDEN"}</span>
                </div>
                <div className="admact">
                  <button className="alink" onClick={() => edit(l)}>Edit</button>
                  <button className="alink danger" onClick={() => remove(l)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "listings" && form && (
        <form className="admform" onSubmit={save}>
          <h2>{form.id ? "Edit listing" : "New listing"}</h2>
          <label>Title<input value={form.title} onChange={(e) => set("title", e.target.value)} required placeholder="Sproat Lake Waterfront Estate" /></label>
          <div className="g2a">
            <label>Area<input value={form.location} onChange={(e) => set("location", e.target.value)} required placeholder="Sproat Lake" /></label>
            <label>Price ($)<input value={form.price} onChange={(e) => set("price", e.target.value)} required inputMode="numeric" placeholder="1250000" /></label>
          </div>
          <div className="g3a">
            <label>Category<select value={form.category} onChange={(e) => set("category", e.target.value)}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></label>
            <label>Status<select value={form.status} onChange={(e) => set("status", e.target.value)}>{STATUSES.map((c) => <option key={c}>{c}</option>)}</select></label>
            <label>Display order<input value={form.sort} onChange={(e) => set("sort", e.target.value)} inputMode="numeric" /></label>
          </div>
          <div className="g3a">
            <label>Bedrooms<input value={form.beds} onChange={(e) => set("beds", e.target.value)} inputMode="numeric" /></label>
            <label>Bathrooms<input value={form.baths} onChange={(e) => set("baths", e.target.value)} inputMode="decimal" /></label>
            <label>Square feet<input value={form.sqft} onChange={(e) => set("sqft", e.target.value)} inputMode="numeric" /></label>
          </div>
          <label>Web address<input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder={slugify(form.title) || "2684-12th-avenue"} />
            <small className="admhint">manbirnarang.ca/{slugify(form.slug || form.title) || "…"} (leave blank to use the title)</small></label>
          <div className="g3a">
            <label>MLS® number<input value={form.mls} onChange={(e) => set("mls", e.target.value)} placeholder="1052146" /></label>
            <label>Year built<input value={form.yearBuilt} onChange={(e) => set("yearBuilt", e.target.value)} inputMode="numeric" /></label>
            <label>Annual taxes ($)<input value={form.taxes} onChange={(e) => set("taxes", e.target.value)} inputMode="numeric" /></label>
          </div>
          <label>Lot size<input value={form.lotSize} onChange={(e) => set("lotSize", e.target.value)} placeholder="0.17 acres" /></label>
          <label>Features (one per line)<textarea rows={5} value={form.features} onChange={(e) => set("features", e.target.value)} placeholder={"Double garage\nHeat pump\nCity and mountain views"} /></label>
          <label>Description<textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="A short description. The first two lines show on the card." /></label>
          <label>Photos (the first one is the cover)<input type="file" accept="image/*" multiple onChange={(e) => upload(e.target.files)} /></label>
          <div className="admphotos">
            {form.photos.map((u, i) => (
              <div key={u} className="admph" style={{ backgroundImage: `url("${u}")` }}>
                {i === 0 && <em>Cover</em>}
                <button type="button" onClick={() => set("photos", form.photos.filter((x) => x !== u))} aria-label="Remove photo">×</button>
                {i > 0 && <button type="button" className="mk" onClick={() => set("photos", [u, ...form.photos.filter((x) => x !== u)])}>Make cover</button>}
              </div>
            ))}
          </div>
          <div className="admchk">
            <label><input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} /> Show on the website</label>
            <label><input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} /> Featured badge</label>
          </div>
          <div>
            <button className="abtn" type="submit" disabled={busy}>{busy ? "Working…" : "Save listing"}</button>
            <button className="alink" type="button" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </form>
      )}

      {tab === "blog" && <BlogAdmin sb={sb} onCount={setPostCount} />}

      {tab === "inquiries" && (
        <div className="admlist">
          {inquiries.length === 0 && <p>No enquiries yet.</p>}
          {inquiries.map((q) => (
            <div className="admq" key={q.id}>
              <div className="admqh">
                <b>{q.name}</b>
                <span>{q.kind === "valuation" ? "Home valuation" : "Contact"} · {new Date(q.created_at).toLocaleString("en-CA")}</span>
              </div>
              <div><a href={`mailto:${q.email}`}>{q.email}</a>{q.phone ? <> · <a href={`tel:${q.phone}`}>{q.phone}</a></> : null}</div>
              {q.address ? <div>Property: {q.address}</div> : null}
              {q.interest ? <div>Interested in: {q.interest}</div> : null}
              {q.message ? <p>{q.message}</p> : null}
              <button className="alink danger" onClick={() => removeInquiry(q)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
