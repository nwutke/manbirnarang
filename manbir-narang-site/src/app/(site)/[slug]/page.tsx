import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import EnquiryForm from "@/components/EnquiryForm";
import Gallery, { GalleryButton } from "@/components/Gallery";
import ShareButton from "@/components/ShareButton";
import { Orn } from "@/components/ui";
import { EMAIL, OFFICE, PHONE } from "@/lib/data";
import { getListingBySlug, getListings } from "@/lib/listings";
import { getBrokerageListings } from "@/lib/brokerage";
import { money, type Listing } from "@/lib/types";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const listings = await getListings();
  return [...listings, ...getBrokerageListings(listings)].map((l) => ({ slug: l.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const l = await getListingBySlug((await params).slug);
  if (!l) return { title: "Listing not found" };
  const summary = [money(l.price), specLine(l), l.location].filter(Boolean).join(" · ");
  return {
    title: `${l.title} | ${money(l.price)}`,
    description: `${summary}. ${l.description}`.slice(0, 300),
    alternates: { canonical: `/${l.slug}` },
    openGraph: { title: l.title, description: summary, images: l.photos[0] ? [l.photos[0]] : undefined },
  };
}

function specLine(l: Listing) {
  return [
    l.beds > 0 ? `${l.beds} bed` : "",
    l.baths > 0 ? `${l.baths} bath` : "",
    l.sqft > 0 ? `${l.sqft.toLocaleString("en-CA")} sq ft` : "",
  ].filter(Boolean).join(" · ");
}

export default async function ListingPage({ params }: Props) {
  const l = await getListingBySlug((await params).slug);
  if (!l) notFound();

  const sold = l.status === "Sold";
  const cover = l.photos[0];
  const tel = `tel:${PHONE.replace(/\D/g, "")}`;
  const facts: [string, string][] = (
    [
      ["Price", money(l.price)],
      ["Status", sold ? "Sold" : l.status === "For sale" ? "For sale" : `For sale · ${l.status}`],
      ["Property type", l.category],
      ["Area", l.location],
      ["Bedrooms", l.beds > 0 ? String(l.beds) : ""],
      ["Bathrooms", l.baths > 0 ? String(l.baths) : ""],
      ["Interior", l.sqft > 0 ? `${l.sqft.toLocaleString("en-CA")} sq ft` : ""],
      ["Lot size", l.lotSize ?? ""],
      ["Year built", l.yearBuilt ? String(l.yearBuilt) : ""],
      ["Annual taxes", l.taxes ? money(l.taxes) : ""],
      ["MLS® number", l.mls ?? ""],
      ["Listed by", l.listedBy ? `${l.listedBy}, RE/MAX Mid-Island Realty` : ""],
    ] as [string, string][]
  ).filter(([, v]) => v);
  const paragraphs = l.description.split(/\n{2,}|\n/).map((p) => p.trim()).filter(Boolean);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: l.title,
    description: l.description,
    image: l.photos.slice(0, 5),
    offers: { "@type": "Offer", price: l.price, priceCurrency: "CAD", availability: sold ? "https://schema.org/SoldOut" : "https://schema.org/InStock" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="lhero" style={cover ? { backgroundImage: `url("${cover}")` } : undefined}>
        <div className="lhin">
          <Link href="/properties" className="lback">‹ All properties</Link>
          <div className="lhpills">
            <span className={"pill" + (sold ? " sold" : "")}>{sold ? "Sold" : "For Sale"}</span>
            {!sold && l.status && l.status !== "For sale" ? <span className="pill">{l.status}</span> : null}
            <span className="pill">{l.category}</span>
          </div>
          <h1>{l.title}</h1>
          <p className="lhloc">{l.location}</p>
          <div className="lhprice">{money(l.price)}</div>
          {specLine(l) ? <p className="lhspec">{specLine(l)}</p> : null}
          {l.listedBy ? <p className="lhcourtesy">Listing courtesy of {l.listedBy}, RE/MAX Mid-Island Realty</p> : null}
          <div className="lhbtns">
            <a href="#contact" className="btn">Contact Manbir</a>
            {l.photos.length > 1 ? <GalleryButton count={l.photos.length} /> : null}
          </div>
        </div>
      </section>

      <section className="iv lbody">
        <div className="w lgrid">
          <div className="lmain">
            <h2>About this property</h2>
            <div className="ldesc">
              {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>

            <h2>Property details</h2>
            <dl className="lfacts">
              {facts.map(([k, v]) => (
                <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
              ))}
            </dl>

            {l.features.length > 0 ? (
              <>
                <h2>Features</h2>
                <ul className="lfeat">
                  {l.features.map((f) => <li key={f}>{f}</li>)}
                </ul>
              </>
            ) : null}

            {l.photos.length > 0 ? (
              <>
                <h2 id="photos">Photos <span className="lcount">{l.photos.length}</span></h2>
                <Gallery photos={l.photos} title={l.title} />
              </>
            ) : null}
          </div>

          <aside className="lside">
            <div className="lcard">
              <div className="lcprice">{money(l.price)}</div>
              {specLine(l) ? <p className="lcspec">{specLine(l)}</p> : null}
              <div className="lagent">
                <img src="/images/manbir.jpg" alt="" />
                <div>
                  <b>Manbir Narang</b>
                  <span>REALTOR® · {OFFICE.split(",")[0]}</span>
                </div>
              </div>
              <a href="#contact" className="btn">Contact Manbir</a>
              <a href={tel} className="btn o">Call {PHONE}</a>
              <ShareButton path={`/${l.slug}`} title={l.title} text={`${l.title}, ${money(l.price)}. ${l.location}`} variant="full" />
              <a href={`mailto:${EMAIL}?subject=${encodeURIComponent(l.title)}`} className="lmail">{EMAIL}</a>
            </div>
          </aside>
        </div>
      </section>

      <section className="lcontact" id="contact">
        <div className="w">
          <Orn />
          <h2>Interested in {l.title}?</h2>
          <p>Ask a question or book a showing. I will reply personally within one business day.</p>
          <div className="lform">
            <EnquiryForm kind="contact" button="Send to Manbir" listing={l.title} />
          </div>
          <p className="lalt">Prefer to talk? Call <a href={tel}>{PHONE}</a></p>
        </div>
      </section>

      {/* Mobile: contact bar fixed to the bottom of the screen */}
      <div className="lbar">
        <a href={tel} className="btn o">Call</a>
        <a href="#contact" className="btn">Contact Manbir</a>
      </div>
    </>
  );
}
