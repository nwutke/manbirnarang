"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Shares a listing. Phones and tablets get the device share sheet (Messages, WhatsApp, Facebook...).
 * Computers copy the link and show "Link copied".
 */
export default function ShareButton({ path, title, text, variant = "icon" }: { path: string; title: string; text?: string; variant?: "icon" | "full" }) {
  const [note, setNote] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const flash = (msg: string) => {
    setNote(msg);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setNote(""), 2200);
  };

  async function share(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const url = new URL(path, window.location.origin).toString();
    const touch = window.matchMedia("(pointer: coarse)").matches;
    if (touch && typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (err) {
        if ((err as Error).name === "AbortError") return; // closed the share sheet
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      flash("Link copied");
    } catch {
      window.prompt("Copy this link to share it:", url);
    }
  }

  return (
    <span className="shw">
      <button type="button" className={variant === "full" ? "btn o shfull" : "shbtn"} onClick={share} aria-label={`Share ${title}`}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="M8.2 10.8l7.6-4.6M8.2 13.2l7.6 4.6" />
        </svg>
        <span>Share</span>
      </button>
      <span className={"shnote" + (note ? " on" : "")} role="status" aria-live="polite">{note}</span>
    </span>
  );
}
