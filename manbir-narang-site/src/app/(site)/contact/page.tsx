import type { Metadata } from "next";
import EnquiryForm from "@/components/EnquiryForm";
import { PageHead } from "@/components/ui";
import { EMAIL, OFFICE, PHONE } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Manbir Narang, Port Alberni realtor with RE/MAX Mid-Island Realty.",
};

export default function Contact() {
  return (
    <>
      <PageHead title="Contact" sub="Questions about buying, selling, or the market? I would love to hear from you." />
      <section className="iv">
        <div className="w">
          <div className="two" style={{ alignItems: "start" }}>
            <EnquiryForm kind="contact" button="Send message" />
            <div>
              <div className="fr">
                <iframe
                  className="map"
                  title="Map of Port Alberni"
                  loading="lazy"
                  style={{ width: "100%", border: 0, display: "block" }}
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-124.90%2C49.20%2C-124.74%2C49.29&layer=mapnik"
                />
              </div>
              <div className="cr" style={{ marginTop: 32 }}>
                <div>Office<span>{OFFICE}</span></div>
                <div>Phone<span>{PHONE}</span></div>
                <div>Email<span>{EMAIL}</span></div>
                <div>Hours<span>Mon to Sat, 9 am to 6 pm</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
