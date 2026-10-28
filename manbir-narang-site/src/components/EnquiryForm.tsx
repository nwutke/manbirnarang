"use client";

import { useState } from "react";
import { getSupabase } from "@/lib/supabase";

type Kind = "contact" | "valuation";

export default function EnquiryForm({ kind, button }: { kind: Kind; button: string }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error" | "offline">("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (f.get("website")) return; // honeypot
    const sb = getSupabase();
    if (!sb) {
      setState("offline");
      return;
    }
    setState("sending");
    const { error } = await sb.from("inquiries").insert({
      kind,
      name: String(f.get("name") || ""),
      email: String(f.get("email") || ""),
      phone: String(f.get("phone") || "") || null,
      address: String(f.get("address") || "") || null,
      interest: String(f.get("interest") || "") || null,
      message: String(f.get("message") || "") || null,
    });
    if (error) setState("error");
    else {
      setState("sent");
      e.currentTarget.reset();
    }
  }

  if (state === "sent") {
    return (
      <div className="fok">
        <h3>Thank you.</h3>
        <p>Your message is in. I will reply personally within one business day.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="fform">
      {kind === "valuation" ? <input className="fi" name="address" placeholder="Property address" required autoComplete="street-address" /> : null}
      <input className="fi" name="name" placeholder="Full name" required autoComplete="name" />
      <input className="fi" name="email" type="email" placeholder="Email" required autoComplete="email" />
      <input className="fi" name="phone" type="tel" placeholder="Phone (optional)" autoComplete="tel" />
      {kind === "contact" ? (
        <>
          <select className="fi" name="interest" defaultValue="">
            <option value="" disabled>I am interested in…</option>
            <option>Buying</option>
            <option>Selling</option>
            <option>Something else</option>
          </select>
          <textarea className="fi" name="message" rows={4} placeholder="Message" />
        </>
      ) : null}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hp" />
      <button className="btn" type="submit" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : button}
      </button>
      {state === "error" ? <p className="ferr">Something went wrong sending that. Please try again, or call me directly.</p> : null}
      {state === "offline" ? <p className="ferr">The form is not connected to the database yet. Add your Supabase keys to turn it on.</p> : null}
    </form>
  );
}
