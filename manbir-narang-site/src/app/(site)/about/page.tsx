import type { Metadata } from "next";
import { Cta, PageHead } from "@/components/ui";

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
      <Cta title="Let’s work together." text="Tell me about your plans." button="Get in touch" href="/contact" />
    </>
  );
}
