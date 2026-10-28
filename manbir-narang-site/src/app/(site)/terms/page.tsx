import type { Metadata } from "next";
import Link from "next/link";
import LegalDoc from "@/components/LegalDoc";
import { EMAIL, OFFICE, PHONE } from "@/lib/data";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for manbirnarang.ca, the website of Manbir Narang, REALTOR® with RE/MAX Mid-Island Realty.",
  alternates: { canonical: "/terms" },
};

export default function Terms() {
  return (
    <LegalDoc title="Terms of Use" sub="The terms that apply when you use this website.">
      <p>
        These terms apply to your use of manbirnarang.ca (the &ldquo;site&rdquo;), operated by Manbir Narang, a licensed real estate representative with
        RE/MAX Mid-Island Realty in Port Alberni, British Columbia (&ldquo;I&rdquo;, &ldquo;me&rdquo;). By using the site, you agree to these terms. If you do
        not agree, please do not use the site.
      </p>

      <h2>Information only, not advice</h2>
      <p>
        Content on this site, including listings, community information, articles and market commentary, is provided for general information only. It
        is not legal, financial, tax or other professional advice. Please speak with the right professional before making decisions based on it.
      </p>

      <h2>Listing information</h2>
      <p>
        Property listings are provided for your personal, non-commercial use, to help you identify properties you may be interested in buying. Listing
        details, including prices, measurements, taxes, lot sizes and features, are believed to be reliable but are not guaranteed, and should be checked
        independently. All properties are subject to prior sale, price change or withdrawal without notice. Some listing information is sourced from the
        Vancouver Island Real Estate Board (VIREB).
      </p>

      <h2>Mortgage calculator</h2>
      <p>
        The mortgage calculator gives estimates only, based on the numbers you enter. Actual payments, rates and costs depend on your lender and
        circumstances. Speak with a mortgage professional for an accurate quote.
      </p>

      <h2>No agency relationship</h2>
      <p>
        Using this site, or sending me a message through it, does not by itself create a client relationship or an agency relationship. In British
        Columbia, before I provide real estate services to you, I will explain and provide the required disclosure of representation, and any client
        relationship will be set out in writing.
      </p>

      <h2>Trademarks and brokerage</h2>
      <p>
        RE/MAX and its logos are trademarks of RE/MAX, LLC. Each RE/MAX office is independently owned and operated. The trademarks REALTOR®, REALTORS® and
        the REALTOR® logo are controlled by The Canadian Real Estate Association (CREA) and identify real estate professionals who are members of CREA. The
        trademarks MLS®, Multiple Listing Service® and the associated logos are owned by CREA and identify the quality of services provided by real estate
        professionals who are members of CREA.
      </p>

      <h2>Use of content</h2>
      <p>
        The content of this site, including text, photos, design and logos, belongs to me or to the people who have licensed it to me. You may view and
        share links to pages on this site, but you may not copy, republish or use its content for commercial purposes without written permission.
      </p>

      <h2>Acceptable use</h2>
      <p>When using the site, you agree not to:</p>
      <ul>
        <li>submit false, misleading or someone else&rsquo;s information through the forms;</li>
        <li>send spam, or use the forms for advertising or solicitation;</li>
        <li>copy or collect listing data or other content using automated tools; or</li>
        <li>try to gain unauthorized access to the site, its admin area or its systems, or interfere with how the site works.</li>
      </ul>

      <h2>Links to other websites</h2>
      <p>
        The site may link to websites run by others. I am not responsible for their content or privacy practices, and a link does not mean I endorse them.
      </p>

      <h2>Your privacy</h2>
      <p>
        Personal information you send through this site is handled as described in my <Link href="/privacy">Privacy Policy</Link>.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        The site is provided &ldquo;as is&rdquo;. While I work to keep it accurate and available, I do not promise that it will be error-free or
        uninterrupted. To the fullest extent permitted by law, I and RE/MAX Mid-Island Realty are not liable for any loss or damage arising from your use of
        the site or your reliance on its content.
      </p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of British Columbia and the federal laws of Canada that apply there.</p>

      <h2>Changes to these terms</h2>
      <p>I may update these terms from time to time. The date at the top of this page shows when they were last changed.</p>

      <h2>Contact</h2>
      <p className="lcontactline">
        Manbir Narang, REALTOR®<br />
        {OFFICE}, BC<br />
        Phone: <a href={`tel:${PHONE.replace(/\D/g, "")}`}>{PHONE}</a><br />
        Email: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
      </p>
    </LegalDoc>
  );
}
