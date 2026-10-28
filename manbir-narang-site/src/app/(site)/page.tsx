import Link from "next/link";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Listings from "@/components/Listings";
import Calculator from "@/components/Calculator";
import EnquiryForm from "@/components/EnquiryForm";
import { Btn, SectionHead, Testimonials } from "@/components/ui";
import { getListings } from "@/lib/listings";
import { EMAIL, HOODS, OFFICE, PHONE, STATS5, TESTIMONIALS } from "@/lib/data";
import PostCard from "@/components/PostCard";
import BrokerageListings from "@/components/BrokerageListings";
import { getPosts } from "@/lib/posts";

export const revalidate = 60;

export default async function Home() {
  const listings = await getListings();
  const posts = (await getPosts()).slice(0, 4);
  return (
    <>
      <Hero />

      <section className="iv">
        <div className="w meet">
          <div className="pf">
            <div className="fr">
              <img className="pic" src="/images/manbir.jpg" alt="Manbir Narang" />
            </div>
          </div>
          <div>
            <div className="eyebrow">REALTOR · RE/MAX MID-ISLAND REALTY</div>
            <h2>Manbir Narang</h2>
            <p className="lead">
              I help buyers and sellers across Port Alberni and the Alberni Valley with local knowledge, polished marketing, and honest advice from the first conversation to the final signature.
            </p>
            <div className="cr">
              <div>Phone<span>{PHONE}</span></div>
              <div>Email<span>{EMAIL}</span></div>
              <div>Office<span>{OFFICE}</span></div>
            </div>
            <Btn href="/about" solid>Learn more</Btn>
            <Btn href="/contact">Contact me</Btn>
          </div>
        </div>
      </section>

      <section className="iv wh">
        <div className="w">
          <SectionHead title="Featured listings" sub="Homes, lakefront, and acreage across the Alberni Valley." />
        </div>
        <Listings listings={listings} limit={6} />
        <div className="c" style={{ padding: "64px 0 72px" }}>
          <Btn href="/properties" solid>View all listings</Btn>
        </div>
        <BrokerageListings />
        <div style={{ height: 112 }} />
      </section>

      <section className="iv">
        <div className="w">
          <SectionHead title="Explore Areas" sub="Find the community that suits how you want to live." />
          <div className="hoods3">
            {HOODS.map((h) => (
              <Link href="/communities" className={"hd " + h.cls} key={h.name}>
                <span>{h.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="dk">
        <div className="w">
          <div className="svc2">
            <div className="sb">
              <h2>Full-service representation</h2>
              <p>From valuation to closing, I manage pricing, marketing, showings, and negotiation so your move runs smoothly.</p>
              <Btn href="/sell">Learn more</Btn>
            </div>
            <div className="sb">
              <h2>Local expertise</h2>
              <p>I know the Alberni Valley’s lakes, neighbourhoods, and acreage, and what each is really worth.</p>
              <Btn href="/communities">Learn more</Btn>
            </div>
          </div>
        </div>
      </section>

      <Stats items={STATS5} />

      <section className="iv">
        <div className="w">
          <div className="strips">
            <div className="strip">
              <div><h3>Thinking of selling?</h3><p>Get a free, no-obligation home valuation.</p></div>
              <Btn href="/sell" solid>Get valuation</Btn>
            </div>
            <div className="strip">
              <div><h3>Looking to buy?</h3><p>Tell me what you want and I will start the search.</p></div>
              <Btn href="/buy" solid>Start here</Btn>
            </div>
          </div>
          <div className="ptl">TRUSTED PARTNERS</div>
          <div className="part">
            <div className="pt">MORTGAGE PARTNER</div>
            <div className="pt">LEGAL PARTNER</div>
            <div className="pt">INSPECTION PARTNER</div>
          </div>
        </div>
      </section>

      <section className="dk">
        <div className="w">
          <SectionHead title="Client feedback" sub="Kind words from the families I have worked with." />
          <Testimonials items={TESTIMONIALS} />
        </div>
      </section>

      <section className="iv">
        <div className="w">
          <SectionHead title="Real estate blog" sub="Local advice for buyers and sellers in the Alberni Valley." />
          <div className="g4">
            {posts.map((p) => <PostCard p={p} key={p.id} />)}
          </div>
          <div className="c" style={{ marginTop: 48 }}><Btn href="/blog">View all articles</Btn></div>
        </div>
      </section>

      <Calculator />

      <section className="iv">
        <div className="w">
          <div className="two" style={{ alignItems: "start" }}>
            <div>
              <div className="eyebrow">GET IN TOUCH</div>
              <h2>Let’s talk about your next move.</h2>
              <p className="lead">Send a message and I will reply personally within one business day.</p>
              <div className="cr">
                <div>Phone<span>{PHONE}</span></div>
                <div>Email<span>{EMAIL}</span></div>
                <div>Office<span>{OFFICE}</span></div>
              </div>
            </div>
            <EnquiryForm kind="contact" button="Send message" />
          </div>
        </div>
      </section>
    </>
  );
}
