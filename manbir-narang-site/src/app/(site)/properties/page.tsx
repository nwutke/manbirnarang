import type { Metadata } from "next";
import Link from "next/link";
import BrokerageListings from "@/components/BrokerageListings";
import PropertySearch from "@/components/PropertySearch";
import { Cta, PageHead } from "@/components/ui";
import { getListings } from "@/lib/listings";
import { getBrokerageListings } from "@/lib/brokerage";

export const metadata: Metadata = {
  title: "Properties",
  description: "Homes, acreage and commercial properties for sale in Port Alberni and the Alberni Valley, from Manbir Narang and RE/MAX Mid-Island Realty.",
};
export const revalidate = 60;

export default async function Properties() {
  const own = await getListings();
  const brokerage = getBrokerageListings(own);
  return (
    <>
      <PageHead title="Properties" sub="Homes for sale across Port Alberni and the Alberni Valley, with my listings first." />
      <section className="iv wh" style={{ paddingTop: 64, paddingBottom: 112 }}>
        <PropertySearch listings={[...own, ...brokerage]} />
        {brokerage.length === 0 ? (
          <>
            <div style={{ height: 80 }} />
            <BrokerageListings />
          </>
        ) : null}
        <div className="w wide rcmore">
          <div className="strip">
            <p>
              Found a listing on Realtor.ca that you like?{" "}
              <Link href="/contact" className="rcin">Contact Manbir</Link>
            </p>
            <a className="btn" href="https://www.realtor.ca" target="_blank" rel="noopener noreferrer">
              View more listings on REALTOR.CA
            </a>
          </div>
        </div>
      </section>
      <Cta title="Can’t find what you’re looking for?" text="Tell me what you want and I will watch the market for you." button="Contact Manbir" href="/contact" />
    </>
  );
}
