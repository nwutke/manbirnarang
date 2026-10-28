import type { Metadata } from "next";
import Calculator from "@/components/Calculator";
import { Btn, Cta, PageHead, SectionHead, Steps } from "@/components/ui";

export const metadata: Metadata = {
  title: "Buy a home",
  description: "A clear path to buying a home in Port Alberni and the Alberni Valley, from first search to getting the keys.",
};

export default function Buy() {
  return (
    <>
      <PageHead title="Buy a home" sub="Clear guidance from your first search to the day you get the keys." />
      <section className="iv">
        <div className="w">
          <div className="two">
            <div>
              <h2>A smooth path to your new home.</h2>
              <p className="lead">
                Buying a luxury home takes preparation and strong negotiation. I guide you through each step and handle the details so you can focus on the decision.
              </p>
              <Btn href="/contact" solid>Book a buyer consultation</Btn>
            </div>
            <div className="fr"><div className="im pf5" style={{ height: 440 }} /></div>
          </div>
        </div>
      </section>
      <section className="dk">
        <div className="w">
          <SectionHead title="How buying works" />
          <Steps
            items={[
              ["I", "Consultation", "We talk through your goals, budget, and timeline."],
              ["II", "Pre-approval", "Secure your financing so you can move quickly."],
              ["III", "Search and tour", "Private tours and early access to new listings."],
              ["IV", "Offer and close", "I negotiate for you and manage every deadline."],
            ]}
          />
        </div>
      </section>
      <section className="iv">
        <div className="w">
          <div className="g3 tri">
            <div><h3>First-time buyers</h3><p>Straightforward advice and no pressure.</p></div>
            <div><h3>Luxury buyers</h3><p>Access to the Alberni Valley’s finest homes.</p></div>
            <div><h3>Relocating</h3><p>Alberni Valley knowledge before you arrive.</p></div>
          </div>
        </div>
      </section>
      <Calculator />
      <Cta title="Ready to start your search?" text="Set up a saved search and receive new listings first." button="Start my search" href="/properties" />
    </>
  );
}
