import type { Metadata } from "next";
import { Btn, Cta, PageHead } from "@/components/ui";
import { HOODS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Communities",
  description: "Port Alberni, Beaver Creek, Cherry Creek and Sproat Lake: find the Alberni Valley community that suits you.",
};

export default function Communities() {
  return (
    <>
      <PageHead title="Communities" sub="Find the neighbourhood that suits how you want to live." />
      <section className="iv">
        <div className="w">
          {HOODS.map((h, i) => (
            <div className={"row" + (i % 2 ? " flip" : "")} key={h.name}>
              <div className="fr">{h.photo ? <img className="im" src={h.photo} alt={h.alt} /> : <div className={"im " + h.cls} />}</div>
              <div>
                <h2>{h.name}</h2>
                <p className="lead">{h.text}</p>
                <div className="cr">
                  <div>Lifestyle<span>{h.life}</span></div>
                </div>
                <Btn href="/properties">{`View homes in ${h.name}`}</Btn>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Cta title="Not sure where to start?" text="Let’s find the community that fits you." button="Contact Manbir" href="/contact" />
    </>
  );
}
