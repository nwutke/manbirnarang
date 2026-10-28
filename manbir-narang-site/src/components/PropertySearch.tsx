"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "./Listings";
import { CATEGORIES, type Listing } from "@/lib/types";

const PER_PAGE = 12;
const PRICES = [100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000, 900000, 1000000, 1250000, 1500000, 2000000, 2500000];
const short = (n: number) => (n >= 1000000 ? `$${(n / 1000000).toString().replace(/\.0+$/, "")}M` : `$${n / 1000}K`);

/** "South Alberni, Port Alberni" -> "Port Alberni" */
const areaOf = (l: Listing) => {
  const parts = l.location.split(",").map((s) => s.trim()).filter(Boolean);
  return parts[parts.length - 1] || l.location;
};
const daysAgo = (d?: string | null) => {
  if (!d) return Infinity;
  const [y, m, day] = d.split("-").map(Number);
  return (Date.now() - Date.UTC(y, m - 1, day)) / 86400000;
};

type Filters = { areas: string[]; type: string; min: number; max: number; beds: number; baths: number; isNew: boolean };
const EMPTY: Filters = { areas: [], type: "", min: 0, max: 0, beds: 0, baths: 0, isNew: false };

export default function PropertySearch({ listings }: { listings: Listing[] }) {
  const [f, setF] = useState<Filters>(EMPTY);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const top = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  const areas = useMemo(() => {
    const m = new Map<string, number>();
    listings.forEach((l) => m.set(areaOf(l), (m.get(areaOf(l)) ?? 0) + 1));
    return [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [listings]);
  const types = useMemo(() => CATEGORIES.filter((c) => listings.some((l) => l.category === c)), [listings]);
  const hasDates = useMemo(() => listings.some((l) => l.listedOn), [listings]);

  const results = useMemo(
    () =>
      listings.filter(
        (l) =>
          (f.areas.length === 0 || f.areas.includes(areaOf(l))) &&
          (!f.type || l.category === f.type) &&
          (!f.min || l.price >= f.min) &&
          (!f.max || l.price <= f.max) &&
          (!f.beds || l.beds >= f.beds) &&
          (!f.baths || l.baths >= f.baths) &&
          (!f.isNew || daysAgo(l.listedOn) <= 10)
      ),
    [listings, f]
  );

  const pages = Math.max(1, Math.ceil(results.length / PER_PAGE));
  const cur = Math.min(page, pages);
  const shown = results.slice((cur - 1) * PER_PAGE, cur * PER_PAGE);
  const active = JSON.stringify(f) !== JSON.stringify(EMPTY);

  const update = (patch: Partial<Filters>) => { setF((x) => ({ ...x, ...patch })); setPage(1); };
  const toggleArea = (a: string) => update({ areas: f.areas.includes(a) ? f.areas.filter((x) => x !== a) : [...f.areas, a] });

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [cur]);

  const pageList = (() => {
    const out: (number | "…")[] = [];
    for (let i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || Math.abs(i - cur) <= 1) out.push(i);
      else if (out[out.length - 1] !== "…") out.push("…");
    }
    return out;
  })();

  const sel = (label: string, value: number, onChange: (v: number) => void, opts: [number, string][]) => (
    <label className="psf">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(Number(e.target.value))}>
        {opts.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
      </select>
    </label>
  );

  return (
    <div className="w psw" ref={top}>
      <button type="button" className="psopen" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {open ? "Hide filters" : "Filter properties"}{active ? " ·  on" : ""}
      </button>

      <aside className={"pside" + (open ? " open" : "")} aria-label="Refine properties">
        <h2>Refine</h2>

        {areas.length > 1 ? (
          <fieldset className="psf">
            <legend>Areas</legend>
            {areas.map(([a, n]) => (
              <label key={a} className="pscheck">
                <input type="checkbox" checked={f.areas.includes(a)} onChange={() => toggleArea(a)} />
                <span>{a}</span><em>{n}</em>
              </label>
            ))}
          </fieldset>
        ) : null}

        {types.length > 1 ? (
          <label className="psf">
            <span>Property type</span>
            <select value={f.type} onChange={(e) => update({ type: e.target.value })}>
              <option value="">All types</option>
              {types.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
        ) : null}

        <div className="ps2">
          {sel("Min price", f.min, (v) => update({ min: v }), [[0, "No min"], ...PRICES.map((p): [number, string] => [p, short(p)])])}
          {sel("Max price", f.max, (v) => update({ max: v }), [[0, "No max"], ...PRICES.map((p): [number, string] => [p, short(p)])])}
        </div>
        <div className="ps2">
          {sel("Bedrooms", f.beds, (v) => update({ beds: v }), [[0, "Any"], [1, "1+"], [2, "2+"], [3, "3+"], [4, "4+"], [5, "5+"]])}
          {sel("Bathrooms", f.baths, (v) => update({ baths: v }), [[0, "Any"], [1, "1+"], [2, "2+"], [3, "3+"], [4, "4+"]])}
        </div>

        {hasDates ? (
          <label className="pscheck psnew">
            <input type="checkbox" checked={f.isNew} onChange={(e) => update({ isNew: e.target.checked })} />
            <span>New (last 10 days)</span>
          </label>
        ) : null}

        <button type="button" className="psreset" onClick={() => { setF(EMPTY); setPage(1); }} disabled={!active}>Reset filters</button>
      </aside>

      <div className="pres">
        <div className="phead">
          <h2>{results.length.toLocaleString("en-CA")} {results.length === 1 ? "Property" : "Properties"}</h2>
          {results.length > 0 ? <span>Page {cur} of {pages}</span> : null}
        </div>

        {shown.length === 0 ? (
          <div className="pnone">
            <p>No properties match those filters.</p>
            <button type="button" className="btn o" onClick={() => { setF(EMPTY); setPage(1); }}>Reset filters</button>
          </div>
        ) : (
          <div className="pgrid">{shown.map((l) => <Card l={l} key={l.id} />)}</div>
        )}

        {pages > 1 ? (
          <nav className="pnav" aria-label="Pages">
            <button type="button" onClick={() => setPage(cur - 1)} disabled={cur === 1} aria-label="Previous page">‹</button>
            {pageList.map((p, i) =>
              p === "…" ? <span key={"e" + i}>…</span> : (
                <button type="button" key={p} className={p === cur ? "on" : ""} onClick={() => setPage(p)} aria-current={p === cur ? "page" : undefined}>{p}</button>
              )
            )}
            <button type="button" onClick={() => setPage(cur + 1)} disabled={cur === pages} aria-label="Next page">›</button>
          </nav>
        ) : null}

        <p className="pfine">
          Listings by Manbir Narang appear first. Other listings are courtesy of the agents named, RE/MAX Mid-Island Realty. Information deemed reliable but not guaranteed.
        </p>
      </div>
    </div>
  );
}
