import type { Metadata } from "next";
import Link from "next/link";
import LegalDoc from "@/components/LegalDoc";
import { EMAIL, OFFICE, PHONE } from "@/lib/data";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Manbir Narang, REALTOR® with RE/MAX Mid-Island Realty, collects, uses and protects personal information shared through this website.",
  alternates: { canonical: "/privacy" },
};

export default function Privacy() {
  return (
    <LegalDoc title="Privacy Policy" sub="How your personal information is collected, used and protected on this website.">
      <p>
        This website is operated by Manbir Narang, a licensed real estate representative with RE/MAX Mid-Island Realty in Port Alberni, British Columbia
        (&ldquo;I&rdquo;, &ldquo;me&rdquo;). I respect your privacy and handle personal information in line with British Columbia&rsquo;s <em>Personal Information
        Protection Act</em> (PIPA) and, where it applies, Canada&rsquo;s <em>Personal Information Protection and Electronic Documents Act</em> (PIPEDA). This policy
        explains what I collect through manbirnarang.ca, why, and the choices you have.
      </p>

      <h2>What I collect</h2>
      <p>I only collect personal information that you choose to send me. This happens when you use one of the forms on this site:</p>
      <ul>
        <li><b>Contact and listing enquiry forms:</b> your name, email address, and, if you provide them, your phone number, what you are interested in (buying, selling or something else), your message, and the property you are asking about.</li>
        <li><b>Home valuation form:</b> your name, email address, optional phone number, and the address of the property you would like valued.</li>
      </ul>
      <p>
        You can browse the site without giving me any personal information. The mortgage calculator works entirely in your browser; the numbers you enter
        are not sent to me or stored.
      </p>

      <h2>Information collected automatically</h2>
      <p>
        This site does not use advertising trackers, analytics cookies or social media pixels. Like most websites, the hosting provider automatically
        records basic technical information when pages are loaded, such as your IP address, browser type and the pages requested, to keep the site running
        securely and to diagnose problems. I do not use this information to identify you.
      </p>
      <p>
        The map on the <Link href="/contact">Contact</Link> page is provided by OpenStreetMap. When that page loads, your browser connects to OpenStreetMap&rsquo;s
        servers, which receive your IP address. Their use of that information is covered by the{" "}
        <a href="https://osmfoundation.org/wiki/Privacy_Policy" target="_blank" rel="noreferrer">OpenStreetMap Foundation privacy policy</a>.
      </p>

      <h2>How I use your information</h2>
      <ul>
        <li>To reply to your enquiry and answer your questions.</li>
        <li>To prepare a home valuation you have asked for.</li>
        <li>To arrange showings and provide the real estate services you request.</li>
        <li>To keep records as required by real estate regulations in British Columbia.</li>
      </ul>
      <p>
        I will not add you to a mailing list or send you newsletters or promotional emails unless you have agreed to receive them, as required by
        Canada&rsquo;s Anti-Spam Legislation (CASL). You can ask me to stop contacting you at any time.
      </p>

      <h2>When information is shared</h2>
      <p>I do not sell, rent or trade your personal information. I share it only when needed:</p>
      <ul>
        <li><b>My brokerage:</b> as a licensee, I work under RE/MAX Mid-Island Realty, which may access records of my client dealings as required by its regulatory obligations.</li>
        <li><b>To provide services you ask for:</b> for example, with a listing brokerage to book a showing, or with a lender, lawyer, notary or inspector, but only with your knowledge and consent.</li>
        <li><b>Service providers:</b> companies that host this website and store form submissions on my behalf. They may only use the information to provide that service.</li>
        <li><b>When required by law:</b> for example, to comply with the British Columbia Financial Services Authority, a court order, or other legal obligations.</li>
      </ul>

      <h2>Where your information is stored</h2>
      <p>
        Form submissions are stored securely with Supabase, and this website is hosted by Vercel. These providers may store or process information on
        servers in Canada or the United States. Information stored outside Canada may be subject to the laws of that country.
      </p>

      <h2>How long I keep it</h2>
      <p>
        I keep enquiries only as long as needed to respond to you and provide any services that follow. If you become a client, records of our dealings
        are kept for the period required by British Columbia real estate regulations. After that, information is securely deleted.
      </p>

      <h2>How I protect it</h2>
      <p>
        Form submissions are sent over an encrypted (HTTPS) connection and stored in a database that only I can access with a password-protected account.
        No method of storage or transmission is completely secure, but I take reasonable steps to protect your information from loss, misuse and
        unauthorized access.
      </p>

      <h2>Your choices and rights</h2>
      <p>
        You can ask to see the personal information I hold about you, ask me to correct it, or withdraw your consent and ask me to delete it, subject to any
        records I am legally required to keep. To make a request, contact me using the details below. I will respond within 30 days.
      </p>
      <p>
        If you are not satisfied with how I handle your request, you can contact the{" "}
        <a href="https://www.oipc.bc.ca" target="_blank" rel="noreferrer">Office of the Information and Privacy Commissioner for British Columbia</a>.
      </p>

      <h2>Children</h2>
      <p>This website is meant for adults. I do not knowingly collect personal information from anyone under 19.</p>

      <h2>Changes to this policy</h2>
      <p>I may update this policy from time to time. The date at the top of this page shows when it was last changed.</p>

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
