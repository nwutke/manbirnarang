import type { Metadata } from "next";
import Stats from "@/components/Stats";
import { Cta, Orn, PageHead } from "@/components/ui";
import { STATS4 } from "@/lib/data";

export const metadata: Metadata = {
  title: "About Manbir",
  description: "Manbir Narang is a licensed realtor with RE/MAX Mid-Island Realty serving Port Alberni and the Alberni Valley.",
};

export default function About() {
  return (
    <>
      <PageHead title="About Manbir" sub="Local knowledge, polished service, and honest advice." />
      <section className="iv">
        <div className="w ab">
          <div className="pf">
            <div className="fr"><img className="pic" src="/images/manbir.jpg" alt="Manbir Narang" /></div>
          </div>
          <div>
            <h2>A trusted guide to luxury real estate.</h2>
            <p className="lead">
              I’m Manbir Narang, a licensed realtor with RE/MAX Mid-Island Realty. I combine deep local knowledge with polished marketing and clear, honest advice.
            </p>
            <div className="cr">
              <div>Brokerage<span>RE/MAX Mid-Island Realty</span></div>
              <div>Specialty<span>Lakefront, waterfront and acreage</span></div>
              <div>Service area<span>Port Alberni and the Alberni Valley</span></div>
            </div>
          </div>
        </div>
      </section>
      <Stats items={STATS4} />
      <section className="dk q">
        <div className="w narrow">
          <Orn />
          <h2>“From the first showing to the final signature, the experience was flawless.”</h2>
          <span>Client name, Port Alberni</span>
        </div>
      </section>
      <Cta title="Let’s work together." text="Tell me about your plans." button="Get in touch" href="/contact" />
    </>
  );
}
