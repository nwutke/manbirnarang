import Link from "next/link";
import { EMAIL, PHONE } from "@/lib/data";

export default function Footer() {
  return (
    <footer>
      <div className="w">
        <div>
          <div className="lw lw3">
            <img src="/logo.webp" alt="Manbir Narang" />
          </div>
          <p style={{ marginTop: 14 }}>
            Manbir Narang, Realtor<br />RE/MAX Mid-Island Realty<br />Port Alberni, BC
          </p>
        </div>
        <div>
          <b>Properties</b>
          <p>
            <Link href="/properties">All listings</Link>
            <Link href="/buy">Buy</Link>
            <Link href="/sell">Home valuation</Link>
          </p>
        </div>
        <div>
          <b>Explore</b>
          <p>
            <Link href="/communities">Communities</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </p>
        </div>
        <div>
          <b>Contact</b>
          <p>
            {PHONE}<br />{EMAIL}
          </p>
        </div>
      </div>
      <div className="w legal">
        <span>© {new Date().getFullYear()} Manbir Narang · RE/MAX Mid-Island Realty</span>
        <span>Privacy policy &nbsp;·&nbsp; Terms of use</span>
      </div>
    </footer>
  );
}
