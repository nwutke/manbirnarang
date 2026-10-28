"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ShareButton from "./ShareButton";
import { CATEGORIES, money, type Listing } from "@/lib/types";

const I = {
  bed: <path d="M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7M3 15h18M7 9V6h10v3" />,
  bath: <path d="M4 12h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-2zM6 12V6a2 2 0 0 1 4 0M7 19l-1 2M17 19l1 2" />,
  area: (<><path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4" /><rect x="8" y="8" width="8" height="8" /></>),
  pin: <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />,
  cam: <path d="M4 7h3l2-3h6l2 3h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1zm8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />,
};

function Icon({ d, fill }: { d: React.ReactNode; fill?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill={fill ? "currentColor" : "none"} stroke={fill ? "none" : "currentColor"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {d}
    </svg>
  );
}

function Card({ l }: { l: Listing }) {
  const sold = l.status === "Sold";
  const cover = l.photos[0];
  const bg = cover ? { background: `url("${cover}") 50% 50%/cover no-repeat` } : undefined;
  return (
    <article className="lc lcl">
      <Link href={`/${l.slug}`} className="lcover" aria-label={`${l.title}, ${money(l.price)}`} />
      <div className="ph2 f1" style={bg}>
        <div className="bd">
          {l.featured ? <span className="pill">Featured</span> : <span />}
          <div className="bd2">
            <span className={"pill" + (sold ? " sold" : "")}>{sold ? "Sold" : "For Sale"}</span>
            {!sold && l.status && l.status !== "For sale" ? <span className="pill">{l.status}</span> : null}
          </div>
        </div>
        <div className="pl">
          <span><Icon d={I.pin} fill />{l.location}</span>
          <span><Icon d={I.cam} fill />{l.photoCount ?? l.photos.length}</span>
        </div>
      </div>
      <h3 className="lt">{l.title}</h3>
      <div className="lpr">{money(l.price)}</div>
      <p className="ld">{l.description}</p>
      <div className="lspec">
        {l.beds > 0 ? <span><Icon d={I.bed} />{l.beds}</span> : null}
        {l.baths > 0 ? <span><Icon d={I.bath} />{l.baths}</span> : null}
        {l.sqft > 0 ? <span><Icon d={I.area} />{l.sqft.toLocaleString("en-CA")} ft²</span> : null}
      </div>
      <div className="lag">
        {l.listedBy ? <div className="who whob">Listed by {l.listedBy}</div> : <div className="who"><i className="av" />Manbir Narang</div>}
        <ShareButton path={`/${l.slug}`} title={l.title} text={`${l.title}, ${money(l.price)}. ${l.location}`} />
      </div>
    </article>
  );
}

export default function Listings({ listings, limit }: { listings: Listing[]; limit?: number }) {
  const [f, setF] = useState("all");
  const cats = useMemo(() => CATEGORIES.filter((c) => listings.some((l) => l.category === c)), [listings]);
  const soldCount = listings.filter((l) => l.status === "Sold").length;
  const shown = useMemo(() => {
    const base = listings.filter((l) => f === "all" || (f === "Sold" ? l.status === "Sold" : l.category === f));
    return limit ? base.slice(0, limit) : base;
  }, [listings, f, limit]);

  const chip = (key: string, label: string) => (
    <button type="button" key={key} className={"chip" + (f === key ? " on" : "")} onClick={() => setF(key)}>
      {label}
    </button>
  );

  return (
    <>
      <div className="w">
        <div className="chips flt">
          {chip("all", `All (${listings.length})`)}
          {cats.map((c) => chip(c, `${c} (${listings.filter((l) => l.category === c).length})`))}
          {soldCount > 0 ? chip("Sold", `Sold (${soldCount})`) : null}
        </div>
      </div>
      <div className="w wide">
        <div className="lg2">
          {shown.map((l) => (
            <Card l={l} key={l.id} />
          ))}
        </div>
        {shown.length === 0 ? <p className="c" style={{ padding: "40px 0" }}>No listings in this category right now.</p> : null}
      </div>
    </>
  );
}
