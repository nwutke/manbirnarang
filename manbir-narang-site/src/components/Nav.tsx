"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { EMAIL, PHONE } from "@/lib/data";

const NAV = [
  ["/", "Home"],
  ["/properties", "Properties"],
  ["/buy", "Buy"],
  ["/sell", "Sell"],
  ["/communities", "Communities"],
  ["/about", "About"],
  ["/contact", "Contact"],
] as const;

export default function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);

  return (
    <>
      <div className="prog" />
      <Link href="/sell" className="fab">Free home valuation</Link>
      <div className="top">
        <a href={`tel:${PHONE.replace(/\D/g, "")}`}>{PHONE}</a>
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
      </div>
      <div className="nav">
        <Link href="/" className="lw lw2" aria-label="Manbir Narang, home">
          <img src="/logo.webp" alt="Manbir Narang, Realtor" />
        </Link>
        <div className={"links" + (open ? " open" : "")}>
          {NAV.map(([href, label]) => (
            <Link key={href} href={href} className={path === href ? "on" : undefined}>
              {label}
            </Link>
          ))}
        </div>
        <button type="button" className="menu" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          ☰
        </button>
      </div>
    </>
  );
}
