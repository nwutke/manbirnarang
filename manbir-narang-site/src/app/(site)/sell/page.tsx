import type { Metadata } from "next";
import EnquiryForm from "@/components/EnquiryForm";
import Stats from "@/components/Stats";
import { Cta, PageHead, SectionHead, Steps } from "@/components/ui";
import { STATS_SELL } from "@/lib/data";

export const metadata: Metadata = {
  title: "Sell your home",
  description: "Request a free home valuation in Port Alberni and the Alberni Valley, with premium marketing and expert pricing.",
};

export default function Sell() {
  return (
    <>
      <PageHead title="Sell your home" sub="Premium marketing and expert pricing to achieve your best result." />
      <section className="iv">
        <div className="w">
          <div className="two">
            <div>
              <h2>What is your home worth?</h2>
              <p className="lead">Get a free, no-obligation valuation based on recent local sales.</p>
              <EnquiryForm kind="valuation" button="Request my valuation" />
            </div>
            <div className="fr"><div className="im pf6" style={{ height: 500 }} /></div>
          </div>
        </div>
      </section>
      <section className="dk">
        <div className="w">
          <SectionHead title="How I sell your home" />
          <Steps
            items={[
              ["I", "Valuation", "Accurate pricing based on the current market."],
              ["II", "Preparation", "Staging advice and professional photography."],
              ["III", "Marketing", "Online, print, and my network of qualified buyers."],
              ["IV", "Close", "Negotiation and support through completion."],
            ]}
          />
        </div>
      </section>
      <Stats items={STATS_SELL} />
      <Cta title="Let’s talk about selling." text="Book a free consultation to plan your sale." button="Contact Manbir" href="/contact" />
    </>
  );
}
