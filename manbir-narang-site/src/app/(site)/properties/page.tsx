import type { Metadata } from "next";
import BrokerageListings from "@/components/BrokerageListings";
import Listings from "@/components/Listings";
import { Cta, PageHead } from "@/components/ui";
import { getListings } from "@/lib/listings";

export const metadata: Metadata = {
  title: "Properties",
  description: "Lakefront, waterfront, acreage and estate homes for sale in Port Alberni and the Alberni Valley.",
};
export const revalidate = 60;

export default async function Properties() {
  const listings = await getListings();
  return (
    <>
      <PageHead title="Properties" sub="Luxury homes, waterfront estates, and condominiums across Port Alberni and the Alberni Valley." />
      <section className="iv wh" style={{ paddingTop: 64 }}>
        <Listings listings={listings} />
        <div style={{ height: 96 }} />
        <BrokerageListings />
        <div style={{ height: 112 }} />
      </section>
      <Cta title="Can’t find what you’re looking for?" text="Tell me what you want and I will watch the market for you." button="Contact Manbir" href="/contact" />
    </>
  );
}
